import type { Metadata } from 'next';
import Legacy from '@/components/views/Legacy';

export const metadata: Metadata = { title:'Legacy' };

export default function Page(){
  return <Legacy/>;
}
