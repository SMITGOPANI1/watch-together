import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Globe, Play } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { signupWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please correct form errors!', 'warning');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signupWithEmail(name.trim(), email.trim(), password);
      addToast('Account created successfully! Welcome to WatchHive. 🐝', 'success');
      navigate('/dashboard');
    } catch (err) {
      let friendlyMessage = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account already exists under this email address.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Malformed email address format.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password must contain stronger characters.';
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white mt-4">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400">Join the collective to watch synced media.</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Input
            label="Display Name"
            id="signup-name-firebase"
            type="text"
            placeholder="Smit Gopani"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            icon={User}
            required
            disabled={loading}
          />

          <Input
            label="Email Address"
            id="signup-email-firebase"
            type="email"
            placeholder="smit@watchhive.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={Mail}
            required
            disabled={loading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              id="signup-pass-firebase"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              required
              disabled={loading}
            />

            <Input
              label="Confirm Password"
              id="signup-confirm-firebase"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={Lock}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={UserPlus}
            className="w-full py-3.5 mt-2 cursor-pointer"
            disabled={loading}
          >
            Create Hive Account
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="h-[1px] flex-grow bg-slate-200 dark:bg-white/10" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">Or Register With</span>
          <div className="h-[1px] flex-grow bg-slate-200 dark:bg-white/10" />
        </div>

        {/* Google SSO */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all active:scale-[0.98] focus:outline-none cursor-pointer bg-white dark:bg-[#120B38]/30 shadow-sm disabled:opacity-50"
        >
          <Globe className="w-4 h-4 text-red-450" />
          <span>Register with Google</span>
        </button>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-purple dark:text-brand-glow font-bold hover:underline cursor-pointer">
            Sign in
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default Signup;
