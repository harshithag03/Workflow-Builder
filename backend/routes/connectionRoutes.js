const express = require('express');
const ConnectionController = require('../controllers/connectionController');

const router = express.Router();

// Connection routes
router.post('/', ConnectionController.createConnection);
router.put('/:id', ConnectionController.updateConnection);
router.delete('/:id', ConnectionController.deleteConnection);

module.exports = router;