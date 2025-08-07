# Luxora Boutique Server

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)

### Environment Setup

1. **MongoDB Atlas Setup:**
   ```bash
   # 1. Go to https://cloud.mongodb.com/
   # 2. Create a new cluster (free tier available)
   # 3. Create a database user
   # 4. Get your connection string
   # 5. Replace the MONGODB_URI in .env file
   ```

2. **Update Environment Variables:**
   ```bash
   # Edit .env file in the root directory
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luxora-boutique?retryWrites=true&w=majority
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Installation & Setup

```bash
# Install dependencies
cd apps/server
npm install

# Seed the database (IMPORTANT: Do this first!)
npm run seed

# Start development server
npm run dev
```

## 📊 Database Seeding

The seeder creates:
- **Admin User**: admin@luxora.com / admin123
- **3 Categories**: Women, Men, Kids
- **15 Products**: 5 per category with realistic data
- **Sample Data**: Proper relationships and indexes

```bash
# Seed database
npm run seed

# Seed with specific environment
npm run seed:dev    # Development
npm run seed:prod   # Production
```

## 🛠️ Available Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Build for production
npm run start       # Start production server
npm run seed        # Seed database with sample data
```

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register     # User registration
POST   /api/v1/auth/login        # User login
POST   /api/v1/auth/logout       # User logout
GET    /api/v1/auth/profile      # Get user profile
PATCH  /api/v1/auth/profile      # Update user profile
```

### Products
```
GET    /api/v1/products          # Get all products (with filters)
GET    /api/v1/products/featured # Get featured products
GET    /api/v1/products/slug/:slug # Get product by slug
GET    /api/v1/products/:id      # Get product by ID
POST   /api/v1/products          # Create product (Admin)
PATCH  /api/v1/products/:id      # Update product (Admin)
DELETE /api/v1/products/:id      # Delete product (Admin)
```

### Categories
```
GET    /api/v1/categories        # Get all categories
GET    /api/v1/categories/:slug  # Get category by slug
POST   /api/v1/categories        # Create category (Admin)
PATCH  /api/v1/categories/:id    # Update category (Admin)
DELETE /api/v1/categories/:id    # Delete category (Admin)
```

### Orders
```
POST   /api/v1/orders            # Create order
GET    /api/v1/orders            # Get all orders (Admin)
GET    /api/v1/orders/my-orders  # Get user orders
GET    /api/v1/orders/stats      # Get order statistics (Admin)
GET    /api/v1/orders/:id        # Get order by ID (Admin)
PATCH  /api/v1/orders/:id/status # Update order status (Admin)
```

## 🔐 Authentication

The API uses JWT tokens with the following flow:
1. **Login/Register** → Receive access token (1h) + refresh token (7d)
2. **Tokens stored** in httpOnly cookies for security
3. **Protected routes** require valid access token
4. **Admin routes** require admin privileges

### Demo Credentials
```
Email: admin@luxora.com
Password: admin123
```

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Joi schemas
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: httpOnly cookies

## 📁 Project Structure

```
apps/server/
├── src/
│   ├── config/          # Environment & database config
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middleware
│   ├── utils/           # Helper functions
│   ├── seeders/         # Database seeders
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── package.json
├── tsconfig.json
└── SERVER.md
```

## 🔧 Configuration

### MongoDB Connection
```typescript
// Automatic connection with retry logic
// Graceful shutdown handling
// Connection pooling optimized
```

### Environment Variables
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
```

## 🚨 Important Notes

1. **Always seed the database first** before starting the server
2. **Update MongoDB URI** with your actual connection string
3. **Configure Cloudinary** for image uploads (optional for basic functionality)
4. **Use HTTPS** in production for secure cookie transmission
5. **Update CORS origins** for production deployment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MongoDB URI format
   # Ensure IP whitelist includes your IP
   # Verify username/password
   ```

2. **Seeding Fails**
   ```bash
   # Ensure database is accessible
   # Check for existing data conflicts
   # Verify environment variables
   ```

3. **Authentication Issues**
   ```bash
   # Check JWT secrets are set
   # Verify cookie settings
   # Ensure CORS is configured
   ```

## 📈 Production Deployment

1. **Environment Variables**: Set all production values
2. **Database**: Use MongoDB Atlas production cluster
3. **Security**: Enable HTTPS, update CORS origins
4. **Monitoring**: Add logging and error tracking
5. **Performance**: Enable compression, optimize queries

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Test authentication
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@luxora.com","password":"admin123"}'

# Test products
curl http://localhost:5000/api/v1/products
```

---

**🎉 Your Luxora Boutique server is ready for luxury e-commerce!**