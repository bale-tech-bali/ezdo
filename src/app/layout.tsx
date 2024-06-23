import './globals.scss'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ezdo | Simple Todo',
  description:
    'A simple todo app to demonstrate RLS (Row-Level Security) with Supabase.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
