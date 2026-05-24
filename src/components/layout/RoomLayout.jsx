import React from 'react';

export const RoomLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030014] text-slate-900 dark:text-gray-100 transition-colors duration-500 relative overflow-hidden">
      {/* Background Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full radial-glow-1 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full radial-glow-2 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />

      {/* Main page content container */}
      <main className="z-10 relative">{children}</main>
    </div>
  );
};

export default RoomLayout;
