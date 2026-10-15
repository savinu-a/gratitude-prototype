'use client';
import Link from 'next/link';
import { D, DEPT, n, M, fmon, bg } from '@/lib/data';
import { useGiving } from '../store';
import { Crumbs, ProjCard } from '../ui';

export default function Legacy(){
  const g = useGiving();
  const done = D.projects.filter(p => p.status==='completed').sort((a,b) => b.legacy!.handed_over.localeCompare(a.legacy!.handed_over));
  const doneIds = new Set(done.map(p => p.id));
  const invested = done.reduce((a,p) => a + p.legacy!.final_cost, 0);
  const students = done.reduce((a,p) => a + p.legacy!.students_served, 0);
  const givers = new Set(g.all.filter(x => doneIds.has(x.project)).map(x => x.donor)).size;
  const building = D.projects.filter(p => p.status==='in_progress');
  return <>
    <section className="ph"><div className="in">
      <Crumbs items={[['Campaign','/'],['Legacy']]}/>
      <h1>Legacy</h1><p>Every facility that givers have built, with its final cost, its impact and the names of the people who made it possible. This record stays, campaign after campaign.</p>
    </div></section>
    <section className="sec tight"><div className="in">
      <div className="counters"><div><strong className="num">{done.length}</strong><span>facilities handed over</span></div><div><strong className="num">LKR {M(invested)}</strong><span>invested, at final cost</span></div><div><strong className="num">{n(students)}</strong><span>students served each year</span></div><div><strong className="num">{n(givers)}</strong><span>givers named on plaques</span></div></div>
    </div></section>
    <section className="sec alt"><div className="in">
      <div className="sh"><div><div className="lbl gold">EXMO 2027 campaign</div><h2>Completed projects</h2></div></div>
      <div className="lgrid">{done.map(p => { const L = p.legacy!; return <Link key={p.id} className="lcard" href={`/projects/${p.id}`}>
        <div className="img" style={bg(p.dept)}><span className="chip done">Handed over {fmon(L.handed_over)}</span></div>
        <div className="bd">
          <span className="lbl brick">{DEPT[p.dept].short} · {p.code}</span><h3>{p.title}</h3>
          <q>Made possible by {g.giversOf(p.id)} alumni and partners.</q>
          <div className="row"><span>Final cost LKR {M(L.final_cost)}</span><span>BOQ {M(p.target)}</span></div>
          <div className="row"><span>{n(L.students_served)} students a year</span><span>{L.papers} papers</span></div>
        </div></Link>; })}</div>
    </div></section>
    <section className="sec"><div className="in">
      <div className="sh"><div><div className="lbl gold">Coming next</div><h2>Funded and being built</h2></div></div>
      <div className="pgrid">{building.map(p => <ProjCard key={p.id} p={p}/>)}</div>
    </div></section>
  </>;
}
