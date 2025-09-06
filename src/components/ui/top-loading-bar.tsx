import { useEffect, useState } from "react";

interface TopLoadingBarProps {
  isLoading: boolean;
  duration?: number;
}

export function TopLoadingBar({ isLoading, duration = 1000 }: TopLoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      setIsVisible(true);
      setProgress(0);

      const startTime = Date.now();

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressRatio = elapsed / duration;

        const newProgress = Math.min(95, progressRatio * 100 * (2 - progressRatio));
        setProgress(newProgress);

        if (newProgress >= 95) {
          clearInterval(interval);
        }
      }, 16); // ~60fps
    } else {
      setProgress(100);

      timeout = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-0.5">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-sm transition-all ease-out"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? "width 0.2s ease-out" : "none",
          boxShadow: "0 0 10px rgba(147, 51, 234, 0.4)",
        }}
      />
    </div>
  );
}
