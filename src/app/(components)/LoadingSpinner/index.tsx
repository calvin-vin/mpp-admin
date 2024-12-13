import React, { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
  disableScroll?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = true,
  message = "Sedang memuat...",
  className = "",
  disableScroll = true,
}) => {
  useEffect(() => {
    // Mencegah scroll pada body jika full screen
    if (fullScreen && disableScroll) {
      const originalStyle = window.getComputedStyle(document.body).overflow;

      document.body.style.setProperty("overflow", "hidden", "important");

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [fullScreen, disableScroll]);

  const containerClasses = `
    ${fullScreen ? "fixed inset-0 z-[9999] bg-white/70 overflow-hidden" : ""} 
    flex justify-center items-center 
    ${className}
  `.trim();

  return (
    <div className={containerClasses} role="status" aria-label={message}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"
            aria-hidden="true"
          ></div>
          <div
            className="absolute top-0 left-0 rounded-full h-16 w-16 border-t-4 border-blue-200 animate-ping"
            aria-hidden="true"
          ></div>
        </div>
        <p className="mt-4 text-gray-600 text-center" aria-live="polite">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
