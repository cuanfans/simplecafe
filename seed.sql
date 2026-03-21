-- Buat hash password 'admin123' (Ini adalah hash SHA-256 murni untuk 'admin123')
-- Harap SEGERA ganti password setelah berhasil login!
INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "isActive", "createdAt", "updatedAt") 
VALUES (
  'admin-uuid-001', 
  'System Administrator', 
  'admin@simplecafe.com', 
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 
  'ADMINISTRATOR', 
  1, 
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP
);
