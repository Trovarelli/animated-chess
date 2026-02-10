"use client";
import React, { useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChessboardContext } from "@/context/ChessboardContext/context";
import { GameContext } from "@/context/GameContext/context";
import { ChessPiece } from "../ChessPiece/ChessPiece";
import { getFactionLabel } from "@/utils/getFactionLabel";

interface PlayerPanelProps {
  playerColor: "white" | "black";
  className?: string;
}

export const PlayerPanel = ({ playerColor, className = "" }: PlayerPanelProps) => {
  const { piecesInfo } = useContext(ChessboardContext);
  const { turn, playerFaction } = useContext(GameContext);
  const isTurn = turn === playerColor;
  const factionLabel = getFactionLabel(playerColor, playerFaction);

  const capturedPieces = useMemo(() => {
    const enemyColor = playerColor === "white" ? "black" : "white";
    return piecesInfo.filter((p) => !p.alive && p.color === enemyColor);
  }, [piecesInfo, playerColor]);

  const score = useMemo(() => {
    const values: Record<string, number> = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 0,
    };
    return capturedPieces.reduce((acc, p) => acc + (values[p.type] || 0), 0);
  }, [capturedPieces]);

  const totalSlots = 16;
  const emptySlots = Math.max(0, totalSlots - capturedPieces.length);

  return (
    <div className={`flex flex-col h-full bg-zinc-900/90 border-zinc-800/50 backdrop-blur-md overflow-hidden ${className}`}>
      <div className={`p-6 border-b border-zinc-800 flex flex-col gap-4 relative transition-colors duration-500 ${isTurn ? "bg-zinc-800/80" : ""}`}>
        {isTurn && (
          <motion.div 
            layoutId="active-turn-indicator"
            className="absolute top-0 left-0 w-1 h-full bg-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.6)]" 
          />
        )}
        
        <div className="flex items-center gap-4">
            <motion.div 
                animate={isTurn ? { scale: [1, 1.05, 1], borderColor: "rgba(245, 158, 11, 1)" } : { scale: 1, borderColor: "rgba(63, 63, 70, 1)" }}
                transition={isTurn ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : { duration: 0.3 }}
                className={`w-16 h-16 rounded-full border-2 p-1 relative overflow-hidden bg-zinc-900 shadow-xl`}
            >
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                   {playerColor === "white" ? (
                     <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-400 drop-shadow-md">
                        <path d="M12 2L4 5V11C4 16.55 7.4 21.74 12 23C16.6 21.74 20 16.55 20 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 22V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"/>
                        <path d="M4 11H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"/>
                     </svg>
                   ) : (
                     <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-400 drop-shadow-md">
                        <path d="M6 19L19 6M19 19L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 4C16 4 19 3 21 5C23 7 22 10 22 10L19 13L16 10L14 8L16 4Z" fill="currentColor" className="opacity-80"/>
                        <path d="M8 20C8 20 5 21 3 19C1 17 2 14 2 14L5 11L8 14L10 16L8 20Z" fill="currentColor" className="opacity-80"/>
                     </svg>
                   )}
                </div>
            </motion.div>
            <div className="flex flex-col">
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isTurn ? "text-amber-500" : "text-zinc-500"}`}>
                    {factionLabel.title}
                </span>
                <h2 className={`text-xl font-cinzel font-black transition-colors ${isTurn ? "text-zinc-100" : "text-zinc-600"}`}>
                    {factionLabel.name}
                </h2>
            </div>
        </div>

        {score > 0 && (
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 font-bold tracking-wider">
                    +{score} VANTAGEM MATERIAL
                </span>
            </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
        <h3 className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest mb-4 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
           Cemitério de Peças
        </h3>
        
        <div className="grid grid-cols-4 gap-2 min-h-0">
            <AnimatePresence>
                {capturedPieces.map((piece) => (
                    <motion.div
                        key={piece.id}
                        initial={{ opacity: 0, scale: 1.5, filter: "blur(8px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="aspect-square bg-zinc-950/50 rounded border border-zinc-700/50 flex items-center justify-center p-1 relative group shadow-inner overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors rounded" />
                        <ChessPiece
                            width={32}
                            height={32}
                            type={piece.type}
                            color={piece.color}
                            isDead
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {Array.from({ length: emptySlots }).map((_, i) => (
                <div 
                    key={`empty-${i}`} 
                    className="aspect-square rounded border-2 border-dashed border-zinc-800/50 bg-zinc-900/20 overflow-hidden"
                />
            ))}
        </div>
        
        {capturedPieces.length === 0 && (
           <div className="mt-4 text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Nenhuma baixa</span>
           </div>
        )}
      </div>
    </div>
  );
};
