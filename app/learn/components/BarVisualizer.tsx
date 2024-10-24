// src/components/BarVisualizer.tsx
import React, { useEffect, useState, useRef } from "react";
import { LocalAudioTrack } from "livekit-client";

interface BarVisualizerProps {
  audioTrack: LocalAudioTrack | null;
}

export const BarVisualizer = ({ audioTrack }: BarVisualizerProps) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const bars = 20;

  useEffect(() => {
    if (!audioTrack) return;

    const mediaStreamTrack = audioTrack.mediaStreamTrack;


    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const mediaStream = new MediaStream([mediaStreamTrack]);
    const source = audioContext.createMediaStreamSource(mediaStream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const normalizedLevel = average / 255; // Normalize to 0-1

        setAudioLevel(normalizedLevel);
      }
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [audioTrack]);

  return (
    <div className="flex items-end gap-0.5 h-16 bg-muted p-2 rounded-md">
      {Array.from({ length: bars }).map((_, i) => {
        // Calculate height based on position and audio level
        const barHeight = Math.max(
          2,
          ((i + 1) / bars) * audioLevel * 64 // 64px is max height
        );

        // Calculate color intensity based on height
        const intensity = Math.min(255, Math.floor((barHeight / 64) * 255));

        return (
          <div
            key={i}
            className="w-1.5 bg-primary"
            style={{
              height: `${barHeight}px`,
              opacity: intensity / 255,
              transition: "all 0.05s ease-in-out",
            }}
          />
        );
      })}
    </div>
  );
};
