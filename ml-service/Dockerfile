FROM python:3.11-slim

WORKDIR /app

# Non-root user setup (best practice for Koyeb, Hugging Face, and secure containers)
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PORT=8000

# Install dependencies with CPU-only wheels for low memory footprint
COPY --chown=user:user requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy application files and model weights
COPY --chown=user:user . /app

USER user

# Default exposed port (Koyeb defaults to 8000; dynamically overridable by $PORT)
EXPOSE 8000

# Single worker with 2 threads saves RAM on free tier 512MB RAM instances
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-8000} --workers 1 --threads 2 --timeout 120"]
