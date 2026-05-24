import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Globe, MessageSquare, Play } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please correct form errors!', 'warning');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      addToast('Welcome back! Logged in successfully. 👋', 'success');
      navigate('/dashboard');
    } catch (err) {
      // Parse friendly message from Firebase Auth error structures
      let friendlyMessage = 'Authentication failed. Please check credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password combination.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Account temporarily locked due to excessive login attempts.';
      }
      addToast(friendlyMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      addToast('Authenticated with Google! 🌐', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Google Sign-In failed or cancelled.', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card variant="glow" className="p-8 border shadow-2xl relative z-10 flex flex-col gap-6">
        {/* Logo/Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] cursor-pointer">
            <Play className="w-6 h-6 fill-white text-white translate-x-[1px]" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white mt-4">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400">Stream synchronizations are waiting for you.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            id="login-email-firebase"
            type="email"
            placeholder="smit@watchhive.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={Mail}
            required
            disabled={loading}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex justify-between items-center">
              <label htmlFor="login-pass-firebase" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-purple dark:text-brand-glow hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-pass-firebase"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={LogIn}
            className="w-full py-3.5 mt-2 cursor-pointer"
            disabled={loading}
          >
            Sign In to Account
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-grow bg-slate-200 dark:bg-white/10" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Or Continue With</span>
          <div className="h-[1px] flex-grow bg-slate-200 dark:bg-white/10" />
        </div>

        {/* Socials */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all active:scale-[0.98] focus:outline-none cursor-pointer bg-white dark:bg-[#120B38]/30 shadow-sm disabled:opacity-50"
          >
            <Globe className="w-4 h-4 text-red-450" />
            <span>Google</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              addToast('Discord Auth will be configured in a later build.', 'info');
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all active:scale-[0.98] focus:outline-none cursor-pointer bg-white dark:bg-[#120B38]/30 shadow-sm disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Discord</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-gray-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-purple dark:text-brand-glow font-bold hover:underline cursor-pointer">
            Create account
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default Login;
