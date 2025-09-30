# Hướng dẫn chạy dự án Spring Boot - Bán Laptop

## 📂 Cấu trúc dự án

- **Backend:** `LaptopStore` (Spring Boot)
- **Frontend:** `FE_Laptop-master`

---

## 🚀 Các bước cài đặt và khởi chạy

### 1. Cài đặt Cơ sở dữ liệu (CSDL)

1. Mở file `CSDL.txt`.
2. Sao chép toàn bộ nội dung trong file.
3. Dán và thực thi đoạn mã SQL đó trong hệ quản trị CSDL bạn đang sử dụng (ví dụ: MySQL Workbench, DBeaver, phpMyAdmin...).

### 2. Cấu hình Backend (`LaptopStore`)

1. Mở file `LaptopStore/src/main/resources/application.properties.example`. Tạo 1 bản sao tên `application.properties`
2. Chỉnh sửa các thông tin sau để phù hợp với môi trường của bạn:
   - **Cổng chạy của backend (nếu cần):** `server.port`
   - **Tên cơ sở dữ liệu:** `spring.datasource.url`
   - **Tên đăng nhập CSDL:** `spring.datasource.username`
   - **Mật khẩu CSDL:** `spring.datasource.password`

### 3. Khởi chạy Backend

Mở một cửa sổ dòng lệnh (Terminal 1) và chạy các lệnh sau:

```bash
# Di chuyển vào thư mục backend
cd LaptopStore

# Khởi chạy server
./mvnw spring-boot:run
```

### 4. Khởi chạy Frontend

Mở một cửa sổ dòng lệnh khác (Terminal 2) và chạy các lệnh sau:

```bash
# Di chuyển vào thư mục frontend
cd FE_Laptop-master

# Cài đặt các gói phụ thuộc (chỉ cần chạy lần đầu)
npm install

# Khởi chạy giao diện người dùng
npm start
```

> **Lưu ý:** Lệnh `npm install` chỉ cần thiết cho lần chạy đầu tiên hoặc khi có sự thay đổi về thư viện.

### 5. Truy cập ứng dụng

Sau khi hoàn tất, giao diện sẽ được hiển thị tại địa chỉ:

👉 [http://localhost:3000/](http://localhost:3000/)

---

## 🔑 Thông tin tài khoản

### 1. Tài khoản Admin

- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `123456`

### 2. Tài khoản người dùng

- **Tên đăng nhập:** `dat`
- **Mật khẩu:** `123456`
