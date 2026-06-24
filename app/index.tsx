import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function Index() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return null;
  }

  if (!profile || !profile.onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
