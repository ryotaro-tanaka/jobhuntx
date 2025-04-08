# ベースイメージ
FROM node:18

WORKDIR /app

RUN npm install -g pnpm
# for Cache
COPY ./client-app/package.json ./client-app/pnpm-lock.yaml ./
RUN pnpm install

COPY ./client-app .
