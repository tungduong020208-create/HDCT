# ⑤ BẢN CẢI TIẾN KÈM LÝ DO CHỌN SỬA

> Khác mục ③: ③ ghi **lỗi kỹ thuật**; mục này ghi **những gì thay đổi giữa các phiên bản** và **vì sao chọn sửa cái này thay vì cái khác**.

## A. Cải tiến đã thực hiện

### A1. Cảnh báo fallback khi không còn hoạt động hợp tâm trạng ⭐
- **Dữ liệu đến từ:** ca C5 vòng 1 (docs/02) — BUG-1, BUG-2 (docs/03).
- **Chọn sửa:** cờ `fallback` + ngưỡng `MOOD_FIT_THRESHOLD = 80` + banner ⚠ + dòng ▼ từng kết quả.
- **Bỏ:** (a) trả rỗng luôn — vô dụng, người dùng không biết nới điều kiện nào; (b) tự nới điều kiện thay người dùng — tool tự quyết; (c) ngưỡng 70 — "không tệ" không phải "hợp".
- **Lý do cuối:** cảnh báo giữ quyền quyết định cho người dùng, tool vẫn trung thực về giới hạn.

### A2. Chẩn đoán khi kết quả rỗng
- **Dữ liệu đến từ:** ca C4.
- **Chọn sửa:** lõi trả `eliminated` (số mẫu bị loại từng bộ lọc), UI chỉ điểm bộ lọc loại nhiều nhất: *"nên nới lỏng Thời gian rảnh trước (đang loại 17 hoạt động)"*.
- **Bỏ:** hiện thô 5 con số không trọng tâm.

### A3. Lý do giải thích cho từng kết quả
- **Chọn sửa:** tối đa 4 lý do/kết quả, phân biệt lý do cộng (+) và đánh đổi (▼); nút mở breakdown 5 thành phần × trọng số.
- **Bỏ:** hiển thị bảng số học thô cho người dùng thường.

### A4. Chuẩn hoá hình thức đi + ca phủ nhánh (sinh ra từ bug thật)
- **Dữ liệu đến từ:** BUG-4 (docs/03) — bị bắt khi verify UI thật, test tự động thời điểm đó không bắt được.
- **Chọn sửa:** `SOCIAL_NUM` chuẩn hoá 1 lần ở đầu lõi + sinh ca C11 phủ cả 2 nhánh friends/alone.
- **Bỏ:** sửa lỏn lẻn từng chỗ so sánh — phải chuẩn hoá ở **một điểm** để không tái phát.

### A5. Nâng UI theo thiết kế Stitch 4 màn hình — số liệu vẫn từ lõi thật ⭐
- **Nguồn:** học viên cung cấp thiết kế (Stitch) + yêu cầu "chép y chang".
- **Chọn sửa:** SPA 4 màn (Gợi ý xếp hạng có hero card + score badge · Chi tiết điểm đến với "Tại sao dành cho bạn" + khung giờ vàng · Chẩn đoán thông minh với thanh "bộ lọc loại nhiều nhất" + thẻ nới lỏng có nút Áp dụng · Đã lưu), bottom nav 3 tab, Smart Presets một chạm. Mọi con số (điểm /100, moodFit, +N chỗ, "Tìm thấy 2/18") đều render từ lõi thật — không hard-code (docs/01 D11).
- **Sinh ra 2 cải tiến logic thật:** (a) `suggestRelaxations()` gợi ý nới lỏng mức tối thiểu thật từ dữ liệu (D12) + ca C12; (b) venue 3 trạng thái + quy mô nhóm (D13).
- **Bỏ:** copy ảnh tĩnh / hard-code số liệu cho giống ảnh.

### A6. Cảnh báo fallback lên cả dòng trạng thái
- **Nguồn:** tự rà khi clone màn 1 — thiết kế chỉ có trạng thái xanh "100% khớp ràng buộc" nhưng khi `matched=0` (còn kết quả, không cái hợp tâm trạng) hiện như thường là thiếu trung thực (vi phạm BR-5).
- **Chọn sửa:** 3 trạng thái dòng status: xanh (có match) / ⚠ cam (fallback — kèm nút "nới lỏng →") / đỏ (rỗng — kèm "xem chẩn đoán →").

## B. Hàng chờ — sẽ sửa sau khi có phản hồi người dùng (mục ④)

| # | Đề xuất | Nguồn | Đã chọn sửa chưa | Vì sao (chưa) |
|---|---|---|---|---|
| 1 | Lọc theo khung giờ trong ngày (sáng/chiều/tối — dữ liệu đã có sẵn `bestHours`) | dự đoán của nhóm | ⬜ | Chờ phản hồi thật; dữ liệu đã chuẩn bị sẵn nên sửa nhanh khi cần |
| 2 | Gợi ý tổ hợp 2–3 hoạt động thành "kế hoạch cả ngày" | dự đoán của nhóm | ⬜ | |
| 3 | Lưu lịch sử lựa chọn để gợi ý cái mới, tránh lặp | dự đoán của nhóm | ⬜ | |

> Quy tắc với hàng chờ: **mỗi đề xuất phải có nguồn và lý do chọn sửa/không sửa** — đúng tinh thần "sửa phải có lý do" của tiêu chí.
