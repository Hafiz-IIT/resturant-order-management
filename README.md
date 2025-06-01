# Restaurant Order Management API

A Node.js + Express backend for managing restaurant menu items, orders, feedback, and admin authentication. Uses MongoDB for storage.

## Features

- Menu management (CRUD)
- Order management (create, list, change status)
- Customer feedback collection
- Admin authentication (JWT-based)
- Secure routes for admins

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Hafiz-IIT/resturant-order-management.git
cd resturant-order-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```
Edit `.env` and set:
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A random string for JWT signing
- `PORT`: (optional) Port to run server (default: 5000)

### 4. Run the server

```bash
npm start
```
or
```bash
node server.js
```

## API Endpoints

### Auth

- `POST /api/login` — Login as admin
- `POST /api/register-admin` — Register an admin (run once, then remove/comment out for security)

### Menu

- `GET /api/menu` — List menu items
- `POST /api/menu` — Create menu item (admin only)
- `PUT /api/menu/:id` — Update menu item (admin only)
- `DELETE /api/menu/:id` — Delete menu item (admin only)

### Orders

- `POST /api/orders` — Place order
- `GET /api/orders` — List orders
- `PUT /api/orders/:id/status` — Update order status (admin only)

### Feedback

- `POST /api/feedback` — Submit feedback
- `GET /api/feedback` — List feedback (admin only)

## License

MIT
