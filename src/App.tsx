/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, X } from 'lucide-react';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { FinishWorkoutModal } from './components/FinishWorkoutModal';
import { Navigation, NavTab } from './components/Navigation';
import { RestTimerBar } from './components/RestTimerBar';
import { useWorkout, WorkoutProvider } from './context/WorkoutContext';
import { AiCoachView } from './views/AiCoachView';
import { AnalyticsView } from './views/AnalyticsView';
import { BodyWeightView } from './views/BodyWeightView';
import { DashboardView } from './views/DashboardView';
import { ExercisesView } from './views/ExercisesView';
import { FoodTrackerView } from './views/FoodTrackerView';
import { RoutinesView } from './views/RoutinesView';
import { SettingsView } from './views/SettingsView';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const { prNotification, dismissPrNotification } = useWorkout();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navigation currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* Floating Personal Record Announcement Toast */}
      {prNotification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-amber-500 text-neutral-950 px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2.5 border border-amber-300">
            <Award className="w-4 h-4 fill-current shrink-0" />
            <span>New Personal Record: {prNotification}</span>
            <button
              type="button"
              onClick={dismissPrNotification}
              className="ml-2 hover:opacity-75 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView onNavigateToTab={(tab) => setCurrentTab(tab)} />
        )}
        {currentTab === 'routines' && <RoutinesView />}
        {currentTab === 'exercises' && <ExercisesView />}
        {currentTab === 'food' && <FoodTrackerView />}
        {currentTab === 'weight' && <BodyWeightView />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'ai-coach' && <AiCoachView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Active Workout Tracker Overlay / Floating Bar */}
      <ActiveWorkoutModal />

      {/* Floating Rest Timer Bar */}
      <RestTimerBar />

      {/* Workout Completion Celebratory Modal */}
      <FinishWorkoutModal />
    </div>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <MainAppContent />
    </WorkoutProvider>
  );
}
