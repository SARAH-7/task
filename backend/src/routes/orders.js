import { Router } from 'express';
import {
  createOrder as createOrderInStore,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  subscribeToOrderStatus,
  getMenuItemById,
} from '../data/store.js';
import { startSimulation } from '../services/statusSimulator.js';
import {
  placeOrderValidation,
  orderIdParamValidation,
  updateStatusValidation,
  handleValidationErrors,
} from '../middleware/validateOrder.js';

const router = Router();

// Build order items with name and price from menu
function buildOrderItems(items) {
  return items.map((it) => {
    const menuItem = getMenuItemById(it.menuItemId);
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: it.quantity,
    };
  });
}

// POST /api/orders - Place order
router.post(
  '/',
  placeOrderValidation,
  handleValidationErrors,
  (req, res) => {
    const { deliveryDetails, items } = req.body;
    const orderItems = buildOrderItems(items);
    const order = createOrderInStore({ deliveryDetails, items: orderItems });
    startSimulation(order.id);
    res.status(201).json(order);
  }
);

// GET /api/orders - List all orders (for admin/testing)
router.get('/', (req, res) => {
  const orders = getAllOrders();
  res.json(orders);
});

// GET /api/orders/:id - Get order by ID
router.get(
  '/:id',
  orderIdParamValidation,
  handleValidationErrors,
  (req, res) => {
    const order = getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  }
);

// PATCH /api/orders/:id/status - Update order status (for admin/testing)
router.patch(
  '/:id/status',
  updateStatusValidation,
  handleValidationErrors,
  (req, res) => {
    const order = updateOrderStatus(req.params.id, req.body.status);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  }
);

// GET /api/orders/:id/stream - Server-Sent Events for real-time status
router.get(
  '/:id/stream',
  orderIdParamValidation,
  handleValidationErrors,
  (req, res) => {
    const order = getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    res.write(`data: ${JSON.stringify(order)}\n\n`);
    const unsubscribe = subscribeToOrderStatus(req.params.id, (updated) => {
      res.write(`data: ${JSON.stringify(updated)}\n\n`);
      if (updated.status === 'Delivered') {
        res.end();
      }
    });
    req.on('close', () => unsubscribe());
  }
);

export default router;
