'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { D, PROJ, n, M, donorOf } from '@/lib/data';
import { useGiving, type WallState } from '../store';
import { Arrow, Crumbs, LedgerRow } from '../ui';

const GIVER_TYPES: [string, string][] = [['all','All givers'],['individual','Alumni'],['batch','Batches'],['company','Companies'],['chapter','Alumni chapters'],['anonymous','Anonymous']];

export default function Wall(){
  const g = useGiving(), s = g.wall;
  const set = (patch: Partial<WallState>) => g.setWall({ ...patch, shown:40 });

  const list = useMemo(() => {
    const q = s.q.trim().toLowerCase();
    const out = g.all.filter(x => {
      const dn = donorOf(x);
      if (s.type!=='all' && !(s.type==='individual' ? (dn.type==='individual' || dn.type==='you') : dn.type===s.type)) return false;
      if (s.project!=='all' && x.project!==s.project) return false;
      if (s.dept!=='all' && (x.project==='general' || PROJ[x.project].dept!==s.dept)) return false;
      if (q && !(dn.name.toLowerCase().includes(q) || (x.project!=='general' && PROJ[x.project].title.toLowerCase().includes(q)) || String(dn.batch || '').includes(q))) return false;
      return true;
    });
    return s.sort==='big' ? out.slice().sort((a,b) => b.amount-a.amount) : out;
  }, [g.all, s.q, s.type, s.project, s.dept, s.sort]);

  const [topBatch, topOrg] = useMemo(() => {
    const byBatch: Record<string, number> = {}, byOrg: Record<string, { amt: number; type: string }> = {};
    for (const x of g.all){
      const dn = donorOf(x);
      if (dn.batch && dn.type!=='you') byBatch[dn.batch] = (byBatch[dn.batch] || 0) + x.amount;
      if (dn.type==='company' || dn.type==='chapter') (byOrg[dn.name] ||= { amt:0, type:dn.type }).amt += x.amount;
    }
    return [
      Object.entries(byBatch).sort((a,b) => b[1]-a[1]).slice(0,8),
      Object.entries(byOrg).sort((a,b) => b[1].amt-a[1].amt).slice(0,8),
    ] as const;
  }, [g.all]);

  const total = list.reduce((a,x) => a + x.amount, 0);
  return <>
    <section className="ph"><div className="in">
      <Crumbs items={[['Campaign','/'],['Wall of Gratitude']]}/>
      <h1>Wall of Gratitude</h1><p>Every gift, by name and amount, from the first pledge at EXMO 2027 onwards. Givers who asked to stay anonymous are listed as a grateful graduate.</p>
      <div className="statrow"><div><strong className="num">{n(g.giverCount)}</strong><span>givers</span></div><div><strong className="num">{n(g.all.length)}</strong><span>gifts</span></div><div><strong className="num">LKR {M(g.totalRaised)}</strong><span>pledged</span></div></div>
    </div></section>
    <section className="sec tight"><div className="in two">
      <div>
        <div className="controls" role="search">
          <label htmlFor="wq">Search<input id="wq" type="search" placeholder="Name, batch year or project" value={s.q} onChange={e => set({ q:e.target.value })}/></label>
          <label htmlFor="wt">Giver<select id="wt" value={s.type} onChange={e => set({ type:e.target.value })}>{GIVER_TYPES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <label htmlFor="wd">Department<select id="wd" value={s.dept} onChange={e => set({ dept:e.target.value })}><option value="all">All</option>{D.depts.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}</select></label>
          <label htmlFor="wp">Project<select id="wp" value={s.project} onChange={e => set({ project:e.target.value })}><option value="all">All</option><option value="general">General fund</option>{D.projects.map(p => <option key={p.id} value={p.id}>{p.code} · {p.title}</option>)}</select></label>
          <label htmlFor="ws">Sort<select id="ws" value={s.sort} onChange={e => set({ sort:e.target.value as WallState['sort'] })}><option value="new">Newest</option><option value="big">Largest</option></select></label>
        </div>
        <div className="ledger">
          <div className="ledger-h"><span className="lbl">{n(list.length)} gifts</span><span className="count">LKR {n(total)}</span></div>
          <ul>{list.length ? list.slice(0, s.shown).map((x,i) => <LedgerRow key={i} x={x}/>) : <li className="empty">No gifts match these filters.</li>}</ul>
          {list.length > s.shown && <div className="more-row"><button className="btn btn-o" onClick={() => g.setWall({ shown:s.shown + 40 })}>Show 40 more</button></div>}
        </div>
      </div>
      <div className="boards">
        <div className="board-list"><h3>Batches giving most</h3><ol>{topBatch.map(([y,v]) => <li key={y}><span>Batch of {y}<small>Alumni and batch gifts</small></span><b>{M(v)}</b></li>)}</ol></div>
        <div className="board-list"><h3>Partners and chapters</h3><ol>{topOrg.map(([nm,o]) => <li key={nm}><span>{nm}<small>{o.type==='company' ? 'Corporate partner' : 'Overseas alumni chapter'}</small></span><b>{M(o.amt)}</b></li>)}</ol></div>
        <Link className="btn btn-p" href="/pledge">Add your name <Arrow/></Link>
      </div>
    </div></section>
  </>;
}
