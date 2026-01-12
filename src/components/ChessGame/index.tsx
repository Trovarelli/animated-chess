import React, { useState } from "react";
import { Header } from "../Header/Header";
import { Chessboard } from "../Chessboard/Chessboard";
import { MoveHistory } from "../MoveHistory/MoveHistory";
import { GameOverModal } from "../GameOverModal/GameOverModal";
import { SplashScreen } from "../SplashScreen/SplashScreen";
import { ChessboardContextProvider } from "@/context/ChessboardContext/provider";
import { GameContextProvider } from "@/context/GameContext/provider";
import { AnimatePresence } from "framer-motion";

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
          
          <div className="w-screen h-screen flex flex-col overflow-hidden bg-stone-950">
            <Header />
            <div className="flex-1 flex flex-row overflow-hidden relative">
              <div className="flex-1 relative overflow-hidden">
                 <Chessboard />
              </div>
              <div className="w-80 h-full border-l border-amber-900/20 bg-stone-900/50 backdrop-blur-sm z-20">
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
