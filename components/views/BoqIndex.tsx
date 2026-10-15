'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { D, DEPT, n, pct, type Project } from '@/lib/data';
import { useGiving } from '../store';
import { Crumbs, Pill } from '../ui';

type SortKey = 'dept' | 'title' | 'status' | 'target' | 'raised' | 'pct';

export default function BoqIndex(){
  const g = useGiving(), router = useRouter();
  const [sort, setSort] = useState<SortKey>('dept');
  const [dir, setDir] = useState(1);
  const [dept, setDept] = useState('all');

  const key: Record<SortKey, (p: Project) => string | number> = { dept:p => p.code, title:p => p.title, status:p => p.status, target:p => p.target, raised:p => g.raisedOf(p), pct:p => g.raisedOf(p)/p.target };
  const list = D.projects.filter(p => dept==='all' || p.dept===dept).sort((a,b) => { const x = key[sort](a), y = key[sort](b); return (x>y ? 1 : x<y ? -1 : 0) * dir; });
  const tot = list.reduce((a,p) => a + p.target, 0), rs = list.reduce((a,p) => a + g.raisedOf(p), 0);

  const sortBy = (s: SortKey) => {
    setDir(sort===s ? -dir : (s==='target' || s==='raised' || s==='pct' ? -1 : 1));
    setSort(s);
  };
  const Th = ({ id, label, cls }: { id: SortKey; label: string; cls?: string }) =>
    <th className={cls}><button onClick={() => sortBy(id)} aria-label={`Sort by ${label}`}>{label}{sort===id && (dir>0 ? ' ↑' : ' ↓')}</button></th>;

  return <>
    <section className="ph"><div className="in">
      <Crumbs items={[['Campaign','/'],['BOQ index']]}/>
      <h1>Bill of quantities index</h1><p>Every project&apos;s cost, line by line. Select a project to see its full BOQ, or sort by any column.</p>
      <div className="statrow"><div><strong className="num">{D.projects.length}</strong><span>projects</span></div><div><strong className="num">{n(D.projects.reduce((a,p) => a + p.boq.length, 0))}</strong><span>line items</span></div><div><strong className="num">LKR {n(D.meta.target)}</strong><span>total</span></div></div>
    </div></section>
    <section className="sec tight"><div className="in">
      <div className="controls" style={{ gridTemplateColumns:'repeat(4,1fr)' }}><label htmlFor="bd">Department<select id="bd" value={dept} onChange={e => setDept(e.target.value)}><option value="all">All departments</option>{D.depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label></div>
      <div className="boq" style={{ marginTop:16 }}><div className="tw"><table>
        <thead><tr><Th id="dept" label="Code"/><Th id="title" label="Project"/><Th id="status" label="Status"/><th className="n">Items</th><Th id="target" label="BOQ total (LKR)" cls="n"/><Th id="raised" label="Pledged (LKR)" cls="n"/><Th id="pct" label="Funded" cls="n"/></tr></thead>
        <tbody>{list.map(p => {
          const go = () => router.push(`/projects/${p.id}`);
          return <tr key={p.id} className="click" tabIndex={0} onClick={go} onKeyDown={e => { if (e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); } }}>
            <td className="num">{p.code}</td><td>{p.title}<small>{DEPT[p.dept].name}</small></td><td><Pill p={p}/></td><td className="n">{p.boq.length}</td><td className="n">{n(p.target)}</td><td className="n">{n(g.raisedOf(p))}</td><td className="n">{pct(g.raisedOf(p), p.target)}%</td>
          </tr>;
        })}</tbody>
        <tfoot><tr><td colSpan={4}>{list.length} projects</td><td className="n">{n(tot)}</td><td className="n">{n(rs)}</td><td className="n">{pct(rs, tot)}%</td></tr></tfoot>
      </table></div></div>
    </div></section>
  </>;
}
