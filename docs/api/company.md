
# Company API

Documentation for company-specific operations including profile management, campaign browsing, and donation processing.

## Base URL
```
/api/company
```

## Authentication
All company endpoints require company role authentication:
```http
Authorization: Bearer <company_jwt_token>
```

## Profile Management

### Get Company Profile
**Endpoint:** `GET /api/company/profile`

### Create Company Profile
**Endpoint:** `POST /api/company/profile`

**Request Body:**
```json
{
  "companyName": "Tech Solutions Inc",
  "registrationNumber": "CIN123456789",
  "industry": "Technology",
  "employeeCount": "100-500",
  "website": "https://techsolutions.com",
  "address": {
    "street": "456 Business Park",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  },
  "csr": {
    "hasCSRPolicy": true,
    "csrBudget": 5000000,
    "focusAreas": ["education", "healthcare"]
  }
}
```

### Update Company Profile
**Endpoint:** `PUT /api/company/profile`

## Campaign Browsing

### Get Available Campaigns
**Endpoint:** `GET /api/company/campaigns`

**Query Parameters:**
- `category` - Filter by category
- `location` - Filter by location
- `targetAmount` - Filter by target amount range

### Get Campaign Details
**Endpoint:** `GET /api/company/campaigns/:id`

## Donations

### Make Donation
**Endpoint:** `POST /api/company/donate`

**Request Body:**
```json
{
  "campaignId": "campaign_id",
  "amount": 50000,
  "paymentMethod": "UPI|Net Banking|Credit Card",
  "anonymous": false,
  "message": "Happy to support this cause"
}
```

### Get My Donations
**Endpoint:** `GET /api/company/donations`

### Get Donation Receipt
**Endpoint:** `GET /api/company/donations/:id/receipt`

## Analytics

### Get Donation Analytics
**Endpoint:** `GET /api/company/analytics`

## NGO Discovery

### Get NGO Profiles
**Endpoint:** `GET /api/company/ngos`

### Get NGO Details
**Endpoint:** `GET /api/company/ngos/:id`
