import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { CartProvider } from './context/CartContext';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="logo">
            Bite
          </Link>
          <nav>
            <Link to="/">Menu</Link>
            <Link to="/history">History</Link>
            <Link to="/cart">Cart</Link>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderId" element={<OrderStatus />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
