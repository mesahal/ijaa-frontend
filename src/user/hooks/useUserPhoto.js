import { useState, useEffect } from 'react';
import { getProfilePhotoUrl  } from '../../services/api/photoApi';

export const useUserPhoto = (userId) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (!userId) {
        console.log('🔍 [useUserPhoto] No userId provided');
        setProfilePhotoUrl(null);
        setError(null);
        return;
      }

      console.log('🔍 [useUserPhoto] Fetching profile photo for userId:', userId);
      setLoading(true);
      setError(null);

      try {
        const result = await getProfilePhotoUrl(userId);
        console.log('🔍 [useUserPhoto] API result:', result);
        
        if (result.exists && result.photoUrl) {
          console.log('✅ [useUserPhoto] Profile photo found:', result.photoUrl);
          setProfilePhotoUrl(result.photoUrl);
        } else {
          console.log('❌ [useUserPhoto] No profile photo found for user');
          setProfilePhotoUrl(null);
        }
      } catch (err) {
        console.error('❌ [useUserPhoto] Error fetching profile photo:', err);
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
