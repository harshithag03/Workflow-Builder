import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Layout = ({ children, title = 'Workflow Builder' }) => {
  return (
    <div className="min-h-screen bg-blue-50 relative">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Workflow Builder Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          /* Prevent unwanted background elements */
          body::before, 
          body::after, 
          body > div::before, 
          body > div::after {
            display: none !important;
            content: none !important;
          }
          
          /* Ensure body has a clean background */
          body {
            background-color: #EFF6FF !important;
            overflow-x: hidden;
          }
        `}</style>
      </Head>

      <div className="relative z-10">  
        <Navbar />

        <main className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
          {children}
        </main>
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Layout;