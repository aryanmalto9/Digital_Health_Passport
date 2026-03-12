# ⬡ Digital Health Passport

A full-stack MERN application that gives patients complete control over their health data with emergency QR codes, centralized medical records, and AI-powered health guidance.

---

## 🚀 Features

| Feature                     | Description                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Emergency QR Card**       | Generates a unique QR code with blood type, allergies, medications & emergency contact — scannable by anyone, no login needed |
| **Centralized Medical Hub** | Upload & manage all health records (PDFs, X-rays, lab reports) via Cloudinary cloud storage                                   |
| **Role-Based Access**       | Patient, Doctor, and Admin roles with JWT authentication                                                                      |
| **AI Health Assistant**     | OpenAI-powered chatbot for general health questions and medical term explanations                                             |
| **Admin Panel**             | Manage users, view system stats, enable/disable accounts                                                                      |

---

## 🛠 Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router v6, Tailwind-inspired CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens) + bcryptjs
- **File Storage:** Cloudinary
- **QR Code:** `qrcode` npm library
- **AI:** OpenAI API (GPT-3.5-turbo)

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v16+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier)
- OpenAI API key (optional — AI chat won't work without it)

### 1. Clone the Repository

```bash
git clone https://github.com/aryanmalto9/digital-health-passport.git
cd digital-health-passport
```

### 2. Install All Dependencies

```bash
npm run install-all
```

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthpassport
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENAI_API_KEY=sk-your-openai-key   # Optional

CLIENT_URL=http://localhost:3000
```

### 4. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Create an Admin User

After starting the server, register a user normally, then update their role in MongoDB Atlas:

```
Collection: users → Find your user → Set role: "admin"
```

### 6. Run the App

From the root directory:

```bash
npm start
```

This runs:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

---

## 📁 Project Structure

```
digital-health-passport/
├── backend/
│   ├── config/
│   │   └── cloudinary.js       # Cloudinary + Multer config
│   ├── middleware/
│   │   └── auth.js             # JWT protect + authorize middleware
│   ├── models/
│   │   ├── User.js             # User schema (name, email, role)
│   │   ├── HealthProfile.js    # Blood type, allergies, QR token
│   │   └── MedicalRecord.js    # Uploaded files metadata
│   ├── routes/
│   │   ├── auth.js             # Register, Login, /me
│   │   ├── profile.js          # CRUD health profile + public emergency endpoint
│   │   ├── records.js          # Upload/list/delete medical records
│   │   ├── qr.js               # QR code generation
│   │   ├── ai.js               # OpenAI chat endpoint
│   │   └── admin.js            # Admin user management
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── layout/         # Sidebar + Layout component
│       ├── pages/
│       │   ├── LandingPage     # Public marketing page
│       │   ├── LoginPage       # Authentication
│       │   ├── RegisterPage    # Sign up
│       │   ├── DashboardPage   # Main overview
│       │   ├── ProfilePage     # Health profile editor
│       │   ├── RecordsPage     # Upload/browse medical records
│       │   ├── QRCardPage      # QR code generation & download
│       │   ├── AIChatPage      # AI health assistant chat
│       │   ├── AdminPage       # Admin user management
│       │   └── EmergencyPage   # Public QR scan target (no auth)
│       ├── services/
│       │   └── api.js          # Axios instance with JWT interceptor
│       └── store/
│           ├── index.js        # Redux store
│           └── slices/
│               └── authSlice.js # Auth state management
├── package.json                # Root: runs both servers
└── README.md
```

---

## 🔐 API Endpoints

### Auth

| Method | Endpoint             | Access  |
| ------ | -------------------- | ------- |
| POST   | `/api/auth/register` | Public  |
| POST   | `/api/auth/login`    | Public  |
| GET    | `/api/auth/me`       | Private |

### Profile

| Method | Endpoint                     | Access               |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/profile`               | Patient              |
| PUT    | `/api/profile`               | Patient              |
| GET    | `/api/profile/public/:token` | **Public** (QR scan) |

### Records

| Method | Endpoint           | Access         |
| ------ | ------------------ | -------------- |
| GET    | `/api/records`     | Patient/Doctor |
| POST   | `/api/records`     | Patient/Doctor |
| DELETE | `/api/records/:id` | Patient/Admin  |

### QR Code

| Method | Endpoint           | Access  |
| ------ | ------------------ | ------- |
| POST   | `/api/qr/generate` | Patient |
| GET    | `/api/qr/my-qr`    | Patient |

### AI Chat

| Method | Endpoint       | Access        |
| ------ | -------------- | ------------- |
| POST   | `/api/ai/chat` | Any logged-in |

### Admin

| Method | Endpoint                      | Access |
| ------ | ----------------------------- | ------ |
| GET    | `/api/admin/stats`            | Admin  |
| GET    | `/api/admin/users`            | Admin  |
| PATCH  | `/api/admin/users/:id/toggle` | Admin  |
| DELETE | `/api/admin/users/:id`        | Admin  |

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)

1. Set all environment variables from `.env.example`
2. Set `CLIENT_URL` to your deployed frontend URL
3. Deploy the `backend/` folder

### Frontend (Vercel / Netlify)

1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Deploy the `frontend/` folder
3. Set build command: `npm run build`, output: `build/`

---

## 📝 Notes

- The AI chat feature requires a valid OpenAI API key. Without it, the endpoint returns an error message.
- The emergency QR page (`/emergency/:token`) is intentionally public — no login required for emergency access.
- Files are stored on Cloudinary; without configuring it, uploads will fail.
- For production, consider adding rate limiting (`express-rate-limit`) and input sanitization (`express-mongo-sanitize`).

---

## 📄 License

MIT License — free to use and modify.

---

_Built with the MERN stack for educational purposes._
