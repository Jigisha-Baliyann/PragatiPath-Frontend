// Image storage service for handling issue images
export interface ImageStorageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

class ImageService {
  private readonly STORAGE_KEY = 'pragatipath_images';
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  /**
   * Store image data and return a persistent URL
   */
  async storeImage(file: File): Promise<ImageStorageResult> {
    try {
      // Validate file
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Convert file to base64 for storage
      const base64Data = await this.fileToBase64(file);
      const imageId = this.generateImageId();
      const imageData = {
        id: imageId,
        data: base64Data,
        filename: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      // Store in localStorage
      const storedImages = this.getStoredImages();
      storedImages[imageId] = imageData;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedImages));

      // Return a persistent URL
      const imageUrl = `data:${file.type};base64,${base64Data}`;
      
      return { success: true, imageUrl };
    } catch (error) {
      console.error('Error storing image:', error);
      return { success: false, error: 'Failed to store image' };
    }
  }

  /**
   * Retrieve image by ID
   */
  getImage(imageId: string): string | null {
    const storedImages = this.getStoredImages();
    const imageData = storedImages[imageId];
    
    if (imageData) {
      return `data:${imageData.type};base64,${imageData.data}`;
    }
    
    return null;
  }

  /**
   * Clean up old images (older than 30 days)
   */
  cleanupOldImages(): void {
    const storedImages = this.getStoredImages();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const cleanedImages: Record<string, any> = {};
    
    Object.entries(storedImages).forEach(([id, imageData]) => {
      const uploadedDate = new Date(imageData.uploadedAt);
      if (uploadedDate > thirtyDaysAgo) {
        cleanedImages[id] = imageData;
      }
    });
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cleanedImages));
  }

  /**
   * Get storage statistics
   */
  getStorageStats(): { totalImages: number; totalSize: number } {
    const storedImages = this.getStoredImages();
    const totalImages = Object.keys(storedImages).length;
    const totalSize = Object.values(storedImages).reduce((sum: number, img: any) => sum + img.size, 0);
    
    return { totalImages, totalSize };
  }

  private validateImageFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' };
    }
    
    if (file.size > this.MAX_IMAGE_SIZE) {
      return { isValid: false, error: 'File too large. Please upload images smaller than 5MB.' };
    }
    
    return { isValid: true };
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private generateImageId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStoredImages(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading stored images:', error);
      return {};
    }
  }
}

export const imageService = new ImageService();
