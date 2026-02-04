const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const menuRoutes = require('../backend/src/routes/menu');
const orderRoutes = require('../backend/src/routes/orders');

app.use('/api', menuRoutes);
app.use('/api', orderRoutes);

module.exports = app;