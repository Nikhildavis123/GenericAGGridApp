const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const CarModel = require('./models/Car');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/datagridDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const results = [];

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Convert numeric fields to numbers, handling invalid values
    data.AccelSec = parseFloat(data.AccelSec) || 0; // Default to 0 if invalid
    data.TopSpeed_KmH = parseFloat(data.TopSpeed_KmH) || 0; // Default to 0 if invalid
    data.Range_Km = parseFloat(data.Range_Km) || 0; // Default to 0 if invalid
    data.Efficiency_WhKm = parseFloat(data.Efficiency_WhKm) || 0; // Default to 0 if invalid
    data.FastCharge_KmH = parseFloat(data.FastCharge_KmH) || 0; // Default to 0 if invalid
    data.Seats = parseInt(data.Seats, 10) || 0; // Default to 0 if invalid
    data.PriceEuro = parseFloat(data.PriceEuro) || 0; // Default to 0 if invalid

    results.push(data);
  })
  .on('end', async () => {
    try {
      await CarModel.insertMany(results);
      console.log('Data imported successfully!');
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      mongoose.connection.close();
    }
  });