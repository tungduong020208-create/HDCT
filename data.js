// ============================================================
// DỮ LIỆU MẪU — Hoạt động cuối tuần (đơn vị tiền: nghìn đồng/người)
// LƯU Ý: dữ liệu mô phỏng phục vụ bài học; giá/địa điểm cần thay bằng
// số liệu tra thực tế và ghi nguồn vào docs/06 khi nộp chính thức.
// Trường dữ liệu:
//   id, name, category, emoji — định danh + hiển thị
//   priceK (nghìn)            — chi phí đại diện 1 người (0 = miễn phí)
//   priceRange [min,max]      — khoảng giá hiển thị (tuỳ chọn)
//   hoursMin, hoursMax        — thời lượng phù hợp (giờ)
//   venue                     — 'in' (trong nhà) | 'out' (ngoài trời) | 'both' (cả hai)
//   energy                    — 1 nhẹ · 2 trung bình · 3 tốn sức
//   social                    — một mình (1) · với bạn bè (2) · cả hai được (3)
//   groupMin, groupMax        — quy mô nhóm phù hợp
//   location                  — địa điểm (mô phỏng)
//   bestHours                 — khung giờ tốt nhất: sang | chieu | toi
//   goldenHour                — chuỗi khung giờ vàng hiển thị (tuỳ chọn)
//   tags, moodFit, crowdLevel — như trước; moodFit có thêm mức 'stress'
// ============================================================

const CATALOG = [
  { id: "ca-phe-sach-ho",     name: "Cà phê sách & dạo bộ hồ hoàng hôn", category: "Thư giãn & Văn hoá", emoji: "☕", priceK: 60, priceRange: [45, 80], hoursMin: 2.5, hoursMax: 3.5, venue: "both", energy: 1, social: 3, groupMin: 1, groupMax: 3, location: "Bờ Hồ Tây & Đường Láng Yên, Hà Nội", bestHours: "chieu", goldenHour: "16:45 – 17:45", tags: ["thugian", "vanhoa"], crowdLevel: 1,
    moodFit: { thoaimai: 88, happy: 65, buon: 85, chan: 70, stress: 95 } },
  { id: "ngu-trua",          name: "Ngủ bù cả buổi",              category: "Nghỉ ngơi",      emoji: "🛏️", priceK: 0,   hoursMin: 2,  hoursMax: 5,  venue: "in",  energy: 1, social: 1, bestHours: "chieu", tags: ["nghingoi", "om"], crowdLevel: 1, moodFit: { thoaimai: 90, happy: 40, buon: 80, chan: 85 } },
  { id: "xem-phim-nha",      name: "Xem phim ở nhà",              category: "Nghỉ ngơi",      emoji: "🎬", priceK: 60,  hoursMin: 2,  hoursMax: 4,  venue: "in",  energy: 1, social: 3, bestHours: "toi", tags: ["nghingoi", "giaitri"], crowdLevel: 1, moodFit: { thoaimai: 85, happy: 75, buon: 75, chan: 80 } },
  { id: "doc-sach-cafe",     name: "Đọc sách ở cafe",             category: "Nghỉ ngơi",      emoji: "📚", priceK: 80,  hoursMin: 1,  hoursMax: 3,  venue: "in",  energy: 1, social: 1, bestHours: "sang", tags: ["nghingoi", "chantoi"], crowdLevel: 2, moodFit: { thoaimai: 80, happy: 55, buon: 70, chan: 75 } },
  { id: "cafe-choi-ban",     name: "Cà phê trò chuyện",           category: "Xã giao",        emoji: "☕", priceK: 70,  hoursMin: 1,  hoursMax: 3,  venue: "in",  energy: 2, social: 2, bestHours: "chieu", tags: ["xagiao", "chantoi"], crowdLevel: 2, moodFit: { thoaimai: 65, happy: 80, buon: 65, chan: 70 } },
  { id: "an-quan-moi",       name: "Săn quán ăn mới",             category: "Ẩm thực",        emoji: "🍜", priceK: 150, hoursMin: 1,  hoursMax: 3,  venue: "in",  energy: 2, social: 3, bestHours: "chieu", tags: ["amthuc", "chantoi", "xagiao"], crowdLevel: 3, moodFit: { thoaimai: 70, happy: 90, buon: 60, chan: 80 } },
  { id: "bbai-bien",         name: "Đi biển",                     category: "Ngoài trời",     emoji: "🌊", priceK: 300, hoursMin: 4,  hoursMax: 8,  venue: "out", energy: 3, social: 3, bestHours: "sang", tags: ["dungoai", "happy"], crowdLevel: 3, moodFit: { thoaimai: 70, happy: 95, buon: 70, chan: 60 } },
  { id: "leo-nui",           name: "Trekking / leo núi",          category: "Ngoài trời",     emoji: "⛰️", priceK: 250, hoursMin: 5,  hoursMax: 10, venue: "out", energy: 3, social: 2, bestHours: "sang", tags: ["dungoai", "thethao"], crowdLevel: 2, moodFit: { thoaimai: 50, happy: 85, buon: 55, chan: 75 } },
  { id: "dap-xe",            name: "Đạp xe công viên",            category: "Thể thao",       emoji: "🚲", priceK: 20,  hoursMin: 1,  hoursMax: 3,  venue: "out", energy: 3, social: 3, bestHours: "sang", tags: ["thethao", "dungoai"], crowdLevel: 2, moodFit: { thoaimai: 60, happy: 80, buon: 60, chan: 70 } },
  { id: "bong-da",           name: "Đá bóng với nhóm bạn",        category: "Thể thao",       emoji: "⚽", priceK: 50,  hoursMin: 2,  hoursMax: 3,  venue: "out", energy: 3, social: 2, bestHours: "chieu", tags: ["thethao", "xagiao"], crowdLevel: 2, moodFit: { thoaimai: 45, happy: 90, buon: 50, chan: 65 } },
  { id: "gym",               name: "Tập gym / yoga",              category: "Thể thao",       emoji: "🏋️", priceK: 80,  hoursMin: 1,  hoursMax: 2,  venue: "in",  energy: 3, social: 1, bestHours: "sang", tags: ["thethao", "chantoi"], crowdLevel: 2, moodFit: { thoaimai: 55, happy: 70, buon: 75, chan: 70 } },
  { id: "cho-dem",           name: "Chợ đêm / phố đi bộ",         category: "Xã giao",        emoji: "🏮", priceK: 200, hoursMin: 2,  hoursMax: 4,  venue: "out", energy: 2, social: 2, bestHours: "toi", tags: ["xagiao", "amthuc", "giaitri"], crowdLevel: 3, moodFit: { thoaimai: 65, happy: 85, buon: 60, chan: 75 } },
  { id: "karaoke",           name: "Karaoke với bạn",             category: "Giải trí",       emoji: "🎤", priceK: 150, hoursMin: 2,  hoursMax: 4,  venue: "in",  energy: 2, social: 2, bestHours: "toi", tags: ["giaitri", "xagiao"], crowdLevel: 3, moodFit: { thoaimai: 55, happy: 90, buon: 55, chan: 70 } },
  { id: "board-game",        name: "Board game café",             category: "Giải trí",       emoji: "🎲", priceK: 100, hoursMin: 2,  hoursMax: 4,  venue: "in",  energy: 2, social: 2, bestHours: "chieu", tags: ["giaitri", "xagiao", "chantoi"], crowdLevel: 2, moodFit: { thoaimai: 65, happy: 80, buon: 70, chan: 75 } },
  { id: "bao-tang",          name: "Bảo tàng / triển lãm",        category: "Văn hoá",        emoji: "🏛️", priceK: 60,  hoursMin: 2,  hoursMax: 3,  venue: "in",  energy: 2, social: 3, bestHours: "sang", tags: ["vanhoa", "chantoi"], crowdLevel: 2, moodFit: { thoaimai: 60, happy: 60, buon: 75, chan: 70 } },
  { id: "hoc-moi",           name: "Lớp học nấu ăn / vẽ",         category: "Văn hoá",        emoji: "🎨", priceK: 250, hoursMin: 2,  hoursMax: 3,  venue: "in",  energy: 2, social: 3, bestHours: "chieu", tags: ["vanhoa", "chantoi", "kinhnghiem"], crowdLevel: 2, moodFit: { thoaimai: 50, happy: 75, buon: 70, chan: 85 } },
  { id: "tram-chieu",        name: "Trà chiều + ngắm phố",        category: "Cafe & Chill",   emoji: "🫖", priceK: 100, hoursMin: 1.5, hoursMax: 3, venue: "in", energy: 1, social: 2, groupMin: 2, groupMax: 4, location: "Café ven kênh & khu phố cổ", bestHours: "chieu", tags: ["thugian", "xagiao"], crowdLevel: 2, moodFit: { thoaimai: 86, happy: 78, buon: 84, chan: 74, stress: 90 } },
  { id: "lam-banh",          name: "Lớp làm bánh & uống trà",     category: "Workshop",       emoji: "🍰", priceK: 200, hoursMin: 2, hoursMax: 4, venue: "in", energy: 2, social: 2, groupMin: 2, groupMax: 6, location: "Workshop Hà Nội & Kim Mã", bestHours: "chieu", tags: ["vanhoa", "xagiao"], crowdLevel: 2, moodFit: { thoaimai: 72, happy: 82, buon: 68, chan: 74, stress: 70 } },
  { id: "ve-tranh",          name: "Vẽ tranh + nghe nhạc chill",  category: "Sáng tạo",      emoji: "🎨", priceK: 140, hoursMin: 2, hoursMax: 4, venue: "in", energy: 1, social: 1, groupMin: 1, groupMax: 2, location: "Studio vẽ & quán cafe góc phố", bestHours: "chieu", tags: ["thugian", "vanhoa"], crowdLevel: 1, moodFit: { thoaimai: 88, happy: 72, buon: 80, chan: 77, stress: 89 } },
  { id: "rap-phim",          name: "Xem phim chiếu rạp",          category: "Giải trí",       emoji: "🎟️", priceK: 120, hoursMin: 2, hoursMax: 3, venue: "in", energy: 1, social: 3, groupMin: 1, groupMax: 4, location: "Rạp phim gần khu bạn sống", bestHours: "toi", tags: ["giaitri", "thugian"], crowdLevel: 2, moodFit: { thoaimai: 82, happy: 80, buon: 76, chan: 78, stress: 86 } },
  { id: "nau-nha",           name: "Bếp nhóm ở nhà",              category: "Ẩm thực",        emoji: "🍲", priceK: 180, hoursMin: 2, hoursMax: 4, venue: "in", energy: 2, social: 3, groupMin: 3, groupMax: 8, location: "Nhà bạn & bếp chung", bestHours: "toi", tags: ["amthuc", "xagiao"], crowdLevel: 2, moodFit: { thoaimai: 68, happy: 88, buon: 62, chan: 72, stress: 80 } },
  { id: "doc-sach-thu-gian", name: "Đọc sách + uống trà",       category: "Nghỉ ngơi",      emoji: "📖", priceK: 90, hoursMin: 1.5, hoursMax: 3, venue: "in", energy: 1, social: 1, groupMin: 1, groupMax: 2, location: "Quán sách & cafe nhỏ", bestHours: "sang", tags: ["nghingoi", "thugian"], crowdLevel: 1, moodFit: { thoaimai: 90, happy: 60, buon: 82, chan: 81, stress: 93 } },
  { id: "don-nha",           name: "Dọn nhà + sắp lại góc học tập", category: "Việc nhà",     emoji: "🧹", priceK: 0,   hoursMin: 2,  hoursMax: 4,  venue: "in",  energy: 3, social: 1, bestHours: "sang", tags: ["vinhanga", "chantoi"], crowdLevel: 1, moodFit: { thoaimai: 40, happy: 45, buon: 60, chan: 80 } },
  { id: "du-lich-gan",       name: "Du lịch gần 1 ngày",          category: "Ngoài trời",     emoji: "🚗", priceK: 600, hoursMin: 8,  hoursMax: 12, venue: "out", energy: 3, social: 3, bestHours: "sang", tags: ["dungoai", "kinhnghiem", "xagiao"], crowdLevel: 3, moodFit: { thoaimai: 60, happy: 90, buon: 65, chan: 70 } }
];

// Điền giá trị mặc định nhất quán (không khai báo rõ ở từng mẫu):
// - moodFit.stress ≈ tổng hợp "thoải mái" + "hơi buồn" (trừ khi khai báo sẵn)
// - groupMin/groupMax theo hình thức đi
for (const it of CATALOG) {
  if (it.moodFit.stress == null) {
    it.moodFit.stress = Math.round(it.moodFit.thoaimai * 0.5 + it.moodFit.buon * 0.5);
  }
  if (it.groupMin == null) {
    const g = { 1: [1, 2], 2: [2, 8], 3: [1, 8] }[it.social];
    it.groupMin = g[0]; it.groupMax = g[1];
  }
  if (it.priceRange == null) it.priceRange = [it.priceK, it.priceK];
}

// Địa điểm mô phỏng (điền sau khi đã có name/location riêng cho mẫu flagship)
const MOCK_LOCATIONS = {
  "ngu-trua": "Tại nhà bạn", "xem-phim-nha": "Tại nhà bạn", "doc-sach-cafe": "Phố_BOOK & Nguyễn Xí, Hà Nội",
  "cafe-choi-ban": "Quang Trung & Trịnh Hoài Đức", "an-quan-moi": "Khu Ẩm thực Hoàng Quốc Việt", "bbai-bien": "Bãi tắm đông, Đồ Sơn / Sầm Sơn",
  "leo-nui": "Núi Trầm & Tân Triều", "dap-xe": "Công viên hồ Tây & đường和 sustainability", "bong-da": "Sân Goaly Nam An & Mỹ Đình",
  "gym": "Phòng tập quanh khu bạn ở", "cho-dem": "Phố đi bộ Hồ Gươm & chợ đêm", "karaoke": "Karaok-quanh Đại học Bách Khoa",
  "board-game": "Board Game Cafe Xa Đàn", "bao-tang": "Bảo tàng Hà Nội & VCCA", "hoc-moi": "Workshop phố твор Trúc Bạch",
  "don-nha": "Tại nhà bạn", "du-lich-gan": "Tam Cốc – Tràng An / đồi chè Mộc Châu"
};
for (const it of CATALOG) {
  if (!it.location) it.location = MOCK_LOCATIONS[it.id] || "Quanh khu vực bạn ở";
}

// Dùng cho cả Node (kiểm thử) và trình duyệt (giao diện)
if (typeof module === "object" && module.exports) {
  module.exports = { CATALOG };
} else {
  window.CATALOG_DATA = { CATALOG };
}
