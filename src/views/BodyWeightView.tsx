import React, { useMemo, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  LineChart as ChartIcon,
  Minus,
  Plus,
  Ruler,
  Scale,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { BodyMeasurementEntry, BodyWeightEntry } from '../types';

export const BodyWeightView: React.FC = () => {
  const { weightLogs, logWeight, profile, measurements, logMeasurement } = useWorkout();

  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | 'ALL'>('3M');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  // Form states for log weight
  const [inputWeight, setInputWeight] = useState<string>('');
  const [inputBodyFat, setInputBodyFat] = useState<string>('');
  const [inputDate, setInputDate] = useState<string>(
    new Date(2026, 8, 27).toISOString().split('T')[0]
  );
  const [inputNotes, setInputNotes] = useState<string>('');

  // Form states for body measurement
  const [measureForm, setMeasureForm] = useState<Omit<BodyMeasurementEntry, 'id'>>({
    date: new Date(2026, 8, 27).toISOString().split('T')[0],
    chest: undefined,
    waist: undefined,
    arms: undefined,
    thighs: undefined,
    hips: undefined,
    calves: undefined,
    shoulders: undefined,
    neck: undefined
  });

  // Filter logs by selected time range
  const filteredLogs = useMemo(() => {
    const now = new Date(2026, 8, 27).getTime();
    let daysToKeep = 90;
    if (timeRange === '1M') daysToKeep = 30;
    if (timeRange === '6M') daysToKeep = 180;
    if (timeRange === 'ALL') daysToKeep = 9999;

    const cutoff = now - daysToKeep * 24 * 60 * 60 * 1000;
    return [...weightLogs]
      .filter((w) => new Date(w.date).getTime() >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [weightLogs, timeRange]);

  // Compute 7-day rolling moving average for smoother curve
  const chartPoints = useMemo(() => {
    return filteredLogs.map((entry, idx, arr) => {
      // Calculate average of up to 7 previous entries
      const startIdx = Math.max(0, idx - 6);
      const slice = arr.slice(startIdx, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.weight, 0) / slice.length;
      return {
        ...entry,
        movingAvg: Math.round(avg * 10) / 10
      };
    });
  }, [filteredLogs]);

  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : profile.startingWeight;
  const totalChange = latestWeight - profile.startingWeight;
  const distanceToGoal = latestWeight - profile.targetWeight;

  // Chart min/max scaling
  const { minWeight, maxWeight } = useMemo(() => {
    if (chartPoints.length === 0) return { minWeight: 70, maxWeight: 90 };
    const weights = chartPoints.map((p) => p.weight).concat([profile.targetWeight]);
    const min = Math.min(...weights) - 1.5;
    const max = Math.max(...weights) + 1.5;
    return { minWeight: min, maxWeight: max };
  }, [chartPoints, profile.targetWeight]);

  const chartWidth = 720;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 24;

  const getX = (index: number) => {
    if (chartPoints.length <= 1) return paddingX;
    return paddingX + (index / (chartPoints.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (weight: number) => {
    const range = maxWeight - minWeight || 1;
    return chartHeight - paddingY - ((weight - minWeight) / range) * (chartHeight - paddingY * 2);
  };

  // Generate SVG path strings
  const rawPath = chartPoints.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.weight);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const avgPath = chartPoints.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.movingAvg);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const goalY = getY(profile.targetWeight);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(inputWeight);
    if (!w || isNaN(w)) return;
    const bf = inputBodyFat ? parseFloat(inputBodyFat) : undefined;
    logWeight(w, bf, inputDate, inputNotes);
    setShowLogModal(false);
    setInputWeight('');
    setInputBodyFat('');
    setInputNotes('');
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    logMeasurement(measureForm);
    setShowMeasureModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-100">Body Weight & Metrics Tracker</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Track daily body mass trendlines, 7-day moving averages, and body tape circumferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMeasureModal(true)}
            className="py-2 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Circumferences</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Weight</span>
          </button>
        </div>
      </div>

      {/* Metric Scoreboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Current Weight</span>
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100">
            {latestWeight}{' '}
            <span className="text-xs font-normal text-neutral-500">
              {profile.unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Latest logged entry</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <ChartIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Goal</span>
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {profile.targetWeight}{' '}
            <span className="text-xs font-normal text-neutral-500">
              {profile.unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 capitalize">
            Goal: {profile.weightGoalType}
          </div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            {totalChange <= 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Net Change</span>
          </div>
          <div
            className={`text-xl font-bold font-mono ${
              totalChange <= 0 ? 'text-blue-400' : 'text-amber-400'
            }`}
          >
            {totalChange > 0 ? `+${totalChange.toFixed(1)}` : totalChange.toFixed(1)}{' '}
            <span className="text-xs font-normal text-neutral-500">
              {profile.unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Since baseline</div>
        </div>

        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>To Target</span>
          </div>
          <div className="text-xl font-bold font-mono text-neutral-100">
            {Math.abs(distanceToGoal).toFixed(1)}{' '}
            <span className="text-xs font-normal text-neutral-500">
              {profile.unit === 'metric' ? 'kg' : 'lbs'} {distanceToGoal > 0 ? 'to drop' : 'to gain'}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">Delta remaining</div>
        </div>
      </div>

      {/* Weight Progression Chart */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-neutral-300">Daily Log</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-400 border-t border-dashed" />
              <span className="text-neutral-400">7-Day Moving Avg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border-t border-dashed" />
              <span className="text-neutral-400">Goal ({profile.targetWeight})</span>
            </div>
          </div>

          {/* Time range segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-800/80 rounded-lg">
            {(['1M', '3M', '6M', 'ALL'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-neutral-900 text-blue-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-64 overflow-visible select-none"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const val = minWeight + pct * (maxWeight - minWeight);
              const y = getY(val);
              return (
                <g key={pct}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#262626"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="#737373"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Target Goal Line */}
            {goalY >= paddingY && goalY <= chartHeight - paddingY && (
              <line
                x1={paddingX}
                y1={goalY}
                x2={chartWidth - paddingX}
                y2={goalY}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}

            {/* 7-Day Moving Avg Line (smoothed) */}
            {avgPath && (
              <path
                d={avgPath}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.8"
              />
            )}

            {/* Raw Weight Progression Line */}
            {rawPath && (
              <path
                d={rawPath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Dots */}
            {chartPoints.map((point, idx) => {
              const x = getX(idx);
              const y = getY(point.weight);
              return (
                <circle
                  key={point.id}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#3b82f6"
                  stroke="#09090b"
                  strokeWidth="1.5"
                  className="hover:r-5 transition-all cursor-pointer"
                >
                  <title>{`${point.date}: ${point.weight} ${profile.unit === 'metric' ? 'kg' : 'lbs'}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Body Circumferences Measurement History */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">Tape Measurements (cm / in)</h3>
            <p className="text-xs text-neutral-400">
              Track muscular development and waist reduction across key anatomical landmarks
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px]">
                <th className="pb-2">Date</th>
                <th className="pb-2">Chest</th>
                <th className="pb-2">Waist</th>
                <th className="pb-2">Arms</th>
                <th className="pb-2">Thighs</th>
                <th className="pb-2">Hips</th>
                <th className="pb-2">Calves</th>
                <th className="pb-2">Shoulders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 font-mono">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-800/30">
                  <td className="py-2 text-neutral-300 font-semibold">{m.date}</td>
                  <td className="py-2 text-neutral-400">{m.chest || '—'}</td>
                  <td className="py-2 text-blue-400 font-semibold">{m.waist || '—'}</td>
                  <td className="py-2 text-neutral-400">{m.arms || '—'}</td>
                  <td className="py-2 text-neutral-400">{m.thighs || '—'}</td>
                  <td className="py-2 text-neutral-400">{m.hips || '—'}</td>
                  <td className="py-2 text-neutral-400">{m.calves || '—'}</td>
                  <td className="py-2 text-neutral-400">{m.shoulders || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Weight Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">Log Daily Body Weight</h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder={latestWeight.toString()}
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Body Fat % (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputBodyFat}
                  onChange={(e) => setInputBodyFat(e.target.value)}
                  placeholder="e.g. 15.2"
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Date</label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Notes (Optional)</label>
                <input
                  type="text"
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  placeholder="Morning weigh-in after fasting..."
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="py-1.5 px-3 text-xs text-neutral-400 bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Measurements Modal */}
      {showMeasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">Log Tape Circumferences</h3>
              <button
                type="button"
                onClick={() => setShowMeasureModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300">Date</label>
                <input
                  type="date"
                  value={measureForm.date}
                  onChange={(e) => setMeasureForm({ ...measureForm, date: e.target.value })}
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-neutral-400">Chest (cm/in)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureForm.chest || ''}
                    onChange={(e) =>
                      setMeasureForm({ ...measureForm, chest: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Waist (cm/in)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureForm.waist || ''}
                    onChange={(e) =>
                      setMeasureForm({ ...measureForm, waist: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Arms (cm/in)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureForm.arms || ''}
                    onChange={(e) =>
                      setMeasureForm({ ...measureForm, arms: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Thighs (cm/in)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureForm.thighs || ''}
                    onChange={(e) =>
                      setMeasureForm({ ...measureForm, thighs: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Hips (cm/in)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureForm.hips || ''}
                    onChange={(e) =>
                      setMeasureForm({ ...measureForm, hips: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Calves (cm/in)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={measureForm.calves || ''}
                    onChange={(e) =>
                      setMeasureForm({ ...measureForm, calves: parseFloat(e.target.value) || undefined })
                    }
                    className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMeasureModal(false)}
                  className="py-1.5 px-3 text-xs text-neutral-400 bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
