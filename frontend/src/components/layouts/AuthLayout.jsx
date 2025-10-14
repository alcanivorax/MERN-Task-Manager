import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AuthLayout({ children }) {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Animated background gradient blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.2 }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500 blur-[140px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary blur-[120px]"
      />

      <div className="flex flex-1">
        {/* Left branding panel */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-indigo-600 text-white flex-col justify-center items-center p-10 relative z-10"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl font-extrabold mb-4 tracking-tight"
          >
            Task Manager
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-slate-100 max-w-sm text-center leading-relaxed"
          >
            Organize your tasks, track progress, and boost productivity with
            ease.
          </motion.p>
        </motion.div>

        {/* Right panel (auth content w/ transitions) */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-slate-50 p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname} // ensures smooth transition between login/signup
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 pt-8 pb-10"
            >
              {/* Mobile branding */}
              <h2 className="text-xl font-semibold text-black mb-6 md:hidden">
                Task Manager
              </h2>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
