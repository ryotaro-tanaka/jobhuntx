# JobHuntX

![Tests](https://github.com/ryotaro-tanaka/JobHuntX/actions/workflows/ci.yml/badge.svg)

![JobHuntX Demo](docs/demo.gif)

[🚀 **パブリックデモ**](https://jobhuntx.onrender.com/)

## 概要
JobHuntX は、ASP.NET Core と React を使用して開発された求人情報集約アプリケーションです。このプロジェクトは、公開API・RSS・Webサイトなど複数の情報源から求人情報を収集し、効率的に求人情報を管理・検索するためのツールを提供します。

## 主な機能
- 求人情報の収集（API・RSS・Webサイト等）
- 検索およびフィルタリング機能
- ユーザーフレンドリーなインターフェース
- CI/CDパイプライン

## セットアップ
1. リポジトリをクローンします:
    ```bash
    git clone https://github.com/your-repository/JobHuntX.git
    ```
1. 環境変数ファイルをセットアップします:
    ```bash
    cp JobHuntX.API/.env.sample JobHuntX.API/.env
    cp client-app/.env.sample client-app/.env
    ```
1. API クライアントを生成します:
    ```bash
    cd JobHuntX/JobHuntX.API
    dotnet nswag run nswag.local.json
    ```
1. Docker Compose を使用してアプリケーションを起動します:
    ```bash
    cd ../
    docker-compose up --build
    ```
1. アプリケーションが起動したら、以下の URL にブラウザでアクセスします:
    ```
    http://localhost:5173
    ```

## 技術スタック

### 🧱 コア技術

![React](https://img.shields.io/badge/React--blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript--blue?logo=typescript&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core--blue?logo=dotnet&logoColor=white)
![Docker](https://img.shields.io/badge/Docker--blue?logo=docker&logoColor=white)

### 🛠️ ツール & ユーティリティ

![Vite](https://img.shields.io/badge/Vite--blue?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest--blue?logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing%20Library--blue?logo=testinglibrary&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS--blue?logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint--blue?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier--blue?logo=prettier&logoColor=white)
![NSwag](https://img.shields.io/badge/NSwag--blue?logo=openapiinitiative&logoColor=white)
![dotnet-format](https://img.shields.io/badge/dotnet%20format--blue?logo=dotnet&logoColor=white)
![xUnit](https://img.shields.io/badge/xUnit--blue?logo=.net&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions--blue?logo=githubactions&logoColor=white)
![Render](https://img.shields.io/badge/Render--blue?logo=render&logoColor=white)

## dotnet-formatでのフォーマット

`JobHuntX.API` プロジェクトは `dotnet-format` コマンドを使用してフォーマットを整形できます:

```bash
$ cd JobHuntX.API
$ dotnet tool run dotnet-format
```

## NSwagでのAPI型生成

モデルを変更した後、`nswag` を使用してフロントエンド側のAPI型を自動生成できます:

```bash
$ cd ./JobHuntX.API
$ dotnet nswag run nswag.local.json
```

## プルリクエスト作成前の注意

プルリクエストを作成する前に、**CIテストが通るよう必ずローカルの `swagger.json` を最新化してください**:

```bash
$ docker-compose up -d
$ dotnet run --project JobHuntX.API & curl http://localhost:5000/swagger/v1/swagger.json > JobHuntX.API/swagger.json
```

これにより、フロントエンドのAPI型が最新のAPI仕様から生成され、CIテストが `swagger.json` の不足や古さで失敗しなくなります。

## テストの実行

クライアント側のテストは以下のコマンドで実行できます:

```bash
$ cd client_app
$ pnpm test
```

バックエンドのテストは `JobHuntX.Tests` プロジェクトを使って実行できます:

```bash
$ dotnet test JobHuntX.Tests
```

## デプロイ

パブリックデモは Render サービス上で `release/render-deploy` ブランチおよび `Dockerfile.render` を使用してデプロイされています。

- **デモURL:** https://jobhuntx.onrender.com/
- **デプロイ用ブランチ:** `release/render-deploy`
- **Dockerfile:** `Dockerfile.render`

## アーキテクチャ

> ⚠️ **注意:** 本プロジェクトは現在、アーキテクチャと保守性向上のため大規模なリファクタリング中です。  
> 以下の図や説明は意図する構成を示していますが、コードベースの一部は移行途中の場合があります。

### **バックエンド**

本アプリケーションでは、バックエンドのデータ取得・処理ロジックを「ハンドラーパターン」で整理しています。

![diagram backend](docs/diagram-backend.png)

#### 構成要素

* HandlerBase（抽象クラス）  
    共通処理（キャッシュ、エラーハンドリング、フィルタ処理など）を提供し、各Handlerで継承可能な基盤として機能します。
* 個別ハンドラー  
    各求人情報ソースごとに責務を持つ具象クラスであり、データの取得とパースを担当します（例：RSS、API、Webサイトなど）。
* AggregateJobHandler  
    複数の個別ハンドラーを統合的に呼び出し、ジョブ一覧を構築します。
* ユーティリティ  
    キャッシュ、ログ、フィルタなどの横断的関心事を独立クラスとして分離し、再利用性と単一責任を確保しています。

### **フロントエンド**

フロントエンドは、**コンテナ／プレゼンテーションパターン**と**Hooks＋Contextによる状態管理**を組み合わせた構成です。主な目的は関心の分離（Separation of Concerns）を実現し、可読性と拡張性を高めることです。

![diagram frontend](docs/diagram-frontend.png)

#### 構成要素

* Hooks  
    * useJobSearch:  
    検索状態、選択中のジョブ、ヘッダーサイズ、表示モード（ジョブ／タレント）などの状態を一元管理し、API通信などの副作用も集約します。
* State  
    useJobSearchで管理される状態値。複数コンポーネント間で共有されます。
* Context  
    * JobSearchProvider:  
    状態をコンテキスト経由で提供し、子コンポーネントから利用できるようにします。
    * useJobContext:  
    状態の参照や更新を簡潔に行うためのカスタムフックです。
* コンテナコンポーネント  
    * XXXContainer:  
    状態やロジック（Contextの取得やハンドラの定義）を担当し、必要なpropsをプレゼンテーショナルコンポーネントに渡します。
* プレゼンテーショナルコンポーネント  
    * XXX:  
    ロジックを持たず、表示とユーザー操作の受け取りに特化したUIコンポーネントです。スタイルや表示条件に集中し、状態や副作用の処理は行いません。
* App.tsx  
    アプリケーションのエントリーポイントです。```JobSearchProvider``` を使って状態を提供し、最上位のコンテナコンポーネントを配置します。

## ライセンス
このプロジェクトは [MIT ライセンス](./LICENSE) の下で提供されています。
