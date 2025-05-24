import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Trophy,
  Clock,
  Target,
  Home,
  PartyPopper,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

type GameCard = {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Difficulty = "easy" | "medium" | "hard";

const SYMBOLS = [
  "🌟",
  "🎯",
  "🎨",
  "🎪",
  "🎭",
  "🚀",
  "🌈",
  "⭐",
  "🎮",
  "🎲",
  "🎺",
  "🎸",
  "🎹",
  "🎤",
  "🎧",
  "🎬",
  "🎨",
  "🎪", // Remove these duplicates
];

const DIFFICULTY_SETTINGS = {
  easy: { rows: 3, cols: 4, pairs: 6 },
  medium: { rows: 4, cols: 4, pairs: 8 },
  hard: { rows: 4, cols: 6, pairs: 12 },
};

// Fisher-Yates shuffle for better randomness
function shuffleArray(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get("name") || "Player";
  const urlDifficulty =
    (searchParams.get("difficulty") as Difficulty) || "medium";

  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(urlDifficulty);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    const { pairs } = DIFFICULTY_SETTINGS[difficulty];
    // Get unique symbols first
    const uniqueSymbols = [...new Set(SYMBOLS)].slice(0, pairs);
    // Create pairs by duplicating each symbol
    const cardPairs = uniqueSymbols.flatMap((symbol) => [symbol, symbol]);

    // Use Fisher-Yates shuffle for better randomness
    const shuffledCards = shuffleArray(cardPairs).map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setAttempts(0);
    setGameTime(0);
    setIsGameActive(false);
    setIsGameComplete(false);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !isGameComplete) {
      interval = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, isGameComplete]);

  // Initialize game on difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle card flip
  const handleCardFlip = (cardIdx: number) => {
    if (!isGameActive) setIsGameActive(true);

    const card = cards[cardIdx];
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardIdx];
    setFlippedCards(newFlippedCards);

    setCards((prev) => {
      const updatedCards = prev.map((c, idx) =>
        idx === cardIdx ? { ...c, isFlipped: true } : c
      );

      if (newFlippedCards.length === 2) {
        setAttempts((prevAttempts) => prevAttempts + 1);
        const [firstIdx, secondIdx] = newFlippedCards;
        const firstCard = updatedCards[firstIdx];
        const secondCard = updatedCards[secondIdx];
        if (firstCard.symbol === secondCard.symbol) {
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((c, idx) =>
                idx === firstIdx || idx === secondIdx
                  ? { ...c, isMatched: true }
                  : c
              )
            );
            setMatchedPairs((prev) => prev + 1);
            setFlippedCards([]);
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((c, idx) =>
                idx === firstIdx || idx === secondIdx
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedCards([]);
          }, 1000);
        }
      }
      return updatedCards;
    });
  };

  // Check for game completion with confetti
  useEffect(() => {
    const { pairs } = DIFFICULTY_SETTINGS[difficulty];
    if (matchedPairs === pairs && isGameActive) {
      setIsGameComplete(true);
      setIsGameActive(false);
      setShowConfetti(true);

      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);

      // Update best score
      if (!bestScore || attempts < bestScore) {
        setBestScore(attempts);
      }
    }
  }, [matchedPairs, difficulty, isGameActive, attempts, bestScore]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const { rows, cols } = DIFFICULTY_SETTINGS[difficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                fontSize: `${1 + Math.random()}rem`,
              }}
            >
              {["🎉", "🎊", "✨", "🌟", "🎈"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Sync'd
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          <p className="text-lg text-white/90 drop-shadow">
            Good luck, {playerName}! 🎮
          </p>
        </div>

        {/* Game Stats */}
        <Card className="mb-6 p-6 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Attempts: {attempts}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-semibold">
                Time: {formatTime(gameTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold">
                Best: {bestScore ? `${bestScore} attempts` : "None"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                Pairs: {matchedPairs}/{DIFFICULTY_SETTINGS[difficulty].pairs}
              </span>
            </div>
          </div>
        </Card>

        {/* Difficulty Selection */}
        <Card className="mb-6 p-4 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="font-semibold mr-4 self-center">Difficulty:</span>
            {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
              <Badge
                key={level}
                variant={difficulty === level ? "default" : "outline"}
                className={`cursor-pointer capitalize px-4 py-2 ${
                  difficulty === level
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setDifficulty(level)}
              >
                {level} ({DIFFICULTY_SETTINGS[level].rows}×
                {DIFFICULTY_SETTINGS[level].cols})
              </Badge>
            ))}
          </div>
        </Card>

        {/* Game Board */}
        <Card className="mb-6 p-6 bg-white/95 backdrop-blur">
          <div
            className="grid gap-3 mx-auto max-w-2xl"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}
          >
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`
                  relative w-16 h-16 sm:w-20 sm:h-20 cursor-pointer transform transition-all duration-300
                  ${
                    card.isFlipped || card.isMatched
                      ? "scale-105"
                      : "hover:scale-110"
                  }
                  ${card.isMatched ? "opacity-75" : ""}
                `}
                onClick={() => handleCardFlip(idx)}
                style={{ perspective: "1000px" }}
              >
                <div
                  className={`
                    absolute inset-0 w-full h-full transition-transform duration-500
                    ${
                      card.isFlipped || card.isMatched
                        ? "[transform:rotateY(180deg)]"
                        : ""
                    }
                  `}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Back */}
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="text-2xl">🎮</div>
                  </div>

                  {/* Card Front */}
                  <div
                    className={`
                      absolute inset-0 w-full h-full rounded-lg shadow-lg flex items-center justify-center
                      ${
                        card.isMatched
                          ? "bg-gradient-to-br from-green-400 to-green-600"
                          : "bg-gradient-to-br from-yellow-400 to-orange-500"
                      }
                    `}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="text-2xl sm:text-3xl">{card.symbol}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Game Complete Message */}
        {isGameComplete && (
          <Card className="mb-6 p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PartyPopper className="w-8 h-8" />
              <h2 className="text-3xl font-bold">
                Congratulations, {playerName}!
              </h2>
              <PartyPopper className="w-8 h-8" />
            </div>
            <p className="text-lg mb-4">
              You completed the game in {attempts} attempts and{" "}
              {formatTime(gameTime)}!
            </p>
            {bestScore === attempts && (
              <Badge className="bg-yellow-500 text-black font-bold">
                New Best Score! 🏆
              </Badge>
            )}
          </Card>
        )}

        {/* Controls */}
        <div className="text-center">
          <Button
            onClick={initializeGame}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </Button>
        </div>
      </div>

      <style jsx>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Index;
