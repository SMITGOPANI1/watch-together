import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Award, Clock, Tv } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import { pageVariants } from '../animations/framer';

export const Profile = () => {
  const { currentUser: user, updateProfileDetails } = useAuth();
  const { addToast } = useToast();
  
  // Safe values in case of slow profile sync states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast('Name and email cannot be empty!', 'warning');
      return;
    }
    setLoading(true);

    try {
      const res = await updateProfileDetails({ name, email, bio });
      if (res.success) {
        addToast('Profile metadata updated successfully! 👤', 'success');
      } else {
        addToast(res.error || 'Failed to sync profile updates.', 'error');
      }
    } catch (err) {
      addToast('Failed to save profile changes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Safe checks if user not loaded yet
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading profile catalog...
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col gap-8 w-full text-left"
    >
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-brand-purple" />
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* User Card with level stats */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <Card variant="glow" className="flex flex-col items-center text-center p-6 gap-4">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.uid}`}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-brand-purple/40 bg-slate-100 dark:bg-purple-950 shadow-lg"
            />
            
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user.name}</h3>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{user.email}</p>
            </div>

            <Badge variant="primary" className="py-1 px-3 mt-1 select-none">
              {user.level || 'Host Pro'}
            </Badge>

            {/* Level progress bar */}
            <div className="w-full border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-gray-500 mb-1.5 uppercase tracking-wider">
                <span>XP Level {user.levelValue || 78}%</span>
                <span>Level up at 100%</span>
              </div>
              <div className="w-full h-2 bg-slate-150 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${user.levelValue || 78}%` }}
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Edit profile form */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-6 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-brand-purple" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <Input
                  label="Display Name"
                  id="profile-name-firebase"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={User}
                  required
                />
                
                <Input
                  label="Email Address"
                  id="profile-email-firebase"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                  disabled // Email is safely managed via Firebase Authentications
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="profile-bio-firebase" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Profile Bio
                </label>
                <textarea
                  id="profile-bio-firebase"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the watch rooms about yourself..."
                  className="w-full px-4 py-3 bg-slate-950/[0.01] dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/30 transition-all duration-300"
                />
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Save}
                  className="w-full sm:w-auto px-6 cursor-pointer"
                >
                  Save Information
                </Button>
              </div>
            </form>
          </Card>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Watch Time', value: `${user.hoursWatched || 48.5} hrs`, icon: Clock, color: 'text-brand-purple' },
              { label: 'Rooms Hosted', value: user.roomsHosted || 24, icon: Tv, color: 'text-brand-blue' },
              { label: 'XP Points', value: '4,280', icon: Award, color: 'text-emerald-500' },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="p-4 flex flex-col gap-2 text-center items-center justify-center">
                  <div className={`p-1.5 rounded-lg bg-slate-900/5 dark:bg-white/5 ${metric.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-800 dark:text-white mt-1">{metric.value}</h4>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">{metric.label}</span>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;
