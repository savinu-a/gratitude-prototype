import type { Metadata } from 'next';
import { D, PROJ } from '@/lib/data';
import Project from '@/components/views/Project';

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => D.projects.map(p => ({ id:p.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title:PROJ[id].title };
}

export default async function Page({ params }: Props){
  const { id } = await params;
  return <Project id={id}/>;
}
