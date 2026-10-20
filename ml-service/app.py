import os
import io
import gc
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
from flask import Flask, request, jsonify, render_template_string
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

HTML_TEST_PAGE = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JanSahayak AI Vision Classifier</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
  <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight">JanSahayak AI Vision Classifier</h1>
        <p class="text-xs text-slate-400 font-mono mt-0.5">MobileNetV2 Deep Learning Model &bull; CPU Inference</p>
      </div>
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
        Online
      </span>
    </div>

    <div class="mb-4">
      <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Upload Test Image</label>
      <input type="file" id="imageInput" accept="image/*" class="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-slate-800/60 rounded-lg p-2 border border-slate-700/60">
    </div>

    <div id="previewContainer" class="hidden mb-4">
      <img id="imagePreview" class="max-h-56 mx-auto rounded-lg border border-slate-700 object-cover" alt="Preview">
    </div>

    <button id="classifyBtn" disabled class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
      <span>Classify Image</span>
    </button>

    <div id="resultBox" class="hidden mt-6 pt-5 border-t border-slate-800">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Detected Category</span>
        <span id="resConfidence" class="text-xs font-mono font-bold text-blue-400"></span>
      </div>
      <div id="resCategory" class="text-xl font-extrabold text-white mb-4 uppercase tracking-wide"></div>

      <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Score Breakdown</div>
      <div id="scoresList" class="space-y-1.5 font-mono text-xs"></div>
    </div>
  </div>

  <div class="mt-4 text-center text-xs text-slate-500 font-mono">
    Endpoint: <span class="text-slate-400">POST /predict</span> (multipart/form-data with field 'image')
  </div>

  <script>
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const btn = document.getElementById('classifyBtn');
    const resultBox = document.getElementById('resultBox');
    const resCat = document.getElementById('resCategory');
    const resConf = document.getElementById('resConfidence');
    const scoresList = document.getElementById('scoresList');

    let selectedFile = null;

    input.addEventListener('change', (e) => {
      selectedFile = e.target.files[0];
      if (selectedFile) {
        preview.src = URL.createObjectURL(selectedFile);
        previewContainer.classList.remove('hidden');
        btn.disabled = false;
        resultBox.classList.add('hidden');
      }
    });

    btn.addEventListener('click', async () => {
      if (!selectedFile) return;
      btn.disabled = true;
      btn.textContent = 'Analyzing Image...';

      try {
        const fd = new FormData();
        fd.append('image', selectedFile);

        const res = await fetch('/predict', { method: 'POST', body: fd });
        const data = await res.json();

        if (res.ok && data.category) {
          resultBox.classList.remove('hidden');
          resCat.textContent = data.category.replace(/_/g, ' ');
          resConf.textContent = data.confidence + '% confidence';

          scoresList.innerHTML = '';
          if (data.all_scores) {
            for (const [cat, score] of Object.entries(data.all_scores)) {
              const row = document.createElement('div');
              row.className = 'flex items-center justify-between p-1.5 rounded bg-slate-800/40';
              row.innerHTML = `<span class="text-slate-300">\${cat}</span><span class="text-slate-400 font-bold">\${score}%</span>`;
              scoresList.appendChild(row);
            }
          }
        } else {
          alert('Error: ' + (data.error || 'Failed to classify'));
        }
      } catch (err) {
        alert('Request failed: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Classify Image';
      }
    });
  </script>
</body>
</html>'''

@app.route('/', methods=['GET'])
def root():
    # If a browser requests the root URL, show the interactive tester UI
    accept = request.headers.get('Accept', '')
    if 'text/html' in accept and 'application/json' not in accept:
        return render_template_string(HTML_TEST_PAGE)
    return jsonify({
        'status': 'ok',
        'service': 'JanSahayak ML Service',
        'predict_endpoint': '/predict',
        'health_endpoint': '/health'
    }), 200

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return jsonify({
            'message': 'The /predict endpoint requires a POST request with an image file attached under the field name \"image\".',
            'example_curl': 'curl -X POST -F \"image=@photo.jpg\" https://jansahayak-9afz.onrender.com/predict',
            'browser_test_ui': '/'
        }), 200
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
    port = int(os.environ.get('PORT', 7860))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)