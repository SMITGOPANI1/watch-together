import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Play,
  Sun,
  Moon
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Dropdown from '../ui/Dropdown';

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, markNotificationsRead } = useStore();
  const { currentUser: user, logoutUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast('Logged out successfully. See you soon! 👋', 'info');
      navigate('/');
    } catch (err) {
      addToast('Sign out execution failed.', 'error');
    }
  };

  const sideMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
    { id: 'settings', label: 'Account Settings', icon: SettingsIcon, path: '/settings' },
  ];

  const profileItems = [
    { label: 'My Profile', icon: User, onClick: () => navigate('/profile') },
    { label: 'Account Settings', icon: SettingsIcon, onClick: () => navigate('/settings') },
    { label: 'Sign Out', icon: LogOut, className: 'text-red-500 hover:bg-red-500/5', onClick: handleLogout },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-[#030014] text-slate-900 dark:text-gray-100 flex relative overflow-hidden transition-colors duration-500">
      
      {/* Background radial glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full radial-glow-1 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full radial-glow-2 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />

      {/* 1. SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-[#05021A]/80 backdrop-blur-md p-6 z-25 sticky top-0 h-screen text-left">
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]">
            <Play className="w-4 h-4 fill-white text-white translate-x-[0.5px]" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-slate-800 dark:text-white">
            Watch<span className="text-brand-purple">Hive</span>
          </span>
        </Link>

        {/* User Card */}
        {user && (
          <div className="bg-slate-900/[0.01] dark:bg-white/5 p-4 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center gap-3 mb-8">
            <img
              src={user.avatar}
              alt="User"
              className="w-10 h-10 rounded-full border border-brand-purple/30 bg-slate-100 dark:bg-purple-950"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</h4>
              <span className="bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-glow text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block">
                {user.level}
              </span>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {sideMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-brand-purple/10 dark:bg-brand-purple/15 text-brand-purple dark:text-brand-glow border-l-2 border-brand-purple'
                    : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white hover:bg-slate-950/[0.01] dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-purple dark:text-brand-glow' : 'text-slate-400 dark:text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:bg-red-500/5 transition-all mt-auto border-t border-slate-200/50 dark:border-white/5 pt-4 focus:outline-none cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Log Out</span>
        </button>
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200/50 dark:border-white/5 bg-white dark:bg-[#030014] p-6 z-40 lg:hidden flex flex-col text-left"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center">
                    <Play className="w-4.5 h-4.5 fill-white text-white translate-x-[0.5px]" />
                  </div>
                  <span className="font-sans font-bold text-base text-slate-800 dark:text-white">WatchHive</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu nav */}
              <nav className="flex flex-col gap-1.5 flex-grow">
                {sideMenu.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all focus:outline-none cursor-pointer ${
                        isActive
                          ? 'bg-brand-purple/10 dark:bg-brand-purple/15 text-brand-purple dark:text-brand-glow border-l-2 border-brand-purple'
                          : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white hover:bg-slate-950/[0.01] dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all mt-auto border-t border-slate-200/50 dark:border-white/5 pt-4 focus:outline-none cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Log Out</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto z-10 p-6 lg:p-8">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 lg:hidden flex-shrink-0 focus:outline-none cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="relative max-w-md w-full hidden sm:block">
            <Search className="w-4.5 h-4.5 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rooms, tags or playlists..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/[0.01] dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/30 transition-all duration-300"
            />
          </div>

          {/* Controls & Triggers */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer"
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                markNotificationsRead();
                addToast('All notifications marked as read.', 'success');
              }}
              className="p-2.5 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white relative hover:scale-105 active:scale-[0.95] transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-brand-purple border border-white dark:border-[#030014]" />
              )}
            </button>

            {/* Profile trigger */}
            {user && (
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-purple-950"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-white hidden md:block">{user.name}</span>
                  </div>
                }
                items={profileItems}
              />
            )}
          </div>
        </header>

        {/* Dashboard specific child contents */}
        <div className="flex flex-col gap-8 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
