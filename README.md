# 📚 Student Book Exchange Portal (BookExchange)

A simple, student-friendly Book Exchange Portal built using the MERN stack (MongoDB, Express, React, Node.js).

## 🎯 Features

### User Module
- Student registration (Name, Email, Password, Phone)
- Login and logout functionality
- View and edit profile

### Book Module
- Add books with details (Title, Author, Price, Condition, Image)
- Browse all available books on homepage
- Search books by title
- Delete own books

### Exchange Module
- Request books from other students
- Accept or reject book requests
- Track request status (Pending/Accepted/Rejected)

### Admin Module
- View all users
- Delete inappropriate books

## 🛠️ Technology Stack

- **Frontend:** React + CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT

## 📁 Project Structure

```
BXP/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── exchangeController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Exchange.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── exchangeRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BXP
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend folder:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookexchange
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Application**
   
   Start Backend (from backend folder):
   ```bash
   npm start
   ```
   
   Start Frontend (from frontend folder):
   ```bash
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Book Routes
- `GET /api/books` - Get all books
- `GET /api/books/search?title=` - Search books by title
- `POST /api/books` - Add a new book
- `DELETE /api/books/:id` - Delete a book

### Exchange Routes
- `POST /api/exchanges/request/:bookId` - Request a book
- `GET /api/exchanges/sent` - Get sent requests
- `GET /api/exchanges/received` - Get received requests
- `PUT /api/exchanges/:id/accept` - Accept a request
- `PUT /api/exchanges/:id/reject` - Reject a request

### Admin Routes
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/books/:id` - Delete any book

## 👤 Default Admin Credentials
- Email: admin@bookexchange.com
- Password: admin123

## 📄 License
This project is created for educational purposes.
