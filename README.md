# FlowDesk ⚡

FlowDesk is a sleek, modern, and responsive Task Management Single-Page Application (SPA) designed to help users organize, track, and optimize their daily schedules.

Built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**, FlowDesk incorporates client-side user registration, password verification, route protection, and data isolation, allowing multiple users to manage independent task spaces entirely within the browser.

---

## Key Features 🚀

- **Real Client-Side Authentication:**
  - Secure **Sign Up** & **Sign In** pages with live validation checks.
  - User accounts and credentials stored privately in `localStorage`.
  - Specific error notifications for incorrect password or taken usernames.
- **Isolated User Database Workspace:**
  - Tasks are segmented dynamically by username (`FlowDesk-tasks:${username}`).
  - New user sign-ups are pre-seeded with a default mock task list to ensure the dashboard looks loaded and appealing at first sight.
- **Dynamic Dashboard Panel:**
  - Status counts (Total, Completed, In-Progress, Overdue).
  - SVG Circular Goal Completion Ring tracking tasks progression.
  - Urgent priority listings and today's agenda alerts.
- **Advanced Task Search & Filtration:**
  - Instant title and description search (debounced to optimize sorting calculations).
  - Group filtration by Status, Priority, and Category.
  - Dynamic sorting by Due Date, Priority level, and Creation Date (with Ascending/Descending toggle).
- **Responsive Layout Shell:**
  - Sleek persistent desktop sidebar.
  - Slide-in glassmorphism mobile drawer sidebar.
  - Floating bottom alerts for overdue tasks.
- **Animations & Styling:**
  - Rich typography using the **Inter** font family.
  - Smooth list transformations, layout transitions, and click scales powered by **Framer Motion**.
  - Fast, responsive utility styling with **Tailwind CSS**.
  - Class-based persistence for Light / Dark appearance modes.

---

## Tech Stack 🛠️

- **Language:** TypeScript, JavaScript (ES6+)
- **Core Framework:** React 18.2
- **Build Engine:** Vite 4.4
- **Routing Router:** React Router DOM v6
- **Forms Handling:** React Hook Form
- **Animations:** Framer Motion
- **Icons Toolkit:** Lucide React
- **Styling Engines:** Tailwind CSS v3, PostCSS, Autoprefixer

---

## Project Structure 📁

FlowDesk follows a scalable, feature-based directory structure:

```
src/
├── assets/             # Images and global vectors
├── components/         # Reusable atomic UI elements
│   ├── ui/             # Atoms (Button, Input, Select, Badge, Card, Modal)
│   └── layout/         # Shell frames (MainLayout, Sidebar, Header, ProtectedRoute)
├── context/            # Central React Context state providers
│   ├── AuthContext.tsx # Simulated user registries and credentials checking
│   ├── TaskContext.tsx # User-scoped task CRUD and statistics calculator
│   ├── ThemeContext.tsx# Light/Dark mode class binds
│   └── ToastContext.tsx# Slide-in global toast feedback notifications
├── features/           # Feature pages
│   ├── auth/           # Login & Registration views
│   ├── dashboard/      # Statistics, progress wheels, and agenda widgets
│   ├── tasks/          # Search, filters, sort grids, and TaskForm layouts
│   └── settings/       # Theme switchers and LocalStorage reset utilities
├── hooks/              # Global custom hooks (useLocalStorage, useDebounce)
├── types/              # TypeScript typings (task.types.ts)
├── utils/              # Sorting calculations and relative date formatters
├── App.tsx             # Root router setup and provider mounting
├── index.css           # Global style overrides and scrollbars
└── main.tsx            # App mounting target
```

---

## Installation & Running Locally 💻

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v16.15.0 or later is recommended).

### Step-by-Step Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/FlowDesk.git
   cd FlowDesk
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173/` in your browser to view the application.

4. **Build for production:**
   ```bash
   npm run build
   ```
   This will run Type checks and build static assets into the `dist/` directory.

---

## How It Works: Local Auth & Storage 🔒

FlowDesk functions entirely on client-side sandboxed APIs:

1. **User Sign Up:** Saves the username and password in `localStorage` under `FlowDesk-users`.
2. **User Sign In:** Verifies credentials against the stored array. On success, writes user session to `FlowDesk-current-user` and redirects to the Dashboard.
3. **Task Segmentation:** Reads the logged-in session and maps `localStorage` reads/writes to `FlowDesk-tasks:${username}`. This isolates Bob's tasks from Alice's tasks on the same browser.

---

## License 📄

This project is open-source and available under the [MIT License](LICENSE).
