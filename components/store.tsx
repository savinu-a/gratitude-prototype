'use client';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { D, type Pledge, type Project } from '@/lib/data';

// Demo state lives in memory for the visit only: pledges made here, wall filters and the pledge form.
export interface WallState { q: string; type: string; dept: string; project: string; sort: 'new' | 'big'; shown: number }
export interface PledgeState {
  step: number; project: string; amount: number; custom: string;
  name: string; display: 'name' | 'anon'; batch: string; dept: string; email: string; error: string;
}
export const WALL0: WallState = { q:'', type:'all', dept:'all', project:'all', sort:'new', shown:40 };
export const PLEDGE0: PledgeState = { step:1, project:'general', amount:250000, custom:'', name:'', display:'name', batch:'', dept:'', email:'', error:'' };

interface Giving {
  demo: Pledge[];
  all: Pledge[];
  raisedOf: (p: Project) => number;
  giversOf: (pid: string) => number;
  deptRaised: (id: string) => number;
  totalRaised: number;
  giverCount: number;
  addPledge: (x: Pledge) => void;
  wall: WallState;
  setWall: (patch: Partial<WallState>) => void;
  pledge: PledgeState;
  setPledge: (patch: Partial<PledgeState>) => void;
}

const Ctx = createContext<Giving | null>(null);

export function GivingProvider({ children }: { children: ReactNode }){
  const [demo, setDemo] = useState<Pledge[]>([]);
  const [wall, setWall] = useState(WALL0);
  const [pledge, setPledge] = useState(PLEDGE0);

  const giving = useMemo(() => {
    const all = demo.concat(D.pledges);
    const extra: Record<string, number> = {}, givers: Record<string, Set<string>> = {};
    for (const x of demo) extra[x.project] = (extra[x.project] || 0) + x.amount;
    for (const x of all) (givers[x.project] ||= new Set()).add(x.donor);
    const raisedOf = (p: Project) => p.raised + (extra[p.id] || 0);
    return {
      demo, all, raisedOf,
      giversOf: (pid: string) => givers[pid]?.size || 0,
      deptRaised: (id: string) => D.projects.filter(p => p.dept===id).reduce((a,p) => a + raisedOf(p), 0),
      totalRaised: D.meta.raised + demo.reduce((a,x) => a + x.amount, 0),
      giverCount: D.meta.givers + demo.length,
    };
  }, [demo]);

  const value = useMemo<Giving>(() => ({
    ...giving,
    addPledge: x => setDemo(d => [x, ...d]),
    wall, setWall: patch => setWall(w => ({ ...w, ...patch })),
    pledge, setPledge: patch => setPledge(p => ({ ...p, ...patch })),
  }), [giving, wall, pledge]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGiving(): Giving {
  const g = useContext(Ctx);
  if (!g) throw new Error('useGiving must be used inside GivingProvider');
  return g;
}
