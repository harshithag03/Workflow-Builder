import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ConnectionModal = ({ connection, steps, onClose, onSave, darkMode = false }) => {
  const [formData, setFormData] = useState({
    id: null,
    from_step_id: '',
    to_step_id: '',
    condition_type: 'ALWAYS'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (connection) {
      setFormData({
        id: connection.id || null,
        from_step_id: connection.from_step_id || '',
        to_step_id: connection.to_step_id || '',
        condition_type: connection.condition_type || 'ALWAYS'
      });
    } else {
      // Reset form when creating a new connection
      setFormData({
        id: null,
        from_step_id: steps && steps.length > 0 ? steps[0].id : '',
        to_step_id: steps && steps.length > 1 ? steps[1].id : '',
        condition_type: 'ALWAYS'
      });
    }
  }, [connection, steps]);

  const validate = () => {
    const newErrors = {};
    if (!formData.from_step_id) {
      newErrors.from_step_id = 'Source step is required';
    }
    if (!formData.to_step_id) {
      newErrors.to_step_id = 'Target step is required';
    }
    if (formData.from_step_id === formData.to_step_id) {
      newErrors.to_step_id = 'Source and target steps must be different';
    }
    if (!formData.condition_type) {
      newErrors.condition_type = 'Condition type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  const getStepNameById = (stepId) => {
    if (!steps) return 'Unknown';
    const step = steps.find(s => s.id === Number(stepId));
    return step ? step.name : 'Unknown';
  };

  const getStepOptions = () => {
    if (!steps || steps.length === 0) {
      return <option value="">No steps available</option>;
    }
    
    return steps.map(step => (
      <option key={step.id} value={step.id}>
        {step.name} ({getStepTypeLabel(step.step_type)})
      </option>
    ));
  };

  const getStepTypeLabel = (stepType) => {
    switch (stepType) {
      case 'APPROVAL': return 'Approval';
      case 'TASK': return 'Task';
      case 'NOTIFICATION': return 'Notification';
      default: return stepType;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`relative w-full max-w-md mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-xl`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {connection && connection.id ? 'Edit Connection' : 'Add New Connection'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* From Step */}
            <div>
              <label htmlFor="from_step_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Step*
              </label>
              <select
                name="from_step_id"
                id="from_step_id"
                value={formData.from_step_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.from_step_id ? 'border-red-500' : ''}`}
                disabled={connection && connection.id}
              >
                <option value="">Select source step</option>
                {getStepOptions()}
              </select>
              {errors.from_step_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.from_step_id}</p>}
            </div>
            
            {/* Condition Type */}
            <div>
              <label htmlFor="condition_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condition Type*
              </label>
              <select
                name="condition_type"
                id="condition_type"
                value={formData.condition_type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.condition_type ? 'border-red-500' : ''}`}
              >
                <option value="ALWAYS">Always</option>
                <option value="IF_APPROVED">If Approved</option>
                <option value="IF_REJECTED">If Rejected</option>
              </select>
              {errors.condition_type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.condition_type}</p>}
            </div>
            
            {/* To Step */}
            <div>
              <label htmlFor="to_step_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Step*
              </label>
              <select
                name="to_step_id"
                id="to_step_id"
                value={formData.to_step_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.to_step_id ? 'border-red-500' : ''}`}
                disabled={connection && connection.id}
              >
                <option value="">Select target step</option>
                {getStepOptions()}
              </select>
              {errors.to_step_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.to_step_id}</p>}
            </div>
            
            {/* Connection Visualization */}
            {formData.from_step_id && formData.to_step_id && (
              <div className={`mt-4 p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <h4 className="text-sm font-medium mb-2">Connection Preview</h4>
                <div className="flex items-center justify-center">
                  <div className={`py-2 px-3 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    {getStepNameById(formData.from_step_id)}
                  </div>
                  <div className="mx-2 flex flex-col items-center">
                    <div className="w-16 h-0.5 bg-blue-500"></div>
                    <span className={`text-xs px-2 py-0.5 mt-1 rounded-full ${getConditionBadgeColor(formData.condition_type)}`}>
                      {getConditionTypeLabel(formData.condition_type)}
                    </span>
                  </div>
                  <div className={`py-2 px-3 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    {getStepNameById(formData.to_step_id)}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {connection && connection.id ? 'Save Changes' : 'Add Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function for label display
const getConditionTypeLabel = (conditionType) => {
  switch (conditionType) {
    case 'ALWAYS': return 'Always';
    case 'IF_APPROVED': return 'If Approved';
    case 'IF_REJECTED': return 'If Rejected';
    default: return conditionType;
  }
};

// Helper function for styling
const getConditionBadgeColor = (conditionType) => {
  switch (conditionType) {
    case 'ALWAYS': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    case 'IF_APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'IF_REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

export default ConnectionModal;