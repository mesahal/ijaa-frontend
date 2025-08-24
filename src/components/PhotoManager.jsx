import React, { useState, useEffect } from "react";
import { Camera, X, Upload, Trash2 } from "lucide-react";
import { Button } from "./ui";
import {
  uploadProfilePhoto,
  uploadCoverPhoto,
  getProfilePhotoUrl,
  getCoverPhotoUrl,
  deleteProfilePhoto,
  deleteCoverPhoto,
  validateImageFile,
  handlePhotoApiError,
} from "../utils/photoApi";

// Custom hook for photo management
export const usePhotoManager = ({ userId, onPhotoUpdate = null }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load existing photos
  useEffect(() => {
    if (userId) {
      loadPhotos();
    }
  }, [userId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, coverData] = await Promise.all([
        getProfilePhotoUrl(userId),
        getCoverPhotoUrl(userId),
      ]);

      // Handle the new response format
      setProfilePhoto({
        photoUrl: profileData.photoUrl,
        hasPhoto: profileData.hasPhoto || profileData.exists || false,
      });
      setCoverPhoto({
        photoUrl: coverData.photoUrl,
        hasPhoto: coverData.hasPhoto || coverData.exists || false,
      });
      console.log("Loaded photos:", { profileData, coverData });
    } catch (error) {
      console.error("Failed to load photos:", error);
      setError("Failed to load photos");
    } finally {
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

      console.log(
        `${
          type === "profile" ? "Profile" : "Cover"
        } photo uploaded successfully!`
      );
    } catch (error) {
      const errorMessage = handlePhotoApiError(error);
      setError(errorMessage);
      console.error("Upload failed:", errorMessage);
    } finally {
      setLoading(false);
    }
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

      console.log(
        `${
          type === "profile" ? "Profile" : "Cover"
        } photo deleted successfully!`
      );
    } catch (error) {
      const errorMessage = handlePhotoApiError(error);
      setError(errorMessage);
      console.error("Delete failed:", errorMessage);
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
      console.log("Profile Photo:", profilePhoto);
      return profilePhoto?.hasPhoto ? profilePhoto.photoUrl : null;
    } else {
      return coverPhoto?.hasPhoto ? coverPhoto.photoUrl : null;
    }
  };

  const hasPhoto = (type) => {
    if (type === "profile") {
      return profilePhoto?.hasPhoto || false;
    } else {
      return coverPhoto?.hasPhoto || false;
    }
  };

  return {
    profilePhotoUrl: getPhotoUrl("profile"),
    coverPhotoUrl: getPhotoUrl("cover"),
    hasProfilePhoto: hasPhoto("profile"),
    hasCoverPhoto: hasPhoto("cover"),
    loading,
    error,
    handleFileUpload,
    handleDeletePhoto,
    handleFileInputChange,
    reloadPhotos: loadPhotos,
  };
};

// Profile Photo Upload Button Component
export const ProfilePhotoUploadButton = ({
  userId,
  onPhotoUpdate,
  isEditing = false,
  onFileUpload,
}) => {
  const [showFileInput, setShowFileInput] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (onFileUpload) {
        onFileUpload(file, "profile");
      } else if (onPhotoUpdate) {
        onPhotoUpdate("profile", file);
      }
    }
    setShowFileInput(false);
    event.target.value = "";
  };

  if (!isEditing) return null;

  return (
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
    </div>
  );
};

// Cover Photo Upload Button Component
export const CoverPhotoUploadButton = ({
  userId,
  onPhotoUpdate,
  isEditing = false,
  onFileUpload,
}) => {
  const [showFileInput, setShowFileInput] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (onFileUpload) {
        onFileUpload(file, "cover");
      } else if (onPhotoUpdate) {
        onPhotoUpdate("cover", file);
      }
    }
    setShowFileInput(false);
    event.target.value = "";
  };

  if (!isEditing) return null;

  return (
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
    </div>
  );
};

// Photo Display Component
export const PhotoDisplay = ({
  photoUrl,
  alt,
  type = "profile",
  className = "",
  fallbackSrc = type === "profile" ? "/dp.png" : "/cover-image.jpg",
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
