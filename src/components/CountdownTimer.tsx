import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  seconds: number;
  totalSeconds: number;
  label?: string;
}

export function CountdownTimer({ seconds, totalSeconds, label }: CountdownTimerProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (seconds / totalSeconds) * circumference;
  
  const formatTime = (timeInSeconds: number) => {
    const secs = timeInSeconds % 60;
    return secs.toString().padStart(2, '0');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-100"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-linear"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>

        {/* Text inside */}
        <div className="flex flex-col items-center justify-center absolute inset-0">
          <span className="text-2xl font-light text-gray-900 tracking-tight">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
