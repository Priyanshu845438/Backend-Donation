
# Admin API

Complete admin panel documentation covering user management, campaign management, analytics, and system administration.

## Base URL
```
/api/admin
```

## Authentication
All admin endpoints require admin role authentication:
```http
Authorization: Bearer <admin_jwt_token>
```

## User Management

### Get All Users
**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `role` - Filter by user role (ngo, company, donor)
- `status` - Filter by approval status (approved, pending)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

### Create User
**Endpoint:** `POST /api/admin/users`

**Request Body:**
```json
{
  "fullName": "New User",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "ngo|company|donor",
  "phoneNumber": "+1234567890"
}
```

### Update User
**Endpoint:** `PUT /api/admin/users/:id`

### Delete User
**Endpoint:** `DELETE /api/admin/users/:id`

### Approve User
**Endpoint:** `PUT /api/admin/users/:id/approve`

## Campaign Management

### Get All Campaigns
**Endpoint:** `GET /api/admin/campaigns`

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected, active, completed)
- `category` - Filter by category
- `ngoId` - Filter by NGO

### Approve Campaign
**Endpoint:** `PUT /api/admin/campaigns/:id/approve`

### Reject Campaign
**Endpoint:** `PUT /api/admin/campaigns/:id/reject`

**Request Body:**
```json
{
  "rejectionReason": "Reason for rejection"
}
```

### Get Campaign Details
**Endpoint:** `GET /api/admin/campaigns/:id`

### Update Campaign
**Endpoint:** `PUT /api/admin/campaigns/:id`

### Delete Campaign
**Endpoint:** `DELETE /api/admin/campaigns/:id`

### Get Campaign Media
**Endpoint:** `GET /api/admin/campaigns/:id/media`

## Dashboard & Analytics

### Dashboard Overview
**Endpoint:** `GET /api/admin/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalNGOs": 85,
    "totalCompanies": 45,
    "totalCampaigns": 320,
    "activeCampaigns": 180,
    "totalDonations": 2500000,
    "recentActivities": [...],
    "campaignStats": {...},
    "userGrowth": [...]
  }
}
```

## Reports Management

### Generate User Report
**Endpoint:** `GET /api/admin/reports/users`

### Generate Campaign Report
**Endpoint:** `GET /api/admin/reports/campaigns`

### Generate Donation Report
**Endpoint:** `GET /api/admin/reports/donations`

### Generate Financial Report
**Endpoint:** `GET /api/admin/reports/financial`

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `format` - Report format (json, pdf, excel)

## Notice Management

### Get All Notices
**Endpoint:** `GET /api/admin/notices`

### Create Notice
**Endpoint:** `POST /api/admin/notices`

**Request Body:**
```json
{
  "title": "Important Notice",
  "content": "Notice content here",
  "type": "info|warning|success|error",
  "targetRole": "all|ngo|company|donor",
  "isActive": true
}
```

### Update Notice
**Endpoint:** `PUT /api/admin/notices/:id`

### Delete Notice
**Endpoint:** `DELETE /api/admin/notices/:id`

## Settings Management

### Get System Settings
**Endpoint:** `GET /api/admin/settings`

### Update Settings
**Endpoint:** `PUT /api/admin/settings`

### Upload Branding Assets
**Endpoint:** `POST /api/admin/branding/upload`

**Form Data:**
```
logo: <image_file>
favicon: <icon_file>
```

## Share Links Management

### Generate Share Link
**Endpoint:** `POST /api/admin/share-links`

**Request Body:**
```json
{
  "type": "campaign|ngo|company",
  "targetId": "target_object_id",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Get Share Links
**Endpoint:** `GET /api/admin/share-links`

### Delete Share Link
**Endpoint:** `DELETE /api/admin/share-links/:id`

## File Management

### Test File Upload
**Endpoint:** `POST /api/admin/test-upload`

**Form Data:**
```
testFile: <file>
```

## Error Handling

All admin endpoints return consistent error responses with proper HTTP status codes and detailed error messages for debugging.
