FROM python:3.11-slim

WORKDIR /app

# Install ffmpeg, wkhtmltopdf, and required libraries
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wkhtmltopdf \
    libxext6 \
    libxrender1 \
    libfontconfig1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Start with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5010", "app:app"]
