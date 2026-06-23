-- GymTrack Extended Exercise Library
-- Run in Supabase SQL Editor AFTER 002_seed_exercises.sql
-- Safe to re-run: ON CONFLICT (name) DO NOTHING skips duplicates

INSERT INTO exercises (name, muscle_group, equipment) VALUES

  -- =====================
  -- CHEST
  -- =====================
  ('Flat Dumbbell Press',          'Chest',       'Dumbbell'),
  ('Decline Barbell Press',        'Chest',       'Barbell'),
  ('Decline Dumbbell Press',       'Chest',       'Dumbbell'),
  ('Low Cable Fly',                'Chest',       'Cable'),
  ('High Cable Fly',               'Chest',       'Cable'),
  ('Push-Up',                      'Chest',       'Bodyweight'),
  ('Dumbbell Pullover',            'Chest',       'Dumbbell'),
  ('Smith Machine Bench Press',    'Chest',       'Machine'),
  ('Landmine Press',               'Chest',       'Barbell'),

  -- =====================
  -- BACK
  -- =====================
  ('Dumbbell Row',                 'Back',        'Dumbbell'),
  ('Pendlay Row',                  'Back',        'Barbell'),
  ('Meadows Row',                  'Back',        'Barbell'),
  ('Straight Arm Pulldown',        'Back',        'Cable'),
  ('Rack Pull',                    'Back',        'Barbell'),
  ('Chin-Up',                      'Back',        'Bodyweight'),
  ('Machine Row',                  'Back',        'Machine'),
  ('High Row',                     'Back',        'Cable'),
  ('Chest Supported T-Bar Row',    'Back',        'Barbell'),
  ('Kroc Row',                     'Back',        'Dumbbell'),
  ('Seal Row',                     'Back',        'Barbell'),
  ('Cable Pullover',               'Back',        'Cable'),

  -- =====================
  -- SHOULDERS
  -- =====================
  ('Dumbbell OHP',                 'Shoulders',   'Dumbbell'),
  ('Machine Shoulder Press',       'Shoulders',   'Machine'),
  ('Front Raise',                  'Shoulders',   'Dumbbell'),
  ('Cable Front Raise',            'Shoulders',   'Cable'),
  ('Cable Lateral Raise',          'Shoulders',   'Cable'),
  ('Machine Lateral Raise',        'Shoulders',   'Machine'),
  ('Upright Row',                  'Shoulders',   'Barbell'),
  ('Dumbbell Upright Row',         'Shoulders',   'Dumbbell'),
  ('Push Press',                   'Shoulders',   'Barbell'),
  ('Seated OHP',                   'Shoulders',   'Barbell'),

  -- =====================
  -- REAR DELT
  -- =====================
  ('Rear Delt Machine',            'Rear Delt',   'Machine'),
  ('Cable Rear Delt Fly',          'Rear Delt',   'Cable'),
  ('Band Pull Apart',              'Rear Delt',   'Equipment'),
  ('Prone Rear Delt Raise',        'Rear Delt',   'Dumbbell'),

  -- =====================
  -- TRAPS
  -- =====================
  ('Barbell Shrug',                'Traps',       'Barbell'),
  ('Dumbbell Shrug',               'Traps',       'Dumbbell'),
  ('Cable Shrug',                  'Traps',       'Cable'),
  ('Trap Bar Shrug',               'Traps',       'Barbell'),
  ('Farmer Carry',                 'Traps',       'Dumbbell'),

  -- =====================
  -- BICEPS
  -- =====================
  ('Cable Curl',                   'Biceps',      'Cable'),
  ('EZ Bar Curl',                  'Biceps',      'Barbell'),
  ('Concentration Curl',           'Biceps',      'Dumbbell'),
  ('Spider Curl',                  'Biceps',      'Dumbbell'),
  ('Machine Curl',                 'Biceps',      'Machine'),
  ('Cross Body Curl',              'Biceps',      'Dumbbell'),
  ('Cable Hammer Curl',            'Biceps',      'Cable'),
  ('Drag Curl',                    'Biceps',      'Barbell'),
  ('Bayesian Curl',                'Biceps',      'Cable'),

  -- =====================
  -- TRICEPS
  -- =====================
  ('Cable Overhead Tricep Extension', 'Triceps',  'Cable'),
  ('Tricep Kickback',              'Triceps',     'Dumbbell'),
  ('Tricep Dip',                   'Triceps',     'Bodyweight'),
  ('Diamond Push-Up',              'Triceps',     'Bodyweight'),
  ('Machine Tricep Extension',     'Triceps',     'Machine'),
  ('Rope Pushdown',                'Triceps',     'Cable'),
  ('Single Arm Tricep Pushdown',   'Triceps',     'Cable'),
  ('JM Press',                     'Triceps',     'Barbell'),
  ('Tate Press',                   'Triceps',     'Dumbbell'),

  -- =====================
  -- QUADS / LEGS
  -- =====================
  ('Front Squat',                  'Quads',       'Barbell'),
  ('Goblet Squat',                 'Legs',        'Dumbbell'),
  ('Box Squat',                    'Legs',        'Barbell'),
  ('Smith Machine Squat',          'Legs',        'Machine'),
  ('Step-Up',                      'Legs',        'Dumbbell'),
  ('Reverse Lunge',                'Legs',        'Dumbbell'),
  ('Sissy Squat',                  'Quads',       'Bodyweight'),
  ('Leg Press (Wide Stance)',      'Quads',       'Machine'),
  ('Single Leg Leg Press',         'Quads',       'Machine'),
  ('Pendulum Squat',               'Quads',       'Machine'),
  ('Cyclist Squat',                'Quads',       'Barbell'),

  -- =====================
  -- HAMSTRINGS
  -- =====================
  ('Stiff Leg Deadlift',           'Hamstrings',  'Barbell'),
  ('Good Morning',                 'Hamstrings',  'Barbell'),
  ('Nordic Curl',                  'Hamstrings',  'Bodyweight'),
  ('Lying Leg Curl',               'Hamstrings',  'Machine'),
  ('Seated Leg Curl',              'Hamstrings',  'Machine'),
  ('Cable Pull Through',           'Hamstrings',  'Cable'),
  ('Single Leg RDL',               'Hamstrings',  'Dumbbell'),
  ('Glute Ham Raise',              'Hamstrings',  'Equipment'),

  -- =====================
  -- GLUTES
  -- =====================
  ('Cable Kickback',               'Glutes',      'Cable'),
  ('Sumo Deadlift',                'Glutes',      'Barbell'),
  ('Single Leg Hip Thrust',        'Glutes',      'Bodyweight'),
  ('Frog Pump',                    'Glutes',      'Bodyweight'),
  ('Banded Hip Abduction',         'Glutes',      'Equipment'),
  ('Donkey Kickback',              'Glutes',      'Cable'),
  ('Smith Machine Hip Thrust',     'Glutes',      'Machine'),
  ('45 Degree Hyperextension',     'Glutes',      'Equipment'),

  -- =====================
  -- CALVES
  -- =====================
  ('Standing Barbell Calf Raise',  'Calves',      'Barbell'),
  ('Donkey Calf Raise',            'Calves',      'Machine'),
  ('Single Leg Calf Raise',        'Calves',      'Bodyweight'),
  ('Leg Press Calf Raise',         'Calves',      'Machine'),
  ('Tibialis Raise',               'Calves',      'Bodyweight'),

  -- =====================
  -- CORE / ABS
  -- =====================
  ('Crunch',                       'Core',        'Bodyweight'),
  ('Sit-Up',                       'Core',        'Bodyweight'),
  ('Leg Raise',                    'Core',        'Bodyweight'),
  ('Decline Crunch',               'Core',        'Bodyweight'),
  ('Side Plank',                   'Core',        'Bodyweight'),
  ('Bicycle Crunch',               'Core',        'Bodyweight'),
  ('V-Up',                         'Core',        'Bodyweight'),
  ('Dragon Flag',                  'Core',        'Bodyweight'),
  ('Pallof Press',                 'Core',        'Cable'),
  ('Landmine Rotation',            'Core',        'Barbell'),
  ('Dead Bug',                     'Core',        'Bodyweight'),
  ('Toe Touch',                    'Core',        'Bodyweight'),
  ('Woodchop',                     'Core',        'Cable'),
  ('Medicine Ball Slam',           'Core',        'Equipment'),
  ('Cable Crunch Kneeling',        'Core',        'Cable'),

  -- =====================
  -- FOREARMS
  -- =====================
  ('Wrist Curl',                   'Forearms',    'Barbell'),
  ('Reverse Wrist Curl',           'Forearms',    'Barbell'),
  ('Plate Pinch',                  'Forearms',    'Equipment'),
  ('Reverse Curl',                 'Forearms',    'Barbell'),
  ('Zottman Curl',                 'Forearms',    'Dumbbell'),

  -- =====================
  -- CARDIO / CONDITIONING
  -- =====================
  ('Treadmill Run',                'Cardio',      'Machine'),
  ('Rowing Machine',               'Cardio',      'Machine'),
  ('Stationary Bike',              'Cardio',      'Machine'),
  ('Stairmaster',                  'Cardio',      'Machine'),
  ('Jump Rope',                    'Cardio',      'Equipment'),
  ('Battle Ropes',                 'Cardio',      'Equipment'),
  ('Sled Push',                    'Cardio',      'Equipment'),
  ('Box Jump',                     'Legs',        'Bodyweight'),

  -- =====================
  -- FULL BODY / POWER
  -- =====================
  ('Trap Bar Deadlift',            'Back',        'Barbell'),
  ('Power Clean',                  'Full Body',   'Barbell'),
  ('Hang Clean',                   'Full Body',   'Barbell'),
  ('Kettlebell Swing',             'Full Body',   'Equipment'),
  ('Thruster',                     'Full Body',   'Barbell'),
  ('Burpee',                       'Full Body',   'Bodyweight')

ON CONFLICT (name) DO NOTHING;
