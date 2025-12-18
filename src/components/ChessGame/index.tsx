import { Header } from "../Header/Header";
import { Chessboard } from "../Chessboard/Chessboard";
import { MoveHistory } from "../MoveHistory/MoveHistory";
import { GameOverModal } from "../GameOverModal/GameOverModal";
import { ChessboardContextProvider } from "@/context/ChessboardContext/provider";
import { GameContextProvider } from "@/context/GameContext/provider";

export default function ChessGame() {
  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-stone-950">
          <Header />
          <div className="flex-1 flex flex-row overflow-hidden relative">
            <div className="flex-1 relative overflow-hidden">
               <Chessboard />
            </div>
            <div className="w-80 h-full border-l-2 border-amber-900/30 bg-stone-900/50 backdrop-blur-sm z-20">
               <MoveHistory />
            </div>
          </div>
          <GameOverModal />
        </div>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
