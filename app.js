// ============================================================
// GIAO DIỆN SPA 4 MÀN — theo thiết kế Stitch (Weekend Planner)
// M1 Gợi ý (điều kiện + thẻ xếp hạng) · M2 Chi tiết điểm đến
// M3 Bộ lọc + Chẩn đoán thông minh + Presets · M4 Đã lưu
// Logic chấm điểm nằm 100% ở recommender.js.
// ============================================================

const $ = (id) => document.getElementById(id);
let currentPrefs = { mood: "stress", budget: 150, freeHours: 3, indoor: null, energy: 1, social: "friends", crowd: 1, groupSize: 2 };
let lastRun = null;
let planned = null;
const saved = new Set();

// Lưu bền trạng thái (sửa lỗi "Đã lưu/Đã chốt mất khi tải lại trang"):
// dùng localStorage khi trình duyệt có, im lặng nếu bị chặn (không đưa app ra trạng thái lỗi).
function loadPersisted() {
  try {
    for (const id of JSON.parse(localStorage.getItem("wp_saved") || "[]")) {
      if (window.CATALOG_DATA && window.CATALOG_DATA.CATALOG.some((it) => it.id === id)) saved.add(id);
    }
    const p = JSON.parse(localStorage.getItem("wp_planned") || "null");
    if (p && p.id && window.CATALOG_DATA.CATALOG.some((it) => it.id === p.id)) planned = p;
  } catch (e) { /* không có localStorage/sài dữ liệu — giữ trạng thái trong bộ nhớ */ }
}
function persistSaved() { try { localStorage.setItem("wp_saved", JSON.stringify([...saved])); } catch (e) {} }
function persistPlanned() {
  try {
    if (planned) localStorage.setItem("wp_planned", JSON.stringify(planned));
    else localStorage.removeItem("wp_planned");
  } catch (e) {}
}
loadPersisted();
const MOOD_EMOJI = { thoaimai: "😌", happy: "😄", buon: "🌧️", chan: "😐", stress: "🧖" };
const VENUE_TXT = { in: "Trong nhà", out: "Ngoài trời", both: "Trong & Ngoài trời" };
const ENERGY_TXT = { 1: "Nhẹ", 2: "Vừa sức", 3: "Tốn sức" };
const SOCIAL_TXT = { alone: "Một mình", friends: "Cùng bạn", anyone: "Tuỳ" };

function readPrefsFromUI() {
  const num = (id) => { const v = parseFloat($(id).value); return Number.isFinite(v) ? v : null; };
  const sel = (id) => { const v = $(id).value; if (v === "") return null; if (v === "true") return true; if (v === "false") return false; return v; };
  const companion = $("f-companion").value;
  let social = "anyone";
  let groupSize = null;
  if (companion === "alone") { social = "alone"; groupSize = 1; }
  else if (companion === "pair") { social = "friends"; groupSize = 2; }
  else if (companion === "small") { social = "friends"; groupSize = 4; }
  else if (companion === "big") { social = "friends"; groupSize = 8; }
  else if (companion === "friends") { social = "friends"; groupSize = null; }
  else if (companion === "anyone") { social = "anyone"; groupSize = null; }

  return {
    mood: $("f-mood").value,
    budget: num("f-budget"),
    freeHours: num("f-freeHours"),
    indoor: sel("f-indoor"),
    energy: (() => { const e = $("f-energy").value; return e === "" ? null : Number(e); })(),
    social,
    crowd: sel("f-crowd"),
    groupSize,
    weights: currentPrefs.weights // Bug đã sửa: khi người dùng chưa đặt slide trọng số, dùng trọng số mặc định của lõi (mood 0.30 cao nhất theo docs/01 D4) — bản cũ trả {2,2,2,2,2} khiến lõi chuẩn-hoá về 0.20 đều, mất thiết kế
  };
}

function runAndRender() {
  lastRun = RECOMMENDER.recommend(window.CATALOG_DATA.CATALOG, currentPrefs);
  renderSuggest();
}

// ---------- MÀN 1: GỢI Ý ----------
function renderSuggest() {
  const r = lastRun;
  $("moodChip").textContent = `${MOOD_EMOJI[currentPrefs.mood]} ${RECOMMENDER.MOOD_LABELS[currentPrefs.mood]}`; // đã bỏ đuôi ", bình yên" gắn cứng vô nghĩa với mọi tâm trạng
  const chips = [];
  if (currentPrefs.budget != null) chips.push(`💰 ≤ ${currentPrefs.budget}k`);
  if (currentPrefs.freeHours != null) chips.push(`⏱️ ${currentPrefs.freeHours} giờ`);
  if (currentPrefs.indoor != null) chips.push(currentPrefs.indoor ? "🏠 Trong nhà" : "🌤️ Ngoài trời");
  if (currentPrefs.energy != null) chips.push(`⚡ ${ENERGY_TXT[currentPrefs.energy]}`);
  if (currentPrefs.social) chips.push(`👥 ${SOCIAL_TXT[currentPrefs.social]}${currentPrefs.groupSize ? ` (${currentPrefs.groupSize} người)` : ""}`);
  if (currentPrefs.crowd != null) chips.push(currentPrefs.crowd === 1 ? "🌿 Yên tĩnh" : currentPrefs.crowd === 3 ? "🎆 Sầm uất" : "🙂 Vừa phải");
  $("condChips").innerHTML = chips.map((c) => `<span class="chip">${c}</span>`).join("");
  $("condCount").textContent = `${chips.length + 1}/7`;

  const hasAny = r.results.length > 0;
  if (!hasAny) {
    $("statusRow").innerHTML = `<span class="dot b"></span> Chưa có lịch trình khớp 100% — <b style="color:var(--brand);cursor:pointer" onclick="renderDiag();switchView('filters')">xem chẩn đoán →</b>`;
  } else if (r.matched === 0) {
    $("statusRow").innerHTML = `<span class="dot b"></span> <span style="color:var(--peach-ink)">⚠ Không hoạt động nào thật sự hợp tâm trạng — dưới đây là gần nhất</span> · <b style="color:var(--brand);cursor:pointer" onclick="renderDiag();switchView('filters')">nới lỏng →</b>`;
  } else {
    $("statusRow").innerHTML = `<span class="dot g"></span> Tìm thấy <b>${r.matched}/${r.total}</b> hoạt động hợp · <span class="right">✓ 100% Khớp ràng buộc</span>`;
  }

  const box = $("results");
  if (!hasAny) {
    box.innerHTML = `<div class="res-card" style="padding:18px;text-align:center">
      <div style="font-size:34px">🌙</div>
      <div style="font-weight:800;margin:8px 0 4px">Chưa có hoạt động thoả toàn bộ điều kiện</div>
      <div style="font-size:12.5px;color:var(--muted);line-height:1.5">Bộ lọc đang gắt nhất: <b>${[...r.eliminated].sort((a,b)=>b.count-a.count)[0].label}</b>.
      </div>
      <button class="btn-primary" style="margin-top:12px" onclick="renderDiag();switchView('filters')">✨ Xem chẩn đoán & nới lỏng</button>
    </div>`;
    return;
  }

  const badges = ["#1 Phù hợp nhất", "#2 Lựa chọn sáng tạo", "#3 Ý tưởng bất ngờ", "#4 Đáng cân nhắc", "#5 Dự phòng"];
  box.innerHTML = r.results.slice(0, 5).map((x, i) => {
    const it = x.item;
    const pr = it.priceRange[0] === it.priceRange[1] ? `${it.priceK}k` : `${it.priceRange[0]}k – ${it.priceRange[1]}k`;
    const reasonsHtml = x.reasons.filter(s => !s.startsWith("▼")).map((s) => s.replace(/(moodFit \d+\/100)/, "<b>$1</b>")).join(" ");
    const mainReason = reasonsHtml || "Cân bằng tốt trên mọi tiêu chí bạn chọn.";
    return `
    <div class="res-card">
      <div class="hero ${i === 0 ? "" : "small"}">
        <div class="emoji-bg">${it.emoji}</div>
        ${i === 0 ? `<span class="rank-badge">⭐ ${badges[i]}</span>` : `<span class="rank-badge">${badges[i]}</span>`}
        <span class="score-badge"><div class="n">${Math.round(x.score)}</div><div class="d">/100</div></span>
        <div class="cat">${it.category.toUpperCase()}</div>
        <h2>${it.name}</h2>
      </div>
      <div class="res-body">
        <div class="meta-chips">
          <span class="mchip b">🏠 ${VENUE_TXT[it.venue]}</span>
          <span class="mchip p">👥 ${it.groupMin}–${it.groupMax} người</span>
          <span class="mchip g">⚡ ${ENERGY_TXT[it.energy]}</span>
          <span class="mchip y">🌿 ${it.crowdLevel === 1 ? "Yên tĩnh" : it.crowdLevel === 2 ? "Vừa phải" : "Đông"}</span>
        </div>
        <div class="info-grid">
          <div class="info"><div class="ic r">💸</div><div><div class="l">Chi phí / người</div><div class="v">${pr}</div></div></div>
          <div class="info"><div class="ic b">🕐</div><div><div class="l">Thời lượng</div><div class="v">${it.hoursMin} – ${it.hoursMax} giờ</div></div></div>
        </div>
        <div class="why">
          <div class="h">✦ Lý do vì sao hợp bạn nhất (BR-2)</div>
          <p>${mainReason}</p>
        </div>
        <button class="breakdown-toggle" onclick="this.nextElementSibling.classList.toggle('open'); this.querySelector('.arr').textContent = this.nextElementSibling.classList.contains('open') ? '▴' : '▾'">📊 Xem công thức điểm số (${Math.round(x.score)}/100) <span class="arr" style="margin-left:auto">▾</span></button>
        <div class="bars">${Object.keys(x.breakdown.comps).map((k) => `
          <div class="bar-l">${RECOMMENDER.COMPONENT_LABELS[k]}</div>
          <div class="bar-t"><div class="bar-f" style="width:${Math.round(x.breakdown.comps[k])}%"></div></div>
          <div class="bar-n">${Math.round(x.breakdown.comps[k])} × ${x.breakdown.weights[k].toFixed(2)}</div>`).join("")}
        </div>
        <div class="cta-row">
          <button class="btn-primary" onclick="choosePlan('${it.id}')">✓ Chốt hoạt động này</button>
          <button class="btn-ghost ${saved.has(it.id) ? "saved" : ""}" onclick="toggleSave('${it.id}', this)">${saved.has(it.id) ? "🔖" : "🔖"}</button>
        </div>
      </div>
    </div>`;
  }).join("");
}

function choosePlan(id) {
  const it = window.CATALOG_DATA.CATALOG.find((a) => a.id === id);
  if (!it) return;
  planned = { id: it.id, name: it.name, location: it.location, priceK: it.priceK, hoursMin: it.hoursMin, hoursMax: it.hoursMax };
  persistPlanned();
  renderPlanned();
  switchView("planned");
  toast(`Đã chốt: ${it.name} ✓`);
}

// ---------- MÀN 2: CHI TIẾT ----------
function openDetail(id) {
  const x = lastRun && lastRun.results.find((r) => r.item.id === id);
  // Bug đã sửa: mở chi tiết từ màn "Đã chốt" — nếu hoạt động không còn trong kết quả hiện tại
  // (tâm trạng/điều kiện vừa đổi), bản cũ return âm thầm nút bấm vô tác dụng.
  const it = x ? x.item : window.CATALOG_DATA.CATALOG.find((a) => a.id === id);
  if (!it) return;
  const pr = it.priceRange[0] === it.priceRange[1] ? `${it.priceK}k` : `${it.priceRange[0]}k – ${it.priceRange[1]}k`;
  const moodScore = it.moodFit[currentPrefs.mood] ?? 50;
  const gh = it.goldenHour || `${it.bestHours === "sang" ? "6:00 – 9:00" : it.bestHours === "chieu" ? "15:00 – 17:30" : "18:00 – 21:00"}`;
  $("detailBody").innerHTML = `
    <div class="detail-hero">
      <button class="back-btn" onclick="switchView('suggest')">‹</button>
      <div class="emoji-bg">${it.emoji}</div>
      <div class="loc">📍 ${it.location}</div>
      <h2>${it.name}</h2>
    </div>
    <div class="tag-row">
      <span class="pill p">${it.category}</span>
      <span class="pill o">${x ? `⭐ Phù hợp · ${Math.round(x.score)}/100` : "⭐ Kế hoạch đã chốt"}</span>
    </div>
    <div class="res-body" style="padding:12px 16px">
      <div class="info-grid">
        <div class="info"><div class="ic r">💸</div><div><div class="l">Chi phí / người</div><div class="v">${pr}</div></div></div>
        <div class="info"><div class="ic b">🕐</div><div><div class="l">Thời lượng</div><div class="v">${it.hoursMin} – ${it.hoursMax} giờ</div></div></div>
        <div class="info"><div class="ic b">⚡</div><div><div class="l">Mức năng lượng</div><div class="v">${ENERGY_TXT[it.energy]}</div></div></div>
        <div class="info"><div class="ic r">👥</div><div><div class="l">Quy mô nhóm</div><div class="v">${it.groupMin} – ${it.groupMax} người</div></div></div>
      </div>
    </div>
    <div class="why-big">
      <div class="h">🙋 Tại sao hoạt động này dành cho bạn?</div>
      <span class="mood-pill">Khớp tâm trạng: "${RECOMMENDER.MOOD_LABELS[currentPrefs.mood]}"</span>
      // Bug đã sửa: đoạn văn bản lại mô tả cứng cho tâm trạng "stress" cho MỌI tâm trạng; giờ viết trung tính.
      <p>Bạn đang chọn tâm trạng <b>"${RECOMMENDER.MOOD_LABELS[currentPrefs.mood]}"</b>. ${it.name} là lựa chọn hợp hướng với tâm trạng đó, đồng thời khớp điều kiện ngân sách/thời gian bạn đặt. Điểm hợp tâm trạng <b>${moodScore}/100</b> — ${moodScore >= RECOMMENDER.MOOD_FIT_THRESHOLD ? "đạt ngưỡng hợp thật sự." : "chưa cao, cân nhắc thêm lựa chọn khác."}</p>
      <div class="gh"><span>🕒 Khung giờ vàng: <b>${gh}</b></span><span class="right">Vào đúng khung này đông ít hơn</span></div>
    </div>
    <div class="cta-row" style="padding:0 16px">
      <button class="btn-primary" onclick="choosePlan('${id}')">✓ Chốt kế hoạch này!</button>
      <button class="btn-ghost ${saved.has(id) ? "saved" : ""}" onclick="toggleSave('${id}', this)">🔖</button>
    </div>
    <div style="height:20px"></div>`;
  switchView("detail");
}

// ---------- MÀN 3: CHẨN ĐOÁN + BỘ LỌC ----------
function renderDiag() {
  const r = lastRun;
  if (r.results.length > 0) {
    $("diagArea").innerHTML = `<div class="block-card"><div class="h">✅ Điều kiện hiện tại đang khớp</div>
      <div style="font-size:12.5px;color:var(--ink2);line-height:1.55">Tìm thấy <b>${r.matched}/${r.total}</b> hoạt động thật sự hợp tâm trạng, <b>${r.remaining}</b> hoạt động thoả ràng buộc cứng. Có thể quay lại tab Gợi ý để xem xếp hạng.</div></div>`;
  } else {
    const diag = RECOMMENDER.suggestRelaxations(window.CATALOG_DATA.CATALOG, currentPrefs);
    const total = r.total;
    const rows = diag.topBlocks.map((b, i) => {
      const pct = Math.round((b.count / total) * 100);
      return `<div class="block-row">${i === 0 ? `<span class="who">${b.label}: loại ${b.count}</span><div class="track"><div class="fill" style="width:${pct}%"></div></div>` : `<div class="track"><div class="fill rest" style="width:${pct}%"></div></div><span>${b.label}: ${b.count}</span>`}</div>`;
    }).join("");
    $("diagArea").innerHTML = `
      <div class="diag-hero">
        <span class="kicker">🧠 Chẩn đoán thông minh (BR-4)</span>
        <h2>Chưa tìm thấy lịch trình khớp 100%</h2>
        <p>Hiện tại không có hoạt động nào thỏa mãn toàn bộ <b>${Object.keys(currentPrefs).filter(k => currentPrefs[k] != null && k !== "weights" && k !== "mood").length} điều kiện</b> cùng lúc. ${total} địa điểm bị chặn.</p>
      </div>
      <div class="block-card">
        <div class="h">🚫 Bộ lọc loại nhiều nhất</div>
        ${rows}
      </div>
      <div class="relax-card">
        <div class="h">✨ Nới lỏng để mở khoá ngay <span class="note">Giải pháp tức thì</span></div>
        ${diag.relaxations.map((rx, i) => `
          <div class="relax-item">
            <div class="ic">${rx.field === "budget" ? "💰" : rx.field === "freeHours" ? "⏱️" : rx.field === "indoor" ? "🌦️" : "⚡"}</div>
            <div style="flex:1">
              <div class="t">${rx.title} <span class="unlock">${rx.unlock}</span></div>
              <div class="d">${rx.subtitle}</div>
              <div class="d" style="color:var(--ink2)">Mức tăng tối thiểu cần thiết — ${rx.detail}</div>
              <div class="act"><button class="btn-apply" onclick='applyRelax(${JSON.stringify(rx.nextPrefs).replace(/'/g, "&#39;")})'>Áp dụng ngay →</button></div>
            </div>
          </div>`).join("")}
      </div>`;
  }
  renderFilterForm();
}

function renderFilterForm() {
  const p = currentPrefs;
  const companionValue = p.social === "alone" ? "alone" : p.social === "friends" && p.groupSize === 2 ? "pair" : p.social === "friends" && p.groupSize != null && p.groupSize <= 5 ? "small" : p.social === "friends" && p.groupSize != null && p.groupSize > 5 ? "big" : p.social === "friends" ? "friends" : "anyone";
  $("filterForm").innerHTML = `
    <label class="f-label" for="f-mood">Tâm trạng</label>
    <select id="f-mood">${RECOMMENDER.MOODS.map((m) => `<option value="${m}" ${p.mood === m ? "selected" : ""}>${MOOD_EMOJI[m]} ${RECOMMENDER.MOOD_LABELS[m]}</option>`).join("")}</select>
    <div class="grid2">
      <div><label class="f-label" for="f-budget">Ngân sách (k)</label><input type="number" id="f-budget" value="${p.budget ?? ""}" min="0" step="10" placeholder="Tuỳ"></div>
      <div><label class="f-label" for="f-freeHours">Thời gian (giờ)</label><input type="number" id="f-freeHours" value="${p.freeHours ?? ""}" min="0" step="0.5" placeholder="Tuỳ"></div>
    </div>
    <div class="grid2">
      <div><label class="f-label" for="f-indoor">Nơi diễn ra</label>
        <select id="f-indoor"><option value="" ${p.indoor == null ? "selected" : ""}>Tuỳ</option><option value="true" ${p.indoor === true ? "selected" : ""}>Trong nhà</option><option value="false" ${p.indoor === false ? "selected" : ""}>Ngoài trời</option></select></div>
      <div><label class="f-label" for="f-energy">Mức năng lượng</label>
        <select id="f-energy"><option value="" ${p.energy == null ? "selected" : ""}>Tuỳ</option><option value="1" ${p.energy == 1 ? "selected" : ""}>Nhẹ</option><option value="2" ${p.energy == 2 ? "selected" : ""}>Vừa sức</option><option value="3" ${p.energy == 3 ? "selected" : ""}>Tốn sức</option></select></div>
    </div>
    <div class="grid2">
      <div><label class="f-label" for="f-crowd">Không khí</label>
        <select id="f-crowd"><option value="" ${p.crowd == null ? "selected" : ""}>Tuỳ</option><option value="1" ${p.crowd == 1 ? "selected" : ""}>Yên tĩnh</option><option value="2" ${p.crowd == 2 ? "selected" : ""}>Vừa phải</option><option value="3" ${p.crowd == 3 ? "selected" : ""}>Sầm uất</option></select></div>
      <div><label class="f-label" for="f-companion">Đi cùng ai / nhóm</label>
    <div><label class="f-label" for="f-companion">Đi cùng ai / nhóm</label>
      <select id="f-companion">
        <option value="anyone" ${companionValue === "anyone" ? "selected" : ""}>Tuỳ ý</option>
        <option value="alone" ${companionValue === "alone" ? "selected" : ""}>Một mình</option>
        <option value="pair" ${companionValue === "pair" ? "selected" : ""}>2 người</option>
        <option value="small" ${companionValue === "small" ? "selected" : ""}>3–5 người</option>
        <option value="big" ${companionValue === "big" ? "selected" : ""}>6–8 người</option>
        <option value="friends" ${companionValue === "friends" ? "selected" : ""}>Cùng bạn bè</option>
      </select></div>
    </div>
    <button class="btn-primary" style="width:100%;margin-top:12px" onclick="applyForm()">Áp dụng & xem gợi ý</button>`;
}

function applyForm() {
  currentPrefs = readPrefsFromUI();
  runAndRender();
  renderDiag();
  switchView("suggest");
  toast("Đã cập nhật điều kiện ✓");
}

function applyRelax(nextPrefs) {
  currentPrefs = nextPrefs;
  runAndRender();
  switchView("suggest");
  toast("Đã nới lỏng điều kiện — có kết quả mới ✓");
}

// ---------- MÀN 4: ĐÃ LƯU ----------
function toggleSave(id, btn) {
  const it = window.CATALOG_DATA.CATALOG.find((a) => a.id === id);
  if (saved.has(id)) { saved.delete(id); toast(`Đã bỏ lưu: ${it.name}`); }
  else { saved.add(id); toast(`Đã lưu: ${it.name} 🔖`); }
  persistSaved();
  renderSaved();
  renderSuggest();
}

function renderSaved() {
  const box = $("savedBody");
  if (saved.size === 0) {
    box.innerHTML = `<div class="empty-note">Chưa có hoạt động nào được lưu.<br>Bấm 🔖 trên mỗi thẻ gợi ý để thêm vào đây.</div>`;
    return;
  }
  box.innerHTML = [...saved].map((id) => {
    const it = window.CATALOG_DATA.CATALOG.find((a) => a.id === id);
    return `<div class="res-card" style="padding:13px 14px;display:flex;gap:11px;align-items:center">
      <div style="font-size:26px">${it.emoji}</div>
      <div style="flex:1"><div style="font-weight:800;font-size:13.5px">${it.name}</div>
      <div style="font-size:11.5px;color:var(--muted);margin-top:2px">${it.priceK === 0 ? "Miễn phí" : `~${it.priceK}k`} · ${it.hoursMin}–${it.hoursMax}h · ${VENUE_TXT[it.venue]}</div></div>
      <button class="btn-ghost" onclick="toggleSave('${id}', this)">✕</button>
    </div>`;
  }).join("");
}

function renderPlanned() {
  const box = $("plannedBody");
  if (!planned) {
    box.innerHTML = `<div class="empty-note">Bạn chưa chọn hoạt động nào.<br>Chốt một hoạt động từ màn hình gợi ý để xem lại ở đây.</div>`;
    return;
  }
  const it = window.CATALOG_DATA.CATALOG.find((a) => a.id === planned.id);
  if (!it) {
    box.innerHTML = `<div class="empty-note">Hoạt động đã chốt không còn trong danh sách.</div>`;
    return;
  }
  box.innerHTML = `
    <div class="res-card" style="padding:14px">
      <div style="font-size:36px;margin-bottom:8px">${it.emoji}</div>
      <div style="font-weight:900;font-size:18px;margin-bottom:6px">${it.name}</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6">
        <div>📍 ${it.location}</div>
        <div>💸 ${it.priceK === 0 ? "Miễn phí" : `~${it.priceK}k / người`}</div>
        <div>⏱️ ${it.hoursMin}–${it.hoursMax} giờ</div>
        <div>🏠 ${VENUE_TXT[it.venue]}</div>
      </div>
      <div class="cta-row" style="margin-top:16px">
        <button class="btn-primary" onclick="openDetail('${it.id}')">Xem chi tiết</button>
        <button class="btn-ghost" onclick="toggleSave('${it.id}', this)">${saved.has(it.id) ? "🔖" : "🔖"}</button>
      </div>
    </div>`;
}

// ---------- Điều hướng ----------
function switchView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  $("view-" + name).classList.add("active");
  document.querySelectorAll(".nav button").forEach((b) => b.classList.remove("active"));
  const navMap = { suggest: "nav-suggest", planned: "nav-planned", saved: "nav-saved" };
  if (navMap[name]) $(navMap[name]).classList.add("active");
  window.scrollTo(0, 0);
  if (name === "filters") renderDiag();
  if (name === "saved") renderSaved();
  if (name === "planned") renderPlanned();
}

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

// Khởi động
runAndRender();
