import React from 'react';
import { motion } from 'framer-motion';

interface BluePanelLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: string; // Default: '40%'
}

export function BluePanelLayout({ leftContent, rightContent, leftWidth = "38%" }: BluePanelLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <div 
        className="h-full flex flex-col justify-center relative z-10 bg-white shadow-[10px_0_30px_-15px_rgba(0,0,0,0.1)]"
        style={{ width: leftWidth }}
      >
        <div className="p-12 w-full max-w-2xl mx-auto h-full flex flex-col justify-center">
          {leftContent}
        </div>
      </div>
      
      <div className="flex-1 h-full bg-primary relative overflow-hidden flex flex-col items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full border-[100px] border-white/5 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full border-[60px] border-white/5 translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pattern-dots pointer-events-none" />
        
        {/* Right content container */}
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center">
          {rightContent}
        </div>
      </div>
    </div>
  );
}
