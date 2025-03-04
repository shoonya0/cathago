// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const scanRoutes = require('./routes/scanRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(bodyParser.json());

// // Register routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/', documentRoutes);
app.use('/scan', scanRoutes);
app.use('/admin', adminRoutes);

module.exports = app;