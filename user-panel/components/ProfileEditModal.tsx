import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from './icons';
import AvatarUpload from './AvatarUpload';
import ImageCropper from './ImageCropper';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatarUrl: string;
  };
  onSave: (data: { name: string; avatarUrl: string }) => Promise<void>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl);
      setError(null);
      // Focus input after modal opens
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, user.name, user.avatarUrl]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave({ name: name.trim(), avatarUrl });
      onClose();
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [name, avatarUrl, onSave, onClose]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setName(user.name);
    setAvatarUrl(user.avatarUrl);
    setError(null);
    setIsCropperOpen(false);
    setImageToCrop('');
    onClose();
  }, [user.name, user.avatarUrl, onClose]);

  // Handle avatar change with crop option
  const handleAvatarChange = useCallback((newAvatar: string) => {
    if (newAvatar && newAvatar !== avatarUrl) {
      // Open cropper for new images
      setImageToCrop(newAvatar);
      setIsCropperOpen(true);
    } else {
      setAvatarUrl(newAvatar);
    }
  }, [avatarUrl]);

  // Handle crop completion
  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    setAvatarUrl(croppedImageUrl);
    setIsCropperOpen(false);
    setImageToCrop('');
  }, []);

  // Handle cropper close
  const handleCropperClose = useCallback(() => {
    setIsCropperOpen(false);
    setImageToCrop('');
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="modal-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="modal-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                  disabled={isSaving}
                  autoComplete="name"
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture
                </label>
                <AvatarUpload
                  currentAvatar={avatarUrl}
                  onAvatarChange={handleAvatarChange}
                  disabled={isSaving}
                  autoSave={false}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !name.trim()}
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Image Cropper Modal */}
      <ImageCropper
        isOpen={isCropperOpen}
        onClose={handleCropperClose}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
        aspectRatio={1} // Square crop for profile pictures
      />
    </AnimatePresence>
  );
};

export default ProfileEditModal;
