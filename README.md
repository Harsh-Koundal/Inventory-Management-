# Inventory Management System

A robust, enterprise-grade Inventory Management System built to manage products, stock levels, and order pipelines with absolute consistency and safety. The system prevents race conditions, enforces transactional integrity, and logs full audit trails of all stock movements.

---

## Technical Stack

- **Backend**: Node.js, Express.js, MySQL, Prisma ORM, JWT authentication, Zod (validation)
- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide React (icons)

---

## Project Structure

```text
Inventory-Management/
├── Client-Side/               # React Vite Frontend Application
│   ├── src/
│   │   ├── components/        # Shared components (tables, badges, UI elements)
│   │   ├── context/           # Inventory React Context State Manager
│   │   ├── layouts/           # Page layouts (Dashboard sidebar)
│   │   ├── modals/            # Confirmation dialogues and entry forms
│   │   ├── pages/             # Major pages (Dashboard, Products, Stock, Orders, History)
│   │   └── services/          # Base Axios client and API wrappers
│   ├── package.json
│   └── vite.config.js
│
├── Server-Side/               # Express.js REST API
│   ├── config/                # Database connection & Prisma client instantiation
│   ├── controllers/           # Endpoint handlers (auth, products, orders, stock)
│   ├── middleware/            # JWT validation and routing rules
│   ├── prisma/                # DB Schema and schema files
│   ├── routes/                # API routes definition
│   ├── scripts/               # One-time migration scripts
│   ├── utils/                 # Response serialization mappers
│   ├── package.json
│   └── server.js
│
└── docs/
    └── postman_collection.json # API specifications for testing
```

---

## Core Features & Business Rules

1. **Clean Product Mapping**: Eliminates JSON encoding in description fields. Category, minimum stock, and descriptions are stored as first-class MySQL database columns.
2. **Double-Entry Stock Audit Trail**: Every inventory adjustment, order placement, and cancellation logs a `StockHistory` record containing:
   - Movement quantity (negative for stock-out, positive for stock-in)
   - Previous quantity on hand
   - New quantity on hand after adjustment
   - Actor id and notes/reference order numbers
3. **Atomic Concurrency Protection**: Utilizing database transactions (`$transaction`) and database-level atomic increments/decrements. Stock calculations do not rely on out-of-transaction stale reads, fully protecting against lost updates under heavy concurrent requests.
4. **Prevention of Negative Stock**: If any order decrement or manual subtraction causes stock to fall below zero, the transaction throws an exception and rolls back the database operation.
5. **Soft Deletions**: Deleting a product sets `isActive = false`, retaining product records to maintain foreign key referential integrity in history logs and orders.
6. **SKU Uniqueness**: Unique keys are enforced on the SKU database column.
7. **JWT Security**: Backend APIs are protected via JWT HTTP Bearer token validation and HTTP-Only secure cookies.

---

## Getting Started

### 1. Database Setup

Ensure MySQL is running on your machine. Create a clean database:

```sql
CREATE DATABASE inventory_db;
```

### 2. Backend Installation & Configurations

1. Navigate to the server folder:
   ```bash
   cd Server-Side
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `Server-Side` folder:
   ```env
   NODE_ENV = development
   PORT = 5020
   CLIENT_URL = http://localhost:5173
   DATABASE_URL = mysql://root:YOUR_PASSWORD@localhost:3306/inventory_db
   JWT_SECRET = YourSecretKeyGoesHere
   AUTH_COOKIE_NAME = InventoryManagementSystemAuthCookie
   ```
4. Push the Prisma schema and run migrations to create tables:
   ```bash
   npx prisma db push
   ```
5. (Optional) Run the database metadata migration script if you have legacy JSON description data:
   ```bash
   node scripts/migrateProductMetadata.js
   ```

### 3. Frontend Installation & Configurations

1. Navigate to the client folder:
   ```bash
   cd ../Client-Side
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Client-Side` folder (defaults to localhost:5020):
   ```env
   VITE_API_BASE_URL = http://localhost:5020/api
   ```

---

## Run Locally

### Start Backend

From the `Server-Side` directory:

```bash
npm run dev
```

*Note: On startup, the backend automatically connects to MySQL and seeds a default Administrator account if it doesn't already exist:*
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Start Frontend

From the `Client-Side` directory:

```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## API Reference

All requests must contain a valid JWT in the headers: `Authorization: Bearer <JWT_TOKEN>`.

### Authentication
- `POST /api/auth/login` - Authenticate credentials and receive token.
- `POST /api/auth/logout` - Clear cookies and sessions.

### Products
- `GET /api/products` - List active products.
- `POST /api/products` - Create a new product.
- `PUT /api/products/:id` - Update product details.
- `DELETE /api/products/:id` - Soft-delete product.

### Stock
- `GET /api/stock/history` - Get complete inventory audit movements list.
- `POST /api/stock/adjust` - Adjust product stock levels manually.

### Orders
- `GET /api/orders` - Get order history.
- `POST /api/orders` - Place a new order (updates stock and adds history records).
- `PATCH /api/orders/:id/cancel` - Cancel a pending order (restores stock and logs history).

---

## API Testing (Postman)

Import the provided file in Postman for rapid local testing:
`docs/postman_collection.json`