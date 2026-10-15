import { Board, Crumbs, Person } from '../ui';

const COMMITTEES: [title: string, about: string, members: [string, string][]][] = [
  ['Finance & Audit Committee','Keeps the accounts, checks every payment against the approved BOQ and works with the external auditor.',[['Chair','Chartered Accountant'],['','Independent auditor'],['','Banking and finance leader'],['','Bursar, University of Moratuwa'],['','Alumni representative']]],
  ['Projects & Procurement Committee','Reviews each department\'s proposal, prices the BOQ and oversees procurement and installation.',[['Chair','Senior Professor, Faculty of Engineering'],['','Chartered Engineer'],['','Quantity Surveyor'],['','Chartered Architect'],['','Head of Department representative']]],
  ['Alumni & Partnerships Committee','Reaches alumni at home and abroad, and works with companies on founding-partner gifts.',[['Chair','Senior alumnus'],['','Overseas alumni representative'],['','Corporate relations lead'],['','Young alumni representative'],['','Communications lead']]],
];

export default function Leadership(){
  return <>
    <section className="ph"><div className="in">
      <Crumbs items={[['Campaign','/'],['Leadership']]}/>
      <h1>The team driving Gratitude</h1><p>University leadership, alumni and professionals who oversee every pledge, every purchase and every naming.</p>
    </div></section>
    <section className="sec"><div className="in"><Board/></div></section>
    <section className="sec alt"><div className="in">
      {COMMITTEES.map(([t,d,m]) => <div key={t} className="committee" style={{ marginTop:0, marginBottom:64 }}>
        <div className="sh" style={{ marginBottom:24 }}><div><h2 style={{ fontSize:28 }}>{t}</h2><p>{d}</p></div></div>
        <div className="board sm">{m.map((x,i) => <Person key={i} role={x[0]} pos={x[1]} i={i+1}/>)}</div>
      </div>)}
      <p className="board-note" style={{ marginTop:-32 }}>Names and photos will be added once members are confirmed.</p>
    </div></section>
  </>;
}
