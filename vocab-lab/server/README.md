# Vocabulary Lab Server

Server nhỏ này giúp lưu trữ các câu đã tạo vào file, thay vì chỉ lưu trong localStorage của trình duyệt.

## Cài đặt

1. Cài đặt các gói phụ thuộc:

```bash
cd server
npm install
```

2. Khởi động server:

```bash
npm start
```

Server sẽ chạy tại địa chỉ `http://localhost:3001` và các câu sẽ được lưu vào file `server/data/sentences.json`.

## Cấu trúc

- `server.js`: File chính chứa logic của server
- `data/sentences.json`: File lưu trữ các câu (sẽ được tự động tạo khi có câu được lưu)

## API Endpoints

- `GET /api/sentences`: Lấy tất cả các câu
- `POST /api/sentences`: Lưu một câu mới
- `DELETE /api/sentences/:id`: Xóa một câu theo ID
- `DELETE /api/sentences`: Xóa tất cả các câu

## Lưu ý

- Server này sử dụng Express.js để tạo API
- Dữ liệu được lưu trữ trong file JSON nên không yêu cầu cài đặt cơ sở dữ liệu
- Trong trường hợp không kết nối được với server, ứng dụng sẽ tự động sử dụng localStorage làm phương án dự phòng
- Để chạy ứng dụng production, bạn cần build ứng dụng React và đặt các file build trong thư mục gốc của server 