import Link from 'next/link';
import { Arrow } from '@/components/ui';

export default function NotFound(){
  return <section className="ph"><div className="in">
    <h1>Page not found</h1><p>That page doesn&apos;t exist in this prototype.</p>
    <div className="cta"><Link className="btn btn-p" href="/">Back to the campaign <Arrow/></Link></div>
  </div></section>;
}
