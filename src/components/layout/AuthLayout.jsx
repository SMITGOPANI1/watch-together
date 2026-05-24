import React from 'react';

export const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#030014] dark:text-gray-100 transition-colors duration-500">
      {/* Background Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full radial-glow-1 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full radial-glow-2 blur-[120px] pointer-events-none z-0 opacity-40 dark:opacity-100" />

      {/* Centered credential card container */}
      <main className="flex-grow flex items-center justify-center py-12 px-6 z-10">{children}</main>
    </div>
  );
};

export default AuthLayout;
