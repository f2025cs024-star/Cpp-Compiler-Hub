# NexCPP - Professional C++ Online Compiler

NexCPP is a full-stack, real-time interactive C++ IDE with cloud storage and a premium user experience.

## Features
- **Real-time Interactive Terminal**: Full stdin/stdout support via Socket.IO.
- **Monaco Editor**: High-performance editor with C++ syntax highlighting and IntelliSense.
- **Auth & Cloud Storage**: Save and manage your programs with JWT-based authentication.
- **Leaderboard**: See the most popular public programs.
- **Secure Sandbox**: Docker-ready execution environment.
- **Premium Design**: Dark theme, Glassmorphism, and smooth animations.

## Tech Stack
- **Frontend**: React, Vite, Tailwind (Custom Vanilla CSS), Monaco Editor, Xterm.js.
- **Backend**: Node.js, Express, Socket.IO, SQLite (better-sqlite3).
- **Security**: Helmet, Rate Limiting, Docker Sandboxing.

## Getting Started

### Prerequisites
- Node.js (v18+)
- g++ (for local execution)
- Docker (optional, for sandboxed execution)

### Installation
1. Clone the repository.
2. Install dependencies for both server and client:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

### Running Locally
1. Start the backend server:
   ```bash
   cd server && npm run dev
   ```
2. Start the frontend development server:
   ```bash
   cd client && npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## Docker Deployment
To run the full stack with Docker:
```bash
docker-compose up --build
```

## Security Note
For production, ensure all code runs inside the Docker sandbox. The current local fallback uses the host system's `g++` for development convenience.
