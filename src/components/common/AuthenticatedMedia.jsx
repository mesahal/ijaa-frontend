import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { Image as ImageIcon, Video, FileText } from 'lucide-react';
import TokenManager from '../../services/auth/TokenManager';

/**
 * AuthenticatedMedia component that fetches media with proper authorization headers
 * This is needed for post media which requires authentication, unlike profile photos and event banners
 */
const AuthenticatedMedia = forwardRef(({ 
  mediaUrl, 
  mediaType, 
  fileName, 
  alt,
  className = '',
  onError,
  onPlay,
  onPause,
  onTimeUpdate,
  onLoadedMetadata,
  ...props 
}, ref) => {
  const [mediaBlob, setMediaBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!mediaUrl) {
        console.log('🔍 [AuthenticatedMedia] No mediaUrl provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 [AuthenticatedMedia] Starting to fetch media:', mediaUrl);
        setLoading(true);
        setError(null);

        // Get the access token
        const token = TokenManager.getAccessToken();
        if (!token) {
          console.error('❌ [AuthenticatedMedia] No authentication token available');
          throw new Error('No authentication token available');
        }

        console.log('🔑 [AuthenticatedMedia] Token found, making request...');

        // Fetch the media with authorization header
        const response = await fetch(mediaUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📥 [AuthenticatedMedia] Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
        }

        // Convert response to blob
        const blob = await response.blob();
        console.log('🔍 [AuthenticatedMedia] Blob details:', {
          size: blob.size,
          type: blob.type,
          url: URL.createObjectURL(blob)
        });
        
        // Check if the response is actually JSON (error response)
        // Only check for JSON if the content type is explicitly JSON or if it's very small (likely an error)
        if (blob.type === 'application/json' || (blob.size < 100 && blob.type !== 'image/png' && blob.type !== 'image/jpeg' && blob.type !== 'image/gif' && blob.type !== 'image/webp')) {
          const text = await blob.text();
          console.log('❌ [AuthenticatedMedia] Received JSON response instead of media:', text);
          throw new Error(`API returned JSON error instead of media: ${text}`);
        }
        
        const blobUrl = URL.createObjectURL(blob);
        
        console.log('✅ [AuthenticatedMedia] Media fetched successfully, blob URL created:', blobUrl);
        setMediaBlob(blobUrl);
      } catch (err) {
        console.error('❌ [AuthenticatedMedia] Error fetching authenticated media:', err);
        setError(err.message);
        if (onErrorRef.current) {
          try {
            onErrorRef.current(err);
          } catch (cbErr) {
            console.error('❌ [AuthenticatedMedia] onError callback threw:', cbErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();

    // Cleanup blob URL when component unmounts or mediaUrl changes
    return () => {
      if (mediaBlob) {
        URL.revokeObjectURL(mediaBlob);
      }
    };
  }, [mediaUrl]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (mediaBlob) {
        URL.revokeObjectURL(mediaBlob);
      }
    };
  }, [mediaBlob]);

  // Show loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`} {...props}>
        <div className="animate-pulse">
          {mediaType === 'IMAGE' ? (
            <ImageIcon className="h-8 w-8 text-gray-400" />
          ) : mediaType === 'VIDEO' ? (
            <Video className="h-8 w-8 text-gray-400" />
          ) : (
            <FileText className="h-8 w-8 text-gray-400" />
          )}
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !mediaBlob) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-600 ${className}`} {...props}>
        {mediaType === 'IMAGE' ? (
          <ImageIcon className="h-8 w-8 text-gray-400" />
        ) : mediaType === 'VIDEO' ? (
          <Video className="h-8 w-8 text-gray-400" />
        ) : (
          <FileText className="h-8 w-8 text-gray-400" />
        )}
      </div>
    );
  }

  // Render the media
  if (mediaType === 'IMAGE') {
    return (
      <img
        src={mediaBlob}
        alt={alt || fileName || 'Media'}
        className={className}
        onError={(e) => {
          console.error('Error loading image:', e);
          if (onError) {
            onError(e);
          }
        }}
        {...props}
      />
    );
  } else if (mediaType === 'VIDEO') {
    return (
      <video
        ref={ref}
        src={mediaBlob}
        className={className}
        preload="metadata"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onPlay={onPlay}
        onPause={onPause}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onError={(e) => {
          console.error('Error loading video:', e);
          if (onError) {
            onError(e);
          }
        }}
        {...props}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // Fallback for unknown media types
  return (
    <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-600 ${className}`} {...props}>
      <FileText className="h-8 w-8 text-gray-400" />
    </div>
  );
});

AuthenticatedMedia.displayName = 'AuthenticatedMedia';

export default AuthenticatedMedia;
