import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#202520]">
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
