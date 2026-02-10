"use client";
import { useContext } from "react";
import { GameContext } from "@/context/GameContext/context";
import { motion, AnimatePresence } from "framer-motion";

export const GameOverModal = () => {
  const { gameOver, resetGame, moveHistory } = useContext(GameContext);

  if (!gameOver.over) return null;

  const winner = gameOver.winner.color;
  const moveCount = moveHistory.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/90 backdrop-blur-xl"
        onClick={resetGame}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-20 ${winner === 'white' ? 'bg-white' : 'bg-amber-600'}`} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-stone-900/40 border border-amber-500/30 rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-12 max-w-lg w-full mx-4 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-500 mb-2 block font-cinzel">
              Conclusão de Operação
            </span>
            <h2 className="text-4xl font-black text-amber-500 uppercase tracking-widest font-cinzel mb-8">
              Vitória dos {winner === "white" ? "Humanos" : "Orcs"}!
            </h2>
          </motion.div>

          <div className="flex justify-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
              className="relative w-24 h-24 bg-stone-950/80 rounded-full border border-amber-500/30 flex items-center justify-center shadow-2xl"
            >
               <div className="text-5xl drop-shadow-[0_0_15px_rgba(217,119,6,0.5)] flex items-center justify-center w-full h-full">
                 {winner === "white" ? (
                    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                        <path d="M12 2L3 5V11C3 16.55 6.4 21.74 12 23C17.6 21.74 21 16.55 21 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(245, 158, 11, 0.2)"/>
                        <path d="M12 18V6M9 9L12 6L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                 ) : (
                    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-500">
                        <path d="M21 3L3 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16 2C16 2 20 2 22 4C24 6 24 10 24 10L20 12L18 10L17 8L16 2Z" fill="rgba(245, 158, 11, 0.2)" stroke="currentColor"/>
                        <path d="M6 12C6 12 2 12 0 10C-2 8 -2 4 -2 4L2 2L4 4L5 6L6 12Z" fill="rgba(245, 158, 11, 0.2)" stroke="currentColor"/>
                    </svg>
                 )}
               </div>
               <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-ping" />
            </motion.div>
          </div>

          <p className="text-stone-300 text-sm mb-10 font-bold uppercase tracking-widest px-8">
            &quot;{gameOver.winner.details}&quot;
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-stone-950/50 p-4 border border-stone-800">
                <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-1 block">Sequências Totais</span>
                <span className="text-2xl font-mono text-amber-500 font-bold">{moveCount.toString().padStart(2, '0')}</span>
             </div>
             <div className="bg-stone-950/50 p-4 border border-stone-800">
                <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest mb-1 block">Turnos de Combate</span>
                <span className="text-2xl font-mono text-white font-bold">{Math.ceil(moveCount / 2).toString().padStart(2, '0')}</span>
             </div>
          </div>

          <button
            onClick={resetGame}
            className="group relative w-full overflow-hidden bg-amber-500 py-4 rounded-sm transition-all duration-300 hover:bg-amber-600 active:scale-95"
          >
            <span className="relative text-xs font-black tracking-[0.3em] text-stone-950 font-cinzel">
              NOVA OPERAÇÃO
            </span>
          </button>

          <div className="mt-8 flex justify-center gap-1">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-1 h-1 bg-stone-800 rounded-full" />
             ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
