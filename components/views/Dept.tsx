'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { D, DEPT, PROJ, n, M, pct, bg, type Pledge } from '@/lib/data';
import { useGiving, WALL0 } from '../store';
import { Arrow, Crumbs, LedgerRow, ProjCard } from '../ui';

export default function Dept({ id }: { id: string }){
  const g = useGiving(), router = useRouter();
  const d = DEPT[id];
  const ps = D.projects.filter(p => p.dept===id);
  const r = g.deptRaised(id);
  const pl = g.all.filter(x => x.project!=='general' && PROJ[x.project]?.dept===id);
  const givers = new Set(pl.map(x => x.donor)).size;
  const byDonor: Record<string, Pledge> = {};
  for (const x of pl) (byDonor[x.donor] ||= { ...x, amount:0 }).amount += x.amount;
  const top = Object.values(byDonor).sort((a,b) => b.amount-a.amount).slice(0,8);
  const active = ps.filter(p => p.status!=='completed'), done = ps.filter(p => p.status==='completed');
  return <>
    <section className="photo-hero" style={bg(id)}><div className="in">
      <Crumbs items={[['Campaign','/'],['Departments','/departments'],[d.code]]}/>
      <div className="lbl" style={{ color:'var(--peach)' }}>Department of</div>
      <h1>{d.name}</h1><p>{d.blurb}</p>
      <div className="statrow"><div><strong className="num">LKR {M(d.target)}</strong><span>needed for {ps.length} projects</span></div><div><strong className="num">{pct(r, d.target)}%</strong><span>pledged</span></div><div><strong className="num">{n(givers)}</strong><span>givers</span></div><div><strong className="num">{n(d.students)}</strong><span>students</span></div></div>
    </div><span className="photo-cap">Photo: EXMO 2023</span></section>

    <section className="sec"><div className="in prose">
      <div><div className="lbl gold">The gap</div><h3>Why this department needs support</h3><p>{d.problem}</p></div>
      <div><div className="lbl gold">The vision</div><h3>What your gift makes possible</h3><p>{d.vision}</p></div>
    </div></section>

    <section className="sec alt"><div className="in">
      <div className="sh"><div><div className="lbl gold">{active.length} open projects</div><h2>Projects in {d.short}</h2></div><Link className="btn btn-p" href="/pledge">Pledge to {d.code} <Arrow/></Link></div>
      <div className="pgrid">{active.map(p => <ProjCard key={p.id} p={p}/>)}</div>
      {done.length > 0 && <>
        <div className="sh" style={{ margin:'56px 0 24px' }}><div><div className="lbl gold">Legacy</div><h2 style={{ fontSize:30 }}>Already built by givers</h2></div><Link className="link" href="/legacy">All completed projects →</Link></div>
        <div className="pgrid">{done.map(p => <ProjCard key={p.id} p={p}/>)}</div>
      </>}
    </div></section>

    <section className="sec"><div className="in two">
      <div className="ledger"><div className="ledger-h"><span className="lbl">Top givers to {d.code}</span><span className="count">{n(givers)} givers in total</span></div>
        <ul>{top.map(x => <LedgerRow key={x.donor} x={x} withProject={false}/>)}</ul>
        <div className="more-row"><button className="btn btn-o" onClick={() => { g.setWall({ ...WALL0, dept:id }); router.push('/wall'); }}>See every gift to {d.code} <Arrow/></button></div></div>
      <div className="boards"><div className="board-list"><h3>Value for students</h3><ol>
        <li><span>Hands-on time with industry-grade equipment<small>Not only simulation</small></span></li>
        <li><span>Final-year and postgraduate research capacity<small>Shared across departments</small></span></li>
        <li><span>Industry projects and internships<small>Sponsored work on campus</small></span></li></ol></div>
        <div className="board-list"><h3>Value for industry</h3><ol>
        <li><span>Graduates ready from day one<small>Trained on current tools</small></span></li>
        <li><span>Testing and R&amp;D on campus<small>Local, not abroad</small></span></li>
        <li><span>Recognition on the project plaque<small>For founding partners</small></span></li></ol></div></div>
    </div></section>
  </>;
}
