# IIT JU Alumni Frontend – Context Summary

## 🏗️ Overall Purpose & Backend Connection

This project is a frontend web application for the IIT JU Alumni Network, designed to connect alumni of Jahangirnagar University. It provides features such as alumni search, real-time chat, event management, group creation, and profile management. The frontend communicates with a microservices-based backend system (see below), primarily via a REST API gateway (`http://localhost:8000/ijaa/api/v1/user` by default, configurable via `REACT_APP_API_BASE_URL`).

**Backend System:**
- Java 17, Spring Boot 3.4.3, Spring Cloud 2024.0.0
- Microservices: API Gateway, User Service, Discovery Service, Config Service
- PostgreSQL database
- JWT-based authentication (HMAC-SHA256, 1h expiry)
- User context propagated via `X-USER_ID` header (Base64-encoded JSON)

---

## 📁 Project Folder Structure

- **src/**
  - **components/**: Reusable UI components (e.g., `Navbar.jsx`, `DirectChat.jsx`, `GroupChat.jsx`)
  - **context/**: React Context providers for authentication (`AuthContext.jsx`) and theme (`ThemeContext.jsx`)
  - **pages/**: Route-based pages (e.g., `Dashboard.jsx`, `Profile.jsx`, `Events.jsx`, `SignIn.jsx`, `Chat.jsx`, etc.)
  - **index.jsx**: Main entry point, sets up React Router and providers
  - **index.css**: Global styles (Tailwind CSS)
  - **App.jsx**: Main app component, defines route structure and protected routes

- **public/**: Static assets (images, favicon, HTML template, output.css)
- **config files**: `tailwind.config.js`, `vite.config.ts`, `eslint.config.js`, `postcss.config.js`, `package.json`

---

## 🧰 Tech Stack

- **React**: v18.2.0
- **React Router DOM**: v6.28.0 (routing and protected routes)
- **Tailwind CSS**: v3.4.17 (utility-first styling, dark mode via class)
- **Axios**: v1.7.8 (API requests)
- **React Context**: For authentication and theme management
- **Lucide-react**: Icon library
- **FontAwesome** and **react-icons**: Additional icon support
- **Vite**: Build tool and dev server
- **Testing**: React Testing Library, Jest DOM, User Event (see below)
- **Other**: `jwt-decode` for JWT handling, `emailjs-com` for email features

---

## 🔐 Authentication Flow (Frontend & Backend Integration)

- **Context-based**: `AuthContext` provides `user`, `signIn`, `signOut`, and session management.
- **JWT Storage**: On successful login, JWT and user info are stored in `localStorage` under `alumni_user`.
- **Login**: Credentials are sent to `/signin` endpoint; on success, token and userId are saved.
- **Logout**: Clears user from context and localStorage.
- **Auth Headers**: When making API requests (e.g., with Axios), the JWT is included in the `Authorization: Bearer <token>` header.
- **X-USER_ID Header**: For authenticated requests, the frontend should propagate the user context via the `X-USER_ID` header, containing a Base64-encoded JSON string (e.g., `{ "username": "john.doe" }`). This is required by the backend gateway for user context propagation.
- **Session Persistence**: On app load, checks localStorage for existing user session.
- **No Axios Interceptors**: Headers are set per-request, not globally via interceptors.
- **Password Security**: Passwords are never stored in the frontend; only sent to backend for authentication.

---

## 🔌 API Interaction Setup

- **Base URL**: Set via `REACT_APP_API_BASE_URL` environment variable.
- **Axios**: Imported and used directly in page components for API calls.
- **Headers**: JWT token injected manually in each request requiring authentication. For backend compatibility, the `X-USER_ID` header should be included for all authenticated requests.
- **No global Axios instance or interceptors**: Each request sets headers as needed.
- **API Gateway**: All requests are routed through the API gateway (Spring Cloud Gateway, port 8000).

---

## 🧑‍💼 Main Features Implemented

- **Authentication**: Sign in, sign up, forgot/reset password (integrates with backend AuthService)
- **Profile Management**: View, edit, and update profile; view other alumni profiles (ProfileService)
- **Alumni Search**: Advanced search by profession, location, batch, interests (AlumniSearchService)
- **Events**: View, register, and manage alumni events
- **Groups**: Create and join groups, group chat
- **Chat**: Real-time direct and group chat (UI present, backend assumed; planned integration with Firebase/WebRTC)
- **Notifications**: Notification page and UI
- **Settings**: Privacy and account settings
- **Support**: Contact support page
- **Landing Page**: Public marketing and feature overview
- **Other**: Terms, privacy policy, maintenance, not found

---

## 🧩 Key Reusable Components & Custom Hooks

- **Navbar**: Responsive navigation bar with profile dropdown, theme toggle, and notifications
- **DirectChat / GroupChat**: Chat UIs for direct and group messaging
- **AuthContext**: Custom hook `useAuth` for authentication state and actions
- **ThemeContext**: Custom hook `useTheme` for dark/light mode and persistence

---

## 🔒 Protected Routes & Route Structure

- **Protected Routes**: Implemented in `App.jsx` using conditional rendering and `Navigate` from React Router. Only authenticated users can access dashboard, profile, events, groups, chat, etc.
- **Public Routes**: Landing page, sign in, sign up, forgot/reset password, terms, privacy policy
- **Route Structure**: Centralized in `App.jsx` with clear separation of public and protected routes

---

## ⚙️ Configuration Files

- **tailwind.config.js**: Tailwind setup, custom screens, dark mode via class
- **vite.config.ts**: Vite config, React plugin, excludes `lucide-react` from optimization
- **eslint.config.js**: ESLint setup for code quality
- **postcss.config.js**: PostCSS for Tailwind
- **package.json**: Scripts, dependencies, and test setup
- **No .env file found**: But code expects `REACT_APP_API_BASE_URL` to be set

---

## 📦 Third-Party Libraries & Tools

- **UI/Icons**: `lucide-react`, `react-icons`, `@fortawesome`
- **Email**: `emailjs-com`
- **JWT**: `jwt-decode`
- **Testing**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Prettier**: For code formatting
- **No Zustand, React Hook Form, or Toast libraries detected**

---

## 🧪 Testing Setup

- **Testing Libraries**: React Testing Library, Jest DOM, User Event
- **Scripts**: `npm test` runs tests via `react-scripts test`
- **No test files detected in src/**: But dependencies and scripts are present for testing

---

## 📄 Unique or Noteworthy Aspects

- **Microservices Awareness**: The frontend is designed to interact with a microservices backend via a single API gateway, and is aware of service boundaries (e.g., AuthService, ProfileService, AlumniSearchService).
- **Theme Persistence**: Dark/light mode is persisted in localStorage and respects system preference
- **Manual JWT Handling**: No global Axios instance; JWT is manually injected per request
- **X-USER_ID Header**: For all authenticated API calls, the frontend should include the `X-USER_ID` header with a Base64-encoded JSON string of the user context (e.g., `{ "username": "john.doe" }`).
- **No .env file in repo**: But environment variable usage is present in code
- **No global error boundary or toast notifications**: Errors are handled inline in forms/pages
- **No Redux or Zustand**: State management is via React Context only
- **Planned Integrations**: Real-time chat (Firebase), video calls (WebRTC), payments (Stripe/Razorpay), social login (Google/Facebook OAuth)

---

This summary provides a complete, shareable context for the `ijaa-frontend` React project, suitable for onboarding, prompt engineering, or integration with AI tools. If you need further details on any specific area, let me know! 