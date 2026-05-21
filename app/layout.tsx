import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plataforma Gastronomica Local',
  description: 'Descubrimiento y reservaciones de restaurantes en Oaxaca',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-[#FAFAF7] text-[#1C1C1C]">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
