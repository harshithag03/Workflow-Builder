import React from 'react';

const getStepTypeLabel = (stepType) => {
  switch (stepType) {
    case 'APPROVAL':
      return 'Approval';
    case 'TASK':
      return 'Task';
    case 'NOTIFICATION':
      return 'Notification';
    default:
      return stepType;
  }
};

const getStepTypeColor = (stepType) => {
  switch (stepType) {
    case 'APPROVAL':
      return 'bg-blue-100 text-blue-800';
    case 'TASK':
      return 'bg-green-100 text-green-800';
    case 'NOTIFICATION':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StepDetails = ({ step }) => {
  if (!step) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Name</h3>
        <p className="mt-1 text-base text-gray-900">{step.name}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Type</h3>
        <div className="mt-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStepTypeColor(step.step_type)}`}>
            {getStepTypeLabel(step.step_type)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Description</h3>
        <p className="mt-1 text-sm text-gray-900">{step.description || 'No description'}</p>
      </div>

      {step.roles && step.roles.length > 0 && (
  <div>
    <h3 className="text-sm font-medium text-gray-500">Assigned Roles</h3>
    <div className="mt-2 flex flex-wrap gap-2">
      {step.roles.map((role) => (
        <span 
          key={role.id} 
          className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200"
        >
          {role.role_name}
        </span>
      ))}
    </div>
  </div>
)}

      <div>
        <h3 className="text-sm font-medium text-gray-500">Order</h3>
        <p className="mt-1 text-sm text-gray-900">{step.order_index}</p>
      </div>
    </div>
  );
};

export default StepDetails;