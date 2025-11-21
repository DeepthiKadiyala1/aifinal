AI Habit Builder

An intelligent, adaptive habit-building assistant that breaks tasks into micro-tasks, adapts to users’ emotions and circadian rhythm, and provides multi-style AI coaching.

🚀 Features

Automatic Habit Breaker — Break large tasks into timed micro-steps.

Emotional-Adaptive Engine — One-sentence check-ins adjust the day’s plan.

Multi-Personality Coach — Supportive, Strict, Cheerful, Calm, or Lightly Sarcastic.

Circadian Rhythm Alignment — Routines shift to fit your sleep/wake patterns.

📁 Project Folder Structure

This is the structure of the project as shown in your repo:

AI-HABIT-BUILDER/
├── node_modules/
├── public/
├── src/
├── .env.example
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── server.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

What the important items are:

node_modules/ — Installed dependencies (auto-generated).

public/ — Static assets (favicons, images, etc.).

src/ — Application source code (components, pages, styles, utilities).

.env.example — Example environment variables. Copy to .env and fill values.

index.html — Vite entry HTML.

package.json & package-lock.json — Project metadata and scripts.

vite.config.ts — Vite configuration (dev server, build).

tailwind.config.ts & postcss.config.js — Tailwind / PostCSS setup.

server.js — Node/Express (or similar) server entry (used in production or API proxy).

tsconfig.json* — TypeScript configuration files.

eslint.config.js — Linting rules.

components.json — Optional: component metadata used by the app or builder.

bun.lockb — (If using Bun) lock file for Bun package manager.

🛠️ Prerequisites

Node.js (v16+ recommended)

npm (or yarn/pnpm)

(Optional) Bun — if you use Bun for running packages

💻 How to run locally

Clone the repo

git clone <your-github-repo-link>
cd AI-HABIT-BUILDER


Create .env

Copy the example env and fill required keys:

cp .env.example .env
# edit .env with API keys / settings


Install dependencies

npm install


Run the dev server

If you're using Vite:

npm run dev


Open the URL Vite prints (typically http://localhost:5173 or http://localhost:3000 depending on config).

Production / server

If you have a server.js for production or Node-based API, you might:

npm run build    # builds production bundle (if script exists)
node server.js   # runs the server (make sure env vars set)


Check package.json scripts to confirm exact commands (dev, build, preview, etc.). If you want, paste your package.json and I’ll add exact commands here.

⚙️ Environment variables

Add sensitive keys and configuration to .env (do not commit .env):

Typical keys you might need:

VITE_API_BASE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_SOME_KEY=
PORT=3000


(Use .env.example as a template.)

✅ Common scripts (example)

Your package.json likely contains scripts like the following (adjust if yours differ):

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx"
  }
}

🧪 Tests & Linting

Run ESLint (if configured):

npm run lint


Add test scripts if you add testing (Jest, Vitest, etc.).

🤝 Contributing

Contributions welcome! Suggested workflow:

Fork the repo

Create a branch: git checkout -b feat/your-feature

Commit changes & push

Open a Pull Request with a brief description
