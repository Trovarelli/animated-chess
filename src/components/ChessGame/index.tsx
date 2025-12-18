import { Header } from "../Header/Header";
import { ChessboardContextProvider } from "@/context/ChessboardContext/provider";
import { GameContextProvider } from "@/context/GameContext/provider";

export default function ChessGame() {
  return (
    <GameContextProvider>
      <ChessboardContextProvider>
        <div className="w-screen h-screen flex flex-col overflow-hidden bg-slate-800">
          <Header />
          <div className="p-10 text-white text-2xl">
            If you see the GREEN bar and this BLUE/SLATE screen, Header (minimal) is working.
          </div>
        </div>
      </ChessboardContextProvider>
    </GameContextProvider>
  );
}
