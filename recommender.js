// ============================================================
// LÕI CÔNG CỤ GỢI Ý HOẠT ĐỘNG CUỐI TUẦN — NHIỀU ĐIỀU KIỆN
// Pipeline: LỌC CỬNG (ngân sách → thời gian rảnh → trong/ngoài trời →
//           mức năng lượng → hình thức đi → quy mô nhóm)
//         → CHẤM ĐIỂM (mood, budget, time, energy, crowd)
//         → GỘP TRỌNG SỐ (chuẩn hoá về 1) → XẾP HẠNG
//         → GIẢI THÍCH + CHẨN ĐOÁN + GỢI Ý NỚI LỎNG (relaxations)
// Hàm thuần (pure function): cùng input → cùng output, dễ kiểm thử.
// ============================================================

const MOODS = ["thoaimai", "happy", "buon", "chan", "stress"];
const MOOD_LABELS = { thoaimai: "Thoải mái", happy: "Vui vẻ", buon: "Hơi buồn", chan: "Chán đổi gió", stress: "Cần xả stress" };

// NGƯỠNG "HỢP" thật sự: moodFit >= 80 mới tính hợp tâm trạng (docs/01 D7)
const MOOD_FIT_THRESHOLD = 80;

// Trọng số mặc định (tổng = 1): tâm trạng định hướng cuộc chơi cuối tuần
const DEFAULT_WEIGHTS = { mood: 0.30, budget: 0.25, time: 0.25, energy: 0.10, crowd: 0.10 };

const COMPONENT_LABELS = {
  mood: "Hợp tâm trạng", budget: "Hợp túi tiền", time: "Hợp thời gian rảnh",
  energy: "Hợp mức năng lượng", crowd: "Hợp mức đông/vắng"
};

// Hằng số gợi ý nới lỏng: bước tăng điều kiện khi không có kết quả
const RELAX_BUDGET_STEP = 50;   // +50k mỗi bước
const RELAX_HOURS_STEP = 2.5;   // +2.5h mỗi bước

function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }

// venue: 'in' | 'out' | 'both' — 'both' luôn qua bộ lọc trong/ngoài trời
function venueMatches(item, wantIndoor) {
  if (wantIndoor == null || item.venue === "both") return true;
  return wantIndoor ? item.venue === "in" : item.venue === "out";
}

// Ước lượng điểm thời gian 0–100 (chấm mềm theo docs/01 D5)
function timeScore(item, freeHours) {
  if (freeHours == null) return 50;
  if (freeHours < item.hoursMin) return 0;
  if (freeHours >= item.hoursMax) return 100;
  const span = Math.max(item.hoursMax - item.hoursMin, 0.5);
  return clamp(60 + 40 * ((freeHours - item.hoursMin) / span), 0, 100);
}

function computeComponents(item, prefs) {
  let budget;
  if (prefs.budget == null) budget = 60;
  else if (item.priceK === 0) budget = 100;
  else if (item.priceK <= prefs.budget) budget = clamp(100 - (item.priceK / prefs.budget) * 50, 50, 100);
  else budget = 0;

  const time = timeScore(item, prefs.freeHours);

  const want = prefs.energy ?? 2;
  const diff = Math.abs(item.energy - want);
  const energy = diff === 0 ? 100 : diff === 1 ? 60 : 20;

  const mood = item.moodFit?.[prefs.mood] ?? 50;

  const wantCrowd = prefs.crowd ?? 2;
  const cd = Math.abs(item.crowdLevel - wantCrowd);
  const crowd = cd === 0 ? 100 : cd === 1 ? 65 : 30;

  return { mood, budget, time, energy, crowd };
}

function resolveWeights(weights) {
  let w = {
    mood: Number(weights?.mood) || 0,
    budget: Number(weights?.budget) || 0,
    time: Number(weights?.time) || 0,
    energy: Number(weights?.energy) || 0,
    crowd: Number(weights?.crowd) || 0
  };
  const sum = Object.values(w).reduce((a, b) => a + b, 0);
  if (!(sum > 0)) w = { ...DEFAULT_WEIGHTS };
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  const norm = {};
  for (const k of Object.keys(w)) norm[k] = w[k] / total;
  return { norm, usedDefault: !(sum > 0) };
}

function buildReasons(item, comps, prefs) {
  const reasons = [];
  if (comps.mood >= MOOD_FIT_THRESHOLD) reasons.push(`Rất hợp tâm trạng "${MOOD_LABELS[prefs.mood]}" đang chọn (${comps.mood}/100)`);
  if (item.priceK === 0) reasons.push("Miễn phí, không tốn đồng nào");
  else if (comps.budget >= 70) reasons.push(`Chi phí ~${item.priceK}k/người — nằm gọn trong ngân sách`);
  if (comps.time === 100 && prefs.freeHours != null) reasons.push(`Vừa khổ thời gian rảnh ${prefs.freeHours}h (cần ${item.hoursMin}–${item.hoursMax}h)`);
  if (prefs.energy != null && Math.abs(item.energy - prefs.energy) === 0) reasons.push(item.energy === 3 ? "Đúng bài tốn sức — xả năng lượng hết mình" : item.energy === 1 ? "Nhẹ nhàng, không cần sức lực" : "Vừa sức, không quá mệt");
  if (item.venue === "both") reasons.push("Linh hoạt cả trong nhà lẫn ngoài trời — không lo thời tiết");
  else if (prefs.indoor != null && (prefs.indoor ? item.venue === "in" : item.venue === "out")) reasons.push(item.venue === "in" ? "Trong nhà, không lo thời tiết" : "Ngoài trời, hít khí trời");
  if (prefs.crowd != null && item.crowdLevel === prefs.crowd && prefs.crowd === 1) reasons.push("Vắng người, yên tĩnh");
  if (prefs.social === "friends" && (item.social === 2 || item.social === 3)) reasons.push("Phù hợp đi cùng nhóm bạn");
  if (prefs.social === "alone" && (item.social === 1 || item.social === 3)) reasons.push("Đi một mình vẫn thoải mái");
  if (prefs.groupSize != null && item.groupMax >= prefs.groupSize) reasons.push(`Chứ được nhóm ${item.groupMin}–${item.groupMax} người`);
  if (prefs.freeHours != null && comps.time === 0) reasons.push("▼ Đánh đổi: cần nhiều thời gian hơn bạn đang có");
  if (prefs.budget != null && item.priceK > prefs.budget) reasons.push(`▼ Đánh đổi: vượt ngân sách (${item.priceK}k > ${prefs.budget}k)`);
  if (comps.mood < MOOD_FIT_THRESHOLD) reasons.push(`▼ Đánh đổi: chưa thật sự hợp tâm trạng "${MOOD_LABELS[prefs.mood]}" (chỉ ${comps.mood}/100)`);
  if (reasons.length === 0) reasons.push("Cân bằng ở mức trung bình trên mọi tiêu chí");
  return reasons.slice(0, 4);
}

/**
 * recommend(catalog, prefs) → { results, eliminated, remaining, total, fallback, matched }
 * prefs: { mood, budget, freeHours, indoor, energy, social, crowd, groupSize, weights }
 *   indoor: true (trong nhà) | false (ngoài trời) | null (tuỳ)
 *   social: 'alone' | 'friends' | 'anyone'
 */
function recommend(catalog, prefs) {
  const SOCIAL_NUM = { alone: 1, friends: 2, anyone: null };
  const socialNum = prefs.social == null ? null : (SOCIAL_NUM[prefs.social] ?? null);
  const wantVenue = prefs.indoor == null ? null : (prefs.indoor === "true" ? true : prefs.indoor === "false" ? false : prefs.indoor);

  // Bộ lọc cứng tuần tự, ghi số loại từng tầng (chẩn đoán BR-4)
  const filters = [
    { key: "budget",  label: "Ngân sách",     test: (it) => prefs.budget == null || it.priceK <= prefs.budget },
    { key: "freeHours", label: "Thời gian rảnh", test: (it) => prefs.freeHours == null || it.hoursMin <= prefs.freeHours },
    { key: "indoor",  label: "Trong/ngoài trời", test: (it) => venueMatches(it, wantVenue) },
    { key: "energy",  label: "Mức năng lượng", test: (it) => prefs.energy == null || Math.abs(it.energy - prefs.energy) <= 1 },
    { key: "social",  label: "Hình thức đi",  test: (it) => socialNum == null || it.social === 3 || it.social === socialNum },
    { key: "groupSize", label: "Quy mô nhóm", test: (it) => prefs.groupSize == null || (it.groupMax >= prefs.groupSize && it.groupMin <= prefs.groupSize) }
  ];

  let pool = catalog.slice();
  const eliminated = filters.map((f) => {
    const before = pool.length;
    pool = pool.filter((it) => f.test(it));
    return { key: f.key, label: f.label, count: before - pool.length };
  });

  const { norm: weights } = resolveWeights(prefs.weights || {});

  const results = pool
    .map((item) => {
      const comps = computeComponents(item, prefs);
      const score = Object.keys(weights).reduce((s, k) => s + weights[k] * comps[k], 0);
      return {
        item,
        score: Math.round(score * 100) / 100,
        breakdown: { comps, weights },
        reasons: buildReasons(item, comps, prefs)
      };
    })
    .sort((a, b) =>
      b.score - a.score ||
      a.item.priceK - b.item.priceK ||
      a.item.name.localeCompare(b.item.name)
    );

  const anyMood = pool.some((it) => (it.moodFit?.[prefs.mood] ?? 50) >= MOOD_FIT_THRESHOLD);
  const fallback = pool.length > 0 && !anyMood;
  const matched = results.filter((x) => (x.item.moodFit?.[prefs.mood] ?? 50) >= MOOD_FIT_THRESHOLD).length;
  return { results, eliminated, remaining: pool.length, total: catalog.length, fallback, matched };
}

// ------------------------------------------------------------
// CHẨN ĐOÁN + GỢI Ý NỚI LỎNG (BR-4) — hàm thuần, test được
// Đầu vào: catalog + prefs hiện tại (không có/khó có kết quả).
// Đầu ra: { topBlocks: [ {label, count} ], relaxations: [ {
//   field, title, subtitle, detail, unlock, nextPrefs } ] }
// Mỗi phương án nới lỏng đều kèm nextPrefs — bấm là áp dụng được ngay.
// ------------------------------------------------------------
function suggestRelaxations(catalog, prefs) {
  const wantVenue = prefs.indoor == null ? null : (prefs.indoor === "true" ? true : prefs.indoor === "false" ? false : prefs.indoor);
  const base = recommend(catalog, prefs);
  const topBlocks = [...base.eliminated].sort((a, b) => b.count - a.count).slice(0, 2);

  const out = [];
  const mk = (field, value, title, subtitle, detail, unlock) => ({
    field, title, subtitle, detail, unlock, nextPrefs: { ...prefs, [field]: value }
  });

  // Tính mức tăng TỐI THIỂU thật: duyệt các mức giá có trong dữ liệu (tăng dần),
  // chọn mức nhỏ nhất mở khoá thêm lựa chọn — đúng thông điệp "mức tăng tối thiểu".
  if (prefs.budget != null) {
    const levels = [...new Set(catalog.map((it) => it.priceK))].filter((v) => v > prefs.budget).sort((a, b) => a - b);
    for (const lv of levels) {
      const r = recommend(catalog, { ...prefs, budget: lv });
      if (r.remaining > base.remaining) {
        out.push(mk("budget", lv,
          `Tăng ngân sách lên ${lv}k`,
          lv - prefs.budget <= 50 ? "Đủ cho set trà đồ hoặc board game ấm cúng trong nhà" : "Mở thêm nhóm ngoài trời, di chuyển xa hơn",
          `Điều kiện 「Ngân sách ≤ ${prefs.budget}k」 đang chặn nhiều lựa chọn nhất`, `+${r.remaining - base.remaining} chỗ`));
        break;
      }
    }
  }

  // Tương tự với thời gian: mức nhỏ nhất trong dữ liệu mở thêm lựa chọn
  if (prefs.freeHours != null && out.length < 2) {
    const levels = [...new Set(catalog.map((it) => it.hoursMin))].filter((v) => v > prefs.freeHours).sort((a, b) => a - b);
    for (const lv of levels) {
      const r = recommend(catalog, { ...prefs, freeHours: lv });
      if (r.remaining > base.remaining) {
        out.push(mk("freeHours", lv,
          `Nới thời gian lên ${lv} tiếng`,
          "Tranh thủ thêm 1 buổi, đủ trọn vẹn một trải nghiệm dài không lo vội",
          `Điều kiện 「Thời gian rảnh ≥ ${prefs.freeHours}h」 đang chặn`, `+${r.remaining - base.remaining} chỗ`));
        break;
      }
    }
  }

  if (prefs.energy != null && prefs.energy < 2 && out.length < 2) {
    const r = recommend(catalog, { ...prefs, energy: null });
    if (r.remaining > base.remaining) {
      out.push(mk("energy", null,
        "Bỏ giới hạn năng lượng",
        "Kể cả hoạt động tốn sức — cơ thể sẽ tự biết giới hạn",
        "Bộ lọc năng lượng đang thu hẹppool đáng kể", `+${r.remaining - base.remaining} chỗ`));
    }
  }

  if (wantVenue != null && out.length < 2) {
    const r = recommend(catalog, { ...prefs, indoor: null });
    if (r.remaining > base.remaining) {
      out.push(mk("indoor", null,
        wantVenue === true ? "Cho phép cả ngoài trời" : "Cho phép cả trong nhà",
        "Không khí ngày mai có thể đổi — linh hoạt hơn",
        "Bộ lọc trong/ngoài trời đang loại nhiều lựa chọn", `+${r.remaining - base.remaining} chỗ`));
    }
  }

  return { topBlocks, relaxations: out.slice(0, 2), base };
}

// Xuất cho cả Node và trình duyệt
if (typeof module === "object" && module.exports) {
  module.exports = { recommend, computeComponents, timeScore, resolveWeights, suggestRelaxations, DEFAULT_WEIGHTS, COMPONENT_LABELS, MOODS, MOOD_LABELS, MOOD_FIT_THRESHOLD, RELAX_BUDGET_STEP, RELAX_HOURS_STEP };
} else {
  window.RECOMMENDER = { recommend, computeComponents, timeScore, resolveWeights, suggestRelaxations, DEFAULT_WEIGHTS, COMPONENT_LABELS, MOODS, MOOD_LABELS, MOOD_FIT_THRESHOLD, RELAX_BUDGET_STEP, RELAX_HOURS_STEP };
}
