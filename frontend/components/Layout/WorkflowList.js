import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import apiService from '../../lib/apiService';
import WorkflowModal from './WorkflowModal';

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);

  // Fetch workflows on component mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWorkflows();
      setWorkflows(data);
    } catch (error) {
      toast.error('Failed to fetch workflows');
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await apiService.deleteWorkflow(id);
        toast.success('Workflow deleted successfully');
        fetchWorkflows();
      } catch (error) {
        toast.error('Failed to delete workflow');
        console.error('Error deleting workflow:', error);
      }
    }
  };

  const handleEdit = (workflow) => {
    setCurrentWorkflow(workflow);
    setShowModal(true);
  };

  const handleCreate = () => {
    setCurrentWorkflow(null);
    setShowModal(true);
  };

  const handleSave = async (workflowData) => {
    try {
      if (currentWorkflow) {
        // Update existing workflow
        await apiService.updateWorkflow(currentWorkflow.id, workflowData);
        toast.success('Workflow updated successfully');
      } else {
        // Create new workflow
        await apiService.createWorkflow(workflowData);
        toast.success('Workflow created successfully');
      }
      setShowModal(false);
      fetchWorkflows();
    } catch (error) {
      toast.error(currentWorkflow ? 'Failed to update workflow' : 'Failed to create workflow');
      console.error('Error saving workflow:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading workflows...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <button
          onClick={handleCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded flex items-center space-x-2"
        >
          <FaPlus /> <span>New Workflow</span>
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p>No workflows found. Create your first workflow to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workflows.map((workflow) => (
                <tr key={workflow.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/workflows/${workflow.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                      {workflow.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {workflow.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        workflow.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(workflow)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <WorkflowModal
          workflow={currentWorkflow}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default WorkflowList;