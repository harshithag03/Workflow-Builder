import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import StepDetails from './StepDetails';
import ConnectionDetails from './ConnectionDetails';

const StepSidebar = ({
  workflow,
  selectedElement,
  onAddStep,
  onEditStep,
  onDeleteStep,
  onEditConnection,
  onDeleteConnection
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">{workflow.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{workflow.description || 'No description'}</p>
      </div>

      <div className="p-4">
        <button
          onClick={onAddStep}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <FaPlus /> <span>Add Step</span>
        </button>
      </div>

      {selectedElement ? (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">
              {selectedElement.type === 'step' ? 'Step Details' : 'Connection Details'}
            </h2>
            <button className="text-gray-400 hover:text-gray-500">
              <FaTimes size={18} />
            </button>
          </div>

          {selectedElement.type === 'step' ? (
            <>
              <StepDetails step={selectedElement.data} />
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={onEditStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-1"
                >
                  <FaEdit size={14} /> <span>Edit</span>
                </button>
                <button
                  onClick={onDeleteStep}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-1"
                >
                  <FaTrash size={14} /> <span>Delete</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <ConnectionDetails connection={selectedElement.data} />
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={onEditConnection}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-1"
                >
                  <FaEdit size={14} /> <span>Edit</span>
                </button>
                <button
                  onClick={onDeleteConnection}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-1"
                >
                  <FaTrash size={14} /> <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p>Select a step or connection to view details</p>
        </div>
      )}
    </div>
  );
};

export default StepSidebar;