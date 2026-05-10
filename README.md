# 🌐 TalentSphere Frontend

**A modern, fully responsive HR Management System built with React + Vite**

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login & signup with token-based sessions
- 👥 **Employee Management** — Add, edit, delete, and search employees
- 🏢 **Department Management** — Organize your team into departments
- 🎖️ **Designation Management** — Define roles and seniority levels
- 📊 **Dashboard** — Real-time overview with stats and department breakdown
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet, and desktop
- 🌙 **Dark UI** — Elegant dark theme with purple accent

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Secure sign-in |
| Signup | `/signup` | Create a new HR account |
| Dashboard | `/` | Stats overview |
| Employees | `/employees` | Full employee CRUD + search |
| Departments | `/departments` | Department management |
| Designations | `/designations` | Role & level management |

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing |
| Axios | API requests + interceptors |
| Lucide React | Icon library |
| CSS Variables | Theming & responsiveness |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- npm or yarn
- A running [TalentSphere Backend](https://github.com/Sahityika100/TalentSphere-frontend) instance

### 1. Clone the Repository

```bash
git clone https://github.com/Sahityika100/TalentSphere-frontend.git
cd TalentSphere-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://your-backend-url.com
```

> ⚠️ All frontend environment variables must be prefixed with `VITE_` to be exposed by Vite.

### 4. Run Development Server

```bash
npm run dev
```

App will be live at **http://localhost:5173**

### 5. Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder.

### 6. Preview Production Build Locally

```bash
npm run preview
```

---

## 📁 Project Structure

```
src/
├── api/
│   └── index.js          # Axios instance + all API calls
├── components/
│   ├── Layout.jsx         # Sidebar + mobile drawer + top bar
│   ├── ProtectedRoute.jsx # Auth guard for private routes
│   └── ui.jsx             # Reusable UI components
├── context/
│   └── AuthContext.jsx    # Auth state (login/logout/user)
├── hooks/
│   └── useToast.js        # Toast notification hook
├── pages/
│   ├── Dashboard.jsx      # Stats + recent employees
│   ├── Employees.jsx      # Employee CRUD + search
│   ├── Departments.jsx    # Department CRUD
│   ├── Designations.jsx   # Designation CRUD
│   ├── Login.jsx          # Login page
│   └── Signup.jsx         # Signup page
├── App.jsx                # Route definitions
├── main.jsx               # React entry point
└── index.css              # Global styles + CSS variables + media queries
```

---

## 🌍 Deploying to Vercel

### Option A — GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — no config needed
5. Add your environment variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com`
6. Click **Deploy** ✅

Every push to `main` triggers an automatic redeployment.

### Option B — Vercel CLI (No GitHub needed)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (preview)
vercel

# Deploy to production
vercel --prod
```

> The `vercel.json` file already handles SPA routing — all paths redirect to `index.html` so React Router works correctly.

---

## 🔌 API Endpoints Used

| Resource | Endpoint |
|----------|----------|
| Auth — Login | `POST /auth/login` |
| Auth — Signup | `POST /auth/signup` |
| Employees — Get All | `GET /employee/get-all-employee` |
| Employees — Add | `POST /employee/add-employee` |
| Employees — Update | `PUT /employee/update-employee/:id` |
| Employees — Delete | `DELETE /employee/delete-employee/:id` |
| Employees — Search | `GET /employee/search?name=` |
| Departments — Get All | `GET /department/get-department` |
| Departments — Add | `POST /department/add-department` |
| Departments — Update | `PUT /department/update-department/:id` |
| Departments — Delete | `DELETE /department/delete-department/:id` |
| Designations — Get All | `GET /designation/get-all-designation` |
| Designations — Add | `POST /designation/add-designation` |
| Designations — Update | `PUT /designation/update-designation/:id` |
| Designations — Delete | `DELETE /designation/delete-designation/:id` |

All protected routes send a `Bearer <token>` header automatically via an Axios request interceptor.

---

## 📱 Responsive Behaviour

| Screen | Behaviour |
|--------|-----------|
| **Mobile** (≤768px) | Sticky top bar + slide-in sidebar drawer |
| **Tablet** (769–1024px) | 2-column stats grid, stacked dashboard cards |
| **Desktop** (≥1025px) | Full collapsible sidebar, 4-column stats |

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
  Made with ❤️ by Sahityika