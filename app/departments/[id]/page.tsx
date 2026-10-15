import type { Metadata } from 'next';
import { D, DEPT } from '@/lib/data';
import Dept from '@/components/views/Dept';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => D.depts.map(d => ({ id:d.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title:DEPT[id].name };
}

export default async function Page({ params }: Props){
  const { id } = await params;
  return <Dept id={id}/>;
}
