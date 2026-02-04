import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import Menu from '../Menu';
import * as api from '../../api/client';

const mockMenu = [
  { id: '1', name: 'Margherita Pizza', description: 'Classic tomato', price: 12.99, image: 'https://example.com/1.jpg' },
  { id: '2', name: 'Classic Burger', description: 'Beef patty', price: 9.99, image: 'https://example.com/2.jpg' },
];

vi.mock('../../api/client', () => ({
  getMenu: vi.fn(),
}));

function renderMenu() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Menu />
      </CartProvider>
    </MemoryRouter>
  );
}

describe('Menu', () => {
  beforeEach(() => {
    api.getMenu.mockResolvedValue(mockMenu);
  });

  it('shows loading then menu items with name, description, price', async () => {
    renderMenu();
    expect(screen.getByText('Loading menu…')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    });
    expect(screen.getByText('Classic tomato')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('shows error when getMenu fails', async () => {
    api.getMenu.mockRejectedValue(new Error('Network error'));
    renderMenu();
    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });

  it('add to cart button is present for each item', async () => {
    renderMenu();
    await waitFor(() => {
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    });
    const addButtons = screen.getAllByRole('button', { name: /Add to cart/i });
    expect(addButtons).toHaveLength(2);
  });
});
