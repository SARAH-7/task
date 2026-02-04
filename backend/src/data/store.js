/**
 * In-memory store for menu items and orders.
 * Resets on server restart.
 */

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, fresh basil',
    price: 12.99,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni, tomato sauce, mozzarella',
    price: 14.99,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Classic Burger',
    description: 'Beef patty, lettuce, tomato, cheese, special sauce',
    price: 9.99,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Double Cheese Burger',
    description: 'Two beef patties, double cheddar, pickles, onions',
    price: 12.99,
    category: 'burger',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Caesar Salad',
    description: 'Romaine, parmesan, croutons, caesar dressing',
    price: 8.99,
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '6',
    name: 'Fish & Chips',
    description: 'Beer-battered cod, crispy fries, tartar sauce',
    price: 13.99,
    category: 'other',
    image: 'https://plus.unsplash.com/premium_photo-1694108747175-889fdc786003?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const ORDER_STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

/** @type {Map<string, import('./types').Order>} */
const orders = new Map();

/** @type {Map<string, (data: object) => void>} */
const statusListeners = new Map();

function getMenu() {
  return [...MENU_ITEMS];
}

function getMenuItemById(id) {
  return MENU_ITEMS.find((item) => item.id === id) ?? null;
}

function createOrder(order) {
  const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const newOrder = {
    id,
    status: 'Order Received',
    deliveryDetails: order.deliveryDetails,
    items: order.items,
    createdAt: new Date().toISOString(),
  };
  orders.set(id, newOrder);
  return newOrder;
}

function getOrderById(id) {
  return orders.get(id) ?? null;
}

function getAllOrders() {
  return Array.from(orders.values());
}

function updateOrderStatus(id, status) {
  const order = orders.get(id);
  if (!order) return null;
  if (!ORDER_STATUSES.includes(status)) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  const listener = statusListeners.get(id);
  if (listener) listener(order);
  return order;
}

function subscribeToOrderStatus(orderId, onUpdate) {
  statusListeners.set(orderId, onUpdate);
  return () => statusListeners.delete(orderId);
}

function getOrderStatuses() {
  return [...ORDER_STATUSES];
}

export {
  getMenu,
  getMenuItemById,
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  subscribeToOrderStatus,
  getOrderStatuses,
  ORDER_STATUSES,
};
