const Cart = require('../models/Cart');
const Product = require('../models/Product');


exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'productId is required' });
        }

        const qty = quantity || 1;

       
        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.stock < qty) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        let cartItem = await Cart.findOne({
            where: { userId, productId }
        });

        if (cartItem) {
            
            const newQty = cartItem.quantity + qty;

            if (newQty > product.stock) {
                return res.status(400).json({ message: 'Quantity exceeds stock limit' });
            }

            await cartItem.update({ quantity: newQty });

            return res.json({
                message: 'Cart updated',
                cartItem
            });
        }

      
        cartItem = await Cart.create({
            userId,
            productId,
            quantity: qty
        });

        res.status(201).json({
            message: 'Added to cart',
            cartItem
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getMyCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price', 'stock']
                }
            ]
        });

        res.json(cart);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be >= 1' });
        }

        const cartItem = await Cart.findByPk(cartId, {
            include: [Product]
        });

        if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

        
        if (cartItem.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

      
        if (quantity > cartItem.Product.stock) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        await cartItem.update({ quantity });

        res.json({
            message: 'Quantity updated',
            cartItem
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartId } = req.params;

        const cartItem = await Cart.findByPk(cartId);

        if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

        if (cartItem.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        await cartItem.destroy();

        res.json({ message: 'Item removed from cart' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
