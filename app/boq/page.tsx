import type { Metadata } from 'next';
import BoqIndex from '@/components/views/BoqIndex';

export const metadata: Metadata = { title:'BOQ index' };

export default function Page(){
  return <BoqIndex/>;
}
