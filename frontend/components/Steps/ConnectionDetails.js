import React from 'react';

const getConditionTypeLabel = (conditionType) => {
  switch (conditionType) {
    case 'ALWAYS':
      return 'Always';
    case 'IF_APPROVED':
      return 'If Approved';
    case 'IF_REJECTED':
      return 'If Rejected';
    default:
      return conditionType;
  }
};

const getConditionTypeColor = (conditionType) => {
  switch (conditionType) {
    case 'ALWAYS':
      return 'bg-gray-100 text-gray-800';
    case 'IF_APPROVED':
      return 'bg-green-100 text-green-800';
    case 'IF_REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ConnectionDetails = ({ connection }) => {
  if (!connection) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Connection Type</h3>
        <div className="mt-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionTypeColor(connection.condition_type)}`}>
            {getConditionTypeLabel(connection.condition_type)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">From Step</h3>
        <p className="mt-1 text-sm text-gray-900">{connection.from_step_name || 'Unknown'}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">To Step</h3>
        <p className="mt-1 text-sm text-gray-900">{connection.to_step_name || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default ConnectionDetails;