const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors()); 

mongoose.connect('mongodb://127.0.0.1:27017/todoapp')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.use('/api/todos', todoRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
