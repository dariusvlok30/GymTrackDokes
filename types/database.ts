export type UserRole = 'admin' | 'user'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type Units = 'metric' | 'imperial'

export interface DbUser {
  id: string
  clerk_id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
  // Profile fields
  gender: 'male' | 'female' | 'other' | null
  date_of_birth: string | null
  height_cm: number | null
  weight_kg: number | null
  activity_level: ActivityLevel | null
  units: Units
  theme: 'dark' | 'light'
  onboarded: boolean
}

export interface Split {
  id: string
  user_id: string
  name: string
  description: string | null
  days_per_week: number | null
  is_active: boolean
  created_at: string
}

export interface SplitDay {
  id: string
  split_id: string
  day_number: number
  name: string
  is_rest_day: boolean
}

export interface Exercise {
  id: string
  name: string
  muscle_group: string | null
  equipment: string | null
}

export interface DayExercise {
  id: string
  split_day_id: string
  exercise_id: string
  order_index: number
  sets: number | null
  reps: string | null
  rpe: number | null
  notes: string | null
  exercise?: Exercise
}

export interface Session {
  id: string
  user_id: string
  split_id: string | null
  split_day_id: string | null
  date: string
  started_at: string
  finished_at: string | null
  duration_min: number | null
  notes: string | null
  is_rest_day: boolean
  split_day?: SplitDay
  split?: Split
}

export interface LoggedSet {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  reps: number | null
  weight: number | null
  unit: string
  rpe: number | null
  created_at: string
  exercise?: Exercise
}

export interface BodyweightLog {
  id: string
  user_id: string
  weight: number
  unit: string
  date: string
  notes: string | null
  created_at: string
}

export interface SplitWithDays extends Split {
  split_days: (SplitDay & { day_exercises: DayExercise[] })[]
}

export interface SessionWithDetails extends Session {
  split?: Split
  split_day?: SplitDay
  logged_sets?: (LoggedSet & { exercise: Exercise })[]
}
