import React from 'react';
import Layout from '../components/Layout/Layout';
import WorkflowList from '../components/Workflow/WorkflowList';

const HomePage = () => {
  return (
    <Layout title="Workflow Builder">
      <div className="bg-white shadow-md rounded-lg p-0 border border-gray-200 overflow-hidden relative z-10">
        <div className="absolute inset-0 bg-white"></div>
        <WorkflowList />
      </div>
    </Layout>
  );
};

export default HomePage;