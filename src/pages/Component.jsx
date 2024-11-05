import React, { useState } from 'react'
import Loader from '../components/Loader';
import CodeViewer from '../components/CodeCard';
import useGitHubRepo from '../Hooks/hooks';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';



const Components = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const { files, loading, error } = useGitHubRepo();

  if (loading) return <Loader/>;
  if (error) return <div>Error: {error}</div>;

  return (<>
  <Sidebar  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />



  {/*  Site header */}
  <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  
  <CodeViewer files={files} />
  
  </>);
}

export default Components



