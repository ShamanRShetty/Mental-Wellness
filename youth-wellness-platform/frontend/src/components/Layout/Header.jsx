import React, { useState } from 'react';
import {
  Menu,
  X,
  Heart,
  MessageCircle,
  BarChart3,
  BookOpen,
  Settings,
  Wind,
  TrendingUp,
  AlertTriangle,
  Library,
  ClipboardList,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Logo from '../UI/Logo';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const { preferences, updatePreferences } = useApp();

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const dropdowns = [
    {
      name: 'Track',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
        { name: 'Mood Tracker', href: '/mood', icon: BarChart3 },
        { name: 'Journal', href: '/journal', icon: Library },
      ],
    },
    {
      name: 'Connect',
      items: [
        { name: 'Chat', href: '/chat', icon: MessageCircle },
        { name: 'Assessment', href: '/assessment', icon: ClipboardList },
        { name: 'Wellness', href: '/wellness', icon: Wind },
      ],
    },
  ];

  return (
    <header className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
  <Logo/>
</Link>
        

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Need Help Now (important) */}
            <Link
              to="/emergency"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition animate-pulse"
            >
              <AlertTriangle size={20} />
              <span>Need Help Now</span>
            </Link>

            {/* Dropdown Menus */}
            {dropdowns.map((menu) => (
              <div key={menu.name} className="relative">
                <button
                  onClick={() => toggleDropdown(menu.name)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <span>{menu.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      openDropdown === menu.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === menu.name && (
                  <div
                    className="absolute mt-2 bg-white dark:bg-dark-bg shadow-lg rounded-lg py-2 w-48 border border-gray-100 dark:border-gray-700"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {menu.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                            isActive(item.href)
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card'
                          }`}
                        >
                          <Icon size={18} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Resources (important, outside dropdown) */}
            <Link
              to="/resources"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive('/resources')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg'
              }`}
            >
              <BookOpen size={20} />
              <span>Resources</span>
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              <Settings size={24} />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() =>
                updatePreferences({
                  theme: preferences.theme === 'dark' ? 'light' : 'dark',
                })
              }
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              title="Toggle theme"
            >
              {preferences.theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 bg-white dark:bg-dark-card rounded-lg shadow-md">
            {/* Need Help Now */}
            <Link
              to="/emergency"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg mb-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold animate-pulse"
              onClick={() => setMobileMenuOpen(false)}
            >
              <AlertTriangle size={20} />
              <span>Need Help Now</span>
            </Link>

            {/* Dropdown sections */}
            {dropdowns.map((menu) => (
              <div key={menu.name} className="mb-3">
                <p className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  {menu.name}
                </p>
                {menu.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-6 py-2 rounded-lg transition ${
                        isActive(item.href)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-bg'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Resources */}
            <Link
              to="/resources"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive('/resources')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-bg'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen size={20} />
              <span>Resources</span>
            </Link>

            {/* Settings + Theme */}
            <div className="flex items-center justify-between px-4 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
              <Link
                to="/settings"
                className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={20} />
                <span>Settings</span>
              </Link>

              <button
                onClick={() =>
                  updatePreferences({
                    theme: preferences.theme === 'dark' ? 'light' : 'dark',
                  })
                }
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                title="Toggle theme"
              >
                {preferences.theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
