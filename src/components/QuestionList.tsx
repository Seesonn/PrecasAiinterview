import React from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

interface QuestionListProps {
  questions: string[];
  currentIndex: number;
  getRecordingTime?: (index: number) => number;
}

export function QuestionList({ questions, currentIndex, getRecordingTime }: QuestionListProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Questions</h2>
      
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-1.5 pb-12">
        {questions.map((q, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;
          
          return (
            <div 
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 border-l-4 ${
                isActive 
                  ? 'bg-blue-50 border-primary shadow-sm' 
                  : isPast 
                    ? 'border-emerald-500 opacity-60 hover:opacity-100 bg-gray-50/50' 
                    : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-semibold text-[11px] ${
                isActive 
                  ? 'bg-primary text-white' 
                  : isPast 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {idx + 1}
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <div className={`font-medium text-xs leading-snug mb-1 ${
                  isActive ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  Question {idx + 1}
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  <Video className="w-3 h-3" />
                  <span>Video Response &bull; {getRecordingTime ? getRecordingTime(idx) : 45} Seconds &bull; 1 Take</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
