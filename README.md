<!-- # College Discovery Platform MVP

This submission implements 4 end-to-end features from the task:

1. College Listing + Search + Filters + Pagination
2. College Detail Page (overview + courses + placements)
3. Compare Colleges (decision table)
4. Auth + Saved Colleges

## Tech Stack

- Frontend: React + TypeScript + Tailwind + Vite
- Backend: Node.js + TypeScript + Express REST APIs
- Database: PostgreSQL + Prisma ORM

## Project Structure

- `frontend/` React client
- `backend/` API server + Prisma schema + seed

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Deployment

### Backend (Render or Railway)

- Root: `backend`
- Build: `npm install && npm run prisma:generate && npm run build`
- Start: `npm start`
- Env vars: `DATABASE_URL`, `JWT_SECRET`

### Frontend (Vercel)

- Root: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env var: `VITE_API_URL` = backend URL + `/api`

## Important

After backend deployment, run migrations and seeding once in the deployed environment:

```bash
npm run prisma:migrate
npm run prisma:seed
``` -->

# 🎓 CollegeCompass — Discover • Compare • Predict

A modern, full-stack web application that helps students make smarter college decisions by combining **search, comparison, and AI-inspired prediction** in one platform.

---

## 🚀 Why This Project Stands Out

Most platforms only list colleges.
**CollegeCompass goes further** by guiding users through the full decision journey:

👉 Discover colleges
👉 Analyze details
👉 Compare options
👉 Predict admission chances

---

## ✨ Core Features

### 🔍 1. Smart College Discovery

- Search colleges by name, location, and filters
- Pagination for smooth browsing
- Clean card-based UI

---

### 📊 2. Detailed College Insights

- Fees, rating, placement stats
- Courses offered
- Structured overview for quick understanding

---

### ⚖️ 3. Compare Colleges (Decision Table)

- Compare up to **5 colleges side-by-side**
- Clear metrics: fees, rating, placement, location
- Helps users make informed decisions instantly

---

### 🎯 4. College Predictor (Key Differentiator)

- Input: **Exam (JEE / NEET) + Rank**
- Output: Recommended colleges

#### 🧠 Smart Categorization:

- 🟢 **Safe** — High chance of admission
- 🟡 **Moderate** — Competitive but possible
- 🔴 **Dream** — Aspirational choices

---

### 🔐 5. Authentication + Saved Colleges

- Secure login system (JWT-based)
- Save and manage favorite colleges

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS

### Backend

- 🟢 Node.js + Express
- 🔷 TypeScript

### Database

- 🐘 PostgreSQL
- 🔺 Prisma ORM

---

## 📁 Project Structure

```
college-discovery-platform/
│
├── frontend/     # React application
├── backend/      # Express API + Prisma
└── README.md
```

---

## ⚙️ Local Setup

### 🔧 Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

---

### 💻 Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend `.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/college_platform
JWT_SECRET=your-secret-key
PORT=4000
```

---

### Frontend `.env`

```
VITE_API_URL=http://localhost:4000/api
```

---

## 🚀 Deployment

### Backend (Render / Railway)

- Root: `backend`
- Build Command:

  ```
  npm install && npx prisma generate && npm run build
  ```

- Start Command:

  ```
  npm start
  ```

---

### Frontend (Vercel)

- Root: `frontend`
- Build Command:

  ```
  npm run build
  ```

- Output Directory:

  ```
  dist
  ```

---

## ⚠️ Important Deployment Step

After deploying backend, run:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

---

## 📸 Screenshots (Add Yours Here)

- Home Page
- Compare Page
- Predictor Page
- College Detail

---

## 💡 Future Enhancements

- 🎯 Personalized recommendations (AI-based)
- 📈 Placement analytics graphs
- 🏫 Real-time data integration (APIs)
- ❤️ Wishlist + notifications
- 📱 Mobile-first optimization

---

## 🏆 What Makes This Project Strong

- End-to-end product thinking
- Clean UI + strong UX
- Real-world problem solving
- Scalable architecture
- Unique **Predictor Feature**

---

## 👩‍💻 Author

**Vishuddhi Jain**

- GitHub: https://github.com/Vishuddhijain
- LinkedIn: https://www.linkedin.com/in/vishuddhi-jain-237439338/

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and feel free to contribute!
