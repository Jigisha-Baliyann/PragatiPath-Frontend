
---

## 1️⃣ Project Title & Badges

**Purpose:** Instantly show what your project is, tech stack, and status.

```md
# PragatiPath: AI-Powered Civic Issue Reporting Platform

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API-orange?logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow)
```

**Tip:** Use badges for **tech, deployment, and license** — they make the README visually appealing.

---

## 2️⃣ Short Description

**Purpose:** Explain in 1–3 lines what the project does and why it exists.

```md
A mobile-first, citizen-centric platform that empowers communities to report and track civic issues. PragatiPath leverages AI-powered issue classification, real-time tracking, gamification, and interactive visualizations — all built as a modern, **frontend-only** web app.
```

**Manner:** Keep it **concise, clear, and jargon-free**.

---

## 3️⃣ Features

**Purpose:** Highlight key functionality for users and admins.

```md
### For Citizens
- AI-Powered Reporting: Upload images or text; AI categorizes and prioritizes issues.
- Real-time Tracking: Track status from "Reported" to "Resolved".
- Interactive Maps & Charts: Visual representation of civic issues.
- Community Engagement: Upvote and comment.
- Gamification: Earn points, badges, and climb leaderboards.

### For Administrators
- Dashboard Overview: Summaries, charts, and timelines.
- AI-Powered Prioritization: Classify and score issues.
- Data Insights: Filter issues by status, location, and priority.
```

**Manner:** Use **bullet points** and **group by user roles** if applicable. Clear and scannable.

---

## 4️⃣ Live Demo / Screenshots

**Purpose:** Let readers quickly see the project in action.

```md
### ✨ [Live Demo User-Panel](https://pragati-path.netlify.app/user)
### ✨ [Live Demo Admin-Panel](https://pragati-path.netlify.app/admin)
```

**Tip:** Always include **links or images** to make your project interactive.

---

## 5️⃣ Tech Stack / Architecture

**Purpose:** Show the tools used, and give context for contributors.

```md
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS + Framer Motion
- Data Visualization: Recharts
- AI: Google Gemini API
- State Management: React Context API
- Deployment: Netlify (single domain `/user` & `/admin`)
```

**Manner:** Use **lists or tables**. Keep it concise.

---

## 6️⃣ Project Structure

**Purpose:** Show folder organization for contributors or developers.

```md
pragatipath/
├── user-panel/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── App.tsx
│   └── main.tsx
├── admin-panel/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── App.tsx
│   └── main.tsx
├── vite.config.user.ts
├── vite.config.admin.ts
├── package.json
├── tsconfig.json
└── README.md
```

**Manner:** Use **tree structure** to visually separate components.

---

## 7️⃣ Quick Start / Installation

**Purpose:** Guide anyone to run your project locally.

````md
### Prerequisites
- Node.js 16+
- Google AI Studio API Key
- Google Maps API Key

### Installation
1. Clone the repo
```bash
git clone https://github.com/your-username/pragatipath.git
cd pragatipath
````

2. Copy .env.example and update keys

```bash
cp .env.example .env
```

3. Install dependencies

```bash
npm install
```

4. Run dev server

```bash
npm run dev:user
npm run dev:admin
```

````

**Manner:** Step-by-step commands with **code blocks**.

---

## 8️⃣ AI Integration / Key Modules

**Purpose:** Explain **how your important modules work** with short examples.  

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeIssue(image: File) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent([
    "Analyze this civic issue image:",
    image,
  ]);
  return result.response.text();
}
````

**Manner:** Only include **essential snippets**, not the full project code.

---

## 9️⃣ Deployment Instructions

**Purpose:** Make it easy for contributors or users to deploy.

* Build both panels:

```bash
npm run build
```

* Netlify config:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/user/*"
  to = "/user/index.html"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

* Deploy → `/user` and `/admin` live.

**Manner:** Provide **commands + configuration** so it’s copy-paste ready.

---

## 🔟 License & Acknowledgments

**Purpose:** Give credit and legal info.

```md
MIT License – see LICENSE file for details.

Acknowledgments:
- Google Gemini API
- Recharts
- Tailwind CSS & Framer Motion
- React Community
```

---