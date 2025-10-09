# Hướng Dẫn Xử Lý Lỗi 401 Unauthorized - Laptop Store API

## 🚨 Lỗi 401 Unauthorized - Nguyên Nhân & Cách Khắc Phục

### 📋 **Các Nguyên Nhân Chính:**

1. **Không có token xác thực**
2. **Token không hợp lệ hoặc sai định dạng**
3. **Token đã hết hạn**
4. **Thiếu quyền admin cho các endpoint yêu cầu**
5. **Sai cách gửi token trong header**

---

## 🔧 **Cách Khắc Phục Từng Bước:**

### **Bước 1: Đăng Ký & Đăng Nhập Để Lấy Token**

#### 1.1. Đăng ký tài khoản (nếu chưa có)

```bash
POST http://localhost:8081/api/v1/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123",
    "fullName": "Test User"
}
```

#### 1.2. Đăng nhập để lấy token

```bash
POST http://localhost:8081/api/v1/auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "password123"
}
```

**Response sẽ trả về:**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "testuser@example.com",
      "fullName": "Test User"
    }
  }
}
```

### **Bước 2: Thiết Lập Token Trong Postman**

#### 2.1. Tự động lưu token (khuyến nghị)

Thêm script vào tab **Tests** của request login:

```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  if (jsonData.data && jsonData.data.token) {
    pm.environment.set("access_token", jsonData.data.token);
    pm.environment.set("user_id", jsonData.data.user.id);
    console.log("Token saved:", jsonData.data.token);
  }
}
```

#### 2.2. Thủ công copy token

1. Copy token từ response của login
2. Vào **Environment Variables**
3. Set giá trị cho biến `access_token`

### **Bước 3: Sử Dụng Token Đúng Cách**

#### 3.1. Định dạng Header đúng

```
Authorization: Bearer {{access_token}}
```

#### 3.2. Các endpoint cần token

- **Admin endpoints**: Cần token admin + quyền `SCOPE_ADMIN`
- **User endpoints**: Cần token user hợp lệ

---

## 🔐 **Xử Lý Quyền Admin**

### **Tạo Tài Khoản Admin:**

1. **Đăng ký tài khoản admin:**

```bash
POST http://localhost:8081/api/v1/auth/register
Content-Type: application/json

{
    "username": "admin",
    "email": "admin@laptopstore.com",
    "password": "admin123",
    "fullName": "Administrator"
}
```

2. **Cấp quyền admin trong database** (cần truy cập database):

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
```

3. **Đăng nhập với tài khoản admin:**

```bash
POST http://localhost:8081/api/v1/auth/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
}
```

---

## 📝 **Thứ Tự Test Khuyến Nghị**

### **1. Test Authentication trước:**

1. ✅ Register User
2. ✅ Login User (với script tự động lưu token)
3. ✅ Verify Token
4. ✅ Register Admin (nếu cần)
5. ✅ Login Admin (nếu cần)

### **2. Test Public Endpoints:**

- ✅ Get All Categories
- ✅ Get All Brands
- ✅ Get All Products
- ✅ Get Product Detail

### **3. Test User Endpoints (cần token user):**

- ✅ Change Password
- ✅ Get User Info

### **4. Test Admin Endpoints (cần token admin):**

- ✅ Create Category/Brand/Product
- ✅ Update Category/Brand/Product
- ✅ Delete Category/Brand/Product
- ✅ Admin Product Management

---

## 🛠️ **Debug & Troubleshooting**

### **Kiểm tra token trong Postman:**

1. Mở **Console** (View → Show Postman Console)
2. Chạy request login với script
3. Xem log "Token saved: ..."
4. Kiểm tra **Environment Variables**

### **Kiểm tra định dạng token:**

Token JWT hợp lệ có dạng: `xxxxx.yyyyy.zzzzz`

- Phần 1: Header
- Phần 2: Payload
- Phần 3: Signature

### **Test token hợp lệ:**

```bash
GET http://localhost:8081/api/v1/auth/{{username}}
Authorization: Bearer {{access_token}}
```

### **Các lỗi thường gặp:**

| Lỗi                 | Nguyên nhân    | Cách khắc phục         |
| ------------------- | -------------- | ---------------------- |
| `401 Unauthorized`  | Không có token | Đăng nhập để lấy token |
| `401 Invalid token` | Token sai      | Đăng nhập lại          |
| `401 Token expired` | Token hết hạn  | Đăng nhập lại          |
| `403 Forbidden`     | Không đủ quyền | Dùng tài khoản admin   |

---

## 📋 **Checklist Before Testing**

- [ ] Server đang chạy trên port 8081
- [ ] Đã tạo tài khoản user/admin
- [ ] Đã đăng nhập và lưu token
- [ ] Token được set đúng trong Environment
- [ ] Header Authorization đúng định dạng
- [ ] Đang test endpoint phù hợp với quyền

---

## 🎯 **Quick Fix Commands**

### **Khởi động lại server:**

```bash
cd LaptopStore
./mvnw spring-boot:run
```

### **Kiểm tra server đang chạy:**

```bash
curl http://localhost:8081/api/v1/categories/all
```

### **Test login nhanh:**

```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

**💡 Lưu ý:** Luôn test authentication trước khi test các endpoint khác!
