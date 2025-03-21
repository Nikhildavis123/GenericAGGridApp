const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CarModel = require('./models/Car');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/datagridDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API to fetch all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await CarModel.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// API to search cars by keyword across multiple fields
app.get('/api/cars/search', async (req, res) => {
  const query = req.query.q;
  try {
    const cars = await CarModel.find({
      $or: [
        { Brand: { $regex: query, $options: 'i' } }, // Case-insensitive search
        { Model: { $regex: query, $options: 'i' } },
        { BodyStyle: { $regex: query, $options: 'i' } },
        { Segment: { $regex: query, $options: 'i' } },
        { PlugType: { $regex: query, $options: 'i' } },
        { PowerTrain: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(cars);
  } catch (error) {
    console.error('Error searching cars:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to search data' });
  }
});

// API to filter cars by criteria
app.get('/api/cars/filter', async (req, res) => {
  const { column, criteria, value } = req.query;
  let filter = {};

  if (criteria === 'contains') {
    filter[column] = { $regex: value, $options: 'i' };
  } else if (criteria === 'equals') {
    filter[column] = value;
  } // Add more criteria as needed

  try {
    const cars = await CarModel.find(filter);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter data' });
  }
});

// API to delete a car by ID
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const car = await CarModel.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});

// API to fetch a single car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await CarModel.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car details' });
  }
});