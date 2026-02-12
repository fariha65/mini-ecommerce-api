const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock: stock || 0
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({
            name: name ?? product.name,
            description: description ?? product.description,
            price: price ?? product.price,
            stock: stock ?? product.stock
        });

        res.json({
            message: 'Product updated successfully',
            product
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();

        res.json({ message: 'Product deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
