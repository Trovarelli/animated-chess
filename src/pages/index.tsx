import { Chessboard, Header, MoveHistory, GameOverModal } from "@/components";
import { ChessboardContextProvider } from "@/context";
import { GameContextProvider } from "@/context/GameContext";

export default function Home() {
  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <div className="w-screen h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Header />
          <div className="flex-1 flex gap-4 p-4 overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <Chessboard />
            </div>
            <MoveHistory />
          </div>
          <GameOverModal />
        </div>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
