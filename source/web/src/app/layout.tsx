import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portón - Control de Acceso',
  description: 'Control de acceso al portón',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
