// ホーム画面に追加できるようにする（PWAのインストール判定）ためだけの最小限の
// Service Worker。このアプリは頻繁に更新され、金額計算のロジックも含むため、
// 古い内容をキャッシュしてオフラインで動かすことはしない（常にネットワークから取得する）。
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
