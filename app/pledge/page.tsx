import type { Metadata } from 'next';
import Pledge from '@/components/views/Pledge';

export const metadata: Metadata = { title:'Make a pledge' };

export default function Page(){
  return <Pledge/>;
}
