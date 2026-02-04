import { Router } from 'express';
import { getMenu } from '../data/store.js';

const router = Router();

router.get('/', (req, res) => {
  const menu = getMenu();
  res.json(menu);
});

export default router;