# Tetris

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