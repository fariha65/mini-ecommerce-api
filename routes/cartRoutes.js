const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate, authorize } = require('../middlewares/auth');


router.post('/', authenticate, authorize('customer'), cartController.addToCart);
router.get('/', authenticate, authorize('customer'), cartController.getMyCart);
router.put('/:cartId', authenticate, authorize('customer'), cartController.updateQuantity);
router.delete('/:cartId', authenticate, authorize('customer'), cartController.removeFromCart);

module.exports = router;
