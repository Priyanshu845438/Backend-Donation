
# Technical Overview

## Architecture

The Donation Platform is built using a modern Node.js stack with a RESTful API architecture, designed for scalability, security, and maintainability.

## Tech Stack

### Backend Framework
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.21+) - Web framework
- **MongoDB** (v5.0+) - NoSQL database
- **Mongoose** (v8.11+) - ODM for MongoDB

### Authentication & Security
- **JWT** - Stateless authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### File Handling
- **Multer** - File upload middleware
- **Express Static** - Static file serving

### Reporting
- **ExcelJS** - Excel file generation
- **PDFKit** - PDF generation

## Project Structure

```
donation-platform-backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── corsConfig.js        # CORS configuration
│   └── multerConfig.js      # File upload config
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── adminController.js   # Admin operations
│   ├── ngoController.js     # NGO operations
│   ├── companyController.js # Company operations
│   ├── reportsController.js # Reports generation
│   └── publicController.js  # Public endpoints
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── upload.js            # File upload handling
│   ├── rateLimiter.js       # Rate limiting
│   └── activityLogger.js    # Activity logging
├── models/
│   ├── User.js              # User schema
│   ├── NGO.js               # NGO profile schema
│   ├── Company.js           # Company profile schema
│   ├── Campaign.js          # Campaign schema
│   ├── Donation.js          # Donation schema
│   ├── Activity.js          # Activity log schema
│   ├── Notice.js            # Notice schema
│   ├── Settings.js          # Settings schema
│   └── Task.js              # Task management schema
├── routes/
│   ├── auth/                # Authentication routes
│   ├── admin/               # Admin panel routes
│   ├── ngo/                 # NGO specific routes
│   ├── company/             # Company specific routes
│   ├── public/              # Public access routes
│   ├── campaigns/           # Campaign management
│   └── donations/           # Donation processing
└── uploads/                 # File storage directory
```

## Database Schema

### User Model
- Authentication and basic profile information
- Role-based access control (admin, ngo, company, donor)
- Profile image and contact details

### NGO Model
- NGO-specific profile information
- Registration details and verification
- Focus areas and contact information

### Company Model
- Company profile and CSR information
- Industry and employee details
- CSR budget and focus areas

### Campaign Model
- Campaign details and metadata
- Target amount and deadline
- Status tracking and approval workflow

### Donation Model
- Donation transaction details
- Payment method and status
- Donor and campaign relationship

## API Design

### RESTful Architecture
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent response format
- Proper HTTP status codes

### Authentication Flow
1. User registration/login
2. JWT token generation
3. Token validation on protected routes
4. Role-based authorization

### File Upload System
- Profile images, campaign images, documents
- Validation and sanitization
- Organized storage structure

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- File upload validation
- Input sanitization
- Rate limiting
- Activity logging

## Deployment

### Replit Deployment
- Environment variables in Secrets
- Port configuration (5000)
- Static file serving
- Database connection

### Environment Variables
```
MONGODB_URI=mongodb://...
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
```

## Performance Considerations

- Database indexing
- Pagination for large datasets
- File size limits
- Efficient query patterns
- Caching strategies

## Monitoring & Logging

- Activity logging for audit trail
- Error tracking and handling
- Performance monitoring
- User action tracking
