const express = require('express');
const { connectDB } = require('./db');
const eventRoutes = require('./routes/events');
const nudgeRoutes = require('./routes/nudges'); // <-- add this

const app = express();
app.use(express.json());
app.use('/api/v3/app', eventRoutes);
app.use('/api/v3/app', nudgeRoutes); // <-- add this

connectDB();