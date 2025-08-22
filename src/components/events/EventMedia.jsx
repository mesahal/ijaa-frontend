import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  Video,
  FileText,
  Upload,
  Heart,
  Trash2,
  Edit,
  MoreVertical,
  Download,
  Eye,
  X,
  Loader2,
  AlertCircle,
  Plus,
  Grid3X3,
  List,
} from 'lucide-react';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';

/**
 * EventMedia Component
 * Handles event media upload, display, and management
 */
const EventMedia = ({ 
  eventId, 
  onMediaAdded, 
  onMediaUpdated, 
  onMediaDeleted 
}) => {
  const { user } = useUnifiedAuth();
  const fileInputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    caption: '',
    type: 'IMAGE'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  // Media type options
  const MEDIA_TYPES = {
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    DOCUMENT: 'DOCUMENT'
  };

  // Media type icons
  const getMediaTypeIcon = (type) => {
    switch (type) {
      case MEDIA_TYPES.IMAGE:
        return <Image className="w-5 h-5" />;
      case MEDIA_TYPES.VIDEO:
        return <Video className="w-5 h-5" />;
      case MEDIA_TYPES.DOCUMENT:
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Media type labels
  const getMediaTypeLabel = (type) => {
    switch (type) {
      case MEDIA_TYPES.IMAGE:
        return 'Image';
      case MEDIA_TYPES.VIDEO:
        return 'Video';
      case MEDIA_TYPES.DOCUMENT:
        return 'Document';
      default:
        return 'File';
    }
  };

  // Load media on component mount
  useEffect(() => {
    if (eventId) {
      loadMedia();
    }
  }, [eventId]);

  /**
   * Load media for the event
   */
  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/user/events/media/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'X-USER_ID': btoa(JSON.stringify({
            username: user?.username,
            userId: user?.id
          }))
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load media');
      }

      const data = await response.json();
      setMedia(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Auto-detect media type based on file extension
      const extension = file.name.split('.').pop().toLowerCase();
      let detectedType = MEDIA_TYPES.DOCUMENT;
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        detectedType = MEDIA_TYPES.IMAGE;
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
        detectedType = MEDIA_TYPES.VIDEO;
      }
      
      setUploadForm(prev => ({ ...prev, type: detectedType }));
    }
  };

  /**
   * Handle file upload
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('file', selectedFile);
      formData.append('caption', uploadForm.caption.trim());
      formData.append('type', uploadForm.type);

      const response = await fetch('/api/v1/user/events/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'X-USER_ID': btoa(JSON.stringify({
            username: user?.username,
            userId: user?.id
          }))
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      const data = await response.json();
      
      setMedia(prev => [data.data, ...prev]);
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadForm({ caption: '', type: MEDIA_TYPES.IMAGE });
      onMediaAdded?.(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error uploading media:', err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Update media caption
   */
  const handleUpdateCaption = async (mediaId) => {
    if (!editCaption.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/user/events/media/${mediaId}/caption`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
          'X-USER_ID': btoa(JSON.stringify({
            username: user?.username,
            userId: user?.id
          }))
        },
        body: JSON.stringify({
          caption: editCaption.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update caption');
      }

      const data = await response.json();
      
      setMedia(prev => prev.map(item => 
        item.id === mediaId 
          ? { ...item, caption: data.data.caption }
          : item
      ));

      setEditingMedia(null);
      setEditCaption('');
      onMediaUpdated?.(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error updating caption:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete media
   */
  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/user/events/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'X-USER_ID': btoa(JSON.stringify({
            username: user?.username,
            userId: user?.id
          }))
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete media');
      }

      setMedia(prev => prev.filter(item => item.id !== mediaId));
      onMediaDeleted?.(mediaId);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting media:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle like on media
   */
  const handleToggleLike = async (mediaId) => {
    try {
      const response = await fetch(`/api/v1/user/events/media/${mediaId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'X-USER_ID': btoa(JSON.stringify({
            username: user?.username,
            userId: user?.id
          }))
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      
      setMedia(prev => prev.map(item => 
        item.id === mediaId 
          ? { 
              ...item, 
              isLiked: data.data.isLiked,
              likeCount: data.data.likeCount 
            }
          : item
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  /**
   * Open media in full view
   */
  const openMediaView = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  /**
   * Render media item
   */
  const renderMediaItem = (mediaItem) => {
    const canEdit = user?.id === mediaItem.createdBy;
    const canDelete = user?.id === mediaItem.createdBy || user?.role === 'ADMIN';
    const isEditing = editingMedia?.id === mediaItem.id;

    return (
      <div key={mediaItem.id} className="relative group">
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
          viewMode === 'grid' ? 'aspect-square' : ''
        }`}>
          {/* Media Preview */}
          <div className="relative">
            {mediaItem.type === MEDIA_TYPES.IMAGE ? (
              <img
                src={mediaItem.fileUrl}
                alt={mediaItem.caption || 'Event media'}
                className={`w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 ${
                  viewMode === 'grid' ? 'aspect-square' : 'h-32'
                }`}
                onClick={() => openMediaView(mediaItem)}
              />
            ) : mediaItem.type === MEDIA_TYPES.VIDEO ? (
              <video
                src={mediaItem.fileUrl}
                className={`w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 ${
                  viewMode === 'grid' ? 'aspect-square' : 'h-32'
                }`}
                onClick={() => openMediaView(mediaItem)}
                controls
              />
            ) : (
              <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 cursor-pointer transition-transform hover:scale-105 ${
                viewMode === 'grid' ? 'aspect-square' : 'h-32'
              }`} onClick={() => openMediaView(mediaItem)}>
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Media Type Badge */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
              {getMediaTypeLabel(mediaItem.type)}
            </div>

            {/* Action Menu */}
            {(canEdit || canDelete) && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    onClick={() => setEditingMedia(mediaItem)}
                    className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {editingMedia?.id === mediaItem.id && (
                    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {canEdit && (
                        <button
                          onClick={() => {
                            setEditCaption(mediaItem.caption || '');
                            setEditingMedia(mediaItem);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit Caption</span>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteMedia(mediaItem.id)}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Media Info */}
          <div className="p-3">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  placeholder="Add a caption..."
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateCaption(mediaItem.id)}
                    disabled={loading}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingMedia(null);
                      setEditCaption('');
                    }}
                    className="px-2 py-1 text-gray-600 dark:text-gray-400 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {mediaItem.caption && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                    {mediaItem.caption}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(mediaItem.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleLike(mediaItem.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        mediaItem.isLiked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${mediaItem.isLiked ? 'fill-current' : ''}`} />
                      <span>{mediaItem.likeCount || 0}</span>
                    </button>
                    
                    <button
                      onClick={() => openMediaView(mediaItem)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && media.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading media...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Media Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Media ({media.length})
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Media Grid/List */}
      {media.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium mb-2">No media yet</p>
          <p className="text-sm">Upload photos, videos, or documents to share with event participants.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First Media</span>
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
          {media.map(renderMediaItem)}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Media
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Media Type
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={MEDIA_TYPES.IMAGE}>Image</option>
                  <option value={MEDIA_TYPES.VIDEO}>Video</option>
                  <option value={MEDIA_TYPES.DOCUMENT}>Document</option>
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caption (Optional)
                </label>
                <textarea
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={3}
                  placeholder="Add a description..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media View Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Media Content */}
            <div className="flex flex-col items-center">
              {selectedMedia.type === MEDIA_TYPES.IMAGE ? (
                <img
                  src={selectedMedia.fileUrl}
                  alt={selectedMedia.caption || 'Event media'}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              ) : selectedMedia.type === MEDIA_TYPES.VIDEO ? (
                <video
                  src={selectedMedia.fileUrl}
                  className="max-w-full max-h-[70vh] rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {selectedMedia.caption || 'Document'}
                  </p>
                  <a
                    href={selectedMedia.fileUrl}
                    download
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              )}

              {/* Media Info */}
              {selectedMedia.caption && (
                <div className="mt-4 text-center">
                  <p className="text-white text-lg">{selectedMedia.caption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMedia;
