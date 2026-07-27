import React from 'react';

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
              className={`flex items-start gap-3 p-3  transition-all duration-300 ${
                isActive 
                  ? ' border-l-4 border-orange-300 ' 
                  : isPast 
                    ? 'border-l-4 border-emerald-300 opacity-60 hover:opacity-100 bg-gray-50/50' 
                    : 'border-l-4 border-transparent hover:bg-gray-50'
              }`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 font-medium text-[10px] ${
                isActive 
                  ? 'bg-yellow-300 text-yellow-800' 
                  : isPast 
                    ? 'bg-emerald-300 text-emerald-800' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {idx + 1}
              </div>
              
              <div className="flex-1 min-w-0 pt-0.5">
                <div className={`font-normal text-xs leading-snug mb-1 ${
                  isActive ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  Question {idx + 1}
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
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
