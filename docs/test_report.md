# Báo cáo kết quả kiểm thử (Test Report) - Dự án Tetris

**Người lập:** Cong Hoang
**Vai trò:** QA
**Ngày báo cáo:** 26/05/2026
**Trạng thái chung:** ✅ PASS (Đủ điều kiện phát hành)

---

## 1. Tóm tắt quá trình kiểm thử
- **Tổng số Test Cases (TC):** 15
- **Số TC Pass:** 15/15 (100%)
- **Số TC Fail (đã fix):** 0
- **Số lượng Bug tìm thấy:** 2 Critical Bugs, 2 Minor/UX Issues.
- **Trạng thái Bug:** Tất cả đều đã được khắc phục hoàn toàn (Resolved).

## 2. Chi tiết các Bug đã phát hiện và xử lý

Trong quá trình thực thi Test Plan ban đầu, đội QA đã phát hiện các lỗi sau. Tất cả đều đã được Dev fix và QA verify thành công ở phiên bản mới nhất:

| Bug ID | Mô tả lỗi | Trạng thái xử lý |
|---|---|---|
| `BUG_01` | **[Critical]** Lỗi Game Over oan: Khi thả gạch sát nóc mà ăn được hàng, thay vì xóa hàng thì game lại báo Game Over và reset điểm. Lỗi ở thứ tự thực thi trong `playerDrop()`. | ✅ Đã Fix (Verify Pass) |
| `BUG_02` | **[Bug]** Không xóa hàng trên cùng: Vòng lặp `arenaSweep()` bỏ qua dòng `y = 0`, dẫn đến hàng cao nhất nếu bị lấp đầy sẽ không bao giờ biến mất. | ✅ Đã Fix (Verify Pass) |
| `BUG_03` | **[Minor]** Tụt gạch ở frame đầu tiên: Lỗi truyền `deltaTime` khổng lồ ở lúc khởi tạo game. | ✅ Đã Fix (Verify Pass) |
| `BUG_04` | **[UX]** Random gạch dễ gây ức chế: Dùng `Math.random` đơn thuần thay vì thuật toán 7-bag chuẩn của Tetris. | ✅ Đã Fix (Verify Pass) |

## 3. Tính năng bổ sung (Enhancements)
Bên cạnh việc fix bug, đội Dev đã bổ sung thêm tính năng mới chưa có trong Test Plan nhưng hoạt động rất ổn định:
- Hiển thị màn hình mờ đen với dòng chữ **GAME OVER** khi thua cuộc.
- Cơ chế nhấn phím **Enter** để khởi động lại (Restart) game.

## 4. Kết luận
Dự án Tetris phiên bản trình duyệt đã hoàn thiện toàn bộ các tính năng cốt lõi (Giao diện, Điều khiển, Va chạm, Tính điểm, Game Over). Không phát hiện thêm lỗi nào (Zero-bug bounce). 

**Khuyến nghị:** Phần mềm đạt chất lượng tốt, có thể tiến hành Release.
