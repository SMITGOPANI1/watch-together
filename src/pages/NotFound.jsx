import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, HelpCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { pageVariants } from '../animations/framer';

export const NotFound = () => {
  const navigate = useNavigate();

  // Floating shape variants for cosmic atmosphere
  const floatAnimation = (delay) => ({
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      },
    },
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-50 dark:bg-[#030014] text-slate-900 dark:text-gray-100 flex items-center justify-center relative overflow-hidden px-6 select-none"
    >
      {/* Background neon glows */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full radial-glow-1 blur-[100px] pointer-events-none opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full radial-glow-2 blur-[100px] pointer-events-none opacity-40 dark:opacity-100" />

      {/* Floating Cosmic Primitives */}
      <motion.div
        variants={floatAnimation(0)}
        animate="animate"
        className="absolute top-1/4 left-1/12 text-brand-purple/20 dark:text-brand-purple/30 hidden md:block"
      >
        <Compass className="w-16 h-16 animate-pulse" />
      </motion.div>

      <motion.div
        variants={floatAnimation(2.5)}
        animate="animate"
        className="absolute bottom-1/4 right-1/12 text-brand-blue/20 dark:text-brand-blue/30 hidden md:block"
      >
        <HelpCircle className="w-20 h-20" />
      </motion.div>

      {/* Glass Card Box Container */}
      <div className="relative z-10 max-w-md w-full text-center">
        <Card variant="glow" className="p-8 flex flex-col items-center gap-6">
          {/* Neon 404 Header */}
          <div className="relative">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10 }}
              className="text-8xl font-black bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              404
            </motion.h1>
            {/* Absolute indicator badge */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              Signal Lost
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Wandered Off the Sync Map?</h2>
            <p className="text-xs leading-relaxed text-slate-400 dark:text-gray-500">
              The coordinates you are navigating don't contain any active Watch Parties. Let's steer your ship back to safe hives!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              className="flex-grow cursor-pointer"
            >
              Go Back
            </Button>
            
            <Button
              variant="primary"
              icon={Home}
              onClick={() => navigate('/dashboard')}
              className="flex-grow cursor-pointer"
            >
              Enter Dashboard
            </Button>
          </div>
        </Card>

        {/* Small branding footer */}
        <p className="text-[10px] text-slate-400 dark:text-gray-600 mt-6 font-bold uppercase tracking-widest">
          Watch<span className="text-brand-purple">Hive</span> Sync Protocol
        </p>
      </div>
    </motion.div>
  );
};

export default NotFound;
