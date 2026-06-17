// デプロイ用ビルドスクリプト
//
// 目的: ブラウザ内 Babel 変換をやめ、読み込みを高速化する。
//   - public/index.html の <script type="text/babel"> の中身（JSX）を
//     esbuild で事前に JS へ変換し、dist/app.js として書き出す
//   - dist/index.html では babel.min.js の読み込みを削除し、各 CDN script に
//     defer を付け、本体は <script src="app.js" defer> で読み込む
//
// ※ 編集対象はあくまで public/index.html（1ファイル運用は維持）。
//    このスクリプトはデプロイ時(GitHub Actions)にだけ走り、配信用の dist/ を作る。

import esbuild from 'esbuild';
import { mkdir, readFile, writeFile, rm, cp, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

const html = await readFile(path.join(PUBLIC, 'index.html'), 'utf8');

// 1. <script type="text/babel"> ... </script> を取り出す
const babelRe = /<script\s+type="text\/babel">([\s\S]*?)<\/script>/;
const m = html.match(babelRe);
if (!m) throw new Error('text/babel スクリプトが見つかりません');
const jsx = m[1];

// 2. JSX を JS へ変換（フラグメントは React.Fragment、要素は React.createElement）
const { code } = await esbuild.transform(jsx, {
  loader: 'jsx',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: true,
  target: 'es2019',
});

// 3. dist を作り直す（public の中身をコピーしてから index.html を差し替え）
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
for (const name of await readdir(PUBLIC)) {
  await cp(path.join(PUBLIC, name), path.join(DIST, name), { recursive: true });
}

// 4. app.js を書き出す
await writeFile(path.join(DIST, 'app.js'), code, 'utf8');

// 5. dist/index.html を変換版に書き換える
let out = html;
//   - babel.min.js の読み込み行を削除
out = out.replace(/\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"><\/script>/,'');
//   - 残りの CDN script に defer を付与（render-blocking を回避）
out = out.replace(/<script src="(https:\/\/[^"]+)"><\/script>/g, '<script src="$1" defer></script>');
//   - 本体 JSX を外部 app.js（defer）に差し替え
out = out.replace(babelRe, '<script src="app.js" defer></script>');
await writeFile(path.join(DIST, 'index.html'), out, 'utf8');

console.log('build: dist/ を生成しました（app.js を事前変換、Babel CDN を除去）');
