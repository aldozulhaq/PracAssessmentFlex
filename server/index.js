const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser for JSON

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));