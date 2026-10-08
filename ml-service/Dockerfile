FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Hugging Face Spaces requirement: create non-root user with UID 1000
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Copy requirements and install
COPY --chown=user:user requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy application files
COPY --chown=user:user . /app

# Switch to non-root user
USER user

# Expose default Hugging Face Spaces port
EXPOSE 7860

# Run with Gunicorn on port 7860
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:7860", "--workers", "2", "--threads", "2", "--timeout", "120"]
