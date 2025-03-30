const db = require('../db/connection');

// Step Model
const StepModel = {
  // Get all steps for a workflow
  getStepsByWorkflowId: async (workflowId) => {
    return await db.query(
      'SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY order_index',
      [workflowId]
    );
  },

  // Get a specific step by ID
  getStepById: async (id) => {
    const steps = await db.query(
      'SELECT * FROM workflow_steps WHERE id = ?',
      [id]
    );
    return steps[0];
  },

  // Get a step with its roles
  getStepWithRoles: async (id) => {
    const step = await StepModel.getStepById(id);
    
    if (!step) return null;
    
    const roles = await db.query(
      'SELECT * FROM step_roles WHERE step_id = ?',
      [id]
    );
    
    return {
      ...step,
      roles
    };
  },

  // Create a new step
  createStep: async (stepData) => {
    // Find the highest order index for this workflow
    const maxOrderIndex = await db.query(
      'SELECT MAX(order_index) as max_index FROM workflow_steps WHERE workflow_id = ?',
      [stepData.workflow_id]
    );
    
    const nextOrderIndex = maxOrderIndex[0].max_index ? maxOrderIndex[0].max_index + 1 : 1;
    
    const result = await db.query(
      'INSERT INTO workflow_steps (workflow_id, name, description, step_type, order_index) VALUES (?, ?, ?, ?, ?)',
      [stepData.workflow_id, stepData.name, stepData.description, stepData.step_type, nextOrderIndex]
    );
    
    return {
      id: result.insertId,
      ...stepData,
      order_index: nextOrderIndex
    };
  },

  // Update an existing step
  updateStep: async (id, stepData) => {
    await db.query(
      'UPDATE workflow_steps SET name = ?, description = ?, step_type = ? WHERE id = ?',
      [stepData.name, stepData.description, stepData.step_type, id]
    );
    
    // Only update order_index if provided
    if (stepData.order_index !== undefined) {
      await db.query(
        'UPDATE workflow_steps SET order_index = ? WHERE id = ?',
        [stepData.order_index, id]
      );
    }
    
    return {
      id,
      ...stepData
    };
  },

  // Delete a step
  deleteStep: async (id) => {
    // First get the step to know its workflow_id and order_index
    const step = await StepModel.getStepById(id);
    
    if (!step) {
      throw new Error('Step not found');
    }
    
    // Delete the step
    await db.query('DELETE FROM workflow_steps WHERE id = ?', [id]);
    
    // Reorder the remaining steps
    await db.query(
      'UPDATE workflow_steps SET order_index = order_index - 1 WHERE workflow_id = ? AND order_index > ?',
      [step.workflow_id, step.order_index]
    );
    
    return step;
  }
};

module.exports = StepModel;