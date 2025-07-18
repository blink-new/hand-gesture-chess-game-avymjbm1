import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { GestureState } from '../types/chess';

export const useGestureDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gestureState, setGestureState] = useState<GestureState>({
    isPinching: false,
    confidence: 0,
    handDetected: false
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: Results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Calculate pinch gesture (thumb tip to index finger tip distance)
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        
        const distance = Math.sqrt(
          Math.pow(thumbTip.x - indexTip.x, 2) + 
          Math.pow(thumbTip.y - indexTip.y, 2)
        );

        const isPinching = distance < 0.05; // Threshold for pinch detection
        const confidence = Math.max(0, 1 - (distance / 0.1));

        setGestureState({
          isPinching,
          confidence,
          handDetected: true
        });

        // Draw hand landmarks
        ctx.fillStyle = isPinching ? '#10B981' : '#3B82F6';
        landmarks.forEach((landmark) => {
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            5,
            0,
            2 * Math.PI
          );
          ctx.fill();
        });

        // Draw connections between landmarks
        ctx.strokeStyle = isPinching ? '#10B981' : '#3B82F6';
        ctx.lineWidth = 2;
        
        // Draw thumb to index connection for pinch visualization
        ctx.beginPath();
        ctx.moveTo(thumbTip.x * canvas.width, thumbTip.y * canvas.height);
        ctx.lineTo(indexTip.x * canvas.width, indexTip.y * canvas.height);
        ctx.stroke();
      } else {
        setGestureState({
          isPinching: false,
          confidence: 0,
          handDetected: false
        });
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 320,
      height: 240
    });

    camera.start().then(() => {
      setIsInitialized(true);
    }).catch((error) => {
      console.error('Camera initialization failed:', error);
    });

    return () => {
      camera.stop();
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    gestureState,
    isInitialized
  };
};