import { useEffect, useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { userService, type UserProfile } from '../services/userService';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getLoggedInUser = async () => {
    try {
      const data = await userService.getUserProfile();
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        // User not found in our DB
        throw error;
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Reset states
      setUserProfile(null);
      setError(null);
      setLoading(true);

      try {
        const profile = await getLoggedInUser();
        setUserProfile(profile);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          // User doesn't exist in backend (404 is expected for users without profile)
          setUserProfile(null);
          setError(null);
        } else {
          // Other errors (401, 500, etc.)
          setError(err instanceof Error ? err : new Error('Unknown error'));
          console.error('Error fetching user profile:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const hasProfile = userProfile !== null;

  return {
    userProfile,
    loading,
    error,
    hasProfile,
  };
};
