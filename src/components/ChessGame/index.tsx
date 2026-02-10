import React, { useState } from "react";
import { Header } from "../Header/Header";
import { Chessboard } from "../Chessboard/Chessboard";
import { MoveHistory } from "../MoveHistory/MoveHistory";
import { GameOverModal } from "../GameOverModal/GameOverModal";
import { SplashScreen } from "../SplashScreen/SplashScreen";
import { ChessboardContextProvider } from "@/context/ChessboardContext/provider";
import { GameContextProvider } from "@/context/GameContext/provider";
import { AnimatePresence } from "framer-motion";
import { PlayerPanel } from "../PlayerPanel/PlayerPanel";

export default function ChessGame() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <>
          <AnimatePresence>
            {showSplash && (
              <SplashScreen onStart={() => setShowSplash(false)} />
            )}
          </AnimatePresence>
          
          <div className="w-screen h-screen grid grid-cols-[300px_1fr_300px] overflow-hidden bg-stone-950 font-sans text-stone-300" data-testid="game-container">
            {/* LEFT COLUMN: Player 1 (White - Standard) */}
            <div className="h-full border-r border-zinc-800 bg-zinc-900/40 relative z-30">
               <PlayerPanel playerColor="white" />
            </div>

            {/* MIDDLE COLUMN: Board Area */}
            <div className="h-full relative flex flex-col bg-[#0c0a09] overflow-hidden min-w-0" data-testid="chessboard-container">
               {/* Compact Top Bar */}
               <Header />
               
               {/* Board container - fixed to center, slightly up to account for header */}
               <div className="flex-1">
                  <div className="fixed left-1/2 top-1/2 -translate-x-1/2" style={{ transform: 'translate(-50%, -45%)' }}>
                     <Chessboard />
                  </div>
               </div>
            </div>
            
            {/* RIGHT COLUMN: Player 2 (Black) + Log */}
            <div className="h-full border-l border-zinc-800 bg-zinc-900/40 relative z-30 flex flex-col">
               <div className="shrink-0 h-[40%] border-b border-zinc-800">
                  <PlayerPanel playerColor="black" />
               </div>
               <div className="flex-1 overflow-hidden bg-zinc-950 relative">
                  <MoveHistory />
               </div>
            </div>
            
            <GameOverModal />
          </div>
        </>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
