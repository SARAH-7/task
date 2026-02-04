const API_BASE = 'https://food-delivery-api-ulan.onrender.com/api';

export async function getMenu() {
  const res = await fetch(`${API_BASE}/menu`);
  if (!res.ok) throw new Error('Failed to load menu');
  return res.json();
}

export async function placeOrder(deliveryDetails, items) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deliveryDetails, items }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.errors?.[0]?.msg || data.error || 'Failed to place order';
    throw new Error(msg);
  }
  return data;
}

export async function getOrder(orderId) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

export async function getAllOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
}

export function subscribeOrderStatus(orderId, onUpdate) {
  const eventSource = new EventSource(`${API_BASE}/orders/${orderId}/stream`);
  eventSource.onmessage = (e) => {
    try {
      const order = JSON.parse(e.data);
      onUpdate(order);
      if (order.status === 'Delivered') eventSource.close();
    } catch (_) {}
  };
  eventSource.onerror = () => eventSource.close();
  return () => eventSource.close();
}
