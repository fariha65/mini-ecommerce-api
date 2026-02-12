const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();




const app = express();


app.use(cors());
app.use(bodyParser.json());


const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Mini E-Commerce API is running",
    version: "1.0.0",
    docs: "/api"
  });
});


sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
