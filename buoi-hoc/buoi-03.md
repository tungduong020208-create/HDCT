# BUỔI 3 — YÊU CẦU BÀI HỌC (nguyên văn do học viên cung cấp)

> Lưu nguyên văn ngày 29/09/2026. Đây là nguồn chuẩn cho buổi 3.

## Nội dung gốc

> "nội dung hôm nay tôi học gồm có nhứng lý thuyết như sau viết 8 viết học thật theo bảng dữ liệu môn học : " tin học ",  số phút : " 45 ", thời hạn: " 27/10/2026 ", cấp độ : " 1-5 " bạn xem những nội dung tôi học theo góc nhìn của lập trình web có liên quan j đến bài làm không"

## Giải đề (được học viên xác nhận qua preview)

Buổi 3 là bài học lý thuyết về **bảng dữ liệu** (bảng dữ liệu trong Tin học — môn học khai báo là **Tin học**, thời lượng **45 phút**, thời hạn hoàn thành **27/10/2026**, bài viết theo **cấp độ 1–5**). Yêu cầu cụ thể:

1. **Viết 8 dòng "học thật"** (8 việc đã học thật, không viết cho có) về bảng dữ liệu, trình bày theo dạng bảng với các trường dữ liệu bắt buộc của môn học.
2. **Xem nội dung buổi học theo góc nhìn lập trình web**: nội dung có liên quan gì đến bài làm (app gợi ý cuối tuần) không?

## Bảng dữ liệu môn học (bản ghi "học thật" — 8 dòng)

> Trường dữ liệu theo yêu cầu đề bài: **Môn học** · **Số phút** · **Thời hạn** · **Cấp độ (1–5)** + nội dung đã học thật. Giá trị chung cho 8 dòng: môn học = *Tin học*, số phút = *45*, thời hạn = *27/10/2026*; chỉ cột cấp độ tăng dần theo mức độ khó/tiếp thu.

| # | Môn học | Số phút | Thời hạn | Cấp độ (1–5) | Việc học thật hôm nay |
|---|---|:---:|---|:---:|---|
| 1 | Tin học | 45 | 27/10/2026 | 1 | Bảng dữ liệu là **hàng × cột**: mỗi **hàng** là 1 bản ghi (1 đối tượng thật), mỗi **cột** là 1 trường (1 thuộc tính của đối tượng). Ví dụ ngay trong app: 1 hoạt động cuối tuần = 1 hàng. |
| 2 | Tin học | 45 | 27/10/2026 | 1 | Mỗi **trường có kiểu dữ liệu riêng**: số (priceK), chữ (name), khoảng [min,max], danh sách (tags), mức 1–3 (energy). Chọn sai kiểu → phép tính sai. |
| 3 | Tin học | 45 | 27/10/2026 | 2 | Tên trường phải **đặt có chủ đích** (priceK = giá nghìn đồng, hoursMin/hoursMax, moodFit 0–100) — đọc tên là hiểu nghĩa và đơn vị, không cần đoán. |
| 4 | Tin học | 45 | 27/10/2026 | 3 | Trước khi điền số, phải **chốt schema trước** (liệt kê đủ cột cần thiết) — làm đúng như bảng quy ước 15 trường ở đầu `data.js` của app. |
| 5 | Tin học | 45 | 27/10/2026 | 3 | Dữ liệu phải **nhất quán**: ô trống phải có quy ước điền (moodFit.stress tự tính = 0.5·thoải mái + 0.5·buồn; priceRange trống = [priceK, priceK]) — vừa mới điền vừa phải kiểm tra hợp lệ. |
| 6 | Tin học | 45 | 27/10/2026 | 4 | Bảng có **bảng con lồng trong ô** (moodFit gồm 5 tâm trạng × điểm 0–100) — cấu trúc dữ liệu lồng nhau cần tên trường rõ để code đọc đúng. |
| 7 | Tin học | 45 | 27/10/2026 | 4 | Bảng dữ liệu chỉ hữu ích khi có **bộ lọc + sắp xếp theo điều kiện**: chọn tâm trạng "stress" → lọc dữ liệu kiểu chọn hàng thoả điều kiện rồi xếp hạng theo điểm. |
| 8 | Tin học | 45 | 27/10/2026 | 4 | Bảng lớn phải **tách khỏi phần xử lý** (dữ liệu ở `data.js`, logic ở `recommender.js`) — thay/ghi thêm hàng mới không phải sửa lại code lõi. |

*Ghi chú trung thực: 8 dòng trên do agent rút ra từ nội dung lý thuyết "bảng dữ liệu" (Tin học) của học viên và đối chiếu trực tiếp với `data.js` của project; khi có tài liệu gốc buổi 3 phát hành chính thức, cập nhật lại theo đúng quy ước buoi-hoc/README.md.*

## Bảng đối chiếu — nội dung buổi 3 liên quan gì đến bài làm?

**Câu trả lời ngắn: CÓ — liên quan trực tiếp, gần như 1-1.** File `data.js` của app **chính là một bảng dữ liệu** đúng như lý thuyết buổi 3 (18 hàng × 15 cột), và toàn bộ app chỉ là "đọc bảng → lọc hàng → chấm điểm hàng → xếp hạng".

| Lý thuyết buổi 3 (bảng dữ liệu) | Có trong app ở đâu? | Mức liên quan |
|---|---|:---:|
| Bảng = hàng (bản ghi) × cột (trường) | `data.js` → `CATALOG`: 18 hoạt động (hàng) × 15 trường (cột) | ⭐⭐⭐ trực tiếp |
| Trường có kiểu dữ liệu: số, chữ, danh sách | `priceK` (số), `name` (chữ), `tags` (danh sách), `priceRange` [min,max], `energy` 1–3 | ⭐⭐⭐ trực tiếp |
| Điền dữ liệu nhất quán, xử lý ô trống | Vòng lặp điền mặc định cuối `data.js` (stress, groupMin/Max, priceRange) | ⭐⭐⭐ trực tiếp |
| Lọc theo điều kiện trên bảng | Bộ lọc cứng 5 tầng trong `recommender.js` (ngân sách → thời gian → nơi → năng lượng → đi cùng ai) | ⭐⭐⭐ trực tiếp |
| Sắp xếp / xếp hạng theo tiêu chí có trọng số | Chấm 5 thành phần × trọng số (mood .30 …) → sort giảm dần | ⭐⭐⭐ trực tiếp |
| Chốt schema trước khi điền | Bảng chú thích 15 trường ở đầu `data.js` (định danh, giá, giờ, nơi, năng lượng, xã hội, moodFit…) | ⭐⭐ cần nói rõ khi demo |
| Bảng con lồng trong ô (moodFit) | `moodFit` là object {thoaimai, happy, buon, chan, stress} nằm trong 1 hàng | ⭐⭐ cần nói rõ khi demo |
| Dữ liệu tách khỏi xử lý | `data.js` ≠ `recommender.js` ≠ `app.js` — thay dữ liệu không đụng lõi | ⭐⭐ cần nói rõ khi demo |

## Kết luận buổi 3

- Bài học "bảng dữ liệu" không phải lý thuyết suông cho app này — **`data.js` chính là minh hoạ sống** của bảng dữ liệu: mỗi hoạt động cuối tuần là một bản ghi, mỗi thuộc tính là một trường.
- Khi demo/đối chiếu hồ sơ, có thể nói: *"Em học bảng dữ liệu: hàng = bản ghi, cột = trường có kiểu dữ liệu, lọc/sắp xếp theo điều kiện — và em đã áp dụng đúng thế vào file dữ liệu của tool gợi ý cuối tuần."*
- Việc còn mở: thu thập phản hồi 3 người dùng thật (docs/04) — không đổi sau buổi 3.
