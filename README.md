# 💬 HeartSpeak

<div align="center">

![HeartSpeak Logo](public/logo-without-background.png)

**AI-powered conversation analysis to help you understand people and communicate with clarity and compassion**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 About

**HeartSpeak** is an empathy-driven AI application designed to analyze your conversations and provide personalized insights to improve communication. By uploading screenshots of your chats, HeartSpeak uses advanced AI to understand emotional dynamics, personality traits, and communication patterns, helping you build better relationships through empathy and understanding.

### ✨ Key Features

- 📸 **Conversation Analysis** - Upload chat screenshots and get AI-powered insights
- 🧠 **Personality Profiling** - MBTI assessment during onboarding
- 💝 **Love Languages** - Identify and understand communication preferences
- ⭐ **Zodiac Integration** - Add your zodiac sign for personalized insights
- 💬 **AI Coach Chat** - Interactive coaching based on your conversation analysis
- 🎨 **Beautiful UI** - Modern, responsive interface with smooth animations
- 🔐 **Secure Authentication** - Local authentication with Supabase backend integration

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **bun** package manager
- **Supabase account** (for backend services)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd empathy-ai
```

2. **Install dependencies**

```bash
npm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_APP_TITLE=HeartSpeak
VITE_API_URL=http://[::1]:5757/v1
```

> **Note**: Replace the placeholder values with your actual Supabase credentials.

4. **Run the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## 🏗️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Shadcn/UI** - Re-usable component library
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

### State Management & Data Fetching

- **TanStack Query (React Query)** - Async state management
- **Axios** - HTTP client

### Backend Integration

- **Supabase** - Authentication, database, and serverless functions
- **Cloudinary** - Media file uploads and management

### UI Components & Libraries

- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Next Themes** - Dark mode support

---

## 📂 Project Structure

```
empathy-ai/
├── public/                  # Static assets
│   ├── logo-without-background.png
│   └── ...
├── src/
│   ├── api/                # API service layer
│   │   └── user/          # User-related API calls
│   ├── common/            # Common utilities
│   ├── components/        # React components
│   │   ├── onboarding/   # Onboarding flow components
│   │   │   ├── LoveLanguagesStep.tsx
│   │   │   ├── MBTIStep.tsx
│   │   │   └── ZodiacStep.tsx
│   │   ├── ui/           # Reusable UI components
│   │   │   └── file-upload.tsx
│   │   ├── AnalysisResults.tsx
│   │   ├── AuthForm.tsx
│   │   └── ChatCoach.tsx
│   ├── contexts/         # React contexts
│   ├── features/         # Feature-specific code
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.tsx
│   ├── integrations/     # Third-party integrations
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   ├── Index.tsx
│   │   ├── Onboarding.tsx
│   │   ├── NotFound.tsx
│   │   └── Forbidden.tsx
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                  # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🎯 Usage

### 1. Sign Up / Login

- Create a new account or log in with existing credentials
- Avatar upload supported during registration

### 2. Complete Onboarding

New users go through a personalized onboarding process:

- **MBTI Assessment** - Select your personality type
- **Love Languages** - Choose up to 2 primary love languages
- **Zodiac Sign** - Add your zodiac sign for additional insights

### 3. Analyze Conversations

1. Upload screenshots of your chat conversations (supports images and videos)
2. Optionally add context about the conversation
3. Click "Analyze Conversation" to get AI-powered insights
4. Review the analysis results and emotional dynamics

### 4. Chat with AI Coach

- After analysis, interact with the AI coach
- Get personalized advice based on your conversation
- Ask questions about communication strategies

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_APP_TITLE` | Application title | No |
| `VITE_API_URL` | Backend API base URL | Yes |

---

## 🎨 Features in Detail

### Conversation Analysis
- Upload multiple chat screenshots
- AI analyzes emotional tone, communication patterns, and relationship dynamics
- Provides actionable insights for better communication

### Personality Integration
- **MBTI Types**: 16 personality types supported
- **Love Languages**: Physical Touch, Words of Affirmation, Quality Time, Acts of Service, Receiving Gifts
- **Zodiac Signs**: All 12 zodiac signs integrated

### File Upload
- Drag-and-drop support
- Image preview with thumbnails
- Video upload with thumbnail generation
- Multiple file support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [Shadcn/UI](https://ui.shadcn.com/) components
- Icons by [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Backend services by [Supabase](https://supabase.com/)

---

<div align="center">

**Made with ❤️ for better communication**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
