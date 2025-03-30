const express = require('express');
const WorkflowController = require('../controllers/workflowController');
const StepController = require('../controllers/stepController');

const router = express.Router();

// Workflow routes
router.get('/', WorkflowController.getAllWorkflows);
router.get('/:id', WorkflowController.getWorkflowById);
router.post('/', WorkflowController.createWorkflow);
router.put('/:id', WorkflowController.updateWorkflow);
router.delete('/:id', WorkflowController.deleteWorkflow);

// Step routes that depend on workflow
router.post('/:id/steps', StepController.addStep);

module.exports = router;