import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div
      className={`min-h-screen flex flex-col bg-white text-[#202520] ${
        isHome ? 'lg:h-screen lg:overflow-hidden' : ''
      }`}
    >
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  );
};


