import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import flexLogo from './assets/image.webp';

function App() {
  const navLinkClass = ({ isActive }) =>
    `py-2 px-3 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white bg-opacity-10 text-white'
        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
    }`;

  return (
    <div className="bg-flex-white min-h-screen">
      <header className="bg-flex-dark-green">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img className="h-6 w-auto filter brightness-0 invert" src={flexLogo} alt="Flex Living" />
            </div>
            <div className="flex items-center space-x-4">
              <NavLink to="/" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/property/2B N1 A - 29 Shoreditch Heights" className={navLinkClass}>
                Public View
              </NavLink>
              <NavLink to="/dev-tools" className={navLinkClass}>
                Dev Tools
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;