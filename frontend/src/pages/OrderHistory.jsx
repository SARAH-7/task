import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../api/client';
import './OrderHistory.css';

const STATUS_COLORS = {
  'Order Received': 'var(--accent)',
  'Preparing': 'var(--accent)',
  'Out for Delivery': 'var(--accent)',
  'Delivered': 'var(--success)',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then((data) => {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading orders…</div>;
  if (error) return <div className="page-error">Error: {error}</div>;

  return (
    <div className="order-history-page">
      <h1 className="page-title">Order History</h1>
      {orders.length === 0 ? (
        <div className="history-empty">
          <p>No orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse menu
          </Link>
        </div>
      ) : (
        <ul className="history-list">
          {orders.map((order) => (
            <li key={order.id} className="history-item">
              <div className="history-item-header">
                <div>
                  <Link to={`/order/${order.id}`} className="history-order-id">
                    Order #{order.id.replace('ord_', '')}
                  </Link>
                  <span className="history-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <span
                  className="history-status"
                  style={{ color: STATUS_COLORS[order.status] || 'var(--text)' }}
                >
                  {order.status}
                </span>
              </div>
              <div className="history-item-details">
                <div className="history-delivery">
                  <strong>{order.deliveryDetails.name}</strong>
                  <span>{order.deliveryDetails.address}</span>
                </div>
                <div className="history-items">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} • $
                  {order.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
