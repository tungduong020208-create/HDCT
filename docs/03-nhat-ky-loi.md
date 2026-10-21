# ③ NHẬT KÝ LỖI

> Ghi theo mẫu: **Lỗi → Nguyên nhân → Đã sửa ra sao**. 7 lỗi thực tế của project.

## BUG-0 — Hiểu nhầm đề: dựng cả project cho sai chủ đề ⭐ (lỗi lớn nhất)
- **Lỗi:** Bản nháp đầu xây **công cụ gợi ý laptop** đầy đủ (logic + 10 test pass + UI + hồ sơ), trong khi đề buổi 1 là **hoạt động cuối tuần** (đi chơi, ở nhà ngủ, thể thao…).
- **Nguyên nhân:** Lúc khởi tạo, coach hỏi 3 câu chốt đề (chủ đề, hình thức, mức hỗ trợ) — học viên bỏ qua tất cả; coach tự chốt theo phán đoán nhưng đo sai chủ đề. Học viên dùng từ "bài học/tiêu chí" thay vì nói thẳng nội dung buổi học.
- **Đã sửa:** Giữ kiến trúc và phương pháp (đúng phần "khung" của bài), **thay toàn bộ chủ đề**: dữ liệu, điều kiện, thành phần điểm, UI, hồ sơ. Ghi vào tiến trình làm việc quy ước mới: **mỗi buổi học phải lưu nguyên văn trước khi áp dụng** (`buoi-hoc/`).
- **Bài học:** phạm vi/chủ đề là quyết định đắt nhất — chốt sai thì mọi việc sau đều làm lại. Khi đề mơ hồ, hỏi **trước** khi code là bắt buộc, dù có bị coi là làm chậm.

## BUG-1 — Fallback định nghĩa theo "hình thức đi" thành dead code
- **Lỗi:** Bản nháp fallback kiểm tra "còn kết quả nhưng không mẫu nào hợp hình thức đi" — nhưng hình thức đi **đã bị bộ lọc cứng loại trước**, nên cờ không bao giờ bật.
- **Nguyên nhân:** Viết fallback sau khi viết bộ lọc, không rà lại pipeline xem thuộc tính nào còn sống tới bước chấm điểm.
- **Đã sửa:** Đổi định nghĩa fallback sang thuộc tính **không có bộ lọc cứng riêng**: "không hoạt động nào hợp tâm trạng (moodFit ≥ ngưỡng)". Đúng cả ngữ nghĩa người dùng: bị gợi ý hoạt động không hợp tâm trạng mà không được báo là nguy hiểm hơn rỗng.

## BUG-2 — Ngưỡng "hợp tâm trạng" lệch nhau giữa thiết kế (80) và code (70)
- **Lỗi:** Vòng 1 chủ đề mới: C5/C9 trượt — code so moodFit ≥ 70, trong khi thiết kế chốt "hợp thật sự" là ≥ 80.
- **Nguyên nhân:** Thiết kế và code viết ở hai thời điểm, không có hằng số dùng chung.
- **Đã sửa:** Tạo `MOOD_FIT_THRESHOLD = 80` ở đầu lõi, dùng chung 3 chỗ (fallback, ▼ cảnh báo, xét moodFit thiếu). Ghi lý do chọn 80 vào docs/01 D7.

## BUG-3 — Số liệu kỳ vọng C5 đếm thiếu 1 mẫu
- **Lỗi:** Kỳ vọng "còn 5 mẫu" cho ca chán+ngoài trời+tốn sức, thực tế 6.
- **Nguyên nhân:** Đếm bằng tay quên chợ đêm (ngoài trời, energy 2, vẫn qua lọc mềm |2-3|=1).
- **Đã sửa:** Sửa kỳ vọng thành 6 — nhưng sửa có kiểm chứng: liệt kê từng mẫu bằng id và đối chiếu với bộ lọc, không đoán lại.

## BUG-4 — Lọc hình thức đi so chuỗi với số → không bao giờ khớp ⭐ (bug nghiêm trọng nhất của lõi)
- **Lỗi:** Bộ lọc `it.social === prefs.social` so số (1/2/3) với chuỗi ('alone'/'friends') — luôn false. Khi user chọn "Cùng bạn bè", chỉ còn các mẫu `social === 3` (một mình/cùng bạn được) — kết quả sai mà **không lỗi console**.
- **Nguyên nhân:** Dữ liệu lưu số, form gửi chuỗi; không có lớp chuẩn hoá giữa hai bên. Test không bắt được vì **không ca nào đi vào nhánh "friends"**.
- **Đã sửa:** Thêm `SOCIAL_NUM` chuẩn hoá một lần ở đầu `recommend()` (docs/01 D8) + viết ca C11 phủ cả hai nhánh friends/alone với kỳ vọng id cụ thể.

## BUG-5 — app.js hỏng khi ghi file lần đầu (bản laptop)
- **Lỗi:** File sau lần ghi đầu có đoạn rác (` filters:`, `...`, biến `cau`).
- **Nguyên nhân:** Ghi file lỗi giữa chừng.
- **Đã sửa:** Ghi đè lại toàn bộ, chạy thật trên preview để xác nhận.

## BUG-6 — Preview 404 cả 3 file script
- **Lỗi:** Preview chỉ phát 1 file HTML → mọi script lẻ 404, bấm nút không chạy.
- **Nguyên nhân:** Ràng buộc môi trường demo.
- **Đã sửa:** Viết `build.js` gộp 3 script vào `dist.html` (docs/01 D9). Gặp lại và xử lý y hệt khi đổi chủ đề — lần này chỉ mất 1 lệnh build.

## Bài học rút ra
- Lỗi đắt nhất (BUG-0) không nằm ở code mà ở **khâu hiểu đề** — và không có test nào bắt được nó; chỉ có con người (học viên) mới phát hiện ra.
- Hai bug "im lặng" (BUG-1, BUG-4) đều không crash, không log — chỉ thấy được khi có ca thử đúng nhánh hoặc khi người thật bấm thử. **Mỗi nhánh lọc cần ít nhất một ca thử đi qua nó.**
