import { Crumbs, Gov, Steps } from '../ui';

const FLOW: [string, string][] = [['Proposed','The department submits a need, a layout and a draft BOQ'],['Reviewed','The projects committee checks scope and prices'],['Live','The board approves and the project opens for pledges'],['Funded','Funds are released only against approved BOQ lines'],['Built','Procurement, installation and commissioning'],['Handed over','The facility goes into use and joins the Legacy record']];

const REPORTS = [['Quarterly report Q3 2028','Jul–Sep 2028','Oct 2028'],['Quarterly report Q2 2028','Apr–Jun 2028','Jul 2028'],['Annual audited accounts 2027/28','Jun 2027–Jun 2028','Sep 2028'],['Quarterly report Q1 2028','Jan–Mar 2028','Apr 2028']];

const FAQ: [string, string][] = [
  ['Where does my money go?','To the project you choose, or to the general fund if you prefer. Each project has a published bill of quantities, and the board releases funds only against approved line items.'],
  ['What happens if a project raises more than it needs?','Any surplus moves to the next project in the same department, and the change is shown in the quarterly report.'],
  ['What if a project does not reach its target?','Pledges stay with the project while it is live. If the board closes a project, givers are asked whether to move their gift to another project or the general fund.'],
  ['Will I get a receipt?','Yes. Every gift gets a receipt from the treasurer and a certificate of gratitude by email.'],
  ['Can I give anonymously?','Yes. Choose "Show me as a grateful graduate" when you pledge. Your gift still counts towards your batch and department.'],
  ['Can my batch or company give together?','Yes. Batch and corporate gifts are listed under one name on the Wall of Gratitude, and gifts of LKR 1,000,000 or more appear on the project plaque.'],
  ['Who checks the accounts?','An external audit firm audits the fund every year, and the full report is published here.'],
];

export default function Governance(){
  return <>
    <section className="ph"><div className="in">
      <Crumbs items={[['Campaign','/'],['Governance']]}/>
      <h1>Governance and audits</h1><p>How a project goes from a department&apos;s need to a working facility, and how every rupee is accounted for along the way.</p>
    </div></section>
    <section className="sec"><div className="in">
      <div className="sh"><div><div className="lbl gold">From need to facility</div><h2>How every project moves</h2></div></div>
      <Steps stages={FLOW} upTo={FLOW.length}/>
      <Gov/>
    </div></section>
    <section className="sec alt"><div className="in">
      <div className="sh"><div><div className="lbl gold">Reports</div><h2>Published reports</h2><p>Reports appear here as they are issued. Shown as examples in this prototype.</p></div></div>
      <div className="boq"><div className="tw"><table><thead><tr><th>Report</th><th>Period</th><th>Issued</th></tr></thead>
        <tbody>{REPORTS.map(r => <tr key={r[0]}>{r.map(c => <td key={c}>{c}</td>)}</tr>)}</tbody>
      </table></div></div>
    </div></section>
    <section className="sec" id="faq"><div className="in" style={{ maxWidth:900 }}>
      <div className="sh"><div><div className="lbl gold">Questions</div><h2>Frequently asked questions</h2></div></div>
      <div className="faq">{FAQ.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </div></section>
  </>;
}
