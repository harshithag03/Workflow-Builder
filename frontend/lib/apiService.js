import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with error logging
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response logging for debugging
api.interceptors.request.use(request => {
  console.log('API Request:', request.method.toUpperCase(), request.url, request.data || '');
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);

const apiService = {
  // Workflows
  getWorkflows: async () => {
    try {
      const response = await api.get('/workflows');
      return response.data;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  },

  getWorkflowById: async (id) => {
    try {
      const response = await api.get(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow ${id}:`, error);
      throw error;
    }
  },

  createWorkflow: async (workflowData) => {
    try {
      const response = await api.post('/workflows', workflowData);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  },

  updateWorkflow: async (id, workflowData) => {
    try {
      const response = await api.put(`/workflows/${id}`, workflowData);
      return response.data;
    } catch (error) {
      console.error(`Error updating workflow ${id}:`, error);
      throw error;
    }
  },

  deleteWorkflow: async (id) => {
    try {
      const response = await api.delete(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting workflow ${id}:`, error);
      throw error;
    }
  },

  // Steps
  addStep: async (workflowId, stepData) => {
    try {
      const response = await api.post(`/workflows/${workflowId}/steps`, stepData);
      return response.data;
    } catch (error) {
      console.error(`Error adding step to workflow ${workflowId}:`, error);
      throw error;
    }
  },

  getStepById: async (id) => {
    try {
      const response = await api.get(`/steps/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching step ${id}:`, error);
      throw error;
    }
  },

  updateStep: async (id, stepData) => {
    try {
      const response = await api.put(`/steps/${id}`, stepData);
      return response.data;
    } catch (error) {
      console.error(`Error updating step ${id}:`, error);
      throw error;
    }
  },

  deleteStep: async (id) => {
    try {
      console.log(`Sending request to delete step ${id}`);
      const response = await api.delete(`/steps/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting step ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Connections
  createConnection: async (connectionData) => {
    try {
      console.log('Creating connection with data:', connectionData);
      const response = await api.post('/connections', connectionData);
      return response.data;
    } catch (error) {
      console.error('Error creating connection:', error.response?.data || error.message);
      throw error;
    }
  },

  updateConnection: async (id, connectionData) => {
    try {
      console.log(`Updating connection ${id} with data:`, connectionData);
      const response = await api.put(`/connections/${id}`, connectionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating connection ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  deleteConnection: async (id) => {
    try {
      console.log(`Sending request to delete connection ${id}`);
      const response = await api.delete(`/connections/${id}`);
      console.log(`Connection ${id} delete response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting connection ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Roles
  addRole: async (stepId, roleData) => {
    try {
      const response = await api.post(`/steps/${stepId}/roles`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error adding role to step ${stepId}:`, error);
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  }
};

export default apiService;