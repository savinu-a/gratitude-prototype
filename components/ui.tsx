'use client';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { D, DEPT, PROJ, BOARD, TIERS, STATUS, n, M, pct, fdate, fmon, bg, donorOf, whoMeta, type Dept, type Pledge, type Project } from '@/lib/data';
import { useGiving } from './store';

export const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
export const Amt = ({ v, cls='' }: { v: number; cls?: string }) => <div className={`amt ${cls} num`}><sup>LKR</sup><span>{n(v)}</span></div>;
export const Chip = ({ p }: { p: Project }) => <span className={`chip ${STATUS[p.status][1]}`}>{STATUS[p.status][0]}</span>;
export const Pill = ({ p }: { p: Project }) => <span className={`pill ${STATUS[p.status][1]}`}>{p.status==='active'?'Active':p.status==='in_progress'?'Being built':'Completed'}</span>;
export const Bar = ({ pc, done }: { pc: number; done?: boolean }) => <div className={`bar ${done?'done':''}`}><b style={{ width:`${pc}%` }}/></div>;

export function Crumbs({ items }: { items: [label: string, href?: string][] }){
  return <div className="crumbs">{items.map(([label, href], i) => <span key={i} style={{ display:'contents' }}>
    {i > 0 && <span>/</span>}
    {href ? <Link href={href}>{label}</Link> : <span>{label}</span>}
  </span>)}</div>;
}

const ProjLabel = ({ pid }: { pid: string }) => pid==='general' ? <>General fund</> : <Link href={`/projects/${pid}`}>{PROJ[pid].title}</Link>;

export function LedgerRow({ x, withProject=true }: { x: Pledge; withProject?: boolean }){
  const dn = donorOf(x);
  return <li className={dn.type==='you'?'you':undefined}>
    <span className="d">{fdate(x.date)}</span>
    <span className="who">{dn.name}<small>{whoMeta(dn)}{withProject && <> · <ProjLabel pid={x.project}/></>}</small></span>
    <span className="v"><sup>LKR</sup><span>{n(x.amount)}</span></span>
  </li>;
}

export function ProjCard({ p }: { p: Project }){
  const g = useGiving(), pc = pct(g.raisedOf(p), p.target);
  return <Link className="card" href={`/projects/${p.id}`}>
    <div className="img" style={bg(p.dept)}><Chip p={p}/></div>
    <div className="bd"><span className="lbl brick">{DEPT[p.dept].short} · {p.code}</span><h3>{p.title}</h3><p>{p.summary}</p></div>
    <div className="cfoot"><Bar pc={pc} done={p.status!=='active'}/>
      <div className="row"><span><b>{pc}%</b> of LKR {M(p.target)}</span><span>{g.giversOf(p.id)} givers</span></div></div>
  </Link>;
}

export function DeptTile({ d }: { d: Dept }){
  const g = useGiving(), pc = pct(g.deptRaised(d.id), d.target), np = D.projects.filter(p => p.dept===d.id).length;
  return <Link className="dept" href={`/departments/${d.id}`} style={bg(d.id)}>
    <strong>{d.short}</strong>
    <div className="p"><span>{np} projects</span><span className="num">{pc}%</span></div>
    <div className="mini"><b style={{ width:`${pc}%` }}/></div>
  </Link>;
}

export function Plaque({ p }: { p: Project }){
  const g = useGiving(), L = p.legacy!;
  return <aside className="plaque">
    <span className="lbl">Legacy · handed over {fmon(L.handed_over)}</span>
    <q>This facility exists through the gratitude of {g.giversOf(p.id)} alumni and partners of the University of Moratuwa.</q>
    <div className="by"><strong>{p.title}</strong><span>Department of {DEPT[p.dept].name}</span></div>
    <div className="stats">
      <div><strong className="num">{M(L.final_cost)}</strong><span>final cost, against a BOQ of {M(p.target)}</span></div>
      <div><strong className="num">{n(L.students_served)}</strong><span>students a year</span></div>
    </div>
  </aside>;
}

const TINTS = ['#f3d9c4','#d9dbe0','#ecd9b0','#ddd3e6'];
export const Person = ({ role, pos, i }: { role: string; pos: string; i: number }) => <div className="trustee">
  <span className="portrait" style={{ '--t':TINTS[i%4] } as CSSProperties}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="40" r="17" fill="#6f6a6c"/><path d="M14 100c2-22 17-34 36-34s34 12 36 34z" fill="#5d585a"/></svg>
  </span>
  <h3>Trustee name</h3>{role && <strong>{role}</strong>}<p>{pos}</p>
</div>;

export const Board = () => <>
  <h3 className="board-h">Board of Trustees</h3>
  <div className="board">{BOARD.map((b,i) => <Person key={i} role={b[0]} pos={b[1]} i={i}/>)}</div>
  <p className="board-note">Names and photos will be added once trustees are confirmed.</p>
</>;

export const Gov = () => <div className="gov">
  <div><strong>Dedicated fund account</strong><span>Used only for approved projects</span></div>
  <div><strong>Independent audit</strong><span>Annual audit by an external firm, published in full</span></div>
  <div><strong>Quarterly reports</strong><span>Pledges received, money spent and progress on every project</span></div>
  <div><strong>Receipt for every gift</strong><span>Issued by the treasurer, with a certificate of gratitude</span></div>
</div>;

export const Tiers = () => <div className="tiers">{TIERS.map((t,i) =>
  <div key={t[0]} className={`tier ${i===2?'pop':''}`}><div className="lbl">{t[0]}{i===2 && ' · most chosen'}</div><Amt v={t[1]} cls="xs"/><p>{t[2]}</p></div>)}
</div>;

export const Steps = ({ stages, upTo }: { stages: [string, string][]; upTo: number }) => <ol className="steps">{stages.map((s,i) =>
  <li key={s[0]} className={i<=upTo?'on':undefined}><strong>{s[0]}</strong><span>{s[1]}</span></li>)}
</ol>;
