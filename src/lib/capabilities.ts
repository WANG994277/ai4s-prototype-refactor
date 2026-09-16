import entries from '@/data/capabilities.json';

export interface Capability {
  id: number;
  group: string;
  label: string;
  href: string;
  priority: string;
  strategy: string;
  role: string;
  legacy: string;
  nav: string;
}

export const capabilities: Capability[] = entries;

export const researcherGroups = ['科研协作', '读空间', '算空间', '做空间', '科研流程贯通', '共享资产'];
export const managerGroups = ['科研驾驶舱', '科研项目管理科研管理&驾驶舱（川庆）'];
export const adminGroups = ['身份与组织对接', '租户空间管理', '平台引导', 'AI4S安全方案', '平台运营', '平台运维'];

export function navigationHref(item: Capability) {
  if (item.href === '/literature-search/[id]') return '/literature-search/1';
  return item.href;
}

export function getCapability(href: string) {
  const normalized = href.replace(/\/$/, '') || '/';
  return capabilities.find((item) => item.href.split(/[?#]/)[0] === normalized)
    ?? (normalized.startsWith('/literature-search/') ? capabilities.find((item) => item.href === '/literature-search/[id]') : undefined);
}

export function isCurrentCapability(pathname: string, href: string) {
  const target = (href === '/literature-search/[id]' ? '/literature-search/1' : href).split(/[?#]/)[0];
  return pathname === target || (target !== '/workbench' && pathname.startsWith(`${target}/`));
}
