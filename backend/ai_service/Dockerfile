# Use lightweight Python base
FROM python:3.10-slim

# Prevent Python buffering
ENV PYTHONUNBUFFERED=1
ENV PORT=10000

# Set working directory
WORKDIR /app

# Install system dependencies (SAFE VERSION)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose Render port
EXPOSE 10000

# Start FastAPI
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
