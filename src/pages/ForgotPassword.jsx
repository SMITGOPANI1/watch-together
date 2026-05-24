import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft, Play } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { resetPasswordEmail } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      addToast('Please enter your email address!', 'warning');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email format');
      addToast('Malformed email address.', 'warning');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPasswordEmail(email.trim());
      addToast('Password reset link successfully sent to inbox! 📬', 'success');
      setEmail('');
    } catch (err) {
      let friendlyMessage = 'Reset failed. Please check address.';
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No account exists with this email address.';
      }
      addToast(friendlyMessage, 'error');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white mt-4">Recover Password</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400">Enter email to recover access to the sync platforms.</p>
        </div>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            id="forgot-email-firebase"
            type="email"
            placeholder="smit@watchhive.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            icon={Mail}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={KeyRound}
            className="w-full py-3.5 mt-2 cursor-pointer"
            disabled={loading}
          >
            Send Recovery Link
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-gray-400 font-medium border-t border-slate-100 dark:border-white/5 pt-4 flex justify-center">
          <Link to="/login" className="text-slate-400 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to sign in</span>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default ForgotPassword;
