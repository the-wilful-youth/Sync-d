
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_SETTINGS = {
  easy: { rows: 3, cols: 4, pairs: 6, description: 'Perfect for beginners' },
  medium: { rows: 4, cols: 4, pairs: 8, description: 'Balanced challenge' },
  hard: { rows: 4, cols: 6, pairs: 12, description: 'For memory masters' }
};

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (playerName.trim()) {
      navigate(`/game?name=${encodeURIComponent(playerName.trim())}&difficulty=${selectedDifficulty}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleStartGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 bg-white/95 backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Sync'd
          </h1>
          <p className="text-xl text-gray-600">
            Match cards, sync your memory!
          </p>
        </div>

        {/* Player Name Input */}
        <div className="mb-8">
          <Label htmlFor="playerName" className="text-lg font-semibold mb-3 block">
            Enter Your Name
          </Label>
          <Input
            id="playerName"
            type="text"
            placeholder="Your name here..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-lg py-3 px-4"
            maxLength={20}
          />
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <Label className="text-lg font-semibold mb-4 block">
            Choose Difficulty
          </Label>
          <div className="grid gap-4">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
              <Card
                key={level}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  selectedDifficulty === level 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedDifficulty(level)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        className={`capitalize ${
                          level === 'easy' ? 'bg-green-500' :
                          level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      >
                        {level}
                      </Badge>
                      <span className="font-semibold text-lg">
                        {DIFFICULTY_SETTINGS[level].rows}×{DIFFICULTY_SETTINGS[level].cols} Grid
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {DIFFICULTY_SETTINGS[level].description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Target className="w-4 h-4" />
                    <span>{DIFFICULTY_SETTINGS[level].pairs} pairs</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Game Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Score Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span>Timer</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Best Score</span>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <Button
            onClick={handleStartGame}
            disabled={!playerName.trim()}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 text-lg"
          >
            Start Game
          </Button>
          {!playerName.trim() && (
            <p className="text-sm text-gray-500 mt-2">
              Please enter your name to start
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Home;
