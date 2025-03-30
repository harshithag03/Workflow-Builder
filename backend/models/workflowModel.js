const db = require('../db/connection');

// Workflow Model
const WorkflowModel = {
  // Get all workflows
  getAllWorkflows: async () => {
    return await db.query(
      'SELECT * FROM workflows ORDER BY created_at DESC'
    );
  },

  // Get a specific workflow by ID
  getWorkflowById: async (id) => {
    const workflows = await db.query(
      'SELECT * FROM workflows WHERE id = ?',
      [id]
    );
    return workflows[0];
  },

  // Get a workflow with all its steps
  getWorkflowWithSteps: async (id) => {
    const workflow = await WorkflowModel.getWorkflowById(id);
    
    if (!workflow) return null;
    
    const steps = await db.query(
      'SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY order_index',
      [id]
    );
    
    return {
      ...workflow,
      steps
    };
  },

  // Create a new workflow
  createWorkflow: async (workflowData) => {
    const result = await db.query(
      'INSERT INTO workflows (name, description, is_active) VALUES (?, ?, ?)',
      [workflowData.name, workflowData.description, workflowData.is_active ?? true]
    );
    
    return {
      id: result.insertId,
      ...workflowData
    };
  },

  // Update an existing workflow
  updateWorkflow: async (id, workflowData) => {
    await db.query(
      'UPDATE workflows SET name = ?, description = ?, is_active = ? WHERE id = ?',
      [workflowData.name, workflowData.description, workflowData.is_active, id]
    );
    
    return {
      id,
      ...workflowData
    };
  },

  // Delete a workflow
  deleteWorkflow: async (id) => {
    return await db.query('DELETE FROM workflows WHERE id = ?', [id]);
  }
};

module.exports = WorkflowModel;