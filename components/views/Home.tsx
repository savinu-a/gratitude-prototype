'use client';
import Link from 'next/link';
import { D, DEPT, PROJ, n, pct, bg } from '@/lib/data';
import { useGiving } from '../store';
import { Amt, Arrow, Bar, Board, Chip, DeptTile, Gov, LedgerRow, Plaque, ProjCard, Tiers } from '../ui';

export default function Home(){
  const g = useGiving();
  const feat = PROJ['cse-01'], fr = g.raisedOf(feat), fp = pct(fr, feat.target);
  const completed = D.projects.filter(p => p.status==='completed');
  const latestDone = completed.slice().sort((a,b) => b.legacy!.handed_over.localeCompare(a.legacy!.handed_over))[0];
  const near = D.projects.filter(p => p.status==='active' && p.id!=='cse-01').sort((a,b) => g.raisedOf(b)/b.target - g.raisedOf(a)/a.target).slice(0,3);
  const tr = g.totalRaised;
  return <>
    <section className="hero"><div className="in">
      <div>
        <div className="lbl brick">{D.meta.campaign}</div>
        <h1>Moratuwa built us. <em>We build it forward.</em></h1>
        <p>{D.projects.length} laboratories, studios and testbeds across ten engineering departments. Each one is costed line by line, and each gift is recorded by name.</p>
        <div className="cta"><Link className="btn btn-p" href="/pledge">Pledge to a project <Arrow/></Link><Link className="btn btn-o" href="/boq">See every BOQ</Link></div>
      </div>
      <div className="figs">
        <div className="fig"><div className="lbl">Total cost for all {D.projects.length} projects</div><Amt v={D.meta.target}/><div className="note">Interiors, equipment, software, networking and three years of maintenance</div></div>
        <div className="fig"><div className="lbl">Pledged so far</div><Amt v={tr} cls="sm"/><Bar pc={pct(tr, D.meta.target)}/><div className="note">Made possible by {n(g.giverCount)} givers · {completed.length} projects completed</div></div>
        <Link className="btn btn-p" href="/pledge">Pledge now <Arrow/></Link>
      </div>
    </div></section>

    <section className="sec"><div className="in">
      <div className="sh"><div><div className="lbl gold">Why it matters</div><h2>Learning is moving faster than our laboratories</h2></div></div>
      <div className="pillars">
        <div><div className="lbl brick">Transform</div><h3>Modern facilities that stay</h3><p>Labs, equipment and studios remain in service for every batch that follows, long after the exhibition closes.</p></div>
        <div><div className="lbl brick">Account</div><h3>Every rupee itemised</h3><p>Each project publishes its bill of quantities, final cost and audit trail. Donors see exactly what their pledge bought.</p></div>
        <div><div className="lbl brick">Remember</div><h3>Givers named for good</h3><p>Completed projects carry a permanent plaque, and every giver stays on the Wall of Gratitude.</p></div>
      </div>
    </div></section>

    <section className="sec alt"><div className="in">
      <div className="sh"><div><div className="lbl gold">Faculty of Engineering</div><h2>Ten departments, {D.projects.length} projects</h2></div><Link className="link" href="/departments">All departments →</Link></div>
      <div className="depts">{D.depts.map(d => <DeptTile key={d.id} d={d}/>)}</div>
    </div></section>

    <section className="sec"><div className="in">
      <div className="sh"><div><div className="lbl gold">Featured project</div><h2>From line item to laboratory</h2><p>Every project page shows the room, the people it serves, the full bill of quantities and who has given.</p></div></div>
      <article className="proj">
        <div className="render" style={bg(feat.dept)}><span className="st"><Chip p={feat}/></span><span className="cap">{DEPT[feat.dept].name}</span></div>
        <div className="pbody">
          <div className="lbl brick">{DEPT[feat.dept].name} · {feat.code}</div>
          <h3>{feat.title}</h3><p>{feat.summary}</p>
          <div className="facts"><div><strong className="num">{n(feat.sqft)} sq ft</strong><span>floor area</span></div><div><strong className="num">{feat.seats}</strong><span>seats</span></div><div><strong className="num">{n(feat.students)}+</strong><span>students a year</span></div></div>
          <div className="prog"><Amt v={fr} cls="sm"/><Bar pc={fp}/><div className="row"><span><b>{fp}%</b> of LKR {n(feat.target)}</span><span>{g.giversOf(feat.id)} givers</span></div></div>
          <div className="cta"><Link className="btn btn-p" href={`/pledge/${feat.id}`}>Pledge to this lab <Arrow/></Link><Link className="btn btn-o" href={`/projects/${feat.id}`}>View project and BOQ</Link></div>
        </div>
      </article>
      <div className="sh" style={{ margin:'56px 0 24px' }}><div><div className="lbl gold">Closest to their goal</div><h2 style={{ fontSize:30 }}>A final push gets these built</h2></div></div>
      <div className="pgrid">{near.map(p => <ProjCard key={p.id} p={p}/>)}</div>
    </div></section>

    <section className="sec alt"><div className="in two">
      <div className="ledger">
        <div className="ledger-h"><span className="lbl">Wall of Gratitude</span><span className="live"><i></i>Live</span><span className="count num">{n(g.giverCount)} givers</span></div>
        <ul>{g.all.slice(0,7).map((x,i) => <LedgerRow key={i} x={x}/>)}</ul>
        <div className="more-row"><Link className="btn btn-o" href="/wall">See the full wall <Arrow/></Link></div>
      </div>
      <Plaque p={latestDone}/>
    </div></section>

    <section className="sec"><div className="in">
      <div className="sh"><div><div className="lbl gold">Leadership</div><h2>The people behind Gratitude</h2><p>Engineers, academics, business leaders and professionals from the Moratuwa community, overseeing every pledge and every project.</p></div><Link className="link" href="/leadership">See the full team →</Link></div>
      <Board/>
      <Gov/>
    </div></section>

    <section className="sec alt" id="tiers"><div className="in">
      <div className="sh"><div><div className="lbl gold">Ways to give</div><h2>Every level is named on the wall</h2></div><Link className="btn btn-p" href="/pledge">Pledge now <Arrow/></Link></div>
      <Tiers/>
    </div></section>
  </>;
}
