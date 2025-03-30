const express = require('express');
const RoleController = require('../controllers/roleController');

const router = express.Router();

// Role routes
router.delete('/:id', RoleController.deleteRole);

module.exports = router;