FROM python:3.11-slim

RUN apt-get update && apt-get install -y curl build-essential

ENV POETRY_VERSION=1.8.2
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN poetry install --no-interaction --no-ansi

COPY . .

EXPOSE 5487

ENV HOST=127.0.0.1
ENV PORT=5487
ENV RATE=10
ENV LOG_LEVEL=info

CMD poetry run python app/main.py \
  --host ${HOST} \
  --port ${PORT} \
  --rate ${RATE} \
  --log-level ${LOG_LEVEL}