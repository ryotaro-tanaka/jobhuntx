# ベースイメージ
FROM node:18

# 作業ディレクトリの設定
WORKDIR /app

# pnpm をグローバルインストール
RUN npm install -g pnpm

# package.json と pnpm-lock.yaml を先にコピー（キャッシュのため）
COPY ./client-app/package.json ./client-app/pnpm-lock.yaml ./

# 依存関係のインストール
RUN pnpm install

# アプリのコードをコピー
COPY ./client-app .

# 開発サーバー起動（docker-compose.ymlのcommandで上書きすることも可）
CMD ["pnpm", "dev"]
