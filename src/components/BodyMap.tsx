import React, { useState } from 'react';
import { MuscleFatigue, MuscleGroup } from '../types';

interface BodyMapProps {
  fatigueData?: Record<MuscleGroup, MuscleFatigue>;
  selectedMuscle?: MuscleGroup | null;
  onSelectMuscle?: (muscle: MuscleGroup | null) => void;
  interactive?: boolean;
  compact?: boolean;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  fatigueData,
  selectedMuscle,
  onSelectMuscle,
  interactive = true,
  compact = false
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');

  // Determine muscle fill color
  const getMuscleColor = (muscle: MuscleGroup): string => {
    const isSelected = selectedMuscle === muscle;
    if (isSelected) {
      return '#3b82f6'; // vibrant athletic blue
    }

    if (!fatigueData) {
      return '#334155'; // default slate-700
    }

    const fatigue = fatigueData[muscle]?.fatiguePercent || 0;
    if (fatigue > 70) return '#ef4444'; // red (high fatigue)
    if (fatigue > 40) return '#f97316'; // orange
    if (fatigue > 15) return '#eab308'; // yellow/amber
    return '#1e293b'; // recovered slate-800
  };

  const handleMuscleClick = (muscle: MuscleGroup) => {
    if (!interactive || !onSelectMuscle) return;
    if (selectedMuscle === muscle) {
      onSelectMuscle(null);
    } else {
      onSelectMuscle(muscle);
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Front / Back Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg mb-3">
        <button
          type="button"
          onClick={() => setView('front')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            view === 'front' ? 'bg-neutral-800 text-blue-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Anterior (Front)
        </button>
        <button
          type="button"
          onClick={() => setView('back')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            view === 'back' ? 'bg-neutral-800 text-blue-400 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Posterior (Back)
        </button>
      </div>

      {/* SVG Canvas */}
      <div className={`relative flex justify-center items-center ${compact ? 'w-48 h-64' : 'w-64 h-88'}`}>
        <svg
          viewBox="0 0 200 320"
          className="w-full h-full drop-shadow-sm transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Silhouette Outline / Head / Neck */}
          <g opacity="0.35" fill="#0f172a" stroke="#334155" strokeWidth="1">
            {/* Head */}
            <ellipse cx="100" cy="24" rx="14" ry="18" />
            {/* Neck */}
            <path d="M 92 38 L 92 50 L 108 50 L 108 38 Z" />
            {/* Body contour silhouette */}
            <path d="M 68 56 Q 100 52 132 56 Q 146 72 150 110 Q 152 138 144 180 Q 138 210 134 250 L 132 308 L 118 308 L 104 220 L 96 220 L 82 308 L 68 308 L 66 250 Q 62 210 56 180 Q 48 138 50 110 Q 54 72 68 56 Z" fill="none" />
          </g>

          {view === 'front' ? (
            /* FRONT (ANTERIOR) VIEW */
            <g id="anterior-muscles">
              {/* Shoulders (Deltoids) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('shoulders')}
              >
                <path
                  d="M 68 56 Q 60 62 56 74 Q 54 84 56 94 Q 65 88 70 78 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                <path
                  d="M 132 56 Q 140 62 144 74 Q 146 84 144 94 Q 135 88 130 78 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Chest (Pectoralis Major) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('chest')}
              >
                {/* Left Pec */}
                <path
                  d="M 72 60 Q 98 62 98 84 Q 96 98 76 96 Q 66 84 72 60 Z"
                  fill={getMuscleColor('chest')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Pec */}
                <path
                  d="M 128 60 Q 102 62 102 84 Q 104 98 124 96 Q 134 84 128 60 Z"
                  fill={getMuscleColor('chest')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Biceps */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('biceps')}
              >
                {/* Left Bicep */}
                <path
                  d="M 55 96 Q 52 110 56 126 Q 63 124 66 112 Q 68 98 60 94 Z"
                  fill={getMuscleColor('biceps')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Bicep */}
                <path
                  d="M 145 96 Q 148 110 144 126 Q 137 124 134 112 Q 132 98 140 94 Z"
                  fill={getMuscleColor('biceps')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Forearms */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('forearms')}
              >
                {/* Left Forearm */}
                <path
                  d="M 54 130 Q 48 148 46 172 Q 54 172 58 152 Q 62 136 58 130 Z"
                  fill={getMuscleColor('forearms')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Forearm */}
                <path
                  d="M 146 130 Q 152 148 154 172 Q 146 172 142 152 Q 138 136 142 130 Z"
                  fill={getMuscleColor('forearms')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Abdominals (Core) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('core')}
              >
                {/* Upper Abs */}
                <rect
                  x="82"
                  y="102"
                  width="16"
                  height="12"
                  rx="3"
                  fill={getMuscleColor('core')}
                  stroke="#09090b"
                  strokeWidth="1"
                />
                <rect
                  x="102"
                  y="102"
                  width="16"
                  height="12"
                  rx="3"
                  fill={getMuscleColor('core')}
                  stroke="#09090b"
                  strokeWidth="1"
                />
                {/* Mid Abs */}
                <rect
                  x="82"
                  y="118"
                  width="16"
                  height="12"
                  rx="3"
                  fill={getMuscleColor('core')}
                  stroke="#09090b"
                  strokeWidth="1"
                />
                <rect
                  x="102"
                  y="118"
                  width="16"
                  height="12"
                  rx="3"
                  fill={getMuscleColor('core')}
                  stroke="#09090b"
                  strokeWidth="1"
                />
                {/* Lower Abs */}
                <path
                  d="M 82 134 L 98 134 L 98 150 L 86 148 Z"
                  fill={getMuscleColor('core')}
                  stroke="#09090b"
                  strokeWidth="1"
                />
                <path
                  d="M 118 134 L 102 134 L 102 150 L 114 148 Z"
                  fill={getMuscleColor('core')}
                  stroke="#09090b"
                  strokeWidth="1"
                />
              </g>

              {/* Quadriceps (Front Thighs) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('quads')}
              >
                {/* Left Quad */}
                <path
                  d="M 72 168 Q 66 200 70 234 Q 86 236 94 220 Q 96 186 92 168 Z"
                  fill={getMuscleColor('quads')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Quad */}
                <path
                  d="M 128 168 Q 134 200 130 234 Q 114 236 106 220 Q 104 186 108 168 Z"
                  fill={getMuscleColor('quads')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Calves (Anterior/Tibialis) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('calves')}
              >
                {/* Left Calf */}
                <path
                  d="M 72 248 Q 68 274 74 300 Q 82 298 84 276 Q 84 256 78 248 Z"
                  fill={getMuscleColor('calves')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Calf */}
                <path
                  d="M 128 248 Q 132 274 126 300 Q 118 298 116 276 Q 116 256 122 248 Z"
                  fill={getMuscleColor('calves')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>
            </g>
          ) : (
            /* BACK (POSTERIOR) VIEW */
            <g id="posterior-muscles">
              {/* Trapezius (Upper Back) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('back')}
              >
                <path
                  d="M 90 44 L 100 38 L 110 44 L 128 62 L 100 90 L 72 62 Z"
                  fill={getMuscleColor('back')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Rear Deltoids */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('shoulders')}
              >
                <path
                  d="M 68 58 Q 58 66 56 80 Q 64 82 72 72 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                <path
                  d="M 132 58 Q 142 66 144 80 Q 136 82 128 72 Z"
                  fill={getMuscleColor('shoulders')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Triceps */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('triceps')}
              >
                <path
                  d="M 54 84 Q 50 102 54 122 Q 62 118 64 100 Q 64 88 56 84 Z"
                  fill={getMuscleColor('triceps')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                <path
                  d="M 146 84 Q 150 102 146 122 Q 138 118 136 100 Q 136 88 144 84 Z"
                  fill={getMuscleColor('triceps')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Lats (Latissimus Dorsi) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('back')}
              >
                {/* Left Lat */}
                <path
                  d="M 72 74 Q 68 100 74 130 Q 88 134 94 116 Q 96 92 84 76 Z"
                  fill={getMuscleColor('back')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Lat */}
                <path
                  d="M 128 74 Q 132 100 126 130 Q 112 134 106 116 Q 104 92 116 76 Z"
                  fill={getMuscleColor('back')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Glutes (Gluteus Maximus) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('glutes')}
              >
                {/* Left Glute */}
                <path
                  d="M 72 152 Q 66 172 72 192 Q 92 198 98 178 Q 98 156 78 152 Z"
                  fill={getMuscleColor('glutes')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Glute */}
                <path
                  d="M 128 152 Q 134 172 128 192 Q 108 198 102 178 Q 102 156 122 152 Z"
                  fill={getMuscleColor('glutes')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Hamstrings */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('hamstrings')}
              >
                {/* Left Hamstring */}
                <path
                  d="M 72 198 Q 68 226 74 240 Q 88 242 94 226 Q 96 204 88 198 Z"
                  fill={getMuscleColor('hamstrings')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Hamstring */}
                <path
                  d="M 128 198 Q 132 226 126 240 Q 112 242 106 226 Q 104 204 112 198 Z"
                  fill={getMuscleColor('hamstrings')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>

              {/* Calves (Gastrocnemius / Soleus) */}
              <g
                className="cursor-pointer transition-colors"
                onClick={() => handleMuscleClick('calves')}
              >
                {/* Left Calf */}
                <path
                  d="M 72 250 Q 64 274 72 300 Q 82 298 86 274 Q 84 254 76 250 Z"
                  fill={getMuscleColor('calves')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
                {/* Right Calf */}
                <path
                  d="M 128 250 Q 136 274 128 300 Q 118 298 114 274 Q 116 254 124 250 Z"
                  fill={getMuscleColor('calves')}
                  stroke="#09090b"
                  strokeWidth="1.2"
                />
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Legend / Status indicator */}
      {fatigueData && (
        <div className="flex items-center gap-4 text-xs text-neutral-400 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            <span>Rested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Fatigued</span>
          </div>
        </div>
      )}
    </div>
  );
};
