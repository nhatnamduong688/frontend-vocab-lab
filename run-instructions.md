# Hướng dẫn chạy ứng dụng Frontend Vocab Lab

Đây là hướng dẫn đầy đủ để chạy ứng dụng Vocabulary Lab, bao gồm cả phần front-end (React) và back-end (Express server).

## Cấu trúc dự án

```
frontend-vocab-lab/
├── vocab-lab/                 # Ứng dụng React (front-end)
│   ├── src/                   # Mã nguồn React
│   ├── public/                # Tài nguyên tĩnh
│   └── server/                # Server Express (back-end)
│       ├── server.js          # File chính của server
│       ├── data/              # Thư mục chứa dữ liệu
│       │   └── sentences.json # File lưu trữ các câu (tự động tạo)
│       └── package.json       # Cấu hình dependencies cho server
└── (các file khác)            # Các file và script hỗ trợ khác
```

## Các bước cài đặt và chạy ứng dụng

### 1. Cài đặt dependencies cho server

```bash
cd vocab-lab/server
npm install
```

### 2. Chạy server

```bash
cd vocab-lab/server
node server.js
```

Server sẽ chạy ở địa chỉ http://localhost:3001. Các câu đã tạo sẽ được lưu vào file `vocab-lab/server/data/sentences.json`.

### 3. Cài đặt dependencies cho ứng dụng React

```bash
cd vocab-lab
npm install
```

### 4. Chạy ứng dụng React

```bash
cd vocab-lab
npm start
```

Ứng dụng React sẽ chạy ở địa chỉ http://localhost:3000.

## Chạy cả hai cùng lúc (trong hai terminal khác nhau)

### Terminal 1 (Server):

```bash
cd vocab-lab/server
node server.js
```

### Terminal 2 (React App):

```bash
cd vocab-lab
npm start
```

## Cách kiểm tra kết nối với server

Ứng dụng hiển thị các chip trạng thái kết nối ở góc trên bên phải và ở footer:

1. **Connected / Offline**: Cho biết ứng dụng đã kết nối với server hay chưa
2. **Server Storage / Browser Storage**: Cho biết dữ liệu đang được lưu trữ ở đâu

Nếu chip hiển thị "Connected" và "Server Storage", dữ liệu được lưu vào cả server và localStorage. Nếu hiển thị "Offline" và "Browser Storage", dữ liệu chỉ được lưu vào localStorage của trình duyệt.

## API Endpoints

Server cung cấp các API endpoint sau:

- `GET /api/sentences`: Lấy tất cả các câu đã lưu
- `POST /api/sentences`: Lưu một câu mới
- `DELETE /api/sentences/:id`: Xóa một câu theo ID
- `DELETE /api/sentences`: Xóa tất cả các câu

## Cách sử dụng ứng dụng

1. Truy cập trang chủ http://localhost:3000
2. Chọn các từ vựng để tạo câu
3. Nhấn "Save Sentence" để lưu câu
4. Truy cập http://localhost:3000/saved-sentences để xem các câu đã lưu

## Dừng ứng dụng

Để dừng cả server và ứng dụng React, bạn có thể sử dụng tổ hợp phím Ctrl+C trong mỗi terminal hoặc sử dụng lệnh sau để tắt tất cả:

```bash
pkill -f "node server.js" && pkill -f "react-scripts start"
```

## Xử lý sự cố

### Server không khởi động

- Kiểm tra port 3001 có đang được sử dụng không: `lsof -i :3001`
- Đảm bảo các thư viện đã được cài đặt: `npm install`

### Ứng dụng React không khởi động

- Kiểm tra port 3000 có đang được sử dụng không: `lsof -i :3000`
- Xóa node_modules và cài đặt lại: `rm -rf node_modules && npm install`

### Không kết nối được với server

- Đảm bảo server đang chạy ở port 3001
- Kiểm tra CORS đã được cấu hình đúng trong server.js
- Thử restart server và ứng dụng React
