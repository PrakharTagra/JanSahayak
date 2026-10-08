---
title: JanSahayak ML Service
emoji: 🏛️
colorFrom: yellow
colorTo: red
sdk: docker
app_port: 7860
pinned: false
---

# JanSahayak ML Grievance Classification Microservice

MobileNetV2 Computer Vision API for JanSahayak civic complaint categorization.

## Endpoints
- `GET /health` - Health check & active categories list
- `POST /predict` - Upload form-data `image` to receive predicted category & confidence scores
