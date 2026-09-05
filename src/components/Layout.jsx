import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      {/* Persistent Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="py-4 px-6 border-t border-slate-800/40 text-center text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <p>
              <span className="font-semibold text-slate-400">KUTUMB</span> — Family Knowledge & Responsibility Map
            </p>
            <p className="text-slate-400">
              Built for hackathon • Sharma Family Hub Demo
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
