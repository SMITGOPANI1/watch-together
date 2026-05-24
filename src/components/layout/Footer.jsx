import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Share2, Code, MessageSquare, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#02000A] py-12 px-6">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center">
              <Play className="w-4 h-4 fill-white text-white translate-x-[0.5px]" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-slate-800 dark:text-white">
              Watch<span className="text-brand-purple">Hive</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
            Watch YouTube together with your friends in synchronized real-time. Share chat, emoji reactions, and premium cinema energy right from your browser.
          </p>
        </div>

        {/* Navigation Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">Product</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-gray-400">
            <li><a href="#features" className="hover:text-slate-800 dark:hover:text-white transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-slate-800 dark:hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#about" className="hover:text-slate-800 dark:hover:text-white transition-colors">About Us</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">Support</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Social Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">Connect</h4>
          <div className="flex items-center gap-4 text-slate-500 dark:text-gray-400">
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors p-2 bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/10">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors p-2 bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/10">
              <Code className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors p-2 bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/10">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-white/5 pt-8 text-xs text-slate-400 dark:text-gray-500">
        <p>© {new Date().getFullYear()} WatchHive. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-4 sm:mt-0">
          Made with <Heart className="w-3.5 h-3.5 text-brand-purple fill-brand-purple animate-pulse" /> for modern streaming.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
