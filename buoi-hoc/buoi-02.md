# BUỔI 2 — YÊU CẦU BÀI HỌC (nguyên văn do học viên cung cấp)

> Lưu nguyên văn ngày 26/09/2026. Đây là nguồn chuẩn cho buổi 2.

## Nội dung gốc

> "dựa trên cái buổi 1 tôi học và đây là cái nôi dung bài 2 đưa ra bạn phải tìm kiếm và lên cái bảng cho tôi xem
> - Điều gì làm lựa chọn thay đổi?
> - Chọn tiêu chí."

## Giải đề (được học viên xác nhận qua preview)

Buổi 2 là bài học lý thuyết ra quyết định, gồm 2 câu hỏi lớn:
1. **"Điều gì làm lựa chọn thay đổi?"** — vì sao cùng một tình huống, người khác nhau (hoặc cùng người lúc khác nhau) chọn khác nhau? → nhóm **yếu tố bên ngoài** (dữ liệu tình huống: tiền, giờ, trời, ai đi cùng) và **yếu tố bên trong** (tâm trạng, năng lượng, giá trị cá nhân).
2. **"Chọn tiêu chí"** — chuyển các yếu tố đó thành **tiêu chí đo được** để so sánh các lựa chọn (bước tiếp nối trực tiếp của buổi 1: tiêu chí + dữ liệu + logic + ca thử + sửa).

## Bảng nghiên cứu (nguồn ngoài + đối chiếu project)

### Bảng A — Điều gì làm lựa chọn thay đổi?

| Nhóm yếu tố | Ví dụ (chọn chơi cuối tuần) | Trong project này nằm ở đâu? |
|---|---|---|
| **Nguồn lực** — tiền, thời gian rảnh | 50k/1h chỉ còn đạp xe, đá bóng; 300k/6h mở gần hết danh mục | Bộ lọc cứng Ngân sách + Thời gian rảnh (`recommender.js`) |
| **Tình huống vật lý** — trong/ngoài trời, khung giờ, vị trí | Mưa → hoạt động 'both'/'in'; trời đẹp → ngoài trời | Bộ lọc Trong/ngoài trời (venue 3 trạng thái, D13) |
| **Xã hội** — đi một mình / với bạn / nhóm bao nhiêu | Đá bóng cần cả nhóm; đọc sách cafe đi một mình vẫn ổn | Bộ lọc Hình thức đi + Quy mô nhóm |
| **Trạng thái bên trong** — tâm trạng, năng lượng | "Vui vẻ" → đá bóng (moodFit 90); "stress" → cà phê sách hồ Tây (95) | Bộ lọc mềm năng lượng ±1 bậc (D6) + thành phần điểm mood 0.30 (D4) |
| **Giá trị/ưu tiên cá nhân** — coi trọng cái gì hơn | "Miễn thoải mái là được" vs "phải hợp tâm trạng" | Slider trọng số người dùng đè lên DEFAULT_WEIGHTS (D4, D10) |
| **Đám đông/mức ồn** — muốn đông hay vắng | "Chán đổi gió" cần chỗ đông người; stress cần vắng | Thành phần điểm crowd (crowdLevel) |

Nguồn tư liệu ngoài: OpenLearn (Open University) — *Factors that influence decisions* (người quyết định, tình huống, cơ hội/vấn đề, **tiêu chí quyết định**); Symonds Research — 6 yếu tố ảnh hưởng ra quyết định (loại quyết định, môi trường, đạo đức, cảm xúc, khác biệt cá nhân, rào cản); 1000minds — *Multi-Criteria Decision Analysis*: lựa chọn thay đổi khi thay đổi **alternatives** (pool bị lọc), **criteria**, **weights** (trọng số) hoặc **decision-maker** (trạng thái + giá trị người chọn) — đúng 4 nhóm trong bảng A.

### Bảng B — Tiêu chí tốt có 5 đặc điểm (mục tiêu của câu "Chọn tiêu chí")

| # | Đặc điểm | Tiêu chí kém | Tiêu chí tốt (trong project) |
|---|---|---|---|
| 1 | **Có liên quan đến mục tiêu** | "Màu Logo đẹp" | Hợp tâm trạng (mood) — tâm trạng định hướng việc chơi cuối tuần |
| 2 | **Đo được / so sánh được** | "Thú vị" (mỗi người hiểu một kiểu) | priceK, hoursMin–hoursMax, moodFit 0–100, energy 1–3 |
| 3 | **Phân biệt được các lựa chọn** | "Có tên" (mọi hoạt động đều có → vô dụng) | crowdLevel — chợ đêm 3 vs đọc sách cafe 2 |
| 4 | **Không trùng lặp** | Đếm "rẻ" 2 lần (giá + "tiết kiệm") | 5 thành phần mood/budget/time/energy/crowd, mỗi cái một khía cạnh |
| 5 | **Có trọng số rõ** (quan trọng cỡ nào) | Trung bình cộng không trọng số | mood 0.30 · budget 0.25 · time 0.25 · energy 0.10 · crowd 0.10, chuẩn hoá về 1 (D4, D10) |

Nguồn tư liệu ngoài: 1000minds (MCDA/MCDM) — mô hình 4 thành phần: alternatives, criteria, weights, decision-makers; 5–8 tiêu chí là đủ cho đa số bài toán; trọng số tường minh giúp giảm thiên kiến "cảm tính"; weighed-sum model là cách gộp phổ biến nhất.

### Bảng C — Bằng chứng bằng thí nghiệm thật trên lõi (node, dữ liệu 18 hoạt động)

Giữ nguyên gốc **vui vẻ + 300k + 6h** — chỉ đổi ĐÚNG 1 điều kiện mỗi lần:

| Thí nghiệm | Pool còn lại | Top 3 sau khi đổi | Điều gì thay đổi lựa chọn? |
|---|---|---|---|
| S0 · Gốc (vui vẻ, 300k, 6h) | 17/18 | Cà phê trò chuyện (91.08) · Đá bóng (90.92) · Board game (89.83) | — (mốc so sánh) |
| S1 · Đổi tâm trạng → stress | 17/18 | Cà phê sách hồ Tây (88.50) · Ngủ bù (88.00) · Bảo tàng (87.90) | Top 3 **thay đổi hoàn toàn** chỉ vì tâm trạng — trọng số 0.30 |
| S2 · Đổi tâm trạng → chán đổi gió | 17/18 | Bảo tàng (88.50) · Board game (88.33) · Cà phê trò chuyện (88.08) | Xếp hạng xáo trộn cả bảng |
| S3 · Hạ ngân sách → 50k | **4/18** | Đạp xe (85.00) · Đá bóng (80.50) · Dọn nhà (76.00) | Bộ lọc cứng chặt gần hết pool → lựa chọn bị **siết** |
| S4 · Hạ thời gian → 1h | 5/18 | Cà phê trò chuyện (81.08) · Đạp xe (79.17) · Săn quán ăn (77.25) | Siết tương tự ngân sách |
| S5 · Cố định trong nhà | 12/18 | Cà phê trò chuyện (91.08) · Board game (89.83) · Karaoke (87.25) | Lọc vị trí → xếp hạng gần giữ nguyên, chỉ mất lựa chọn ngoài trời |

Kết luận từ Bảng C: **lựa chọn thay đổi theo 2 cơ chế khác nhau** — (1) điều kiện cứng thay đổi *tập lựa chọn được phép* (S3, S4, S5); (2) tâm trạng/trọng số thay đổi *thứ hạng trong tập đó* (S1, S2). Tool của buổi 1 đã mô hình hoá đúng cả 2 cơ chế: bộ lọc cứng + chấm điểm có trọng số.

### Bảng D — Buổi 2 yêu cầu làm gì tiếp ở project?

| Việc | Vì sao buổi 2 đòi hỏi | Trạng thái |
|---|---|---|
| Kiểm tra 5 tiêu chí hiện có qua lăng kính Bảng B | "Chọn tiêu chí" là nội dung trung tâm buổi 2 | ✅ 5/5 tiêu chí đạt (mood/budget/time/energy/crowd đều đo được, phân biệt được, có trọng số) |
| Thí nghiệm S0–S5 trở thành ca kiểm thử/kịch bản demo | Bằng chứng "điều gì làm lựa chọn thay đổi" phải tái lập được | ✅ chạy thật bằng node, ghi ở Bảng C |
| Cho người dùng **sửa trọng số tiêu chí** (nếu chưa) | Giá trị cá nhân là một yếu tố làm lựa chọn thay đổi (Bảng A) | ✅ đã có slider trọng số (D4) |
| Thu thập phản hồi 3 người dùng thật | Kiểm chứng ngoài: người thật thay đổi lựa chọn vì yếu tố nào? | ⬜ việc của học viên (docs/04) |

> Lưu ý trung thực: đây là bảng **nghiên cứu + đối chiếu** do agent tổng hợp từ nội dung buổi 2 (2 câu hỏi) và tư liệu ngoài; khoá học chưa phát hành tài liệu buổi 2 chính thức. Khi có tài liệu gốc, cập nhật theo đúng quy ước buoi-hoc/README.md (sửa theo buổi học, ghi nhật ký "vì sao sửa").
