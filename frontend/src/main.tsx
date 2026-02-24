import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { AuthProvider } from './app/auth/auth-context';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('🔐 Clerk & Supabase Configuration:');
console.log('Clerk Publishable Key:', PUBLISHABLE_KEY ? '✅ Loaded' : '❌ Missing');
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Loaded' : '❌ Missing');

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key - add VITE_CLERK_PUBLISHABLE_KEY to .env.local");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""} afterSignOutUrl="/">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>
);
