import React, { useState, useEffect, useCallback } from "react";

const ROUNDS = [
  { level: 1, players: 100, advance: 80, time: 60 },
  { level: 2, players: 80, advance: 50, time: 60 },
  { level: 3, players: 50, advance: 10, time: 60 },
  { level: 4, players: 10, advance: 1, time: 60 },
];

export default function SpamRoyale() {
  const [gameState, setGameState] = useState("lobby"); // lobby, playing, round_end, game_over, won
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [bots, setBots] = useState([]);

  const currentRound = ROUNDS[currentRoundIndex];

  // Initialize bots for the lobby
  useEffect(() => {
    if (gameState === "lobby") {
      const initialBots = Array.from(
        { length: currentRound.players - 1 },
        (_, i) => ({
          id: `bot-${i}`,
          name: `Player ${Math.floor(Math.random() * 9000) + 1000}`,
          score: 0,
        }),
      );
      setBots(initialBots);
    }
  }, [gameState, currentRound.players]);

  // Handle Button Spamming
  const handleSpam = useCallback(() => {
    if (gameState === "playing") {
      setPlayerScore((prev) => prev + 1);
    }
  }, [gameState]);

  // Keyboard listener for 'A'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "a") {
        handleSpam();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSpam]);

  // Game Loop (Timer & Bot Simulation)
  useEffect(() => {
    let timerInterval;
    let botInterval;

    if (gameState === "playing") {
      // 1-second countdown
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleRoundEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Bot spam simulation (updates every 200ms)
      botInterval = setInterval(() => {
        setBots((currentBots) =>
          currentBots.map((bot) => ({
            ...bot,
            // Bots click roughly 3-8 times a second
            score: bot.score + (Math.random() > 0.3 ? 1 : 0),
          })),
        );
      }, 200);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(botInterval);
    };
  }, [gameState]);

  const startGame = () => {
    setPlayerScore(0);
    setTimeLeft(currentRound.time);
    setGameState("playing");
  };

  const handleRoundEnd = () => {
    setGameState("round_end");
  };

  const nextRound = () => {
    const allPlayers = [...bots, { id: "me", name: "You", score: playerScore }];
    allPlayers.sort((a, b) => b.score - a.score);

    const myRank = allPlayers.findIndex((p) => p.id === "me") + 1;
    const qualified = myRank <= currentRound.advance;

    if (!qualified) {
      setGameState("game_over");
      return;
    }

    if (currentRoundIndex === ROUNDS.length - 1) {
      setGameState("won");
      return;
    }

    // Filter bots for next round, keeping top performers
    const survivingBots = allPlayers
      .filter((p) => p.id !== "me")
      .slice(0, currentRound.advance - 1)
      .map((bot) => ({ ...bot, score: 0 })); // Reset scores for next round

    setBots(survivingBots);
    setPlayerScore(0);
    setCurrentRoundIndex((prev) => prev + 1);
    setTimeLeft(ROUNDS[currentRoundIndex + 1].time);
    setGameState("playing");
  };

  // Compute Leaderboard
  const leaderboard = [
    ...bots,
    { id: "me", name: "You", score: playerScore },
  ].sort((a, b) => b.score - a.score);
  const myRank = leaderboard.findIndex((p) => p.id === "me") + 1;
  const isSafe = myRank <= currentRound.advance;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center font-sans selection:bg-white selection:text-black">
      <div className="max-w-2xl w-full p-8 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-neutral-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SPAM ROYALE</h1>
            <p className="text-neutral-400 text-sm mt-1">
              Round {currentRound.level} • Top {currentRound.advance} Advance
            </p>
          </div>
          {gameState === "playing" && (
            <div className="text-right">
              <div className="text-4xl font-mono font-bold text-white">
                {timeLeft}s
              </div>
              <div
                className={`text-sm font-semibold mt-1 ${isSafe ? "text-green-400" : "text-red-400"}`}
              >
                Rank: {myRank} / {currentRound.players}
              </div>
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Actions */}
          <div className="flex flex-col items-center justify-center space-y-6 bg-neutral-950 p-8 rounded-2xl border border-neutral-800">
            {gameState === "lobby" && (
              <>
                <div className="text-center">
                  <p className="text-neutral-400 mb-6">
                    100 players connected. Prepare your thumbs.
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-transform active:scale-95"
                  >
                    Start Match
                  </button>
                </div>
              </>
            )}

            {gameState === "playing" && (
              <>
                <div className="text-6xl font-mono font-bold tracking-tighter">
                  {playerScore}
                </div>
                <button
                  onClick={handleSpam}
                  className="w-32 h-32 rounded-full bg-neutral-800 border-4 border-neutral-700 shadow-xl flex items-center justify-center text-4xl font-black text-neutral-300 hover:border-white hover:text-white active:bg-white active:text-black active:scale-90 transition-all select-none"
                >
                  A
                </button>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">
                  Press 'A' or Tap
                </p>
              </>
            )}

            {gameState === "round_end" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Round Over</h2>
                <p
                  className={`mb-6 ${isSafe ? "text-green-400" : "text-red-400"}`}
                >
                  You finished Rank {myRank}
                </p>
                <button
                  onClick={nextRound}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-transform active:scale-95"
                >
                  {isSafe ? "Continue to Next Round" : "View Results"}
                </button>
              </div>
            )}

            {gameState === "game_over" && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-2">
                  ELIMINATED
                </h2>
                <p className="text-neutral-400 mb-6">
                  You didn't make the cut.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 border border-neutral-700 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}

            {gameState === "won" && (
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-400 mb-2">
                  VICTORY
                </h2>
                <p className="text-neutral-400 mb-6">
                  You are the ultimate spammer.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-transform active:scale-95"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Leaderboard */}
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col h-96">
            <div className="bg-neutral-900 px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
              Live Leaderboard
            </div>
            <div className="overflow-y-auto p-2 flex-1 space-y-1">
              {leaderboard.map((player, index) => (
                <React.Fragment key={player.id}>
                  {/* Cutoff Line */}
                  {index === currentRound.advance && (
                    <div className="w-full flex items-center gap-2 py-2">
                      <div className="h-px bg-red-900/50 flex-1"></div>
                      <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
                        Elimination Zone
                      </span>
                      <div className="h-px bg-red-900/50 flex-1"></div>
                    </div>
                  )}
                  <div
                    className={`flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      player.id === "me"
                        ? "bg-white text-black font-bold"
                        : "text-neutral-400 hover:bg-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 text-center font-mono ${player.id === "me" ? "text-black" : "text-neutral-600"}`}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate w-24">{player.name}</span>
                    </div>
                    <span className="font-mono font-medium">
                      {player.score}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
