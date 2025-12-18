// import { Chessboard, Header, MoveHistory, GameOverModal } from "@/components";
import { ChessboardContextProvider } from "@/context";
import { GameContextProvider } from "@/context/GameContext";

export default function ChessGame() {
  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-blue-500">
          <div className="p-10 text-white text-4xl">
            Contexts Loaded. If you see this Blue screen, the problem is in the components (Chessboard, Header, etc).
          </div>
          {/* <Header />
          <div className="flex-1 relative">
            <Chessboard />
            <MoveHistory />
          </div>
          <GameOverModal /> */}
        </div>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
