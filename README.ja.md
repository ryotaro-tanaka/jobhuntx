# JobHuntX

## 概要
JobHuntX は、ASP.NET Core と React を使用して開発された求人情報スクレイピングアプリケーションです。このプロジェクトは、複数の求人サイトから情報を収集し、求人情報を効率的に管理・検索するためのツールを提供します。

## 主な機能
- 求人情報のスクレイピング
- 検索およびフィルタリング機能
- ユーザーフレンドリーなインターフェース

## セットアップ
1. リポジトリをクローンします:
    ```bash
    git clone https://github.com/your-repository/JobHuntX.git
    ```
2. API クライアントを生成します:
    ```bash
    cd JobHuntX/JobHuntX.API
    dotnet nswag run nswag.json
    ```
3. Docker Compose を使用してアプリケーションを起動します:
    ```bash
    cd ../
    docker-compose up --build
    ```
4. アプリケーションが起動したら、以下の URL にブラウザでアクセスします:
    ```
    http://localhost:5173
    ```

## 技術スタック

### 🧱 コア技術

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-blue?logo=dotnet)
![Docker](https://img.shields.io/badge/Docker-blue?logo=docker)

### 🛠️ ツール & ユーティリティ

![Vite](https://img.shields.io/badge/Vite-5.4.14-blue?logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-1.6.1-blue?logo=vitest)
![Testing Library](https://img.shields.io/badge/Testing%20Library-14.3.1-blue?logo=testinglibrary)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue?logo=tailwindcss)
![ESLint](https://img.shields.io/badge/ESLint-8.57.1-blue?logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-3.1.1-blue?logo=prettier)
![NSwag](https://img.shields.io/badge/NSwag-14.3.0-blue?logo=openapiinitiative)
![dotnet-format](https://img.shields.io/badge/dotnet--format-5.1.250801-blue?logo=dotnet)

## ライセンス
このプロジェクトは [MIT ライセンス](./LICENSE) の下で提供されています。
