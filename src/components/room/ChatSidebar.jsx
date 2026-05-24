import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Send } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/cn';

export const ChatSidebar = ({
  chatMessages,
  inputText,
  setInputText,
  handleSendMessage,
  typingUser,
  reactionEmojis,
  triggerReaction,
  participantsCount,
  chatEndRef
}) => {
  return (
    <div className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col h-[520px] shadow-sm dark:shadow-2xl relative overflow-hidden text-left">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-purple animate-pulse" />
          <span>Live Hive Chat</span>
        </h3>

        <div className="flex items-center gap-1.5 bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-full text-[9px] font-bold text-brand-purple dark:text-brand-glow">
          <Users className="w-3 h-3" />
          <span>{participantsCount} Online</span>
        </div>
      </div>

      {/* Chat messages stream */}
      <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 text-left">
            <Avatar src={msg.avatar} alt={msg.userName} size="sm" className="mt-0.5 flex-shrink-0" />
            
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{msg.userName}</span>
                {msg.isHost && (
                  <span className="bg-brand-purple/10 dark:bg-brand-purple/20 text-brand-purple dark:text-brand-glow border border-brand-purple/20 dark:border-brand-purple/30 text-[8px] font-bold uppercase px-1 rounded">
                    Host
                  </span>
                )}
                <span className="text-[9px] text-slate-400 dark:text-gray-500 font-semibold">{msg.timestamp}</span>
              </div>
              
              <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed break-words bg-slate-900/[0.01] dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 px-3 py-2 rounded-xl">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        
        <div ref={chatEndRef} />
      </div>

      {/* Typing Indicator UI */}
      <AnimatePresence>
        {typingUser && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="px-5 py-1 text-[10px] text-slate-500 dark:text-gray-400 italic bg-slate-900/[0.01] dark:bg-white/[0.01] flex items-center gap-1 font-medium"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-purple animate-bounce" />
            <span>{typingUser} is typing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input Forms */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-150 dark:border-white/5 bg-slate-50/50 dark:bg-[#030014]/60 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Send message to Hive..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow bg-slate-900/[0.02] dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/30 transition-all duration-300"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white flex items-center justify-center hover:brightness-115 shadow-[0_0_10px_rgba(139,92,246,0.25)] transition-all active:scale-95 focus:outline-none cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Emoji Burst Reaction Triggers */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2">
          <span className="text-[10px] font-bold text-slate-450 dark:text-gray-500 uppercase tracking-wider">Quick React:</span>
          <div className="flex items-center gap-1.5">
            {reactionEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => triggerReaction(emoji)}
                className="text-sm p-1.5 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 rounded-lg transition-all hover:scale-115 active:scale-90 focus:outline-none cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatSidebar;
