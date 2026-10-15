import type { Metadata } from 'next';
import { D } from '@/lib/data';
import Pledge from '@/components/views/Pledge';

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title:'Make a pledge' };
export const dynamicParams = false;
export const generateStaticParams = () => [{ id:'general' }, ...D.projects.map(p => ({ id:p.id }))];

export default async function Page({ params }: Props){
  const { id } = await params;
  return <Pledge initialProject={id}/>;
}
