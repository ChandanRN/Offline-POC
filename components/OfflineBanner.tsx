"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status
    setIsOnline(window.navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="bg-green-100 text-green-800 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border-b border-green-200">
        <Wifi size={16} />
        <span>You are currently online. All changes will be synced immediately.</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-100 text-amber-800 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border-b border-amber-200 animate-pulse">
      <WifiOff size={16} />
      <span>You are currently offline. Changes will be saved locally and synced when you reconnect.</span>
    </div>
  );
}
