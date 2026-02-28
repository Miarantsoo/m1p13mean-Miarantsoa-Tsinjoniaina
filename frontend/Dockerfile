FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

# Ensure devDependencies are installed during build for development
ENV NODE_ENV=development

RUN bun install

COPY . .

EXPOSE 4200

CMD ["bun", "run", "start", "--host", "0.0.0.0"]
