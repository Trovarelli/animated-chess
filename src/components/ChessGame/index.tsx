import { Header } from "@/components"; // Trying one by one
import { ChessboardContextProvider } from "@/context";
import { GameContextProvider } from "@/context/GameContext";

export default function ChessGame() {
  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-blue-500">
          <Header />
          <div className="p-10 text-white text-4xl">
            Header Loaded. If you see this, Header is OK.
          </div>
          {/* <div className="flex-1 relative">
            <Chessboard />
            <MoveHistory />
          </div>
          <GameOverModal /> */}
        </div>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
