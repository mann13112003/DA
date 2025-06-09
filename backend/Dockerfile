# Dùng image Node.js chính thức
FROM node:18

# Thư mục làm việc
WORKDIR /app

# Copy lock‑file và cài dependency
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy toàn bộ source
COPY . .

# Thiết lập biến môi trường PORT
ENV PORT=3001

# Expose đúng port mà server lắng nghe
EXPOSE 3001

# Khởi chạy
CMD ["npm", "start"]
