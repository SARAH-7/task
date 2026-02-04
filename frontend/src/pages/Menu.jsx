import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getMenu, getAllOrders, subscribeOrderStatus } from '../api/client';
import { Toast } from '../components/Toast';
import './Menu.css';

const CATEGORIES = ['all', 'pizza', 'burger', 'salad', 'other'];

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [recentOrder, setRecentOrder] = useState(null);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    getMenu()
      .then((data) => {
        setMenu(data);
        setFilteredMenu(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    getAllOrders()
      .then((orders) => {
        const sorted = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sorted.length > 0) {
          const latest = sorted[0];
          if (latest.status !== 'Delivered') {
            setRecentOrder(latest);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Subscribe to real-time status updates for the current order banner
  useEffect(() => {
    if (!recentOrder?.id) return;
    const unsubscribe = subscribeOrderStatus(recentOrder.id, (updated) => {
      setRecentOrder(updated);
      if (updated.status === 'Delivered') {
        setRecentOrder(null);
      }
    });
    return unsubscribe;
  }, [recentOrder?.id]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMenu(menu);
    } else {
      setFilteredMenu(menu.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, menu]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage(`${item.name} added to cart!`);
    setShowToast(true);
  };

  if (loading) return <div className="page-loading">Loading menu…</div>;
  if (error) return <div className="page-error">Error: {error}</div>;

  return (
    <div className="menu-page">
      <h1 className="page-title">Menu</h1>

      {recentOrder && (
        <div className="recent-order-banner">
          <div className="recent-order-content">
            <span className="recent-order-label">Current Order:</span>
            <Link to={`/order/${recentOrder.id}`} className="recent-order-link">
              Order #{recentOrder.id.replace('ord_', '')} — {recentOrder.status}
            </Link>
          </div>
        </div>
      )}

      <div className="menu-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <ul className="menu-grid">
        {filteredMenu.map((item) => (
          <li key={item.id} className="menu-card">
            <div className="menu-card-image-wrap">
              <img src={item.image} alt={item.name} className="menu-card-image" />
            </div>
            <div className="menu-card-body">
              <h2 className="menu-card-name">{item.name}</h2>
              <p className="menu-card-desc">{item.description}</p>
              <div className="menu-card-footer">
                <span className="menu-card-price">${item.price.toFixed(2)}</span>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {filteredMenu.length === 0 && (
        <p className="menu-empty">No items found in this category.</p>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          showCheckout={true}
          cartCount={cartCount}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
