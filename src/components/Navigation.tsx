import React from 'react';
import {
  Activity,
  BarChart3,
  Calendar,
  Dumbbell,
  Play,
  Scale,
  Settings,
  Sparkles,
  Utensils
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

export type NavTab =
  | 'dashboard'
  | 'routines'
  | 'exercises'
  | 'food'
  | 'weight'
  | 'analytics'
  | 'ai-coach'
  | 'settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { startWorkout, activeWorkout, profile } = useWorkout();

  return (
    <>
      {/* Top Bar strictly compliant with the Top Bar Contract */}
      <header className="sticky top-0 z-30 w-full bg-neutral-950/90 border-b border-neutral-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="text-lg font-extrabold tracking-tight text-neutral-100 hover:text-blue-400 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span>Athle</span><span className="text-blue-500">Tech</span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'dashboard'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('routines')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'routines'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              Routines
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('exercises')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'exercises'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              Exercises
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('food')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1 ${
                currentTab === 'food'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food Tracker</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('weight')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'weight'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              Body Weight
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('analytics')}
              className={`transition-colors whitespace-nowrap ${
                currentTab === 'analytics'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              Analytics
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('ai-coach')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1 ${
                currentTab === 'ai-coach'
                  ? 'text-blue-400 border-b-2 border-blue-400 py-4 -mb-[1px]'
                  : 'text-neutral-400 hover:text-neutral-200 py-4'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI Coach</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            {!activeWorkout && (
              <button
                type="button"
                onClick={() => startWorkout()}
                className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Workout</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`p-1.5 rounded-lg border transition-colors ${
                currentTab === 'settings'
                  ? 'bg-neutral-800 border-blue-500/40 text-blue-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
              title="Settings & Backup"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className="w-7 h-7 rounded-full overflow-hidden border border-neutral-700 hover:border-blue-400 transition-colors focus:outline-none"
              title={profile.name}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (under 15% viewport height) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/95 border-t border-neutral-800/80 backdrop-blur-lg flex items-center justify-around py-2 px-1">
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentTab === 'dashboard' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('routines')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentTab === 'routines' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Workouts</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('food')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentTab === 'food' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Food</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('weight')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentTab === 'weight' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Weight</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentTab === 'analytics' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('ai-coach')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentTab === 'ai-coach' ? 'text-blue-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI</span>
        </button>
      </nav>
    </>
  );
};
