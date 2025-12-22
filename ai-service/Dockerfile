# Use Python version 3.9
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for MongoDB drivers
RUN apt-get update && apt-get install -y gcc python3-dev

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run on port 8001
EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]