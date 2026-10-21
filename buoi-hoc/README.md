# QUY TRÌNH LÀM VIỆC THEO BUỔI HỌC

> Nhịp làm việc: **mỗi buổi học → gửi nội dung vào đây → áp dụng vào app + hồ sơ → app chạy demo cuối tuần.**

## Luồng mỗi buổi (mình thực hiện khi bạn gửi nội dung)
1. **Lưu nguyên văn** nội dung bạn gửi vào `buoi-XX.md` (không diễn giải lại — giữ bằng chứng gốc).
2. **Rút ra "cần áp dụng gì"**: đối chiếu nội dung buổi học với trạng thái app + hồ sơ hiện tại → liệt kê rõ cái nào mới, cái nào phải sửa, cái nào chưa áp dụng được vì thiếu thông tin.
3. **Cập nhật app** (code + logic) **và hồ sơ 6 mục** (docs/01–06) — mọi thay đổi đều ghi vào nhật ký quyết định docs/01.
4. **Chạy lại kiểm thử thật** (`node test.js`) + build lại `dist.html` (`node build.js`) + verify trên preview.
5. **Báo tóm tắt cuối buổi**: cái gì thêm / sửa / bỏ, kết quả test, việc còn mở.

## Tiến độ các buổi
| Buổi | Nội dung | Trạng thái áp dụng |
|---|---|---|
| 1 | Tiêu chí sản phẩm + năng lực + mức tự chủ + bằng chứng; hồ sơ 6 mục | ✅ Đã áp dụng (xem buoi-01.md) |
| 2 | Điều gì làm lựa chọn thay đổi? · Chọn tiêu chí | ✅ Đã áp dụng (xem buoi-02.md + buoi-02-bao-cao.html — nghiên cứu 6 nhóm yếu tố + 5 đặc điểm tiêu chí tốt + 6 thí nghiệm S0–S5 trên lõi thật) |
| 3 | Bảng dữ liệu (Tin học, 45 phút, hạn 27/10/2026, cấp độ 1–5) — viết 8 dòng học thật + đối chiếu với bài làm | ✅ Đã áp dụng (xem buoi-03.md + buoi-03-bao-cao.html — 8 dòng học thật theo trường dữ liệu môn học + đối chiếu 1-1 với data.js: bảng = hàng bản ghi × cột trường, lọc + xếp hạng = thao tác trên bảng) |
| 4 | *(chờ bạn gửi)* | ⬜ |
| **Cuối tuần** | **Demo app hoạt động** | mục tiêu |

## Quy ước
- Nội dung buổi học là **nguồn chuẩn** — khi nó mâu thuẫn với cái đã làm, sửa theo buổi học và ghi vào nhật ký "vì sao sửa".
- Mỗi buổi xong, app luôn ở trạng thái **chạy được + test pass + dist.html mới nhất** — để bất cứ lúc nào cuối tuần cần demo đều demo được ngay.
