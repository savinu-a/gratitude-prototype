'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { D, DEPT, PROJ, TIERS, n, pct, bg } from '@/lib/data';
import { useGiving, type PledgeState } from '../store';
import { Amt, Arrow, Bar, Crumbs } from '../ui';

const STEP_NAMES = ['Choose','Amount','Your details','Confirm'];

export default function Pledge({ initialProject }: { initialProject?: string }){
  const g = useGiving(), P = g.pledge, set = g.setPledge;

  // Arriving on the page starts a fresh pledge (keeping typed details); a project link preselects it.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (initialProject) set({ step:1, project:initialProject, error:'' });
    else if (P.step===5) set({ step:1, error:'' });
    setReady(true);
  }, [initialProject]);
  const step = ready ? P.step : initialProject || P.step===5 ? 1 : P.step;
  const projectId = ready ? P.project : initialProject ?? P.project;

  const proj = projectId==='general' ? null : PROJ[projectId];
  const amount = P.custom ? Number(P.custom) : P.amount;

  const go = (to: number) => {
    if (to > step){
      if (step===2 && (!amount || amount < 1000)) return set({ error:'Enter an amount of at least LKR 1,000.' });
      if (step===3 && !P.name.trim()) return set({ error:'Enter your full name so we can issue your receipt.' });
      if (step===3 && P.email && !/^\S+@\S+\.\S+$/.test(P.email.trim())) return set({ error:'Check the email address. It should look like name@example.com.' });
    }
    set({ step:to, error:'' });
    window.scrollTo(0, 0);
  };

  const confirm = () => {
    const meta = [P.dept ? DEPT[P.dept].code : '', P.batch ? `’${String(P.batch).slice(2)}` : ''].filter(Boolean).join(' ');
    const display = P.display==='anon' ? 'A grateful graduate' : P.name.trim();
    g.addPledge({ donor:'you-' + g.demo.length, project:projectId, amount, date:'2028-12-12',
      demoDonor:{ id:'you-' + g.demo.length, type:'you', name:display + ' (you)', display, meta:(meta ? meta + ' · ' : '') + 'Your pledge (demo)', batch:P.batch ? Number(P.batch) : null, dept:P.dept || null } });
    set({ step:5 });
    window.scrollTo(0, 0);
  };

  if (step===5 && g.demo[0]){
    const last = g.demo[0], lp = last.project==='general' ? null : PROJ[last.project];
    return <>
      <section className="ph"><div className="in"><Crumbs items={[['Campaign','/'],['Pledge']]}/><h1>Thank you</h1><p>Your pledge has been added to the Wall of Gratitude for this visit.</p></div></section>
      <section className="sec"><div className="in" style={{ maxWidth:860, display:'grid', gap:28 }}>
        <div className="cert"><span className="lbl">University of Moratuwa · Gratitude</span><h2>Certificate of Gratitude</h2><p>presented to</p><div className="name">{last.demoDonor!.display}</div>
          <p>in recognition of a gift of LKR {n(last.amount)} towards {lp ? `the ${lp.title}, Department of ${DEPT[lp.dept].name}` : 'the Gratitude general fund'}.</p>
          <div className="sig"><div>Chairman, Board of Trustees</div><div>Treasurer</div></div><p style={{ fontSize:12 }}>Specimen certificate · prototype</p></div>
        <div className="cta" style={{ justifyContent:'center' }}>
          <Link className="btn btn-p" href="/wall">See your name on the wall <Arrow/></Link>
          {lp && <Link className="btn btn-o" href={`/projects/${lp.id}`}>Back to the project</Link>}
          <button className="btn btn-o" onClick={() => set({ step:1, custom:'', error:'' })}>Make another pledge</button>
        </div>
      </div></section>
    </>;
  }

  const err = P.error && <div className="err">{P.error}</div>;
  let body;
  if (step===1){
    const opts = D.projects.filter(p => p.status==='active');
    body = <div className="form">
      <label htmlFor="pp">Project<select id="pp" value={projectId} onChange={e => set({ project:e.target.value })}>
        <option value="general">General fund · the board directs it where it is needed most</option>
        {D.depts.map(d => <optgroup key={d.id} label={d.name}>{opts.filter(p => p.dept===d.id).map(p =>
          <option key={p.id} value={p.id}>{p.code} · {p.title} ({pct(g.raisedOf(p), p.target)}% funded)</option>)}</optgroup>)}
      </select></label>
      {proj && <div className="card" style={{ flexDirection:'row' }}>
        <div className="img" style={{ ...bg(proj.dept), width:180, aspectRatio:'auto', flex:'none' }}></div>
        <div className="bd"><span className="lbl brick">{proj.code}</span><h3 style={{ fontSize:19 }}>{proj.title}</h3><Bar pc={pct(g.raisedOf(proj), proj.target)}/><p>LKR {n(proj.target - g.raisedOf(proj))} still needed</p></div>
      </div>}
      <div className="cta"><button className="btn btn-p" onClick={() => go(2)}>Continue <Arrow/></button></div>
    </div>;
  } else if (step===2){
    body = <div className="form">
      <div className="tiers pick">{TIERS.map(t =>
        <button key={t[0]} className="tier" aria-pressed={!P.custom && P.amount===t[1]} onClick={() => set({ amount:t[1], custom:'', error:'' })}><div className="lbl">{t[0]}</div><Amt v={t[1]} cls="xs"/><p>{t[2]}</p></button>)}</div>
      <label htmlFor="pc">Or enter another amount (LKR)<input id="pc" type="number" min="1000" step="1000" inputMode="numeric" placeholder="e.g. 75000" value={P.custom} onChange={e => set({ custom:e.target.value })}/></label>
      {err}
      <div className="cta"><button className="btn btn-o" onClick={() => go(1)}>Back</button><button className="btn btn-p" onClick={() => go(3)}>Continue <Arrow/></button></div>
    </div>;
  } else if (step===3){
    body = <div className="form">
      <label htmlFor="fn">Full name<input id="fn" autoComplete="name" value={P.name} onChange={e => set({ name:e.target.value })} placeholder="As it should appear on your receipt"/></label>
      <div><div className="lbl" style={{ marginBottom:8 }}>On the Wall of Gratitude</div><div className="radio">
        {([['name','Show my name'],['anon','Show me as a grateful graduate']] as [PledgeState['display'], string][]).map(([v,l]) =>
          <label key={v}><input type="radio" name="disp" value={v} checked={P.display===v} onChange={() => set({ display:v })}/> {l}</label>)}
      </div></div>
      <div className="grid2">
        <label htmlFor="fb">Graduation year<input id="fb" type="number" min="1960" max="2028" placeholder="e.g. 2009" value={P.batch} onChange={e => set({ batch:e.target.value })}/></label>
        <label htmlFor="fd">Department<select id="fd" value={P.dept} onChange={e => set({ dept:e.target.value })}><option value="">Not an alumnus / prefer not to say</option>{D.depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      </div>
      <label htmlFor="fe">Email for your receipt<input id="fe" type="email" autoComplete="email" value={P.email} onChange={e => set({ email:e.target.value })} placeholder="you@example.com"/><span className="hint">In this prototype nothing is sent or stored.</span></label>
      {err}
      <div className="cta"><button className="btn btn-o" onClick={() => go(2)}>Back</button><button className="btn btn-p" onClick={() => go(4)}>Review pledge <Arrow/></button></div>
    </div>;
  } else {
    body = <div className="form">
      <div className="summary" style={{ position:'static' }}>
        <div className="row"><span>Project</span><b>{proj ? proj.title : 'General fund'}</b></div>
        <div className="row"><span>Amount</span><b className="num">LKR {n(amount)}</b></div>
        <div className="row"><span>Listed as</span><b>{P.display==='anon' ? 'A grateful graduate' : P.name}</b></div>
        <div className="row"><span>Receipt to</span><b>{P.email || '—'}</b></div>
      </div>
      <div className="notice">This is a prototype. No payment is taken and nothing leaves your browser. Your pledge appears on the wall for this visit only.</div>
      <div className="cta"><button className="btn btn-o" onClick={() => go(3)}>Back</button><button className="btn btn-p" onClick={confirm}>Confirm pledge <Arrow/></button></div>
    </div>;
  }

  const tier = TIERS.slice().reverse().find(t => amount >= t[1]);
  return <>
    <section className="ph"><div className="in"><Crumbs items={[['Campaign','/'],['Pledge']]}/><h1>Make a pledge</h1><p>Choose a project, choose an amount and tell us how you&apos;d like to be remembered.</p></div></section>
    <section className="sec tight"><div className="in pledge">
      <div>
        <div className="stepper">{STEP_NAMES.map((s,i) => <span key={s} className={i+1===step ? 'on' : i+1<step ? 'done' : undefined}>{i+1}. {s}</span>)}</div>
        {body}
      </div>
      <aside className="summary"><h3>Your pledge</h3>
        <div className="row"><span>Project</span><b>{proj ? proj.code : 'General fund'}</b></div>
        <div className="row"><span>Amount</span><b className="num">LKR {n(amount || 0)}</b></div>
        <div className="row"><span>Tier</span><b>{tier ? tier[0] : '—'}</b></div>
        <p className="muted" style={{ margin:0, fontSize:13 }}>Every giver is named on the Wall of Gratitude. Gifts of LKR 250,000 or more are also named on the project plaque.</p>
        <div className="notice">Prototype: no payment is taken.</div>
      </aside>
    </div></section>
  </>;
}
