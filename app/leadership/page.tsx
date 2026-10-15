import type { Metadata } from 'next';
import Leadership from '@/components/views/Leadership';

export const metadata: Metadata = { title:'Leadership' };

export default function Page(){
  return <Leadership/>;
}
