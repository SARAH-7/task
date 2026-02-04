import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../CartContext';

function TestConsumer() {
  const { cart, addToCart, setQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal.toFixed(2)}</span>
      <button onClick={() => addToCart({ id: '1', name: 'Pizza', price: 10 })}>Add Pizza</button>
      <button onClick={() => addToCart({ id: '2', name: 'Burger', price: 8 }, 2)}>Add Burger x2</button>
      <button onClick={() => setQuantity('1', 3)}>Set Pizza Qty 3</button>
      <button onClick={() => removeFromCart('1')}>Remove Pizza</button>
      <button onClick={clearCart}>Clear</button>
      <ul>
        {cart.map((i) => (
          <li key={i.menuItemId}>{i.name} x{i.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

describe('CartContext', () => {
  it('starts with empty cart', () => {
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
  });

  it('adds item to cart and updates count and total', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('Add Pizza'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent('10.00');
    expect(screen.getByText('Pizza x1')).toBeInTheDocument();
  });

  it('adds item with quantity and merges same item', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('Add Pizza'));
    await user.click(screen.getByText('Add Pizza'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('total')).toHaveTextContent('20.00');
  });

  it('setQuantity updates quantity and removes when 0', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('Add Pizza'));
    await user.click(screen.getByText('Set Pizza Qty 3'));
    expect(screen.getByTestId('count')).toHaveTextContent('3');
    expect(screen.getByTestId('total')).toHaveTextContent('30.00');
  });

  it('removeFromCart removes item', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('Add Pizza'));
    await user.click(screen.getByText('Remove Pizza'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.queryByText('Pizza x1')).not.toBeInTheDocument();
  });

  it('clearCart empties cart', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );
    await user.click(screen.getByText('Add Pizza'));
    await user.click(screen.getByText('Add Burger x2'));
    await user.click(screen.getByText('Clear'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
  });
});
