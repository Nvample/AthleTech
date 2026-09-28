import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Dumbbell,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
  Utensils,
  Zap
} from 'lucide-react';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { BodyMap } from '../components/BodyMap';
import { useWorkout } from '../context/WorkoutContext';
import { MuscleGroup, WorkoutSession } from '../types';
import { calculateMuscleFatigue, formatDuration } from '../utils/fitness';

interface DashboardViewProps {
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToTab }) => {
  const {
    workoutHistory,
    routines,
    startWorkout,
    profile,
    personalRecords,
    getDailyNutrition
  } = useWorkout();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  // Today's nutrition
  const todayNutrition = useMemo(() => {
    const todayStr = new Date(2026, 8, 27).toISOString().split('T')[0];
    const log = getDailyNutrition(todayStr);
    const cals = log.meals.reduce((sum, m) => sum + m.calories, 0);
    const protein = log.meals.reduce((sum, m) => sum + m.protein, 0);
    return { cals, protein, water: log.waterIntakeMl };
  }, [getDailyNutrition]);

  // Calculate fatigue from workouts
  const muscleFatigue = useMemo(() => {
    return calculateMuscleFatigue(workoutHistory);
  }, [workoutHistory]);

  // Compute weekly statistics
  const weeklyStats = useMemo(() => {
    const now = new Date(2026, 8, 27); // 2026-09-27
    const oneWeekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

    const recentWorkouts = workoutHistory.filter((w) => {
      if (!w.startTime || !w.isCompleted) return false;
      return new Date(w.startTime).getTime() >= oneWeekAgo;
    });

    const totalVolume = recentWorkouts.reduce((acc, curr) => acc + (curr.totalVolume || 0), 0);
    const totalTimeSec = recentWorkouts.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);

    return {
      count: recentWorkouts.length,
      volume: totalVolume,
      durationSec: totalTimeSec
    };
  }, [workoutHistory]);

  // Find today's suggested routine based on day of week
  const todayDayOfWeek = new Date(2026, 8, 27).getDay(); // Sunday=0, Monday=1, ...
  const suggestedRoutine = routines.find((r) => r.dayOfWeek === todayDayOfWeek) || routines[0];

  const recentSessions = workoutHistory.slice(0, 4);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Welcome & Quick Action Hero */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-900/80 border border-neutral-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Ready for your session, {profile.name}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-100">
            {suggestedRoutine ? suggestedRoutine.name : 'Custom Training Day'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-lg">
            {suggestedRoutine
              ? `Scheduled for today · Targets ${suggestedRoutine.targetMuscles.join(', ')}`
              : 'Select any routine or start an empty guided session.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {suggestedRoutine && (
            <button
              type="button"
              onClick={() => startWorkout(suggestedRoutine.id)}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-950/50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Routine</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => startWorkout(undefined, 'Quick Workout')}
            className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors"
          >
            Empty Session
          </button>
        </div>
      </div>

      {/* 4 Quantitative Rigor Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Workouts (7d)</span>
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100">
            {weeklyStats.count}{' '}
            <span className="text-xs font-normal text-neutral-500">sessions</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Consistency on track</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
            <span>Volume (7d)</span>
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {weeklyStats.volume.toLocaleString()}{' '}
            <span className="text-xs font-normal text-neutral-500">
              {profile.unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Total weight moved</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Time Trained</span>
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100">
            {formatDuration(weeklyStats.durationSec)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Last 7 rolling days</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>PRs Set</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {personalRecords.length}{' '}
            <span className="text-xs font-normal text-neutral-500">all-time</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Peak personal bests</div>
        </div>
      </div>

      {/* Nutrition Quick Bar */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
              <span>Today's Nutrition</span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {todayNutrition.cals.toLocaleString()} / {profile.dailyCalorieTarget.toLocaleString()} kcal
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
              <span className="text-blue-400 font-mono font-semibold">
                {Math.round(todayNutrition.protein)}g / {profile.dailyProteinTarget}g protein
              </span>
              <span>·</span>
              <span className="text-sky-300 font-mono">
                {todayNutrition.water} ml water
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToTab('food')}
          className="py-1.5 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Open Food Tracker</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      {/* Main Two-Column Layout: Muscle Fatigue Anatomical Map & Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Muscle Fatigue & Body Map */}
        <div className="lg:col-span-5 bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Muscle Recovery & Fatigue</h3>
              <p className="text-xs text-neutral-400">
                Calculated from sets completed in the last 7 days
              </p>
            </div>
          </div>

          <BodyMap
            fatigueData={muscleFatigue}
            selectedMuscle={selectedMuscle}
            onSelectMuscle={(m) => setSelectedMuscle(m)}
          />

          {/* Muscle Detail Inspector */}
          {selectedMuscle && (
            <div className="w-full mt-4 p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold capitalize text-neutral-200">
                <span>{selectedMuscle}</span>
                <span
                  className={
                    muscleFatigue[selectedMuscle]?.fatiguePercent > 60
                      ? 'text-red-400 font-mono'
                      : muscleFatigue[selectedMuscle]?.fatiguePercent > 20
                      ? 'text-amber-400 font-mono'
                      : 'text-blue-400 font-mono'
                  }
                >
                  {muscleFatigue[selectedMuscle]?.fatiguePercent || 0}% fatigued
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Sets last 7 days:</span>
                <span className="font-mono text-neutral-200">
                  {muscleFatigue[selectedMuscle]?.setsLast7Days || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Last trained:</span>
                <span className="font-mono text-neutral-200">
                  {muscleFatigue[selectedMuscle]?.lastTrainedDaysAgo !== null
                    ? `${muscleFatigue[selectedMuscle]?.lastTrainedDaysAgo} days ago`
                    : 'Not in last week'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Heatmap & Recent Sessions */}
        <div className="lg:col-span-7 space-y-6">
          {/* GitHub-style Heatmap */}
          <ActivityHeatmap workoutHistory={workoutHistory} weeksToShow={24} />

          {/* Recent Workout History Cards */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">Recent Sessions</h3>
                <p className="text-xs text-neutral-400">Completed workouts and volume logs</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('analytics')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-100">{session.title}</span>
                      {session.prsAchieved && session.prsAchieved.length > 0 && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.2 rounded">
                          {session.prsAchieved.length} PR
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>{session.startTime.split('T')[0]}</span>
                      <span>·</span>
                      <span>{formatDuration(session.durationSeconds)}</span>
                      <span>·</span>
                      <span className="font-mono text-neutral-300">
                        {session.totalVolume.toLocaleString()}{' '}
                        {profile.unit === 'metric' ? 'kg' : 'lbs'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startWorkout(session.routineId, session.title)}
                      className="py-1 px-2.5 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3 text-blue-400" />
                      <span>Repeat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
