# 🚀 Laptop Store API - Postman Collection

## ⚡ Quick Start để khắc phục lỗi 401 Unauthorized

### 📋 **Các bước thực hiện:**

1. **Import Collection vào Postman**

   - File → Import → `laptop_store_crud_tests.json`

2. **Tạo Environment**

   - Environment → Add Environment → Tên: "Laptop Store Local"
   - Thêm biến `access_token` với value rỗng

3. **Chạy Authentication theo thứ tự:**

   ```
   1. Register User (tạo tài khoản)
   2. Login User with Token Extract (tự động lưu token)
   3. Verify Token (kiểm tra token hoạt động)
   ```

4. **Test các endpoint khác**
   - Token sẽ tự động được sử dụng cho các request cần authentication

### 🔐 **Lưu ý quan trọng:**

- **Login User with Token Extract** có script tự động lưu token vào Environment
- Endpoints có `@PreAuthorize("hasAuthority('SCOPE_ADMIN')")` cần quyền admin
- Nếu gặp 401, chạy lại "Login User with Token Extract"

### 📝 **Thứ tự test khuyến nghị:**

```
Authentication → Category CRUD → Brand CRUD → Product CRUD → Discount CRUD
```

### 🛠️ **Xử lý lỗi 401:**

1. Kiểm tra server đang chạy: `http://localhost:8081`
2. Chạy "Login User with Token Extract"
3. Kiểm tra biến `access_token` trong Environment có giá trị
4. Chạy lại request bị lỗi

### 📞 **Test nhanh:**

Chạy "Get All Categories" hoặc "Get All Brands" để test server đang hoạt động (không cần token).

---

**💡 Tip:** Luôn chạy Login trước khi test các endpoint khác!
