import os
import io
import gc
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# Restrict PyTorch CPU threads to prevent memory spikes & OOM kills on Render 512MB RAM
torch.set_num_threads(1)
try:
    torch.set_num_interop_threads(1)
except Exception:
    pass

app = Flask(__name__)
CORS(app)

# Resolve path to model weights file reliably regardless of working directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pth')

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

# Load model weights on CPU (render free tier uses CPU)
checkpoint = torch.load(MODEL_PATH, map_location='cpu')
CATEGORIES = checkpoint['classes']

model = models.mobilenet_v2(weights=None)
model.classifier[1] = nn.Linear(model.last_channel, len(CATEGORIES))
model.load_state_dict(checkpoint['model_state'])
model.eval()

# Force garbage collection after weight loading
del checkpoint
gc.collect()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'JanSahayak ML Service',
        'model_loaded': True,
        'categories': CATEGORIES
    }), 200

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'status': 'ok',
        'service': 'JanSahayak ML Service',
        'predict_endpoint': '/predict',
        'health_endpoint': '/health'
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    if not file or file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        # Downscale large images to reduce memory footprint on Render 512MB limit
        if max(img.size) > 512:
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
    except Exception as e:
        return jsonify({'error': f'Invalid image file: {str(e)}'}), 400

    try:
        tensor = transform(img).unsqueeze(0)
        del img
        del img_bytes

        with torch.no_grad():
            outputs = model(tensor)
            probs = torch.softmax(outputs, dim=1)[0]

        del tensor

        category = CATEGORIES[probs.argmax().item()]
        confidence = round(probs.max().item() * 100, 2)
        scores = {c: round(p.item() * 100, 2) for c, p in zip(CATEGORIES, probs)}

        del probs
        gc.collect()

        return jsonify({
            'category': category,
            'confidence': confidence,
            'all_scores': scores
        })
    except Exception as e:
        gc.collect()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)