import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSort, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import apiService from '../../lib/apiService';
import WorkflowModal from './WorkflowModal';

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch workflows on component mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWorkflows();
      console.log('Fetched workflows:', data);
      setWorkflows(data);
    } catch (error) {
      toast.error('Failed to fetch workflows');
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (workflow) => {
    setWorkflowToDelete(workflow);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!workflowToDelete) return;
    
    try {
      await apiService.deleteWorkflow(workflowToDelete.id);
      toast.success('Workflow deleted successfully');
      setShowConfirmDelete(false);
      setWorkflowToDelete(null);
      fetchWorkflows();
    } catch (error) {
      toast.error('Failed to delete workflow');
      console.error('Error deleting workflow:', error);
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

  // Filter and sort workflows
  const filteredWorkflows = workflows
    .filter(workflow => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        workflow.name.toLowerCase().includes(searchLower) ||
        (workflow.description && workflow.description.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'created_at') {
        comparison = new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'updated_at') {
        comparison = new Date(a.updated_at) - new Date(b.updated_at);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-blue-800 font-medium">Loading workflows...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="space-y-6">
          {/* Header area with search and add button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-gray-800">Workflow Builder</h1>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 shadow"
              >
                <FaPlus /> <span>New Workflow</span>
              </button>
            </div>
          </div>

          {filteredWorkflows.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              {searchTerm ? (
                <div>
                  <p className="text-gray-500 mb-4">No workflows match your search criteria.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">No workflows found. Create your first workflow to get started.</p>
                  <button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center mx-auto space-x-2"
                  >
                    <FaPlus /> <span>Create First Workflow</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        {sortBy === 'name' && (
                          sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-600" /> : <FaSortAmountDown className="text-blue-600" />
                        )}
                        {sortBy !== 'name' && <FaSort className="text-gray-400" />}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange('updated_at')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Last Updated</span>
                        {sortBy === 'updated_at' && (
                          sortDirection === 'asc' ? <FaSortAmountUp className="text-blue-600" /> : <FaSortAmountDown className="text-blue-600" />
                        )}
                        {sortBy !== 'updated_at' && <FaSort className="text-gray-400" />}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWorkflows.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/workflows/${workflow.id}`} 
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
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
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            workflow.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {workflow.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(workflow.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEdit(workflow)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Workflow"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(workflow)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Workflow"
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
        </div>
      </div>

      {/* Workflow Create/Edit Modal */}
      {showModal && (
        <WorkflowModal
          workflow={currentWorkflow}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the workflow "{workflowToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setWorkflowToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowList;