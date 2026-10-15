import type { Metadata } from 'next';
import Wall from '@/components/views/Wall';

export const metadata: Metadata = { title:'Wall of Gratitude' };

export default function Page(){
  return <Wall/>;
}
