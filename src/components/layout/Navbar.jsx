import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Play, LogIn, Users, Sun, Moon, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onCreateRoomClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const { currentUser: user, logoutUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features', hash: 'features' },
    { name: 'Pricing', path: '/#pricing', hash: 'pricing' },
    { name: 'About', path: '/#about', hash: 'about' },
  ];

  const handleLinkClick = (link) => {
    setIsOpen(false);
    if (link.hash) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(link.hash);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(link.hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.path);
    }
  };

  const profileItems = [
    { label: 'My Dashboard', icon: LayoutDashboard, onClick: () => navigate('/dashboard') },
    { label: 'My Profile', icon: User, onClick: () => navigate('/profile') },
    { label: 'Account Settings', icon: Settings, onClick: () => navigate('/settings') },
    {
      label: 'Sign Out',
      icon: LogOut,
      className: 'text-red-500 hover:bg-red-500/5',
      onClick: async () => {
        await logoutUser();
        navigate('/');
      }
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/85 dark:bg-[#030014]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:scale-105 transition-all duration-300">
              <Play className="w-5 h-5 fill-white text-white translate-x-[1px]" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-slate-800 dark:text-white transition-all duration-300">
              Watch<span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">Hive</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link)}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors duration-300 relative py-1 focus:outline-none cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <Dropdown
                trigger={
                  <img
                    src={user.avatar}
                    alt="Profile Avatar"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-brand-purple/30 bg-slate-100 dark:bg-purple-950 hover:scale-105 transition-all cursor-pointer"
                  />
                }
                items={profileItems}
              />
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  icon={LogIn}
                  className="!px-4 !py-2"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={onCreateRoomClick}
                  icon={Users}
                  className="!px-5 !py-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  Create Room
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-gray-400 focus:outline-none cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white bg-slate-900/5 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Slide-down Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[73px] inset-x-0 z-30 md:hidden border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#030014]/95 p-6 overflow-hidden flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link)}
                  className="text-left text-base font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 focus:outline-none"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/login');
                }}
                icon={LogIn}
                className="w-full"
              >
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsOpen(false);
                  onCreateRoomClick();
                }}
                icon={Users}
                className="w-full"
              >
                Create Room
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
