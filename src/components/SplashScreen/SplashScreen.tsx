"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen = ({ onStart }: SplashScreenProps) => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0c0a09] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/animated-chess.png"
            alt="Animated Chess Logo"
            width={400}
            height={160}
            className="h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(217,119,6,0.5)]"
            priority
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="mt-4"
          >
            <span className="text-[10px] uppercase font-black tracking-[0.8em] text-stone-500 font-cinzel">
              Grand Marshal&apos;s Edition
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col items-center gap-6"
        >
          <button
            onClick={onStart}
            className="group relative px-12 py-4 overflow-hidden bg-transparent border border-amber-500/30 rounded-sm transition-all duration-300 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] active:scale-95"
          >
            <div className="absolute inset-0 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />
            <span className="relative text-sm font-black tracking-[0.4em] text-amber-500 transition-colors duration-300 group-hover:text-stone-950 font-cinzel">
              INICIAR JOGO
            </span>
          </button>

          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-1 h-1 bg-amber-900 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-950/30 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-l from-transparent via-amber-950/30 to-transparent" />
    </div>
  );
};
