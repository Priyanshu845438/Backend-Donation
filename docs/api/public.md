
# Public API

Documentation for public endpoints that don't require authentication, including campaign listings, NGO profiles, and public statistics.

## Base URL
```
/api/public
```

## No Authentication Required
All public endpoints are accessible without authentication.

## Campaigns

### Get Public Campaigns
**Endpoint:** `GET /api/public/campaigns`

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status (active, completed)
- `search` - Search in title and description
- `page` - Page number
- `limit` - Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50
    }
  }
}
```

### Get Campaign Details
**Endpoint:** `GET /api/public/campaigns/:id`

### Get Campaign Statistics
**Endpoint:** `GET /api/public/campaigns/:id/stats`

## NGO Profiles

### Get Public NGO Profiles
**Endpoint:** `GET /api/public/ngos`

### Get NGO Details
**Endpoint:** `GET /api/public/ngos/:id`

### Get NGO Campaigns
**Endpoint:** `GET /api/public/ngos/:id/campaigns`

## Platform Statistics

### Get Platform Stats
**Endpoint:** `GET /api/public/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCampaigns": 250,
    "activeCampaigns": 120,
    "totalDonations": 15000000,
    "totalNGOs": 85,
    "totalCompanies": 45,
    "impactMetrics": {
      "livesImpacted": 50000,
      "projectsCompleted": 180
    }
  }
}
```

## Search

### Global Search
**Endpoint:** `GET /api/public/search`

**Query Parameters:**
- `q` - Search query
- `type` - Search type (campaigns, ngos, all)

## Categories

### Get Available Categories
**Endpoint:** `GET /api/public/categories`

## Notices

### Get Public Notices
**Endpoint:** `GET /api/public/notices`

## Share Links

### Access Shared Content
**Endpoint:** `GET /api/public/share/:token`
