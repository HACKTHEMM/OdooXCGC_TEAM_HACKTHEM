# OdooXCGC Community Issue Tracker

A full-stack application for community issue reporting and management, built with Node.js, Express, PostgreSQL, and Next.js.

## 🚀 Features

- User Authentication and Authorization
- Admin Role Management System
- Real-time Issue Tracking
- Location-based Issue Reporting
- Interactive Map Interface
- Image Upload Support
- Admin Analytics Dashboard
- Rate Limiting and Security Features

## 🛠 Tech Stack

### Backend
- Node.js & Express
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Multer for File Upload
- Express Validator
- Helmet Security
- Rate Limiting

### Frontend
- Next.js 15.4
- React 19.1
- TypeScript
- Tailwind CSS
- Leaflet for Maps
- Jest & Cypress for Testing

## 📋 Prerequisites

- Node.js (Latest LTS Version)
- PostgreSQL (Latest Version)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/HACKTHEMM/OdooXCGC_TEAM_HACKTHEM.git
cd OdooXCGC_TEAM_HACKTHEM
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a .env file in the backend directory:
```env
PORT=5000
DATABASE_URL=postgres://localhost:5432/odoo_hackthem
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Initialize the database:
```bash
npm run setup-db
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 API Routes

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/check-admin-status/:id` - Check admin status

### Issue Routes
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get issue by ID
- `POST /api/issues` - Create new issue
- `GET /api/issues/nearby` - Get nearby issues
- `GET /api/issues/map/pins` - Get issue map pins

### Location Routes
- `GET /api/locations/user/:id` - Get user locations
- `POST /api/locations/user/:id` - Add user location

### Admin Routes
- `POST /api/users/create-admin` - Create admin role
- `PATCH /api/users/update-admin-role/:id` - Update admin role
- `DELETE /api/users/remove-admin/:id` - Remove admin role
- `GET /api/admin/categories` - Get categories

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test                # Run Jest tests
npm run cypress:open    # Run Cypress tests
```

## 🛡️ Security Features

- JWT Authentication
- XSS Protection
- Rate Limiting
- Request Sanitization
- Helmet Security Headers
- File Upload Validation

## 👥 Admin Roles

Three levels of administrative access:
1. **Super Admin** - Full system access
2. **Admin** - Extended privileges
3. **Moderator** - Basic moderation rights

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request
