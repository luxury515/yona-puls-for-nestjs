import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SideMenu from './SideMenu';
import MainContent from './MainContent';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <SideMenu />
        <MainContent />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;