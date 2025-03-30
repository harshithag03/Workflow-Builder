const StepModel = require('../models/stepModel');
const RoleModel = require('../models/roleModel');
const ConnectionModel = require('../models/connectionModel');

// Step Controller
const StepController = {
  // Add a new step to a workflow
  addStep: async (req, res) => {
    try {
      const { id } = req.params; // workflow_id
      const { name, description, step_type } = req.body;
      
      // Validate required fields
      if (!name || !step_type) {
        return res.status(400).json({ message: 'Name and step type are required' });
      }
      
      // Check if step_type is valid
      const validStepTypes = ['TASK', 'APPROVAL', 'NOTIFICATION'];
      if (!validStepTypes.includes(step_type)) {
        return res.status(400).json({ 
          message: 'Invalid step type. Must be one of: TASK, APPROVAL, NOTIFICATION' 
        });
      }
      
      const newStep = await StepModel.createStep({
        workflow_id: id,
        name,
        description,
        step_type
      });
      
      res.status(201).json(newStep);
    } catch (error) {
      console.error('Error adding step:', error);
      res.status(500).json({ message: 'Failed to add step', error: error.message });
    }
  },

  // Update an existing step
  // Update an existing step
updateStep: async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, step_type, order_index, roles } = req.body;
    
    // Log the received data to check if roles are included
    console.log('Update step request body:', req.body);
    
    // Update the step
    const updatedStep = await StepModel.updateStep(id, {
      name,
      description,
      step_type,
      order_index
    });
    
    // If roles are provided, update them
    if (roles && Array.isArray(roles)) {
      // Delete existing roles
      await RoleModel.deleteRolesByStepId(id);
      
      // Add new roles
      for (const role of roles) {
        await RoleModel.createRole({
          step_id: id,
          role_name: role.role_name
        });
      }
    }
    
    res.status(200).json(updatedStep);
  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ message: 'Failed to update step', error: error.message });
  }
},

  // Delete a step
  deleteStep: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if step exists
      const existingStep = await StepModel.getStepById(id);
      if (!existingStep) {
        return res.status(404).json({ message: 'Step not found' });
      }
      
      // Delete any connections involving this step
      await ConnectionModel.deleteConnectionsByStepId(id);
      
      // Delete any roles assigned to this step
      await RoleModel.deleteRolesByStepId(id);
      
      // Delete the step
      await StepModel.deleteStep(id);
      
      res.status(200).json({ message: 'Step deleted successfully' });
    } catch (error) {
      console.error('Error deleting step:', error);
      res.status(500).json({ message: 'Failed to delete step', error: error.message });
    }
  },

  // Get a step with its roles
  getStepWithRoles: async (req, res) => {
    try {
      const { id } = req.params;
      
      const step = await StepModel.getStepWithRoles(id);
      if (!step) {
        return res.status(404).json({ message: 'Step not found' });
      }
      
      // Get the connections from this step
      const connections = await ConnectionModel.getConnectionsByFromStepId(id);
      
      res.status(200).json({
        ...step,
        connections
      });
    } catch (error) {
      console.error('Error getting step:', error);
      res.status(500).json({ message: 'Failed to retrieve step', error: error.message });
    }
  },

  // Add a role to a step
  addRole: async (req, res) => {
    try {
      const { id } = req.params; // step_id
      const { role_name } = req.body;
      
      // Validate required fields
      if (!role_name) {
        return res.status(400).json({ message: 'Role name is required' });
      }
      
      // Check if step exists
      const existingStep = await StepModel.getStepById(id);
      if (!existingStep) {
        return res.status(404).json({ message: 'Step not found' });
      }
      
      const newRole = await RoleModel.createRole({
        step_id: id,
        role_name
      });
      
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error adding role:', error);
      res.status(500).json({ message: 'Failed to add role', error: error.message });
    }
  }
};

module.exports = StepController;