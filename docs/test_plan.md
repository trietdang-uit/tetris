# Kế hoạch kiểm thử (Test Plan) - Dự án Tetris

**Người lập:** Cong Hoang
**Vai trò:** QA (Đảm bảo chất lượng)
**Dự án:** Trò chơi xếp gạch (Tetris) trên trình duyệt (HTML5 Canvas, Vanilla JS)

---

## 1. Mục đích
Tài liệu này xác định các chiến lược, phạm vi và các kịch bản kiểm thử (Test Cases) để đảm bảo trò chơi Tetris hoạt động đúng logic, giao diện hiển thị tốt trên các kích thước màn hình khác nhau, và không có lỗi nghiêm trọng (blocker/critical bugs) trước khi phát hành.

## 2. Phạm vi kiểm thử (In-Scope)
- **Giao diện người dùng (UI / UX):** Bố cục hiển thị, tính năng responsive (tự thay đổi kích thước canvas).
- **Cơ chế điều khiển:** Hoạt động của các phím điều hướng và phím tắt (Q, W).
- **Logic trò chơi:** Thuật toán sinh khối gạch, di chuyển, va chạm, xoay, xóa hàng và kết thúc game (Game Over).
- **Hệ thống tính điểm:** Cộng điểm chính xác khi xóa hàng.

*Lưu ý (Out-of-scope): Các tính năng như âm thanh, bảng xếp hạng online, lưu trạng thái chơi (save game) không nằm trong phạm vi dự án này.*

## 3. Môi trường kiểm thử
- **Nền tảng:** Trình duyệt web trên Desktop (Chrome, Firefox, Safari, Edge).
- **Hệ điều hành:** Windows, macOS.
- **Độ phân giải:**
  - Màn hình Full HD (1920x1080)
  - Màn hình nhỏ / Cửa sổ thu nhỏ (để test tính năng ResizeObserver)

---

## 4. Các kịch bản kiểm thử chi tiết (Test Cases)

QA vui lòng thực thi các kịch bản sau và ghi lại kết quả (Pass / Fail / Bug):

### 4.1. Giao diện (UI) và Hiển thị
| ID | Kịch bản kiểm thử (Test Case) | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| `UI_01` | Khởi tạo giao diện | Mở trang `index.html` trên trình duyệt. | Hiển thị đầy đủ Tiêu đề, Vùng chơi (Canvas), Điểm số, Bảng Hướng dẫn. | ✅ Pass |
| `UI_02` | Khả năng Responsive | Thu nhỏ/phóng to cửa sổ trình duyệt khi đang chơi. | Kích thước lưới (Cell size) của Canvas tự động scale cho phù hợp, không bị mất nét (nhoè) khối gạch. | ✅ Pass |
| `UI_03` | Focus vào màn chơi | Click ra ngoài trình duyệt, sau đó click lại vào trong khu vực Canvas. | Nhấn các phím điều khiển thì game vẫn nhận tín hiệu bình thường (Focus state hoạt động đúng). | ✅ Pass |

### 4.2. Cơ chế điều khiển
| ID | Kịch bản kiểm thử (Test Case) | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| `CTRL_01` | Di chuyển trái/phải | Nhấn mũi tên `Trái` (←) và `Phải` (→). | Khối gạch dịch chuyển sang trái hoặc phải 1 ô. | ✅ Pass |
| `CTRL_02` | Rơi nhanh | Nhấn và giữ mũi tên `Xuống` (↓). | Khối gạch rơi xuống với tốc độ cực nhanh cho đến khi chạm đáy/chạm gạch khác. | ✅ Pass |
| `CTRL_03` | Xoay khối | Nhấn mũi tên `Lên` (↑) hoặc phím `W`. | Khối gạch xoay 90 độ theo chiều kim đồng hồ. | ✅ Pass |
| `CTRL_04` | Xoay ngược khối | Nhấn phím `Q`. | Khối gạch xoay 90 độ ngược chiều kim đồng hồ. | ✅ Pass |
| `CTRL_05` | Ngăn cuộn trang | Nhấn các phím mũi tên khi cửa sổ trình duyệt nhỏ (có thanh cuộn). | Trang web không bị cuộn lên/xuống (event.preventDefault() hoạt động). | ✅ Pass |

### 4.3. Logic Trò Chơi & Xử lý Va chạm
| ID | Kịch bản kiểm thử (Test Case) | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| `LOGIC_01` | Rơi tự động | Mở game và không bấm phím nào. | Khối gạch tự động rơi xuống sau mỗi 1 giây (1000ms). | ✅ Pass |
| `LOGIC_02` | Va chạm biên ngang | Di chuyển gạch sát lề trái hoặc lề phải, tiếp tục bấm di chuyển. | Khối gạch không thể đi xuyên qua thành của màn chơi (Arena). | ✅ Pass |
| `LOGIC_03` | Va chạm đáy/gạch cũ | Để gạch rơi tự do đến đáy hoặc chạm vào khối đã cố định phía dưới. | Khối gạch dừng lại, cố định vị trí, và khối mới được sinh ra ở trên cùng. | ✅ Pass |
| `LOGIC_04` | "Đá" tường (Wall Kick) khi xoay | Di chuyển khối gạch dài (chữ I) sát mép tường, xoay gạch. | Khối gạch có thể tự động lùi lại 1-2 ô để vừa không gian xoay (không bị kẹt xuyên tường). | ✅ Pass |

### 4.4. Tính điểm (Scoring) & Game Over
| ID | Kịch bản kiểm thử (Test Case) | Các bước thực hiện | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|
| `SCORE_01` | Xóa 1 hàng | Xếp gạch lấp đầy 1 hàng ngang. | Hàng ngang bị xóa, các hàng trên tụt xuống, điểm tăng thêm `10 điểm`. | ✅ Pass |
| `SCORE_02` | Xóa nhiều hàng cùng lúc | Xếp gạch lấp đầy 2, 3, hoặc 4 hàng ngang cùng 1 lúc (ví dụ dùng thanh chữ I). | Điểm được tính theo cấp số nhân: 2 hàng = 30 điểm (10+20), 3 hàng = 70 điểm (10+20+40), 4 hàng = 150 điểm. | ✅ Pass |
| `SCORE_03` | Game Over | Xếp gạch cao chạm đến nóc của vùng chơi để khối mới sinh ra bị đụng ngay lập tức. | Màn chơi hiển thị "GAME OVER", nhấn Enter để chơi lại. | ✅ Pass |

---

## 5. Báo cáo Bug
*Ghi chú: Các bug được phát hiện ở giai đoạn đầu (văng Game Over sai, lỗi không xóa hàng trên cùng, tụt gạch, random) đã được đội Dev khắc phục hoàn toàn trong bản build mới nhất.*
