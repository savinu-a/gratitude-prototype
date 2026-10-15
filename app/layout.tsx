import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';
import Header, { Crest } from '@/components/Header';
import { GivingProvider } from '@/components/store';

export const metadata: Metadata = {
  title: { default:'Gratitude · University of Moratuwa', template:'%s · Gratitude' },
  description: 'Concept prototype of Gratitude, a giving platform for the University of Moratuwa.',
  robots: { index:false, follow:false },
};
export const viewport: Viewport = { width:'device-width', initialScale:1, viewportFit:'cover' };

export default function RootLayout({ children }: { children: ReactNode }){
  return <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@300;400;500;600&family=Albert+Sans:wght@300;400;500;600;700;800&display=swap"/>
    </head>
    <body>
      <div className="concept"><div className="in"><b>Concept</b><span>Prototype for the EXMO 2027 proposal, shown as an illustrative snapshot from December 2028. Not an official University of Moratuwa website. Projects, figures and names are hypothetical. Department photos: EXMO 2023.</span></div></div>
      <div className="util"><div className="in"><Link href="/leadership">Leadership</Link><Link href="/governance">Governance &amp; audits</Link><Link href="/boq">BOQ index</Link><Link href="/governance#faq">FAQ</Link></div></div>
      <GivingProvider>
        <Header/>
        <main id="app" tabIndex={-1}>{children}</main>
      </GivingProvider>
      <footer className="foot">
        <div className="in">
          <div><Link className="wm" href="/"><Crest/><span className="t" style={{ color:'#fff' }}><small>University of Moratuwa</small><strong>Gratitude</strong></span></Link><p style={{ margin:'16px 0 0', maxWidth:'36ch' }}>A permanent record of what alumni and partners have built for the university.</p></div>
          <div><h5>Give</h5><ul><li><Link href="/pledge">Pledge</Link></li><li><Link href="/#tiers">Ways to give</Link></li><li><Link href="/wall">Wall of Gratitude</Link></li></ul></div>
          <div><h5>Explore</h5><ul><li><Link href="/departments">Departments</Link></li><li><Link href="/legacy">Legacy</Link></li><li><Link href="/boq">BOQ index</Link></li></ul></div>
          <div><h5>Trust</h5><ul><li><Link href="/leadership">Leadership</Link></li><li><Link href="/governance">Governance &amp; audits</Link></li><li><Link href="/governance#faq">FAQ</Link></li></ul></div>
          <div className="legal"><span>gratitude.uom.lk · concept prototype</span><span>Figures and names are illustrative</span></div>
        </div>
      </footer>
    </body>
  </html>;
}
