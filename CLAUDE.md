# salon-sales プロジェクト メモ

## デプロイ方法

- デプロイは **GitHub Actions** が自動で行う（firebase deploy は不要）
- デプロイ用ワークフロー（`.github/workflows/deploy.yml`）は **`main` ブランチへの push のときだけ** 走る
- **変更は常に `main` に直接 push する**（ユーザー指定の方針。PR や確認は不要、毎回そのまま main へ）

## ビルド（高速化のための事前変換）

- 編集するのは今まで通り **`public/index.html` の1ファイルだけ**（JSX は `<script type="text/babel">` のまま書いてよい）
- デプロイ時、GitHub Actions が `npm run build`（`build.mjs`）を実行し、配信用の `dist/` を生成する
  - `index.html` 内の JSX を **esbuild で事前に JS へ変換** → `dist/app.js`
  - ブラウザ内 Babel 変換（`babel.min.js` 約2.8MB）を読み込まなくなり、初回表示が速くなる
- Firebase Hosting は `dist/` を配信する（`firebase.json` の `public` が `dist`）
- `dist/` は **CIが毎回生成する成果物なのでコミットしない**（`.gitignore` 済み）
- ローカルで配信版を確認したいときは `npm install && npm run build` で `dist/` を作れる

## バージョン管理

- `public/index.html` の以下の行にバージョン番号が記載されている
  ```
  <span className="version">Ver X.XX</span>
  ```
- デプロイのたびにバージョンを +0.01 上げてからコミット＆プッシュする
- 例: Ver 1.91 → Ver 1.92 → Ver 1.93 ...

## コミュニケーション方針

- **作業の進行状況・説明・手順の見出しは、できるだけ日本語で書く**（ユーザー指定）
  - 例：コマンドの説明（「ビルドして動作確認」「main にコミット＆プッシュ」など）も日本語にする
  - コードの変数名・関数名や、コマンド自体（`git`、`npm run build` など）は動作のため英語のままでよいが、内容は日本語で補足する
- コミットメッセージは日本語のまま
