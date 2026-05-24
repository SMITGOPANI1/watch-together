import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Play, LogIn, Users } from 'lucide-react';
import Button from '../ui/Button';

export const Navbar = ({ onCreateRoomClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#030014]/80 backdrop-blur-md border-b border-white/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:scale-105 transition-all duration-300">
              <Play className="w-5 h-5 fill-white text-white translate-x-[1px]" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
              Watch<span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">Hive</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link)}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative py-1"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
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
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl border border-white/10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
            className="fixed top-[73px] inset-x-0 z-30 md:hidden glass-panel border-b border-white/10 bg-[#030014]/95 p-6 overflow-hidden flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link)}
                  className="text-left text-base font-semibold text-gray-300 hover:text-white py-2 border-b border-white/5"
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
