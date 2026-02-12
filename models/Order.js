const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered'), defaultValue: 'Pending' },
}, { timestamps: true });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
