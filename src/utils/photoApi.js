import axios from "axios";
import apiClient from "./apiClient";

// Use the gateway server base URL directly (without /user path)
// Ensure we always use the correct format: http://localhost:8000/ijaa/api/v1
let API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:8000/ijaa/api/v1/user";

// Remove /user suffix if it exists to get the correct base URL for photo APIs
if (API_BASE.endsWith("/user")) {
  API_BASE = API_BASE.replace("/user", "");
}

// Create a separate axios instance for photo operations
const photoApiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // Longer timeout for file uploads
  // Don't set default Content-Type - it will be set per request
});

// Add request interceptor to include auth headers
photoApiClient.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    const userData = localStorage.getItem("alumni_user");

    if (userData) {
      try {
        const user = JSON.parse(userData);

        // Add Authorization header
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }

        // Add X-USER_ID header for backend compatibility
        const userContext = { username: user.username || user.email };
        config.headers["X-USER_ID"] = btoa(JSON.stringify(userContext));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  
  // If it's already an absolute URL, return as is
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  
  // Extract just the domain and port from the base URL
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
  let domainBase = baseUrl;
  
  // Remove any path components, keeping only domain and port
  if (baseUrl.includes('/ijaa/')) {
    domainBase = baseUrl.split('/ijaa/')[0];
  } else if (baseUrl.includes('/user')) {
    domainBase = baseUrl.split('/user')[0];
  }
  
  // If it's a relative URL starting with /, prepend the domain base
  if (relativeUrl.startsWith('/')) {
    return `${domainBase}${relativeUrl}`;
  }
  
  // If it's a relative URL without leading /, prepend the domain base with /
  return `${domainBase}/${relativeUrl}`;
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
    console.error("Profile photo upload failed:", error);
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
    console.error("Cover photo upload failed:", error);
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
    console.log("getProfilePhotoUrl response:", response);
    if (response.data.success) {
      const data = response.data.data;

      // Handle the new response format
      if (data.exists && data.photoUrl) {
        // Convert relative URL to absolute URL if needed
        const absolutePhotoUrl = convertToAbsoluteUrl(data.photoUrl);
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
    console.error("Failed to get profile photo URL:", error);
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
        // Convert relative URL to absolute URL if needed
        const absolutePhotoUrl = convertToAbsoluteUrl(data.photoUrl);
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
    console.error("Failed to get cover photo URL:", error);
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
    console.error("Failed to delete profile photo:", error);
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
    console.error("Failed to delete cover photo:", error);
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
