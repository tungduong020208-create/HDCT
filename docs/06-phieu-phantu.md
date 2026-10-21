# ⑥ PHIẾU PHẢN TƯ + ĐỐI CHIẾU TIÊU CHÍ

## 1. Phiếu phản tư

### Chuẩn bị — bản chất đề bài là gì?
- Sản phẩm ① là **công cụ gợi ý nhiều điều kiện, có xếp hạng rõ + ca kiểm thử khó**. Ba từ khoá: *nhiều điều kiện* (không phải 1), *xếp hạng rõ* (có thứ tự + giải thích), *ca thử khó* (biên, xung đột, rỗng, cực đoan — không phải happy path).
- Nội dung buổi 1: gợi ý **hoạt động cuối tuần** — đi chơi, ở nhà ngủ/nghỉ ngơi, đi thể thao, xem phim, cà phê…
- Phạm vi tự chốt trong khung coach: web 1 trang, lõi tách riêng kiểm thử được bằng Node, 17 hoạt động mẫu, 5 ràng buộc cứng + 5 thành phần điểm.

### Làm — mình đã làm gì, bằng gì?
- Lõi `recommender.js`: 5 bộ lọc cứng → chấm 5 thành phần (mood/budget/time/energy/crowd) → gộp trọng số (mặc định + slider người dùng) → xếp hạng có tie-break.
- Dữ liệu 17 hoạt động, 12 trường/mẫu (mô phỏng — cần thay giá/thời gian thật khi nộp).
- **11 ca kiểm thử** (yêu cầu tối thiểu 5), 3 vòng chạy thật: 8/10 → 10/10 → 11/11.
- Giao diện + build 1 file demo `dist.html`.

### Suy ngẫm — 3 điều rút ra
1. **Chốt đề là quyết định đắt nhất.** Hiểu nhầm chủ đề (laptop thay vì hoạt động cuối tuần) khiến một vòng xây dựng phải làm lại — kiến trúc giữ được, nhưng toàn bộ dữ liệu, điều kiện, UI, hồ sơ phải viết lại. Bài học: khi đề mơ hồ, hỏi **trước** khi code; lưu nguyên văn nội dung buổi học (`buoi-hoc/`) để đối chiếu khi nghi ngờ.
2. **Ca kiểm thử khó là công cụ thiết kế.** Viết C5 đã ép chốt ngưỡng MOOD_FIT_THRESHOLD = 80 — một con số mà nếu không có ca thử, hai người code sẽ chọn hai cách. Bug "im lặng" (social so chuỗi với số) không crash, không log — chỉ thấy được nhờ verify UI thật + ca C11 phủ nhánh.
3. **Mỗi nhánh lọc cần một ca thử đi qua nó.** Bug BUG-4 tồn tại vì không ca nào chọn "Cùng bạn bè". Quy tắc mới khi thêm điều kiện: viết ca cho **từng giá trị** của điều kiện đó, không chỉ ca "không chọn gì".

### Nếu làm lại, mình sẽ khác thế nào?
- Chốt đề + phạm vi bằng câu hỏi trả lời được (chủ đề, hình thức, người dùng) **trước giờ code đầu tiên**.
- Viết ca cho từng nhánh điều kiện ngay khi thêm điều kiện, không gom cuối vòng.

### Đối chiếu 4 tiêu chí đầu bài
| Tiêu chí | Bằng chứng trong project này |
|---|---|
| **Tiêu chí** (đo cái gì, đạt khi nào) | 11 ca trong docs/02 — mỗi ca nêu rõ "khó" ở đâu và điều kiện đạt |
| **Dữ liệu** | `data.js` 17 hoạt động × 12 trường; giới hạn mô phỏng đã ghi chú, cần thay số thật khi nộp |
| **Logic** | Pipeline D3–D6 (docs/01), code tại `recommender.js`, mỗi kết quả có breakdown 5 thành phần × trọng số |
| **Ca thử** | 11 ca, 3 vòng chạy có kết quả thật nguyên văn (8/10 → 10/10 → 11/11) |
| **Sửa** | 7 lỗi có nguyên nhân + cách sửa (docs/03); 4 cải tiến có lý do chọn/bỏ (docs/05) |

### Tự chấm mức độ tự chủ (tiêu chí ③)
- Phạm vi: tự chốt trong khung (hình thức web, lõi tách riêng, 17 mẫu, độ khó ca thử) — có ghi trong docs/01.
- Phương án: tự chọn và giải thích lý do — 10 quyết định + 4 cải tiến đều có phương án bị loại.
- Phần cần người khác đóng góp: phản hồi 3 người dùng thật (docs/04) — chưa thể tự sinh, phải đi thu thập.
- Điểm yếu tự nhận: đã tự chốt cả **chủ đề** khi đề chưa rõ — mức tự chủ cao nhưng thiếu bước xác nhận với coach; lần sau phạm vi về chủ đề phải hỏi, các phạm vi kỹ thuật mới tự chốt.
