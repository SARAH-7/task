import request from 'supertest';
import app from '../../src/server.js';

const validOrder = {
  deliveryDetails: {
    name: 'Jane Doe',
    address: '123 Main St, City',
    phone: '555-123-4567',
  },
  items: [
    { menuItemId: '1', quantity: 2 },
    { menuItemId: '2', quantity: 1 },
  ],
};

describe('Orders API', () => {
  describe('POST /api/orders', () => {
    it('creates order and returns 201 with order id and status', async () => {
      const res = await request(app).post('/api/orders').send(validOrder);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('Order Received');
      expect(res.body.deliveryDetails).toMatchObject(validOrder.deliveryDetails);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(2);
    });

    it('rejects missing delivery details', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ items: validOrder.items });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('rejects empty name', async () => {
      const payload = {
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, name: '' },
      };
      const res = await request(app).post('/api/orders').send(payload);
      expect(res.status).toBe(400);
    });

    it('rejects name with numbers', async () => {
      const payload = {
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, name: 'Jane123' },
      };
      const res = await request(app).post('/api/orders').send(payload);
      expect(res.status).toBe(400);
    });

    it('rejects invalid phone', async () => {
      const payload = {
        ...validOrder,
        deliveryDetails: { ...validOrder.deliveryDetails, phone: 'abc' },
      };
      const res = await request(app).post('/api/orders').send(payload);
      expect(res.status).toBe(400);
    });

    it('rejects empty items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ deliveryDetails: validOrder.deliveryDetails, items: [] });
      expect(res.status).toBe(400);
    });

    it('rejects invalid menu item id', async () => {
      const payload = {
        ...validOrder,
        items: [{ menuItemId: 'invalid-id', quantity: 1 }],
      };
      const res = await request(app).post('/api/orders').send(payload);
      expect(res.status).toBe(400);
    });

    it('rejects quantity out of range', async () => {
      const payload = {
        ...validOrder,
        items: [{ menuItemId: '1', quantity: 0 }],
      };
      const res = await request(app).post('/api/orders').send(payload);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    it('returns array of orders', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('returns 404 for unknown order id', async () => {
      const res = await request(app).get('/api/orders/unknown-id');
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it('returns order when id exists', async () => {
      const create = await request(app).post('/api/orders').send(validOrder);
      const id = create.body.id;
      const res = await request(app).get(`/api/orders/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.status).toBeDefined();
      expect(res.body.items).toBeDefined();
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('returns 404 for unknown order id', async () => {
      const res = await request(app)
        .patch('/api/orders/unknown-id/status')
        .send({ status: 'Preparing' });
      expect(res.status).toBe(404);
    });

    it('rejects invalid status', async () => {
      const create = await request(app).post('/api/orders').send(validOrder);
      const res = await request(app)
        .patch(`/api/orders/${create.body.id}/status`)
        .send({ status: 'Invalid' });
      expect(res.status).toBe(400);
    });

    it('updates order status and returns order', async () => {
      const create = await request(app).post('/api/orders').send(validOrder);
      const id = create.body.id;
      const res = await request(app)
        .patch(`/api/orders/${id}/status`)
        .send({ status: 'Preparing' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Preparing');
      const get = await request(app).get(`/api/orders/${id}`);
      expect(get.body.status).toBe('Preparing');
    });
  });
});
