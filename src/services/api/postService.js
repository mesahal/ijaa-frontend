import axios from "axios";
import TokenManager from "../auth/TokenManager";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "localhost:8000/ijaa/api/v1";

class PostService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Important for HttpOnly cookies
    });

    // Add request interceptor to include auth headers
    this.api.interceptors.request.use(
      (config) => {
        const token = TokenManager.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add X-Username header for post APIs
        const username = this.getUsername();
        if (username) {
          config.headers["X-Username"] = username;
        }

        // Add X-Author-Name header for comment APIs to help backend determine display name
        const authorName = this.getAuthorName();
        if (authorName) {
          config.headers["X-Author-Name"] = authorName;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Helper method to get username from localStorage
  getUsername() {
    try {
      const userData = localStorage.getItem("alumni_user");
      if (userData) {
        const user = JSON.parse(userData);
        // Return the username or email for authentication
        return user.username || user.email;
      }
    } catch (error) {
      console.error("Error getting username:", error);
    }
    return null;
  }

  // Helper method to get author display name from localStorage
  getAuthorName() {
    try {
      const userData = localStorage.getItem("alumni_user");
      if (userData) {
        const user = JSON.parse(userData);
        // Return the display name (name field) if available, otherwise fallback to username or email
        return user.name || user.username || user.email;
      }
    } catch (error) {
      console.error("Error getting author name:", error);
    }
    return null;
  }

  // Helper method to get user ID from localStorage
  getUserId() {
    try {
      const userData = localStorage.getItem("alumni_user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.userId;
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
    return null;
  }

  // Post APIs
  async createPost(eventId, content, files = []) {
    try {
      const formData = new FormData();
      formData.append("eventId", parseInt(eventId));

      if (content && content.trim()) {
        formData.append("content", content.trim());
      }

      // Add all media files to the same request
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await this.api.post("/events/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async getEventPosts(eventId, page = 0, size = 10) {
    try {
      const response = await this.api.get(`/events/posts/event/${eventId}`, {
        params: { page, size },
      });
      // Fetch media files for each post
      if (response.data.content && response.data.content.length > 0) {
        const postsWithMedia = await Promise.all(
          response.data.content.map(async (post) => {
            try {
              const mediaResponse = await this.getAllPostMedia(post.id);
              return {
                ...post,
                mediaFiles: mediaResponse || [],
              };
            } catch (error) {
              return {
                ...post,
                mediaFiles: [],
              };
            }
          })
        );

        return {
          ...response.data,
          content: postsWithMedia,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching event posts:", error);
      throw error;
    }
  }

  async getPost(postId) {
    try {
      const response = await this.api.get(`/events/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  }

  async updatePost(postId, content) {
    try {
      const response = await this.api.put(`/events/posts/${postId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  async deletePost(postId) {
    try {
      const response = await this.api.delete(`/events/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  async likePost(postId) {
    try {
      const response = await this.api.post(`/events/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  }

  // Comment APIs - Updated to match the API documentation
  async createComment(postId, content, parentCommentId = null) {
    try {
      const requestBody = {
        postId: parseInt(postId),
        content,
        parentCommentId: parentCommentId ? parseInt(parentCommentId) : null,
      };

      // Include author name and userId if available
      const authorName = this.getAuthorName();
      if (authorName) {
        requestBody.authorName = authorName;
      }

      const userId = this.getUserId();
      if (userId) {
        requestBody.userId = userId;
      }

      const response = await this.api.post("/events/comments", requestBody);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async getPostComments(postId) {
    try {
      const response = await this.api.get(`/events/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post comments:", error);
      throw error;
    }
  }

  async getComment(commentId) {
    try {
      const response = await this.api.get(`/events/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching comment:", error);
      throw error;
    }
  }

  async updateComment(commentId, content, postId) {
    try {
      const response = await this.api.put(`/events/comments/${commentId}`, {
        postId: parseInt(postId),
        content,
        parentCommentId: null,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      const response = await this.api.delete(`/events/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  async likeComment(commentId) {
    try {
      const response = await this.api.post(
        `/events/comments/${commentId}/like`
      );
      return response.data;
    } catch (error) {
      console.error("Error liking comment:", error);
      throw error;
    }
  }

  async getRecentComments(postId) {
    try {
      const response = await this.api.get(
        `/events/comments/recent/post/${postId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent comments:", error);
      throw error;
    }
  }

  async getPopularComments(postId) {
    try {
      const response = await this.api.get(
        `/events/comments/popular/post/${postId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching popular comments:", error);
      throw error;
    }
  }

  // Media APIs - Note: Media is now handled directly in createPost method
  // These methods are kept for backward compatibility and future use
  async uploadPostMedia(postId, file, mediaType) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", mediaType);

      // Use the file service API directly (same as profile photos and event banners)
      let fileApiBase =
        process.env.REACT_APP_API_FILE_URL ||
        "http://localhost:8000/ijaa/api/v1/files";

      // If the env var includes /users, remove it for post media
      if (fileApiBase.includes("/users")) {
        fileApiBase = fileApiBase.replace("/users", "");
      }
      const response = await this.api.post(`/posts/${postId}/media`, formData, {
        baseURL: fileApiBase,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading post media:", error);
      throw error;
    }
  }

  async getAllPostMedia(postId) {
    try {
      // Use the file service API directly (same as profile photos and event banners)
      let fileApiBase =
        process.env.REACT_APP_API_FILE_URL ||
        "http://localhost:8000/ijaa/api/v1/files";

      // If the env var includes /users, remove it for post media
      if (fileApiBase.includes("/users")) {
        fileApiBase = fileApiBase.replace("/users", "");
      }
      const response = await this.api.get(`/posts/${postId}/media`, {
        baseURL: fileApiBase,
      });
      console.log(`Media response for post ${postId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting post media:", error);
      return []; // Return empty array instead of throwing error
    }
  }

  async getPostMediaUrl(postId, fileName) {
    try {
      // Use the file service API directly (same as profile photos and event banners)
      let fileApiBase =
        process.env.REACT_APP_API_FILE_URL ||
        "http://localhost:8000/ijaa/api/v1/files";

      // If the env var includes /users, remove it for post media
      if (fileApiBase.includes("/users")) {
        fileApiBase = fileApiBase.replace("/users", "");
      }
      const response = await this.api.get(
        `/posts/${postId}/media/${fileName}`,
        {
          baseURL: fileApiBase,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting post media URL:", error);
      throw error;
    }
  }

  async deletePostMedia(postId, fileName) {
    try {
      // Use the file service API directly (same as profile photos and event banners)
      let fileApiBase =
        process.env.REACT_APP_API_FILE_URL ||
        "http://localhost:8000/ijaa/api/v1/files";

      // If the env var includes /users, remove it for post media
      if (fileApiBase.includes("/users")) {
        fileApiBase = fileApiBase.replace("/users", "");
      }
      const response = await this.api.delete(
        `/posts/${postId}/media/${fileName}`,
        {
          baseURL: fileApiBase,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting post media:", error);
      throw error;
    }
  }

  // Feature flag check
  async checkFeatureFlag(featureName) {
    try {
      const response = await this.api.get(
        `/admin/feature-flags/${featureName}/enabled`
      );
      console.log("🔍 [PostService] Feature flag response:", response.data);
      return response.data.data?.enabled || false;
    } catch (error) {
      console.error("Error checking feature flag:", error);
      return false;
    }
  }
}

export default new PostService();
