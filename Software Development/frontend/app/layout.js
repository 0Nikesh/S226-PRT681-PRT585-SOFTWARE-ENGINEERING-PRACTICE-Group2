import { AuthProvider } from "@/components/AuthProvider";
import { WatchlistProvider } from "@/components/WatchlistProvider";
import "./globals.css";

export const metadata = {
  title: "TripMate",
  description: "Plan your next adventure with TripMate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <AuthProvider>
          <WatchlistProvider>{children}</WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}