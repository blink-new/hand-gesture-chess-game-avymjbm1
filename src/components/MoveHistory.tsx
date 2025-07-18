import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface MoveHistoryProps {
  moves: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  // Group moves into pairs (white, black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || ''
    });
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Move History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          {movePairs.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No moves yet
            </div>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair) => (
                <div 
                  key={pair.moveNumber}
                  className="grid grid-cols-3 gap-2 text-sm py-1 hover:bg-accent/20 rounded px-2"
                >
                  <span className="text-muted-foreground font-mono">
                    {pair.moveNumber}.
                  </span>
                  <span className="font-mono text-white">
                    {pair.white}
                  </span>
                  <span className="font-mono text-gray-400">
                    {pair.black}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};