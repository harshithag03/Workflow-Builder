import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const StepModal = ({ step, onClose, onSave, darkMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    step_type: 'TASK',
    priority: 'Medium',
    roles: []
  });
  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (step) {
      setFormData({
        name: step.name || '',
        description: step.description || '',
        step_type: step.step_type || 'TASK',
        priority: step.priority || 'Medium',
        roles: step.roles ? [...step.roles] : []
      });
    }
  }, [step]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.step_type) {
      newErrors.step_type = 'Step type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleAddRole = () => {
    if (newRole.trim()) {
      setFormData({
        ...formData,
        roles: [...formData.roles, { id: Date.now(), role_name: newRole.trim() }]
      });
      setNewRole('');
    }
  };

  const handleRemoveRole = (roleId) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter(role => role.id !== roleId)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };


  function addRole() {
    const roleInput = document.getElementById('roleInput');
    const roleName = roleInput.value.trim();
    
    if (roleName) {
      // This might be the issue - check if this part is working
      const rolesList = document.getElementById('rolesList');
      // Add to the visual list
      const roleItem = document.createElement('li');
      roleItem.textContent = roleName;
      rolesList.appendChild(roleItem);
      
      // Add to the form data
      roles.push({ role_name: roleName });
      
      // Clear input
      roleInput.value = '';
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`relative w-full max-w-md mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-xl`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {step ? 'Edit Step' : 'Add New Step'}
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
            {/* Step Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter step name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>
            
            {/* Step Type */}
            <div>
              <label htmlFor="step_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Step Type*
              </label>
              <select
                name="step_type"
                id="step_type"
                value={formData.step_type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${errors.step_type ? 'border-red-500' : ''}`}
              >
                <option value="TASK">Task</option>
                <option value="APPROVAL">Approval</option>
                <option value="NOTIFICATION">Notification</option>
              </select>
              {errors.step_type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.step_type}</p>}
            </div>
            
            {/* Priority (Added Feature) */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                id="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter step description"
              ></textarea>
            </div>
            
            {/* Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned Roles
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                  placeholder="Add a role (e.g. Department Head)"
                  className={`flex-1 px-3 py-2 border rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className={`p-2 rounded-md border ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'} max-h-32 overflow-y-auto`}>
                {formData.roles.length > 0 ? (
                  <ul className="space-y-1">
                    {formData.roles.map((role) => (
                      <li key={role.id} className="flex justify-between items-center px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{role.role_name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(role.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic p-2">No roles assigned</div>
                )}
              </div>
            </div>
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
              {step ? 'Save Changes' : 'Add Step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepModal;