# BUỔI 1 — YÊU CẦU BÀI HỌC (nguyên văn do học viên cung cấp)

> Lưu nguyên văn ngày 25/09/2026. Đây là nguồn chuẩn cho toàn bộ project.

## Nội dung gốc

đây là bài học của tôi theo những tiêu chí này ① Sản phẩm
01 công cụ gợi ý nhiều điều kiện, có xếp hạng rõ và ca kiểm thử khó.
② Năng lực
Tạo công cụ gợi ý với nhiều điều kiện
③ Mức độ tự chủ
Mức hỗ trợ: Tự chọn phương án và giải thích lý do; tự chốt phạm vi trong khung coach đưa ra.
④ Bằng chứng
Tiêu chí + dữ liệu + logic + ca thử + sửa.
HỒ SƠ NỘP CUỐI PROJECT — 6 MỤC, KHÔNG CHỈ SẢN PHẨM CUỐI
① Nhật ký quyết định thiết kế: chọn gì, bỏ gì, vì sao  ·  ② Bảng kiểm thử có kết quả thật, tối thiểu 5 ca  ·  ③ Nhật ký lỗi: lỗi – nguyên nhân – cách đã sửa  ·  ④ Phản hồi nguyên văn của ít nhất 3 người dùng thật  ·  ⑤ Bản cải tiến kèm lý do chọn sửa  ·  ⑥ Phiếu phản tư + Tiêu chí + dữ liệu + logic + ca thử + sửa.

## Làm rõ giữa buổi (bổ sung của học viên)

> *"nội dung buổi 1 là cuối tuần có những lựa chọn nào vd: đi chơi, ở nhà ngủ, hoặc đi thể thao …."*

→ Chủ đề được chốt: **công cụ gợi ý hoạt động cuối tuần** (đi chơi, ở nhà nghỉ ngơi, thể thao, giải trí…). Bản nháp đầu hiểu nhầm thành gợi ý laptop đã được thay toàn bộ chủ đề; kiến trúc + phương pháp giữ nguyên. Chi tiết lỗi này ghi docs/03 BUG-0.

## Đối chiếu hiện trạng (đã áp dụng đến đâu)

| Yêu cầu | Áp dụng ở đâu | Trạng thái |
|---|---|---|
| ① Công cụ gợi ý nhiều điều kiện, xếp hạng rõ, ca thử khó | `recommender.js` (5 ràng buộc cứng + 5 thành phần điểm); 11 ca thử gồm các ca biên/xung đột/rỗng/cực đoan | ✅ |
| ② Năng lực: tạo công cụ gợi ý nhiều điều kiện | Toàn bộ project + demo `dist.html` | ✅ |
| ③ Tự chọn phương án + lý do; tự chốt phạm vi trong khung coach | docs/01 (10 quyết định đều có "bỏ gì, vì sao"); phạm vi: web 1 trang, lõi tách riêng | ✅ |
| ④ Bằng chứng: tiêu chí + dữ liệu + logic + ca thử + sửa | docs/06 bảng đối chiếu; data.js 17 hoạt động; test.js 11 ca, 3 vòng (8/10 → 10/10 → 11/11); docs/03 7 lỗi | ✅ |
| Hồ sơ ① | docs/01 | ✅ |
| Hồ sơ ② | docs/02 | ✅ |
| Hồ sơ ③ | docs/03 | ✅ |
| Hồ sơ ④ | docs/04 — **chờ học viên thu thập phản hồi 3 người dùng thật** | ⬜ cần bạn làm |
| Hồ sơ ⑤ | docs/05 (4 cải tiến + hàng chờ) | ✅ (cập nhật tiếp sau khi có phản hồi) |
| Hồ sơ ⑥ | docs/06 | ✅ (điền tiếp sau buổi cuối) |
