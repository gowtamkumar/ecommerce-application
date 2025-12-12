# E-Commerce Application - Project Documentation

## Overview

A full-stack, production-ready e-commerce platform built with modern technologies. This application supports multi-vendor operations, comprehensive product management, integrated payment systems, and advanced marketing features.

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** React 18+
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** Ant Design
- **Icons:** React Icons (Feather Icons)
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Authentication:** NextAuth.js
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Validation:** class-validator

### DevOps & Infrastructure
- **Containerization:** Docker, Docker Compose
- **Reverse Proxy:** Nginx
- **Version Control:** Git
- **Package Manager:** Yarn

### Payment Integration
- **SSLCommerz:** For Bangladesh market
- **Extensible:** Support for additional payment gateways

## Project Structure

```
ecommerce-application/
├── client/                # Next.js frontend application
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── dashboard/   # Admin dashboard components
│   │   └── website/     # Customer-facing components
│   ├── context/         # React context providers
│   ├── lib/             # Utility functions and API clients
│   ├── redux/           # Redux store and slices
│   └── public/          # Static assets
├── server/              # Express.js backend application
│   ├── src/
│   │   ├── modules/    # Feature modules
│   │   ├── config/     # Configuration files
│   │   ├── middleware/ # Custom middleware
│   │   └── utils/      # Utility functions
├── nginx/              # Nginx configuration
├── doc/                # Additional documentation
├── scripts/            # Utility scripts
└── docker-compose.*.yaml # Docker configurations
```

## Architecture

### Frontend Architecture

The frontend follows a modular component-based architecture:

1. **App Router**: Next.js 14+ app router for file-based routing
2. **Component Organization**:
   - `components/dashboard/`: Admin panel components
   - `components/website/`: Customer-facing components
   - Shared components at root level

3. **State Management**:
   - Redux Toolkit for global state
   - React Context for theme, currency, and auth
   - Local state with useState/useReducer

4. **API Integration**:
   - Centralized API clients in `lib/apis/`
   - Axios for HTTP requests
   - Interceptors for auth tokens

### Backend Architecture

The backend uses a modular, feature-based architecture:

1. **Modules**: Each feature is a self-contained module with:
   - **Controllers**: Handle HTTP requests
   - **Services**: Business logic
   - **Entities**: TypeORM database models
   - **Routes**: API endpoints
   - **DTOs**: Data transfer objects with validation

2. **Database**:
   - PostgreSQL with TypeORM
   - Entity relationships for data integrity
   - Migrations for schema management

3. **Authentication**:
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Password hashing with bcrypt

4. **File Management**:
   - Multer for file uploads
   - Static file serving
   - Image optimization

## Setup & Installation

### Prerequisites
- Node.js 18+ and Yarn
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-application
   ```

2. **Install Dependencies**
   ```bash
   # Install client dependencies
   cd client
   yarn install

   # Install server dependencies
   cd ../server
   yarn install
   ```

3. **Environment Configuration**
   
   **Client (.env.local)**:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   **Server (.env)**:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
   JWT_SECRET=your-jwt-secret
   SSLCOMMERZ_STORE_ID=your-store-id
   SSLCOMMERZ_STORE_PASSWORD=your-store-password
   ```

4. **Run with Docker** (Recommended)
   ```bash
   docker-compose -f docker-compose.dev.yaml up
   ```

   Or run individually:
   ```bash
   # Terminal 1 - Server
   cd server
   yarn dev

   # Terminal 2 - Client
   cd client
   yarn dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:3000/dashboard

### Production Deployment

1. **Build Docker Images**
   ```bash
   docker-compose -f docker-compose.prod.yaml build
   ```

2. **Start Production Containers**
   ```bash
   docker-compose -f docker-compose.prod.yaml up -d
   ```

3. **Database Backup**
   ```bash
   docker-compose -f docker-compose.db-backup.yml up
   ```

4. **Database Restore**
   ```bash
   docker-compose -f docker-compose.db-restore.yml up
   ```

## Key Features

### User Management
- Multi-role authentication (Customer, Vendor, Admin, Delivery)
- Profile management with avatars
- Multiple shipping addresses
- User activity tracking

### Product Catalog
- Products with multiple images
- Product variants (size, color, material)
- Categories, brands, and tags
- Stock tracking and low-stock alerts
- Product reviews and ratings

### Shopping Experience
- Real-time shopping cart
- Cart persistence
- Free shipping threshold progress
- Product recommendations
- Wishlist functionality

### Order Management
- Complete order lifecycle tracking
- Order status: Pending → Approved → Processing → Shipping → Delivered
- Delivery assignment
- Order history
- Invoice generation

### Marketing & Promotions
- Coupon system (percentage, fixed, free shipping)
- Product/category/brand discounts
- Banner management
- Newsletter subscriptions

### Payment Integration
- Cash on Delivery (COD)
- SSLCommerz integration
- Secure payment processing
- Payment status tracking

### Admin Dashboard
- Comprehensive admin panel
- Product CRUD operations
- Order management
- User management
- Analytics and reports
- System settings

### Content Management
- Blog with categories
- Menu management (header, footer, topbar)
- Pages management
- SEO optimization

## Database Schema

### Core Entities

**Users**: User accounts and profiles
**Products**: Product catalog
**ProductVariants**: Size, color, material variations
**Categories**: Product categorization
**Brands**: Product brands
**Orders**: Customer orders
**OrderItems**: Items in each order
**Cart**: Shopping cart
**CartItems**: Items in cart
**Coupons**: Discount coupons
**Discounts**: Promotional discounts
**Addresses**: Shipping addresses
**Reviews**: Product reviews
**Blogs**: Blog posts
**Menus**: Navigation menus
**Settings**: System configuration

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://yourdomain.com/api`

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Key Endpoints

**Auth**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Products**:
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

**Cart**:
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

**Orders**:
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin)

**Coupons**:
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/coupons` - Create coupon (Admin)

## Security

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing with bcrypt (salt rounds: 10)
- Role-based access control
- Protected routes with middleware

### API Security
- CORS configuration
- Request validation with DTOs
- SQL injection prevention (TypeORM parameterized queries)
- XSS protection
- Rate limiting (recommended for production)

### File Upload Security
- File type validation
- File size limits
- Sanitized filenames
- Separate upload directory

## Performance Optimization

### Frontend
- Next.js image optimization
- Code splitting
- Lazy loading components
- Redux memoization
- React.memo for expensive components

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Caching (Redis recommended for production)

### Infrastructure
- Nginx reverse proxy
- Static file serving
- Gzip compression
- CDN integration (recommended)

## Monitoring & Logging

### Logging
- Console logging in development
- File-based logging recommended for production
- Error tracking
- API request logging

### Health Checks
- Database connection monitoring
- API health endpoint
- Container health checks in Docker

## Testing

### Recommended Testing Strategy
- **Unit Tests**: Jest for business logic
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright or Cypress for user flows
- **Component Tests**: React Testing Library

## Deployment Considerations

### Environment Variables
- Never commit `.env` files
- Use environment-specific configs
- Secure sensitive credentials

### Database
- Regular backups (automated)
- Migration strategy
- Indexing for performance

### Scaling
- Horizontal scaling with load balancer
- Database replication
- Redis for session management
- CDN for static assets

## Maintenance

### Regular Tasks
- Database backups (daily recommended)
- Log rotation
- Dependency updates
- Security patches
- Performance monitoring

### Database Migrations
```bash
cd server
yarn typeorm migration:generate -n MigrationName
yarn typeorm migration:run
```

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**CORS Errors**
- Check NEXT_PUBLIC_API_URL matches server URL
- Verify CORS configuration in server

**Docker Issues**
- Run `docker-compose down -v` to reset
- Check Docker daemon is running
- Verify port availability

**Payment Gateway Errors**
- Check SSLCommerz credentials
- Verify callback URLs
- Test in sandbox mode first

## Support & Contributing

### Getting Help
- Check documentation in `/docs`
- Review existing issues
- Contact development team

### Contributing
- Fork the repository
- Create feature branch
- Follow code style guidelines
- Submit pull request with description

## License

[Specify your license here]

## Version History

**v1.0.0** - December 2025
- Initial release
- Core e-commerce features
- Admin dashboard
- Payment integration

---

**Maintained by:** Your Team Name  
**Last Updated:** December 2025  
**Documentation Version:** 1.0
