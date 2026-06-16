# Certificate Asset Migration Guide

This guide helps you migrate your certificate system from external URLs to local PDF storage.

## Overview

The new system provides:
✅ **Local PDF Storage** - All certificates stored in your project
✅ **PDF Viewer** - Built-in PDF viewing with zoom and download
✅ **Thumbnail Preview** - Fast loading with thumbnail images
✅ **Asset Management** - Centralized asset path management
✅ **Easy Maintenance** - Simple file drop and code update workflow

## Migration Steps

### Step 1: Organize Your Certificates

1. **Collect all certificate PDFs** from various sources
2. **Create thumbnails** for each certificate (optional but recommended)
   - Size: 400x300px (4:3 ratio) or 16:9 aspect ratio
   - Format: JPG or PNG
   - Keep file size under 200KB

### Step 2: Set Up Directory Structure

Create the following folders in your `public/` directory:

```
public/
├── assets/
│   ├── images/
│   │   └── certificates/
│   │       └── thumbnails/
│   │           ├── nptel-privacy-security.jpg
│   │           ├── flutter-internship.jpg
│   │           └── [other-thumbnails].jpg
│   └── documents/
│       └── certificates/
│           ├── technical/
│           │   ├── nptel-privacy-security.pdf
│           │   ├── flutter-internship.pdf
│           │   └── [other-technical-certs].pdf
│           └── participation/
│               ├── brandquetz-19.pdf
│               ├── codequetz-14.pdf
│               └── [other-participation-certs].pdf
```

### Step 3: File Naming Convention

Use consistent, URL-friendly names:

**Good Examples:**
- `nptel-privacy-security-online-social-media.pdf`
- `flutter-internship-technical-hub.pdf`
- `brandquetz-19-taglines-slogans.pdf`

**Avoid:**
- Spaces in filenames
- Special characters (/, \\, :, *, ?, ", <, >, |)
- Very long names (keep under 50 characters)

### Step 4: Update Certificate Data

The new certificate interface includes PDF support:

```typescript
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'technical' | 'participation';
  description: string;
  imageUrl: string; // Thumbnail path
  pdfUrl?: string; // PDF file path
  credentialUrl?: string; // External verification URL
  skills?: string[];
  pdfFilename?: string; // Just the filename
  thumbnailFilename?: string; // Just the filename
}
```

**Example Migration:**

**Before:**
```javascript
{
  id: 'tech-1',
  title: 'Privacy and Security in Online Social Media',
  issuer: 'NPTEL - IIT',
  date: 'December 2023',
  category: 'technical',
  description: '...',
  imageUrl: 'https://i.ibb.co/RkY4d4xj/Timetable.png', // External URL
  credentialUrl: '#',
  skills: ['Privacy', 'Security', 'Social Media']
}
```

**After:**
```javascript
{
  id: 'tech-1',
  title: 'Privacy and Security in Online Social Media',
  issuer: 'NPTEL - IIT',
  date: 'December 2023',
  category: 'technical',
  description: '...',
  imageUrl: AssetManager.getCertificateImagePath('nptel-privacy-security.jpg'),
  pdfUrl: AssetManager.getCertificatePdfPath('technical', 'nptel-privacy-security.pdf'),
  pdfFilename: 'nptel-privacy-security.pdf',
  thumbnailFilename: 'nptel-privacy-security.jpg',
  credentialUrl: '#',
  skills: ['Privacy', 'Security', 'Social Media']
}
```

### Step 5: Test Your Migration

1. **Local Testing:**
   ```bash
   npm run dev
   ```
   - Visit `/certificates` page
   - Click on a certificate to view details
   - Test PDF viewer functionality
   - Test download functionality

2. **Check Console for Errors:**
   - Missing files will show in browser console
   - Fix any broken paths

### Step 6: Deploy

1. **Commit all files:**
   ```bash
   git add public/assets/
   git add src/data/certificates.ts
   git commit -m "Migrate certificates to local PDF storage"
   ```

2. **Deploy to Vercel/Netlify:**
   - Push to your repository
   - Automatic deployment will start
   - Test on production URL

## Adding New Certificates

### Quick Workflow

1. **Save Certificate PDF:**
   ```
   public/assets/documents/certificates/technical/new-certificate.pdf
   ```

2. **Create Thumbnail (optional):**
   ```
   public/assets/images/certificates/thumbnails/new-certificate.jpg
   ```

3. **Update certificates.ts:**
   ```javascript
   {
     id: 'tech-new',
     title: 'New Certification',
     issuer: 'Certification Body',
     date: 'January 2025',
     category: 'technical',
     description: 'Description of the new certification...',
     imageUrl: AssetManager.getCertificateImagePath('new-certificate.jpg'),
     pdfUrl: AssetManager.getCertificatePdfPath('technical', 'new-certificate.pdf'),
     pdfFilename: 'new-certificate.pdf',
     thumbnailFilename: 'new-certificate.jpg',
     credentialUrl: 'https://verify-url.com', // If available
     skills: ['Skill 1', 'Skill 2']
   }
   ```

4. **Commit and Deploy:**
   ```bash
   git add .
   git commit -m "Add new certificate: [Certificate Name]"
   git push
   ```

## Troubleshooting

### PDF Not Loading
- Check file path and spelling
- Ensure PDF is not corrupted
- Check browser console for 404 errors
- Verify file is in correct folder

### Thumbnail Not Showing
- Check image file exists
- Verify image format (JPG/PNG)
- Check file permissions
- Use browser dev tools to inspect image URL

### Download Not Working
- Ensure PDF file exists at specified path
- Check for typos in filename
- Test PDF file opens normally in browser

### Large File Sizes
- Optimize PDFs (reduce to <5MB)
- Compress thumbnail images
- Consider using WebP format for thumbnails

## File Size Recommendations

- **PDF Files:** < 5MB each (compress if larger)
- **Thumbnail Images:** < 200KB each
- **Total Certificate Assets:** < 100MB (for fast deployment)

## Performance Tips

- Use lazy loading for certificate lists
- Implement thumbnail fallbacks
- Cache PDF files in browser
- Optimize images with appropriate formats

## Security Considerations

- All files are publicly accessible via URLs
- Don't store sensitive information in filenames
- Consider watermarking PDFs if needed
- Use external credential URLs for verification

---

**Need Help?**

If you encounter issues during migration:
1. Check browser console for errors
2. Verify file paths and naming
3. Test with a single certificate first
4. Ensure all imports are correct