import AuthProvider from './context/AuthProvider';
import './global.css';

export const metadata = {
  title: 'Appwill',
  description: 'Appwill',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
