
# Authentication API

This document covers all authentication-related endpoints including user registration, login, profile management, and role-based operations.

## Base URL
```
/api/auth
```

## Endpoints Overview

### Public Endpoints
- `POST /register` - User registration
- `POST /login` - User login
- `POST /admin/setup` - Initial admin setup

### Protected Endpoints
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /profile-image` - Upload profile image
- `GET /verify-token` - Verify JWT token

## Authentication Flow

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phoneNumber": "+1234567890",
  "role": "ngo|company|donor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ngo",
    "isApproved": false
  },
  "token": "jwt_token_here"
}
```

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ngo",
    "isApproved": true
  },
  "token": "jwt_token_here"
}
```

### 3. Profile Management
**Endpoint:** `GET /api/auth/profile`

**Headers:**
```http
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "ngo",
    "profileImage": "/uploads/Profile/image.jpg",
    "phoneNumber": "+1234567890",
    "isApproved": true
  }
}
```

### 4. Profile Image Upload
**Endpoint:** `PUT /api/auth/profile-image`

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
profileImage: <image_file>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "user": {
    "_id": "user_id",
    "profileImage": "/uploads/Profile/new-image.jpg"
  },
  "imagePath": "/uploads/Profile/new-image.jpg"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Role-Based Access

Different roles have different access levels:

- **Admin**: Full system access
- **NGO**: Campaign creation, profile management
- **Company**: Donation capabilities, campaign browsing
- **Donor**: Individual donations, campaign browsing

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire in 7 days
- Profile images are validated for file type and size
- All file uploads are sanitized
