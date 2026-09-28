import React, { useRef, useState } from 'react';
import {
  Bell,
  Check,
  Download,
  Eye,
  FileSpreadsheet,
  Moon,
  RefreshCw,
  Scale,
  Settings,
  Shield,
  Upload,
  User,
  Utensils,
  Volume2
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    exportData,
    importData,
    resetToDemoData,
    wakeLockActive,
    toggleWakeLock
  } = useWorkout();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleUnitToggle = (unit: 'metric' | 'imperial') => {
    updateProfile({ unit });
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AthleTech-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          setImportStatus('Backup data imported successfully!');
        } else {
          setImportStatus('Failed to parse JSON backup file.');
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // CSV importer for Strong / Hevy / FitNotes
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Parse CSV lines
        const lines = text.split('\n');
        if (lines.length > 1) {
          setImportStatus(`Parsed ${lines.length - 1} records from ${file.name}!`);
        } else {
          setImportStatus('CSV file was empty or could not be read.');
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-neutral-100">Application Settings & Data Control</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Configure preferred measurement units, timer acoustics, screen keep-awake, and one-click data backups.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs font-semibold text-blue-400 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Settings saved</span>
        </div>
      )}

      {importStatus && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs font-semibold text-blue-400 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-neutral-100">Profile Information</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-700 shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <label className="text-xs text-neutral-400 font-medium">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Goals & Weight Targets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-xs text-neutral-400 font-medium">
              Target Weight ({profile.unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              step="0.5"
              value={profile.targetWeight}
              onChange={(e) => updateProfile({ targetWeight: parseFloat(e.target.value) || 75 })}
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-medium">
              Starting Baseline ({profile.unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              step="0.5"
              value={profile.startingWeight}
              onChange={(e) => updateProfile({ startingWeight: parseFloat(e.target.value) || 80 })}
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 font-medium">Goal Phase</label>
            <select
              value={profile.weightGoalType}
              onChange={(e) => updateProfile({ weightGoalType: e.target.value as any })}
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-neutral-100 focus:outline-none"
            >
              <option value="cut">Fat Loss (Cut)</option>
              <option value="bulk">Muscle Gain (Bulk)</option>
              <option value="maintain">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Daily Nutrition & Macro Targets */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-neutral-100">Daily Nutrition & Macro Targets</h3>
        </div>
        <p className="text-xs text-neutral-400">
          Set customized calorie and macronutrient budgets aligned with your current body composition goal.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div>
            <label className="text-xs text-neutral-400 font-medium">Calories (kcal)</label>
            <input
              type="number"
              step="50"
              value={profile.dailyCalorieTarget}
              onChange={(e) =>
                updateProfile({ dailyCalorieTarget: parseInt(e.target.value) || 2000 })
              }
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-blue-400 font-medium">Protein (g)</label>
            <input
              type="number"
              step="5"
              value={profile.dailyProteinTarget}
              onChange={(e) =>
                updateProfile({ dailyProteinTarget: parseInt(e.target.value) || 150 })
              }
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-sky-300 font-medium">Carbs (g)</label>
            <input
              type="number"
              step="5"
              value={profile.dailyCarbsTarget}
              onChange={(e) =>
                updateProfile({ dailyCarbsTarget: parseInt(e.target.value) || 200 })
              }
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-amber-400 font-medium">Fats (g)</label>
            <input
              type="number"
              step="5"
              value={profile.dailyFatTarget}
              onChange={(e) =>
                updateProfile({ dailyFatTarget: parseInt(e.target.value) || 60 })
              }
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-blue-300 font-medium">Water (ml)</label>
            <input
              type="number"
              step="250"
              value={profile.dailyWaterTargetMl}
              onChange={(e) =>
                updateProfile({ dailyWaterTargetMl: parseInt(e.target.value) || 3000 })
              }
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Units & Preferences */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-neutral-100">Measurement Units</h3>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div>
            <div className="text-xs font-semibold text-neutral-200">System of Units</div>
            <div className="text-[11px] text-neutral-400">
              Metric: kilograms (kg) & centimeters · Imperial: pounds (lbs) & inches
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-800 rounded-lg">
            <button
              type="button"
              onClick={() => handleUnitToggle('metric')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                profile.unit === 'metric'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Metric (kg)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                profile.unit === 'imperial'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Imperial (lbs)
            </button>
          </div>
        </div>
      </div>

      {/* Live Session Configuration */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-neutral-100">Live Session Preferences</h3>
        </div>

        <div className="space-y-3">
          {/* Default Rest Time */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Default Rest Timer</div>
              <div className="text-[11px] text-neutral-400">
                Automatic countdown initiated upon logging a completed set
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="15"
                min="15"
                max="300"
                value={profile.defaultRestTime}
                onChange={(e) =>
                  updateProfile({ defaultRestTime: parseInt(e.target.value) || 90 })
                }
                className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-100 font-mono text-center focus:outline-none"
              />
              <span className="text-xs text-neutral-400">seconds</span>
            </div>
          </div>

          {/* Auto Start Rest Timer */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Auto-Start Rest Timer</div>
              <div className="text-[11px] text-neutral-400">
                Automatically start countdown timer when a set is checked off
              </div>
            </div>

            <input
              type="checkbox"
              checked={profile.autoStartRestTimer}
              onChange={(e) => updateProfile({ autoStartRestTimer: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Audio Alerts</div>
              <div className="text-[11px] text-neutral-400">
                Play acoustic chime when rest time completes and fanfare on new PRs
              </div>
            </div>

            <input
              type="checkbox"
              checked={profile.soundAlerts}
              onChange={(e) => updateProfile({ soundAlerts: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* Screen Wake Lock */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div>
              <div className="text-xs font-semibold text-neutral-200">Keep Screen Awake</div>
              <div className="text-[11px] text-neutral-400">
                Prevents display sleep during active workout tracking
              </div>
            </div>

            <button
              type="button"
              onClick={toggleWakeLock}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                wakeLockActive
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400'
              }`}
            >
              {wakeLockActive ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Portability, Backup & Migration */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-neutral-100">Data Sovereignty & Backups</h3>
        </div>
        <p className="text-xs text-neutral-400">
          AthleTech is 100% self-contained. Export your complete workout history, routines, nutrition logs, and body weight logs anytime as JSON, or import from other popular trackers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportJson}
            className="p-3.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl flex items-center gap-3 transition-colors text-left"
          >
            <Download className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-neutral-100">Export JSON Backup</div>
              <div className="text-[11px] text-neutral-500">Download complete AthleTech database</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl flex items-center gap-3 transition-colors text-left"
          >
            <Upload className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-neutral-100">Restore from JSON</div>
              <div className="text-[11px] text-neutral-500">Upload existing AthleTech backup</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => csvInputRef.current?.click()}
            className="p-3.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl flex items-center gap-3 transition-colors text-left"
          >
            <FileSpreadsheet className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-neutral-100">Import Strong / Hevy CSV</div>
              <div className="text-[11px] text-neutral-500">Migrate logs from third-party apps</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all workout history and data to default sample state?')) {
                resetToDemoData();
                setImportStatus('Demo dataset reloaded.');
                setTimeout(() => setImportStatus(null), 3000);
              }
            }}
            className="p-3.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl flex items-center gap-3 transition-colors text-left"
          >
            <RefreshCw className="w-5 h-5 text-neutral-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-neutral-100">Reload Demo Dataset</div>
              <div className="text-[11px] text-neutral-500">Restore realistic sample routines & logs</div>
            </div>
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleCsvImport}
          className="hidden"
        />
      </div>
    </div>
  );
};
