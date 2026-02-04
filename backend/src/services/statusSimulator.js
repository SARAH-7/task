/**
 * Simulates order status progression over time for demo purposes.
 * Order Received → Preparing → Out for Delivery → Delivered
 */

import { updateOrderStatus, getOrderById, ORDER_STATUSES } from '../data/store.js';

const INTERVALS_MS = {
  'Order Received': 8000,   // 8s then → Preparing
  'Preparing': 10000,       // 10s then → Out for Delivery
  'Out for Delivery': 12000, // 12s then → Delivered
};

/** @type {Map<string, NodeJS.Timeout>} */
const timers = new Map();

function startSimulation(orderId) {
  if (timers.has(orderId)) return;
  const order = getOrderById(orderId);
  if (!order) return;

  function scheduleNext() {
    const order = getOrderById(orderId);
    if (!order) return;
    const idx = ORDER_STATUSES.indexOf(order.status);
    if (idx < 0 || idx >= ORDER_STATUSES.length - 1) return;
    const nextStatus = ORDER_STATUSES[idx + 1];
    const delay = INTERVALS_MS[order.status] ?? 5000;
    const t = setTimeout(() => {
      updateOrderStatus(orderId, nextStatus);
      timers.delete(orderId);
      if (nextStatus !== 'Delivered') startSimulation(orderId);
    }, delay);
    timers.set(orderId, t);
  }

  if (order.status !== 'Delivered') {
    scheduleNext();
  }
}

function stopSimulation(orderId) {
  const t = timers.get(orderId);
  if (t) {
    clearTimeout(t);
    timers.delete(orderId);
  }
}

export { startSimulation, stopSimulation };
