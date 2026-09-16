import { redirect } from 'next/navigation';

export default function LegacyRedirect() {
  redirect('/literature-search/1');
}

