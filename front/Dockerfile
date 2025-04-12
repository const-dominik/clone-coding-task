FROM node:23-alpine3.20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23-alpine3.20 AS runner
WORKDIR /app

RUN npm install -g http-server
COPY --from=builder /app/dist .

ENV PORT=5173
EXPOSE ${PORT}

CMD ["sh", "-c", "http-server -p ${PORT}"]
