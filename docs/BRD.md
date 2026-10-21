# BRD — CÔNG CỤ GỢI Ý HOẠT ĐỘNG CUỐI TUẦN

| | |
|---|---|
| **Tên tài liệu** | Business Requirements Document (Tài liệu yêu cầu nghiệp vụ) |
| **Sản phẩm** | Weekend Planner — Công cụ gợi ý hoạt động cuối tuần |
| **Phiên bản** | 1.0 (dự thảo) |
| **Ngày** | 25/09/2026 |
| **Tài liệu liên quan** | Hồ sơ project `docs/01–06` · Demo `dist.html` · Kiểm thử `test.js` (11 ca) |

---

## 1. Tổng quan (Executive Summary)

Mỗi cuối tuần, cá nhân và nhóm bạn bỏ ra **30 phút đến vài giờ** chỉ để trả lời một câu hỏi: *"Cuối tuần này làm gì?"*. Câu trả lời thường là "tuỳ" → cuộc trò chuyện lặp vô hạn → kết quả mặc định là lướt điện thoại hoặc ngủ tràn, hoặc nhóm tan mỗi người một nhà.

Sản phẩm là **web app 1 trang**: người dùng khai báo điều kiện thực tế (tâm trạng, ngân sách, thời gian rảnh, trong/ngoài trời, mức năng lượng, đi cùng ai, thích không khí nào) → hệ thống trả về **danh sách hoạt động xếp hạng** kèm **lý do giải thích** cho từng lựa chọn, có cảnh báo minh bạch khi điều kiện xung đột hoặc không còn lựa chọn hợp.

## 2. Bối cảnh & vấn đề nghiệp vụ

### 2.1 Hiện trạng (As-is)
- Quyết định nhóm theo kiểu "hỏi vòng tròn": *"muốn làm gì?" — "tuỳ" — "hỏi lại đi"* → không ai chịu chốt.
- Cá nhân lướt mạng xã hội tìm ý tưởng nhưng **không đối chiếu được** với ngân sách, thời gian rảnh, thời tiết của chính mình.
- Khi có ý tưởng, không biết lựa chọn đó có **hợp tâm trạng hiện tại** hay không (mệt thì không nên trekking dù "nghe hay").
- Không có công cụ nào xếp hạng lựa chọn theo **điều kiện cá nhân** — danh sách trên mạng là chung cho tất cả mọi người.

### 2.2 Vấn đề (Problem statement)
> Chi phí quyết định cuối tuần quá cao so với giá trị nó mang lại, khiến phần lớn người dùng rơi về lựa chọn mặc định ít giá trị hoặc trì hoãn đến khi hết cuối tuần.

### 2.3 Tương lai (To-be)
Người dùng mất **dưới 2 phút** điền điều kiện → nhận top kết quả có thứ hạng, lý do, chi phí, thời lượng → chốt hoạt động ngay hoặc biết chính xác **nới lỏng điều kiện nào** để có lựa chọn.

## 3. Mục tiêu kinh doanh & chỉ số thành công

| # | Mục tiêu | Chỉ số đo | Mốc | Cách đo hiện tại |
|---|---|---|---|---|
| OBJ-1 | Giảm thời gian quyết định | Thời gian từ mở app đến khi có danh sách + chốt | < 2 phút | Bấm giờ trong phiên thử với người dùng thật |
| OBJ-2 | Gợi ý dùng được ngay | % phiên có lựa chọn được chốt nằm trong top 3 | ≥ 70% | Khảo sát sau dùng thử (docs/04) |
| OBJ-3 | Gợi ý hợp cảm xúc | % người dùng đồng ý "top 1 hợp tâm trạng mình" | ≥ 80% | Câu hỏi (2) trong form phản hồi docs/04 |
| OBJ-4 | Minh bạch, giải thích được | % kết quả có ≥ 1 lý do; có cảnh báo khi lệch | 100% | Ca kiểm thử C9 (đang đạt) |
| OBJ-5 | Không gợi ý sai ràng buộc | % kết quả vi phạm ngân sách/thời gian | 0% | Ca kiểm thử C1, C8 (đang đạt) |

## 4. Phạm vi

### 4.1 Trong phạm vi (v1 — hiện có)
- Danh mục **17 hoạt động** mẫu thuộc 8 nhóm: nghỉ ngơi, thể thao, ngoài trời, xã giao, giải trí, văn hoá, ẩm thực, việc nhà.
- **7 điều kiện nhập:** tâm trạng (bắt buộc), ngân sách, thời gian rảnh, trong/ngoài trời, mức năng lượng, đi một mình/cùng bạn, không khí vắng–đông.
- **Xếp hạng 5 thành phần:** hợp tâm trạng, hợp túi tiền, hợp thời gian, hợp năng lượng, hợp không khí — kèm 5 slider điều chỉnh ưu tiên.
- **Giải thích:** lý do từng kết quả + chi tiết điểm thành phần × trọng số.
- **Xử lý ca khó:** kết quả rỗng kèm chẩn đoán "nới lỏng điều kiện nào trước"; cảnh báo khi không còn lựa chọn hợp tâm trạng (fallback).
- Chạy offline dưới dạng **1 file HTML**, tiếng Việt.

### 4.2 Ngoài phạm vi (v1 — thuộc lộ trình sau)
- Tài khoản người dùng, lưu lịch sử lựa chọn.
- Đặt chỗ/mua vé, bản đồ, chỉ đường, thời tiết thực.
- Dữ liệu địa điểm thật theo thành phố (hiện là dữ liệu mô phỏng).
- Gợi ý **kế hoạch cả ngày** (ghép 2–3 hoạt động sáng–chiều–tối).
- Lọc theo khung giờ trong ngày (dữ liệu `bestHours` đã chuẩn bị sẵn).

## 5. Người dùng mục tiêu (Personas)

| | P1 — Sinh viên "lưỡng lự" | P2 — Người đi làm cần xả | P3 — Nhóm bạn cần quyết nhanh |
|---|---|---|---|
| Bối cảnh | Cuối tuần, ngân sách < 100k, đi nhóm nhỏ 2–3 người | Mệt sau tuần làm việc, muốn trong nhà, nhẹ nhàng | Nhóm 4–8 người, mỗi người một ý |
| Điều kiện thường dùng | Ngân sách, đi cùng bạn, giá rẻ | Tâm trạng hơi buồn/mệt, trong nhà, năng lượng thấp | Thời gian, ngân sách chung, top 3 để vote |
| Giá trị nhận được | Phát hiện lựa chọn 0–50k vẫn vui | Được "an ủi" đúng mood (xem phim, đọc sách cafe) | Danh sách có thứ hạng để chốt nhanh |
| Kịch bản thất bại phải tránh | Bị gợi ý hoạt động 600k | Bị gợi ý trekking 8 tiếng | 20 lựa chọn không thứ tự |

## 6. Yêu cầu nghiệp vụ (Business Requirements)

> Quy ước ưu tiên: **Must** = thiếu là sản phẩm vô dụng · **Should** = quan trọng, cần có ở bản đầu · **Could** = giá trị thêm. Cột "Hiện trạng" đối chiếu với app đang chạy.

| # | Yêu cầu nghiệp vụ | Ưu tiên | Hiện trạng |
|---|---|:---:|---|
| BR-1 | Nhập **nhiều điều kiện cùng lúc** (≥ 5) và hệ thống phải đối chiếu đồng thời tất cả, không phải từng điều kiện một | Must | ✅ 7 điều kiện |
| BR-2 | Kết quả phải **xếp hạng rõ** (có điểm, có thứ tự) và **mỗi kết quả phải có lý do giải thích** người thường đọc hiểu | Must | ✅ test C9 |
| BR-3 | Ràng buộc cứng phải được tôn trọng tuyệt đối: **không gợi ý vượt ngân sách, vượt thời gian rảnh**, sai hình thức trong/ngoài trời, sai hình thức đi cùng | Must | ✅ test C1, C8, C11 |
| BR-4 | Khi không còn lựa chọn nào thoả, hệ thống phải **chỉ ra điều kiện nào đang gắt nhất** để người dùng nới lỏng — không được chỉ hiện "không có kết quả" | Must | ✅ test C4 |
| BR-5 | Khi còn kết quả nhưng **không cái nào thật sự hợp tâm trạng**, hệ thống phải **cảnh báo rõ** thay vì im lặng gợi ý lệch | Must | ✅ test C5, C9 |
| BR-6 | Người dùng được **điều chỉnh mức ưu tiên** giữa các tiêu chí; hệ thống phải xếp hạng lại tương ứng | Should | ✅ test C6, C7 |
| BR-7 | Phải có lựa chọn cho người **không chi tiền** (hoạt động miễn phí vẫn được xếp hạng công bằng) | Should | ✅ quy tắc R5, test C2 |
| BR-8 | Dữ liệu hoạt động theo **địa điểm thật** của thành phố người dùng (giá, vị trí) | Could | ⬜ đang mô phỏng |
| BR-9 | Gợi ý **kế hoạch cả ngày**: ghép 2–3 hoạt động khớp tổng thời gian + tổng ngân sách | Could | ⬜ backlog docs/05 |
| BR-10 | Lọc theo **khung giờ** trong ngày (sáng/chiều/tối) | Could | ⬜ dữ liệu đã sẵn |

## 7. Quy tắc nghiệp vụ (Business Rules)

| # | Quy tắc | Ghi chú |
|---|---|---|
| R-1 | Lọc cứng: `giá ≤ ngân sách` · `thời lượng tối thiểu ≤ giờ rảnh` · `trong/ngoài trời khớp` · `lệch năng lượng ≤ 1 bậc` · hình thức đi khớp (hoạt động "cả hai được" luôn hợp lệ) | Ràng buộc tuyệt đối, vi phạm là lỗi nghiêm trọng (test C1, C3, C8, C11) |
| R-2 | Điểm tổng = Σ (trọng số × thành phần), trọng số chuẩn hoá **tổng đúng 1**; mọi slider = 0 → dùng bộ mặc định (mood 0.30 cao nhất) | Chống sai số chia 0 (test C7) |
| R-3 | "Hợp tâm trạng" được định nghĩa là `moodFit ≥ 80/100` (hằng số `MOOD_FIT_THRESHOLD`) — dưới ngưỡng chỉ là "không tệ" | Nguồn gốc con số 80: docs/01 D7 |
| R-4 | Thứ tự xếp hạng: điểm giảm dần → giá tăng dần (rẻ hơn trước khi hoà điểm) → tên | Bất biến thứ tự ổn định (test C8) |
| R-5 | Hoạt động miễn phí luôn đạt điểm túi tiền tối đa 100 nếu trong giới hạn ngân sách | Bảo vệ nhóm người dùng P1 |
| R-6 | Thời gian rảnh **chấm mềm**: đủ giờ tối thiểu là đủ điều kiện chấm (60–100 điểm), không bị loại vì không trọn gói thời lượng tối đa | Quyết định D5 — không oan hoạt động 4–8h khi user rảnh 5h |

## 8. Ánh xạ yêu cầu → chức năng → bằng chứng

| Chức năng (đã có trong app) | Đáp ứng BR | Bằng chứng kiểm thử |
|---|---|---|
| Form 7 điều kiện + 5 slider | BR-1, BR-6 | UI verify trên preview |
| Lõi lọc cứng 5 tầng tuần tự, có đếm số bị loại từng tầng | BR-3, BR-4 | C1, C3, C4, C8, C11 |
| Chấm 5 thành phần + trọng số theo người dùng | BR-2, BR-6 | C6, C7, C10 |
| Lý do từng kết quả + dòng ▼ đánh đổi + breakdown | BR-2, BR-5 | C9 |
| Banner chẩn đoán khi rỗng | BR-4 | C4 |
| Cờ fallback + banner ⚠ khi lệch tâm trạng | BR-5 | C5, C9 |
| Xếp hạng có tie-break | BR-2 | C8 |

## 9. Yêu cầu phi chức năng

- **Khả dụng:** chạy offline, 1 file `dist.html`, mở bằng bất kỳ trình duyệt, không cài đặt, không đăng nhập.
- **Hiệu năng:** kết quả trả về tức thì (< 100ms với 17 hoạt động; kiến trúc lọc–chấm tuyến tính).
- **Ngôn ngữ:** tiếng Việt toàn bộ giao diện và lý do giải thích.
- **Chất lượng:** 11 ca kiểm thử tự động phải pass trước mọi bản build; mọi thay đổi logic phải có ca thử tương ứng.
- **Bảo trì:** dữ liệu tách khỏi logic (`data.js` ≠ `recommender.js`) — thay dữ liệu không cần sửa lõi.

## 10. Giả định & ràng buộc

| Loại | Nội dung |
|---|---|
| Giả định | Người dùng tự chịu chi phí di chuyển; đơn vị tiền là nghìn VND/người; mỗi phiên là một lần quyết định độc lập |
| Giả định | Dữ liệu 17 hoạt động là **mô phỏng** — trước khi dùng thật phải thay giá/thời gian tra thực tế kèm ghi nguồn |
| Ràng buộc | v1 không có backend, không tài khoản — toàn bộ xử lý phía client |
| Ràng buộc | Tâm trạng là điều kiện bắt buộc duy nhất; các điều kiện còn lại mặc định "Tuỳ" |

## 11. Rủi ro & phương án giảm thiểu

| # | Rủi ro | Mức ảnh hưởng | Giảm thiểu |
|---|---|:---:|---|
| 1 | Dữ liệu mô phỏng lệch giá thật → người dùng mất niềm tin | Cao | Thay giá thật + ghi nguồn (đang mở trong README); hiển thị đơn vị "k" rõ ràng |
| 2 | Người dùng không tin con điểm | Cao | Mọi kết quả có lý do + nút breakdown thành phần × trọng số (OBJ-4) |
| 3 | 7 điều kiện gây choáng người mới | Trung bình | Mặc định "Tuỳ" cho 6/7 điều kiện; chỉ tâm trạng là bắt buộc |
| 4 | Cảnh báo fallback bị hiểu là "tool yếu" | Trung bình | Banner kèm hướng dẫn hành động ("nới lỏng điều kiện nào") + lý do ▼ từng kết quả |
| 5 | Danh mục 17 hoạt động quá nhỏ, dùng 2–3 lần là hết mới | Trung bình | Dữ liệu tách riêng — thêm hoạt động không đụng lõi; BR-8/9/10 giữ chân người dùng |

## 12. Thuật ngữ

| Thuật ngữ | Nghĩa trong tài liệu này |
|---|---|
| Ràng buộc cứng | Điều kiện làm **loại** lựa chọn ngay trước khi chấm điểm (R-1) |
| Thành phần điểm | Một trong 5 khía cạnh chấm thang 0–100: mood, budget, time, energy, crowd |
| Fallback | Trạng thái còn kết quả nhưng không kết quả nào đạt ngưỡng "hợp" (R-3) → phải cảnh báo |
| moodFit | Độ hợp tâm trạng của 1 hoạt động (0–100), khai báo trong dữ liệu |
| Chẩn đoán rỗng | Thông tin "bộ lọc nào loại nhiều nhất" khi kết quả trống |

---
*Phiên bản tiếp theo của BRD sẽ cập nhật sau khi có phản hồi 3+ người dùng thật (docs/04): điều chỉnh OBJ, duyệt/hạ BR-8–10 theo nhu cầu thật.*
