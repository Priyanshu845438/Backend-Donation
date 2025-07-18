# Donation Platform API Documentation

Welcome to the Donation Platform Backend API documentation. This platform facilitates donations between companies/individuals and NGOs through a comprehensive management system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm package manager

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start the server: `npm run dev`

### Base URL
```
Development: http://0.0.0.0:5000
Production: https://your-replit-deployment.com
```

## 📚 Documentation Structure

### 📋 API Endpoints
- **[Authentication](./api/auth.md)** - User registration, login, profile management
- **[Admin Panel](./api/admin.md)** - Complete admin operations
- **[NGO Operations](./api/ngo.md)** - NGO-specific features
- **[Company Operations](./api/company.md)** - Company donation features
- **[Public Access](./api/public.md)** - Public campaigns and data
- **[Reports & Analytics](./api/reports.md)** - Comprehensive reporting system

### 🔧 Technical Documentation
- **[Architecture & Tech Stack](./technical/overview.md)** - System architecture and technologies
- **[Setup Guide](./setup/installation.md)** - Local development setup
- **[API Structure](./setup/routes.md)** - API routing organization

### 🧪 Testing & Development
- **[Testing Guide](./testing/guide.md)** - How to test the API
- **[Postman Collections](./testing/collections.md)** - Import for easy testing

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin** - Full platform management access
- **NGO** - Campaign creation and management
- **Company** - Donation and browsing capabilities
- **Donor** - Individual donation capabilities

## ✨ Key Features

- ✅ Role-based authentication and authorization
- ✅ Campaign creation and management
- ✅ Donation processing and tracking
- ✅ File upload handling (images, documents)
- ✅ Comprehensive admin dashboard
- ✅ Reports and analytics
- ✅ Notice management system
- ✅ User task management

## 🛡️ Security Features

- JWT-based authentication
- Role-based authorization
- File upload security
- Input validation and sanitization
- Activity logging and monitoring

## 📊 Recent Updates

- Enhanced admin campaign management
- Comprehensive reporting system
- User task management
- Notice management
- File upload improvements
```Development: http://0.0.0.0:5000
Production: https://your-replit-deployment.com
```

## 📚 Documentation Structure

### 📋 API Endpoints
- **[Authentication](./api/auth.md)** - User registration, login, profile management
- **[Admin Panel](./api/admin.md)** - Complete admin operations
- **[NGO Operations](./api/ngo.md)** - NGO-specific features
- **[Company Operations](./api/company.md)** - Company donation features
- **[Public Access](./api/public.md)** - Public campaigns and data
- **[Reports & Analytics](./api/reports.md)** - Comprehensive reporting system

### 🔧 Technical Documentation
- **[Architecture & Tech Stack](./technical/overview.md)** - System architecture and technologies
- **[Setup Guide](./setup/installation.md)** - Local development setup
- **[API Structure](./setup/routes.md)** - API routing organization

### 🧪 Testing & Development
- **[Testing Guide](./testing/guide.md)** - How to test the API
- **[Postman Collections](./testing/collections.md)** - Import for easy testing

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin** - Full platform management access
- **NGO** - Campaign creation and management
- **Company** - Donation and browsing capabilities
- **Donor** - Individual donation capabilities

## ✨ Key Features

- ✅ Role-based authentication and authorization
- ✅ Campaign creation and management
- ✅ Donation processing and tracking
- ✅ File upload handling (images, documents)
- ✅ Comprehensive admin dashboard
- ✅ Reports and analytics
- ✅ Notice management system
- ✅ User task management

## 🛡️ Security Features

- JWT-based authentication
- Role-based authorization
- File upload security
- Input validation and sanitization
- Activity logging and monitoring

## 📊 Recent Updates

- Enhanced admin campaign management
- Comprehensive reporting system
- User task management
- Notice management
- File upload improvements

## 🔧 Configuration

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/donation-platform
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
EMAIL_ID=your-email@gmail.com
EMAIL_PASS=your-app-password