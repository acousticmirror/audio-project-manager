import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

export const metadata = {
  title: "Audio Project Manager",
  description: "Track your audio projects, sessions, and takes",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}