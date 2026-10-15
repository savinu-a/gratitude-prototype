import raw from './gratitude.json';

export type Status = 'active' | 'in_progress' | 'completed';
export type DonorType = 'individual' | 'batch' | 'company' | 'chapter' | 'anonymous' | 'you';

export interface Dept {
  id: string; code: string; name: string; short: string;
  blurb: string; problem: string; vision: string;
  students: number; staff: number; target: number; raised: number; img: string;
}
export interface BoqLine { cat: string; item: string; spec: string; qty: number; unit: number }
export interface Legacy {
  handed_over: string; final_cost: number; students_served: number;
  courses: number; papers: number; startups: number; industry_projects: number;
}
export interface Project {
  id: string; code: string; dept: string; title: string; status: Status; summary: string;
  sqft: number; seats: number; students: number;
  boq: BoqLine[]; target: number; goal_pct: number; raised: number;
  legacy?: Legacy; progress_note?: string; expected?: string;
}
export interface Donor {
  id: string; name: string; type: DonorType;
  batch: number | null; dept: string | null; members?: number;
  display?: string; meta?: string;   // set on demo ("you") donors only
}
export interface Pledge { donor: string; project: string; amount: number; date: string; demoDonor?: Donor }
export interface Data {
  meta: { campaign: string; snapshot: string; target: number; raised: number; givers: number; pledges: number };
  depts: Dept[]; projects: Project[]; donors: Donor[]; pledges: Pledge[];
}

export const D = raw as unknown as Data;
export const DEPT: Record<string, Dept> = Object.fromEntries(D.depts.map(d => [d.id, d]));
export const PROJ: Record<string, Project> = Object.fromEntries(D.projects.map(p => [p.id, p]));
export const DONOR: Record<string, Donor> = Object.fromEntries(D.donors.map(d => [d.id, d]));

// ---------- formatting
export const n = (v: number) => Math.round(v).toLocaleString('en-US');
export const M = (v: number) => v >= 1e9 ? (v/1e9).toFixed(2).replace(/\.?0+$/,'') + 'B' : v >= 1e6 ? (v/1e6).toFixed(1).replace(/\.0$/,'') + 'M' : v >= 1e3 ? Math.round(v/1e3) + 'K' : String(v);
export const pct = (a: number, b: number) => b ? Math.min(100, Math.round(a/b*100)) : 0;
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const fdate = (iso: string) => { const [y,m,d] = iso.split('-'); return `${d} ${MON[+m-1]} ${y}`; };
export const fmon = (iso: string) => { const [y,m] = iso.split('-'); return `${MON[+m-1]} ${y}`; };
export const bg = (deptId: string) => ({ backgroundImage: `url('/${DEPT[deptId].img}')` });

export const STATUS: Record<Status, [label: string, cls: string]> = { active:['Active · seeking funds',''], in_progress:['Funded · being built','prog'], completed:['Completed','done'] };

export function donorOf(x: Pledge): Donor { return x.demoDonor || DONOR[x.donor]; }
export function whoMeta(dn: Donor | undefined): string {
  if (!dn) return '';
  if (dn.type==='batch') return `${DEPT[dn.dept ?? '']?.short || ''} · ${dn.members} alumni`;
  if (dn.type==='company') return 'Corporate partner';
  if (dn.type==='chapter') return 'Overseas alumni chapter';
  if (dn.type==='anonymous') return 'Anonymous';
  if (dn.type==='you') return dn.meta || 'Your pledge (demo)';
  return `${DEPT[dn.dept ?? '']?.code || ''} ’${String(dn.batch).slice(2)}`;
}

// ---------- fixed content
export type Tier = [name: string, amount: number, perk: string];
export const TIERS: Tier[] = [['Supporter',10000,'Name on the Wall of Gratitude'],['Builder',50000,'Plus a certificate and project updates'],['Patron',250000,'Plus your name on the project plaque'],['Founding Partner',1000000,'Plus an invitation to the opening'],['Legacy',5000000,'Name a room, bench or lab in perpetuity']];
export const BOARD: [role: string, position: string][] = [['Patron','Vice-Chancellor, University of Moratuwa'],['Chairman','Senior alumnus, engineering industry'],['','Dean, Faculty of Engineering, University of Moratuwa'],['','Bursar, University of Moratuwa'],['Treasurer','Chartered Accountant'],['Secretary','Attorney-at-Law'],['','Head of Department, Faculty of Engineering'],['','Engineering industry leader'],['','Banking and finance leader'],['','Overseas alumni representative'],['','Chartered Architect'],['','Young alumni representative']];
