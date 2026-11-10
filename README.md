# Finn Shih's Legacy (Blog)

線上網址：https://garzlolz.github.io/blog/

## 專案架構

- **前端框架**：Vue 3 + Vue Router 4（原生 ES Modules + Import Map CDN 零打包架構）
- **架構規範**：遵循 [Vue School Large-Scale Application Structure](https://vueschool.io/articles/vuejs-tutorials/how-to-structure-a-large-scale-vue-js-application/) 分層設計（`config`、`router`、`shared`、`features`、`views`）
- **認證與資料庫**：Firebase Authentication (Google 登入) + Cloud Firestore

## 本機啟動方式

由於採用瀏覽器原生 ES Modules (`<script type="module">`)，請透過靜態 HTTP 伺服器啟動專案：

```bash
python -m http.server 8080
```

啟動後請於瀏覽器開啟：
http://localhost:8080
