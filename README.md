# Mini E-Commerce API

[![ER Diagram](https://dbdiagram.io/d/698df00cbd82f5fce28c0670)  
*Click image to view full ER Diagram*

## 🚀 Project Overview
Mini E-Commerce API is a backend system simulating a basic online shopping platform.  
It includes **authentication**, **role-based access**, **product management**, **cart operations**, and **order processing**, ensuring proper business logic and data consistency.

---

## 📦 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Authentication:** JWT  
- **Environment Management:** dotenv  

---

## 🧱ER Diagram
![ER Diagram](https://dbdiagram.io/d/698df00cbd82f5fce28c0670)  

**Database Relationships:**  
- Users → Carts (1:N)  
- Users → Orders (1:N)  
- Orders → OrderItems (1:N)  
- Products → OrderItems (1:N)  
- Products → Carts (1:N)  

---

## 🔐 Authentication & Authorization
- User registration & login  
- Role-based access: **Admin** / **Customer**  
- JWT-secured endpoints  
- Prevents fraudulent behaviors like repeated order cancellations  

---

## 📦 Admin Features
- Add / Update / Delete products  
- Manage product stock  

---

## 🛍️ Customer Features
- Add / Remove product to/from cart  
- Place order  
- Order total calculated on backend  
- Stock deducted after successful order  

---

## 📑 Business Rules
- Customers cannot order more than available stock  
- Prevent negative inventory  
- Ensure data consistency across operations  

---

## 🎁 Bonus Features
- Order status: Pending / Shipped / Delivered  
- Payment simulation  
- Transaction handling  

---

## 💻 Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/mini-ecommerce-api.git
   cd mini-ecommerce-api

   Install dependencies:

npm install


Create .env file:

DATABASE_URL=postgresql://username:password@localhost:5432/mini_ecommerce
JWT_SECRET=your_jwt_secret
PORT=5000


Run Prisma migration:

npx prisma migrate dev --name init


Start the server:

npm run dev


Server will run on: http://localhost:5000

🌐 Deployment

Deployed on Render

API accessible via: https://mini-ecommerce-api.onrender.com/api/...
