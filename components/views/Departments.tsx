'use client';
import Link from 'next/link';
import { D, M, pct, bg } from '@/lib/data';
import { useGiving } from '../store';
import { Bar, Crumbs } from '../ui';

export default function Departments(){
  const g = useGiving();
  return <>
    <section className="ph"><div className="in">
      <Crumbs items={[['Campaign','/'],['Departments']]}/>
      <h1>Departments</h1><p>Each department sets its own priorities. The board reviews every project and its bill of quantities before it goes live.</p>
      <div className="statrow"><div><strong className="num">10</strong><span>departments</span></div><div><strong className="num">{D.projects.length}</strong><span>projects</span></div><div><strong className="num">LKR {M(D.meta.target)}</strong><span>total cost</span></div><div><strong className="num">{pct(g.totalRaised, D.meta.target)}%</strong><span>pledged</span></div></div>
    </div></section>
    <section className="sec"><div className="in"><div className="dgrid">{D.depts.map(d => {
      const pc = pct(g.deptRaised(d.id), d.target), ps = D.projects.filter(p => p.dept===d.id);
      return <Link key={d.id} className="dcard" href={`/departments/${d.id}`}><div className="ph-img" style={bg(d.id)}></div><div className="bd">
        <span className="lbl brick">{d.code} · {ps.length} projects</span><h3>{d.name}</h3><p>{d.blurb}</p>
        <Bar pc={pc}/>
        <div className="row"><span><b>{pc}%</b> of LKR {M(d.target)}</span><span>{ps.filter(p => p.status==='completed').length} completed</span></div>
      </div></Link>;
    })}</div></div></section>
  </>;
}
