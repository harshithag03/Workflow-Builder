const db = require('../db/connection');

// Role Model
const RoleModel = {
  // Get all roles for a step
  getRolesByStepId: async (stepId) => {
    return await db.query(
      'SELECT * FROM step_roles WHERE step_id = ?',
      [stepId]
    );
  },

  // Get a specific role by ID
  getRoleById: async (id) => {
    const roles = await db.query(
      'SELECT * FROM step_roles WHERE id = ?',
      [id]
    );
    return roles[0];
  },

  // Create a new role assignment
  createRole: async (roleData) => {
    const result = await db.query(
      'INSERT INTO step_roles (step_id, role_name) VALUES (?, ?)',
      [roleData.step_id, roleData.role_name]
    );
    
    return {
      id: result.insertId,
      ...roleData
    };
  },

  // Delete a role assignment
  deleteRole: async (id) => {
    return await db.query('DELETE FROM step_roles WHERE id = ?', [id]);
  },

  // Delete all roles for a step
deleteRolesByStepId: async (stepId) => {
  try {
    console.log(`Deleting all roles for step ${stepId}`);
    const result = await db.query('DELETE FROM step_roles WHERE step_id = ?', [stepId]);
    console.log('Delete roles result:', result);
    return { deleted: true, count: result.affectedRows };
  } catch (err) {
    console.error(`Error deleting roles for step ${stepId}:`, err);
    throw err;
  }
}
};

module.exports = RoleModel;