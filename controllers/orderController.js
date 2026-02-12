const sequelize = require('../config/db');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');


exports.placeOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const userId = req.user.id;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: [Product],
            transaction: t,
            lock: t.LOCK.UPDATE
        });

        if (cartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let total = 0;

       
        for (let item of cartItems) {
            if (item.quantity > item.Product.stock) {
                await t.rollback();
                return res.status(400).json({
                    message: `Not enough stock for ${item.Product.name}`
                });
            }
            total += item.quantity * item.Product.price;
        }

       
        const order = await Order.create({
            userId,
            total,
            status: 'Pending'
        }, { transaction: t });

      
        for (let item of cartItems) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.Product.price
            }, { transaction: t });

            await item.Product.update({
                stock: item.Product.stock - item.quantity
            }, { transaction: t });
        }

        
        await Cart.destroy({
            where: { userId },
            transaction: t
        });

        await t.commit();

        res.status(201).json({
            message: 'Order placed successfully',
            orderId: order.id,
            total
        });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err.message });
    }
};


exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    include: [
                        { model: Product, attributes: ['id', 'name', 'price'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: OrderItem, include: [Product] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowed = ['Pending', 'Shipped', 'Delivered'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        await order.update({ status });

        res.json({
            message: 'Order status updated',
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
