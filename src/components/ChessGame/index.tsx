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
