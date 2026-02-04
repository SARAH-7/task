import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Toast.css';

export function Toast({ message, onClose, showCheckout, cartCount }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">✓</span>
        <span className="toast-message">{message}</span>
      </div>
      {showCheckout && cartCount > 0 && (
        <Link to="/cart" className="toast-action" onClick={onClose}>
          Go to checkout ({cartCount})
        </Link>
      )}
    </div>
  );
}
