
# API Routes Structure

## Overview

The API is organized into logical route groups based on user roles and functionality.

## Route Groups

### 1. Authentication Routes (`/api/auth/`)
- User registration and login
- Profile management
- Token verification
- Admin setup

**Key Routes:**
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `PUT /profile-image` - Upload profile image

### 2. Admin Routes (`/api/admin/`)
- Complete platform administration
- User management
- Campaign approval
- System settings
- Reports generation

**Key Routes:**
- `GET /users` - User management
- `GET /campaigns` - Campaign management
- `GET /dashboard` - Admin dashboard
- `GET /reports/*` - Report generation
- `POST /notices` - Notice management

### 3. NGO Routes (`/api/ngo/`)
- NGO profile management
- Campaign creation and management
- Donation tracking

**Key Routes:**
- `GET /profile` - NGO profile
- `POST /campaigns` - Create campaign
- `GET /campaigns` - My campaigns
- `GET /donations` - Received donations

### 4. Company Routes (`/api/company/`)
- Company profile management
- Campaign browsing
- Donation processing

**Key Routes:**
- `GET /profile` - Company profile
- `GET /campaigns` - Browse campaigns
- `POST /donate` - Make donation
- `GET /donations` - Donation history

### 5. Public Routes (`/api/public/`)
- Public campaign listings
- Platform statistics
- NGO discovery
- No authentication required

**Key Routes:**
- `GET /campaigns` - Public campaigns
- `GET /ngos` - Public NGO profiles
- `GET /stats` - Platform statistics
- `GET /search` - Global search

### 6. Campaign Routes (`/api/campaigns/`)
- Cross-role campaign operations
- Campaign details and media

**Key Routes:**
- `GET /:id` - Campaign details
- `GET /:id/images` - Campaign images
- `GET /:id/documents` - Campaign documents

### 7. Donation Routes (`/api/donations/`)
- Donation processing
- Transaction management

**Key Routes:**
- `POST /` - Process donation
- `GET /:id` - Donation details
- `GET /:id/receipt` - Donation receipt

## Authentication Flow

### Public Routes
No authentication required:
- Campaign listings
- Platform statistics
- Public NGO profiles

### Protected Routes
Require JWT token in Authorization header:
```http
Authorization: Bearer <jwt_token>
```

### Role-Based Access
- **Admin**: Access to all admin routes
- **NGO**: Access to NGO-specific routes
- **Company**: Access to company-specific routes
- **Donor**: Basic donation capabilities

## File Upload Routes

### Profile Images
- `PUT /api/auth/profile-image`
- Accepts: JPEG, JPG, PNG, GIF, WebP
- Max size: 5MB

### Campaign Files
- `POST /api/ngo/campaigns/:id/images`
- `POST /api/ngo/campaigns/:id/documents`
- `POST /api/ngo/campaigns/:id/proof`

### Admin Uploads
- `POST /api/admin/branding/upload`
- `POST /api/admin/test-upload`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Query Parameters

### Common Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field
- `order` - Sort order (asc, desc)

### Filter Parameters
- `status` - Filter by status
- `category` - Filter by category
- `role` - Filter by user role
- `startDate` - Date range start
- `endDate` - Date range end

## Rate Limiting

Certain endpoints have rate limiting:
- Login attempts: 5 per minute
- File uploads: 10 per minute
- API calls: 100 per minute

## CORS Configuration

Cross-origin requests are configured to allow:
- Development: `http://localhost:*`
- Production: Your deployed domain

## Static File Serving

Uploaded files are served via:
```
/uploads/Profile/filename.jpg
/uploads/campaign/image/filename.jpg
/uploads/branding/logo.png
```

## Error Handling

All routes include comprehensive error handling:
- Input validation
- Authentication checks
- Authorization verification
- Database error handling
- File upload error handling

## Middleware Stack

1. **CORS** - Cross-origin resource sharing
2. **Rate Limiting** - API protection
3. **Body Parsing** - JSON and form data
4. **Authentication** - JWT validation
5. **File Upload** - Multer configuration
6. **Error Handling** - Centralized error processing
7. **Activity Logging** - Audit trail
