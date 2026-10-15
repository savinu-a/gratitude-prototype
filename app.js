(() => {
const D = window.GRATITUDE_DATA;
const $app = document.getElementById('app');
const DEPT = Object.fromEntries(D.depts.map(d => [d.id, d]));
const PROJ = Object.fromEntries(D.projects.map(p => [p.id, p]));
const DONOR = Object.fromEntries(D.donors.map(d => [d.id, d]));
const demo = { pledges: [] };          // pledges made in this session (demo only)
const wallState = { q:'', type:'all', dept:'all', project:'all', sort:'new', shown:40 };
const boqState = { sort:'dept', dir:1, dept:'all' };

// ---------- helpers
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n = v => Math.round(v).toLocaleString('en-US');
const M = v => v >= 1e9 ? (v/1e9).toFixed(2).replace(/\.?0+$/,'') + 'B' : v >= 1e6 ? (v/1e6).toFixed(1).replace(/\.0$/,'') + 'M' : v >= 1e3 ? Math.round(v/1e3) + 'K' : String(v);
const pct = (a,b) => b ? Math.min(100, Math.round(a/b*100)) : 0;
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fdate = iso => { const [y,m,d] = iso.split('-'); return `${d} ${MON[+m-1]} ${y}`; };
const fmon = iso => { const [y,m] = iso.split('-'); return `${MON[+m-1]} ${y}`; };
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const amt = (v, cls='') => `<div class="amt ${cls} num"><sup>LKR</sup><span>${n(v)}</span></div>`;
const img = d => `background-image:url('${DEPT[d].img}')`;
const STATUS = { active:['Active · seeking funds',''], in_progress:['Funded · being built','prog'], completed:['Completed','done'] };
const chip = p => `<span class="chip ${STATUS[p.status][1]}">${STATUS[p.status][0]}</span>`;
const pillS = p => `<span class="pill ${STATUS[p.status][1]}">${p.status==='active'?'Active':p.status==='in_progress'?'Being built':'Completed'}</span>`;

function allPledges(){ return demo.pledges.concat(D.pledges); }
function raisedOf(p){ return p.raised + demo.pledges.filter(x => x.project===p.id).reduce((a,x)=>a+x.amount,0); }
function giversOf(pid){ return new Set(allPledges().filter(x => x.project===pid).map(x => x.donor)).size; }
function deptRaised(id){ return D.projects.filter(p=>p.dept===id).reduce((a,p)=>a+raisedOf(p),0); }
function totalRaised(){ return D.meta.raised + demo.pledges.reduce((a,x)=>a+x.amount,0); }
function donorOf(x){ return x.demoDonor || DONOR[x.donor]; }
function whoMeta(dn){
  if (!dn) return '';
  if (dn.type==='batch') return `${DEPT[dn.dept]?.short || ''} · ${dn.members} alumni`;
  if (dn.type==='company') return 'Corporate partner';
  if (dn.type==='chapter') return 'Overseas alumni chapter';
  if (dn.type==='anonymous') return 'Anonymous';
  if (dn.type==='you') return dn.meta || 'Your pledge (demo)';
  return `${DEPT[dn.dept]?.code || ''} ’${String(dn.batch).slice(2)}`;
}
function projLabel(pid){ return pid==='general' ? 'General fund' : `<a href="#project-${pid}">${esc(PROJ[pid].title)}</a>`; }

const ledgerRow = (x, withProject=true) => {
  const dn = donorOf(x);
  return `<li class="${dn.type==='you'?'you':''}"><span class="d">${fdate(x.date)}</span><span class="who">${esc(dn.name)}<small>${esc(whoMeta(dn))}${withProject?` · ${projLabel(x.project)}`:''}</small></span><span class="v"><sup>LKR</sup><span>${n(x.amount)}</span></span></li>`;
};

const projCard = p => {
  const r = raisedOf(p), pc = pct(r, p.target);
  return `<a class="card" href="#project-${p.id}">
    <div class="img" style="${img(p.dept)}">${chip(p)}</div>
    <div class="bd"><span class="lbl brick">${esc(DEPT[p.dept].short)} · ${p.code}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></div>
    <div class="cfoot"><div class="bar ${p.status!=='active'?'done':''}"><b style="width:${pc}%"></b></div>
    <div class="row"><span><b>${pc}%</b> of LKR ${M(p.target)}</span><span>${giversOf(p.id)} givers</span></div></div></a>`;
};

const deptTile = d => {
  const pc = pct(deptRaised(d.id), d.target), np = D.projects.filter(p=>p.dept===d.id).length;
  return `<a class="dept" href="#dept-${d.id}" style="${img(d.id)}"><strong>${esc(d.short)}</strong><div class="p"><span>${np} projects</span><span class="num">${pc}%</span></div><div class="mini"><b style="width:${pc}%"></b></div></a>`;
};

function boqTable(p){
  const cats = [...new Set(p.boq.map(b=>b.cat))];
  let rows = '', letter = 65;
  for (const c of cats){
    const items = p.boq.filter(b=>b.cat===c);
    rows += `<tr class="grp"><td colspan="4">${String.fromCharCode(letter++)} · ${esc(c)}</td></tr>`;
    rows += items.map(b => `<tr><td>${esc(b.item)}<small>${esc(b.spec)}</small></td><td class="n">${b.qty===1 && b.cat!=='Equipment' ? '1 lot' : b.qty}</td><td class="n">${n(b.unit)}</td><td class="n">${n(b.qty*b.unit)}</td></tr>`).join('');
    if (items.length > 1) rows += `<tr class="subt"><td colspan="3">Subtotal · ${esc(c)}</td><td class="n">${n(items.reduce((a,b)=>a+b.qty*b.unit,0))}</td></tr>`;
  }
  return `<div class="boq" id="boq-table">
    <div class="boq-h"><h3>Bill of quantities</h3><div class="meta"><span>${p.code} · Rev. 2 · prices incl. VAT</span><button class="link" data-copy="${p.id}">Copy as CSV</button></div></div>
    <div class="tw"><table><thead><tr><th>Item</th><th class="n">Qty</th><th class="n">Unit rate (LKR)</th><th class="n">Amount (LKR)</th></tr></thead>
    <tbody>${rows}</tbody><tfoot><tr><td colspan="3">Project total</td><td class="n">${n(p.target)}</td></tr></tfoot></table></div></div>`;
}

function plaque(p){
  const L = p.legacy;
  return `<aside class="plaque">
    <span class="lbl">Legacy · handed over ${fmon(L.handed_over)}</span>
    <q>This facility exists through the gratitude of ${giversOf(p.id)} alumni and partners of the University of Moratuwa.</q>
    <div class="by"><strong>${esc(p.title)}</strong><span>Department of ${esc(DEPT[p.dept].name)}</span></div>
    <div class="stats"><div><strong class="num">${M(L.final_cost)}</strong><span>final cost, against a BOQ of ${M(p.target)}</span></div><div><strong class="num">${n(L.students_served)}</strong><span>students a year</span></div></div>
  </aside>`;
}

const SIL = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="40" r="17" fill="#6f6a6c"/><path d="M14 100c2-22 17-34 36-34s34 12 36 34z" fill="#5d585a"/></svg>';
const TINTS = ['#f3d9c4','#d9dbe0','#ecd9b0','#ddd3e6'];
const person = (role, pos, i) => `<div class="trustee"><span class="portrait" style="--t:${TINTS[i%4]}">${SIL}</span><h3>Trustee name</h3>${role?`<strong>${role}</strong>`:''}<p>${pos}</p></div>`;
const BOARD = [['Patron','Vice-Chancellor, University of Moratuwa'],['Chairman','Senior alumnus, engineering industry'],['','Dean, Faculty of Engineering, University of Moratuwa'],['','Bursar, University of Moratuwa'],['Treasurer','Chartered Accountant'],['Secretary','Attorney-at-Law'],['','Head of Department, Faculty of Engineering'],['','Engineering industry leader'],['','Banking and finance leader'],['','Overseas alumni representative'],['','Chartered Architect'],['','Young alumni representative']];
const boardHTML = () => `<h3 class="board-h">Board of Trustees</h3><div class="board">${BOARD.map((b,i)=>person(b[0],b[1],i)).join('')}</div><p class="board-note">Names and photos will be added once trustees are confirmed.</p>`;
const govHTML = () => `<div class="gov">
  <div><strong>Dedicated fund account</strong><span>Used only for approved projects</span></div>
  <div><strong>Independent audit</strong><span>Annual audit by an external firm, published in full</span></div>
  <div><strong>Quarterly reports</strong><span>Pledges received, money spent and progress on every project</span></div>
  <div><strong>Receipt for every gift</strong><span>Issued by the treasurer, with a certificate of gratitude</span></div></div>`;
const TIERS = [['Supporter',10000,'Name on the Wall of Gratitude'],['Builder',50000,'Plus a certificate and project updates'],['Patron',250000,'Plus your name on the project plaque'],['Founding Partner',1000000,'Plus an invitation to the opening'],['Legacy',5000000,'Name a room, bench or lab in perpetuity']];
const tiersHTML = () => `<div class="tiers">${TIERS.map((t,i)=>`<div class="tier ${i===2?'pop':''}"><div class="lbl">${t[0]}${i===2?' · most chosen':''}</div>${amt(t[1],'xs')}<p>${t[2]}</p></div>`).join('')}</div>`;

// ---------- views
function vHome(){
  const feat = PROJ['cse-01'], fr = raisedOf(feat), fp = pct(fr, feat.target);
  const completed = D.projects.filter(p=>p.status==='completed');
  const latestDone = completed.slice().sort((a,b)=>b.legacy.handed_over.localeCompare(a.legacy.handed_over))[0];
  const near = D.projects.filter(p=>p.status==='active' && p.id!=='cse-01').sort((a,b)=>raisedOf(b)/b.target - raisedOf(a)/a.target).slice(0,3);
  const tr = totalRaised();
  return `
  <section class="hero"><div class="in">
    <div>
      <div class="lbl brick">${esc(D.meta.campaign)}</div>
      <h1>Moratuwa built us. <em>We build it forward.</em></h1>
      <p>${D.projects.length} laboratories, studios and testbeds across ten engineering departments. Each one is costed line by line, and each gift is recorded by name.</p>
      <div class="cta"><a class="btn btn-p" href="#pledge">Pledge to a project ${arrow}</a><a class="btn btn-o" href="#boq">See every BOQ</a></div>
    </div>
    <div class="figs">
      <div class="fig"><div class="lbl">Total cost for all ${D.projects.length} projects</div>${amt(D.meta.target)}<div class="note">Interiors, equipment, software, networking and three years of maintenance</div></div>
      <div class="fig"><div class="lbl">Pledged so far</div>${amt(tr,'sm')}<div class="bar"><b style="width:${pct(tr,D.meta.target)}%"></b></div><div class="note">Made possible by ${n(D.meta.givers + demo.pledges.length)} givers · ${completed.length} projects completed</div></div>
      <a class="btn btn-p" href="#pledge">Pledge now ${arrow}</a>
    </div>
  </div></section>

  <section class="sec"><div class="in">
    <div class="sh"><div><div class="lbl gold">Why it matters</div><h2>Learning is moving faster than our laboratories</h2></div></div>
    <div class="pillars">
      <div><div class="lbl brick">Transform</div><h3>Modern facilities that stay</h3><p>Labs, equipment and studios remain in service for every batch that follows, long after the exhibition closes.</p></div>
      <div><div class="lbl brick">Account</div><h3>Every rupee itemised</h3><p>Each project publishes its bill of quantities, final cost and audit trail. Donors see exactly what their pledge bought.</p></div>
      <div><div class="lbl brick">Remember</div><h3>Givers named for good</h3><p>Completed projects carry a permanent plaque, and every giver stays on the Wall of Gratitude.</p></div>
    </div>
  </div></section>

  <section class="sec alt"><div class="in">
    <div class="sh"><div><div class="lbl gold">Faculty of Engineering</div><h2>Ten departments, ${D.projects.length} projects</h2></div><a class="link" href="#departments">All departments →</a></div>
    <div class="depts">${D.depts.map(deptTile).join('')}</div>
  </div></section>

  <section class="sec"><div class="in">
    <div class="sh"><div><div class="lbl gold">Featured project</div><h2>From line item to laboratory</h2><p>Every project page shows the room, the people it serves, the full bill of quantities and who has given.</p></div></div>
    <article class="proj">
      <div class="render" style="${img(feat.dept)}"><span class="st">${chip(feat)}</span><span class="cap">${esc(DEPT[feat.dept].name)}</span></div>
      <div class="pbody">
        <div class="lbl brick">${esc(DEPT[feat.dept].name)} · ${feat.code}</div>
        <h3>${esc(feat.title)}</h3><p>${esc(feat.summary)}</p>
        <div class="facts"><div><strong class="num">${n(feat.sqft)} sq ft</strong><span>floor area</span></div><div><strong class="num">${feat.seats}</strong><span>seats</span></div><div><strong class="num">${n(feat.students)}+</strong><span>students a year</span></div></div>
        <div class="prog">${amt(fr,'sm')}<div class="bar"><b style="width:${fp}%"></b></div><div class="row"><span><b>${fp}%</b> of LKR ${n(feat.target)}</span><span>${giversOf(feat.id)} givers</span></div></div>
        <div class="cta"><a class="btn btn-p" href="#pledge-${feat.id}">Pledge to this lab ${arrow}</a><a class="btn btn-o" href="#project-${feat.id}">View project and BOQ</a></div>
      </div>
    </article>
    <div class="sh" style="margin:56px 0 24px"><div><div class="lbl gold">Closest to their goal</div><h2 style="font-size:30px">A final push gets these built</h2></div></div>
    <div class="pgrid">${near.map(projCard).join('')}</div>
  </div></section>

  <section class="sec alt"><div class="in two">
    <div class="ledger">
      <div class="ledger-h"><span class="lbl">Wall of Gratitude</span><span class="live"><i></i>Live</span><span class="count num">${n(D.meta.givers + demo.pledges.length)} givers</span></div>
      <ul>${allPledges().slice(0,7).map(x=>ledgerRow(x)).join('')}</ul>
      <div class="more-row"><a class="btn btn-o" href="#wall">See the full wall ${arrow}</a></div>
    </div>
    ${plaque(latestDone)}
  </div></section>

  <section class="sec"><div class="in">
    <div class="sh"><div><div class="lbl gold">Leadership</div><h2>The people behind Gratitude</h2><p>Engineers, academics, business leaders and professionals from the Moratuwa community, overseeing every pledge and every project.</p></div><a class="link" href="#leadership">See the full team →</a></div>
    ${boardHTML()}
    ${govHTML()}
  </div></section>

  <section class="sec alt" id="tiers"><div class="in">
    <div class="sh"><div><div class="lbl gold">Ways to give</div><h2>Every level is named on the wall</h2></div><a class="btn btn-p" href="#pledge">Pledge now ${arrow}</a></div>
    ${tiersHTML()}
  </div></section>`;
}

function vDepartments(){
  const rows = D.depts.map(d => {
    const r = deptRaised(d.id), pc = pct(r,d.target), ps = D.projects.filter(p=>p.dept===d.id);
    return `<a class="dcard" href="#dept-${d.id}"><div class="ph-img" style="${img(d.id)}"></div><div class="bd">
      <span class="lbl brick">${d.code} · ${ps.length} projects</span><h3>${esc(d.name)}</h3><p>${esc(d.blurb)}</p>
      <div class="bar"><b style="width:${pc}%"></b></div>
      <div class="row"><span><b>${pc}%</b> of LKR ${M(d.target)}</span><span>${ps.filter(p=>p.status==='completed').length} completed</span></div></div></a>`;
  }).join('');
  return `<section class="ph"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Departments</span></div>
    <h1>Departments</h1><p>Each department sets its own priorities. The board reviews every project and its bill of quantities before it goes live.</p>
    <div class="statrow"><div><strong class="num">10</strong><span>departments</span></div><div><strong class="num">${D.projects.length}</strong><span>projects</span></div><div><strong class="num">LKR ${M(D.meta.target)}</strong><span>total cost</span></div><div><strong class="num">${pct(totalRaised(),D.meta.target)}%</strong><span>pledged</span></div></div>
  </div></section>
  <section class="sec"><div class="in"><div class="dgrid">${rows}</div></div></section>`;
}

function vDept(id){
  const d = DEPT[id]; if (!d) return vNotFound();
  const ps = D.projects.filter(p=>p.dept===id);
  const r = deptRaised(id);
  const pl = allPledges().filter(x => x.project!=='general' && PROJ[x.project]?.dept===id);
  const givers = new Set(pl.map(x=>x.donor)).size;
  const top = Object.values(pl.reduce((a,x)=>{ (a[x.donor] ||= {donor:x.donor, demoDonor:x.demoDonor, amount:0, date:x.date, project:x.project}).amount += x.amount; return a; },{})).sort((a,b)=>b.amount-a.amount).slice(0,8);
  const active = ps.filter(p=>p.status!=='completed'), done = ps.filter(p=>p.status==='completed');
  return `<section class="photo-hero" style="${img(id)}"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><a href="#departments">Departments</a><span>/</span><span>${d.code}</span></div>
    <div class="lbl" style="color:var(--peach)">Department of</div>
    <h1>${esc(d.name)}</h1><p>${esc(d.blurb)}</p>
    <div class="statrow"><div><strong class="num">LKR ${M(d.target)}</strong><span>needed for ${ps.length} projects</span></div><div><strong class="num">${pct(r,d.target)}%</strong><span>pledged</span></div><div><strong class="num">${n(givers)}</strong><span>givers</span></div><div><strong class="num">${n(d.students)}</strong><span>students</span></div></div>
  </div><span class="photo-cap">Photo: EXMO 2023</span></section>

  <section class="sec"><div class="in prose">
    <div><div class="lbl gold">The gap</div><h3>Why this department needs support</h3><p>${esc(d.problem)}</p></div>
    <div><div class="lbl gold">The vision</div><h3>What your gift makes possible</h3><p>${esc(d.vision)}</p></div>
  </div></section>

  <section class="sec alt"><div class="in">
    <div class="sh"><div><div class="lbl gold">${active.length} open projects</div><h2>Projects in ${esc(d.short)}</h2></div><a class="btn btn-p" href="#pledge">Pledge to ${esc(d.code)} ${arrow}</a></div>
    <div class="pgrid">${active.map(projCard).join('')}</div>
    ${done.length ? `<div class="sh" style="margin:56px 0 24px"><div><div class="lbl gold">Legacy</div><h2 style="font-size:30px">Already built by givers</h2></div><a class="link" href="#legacy">All completed projects →</a></div><div class="pgrid">${done.map(projCard).join('')}</div>` : ''}
  </div></section>

  <section class="sec"><div class="in two">
    <div class="ledger"><div class="ledger-h"><span class="lbl">Top givers to ${esc(d.code)}</span><span class="count">${n(givers)} givers in total</span></div>
      <ul>${top.map(x=>ledgerRow(x,false)).join('')}</ul>
      <div class="more-row"><button class="btn btn-o" data-wall-dept="${id}">See every gift to ${esc(d.code)} ${arrow}</button></div></div>
    <div class="boards"><div class="board-list"><h3>Value for students</h3><ol>
      <li><span>Hands-on time with industry-grade equipment<small>Not only simulation</small></span></li>
      <li><span>Final-year and postgraduate research capacity<small>Shared across departments</small></span></li>
      <li><span>Industry projects and internships<small>Sponsored work on campus</small></span></li></ol></div>
      <div class="board-list"><h3>Value for industry</h3><ol>
      <li><span>Graduates ready from day one<small>Trained on current tools</small></span></li>
      <li><span>Testing and R&amp;D on campus<small>Local, not abroad</small></span></li>
      <li><span>Recognition on the project plaque<small>For founding partners</small></span></li></ol></div></div>
  </div></section>`;
}

function vProject(id){
  const p = PROJ[id]; if (!p) return vNotFound();
  const d = DEPT[p.dept], r = raisedOf(p), pc = pct(r,p.target);
  const pl = allPledges().filter(x=>x.project===id);
  const STAGES = [['Proposed','Department submits need'],['Reviewed','Board checks scope and BOQ'],['Live','Open for pledges'],['Funded','Target reached'],['Built','Procured and installed'],['Handed over','In use by students']];
  const stageIdx = p.status==='completed' ? 5 : p.status==='in_progress' ? 4 : 2;
  const legacy = p.status==='completed' ? `
    <section class="sec alt"><div class="in">
      <div class="sh"><div><div class="lbl gold">Legacy</div><h2>Built, handed over and in use</h2><p>Handed over to the Department of ${esc(d.name)} in ${fmon(p.legacy.handed_over)}. Final cost came in at LKR ${n(p.legacy.final_cost)}, which is ${(100 - p.legacy.final_cost/p.target*100).toFixed(1)}% under the published BOQ.</p></div></div>
      <div class="two">
        <div style="display:grid;gap:22px;align-content:start">
          <div class="ba"><figure><div class="im before" style="${img(p.dept)}"></div><figcaption>Before</figcaption></figure><figure><div class="im" style="${img(p.dept)}"></div><figcaption>After · ${fmon(p.legacy.handed_over)}</figcaption></figure></div>
          <div class="impact"><div><strong class="num">${n(p.legacy.students_served)}</strong><span>students a year</span></div><div><strong class="num">${p.legacy.courses}</strong><span>courses using it</span></div><div><strong class="num">${p.legacy.papers}</strong><span>research papers</span></div><div><strong class="num">${p.legacy.industry_projects}</strong><span>industry projects</span></div><div><strong class="num">${p.legacy.startups}</strong><span>student startups</span></div></div>
        </div>
        ${plaque(p)}
      </div>
    </div></section>` : '';
  return `<section class="ph"><div class="in"><div class="crumbs"><a href="#home">Campaign</a><span>/</span><a href="#departments">Departments</a><span>/</span><a href="#dept-${d.id}">${d.code}</a><span>/</span><span>${p.code}</span></div></div></section>
  <section class="sec tight"><div class="in">
    <article class="proj">
      <div class="render" style="${img(p.dept)}"><span class="st">${chip(p)}</span><span class="cap">Department photo · EXMO 2023</span></div>
      <div class="pbody">
        <div class="lbl brick">${esc(d.name)} · ${p.code}</div>
        <h1>${esc(p.title)}</h1><p>${esc(p.summary)}</p>
        <div class="facts"><div><strong class="num">${n(p.sqft)} sq ft</strong><span>floor area</span></div><div><strong class="num">${p.seats}</strong><span>seats</span></div><div><strong class="num">${n(p.students)}+</strong><span>students a year</span></div></div>
        <div class="prog">${amt(r,'sm')}<div class="bar ${p.status!=='active'?'done':''}"><b style="width:${pc}%"></b></div><div class="row"><span><b>${pc}%</b> of LKR ${n(p.target)}</span><span>${giversOf(id)} givers</span></div></div>
        ${p.status==='active' ? `<div class="cta"><a class="btn btn-p" href="#pledge-${id}">Pledge to this project ${arrow}</a><a class="btn btn-o" href="#boq-table" data-scroll="boq-table">See the BOQ</a></div>`
          : p.status==='in_progress' ? `<div class="notice">Fully funded. ${esc(p.progress_note)}. Expected handover ${esc(p.expected)}.</div>`
          : `<div class="notice" style="background:#f3ead6;border-color:#e3d3b5;color:#5a4210">Completed and handed over in ${fmon(p.legacy.handed_over)}. Thank you to every giver.</div>`}
      </div>
    </article>
    <div style="margin-top:40px"><div class="lbl" style="margin-bottom:6px">Where the project stands</div><ol class="steps">${STAGES.map((s,i)=>`<li class="${i<=stageIdx?'on':''}"><strong>${s[0]}</strong><span>${s[1]}</span></li>`).join('')}</ol></div>
  </div></section>
  ${legacy}
  <section class="sec ${p.status==='completed'?'':'alt'}"><div class="in">${boqTable(p)}</div></section>
  <section class="sec ${p.status==='completed'?'alt':''}"><div class="in two">
    <div class="ledger"><div class="ledger-h"><span class="lbl">Givers to this project</span><span class="count">${giversOf(id)} givers · LKR ${n(r)}</span></div>
      <ul>${pl.slice(0,12).map(x=>ledgerRow(x,false)).join('') || '<li class="empty">Be the first to give.</li>'}</ul>
      ${pl.length>12?`<div class="more-row"><button class="btn btn-o" data-wall-project="${id}">See all ${pl.length} gifts ${arrow}</button></div>`:''}</div>
    <div class="boards"><div class="board-list"><h3>What this project enables</h3><ol>
      <li><span>${esc(p.summary.split('.')[0])}<small>${esc(d.short)}</small></span></li>
      <li><span>About ${n(p.students)} students a year<small>Coursework, projects and research</small></span></li>
      <li><span>${p.seats} seats in ${n(p.sqft)} sq ft<small>Designed for hands-on work</small></span></li></ol></div>
      <div class="board-list"><h3>More in ${esc(d.short)}</h3><ol>${D.projects.filter(x=>x.dept===p.dept&&x.id!==id).map(x=>`<li><span><a href="#project-${x.id}" style="text-decoration:none">${esc(x.title)}</a><small>${STATUS[x.status][0]}</small></span><b>${pct(raisedOf(x),x.target)}%</b></li>`).join('')}</ol></div></div>
  </div></section>`;
}

function vLegacy(){
  const done = D.projects.filter(p=>p.status==='completed').sort((a,b)=>b.legacy.handed_over.localeCompare(a.legacy.handed_over));
  const invested = done.reduce((a,p)=>a+p.legacy.final_cost,0);
  const students = done.reduce((a,p)=>a+p.legacy.students_served,0);
  const givers = new Set(allPledges().filter(x=>done.some(p=>p.id===x.project)).map(x=>x.donor)).size;
  const building = D.projects.filter(p=>p.status==='in_progress');
  return `<section class="ph"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Legacy</span></div>
    <h1>Legacy</h1><p>Every facility that givers have built, with its final cost, its impact and the names of the people who made it possible. This record stays, campaign after campaign.</p>
  </div></section>
  <section class="sec tight"><div class="in">
    <div class="counters"><div><strong class="num">${done.length}</strong><span>facilities handed over</span></div><div><strong class="num">LKR ${M(invested)}</strong><span>invested, at final cost</span></div><div><strong class="num">${n(students)}</strong><span>students served each year</span></div><div><strong class="num">${n(givers)}</strong><span>givers named on plaques</span></div></div>
  </div></section>
  <section class="sec alt"><div class="in">
    <div class="sh"><div><div class="lbl gold">EXMO 2027 campaign</div><h2>Completed projects</h2></div></div>
    <div class="lgrid">${done.map(p=>`<a class="lcard" href="#project-${p.id}"><div class="img" style="${img(p.dept)}"><span class="chip done">Handed over ${fmon(p.legacy.handed_over)}</span></div><div class="bd">
      <span class="lbl brick">${esc(DEPT[p.dept].short)} · ${p.code}</span><h3>${esc(p.title)}</h3>
      <q>Made possible by ${giversOf(p.id)} alumni and partners.</q>
      <div class="row"><span>Final cost LKR ${M(p.legacy.final_cost)}</span><span>BOQ ${M(p.target)}</span></div>
      <div class="row"><span>${n(p.legacy.students_served)} students a year</span><span>${p.legacy.papers} papers</span></div></div></a>`).join('')}</div>
  </div></section>
  <section class="sec"><div class="in">
    <div class="sh"><div><div class="lbl gold">Coming next</div><h2>Funded and being built</h2></div></div>
    <div class="pgrid">${building.map(projCard).join('')}</div>
  </div></section>`;
}

function wallFiltered(){
  const s = wallState, q = s.q.trim().toLowerCase();
  let list = allPledges().filter(x => {
    const dn = donorOf(x);
    if (s.type!=='all' && !(s.type==='individual' ? (dn.type==='individual'||dn.type==='you') : dn.type===s.type)) return false;
    if (s.project!=='all' && x.project!==s.project) return false;
    if (s.dept!=='all' && (x.project==='general' || PROJ[x.project].dept!==s.dept)) return false;
    if (q && !(dn.name.toLowerCase().includes(q) || (x.project!=='general' && PROJ[x.project].title.toLowerCase().includes(q)) || String(dn.batch||'').includes(q))) return false;
    return true;
  });
  if (s.sort==='big') list = list.slice().sort((a,b)=>b.amount-a.amount);
  return list;
}
function vWall(){
  const all = allPledges();
  const byBatch = {};
  for (const x of all){ const dn = donorOf(x); if (dn.batch && dn.type!=='you'){ (byBatch[dn.batch] ||= 0); byBatch[dn.batch] += x.amount; } }
  const topBatch = Object.entries(byBatch).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const byOrg = {};
  for (const x of all){ const dn = donorOf(x); if (dn.type==='company'||dn.type==='chapter'){ (byOrg[dn.name] ||= {amt:0,type:dn.type}); byOrg[dn.name].amt += x.amount; } }
  const topOrg = Object.entries(byOrg).sort((a,b)=>b[1].amt-a[1].amt).slice(0,8);
  const opt = (v,l,cur) => `<option value="${v}" ${cur===v?'selected':''}>${esc(l)}</option>`;
  return `<section class="ph"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Wall of Gratitude</span></div>
    <h1>Wall of Gratitude</h1><p>Every gift, by name and amount, from the first pledge at EXMO 2027 onwards. Givers who asked to stay anonymous are listed as a grateful graduate.</p>
    <div class="statrow"><div><strong class="num">${n(D.meta.givers + demo.pledges.length)}</strong><span>givers</span></div><div><strong class="num">${n(all.length)}</strong><span>gifts</span></div><div><strong class="num">LKR ${M(totalRaised())}</strong><span>pledged</span></div></div>
  </div></section>
  <section class="sec tight"><div class="in two">
    <div>
      <div class="controls" role="search">
        <label for="wq">Search<input id="wq" type="search" placeholder="Name, batch year or project" value="${esc(wallState.q)}"></label>
        <label for="wt">Giver<select id="wt">${opt('all','All givers',wallState.type)}${opt('individual','Alumni',wallState.type)}${opt('batch','Batches',wallState.type)}${opt('company','Companies',wallState.type)}${opt('chapter','Alumni chapters',wallState.type)}${opt('anonymous','Anonymous',wallState.type)}</select></label>
        <label for="wd">Department<select id="wd">${opt('all','All',wallState.dept)}${D.depts.map(d=>opt(d.id,d.code,wallState.dept)).join('')}</select></label>
        <label for="wp">Project<select id="wp">${opt('all','All',wallState.project)}${opt('general','General fund',wallState.project)}${D.projects.map(p=>opt(p.id,p.code+' · '+p.title,wallState.project)).join('')}</select></label>
        <label for="ws">Sort<select id="ws">${opt('new','Newest',wallState.sort)}${opt('big','Largest',wallState.sort)}</select></label>
      </div>
      <div class="ledger" id="wallList"></div>
    </div>
    <div class="boards">
      <div class="board-list"><h3>Batches giving most</h3><ol>${topBatch.map(([y,v])=>`<li><span>Batch of ${y}<small>Alumni and batch gifts</small></span><b>${M(v)}</b></li>`).join('')}</ol></div>
      <div class="board-list"><h3>Partners and chapters</h3><ol>${topOrg.map(([nm,o])=>`<li><span>${esc(nm)}<small>${o.type==='company'?'Corporate partner':'Overseas alumni chapter'}</small></span><b>${M(o.amt)}</b></li>`).join('')}</ol></div>
      <a class="btn btn-p" href="#pledge">Add your name ${arrow}</a>
    </div>
  </div></section>`;
}
function renderWallList(){
  const el = document.getElementById('wallList'); if (!el) return;
  const list = wallFiltered();
  const total = list.reduce((a,x)=>a+x.amount,0);
  el.innerHTML = `<div class="ledger-h"><span class="lbl">${n(list.length)} gifts</span><span class="count">LKR ${n(total)}</span></div>
    <ul>${list.slice(0,wallState.shown).map(x=>ledgerRow(x)).join('') || '<li class="empty">No gifts match these filters.</li>'}</ul>
    ${list.length>wallState.shown?`<div class="more-row"><button class="btn btn-o" id="wallMore">Show 40 more</button></div>`:''}`;
}

function vBoq(){
  return `<section class="ph"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>BOQ index</span></div>
    <h1>Bill of quantities index</h1><p>Every project's cost, line by line. Select a project to see its full BOQ, or sort by any column.</p>
    <div class="statrow"><div><strong class="num">${D.projects.length}</strong><span>projects</span></div><div><strong class="num">${n(D.projects.reduce((a,p)=>a+p.boq.length,0))}</strong><span>line items</span></div><div><strong class="num">LKR ${n(D.meta.target)}</strong><span>total</span></div></div>
  </div></section>
  <section class="sec tight"><div class="in">
    <div class="controls" style="grid-template-columns:repeat(4,1fr)"><label for="bd">Department<select id="bd"><option value="all">All departments</option>${D.depts.map(d=>`<option value="${d.id}" ${boqState.dept===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label></div>
    <div class="boq" style="margin-top:16px"><div class="tw" id="boqIdx"></div></div>
  </div></section>`;
}
function renderBoqIdx(){
  const el = document.getElementById('boqIdx'); if (!el) return;
  const key = { dept:p=>p.code, title:p=>p.title, status:p=>p.status, target:p=>p.target, raised:p=>raisedOf(p), pct:p=>raisedOf(p)/p.target };
  let list = D.projects.filter(p=>boqState.dept==='all'||p.dept===boqState.dept).slice();
  const k = key[boqState.sort];
  list.sort((a,b)=>{ const x=k(a), y=k(b); return (x>y?1:x<y?-1:0)*boqState.dir; });
  const th = (id,l,cls='') => `<th class="${cls}"><button data-sort="${id}" aria-label="Sort by ${l}">${l}${boqState.sort===id?(boqState.dir>0?' ↑':' ↓'):''}</button></th>`;
  const tot = list.reduce((a,p)=>a+p.target,0), rs = list.reduce((a,p)=>a+raisedOf(p),0);
  el.innerHTML = `<table><thead><tr>${th('dept','Code')}${th('title','Project')}${th('status','Status')}<th class="n">Items</th>${th('target','BOQ total (LKR)','n')}${th('raised','Pledged (LKR)','n')}${th('pct','Funded','n')}</tr></thead>
  <tbody>${list.map(p=>`<tr class="click" data-go="project-${p.id}" tabindex="0"><td class="num">${p.code}</td><td>${esc(p.title)}<small>${esc(DEPT[p.dept].name)}</small></td><td>${pillS(p)}</td><td class="n">${p.boq.length}</td><td class="n">${n(p.target)}</td><td class="n">${n(raisedOf(p))}</td><td class="n">${pct(raisedOf(p),p.target)}%</td></tr>`).join('')}</tbody>
  <tfoot><tr><td colspan="4">${list.length} projects</td><td class="n">${n(tot)}</td><td class="n">${n(rs)}</td><td class="n">${pct(rs,tot)}%</td></tr></tfoot></table>`;
}

function vLeadership(){
  const C = [
    ['Finance &amp; Audit Committee','Keeps the accounts, checks every payment against the approved BOQ and works with the external auditor.',[['Chair','Chartered Accountant'],['','Independent auditor'],['','Banking and finance leader'],['','Bursar, University of Moratuwa'],['','Alumni representative']]],
    ['Projects &amp; Procurement Committee','Reviews each department\'s proposal, prices the BOQ and oversees procurement and installation.',[['Chair','Senior Professor, Faculty of Engineering'],['','Chartered Engineer'],['','Quantity Surveyor'],['','Chartered Architect'],['','Head of Department representative']]],
    ['Alumni &amp; Partnerships Committee','Reaches alumni at home and abroad, and works with companies on founding-partner gifts.',[['Chair','Senior alumnus'],['','Overseas alumni representative'],['','Corporate relations lead'],['','Young alumni representative'],['','Communications lead']]],
  ];
  return `<section class="ph"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Leadership</span></div>
    <h1>The team driving Gratitude</h1><p>University leadership, alumni and professionals who oversee every pledge, every purchase and every naming.</p>
  </div></section>
  <section class="sec"><div class="in">${boardHTML()}</div></section>
  <section class="sec alt"><div class="in">
    ${C.map(([t,d,m])=>`<div class="committee" style="margin-top:0;margin-bottom:64px"><div class="sh" style="margin-bottom:24px"><div><h2 style="font-size:28px">${t}</h2><p>${d}</p></div></div><div class="board sm">${m.map((x,i)=>person(x[0],x[1],i+1)).join('')}</div></div>`).join('')}
    <p class="board-note" style="margin-top:-32px">Names and photos will be added once members are confirmed.</p>
  </div></section>`;
}

function vGovernance(){
  const FAQ = [
    ['Where does my money go?','To the project you choose, or to the general fund if you prefer. Each project has a published bill of quantities, and the board releases funds only against approved line items.'],
    ['What happens if a project raises more than it needs?','Any surplus moves to the next project in the same department, and the change is shown in the quarterly report.'],
    ['What if a project does not reach its target?','Pledges stay with the project while it is live. If the board closes a project, givers are asked whether to move their gift to another project or the general fund.'],
    ['Will I get a receipt?','Yes. Every gift gets a receipt from the treasurer and a certificate of gratitude by email.'],
    ['Can I give anonymously?','Yes. Choose "Show me as a grateful graduate" when you pledge. Your gift still counts towards your batch and department.'],
    ['Can my batch or company give together?','Yes. Batch and corporate gifts are listed under one name on the Wall of Gratitude, and gifts of LKR 1,000,000 or more appear on the project plaque.'],
    ['Who checks the accounts?','An external audit firm audits the fund every year, and the full report is published here.'],
  ];
  return `<section class="ph"><div class="in">
    <div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Governance</span></div>
    <h1>Governance and audits</h1><p>How a project goes from a department's need to a working facility, and how every rupee is accounted for along the way.</p>
  </div></section>
  <section class="sec"><div class="in">
    <div class="sh"><div><div class="lbl gold">From need to facility</div><h2>How every project moves</h2></div></div>
    <ol class="steps"><li class="on"><strong>Proposed</strong><span>The department submits a need, a layout and a draft BOQ</span></li><li class="on"><strong>Reviewed</strong><span>The projects committee checks scope and prices</span></li><li class="on"><strong>Live</strong><span>The board approves and the project opens for pledges</span></li><li class="on"><strong>Funded</strong><span>Funds are released only against approved BOQ lines</span></li><li class="on"><strong>Built</strong><span>Procurement, installation and commissioning</span></li><li class="on"><strong>Handed over</strong><span>The facility goes into use and joins the Legacy record</span></li></ol>
    ${govHTML()}
  </div></section>
  <section class="sec alt"><div class="in">
    <div class="sh"><div><div class="lbl gold">Reports</div><h2>Published reports</h2><p>Reports appear here as they are issued. Shown as examples in this prototype.</p></div></div>
    <div class="boq"><div class="tw"><table><thead><tr><th>Report</th><th>Period</th><th>Issued</th></tr></thead><tbody>
      <tr><td>Quarterly report Q3 2028</td><td>Jul–Sep 2028</td><td>Oct 2028</td></tr>
      <tr><td>Quarterly report Q2 2028</td><td>Apr–Jun 2028</td><td>Jul 2028</td></tr>
      <tr><td>Annual audited accounts 2027/28</td><td>Jun 2027–Jun 2028</td><td>Sep 2028</td></tr>
      <tr><td>Quarterly report Q1 2028</td><td>Jan–Mar 2028</td><td>Apr 2028</td></tr>
    </tbody></table></div></div>
  </div></section>
  <section class="sec" id="faq"><div class="in" style="max-width:900px">
    <div class="sh"><div><div class="lbl gold">Questions</div><h2>Frequently asked questions</h2></div></div>
    <div class="faq">${FAQ.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  </div></section>`;
}

// ---------- pledge flow (demo, in memory)
const P = { step:1, project:'general', amount:250000, custom:'', name:'', display:'name', alumni:'yes', batch:'', dept:'', email:'', error:'' };
function vPledge(pid){
  if (pid && (PROJ[pid] || pid==='general') && P.step===1) P.project = pid;
  const proj = P.project==='general' ? null : PROJ[P.project];
  const stepNames = ['Choose','Amount','Your details','Confirm'];
  const stepper = `<div class="stepper">${stepNames.map((s,i)=>`<span class="${i+1===P.step?'on':i+1<P.step?'done':''}">${i+1}. ${s}</span>`).join('')}</div>`;
  const amount = P.custom ? Number(P.custom) : P.amount;
  let body = '';
  if (P.step===1){
    const opts = D.projects.filter(p=>p.status==='active');
    body = `<div class="form"><label for="pp">Project<select id="pp"><option value="general" ${P.project==='general'?'selected':''}>General fund · the board directs it where it is needed most</option>${D.depts.map(d=>`<optgroup label="${esc(d.name)}">${opts.filter(p=>p.dept===d.id).map(p=>`<option value="${p.id}" ${P.project===p.id?'selected':''}>${p.code} · ${esc(p.title)} (${pct(raisedOf(p),p.target)}% funded)</option>`).join('')}</optgroup>`).join('')}</select></label>
      ${proj?`<div class="card" style="flex-direction:row"><div class="img" style="${img(proj.dept)};width:180px;aspect-ratio:auto;flex:none"></div><div class="bd"><span class="lbl brick">${proj.code}</span><h3 style="font-size:19px">${esc(proj.title)}</h3><div class="bar"><b style="width:${pct(raisedOf(proj),proj.target)}%"></b></div><p>LKR ${n(proj.target - raisedOf(proj))} still needed</p></div></div>`:''}
      <div class="cta"><button class="btn btn-p" data-step="2">Continue ${arrow}</button></div></div>`;
  } else if (P.step===2){
    body = `<div class="form"><div class="tiers pick">${TIERS.map(t=>`<button class="tier" aria-pressed="${!P.custom && P.amount===t[1]}" data-amt="${t[1]}"><div class="lbl">${t[0]}</div>${amt(t[1],'xs')}<p>${t[2]}</p></button>`).join('')}</div>
      <label for="pc">Or enter another amount (LKR)<input id="pc" type="number" min="1000" step="1000" inputmode="numeric" placeholder="e.g. 75000" value="${esc(P.custom)}"></label>
      ${P.error?`<div class="err">${esc(P.error)}</div>`:''}
      <div class="cta"><button class="btn btn-o" data-step="1">Back</button><button class="btn btn-p" data-step="3">Continue ${arrow}</button></div></div>`;
  } else if (P.step===3){
    body = `<div class="form">
      <label for="fn">Full name<input id="fn" autocomplete="name" value="${esc(P.name)}" placeholder="As it should appear on your receipt"></label>
      <div><div class="lbl" style="margin-bottom:8px">On the Wall of Gratitude</div><div class="radio"><label><input type="radio" name="disp" value="name" ${P.display==='name'?'checked':''}> Show my name</label><label><input type="radio" name="disp" value="anon" ${P.display==='anon'?'checked':''}> Show me as a grateful graduate</label></div></div>
      <div class="grid2"><label for="fb">Graduation year<input id="fb" type="number" min="1960" max="2028" placeholder="e.g. 2009" value="${esc(P.batch)}"></label>
      <label for="fd">Department<select id="fd"><option value="">Not an alumnus / prefer not to say</option>${D.depts.map(d=>`<option value="${d.id}" ${P.dept===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label></div>
      <label for="fe">Email for your receipt<input id="fe" type="email" autocomplete="email" value="${esc(P.email)}" placeholder="you@example.com"><span class="hint">In this prototype nothing is sent or stored.</span></label>
      ${P.error?`<div class="err">${esc(P.error)}</div>`:''}
      <div class="cta"><button class="btn btn-o" data-step="2">Back</button><button class="btn btn-p" data-step="4">Review pledge ${arrow}</button></div></div>`;
  } else if (P.step===4){
    body = `<div class="form"><div class="summary" style="position:static">
      <div class="row"><span>Project</span><b>${proj?esc(proj.title):'General fund'}</b></div>
      <div class="row"><span>Amount</span><b class="num">LKR ${n(amount)}</b></div>
      <div class="row"><span>Listed as</span><b>${P.display==='anon'?'A grateful graduate':esc(P.name)}</b></div>
      <div class="row"><span>Receipt to</span><b>${esc(P.email)||'—'}</b></div></div>
      <div class="notice">This is a prototype. No payment is taken and nothing leaves your browser. Your pledge appears on the wall for this visit only.</div>
      <div class="cta"><button class="btn btn-o" data-step="3">Back</button><button class="btn btn-p" data-confirm="1">Confirm pledge ${arrow}</button></div></div>`;
  } else {
    const last = demo.pledges[0];
    const lp = last.project==='general' ? null : PROJ[last.project];
    return `<section class="ph"><div class="in"><div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Pledge</span></div><h1>Thank you</h1><p>Your pledge has been added to the Wall of Gratitude for this visit.</p></div></section>
    <section class="sec"><div class="in" style="max-width:860px;display:grid;gap:28px">
      <div class="cert"><span class="lbl">University of Moratuwa · Gratitude</span><h2>Certificate of Gratitude</h2><p>presented to</p><div class="name">${esc(last.demoDonor.display)}</div>
      <p>in recognition of a gift of LKR ${n(last.amount)} towards ${lp?`the ${esc(lp.title)}, Department of ${esc(DEPT[lp.dept].name)}`:'the Gratitude general fund'}.</p>
      <div class="sig"><div>Chairman, Board of Trustees</div><div>Treasurer</div></div><p style="font-size:12px">Specimen certificate · prototype</p></div>
      <div class="cta" style="justify-content:center"><a class="btn btn-p" href="#wall">See your name on the wall ${arrow}</a>${lp?`<a class="btn btn-o" href="#project-${lp.id}">Back to the project</a>`:''}<button class="btn btn-o" data-reset="1">Make another pledge</button></div>
    </div></section>`;
  }
  return `<section class="ph"><div class="in"><div class="crumbs"><a href="#home">Campaign</a><span>/</span><span>Pledge</span></div><h1>Make a pledge</h1><p>Choose a project, choose an amount and tell us how you'd like to be remembered.</p></div></section>
  <section class="sec tight"><div class="in pledge">
    <div>${stepper}${body}</div>
    <aside class="summary"><h3>Your pledge</h3>
      <div class="row"><span>Project</span><b>${proj?esc(proj.code):'General fund'}</b></div>
      <div class="row"><span>Amount</span><b class="num">LKR ${n(amount||0)}</b></div>
      <div class="row"><span>Tier</span><b>${(TIERS.slice().reverse().find(t=>amount>=t[1])||['—'])[0]}</b></div>
      <p class="muted" style="margin:0;font-size:13px">Every giver is named on the Wall of Gratitude. Gifts of LKR 250,000 or more are also named on the project plaque.</p>
      <div class="notice">Prototype: no payment is taken.</div>
    </aside>
  </div></section>`;
}

function readPledgeInputs(){
  const g = id => document.getElementById(id);
  if (g('pp')) P.project = g('pp').value;
  if (g('pc')) P.custom = g('pc').value;
  if (g('fn')) P.name = g('fn').value.trim();
  const disp = document.querySelector('input[name="disp"]:checked'); if (disp) P.display = disp.value;
  if (g('fb')) P.batch = g('fb').value;
  if (g('fd')) P.dept = g('fd').value;
  if (g('fe')) P.email = g('fe').value.trim();
}

function vNotFound(){ return `<section class="ph"><div class="in"><h1>Page not found</h1><p>That page doesn't exist in this prototype.</p><div class="cta"><a class="btn btn-p" href="#home">Back to the campaign ${arrow}</a></div></div></section>`; }

// ---------- router
function route(){
  const h = (location.hash || '#home').slice(1);
  let html, anchor = null, key = h;
  if (h==='' || h==='home') html = vHome();
  else if (h==='home-tiers'){ html = vHome(); anchor='tiers'; key='home'; }
  else if (h==='departments') html = vDepartments();
  else if (h.startsWith('dept-')){ html = vDept(h.slice(5)); key='departments'; }
  else if (h.startsWith('project-')){ html = vProject(h.slice(8)); key = PROJ[h.slice(8)]?.status==='completed' ? 'legacy' : 'departments'; }
  else if (h==='legacy') html = vLegacy();
  else if (h==='wall') html = vWall();
  else if (h==='boq') html = vBoq();
  else if (h==='leadership') html = vLeadership();
  else if (h==='governance') html = vGovernance();
  else if (h==='governance-faq'){ html = vGovernance(); anchor='faq'; key='governance'; }
  else if (h==='pledge'){ if (P.step===5) P.step=1; html = vPledge(); }
  else if (h.startsWith('pledge-')){ if (P.step===5) P.step=1; P.step=1; html = vPledge(h.slice(7)); key='pledge'; }
  else if (h==='boq-table') { return; }
  else html = vNotFound();
  $app.innerHTML = html;
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('on', a.dataset.r===key || (key==='departments' && a.dataset.r==='departments')));
  document.getElementById('nav').classList.remove('open');
  document.getElementById('menuBtn').setAttribute('aria-expanded','false');
  renderWallList(); renderBoqIdx();
  if (anchor) requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView());
  else window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);

function toast(msg){ const t = document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(), 2200); }

// ---------- events
document.getElementById('menuBtn').addEventListener('click', e => {
  const nav = document.getElementById('nav'); const open = nav.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', String(open));
});
$app.addEventListener('input', e => {
  const t = e.target;
  if (t.id==='wq'){ wallState.q = t.value; wallState.shown = 40; renderWallList(); }
  if (t.id==='pc'){ P.custom = t.value; document.querySelectorAll('button.tier').forEach(b=>b.setAttribute('aria-pressed', String(!t.value && Number(b.dataset.amt)===P.amount))); }
});
$app.addEventListener('change', e => {
  const t = e.target, map = { wt:'type', wd:'dept', wp:'project', ws:'sort' };
  if (map[t.id]){ wallState[map[t.id]] = t.value; wallState.shown = 40; renderWallList(); }
  if (t.id==='bd'){ boqState.dept = t.value; renderBoqIdx(); }
  if (t.id==='pp'){ P.project = t.value; $app.innerHTML = vPledge(); }
});
$app.addEventListener('keydown', e => {
  const tr = e.target.closest('tr[data-go]'); if (tr && (e.key==='Enter' || e.key===' ')){ e.preventDefault(); location.hash = tr.dataset.go; }
});
$app.addEventListener('click', e => {
  const t = e.target.closest('button, a, tr[data-go]'); if (!t) return;
  if (t.matches('tr[data-go]')) { location.hash = t.dataset.go; return; }
  if (t.id==='wallMore'){ wallState.shown += 40; renderWallList(); return; }
  if (t.dataset.sort){ const s = t.dataset.sort; boqState.dir = boqState.sort===s ? -boqState.dir : (s==='target'||s==='raised'||s==='pct' ? -1 : 1); boqState.sort = s; renderBoqIdx(); return; }
  if (t.dataset.scroll){ e.preventDefault(); document.getElementById(t.dataset.scroll)?.scrollIntoView({behavior:'smooth'}); return; }
  if (t.dataset.wallDept){ Object.assign(wallState,{dept:t.dataset.wallDept, project:'all', type:'all', q:'', shown:40}); location.hash='wall'; return; }
  if (t.dataset.wallProject){ Object.assign(wallState,{project:t.dataset.wallProject, dept:'all', type:'all', q:'', shown:40}); location.hash='wall'; return; }
  if (t.dataset.copy){
    const p = PROJ[t.dataset.copy];
    const csv = ['Category,Item,Specification,Qty,Unit rate (LKR),Amount (LKR)'].concat(p.boq.map(b=>[b.cat,b.item,b.spec,b.qty,b.unit,b.qty*b.unit].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))).join('\n');
    const done = () => toast('BOQ copied as CSV');
    try { navigator.clipboard.writeText(csv).then(done, () => toast('Copy is not available here')); } catch { toast('Copy is not available here'); }
    return;
  }
  if (t.dataset.amt){ P.amount = Number(t.dataset.amt); P.custom=''; P.error=''; $app.innerHTML = vPledge(); return; }
  if (t.dataset.step){
    readPledgeInputs();
    const to = Number(t.dataset.step);
    if (to > P.step){
      const a = P.custom ? Number(P.custom) : P.amount;
      if (P.step===2 && (!a || a < 1000)){ P.error = 'Enter an amount of at least LKR 1,000.'; $app.innerHTML = vPledge(); return; }
      if (P.step===3 && !P.name){ P.error = 'Enter your full name so we can issue your receipt.'; $app.innerHTML = vPledge(); return; }
      if (P.step===3 && P.email && !/^\S+@\S+\.\S+$/.test(P.email)){ P.error = 'Check the email address. It should look like name@example.com.'; $app.innerHTML = vPledge(); return; }
    }
    P.error=''; P.step = to; $app.innerHTML = vPledge(); window.scrollTo(0, 0); return;
  }
  if (t.dataset.confirm){
    const a = P.custom ? Number(P.custom) : P.amount;
    const meta = [P.dept ? DEPT[P.dept].code : '', P.batch ? `’${String(P.batch).slice(2)}` : ''].filter(Boolean).join(' ');
    const display = P.display==='anon' ? 'A grateful graduate' : P.name;
    demo.pledges.unshift({ donor:'you-'+demo.pledges.length, project:P.project, amount:a, date:'2028-12-12',
      demoDonor:{ type:'you', name: display + ' (you)', display, meta: (meta ? meta + ' · ' : '') + 'Your pledge (demo)', batch: P.batch ? Number(P.batch) : null } });
    P.step = 5; $app.innerHTML = vPledge(); window.scrollTo(0,0); return;
  }
  if (t.dataset.reset){ Object.assign(P,{step:1,custom:'',error:''}); $app.innerHTML = vPledge(); return; }
});

route();
})();
