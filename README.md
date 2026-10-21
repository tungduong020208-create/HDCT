# Gợi ý hoạt động cuối tuần — nhiều điều kiện, có xếp hạng rõ

Project bài học: **Tạo công cụ gợi ý với nhiều điều kiện** (mức tự chủ: tự chọn phương án + giải thích lý do, tự chốt phạm vi trong khung coach).

Đi chơi, ở nhà ngủ, đi thể thao, xem phim, cà phê… — chọn tâm trạng + điều kiện thật của bạn, tool lọc → chấm điểm 5 thành phần → xếp hạng kèm lý do.

## Chạy thử
- **Demo nhanh:** mở `dist.html` bằng trình duyệt (1 file duy nhất, không cần cài gì).
- **Phát triển:** mở `index.html` (cần phục vụ kèm data.js/recommender.js/app.js cùng thư mục).
- **Chạy kiểm thử:** `node test.js` → in kết quả 12 ca, thoát mã 1 nếu có ca trượt.
- **Build lại dist.html sau khi sửa code:** `node build.js`.

## Cấu trúc
| File | Vai trò |
|---|---|
| `recommender.js` | Lõi xếp hạng (hàm thuần, kiểm thử được không cần trình duyệt) |
| `data.js` | 24 hoạt động cuối tuần (mô phỏng — thay số thật khi nộp chính thức) |
| `app.js` | Giao diện: đọc form → gọi lõi → vẽ kết quả + cảnh báo |
| `test.js` | 12 ca kiểm thử (khung assert tự viết) |
| `build.js` | Gộp 3 script vào `dist.html` cho demo 1 file |
| `index.html` / `dist.html` | Trang web (bản nhiều file / bản 1 file) |
| `buoi-hoc/` | Nội dung nguyên văn từng buổi học + báo cáo đối chiếu |

## Hồ sơ nộp (6 mục — không chỉ sản phẩm cuối)
1. **docs/01-nhat-ky-quyet-dinh.md** — 13 quyết định: chọn gì, bỏ gì, vì sao
2. **docs/02-bang-kiem-thu.md** — 12 ca kiểm thử, các vòng chạy nguyên văn
3. **docs/03-nhat-ky-loi.md** — lỗi: lỗi – nguyên nhân – đã sửa ra sao
4. **docs/04-phan-hoi-nguoi-dung.md** — quy trình thu thập + bảng điền nguyên văn ⚠ *cần điền từ dữ liệu thật của bạn*
5. **docs/05-ban-cai-tien.md** — các cải tiến đã làm + hàng chờ có lý do
6. **docs/06-phieu-phantu.md** — phản tư + đối chiếu Tiêu chí/Dữ liệu/Logic/Ca thử/Sửa

**Tài liệu nghiệp vụ:** **docs/BRD.md** — Business Requirements Document (vấn đề, mục tiêu, phạm vi, yêu cầu nghiệp vụ BR-1–10, quy tắc nghiệp vụ R-1–6, rủi ro)

## Việc còn lại trước khi nộp
- [ ] Thu thập phản hồi ≥3 người dùng thật, điền vào docs/04 (phần duy nhất mình không thể làm thay bạn)
- [ ] Thay giá/thời gian trong `data.js` bằng số liệu tra thực tế + ghi nguồn vào docs/06
- [ ] Cập nhật hàng chờ docs/05 sau khi có phản hồi người dùng
