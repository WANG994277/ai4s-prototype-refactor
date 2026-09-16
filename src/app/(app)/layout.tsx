'use client';

import { SidebarProvider } from '@/components/layout/sidebar-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { ResearchAssistantPanel } from '@/components/layout/research-assistant-panel';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/components/layout/sidebar-context';

function RoleAwareContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useSidebar();
  if (pathname.startsWith('/manage/') && role !== 'admin') {
    return <div className="mx-auto mt-20 max-w-md rounded-lg border border-line bg-white p-8 text-center"><h1 className="text-lg font-semibold">当前角色无权访问此功能</h1><p className="mt-3 text-sm text-muted-foreground">请在左侧切换为平台管理员，或联系管理员申请相应权限。</p><Link href="/workbench" className="mt-5 inline-block rounded-md border border-line px-4 py-2 text-sm text-primary">返回工作台</Link></div>;
  }
  return children;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-background p-5">
            <RoleAwareContent>{children}</RoleAwareContent>
          </main>
        </div>
        <ResearchAssistantPanel />
      </div>
    </SidebarProvider>
  );
}
