/**
 * Asset Manager - Centralized asset path management for certificates and other resources
 * Provides consistent asset loading with fallback mechanisms
 */

export class AssetManager {
  // Base paths for different asset types
  private static readonly BASE_PATHS = {
    certificateImages: '/assets/images/certificates/thumbnails/',
    certificatePdfs: '/assets/documents/certificates/',
    projectImages: '/assets/images/projects/',
    skillIcons: '/assets/images/skills/',
    profileImages: '/assets/images/profile/'
  };

  // Fallback assets
  private static readonly FALLBACKS = {
    certificateImage: '/assets/images/certificates/thumbnails/placeholder-certificate.jpg',
    certificatePdf: null, // No fallback for PDFs - will show error message
    projectImage: '/placeholder.svg',
    skillIcon: '/placeholder.svg',
    profileImage: '/placeholder.svg'
  };

  /**
   * Get certificate thumbnail image path
   */
  static getCertificateImagePath(filename: string): string {
    if (!filename) return this.FALLBACKS.certificateImage;
    return this.BASE_PATHS.certificateImages + filename;
  }

  /**
   * Get certificate PDF path based on category and filename
   */
  static getCertificatePdfPath(category: 'technical' | 'participation', filename: string): string | null {
    if (!filename) return null;
    return `${this.BASE_PATHS.certificatePdfs}${category}/${filename}`;
  }

  /**
   * Get project image path
   */
  static getProjectImagePath(filename: string): string {
    if (!filename) return this.FALLBACKS.projectImage;
    return this.BASE_PATHS.projectImages + filename;
  }

  /**
   * Get skill icon path
   */
  static getSkillIconPath(filename: string): string {
    if (!filename) return this.FALLBACKS.skillIcon;
    return this.BASE_PATHS.skillIcons + filename;
  }

  /**
   * Get profile image path
   */
  static getProfileImagePath(filename: string): string {
    if (!filename) return this.FALLBACKS.profileImage;
    return this.BASE_PATHS.profileImages + filename;
  }

  /**
   * Check if a PDF file exists (client-side check)
   */
  static async checkPdfExists(pdfPath: string): Promise<boolean> {
    try {
      const response = await fetch(pdfPath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Generate certificate filename from title (for standardization)
   */
  static generateCertificateFilename(title: string, category: 'technical' | 'participation'): {
    pdfFilename: string;
    thumbnailFilename: string;
  } {
    const normalized = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .substring(0, 50); // Limit length

    return {
      pdfFilename: `${normalized}.pdf`,
      thumbnailFilename: `${normalized}-thumb.jpg`
    };
  }

  /**
   * Get all asset paths for a certificate
   */
  static getCertificateAssets(
    title: string,
    category: 'technical' | 'participation',
    customPdfFilename?: string,
    customThumbnailFilename?: string
  ) {
    const generated = this.generateCertificateFilename(title, category);
    
    const pdfFilename = customPdfFilename || generated.pdfFilename;
    const thumbnailFilename = customThumbnailFilename || generated.thumbnailFilename;

    return {
      pdfPath: this.getCertificatePdfPath(category, pdfFilename),
      thumbnailPath: this.getCertificateImagePath(thumbnailFilename),
      fallbackThumbnailPath: this.FALLBACKS.certificateImage,
      pdfFilename,
      thumbnailFilename
    };
  }
}

export default AssetManager;