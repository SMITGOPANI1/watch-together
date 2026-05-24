import React from 'react';
import { Users } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

export const MembersList = ({ users = [], onInviteClick }) => {
  return (
    <div className="bg-white dark:bg-[#120B38]/30 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-left flex flex-col gap-4 shadow-sm dark:shadow-2xl">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 flex items-center gap-2">
        <Users className="w-4 h-4 text-brand-blue" />
        <span>Room Members ({users.length})</span>
      </h3>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-3 p-1.5 hover:bg-slate-900/[0.01] dark:hover:bg-white/[0.01] rounded-lg transition-all">
            <div className="flex items-center gap-2.5">
              <Avatar src={user.avatar} size="xs" status="online" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>{user.name}</span>
                  {user.isHost && (
                    <Badge variant="primary" className="!text-[7px] !px-1.5 !py-0 select-none">
                      Host
                    </Badge>
                  )}
                </h4>
                <span className="text-[9px] text-slate-400 dark:text-gray-500">{user.role}</span>
              </div>
            </div>

            <span className="text-[9px] text-slate-500 dark:text-gray-500 font-bold bg-slate-950/[0.02] dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 select-none">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
