import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import PortfolioHome from './pages/home';
import ToolsCatalog from './pages/allTools';
import { toolsData } from './data/toolsData';
import './global.css';

export default function App() {
  // Force dark theme for the main portfolio website
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <Routes>
      {/* Portfolio Layout Routing */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/sidecraft" element={<ToolsCatalog />} />
      </Route>
      
      {/* Standalone Dynamic Tool Routing (No main navbar or layout wraps) */}
      {toolsData
        .filter(tool => tool.active && tool.component)
        .map(tool => {
          const Component = tool.component;
          return <Route key={tool.id} path={tool.path} element={<Component />} />;
        })
      }
    </Routes>
  );
}
