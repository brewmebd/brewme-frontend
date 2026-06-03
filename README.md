<div align="center">

# ☕ BrewMe — Frontend

### **Fund your craft, one coffee at a time.**

The React single-page app for **BrewMe**, a warm, playful creator-support
platform where fans discover creators, send one-time coffees, join memberships,
and unlock exclusive posts.

![React](https://img.shields.io/badge/React-19-1A1A1A?style=for-the-badge&logo=react&logoColor=F5C518)
![Vite](https://img.shields.io/badge/Vite-7-1A1A1A?style=for-the-badge&logo=vite&logoColor=F5C518)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-1A1A1A?style=for-the-badge&logo=tailwindcss&logoColor=F5C518)
![Router](https://img.shields.io/badge/React_Router-7-1A1A1A?style=for-the-badge&logo=reactrouter&logoColor=F5C518)

</div>

---

## ☕ What's inside

A polished, responsive UI built around a coffee-purchase metaphor:

- 🔍 **Explore** creators by category and search
- 👤 **Public profiles** at `/:username` with a support widget
- 💛 **Buy a coffee** — one-time tips, no account needed
- ⭐ **Membership tiers**, exclusive posts, supporter walls, and funding goals
- 📊 **Creator dashboard** — earnings, supporters, posts, memberships, settings

---

## 🎨 Design system

BrewMe wears a **bold, warm, neobrutalist** look — thick borders, hard offset
shadows, and a signature espresso-on-cream palette.

| Token               | Hex       | Use                                 |
| ------------------- | --------- | ----------------------------------- |
| `brew-yellow`       | `#F5C518` | Primary accent, buttons, highlights |
| `brew-yellow-light` | `#FFFDE7` | Page & card backgrounds             |
| `brew-yellow-hover` | `#E6B800` | Hover states                        |
| `brew-text`         | `#1A1A1A` | Text, borders, shadows              |
| `brew-muted`        | `#6B6B6B` | Secondary text                      |

Type: **Inter**, leaning into heavy weights and uppercase tracking for headings.

---

## 🧱 Tech stack

- **React 19** + **Vite** (HMR, React Compiler enabled)
- **React Router 7** for routing
- **Tailwind CSS v4** for styling (theme tokens in [`src/index.css`](src/index.css))
- **Lucide** icons · **Recharts** for dashboard charts

---

## 📁 Project structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI (Button, Card, Toast, Navbar, …)
│   ├── pages/          # Route screens
│   │   └── dashboard/  # Creator dashboard screens
│   ├── lib/
│   │   └── api.js      # API base URL + helpers
│   ├── App.jsx         # Routes
│   ├── main.jsx        # App entry
│   └── index.css       # Tailwind theme + brand tokens
├── public/             # Static assets (icons, images)
└── index.html
```

---

## 🚀 Getting started

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts at **http://localhost:5173**.

### Connecting to the backend

The app talks to the Go API via [`src/lib/api.js`](src/lib/api.js). It defaults
to `http://localhost:8080/api/v1`. To override, create `frontend/.env`:

```ini
VITE_API_URL=http://localhost:8080/api/v1
```

> Make sure the [backend](../backend/README.md) is running and MySQL is seeded
> so screens like Sign Up work end-to-end.

---

## 🧭 Routes

| Path                                                                            | Screen                 |
| ------------------------------------------------------------------------------- | ---------------------- |
| `/`                                                                             | Home                   |
| `/explore`                                                                      | Explore / discovery    |
| `/signup`, `/login`                                                             | Authentication         |
| `/:username`                                                                    | Public creator profile |
| `/dashboard`                                                                    | Overview               |
| `/dashboard/supporters` · `/earnings` · `/posts` · `/memberships` · `/settings` | Dashboard screens      |

---

## 📜 Scripts

| Command           | Does                         |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Production build             |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

---

<div align="center">

Made with ☕ and a lot of `border-2 border-brew-text`.

</div>
