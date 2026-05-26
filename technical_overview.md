# BÁO CÁO KỸ THUẬT: TRÒ CHƠI TETRIS
> **Tài liệu thuyết trình kỹ thuật** dành cho nhà phát triển, giải thích chi tiết cấu trúc, công nghệ và các thuật toán cốt lõi được sử dụng trong dự án.

---

## 1. Tổng quan Công nghệ (Tech Stack)
Dự án được xây dựng theo triết lý **Vanilla & Zero-dependency** (không sử dụng thư viện ngoài hay công cụ build phức tạp), hướng đến sự tối giản và hiệu năng cao nhất trên trình duyệt:

*   **HTML5 Canvas API**: Sử dụng làm công cụ render đồ họa chính. Thay vì vẽ các thẻ HTML, game vẽ trực tiếp lên canvas ở mức sub-pixel để đạt hiệu suất tối ưu và mượt mà.
*   **Vanilla JavaScript (ES6+)**: Toàn bộ logic điều khiển, ma trận va chạm, vòng lặp game (game loop) và tính điểm đều được viết bằng JS thuần.
*   **Modern CSS (Vanilla CSS)**: Thiết kế giao diện hiện đại với:
    *   **Glassmorphism**: Đổ bóng đa lớp, hiệu ứng viền mờ (`border: 1px solid var(--border-subtle)`).
    *   **Responsive Layout**: Kết hợp Flexbox và CSS Grid cùng kỹ thuật `@media` query giúp giao diện hoạt động tốt trên cả máy tính lẫn thiết bị di động.
    *   **Typography**: Sử dụng font chữ hiện đại từ Google Fonts (`Outfit` cho nội dung và `JetBrains Mono` cho điểm số/nút bấm).

---

## 2. Cấu trúc Dự án
Dự án được tổ chức khoa học, tách biệt hoàn toàn giữa cấu trúc, giao diện và logic điều khiển:
```
.
├── index.html          # Cấu trúc trang chủ, khai báo Canvas và nạp tài nguyên
├── assets/
│   ├── css/
│   │   └── style.css   # Giao diện, thiết kế Responsive & hiệu ứng Glassmorphism
│   └── js/
│       └── game.js     # Logic game, quản lý ma trận, điều khiển & vẽ Canvas
└── readme.md           # Hướng dẫn chạy thử và điều khiển cơ bản
```

---

## 3. Các Thành phần Kỹ thuật Cốt lõi (Core Architectures)

### A. Quản lý Ma trận Sân chơi (Arena Matrix)
Sân chơi được biểu diễn bằng một **Ma trận 2D** kích thước **12x20** (12 cột, 20 dòng):
*   Giá trị `0`: Đại diện cho ô trống.
*   Giá trị `1 - 7`: Đại diện cho các khối gạch đã cố định (mỗi số tương ứng với một mã màu riêng biệt của 7 loại khối Tetrominoes).

### B. Trạng thái Người chơi (Player State)
Đối tượng `player` lưu trữ trạng thái động của khối gạch đang rơi:
*   `pos`: Tọa độ hiện tại `{x, y}` của khối trên ma trận sân chơi.
*   `matrix`: Ma trận 2D mô tả hình dạng và hướng xoay của khối gạch hiện tại.
*   `score`: Điểm số hiện tại của người chơi.

### C. Cơ chế kiểm soát Độ sắc nét (High-DPI / Retina Resolution)
Nhằm tránh tình trạng mờ hình trên các màn hình có mật độ điểm ảnh cao (Retina, 4K), game sử dụng cơ chế nhân tỉ lệ theo **Device Pixel Ratio (DPR)**, phóng to số pixel thực tế của Canvas và co nhỏ lại bằng CSS để giữ nét vẽ luôn sắc nét.

---

## 4. Chi tiết các Hàm xử lý (Functions Breakdown)

Dưới đây là bảng phân tích toàn bộ các hàm trong file `game.js` được chia theo các nhóm chức năng chính:

### Nhóm 1: Khởi tạo & Co giãn Giao diện (Responsive & Canvas Initialization)
| Tên hàm | Vai trò kỹ thuật | Giải thích chi tiết |
| :--- | :--- | :--- |
| **`getDpr()`** | Lấy tỉ lệ pixel thiết bị | Trả về giá trị `devicePixelRatio` của màn hình (giới hạn tối đa là 2 để tối ưu hóa hiệu năng render). |
| **`syncCanvasPixels()`** | Đồng bộ kích thước vật lý của Canvas | Điều chỉnh số lượng pixel thực tế vẽ trên Canvas tương ứng với DPR, sau đó sử dụng `context.setTransform` để đồng bộ tọa độ vẽ đồ họa. |
| **`fitCellSize()`** | Tính toán kích thước ô gạch động | Dựa vào không gian hiển thị hiện tại của màn hình chơi để tự động tính toán kích thước của một ô vuông (`CELL_SIZE`) tối ưu nhất (từ 14px đến 40px). |

### Nhóm 2: Logic Game & Va chạm (Game Logic & Collision)
| Tên hàm | Vai trò kỹ thuật | Giải thích chi tiết |
| :--- | :--- | :--- |
| **`createMatrix(w, h)`** | Tạo ma trận rỗng | Khởi tạo một mảng 2 chiều kích thước `w` x `h` chứa toàn bộ giá trị `0`, dùng để dựng sân chơi (Arena). |
| **`createPiece(type)`** | Sinh khối gạch Tetrominoes | Trả về ma trận 2D tĩnh tương ứng với 7 khối gạch huyền thoại: `T`, `O`, `L`, `J`, `I`, `S`, `Z`. Mỗi khối có một giá trị số định danh màu khác nhau. |
| **`collide(arena, player)`** | Phát hiện va chạm vật lý | Duyệt qua ma trận khối gạch của người chơi tại tọa độ `player.pos`. Nếu phát hiện bất kỳ ô nào khác `0` chồng đè lên ô khác `0` trong sân chơi hoặc vượt ra ngoài biên, hàm sẽ trả về `true` (có va chạm). |
| **`merge(arena, player)`** | Hợp nhất khối gạch vào sân chơi | Khi khối gạch chạm đất và không thể di chuyển nữa, sao chép toàn bộ giá trị ma trận của khối gạch vào ma trận sân chơi tại tọa độ tương ứng. |
| **`arenaSweep()`** | Quét và xóa hàng đầy | Kiểm tra từ hàng cuối cùng lên trên. Nếu hàng nào chứa toàn bộ các số khác `0` (đầy gạch), hàng đó sẽ bị xóa, dồn toàn bộ các hàng phía trên xuống một dòng, và tính điểm cộng dồn cấp số nhân (Combo multiplier). |

### Nhóm 3: Vẽ Đồ họa (Rendering Engine)
| Tên hàm | Vai trò kỹ thuật | Giải thích chi tiết |
| :--- | :--- | :--- |
| **`draw()`** | Hàm vẽ chính (Master Render) | Xóa màn hình vẽ cũ, vẽ hình nền tối, lưới ô vuông mờ (`drawGrid`), sau đó vẽ ma trận sân chơi ổn định và khối gạch đang rơi. |
| **`drawGrid()`** | Vẽ lưới căn chỉnh | Vẽ các đường kẻ đứt nét siêu mờ (`rgba(255,255,255,0.05)`) giúp người chơi dễ dàng ước lượng khoảng cách rơi của các khối gạch. |
| **`drawBlock(gx, gy, fill)`** | Vẽ một ô gạch đơn lẻ | Vẽ khối vuông kèm hiệu ứng giả lập 3D thời thượng (sử dụng 2 dải sáng tối bán trong suốt ở viền trên/trái và viền dưới/phải để tạo độ nổi khối chuyên nghiệp). |
| **`drawMatrix(matrix, offset)`** | Quét vẽ ma trận | Lặp qua từng phần tử trong một ma trận 2D bất kỳ, bỏ qua các ô bằng `0`, và gọi hàm `drawBlock` để dựng hình lên Canvas tại vị trí có độ lệch (`offset`) tương ứng. |

### Nhóm 4: Điều khiển & Xoay khối (Player Interaction & Movement)
| Tên hàm | Vai trò kỹ thuật | Giải thích chi tiết |
| :--- | :--- | :--- |
| **`playerMove(dir)`** | Di chuyển sang ngang | Thay đổi tọa độ `player.pos.x` theo hướng `dir` (`-1` là sang trái, `1` là sang phải). Nếu phát hiện va chạm (`collide`), lập tức lùi lại vị trí cũ. |
| **`playerDrop()`** | Rơi nhanh / Rơi tự động | Tăng tọa độ `player.pos.y`. Nếu gạch chạm nền hoặc khối gạch khác, nó sẽ lùi lại 1 ô, gọi hàm `merge` để gắn gạch vào Arena, sinh khối mới (`playerReset`), xóa hàng đầy (`arenaSweep`), cập nhật điểm số. |
| **`rotate(matrix, dir)`** | Thuật toán xoay ma trận | Xoay ma trận 2D bằng cách chuyển vị ma trận (Transpose: hoán đổi hàng thành cột) kết hợp đảo ngược thứ tự các cột/hàng tùy theo hướng xoay `dir`. |
| **`playerRotate(dir)`** | Điều khiển xoay và chống kẹt (Wall-kick) | Xoay khối gạch của người chơi. Nếu sau khi xoay bị va chạm (ví dụ sát tường), hàm sẽ tự động dịch chuyển khối gạch sang trái hoặc phải để tìm chỗ trống thích hợp. Nếu không tìm thấy, khối gạch sẽ được xoay ngược lại vị trí cũ để bảo toàn tính hợp lệ. |
| **`playerReset()`** | Tạo khối gạch mới | Lấy ngẫu nhiên 1 trong 7 khối gạch đưa lên đỉnh màn hình chơi. Nếu khối vừa xuất hiện đã va chạm ngay lập tức với gạch cũ, trò chơi sẽ được khởi động lại (Game Over & Reset). |
| **`updateScore()`** | Cập nhật điểm số | Cập nhật giá trị điểm hiển thị lên giao diện HTML thông qua thao tác DOM trực tiếp. |

### Nhóm 5: Vòng lặp chính & Lắng nghe Sự kiện (Game Loop & Event Listeners)
| Thành phần | Vai trò kỹ thuật | Giải thích chi tiết |
| :--- | :--- | :--- |
| **`update(time)`** | Vòng lặp chính (Game Loop) | Sử dụng `requestAnimationFrame` để tạo vòng lặp mượt mà ổn định ở mức 60FPS. Hàm tự động tính toán thời gian chênh lệch giữa các khung hình (`deltaTime`) để đảm bảo tốc độ rơi tự nhiên luôn đồng đều trên mọi loại cấu hình máy tính. |
| **Sự kiện `keydown`** | Bắt tín hiệu phím bấm | Lắng nghe các phím bấm từ người chơi: `←`, `→` để di chuyển; `↓` để rơi nhanh; `↑`, `Q`, `W` để xoay khối gạch. Gọi `event.preventDefault()` để ngăn trang web bị cuộn lên xuống khi đang chơi. |
| **`ResizeObserver` & `resize`** | Đáp ứng Responsive thông minh | Lắng nghe sự thay đổi kích thước của màn chơi phát ra từ trình duyệt hoặc hệ thống để cập nhật lại giao diện ngay lập tức mà không cần tải lại trang. |

---

## 5. Các Điểm nhấn Thuyết trình (Presentation Highlights)
Nếu trình bày trước hội đồng hoặc khán giả, bạn nên nhấn mạnh **3 đặc điểm kỹ thuật** xuất sắc sau:
1.  **Pixel-Perfect High-DPI Rendering**: Thuật toán tự động phát hiện mật độ điểm ảnh (Retina/4K) để nhân đôi độ phân giải Canvas, giúp hình vẽ luôn cực kỳ sắc nét trên mọi màn hình cao cấp.
2.  **Thuật toán Chống kẹt Tường (Wall-kick)**: Khi xoay khối gạch ở sát biên hoặc sát các khối gạch khác, game không bị lỗi đứng hình mà tự động "đẩy nhẹ" khối gạch ra để xoay hợp lệ.
3.  **Vòng lặp Game độc lập tần số quét (Delta-time Frame Independent)**: Tốc độ rơi của gạch được tính toán dựa trên thời gian thực tế trôi qua (`deltaTime`), do đó dù chơi trên màn hình 60Hz, 144Hz hay máy cấu hình yếu bị giật lag thì tốc độ gạch rơi vẫn hoàn toàn chính xác như nhau.
