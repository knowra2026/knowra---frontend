import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

export const LoadingScreen = ({ isLoading }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Fade out after a short delay when loading completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse animation */}
        <div className="animate-bounce">
          <img
            src={logo}
            alt="Knowra Loading"
            className="h-24 w-24 object-contain drop-shadow-lg"
            draggable={false}
          />
        </div>

        {/* Loading spinner */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="h-3 w-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="h-3 w-3 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-sm font-medium text-sky-600">Loading Knowra...</p>
        </div>
      </div>
    </div>
  );
};
