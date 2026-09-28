import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Dumbbell,
  Edit2,
  Layers,
  Play,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { MuscleGroup, Routine, RoutineExerciseConfig } from '../types';

export const RoutinesView: React.FC = () => {
  const { routines, saveRoutine, deleteRoutine, startWorkout } = useWorkout();

  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Built-in starter templates for one-click import
  const STARTER_TEMPLATES: Routine[] = [
    {
      id: `tmpl-ppl-push-${Date.now()}`,
      name: 'PPL: Push (Chest, Delts, Triceps)',
      dayOfWeek: 1,
      targetMuscles: ['chest', 'shoulders', 'triceps'],
      exercises: [
        { exerciseId: 'barbell-bench-press', targetSets: 4, targetReps: '6-8' },
        { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: '8-10' },
        { exerciseId: 'dumbbell-lateral-raise', targetSets: 4, targetReps: '12-15', supersetId: 'A' },
        { exerciseId: 'cable-tricep-pushdown', targetSets: 3, targetReps: '10-12', supersetId: 'A' },
        { exerciseId: 'cable-chest-flye', targetSets: 3, targetReps: '12-15' }
      ]
    },
    {
      id: `tmpl-ppl-pull-${Date.now()}`,
      name: 'PPL: Pull (Back, Biceps, Rear Delts)',
      dayOfWeek: 2,
      targetMuscles: ['back', 'biceps', 'forearms'],
      exercises: [
        { exerciseId: 'barbell-deadlift', targetSets: 3, targetReps: '5' },
        { exerciseId: 'lat-pulldown', targetSets: 4, targetReps: '8-10' },
        { exerciseId: 'seated-cable-row', targetSets: 3, targetReps: '10-12' },
        { exerciseId: 'face-pull', targetSets: 3, targetReps: '12-15' },
        { exerciseId: 'incline-dumbbell-bicep-curl', targetSets: 3, targetReps: '10-12' }
      ]
    },
    {
      id: `tmpl-ppl-legs-${Date.now()}`,
      name: 'PPL: Legs (Quads, Hamstrings, Calves)',
      dayOfWeek: 4,
      targetMuscles: ['quads', 'hamstrings', 'calves', 'glutes', 'core'],
      exercises: [
        { exerciseId: 'barbell-back-squat', targetSets: 4, targetReps: '6-8' },
        { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '8-10' },
        { exerciseId: 'leg-press-machine', targetSets: 3, targetReps: '10-12' },
        { exerciseId: 'standing-calf-raise', targetSets: 4, targetReps: '15' },
        { exerciseId: 'hanging-leg-raise', targetSets: 3, targetReps: '12-15' }
      ]
    },
    {
      id: `tmpl-arnold-chest-back-${Date.now()}`,
      name: 'Arnold Split: Chest & Back Antagonist',
      dayOfWeek: 1,
      targetMuscles: ['chest', 'back'],
      exercises: [
        { exerciseId: 'barbell-bench-press', targetSets: 4, targetReps: '8-10', supersetId: 'A' },
        { exerciseId: 'pull-up', targetSets: 4, targetReps: '8-10', supersetId: 'A' },
        { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: '10-12', supersetId: 'B' },
        { exerciseId: 'barbell-bent-over-row', targetSets: 3, targetReps: '10-12', supersetId: 'B' },
        { exerciseId: 'cable-chest-flye', targetSets: 3, targetReps: '12-15' }
      ]
    }
  ];

  const handleStartNewRoutine = () => {
    setEditingRoutine({
      id: `routine-${Date.now()}`,
      name: 'New Workout Routine',
      dayOfWeek: 1,
      targetMuscles: ['chest', 'triceps'],
      exercises: [
        { exerciseId: 'barbell-bench-press', targetSets: 4, targetReps: '8-10' },
        { exerciseId: 'cable-tricep-pushdown', targetSets: 3, targetReps: '10-12' }
      ],
      notes: ''
    });
    setIsCreatingNew(true);
  };

  const handleSaveEditingRoutine = () => {
    if (!editingRoutine || !editingRoutine.name.trim()) return;
    saveRoutine(editingRoutine);
    setEditingRoutine(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-100">Workout Routines & Weekly Split</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Plan your weekly training days, custom exercise progressions, and supersets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="py-2 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>
          <button
            type="button"
            onClick={handleStartNewRoutine}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Routine</span>
          </button>
        </div>
      </div>

      {/* 7-Day Weekly Schedule View */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>Weekly Schedule</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
            const dayRoutine = routines.find((r) => r.dayOfWeek === dayIdx);
            const isToday = new Date(2026, 8, 27).getDay() === dayIdx;

            return (
              <div
                key={dayIdx}
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[110px] transition-colors ${
                  isToday
                    ? 'bg-neutral-800/80 border-blue-500/50 shadow-sm'
                    : 'bg-neutral-900/80 border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-1">
                    <span>{dayNames[dayIdx].slice(0, 3)}</span>
                    {isToday && (
                      <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-950 border border-blue-800 px-1 rounded">
                        TODAY
                      </span>
                    )}
                  </div>
                  {dayRoutine ? (
                    <div className="text-xs font-bold text-neutral-200 line-clamp-2 mt-1">
                      {dayRoutine.name}
                    </div>
                  ) : (
                    <div className="text-[11px] text-neutral-600 italic mt-1">Rest Day</div>
                  )}
                </div>

                {dayRoutine && (
                  <button
                    type="button"
                    onClick={() => startWorkout(dayRoutine.id)}
                    className="mt-2 w-full py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[11px] font-semibold rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-100">{routine.name}</h3>
                  <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                    <span>
                      {routine.dayOfWeek !== undefined ? dayNames[routine.dayOfWeek] : 'Unassigned'}
                    </span>
                    <span>·</span>
                    <span>{routine.exercises.length} exercises</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingRoutine({ ...routine })}
                    className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Edit Routine"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRoutine(routine.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Delete Routine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Target Muscles */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {routine.targetMuscles.map((m) => (
                  <span
                    key={m}
                    className="text-[11px] capitalize text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded-md"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Exercise Items List preview */}
              <div className="mt-4 space-y-1.5">
                {routine.exercises.map((item, idx) => {
                  const exMeta = EXERCISE_LIBRARY.find((e) => e.id === item.exerciseId);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2.5 bg-neutral-900 rounded-md border border-neutral-800/50"
                    >
                      <span className="text-neutral-300 truncate max-w-[200px]">
                        {exMeta ? exMeta.name : item.exerciseId}
                      </span>
                      <span className="font-mono text-neutral-400 text-[11px] shrink-0">
                        {item.targetSets} × {item.targetReps}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Start Routine Button */}
            <button
              type="button"
              onClick={() => startWorkout(routine.id)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl border border-blue-500/40 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Active Workout</span>
            </button>
          </div>
        ))}
      </div>

      {/* Edit / Create Routine Modal */}
      {editingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-100">
                {isCreatingNew ? 'Create New Routine' : 'Edit Routine'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoutine(null)}
                className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300">Routine Name</label>
                <input
                  type="text"
                  value={editingRoutine.name}
                  onChange={(e) =>
                    setEditingRoutine({ ...editingRoutine, name: e.target.value })
                  }
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Scheduled Day</label>
                <select
                  value={editingRoutine.dayOfWeek ?? ''}
                  onChange={(e) =>
                    setEditingRoutine({
                      ...editingRoutine,
                      dayOfWeek: e.target.value === '' ? undefined : parseInt(e.target.value)
                    })
                  }
                  className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {dayNames.map((d, idx) => (
                    <option key={idx} value={idx}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Exercises in Routine */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-neutral-300">Exercises</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newEx: RoutineExerciseConfig = {
                        exerciseId: EXERCISE_LIBRARY[0].id,
                        targetSets: 3,
                        targetReps: '8-10'
                      };
                      setEditingRoutine({
                        ...editingRoutine,
                        exercises: [...editingRoutine.exercises, newEx]
                      });
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Movement</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingRoutine.exercises.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-800/60 border border-neutral-700/60 rounded-xl flex items-center gap-2"
                    >
                      <select
                        value={item.exerciseId}
                        onChange={(e) => {
                          const updated = [...editingRoutine.exercises];
                          updated[idx].exerciseId = e.target.value;
                          setEditingRoutine({ ...editingRoutine, exercises: updated });
                        }}
                        className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200 focus:outline-none"
                      >
                        {EXERCISE_LIBRARY.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.targetSets}
                          onChange={(e) => {
                            const updated = [...editingRoutine.exercises];
                            updated[idx].targetSets = parseInt(e.target.value) || 3;
                            setEditingRoutine({ ...editingRoutine, exercises: updated });
                          }}
                          className="w-12 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-center text-neutral-100 font-mono"
                          title="Sets"
                        />
                        <span className="text-xs text-neutral-500">sets</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={item.targetReps}
                          onChange={(e) => {
                            const updated = [...editingRoutine.exercises];
                            updated[idx].targetReps = e.target.value;
                            setEditingRoutine({ ...editingRoutine, exercises: updated });
                          }}
                          className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-center text-neutral-100 font-mono"
                          title="Rep Range"
                        />
                        <span className="text-xs text-neutral-500">reps</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingRoutine.exercises.filter((_, i) => i !== idx);
                          setEditingRoutine({ ...editingRoutine, exercises: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRoutine(null)}
                className="py-1.5 px-3 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditingRoutine}
                className="py-1.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
              >
                Save Routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Starter Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-100">Load Routine Template</h3>
                <p className="text-xs text-neutral-400">
                  Select a classic program split to import into your routines
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatesModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {STARTER_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-3.5 bg-neutral-800/60 border border-neutral-700/60 rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">{tmpl.name}</h4>
                    <p className="text-[11px] text-neutral-400 capitalize mt-0.5">
                      {tmpl.targetMuscles.join(', ')} · {tmpl.exercises.length} exercises
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      saveRoutine({ ...tmpl, id: `routine-${Date.now()}` });
                      setShowTemplatesModal(false);
                    }}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors shrink-0 shadow-sm"
                  >
                    Import Routine
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
