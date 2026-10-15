import type { Metadata } from 'next';
import Governance from '@/components/views/Governance';

export const metadata: Metadata = { title:'Governance and audits' };

export default function Page(){
  return <Governance/>;
}
