import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import {
  AlertCircle,
  Barcode,
  Camera,
  Check,
  ChevronRight,
  Flame,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  SwitchCamera,
  Upload,
  Volume2,
  X
} from 'lucide-react';
import { lookupBarcodeNutrition, POPULAR_BARCODES, BarcodeProduct } from '../data/barcodeCatalog';
import { MealType } from '../types';
import { soundManager } from '../utils/fitness';

interface BarcodeScannerModalProps {
  initialMealType?: MealType;
  onAddFood: (mealType: MealType, product: BarcodeProduct, servings: number) => void;
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  initialMealType = 'lunch',
  onAddFood,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMealType);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [retryCount, setRetryCount] = useState<number>(0);
  
  // Scanning state
  const [scanning, setScanning] = useState<boolean>(true);
  const [searchingProduct, setSearchingProduct] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [detectedProduct, setDetectedProduct] = useState<BarcodeProduct | null>(null);
  const [servings, setServings] = useState<string>('1.0');
  const [lookupError, setLookupError] = useState<string | null>(null);

  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  // Initialize camera scanner
  useEffect(() => {
    let isMounted = true;

    async function startScanner() {
      setCameraError(null);
      setCameraActive(false);

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported by your browser.');
        }

        const codeReader = new BrowserMultiFormatReader();
        readerRef.current = codeReader;

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        if (videoRef.current) {
          const controls = await codeReader.decodeFromConstraints(
            constraints,
            videoRef.current,
            (result, error) => {
              if (result && isMounted) {
                const text = result.getText();
                handleBarcodeDetected(text);
              }
            }
          );
          controlsRef.current = controls;
          setCameraActive(true);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Camera initialization error:', err);
          setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or enter barcode manually below.');
        }
      }
    }

    startScanner();

    return () => {
      isMounted = false;
      if (controlsRef.current) {
        try {
          controlsRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [facingMode, retryCount]);

  const handleBarcodeDetected = async (code: string) => {
    if (!code || searchingProduct) return;
    setSearchingProduct(true);
    setLookupError(null);

    // Audio chirp feedback
    soundManager.playBeep(980, 0.12, 'sine');

    try {
      const product = await lookupBarcodeNutrition(code);
      if (product) {
        setDetectedProduct(product);
        setScanning(false);
      } else {
        setLookupError(`Barcode "${code}" was read, but no nutritional data was found. Try a different item or enter manually.`);
      }
    } catch {
      setLookupError('Network error while searching product database.');
    } finally {
      setSearchingProduct(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    handleBarcodeDetected(manualCodeInput.trim());
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSearchingProduct(true);
    setLookupError(null);

    try {
      const codeReader = readerRef.current || new BrowserMultiFormatReader();
      const objectUrl = URL.createObjectURL(file);
      const result = await codeReader.decodeFromImageUrl(objectUrl);
      URL.revokeObjectURL(objectUrl);
      if (result) {
        handleBarcodeDetected(result.getText());
      } else {
        setLookupError('No recognizable barcode detected in photo. Try another angle or enter digits manually.');
      }
    } catch {
      setLookupError('Could not decode barcode from this photo. Make sure the barcode is well-lit and in focus, or type digits.');
    } finally {
      setSearchingProduct(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmAdd = () => {
    if (!detectedProduct) return;
    const serv = parseFloat(servings) || 1.0;
    onAddFood(selectedMealType, detectedProduct, serv);
    onClose();
  };

  const resetToScan = () => {
    setDetectedProduct(null);
    setLookupError(null);
    setScanning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">AthleTech Barcode Scanner</h3>
              <p className="text-[11px] text-neutral-400">Point camera at food packaging UPC/EAN barcode</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Target Selector */}
        <div className="px-4 py-2 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-medium">Add to:</span>
          <div className="flex gap-1">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => (
              <button
                key={meal}
                type="button"
                onClick={() => setSelectedMealType(meal)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  selectedMealType === meal
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {meal}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Camera Viewfinder or Result Preview */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!detectedProduct ? (
            <>
              {/* Hidden file input for photo upload fallback */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageFileChange}
                className="hidden"
              />

              {/* Camera Container */}
              <div className="relative aspect-video sm:aspect-4/3 w-full bg-black rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />

                {/* Reticle targeting overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="relative w-64 h-36 border-2 border-blue-400/80 rounded-2xl shadow-inner">
                      {/* Corner marks */}
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />

                      {/* Laser scanner sweep line */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#3b82f6] animate-pulse absolute top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                {/* Floating camera action buttons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-neutral-200 rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs"
                    title="Upload Barcode Photo"
                  >
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span className="text-[11px] hidden sm:inline">Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                    className="p-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-neutral-200 rounded-xl hover:bg-neutral-800 transition-colors"
                    title="Switch Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                </div>

                {/* Loading / Searching Product indicator */}
                {searchingProduct && (
                  <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-blue-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-semibold text-neutral-200">
                      Querying food database...
                    </span>
                  </div>
                )}

                {/* Error or unsupported camera fallback */}
                {cameraError && (
                  <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Camera className="w-10 h-10 text-neutral-600" />
                    <p className="text-xs text-neutral-300 max-w-xs">{cameraError}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setRetryCount((c) => c + 1)}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-400" />
                        <span>Upload Photo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status or Lookup Error */}
              {lookupError && (
                <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{lookupError}</span>
                </div>
              )}

              {/* Manual Barcode Input */}
              <form onSubmit={handleManualSearch} className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Or Enter Barcode Digits Manually:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCodeInput}
                    onChange={(e) => setManualCodeInput(e.target.value)}
                    placeholder="e.g. 888849000010 (UPC/EAN)"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={searchingProduct}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>

              {/* Quick Sample Barcodes (Simulate scanning real items) */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Test Sample Barcodes (1-Tap):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {POPULAR_BARCODES.map((item) => (
                    <button
                      key={item.barcode}
                      type="button"
                      onClick={() => handleBarcodeDetected(item.barcode)}
                      className="p-2 text-left bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl transition-colors group flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-semibold text-neutral-200 group-hover:text-blue-400 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {item.calories} kcal · {item.protein}g protein
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Product Recognized Card View */
            <div className="p-5 bg-neutral-950 border border-blue-500/50 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2 py-0.5 rounded-full inline-block mb-1.5">
                    Barcode Verified #{detectedProduct.barcode}
                  </span>
                  <h3 className="text-base font-bold text-neutral-100">{detectedProduct.name}</h3>
                  {detectedProduct.brand && (
                    <p className="text-xs text-neutral-400 mt-0.5">{detectedProduct.brand}</p>
                  )}
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Standard serving: {detectedProduct.servingSize}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetToScan}
                  className="py-1 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Rescan</span>
                </button>
              </div>

              {/* Nutrition Facts Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                  <div className="text-[10px] text-neutral-400">Calories</div>
                  <div className="text-lg font-bold font-mono text-neutral-100">
                    {Math.round(detectedProduct.calories * (parseFloat(servings) || 1))}
                  </div>
                  <div className="text-[9px] text-neutral-500">kcal</div>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                  <div className="text-[10px] text-blue-400 font-semibold">Protein</div>
                  <div className="text-lg font-bold font-mono text-blue-400">
                    {Math.round(detectedProduct.protein * (parseFloat(servings) || 1) * 10) / 10}g
                  </div>
                  <div className="text-[9px] text-neutral-500">macro</div>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                  <div className="text-[10px] text-sky-300 font-semibold">Carbs</div>
                  <div className="text-lg font-bold font-mono text-neutral-100">
                    {Math.round(detectedProduct.carbs * (parseFloat(servings) || 1) * 10) / 10}g
                  </div>
                  <div className="text-[9px] text-neutral-500">macro</div>
                </div>

                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-center">
                  <div className="text-[10px] text-amber-400 font-semibold">Fat</div>
                  <div className="text-lg font-bold font-mono text-neutral-100">
                    {Math.round(detectedProduct.fat * (parseFloat(servings) || 1) * 10) / 10}g
                  </div>
                  <div className="text-[9px] text-neutral-500">macro</div>
                </div>
              </div>

              {/* Servings Adjuster */}
              <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-neutral-200">Servings Consumed</div>
                  <div className="text-[11px] text-neutral-500">
                    Number of portions eaten
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="20"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-100 font-mono text-center focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs text-neutral-400 font-mono">portions</span>
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>
                  Log {servings} portion to {selectedMealType.toUpperCase()}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
