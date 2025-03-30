import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaPlus, FaFileExport, FaMoon, FaSun, FaTrash, FaEdit, FaPlusCircle, FaArrowLeft } from 'react-icons/fa';
import apiService from '../../lib/apiService';
import StepModal from '../Steps/StepModal';
import ConnectionModal from '../Steps/ConnectionModal';

const WorkflowDesigner = ({ workflowId }) => {
  const router = useRouter();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionSource, setConnectionSource] = useState(null);
  const [connectionTarget, setConnectionTarget] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch workflow data
  const fetchWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching workflow with ID: ${workflowId}`);
      const data = await apiService.getWorkflowById(workflowId);
      console.log("Fetched workflow data:", data);
      setWorkflow(data);
    } catch (error) {
      toast.error('Failed to fetch workflow');
      console.error('Error fetching workflow:', error);
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  

  // Handle adding a new step
  const handleAddStep = () => {
    console.log("Add Step clicked");
    setSelectedElement(null);
    setShowStepModal(true);
  };

  // Handle creating a new connection
  const handleAddConnection = () => {
    if (!workflow || !workflow.steps || workflow.steps.length < 2) {
      toast.warning('You need at least two steps to create a connection');
      return;
    }
    setConnectionSource(null);
    setConnectionTarget(null);
    setShowConnectionModal(true);
  };

  // Handle saving a step (new or existing)
  const handleStepSave = async (stepData) => {
    try {
      if (selectedElement && selectedElement.id) {
        // Update existing step
        console.log(`Updating step ${selectedElement.id} with:`, stepData);
        await apiService.updateStep(selectedElement.id, stepData);
        toast.success('Step updated successfully');
      } else {
        // Create new step
        console.log(`Adding new step to workflow ${workflowId} with:`, stepData);
        await apiService.addStep(workflowId, stepData);
        toast.success('Step added successfully');
      }
      setShowStepModal(false);
      fetchWorkflow(); // Refresh data after update
    } catch (error) {
      toast.error(selectedElement ? 'Failed to update step' : 'Failed to add step');
      console.error('Error saving step:', error);
    }
  };

  // Handle deleting a step
  const handleStepDelete = async (stepId) => {
    setItemToDelete({ type: 'step', id: stepId });
    setShowConfirmDelete(true);
  };

  // Handle deleting a connection
  const handleConnectionDelete = async (connectionId) => {
    setItemToDelete({ type: 'connection', id: connectionId });
    setShowConfirmDelete(true);
  };

  // Perform actual deletion
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'step') {
        console.log(`Deleting step with ID: ${itemToDelete.id}`);
        await apiService.deleteStep(itemToDelete.id);
        toast.success('Step deleted successfully');
      } else if (itemToDelete.type === 'connection') {
        console.log(`Deleting connection with ID: ${itemToDelete.id}`);
        await apiService.deleteConnection(itemToDelete.id);
        toast.success('Connection deleted successfully');
      }
      setShowConfirmDelete(false);
      setItemToDelete(null);
      fetchWorkflow();
    } catch (error) {
      toast.error(`Failed to delete ${itemToDelete.type}`);
      console.error(`Error deleting ${itemToDelete.type}:`, error);
    }
  };

  // Handle saving a connection
  const handleConnectionSave = async (connectionData) => {
    try {
      if (connectionData.id) {
        // Update existing connection
        console.log(`Updating connection ${connectionData.id} with:`, connectionData);
        await apiService.updateConnection(connectionData.id, {
          condition_type: connectionData.condition_type
        });
        toast.success('Connection updated successfully');
      } else {
        // Create new connection
        const newConnection = {
          from_step_id: connectionData.from_step_id,
          to_step_id: connectionData.to_step_id,
          condition_type: connectionData.condition_type || 'ALWAYS'
        };
        console.log('Creating new connection:', newConnection);
        await apiService.createConnection(newConnection);
        toast.success('Connection created successfully');
      }
      setShowConnectionModal(false);
      fetchWorkflow();
    } catch (error) {
      toast.error('Failed to save connection');
      console.error('Error saving connection:', error);
    }
  };

  // Export workflow as JSON
  const handleExportWorkflow = () => {
    if (!workflow) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `workflow-${workflow.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success('Workflow exported successfully');
  };

  // Select a step or connection for editing
  const handleSelectElement = (element) => {
    console.log("Selected element:", element);
    setSelectedElement(element);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-blue-800 font-medium">Loading workflow designer...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="p-6">
        <div className="text-center py-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Workflow Not Found</h2>
          <p className="text-gray-600 mb-4">The requested workflow could not be found or loaded.</p>
          <Link href="/" className="text-blue-600 hover:underline">Return to workflow list</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen `}>
      {/* Header */}
      <div className={`p-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 border-b `}>
        <div>
          <div className="flex items-center mb-1">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mr-2 flex items-center">
              <FaArrowLeft className="mr-1" /> Back
            </Link>
            <h1 className="text-2xl font-bold">{workflow.name}</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{workflow.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportWorkflow}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center space-x-2 shadow"
            title="Export Workflow as JSON"
          >
            <FaFileExport /> <span>Export</span>
          </button>
          <button
            onClick={handleAddStep}
            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-md flex items-center space-x-2 shadow"
          >
            <FaPlus /> <span>Add Step</span>
          </button>
          <button
            onClick={handleAddConnection}
            className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center space-x-2 shadow"
          >
            <FaPlusCircle /> <span>Add Connection</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Workflow Steps */}
        <div className={`mb-6 p-6  shadow-lg rounded-lg border `}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className={` h-8 w-8 rounded-full flex items-center justify-center mr-2`}>
              <span>{workflow.steps?.length || 0}</span>
            </span>
            Workflow Steps
          </h2>
          
          {workflow.steps && workflow.steps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflow.steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    selectedElement?.id === step.id 
                      ? 'border-blue-500 ring-2 ring-blue-300' 
                      : getStepTypeBorderColor(step.step_type)
                  }  shadow hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => handleSelectElement(step)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{step.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStepTypeBadgeColor(step.step_type)}`}>
                          {getStepTypeLabel(step.step_type)}
                        </span>
                        {step.priority && (
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(step.priority)}`}>
                            {step.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      Step {index + 1}
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm">{step.description}</p>
                  
                  {step.roles && step.roles.length > 0 && (
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Assigned to:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {step.roles.map(role => (
                          <span key={role.id} className={`inline-block px-2 py-0.5 text-xs rounded-full `}>
                            {role.role_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Connection indicators */}
                  {workflow.connections && workflow.connections.filter(conn => conn.from_step_id === step.id).length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Connects to:</span>
                      {workflow.connections.filter(conn => conn.from_step_id === step.id).map(conn => (
                        <div key={conn.id} className="mt-1 flex items-center">
                          <span className="text-xs">→</span>
                          <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${getConditionBadgeColor(conn.condition_type)}`}>
                            {getConditionTypeLabel(conn.condition_type)}
                          </span>
                          <span className="ml-1 text-xs font-medium">
                            {getStepNameById(workflow.steps, conn.to_step_id)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement(step);
                        setShowStepModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Edit Step"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStepDelete(step.id);
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 ml-2"
                      title="Delete Step"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8  rounded-lg border border-dashed `}>
              <p className="text-gray-500 dark:text-gray-400">
                No steps added yet. Click 'Add Step' to create your first step.
              </p>
              <button
                onClick={handleAddStep}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
              >
                <FaPlus className="mr-2" /> Add First Step
              </button>
            </div>
          )}
        </div>

        {/* Connections Section */}
        {workflow.connections && workflow.connections.length > 0 && (
          <div className={`p-6  shadow-lg rounded-lg border `}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className={` h-8 w-8 rounded-full flex items-center justify-center mr-2`}>
                <span>{workflow.connections.length}</span>
              </span>
              Workflow Connections
            </h2>
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse `}>
                <thead>
                  <tr className={``}>
                    <th className="px-4 py-2 text-left rounded-tl-lg">From Step</th>
                    <th className="px-4 py-2 text-left">Condition</th>
                    <th className="px-4 py-2 text-left">To Step</th>
                    <th className="px-4 py-2 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.connections.map(connection => (
                    <tr 
                      key={connection.id} 
                      className={`border-b  cursor-pointer`}
                      onClick={() => handleSelectElement(connection)}
                    >
                      <td className="px-4 py-3">{getStepNameById(workflow.steps, connection.from_step_id)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getConditionBadgeColor(connection.condition_type)}`}>
                          {getConditionTypeLabel(connection.condition_type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getStepNameById(workflow.steps, connection.to_step_id)}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElement(connection);
                            setShowConnectionModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="Edit Connection"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnectionDelete(connection.id);
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 ml-2"
                          title="Delete Connection"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className={` rounded-lg p-6 max-w-md mx-auto`}>
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className={`px-4 py-2 border rounded-md text-sm font-medium `}
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

      {/* Step Modal */}
      {showStepModal && (
        <StepModal
          step={selectedElement}
          onClose={() => setShowStepModal(false)}
          onSave={handleStepSave}
        />
      )}

      {/* Connection Modal */}
      {showConnectionModal && (
        <ConnectionModal
          connection={selectedElement}
          steps={workflow.steps}
          onClose={() => setShowConnectionModal(false)}
          onSave={handleConnectionSave}
        />
      )}
    </div>
  );
};

// Helper functions for display
const getStepTypeLabel = (stepType) => {
  switch (stepType) {
    case 'APPROVAL': return 'Approval';
    case 'TASK': return 'Task';
    case 'NOTIFICATION': return 'Notification';
    default: return stepType;
  }
};

const getStepTypeBadgeColor = (stepType) => {

    switch (stepType) {
      case 'APPROVAL': return 'bg-blue-100 text-blue-800';
      case 'TASK': return 'bg-green-100 text-green-800';
      case 'NOTIFICATION': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const getStepTypeBorderColor = (stepType) => {
  switch (stepType) {
    case 'APPROVAL': return 'border-blue-500';
    case 'TASK': return 'border-green-500';
    case 'NOTIFICATION': return 'border-yellow-500';
    default: return 'border-gray-300';
  }
};

const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const getConditionTypeLabel = (conditionType) => {
  switch (conditionType) {
    case 'ALWAYS': return 'Always';
    case 'IF_APPROVED': return 'If Approved';
    case 'IF_REJECTED': return 'If Rejected';
    default: return conditionType;
  }
};

const getConditionBadgeColor = (conditionType) => {
    switch (conditionType) {
      case 'ALWAYS': return 'bg-gray-100 text-gray-800';
      case 'IF_APPROVED': return 'bg-green-100 text-green-800';
      case 'IF_REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const getStepNameById = (steps, stepId) => {
  const step = steps.find(s => s.id === stepId);
  return step ? step.name : 'Unknown Step';
};

export default WorkflowDesigner;