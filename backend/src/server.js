import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menu.js';
import ordersRoutes from './routes/orders.js';
import { getOrderStatuses } from './data/store.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/api/order-statuses', (req, res) => {
  res.json(getOrderStatuses());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Order Management API running at http://localhost:${PORT}`);
  });
}

export default app;
