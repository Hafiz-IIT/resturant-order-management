# Restaurant Order Management Backend

This is the backend API for your restaurant order management system, built with **Node.js**, **Express**, and **MongoDB**. It is structured using the MVC pattern for professional scalability and maintainability.

---

## 📁 Folder Structure

```
server/
├── controllers/      # Route logic (business logic)
├── models/           # Mongoose data models (schemas)
├── routes/           # Express route definitions
├── .env              # Environment variables (not committed)
├── .env.example      # Example environment file for setup
├── server.js         # Main entry point
└── README.md         # Project documentation
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-root>/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your MongoDB URI and desired PORT.

   Example `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/restaurant_order_db
   PORT=5000
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

---

## 📚 API Endpoints

### Menu

- `GET /api/menu` — Get all menu items
- `POST /api/menu` — Add a new menu item

### Orders

- `GET /api/orders` — Get all orders
- `POST /api/orders` — Create a new order
- `PATCH /api/orders/:id/status` — Update order status

### Feedback

- `GET /api/feedback` — Get all feedback
- `POST /api/feedback` — Submit feedback

### Admin

- `GET /api/admins` — Get all admins
- `POST /api/admins` — Create a new admin

---

## 🔐 Environment Variables

| Variable   | Description                   |
|------------|------------------------------|
| MONGO_URI  | MongoDB connection string    |
| PORT       | Port to run the server on    |

---

## ✨ Contributing

- Fork, branch, and make a pull request for contributions.
- Use meaningful commit messages and keep code modular.

---

## 🛡️ Security Notes

- **Passwords are stored in plain text for demonstration.**  
  Use hashing (e.g., bcrypt) for production.
- Never commit your real `.env` file.

---

## 📄 License

MIT

---
