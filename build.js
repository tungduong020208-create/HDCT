// ============================================================
// BUILD — gộp data.js + recommender.js + app.js vào 1 file dist.html
// Vì sao: demo/preview chỉ phát được 1 file HTML đơn lẻ; gộp script
// cũng giúp nộp bài/gửi người dùng thử dễ hơn (1 file duy nhất).
// Chạy: node build.js  → tạo dist.html
// ============================================================
const fs = require("fs");

let html = fs.readFileSync("index.html", "utf8");
for (const src of ["data.js", "recommender.js", "app.js"]) {
  const code = fs.readFileSync(src, "utf8");
  const tag = `<script src="${src}"></script>`;
  if (!html.includes(tag)) throw new Error(`Không tìm thấy ${tag} trong index.html`);
  html = html.replace(tag, `<script>\n${code}\n</script>`);
}
fs.writeFileSync("dist.html", html);
console.log(`OK: dist.html (${(html.length / 1024).toFixed(1)} KB, đã gộp 3 script)`);
