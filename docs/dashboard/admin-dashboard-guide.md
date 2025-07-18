
# Admin Dashboard Developer Guide

Complete developer documentation for implementing the admin dashboard in your donation platform.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Dashboard Endpoints](#dashboard-endpoints)
- [Frontend Implementation](#frontend-implementation)
- [Data Models](#data-models)
- [WebSocket Integration](#websocket-integration)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## Overview

The admin dashboard provides comprehensive platform management capabilities including:
- Real-time analytics and KPIs
- User management and approvals
- Campaign oversight
- System health monitoring
- Security auditing
- Report generation

### Base URL
```
http://localhost:5000/api/admin
```

## Authentication

All dashboard endpoints require admin authentication:

```javascript
// Headers for all requests
{
  "Authorization": "Bearer <admin_jwt_token>",
  "Content-Type": "application/json"
}
```

### Admin Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@acadify.com",
  "password": "Acadify@123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "admin@acadify.com",
    "role": "admin"
  }
}
```

## Dashboard Endpoints

### 1. Main Dashboard Overview

**Endpoint:** `GET /api/admin/dashboard`

**Query Parameters:**
- `timeRange` - "7d", "30d", "90d", "1y" (default: "30d")
- `refresh` - boolean to force data refresh

**Frontend Implementation:**
```javascript
const fetchDashboardData = async (timeRange = '30d', refresh = false) => {
  try {
    const response = await fetch(`/api/admin/dashboard?timeRange=${timeRange}&refresh=${refresh}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Dashboard fetch error:', error);
  }
};
```

**Response Structure:**
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "timeRange": "30d",
  "kpis": {
    "users": {
      "total": 1250,
      "active": 1100,
      "growth": 15,
      "pending": 25,
      "activePercentage": 88
    },
    "organizations": {
      "ngos": {
        "total": 45,
        "active": 42,
        "growth": 8
      },
      "companies": {
        "total": 23,
        "active": 20,
        "growth": 12
      }
    },
    "campaigns": {
      "total": 156,
      "active": 89,
      "growth": 22,
      "pending": 12,
      "stats": {
        "totalTarget": 2500000,
        "totalRaised": 1875000,
        "completionRate": 0.75
      }
    },
    "donations": {
      "totalAmount": 1875000,
      "totalDonations": 3250,
      "averageAmount": 576.92
    }
  },
  "security": {
    "status": "secure",
    "failedLogins24h": 3,
    "suspiciousActivities": 1,
    "riskScore": 95
  },
  "quickActions": {
    "pendingApprovals": 25,
    "flaggedActivities": 1,
    "systemAlerts": 0,
    "maintenanceRequired": false
  },
  "recentActivities": [...],
  "recommendations": [...]
}
```

### 2. Dashboard Widgets

**Endpoint:** `GET /api/admin/dashboard/widgets`

**Query Parameters:**
- `widget` - Specific widget ("user-analytics", "campaign-performance", "activity-timeline", "security-monitor", "system-health")
- `timeRange` - Time range for data

**Available Widgets:**

#### User Analytics Widget
```javascript
const fetchUserAnalytics = async () => {
  const response = await fetch('/api/admin/dashboard/widgets?widget=user-analytics', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};
```

#### Campaign Performance Widget
```javascript
const fetchCampaignPerformance = async () => {
  const response = await fetch('/api/admin/dashboard/widgets?widget=campaign-performance', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};
```

### 3. Advanced Analytics

**Endpoint:** `GET /api/admin/dashboard/analytics`

**Query Parameters:**
- `metric` - "users", "campaigns", "activities", "performance"
- `timeRange` - "7d", "30d", "90d", "1y"
- `granularity` - "hour", "day", "week", "month"

**Implementation:**
```javascript
const fetchAdvancedAnalytics = async (metric, timeRange, granularity) => {
  const params = new URLSearchParams({
    metric,
    timeRange,
    granularity
  });
  
  const response = await fetch(`/api/admin/dashboard/analytics?${params}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  return response.json();
};
```

### 4. Real-time Updates

**Endpoint:** `GET /api/admin/dashboard/real-time`

**Query Parameters:**
- `lastUpdate` - ISO timestamp of last update

**Implementation:**
```javascript
// Poll for real-time updates every 30 seconds
const pollRealTimeUpdates = () => {
  setInterval(async () => {
    const lastUpdate = localStorage.getItem('lastDashboardUpdate');
    
    const response = await fetch(`/api/admin/dashboard/real-time?lastUpdate=${lastUpdate}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    const data = await response.json();
    
    if (data.hasUpdates) {
      updateDashboard(data.updates);
      localStorage.setItem('lastDashboardUpdate', data.timestamp);
    }
  }, 30000);
};
```

### 5. System Health

**Endpoint:** `GET /api/admin/dashboard/system-health`

**Response:**
```json
{
  "success": true,
  "data": {
    "server": {
      "platform": "linux",
      "arch": "x64",
      "nodeVersion": "v18.17.0",
      "uptime": 86400
    },
    "memory": {
      "total": 8589934592,
      "free": 4294967296,
      "used": 4294967296,
      "percentage": 50
    },
    "cpu": {
      "cores": 4,
      "loadAverage": [0.5, 0.8, 1.2],
      "usage": {
        "user": 150000,
        "system": 50000
      }
    },
    "database": {
      "status": "connected",
      "responseTime": "< 100ms"
    }
  }
}
```

### 6. Security Dashboard

**Endpoint:** `GET /api/admin/dashboard/security`

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "authentication": {
        "failedLogins24h": 15,
        "successfulLogins24h": 450,
        "uniqueLoginIPs": 87
      },
      "users": {
        "activeUsers": 1100,
        "suspendedUsers": 12,
        "pendingApprovals": 25,
        "adminUsers": 3
      },
      "threats": {
        "suspiciousActivities": 2,
        "blockedIPs": 0,
        "securityAlerts": 1
      }
    },
    "recentEvents": [...],
    "recommendations": [...]
  }
}
```

### 7. Dashboard Search

**Endpoint:** `GET /api/admin/dashboard/search`

**Query Parameters:**
- `query` - Search term (minimum 2 characters)
- `type` - Entity type ("users", "campaigns", "ngos", "companies", "activities")
- `limit` - Results limit (default: 10)

**Implementation:**
```javascript
const searchDashboard = async (query, type = null, limit = 10) => {
  const params = new URLSearchParams({
    query,
    limit: limit.toString()
  });
  
  if (type) params.append('type', type);
  
  const response = await fetch(`/api/admin/dashboard/search?${params}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  return response.json();
};
```

### 8. Dashboard Filters

**Endpoint:** `GET /api/admin/dashboard/filters`

**Query Parameters:**
- `entity` - "users", "campaigns", "ngos", "companies", "activities"
- `status` - "active", "inactive"
- `role` - User role filter
- `dateFrom`, `dateTo` - Date range
- `sortBy`, `sortOrder` - Sorting options
- `page`, `limit` - Pagination

### 9. Quick Actions

**Endpoint:** `POST /api/admin/dashboard/quick-actions`

**Request Body:**
```json
{
  "action": "activate|deactivate|approve|reject|delete",
  "entityType": "users|campaigns|ngos|companies",
  "entityIds": ["id1", "id2", "id3"],
  "params": {}
}
```

**Implementation:**
```javascript
const performQuickAction = async (action, entityType, entityIds) => {
  const response = await fetch('/api/admin/dashboard/quick-actions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action,
      entityType,
      entityIds
    })
  });
  
  return response.json();
};
```

### 10. Data Export

**Endpoint:** `GET /api/admin/dashboard/export/:type`

**Parameters:**
- `type` - "users", "campaigns", "activities", "analytics"
- `format` - "json", "csv" (query parameter)
- `dateFrom`, `dateTo` - Date range (query parameters)

**Implementation:**
```javascript
const exportData = async (type, format = 'json', dateFrom = null, dateTo = null) => {
  const params = new URLSearchParams({ format });
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  
  const response = await fetch(`/api/admin/dashboard/export/${type}?${params}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  
  // Handle file download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-export-${Date.now()}.${format}`;
  a.click();
};
```

## Frontend Implementation

### Dashboard Component Structure

```javascript
// Main Dashboard Component
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    setupRealTimeUpdates();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardData(timeRange);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <DashboardHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      <KPICards data={dashboardData?.kpis} />
      <ChartsSection data={dashboardData?.charts} />
      <QuickActions data={dashboardData?.quickActions} />
      <RecentActivities activities={dashboardData?.recentActivities} />
      <SecurityPanel security={dashboardData?.security} />
    </div>
  );
};
```

### KPI Cards Component

```javascript
const KPICards = ({ data }) => {
  if (!data) return <div>Loading...</div>;

  return (
    <div className="kpi-grid">
      <KPICard
        title="Total Users"
        value={data.users.total}
        growth={data.users.growth}
        icon="users"
        color="blue"
      />
      <KPICard
        title="Active Campaigns"
        value={data.campaigns.active}
        growth={data.campaigns.growth}
        icon="campaigns"
        color="green"
      />
      <KPICard
        title="Total Donations"
        value={`$${data.donations.totalAmount.toLocaleString()}`}
        growth={data.donations.growth}
        icon="money"
        color="purple"
      />
      <KPICard
        title="NGOs"
        value={data.organizations.ngos.total}
        growth={data.organizations.ngos.growth}
        icon="organization"
        color="orange"
      />
    </div>
  );
};
```

### Real-time Updates

```javascript
const useRealTimeUpdates = () => {
  const [updates, setUpdates] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const lastUpdate = localStorage.getItem('lastDashboardUpdate');
        const response = await fetch(`/api/admin/dashboard/real-time?lastUpdate=${lastUpdate}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (data.hasUpdates) {
          setUpdates(data.updates);
          localStorage.setItem('lastDashboardUpdate', data.timestamp);
        }
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return updates;
};
```

## Data Models

### Dashboard Response Model

```typescript
interface DashboardData {
  success: boolean;
  timestamp: string;
  timeRange: string;
  kpis: {
    users: UserKPIs;
    organizations: OrganizationKPIs;
    campaigns: CampaignKPIs;
    donations: DonationKPIs;
  };
  security: SecurityMetrics;
  quickActions: QuickActionData;
  recentActivities: Activity[];
  recommendations: Recommendation[];
}

interface UserKPIs {
  total: number;
  active: number;
  growth: number;
  pending: number;
  activePercentage: number;
}

interface CampaignKPIs {
  total: number;
  active: number;
  growth: number;
  pending: number;
  stats: {
    totalTarget: number;
    totalRaised: number;
    completionRate: number;
  };
}
```

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "code": "ERROR_CODE"
}
```

### Frontend Error Handling

```javascript
const handleApiError = (error, context) => {
  console.error(`${context} error:`, error);
  
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/admin/login';
  } else if (error.status === 403) {
    // Show access denied message
    showNotification('Access denied', 'error');
  } else if (error.status >= 500) {
    // Show server error message
    showNotification('Server error. Please try again later.', 'error');
  } else {
    // Show generic error
    showNotification(error.message || 'An error occurred', 'error');
  }
};
```

## Performance Optimization

### Caching Strategy

```javascript
// Cache dashboard data for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const dashboardCache = new Map();

const getCachedDashboardData = async (timeRange) => {
  const cacheKey = `dashboard-${timeRange}`;
  const cached = dashboardCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchDashboardData(timeRange);
  dashboardCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};
```

### Lazy Loading

```javascript
// Lazy load dashboard components
const DashboardCharts = lazy(() => import('./DashboardCharts'));
const SecurityPanel = lazy(() => import('./SecurityPanel'));
const ReportsSection = lazy(() => import('./ReportsSection'));

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <KPICards />
      <Suspense fallback={<div>Loading charts...</div>}>
        <DashboardCharts />
      </Suspense>
      <Suspense fallback={<div>Loading security panel...</div>}>
        <SecurityPanel />
      </Suspense>
    </div>
  );
};
```

## Testing

### API Testing

```javascript
// Test dashboard endpoint
describe('Dashboard API', () => {
  test('should fetch dashboard data', async () => {
    const response = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.kpis).toBeDefined();
  });
  
  test('should handle time range parameter', async () => {
    const response = await request(app)
      .get('/api/admin/dashboard?timeRange=7d')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    expect(response.body.timeRange).toBe('7d');
  });
});
```

### Frontend Testing

```javascript
// Test dashboard component
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

test('renders dashboard with KPI cards', async () => {
  render(<AdminDashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
  });
});
```

## Security Considerations

1. **Token Validation**: Always validate admin tokens on server-side
2. **Rate Limiting**: Implement rate limiting for dashboard endpoints
3. **Audit Logging**: Log all admin dashboard activities
4. **Data Sanitization**: Sanitize all search and filter inputs
5. **HTTPS Only**: Ensure all dashboard communication uses HTTPS

## Deployment Notes

- Dashboard works on port 5000 (mapped to 80/443 in production)
- Uses 0.0.0.0 binding for Replit compatibility
- MongoDB connection required for all dashboard features
- Environment variables needed: JWT_SECRET, MONGO_URI

## Support & Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MONGO_URI is set in environment
2. **Token Expiry**: Implement token refresh mechanism
3. **Performance**: Use pagination for large datasets
4. **Real-time Updates**: Fallback to polling if WebSocket fails

### Debug Endpoints

- `GET /health` - Server health check
- `GET /api/admin/system/info` - System information
- `GET /api/admin/dashboard/debug` - Debug information

This documentation provides complete implementation guidance for the admin dashboard. All endpoints are tested and functional with the current codebase.
