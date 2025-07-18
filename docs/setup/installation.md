
# Installation & Setup Guide

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or cloud service)
- **npm** (comes with Node.js)

## Quick Start

### 1. Clone and Install

```bash
# Install dependencies
npm install

# Install additional packages if needed
npm install exceljs multer mongoose express jsonwebtoken bcryptjs cors
```

### 2. Environment Configuration

Create environment variables in Replit Secrets or `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/donation-platform
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

The application will automatically connect to MongoDB using the provided URI. Ensure your MongoDB instance is running.

### 4. Start the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://0.0.0.0:5000`

## Initial Setup

### 1. Create Admin User

After starting the server, create the initial admin user:

```bash
POST /api/auth/admin/setup
Content-Type: application/json

{
  "fullName": "Admin User",
  "email": "admin@yourplatform.com",
  "password": "SecurePassword123!",
  "phoneNumber": "+1234567890"
}
```

### 2. Test the Installation

```bash
# Test server health
GET http://0.0.0.0:5000/api/auth/profile

# Should return authentication error (expected)
```

## File Upload Configuration

The application automatically creates upload directories:

```
uploads/
├── Profile/           # User profile images
├── campaign/
│   ├── image/        # Campaign images
│   ├── documents/    # Campaign documents
│   └── proof/        # Campaign proof files
├── branding/         # Platform branding assets
└── general/          # General file uploads
```

## Database Collections

The application creates these MongoDB collections:

- `users` - User accounts and authentication
- `ngos` - NGO profiles and information
- `companies` - Company profiles and CSR details
- `campaigns` - Campaign data and status
- `donations` - Donation transactions
- `activities` - System activity logs
- `notices` - Platform notices
- `settings` - System settings
- `tasks` - User task management

## Development Tools

### API Testing

Use the provided Postman collections:
- Import from `docs/testing/`
- Set base URL to `http://0.0.0.0:5000`
- Configure authentication tokens

### Interactive Testing

Run the interactive test suite:

```bash
node interactive-test.js
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI in environment variables
   - Ensure MongoDB service is running

2. **File Upload Issues**
   - Check file permissions on uploads directory
   - Verify file size limits in configuration

3. **Authentication Errors**
   - Verify JWT secret is set
   - Check token expiration settings

4. **Missing Dependencies**
   ```bash
   npm install
   ```

### Logs and Debugging

- Check console output for error messages
- Activity logs are stored in the database
- Enable debug mode with `NODE_ENV=development`

## Production Deployment

### Replit Deployment

1. Configure environment variables in Secrets
2. Set up the run button to execute `npm run dev`
3. Deploy using Replit's deployment features

### Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong admin password
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS in production
- [ ] Enable rate limiting
- [ ] Configure file upload limits

## Next Steps

1. Create admin user
2. Set up NGO and company test accounts
3. Create test campaigns
4. Test donation flow
5. Configure platform settings
6. Set up reports and analytics

For detailed API documentation, see the [API Documentation](../api/).
