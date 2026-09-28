import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  // CHEST
  {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'Barbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    instructions: [
      'Lie flat on the bench with eyes directly under the racked barbell.',
      'Grip the bar slightly wider than shoulder-width, retract your scapula and plant your feet firmly on the ground.',
      'Unrack the bar and bring it under control down to mid-chest/sternum level.',
      'Press explosively upward until your arms are extended, keeping the shoulder blades pinned.'
    ],
    tips: ['Keep elbows tucked at roughly 45–70 degrees, avoiding full 90-degree flare to protect shoulders.']
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Dumbbell',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    instructions: [
      'Set an adjustable bench to an incline of 30–45 degrees.',
      'Kick the dumbbells up with your knees to shoulder height and brace your core.',
      'Press upward in an arc until arms are extended above your upper chest.',
      'Lower under control until you feel a deep stretch in the upper pectorals.'
    ],
    tips: ['Avoid clanking the dumbbells together at the top; focus on squeezing the chest.']
  },
  {
    id: 'cable-chest-flye',
    name: 'Cable Chest Flye',
    category: 'Cable',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    instructions: [
      'Position the cable pulleys at shoulder or slightly higher height with single handles.',
      'Take a slight step forward in a staggered stance and maintain a slight elbow bend.',
      'Bring your hands forward in a hugging motion until the handles meet in front of your chest.',
      'Slowly open your arms back to the starting stretch position under constant cable tension.'
    ],
    tips: ['Keep the bend in your elbows fixed throughout the entire range of motion.']
  },
  {
    id: 'weighted-chest-dip',
    name: 'Chest Dip',
    category: 'Bodyweight',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    instructions: [
      'Grip parallel dip bars and support your body with straight arms.',
      'Lean forward slightly at the torso (roughly 20-30 degrees) to emphasize chest engagement.',
      'Lower your body by bending elbows until shoulders are at or slightly below the elbow joint.',
      'Push upward through your palms back to starting lockout.'
    ],
    tips: ['Keep your chest forward; upright posture shifts tension primarily to triceps.']
  },
  {
    id: 'pec-deck-machine',
    name: 'Pec Deck Machine',
    category: 'Machine',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    instructions: [
      'Adjust seat height so the handles or pads align horizontally with the mid-chest.',
      'Press arms forward toward the centerline, focusing on pecs contraction.',
      'Control the return weight stack slowly without allowing weights to touch.'
    ],
    tips: ['Keep shoulder blades retracted against the back pad throughout.']
  },

  // BACK
  {
    id: 'barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Barbell',
    primaryMuscles: ['back', 'hamstrings', 'glutes'],
    secondaryMuscles: ['forearms', 'core', 'quads'],
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Hinge at the hips, bend knees slightly, and grip the bar just outside your knees.',
      'Flatten your back, pull slack out of the barbell, engage lats.',
      'Drive through your heels and extend hips and knees simultaneously to stand tall.'
    ],
    tips: ['Keep the bar dragging close to your shins and thighs throughout the pull.']
  },
  {
    id: 'barbell-bent-over-row',
    name: 'Barbell Bent-Over Row',
    category: 'Barbell',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms', 'shoulders'],
    instructions: [
      'Hinge forward at the hips with knees slightly bent until torso is roughly 45 degrees to the floor.',
      'Hold bar with an overhand grip slightly wider than shoulders.',
      'Pull the barbell smoothly into your lower ribs/navel while keeping your spine neutral.',
      'Lower the bar with controlled tempo until arms are extended.'
    ],
    tips: ['Avoid using momentum or excessive torso swinging to move the weight.']
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'Cable',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    instructions: [
      'Sit comfortably on the lat pulldown machine with thigh pads secured.',
      'Grip the bar with an overhand wide grip, chest proud, slight lean back.',
      'Pull the bar down toward the upper chest, driving your elbows down and back.',
      'Slowly allow the bar to return to full overhead lat stretch.'
    ],
    tips: ['Initiate the movement by depressing your shoulder blades, not by yanking with your forearms.']
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    category: 'Bodyweight',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'core'],
    instructions: [
      'Grip overhead pull-up bar with hands just outside shoulder width, palms facing away.',
      'From a dead hang, engage your shoulder blades and pull chest upward toward the bar.',
      'Clear your chin over the bar, pause briefly, then lower slowly back to full hang.'
    ],
    tips: ['Keep your core braced and legs steady to eliminate swinging.']
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    category: 'Cable',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    instructions: [
      'Sit with knees slightly flexed, feet secured on footrests, holding V-bar or neutral handle.',
      'With upright posture, pull the attachment directly into your stomach/navel.',
      'Squeeze your shoulder blades together at peak contraction.',
      'Extend arms forward smoothly, feeling the stretch across the mid-back.'
    ],
    tips: ['Do not round your lower back during the forward reach.']
  },
  {
    id: 'single-arm-dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    category: 'Dumbbell',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    instructions: [
      'Place one knee and one hand on a flat bench for torso support.',
      'Hold dumbbell in opposite hand hanging straight down.',
      'Pull dumbbell up in an arc towards your hip pocket, keeping elbow tight to torso.',
      'Lower under control to a full stretch.'
    ],
    tips: ['Pull toward the hip rather than straight up to the chest to maximize lat activation.']
  },

  // SHOULDERS
  {
    id: 'overhead-barbell-press',
    name: 'Overhead Barbell Press (OHP)',
    category: 'Barbell',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    instructions: [
      'Stand with feet shoulder-width, bar resting across front clavicles in front rack position.',
      'Brace glutes and abs tightly to support lower back.',
      'Press barbell straight up overhead, moving head slightly back to clear the bar path.',
      'Lock out overhead with bar directly over mid-foot and shoulder joint.'
    ],
    tips: ['Squeeze glutes hard to prevent hyperextending your lumbar spine.']
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Dumbbell',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Stand or sit tall holding dumbbells at your sides with neutral grip.',
      'With a slight bend in elbows, raise arms out to the sides until parallel to the floor.',
      'Lead with your elbows, keeping wrists level or slightly below elbows.',
      'Lower smoothly through a 2-second negative.'
    ],
    tips: ['Tilt slightly forward at hips (10 degrees) to recruit the lateral deltoid in its optimal plane.']
  },
  {
    id: 'face-pull',
    name: 'Cable Face Pull',
    category: 'Cable',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: ['biceps'],
    instructions: [
      'Attach a rope to the cable pulley at upper chest height.',
      'Hold ends with thumbs pointing backward and step back to create tension.',
      'Pull rope towards your nose/eyes while externally rotating shoulders and separating hands.',
      'Hold peak squeeze for a moment, engaging rear delts and rotator cuffs.'
    ],
    tips: ['One of the best shoulder health and posture exercises; keep weights moderate with strict form.']
  },
  {
    id: 'seated-dumbbell-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    category: 'Dumbbell',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps'],
    instructions: [
      'Sit on an upright 90-degree bench with dumbbells at shoulder level.',
      'Press dumbbells upward until arms are straight overhead.',
      'Lower slowly back to ear/chin level.'
    ],
    tips: ['Keep shoulder blades pressed against the bench pad and avoid flaring elbows completely flat.']
  },

  // LEGS - QUADS, HAMSTRINGS, GLUTES, CALVES
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Barbell',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    instructions: [
      'Position bar comfortably across upper traps (high bar) or rear delts (low bar).',
      'Set stance shoulder-width with toes turned out 15–30 degrees.',
      'Break at hips and knees simultaneously, descending until hip crease is below the top of the knees.',
      'Drive powerfully through mid-foot to stand back up, keeping knees tracking over toes.'
    ],
    tips: ['Take a deep diaphragmatic breath into your belt and brace 360 degrees before descending.']
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Barbell',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back', 'forearms'],
    instructions: [
      'Hold barbell at hip height with soft bend in knees.',
      'Hinge at hips, pushing hips backwards as if touching a wall behind you.',
      'Lower barbell along your legs until you feel a deep stretch in your hamstrings (usually mid-shin).',
      'Drive hips forward to return to standing lockout.'
    ],
    tips: ['Maintain a neutral spine; stop when hips stop traveling backward to prevent lower back strain.']
  },
  {
    id: 'leg-press-machine',
    name: '45° Leg Press',
    category: 'Machine',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    instructions: [
      'Sit in machine with lower back and hips firmly pressed against the seat pad.',
      'Place feet shoulder-width apart in center of sled.',
      'Release safety handles and lower the sled until knees reach approximately 90 degrees.',
      'Press sled back up through whole foot, stopping just short of hyperextending knees.'
    ],
    tips: ['Never let your pelvis peel or lift off the seat pad at the bottom.']
  },
  {
    id: 'walking-dumbbell-lunges',
    name: 'Dumbbell Walking Lunges',
    category: 'Dumbbell',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    instructions: [
      'Hold dumbbells by sides and take a long step forward.',
      'Descend until back knee hovers just above the floor and front thigh is parallel.',
      'Drive through front heel to step forward into the next lunge step.'
    ],
    tips: ['Keep torso upright with eyes focused forward to maintain balance.']
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Leg Curl',
    category: 'Machine',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves'],
    instructions: [
      'Lie face down on the machine with pad positioned against lower Achilles/calf.',
      'Grip side handles and pull heels toward glutes in a controlled curl.',
      'Squeeze hamstrings at the top, then lower under control through full stretch.'
    ],
    tips: ['Avoid letting hips jerk upward off the bench pad when lifting heavy.']
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    category: 'Machine',
    primaryMuscles: ['quads'],
    secondaryMuscles: [],
    instructions: [
      'Align knee joints directly with the machine pivot axis.',
      'Pad should rest against lower shins just above ankles.',
      'Extend legs forward until straight, pause briefly at contraction, and lower slowly.'
    ],
    tips: ['Great for quadriceps isolation; use controlled eccentric tempo.']
  },
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    category: 'Machine',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    instructions: [
      'Place balls of feet on step with heels hanging off edge.',
      'Lower heels down as far as comfortable to achieve full calf stretch.',
      'Drive upward through big toes onto the balls of your feet, holding peak contraction for 1s.'
    ],
    tips: ['Pause for 2 seconds at the bottom stretch to eliminate Achilles tendon elastic recoil.']
  },
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'Barbell',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'quads'],
    instructions: [
      'Sit on the ground with upper back against a bench and padded barbell placed over hips.',
      'Plant feet flat, shoulder-width apart, knees at 90 degrees at top of movement.',
      'Drive through heels to extend hips until thighs and torso form a straight horizontal line.',
      'Squeeze glutes hard at the top and lower back down with control.'
    ],
    tips: ['Keep chin tucked looking forward rather than looking up at ceiling to avoid hyperextending lumbar.']
  },

  // ARMS - BICEPS & TRICEPS & FOREARMS
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    category: 'Barbell',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Stand tall holding barbell with underhand shoulder-width grip.',
      'Keep elbows pinned to your sides and curl the bar up toward shoulders.',
      'Squeeze biceps at the top, then lower with control to full extension.'
    ],
    tips: ['Do not swing your hips or rock your torso to lift the bar.']
  },
  {
    id: 'incline-dumbbell-bicep-curl',
    name: 'Incline Dumbbell Curl',
    category: 'Dumbbell',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Sit on an incline bench set to 45–60 degrees with dumbbells hanging straight down.',
      'Keeping upper arms perpendicular to floor, curl dumbbells upward with supination.',
      'Lower slowly to maximize the long-head stretch.'
    ],
    tips: ['One of the best exercises for targeting the long head of the bicep.']
  },
  {
    id: 'cable-tricep-pushdown',
    name: 'Cable Tricep Pushdown',
    category: 'Cable',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    instructions: [
      'Attach a rope or straight bar to top cable pulley.',
      'Pin elbows to sides of torso with forearms roughly parallel to floor.',
      'Push attachment down until arms are completely extended and triceps are locked out.',
      'Return attachment up to chest level under control.'
    ],
    tips: ['Spread the rope handles apart at bottom lockout for extra lateral head contraction.']
  },
  {
    id: 'skull-crusher-ez-bar',
    name: 'EZ-Bar Skull Crusher',
    category: 'Barbell',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Lie flat on bench holding EZ bar with narrow overhand grip, arms vertical.',
      'Keeping upper arms stationary, bend elbows to lower bar towards crown of head/forehead.',
      'Extend arms back to starting position by contracting triceps.'
    ],
    tips: ['Angle upper arms slightly backwards (10-15 degrees) rather than pure 90 degrees to keep tension on triceps at lockout.']
  },
  {
    id: 'hammer-curl',
    name: 'Dumbbell Hammer Curl',
    category: 'Dumbbell',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: [],
    instructions: [
      'Stand holding dumbbells with palms facing each other (neutral grip).',
      'Curl dumbbells upward while keeping palms facing inward throughout the motion.',
      'Lower back down under full control.'
    ],
    tips: ['Targets brachialis and brachioradialis for forearm and arm thickness.']
  },

  // CORE
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'Bodyweight',
    primaryMuscles: ['core'],
    secondaryMuscles: ['forearms'],
    instructions: [
      'Hang from a pull-up bar with an overhand grip, legs straight.',
      'Brace core and raise legs up in front until parallel to floor or higher.',
      'Lower slowly without allowing your body to swing like a pendulum.'
    ],
    tips: ['Curl your pelvis up towards your chest at the top to fully recruit the abdominal wall.']
  },
  {
    id: 'cable-woodchopper',
    name: 'Cable Woodchopper',
    category: 'Cable',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders'],
    instructions: [
      'Set cable pulley high with a single handle.',
      'Grip handle with both hands, arms extended, standing perpendicular to the cable machine.',
      'Rotate torso and pull cable diagonally downward across your body towards outside knee.',
      'Return smoothly under controlled rotation.'
    ],
    tips: ['Pivot your back foot as you rotate to protect the knee joint.']
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout',
    category: 'Bodyweight',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'back'],
    instructions: [
      'Kneel on a soft mat holding the ab wheel with both hands below shoulders.',
      'Engage abs and slowly roll wheel straight forward until body is near floor.',
      'Use abdominal strength to pull the wheel back to the starting knees-down position.'
    ],
    tips: ['Maintain a slight rounded hollow-body posture in the lower back throughout; do not let hips sag.']
  },

  // CARDIO
  {
    id: 'treadmill-incline-walk',
    name: 'Treadmill Incline Walk',
    category: 'Cardio',
    primaryMuscles: ['cardio', 'calves', 'glutes'],
    secondaryMuscles: ['hamstrings', 'quads'],
    instructions: [
      'Set treadmill incline between 8% and 15% and speed to 4.5–5.5 km/h.',
      'Walk with an upright posture without leaning heavily on handrails.',
      'Maintain steady breathing and strong heel-to-toe stride.'
    ],
    tips: ['Do not hold onto handles if possible; natural arm swing burns more calories and engages core.'],
    isCardio: true
  },
  {
    id: 'concept2-rower',
    name: 'Concept2 Rowing Ergometer',
    category: 'Cardio',
    primaryMuscles: ['cardio', 'back', 'legs' as any],
    secondaryMuscles: ['biceps', 'core'],
    instructions: [
      'Strap feet securely into footplates and set damper between 4 and 6.',
      'Drive powerfully through legs first, then swing torso slightly back, then pull handle to sternum.',
      'Return handle forward past knees before bending knees into catch position.'
    ],
    tips: ['Rowing power ratio is 60% legs, 20% core hinge, 20% arms pull.'],
    isCardio: true
  },
  {
    id: 'stationary-bike',
    name: 'Stationary Cycling',
    category: 'Cardio',
    primaryMuscles: ['cardio', 'quads'],
    secondaryMuscles: ['calves', 'hamstrings'],
    instructions: [
      'Adjust saddle height so knee has a slight bend (25–30 degrees) at bottom of pedal stroke.',
      'Pedal at a smooth cadence of 80–95 RPM with moderate resistance.',
      'Keep shoulders relaxed and breathe rhythmically.'
    ],
    tips: ['Push down through the ball of the foot and pull lightly on the pedal upstroke.'],
    isCardio: true
  }
];
