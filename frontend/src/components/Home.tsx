import React from 'react';
import Header from './Header';
import SideMenu from './SideMenu';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <SideMenu />
        <main className="flex-1 p-8 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">홈화면입니다.</h1>
        </main>
      </div>
    </div>
  );
};

export default Home;