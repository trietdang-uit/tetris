# Nhóm #08: Bài cuối kì môn Kỹ năng nghề nghiệp

Giảng viên hướng dẫn:
ThS. Nguyễn Văn Toàn

Nhóm sinh viên thực hiện:
Phạm Thụy Thanh Hằng - 25730110
Phạm Chiêu Đan Phượng - 25730136
Đặng Minh Triết - 25730155
Phạm Trần Đức Trọng - 25730156
Hoàng Chí Công - 25730101


# Tetris

## Nhóm #08: Bài cuối kì môn Kỹ năng nghề nghiệp

**Giảng viên hướng dẫn:** ThS. Nguyễn Văn Toàn

**Nhóm sinh viên thực hiện:**
* Phạm Thụy Thanh Hằng - 25730110
* Phạm Chiêu Đan Phượng - 25730136
* Đặng Minh Triết - 25730155
* Phạm Trần Đức Trọng - 25730156
* Hoàng Chí Công - 25730101

Trò chơi xếp gạch chạy trên trình duyệt (HTML5 Canvas, vanilla JS, không build).

## Cấu trúc thư mục

```
.
├── index.html          # Trang chủ, nạp CSS/JS
├── assets/
│   ├── css/
│   │   └── style.css   # Giao diện
│   └── js/
│       └── tetris.js   # Logic game & vẽ canvas
├── readme.md
└── .gitignore
```

## Chạy thử

Mở `index.html` trực tiếp trong trình duyệt, hoặc phục vụ tĩnh bằng bất kỳ HTTP server nào (ví dụ `npx serve .`).

## Điều khiển

| Phím | Hành động |
|------|-----------|
| ← → | Di chuyển trái / phải |
| ↓ | Rơi nhanh xuống |
| ↑ | Xoay sang trái / phải |
| Q | Xoay sang trái |
| W | Xoay sang phải |
Hang Pham đã kiểm tra game.