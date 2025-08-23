import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function App() {
  const navLinkStyles = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none',
  });

  return (
    <div className="font-sans bg-flex-beige min-h-screen text-flex-text">
      <header className="bg-flex-dark-teal text-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Flex Reviews</div>
          <ul className="flex space-x-6">
            <li><NavLink to="/" style={navLinkStyles}>Manager Dashboard</NavLink></li>
            <li><NavLink to="/property/2B N1 A - 29 Shoreditch Heights" style={navLinkStyles}>Public Page (Example)</NavLink></li>
            <li><NavLink to="/dev-tools" style={navLinkStyles}>Dev Tools</NavLink></li>
          </ul>
        </nav>
      </header>
      <main className="container mx-auto p-6">
        {}
        <Outlet />
      </main>
    </div>
  );
}

export default App;