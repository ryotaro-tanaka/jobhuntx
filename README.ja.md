# JobHuntX

[English](README.md) | 日本語

![Tests](https://github.com/ryotaro-tanaka/JobHuntX/actions/workflows/ci.yml/badge.svg)

![JobHuntX Demo](docs/assets/demo.gif)

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
1. 初期化スクリプトを実行します（環境変数のセットアップや依存関係の復元を行います）:
    ```bash
    npm run init
    ```
3. アプリケーションを起動します:
    ```bash
    docker compose up --build -d
    ```
4. アプリケーションが起動したら、以下の URL にブラウザでアクセスします:
    ```
    http://localhost:5173
    ```

## 開発用コマンド

人間（設計者）が主に使用するコマンドは以下の通りです。

| コマンド | 内容 |
| :--- | :--- |
| `npm run init` | 初回セットアップ（環境変数・依存関係） |
| `docker compose up` | アプリ全体を起動 |
| `npm run validate` | **提出・完了前の最終チェック（Lint + 型チェック + テスト）** |

その他の詳細な操作（API同期やコード整形）は、AIエージェントが自律的に実行します。

## 開発ワークフロー

1.  **開発開始**: `docker compose up` でアプリを起動し、ブラウザで動作を確認しながら指示を出します。
2.  **APIの同期**: AIがバックエンドを修正した場合、AIが自律的に `npm run sync` を実行してフロントエンドに型を反映します。
3.  **品質確認**: 開発の区切りやプルリクエスト作成前に `npm run validate` を実行し、プロジェクト全体に矛盾がないか確認します。


## デプロイ

パブリックデモは Render サービス上で `release/render-deploy` ブランチおよび `Dockerfile.render` を使用してデプロイされています。

- **デモURL:** https://jobhuntx.onrender.com/
- **デプロイ用ブランチ:** `release/render-deploy`
- **Dockerfile:** `Dockerfile.render`

## アーキテクチャ

### **バックエンド**

本アプリケーションでは、バックエンドのデータ取得・処理ロジックを「ハンドラーパターン」で整理しています。

![diagram backend](docs/assets/diagram-backend.png)

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

![diagram frontend](docs/assets/diagram-frontend.png)

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
