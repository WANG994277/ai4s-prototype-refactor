import { notFound } from 'next/navigation';
import { capabilities } from '@/lib/capabilities';
import { CapabilityScreen } from '@/components/capability-screen';
import { ProjectWorkspace } from '@/components/project-workspace';
import { FlowWorkspace } from '@/components/flow-workspace';
import { AssetWorkspace } from '@/components/asset-workspace';

export default async function CapabilityRoute({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const pathname = `/${slug.join('/')}`;
  const tab = typeof query.tab === 'string' ? query.tab : undefined;
  const view = typeof query.view === 'string' ? query.view : undefined;
  const projectId = typeof query.projectId === 'string' ? query.projectId : undefined;
  const exactHref = tab ? `${pathname}?tab=${tab}` : view ? `${pathname}?view=${view}` : pathname;
  const item = capabilities.find((entry) => entry.href === exactHref)
    ?? capabilities.find((entry) => entry.href.split(/[?#]/)[0] === pathname);
  if (!item) notFound();
  if (pathname === '/collaboration/projects') return <ProjectWorkspace />;
  if (pathname.startsWith('/research-flow')) return <FlowWorkspace item={item} />;
  if (pathname.startsWith('/assets/')) return <AssetWorkspace item={item} />;
  return <CapabilityScreen key={item.id} item={item} projectId={projectId} />;
}
