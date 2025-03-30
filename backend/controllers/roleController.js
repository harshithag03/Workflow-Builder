const RoleModel = require('../models/roleModel');
const StepModel = require('../models/stepModel');

// Role Controller
const RoleController = {
  // Get all roles for a step
  getRolesByStepId: async (req, res) => {
    try {
      const { id } = req.params; // step_id
      
      // Check if step exists
      const existingStep = await StepModel.getStepById(id);
      if (!existingStep) {
        return res.status(404).json({ message: 'Step not found' });
      }
      
      const roles = await RoleModel.getRolesByStepId(id);
      
      res.status(200).json(roles);
    } catch (error) {
      console.error('Error getting roles:', error);
      res.status(500).json({ message: 'Failed to retrieve roles', error: error.message });
    }
  },

  // Delete a role assignment
  deleteRole: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if role exists
      const existingRole = await RoleModel.getRoleById(id);
      if (!existingRole) {
        return res.status(404).json({ message: 'Role not found' });
      }
      
      await RoleModel.deleteRole(id);
      
      res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ message: 'Failed to delete role', error: error.message });
    }
  }
};

module.exports = RoleController;