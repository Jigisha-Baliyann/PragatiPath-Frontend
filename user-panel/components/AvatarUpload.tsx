import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, PhotoIcon, XMarkIcon } from '../components/icons';
import { imageService } from '../services/imageService';

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
  disabled?: boolean;
  autoSave?: boolean; // Whether to trigger auto-save on change
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  onAvatarChange, 
  disabled = false,
  autoSave = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureModeRef = useRef<'upload' | 'camera' | null>(null);

  useEffect(() => {
    // Detect if the user agent is likely a mobile device
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    setIsMobileDevice(isMobile);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const mode = captureModeRef.current;
    captureModeRef.current = null; // Reset for next use
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Store image using image service
      const result = await imageService.storeImage(file);
      
      if (result.success && result.imageUrl) {
        setPreview(result.imageUrl);
        onAvatarChange(result.imageUrl);
      } else {
        setError(result.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (!fileInputRef.current || disabled) return;
    captureModeRef.current = 'upload';
    fileInputRef.current.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.click();
  };

  const handleTakePhotoClick = () => {
    if (!fileInputRef.current || disabled) return;
    captureModeRef.current = 'camera';
    fileInputRef.current.accept = 'image/*';
    fileInputRef.current.setAttribute('capture', 'environment');
    fileInputRef.current.click();
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    onAvatarChange(''); // Set to empty string to use default avatar
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">Profile Picture</label>
      
      {/* Avatar Display */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={displayAvatar || `https://picsum.photos/seed/${Date.now()}/100`}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={disabled || isUploading}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
            >
              <PhotoIcon className="h-4 w-4" />
              Upload Photo
            </button>
            
            <button
              type="button"
              onClick={handleTakePhotoClick}
              disabled={disabled || isUploading}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
            >
              <CameraIcon className="h-4 w-4" />
              Take Photo
            </button>
            
            {displayAvatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={disabled || isUploading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>
          
          {!isMobileDevice && (
            <p className="text-xs text-gray-500 mt-1">
              On desktop, "Take Photo" opens a file browser
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />
    </div>
  );
};

export default AvatarUpload;
