import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { RotateCcw, Brain, Crown, Zap } from 'lucide-react';

interface GameControlsProps {
  difficulty: 'easy' | 'medium' | 'hard';
  gameStatus: string;
  currentPlayer: 'w' | 'b';
  isAiThinking: boolean;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onResetGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  gameStatus,
  currentPlayer,
  isAiThinking,
  onDifficultyChange,
  onResetGame
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'check': return 'bg-yellow-500';
      case 'checkmate': return 'bg-red-500';
      case 'stalemate': 
      case 'draw': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'easy': return <Zap className="w-4 h-4" />;
      case 'medium': return <Brain className="w-4 h-4" />;
      case 'hard': return <Crown className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge className={`${getStatusColor(gameStatus)} text-white`}>
              {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Turn:</span>
            <Badge variant={currentPlayer === 'w' ? 'default' : 'secondary'}>
              {currentPlayer === 'w' ? 'Your Turn' : 'AI Turn'}
            </Badge>
          </div>
          
          {isAiThinking && (
            <div className="flex items-center gap-2 text-sm text-accent">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              AI is thinking...
            </div>
          )}
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Difficulty:</label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Easy
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-yellow-500" />
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="hard">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-red-500" />
                  Hard
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button 
          onClick={onResetGame}
          variant="outline"
          className="w-full"
          disabled={isAiThinking}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>

        {/* Game Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
          <p>• Use hand gestures to move pieces</p>
          <p>• Pinch to grab, release to drop</p>
          <p>• Valid moves are highlighted</p>
        </div>
      </CardContent>
    </Card>
  );
};