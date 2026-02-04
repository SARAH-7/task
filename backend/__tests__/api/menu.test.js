import request from 'supertest';
import app from '../../src/server.js';

describe('Menu API', () => {
  describe('GET /api/menu', () => {
    it('returns list of menu items with id, name, description, price, image', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      const item = res.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('image');
    });
  });
});
