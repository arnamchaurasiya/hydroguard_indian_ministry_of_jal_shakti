import React from 'react';
import Sidebar from '../Pages/sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main-content">
        {children}
      </main>
    </div>
  );
}
