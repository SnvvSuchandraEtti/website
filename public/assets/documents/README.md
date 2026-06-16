# Certificate Assets Directory

This directory contains certificate PDF files and related documents.

## Structure

```
documents/
├── certificates/
│   ├── technical/          # Technical certification PDFs
│   └── participation/      # Participation certificate PDFs
└── resume/                 # Resume and CV files
```

## Adding New Certificates

### 1. Save the PDF File
- Save your certificate PDF in the appropriate category folder:
  - Technical certificates: `technical/`
  - Participation certificates: `participation/`

### 2. Create a Thumbnail (Optional)
- Create a thumbnail image (400x300px recommended)
- Save in: `/assets/images/certificates/thumbnails/`
- Use the same filename as PDF but with `.jpg` extension

### 3. Update Certificate Data
Edit `src/data/certificates.ts` and add your certificate entry:

```javascript
{
  id: 'unique-id',
  title: 'Certificate Title',
  issuer: 'Issuing Organization',
  date: 'Issue Date',
  category: 'technical', // or 'participation'
  description: 'Certificate description',
  imageUrl: AssetManager.getCertificateImagePath('your-cert-thumbnail.jpg'),
  pdfUrl: AssetManager.getCertificatePdfPath('technical', 'your-cert.pdf'),
  pdfFilename: 'your-cert.pdf',
  thumbnailFilename: 'your-cert-thumbnail.jpg',
  credentialUrl: 'verification-url', // Optional
  skills: ['Skill 1', 'Skill 2'] // Optional
}
```

### 4. Deploy
- Commit and push your changes
- Deploy to Vercel/Netlify
- Your certificate will be available immediately

## File Naming Convention

Use lowercase, hyphen-separated names:
- `flutter-internship-certificate.pdf`
- `nptel-privacy-security.pdf`
- `brandquetz-19-participation.pdf`

## Tips

- Keep PDF file sizes reasonable (<5MB recommended)
- Use descriptive filenames
- Ensure thumbnails are clear and readable
- Test locally before deploying