import { useState, useEffect } from "react";

export function usePreloaderReady() {
  const [isReady, setIsReady] = useState(() => !!(window as any).preloaderFinished);

  useEffect(() => {
    if ((window as any).preloaderFinished) {
      setIsReady(true);
      return;
    }
    const handleReady = () => setIsReady(true);
    window.addEventListener("preloaderComplete", handleReady);
    return () => window.removeEventListener("preloaderComplete", handleReady);
  }, []);

  return isReady;
}
