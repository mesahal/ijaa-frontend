import axiosInstance from "../../utils/api/axiosInstance";

// Use the dedicated file service API base URL
const API_BASE = process.env.REACT_APP_API_FILE_URL || 'http://localhost:8000/ijaa/api/v1/files';

// Create a separate axios instance for photo operations that extends the main instance
const photoApiClient = axiosInstance.create({
  baseURL: API_BASE,
  timeout: 30000, // Longer timeout for file uploads
  // Don't set default Content-Type - it will be set per request
});

// Ensure the photoApiClient inherits the same interceptors as the main axiosInstance
// Copy the request and response interceptors from the main axiosInstance
photoApiClient.interceptors.request = axiosInstance.interceptors.request;
photoApiClient.interceptors.response = axiosInstance.interceptors.response;

// File validation helper
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!file) {
    throw new Error("Please select a file");
  }

  if (file.size === 0) {
    throw new Error("File is empty. Please select a valid image file.");
  }

  if (file.size > maxSize) {
    throw new Error("File size exceeds 5MB limit");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, JPEG, PNG, WEBP are allowed");
  }

  if (!file.name || file.name.trim() === "") {
    throw new Error("Invalid file name. Please select a valid image file.");
  }

  return true;
};

// Helper function to convert relative URLs to absolute URLs
const convertToAbsoluteUrl = (relativeUrl) => {
  if (!relativeUrl) return null;
  
  console.log('🔄 [convertToAbsoluteUrl] Converting URL:', relativeUrl);
  
  // If it's already an absolute URL, return as is
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    console.log('✅ [convertToAbsoluteUrl] Already absolute URL:', relativeUrl);
    return relativeUrl;
  }
  
  // Get the base domain from environment variables
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/ijaa/api/v1";
  let domainBase = baseUrl;
  
  console.log('🔧 [convertToAbsoluteUrl] Base URL from env:', baseUrl);
  
  // Extract just the domain and port (remove /ijaa/api/v1 part)
  if (baseUrl.includes('/ijaa/')) {
    domainBase = baseUrl.split('/ijaa/')[0];
  }
  
  console.log('🌐 [convertToAbsoluteUrl] Domain base:', domainBase);
  
  // The photoUrl from API is already in the correct format: /ijaa/api/v1/files/users/...
  // We just need to prepend the domain base
  if (relativeUrl.startsWith('/')) {
    const absoluteUrl = `${domainBase}${relativeUrl}`;
    console.log('✅ [convertToAbsoluteUrl] Converted to absolute URL:', absoluteUrl);
    return absoluteUrl;
  }
  
  // If it's a relative URL without leading /, prepend the domain base with /
  const absoluteUrl = `${domainBase}/${relativeUrl}`;
  console.log('✅ [convertToAbsoluteUrl] Converted to absolute URL:', absoluteUrl);
  return absoluteUrl;
};

// Upload Profile Photo
export const uploadProfilePhoto = async (userId, file) => {
  try {
    validateImageFile(file);

    const formData = new FormData();
    formData.append("file", file);

    const response = await photoApiClient.post(
      `/users/${userId}/profile-photo`,
      formData,
      {
        headers: {
          // Don't set Content-Type for FormData - browser will set it automatically
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    throw error;
  }
};

// Upload Cover Photo
export const uploadCoverPhoto = async (userId, file) => {
  try {
    validateImageFile(file);

    const formData = new FormData();
    formData.append("file", file);

    const response = await photoApiClient.post(
      `/users/${userId}/cover-photo`,
      formData,
      {
        headers: {
          // Don't set Content-Type for FormData - browser will set it automatically
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Upload failed");
    }
  } catch (error) {
    throw error;
  }
};

// Get Profile Photo URL
export const getProfilePhotoUrl = async (userId) => {
  try {
    const response = await photoApiClient.get(
      `/users/${userId}/profile-photo`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      const data = response.data.data;

      // Handle the new response format
      if (data.exists && data.photoUrl) {
        console.log('📸 [getProfilePhotoUrl] Raw photoUrl from API:', data.photoUrl);
        // Convert relative URL to absolute URL if needed
        const absolutePhotoUrl = convertToAbsoluteUrl(data.photoUrl);
        console.log('📸 [getProfilePhotoUrl] Final absolute photoUrl:', absolutePhotoUrl);
        return {
          photoUrl: absolutePhotoUrl,
          hasPhoto: true,
          exists: true,
        };
      } else {
        return {
          photoUrl: null,
          hasPhoto: false,
          exists: false,
        };
      }
    } else {
      throw new Error(
        response.data.message || "Failed to get profile photo URL"
      );
    }
  } catch (error) {
    throw error;
  }
};

// Get Cover Photo URL
export const getCoverPhotoUrl = async (userId) => {
  try {
    const response = await photoApiClient.get(`/users/${userId}/cover-photo`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      const data = response.data.data;

      // Handle the new response format
      if (data.exists && data.photoUrl) {
        console.log('🖼️ [getCoverPhotoUrl] Raw photoUrl from API:', data.photoUrl);
        // Convert relative URL to absolute URL if needed
        const absolutePhotoUrl = convertToAbsoluteUrl(data.photoUrl);
        console.log('🖼️ [getCoverPhotoUrl] Final absolute photoUrl:', absolutePhotoUrl);
        return {
          photoUrl: absolutePhotoUrl,
          hasPhoto: true,
          exists: true,
        };
      } else {
        return {
          photoUrl: null,
          hasPhoto: false,
          exists: false,
        };
      }
    } else {
      throw new Error(response.data.message || "Failed to get cover photo URL");
    }
  } catch (error) {
    throw error;
  }
};

// Delete Profile Photo
export const deleteProfilePhoto = async (userId) => {
  try {
    const response = await photoApiClient.delete(
      `/users/${userId}/profile-photo`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return true;
    } else {
      throw new Error(
        response.data.message || "Failed to delete profile photo"
      );
    }
  } catch (error) {
    throw error;
  }
};

// Delete Cover Photo
export const deleteCoverPhoto = async (userId) => {
  try {
    const response = await photoApiClient.delete(
      `/users/${userId}/cover-photo`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return true;
    } else {
      throw new Error(response.data.message || "Failed to delete cover photo");
    }
  } catch (error) {
    throw error;
  }
};

// Centralized error handler for photo operations
export const handlePhotoApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || "Bad Request";
      case 401:
        return "Authentication required. Please log in again.";
      case 404:
        return "Resource not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return data.message || "An unexpected error occurred.";
    }
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};
