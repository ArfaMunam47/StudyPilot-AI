import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROFILE: '@studypilot_user_profile',
  ONBOARDING_COMPLETE: '@studypilot_onboarding_complete',
  ASSIGNMENTS: '@studypilot_assignments',
  STUDY_PLANS: '@studypilot_study_plans',
  FLASHCARDS: '@studypilot_flashcards',
  QUIZZES: '@studypilot_quizzes',
  NOTES: '@studypilot_notes',
  STREAK: '@studypilot_streak',
  XP: '@studypilot_xp',
  THEME: '@studypilot_theme',
  NOTIFICATIONS: '@studypilot_notifications',
  CHAT_HISTORY: '@studypilot_chat_history',
};

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch {}
}

export const Storage = {
  KEYS,
  getItem,
  setItem,
  removeItem,
  clearAll,
};
