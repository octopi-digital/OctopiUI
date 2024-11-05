import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

import CodeViewer from '../components/CodeCard';
import Loader from '../components/Loader';
import useGitHubRepo from '../Hooks/hooks';

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { files, loading, error } = useGitHubRepo();

  if (loading) return <Loader/>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar files={files} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
        
  <CodeViewer files={files} />
        </main>



      </div>
    </div>
  );
}

export default Dashboard;