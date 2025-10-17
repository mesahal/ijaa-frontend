// Utility functions for handling media URLs in posts

/**
 * Convert relative media URLs to absolute URLs for post media
 * This follows the same pattern as profile photos and event banners
 */
export const convertPostMediaUrl = (mediaUrl, postId, fileName) => {
  if (!mediaUrl) return null;
  
  console.log('🔄 [convertPostMediaUrl] Converting URL:', mediaUrl);
  console.log('🔄 [convertPostMediaUrl] Post ID:', postId);
  console.log('🔄 [convertPostMediaUrl] File name:', fileName);
  
  // If it's already an absolute URL, return as is
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    console.log('✅ [convertPostMediaUrl] Already absolute URL:', mediaUrl);
    return mediaUrl;
  }
  
  // Use the file service API base URL (same as profile photos and event banners)
  // Note: The base URL should be without /users suffix for post media
  let fileApiBase = process.env.REACT_APP_API_FILE_URL || 'http://localhost:8000/ijaa/api/v1/files';
  
  // If the env var includes /users, remove it for post media
  if (fileApiBase.includes('/users')) {
    fileApiBase = fileApiBase.replace('/users', '');
  }
  
  let domainBase = fileApiBase;
  
  console.log('🔧 [convertPostMediaUrl] File API base from env:', fileApiBase);
  
  // Extract just the domain and port (remove /ijaa/api/v1/files part)
  if (fileApiBase.includes('/ijaa/')) {
    domainBase = fileApiBase.split('/ijaa/')[0];
  }
  
  console.log('🌐 [convertPostMediaUrl] Domain base:', domainBase);
  
      // Handle different URL formats
      if (mediaUrl.startsWith('/ijaa/api/v1/files/posts/') && mediaUrl.includes('/media/') && !mediaUrl.includes('/file/')) {
        // Convert metadata endpoint to file serving endpoint
        // /ijaa/api/v1/files/posts/38/media/filename.jpg -> /ijaa/api/v1/files/posts/38/media/file/filename.jpg
        const fileServingUrl = mediaUrl.replace('/media/', '/media/file/');
        const absoluteUrl = `${domainBase}${fileServingUrl}`;
        console.log('✅ [convertPostMediaUrl] Metadata endpoint converted to file serving endpoint:', absoluteUrl);
        return absoluteUrl;
      } else if (mediaUrl.startsWith('/ijaa/api/v1/files')) {
        // Full API path format: /ijaa/api/v1/files/posts/38/media/file/filename.jpg
        const absoluteUrl = `${domainBase}${mediaUrl}`;
        console.log('✅ [convertPostMediaUrl] Full API path converted to absolute URL:', absoluteUrl);
        return absoluteUrl;
      } else if (mediaUrl.startsWith('/ijaa/api/v1')) {
        // API path format: /ijaa/api/v1/files/posts/38/media/file/filename.jpg
        const absoluteUrl = `${domainBase}${mediaUrl}`;
        console.log('✅ [convertPostMediaUrl] API path converted to absolute URL:', absoluteUrl);
        return absoluteUrl;
      } else if (mediaUrl.startsWith('/')) {
        // Relative path starting with /
        const absoluteUrl = `${domainBase}${mediaUrl}`;
        console.log('✅ [convertPostMediaUrl] Relative path converted to absolute URL:', absoluteUrl);
        return absoluteUrl;
      } else if (fileName && postId) {
        // Construct the full path using postId and fileName - use the file serving endpoint
        const publicPath = `/ijaa/api/v1/files/posts/${postId}/media/file/${fileName}`;
        const absoluteUrl = `${domainBase}${publicPath}`;
        console.log('✅ [convertPostMediaUrl] Constructed path converted to absolute URL:', absoluteUrl);
        return absoluteUrl;
      }
  
  // Fallback: prepend domain base
  const absoluteUrl = `${domainBase}/${mediaUrl}`;
  console.log('✅ [convertPostMediaUrl] Fallback converted to absolute URL:', absoluteUrl);
  return absoluteUrl;
};

export default {
  convertPostMediaUrl
};
