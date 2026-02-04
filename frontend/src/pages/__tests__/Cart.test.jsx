import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../../context/CartContext';
import Cart from '../Cart';

function CartWithAddButton() {
  const { addToCart } = useCart();
  return (
    <>
      <button type="button" onClick={() => addToCart({ id: '1', name: 'Pizza', price: 10 })}>
        Add Pizza
      </button>
      <Cart />
    </>
  );
}

describe('Cart', () => {
  it('shows empty state when cart is empty', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Cart />
        </CartProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse menu/i })).toBeInTheDocument();
  });

  it('shows cart items, quantity, total and checkout link when cart has items', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CartProvider>
          <CartWithAddButton />
        </CartProvider>
      </MemoryRouter>
    );
    await user.click(screen.getByText('Add Pizza'));
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('$10.00 each')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Proceed to checkout/i })).toBeInTheDocument();
  });
});
