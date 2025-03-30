const WorkflowModel = require('../models/workflowModel');
const StepModel = require('../models/stepModel');
const ConnectionModel = require('../models/connectionModel');
const RoleModel = require('../models/roleModel');



// Workflow Controller
const WorkflowController = {
  // Get all workflows
  getAllWorkflows: async (req, res) => {
    try {
      const workflows = await WorkflowModel.getAllWorkflows();
      res.status(200).json(workflows);
    } catch (error) {
      console.error('Error getting workflows:', error);
      res.status(500).json({ message: 'Failed to retrieve workflows', error: error.message });
    }
  },

  // Get a specific workflow by ID (including its steps)
  // In your workflowController.js
getWorkflowById: async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await WorkflowModel.getWorkflowWithSteps(id);
    
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    
    // Get connections for this workflow
    const connections = await ConnectionModel.getConnectionsByWorkflowId(id);
    
    // For each step, get its roles
    for (let i = 0; i < workflow.steps.length; i++) {
      const roles = await RoleModel.getRolesByStepId(workflow.steps[i].id);
      workflow.steps[i].roles = roles;
    }
    
    const responseData = {
      ...workflow,
      connections
    };
    
    console.log('Returning workflow data:', JSON.stringify(responseData, null, 2));
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error getting workflow:', error);
    res.status(500).json({ message: 'Failed to retrieve workflow', error: error.message });
  }
},

  // Create a new workflow
  createWorkflow: async (req, res) => {
    try {
      const { name, description } = req.body;
      
      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: 'Workflow name is required' });
      }
      
      const newWorkflow = await WorkflowModel.createWorkflow({
        name,
        description,
        is_active: true
      });
      
      res.status(201).json(newWorkflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
      res.status(500).json({ message: 'Failed to create workflow', error: error.message });
    }
  },

  // Update an existing workflow
  updateWorkflow: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, is_active } = req.body;
      
      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: 'Workflow name is required' });
      }
      
      // Check if workflow exists
      const existingWorkflow = await WorkflowModel.getWorkflowById(id);
      if (!existingWorkflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      
      const updatedWorkflow = await WorkflowModel.updateWorkflow(id, {
        name,
        description,
        is_active: is_active !== undefined ? is_active : existingWorkflow.is_active
      });
      
      res.status(200).json(updatedWorkflow);
    } catch (error) {
      console.error('Error updating workflow:', error);
      res.status(500).json({ message: 'Failed to update workflow', error: error.message });
    }
  },

  // Delete a workflow
  deleteWorkflow: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if workflow exists
      const existingWorkflow = await WorkflowModel.getWorkflowById(id);
      if (!existingWorkflow) {
        return res.status(404).json({ message: 'Workflow not found' });
      }
      
      await WorkflowModel.deleteWorkflow(id);
      
      res.status(200).json({ message: 'Workflow deleted successfully' });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      res.status(500).json({ message: 'Failed to delete workflow', error: error.message });
    }
  }
};

module.exports = WorkflowController;