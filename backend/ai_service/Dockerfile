FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PORT=10000

WORKDIR /app

# System dependencies (minimal + AI safe)
RUN apt-get update && apt-get install -y \
    build-essential \
    libglib2.0-0 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip FIRST (fixes resolver issues)
RUN pip install --upgrade pip

# Copy requirements
COPY requirements.txt .

# Install dependencies (no cache to avoid conflicts)
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

EXPOSE 10000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]
