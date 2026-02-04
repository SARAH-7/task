import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, setQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="page-title">Cart</h1>
        <p className="cart-empty">Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Cart ({cartCount} items)</h1>
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.menuItemId} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">${item.price.toFixed(2)} each</span>
            </div>
            <div className="cart-item-actions">
              <label className="quantity-wrap">
                <span className="quantity-label">Qty</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.menuItemId, parseInt(e.target.value, 10) || 1)}
                  className="quantity-input"
                />
              </label>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => removeFromCart(item.menuItemId)}
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </div>
            <span className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <span className="cart-total-label">Total</span>
        <span className="cart-total-value">${cartTotal.toFixed(2)}</span>
      </div>
      <Link to="/checkout" className="btn btn-primary btn-block">
        Proceed to checkout
      </Link>
    </div>
  );
}
