
# Testing Guide

## Overview

This guide covers how to test the Donation Platform API using various methods including Postman, interactive testing, and automated scripts.

## Test Environment Setup

### Base URL
```
Development: http://0.0.0.0:5000
Production: https://your-replit-deployment.com
```

### Test Data

Create test users for different roles:

```javascript
const testUsers = {
    admin: {
        email: "admin@test.com",
        password: "Admin123!",
        role: "admin"
    },
    ngo: {
        fullName: "Test NGO Organization",
        email: "ngo@test.com",
        password: "TestPassword123!",
        role: "ngo"
    },
    company: {
        fullName: "Test Company Inc",
        email: "company@test.com",
        password: "TestPassword123!",
        role: "company"
    }
};
```

## Testing Methods

### 1. Interactive Testing

Run the interactive test suite:

```bash
node interactive-test.js
```

This provides a menu-driven interface to test different API endpoints.

### 2. Postman Collections

Import the provided Postman collections from `docs/testing/`:

- Admin API Collection
- NGO API Collection
- Company API Collection
- Public API Collection

### 3. Automated Testing

Run automated tests:

```bash
node test-runner.js
```

## Test Scenarios

### Authentication Testing

1. **User Registration**
   ```javascript
   // Test NGO registration
   POST /api/auth/register
   {
     "fullName": "Test NGO",
     "email": "test@ngo.com",
     "password": "Password123!",
     "role": "ngo"
   }
   ```

2. **User Login**
   ```javascript
   POST /api/auth/login
   {
     "email": "test@ngo.com",
     "password": "Password123!"
   }
   ```

3. **Profile Management**
   ```javascript
   GET /api/auth/profile
   Authorization: Bearer <token>
   ```

### Admin Testing

1. **User Management**
   ```javascript
   GET /api/admin/users
   PUT /api/admin/users/:id/approve
   DELETE /api/admin/users/:id
   ```

2. **Campaign Management**
   ```javascript
   GET /api/admin/campaigns
   PUT /api/admin/campaigns/:id/approve
   ```

3. **Dashboard Analytics**
   ```javascript
   GET /api/admin/dashboard
   ```

### NGO Testing

1. **Profile Creation**
   ```javascript
   POST /api/ngo/profile
   {
     "ngoName": "Test Foundation",
     "registrationNumber": "NGO123456",
     "focusAreas": ["education", "healthcare"]
   }
   ```

2. **Campaign Creation**
   ```javascript
   POST /api/ngo/campaigns
   {
     "title": "Clean Water Project",
     "targetAmount": 500000,
     "category": "healthcare"
   }
   ```

3. **File Uploads**
   ```javascript
   POST /api/ngo/campaigns/:id/images
   Content-Type: multipart/form-data
   campaignImages: <image_file>
   ```

### Company Testing

1. **Company Profile**
   ```javascript
   POST /api/company/profile
   {
     "companyName": "Tech Solutions",
     "industry": "Technology",
     "csrBudget": 5000000
   }
   ```

2. **Campaign Browsing**
   ```javascript
   GET /api/company/campaigns?category=education
   ```

3. **Donation Processing**
   ```javascript
   POST /api/company/donate
   {
     "campaignId": "campaign_id",
     "amount": 50000,
     "paymentMethod": "UPI"
   }
   ```

### Public API Testing

1. **Public Campaigns**
   ```javascript
   GET /api/public/campaigns
   ```

2. **Platform Statistics**
   ```javascript
   GET /api/public/stats
   ```

3. **NGO Discovery**
   ```javascript
   GET /api/public/ngos
   ```

## File Upload Testing

### Profile Image Upload
```javascript
PUT /api/auth/profile-image
Content-Type: multipart/form-data
profileImage: <image_file>
```

### Campaign File Uploads
```javascript
// Campaign images
POST /api/ngo/campaigns/:id/images
campaignImages: <image_files>

// Campaign documents
POST /api/ngo/campaigns/:id/documents
campaignDocuments: <document_files>

// Campaign proof
POST /api/ngo/campaigns/:id/proof
campaignProof: <proof_files>
```

## Error Testing

### Authentication Errors
- Invalid credentials
- Expired tokens
- Missing authorization headers
- Insufficient permissions

### Validation Errors
- Invalid email formats
- Weak passwords
- Missing required fields
- Invalid file types

### File Upload Errors
- File size limits
- Invalid file types
- Missing files

## Performance Testing

### Load Testing
- Multiple concurrent requests
- Large file uploads
- Database query performance

### Response Time Testing
- API endpoint response times
- File upload speeds
- Report generation times

## Security Testing

### Authentication Security
- Token validation
- Password strength
- Session management

### File Upload Security
- File type validation
- File size limits
- Path traversal protection

### Input Validation
- SQL injection prevention
- XSS protection
- Data sanitization

## Test Data Cleanup

After testing, clean up test data:

```javascript
// Delete test users
DELETE /api/admin/users/:id

// Delete test campaigns
DELETE /api/admin/campaigns/:id

// Remove uploaded files
```

## Continuous Testing

### Test Automation
- Set up automated test runs
- Integration with CI/CD
- Regular regression testing

### Monitoring
- API response monitoring
- Error rate tracking
- Performance metrics

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Check token validity
   - Verify user permissions
   - Confirm role assignments

2. **File Upload Issues**
   - Check file size limits
   - Verify file types
   - Confirm upload permissions

3. **Database Errors**
   - Check MongoDB connection
   - Verify data integrity
   - Confirm schema validation

### Debug Tools

- Console logging
- Network inspection
- Database query analysis
- Error stack traces

## Test Reporting

Generate test reports including:
- Test coverage
- Pass/fail rates
- Performance metrics
- Error analysis

This comprehensive testing approach ensures the API is robust, secure, and performant across all user roles and scenarios.
