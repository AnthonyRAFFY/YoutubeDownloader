FROM python:latest as install

LABEL Maintainer="anthony.raffy38@gmail.com"

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

COPY worker.py ./

CMD ["python", "-u", "worker.py"]