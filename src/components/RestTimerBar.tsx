import React from 'react';
import { Minus, Pause, Play, Plus, X } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { formatTimer } from '../utils/fitness';

export const RestTimerBar: React.FC = () => {
  const { restTimer, pauseRestTimer, stopRestTimer, adjustRestTimer } = useWorkout();

  if (!restTimer.active && restTimer.timeLeft <= 0) {
    return null;
  }

  const progressPercent = restTimer.totalTime > 0
    ? Math.max(0, Math.min(100, ((restTimer.totalTime - restTimer.timeLeft) / restTimer.totalTime) * 100))
    : 0;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-40 bg-neutral-900 border border-blue-500/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Progress Bar Top hairline */}
      <div className="w-full bg-neutral-800 h-1">
        <div
          className="bg-blue-500 h-full transition-all duration-1000 ease-linear shadow-[0_0_8px_#3b82f6]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <span className="font-mono font-bold text-blue-400 text-sm">
              {formatTimer(restTimer.timeLeft)}
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200">Rest Timer</div>
            <div className="text-[11px] text-neutral-400 truncate max-w-[140px]">
              {restTimer.exerciseName || 'Next Set'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => adjustRestTimer(-15)}
            className="p-1.5 text-xs text-neutral-400 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            title="-15s"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => adjustRestTimer(15)}
            className="p-1.5 text-xs text-neutral-400 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            title="+15s"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={pauseRestTimer}
            className="p-1.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            title={restTimer.active ? 'Pause' : 'Resume'}
          >
            {restTimer.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={stopRestTimer}
            className="p-1.5 text-xs text-neutral-400 hover:text-red-400 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            title="Skip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
