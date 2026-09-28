import React from 'react';
import { Award, CheckCircle2, Clock, Dumbbell, Flame, X } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { formatDuration } from '../utils/fitness';

export const FinishWorkoutModal: React.FC = () => {
  const { finishedWorkoutSummary, dismissFinishedWorkout, profile } = useWorkout();

  if (!finishedWorkoutSummary) return null;

  const totalSets = finishedWorkoutSummary.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <button
          type="button"
          onClick={dismissFinishedWorkout}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-neutral-100">Workout Completed!</h2>
          <p className="text-sm text-neutral-400 mt-1">{finishedWorkoutSummary.title}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 bg-neutral-800/60 border border-neutral-800 rounded-xl text-center">
            <Clock className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
            <div className="text-[11px] text-neutral-400">Duration</div>
            <div className="text-sm font-bold font-mono text-neutral-100">
              {formatDuration(finishedWorkoutSummary.durationSeconds)}
            </div>
          </div>
          <div className="p-3 bg-neutral-800/60 border border-neutral-800 rounded-xl text-center">
            <Dumbbell className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-[11px] text-neutral-400">Total Volume</div>
            <div className="text-sm font-bold font-mono text-blue-400">
              {finishedWorkoutSummary.totalVolume.toLocaleString()}{' '}
              <span className="text-[10px] font-normal text-neutral-400">
                {profile.unit === 'metric' ? 'kg' : 'lbs'}
              </span>
            </div>
          </div>
          <div className="p-3 bg-neutral-800/60 border border-neutral-800 rounded-xl text-center">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-[11px] text-neutral-400">Sets Done</div>
            <div className="text-sm font-bold font-mono text-neutral-100">{totalSets}</div>
          </div>
        </div>

        {/* Personal Records Highlight */}
        {finishedWorkoutSummary.prsAchieved && finishedWorkoutSummary.prsAchieved.length > 0 && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
              <Award className="w-4 h-4" />
              <span>Personal Records Smashed ({finishedWorkoutSummary.prsAchieved.length})</span>
            </div>
            <ul className="space-y-1">
              {finishedWorkoutSummary.prsAchieved.map((pr, idx) => (
                <li key={idx} className="text-xs text-neutral-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{pr}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exercise breakdown list */}
        <div className="mb-6 max-h-48 overflow-y-auto pr-1 space-y-2">
          {finishedWorkoutSummary.exercises.map((item) => {
            const completedSets = item.sets.filter((s) => s.completed);
            if (completedSets.length === 0) return null;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs py-1.5 px-3 bg-neutral-800/40 rounded-lg"
              >
                <span className="font-medium text-neutral-200 truncate">{item.exerciseName}</span>
                <span className="text-neutral-400 font-mono shrink-0 ml-2">
                  {completedSets.length} sets ·{' '}
                  {Math.round(
                    completedSets.reduce((acc, s) => acc + s.weight * s.reps, 0)
                  ).toLocaleString()}{' '}
                  {profile.unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={dismissFinishedWorkout}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-blue-950/40"
        >
          Save & Return to Dashboard
        </button>
      </div>
    </div>
  );
};
