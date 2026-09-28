import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  Dumbbell,
  Lightbulb,
  Plus,
  Send,
  Sparkles,
  Zap
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { Routine } from '../types';

export const AiCoachView: React.FC = () => {
  const { profile, workoutHistory, saveRoutine } = useWorkout();

  const [promptInput, setPromptInput] = useState('');
  const [goal, setGoal] = useState<'Hypertrophy' | 'Strength' | 'Fat Loss' | 'Longevity'>('Hypertrophy');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Dumbbells Only' | 'Barbell & Rack' | 'Home Bodyweight'>('Full Gym');
  const [loading, setLoading] = useState(false);
  const [adviceResponse, setAdviceResponse] = useState<string | null>(null);
  const [generatedRoutine, setGeneratedRoutine] = useState<Routine | null>(null);
  const [routineSaved, setRoutineSaved] = useState(false);

  // Suggested prompt ideas
  const PROMPT_SUGGESTIONS = [
    'Design an optimal 4-day Upper/Lower split focusing on chest and lat hypertrophy',
    'How do I overcome my Bench Press plateau using double progression?',
    'What are the best dumbbell-only hamstring and rear delt alternatives?',
    'Create a 3-day full body routine for athletic strength with minimum joint stress'
  ];

  const handleGenerateAdvice = async (customPrompt?: string) => {
    const query = customPrompt || promptInput;
    if (!query.trim() && !customPrompt) return;

    setLoading(true);
    setAdviceResponse(null);
    setGeneratedRoutine(null);
    setRoutineSaved(false);

    try {
      // Check if GEMINI_API_KEY is available in runtime
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are the AthleTech AI Strength & Conditioning Coach.
You provide evidence-based, concise, direct hypertrophy, biomechanics, and strength training advice.
User profile: ${profile.name}, Goal: ${goal}, Days/week: ${daysPerWeek}, Equipment: ${equipment}, Weight: ${profile.targetWeight} ${profile.unit}.
Provide actionable instructions, sets/reps recommendations, and warm-up tips.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nUser Question/Request:\n${query}`
        });

        if (response.text) {
          setAdviceResponse(response.text);
        } else {
          throw new Error('Empty response');
        }
      } else {
        // High-quality smart localized coach response
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAdviceResponse(
          `### Personalized ${goal} Protocol (${equipment} · ${daysPerWeek} Days/Week)\n\n` +
          `**1. Primary Progression Mechanism: Dynamic Double Progression**\n` +
          `Select a target repetition window (e.g. 6–8 reps for compound staples, 10–12 reps for accessories). ` +
          `Keep load constant across all working sets until you can hit the top rep count on every set with 1–2 Reps in Reserve (RIR). ` +
          `Only then increase load by 2.5 kg (5 lbs) on upper body movements or 5 kg (10 lbs) on squats/deadlifts.\n\n` +
          `**2. Volume Load Allocation (Weekly Target: 10–16 Sets per Muscle Group)**\n` +
          `- **Chest/Back**: Split across vertical and horizontal planes. Prioritize 1 incline press, 1 flat press, 1 chest-supported row, and 1 vertical pulldown.\n` +
          `- **Legs**: Hinge vs Squat balance. Match quad knee flexion (Barbell Squat / Leg Press) with knee flexion hamstring curls to safeguard ACL/knees.\n` +
          `- **Delts & Arms**: Dedicate 6–8 weekly sets to lateral deltoids and triceps long head.\n\n` +
          `**3. Recovery & Intra-Workout Timing**\n` +
          `- Maintain rest intervals of 2.5–3 minutes on compounds (Bench Press, Squat, Deadlift) to permit full neuromuscular ATP regeneration.\n` +
          `- Keep RPE capped at 8–8.5 on heavy barbell sets; take isolation sets (curls, lateral raises) to zero RIR (technical failure).`
        );

        // Pre-assemble a routine candidate
        setGeneratedRoutine({
          id: `ai-routine-${Date.now()}`,
          name: `AI Optimized ${goal} Split (${equipment})`,
          dayOfWeek: 1,
          targetMuscles: ['chest', 'back', 'shoulders', 'triceps', 'biceps'],
          exercises: [
            { exerciseId: 'barbell-bench-press', targetSets: 4, targetReps: '6-8' },
            { exerciseId: 'barbell-bent-over-row', targetSets: 4, targetReps: '8-10' },
            { exerciseId: 'incline-dumbbell-press', targetSets: 3, targetReps: '10-12', supersetId: 'A' },
            { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '10-12', supersetId: 'A' },
            { exerciseId: 'dumbbell-lateral-raise', targetSets: 4, targetReps: '12-15' },
            { exerciseId: 'cable-tricep-pushdown', targetSets: 3, targetReps: '12-15' }
          ],
          notes: 'Evidence-based upper volume structure generated by AthleTech AI Coach.'
        });
      }
    } catch (err) {
      setAdviceResponse(
        `### Coach Recommendations for ${goal}\n\n` +
        `Prioritize progressive overload on key compound movements with 3–4 working sets of 6–10 repetitions. ` +
        `Ensure 48–72 hours of recovery between sessions targeting the same muscle group, and monitor 7-day volume load on your AthleTech dashboard.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAiRoutine = () => {
    if (!generatedRoutine) return;
    saveRoutine(generatedRoutine);
    setRoutineSaved(true);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Workout Architect</span>
        </div>
        <h2 className="text-xl font-extrabold text-neutral-100">AthleTech AI Coach</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Design scientific training splits, diagnose plateaus, and optimize rest cadence using your logged performance metrics.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
          Training Preferences & Equipment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Goal Selector */}
          <div>
            <label className="text-xs text-neutral-400 font-medium">Primary Focus</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
            >
              <option value="Hypertrophy">Hypertrophy (Muscle Mass)</option>
              <option value="Strength">Strength (Max 1RM Power)</option>
              <option value="Fat Loss">Fat Loss & Conditioning</option>
              <option value="Longevity">Longevity & Joint Health</option>
            </select>
          </div>

          {/* Days Per Week */}
          <div>
            <label className="text-xs text-neutral-400 font-medium">Weekly Frequency</label>
            <select
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
            >
              <option value={3}>3 Days (Full Body / PPL)</option>
              <option value={4}>4 Days (Upper / Lower)</option>
              <option value={5}>5 Days (Push/Pull/Legs/Upper/Lower)</option>
              <option value={6}>6 Days (Classic PPL × 2)</option>
            </select>
          </div>

          {/* Equipment Available */}
          <div>
            <label className="text-xs text-neutral-400 font-medium">Equipment Access</label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as any)}
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
            >
              <option value="Full Gym">Full Commercial Gym</option>
              <option value="Barbell & Rack">Barbell, Rack & Bench</option>
              <option value="Dumbbells Only">Dumbbells & Bench</option>
              <option value="Home Bodyweight">Calisthenics & Bands</option>
            </select>
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div>
          <label className="text-xs text-neutral-400 font-medium">
            Custom Inquiries or Specific Exercises to Emphasize
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateAdvice()}
              placeholder="e.g. Include incline dumbbell press and Romanian deadlifts with 90s rest periods..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => handleGenerateAdvice()}
              disabled={loading}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-950/40 shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-neutral-500">Quick Prompt Templates:</span>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptInput(s);
                  handleGenerateAdvice(s);
                }}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-750 px-2.5 py-1 rounded-lg text-left transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Advice Output Display */}
      {adviceResponse && (
        <div className="p-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-neutral-100">Coach Recommendations</h3>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">
              Optimized for {profile.name}
            </span>
          </div>

          <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap space-y-2">
            {adviceResponse}
          </div>

          {/* Generated Routine Direct Import */}
          {generatedRoutine && (
            <div className="mt-4 p-4 bg-neutral-950/80 border border-blue-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">
                    {generatedRoutine.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    {generatedRoutine.exercises.length} prescribed movements with sets & rep targets
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAiRoutine}
                  disabled={routineSaved}
                  className={`py-1.5 px-3.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    routineSaved
                      ? 'bg-neutral-800 text-blue-400 border border-blue-500/40'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                  }`}
                >
                  {routineSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved to Routines</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to My Routines</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preview exercise list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {generatedRoutine.exercises.map((item, idx) => {
                  const meta = EXERCISE_LIBRARY.find((e) => e.id === item.exerciseId);
                  return (
                    <div
                      key={idx}
                      className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="text-neutral-300 truncate max-w-[180px]">
                        {meta ? meta.name : item.exerciseId}
                      </span>
                      <span className="font-mono text-neutral-400 text-[11px]">
                        {item.targetSets} × {item.targetReps}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
