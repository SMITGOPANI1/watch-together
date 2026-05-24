import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Sliders,
  Sun,
  Moon,
  Lock,
  Bell,
  Save,
  Tv,
  Volume2,
  Eye,
  ShieldAlert
} from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../context/ThemeContext';
import { pageVariants } from '../animations/framer';

export const Settings = () => {
  const { addToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  
  // Tabs Config
  const [activeTab, setActiveTab] = useState('general');
  const tabsList = [
    { id: 'general', label: 'Playback & Sync', icon: Sliders },
    { id: 'appearance', label: 'Visual Theme', icon: Sun },
    { id: 'security', label: 'Security & Password', icon: Lock },
    { id: 'notifications', label: 'Alert Feeds', icon: Bell },
  ];

  // Forms states
  const [playbackSettings, setPlaybackSettings] = useState({
    autoplay: true,
    hdPlayback: true,
    soundAlerts: true,
    chatBubbles: true,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationsSettings, setNotificationsSettings] = useState({
    emailAlerts: true,
    partyInvites: true,
    levelUps: true,
    appUpdates: false,
  });

  const [loading, setLoading] = useState(false);

  // Handlers
  const handlePlaybackSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Playback preferences updated successfully! 🎬', 'success');
    }, 800);
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword) {
      addToast('Please enter your current password.', 'warning');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      addToast('Passwords do not match!', 'danger');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      addToast('New password should be at least 6 characters long.', 'warning');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Security credentials updated successfully! 🔒', 'success');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handleNotificationSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Notification alert preferences saved! 🔔', 'success');
    }, 800);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col gap-8 w-full text-left"
    >
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-brand-purple" />
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Account Settings</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div className="flex justify-start w-full">
          <Tabs
            tabs={tabsList}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="max-w-2xl"
          />
        </div>

        {/* Tab Contents */}
        <div className="w-full">
          
          {/* 1. PLAYBACK & SYNC */}
          {activeTab === 'general' && (
            <form onSubmit={handlePlaybackSave} className="flex flex-col gap-6 max-w-3xl">
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 flex items-center gap-2 mb-1">
                    <Tv className="w-4 h-4 text-brand-purple" />
                    <span>Video & Streaming Preferences</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-gray-500">Configure how streams and rooms function by default.</p>
                </div>

                <div className="flex flex-col gap-5 border-t border-slate-100 dark:border-white/5 pt-5">
                  {/* Autoplay next */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Autoplay Queue Videos</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Automatically stream the next queued video when the current media concludes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={playbackSettings.autoplay}
                        onChange={(e) => setPlaybackSettings({ ...playbackSettings, autoplay: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>

                  {/* HD Streams */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Default to HD Resolution</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Prioritize high-definition 1080p stream loading when available.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={playbackSettings.hdPlayback}
                        onChange={(e) => setPlaybackSettings({ ...playbackSettings, hdPlayback: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>

                  {/* Sound Alerts */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">UI & Message Sound Alerts</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Trigger soft chime alerts when chat events or participants join.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={playbackSettings.soundAlerts}
                        onChange={(e) => setPlaybackSettings({ ...playbackSettings, soundAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>

                  {/* Chat Bubbles */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Interactive Chat Bubbles</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Show message preview bubbles over user profile avatars on new texts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={playbackSettings.chatBubbles}
                        onChange={(e) => setPlaybackSettings({ ...playbackSettings, chatBubbles: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={Save}
                    className="w-full sm:w-auto px-6 cursor-pointer"
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </form>
          )}

          {/* 2. VISUAL THEME */}
          {activeTab === 'appearance' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 flex items-center gap-2 mb-1">
                    <Sun className="w-4 h-4 text-brand-purple" />
                    <span>Select Interface Mode</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-gray-500 font-medium">Switch themes below. Changes persist instantly across devices.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  {/* Dark Mode Visual Choice */}
                  <div
                    onClick={() => {
                      if (!isDark) toggleTheme();
                      addToast('Dark Theme toggled! Enjoy the cosmos. 🌌', 'info');
                    }}
                    className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex flex-col gap-4 text-left select-none relative overflow-hidden group ${
                      isDark
                        ? 'border-brand-purple bg-[#070324] shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                        : 'border-slate-100 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    {/* Visual mockup representation */}
                    <div className="w-full h-24 rounded-lg bg-[#030014] border border-white/5 flex flex-col p-2 gap-1.5 overflow-hidden">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <div className="w-12 h-2 rounded bg-white/10" />
                      </div>
                      <div className="flex gap-2 flex-grow">
                        <div className="flex-grow rounded bg-white/[0.02] border border-white/5 flex items-center justify-center">
                          <Tv className="w-5 h-5 text-brand-purple/50" />
                        </div>
                        <div className="w-14 rounded bg-white/[0.02] border border-white/5" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                          <Moon className="w-3.5 h-3.5 text-brand-purple" />
                          <span>Nebula Dark</span>
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Galactic background, violet tones, sleek glassmorphism.</p>
                      </div>
                      {isDark && (
                        <div className="w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      )}
                    </div>
                  </div>

                  {/* Light Mode Visual Choice */}
                  <div
                    onClick={() => {
                      if (isDark) toggleTheme();
                      addToast('Light Theme toggled! Pure and bright. ☀️', 'info');
                    }}
                    className={`cursor-pointer rounded-2xl border-2 p-5 transition-all flex flex-col gap-4 text-left select-none relative overflow-hidden group ${
                      !isDark
                        ? 'border-brand-purple bg-indigo-50/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                        : 'border-white/5 bg-slate-900/50 hover:border-white/10'
                    }`}
                  >
                    {/* Visual mockup representation */}
                    <div className="w-full h-24 rounded-lg bg-slate-50 border border-slate-200 flex flex-col p-2 gap-1.5 overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="w-12 h-2 rounded bg-slate-250" />
                      </div>
                      <div className="flex gap-2 flex-grow">
                        <div className="flex-grow rounded bg-white border border-slate-100 flex items-center justify-center">
                          <Tv className="w-5 h-5 text-brand-purple/40" />
                        </div>
                        <div className="w-14 rounded bg-white border border-slate-100" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-yellow-500" />
                          <span>Solar Light</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Clean high-contrast borders, pastel backings, soft shadows.</p>
                      </div>
                      {!isDark && (
                        <div className="w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 3. SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySave} className="flex flex-col gap-6 max-w-3xl">
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-brand-purple" />
                    <span>Credentials & Privacy</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-gray-500">Secure your platform profile access by periodically changing passwords.</p>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-white/5 pt-5 text-left">
                  <Input
                    label="Current Password"
                    id="current-password"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    icon={Eye}
                    placeholder="Enter current password"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      id="new-password"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      icon={Lock}
                      placeholder="At least 6 characters"
                    />
                    <Input
                      label="Confirm New Password"
                      id="confirm-password"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      icon={Lock}
                      placeholder="Verify new password"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500">
                    <ShieldAlert className="w-4 h-4 text-brand-purple" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Multi-factor auth is currently inactive</span>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={Save}
                    className="w-full sm:w-auto px-6 cursor-pointer"
                  >
                    Update Password
                  </Button>
                </div>
              </Card>
            </form>
          )}

          {/* 4. ALERT FEEDS */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationSave} className="flex flex-col gap-6 max-w-3xl">
              <Card className="p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-brand-purple" />
                    <span>Notification & Alert Systems</span>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-gray-500">Manage when and where you are alerted about platform actions.</p>
                </div>

                <div className="flex flex-col gap-5 border-t border-slate-100 dark:border-white/5 pt-5">
                  {/* Email alerts */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Email Notifications</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Receive digests and recap summaries about platform events in inbox.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notificationsSettings.emailAlerts}
                        onChange={(e) => setNotificationsSettings({ ...notificationsSettings, emailAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>

                  {/* Party Invites */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Watch Party Invites</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Send a push banner immediately when a friend invites you to sync.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notificationsSettings.partyInvites}
                        onChange={(e) => setNotificationsSettings({ ...notificationsSettings, partyInvites: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>

                  {/* Level ups */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Level Ups & Rewards</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Announce XP rewards and level milestone bumps in real-time chat overlays.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notificationsSettings.levelUps}
                        onChange={(e) => setNotificationsSettings({ ...notificationsSettings, levelUps: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>

                  {/* App Updates */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-gray-200">Hive News & Upgrades</h4>
                      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">Hear about new experimental features, player sync protocols, and integrations.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notificationsSettings.appUpdates}
                        onChange={(e) => setNotificationsSettings({ ...notificationsSettings, appUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5.5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-purple" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={Save}
                    className="w-full sm:w-auto px-6 cursor-pointer"
                  >
                    Save Alerts
                  </Button>
                </div>
              </Card>
            </form>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
