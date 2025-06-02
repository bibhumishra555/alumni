const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ✅ NEW

dotenv.config();
const app = express();

// ✅ CORS: Frontend origin and credentials allowed
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

// ✅ Cookie parser middleware
app.use(cookieParser());

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => console.log('Server running at http://localhost:5000'));
  })
  .catch(err => console.log(err));
