# Codsach - Your Ultimate Coding Resource Hub

Codsach is a full-stack web application designed as a comprehensive resource hub for MCA (Master of Computer Applications) students, but it's useful for any developer or student looking for organized coding materials. It provides easy access to lab programs, study notes, previous year question papers, and essential software tools, all managed through a GitHub repository and a user-friendly admin panel.

## ✨ Features

- **Centralized Resource Hub**: Access all your academic and coding resources in one place.
- **Four Main Categories**:
  - **Lab Programs**: Complete source code for various lab assignments.
  - **Notes**: In-depth study notes for a wide range of subjects.
  - **Question Papers**: Previous years' question papers to help with exam preparation.
  - **Software Tools**: Direct download links to essential software and tools.
- **Dynamic Filtering and Sorting**: Easily filter resources by subject, semester, or year, and sort by date, name, or download count.
- **Admin Panel**: A secure admin panel for uploading, managing, and deleting resources.
- **GitHub Integration**: Resources are stored and managed in a public GitHub repository, making content management transparent and version-controlled.
- **Real-time Notifications**: A notification system in the navbar alerts users to new resources uploaded within the last 7 days.
- **Dark/Light Mode**: A sleek, user-friendly interface with theme toggling.
- **SEO Optimized**: Built with SEO best practices, including dynamic sitemaps and metadata, to ensure content is discoverable.
- **Analytics**: Integrated with Vercel Analytics to track user engagement.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **AI/Backend Flows**: [Genkit (Firebase)](https://firebase.google.com/docs/genkit)
- **Content Storage**: [GitHub](https://github.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 📂 Project Structure

The project follows a standard Next.js App Router structure.

```
/
├── src
│   ├── app/                  # Main application routes
│   │   ├── (app)/            # Logged-in/main app routes (notes, etc.)
│   │   ├── admin/            # Admin panel
│   │   ├── login/            # Admin login page
│   │   ├── api/              # API routes (if any)
│   │   ├── layout.tsx        # Root layout (metadata, themes)
│   │   └── page.tsx          # Landing page
│   ├── ai/                   # Genkit flows for backend logic
│   │   ├── flows/            # Individual flows (upload, list, delete)
│   │   └── genkit.ts         # Genkit configuration
│   ├── components/           # Reusable React components
│   │   ├── auth/
│   │   ├── landing/
│   │   ├── resources/
│   │   └── ui/               # ShadCN UI components
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── public/                   # Static assets (images, favicon, sitemap)
├── package.json
└── next.config.ts
```

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [GitHub Account](https://github.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following variables.

```env
# A GitHub Personal Access Token with 'repo' scope
# This is used to read from and write to the resources repository
# Generate one here: https://github.com/settings/tokens/new
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# A Gemini API Key for Genkit flows
# Get one from Google AI Studio: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: The application is configured to use the `Codsach/codsach-resources` repository. If you wish to use your own GitHub repository for resources, you must update the `repository` parameter in the flow calls within the following files:
- `src/app/(app)/**/page.tsx`
- `src/app/(app)/admin/page.tsx`
- `src/app/(app)/search/page.tsx`

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

The admin panel is at `http://localhost:9002/login`.
- **Email**: `admin@codsach.com`
- **Password**: `codsach@22`

## 🌐 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push to GitHub**: Push your cloned and configured repository to your own GitHub account.
2.  **Import Project on Vercel**: Log in to Vercel and import the repository. Vercel will automatically detect that it's a Next.js project.
3.  **Configure Environment Variables**: In the Vercel project settings, add the same environment variables you defined in your `.env.local` file (`GITHUB_TOKEN` and `GEMINI_API_KEY`).
4.  **Deploy**: Vercel will build and deploy your application. The Vercel Analytics integration will work automatically.

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project, please feel free to fork the repository and submit a pull request.
```