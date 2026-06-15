# salon-sales プロジェクト メモ

## デプロイ方法

- デプロイは **GitHub Actions** が自動で行う（firebase deploy は不要）
- ブランチにプッシュするだけで Actions が走る

## バージョン管理

- `public/index.html` の以下の行にバージョン番号が記載されている
  ```
  <span className="version">Ver X.XX</span>
  ```
- デプロイのたびにバージョンを +0.01 上げてからコミット＆プッシュする
- 例: Ver 1.91 → Ver 1.92 → Ver 1.93 ...
