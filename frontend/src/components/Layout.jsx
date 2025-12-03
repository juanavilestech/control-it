import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/christmas-theme.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isChristmasTheme, setIsChristmasTheme] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('christmasTheme');
    if (savedTheme === 'true') {
      setIsChristmasTheme(true);
      document.body.classList.add('christmas-theme');
    }
  }, []);

  // Toggle Christmas theme
  const toggleChristmasTheme = () => {
    const newTheme = !isChristmasTheme;
    setIsChristmasTheme(newTheme);
    
    if (newTheme) {
      document.body.classList.add('christmas-theme');
      localStorage.setItem('christmasTheme', 'true');
    } else {
      document.body.classList.remove('christmas-theme');
      localStorage.setItem('christmasTheme', 'false');
    }
  };

  // Generate snowflakes
  const generateSnowflakes = () => {
    const snowflakes = [];
    for (let i = 0; i < 50; i++) {
      snowflakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
          }}
        >
          ❄
        </div>
      );
    }
    return snowflakes;
  };

  // Generate Christmas lights
  const generateLights = () => {
    const lights = [];
    for (let i = 0; i < 30; i++) {
      lights.push(<div key={i} className="christmas-light" />);
    }
    return lights;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Snowflakes */}
      {isChristmasTheme && (
        <>
          <div className="snowflakes">{generateSnowflakes()}</div>
          <div className="christmas-lights">{generateLights()}</div>
        </>
      )}

      <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side: Logo, Title, Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 flex items-center gap-3">
                <img src="/logoSF.png" alt="Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent hidden md:block">
                  Oficina IT San Felipe
                </h1>
              </div>
              <div className="hidden sm:flex sm:space-x-8">
                <Link to="/" className={`${location.pathname === '/' ? 'text-indigo-600 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200`}>
                  Dashboard
                </Link>
                <Link to="/jobs" className={`${location.pathname.startsWith('/jobs') ? 'text-indigo-600 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200`}>
                  Trabajos
                </Link>
                <Link to="/inventory" className={`${location.pathname.startsWith('/inventory') ? 'text-indigo-600 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200`}>
                  Inventario
                </Link>
              </div>
            </div>

            {/* Right Side: Christmas Toggle, User Info & Logout */}
            <div className="flex items-center gap-4">
              {/* Christmas Theme Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600" title="Tema Navideño">
                  🎄
                </span>
                <button
                  onClick={toggleChristmasTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isChristmasTheme ? 'bg-red-600 focus:ring-red-500' : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                  title={isChristmasTheme ? 'Desactivar tema navideño' : 'Activar tema navideño'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      isChristmasTheme ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-1.5 rounded-full shadow-sm">
                {user?.username}
              </span>
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="group relative flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="absolute right-0 -bottom-8 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-white bg-gray-800 px-2 py-1 rounded shadow-lg">
                  Salir
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
