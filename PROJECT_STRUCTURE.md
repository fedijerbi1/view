# 🏥 SantéApp - Healthcare Management System

## Project Overview
SantéApp is a comprehensive healthcare management system designed for patients, doctors, and administrators.

## 📁 Project Structure

```
view/
├── public/                 # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/         # React components
│   │   ├── Login.js               # Login page (Patient/Doctor)
│   │   ├── RegisterPatient.js     # Patient registration
│   │   ├── CreateMedecin.js       # Doctor account creation
│   │   ├── Espaceadmin.js         # Admin dashboard
│   │   ├── PatientSpace.js        # Patient health dashboard
│   │   └── RegisterPatient.module.css
│   ├── config/             # Configuration files
│   │   └── api.js          # API endpoints and headers
│   ├── utils/              # Utility functions
│   │   ├── validation.js   # Form validation functions
│   │   └── errorHandler.js # Error handling utilities
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   └── setupTests.js       # Test configuration
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## 📋 Available Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Login | User authentication |
| `/register` | RegisterPatient | Patient self-registration |
| `/create_medecin` | CreateMedecin | Doctor account creation (Admin) |
| `/espace-admin` | Espaceadmin | Admin dashboard & user management |
| `/patient_space` | PatientSpace | Patient health dashboard |

## 🔐 Authentication

- Credentials are sent to `/api/login` endpoint
- JWT token is stored in `localStorage` with key `token`
- Token is automatically included in API requests via `Authorization: Bearer {token}` header
- Logout clears the token from localStorage

## 🛠️ Utilities

### API Configuration (`src/config/api.js`)
- Centralized API endpoints
- Environment-based URL configuration
- Helper function for authentication headers

### Validation Functions (`src/utils/validation.js`)
- Email validation
- CIN (ID number) validation
- Phone number validation
- Password strength validation
- Name validation
- Date of birth validation

### Error Handler (`src/utils/errorHandler.js`)
- Standardized API error handling
- HTTP status code mapping
- Error logging with context

## 📦 Dependencies

### UI & Styling
- `bootstrap` - CSS framework
- `bootstrap-icons` - Icon library
- `react-data-table-component` - Data tables

### HTTP & API
- `axios` - HTTP client

### UX
- `sweetalert2` - Beautiful alerts and dialogs

### Routing
- `react-router-dom` - Client-side routing

### Testing
- `@testing-library/react` - Component testing
- `@testing-library/jest-dom` - Jest matchers

## 🏗️ Recent Improvements

✅ Fixed validation logic in Login component
✅ Improved error handling in Espaceadmin
✅ Added API configuration management
✅ Created reusable validation utilities
✅ Removed duplicate Bootstrap imports
✅ Added comprehensive error handling
✅ Added loading states in admin panel
✅ Improved code organization and structure

## 📝 Best Practices Implemented

1. **Centralized Configuration** - API endpoints in one place
2. **Reusable Utilities** - Validation and error handling functions
3. **Consistent Naming** - PascalCase for components
4. **Environment Variables** - Sensitive config in .env files
5. **Error Handling** - Proper try-catch and error messages
6. **Loading States** - User feedback during async operations
7. **Code Organization** - Separation of concerns with config/utils folders

## 🔄 API Integration

All API calls should use:
```javascript
import { API_ENDPOINTS, getAuthHeader } from '../config/api';
import axios from 'axios';

// Example: Login
const response = await axios.post(
  API_ENDPOINTS.AUTH.LOGIN,
  { email, password },
);

// Example: Get protected resource
const response = await axios.get(
  API_ENDPOINTS.USERS.GET_ALL,
  { headers: getAuthHeader() }
);
```

## 🐛 Debugging

1. Check browser console for errors
2. Check network tab in DevTools for API issues
3. Verify backend is running on port 5000
4. Ensure environment variables are set correctly

## 📞 Support

For issues or questions, check:
- Browser console errors
- Network tab in DevTools
- Backend API logs
- Component state in React DevTools

---

**Last Updated:** April 28, 2026
