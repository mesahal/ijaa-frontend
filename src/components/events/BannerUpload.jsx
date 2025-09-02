import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader2, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

/**
 * BannerUpload Component
 * Allows users to upload, preview, and delete event banner images
 */
const BannerUpload = ({ 
  eventId, 
  currentBannerUrl, 
  onUpload, 
  onDelete, 
  loading = false, 
  error = null,
  onErrorClear 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      if (onErrorClear) onErrorClear();
      alert('Please select a valid image file (JPG, JPEG, PNG, or WEBP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      if (onErrorClear) onErrorClear();
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Call upload function
    if (onUpload) {
      onUpload(file);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete the banner image?')) {
      if (onDelete) {
        onDelete();
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const displayUrl = previewUrl || currentBannerUrl;

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            {onErrorClear && (
              <button
                onClick={onErrorClear}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Current Banner Display */}
      {displayUrl && !loading && (
        <div className="relative group">
          <div className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={displayUrl}
              alt="Event Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"></div>
            
            {/* Delete Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800"
                icon={<Trash2 className="h-4 w-4" />}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!displayUrl && !loading && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Image className="h-8 w-8 text-gray-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Event Banner
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop an image here, or click to select a file
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Supported formats: JPG, JPEG, PNG, WEBP (max 5MB)
              </p>
            </div>
            
            <Button
              onClick={handleUploadClick}
              variant="outline"
              icon={<Upload className="h-4 w-4" />}
            >
              Choose File
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {displayUrl ? 'Updating banner...' : 'Uploading banner...'}
            </p>
          </div>
        </div>
      )}

      {/* Replace Banner Button (when banner exists) */}
      {displayUrl && !loading && (
        <div className="text-center">
          <Button
            onClick={handleUploadClick}
            variant="outline"
            size="sm"
            icon={<Upload className="h-4 w-4" />}
          >
            Replace Banner
          </Button>
        </div>
      )}
    </div>
  );
};

export default BannerUpload;




