const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotelweb', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Wait for connection
mongoose.connection.once('open', async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Create room instances
    const roomInstances = [
      {
        roomNumber: 'A1',
        roomClass: '6981b3d046c976bdd8da55b9',
        floor: 1,
        status: 'available'
      },
      {
        roomNumber: 'A2', 
        roomClass: '6981b3d046c976bdd8da55b9',
        floor: 1,
        status: 'available'
      },
      {
        roomNumber: 'A3',
        roomClass: '6981b3d046c976bdd8da55b9', 
        floor: 1,
        status: 'available'
      },
      {
        roomNumber: 'A4',
        roomClass: '6981b3d046c976bdd8da55b9',
        floor: 1, 
