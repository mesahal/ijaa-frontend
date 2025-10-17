import React, { useState, useEffect, useRef } from "react";
import { Camera, X, Upload, Trash2 } from "lucide-react";
import { Button } from "../../components/ui";
import FeatureFlagWrapper from "../../components/layout/FeatureFlagWrapper";
import { uploadProfilePhoto,
  uploadCoverPhoto,
  getProfilePhotoUrl,
  getCoverPhotoUrl,
  deleteProfilePhoto,
  deleteCoverPhoto,
  validateImageFile,
  handlePhotoApiError,
 } from '../../services/api/photoApi';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Simple helper to create a cropped Blob from an HTMLImageElement and a crop rect
const getCroppedBlob = (image, crop, mimeType = 'image/jpeg', quality = 0.92) => {
  return new Promise((resolve, reject) => {
    if (!image || !crop || !crop.width || !crop.height) {
      reject(new Error('Invalid crop'));
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelX = crop.x * scaleX;
    const pixelY = crop.y * scaleY;
    const pixelW = crop.width * scaleX;
    const pixelH = crop.height * scaleY;

    canvas.width = Math.max(1, Math.floor(pixelW));
    canvas.height = Math.max(1, Math.floor(pixelH));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      pixelX,
      pixelY,
      pixelW,
      pixelH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
};

// Custom hook for photo management
export const usePhotoManager = ({ userId, onPhotoUpdate = null, previewMode = false }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Preview state for selected photos before upload
  const [previewProfilePhoto, setPreviewProfilePhoto] = useState(null);
  const [previewCoverPhoto, setPreviewCoverPhoto] = useState(null);
  const [pendingProfileFile, setPendingProfileFile] = useState(null);
  const [pendingCoverFile, setPendingCoverFile] = useState(null);

  // Load existing photos
  useEffect(() => {
    if (userId) {
      console.log('🔄 [usePhotoManager] Loading photos for userId:', userId);
      loadPhotos();
    } else {
      console.log('ℹ️ [usePhotoManager] No userId, setting loading to false');
      setLoading(false);
    }
  }, [userId]);

  const loadPhotos = async () => {
    try {
      console.log('🔄 [usePhotoManager] Starting photo load...');
      setLoading(true);
      setError(null);

      const [profileData, coverData] = await Promise.all([
        getProfilePhotoUrl(userId),
        getCoverPhotoUrl(userId),
      ]);
      
      console.log('📥 [usePhotoManager] Photo data received:', { profileData, coverData });

      // Handle the new response format
      setProfilePhoto({
        photoUrl: profileData.photoUrl,
        hasPhoto: profileData.hasPhoto || profileData.exists || false,
      });
      setCoverPhoto({
        photoUrl: coverData.photoUrl,
        hasPhoto: coverData.hasPhoto || coverData.exists || false,
      });
      console.log('✅ [usePhotoManager] Photos loaded successfully');
    } catch (error) {
      console.error('❌ [usePhotoManager] Failed to load photos:', error);
      setError("Failed to load photos");
    } finally {
      console.log('🏁 [usePhotoManager] Photo load completed, setting loading to false');
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      setLoading(true);
      setError(null);

      validateImageFile(file);

      let result;
      if (type === "profile") {
        result = await uploadProfilePhoto(userId, file);
        setProfilePhoto({ photoUrl: result.fileUrl, hasPhoto: true });
      } else {
        result = await uploadCoverPhoto(userId, file);
        setCoverPhoto({ photoUrl: result.fileUrl, hasPhoto: true });
      }

      // Notify parent component about photo update
      if (onPhotoUpdate) {
        onPhotoUpdate(type, result.fileUrl);
      }

    } catch (error) {
      const errorMessage = handlePhotoApiError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection for preview mode
  const handleFileSelect = (file, type) => {
    try {
      validateImageFile(file);
      
      const previewUrl = URL.createObjectURL(file);
      
      if (type === "profile") {
        setPreviewProfilePhoto(previewUrl);
        setPendingProfileFile(file);
      } else {
        setPreviewCoverPhoto(previewUrl);
        setPendingCoverFile(file);
      }
    } catch (error) {
      const errorMessage = handlePhotoApiError(error);
      setError(errorMessage);
    }
  };

  // Upload pending photos
  const uploadPendingPhotos = async () => {
    const uploads = [];
    
    if (pendingProfileFile) {
      uploads.push(handleFileUpload(pendingProfileFile, "profile"));
    }
    
    if (pendingCoverFile) {
      uploads.push(handleFileUpload(pendingCoverFile, "cover"));
    }
    
    if (uploads.length > 0) {
      await Promise.all(uploads);
    }
    
    // Clear preview state
    clearPreview();
  };

  // Clear preview state
  const clearPreview = () => {
    if (previewProfilePhoto) {
      URL.revokeObjectURL(previewProfilePhoto);
    }
    if (previewCoverPhoto) {
      URL.revokeObjectURL(previewCoverPhoto);
    }
    
    setPreviewProfilePhoto(null);
    setPreviewCoverPhoto(null);
    setPendingProfileFile(null);
    setPendingCoverFile(null);
  };

  // Cancel preview and revert to original photos
  const cancelPreview = () => {
    clearPreview();
  };

  const handleDeletePhoto = async (type) => {
    try {
      setLoading(true);
      setError(null);

      if (type === "profile") {
        await deleteProfilePhoto(userId);
        setProfilePhoto({ photoUrl: null, hasPhoto: false });
      } else {
        await deleteCoverPhoto(userId);
        setCoverPhoto({ photoUrl: null, hasPhoto: false });
      }

      // Notify parent component about photo update
      if (onPhotoUpdate) {
        onPhotoUpdate(type, null);
      }

    } catch (error) {
      const errorMessage = handlePhotoApiError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file, type);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const getPhotoUrl = (type) => {
    if (type === "profile") {
      // Show preview if available, otherwise show current photo
      return previewProfilePhoto || (profilePhoto?.hasPhoto ? profilePhoto.photoUrl : null);
    } else {
      return previewCoverPhoto || (coverPhoto?.hasPhoto ? coverPhoto.photoUrl : null);
    }
  };

  const hasPhoto = (type) => {
    if (type === "profile") {
      return previewProfilePhoto || profilePhoto?.hasPhoto || false;
    } else {
      return previewCoverPhoto || coverPhoto?.hasPhoto || false;
    }
  };

  const hasPendingChanges = () => {
    return pendingProfileFile || pendingCoverFile;
  };

  return {
    profilePhotoUrl: getPhotoUrl("profile"),
    coverPhotoUrl: getPhotoUrl("cover"),
    hasProfilePhoto: hasPhoto("profile"),
    hasCoverPhoto: hasPhoto("cover"),
    loading,
    error,
    handleFileUpload,
    handleFileSelect,
    handleDeletePhoto,
    handleFileInputChange,
    uploadPendingPhotos,
    cancelPreview,
    clearPreview,
    hasPendingChanges: hasPendingChanges(),
    reloadPhotos: loadPhotos,
  };
};

// Profile Photo Upload Button Component
export const ProfilePhotoUploadButton = ({
  userId,
  onPhotoUpdate,
  isEditing = false,
  onFileUpload,
  onFileSelect,
}) => {
  const [showFileInput, setShowFileInput] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ unit: '%', width: 80, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        validateImageFile(file);
      } catch (e) {
        // Fall back to direct handlers with error handled upstream
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        fileRef.current = file;
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
    setShowFileInput(false);
    event.target.value = "";
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop || !completedCrop.width || !completedCrop.height) {
      setShowCrop(false);
      setCropSrc(null);
      return;
    }
    const srcFile = fileRef.current;
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop, srcFile?.type || 'image/jpeg');
      const croppedFile = new File([blob], srcFile?.name || 'profile.jpg', { type: blob.type });
      if (onFileSelect) {
        onFileSelect(croppedFile, "profile");
      } else if (onFileUpload) {
        onFileUpload(croppedFile, "profile");
      } else if (onPhotoUpdate) {
        onPhotoUpdate("profile", croppedFile);
      }
    } finally {
      setShowCrop(false);
      setCropSrc(null);
      setCompletedCrop(null);
      setCrop({ unit: '%', width: 80, aspect: 1 });
    }
  };

  if (!isEditing) return null;

  return (
    <FeatureFlagWrapper
      featureName="file-upload.profile-photo"
      showFallback={false}
    >
      <div className="relative">
        <Button
          size="sm"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full p-2 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600"
          onClick={() => setShowFileInput(true)}
          aria-label="Change profile photo"
        >
          <Camera className="h-4 w-4" />
        </Button>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-photo-input"
          ref={(input) => {
            if (input && showFileInput) {
              input.click();
              setShowFileInput(false);
            }
          }}
        />

        {showCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowCrop(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crop profile photo</h3>
                <button onClick={() => setShowCrop(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-auto">
                {cropSrc && (
                  <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1}>
                    <img
                      ref={imgRef}
                      src={cropSrc}
                      alt="Crop source"
                      className="max-w-full h-auto"
                      onLoad={(e) => {
                        // Ensure a centered initial crop
                        const img = e.currentTarget;
                        const side = Math.min(img.width, img.height) * 0.8;
                        setCrop({ unit: 'px', width: side, height: side, x: (img.width - side) / 2, y: (img.height - side) / 2 });
                      }}
                    />
                  </ReactCrop>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowCrop(false)}>Cancel</Button>
                <Button onClick={handleCropConfirm}>Apply</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureFlagWrapper>
  );
};

// Cover Photo Upload Button Component
export const CoverPhotoUploadButton = ({
  userId,
  onPhotoUpdate,
  isEditing = false,
  onFileUpload,
  onFileSelect,
}) => {
  const [showFileInput, setShowFileInput] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        validateImageFile(file);
      } catch (e) {
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result);
        fileRef.current = file;
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
    setShowFileInput(false);
    event.target.value = "";
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop || !completedCrop.width || !completedCrop.height) {
      setShowCrop(false);
      setCropSrc(null);
      return;
    }
    const srcFile = fileRef.current;
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop, srcFile?.type || 'image/jpeg');
      const croppedFile = new File([blob], srcFile?.name || 'cover.jpg', { type: blob.type });
      if (onFileSelect) {
        onFileSelect(croppedFile, "cover");
      } else if (onFileUpload) {
        onFileUpload(croppedFile, "cover");
      } else if (onPhotoUpdate) {
        onPhotoUpdate("cover", croppedFile);
      }
    } finally {
      setShowCrop(false);
      setCropSrc(null);
      setCompletedCrop(null);
      setCrop({ unit: '%', width: 90, aspect: 16 / 9 });
    }
  };

  if (!isEditing) return null;

  return (
    <FeatureFlagWrapper
      featureName="file-upload.cover-photo"
      showFallback={false}
    >
      <div className="absolute top-4 right-4">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          onClick={() => setShowFileInput(true)}
          aria-label="Change cover photo"
        >
          <Camera className="h-5 w-5" />
        </Button>

        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="cover-photo-input"
          ref={(input) => {
            if (input && showFileInput) {
              input.click();
              setShowFileInput(false);
            }
          }}
        />

        {showCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowCrop(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crop cover photo</h3>
                <button onClick={() => setShowCrop(false)} className="text-gray-200 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto">
                {cropSrc && (
                  <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={16/9}>
                    <img
                      ref={imgRef}
                      src={cropSrc}
                      alt="Crop source"
                      className="max-w-full h-auto"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        const width = Math.min(img.width * 0.9, img.width);
                        const height = width * (9/16);
                        const clampedH = Math.min(height, img.height * 0.9);
                        const clampedW = clampedH * (16/9);
                        setCrop({ unit: 'px', width: clampedW, height: clampedH, x: (img.width - clampedW) / 2, y: (img.height - clampedH) / 2 });
                      }}
                    />
                  </ReactCrop>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowCrop(false)}>Cancel</Button>
                <Button onClick={handleCropConfirm}>Apply</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FeatureFlagWrapper>
  );
};

// Photo Display Component
export const PhotoDisplay = ({
  photoUrl,
  alt,
  type = "profile",
  className = "",
  fallbackSrc = type === "profile" ? "/dp.png" : "/cover.jpg",
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const displayUrl = imageError ? fallbackSrc : photoUrl || fallbackSrc;

  return (
    <img
      src={displayUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
};
