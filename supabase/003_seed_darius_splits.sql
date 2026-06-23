-- Adam Yu's Workout Splits for Darius
-- RUN THIS ONLY AFTER Darius has signed into the app at least once.
-- The webhook must have fired to create his user row first.

DO $$
DECLARE
  darius_id   UUID;
  split_id    UUID;
  day_id      UUID;

  incline_bb    UUID; flat_bb      UUID; inc_db       UUID;
  cable_fly     UUID; dip_id       UUID; pullup_id    UUID;
  bb_row        UUID; cable_row    UUID; lat_pull     UUID;
  face_pull     UUID; bb_curl      UUID; inc_db_curl  UUID;
  hammer_curl   UUID; skull        UUID; tri_push     UUID;
  ohp           UUID; lat_raise    UUID; rear_fly     UUID;
  squat_id      UUID; rdl_id       UUID; leg_press    UUID;
  leg_curl_id   UUID; leg_ext      UUID; hip_thrust   UUID;
  calf_raise    UUID; hang_leg     UUID;
BEGIN

  SELECT id INTO darius_id FROM users WHERE email = 'dariusvlok30@gmail.com';
  IF darius_id IS NULL THEN
    RAISE EXCEPTION 'Darius not found. Sign in first, then run this script.';
  END IF;

  -- Load exercise IDs
  SELECT id INTO incline_bb   FROM exercises WHERE name = 'Incline Barbell Press';
  SELECT id INTO flat_bb      FROM exercises WHERE name = 'Flat Barbell Press';
  SELECT id INTO inc_db       FROM exercises WHERE name = 'Incline Dumbbell Press';
  SELECT id INTO cable_fly    FROM exercises WHERE name = 'Cable Chest Fly';
  SELECT id INTO dip_id       FROM exercises WHERE name = 'Dip';
  SELECT id INTO pullup_id    FROM exercises WHERE name = 'Pull-Up';
  SELECT id INTO bb_row       FROM exercises WHERE name = 'Barbell Row';
  SELECT id INTO cable_row    FROM exercises WHERE name = 'Cable Row';
  SELECT id INTO lat_pull     FROM exercises WHERE name = 'Lat Pulldown';
  SELECT id INTO face_pull    FROM exercises WHERE name = 'Face Pull';
  SELECT id INTO bb_curl      FROM exercises WHERE name = 'Barbell Curl';
  SELECT id INTO inc_db_curl  FROM exercises WHERE name = 'Incline Dumbbell Curl';
  SELECT id INTO hammer_curl  FROM exercises WHERE name = 'Hammer Curl';
  SELECT id INTO skull        FROM exercises WHERE name = 'Skull Crusher';
  SELECT id INTO tri_push     FROM exercises WHERE name = 'Tricep Pushdown';
  SELECT id INTO ohp          FROM exercises WHERE name = 'OHP Barbell';
  SELECT id INTO lat_raise    FROM exercises WHERE name = 'Lateral Raise';
  SELECT id INTO rear_fly     FROM exercises WHERE name = 'Rear Delt Fly';
  SELECT id INTO squat_id     FROM exercises WHERE name = 'Squat';
  SELECT id INTO rdl_id       FROM exercises WHERE name = 'Romanian Deadlift';
  SELECT id INTO leg_press    FROM exercises WHERE name = 'Leg Press';
  SELECT id INTO leg_curl_id  FROM exercises WHERE name = 'Leg Curl';
  SELECT id INTO leg_ext      FROM exercises WHERE name = 'Leg Extension';
  SELECT id INTO hip_thrust   FROM exercises WHERE name = 'Hip Thrust';
  SELECT id INTO calf_raise   FROM exercises WHERE name = 'Calf Raise';
  SELECT id INTO hang_leg     FROM exercises WHERE name = 'Hanging Leg Raise';

  -- ================================
  -- SPLIT 1: PPL — set as ACTIVE
  -- ================================
  INSERT INTO splits (user_id, name, description, days_per_week, is_active)
    VALUES (darius_id, 'Adam Yu — PPL', 'Push/Pull/Legs 6-day beginner split', 6, TRUE)
    RETURNING id INTO split_id;

  -- Push A
  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 1, 'Push A') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, incline_bb,  1, 4, '6-8',  8),
    (day_id, flat_bb,     2, 3, '8-10', 8),
    (day_id, inc_db,      3, 3, '10-12',7),
    (day_id, cable_fly,   4, 3, '12-15',7),
    (day_id, ohp,         5, 3, '8-10', 8),
    (day_id, lat_raise,   6, 4, '15-20',7),
    (day_id, tri_push,    7, 3, '12-15',7);

  -- Pull A
  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 2, 'Pull A') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, pullup_id,   1, 4, '6-8',  8),
    (day_id, bb_row,      2, 3, '8-10', 8),
    (day_id, lat_pull,    3, 3, '10-12',7),
    (day_id, cable_row,   4, 3, '10-12',7),
    (day_id, face_pull,   5, 3, '15-20',7),
    (day_id, bb_curl,     6, 3, '8-10', 8),
    (day_id, hammer_curl, 7, 3, '12-15',7);

  -- Legs A
  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 3, 'Legs A') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  8),
    (day_id, rdl_id,      2, 3, '8-10', 8),
    (day_id, leg_press,   3, 3, '10-12',7),
    (day_id, leg_curl_id, 4, 3, '10-12',7),
    (day_id, leg_ext,     5, 3, '12-15',7),
    (day_id, calf_raise,  6, 4, '15-20',7),
    (day_id, hang_leg,    7, 3, '15',   8);

  -- Push B
  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 4, 'Push B') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, flat_bb,     1, 4, '6-8',  8),
    (day_id, incline_bb,  2, 3, '8-10', 8),
    (day_id, dip_id,      3, 3, '8-12', 8),
    (day_id, cable_fly,   4, 3, '12-15',7),
    (day_id, ohp,         5, 4, '6-8',  8),
    (day_id, lat_raise,   6, 4, '15-20',7),
    (day_id, skull,       7, 3, '10-12',7);

  -- Pull B
  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 5, 'Pull B') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, bb_row,      1, 4, '6-8',  9),
    (day_id, pullup_id,   2, 3, '6-8',  8),
    (day_id, lat_pull,    3, 3, '10-12',7),
    (day_id, cable_row,   4, 3, '10-12',8),
    (day_id, face_pull,   5, 4, '15-20',7),
    (day_id, inc_db_curl, 6, 3, '10-12',7),
    (day_id, hammer_curl, 7, 3, '12-15',7);

  -- Legs B
  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 6, 'Legs B') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  9),
    (day_id, hip_thrust,  2, 3, '8-10', 8),
    (day_id, rdl_id,      3, 3, '8-10', 8),
    (day_id, leg_press,   4, 3, '10-12',7),
    (day_id, leg_curl_id, 5, 3, '10-12',7),
    (day_id, calf_raise,  6, 4, '15-20',7),
    (day_id, hang_leg,    7, 3, '15',   8);

  -- Rest
  INSERT INTO split_days (split_id, day_number, name, is_rest_day) VALUES (split_id, 7, 'Rest', TRUE);

  -- ================================
  -- SPLIT 2: Current Split (4-day)
  -- ================================
  INSERT INTO splits (user_id, name, description, days_per_week)
    VALUES (darius_id, 'Adam Yu — Current Split', 'Chest+Bi / Back+Tri / Legs / Shoulders (arm priority)', 4)
    RETURNING id INTO split_id;

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 1, 'Chest + Biceps') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, incline_bb,  1, 4, '6-8',  8),
    (day_id, flat_bb,     2, 3, '8-10', 8),
    (day_id, inc_db,      3, 3, '10-12',7),
    (day_id, cable_fly,   4, 3, '12-15',7),
    (day_id, bb_curl,     5, 4, '6-8',  8),
    (day_id, inc_db_curl, 6, 3, '10-12',7),
    (day_id, hammer_curl, 7, 3, '12-15',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 2, 'Back + Triceps') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, pullup_id,   1, 4, '6-8',  8),
    (day_id, bb_row,      2, 4, '6-8',  8),
    (day_id, lat_pull,    3, 3, '10-12',7),
    (day_id, cable_row,   4, 3, '10-12',7),
    (day_id, skull,       5, 3, '10-12',8),
    (day_id, tri_push,    6, 3, '12-15',7),
    (day_id, dip_id,      7, 3, '8-12', 8);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 3, 'Legs') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  9),
    (day_id, rdl_id,      2, 3, '8-10', 8),
    (day_id, leg_press,   3, 3, '10-12',7),
    (day_id, leg_curl_id, 4, 3, '12-15',7),
    (day_id, calf_raise,  5, 4, '15-20',7),
    (day_id, hang_leg,    6, 3, '15',   8);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 4, 'Shoulders') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, ohp,         1, 4, '6-8',  9),
    (day_id, lat_raise,   2, 5, '15-20',7),
    (day_id, rear_fly,    3, 4, '15-20',7),
    (day_id, face_pull,   4, 3, '15-20',7),
    (day_id, cable_fly,   5, 3, '12-15',7);

  -- ================================
  -- SPLIT 3: Bro Split (5-day)
  -- ================================
  INSERT INTO splits (user_id, name, description, days_per_week)
    VALUES (darius_id, 'Adam Yu — Bro Split', 'One muscle group per day, 5 days/week', 5)
    RETURNING id INTO split_id;

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 1, 'Chest') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, incline_bb,  1, 4, '6-8',  8),
    (day_id, flat_bb,     2, 3, '8-10', 8),
    (day_id, inc_db,      3, 3, '10-12',7),
    (day_id, cable_fly,   4, 3, '12-15',7),
    (day_id, dip_id,      5, 3, '8-12', 8);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 2, 'Back') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, pullup_id,   1, 4, '6-8',  8),
    (day_id, bb_row,      2, 4, '6-8',  9),
    (day_id, lat_pull,    3, 3, '10-12',7),
    (day_id, cable_row,   4, 3, '10-12',7),
    (day_id, face_pull,   5, 3, '15-20',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 3, 'Shoulders') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, ohp,         1, 4, '6-8',  9),
    (day_id, lat_raise,   2, 5, '15-20',7),
    (day_id, rear_fly,    3, 4, '15-20',7),
    (day_id, face_pull,   4, 3, '15-20',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 4, 'Arms') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, bb_curl,     1, 4, '6-8',  8),
    (day_id, inc_db_curl, 2, 3, '10-12',7),
    (day_id, hammer_curl, 3, 3, '12-15',7),
    (day_id, skull,       4, 3, '10-12',8),
    (day_id, tri_push,    5, 3, '12-15',7),
    (day_id, dip_id,      6, 3, '8-12', 8);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 5, 'Legs') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  9),
    (day_id, rdl_id,      2, 3, '8-10', 8),
    (day_id, leg_press,   3, 3, '10-12',7),
    (day_id, leg_curl_id, 4, 3, '12-15',7),
    (day_id, calf_raise,  5, 4, '15-20',7);

  -- ================================
  -- SPLIT 4: Arnold Split (6-day)
  -- ================================
  INSERT INTO splits (user_id, name, description, days_per_week)
    VALUES (darius_id, 'Adam Yu — Arnold Split', 'Chest+Back / Shoulders+Arms / Legs ×2', 6)
    RETURNING id INTO split_id;

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 1, 'Chest + Back A') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, incline_bb,  1, 4, '6-8',  8),
    (day_id, flat_bb,     2, 3, '8-10', 8),
    (day_id, pullup_id,   3, 4, '6-8',  8),
    (day_id, bb_row,      4, 3, '8-10', 8),
    (day_id, inc_db,      5, 3, '10-12',7),
    (day_id, lat_pull,    6, 3, '10-12',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 2, 'Shoulders + Arms A') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, ohp,         1, 4, '6-8',  9),
    (day_id, lat_raise,   2, 4, '15-20',7),
    (day_id, bb_curl,     3, 4, '6-8',  8),
    (day_id, skull,       4, 3, '10-12',8),
    (day_id, hammer_curl, 5, 3, '12-15',7),
    (day_id, tri_push,    6, 3, '12-15',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 3, 'Legs A') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  9),
    (day_id, rdl_id,      2, 3, '8-10', 8),
    (day_id, leg_press,   3, 3, '10-12',7),
    (day_id, leg_curl_id, 4, 3, '12-15',7),
    (day_id, calf_raise,  5, 4, '15-20',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 4, 'Chest + Back B') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, flat_bb,     1, 4, '6-8',  9),
    (day_id, inc_db,      2, 3, '10-12',7),
    (day_id, dip_id,      3, 3, '8-12', 8),
    (day_id, cable_row,   4, 4, '10-12',7),
    (day_id, face_pull,   5, 3, '15-20',7),
    (day_id, cable_fly,   6, 3, '12-15',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 5, 'Shoulders + Arms B') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, lat_raise,   1, 5, '15-20',8),
    (day_id, rear_fly,    2, 4, '15-20',7),
    (day_id, inc_db_curl, 3, 3, '10-12',7),
    (day_id, hammer_curl, 4, 3, '12-15',7),
    (day_id, tri_push,    5, 4, '12-15',7),
    (day_id, skull,       6, 3, '10-12',8);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 6, 'Legs B') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  9),
    (day_id, hip_thrust,  2, 3, '8-10', 8),
    (day_id, leg_press,   3, 3, '10-12',7),
    (day_id, leg_curl_id, 4, 3, '10-12',7),
    (day_id, leg_ext,     5, 3, '12-15',7),
    (day_id, calf_raise,  6, 4, '15-20',7);

  -- ================================
  -- SPLIT 5: Aesthetics Split (4-day)
  -- ================================
  INSERT INTO splits (user_id, name, description, days_per_week)
    VALUES (darius_id, 'Adam Yu — Aesthetics Split', 'V-taper focused: upper chest, lats, shoulders', 4)
    RETURNING id INTO split_id;

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 1, 'Upper Chest + Shoulders') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, incline_bb,  1, 5, '6-8',  9),
    (day_id, inc_db,      2, 4, '8-10', 8),
    (day_id, ohp,         3, 4, '6-8',  9),
    (day_id, lat_raise,   4, 5, '15-20',8),
    (day_id, cable_fly,   5, 3, '12-15',7),
    (day_id, rear_fly,    6, 3, '15-20',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 2, 'Back + Lats') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, pullup_id,   1, 5, '6-8',  9),
    (day_id, bb_row,      2, 4, '6-8',  8),
    (day_id, lat_pull,    3, 4, '10-12',8),
    (day_id, cable_row,   4, 3, '10-12',7),
    (day_id, face_pull,   5, 4, '15-20',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 3, 'Legs') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, squat_id,    1, 4, '6-8',  9),
    (day_id, rdl_id,      2, 3, '8-10', 8),
    (day_id, leg_press,   3, 3, '10-12',7),
    (day_id, leg_curl_id, 4, 3, '12-15',7),
    (day_id, hip_thrust,  5, 3, '8-10', 8),
    (day_id, calf_raise,  6, 4, '15-20',7);

  INSERT INTO split_days (split_id, day_number, name) VALUES (split_id, 4, 'Arms') RETURNING id INTO day_id;
  INSERT INTO day_exercises (split_day_id, exercise_id, order_index, sets, reps, rpe) VALUES
    (day_id, bb_curl,     1, 4, '6-8',  8),
    (day_id, inc_db_curl, 2, 3, '10-12',7),
    (day_id, hammer_curl, 3, 3, '12-15',7),
    (day_id, skull,       4, 3, '10-12',8),
    (day_id, tri_push,    5, 3, '12-15',7),
    (day_id, hang_leg,    6, 4, '15',   8);

  RAISE NOTICE 'SUCCESS: All 5 Adam Yu splits seeded for Darius!';
END $$;
