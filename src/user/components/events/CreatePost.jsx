import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  X,
  Send
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import UserAvatar from '../../../components/common/UserAvatar';

const CreatePost = forwardRef(({ onSubmit, loading = false }, ref) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('TEXT');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  // Reset form function
  const resetForm = useCallback(() => {
    console.log('CreatePost: resetForm called');
    setContent('');
    setPostType('TEXT');
    setSelectedFiles([]);
    setShowMediaOptions(false);
  }, []);

  // Expose reset function to parent via ref
  useImperativeHandle(ref, () => ({
    resetForm
  }), [resetForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && selectedFiles.length === 0) return;

    onSubmit({
      content: content.trim(),
      files: selectedFiles
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    
    // Determine post type based on selected files
    const hasImages = newFiles.some(file => file.type.startsWith('image/'));
    const hasVideos = newFiles.some(file => file.type.startsWith('video/'));
    
    if (hasImages && hasVideos) {
      setPostType('MIXED');
    } else if (hasImages) {
      setPostType('IMAGE');
    } else if (hasVideos) {
      setPostType('VIDEO');
    } else if (newFiles.length > 0) {
      setPostType('MIXED');
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (newFiles.length === 0) {
      setPostType('TEXT');
    } else {
      // Re-evaluate post type after removing files
      const hasImages = newFiles.some(file => file.type.startsWith('image/'));
      const hasVideos = newFiles.some(file => file.type.startsWith('video/'));
      
      if (hasImages && hasVideos) {
        setPostType('MIXED');
      } else if (hasImages) {
        setPostType('IMAGE');
      } else if (hasVideos) {
        setPostType('VIDEO');
      } else {
        setPostType('MIXED');
      }
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="h-4 w-4" />;
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'MIXED':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <UserAvatar 
            userId={currentUser?.userId}
            username={currentUser?.email || currentUser?.username}
            name={currentUser?.name || currentUser?.username || currentUser?.email}
            size="sm"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Create a post
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share your thoughts about this event
            </p>
          </div>
        </div>

        {/* Content Input */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {getPostTypeIcon(file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO')}
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="media-upload"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm">Photo/Video</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setContent('')}
              disabled={!content.trim() && selectedFiles.length === 0}
            >
              Clear
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={loading}
              disabled={!content.trim() && selectedFiles.length === 0}
            >
              <Send className="h-4 w-4 mr-1" />
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
});

CreatePost.displayName = 'CreatePost';

export default CreatePost;
