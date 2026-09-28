import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Eye,
  EyeOff,
  Flame,
  Layers,
  Minimize2,
  Plus,
  Search,
  Timer,
  Trash2,
  X
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { SetType } from '../types';
import { formatDuration } from '../utils/fitness';

export const ActiveWorkoutModal: React.FC = () => {
  const {
    activeWorkout,
    profile,
    updateActiveWorkout,
    finishActiveWorkout,
    cancelActiveWorkout,
    addExerciseToActiveWorkout,
    removeExerciseFromActiveWorkout,
    addSetToExercise,
    updateSet,
    toggleSetCompleted,
    deleteSet,
    setSuperset,
    wakeLockActive,
    toggleWakeLock
  } = useWorkout();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!activeWorkout) return null;

  // Filter exercises for Add Exercise dialog
  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(exerciseSearch.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || ex.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Cardio'];

  // Minimized Bar: floats neatly at top or bottom
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900 border-t border-neutral-800 p-3 shadow-2xl flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Dumbbell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
              <span>{activeWorkout.title}</span>
              <span className="font-mono text-blue-400 text-xs">
                {formatDuration(activeWorkout.durationSeconds)}
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">
              {activeWorkout.exercises.length} exercises ·{' '}
              {activeWorkout.exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.completed).length, 0)} sets done
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Resume</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={finishActiveWorkout}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 overflow-hidden text-neutral-100">
      {/* Top Session Navigation Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
            title="Minimize to background"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-neutral-100">{activeWorkout.title}</h1>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1 font-mono text-blue-400">
                <Timer className="w-3.5 h-3.5" />
                {formatDuration(activeWorkout.durationSeconds)}
              </span>
              <span>·</span>
              <span>
                {activeWorkout.exercises.reduce((acc, e) => acc + e.sets.filter((s) => s.completed).length, 0)} sets completed
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wake Lock Screen Awake Toggle */}
          <button
            type="button"
            onClick={toggleWakeLock}
            className={`p-1.5 text-xs rounded-lg border transition-colors ${
              wakeLockActive
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
            }`}
            title={wakeLockActive ? 'Screen kept awake' : 'Enable screen keep-awake'}
          >
            {wakeLockActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Finish Workout CTA */}
          <button
            type="button"
            onClick={finishActiveWorkout}
            className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Finish Workout
          </button>

          {/* Discard Session */}
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
            title="Cancel Workout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Exercises Body */}
      <main className="flex-1 overflow-y-auto p-4 max-w-4xl w-full mx-auto space-y-4 pb-28">
        {/* Workout Title and Notes Input */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3.5 space-y-2">
          <input
            type="text"
            value={activeWorkout.title}
            onChange={(e) => updateActiveWorkout({ ...activeWorkout, title: e.target.value })}
            className="w-full bg-transparent text-base font-bold text-neutral-100 border-b border-neutral-800 pb-1 focus:outline-none focus:border-blue-500"
            placeholder="Workout Title"
          />
          <input
            type="text"
            value={activeWorkout.notes || ''}
            onChange={(e) => updateActiveWorkout({ ...activeWorkout, notes: e.target.value })}
            className="w-full bg-transparent text-xs text-neutral-400 focus:outline-none placeholder:text-neutral-600"
            placeholder="Add general workout notes (energy, pre-workout, warm-up feeling)..."
          />
        </div>

        {/* Exercises List */}
        {activeWorkout.exercises.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl">
            <Dumbbell className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-300">No exercises added yet</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Add your first movement from the exercise library to start logging sets, weights, and reps.
            </p>
            <button
              type="button"
              onClick={() => setShowAddExerciseModal(true)}
              className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exercise</span>
            </button>
          </div>
        ) : (
          activeWorkout.exercises.map((item, exIdx) => (
            <div
              key={item.id}
              className={`bg-neutral-900/80 border rounded-xl overflow-hidden transition-all ${
                item.supersetId
                  ? 'border-violet-500/40 bg-neutral-900/90 shadow-sm'
                  : 'border-neutral-800'
              }`}
            >
              {/* Exercise Card Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-neutral-500">
                    #{exIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
                      <span>{item.exerciseName}</span>
                      {item.supersetId && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
                          Superset {item.supersetId}
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Superset Selector */}
                  <select
                    value={item.supersetId || ''}
                    onChange={(e) => setSuperset(item.id, e.target.value || undefined)}
                    className="text-[11px] bg-neutral-800 text-neutral-300 border border-neutral-700 rounded px-2 py-1 focus:outline-none"
                    title="Group into superset"
                  >
                    <option value="">No Superset</option>
                    <option value="A">Superset A</option>
                    <option value="B">Superset B</option>
                    <option value="C">Superset C</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeExerciseFromActiveWorkout(item.id)}
                    className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors"
                    title="Remove Exercise"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Set Table */}
              <div className="p-3 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-neutral-500 text-[11px] border-b border-neutral-800/60 font-mono">
                      <th className="pb-2 w-10 text-center">Set</th>
                      <th className="pb-2 w-24">Type</th>
                      <th className="pb-2 w-24 text-neutral-400">Previous</th>
                      <th className="pb-2 w-28">
                        Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})
                      </th>
                      <th className="pb-2 w-20">Reps</th>
                      <th className="pb-2 w-16 text-center">RPE</th>
                      <th className="pb-2 w-12 text-center">Done</th>
                      <th className="pb-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {item.sets.map((set) => (
                      <tr
                        key={set.id}
                        className={`transition-colors ${
                          set.completed ? 'bg-blue-950/25' : 'hover:bg-neutral-800/30'
                        }`}
                      >
                        {/* Set Number */}
                        <td className="py-2 text-center font-mono font-semibold text-neutral-400">
                          {set.setNumber}
                        </td>

                        {/* Set Type */}
                        <td className="py-2 pr-2">
                          <select
                            value={set.type}
                            onChange={(e) =>
                              updateSet(item.id, set.id, { type: e.target.value as SetType })
                            }
                            className="bg-neutral-800/80 border border-neutral-700/80 text-[11px] text-neutral-200 rounded px-1.5 py-1 focus:outline-none"
                          >
                            <option value="normal">Normal</option>
                            <option value="warmup">Warm-up (W)</option>
                            <option value="dropset">Drop set (D)</option>
                            <option value="failure">Failure (F)</option>
                          </select>
                        </td>

                        {/* Previous weight/reps */}
                        <td className="py-2 pr-2 font-mono text-neutral-500 text-[11px]">
                          {set.previousWeight !== undefined && set.previousReps !== undefined ? (
                            <span>
                              {set.previousWeight} {profile.unit === 'metric' ? 'kg' : 'lb'} ×{' '}
                              {set.previousReps}
                            </span>
                          ) : (
                            <span className="text-neutral-600">—</span>
                          )}
                        </td>

                        {/* Weight Input */}
                        <td className="py-2 pr-2">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weight === 0 ? '' : set.weight}
                            onChange={(e) =>
                              updateSet(item.id, set.id, {
                                weight: parseFloat(e.target.value) || 0
                              })
                            }
                            placeholder="0"
                            className="w-20 bg-neutral-800/90 border border-neutral-700 text-neutral-100 font-mono text-xs rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                          />
                        </td>

                        {/* Reps Input */}
                        <td className="py-2 pr-2">
                          <input
                            type="number"
                            value={set.reps === 0 ? '' : set.reps}
                            onChange={(e) =>
                              updateSet(item.id, set.id, {
                                reps: parseInt(e.target.value) || 0
                              })
                            }
                            placeholder="0"
                            className="w-16 bg-neutral-800/90 border border-neutral-700 text-neutral-100 font-mono text-xs rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                          />
                        </td>

                        {/* RPE Input */}
                        <td className="py-2 pr-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="6"
                            max="10"
                            value={set.rpe || ''}
                            onChange={(e) =>
                              updateSet(item.id, set.id, {
                                rpe: parseFloat(e.target.value) || undefined
                              })
                            }
                            placeholder="-"
                            className="w-12 bg-neutral-800/60 border border-neutral-700 text-neutral-300 font-mono text-xs rounded px-1 py-1 text-center focus:outline-none focus:border-blue-500"
                          />
                        </td>

                        {/* Complete Checkbox Button */}
                        <td className="py-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSetCompleted(item.id, set.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              set.completed
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-neutral-800 border border-neutral-700 text-neutral-400 hover:border-blue-500/50 hover:text-blue-400'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </td>

                        {/* Delete Set */}
                        <td className="py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteSet(item.id, set.id)}
                            className="text-neutral-600 hover:text-red-400 p-1 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Set Button */}
                <div className="mt-2.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => addSetToExercise(item.id)}
                    className="py-1 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Set</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Global Add Exercise Button */}
        {activeWorkout.exercises.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAddExerciseModal(true)}
            className="w-full py-2.5 border border-dashed border-neutral-700 hover:border-blue-500/50 hover:bg-neutral-900/50 text-neutral-300 hover:text-blue-400 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Exercise</span>
          </button>
        )}
      </main>

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Select Exercise</h3>
                <p className="text-xs text-neutral-400">Search from the AthleTech exercise library</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddExerciseModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Category Filters */}
            <div className="p-4 border-b border-neutral-800 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  placeholder="Search exercise name or target muscle (e.g. Bench, Chest, Squat)..."
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              {/* Segmented Category Buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredExercises.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No matching exercises found for "{exerciseSearch}"
                </div>
              ) : (
                filteredExercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => {
                      addExerciseToActiveWorkout(ex.id);
                      setShowAddExerciseModal(false);
                      setExerciseSearch('');
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-neutral-800/70 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-neutral-200 group-hover:text-blue-400">
                        {ex.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{ex.primaryMuscles.join(', ')}</span>
                        <span>·</span>
                        <span className="text-neutral-500">{ex.category}</span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Discard Workout Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-neutral-100">Discard active workout?</h3>
            <p className="text-xs text-neutral-400 mt-1">
              All logged sets and session progress will be lost. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="py-1.5 px-3 text-xs text-neutral-300 hover:text-neutral-100 bg-neutral-800 rounded-lg"
              >
                Keep Workout
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmCancel(false);
                  cancelActiveWorkout();
                }}
                className="py-1.5 px-3 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
