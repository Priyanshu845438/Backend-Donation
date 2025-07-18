
# Reports & Analytics API

Comprehensive reporting system for generating various types of reports and analytics data.

## Base URL
```
/api/admin/reports
```

## Authentication
All report endpoints require admin authentication:
```http
Authorization: Bearer <admin_jwt_token>
```

## User Reports

### Generate User Report
**Endpoint:** `GET /api/admin/reports/users`

**Query Parameters:**
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `role` - Filter by role (ngo, company, donor)
- `status` - Filter by approval status
- `format` - Export format (json, pdf, excel)

## Campaign Reports

### Generate Campaign Report
**Endpoint:** `GET /api/admin/reports/campaigns`

**Query Parameters:**
- `startDate` - Campaign creation date range
- `endDate` - Campaign creation date range
- `status` - Campaign status filter
- `category` - Campaign category filter
- `format` - Export format (json, pdf, excel)

## Donation Reports

### Generate Donation Report
**Endpoint:** `GET /api/admin/reports/donations`

**Query Parameters:**
- `startDate` - Donation date range
- `endDate` - Donation date range
- `minAmount` - Minimum donation amount
- `maxAmount` - Maximum donation amount
- `paymentMethod` - Payment method filter
- `format` - Export format (json, pdf, excel)

## Financial Reports

### Generate Financial Summary
**Endpoint:** `GET /api/admin/reports/financial`

**Query Parameters:**
- `startDate` - Report period start
- `endDate` - Report period end
- `format` - Export format (json, pdf, excel)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalDonations": 2500000,
      "totalCampaigns": 150,
      "averageDonation": 5000,
      "platformFee": 125000
    },
    "monthlyBreakdown": [...],
    "categoryWise": {...},
    "paymentMethodWise": {...}
  }
}
```

## Dashboard Reports

### Get Dashboard Summary
**Endpoint:** `GET /api/admin/reports/dashboard`

## Custom Reports

### Generate Custom Report
**Endpoint:** `POST /api/admin/reports/custom`

**Request Body:**
```json
{
  "reportType": "donations|campaigns|users",
  "filters": {
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    },
    "categories": ["education", "healthcare"],
    "locations": ["Mumbai", "Delhi"]
  },
  "groupBy": "month|category|location",
  "format": "json|pdf|excel"
}
```

## Export Formats

### JSON Response
Standard API response format with data array and metadata.

### PDF Export
Formatted PDF report with charts and tables.

### Excel Export
Excel spreadsheet with multiple sheets for different data sections.

## Report Scheduling

### Schedule Report
**Endpoint:** `POST /api/admin/reports/schedule`

**Request Body:**
```json
{
  "reportType": "financial",
  "frequency": "daily|weekly|monthly",
  "recipients": ["admin@example.com"],
  "format": "pdf"
}
```
