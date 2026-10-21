# ① NHẬT KÝ QUYẾT ĐỊNH THIẾT KẾ

> Nguyên tắc ghi: mỗi quyết định ghi rõ **chọn gì / bỏ gì / vì sao**, kèm dấu vết trong code.

## D1 — Chọn chủ đề: gợi ý hoạt động cuối tuần
- **Chọn:** công cụ gợi ý hoạt động cuối tuần (đi chơi, ở nhà nghỉ ngơi, thể thao, xem phim, cà phê…).
- **Bỏ:** gợi ý laptop (bản nháp đầu **hiểu nhầm đề** — đã dựng xong mới được học viên làm rõ chủ đề), gợi ý phim, món ăn.
- **Vì sao:** đúng nội dung buổi 1; hoạt động cuối tuần có điều kiện tự nhiên kiểm chứng được (ngân sách, thời gian rảnh, trong/ngoài trời, năng lượng, tâm trạng, đi cùng ai) và **ca thử khó có thật**: khoảng giá loe ngang 20k→60k, xung đột "ngoài trời + muốn nhẹ nhàng", thời gian rảnh 0.5h khiến mọi lựa chọn rỗng.
- **Bài học ghi lại:** hiểu nhầm đề tốn một vòng xây dựng — project sau phải chốt đề bằng câu hỏi với coach ngay trước khi code (xem docs/06).

## D2 — Tách lõi khỏi giao diện
- **Chọn:** `recommender.js` là hàm thuần (pure function, không đụng DOM), `app.js` chỉ đọc form + vẽ.
- **Bỏ:** viết mọi thứ trong 1 file HTML.
- **Vì sao:** tiêu chí bài học yêu cầu **ca thử có kết quả thật** — lõi thuần thì `node test.js` chạy được không cần trình duyệt.

## D3 — Pipeline: Lọc cứng → Chấm điểm → Xếp hạng
- **Chọn:** 2 lớp. Ràng buộc cứng gồm 5 bộ lọc: ngân sách, thời gian rảnh (`hoursMin <= freeHours`), trong/ngoài trời, mức năng lượng (`|hiệu| <= 1`), hình thức đi. Sau đó chấm 5 thành phần và xếp hạng.
- **Bỏ:** (a) chỉ lọc không chấm — không có thứ hạng, vi phạm tiêu chí sản phẩm ①; (b) chỉ chấm không lọc — hoạt động vượt ngân sách lọt top nhờ điểm khác.
- **Vị trí:** `recommender.js → recommend()`.

## D4 — 5 thành phần điểm; tâm trạng mang trọng số cao nhất
- **Chọn:** mood (hợp tâm trạng), budget (hợp túi tiền), time (hợp thời gian), energy (hợp năng lượng), crowd (hợp mức đông/vắng). Trọng số mặc định: mood 0.30 — cao nhất.
- **Vì sao chọn mood cao nhất:** tâm trạng là điều **định hướng** việc chọn chơi cuối tuần — cùng 200k, người "vui vẻ" và người "hơi buồn" cần hai thứ khác nhau.
- **Bỏ:** trung bình cộng không trọng số — "nhiều điều kiện" chỉ còn trên giấy.

## D5 — timeScore: chấm mềm thời gian, không cắt cứng theo hoursMax
- **Chọn:** thiếu giờ → 0 điểm; dư thoải mái → 100; nằm giữa min–max → 60→100 tăng dần; không khai báo → 50 trung lập.
- **Bỏ:** lọc cứng `hoursMax <= freeHours` — oan cho hoạt động 4–8h khi user rảnh 5h (đủ chạy phần chính).
- **Vị trí:** `timeScore()`, có ca thử toán học riêng (C10).

## D6 — Năng lượng lọc mềm 1 bậc, không lọc cứng đúng bậc
- **Chọn:** bộ lọc cứng chỉ loại khi lệch ≥ 2 bậc; lệch 1 bậc vẫn qua nhưng bị trừ điểm (100→60→20).
- **Vì sao:** người "nhẹ nhàng" vẫn có thể chấp nhận hoạt động vừa sức nếu thứ khác hợp; loại cứng ngay làm mất lựa chọn tốt thứ nhì. Ca C3 tận dụng đúng điều này: "ngoài trời + nhẹ nhàng" còn đúng 1 mẫu (chợ đêm, lệch 1 bậc).

## D7 — Fallback "không hợp tâm trạng" + ngưỡng MOOD_FIT_THRESHOLD = 80 (sinh ra từ vòng test)
- **Chọn:** nếu pool còn kết quả nhưng **không hoạt động nào có moodFit ≥ 80** → bật cờ `fallback`, gắn ▼ từng kết quả, banner ⚠ trên UI. Ngưỡng là **hằng số dùng chung 3 chỗ** trong lõi.
- **Bỏ:** (a) ngưỡng 70 — vòng test V1 bắt được sự lệch nhau code(70)/thiết kế(80): 70/100 chỉ là "không tệ", không phải "hợp"; (b) định nghĩa fallback theo "hình thức đi" — bị chính bộ lọc social loại trước, thành dead code (phát hiện ngay khi viết, xem docs/03 BUG-3).
- **Vì sao:** tool phải trung thực về giới hạn — sai lệch im lặng nguy hiểm hơn rỗng.

## D8 — Chuẩn hoá hình thức đi về số ở đầu recommend() (bug thật)
- **Chọn:** `SOCIAL_NUM = { alone: 1, friends: 2, anyone: null }` chuẩn hoá **một lần** ở đầu hàm, mọi chỗ sau dùng số.
- **Vì sao:** dữ liệu `social` lưu số 1/2/3; so trực tiếp chuỗi `'friends'` với số **không bao giờ khớp** — bug thật bị bắt khi verify UI (docs/03 BUG-4), test không bắt được vì chưa có ca đi vào nhánh đó → sinh ca C11.

## D9 — Build 1 file `dist.html` cho demo
- **Chọn:** `build.js` gộp 3 script vào `dist.html`; giữ `index.html` nhiều file cho phát triển.
- **Vì sao:** môi trường preview/demo chỉ phát được 1 file (lỗi thật, docs/03 BUG-6); 1 file dễ gửi người dùng thử.

## D10 — Điểm tuyến tính có chuẩn hoá + tie-break rõ ràng
- **Chọn:** tổng có trọng số chuẩn hoá về 1; thứ tự: điểm giảm → giá tăng (rẻ hơn trước) → tên.
- **Bỏ:** hàm ưu tiên mũ/phức tạp hơn — không giải thích được cho người dùng bằng 1 dòng lý do trong thời gian project.

## D11 — Clone UI từ thiết kế Stitch nhưng GIỮ lõi thật (không dựng HTML tĩnh)
- **Chọn:** học viên đưa thiết kế 4 màn hình (Stitch) và yêu cầu "chép y chang" — mình dựng lại UI theo đúng bố cục/palette/thông điệp (badge #1 Phù hợp nhất, 94/100, BR-2/BR-4 in trên màn hình, chẩn đoán + nới lỏng, presets, bottom nav 3 tab) nhưng **mọi số liệu vẫn do lõi thật render**: điểm, moodFit, bộ lọc loại nhiều nhất, số chỗ mở khoá khi nới lỏng đều là output của `recommend()` / `suggestRelaxations()`.
- **Bỏ:** (a) copy ảnh tĩnh — không chạy được, không có test; (b) hard-code số liệu cho giống ảnh — sẽ sai ngay khi đổi điều kiện, vi phạm tinh thần "xếp hạng rõ + giải thích được" của bài học.
- **Vì sao:** UI đẹp là vỏ; giá trị bài học nằm ở logic kiểm thử được. Lớp trình bày có thể clone, lõi không được giả.

## D12 — Gợi ý nới lỏng phải là "mức tăng tối thiểu thật", không phải bước nhảy cố định
- **Chọn:** `suggestRelaxations()` duyệt các mức giá/thời gian **có thật trong dữ liệu** (tăng dần) và chọn mức nhỏ nhất mở khoá thêm lựa chọn (vd: 0k → 60k, không phải nhảy thẳng +100k); mỗi phương án kèm `nextPrefs` bấm là áp dụng được ngay + số chỗ mở khoá thật.
- **Bỏ:** bước nhảy cố định (+50k mỗi lần) — thiết kế ghi "Mức tăng tối thiểu cần thiết" mà tăng 100k khi chỉ cần 70k là nói dối nửa vời.
- **Bằng chứng:** ca C12 (shape + unlock dương + nextPrefs dùng được), verify UI 0k → đề xuất 60k đúng.

## D13 — Thêm bộ lọc quy mô nhóm + venue 3 trạng thái
- **Chọn:** thêm `groupSize` (groupMin–groupMax) và venue 'in'/'out'/'both' — 'both' luôn qua lọc trong/ngoài trời (flagship "cà phê sách & dạo bộ hồ" vừa quán vừa đi bộ ven hồ).
- **Vì sao:** thiết kế có chip "Trong & Ngoài trời" và "1–3 người"; mô hình cũ 2 trạng thái không diễn tả được hoạt động lai.
- **Hệ luỵ:** test C3 (còn 2 mẫu thay vì 1) và C4 (6 dòng chẩn đoán thay vì 5) phải sửa kỳ vọng — ghi rõ trong docs/02.
