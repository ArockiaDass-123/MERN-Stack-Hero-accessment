# EventFlow - Event Management Application

EventFlow is a full-stack MERN (MongoDB, Express, React, Node.js) platform designed for seamless event discovery and management. Users can browse a wide range of events, view details, register for upcoming experiences, and manage their registrations through a personalized dashboard.

## 🚀 Features

- **Event Discovery Experience**: Dynamic fetching with real-time search and filtering by category and location.
- **User Authentication**: Secure signup and login using JWT and bcryptjs.
- **Protected Routes**: Only authenticated users can register for events or access their dashboard.
- **Interactive Dashboard**: View upcoming and past event registrations with cancellation capability.
- **Real-time Capacity Management**: Automatic updates to seat availability upon user actions.
- **Premium UI/UX**: Modern dark-themed design with glassmorphism effects and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT)

## 📦 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd MERN-Stack-Hero4
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # The .env file is already provided with database credentials
   npm run seed # To populate initial mock events
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```
root/
├── server/
│   ├── models/        # Mongoose Schemas (User, Event, Registration)
│   ├── routes/        # API Endpoints (authRoutes, eventRoutes)
│   ├── middleware/    # Auth guards (protect middleware)
│   ├── .env           # DB URI, JWT Secret
│   ├── server.js      # Entry point
│   └── seed.js        # Database seeding script
├── client/
│   ├── src/
│   │   ├── components/ # Reusable UI (Navbar, EventCard)
│   │   ├── pages/      # Home, Dashboard, EventDetails, Login, Register
│   │   ├── context/    # User authentication state
│   │   ├── services/   # API communication (Axios)
│   │   └── App.jsx     # Routes and Main Component
│   └── package.json
└── README.md
```

## 🧪 Submission Checklist

- [x] Functional MERN Stack Application
- [x] User Registration & Login
- [x] Event Search & Filtering
- [x] Event Registration Logic (with capacity checks)
- [x] User Dashboard (Upcoming vs Past)
- [x] Well-structured codebase

---
Built for Bellcorp Event Management Assignment.
