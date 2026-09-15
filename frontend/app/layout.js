import "./globals.css";

export const metadata = {
  title: "TripMate",
  description: "Plan your next adventure with TripMate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}