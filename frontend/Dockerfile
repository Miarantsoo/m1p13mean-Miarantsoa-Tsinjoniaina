FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

EXPOSE 4200

CMD ["bun", "run", "start", "--host", "0.0.0.0"]
