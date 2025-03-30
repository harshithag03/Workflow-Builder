import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import WorkflowDesigner from '../../components/Workflow/WorkflowDesigner';

const WorkflowDesignerPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Wait for the ID to be available through router
  if (!id) {
    return (
      <Layout title="Workflow Designer">
        <div className="flex items-center justify-center h-64 bg-white shadow-md rounded-lg border border-gray-200">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <p className="mt-4 text-blue-800 font-medium">Loading workflow...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Workflow Designer">
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <WorkflowDesigner workflowId={id} />
      </div>
    </Layout>
  );
};

export default WorkflowDesignerPage;