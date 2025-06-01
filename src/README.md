# Restaurant Order Management Frontend

This is the frontend for the Restaurant Order Management System, built with **React**. It connects to the backend REST API for all data operations.

---

## 📁 Folder Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level components (views)
│   ├── api/              # API utility functions
│   ├── App.js            # Root component
│   ├── index.js          # Entry point
│   └── ...               # Other config and utility files
├── .env                  # API endpoint config (not committed)
├── .env.example          # Example environment file
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Move to the frontend directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   - Copy `.env.example` to `.env`
   - Set the backend API URL in `.env`:

   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the application:**
   ```bash
   npm start
   ```
   The app will run on [http://localhost:3000](http://localhost:3000) by default.

---

## 🖥️ Features

- **Menu Management:** View and add menu items.
- **Order Handling:** Place, view, and update orders.
- **Customer Feedback:** Submit and view feedback.
- **Admin Panel:** Manage admin accounts (basic).

---

## 📚 API Integration

All API requests are configured to use `REACT_APP_API_URL` as the base URL, defined in your `.env` file.

**Example usage:**
```javascript
const res = await fetch(`${process.env.REACT_APP_API_URL}/orders`);
```

---

## 🔐 Environment Variables

| Variable            | Description                        |
|---------------------|------------------------------------|
| REACT_APP_API_URL   | Base URL for the backend API       |

---

## 💡 Tips

- Keep your components modular and reusable.
- Use environment variables for API endpoints.
- Use state management for complex pages (Context API, Redux, etc., as needed).

---

## 🛡️ Security Notes

- Never expose sensitive tokens or API keys in the frontend.
- Validate all user inputs.

---

## 📄 License

MIT

---
