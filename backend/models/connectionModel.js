const db = require('../db/connection');

// Connection Model
const ConnectionModel = {
  // Get all connections
  getAllConnections: async () => {
    return await db.query(
      'SELECT * FROM step_connections'
    );
  },

  // Get connections for a workflow
  getConnectionsByWorkflowId: async (workflowId) => {
    return await db.query(
      `SELECT sc.* 
       FROM step_connections sc
       JOIN workflow_steps ws1 ON sc.from_step_id = ws1.id
       WHERE ws1.workflow_id = ?`,
      [workflowId]
    );
  },

  // Get a specific connection by ID
  getConnectionById: async (id) => {
    console.log(`Getting connection by ID: ${id}`);
    try {
      const connections = await db.query(
        'SELECT * FROM step_connections WHERE id = ?',
        [id]
      );
      console.log('Connection retrieved:', connections[0]);
      return connections[0];
    } catch (err) {
      console.error(`Error retrieving connection ${id}:`, err);
      throw err;
    }
  },

  // Get connections from a specific step
  getConnectionsByFromStepId: async (stepId) => {
    return await db.query(
      'SELECT * FROM step_connections WHERE from_step_id = ?',
      [stepId]
    );
  },

  // Create a new connection
  createConnection: async (connectionData) => {
    try {
      console.log('Creating connection with data:', connectionData);
      const result = await db.query(
        'INSERT INTO step_connections (from_step_id, to_step_id, condition_type) VALUES (?, ?, ?)',
        [connectionData.from_step_id, connectionData.to_step_id, connectionData.condition_type || 'ALWAYS']
      );
      
      console.log('Connection creation result:', result);
      
      return {
        id: result.insertId,
        ...connectionData
      };
    } catch (err) {
      console.error('Error creating connection:', err);
      throw err;
    }
  },

  // Update an existing connection
  updateConnection: async (id, connectionData) => {
    try {
      console.log(`Updating connection ${id} with data:`, connectionData);
      const result = await db.query(
        'UPDATE step_connections SET condition_type = ? WHERE id = ?',
        [connectionData.condition_type, id]
      );
      
      console.log('Connection update result:', result);
      
      return {
        id,
        ...connectionData
      };
    } catch (err) {
      console.error(`Error updating connection ${id}:`, err);
      throw err;
    }
  },

  // Delete a connection
  deleteConnection: async (id) => {
    try {
      console.log(`Deleting connection with ID: ${id}`);
      const result = await db.query('DELETE FROM step_connections WHERE id = ?', [id]);
      console.log('Connection deletion result:', result);
      
      if (result.affectedRows === 0) {
        console.warn(`No rows affected when deleting connection ${id}`);
      }
      
      return { success: true, affectedRows: result.affectedRows };
    } catch (err) {
      console.error(`Error deleting connection ${id}:`, err);
      throw err;
    }
  },

  // Delete all connections for a step
  deleteConnectionsByStepId: async (stepId) => {
    try {
      console.log(`Deleting all connections for step ID: ${stepId}`);
      const result = await db.query(
        'DELETE FROM step_connections WHERE from_step_id = ? OR to_step_id = ?', 
        [stepId, stepId]
      );
      console.log('Connection deletion result:', result);
      return { deleted: true, affectedRows: result.affectedRows };
    } catch (err) {
      console.error(`Error deleting connections for step ${stepId}:`, err);
      throw err;
    }
  }
};

module.exports = ConnectionModel;