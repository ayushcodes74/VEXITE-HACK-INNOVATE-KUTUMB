import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF8F5', color: '#1a1a1a' }}>
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main content area — offset for sidebar (w-64) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer
          className="py-4 px-6 text-center text-[11px]"
          style={{ color: '#AAAAAA', borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: '#555555' }}>KUTUMB</span>
              <span style={{ color: '#CCCCCC' }}>·</span>
              <span>Family Knowledge OS</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Powered by Gemini</span>
              <span style={{ color: '#CCCCCC' }}>·</span>
              <span>HackDays 2026</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
