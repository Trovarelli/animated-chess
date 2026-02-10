"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Faction } from "@/context/GameContext/types";

interface SplashScreenProps {
  onStart: (faction: Faction) => void;
}

const FactionButton = ({
  faction,
  label,
  subtitle,
  icon,
  onSelect,
  delay,
}: {
  faction: Faction;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  onSelect: (faction: Faction) => void;
  delay: number;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    onClick={() => onSelect(faction)}
    className="group relative flex flex-col items-center gap-4 px-10 py-8 overflow-hidden bg-transparent border border-amber-500/20 rounded-sm transition-all duration-300 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(217,119,6,0.25)] active:scale-95 w-52"
  >
    <div className="absolute inset-0 w-0 bg-amber-500/10 transition-all duration-300 group-hover:w-full" />

    <div className="relative w-16 h-16 flex items-center justify-center text-amber-500/60 group-hover:text-amber-500 transition-colors duration-300">
      {icon}
    </div>

    <div className="relative flex flex-col items-center gap-1">
      <span className="text-sm font-black tracking-[0.4em] text-amber-500 transition-colors duration-300 font-cinzel">
        {label}
      </span>
      <span className="text-[9px] uppercase tracking-[0.3em] text-stone-600 group-hover:text-stone-400 transition-colors font-bold">
        {subtitle}
      </span>
    </div>
  </motion.button>
);

const HumanIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
    <path d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(245, 158, 11, 0.1)" />
    <path d="M12 22V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />
    <path d="M4 11H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />
  </svg>
);

const OrcIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
    <path d="M6 19L19 6M19 19L6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4C16 4 19 3 21 5C23 7 22 10 22 10L19 13L16 10L14 8L16 4Z" fill="currentColor" className="opacity-60" />
    <path d="M8 20C8 20 5 21 3 19C1 17 2 14 2 14L5 11L8 14L10 16L8 20Z" fill="currentColor" className="opacity-60" />
  </svg>
);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <span className="text-[10px] uppercase font-black tracking-[0.5em] text-stone-600 font-cinzel">
            Escolha sua facção
          </span>
        </motion.div>

        <div className="flex gap-6">
          <FactionButton
            faction="human"
            label="HUMANOS"
            subtitle="Império"
            icon={<HumanIcon />}
            onSelect={onStart}
            delay={1.2}
          />
          <FactionButton
            faction="orc"
            label="ORCS"
            subtitle="Clã"
            icon={<OrcIcon />}
            onSelect={onStart}
            delay={1.4}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="flex gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="w-1 h-1 bg-amber-900 rounded-full"
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-950/30 to-transparent" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-l from-transparent via-amber-950/30 to-transparent" />
    </div>
  );
};
