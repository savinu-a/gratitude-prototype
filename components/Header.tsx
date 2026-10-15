'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PROJ } from '@/lib/data';
import { Arrow } from './ui';

export const Crest = () => <span className="crest" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c2 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.6.6-2.8 1.5-3.8.3 1.3 1 2 2 2.3C11 7.8 11.2 5.3 12 3z"/><path d="M6 21h12"/></svg></span>;

const NAV: [key: string, href: string, label: string][] = [['home','/','Campaign'],['departments','/departments','Departments'],['legacy','/legacy','Legacy'],['wall','/wall','Wall of Gratitude'],['leadership','/leadership','Leadership']];

function section(path: string){
  if (path==='/') return 'home';
  if (path.startsWith('/projects/')) return PROJ[path.split('/')[2]]?.status==='completed' ? 'legacy' : 'departments';
  return path.split('/')[1];
}

export default function Header(){
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const key = section(path);
  return <header className="band">
    <div className="in">
      <Link className="wm" href="/" aria-label="Gratitude home"><Crest/><span className="t"><small>University of Moratuwa</small><strong>Gratitude</strong></span></Link>
      <nav className={`nav ${open?'open':''}`} id="nav" aria-label="Main">
        {NAV.map(([k,href,label]) => <Link key={k} href={href} className={key===k?'on':undefined}>{label}</Link>)}
      </nav>
      <button className="menu-btn" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(o => !o)}>Menu</button>
      <Link className="btn btn-w btn-sm" href="/pledge">Pledge <Arrow/></Link>
    </div>
  </header>;
}
