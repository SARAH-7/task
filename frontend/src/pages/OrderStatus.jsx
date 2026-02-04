import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, subscribeOrderStatus } from '../api/client';
import './OrderStatus.css';

const STATUS_STEPS = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    getOrder(orderId)
      .then((data) => {
        setOrder(data);
        unsubscribe = subscribeOrderStatus(orderId, setOrder);
      })
      .catch((e) => setError(e.message));
    return () => unsubscribe?.();
  }, [orderId]);

  if (error) {
    return (
      <div className="order-status-page">
        <p className="page-error">{error}</p>
        <Link to="/" className="btn btn-primary">Back to menu</Link>
      </div>
    );
  }

  if (!order) return <div className="page-loading">Loading order…</div>;

  const currentIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="order-status-page">
      <h1 className="page-title">Order status</h1>
      <p className="order-id">Order #{order.id.replace('ord_', '')}</p>
      <div className="status-tracker" role="status" aria-live="polite">
        {STATUS_STEPS.map((step, i) => (
          <div
            key={step}
            className={`status-step ${i <= currentIndex ? 'active' : ''} ${i < currentIndex ? 'done' : ''}`}
          >
            <span className="status-dot" />
            <span className="status-label">{step}</span>
          </div>
        ))}
      </div>
      <div className="order-details-box">
        <h2>Delivery</h2>
        <p><strong>{order.deliveryDetails.name}</strong></p>
        <p>{order.deliveryDetails.address}</p>
        <p>{order.deliveryDetails.phone}</p>
      </div>
      <div className="order-details-box">
        <h2>Items</h2>
        <ul className="order-items-list">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/" className="btn btn-primary">Order again</Link>
    </div>
  );
}
