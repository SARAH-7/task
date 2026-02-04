import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/client';
import './Checkout.css';

const initialDetails = { name: '', address: '', phone: '' };

const NAME_REGEX = /^[\p{L}\s\-'.]*$/u;
const ADDRESS_REGEX = /^[\p{L}\p{N}\s,\-.#'/]*$/u;
const PHONE_REGEX = /^[+]?[\d\s\-()]*$/;

function validateName(value) {
  const v = (value || '').trim();
  if (!v) return 'Name is required';
  if (v.length < 2) return 'Name must be at least 2 characters';
  if (v.length > 200) return 'Name must be at most 200 characters';
  if (!NAME_REGEX.test(v)) return 'Name can only contain letters, spaces, hyphens and apostrophes';
  return null;
}

function validateAddress(value) {
  const v = (value || '').trim();
  if (!v) return 'Address is required';
  if (v.length < 5) return 'Address must be at least 5 characters';
  if (v.length > 500) return 'Address must be at most 500 characters';
  if (!ADDRESS_REGEX.test(v)) return 'Address can only contain letters, numbers and common punctuation';
  return null;
}

function validatePhone(value) {
  const v = (value || '').trim();
  if (!v) return 'Phone number is required';
  const digitsOnly = v.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 20) return 'Phone must be 10–20 digits';
  if (!PHONE_REGEX.test(v)) return 'Phone can only contain digits, spaces, dashes, parentheses and +';
  return null;
}

export default function Checkout() {
  const { cart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [details, setDetails] = useState(initialDetails);
  const [touched, setTouched] = useState({});
  const [invalidInputAttempt, setInvalidInputAttempt] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const errors = {
    name: validateName(details.name),
    address: validateAddress(details.address),
    phone: validatePhone(details.phone),
  };
  const isValid = !errors.name && !errors.address && !errors.phone;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && !NAME_REGEX.test(value)) {
      setInvalidInputAttempt((prev) => ({ ...prev, name: true }));
      setTimeout(() => setInvalidInputAttempt((prev) => ({ ...prev, name: false })), 2000);
      return;
    }
    if (name === 'address' && value !== '' && !ADDRESS_REGEX.test(value)) {
      setInvalidInputAttempt((prev) => ({ ...prev, address: true }));
      setTimeout(() => setInvalidInputAttempt((prev) => ({ ...prev, address: false })), 2000);
      return;
    }
    if (name === 'phone' && value !== '' && !PHONE_REGEX.test(value)) {
      setInvalidInputAttempt((prev) => ({ ...prev, phone: true }));
      setTimeout(() => setInvalidInputAttempt((prev) => ({ ...prev, phone: false })), 2000);
      return;
    }
    setDetails((prev) => ({ ...prev, [name]: value }));
    setInvalidInputAttempt((prev) => ({ ...prev, [name]: false }));
    setError(null);
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, address: true, phone: true });
    setError(null);
    if (!isValid) return;
    setLoading(true);
    const items = cart.map(({ menuItemId, quantity }) => ({ menuItemId, quantity }));
    try {
      const order = await placeOrder(details, items);
      clearCart();
      navigate(`/order/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    navigate('/cart', { replace: true });
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        <fieldset className="form-fieldset">
          <legend>Delivery details</legend>
          <label className="form-label">
            Name
            <input
              type="text"
              name="name"
              value={details.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="e.g. Jane Doe"
              className={`form-input ${touched.name && errors.name ? 'form-input-error' : ''}`}
              autoComplete="name"
            />
            {invalidInputAttempt.name && (
              <span className="form-field-warning">Numbers and special characters are not allowed in name</span>
            )}
            {touched.name && errors.name && !invalidInputAttempt.name && (
              <span className="form-field-error">{errors.name}</span>
            )}
          </label>
          <label className="form-label">
            Address
            <input
              type="text"
              name="address"
              value={details.address}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Street, city, postal code"
              className={`form-input ${touched.address && errors.address ? 'form-input-error' : ''}`}
              autoComplete="street-address"
            />
            {invalidInputAttempt.address && (
              <span className="form-field-warning">Only letters, numbers, spaces and , - . # ' / are allowed in address</span>
            )}
            {touched.address && errors.address && !invalidInputAttempt.address && (
              <span className="form-field-error">{errors.address}</span>
            )}
          </label>
          <label className="form-label">
            Phone number
            <input
              type="tel"
              name="phone"
              value={details.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="e.g. 05X XXX XXXX"
              className={`form-input ${touched.phone && errors.phone ? 'form-input-error' : ''}`}
              autoComplete="tel"
            />
            {invalidInputAttempt.phone && (
              <span className="form-field-warning">Only digits, spaces, dashes, parentheses and + are allowed in phone number</span>
            )}
            {touched.phone && errors.phone && !invalidInputAttempt.phone && (
              <span className="form-field-error">{errors.phone}</span>
            )}
          </label>
        </fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="checkout-total">Order total: ${cartTotal.toFixed(2)}</p>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading || !isValid}>
          {loading ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
