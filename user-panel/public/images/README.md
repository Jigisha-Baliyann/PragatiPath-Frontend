# Image Storage System

This directory contains the image storage system for PragatiPath.

## Directory Structure

```
public/images/
├── issues/          # Issue report images
├── avatars/         # User profile avatars
└── README.md        # This file
```

## Image Storage Features

### Issue Images
- Stored as base64 data in localStorage
- Automatic cleanup of images older than 30 days
- Support for JPEG, PNG, and WebP formats
- Maximum file size: 5MB
- Persistent URLs that don't disappear

### Avatar Images
- User profile pictures
- Default avatars for new users
- Optimized for web display

## Technical Implementation

### ImageService
- `imageService.storeImage(file)` - Store image and return persistent URL
- `imageService.getImage(imageId)` - Retrieve stored image
- `imageService.cleanupOldImages()` - Remove old images
- `imageService.getStorageStats()` - Get storage statistics

### Storage Format
Images are stored in localStorage with the following structure:
```json
{
  "img_timestamp_random": {
    "id": "img_timestamp_random",
    "data": "base64_encoded_image_data",
    "filename": "original_filename.jpg",
    "type": "image/jpeg",
    "size": 1024000,
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Benefits
1. **Persistence**: Images don't disappear when page refreshes
2. **Performance**: Base64 encoding allows immediate display
3. **Storage Management**: Automatic cleanup prevents storage bloat
4. **Validation**: File type and size validation
5. **Error Handling**: Graceful fallbacks for storage failures

## Usage Example

```typescript
import { imageService } from '../services/imageService';

// Store an image
const result = await imageService.storeImage(file);
if (result.success) {
  const imageUrl = result.imageUrl; // Use this URL in your issue
}

// Clean up old images (called automatically)
imageService.cleanupOldImages();
```

## Storage Limits

- **Browser Storage**: Limited by browser's localStorage quota (typically 5-10MB)
- **Image Size**: Maximum 5MB per image
- **Retention**: Images older than 30 days are automatically cleaned up
- **Formats**: JPEG, PNG, WebP only

## Future Enhancements

1. **Cloud Storage**: Integration with cloud storage services
2. **Image Compression**: Automatic image optimization
3. **CDN Integration**: Content delivery network for better performance
4. **Backup System**: Regular backup of stored images
