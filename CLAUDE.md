# salon-sales プロジェクト メモ

## デプロイ方法

- デプロイは **GitHub Actions** が自動で行う（firebase deploy は不要）
- デプロイ用ワークフロー（`.github/workflows/deploy.yml`）は **`main` ブランチへの push のときだけ** 走る
- **変更は常に `main` に直接 push する**（ユーザー指定の方針。PR や確認は不要、毎回そのまま main へ）

## バージョン管理

- `public/index.html` の以下の行にバージョン番号が記載されている
  ```
  <span className="version">Ver X.XX</span>
  ```
- デプロイのたびにバージョンを +0.01 上げてからコミット＆プッシュする
- 例: Ver 1.91 → Ver 1.92 → Ver 1.93 ...
