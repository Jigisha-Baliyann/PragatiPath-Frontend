# PragatiPath: AI-Powered Civic Issue Reporting Platform

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API-orange?logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 1️⃣ Short Description
**PragatiPath** is a mobile-first, citizen-centric platform that empowers communities to report, track, and resolve civic issues efficiently. It leverages **AI-powered issue classification**, real-time tracking, gamification, and interactive visualizations — all built as a modern, **frontend-only** web app.

---

## 2️⃣ Features

### For Citizens
- **AI-Powered Reporting:** Upload images or text; AI automatically categorizes and prioritizes issues.
- **Real-time Tracking:** Monitor issue status from "Reported" to "Resolved."
- **Interactive Maps & Charts:** Visual insights into civic issues across locations.
- **Community Engagement:** Upvote, comment, and support reported issues.
- **Gamification:** Earn points, badges, and climb leaderboards for participation.

### For Administrators
- **Dashboard Overview:** Summaries, charts, and timelines for quick insights.
- **AI-Powered Prioritization:** Automatically classify and rank reported issues.
- **Data Insights:** Filter and sort issues by status, location, and priority.

---

## 3️⃣ Live Demo / Screenshots

### ✨ [Live Demo User-Panel](https://pragati-path.netlify.app/user)  
### ✨ [Live Demo Admin-Panel](https://pragati-path.netlify.app/admin)

*(Add screenshots or GIFs here for better visual impact.)*

---

## 4️⃣ Tech Stack / Architecture
| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Data Visualization | Recharts |
| AI Integration | Google Gemini API |
| State Management | React Context API |
| Deployment | Netlify (single domain with `/user` & `/admin`) |

---

## 5️⃣ Project Structure
```

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

````

---

## 6️⃣ Quick Start / Installation

### Prerequisites
- Node.js 16+
- Google AI Studio API Key
- Google Maps API Key

### Installation
1. **Clone the repository**
```bash
git clone https://github.com/your-username/pragatipath.git
cd pragatipath
````

2. **Set up environment variables**

```bash
cp .env.example .env
# Update your API keys in .env
```

3. **Install dependencies**

```bash
npm install
```

4. **Run development servers**

```bash
npm run dev:user   # User panel
npm run dev:admin  # Admin panel
```

---

## 7️⃣ AI Integration / Key Modules

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
```

*Example of AI-powered civic issue classification.*

---

## 8️⃣ Deployment Instructions

### Build both panels

```bash
npm run build
```

### Netlify Configuration (`_redirects` or `netlify.toml`)

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

*Deploy → Both `/user` and `/admin` will be live.*

---

## 9️⃣ License & Acknowledgments

```md
MIT License – see LICENSE file for details.

Acknowledgments:
- Google Gemini API
- Recharts
- Tailwind CSS & Framer Motion
- React Community
```

---

## 🔟 Additional Notes

* Mobile-first and **PWA-ready** design.
* Supports **future backend integration** for persistent storage.
* Contribution-friendly folder structure and **TypeScript-based safety**.

```

I can also **make it even more visually professional** with **emoji sections, collapsible code blocks, badges for build/status, and a screenshot gallery** to give it a GitHub portfolio-level appeal.  

Do you want me to do that next?
```
