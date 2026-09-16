import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI4S 科研平台',
  description: '面向石油石化行业的 AI for Science 科研加速平台',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
