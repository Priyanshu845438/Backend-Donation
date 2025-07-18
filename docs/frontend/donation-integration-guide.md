
# Donation System Frontend Integration Guide

## Overview
This guide provides comprehensive instructions for integrating the donation management system with your frontend application, including Razorpay payment gateway integration and real-time dashboard updates.

## Table of Contents
1. [Payment Gateway Integration](#payment-gateway-integration)
2. [Donation Management](#donation-management)
3. [Dashboard Components](#dashboard-components)
4. [Real-time Updates](#real-time-updates)
5. [Error Handling](#error-handling)

## Payment Gateway Integration

### 1. Initialize Payment

#### Create Payment Order
```javascript
// Create payment order
const createPaymentOrder = async (donationData) => {
  try {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Optional for guest donations
      },
      body: JSON.stringify({
        campaignId: donationData.campaignId,
        amount: donationData.amount,
        donorName: donationData.donorName,
        donorEmail: donationData.donorEmail,
        donorPhone: donationData.donorPhone,
        paymentMethod: 'razorpay'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Payment order creation failed:', error);
    throw error;
  }
};
```

#### Initialize Razorpay Checkout
```javascript
const initiatePayment = async (orderData) => {
  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  script.onload = () => {
    const options = {
      key: 'rzp_test_dummy_key', // Your Razorpay key
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'Donation Platform',
      description: `Donation for ${orderData.campaign.name}`,
      order_id: orderData.order.id,
      handler: async (response) => {
        // Payment successful
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          donationId: orderData.donation.id
        });
      },
      prefill: {
        name: orderData.donation.donorName,
        email: orderData.donation.donorEmail,
        contact: orderData.donation.donorPhone
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };
};
```

#### Verify Payment
```javascript
const verifyPayment = async (paymentData) => {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    
    if (result.success) {
      // Payment verified successfully
      showSuccessMessage('Payment completed successfully!');
      redirectToReceipt(result.data.donation.id);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    showErrorMessage('Payment verification failed. Please contact support.');
  }
};
```

### 2. Complete Donation Flow

#### React Component Example
```jsx
import React, { useState } from 'react';

const DonationForm = ({ campaignId, campaignName }) => {
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    isAnonymous: false
  });
  const [loading, setLoading] = useState(false);

  const handleDonation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create payment order
      const orderData = await createPaymentOrder({
        campaignId,
        ...formData
      });

      // Step 2: Initialize Razorpay
      await initiatePayment(orderData);
      
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonation} className="donation-form">
      <h3>Donate to {campaignName}</h3>
      
      <div className="form-group">
        <label>Donation Amount (₹)</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={formData.donorName}
          onChange={(e) => setFormData({...formData, donorName: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={formData.donorEmail}
          onChange={(e) => setFormData({...formData, donorEmail: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={formData.donorPhone}
          onChange={(e) => setFormData({...formData, donorPhone: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={formData.isAnonymous}
            onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
          />
          Donate anonymously
        </label>
      </div>

      <button type="submit" disabled={loading} className="donate-btn">
        {loading ? 'Processing...' : `Donate ₹${formData.amount || '0'}`}
      </button>
    </form>
  );
};
```

## Donation Management

### 1. Fetch Donations

#### Get Donations with Filters
```javascript
const fetchDonations = async (filters = {}) => {
  const queryParams = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.status && { status: filters.status }),
    ...(filters.campaignId && { campaignId: filters.campaignId }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.minAmount && { minAmount: filters.minAmount }),
    ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
    sortBy: filters.sortBy || 'donationDate',
    sortOrder: filters.sortOrder || 'desc'
  });

  try {
    const response = await fetch(`/api/donations?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    throw error;
  }
};
```

#### Donations List Component
```jsx
const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDonations();
  }, [filters]);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const result = await fetchDonations(filters);
      setDonations(result.data.donations);
      setPagination(result.data.pagination);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Completed': 'badge-success',
      'Pending': 'badge-warning',
      'Failed': 'badge-danger',
      'Refunded': 'badge-info'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'badge-secondary'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="donations-list">
      <div className="filters">
        <select 
          value={filters.status || ''} 
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        
        <input
          type="date"
          placeholder="Start Date"
          value={filters.startDate || ''}
          onChange={(e) => setFilters({...filters, startDate: e.target.value})}
        />
        
        <input
          type="date"
          placeholder="End Date"
          value={filters.endDate || ''}
          onChange={(e) => setFilters({...filters, endDate: e.target.value})}
        />
      </div>

      {loading ? (
        <div className="loading">Loading donations...</div>
      ) : (
        <div className="donations-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(donation => (
                <tr key={donation._id}>
                  <td>{new Date(donation.donationDate).toLocaleDateString()}</td>
                  <td>{donation.donorName || donation.donorId?.fullName || 'Anonymous'}</td>
                  <td>{donation.campaignId?.campaignName}</td>
                  <td>₹{donation.amount.toLocaleString('en-IN')}</td>
                  <td>{getStatusBadge(donation.status)}</td>
                  <td>
                    <button onClick={() => viewDonation(donation._id)}>View</button>
                    {donation.receiptUrl && (
                      <button onClick={() => downloadReceipt(donation._id)}>Receipt</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={pagination.current <= 1}
          onClick={() => setFilters({...filters, page: pagination.current - 1})}
        >
          Previous
        </button>
        <span>Page {pagination.current} of {pagination.pages}</span>
        <button 
          disabled={pagination.current >= pagination.pages}
          onClick={() => setFilters({...filters, page: pagination.current + 1})}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

## Dashboard Components

### 1. Admin Dashboard

#### Dashboard Statistics
```javascript
const fetchDashboardStats = async (period = '30') => {
  try {
    const response = await fetch(`/api/admin/dashboard/stats?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
};
```

#### Dashboard Component
```jsx
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [period]);

  const loadDashboardStats = async () => {
    try {
      const data = await fetchDashboardStats(period);
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.stats.users.totalUsers}</div>
          <div className="stat-detail">
            Active: {stats.stats.users.activeUsers}
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Campaigns</h3>
          <div className="stat-number">{stats.stats.campaigns.totalCampaigns}</div>
          <div className="stat-detail">
            Active: {stats.stats.campaigns.activeCampaigns}
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Donations</h3>
          <div className="stat-number">{stats.stats.donations.totalDonations}</div>
          <div className="stat-detail">
            Completed: {stats.stats.donations.completedDonations}
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Amount</h3>
          <div className="stat-number">
            ₹{stats.stats.donations.totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="stat-detail">
            Completed: ₹{stats.stats.donations.completedAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="progress-section">
        <h3>Campaign Progress</h3>
        <div className="progress-item">
          <label>Fund Raising Progress</label>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{
                width: `${Math.min(100, (stats.stats.campaigns.totalRaisedAmount / stats.stats.campaigns.totalTargetAmount) * 100)}%`
              }}
            ></div>
          </div>
          <span>
            ₹{stats.stats.campaigns.totalRaisedAmount.toLocaleString('en-IN')} / 
            ₹{stats.stats.campaigns.totalTargetAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="progress-item">
          <label>Donation Success Rate</label>
          <div className="progress-bar">
            <div 
              className="progress-fill success" 
              style={{
                width: `${(stats.stats.donations.completedDonations / stats.stats.donations.totalDonations) * 100}%`
              }}
            ></div>
          </div>
          <span>
            {((stats.stats.donations.completedDonations / stats.stats.donations.totalDonations) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Daily Donation Trends</h3>
          <DonationChart data={stats.trends.daily} />
        </div>

        <div className="chart-container">
          <h3>Top Campaigns</h3>
          <TopCampaignsChart data={stats.insights.topCampaigns} />
        </div>
      </div>
    </div>
  );
};
```

### 2. Progress Bar Component

```jsx
const ProgressBar = ({ current, target, label, showPercentage = true }) => {
  const percentage = Math.min(100, (current / target) * 100);
  
  return (
    <div className="progress-container">
      {label && <label className="progress-label">{label}</label>}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          {showPercentage && (
            <span className="progress-text">{percentage.toFixed(1)}%</span>
          )}
        </div>
      </div>
      <div className="progress-details">
        <span>₹{current.toLocaleString('en-IN')}</span>
        <span>₹{target.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};
```

## Real-time Updates

### 1. Setup Real-time Connection

```javascript
// Using polling for real-time updates
const useRealtimeUpdates = (interval = 30000) => {
  const [updates, setUpdates] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/realtime', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setUpdates(result.data.updates);
        }
      } catch (error) {
        console.error('Failed to fetch real-time updates:', error);
      }
    };

    fetchUpdates();
    const intervalId = setInterval(fetchUpdates, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return updates;
};
```

### 2. Real-time Dashboard Component

```jsx
const RealtimeDashboard = () => {
  const updates = useRealtimeUpdates(30000); // Update every 30 seconds

  if (!updates) return <div>Loading...</div>;

  return (
    <div className="realtime-dashboard">
      <div className="today-stats">
        <h3>Today's Stats</h3>
        <div className="stat-row">
          <span>Donations: {updates.today.todayDonations}</span>
          <span>Amount: ₹{updates.today.todayAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {updates.recentActivities.map(activity => (
          <div key={activity._id} className="activity-item">
            <span>{activity.description}</span>
            <small>{new Date(activity.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <div className="recent-donations">
        <h3>Recent Donations</h3>
        {updates.recentDonations.map(donation => (
          <div key={donation._id} className="donation-item">
            <span>{donation.donorName || 'Anonymous'}</span>
            <span>₹{donation.amount}</span>
            <span className={`status ${donation.status.toLowerCase()}`}>
              {donation.status}
            </span>
          </div>
        ))}
      </div>

      <div className="alerts">
        {updates.pendingApprovals > 0 && (
          <div className="alert alert-warning">
            {updates.pendingApprovals} campaigns pending approval
          </div>
        )}
      </div>
    </div>
  );
};
```

## Error Handling

### 1. Payment Error Handling

```javascript
const handlePaymentError = (error, context = '') => {
  console.error(`Payment error ${context}:`, error);
  
  const errorMessages = {
    'PAYMENT_FAILED': 'Payment processing failed. Please try again.',
    'INVALID_AMOUNT': 'Please enter a valid donation amount.',
    'NETWORK_ERROR': 'Network error. Please check your connection.',
    'VERIFICATION_FAILED': 'Payment verification failed. Please contact support.'
  };

  const message = errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  
  // Show user-friendly error message
  showErrorNotification(message);
  
  // Log error for debugging
  if (window.gtag) {
    window.gtag('event', 'payment_error', {
      error_code: error.code,
      error_message: error.message,
      context: context
    });
  }
};
```

### 2. API Error Handling

```javascript
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    return result;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
```

## CSS Styles

```css
/* Dashboard Styles */
.admin-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

.stat-detail {
  color: #666;
  font-size: 0.9em;
}

/* Progress Bar Styles */
.progress-container {
  margin: 15px 0;
}

.progress-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #007bff, #0056b3);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-fill.success {
  background: linear-gradient(45deg, #28a745, #1e7e34);
}

.progress-text {
  color: white;
  font-size: 0.8em;
  font-weight: bold;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
}

/* Donation Form Styles */
.donation-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.donate-btn {
  width: 100%;
  padding: 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.donate-btn:hover {
  background: #0056b3;
}

.donate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Status Badges */
.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}

.badge-success { background: #d4edda; color: #155724; }
.badge-warning { background: #fff3cd; color: #856404; }
.badge-danger { background: #f8d7da; color: #721c24; }
.badge-info { background: #d1ecf1; color: #0c5460; }
.badge-secondary { background: #e2e3e5; color: #383d41; }

/* Loading and Error States */
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
}

.success {
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .donation-form {
    margin: 20px;
    padding: 20px;
  }
  
  .charts-section {
    flex-direction: column;
  }
}
```

## API Endpoints Summary

### Payment Endpoints
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/simulate-success` - Simulate payment (testing)
- `GET /api/payment/receipt/:donationId` - Get donation receipt
- `GET /api/payment/stats` - Get payment statistics

### Donation Endpoints
- `GET /api/donations` - Get donations with filters
- `GET /api/donations/:id` - Get single donation
- `PUT /api/donations/:id/status` - Update donation status (admin)
- `GET /api/donations/analytics/summary` - Get donation analytics

### Dashboard Endpoints
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/realtime` - Get real-time updates
- `GET /api/admin/dashboard/analytics` - Get detailed analytics
- `GET /api/admin/dashboard/health` - Get system health

This comprehensive integration guide provides everything needed to implement a complete donation management system with payment gateway integration and real-time dashboard updates.
