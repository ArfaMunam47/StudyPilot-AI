import { useState, useEffect } from 'react';
import { Storage } from '@/utils/storage';

export interface UserProfile {
  fullName: string;
  email: string;
  educationLevel: string;
  grade?: string;
  fieldOfStudy?: string;
  course?: string;
  onboardingComplete: boolean;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const data = await Storage.getItem<UserProfile>(Storage.KEYS.USER_PROFILE);
    setProfile(data);
    setLoading(false);
  }

  async function saveProfile(profileData: UserProfile) {
    await Storage.setItem(Storage.KEYS.USER_PROFILE, profileData);
    setProfile(profileData);
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    const current = await Storage.getItem<UserProfile>(Storage.KEYS.USER_PROFILE);
    if (!current) return;
    const updated = { ...current, ...updates };
    await Storage.setItem(Storage.KEYS.USER_PROFILE, updated);
    setProfile(updated);
  }

  return { profile, loading, saveProfile, updateProfile, refresh: loadProfile };
}
