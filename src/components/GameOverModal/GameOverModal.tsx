"use client";
import { useContext } from "react";
import { GameContext } from "@/context";
import { motion, AnimatePresence } from "framer-motion";

export const GameOverModal = () => {
  const { gameOver, resetGame, moveHistory } = useContext(GameContext);

  if (!gameOver.over) return null;

  const winner = gameOver.winner.color;
  const moveCount = moveHistory.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={resetGame}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-amber-600 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Trophy/Crown Icon */}
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center mb-6"
          >
            <div className="text-8xl mb-2">
              {winner === "white" ? "👑" : "🏆"}
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-center mb-4 text-amber-100">
            Fim de Jogo!
          </h2>

          {/* Winner Declaration */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className={`w-8 h-8 rounded-full border-4 ${
                  winner === "white"
                    ? "bg-white border-yellow-400"
                    : "bg-gray-900 border-yellow-400"
                }`}
              />
              <p className="text-2xl font-bold text-yellow-300">
                {winner === "white" ? "Brancas" : "Pretas"} Venceram!
              </p>
            </div>
            <p className="text-amber-200 text-sm mt-2">
              {gameOver.winner.details}
            </p>
          </div>

          {/* Game Stats */}
          <div className="bg-amber-950/50 rounded-lg p-4 mb-6 border border-amber-700">
            <h3 className="text-amber-300 font-semibold mb-2 text-center">
              Estatísticas da Partida
            </h3>
            <div className="space-y-1 text-amber-100">
              <div className="flex justify-between">
                <span>Total de Movimentos:</span>
                <span className="font-bold">{moveCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Turnos:</span>
                <span className="font-bold">{Math.ceil(moveCount / 2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={resetGame}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              🔄 Jogar Novamente
            </button>
          </div>

          {/* Close hint */}
          <p className="text-center text-amber-400 text-xs mt-4">
            Clique fora para fechar
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
