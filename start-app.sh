#!/bin/bash

# Tệp script giúp chạy cả server và ứng dụng React cùng lúc

echo "Khởi động Frontend Vocab Lab..."
echo "-----------------------------------"

# Kiểm tra xem đã cài đặt các dependency chưa
if [ ! -d "vocab-lab/node_modules" ]; then
  echo "Cài đặt dependencies cho ứng dụng React..."
  cd vocab-lab && npm install
  cd ..
fi

if [ ! -d "vocab-lab/server/node_modules" ]; then
  echo "Cài đặt dependencies cho server..."
  cd vocab-lab/server && npm install
  cd ../..
fi

# Khởi động server trong nền
echo "Khởi động server Express..."
cd vocab-lab/server && node server.js &
SERVER_PID=$!
cd ../..

# Đợi server khởi động
sleep 2
echo "Server đang chạy với PID: $SERVER_PID"

# Khởi động ứng dụng React
echo "Khởi động ứng dụng React..."
cd vocab-lab && npm start &
REACT_PID=$!
cd ..

echo "Ứng dụng React đang chạy với PID: $REACT_PID"
echo "-----------------------------------"
echo "Frontend Vocab Lab đã được khởi động!"
echo "- Server API: http://localhost:3001"
echo "- Ứng dụng React: http://localhost:3000"
echo ""
echo "Nhấn Ctrl+C để dừng cả hai ứng dụng."

# Xử lý khi người dùng nhấn Ctrl+C
trap 'echo "Đang dừng ứng dụng..." && kill $SERVER_PID $REACT_PID' INT

# Giữ script chạy
wait 