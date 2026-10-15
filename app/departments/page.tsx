import type { Metadata } from 'next';
import Departments from '@/components/views/Departments';

export const metadata: Metadata = { title:'Departments' };

export default function Page(){
  return <Departments/>;
}
