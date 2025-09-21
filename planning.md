# Digital Housing Platform - Project Planning

## 📋 Table of Contents
1. [General Architecture & Tech Stack](#general-architecture--tech-stack)
2. [Docker Setup](#docker-setup)
3. [Chapter 1: Authentication System](#chapter-1-authentication-system)
4. [Chapter 2: Real-Time Communication](#chapter-2-real-time-communication)
5. [Chapter 3: Property Management](#chapter-3-property-management)
6. [Chapter 4: Search & Discovery](#chapter-4-search--discovery)
7. [Chapter 5: Booking & Reservations](#chapter-5-booking--reservations)
8. [Chapter 6: Review & Rating System](#chapter-6-review--rating-system)
9. [Chapter 7: Reporting & Moderation](#chapter-7-reporting--moderation)
10. [Chapter 8: Machine Learning Integration](#chapter-8-machine-learning-integration)

---

## General Architecture & Tech Stack

### 🏗️ Architecture Overview
The Digital Housing Platform follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│   - React       │    │   - TypeScript  │    │   - Collections │
│   - TypeScript  │    │   - REST API    │    │   - Indexes     │
│   - RTK Query   │    │   - Socket.io   │    │   - Schemas     │
│   - Shadcn/UI   │    │   - JWT Auth    │    │                 │
│   - Tailwind    │    │   - WebRTC      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ Technology Stack

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: Shadcn/UI components
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io Client
- **Video Calls**: WebRTC or Agora.io

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Google OAuth 2.0 + JWT
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloud Storage
- **Validation**: Joi or Zod

#### Database
- **Primary**: MongoDB
- **ODM**: Mongoose
- **Hosting**: MongoDB Atlas (Cloud)

#### DevOps & Deployment
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway/Render
- **Monitoring**: Basic logging and error tracking

---

## Docker Setup

### 🎯 Objective
Provide a containerized development environment for the backend API and MongoDB database using Docker Compose.

### 📋 Setup Overview
- Backend API container (Express.js + TypeScript)
- MongoDB database container
- Development environment configuration
- Hot reload for development
- Environment variables management

### 🔧 Docker Configuration

#### Project Structure
```
digital_housingV2/
├── server/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── ...
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

#### Docker Compose Configuration

**docker-compose.yml** (Production)
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: digital_housing_db
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-password123}
      MONGO_INITDB_DATABASE: ${MONGO_DB_NAME:-digital_housing}
    volumes:
      - mongodb_data:/data/db
      - ./server/scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - app-network

  # Backend API
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
      target: production
    container_name: digital_housing_api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://mongodb:27017/${MONGO_DB_NAME:-digital_housing}
      JWT_SECRET: ${JWT_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
    depends_on:
      - mongodb
    networks:
      - app-network
    volumes:
      - ./server/uploads:/app/uploads

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

**docker-compose.dev.yml** (Development)
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:7.0
    container_name: digital_housing_db_dev
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: digital_housing_dev
    volumes:
      - mongodb_dev_data:/data/db
    networks:
      - app-network

  # Backend API (Development)
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
      target: development
    container_name: digital_housing_api_dev
    restart: unless-stopped
    ports:
      - "5000:5000"
      - "9229:9229"  # Debug port
    environment:
      NODE_ENV: development
      PORT: 5000
      MONGODB_URI: mongodb://mongodb:27017/digital_housing_dev
      JWT_SECRET: dev_jwt_secret_key
    depends_on:
      - mongodb
    networks:
      - app-network
    volumes:
      - ./server:/app
      - /app/node_modules
      - ./server/uploads:/app/uploads
    command: npm run dev

volumes:
  mongodb_dev_data:

networks:
  app-network:
    driver: bridge
```

#### Backend Dockerfile

**server/Dockerfile**
```dockerfile
# Multi-stage build
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
EXPOSE 9229
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend

EXPOSE 5000
CMD ["npm", "start"]
```

#### Environment Configuration

**.env.example**
```env
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DB_NAME=digital_housing

# Backend API
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# File Upload
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads

# CORS
CLIENT_URL=http://localhost:3000
```

#### MongoDB Initialization Script

**server/scripts/mongo-init.js**
```javascript
// MongoDB initialization script
db = db.getSiblingDB('digital_housing');

// Create collections
db.createCollection('users');
db.createCollection('properties');
db.createCollection('messages');
db.createCollection('reservations');
db.createCollection('reviews');
db.createCollection('reports');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true });
db.properties.createIndex({ village: 1 });
db.properties.createIndex({ ownerId: 1 });
db.properties.createIndex({ "address.coordinates": "2dsphere" });
db.messages.createIndex({ senderId: 1, receiverId: 1 });
db.messages.createIndex({ timestamp: -1 });
db.reservations.createIndex({ renterId: 1 });
db.reservations.createIndex({ propertyId: 1 });
db.reviews.createIndex({ targetUserId: 1 });
db.reports.createIndex({ reportedUserId: 1 });

print('Database initialized successfully!');
```

### 🚀 Usage Commands

#### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f mongodb

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build
```

#### Production
```bash
# Start production environment
docker-compose up -d

# Stop production environment
docker-compose down

# View production logs
docker-compose logs -f
```

#### Database Management
```bash
# Connect to MongoDB
docker exec -it digital_housing_db_dev mongosh

# Backup database
docker exec digital_housing_db_dev mongodump --archive --gzip --db digital_housing_dev

# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### 📋 Implementation Steps
1. Create Docker configuration files
2. Set up environment variables
3. Configure MongoDB initialization
4. Test development environment
5. Verify database connections
6. Set up production configuration
7. Document setup process

---

## Chapter 1: Authentication System

### 🎯 Objective
Implement secure, user-friendly authentication using Google OAuth and JWT tokens for session management.

### 📋 Features Overview
- Google OAuth 2.0 integration
- JWT token-based session management
- User registration and profile management
- Role-based access control (Renter/Owner/Admin)
- Email verification system

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Authentication flow components
- SignInPage component
- SignUpPage component
- ProfilePage component
- ProtectedRoute wrapper
- AuthProvider context
```

#### Backend Endpoints
```typescript
POST /api/auth/google           // Google OAuth callback
POST /api/auth/refresh          // Refresh JWT token
GET  /api/auth/profile          // Get user profile
PUT  /api/auth/profile          // Update user profile
POST /api/auth/logout           // Logout user
```

#### Database Schema
```typescript
// User Model
interface User {
  _id: ObjectId;
  fullName: string;
  email: string;
  role: 'renter' | 'owner' | 'admin';
  isVerified: boolean;
  googleId: string;
  avatar?: string;
  rating: number;
  reports: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 🚀 Implementation Steps
1. Set up Google OAuth 2.0 credentials
2. Create authentication middleware
3. Implement JWT token generation and validation
4. Build frontend authentication components
5. Set up protected routes
6. Implement user profile management
7. Add role-based access control

---

## Chapter 2: Real-Time Communication

### 🎯 Objective
Enable seamless real-time communication between users through chat messaging and video calls.

### 📋 Features Overview
- Real-time chat messaging
- In-app video calling
- Online status indicators
- Message history and persistence
- Typing indicators
- File sharing in chat

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Chat system components
- ChatWindow component
- MessageList component
- MessageInput component
- VideoCallModal component
- ContactList component
- OnlineStatus component
```

#### Backend Implementation
```typescript
// Socket.io events
- 'join_room'        // Join chat room
- 'send_message'     // Send chat message
- 'typing'           // Typing indicator
- 'video_call_offer' // Initiate video call
- 'video_call_answer'// Answer video call
- 'video_call_end'   // End video call
```

#### Database Schemas
```typescript
// Message Model
interface Message {
  _id: ObjectId;
  senderId: ObjectId;
  receiverId: ObjectId;
  content: string;
  messageType: 'text' | 'file' | 'image';
  timestamp: Date;
  isRead: boolean;
  roomId: string;
}

// CallSession Model
interface CallSession {
  _id: ObjectId;
  callerId: ObjectId;
  receiverId: ObjectId;
  startTime: Date;
  endTime?: Date;
  status: 'initiated' | 'ongoing' | 'ended' | 'missed';
  duration?: number;
}
```

### 🚀 Implementation Steps
1. Set up Socket.io server and client
2. Implement chat room management
3. Build message persistence system
4. Create video call infrastructure with WebRTC
5. Add file sharing capabilities
6. Implement real-time notifications
7. Add typing indicators and online status

---

## Chapter 3: Property Management

### 🎯 Objective
Allow property owners to list, manage, and showcase their properties with comprehensive details and media.

### 📋 Features Overview
- Property listing creation and editing
- Multiple image upload and management
- Property details and amenities
- Availability calendar
- Pricing management
- Property verification system

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Property management components
- PropertyListForm component
- PropertyCard component
- PropertyDetails component
- ImageUpload component
- PropertyGallery component
- AvailabilityCalendar component
```

#### Backend Endpoints
```typescript
POST /api/properties              // Create new property
GET  /api/properties              // Get all properties (with filters)
GET  /api/properties/:id          // Get specific property
PUT  /api/properties/:id          // Update property
DELETE /api/properties/:id        // Delete property
POST /api/properties/:id/images   // Upload property images
```

#### Database Schema
```typescript
// Property Model
interface Property {
  _id: ObjectId;
  title: string;
  description: string;
  village: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: {
    amount: number;
    period: 'monthly' | 'weekly' | 'daily';
  };
  propertyType: 'apartment' | 'house' | 'room' | 'studio';
  amenities: string[];
  images: string[];
  ownerId: ObjectId;
  isAvailable: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 🚀 Implementation Steps
1. Create property listing forms
2. Implement image upload system
3. Build property management dashboard
4. Add property search and filtering
5. Implement availability calendar
6. Create property verification workflow
7. Add property analytics for owners

---

## Chapter 4: Search & Discovery

### 🎯 Objective
Provide powerful search capabilities allowing renters to find properties by village, price, amenities, and other criteria.

### 📋 Features Overview
- Village-based search
- Advanced filtering options
- Map-based search
- Search result sorting
- Saved searches
- Search recommendations

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Search system components
- SearchBar component
- FilterPanel component
- SearchResults component
- PropertyMap component
- SavedSearches component
- SearchSuggestions component
```

#### Backend Endpoints
```typescript
GET /api/search/properties        // Search properties with filters
GET /api/search/villages          // Get available villages
GET /api/search/suggestions       // Get search suggestions
POST /api/search/save             // Save search criteria
GET /api/search/saved             // Get user's saved searches
```

#### Search Implementation
```typescript
// Search filters interface
interface SearchFilters {
  village?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  propertyType?: string[];
  amenities?: string[];
  availability?: {
    startDate: Date;
    endDate: Date;
  };
  sortBy?: 'price' | 'rating' | 'distance' | 'newest';
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}
```

### 🚀 Implementation Steps
1. Implement text search with MongoDB text indexes
2. Create advanced filtering system
3. Add geospatial search capabilities
4. Build map integration with markers
5. Implement search result sorting
6. Add saved searches functionality
7. Create search analytics and recommendations

---

## Chapter 5: Booking & Reservations

### 🎯 Objective
Enable seamless booking and reservation management between renters and property owners.

### 📋 Features Overview
- Date availability checking
- Booking request system
- Reservation status tracking
- Payment integration preparation
- Booking calendar management
- Cancellation handling

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Booking system components
- BookingForm component
- BookingCalendar component
- BookingHistory component
- ReservationCard component
- BookingStatus component
- CancellationModal component
```

#### Backend Endpoints
```typescript
POST /api/bookings                // Create booking request
GET  /api/bookings                // Get user's bookings
GET  /api/bookings/:id            // Get specific booking
PUT  /api/bookings/:id/status     // Update booking status
POST /api/bookings/:id/cancel     // Cancel booking
GET  /api/properties/:id/availability // Check availability
```

#### Database Schema
```typescript
// Reservation Model
interface Reservation {
  _id: ObjectId;
  renterId: ObjectId;
  propertyId: ObjectId;
  ownerId: ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 🚀 Implementation Steps
1. Create booking request forms
2. Implement date availability checking
3. Build reservation management system
4. Add booking status workflows
5. Create booking history views
6. Implement cancellation policies
7. Prepare payment integration hooks

---

## Chapter 6: Review & Rating System

### 🎯 Objective
Build a two-way review system allowing both renters and owners to rate and review each other.

### 📋 Features Overview
- Bidirectional rating system
- Written reviews and comments
- Rating aggregation and display
- Review moderation
- Review response system
- Rating-based user reputation

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Review system components
- ReviewForm component
- ReviewCard component
- RatingDisplay component
- ReviewList component
- ReviewStats component
- ReviewModeration component
```

#### Backend Endpoints
```typescript
POST /api/reviews                 // Submit review
GET  /api/reviews/user/:id        // Get user's reviews
GET  /api/reviews/property/:id    // Get property reviews
PUT  /api/reviews/:id             // Update review
DELETE /api/reviews/:id           // Delete review
POST /api/reviews/:id/report      // Report inappropriate review
```

#### Database Schema
```typescript
// Review Model
interface Review {
  _id: ObjectId;
  authorId: ObjectId;
  targetUserId: ObjectId;
  propertyId?: ObjectId;
  reservationId: ObjectId;
  rating: number; // 1-5 stars
  comment: string;
  reviewType: 'renter_to_owner' | 'owner_to_renter';
  isVisible: boolean;
  isReported: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 🚀 Implementation Steps
1. Create review submission forms
2. Implement rating calculation system
3. Build review display components
4. Add review moderation features
5. Create user reputation system
6. Implement review notifications
7. Add review analytics and insights

---

## Chapter 7: Reporting & Moderation

### 🎯 Objective
Implement a comprehensive reporting system for user safety and platform integrity.

### 📋 Features Overview
- User reporting system
- Content moderation tools
- Admin dashboard for reports
- Automated flagging system
- User suspension/banning
- Appeal process

### 🔧 Technical Implementation

#### Frontend Components
```typescript
// Reporting system components
- ReportForm component
- ReportList component (Admin)
- ModerationDashboard component
- UserBanPanel component
- AppealForm component
```

#### Backend Endpoints
```typescript
POST /api/reports                 // Submit report
GET  /api/reports                 // Get reports (Admin)
PUT  /api/reports/:id/status      // Update report status
POST /api/moderation/ban          // Ban user
POST /api/moderation/unban        // Unban user
GET  /api/moderation/stats        // Get moderation statistics
```

#### Database Schema
```typescript
// Report Model
interface Report {
  _id: ObjectId;
  reporterId: ObjectId;
  reportedUserId: ObjectId;
  reportedContentId?: ObjectId;
  contentType?: 'user' | 'property' | 'review' | 'message';
  reason: string;
  category: 'harassment' | 'spam' | 'inappropriate' | 'fraud' | 'other';
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  resolvedAt?: Date;
}
```

### 🚀 Implementation Steps
1. Create report submission forms
2. Build admin moderation dashboard
3. Implement automated content flagging
4. Create user suspension system
5. Add appeal process
6. Implement reporting analytics
7. Create moderation workflows

---

## Chapter 8: Machine Learning Integration

### 🎯 Objective
Integrate ML capabilities to predict renter payment reliability and enhance platform decision-making.

### 📋 Features Overview
- Payment reliability prediction
- Renter credit scoring
- Fraud detection system
- Recommendation engine
- Behavioral analysis
- Risk assessment tools

### 🔧 Technical Implementation

#### ML Model Architecture
```python
# Payment Prediction Model
- Feature Engineering (payment history, reviews, profile data)
- Model Training (Random Forest/XGBoost)
- Model Deployment (REST API)
- Real-time Predictions
- Model Monitoring and Retraining
```

#### Backend Integration
```typescript
// ML endpoints
GET  /api/ml/payment-prediction/:userId  // Get payment reliability score
POST /api/ml/risk-assessment             // Assess booking risk
GET  /api/ml/recommendations/:userId     // Get property recommendations
```

#### Database Schema
```typescript
// PaymentPrediction Model
interface PaymentPrediction {
  _id: ObjectId;
  renterId: ObjectId;
  predictionScore: number; // 0-100%
  confidenceLevel: number;
  factors: {
    paymentHistory: number;
    reviewScore: number;
    profileCompleteness: number;
    tenureOnPlatform: number;
  };
  lastUpdated: Date;
  modelVersion: string;
}
```

### 🚀 Implementation Steps
1. Data collection and preprocessing
2. Feature engineering pipeline
3. Model training and validation
4. ML API development
5. Frontend integration for predictions
6. Model monitoring dashboard
7. Continuous learning implementation

---

## 📊 Project Timeline (1 Month Sprint)

### Week 1: Foundation & Core Setup
- **Days 1-2**: Docker setup and development environment
- **Days 3-4**: Authentication system (Google OAuth + JWT)
- **Days 5-7**: Basic property management (CRUD operations)

### Week 2: Essential Features
- **Days 8-9**: Database setup and property search functionality
- **Days 10-11**: Basic real-time chat implementation
- **Days 12-14**: Booking and reservation system

### Week 3: User Experience & Safety
- **Days 15-16**: Review and rating system
- **Days 17-18**: User reporting and basic moderation
- **Days 19-21**: Frontend UI polish and integration

### Week 4: Advanced Features & Deployment
- **Days 22-24**: Video calling integration (WebRTC/Agora)
- **Days 25-26**: Machine learning integration (basic payment prediction)
- **Days 27-28**: Final testing and deployment setup

### 🎯 MVP Delivery Focus
This accelerated timeline focuses on delivering a **Minimum Viable Product (MVP)** with:
- ✅ Core authentication and user management
- ✅ Property listing and search
- ✅ Basic messaging and booking
- ✅ Essential safety features (reviews/reports)
- ✅ Containerized deployment-ready setup

### 📝 Deferred Features (Post-MVP)
- Advanced ML predictions and analytics
- Comprehensive admin dashboard
- Mobile app development
- Advanced security hardening
- Performance optimization

---

## 🎯 Success Metrics

### Technical Metrics
- 99.9% uptime
- < 200ms API response time
- Zero critical security vulnerabilities
- 95% test coverage

### Business Metrics
- User engagement rates
- Booking completion rates
- Platform safety metrics
- User satisfaction scores

---

This comprehensive planning document serves as the roadmap for building the Digital Housing Platform with modern architecture and best practices. Each chapter can be developed incrementally while maintaining system integrity and user experience.
