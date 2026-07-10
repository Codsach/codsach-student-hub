# Codsach - Student Resource Hub

Codsach is a modern, full-stack web application built for MCA students to access and manage study materials, including lab programs, study notes, question papers, and software tools.

## 📸 Screenshots

| Light Theme | Dark Theme |
| --- | --- |
| ![Light Theme](public/screenshot-light.png) | ![Dark Theme](public/screenshot-dark.png) |

## ✨ Features

- **Resource Categories**: Structured access to Lab Programs, Notes, Question Papers, and Software Tools.
- **Dynamic Controls**: Live filtering by subject/semester and sorting by name or date.
- **Admin Management**: Secure upload, edit, and deletion of resource files.
- **Git-Backed Storage**: Transparent content storage using GitHub repositories.
- **Modern UI/UX**: Sleek interface with theme toggling, hover animations, and real-time upload notifications.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **AI/Backend**: Firebase Genkit (Google AI / Gemini)
- **Database/Files**: GitHub API
- **Deployment**: Vercel

## 🚀 Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Codsach/codsach-student-hub.git
   cd codsach-student-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (`.env.local`):**
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002).