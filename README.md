# ⚡ ResumeAI — AI Resume Analyzer & Job Match Platform

A full-stack application that uses AI to analyze your resume against a target job role
and returns a match score, missing skills, and personalized recommendations.

---

## 🏗️ Architecture

```
React (port 3000)
    ↕ REST API (JWT)
Node.js + Express (port 5000)
    ↕ HTTP
Python Flask AI Service (port 5001)
    ↕
MongoDB (port 27017)
```

---

## 📁 Project Structure

```
ai-resume-platform/
├── client/               ← React frontend
│   ├── public/
│   └── src/
│       ├── components/   ← Navbar, SkillChart
│       ├── pages/        ← Login, Register, Dashboard, Upload, Result
│       ├── services/     ← Axios API calls
│       ├── App.js
│       └── App.css
│
├── server/               ← Node.js + Express backend
│   ├── config/           ← DB connection
│   ├── controllers/      ← authController, resumeController, resultController
│   ├── middleware/        ← JWT auth middleware
│   ├── models/           ← User, Submission, Result (Mongoose)
│   ├── routes/           ← authRoutes, resumeRoutes, resultRoutes
│   ├── uploads/          ← Temp PDF storage (auto-created)
│   └── server.js
│
└── ai-service/           ← Python Flask AI microservice
    ├── app.py            ← Flask routes
    ├── utils.py          ← PDF extraction + skill matching logic
    └── requirements.txt
```

---

## ✅ Prerequisites

- Node.js v18+ — https://nodejs.org
- Python 3.9+ — https://python.org
- MongoDB — https://www.mongodb.com/try/download/community
- npm (comes with Node.js)

---

## 🚀 Setup & Run (Step by Step)

### 1. Clone / Open in VS Code

```bash
cd ai-resume-platform
code .
```

### 2. Start MongoDB

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
# OR start MongoDB Compass and connect to localhost:27017
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

### 3. Start the Python AI Service

Open a terminal in VS Code (Terminal → New Terminal):

```bash
cd ai-service

# Create a virtual environment (recommended)
python -m venv venv

# Activate it:
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the AI service
python app.py
```

✅ You should see: `Running on http://0.0.0.0:5001`

---

### 4. Start the Node.js Backend

Open a **new terminal** in VS Code:

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# (Edit .env if needed — defaults work for local dev)

# Start the server
npm run dev
```

✅ You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

### 5. Start the React Frontend

Open another **new terminal** in VS Code:

```bash
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

✅ Browser opens at `http://localhost:3000`

---

## 🧪 Testing the App

1. **Register** a new account at `/register`
2. **Login** with your credentials
3. Go to **Upload** and select a PDF resume
4. Choose a **target job role** (e.g. "Web Developer")
5. Click **Analyze Resume**
6. View your **match score, charts, missing skills, and suggestions**

### 💡 Don't have a PDF? Create a test one:

Create a file called `test-resume.txt` with content like:
```
Skills: Python, Machine Learning, Pandas, NumPy, SQL, TensorFlow
Experience: Data Scientist at XYZ Corp
Education: BSc Computer Science
```

Then convert it to PDF using any online tool, or print to PDF from a browser.

---

## 🔌 API Endpoints

| Method | Endpoint              | Auth | Description               |
|--------|-----------------------|------|---------------------------|
| POST   | /api/auth/register    | No   | Register new user         |
| POST   | /api/auth/login       | No   | Login, get JWT            |
| GET    | /api/auth/me          | Yes  | Get current user          |
| POST   | /api/resume/upload    | Yes  | Upload PDF + analyze      |
| GET    | /api/results          | Yes  | Get all user results      |
| GET    | /api/results/:id      | Yes  | Get specific result       |

---

## 🤖 AI Service Endpoint

| Method | Endpoint  | Description                    |
|--------|-----------|--------------------------------|
| POST   | /analyze  | Extract skills, compute match  |
| GET    | /health   | Health check                   |

**Request:** `multipart/form-data`
- `resume`: PDF file
- `job_role`: string (e.g. "data scientist")

**Response:**
```json
{
  "match_score": 75,
  "matched_skills": ["python", "pandas", "sql"],
  "missing_skills": ["tensorflow", "keras"],
  "suggestions": ["Learn TensorFlow: tensorflow.org"],
  "job_role": "data scientist",
  "total_required": 5,
  "total_matched": 3
}
```

---

## 🗃️ Database Schema

**User**
```
_id, name, email, password (hashed), createdAt
```

**Submission**
```
_id, user_id, target_job, filename, uploaded_at
```

**Result**
```
_id, sub_id, user_id, match_score, matched_skills,
missing_skills, suggestions, job_role, total_required, total_matched
```

---

## 🛠️ Supported Job Roles

- Data Scientist
- Web Developer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Software Engineer
- DevOps Engineer
- Data Analyst
- Machine Learning Engineer
- Cybersecurity Analyst

---

## ⚙️ Environment Variables (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_analyzer
JWT_SECRET=your_super_secret_key
AI_SERVICE_URL=http://localhost:5001
CLIENT_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "AI service is not running" | Make sure `python app.py` is running on port 5001 |
| MongoDB connection failed | Start MongoDB service first |
| Port already in use | Change PORT in .env or kill the conflicting process |
| PDF text not extracting | Ensure PDF has selectable text (not a scanned image) |
| CORS errors | Check CLIENT_URL in server .env matches your React port |
