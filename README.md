# digital-housing-platform

## 📌 Project Overview
The Digital Housing Platform is a modern web application designed to connect verified homeowners and renters. With real-time chat, video calls, advanced search by village, and Google authentication, the platform creates a more human, seamless housing experience. Future ML integration aims to predict renter payment reliability, while a robust reporting system ensures trust and accountability.

---

## 🎯 Project Goals
- Build a friendly, real-world digital experience for property rental  
- Enable seamless Google login and secure JSON Web Token (JWT) sessions  
- Allow verified users to chat and video call in-app  
- Empower renters to search by village and connect directly with owners  
- Integrate ML to predict renter reliability (payment likelihood)  
- Foster safety through mutual reviews and a reporting system  
- Ensure scalability using Docker, MongoDB, and CI/CD pipelines  

---

## 🧑‍🤝‍🧑 Team Roles

### 👨‍💻 Full Stack Developer  
Develops both frontend (ReactJS) and backend (Node.js/Express), implements API logic, and manages real-time features.

### 🗄️ NoSQL Database Architect  
Designs MongoDB collections, defines schemas with Mongoose, and ensures optimal querying.

### 🎥 Real-Time Communication Engineer  
Implements chat and video call features using Socket.io and WebRTC.

### 🤖 Machine Learning Integrator (Planned)  
Trains and deploys a model to predict the likelihood of a renter paying rent on time.

---

## 💻 Technology Stack
- ⚛️ ReactJS – Frontend for dynamic user experience  
- 🖥️ Node.js + Express – Backend REST API  
- 🍃 MongoDB (Mongoose) – Flexible NoSQL database  
- 🔐 Google OAuth + JWT – Secure, user-friendly authentication  
- 📡 Socket.io – Real-time messaging  
- 📹 WebRTC / Agora.io – In-app video calls  
- 🧠 ML (planned) – Predictive model for renter reliability  
- 🐳 Docker – Environment consistency  
- 🚀 GitHub Actions – CI/CD pipelines  
- ☁️ Render / Railway / Vercel – Cloud hosting  

---

## 🗂️ Data Model (MongoDB Collections)

### 👤 User
```js
{
  _id,
  fullName,
  email,
  role,
  isVerified,
  googleId,
  rating,
  reports: [],
  createdAt
}

🏠 Property
{
  _id,
  title,
  village,
  price,
  description,
  images,
  ownerId,
  available,
  createdAt
}

💬 Message
{
  _id,
  senderId,
  receiverId,
  content,
  timestamp,
  isRead
}
📹 CallSession

{
  _id,
  callerId,
  receiverId,
  startTime,
  endTime,
  status
}
📅 Reservation

{
  _id,
  renterId,
  propertyId,
  startDate,
  endDate,
  status
}
⭐ Review
{
  _id,
  authorId,
  targetUserId,
  rating,
  comment,
  createdAt
}
🚩 Report
{
  _id,
  reporterId,
  reportedUserId,
  reason,
  details,
  createdAt
}

🔮 PaymentPrediction (Planned ML)
{
  renterId,
  predictedPayment: 100%
}

```

✨ Feature Breakdown
✅ Google Authentication
Fast and secure login via Google

JWT tokens issued for session management

💬 Real-Time Communication
Live chat via Socket.io

In-app video calling using WebRTC or Agora

📍 Village-Based Search
Renters can find listings by village name

Results sorted by availability, price, and rating

📅 Reservation & Booking
Dynamic booking system

Date availability checks

Status tracking (pending, confirmed, cancelled)

⭐ Two-Way Reviews
Both renters and property owners can rate and comment

Public review profiles

🚩 User Reporting System
Renters and owners can report misconduct

Admin receives alerts and moderation options

🤖 ML Integration (Planned)
Predicts how likely a renter is to pay on time (e.g., “87% reliability”)

Could integrate with decision-making for owners before approving rentals

🔐 Security & Privacy
Google OAuth + JWT for authentication

HTTPS enforced

Input validation and sanitization

Rate limiting and brute force protection

User reports reviewed by admin

⚙️ CI/CD Pipeline
📌 Benefits
🔍 Auto-testing for reliability

📦 Auto-deployment to cloud

♻️ Dockerized backend and frontend

🧰 Tools
GitHub Actions

Docker

Vercel / Render / Railway

🚀 Getting Started
This project is under active development. To set up locally:

Clone the repository

Install dependencies (npm install or yarn)

Configure MongoDB connection and Google OAuth credentials

Run backend and frontend servers