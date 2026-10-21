# ② BẢNG KIỂM THỬ CÓ KẾT QUẢ THẬT (11 ca — tối thiểu yêu cầu là 5)

> Cách chạy: `node test.js` (không cần cài thêm gì). Mọi số liệu dưới đây là output thật.

## Vòng 1 — lần chạy đầu tiên của chủ đề mới (nguyên văn console)

```
========================================================
KẾT QUẢ KIỂM THỬ — gợi ý hoạt động cuối tuần
========================================================
  ✗ C5 → kỳ vọng fallback=true với 5 mẫu (max moodFit=75), thực tế fallback=false, remaining=6
  ✗ C9 → reasons rỗng (main=true) hoặc kết quả fallback thiếu cảnh báo ▼ (warn=false)
--------------------------------------------------------
Tổng: 10 ca | Đạt: 8 | Trượt: 2
```

## Vòng 2 — sau khi thêm MOOD_FIT_THRESHOLD = 80 (nguyên văn console)

```
========================================================
KẾT QUẢ KIỂM THỬ — gợi ý hoạt động cuối tuần
========================================================
--------------------------------------------------------
Tổng: 10 ca | Đạt: 10 | Trượt: 0
```

## Vòng 3 — sau khi thêm ca C11 phủ lỗ hổng social (nguyên văn console)

```
========================================================
KẾT QUẢ KIỂM THỬ — gợi ý hoạt động cuối tuần
========================================================
--------------------------------------------------------
Tổng: 11 ca | Đạt: 11 | Trượt: 0
```

## Bảng 11 ca kiểm thử

| # | Tên ca | "Khó" ở đâu | V1 | V2 | V3 |
|---|--------|-------------|:---:|:---:|:---:|
| C1 | Biên ngân sách 300k | Hoạt động giá **đúng bằng** ngân sách (đi biển 300k) phải được giữ — bắt lỗi `<` thay `<=` | ✅ | ✅ | ✅ |
| C2 | Budget "loe ngang" 40k | Khoảng trống giá 20k→60k: phải còn đúng 3 hoạt động (ngủ bù, dọn nhà, đạp xe) — kỳ vọng liệt kê id cụ thể | ✅ | ✅ | ✅ |
| C3 | Xung đột: ngoài trời + nhẹ nhàng | Mọi hoạt động ngoài trời tốn sức ≥2; nhờ lọc mềm 1 bậc (D6) còn đúng 1 mẫu: chợ đêm | ✅ | ✅ | ✅ |
| C4 | Rỗng thật: rảnh 0.5h | Không hoạt động nào cần ≤0.5h → rỗng + đủ 5 dòng chẩn đoán, bộ lọc thời gian loại 17/17 | ✅ | ✅ | ✅ |
| C5 | Fallback tâm trạng "chán" + ngoài trời + tốn sức | 6 mẫu còn lại đều moodFit["chan"] < 80 → PHẢI bật cờ fallback, không im lặng | ❌ code dùng ngưỡng 70 | ✅ | ✅ |
| C6 | Slider tâm trạng cực đoan = 5 | Đi biển (moodFit happy 95) phải top 1; các tiêu chí khác bị bỏ trọn | ✅ | ✅ | ✅ |
| C7 | Mọi slider = 0 | Chống chia 0/NaN: rơi về mặc định, usedDefault=true, trọng số chuẩn hoá tổng=1 | ✅ | ✅ | ✅ |
| C8 | Bất biến | Budget 100k → không kết quả nào vượt; điểm ∈ [0,100] hữu hạn; hoà điểm → rẻ trước | ✅ | ✅ | ✅ |
| C9 | Lý do giải thích | Mọi kết quả có ≥1 lý do; kết quả fallback phải có ▼ | ❌ ▼ chưa cài theo ngưỡng | ✅ | ✅ |
| C10 | Toán học timeScore (hàm thuần) | Thiếu giờ=0 · dư giờ=100 · giữa min–max≈66.67 · không khai báo=50 | ✅ | ✅ | ✅ |
| C11 | Lọc hình thức đi | Bug thật (BUG-4): 'friends' so với số social không khớp → sinh ca phủ nhánh; kỳ vọng id cụ thể cho 'alone'+20k | — | — | ✅ |

## Bằng chứng bổ sung — kiểm thử giao diện thật trên preview

| Kịch bản | Kết quả quan sát được |
|---|---|
| Vui vẻ + 100k + 4h + cùng bạn bè | 3 kết quả, top 1 = **Đạp xe công viên** |
| Chán + ngoài trời + tốn sức + cùng bạn | Banner ⚠ fallback + 6 kết quả, top 1 = **Trekking/leo núi** (đúng số liệu test C5/C11) |
| Rảnh 0.5h | Banner đỏ + chẩn đoán «Thời gian rảnh: loại 17 · … → nới lỏng Thời gian rảnh trước» |

> Lưu ý trung thực: lần verify UI đầu, kịch bản cùng-bạn trả **3 kết quả thay vì 6** — đó là BUG-4 (docs/03), một lỗi test không bắt được. Verify trên UI thật có giá trị riêng, không thay thế được bằng test tự động.
