import "./globals.css";

export const metadata = {
  title: "Secret Santa | Acme",
  description: "Secret Santa assignment tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
