const express = require('express');
const StepController = require('../controllers/stepController');

const router = express.Router();

// Step routes
router.get('/:id', StepController.getStepWithRoles);
router.put('/:id', StepController.updateStep);
router.delete('/:id', StepController.deleteStep);

// Role routes that depend on step
router.post('/:id/roles', StepController.addRole);

module.exports = router;