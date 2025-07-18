import React from 'react';
import { useGestureDetection } from '../hooks/useGestureDetection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface GestureCameraProps {
  onGestureChange?: (isPinching: boolean, confidence: number) => void;
}

export const GestureCamera: React.FC<GestureCameraProps> = ({ onGestureChange }) => {
  const { videoRef, canvasRef, gestureState, isInitialized } = useGestureDetection();

  React.useEffect(() => {
    if (onGestureChange) {
      onGestureChange(gestureState.isPinching, gestureState.confidence);
    }
  }, [gestureState.isPinching, gestureState.confidence, onGestureChange]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          Camera
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video feed */}
        <div className="relative rounded-lg overflow-hidden bg-black/20">
          <video
            ref={videoRef}
            className="w-full h-32 object-cover"
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            width={320}
            height={240}
          />
          
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-sm">Initializing camera...</div>
            </div>
          )}
        </div>

        {/* Gesture status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hand Detected:</span>
            <div className={`gesture-indicator ${gestureState.handDetected ? 'open' : 'none'}`}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pinch Gesture:</span>
            <div className={`gesture-indicator ${gestureState.isPinching ? 'pinch' : 'open'}`}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <span className="text-sm font-mono">
              {(gestureState.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Show your hand to the camera</p>
          <p>• Pinch thumb and index finger to grab pieces</p>
          <p>• Release to drop pieces</p>
        </div>
      </CardContent>
    </Card>
  );
};