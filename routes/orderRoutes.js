const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/auth');


router.post('/', authenticate, authorize('customer'), orderController.placeOrder);
router.get('/my', authenticate, authorize('customer'), orderController.getMyOrders);


router.get('/', authenticate, authorize('admin'), orderController.getAllOrders);
router.put('/:orderId/status', authenticate, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
