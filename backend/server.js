const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const workflowRoutes = require('./routes/workflowRoutes');
const stepRoutes = require('./routes/stepRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/steps', stepRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/roles', roleRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'An error occurred on the server', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;