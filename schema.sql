-- schema.sql

-- ==========================================
-- 1. SYSTEM, CMS SETTINGS & MEDIA
-- ==========================================

CREATE TABLE IF NOT EXISTS "Setting" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT UNIQUE NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Media" (
    "id" TEXT PRIMARY KEY,
    "publicId" TEXT UNIQUE NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "folder" TEXT,
    "uploadedBy" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Language" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN DEFAULT 0,
    "isActive" BOOLEAN DEFAULT 1,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Translation" (
    "id" TEXT PRIMARY KEY,
    "languageId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE CASCADE,
    UNIQUE("languageId", "key")
);

CREATE TABLE IF NOT EXISTS "Page" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "isPublished" BOOLEAN DEFAULT 1,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Widget" (
    "id" TEXT PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER DEFAULT 0,
    FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT DEFAULT 'UNREAD',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. USER & SESSION MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT DEFAULT 'WAITER',
    "isActive" BOOLEAN DEFAULT 1,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT PRIMARY KEY,
    "cashierId" TEXT NOT NULL,
    "startTime" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "status" TEXT DEFAULT 'ACTIVE',
    "openingBalance" REAL NOT NULL,
    "closingBalance" REAL,
    "notes" TEXT,
    FOREIGN KEY ("cashierId") REFERENCES "User" ("id") ON DELETE RESTRICT
);

-- ==========================================
-- 3. INVENTORY & RECIPE MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS "RawMaterial" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "currentStock" REAL DEFAULT 0,
    "minimumStock" REAL DEFAULT 0,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "StockTransaction" (
    "id" TEXT PRIMARY KEY,
    "materialId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("materialId") REFERENCES "RawMaterial" ("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN DEFAULT 1,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Recipe" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantityUsed" REAL NOT NULL,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("materialId") REFERENCES "RawMaterial" ("id") ON DELETE RESTRICT,
    UNIQUE("productId", "materialId")
);

-- ==========================================
-- 4. POS, TABLES, & KDS MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS "Table" (
    "id" TEXT PRIMARY KEY,
    "tableNumber" INTEGER UNIQUE NOT NULL,
    "qrCodeUrl" TEXT,
    "isActive" BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT PRIMARY KEY,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "tableId" TEXT,
    "sessionId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'PENDING',
    "subTotal" REAL NOT NULL,
    "taxAmount" REAL DEFAULT 0,
    "totalAmount" REAL NOT NULL,
    "isPaid" BOOLEAN DEFAULT 0,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("tableId") REFERENCES "Table" ("id") ON DELETE SET NULL,
    FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "subTotal" REAL NOT NULL,
    "notes" TEXT,
    FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT
);