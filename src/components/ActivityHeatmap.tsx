import React, { useMemo, useState } from 'react';
import { WorkoutSession } from '../types';
import { formatDuration } from '../utils/fitness';

interface ActivityHeatmapProps {
  workoutHistory: WorkoutSession[];
  weeksToShow?: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  workoutHistory,
  weeksToShow = 26
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    workouts: WorkoutSession[];
    x: number;
    y: number;
  } | null>(null);

  // Group workouts by date YYYY-MM-DD
  const workoutsByDate = useMemo(() => {
    const map = new Map<string, WorkoutSession[]>();
    workoutHistory.forEach((session) => {
      if (!session.startTime) return;
      const dateStr = session.startTime.split('T')[0];
      const existing = map.get(dateStr) || [];
      existing.push(session);
      map.set(dateStr, existing);
    });
    return map;
  }, [workoutHistory]);

  // Compute grid dates: 7 rows (Sun=0 to Sat=6) across N weeks ending today (2026-09-27)
  const { weeks, stats } = useMemo(() => {
    const today = new Date(2026, 8, 27); // 2026-09-27
    const dayOfWeek = today.getDay(); // Sunday=0, ..., Saturday=6
    
    // Total days to generate
    const totalDays = weeksToShow * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + (6 - dayOfWeek));

    const weeksArr: Array<Array<{ date: string; dateObj: Date; workouts: WorkoutSession[]; level: number }>> = [];
    let currentWeek: Array<{ date: string; dateObj: Date; workouts: WorkoutSession[]; level: number }> = [];

    let totalWorkouts = 0;
    let totalDurationSec = 0;
    let currentStreak = 0;
    let streakCounted = false;

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayWorkouts = workoutsByDate.get(dateStr) || [];

      let level = 0;
      if (dayWorkouts.length > 0) {
        totalWorkouts += dayWorkouts.length;
        const totalDaySec = dayWorkouts.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
        totalDurationSec += totalDaySec;
        if (totalDaySec > 4000) level = 4;
        else if (totalDaySec > 2500) level = 3;
        else if (totalDaySec > 1200) level = 2;
        else level = 1;
      }

      currentWeek.push({
        date: dateStr,
        dateObj: d,
        workouts: dayWorkouts,
        level
      });

      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    }

    // Calculate streak from today backwards
    let checkDate = new Date(today);
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      const hasWorkout = workoutsByDate.has(checkStr);
      if (hasWorkout) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no workout yet, check if yesterday had one to continue streak
        if (currentStreak === 0 && !streakCounted) {
          streakCounted = true;
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          if (workoutsByDate.has(yesterdayStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }

    return {
      weeks: weeksArr,
      stats: {
        totalWorkouts,
        totalDurationSec,
        currentStreak: Math.max(1, currentStreak)
      }
    };
  }, [workoutsByDate, weeksToShow]);

  // Color mappings
  const getCellColor = (level: number): string => {
    switch (level) {
      case 1:
        return 'bg-blue-950 border-blue-900/60 hover:bg-blue-900';
      case 2:
        return 'bg-blue-800 border-blue-700/60 hover:bg-blue-700';
      case 3:
        return 'bg-blue-600 border-blue-500/60 hover:bg-blue-500';
      case 4:
        return 'bg-blue-400 border-blue-300/80 hover:bg-blue-300 shadow-[0_0_6px_#3b82f6]';
      default:
        return 'bg-neutral-900/90 border-neutral-800/80 hover:border-neutral-700';
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col gap-3 p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
      {/* Header with Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-200">Activity Heatmap</h3>
          <p className="text-xs text-neutral-400">
            {stats.totalWorkouts} sessions logged · {formatDuration(stats.totalDurationSec)} trained
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="font-mono font-semibold text-blue-400">{stats.currentStreak} days</span>
            <span className="text-neutral-500">streak</span>
          </div>
          {/* Level scale */}
          <div className="flex items-center gap-1 text-neutral-500">
            <span className="text-[10px]">Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900 border border-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-950 border border-blue-900" />
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-800 border border-blue-700" />
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" />
            <span className="text-[10px]">More</span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex gap-1.5 min-w-full">
          {/* Day of week labels */}
          <div className="flex flex-col gap-1 pr-1 text-[10px] text-neutral-500 font-mono select-none">
            {dayLabels.map((lbl, idx) => (
              <span key={lbl} className="h-3 flex items-center leading-none">
                {idx % 2 === 1 ? lbl : ''}
              </span>
            ))}
          </div>

          {/* Week Columns */}
          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredDay({
                        date: day.date,
                        workouts: day.workouts,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8
                      });
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3 h-3 rounded-xs border transition-colors cursor-pointer ${getCellColor(
                      day.level
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full pointer-events-none bg-neutral-900 border border-neutral-700 px-2.5 py-1.5 rounded-md shadow-xl text-xs text-neutral-200 whitespace-nowrap"
          style={{ left: hoveredDay.x, top: hoveredDay.y }}
        >
          <div className="font-semibold text-neutral-100 font-mono text-[11px]">{hoveredDay.date}</div>
          {hoveredDay.workouts.length > 0 ? (
            <div className="text-blue-400 mt-0.5">
              {hoveredDay.workouts.map((w) => (
                <div key={w.id}>
                  {w.title} ({formatDuration(w.durationSeconds)})
                </div>
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 mt-0.5">No workout logged</div>
          )}
        </div>
      )}
    </div>
  );
};
