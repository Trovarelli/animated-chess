"use client";
import { Chessboard, Header, MoveHistory, GameOverModal } from "@/components";
import { ChessboardContextProvider } from "@/context";
import { GameContextProvider } from "@/context/GameContext";

export default function ChessGame() {
  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <div className="w-screen h-screen flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 relative">
            <Chessboard />
            <MoveHistory />
          </div>
          <GameOverModal />
        </div>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
