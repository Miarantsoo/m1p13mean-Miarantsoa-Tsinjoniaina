FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./

# Ensure devDependencies are installed during image build for development mode
ENV NODE_ENV=development

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
