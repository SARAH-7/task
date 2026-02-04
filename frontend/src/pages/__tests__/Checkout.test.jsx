import React, { useEffect } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../../context/CartContext';
import Checkout from '../Checkout';
import * as api from '../../api/client';

vi.mock('../../api/client', () => ({
  placeOrder: vi.fn(),
}));

function CheckoutWithCart() {
  const { addToCart, cart } = useCart();
  useEffect(() => {
    if (cart.length === 0) addToCart({ id: '1', name: 'Pizza', price: 10 });
  }, [addToCart, cart.length]);
  if (cart.length === 0) return <div>Loading cart…</div>;
  return <Checkout />;
}

function renderCheckout() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CheckoutWithCart />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('Checkout', () => {
  beforeEach(() => {
    api.placeOrder.mockResolvedValue({ id: 'ord_123', status: 'Order Received' });
  });

  it('renders delivery form with name, address, phone and place order button', async () => {
    renderCheckout();
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Place order/i })).toBeInTheDocument();
  });

  it('shows validation when submitting empty form', async () => {
    const user = userEvent.setup();
    renderCheckout();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Place order/i })).toBeInTheDocument();
    });
    const submit = screen.getByRole('button', { name: /Place order/i });
    await user.click(submit);
    expect(api.placeOrder).not.toHaveBeenCalled();
  });

  it('calls placeOrder on success when form is valid', async () => {
    const user = userEvent.setup();
    renderCheckout();
    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    });
    await user.type(screen.getByLabelText(/Name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/Address/i), '123 Main St');
    await user.type(screen.getByLabelText(/Phone/i), '555-123-4567');
    await user.click(screen.getByRole('button', { name: /Place order/i }));
    await waitFor(() => {
      expect(api.placeOrder).toHaveBeenCalledWith(
        { name: 'Jane Doe', address: '123 Main St', phone: '555-123-4567' },
        expect.any(Array)
      );
    });
  });
});
