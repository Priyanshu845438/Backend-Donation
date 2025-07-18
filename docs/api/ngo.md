
# NGO API

Documentation for NGO-specific operations including profile management, campaign creation, and donation tracking.

## Base URL
```
/api/ngo
```

## Authentication
All NGO endpoints require NGO role authentication:
```http
Authorization: Bearer <ngo_jwt_token>
```

## Profile Management

### Get NGO Profile
**Endpoint:** `GET /api/ngo/profile`

### Create NGO Profile
**Endpoint:** `POST /api/ngo/profile`

**Request Body:**
```json
{
  "ngoName": "Save the World Foundation",
  "registrationNumber": "NGO123456",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "contactPerson": "John Doe",
  "website": "https://savetheworld.org",
  "description": "NGO description",
  "focusAreas": ["education", "healthcare", "environment"]
}
```

### Update NGO Profile
**Endpoint:** `PUT /api/ngo/profile`

## Campaign Management

### Get My Campaigns
**Endpoint:** `GET /api/ngo/campaigns`

### Create Campaign
**Endpoint:** `POST /api/ngo/campaigns`

**Request Body:**
```json
{
  "title": "Clean Water Project",
  "description": "Providing clean water to rural communities",
  "category": "healthcare",
  "targetAmount": 500000,
  "endDate": "2024-12-31",
  "location": "Rural Maharashtra"
}
```

### Update Campaign
**Endpoint:** `PUT /api/ngo/campaigns/:id`

### Upload Campaign Images
**Endpoint:** `POST /api/ngo/campaigns/:id/images`

### Upload Campaign Documents
**Endpoint:** `POST /api/ngo/campaigns/:id/documents`

### Upload Campaign Proof
**Endpoint:** `POST /api/ngo/campaigns/:id/proof`

## Donations

### Get Campaign Donations
**Endpoint:** `GET /api/ngo/campaigns/:id/donations`

### Get All My Donations
**Endpoint:** `GET /api/ngo/donations`

## Analytics

### Get Campaign Analytics
**Endpoint:** `GET /api/ngo/campaigns/:id/analytics`

### Get Overall Analytics
**Endpoint:** `GET /api/ngo/analytics`
