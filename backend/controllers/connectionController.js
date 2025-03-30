const ConnectionModel = require('../models/connectionModel');
const StepModel = require('../models/stepModel');

// Connection Controller
const ConnectionController = {
  // Create a new connection between steps
  createConnection: async (req, res) => {
    try {
      const { from_step_id, to_step_id, condition_type } = req.body;
      
      // Validate required fields
      if (!from_step_id || !to_step_id) {
        return res.status(400).json({ message: 'From step ID and to step ID are required' });
      }
      
      // Check if the steps exist
      const fromStep = await StepModel.getStepById(from_step_id);
      const toStep = await StepModel.getStepById(to_step_id);
      
      if (!fromStep || !toStep) {
        return res.status(404).json({ message: 'One or both steps not found' });
      }
      
      // Check if steps are in the same workflow
      if (fromStep.workflow_id !== toStep.workflow_id) {
        return res.status(400).json({ message: 'Steps must belong to the same workflow' });
      }
      
      // Check if condition_type is valid
      const validConditionTypes = ['ALWAYS', 'IF_APPROVED', 'IF_REJECTED'];
      if (condition_type && !validConditionTypes.includes(condition_type)) {
        return res.status(400).json({
          message: 'Invalid condition type. Must be one of: ALWAYS, IF_APPROVED, IF_REJECTED'
        });
      }
      
      console.log('Creating connection:', { from_step_id, to_step_id, condition_type: condition_type || 'ALWAYS' });
      
      const newConnection = await ConnectionModel.createConnection({
        from_step_id,
        to_step_id,
        condition_type: condition_type || 'ALWAYS'
      });
      
      console.log('Connection created:', newConnection);
      
      res.status(201).json(newConnection);
    } catch (error) {
      console.error('Error creating connection:', error);
      res.status(500).json({ message: 'Failed to create connection', error: error.message });
    }
  },

  // Update an existing connection
  updateConnection: async (req, res) => {
    try {
      const { id } = req.params;
      const { condition_type } = req.body;
      
      console.log(`Updating connection ${id} with condition_type ${condition_type}`);
      
      // Check if connection exists
      const existingConnection = await ConnectionModel.getConnectionById(id);
      if (!existingConnection) {
        return res.status(404).json({ message: 'Connection not found' });
      }
      
      // Check if condition_type is valid
      const validConditionTypes = ['ALWAYS', 'IF_APPROVED', 'IF_REJECTED'];
      if (!validConditionTypes.includes(condition_type)) {
        return res.status(400).json({
          message: 'Invalid condition type. Must be one of: ALWAYS, IF_APPROVED, IF_REJECTED'
        });
      }
      
      const updatedConnection = await ConnectionModel.updateConnection(id, {
        condition_type
      });
      
      console.log('Connection updated:', updatedConnection);
      
      res.status(200).json({
        ...existingConnection,
        condition_type
      });
    } catch (error) {
      console.error('Error updating connection:', error);
      res.status(500).json({ message: 'Failed to update connection', error: error.message });
    }
  },

  // Delete a connection
  deleteConnection: async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log(`Attempting to delete connection with ID: ${id}`);
      
      // Check if connection exists
      const existingConnection = await ConnectionModel.getConnectionById(id);
      console.log('Found connection for deletion:', existingConnection);
      
      if (!existingConnection) {
        console.log(`Connection with ID ${id} not found for deletion`);
        return res.status(404).json({ message: 'Connection not found' });
      }
      
      const result = await ConnectionModel.deleteConnection(id);
      console.log('Connection deletion result:', result);
      
      res.status(200).json({ message: 'Connection deleted successfully' });
    } catch (error) {
      console.error('Error deleting connection:', error);
      res.status(500).json({ message: 'Failed to delete connection', error: error.message });
    }
  }
};

module.exports = ConnectionController;