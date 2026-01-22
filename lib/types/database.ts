export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  quizzes_done: number;
  day_streak: number;
  updated_at: string;
};

export type StudySet = {
  id: string;
  user_id: string;
  title: string;
  subject: string | null;
  card_count: number;
  created_at: string;
  updated_at: string;
};
