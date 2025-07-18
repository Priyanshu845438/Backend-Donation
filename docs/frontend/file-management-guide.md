
# File Management & Upload Guide for Frontend Developers

Complete guide for handling file uploads, retrievals, and public sharing in your donation platform.

## Table of Contents
- [Overview](#overview)
- [File Upload System](#file-upload-system)
- [File Retrieval Endpoints](#file-retrieval-endpoints)
- [Public Campaign Sharing](#public-campaign-sharing)
- [Profile Image Management](#profile-image-management)
- [Frontend Implementation Examples](#frontend-implementation-examples)
- [File URL Structure](#file-url-structure)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)

## Overview

The platform supports multiple file types across different entities:
- **Profile Images**: User profile pictures
- **Campaign Images**: Visual content for campaigns
- **Campaign Documents**: Supporting documentation
- **Campaign Proof**: Evidence/verification documents
- **Branding Assets**: Logo, favicon, etc.

### Base URL Structure
```
Static Files: http://localhost:5000/uploads/
API Base: http://localhost:5000/api/
```

## File Upload System

### 1. Profile Image Upload

**Endpoint:** `PUT /api/auth/profile`
**Method:** Multipart form-data

```javascript
const uploadProfileImage = async (imageFile, authToken) => {
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Profile image upload error:', error);
    throw error;
  }
};
```

**File Requirements:**
- **Formats:** JPG, PNG, GIF, WebP
- **Size Limit:** 5MB
- **Storage:** `/uploads/Profile/`

### 2. Campaign Image Upload

**Endpoint:** `POST /api/admin/campaigns/:campaignId/images`
**Method:** Multipart form-data
**Field Name:** `image` (array supported)

```javascript
const uploadCampaignImages = async (campaignId, imageFiles, authToken) => {
  const formData = new FormData();
  
  // Handle multiple files
  if (Array.isArray(imageFiles)) {
    imageFiles.forEach(file => {
      formData.append('image', file);
    });
  } else {
    formData.append('image', imageFiles);
  }

  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Campaign images upload error:', error);
    throw error;
  }
};
```

**File Requirements:**
- **Formats:** JPG, PNG, GIF, WebP
- **Size Limit:** 10MB per file
- **Max Files:** 10 files
- **Storage:** `/uploads/campaign/image/`

### 3. Campaign Documents Upload

**Endpoint:** `POST /api/admin/campaigns/:campaignId/documents`
**Method:** Multipart form-data
**Field Name:** `documents` (array supported)

```javascript
const uploadCampaignDocuments = async (campaignId, documentFiles, authToken) => {
  const formData = new FormData();
  
  documentFiles.forEach(file => {
    formData.append('documents', file);
  });

  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Campaign documents upload error:', error);
    throw error;
  }
};
```

**File Requirements:**
- **Formats:** PDF, DOC, DOCX, XLS, XLSX, TXT
- **Size Limit:** 50MB per file
- **Max Files:** 10 files
- **Storage:** `/uploads/campaign/documents/`

### 4. Campaign Proof Upload

**Endpoint:** `POST /api/admin/campaigns/:campaignId/proof`
**Method:** Multipart form-data
**Field Name:** `proof` (array supported)

```javascript
const uploadCampaignProof = async (campaignId, proofFiles, authToken) => {
  const formData = new FormData();
  
  proofFiles.forEach(file => {
    formData.append('proof', file);
  });

  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Campaign proof upload error:', error);
    throw error;
  }
};
```

**File Requirements:**
- **Formats:** Images (JPG, PNG, GIF, WebP) + Documents (PDF, DOC, DOCX)
- **Size Limit:** 50MB per file
- **Max Files:** 10 files
- **Storage:** `/uploads/campaign/proof/`

## File Retrieval Endpoints

### 1. Get Profile Files

**Endpoint:** `GET /api/auth/profile/files`
**Authentication:** Required

```javascript
const getProfileFiles = async (authToken) => {
  try {
    const response = await fetch('/api/auth/profile/files', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get profile files error:', error);
    throw error;
  }
};
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Profile files retrieved successfully",
  "data": {
    "profileImage": "/uploads/Profile/profileImage_1234567890_image.jpg",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ngo"
  }
}
```

### 2. Get Campaign Files (Admin)

**Endpoint:** `GET /api/admin/campaigns/:campaignId/files`
**Authentication:** Admin only

```javascript
const getCampaignFiles = async (campaignId, authToken) => {
  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/files`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get campaign files error:', error);
    throw error;
  }
};
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Campaign files retrieved successfully",
  "data": {
    "files": {
      "images": [
        "/uploads/campaign/image/campaign_image_1234567890_photo1.jpg",
        "/uploads/campaign/image/campaign_image_1234567890_photo2.jpg"
      ],
      "documents": [
        "/uploads/campaign/documents/campaign_doc_1234567890_report.pdf"
      ],
      "proofDocs": [
        "/uploads/campaign/proof/campaign_proof_1234567890_certificate.pdf"
      ]
    }
  }
}
```

### 3. Get Campaign Images Only

**Endpoint:** `GET /api/admin/campaigns/:campaignId/images`

```javascript
const getCampaignImages = async (campaignId, authToken) => {
  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/images`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get campaign images error:', error);
    throw error;
  }
};
```

### 4. Get Campaign Documents Only

**Endpoint:** `GET /api/admin/campaigns/:campaignId/documents`

```javascript
const getCampaignDocuments = async (campaignId, authToken) => {
  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/documents`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get campaign documents error:', error);
    throw error;
  }
};
```

### 5. Get Campaign Proof Only

**Endpoint:** `GET /api/admin/campaigns/:campaignId/proof`

```javascript
const getCampaignProof = async (campaignId, authToken) => {
  try {
    const response = await fetch(`/api/admin/campaigns/${campaignId}/proof`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get campaign proof error:', error);
    throw error;
  }
};
```

## Public Campaign Sharing

### 1. Get Campaign by Share Link

**Endpoint:** `GET /api/public/share/:shareLink`
**Authentication:** Not required

```javascript
const getCampaignByShareLink = async (shareLink) => {
  try {
    const response = await fetch(`/api/public/share/${shareLink}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get campaign by share link error:', error);
    throw error;
  }
};
```

**Example Share Link:** `clean-water-project-a7b9c3d`

### 2. Get Public Campaign Files

**Endpoint:** `GET /api/public/campaigns/:id/files`
**Authentication:** Not required

```javascript
const getPublicCampaignFiles = async (campaignId) => {
  try {
    const response = await fetch(`/api/public/campaigns/${campaignId}/files`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get public campaign files error:', error);
    throw error;
  }
};
```

## Profile Image Management

### Complete Profile Image Component Example

```javascript
import React, { useState, useEffect } from 'react';

const ProfileImageManager = ({ authToken }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const result = await getProfileFiles(authToken);
      if (result.success && result.data.profileImage) {
        setProfileImage(`http://localhost:5000${result.data.profileImage}`);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload image
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadProfileImage(file, authToken);
      if (result.success) {
        setProfileImage(`http://localhost:5000${result.data.profileImage}`);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-image-manager">
      <div className="image-container">
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="profile-image" />
        ) : profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-image" />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="upload-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          style={{ display: 'none' }}
          id="profile-image-input"
        />
        <label htmlFor="profile-image-input" className="upload-button">
          {uploading ? 'Uploading...' : 'Change Image'}
        </label>
      </div>
    </div>
  );
};
```

## Frontend Implementation Examples

### 1. Campaign Gallery Component

```javascript
import React, { useState, useEffect } from 'react';

const CampaignGallery = ({ campaignId, authToken }) => {
  const [files, setFiles] = useState({
    images: [],
    documents: [],
    proofDocs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignFiles();
  }, [campaignId]);

  const fetchCampaignFiles = async () => {
    try {
      const result = await getCampaignFiles(campaignId, authToken);
      if (result.success) {
        setFiles(result.data.files);
      }
    } catch (error) {
      console.error('Error fetching campaign files:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderImages = () => (
    <div className="images-grid">
      {files.images.map((imagePath, index) => (
        <div key={index} className="image-item">
          <img 
            src={`http://localhost:5000${imagePath}`} 
            alt={`Campaign ${index + 1}`}
            className="campaign-image"
          />
        </div>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div className="documents-list">
      {files.documents.map((docPath, index) => (
        <div key={index} className="document-item">
          <a 
            href={`http://localhost:5000${docPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="document-link"
          >
            📄 Document {index + 1}
          </a>
        </div>
      ))}
    </div>
  );

  const renderProofDocs = () => (
    <div className="proof-docs-list">
      {files.proofDocs.map((proofPath, index) => (
        <div key={index} className="proof-item">
          <a 
            href={`http://localhost:5000${proofPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="proof-link"
          >
            📋 Proof {index + 1}
          </a>
        </div>
      ))}
    </div>
  );

  if (loading) return <div>Loading campaign files...</div>;

  return (
    <div className="campaign-gallery">
      <div className="gallery-section">
        <h3>Images</h3>
        {files.images.length > 0 ? renderImages() : <p>No images available</p>}
      </div>
      
      <div className="gallery-section">
        <h3>Documents</h3>
        {files.documents.length > 0 ? renderDocuments() : <p>No documents available</p>}
      </div>
      
      <div className="gallery-section">
        <h3>Proof Documents</h3>
        {files.proofDocs.length > 0 ? renderProofDocs() : <p>No proof documents available</p>}
      </div>
    </div>
  );
};
```

### 2. Public Campaign Page

```javascript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PublicCampaignPage = () => {
  const { shareLink } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignData();
  }, [shareLink]);

  const fetchCampaignData = async () => {
    try {
      // Fetch campaign details
      const campaignResult = await getCampaignByShareLink(shareLink);
      if (campaignResult.success) {
        setCampaign(campaignResult.data);
        
        // Fetch campaign files
        const filesResult = await getPublicCampaignFiles(campaignResult.data._id);
        if (filesResult.success) {
          setFiles(filesResult.data);
        }
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShareableLink = () => {
    return `${window.location.origin}/share/${shareLink}`;
  };

  if (loading) return <div>Loading campaign...</div>;
  if (!campaign) return <div>Campaign not found</div>;

  return (
    <div className="public-campaign-page">
      <div className="campaign-header">
        <h1>{campaign.campaignName}</h1>
        <p>{campaign.description}</p>
      </div>

      <div className="campaign-details">
        <div className="funding-info">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(campaign.raisedAmount / campaign.goalAmount) * 100}%` }}
            />
          </div>
          <p>Raised: ₹{campaign.raisedAmount.toLocaleString()} of ₹{campaign.goalAmount.toLocaleString()}</p>
        </div>

        <div className="ngo-info">
          <h3>About {campaign.ngoId.ngoName}</h3>
          <p>Contact: {campaign.ngoId.email}</p>
        </div>
      </div>

      {files && (
        <div className="campaign-media">
          {files.images.length > 0 && (
            <div className="images-section">
              <h3>Campaign Images</h3>
              <div className="images-grid">
                {files.images.map((imagePath, index) => (
                  <img 
                    key={index}
                    src={`http://localhost:5000${imagePath}`}
                    alt={`${campaign.campaignName} ${index + 1}`}
                    className="campaign-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="share-section">
        <h3>Share This Campaign</h3>
        <div className="share-link-container">
          <input 
            type="text" 
            value={generateShareableLink()} 
            readOnly 
            className="share-link-input"
          />
          <button 
            onClick={() => navigator.clipboard.writeText(generateShareableLink())}
            className="copy-button"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 3. File Upload Component

```javascript
import React, { useState } from 'react';

const FileUploadComponent = ({ campaignId, authToken, onUploadSuccess }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('images');

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    
    try {
      let uploadResult;
      
      switch (uploadType) {
        case 'images':
          uploadResult = await uploadCampaignImages(campaignId, files, authToken);
          break;
        case 'documents':
          uploadResult = await uploadCampaignDocuments(campaignId, files, authToken);
          break;
        case 'proof':
          uploadResult = await uploadCampaignProof(campaignId, files, authToken);
          break;
        default:
          throw new Error('Invalid upload type');
      }
      
      if (uploadResult.success) {
        onUploadSuccess && onUploadSuccess(uploadResult);
        alert('Files uploaded successfully!');
      } else {
        alert('Upload failed: ' + uploadResult.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-component">
      <div className="upload-type-selector">
        <label>
          <input
            type="radio"
            value="images"
            checked={uploadType === 'images'}
            onChange={(e) => setUploadType(e.target.value)}
          />
          Images
        </label>
        <label>
          <input
            type="radio"
            value="documents"
            checked={uploadType === 'documents'}
            onChange={(e) => setUploadType(e.target.value)}
          />
          Documents
        </label>
        <label>
          <input
            type="radio"
            value="proof"
            checked={uploadType === 'proof'}
            onChange={(e) => setUploadType(e.target.value)}
          />
          Proof
        </label>
      </div>

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          disabled={uploading}
          style={{ display: 'none' }}
          id="file-input"
          accept={uploadType === 'images' ? 'image/*' : '*'}
        />
        
        <label htmlFor="file-input" className="upload-label">
          {uploading ? (
            <div>Uploading...</div>
          ) : (
            <div>
              <p>Drag and drop files here or click to browse</p>
              <p>Upload Type: {uploadType}</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};
```

## File URL Structure

### Static File URLs
All uploaded files are accessible via static URLs:

```
Profile Images: http://localhost:5000/uploads/Profile/{filename}
Campaign Images: http://localhost:5000/uploads/campaign/image/{filename}
Campaign Documents: http://localhost:5000/uploads/campaign/documents/{filename}
Campaign Proof: http://localhost:5000/uploads/campaign/proof/{filename}
Branding: http://localhost:5000/uploads/branding/{filename}
```

### File Path Examples
```javascript
// Profile image
const profileImageUrl = `http://localhost:5000${user.profileImage}`;

// Campaign image
const campaignImageUrl = `http://localhost:5000${campaign.campaignImages[0]}`;

// Document download
const documentUrl = `http://localhost:5000${campaign.documents[0]}`;
```

## Error Handling

### Upload Errors
```javascript
const handleUploadError = (error) => {
  if (error.message.includes('LIMIT_FILE_SIZE')) {
    alert('File size exceeds limit');
  } else if (error.message.includes('LIMIT_UNEXPECTED_FILE')) {
    alert('Incorrect field name or file type');
  } else if (error.message.includes('Only image files')) {
    alert('Please upload only image files');
  } else if (error.message.includes('Only document files')) {
    alert('Please upload only document files');
  } else {
    alert('Upload failed: ' + error.message);
  }
};
```

### File Access Errors
```javascript
const handleFileAccessError = (error) => {
  if (error.status === 404) {
    alert('File not found');
  } else if (error.status === 403) {
    alert('Access denied');
  } else {
    alert('Error accessing file: ' + error.message);
  }
};
```

## Security Considerations

### File Type Validation
```javascript
const validateFileType = (file, allowedTypes) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(fileExtension);
};

// Usage
const isValidImage = validateFileType(file, ['jpg', 'jpeg', 'png', 'gif', 'webp']);
const isValidDocument = validateFileType(file, ['pdf', 'doc', 'docx', 'txt']);
```

### File Size Validation
```javascript
const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// Usage
const isValidSize = validateFileSize(file, 5 * 1024 * 1024); // 5MB
```

### Secure File Display
```javascript
const SecureImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(src);
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImageSrc(url);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadImage();
    }

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Image not available</div>;
  
  return <img src={imageSrc} alt={alt} {...props} />;
};
```

This comprehensive guide covers all file management aspects of your donation platform. Frontend developers can use this documentation to implement file uploads, retrievals, and public sharing functionality effectively.
