// ============================================================
// CA KIỂM THỬ — khung assert tự viết, chạy bằng: node test.js
// Chủ đề: công cụ gợi ý hoạt động cuối tuần (nhiều điều kiện)
// Mỗi ca: tên, mô tả "khó" ở đâu, các khẳng định (assert) phải đúng.
// ============================================================

const { recommend, timeScore, resolveWeights, DEFAULT_WEIGHTS } = require("./recommender");
const { CATALOG } = require("./data");

let passed = 0, failed = 0;
const failures = [];

function check(testName, cond, detail) {
  if (cond) { passed++; }
  else { failed++; failures.push(`${testName} → ${detail}`); }
}

// ---------- CÁC CA KIỂM THỬ ----------

// C1. Biên ngân sách: hoạt động giá ĐÚNG bằng ngân sách (300k) vẫn phải được giữ (dùng <=, không phải <)
{
  const r = recommend(CATALOG, { mood: "happy", budget: 300 });
  check("C1", r.results.some((x) => x.item.id === "bbai-bien"),
    "Đi biển 300k phải nằm trong kết quả budget 300k (biên <=)");
}

// C2. Budget "loe ngang" 40k: giữa 20k và 60k có khoảng trống giá
//     → chỉ được còn đúng 3 hoạt động ≤40k: miễn phí x2 (ngu-trua, don-nha) + đạp xe 20k
{
  const r = recommend(CATALOG, { mood: "thoaimai", budget: 40 });
  const ids = r.results.map((x) => x.item.id).sort();
  const expected = ["dap-xe", "don-nha", "ngu-trua"].sort();
  check("C2", r.remaining === 3 && JSON.stringify(ids) === JSON.stringify(expected),
    `kỳ vọng đúng 3 hoạt động ≤40k, thực tế remaining=${r.remaining}, ${JSON.stringify(ids)}`);
}

// C3. Xung đột điều kiện: ngoài trời + năng lượng thấp (1)
//     → còn 2 mẫu: ca-phe-sach-ho (venue both + energy 1) và cho-dem (energy 2, lệch 1 bậc qua lọc mềm)
{
  const r = recommend(CATALOG, { mood: "thoaimai", indoor: false, energy: 1 });
  const ids = r.results.map((x) => x.item.id).sort();
  check("C3", r.remaining === 2 && JSON.stringify(ids) === JSON.stringify(["ca-phe-sach-ho", "cho-dem"]),
    `kỳ vọng đúng 2 mẫu [ca-phe-sach-ho, cho-dem], thực tế remaining=${r.remaining}, ${JSON.stringify(ids)}`);
}

// C4. Rỗng thật sự: thời gian rảnh 0.5h — không hoạt động nào cần ≤0.5h
//     → results rỗng + đủ 6 dòng chẩn đoán (đã thêm bộ lọc quy mô nhóm), time loại đủ 18/18
{
  const r = recommend(CATALOG, { mood: "happy", freeHours: 0.5 });
  check("C4", r.results.length === 0 && r.remaining === 0 &&
      r.eliminated.length === 6 && r.eliminated.find((e) => e.key === "freeHours").count === CATALOG.length,
    `kỳ vọng rỗng, time loại hết ${CATALOG.length}; thực tế remaining=${r.remaining}, eliminated=${r.eliminated.length}`);
}

// C5. Fallback tâm trạng: "chán" + muốn ngoài trời + tốn sức
//     → 6 mẫu ngoài trời tốn sức/vừa sức còn lại, nhưng không cái nào có moodFit["chan"] >= 80 (cao nhất 75)
//     → PHẢI bật cờ fallback (không được im lặng gợi ý hoạt động không hợp tâm trạng)
{
  const r = recommend(CATALOG, { mood: "chan", indoor: false, energy: 3 });
  const maxMood = Math.max(...r.results.map((x) => x.item.moodFit.chan));
  check("C5", r.fallback === true && r.remaining === 6 && maxMood < 80,
    `kỳ vọng fallback=true với 6 mẫu (max moodFit=${maxMood}), thực tế fallback=${r.fallback}, remaining=${r.remaining}`);
}

// C6. Slider tâm trạng = 5, còn lại 0 → hoạt động hợp tâm trạng "happy" nhất (đi biển 95/100) phải top 1
{
  const r = recommend(CATALOG, { mood: "happy", weights: { mood: 5, budget: 0, time: 0, energy: 0, crowd: 0 } });
  check("C6", r.results[0].item.id === "bbai-bien",
    `kỳ vọng top1 = đi biển (moodFit happy 95), thực tế top1 = ${r.results[0].item.id}`);
}

// C7. Mọi slider = 0 → không crash, rơi về trọng số mặc định (chống chia 0/NaN), trọng số chuẩn hoá tổng = 1
{
  const r1 = recommend(CATALOG, { mood: "buon", weights: { mood: 0, budget: 0, time: 0, energy: 0, crowd: 0 } });
  const r2 = recommend(CATALOG, { mood: "buon" });
  const { norm, usedDefault } = resolveWeights({});
  const sumNorm = Object.values(norm).reduce((a, b) => a + b, 0);
  check("C7", r1.results.length > 0 &&
      JSON.stringify(r1.results.map((x) => x.item.id)) === JSON.stringify(r2.results.map((x) => x.item.id)) &&
      usedDefault === true && Math.abs(sumNorm - 1) < 1e-9,
    `slider 0 phải tương đương mặc định (usedDefault=${usedDefault}, tổng trọng số=${sumNorm})`);
}

// C8. Bất biến: budget 100k → KHÔNG kết quả nào vượt 100k; điểm ∈ [0,100] hữu hạn; hoà điểm → rẻ hơn đứng trước
{
  const r = recommend(CATALOG, { mood: "thoaimai", budget: 100 });
  const allOk = r.results.every((x) => x.item.priceK <= 100 && x.score >= 0 && x.score <= 100 && Number.isFinite(x.score));
  let tieOk = true;
  for (let i = 1; i < r.results.length; i++) {
    if (r.results[i].score === r.results[i - 1].score && r.results[i].item.priceK < r.results[i - 1].item.priceK) tieOk = false;
  }
  check("C8", allOk && tieOk, `vi phạm bất biến: ${r.results.filter((x) => x.item.priceK > 100).length} kết quả vượt budget hoặc tie-break sai`);
}

// C9. Mọi kết quả phải có lý do giải thích; kết quả trong ca fallback phải có cảnh báo ▼
{
  const r1 = recommend(CATALOG, { mood: "happy", budget: 200 });
  const okMain = r1.results.every((x) => Array.isArray(x.reasons) && x.reasons.length >= 1);
  const r2 = recommend(CATALOG, { mood: "chan", indoor: false, energy: 3 });
  const okWarn = r2.results.every((x) => x.reasons.some((s) => s.startsWith("▼")));
  check("C9", okMain && okWarn,
    `reasons rỗng (main=${okMain}) hoặc kết quả fallback thiếu cảnh báo ▼ (warn=${okWarn})`);
}

// C10. Toán học timeScore (hàm thuần): thiếu giờ → 0; dư giờ → 100; đủ min chưa tới max → 60–100
{
  const it = { hoursMin: 2, hoursMax: 5 };
  const t1 = timeScore(it, 1);    // thiếu → 0
  const t2 = timeScore(it, 6);    // dư → 100
  const t3 = timeScore(it, 2.5);  // giữa min và max → 60 + 40*(0.5/3) ≈ 66.67
  const t4 = timeScore(it, null); // không khai báo → trung lập 50
  check("C10", t1 === 0 && t2 === 100 && Math.abs(t3 - 66.6667) < 0.01 && t4 === 50,
    `timeScore sai: t1=${t1}, t2=${t2}, t3=${t3}, t4=${t4}`);
}

// C11. Lọc hình thức đi (bug thật bị bắt khi verify UI: so chuỗi 'friends' với số social 1/2/3
//      không bao giờ khớp → chỉ còn nhánh social===3). Sau sửa: 'friends' phải khớp social===2;
//      'alone' khớp social===1 hoặc 3 (hoạt động cho nhóm vẫn đi một mình được)
{
  const rf = recommend(CATALOG, { mood: "chan", indoor: false, energy: 3, social: "friends" });
  const friendsOk = rf.remaining === 6 && rf.results.every((x) => x.item.social === 2 || x.item.social === 3);
  const ra = recommend(CATALOG, { mood: "thoaimai", budget: 20, social: "alone" });
  const aloneIds = ra.results.map((x) => x.item.id).sort();
  const aloneOk = JSON.stringify(aloneIds) === JSON.stringify(["dap-xe", "don-nha", "ngu-trua"].sort());
  check("C11", friendsOk && aloneOk,
    `friends kỳ vọng 6 mẫu ngoài trời (thực tế ${rf.remaining}); alone+budget20 kỳ vọng [dap-xe,don-nha,ngu-trua] (thực tế ${JSON.stringify(aloneIds)})`);
}

// C12. Gợi ý nới lỏng (BR-4): ca "budget 20k + 8 người" — cả 2 điều kiện gắt.
//      Phải đề xuất phương án tăng ngân sách có số chỗ mở khoá thật (>0) và nextPrefs
//      áp dụng được ngay (chạy recommend với nextPrefs phải còn kết quả).
{
  const { suggestRelaxations } = require("./recommender");
  const prefs = { mood: "happy", budget: 20, freeHours: 4, groupSize: 8 };
  const diag = suggestRelaxations(CATALOG, prefs);
  const okShape = diag.topBlocks.length >= 1 && diag.relaxations.length >= 1;
  const okUnlock = diag.relaxations.every((rx) => {
    const m = /\+(\d+)/.exec(rx.unlock);
    return m && Number(m[1]) > 0;
  });
  const okNext = diag.relaxations.every((rx) => recommend(CATALOG, rx.nextPrefs).remaining > 0);
  check("C12", okShape && okUnlock && okNext,
    `shape=${okShape}, unlock dương=${okUnlock}, nextPrefs dùng được=${okNext}`);
}

// ---------- CHẠY ----------
console.log("=".repeat(56));
console.log("KẾT QUẢ KIỂM THỬ — gợi ý hoạt động cuối tuần");
console.log("=".repeat(56));
for (const f of failures) console.log("  ✗ " + f);
console.log("-".repeat(56));
console.log(`Tổng: ${passed + failed} ca | Đạt: ${passed} | Trượt: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
