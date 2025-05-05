import React from 'react';
import { Outlet } from 'react-router-dom';
import VacancySidebar from '../Sidebar/VacancySidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <VacancySidebar />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet /> {/* Šeit tiks renderēts konkrētais skats */}
      </main>
    </div>
  );
};

export default MainLayout;
