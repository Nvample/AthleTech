import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle,
  Dumbbell,
  Filter,
  Info,
  Search,
  X
} from 'lucide-react';
import { BodyMap } from '../components/BodyMap';
import { useWorkout } from '../context/WorkoutContext';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { Exercise, MuscleGroup } from '../types';

export const ExercisesView: React.FC = () => {
  const { personalRecords, profile, workoutHistory } = useWorkout();

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeExerciseDetail, setActiveExerciseDetail] = useState<Exercise | null>(null);
  const [showBodyMapFilter, setShowBodyMapFilter] = useState(true);

  const categories = ['All', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Cardio'];

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase())) ||
        ex.secondaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || ex.category === selectedCategory;

      const matchesMuscle =
        !selectedMuscle ||
        ex.primaryMuscles.includes(selectedMuscle) ||
        ex.secondaryMuscles.includes(selectedMuscle);

      return matchesSearch && matchesCat && matchesMuscle;
    });
  }, [search, selectedCategory, selectedMuscle]);

  // Historical performance for the selected exercise
  const exerciseHistory = useMemo(() => {
    if (!activeExerciseDetail) return [];
    const setsList: Array<{ date: string; weight: number; reps: number; isPr?: boolean }> = [];

    workoutHistory.forEach((session) => {
      const match = session.exercises.find((e) => e.exerciseId === activeExerciseDetail.id);
      if (match) {
        match.sets.forEach((s) => {
          if (s.completed && s.weight > 0) {
            setsList.push({
              date: session.startTime.split('T')[0],
              weight: s.weight,
              reps: s.reps,
              isPr: s.isPr
            });
          }
        });
      }
    });

    return setsList.slice(0, 10);
  }, [activeExerciseDetail, workoutHistory]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-100">Exercise Library & Anatomy</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Browse movement mechanics, anatomical targets, form tips, and your historical performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBodyMapFilter(!showBodyMapFilter)}
          className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
            showBodyMapFilter
              ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>{showBodyMapFilter ? 'Hide Anatomical Map' : 'Filter by Body Map'}</span>
        </button>
      </div>

      {/* Anatomical Body Map Filter Drawer */}
      {showBodyMapFilter && (
        <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:max-w-xs space-y-2 text-center md:text-left">
            <h3 className="text-sm font-bold text-neutral-200">Interactive Body Map</h3>
            <p className="text-xs text-neutral-400">
              Click any muscle group on the front or back anatomical model to isolate all exercises
              targeting that muscle.
            </p>
            {selectedMuscle && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-400">
                <span className="capitalize">{selectedMuscle} selected</span>
                <button
                  type="button"
                  onClick={() => setSelectedMuscle(null)}
                  className="hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <BodyMap
              selectedMuscle={selectedMuscle}
              onSelectMuscle={(m) => setSelectedMuscle(m)}
              compact
            />
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by exercise name, target muscle (e.g. Chest, Quads, Triceps)..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredExercises.map((exercise) => {
          const pr = personalRecords.find((p) => p.exerciseId === exercise.id);

          return (
            <div
              key={exercise.id}
              onClick={() => setActiveExerciseDetail(exercise)}
              className="p-4 bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-neutral-100 group-hover:text-blue-400 transition-colors">
                    {exercise.name}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                    {exercise.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
                  <span className="text-neutral-500 text-[11px]">Primary:</span>
                  <span className="capitalize text-neutral-300 font-medium">
                    {exercise.primaryMuscles.join(', ')}
                  </span>
                </div>

                {exercise.secondaryMuscles.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                    <span className="text-[11px]">Secondary:</span>
                    <span className="capitalize">{exercise.secondaryMuscles.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Personal Record badge if set */}
              {pr && (
                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>PR:</span>
                  </div>
                  <span className="font-mono text-neutral-200">
                    {pr.maxWeight} {profile.unit === 'metric' ? 'kg' : 'lbs'} × {pr.maxRepsAtMaxWeight} (1RM: {pr.estimatedOneRepMax})
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal */}
      {activeExerciseDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-100">
                  {activeExerciseDetail.name}
                </h3>
                <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                  <span className="capitalize text-blue-400">
                    {activeExerciseDetail.primaryMuscles.join(', ')}
                  </span>
                  <span>·</span>
                  <span>{activeExerciseDetail.category}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveExerciseDetail(null)}
                className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Execution & Technique</span>
                </h4>
                <ol className="space-y-2 text-xs text-neutral-300">
                  {activeExerciseDetail.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-mono text-neutral-500 font-bold">{idx + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Form Tips */}
              {activeExerciseDetail.tips && activeExerciseDetail.tips.length > 0 && (
                <div className="p-3 bg-neutral-800/60 border border-neutral-700/60 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Key Form Cues</span>
                  </h4>
                  {activeExerciseDetail.tips.map((tip, idx) => (
                    <p key={idx} className="text-xs text-neutral-400 leading-relaxed">
                      {tip}
                    </p>
                  ))}
                </div>
              )}

              {/* Personal Logged History for this exercise */}
              <div>
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Your Historical Logs</span>
                </h4>

                {exerciseHistory.length === 0 ? (
                  <div className="text-xs text-neutral-500 italic p-3 bg-neutral-800/30 rounded-lg">
                    No completed sets logged yet for this exercise.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-800/60 bg-neutral-800/40 rounded-xl overflow-hidden border border-neutral-800">
                    {exerciseHistory.map((log, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-neutral-400">{log.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-200 font-semibold">
                            {log.weight} {profile.unit === 'metric' ? 'kg' : 'lbs'} × {log.reps}{' '}
                            reps
                          </span>
                          {log.isPr && (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1 rounded">
                              PR
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveExerciseDetail(null)}
                className="py-1.5 px-4 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
