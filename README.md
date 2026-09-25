# C++ Compiler Hub — Real-Time Interactive Online C++ IDE

**C++ Compiler Hub** is a full-stack, real-time interactive C++ IDE with cloud storage and a live terminal experience directly in your browser.

🔗 **Repository:** [https://github.com/f2025cs024-star/cpp-compiler-hub](https://github.com/f2025cs024-star/cpp-compiler-hub)

## Features
- **Real-Time Interactive Terminal**: Full stdin/stdout support via Socket.IO and Xterm.js with ANSI colors.
- **Monaco Editor**: High-performance editor with C++ syntax highlighting and IntelliSense.
- **Auth & Cloud Storage**: Save and manage your programs with JWT-based authentication.
- **Leaderboard**: Browse and run popular community programs.
- **Secure Sandbox**: Docker-ready execution environment with execution timeouts.
- **Premium Design**: Dark theme, Glassmorphism, and smooth transitions.

## Tech Stack
- **Frontend**: React (v19), Vite, Monaco Editor, Xterm.js, Framer Motion.
- **Backend**: Node.js, Express, Socket.IO, SQLite (`better-sqlite3`).
- **Compiler**: `g++` (C++17, -O2, -Wall).
- **Security**: Helmet, Rate Limiting, Docker Sandboxing.
