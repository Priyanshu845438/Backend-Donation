
# Postman Collections

## Available Collections

### 1. Admin API Collection
**File:** `docs/testing/admin-api-tests.json`

**Includes:**
- User management endpoints
- Campaign approval workflow
- Dashboard analytics
- Reports generation
- System settings

### 2. Public API Collection
**File:** `docs/testing/api-collection.json`

**Includes:**
- Public campaign listings
- Platform statistics
- NGO discovery
- Search functionality

### 3. Reports Management Collection
**File:** `docs/testing/reports-management.json`

**Includes:**
- User reports
- Campaign reports
- Donation reports
- Financial analytics
- Custom reports

### 4. Notice Management Collection
**File:** `docs/testing/notice-management.json`

**Includes:**
- Create notices
- Update notices
- Delete notices
- Public notice access

### 5. User Task Management Collection
**File:** `docs/testing/user-task-management.json`

**Includes:**
- Task creation
- Task management
- Task scheduling
- Task analytics

## How to Import

1. **Open Postman**
2. **Click Import**
3. **Select the JSON file**
4. **Configure environment variables**

## Environment Variables

Set up these variables in Postman:

```javascript
{
  "base_url": "http://0.0.0.0:5000",
  "admin_token": "your_admin_jwt_token",
  "ngo_token": "your_ngo_jwt_token",
  "company_token": "your_company_jwt_token",
  "user_id": "test_user_id",
  "campaign_id": "test_campaign_id"
}
```

## Pre-request Scripts

Each collection includes pre-request scripts for:
- Token validation
- Dynamic variable generation
- Request headers setup

## Test Scripts

Collections include test scripts for:
- Response validation
- Status code verification
- Data integrity checks

## Usage Examples

### Admin Collection
1. Import admin collection
2. Set admin_token variable
3. Run user management tests
4. Test campaign approval workflow

### Reports Collection
1. Import reports collection
2. Configure date ranges
3. Test different report formats
4. Validate export functionality

## Collection Structure

Each collection is organized by:
- **Authentication** - Login and token setup
- **CRUD Operations** - Create, read, update, delete
- **File Uploads** - Image and document uploads
- **Analytics** - Reports and statistics
- **Error Handling** - Error scenario testing

## Running Collections

### Individual Requests
Run specific API calls to test individual endpoints.

### Collection Runner
Use Postman's Collection Runner to:
- Run entire test suites
- Generate test reports
- Validate API workflows

### Automated Testing
Set up automated collection runs:
- Scheduled testing
- CI/CD integration
- Monitoring alerts

## Test Data

Collections include sample test data for:
- User registration
- Campaign creation
- Donation processing
- File uploads

## Validation

Each request includes validation for:
- Response format
- Required fields
- Data types
- Error messages

This comprehensive collection setup enables thorough API testing across all platform features.
