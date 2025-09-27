import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfilePhotoUrl } from '../../services/api/photoApi';

export const useCurrentUserPhoto = () => {
  const { user } = useAuth();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!user?.userId) {
        setProfilePhotoUrl(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getProfilePhotoUrl(user.userId);
        
        if (result.exists && result.photoUrl) {
          setProfilePhotoUrl(result.photoUrl);
        } else {
          setProfilePhotoUrl(null);
        }
      } catch (err) {
        setError(err.message);
        setProfilePhotoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePhoto();
  }, [user?.userId]);

  return {
    profilePhotoUrl,
    loading,
    error,
    hasPhoto: !!profilePhotoUrl
  };
};
