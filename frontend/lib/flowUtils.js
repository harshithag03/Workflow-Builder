/**
 * Transform workflow data to ReactFlow elements
 * @param {Object} workflow - The workflow data from the API
 * @returns {Array} - Array of nodes and edges for ReactFlow
 */
export const transformToFlowElements = (workflow) => {
    if (!workflow || !workflow.steps || !Array.isArray(workflow.steps)) return [];
  
    const nodes = workflow.steps.map((step, index) => {
      // Calculate position based on order_index
      // This is a simple horizontal layout, could be improved for more complex workflows
      const position = {
        x: 250 * step.order_index,
        y: 100 + (index % 2) * 100 // Alternate y positions for better visualization
      };
  
      return {
        id: `step-${step.id}`,
        type: 'default',
        data: {
          ...step,
          label: step.name,
          type: 'step'
        },
        position,
        style: {
          background: getStepTypeColor(step.step_type),
          color: '#fff',
          border: '1px solid #ddd',
          width: 180,
          padding: 10,
          borderRadius: 5
        }
      };
    });
  
    // Create edges from connections
    const edges = workflow.connections ? workflow.connections.map((connection) => {
      const sourceStep = workflow.steps.find(s => s.id === connection.from_step_id);
      const targetStep = workflow.steps.find(s => s.id === connection.to_step_id);
  
      // Augment connection data with step names for easier display
      const enhancedConnection = {
        ...connection,
        from_step_name: sourceStep ? sourceStep.name : 'Unknown',
        to_step_name: targetStep ? targetStep.name : 'Unknown'
      };
  
      return {
        id: `edge-${connection.id}`,
        source: `step-${connection.from_step_id}`,
        target: `step-${connection.to_step_id}`,
        data: {
          ...enhancedConnection,
          type: 'connection'
        },
        type: 'smoothstep',
        animated: true,
        label: getConditionTypeLabel(connection.condition_type),
        style: {
          stroke: getConditionTypeEdgeColor(connection.condition_type)
        }
      };
    }) : [];
  
    return [...nodes, ...edges];
  };
  
  /**
   * Get color for step type
   * @param {string} stepType - The step type
   * @returns {string} - CSS color string
   */
  const getStepTypeColor = (stepType) => {
    switch (stepType) {
      case 'APPROVAL':
        return '#0ea5e9'; // blue
      case 'TASK':
        return '#10b981'; // green
      case 'NOTIFICATION':
        return '#f59e0b'; // amber
      default:
        return '#64748b'; // gray
    }
  };
  
  /**
   * Get edge color for condition type
   * @param {string} conditionType - The condition type
   * @returns {string} - CSS color string
   */
  const getConditionTypeEdgeColor = (conditionType) => {
    switch (conditionType) {
      case 'ALWAYS':
        return '#64748b'; // gray
      case 'IF_APPROVED':
        return '#10b981'; // green
      case 'IF_REJECTED':
        return '#ef4444'; // red
      default:
        return '#64748b'; // gray
    }
  };
  
  /**
   * Get label for condition type
   * @param {string} conditionType - The condition type
   * @returns {string} - Human-readable label
   */
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