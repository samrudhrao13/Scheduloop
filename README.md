# Scheduloop — College ERP System

A multi-role college event & resource management platform built with React + Firebase.

## Features

- **Multi-role access** — Super Admin, Admin, Principal, HOD, Faculty, Student each get a tailored dashboard
- **Event lifecycle management** — Faculty creates events; HOD → Principal → Admin approves/rejects in a chain
- **Room booking** — Admins manage rooms; faculty request rooms for events
- **Geo-fenced attendance** — Students check in only when within 100 m of the venue
- **Feedback system** — Students submit feedback within 48 hours of an event
- **AI-generated event reports** — Powered by OpenRouter (GPT-4o-mini) with optional image upload
- **Student wallet** — Token-based wallet with default ₹1000 balance
- **Institution management** — Super Admin creates and manages multiple institutions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Database | Firebase Realtime Database |
| Storage | Firebase Storage |
| Auth | Custom session stored in localStorage |
| AI Reports | OpenRouter API (GPT-4o-mini) |

## Roles & Permissions

| Role | Capabilities |
|---|---|
| **Super Admin** | Create institutions, manage institution admins |
| **Admin** | Manage users, rooms, final event approval |
| **Principal** | Second-level event approval |
| **HOD** | First-level event approval, department oversight |
| **Faculty** | Create events, view registrations & attendance |
| **Student** | Register for events, geo-check-in, submit feedback |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Realtime Database and Storage enabled
- An OpenRouter API key (for AI reports)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/samrudhrao13/Scheduloop.git
   cd Scheduloop/college_erp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `college_erp` root with the following variables:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_OPENAI_API_KEY=your_openrouter_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### First Login

Use the Super Admin credentials to initialize the system:

- **Email:** `superadmin@erp.com`
- **Password:** `Super@123`

From the Super Admin dashboard, create institutions and assign Admin accounts.

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login screen
│   ├── common/        # Reusable UI (Header, Table, StatCard, Modal, etc.)
│   ├── dashboards/    # Role-specific dashboard views
│   └── modals/        # Create/View modals for events, users, rooms
├── config/
│   └── firebase.js    # Firebase initialization
├── hooks/             # Custom React hooks (auth, events, geolocation)
├── services/          # Firebase data access + AI report generation
├── styles/            # Global and component CSS
└── utils/             # Constants, helpers, report access logic
```

## Event Approval Flow

```
Faculty creates event
       ↓
   HOD reviews
       ↓
 Principal reviews
       ↓
  Admin approves
       ↓
  Event is live
```

Any level can reject, which stops the chain and notifies the creator.

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.
