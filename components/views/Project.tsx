'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { D, DEPT, PROJ, STATUS, n, pct, fmon, bg, type Project as P } from '@/lib/data';
import { useGiving, WALL0 } from '../store';
import { Amt, Arrow, Bar, Chip, Crumbs, LedgerRow, Plaque, Steps } from '../ui';

const STAGES: [string, string][] = [['Proposed','Department submits need'],['Reviewed','Board checks scope and BOQ'],['Live','Open for pledges'],['Funded','Target reached'],['Built','Procured and installed'],['Handed over','In use by students']];

function BoqTable({ p, onToast }: { p: P; onToast: (msg: string) => void }){
  const cats = [...new Set(p.boq.map(b => b.cat))];
  const copy = () => {
    const csv = ['Category,Item,Specification,Qty,Unit rate (LKR),Amount (LKR)']
      .concat(p.boq.map(b => [b.cat, b.item, b.spec, b.qty, b.unit, b.qty*b.unit].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')))
      .join('\n');
    const fail = () => onToast('Copy is not available here');
    if (!navigator.clipboard) return fail();
    navigator.clipboard.writeText(csv).then(() => onToast('BOQ copied as CSV'), fail);
  };
  return <div className="boq" id="boq-table">
    <div className="boq-h"><h3>Bill of quantities</h3><div className="meta"><span>{p.code} · Rev. 2 · prices incl. VAT</span><button className="link" onClick={copy}>Copy as CSV</button></div></div>
    <div className="tw"><table>
      <thead><tr><th>Item</th><th className="n">Qty</th><th className="n">Unit rate (LKR)</th><th className="n">Amount (LKR)</th></tr></thead>
      <tbody>{cats.map((c, ci) => {
        const items = p.boq.filter(b => b.cat===c);
        return <Fragment key={c}>
          <tr className="grp"><td colSpan={4}>{String.fromCharCode(65 + ci)} · {c}</td></tr>
          {items.map((b, i) => <tr key={i}><td>{b.item}<small>{b.spec}</small></td><td className="n">{b.qty===1 && b.cat!=='Equipment' ? '1 lot' : b.qty}</td><td className="n">{n(b.unit)}</td><td className="n">{n(b.qty*b.unit)}</td></tr>)}
          {items.length > 1 && <tr className="subt"><td colSpan={3}>Subtotal · {c}</td><td className="n">{n(items.reduce((a,b) => a + b.qty*b.unit, 0))}</td></tr>}
        </Fragment>;
      })}</tbody>
      <tfoot><tr><td colSpan={3}>Project total</td><td className="n">{n(p.target)}</td></tr></tfoot>
    </table></div>
  </div>;
}

export default function Project({ id }: { id: string }){
  const g = useGiving(), router = useRouter();
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);
  const p = PROJ[id], d = DEPT[p.dept], r = g.raisedOf(p), pc = pct(r, p.target);
  const pl = g.all.filter(x => x.project===id);
  const stageIdx = p.status==='completed' ? 5 : p.status==='in_progress' ? 4 : 2;
  const L = p.legacy;
  return <>
    <section className="ph"><div className="in"><Crumbs items={[['Campaign','/'],['Departments','/departments'],[d.code,`/departments/${d.id}`],[p.code]]}/></div></section>
    <section className="sec tight"><div className="in">
      <article className="proj">
        <div className="render" style={bg(p.dept)}><span className="st"><Chip p={p}/></span><span className="cap">Department photo · EXMO 2023</span></div>
        <div className="pbody">
          <div className="lbl brick">{d.name} · {p.code}</div>
          <h1>{p.title}</h1><p>{p.summary}</p>
          <div className="facts"><div><strong className="num">{n(p.sqft)} sq ft</strong><span>floor area</span></div><div><strong className="num">{p.seats}</strong><span>seats</span></div><div><strong className="num">{n(p.students)}+</strong><span>students a year</span></div></div>
          <div className="prog"><Amt v={r} cls="sm"/><Bar pc={pc} done={p.status!=='active'}/><div className="row"><span><b>{pc}%</b> of LKR {n(p.target)}</span><span>{g.giversOf(id)} givers</span></div></div>
          {p.status==='active'
            ? <div className="cta"><Link className="btn btn-p" href={`/pledge/${id}`}>Pledge to this project <Arrow/></Link><button className="btn btn-o" onClick={() => document.getElementById('boq-table')?.scrollIntoView({ behavior:'smooth' })}>See the BOQ</button></div>
            : p.status==='in_progress'
              ? <div className="notice">Fully funded. {p.progress_note}. Expected handover {p.expected}.</div>
              : <div className="notice" style={{ background:'#f3ead6', borderColor:'#e3d3b5', color:'#5a4210' }}>Completed and handed over in {fmon(L!.handed_over)}. Thank you to every giver.</div>}
        </div>
      </article>
      <div style={{ marginTop:40 }}><div className="lbl" style={{ marginBottom:6 }}>Where the project stands</div><Steps stages={STAGES} upTo={stageIdx}/></div>
    </div></section>

    {L && <section className="sec alt"><div className="in">
      <div className="sh"><div><div className="lbl gold">Legacy</div><h2>Built, handed over and in use</h2><p>Handed over to the Department of {d.name} in {fmon(L.handed_over)}. Final cost came in at LKR {n(L.final_cost)}, which is {(100 - L.final_cost/p.target*100).toFixed(1)}% under the published BOQ.</p></div></div>
      <div className="two">
        <div style={{ display:'grid', gap:22, alignContent:'start' }}>
          <div className="ba"><figure><div className="im before" style={bg(p.dept)}></div><figcaption>Before</figcaption></figure><figure><div className="im" style={bg(p.dept)}></div><figcaption>After · {fmon(L.handed_over)}</figcaption></figure></div>
          <div className="impact"><div><strong className="num">{n(L.students_served)}</strong><span>students a year</span></div><div><strong className="num">{L.courses}</strong><span>courses using it</span></div><div><strong className="num">{L.papers}</strong><span>research papers</span></div><div><strong className="num">{L.industry_projects}</strong><span>industry projects</span></div><div><strong className="num">{L.startups}</strong><span>student startups</span></div></div>
        </div>
        <Plaque p={p}/>
      </div>
    </div></section>}

    <section className={`sec ${L?'':'alt'}`}><div className="in"><BoqTable p={p} onToast={setToast}/></div></section>
    <section className={`sec ${L?'alt':''}`}><div className="in two">
      <div className="ledger"><div className="ledger-h"><span className="lbl">Givers to this project</span><span className="count">{g.giversOf(id)} givers · LKR {n(r)}</span></div>
        <ul>{pl.length ? pl.slice(0,12).map((x,i) => <LedgerRow key={i} x={x} withProject={false}/>) : <li className="empty">Be the first to give.</li>}</ul>
        {pl.length > 12 && <div className="more-row"><button className="btn btn-o" onClick={() => { g.setWall({ ...WALL0, project:id }); router.push('/wall'); }}>See all {pl.length} gifts <Arrow/></button></div>}</div>
      <div className="boards"><div className="board-list"><h3>What this project enables</h3><ol>
        <li><span>{p.summary.split('.')[0]}<small>{d.short}</small></span></li>
        <li><span>About {n(p.students)} students a year<small>Coursework, projects and research</small></span></li>
        <li><span>{p.seats} seats in {n(p.sqft)} sq ft<small>Designed for hands-on work</small></span></li></ol></div>
        <div className="board-list"><h3>More in {d.short}</h3><ol>{D.projects.filter(x => x.dept===p.dept && x.id!==id).map(x =>
          <li key={x.id}><span><Link href={`/projects/${x.id}`} style={{ textDecoration:'none' }}>{x.title}</Link><small>{STATUS[x.status][0]}</small></span><b>{pct(g.raisedOf(x), x.target)}%</b></li>)}</ol></div></div>
    </div></section>
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}
