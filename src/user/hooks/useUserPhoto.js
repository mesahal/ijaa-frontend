import { useState, useEffect } from 'react';
import { getProfilePhotoUrl  } from '../../services/api/photoApi';

export const useUserPhoto = (userId) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!userId) {
        setProfilePhotoUrl(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getProfilePhotoUrl(userId);
        
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
  }, [userId]);

  return {
    profilePhotoUrl,
    loading,
    error,
    hasPhoto: !!profilePhotoUrl
  };
};
