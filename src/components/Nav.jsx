import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/science', label: 'Science' },
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
  { to: '/beta', label: 'Beta' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-3xl font-black tracking-[4px] text-green no-underline">RIFLT™</Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm no-underline transition-colors ${pathname === l.to ? 'text-white font-semibold' : 'text-muted hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
          <a href="https://riflt-mvp.vercel.app" target="_blank" rel="noopener noreferrer"
            className="bg-accent hover:bg-accent-light text-white text-sm font-semibold px-5 py-2 rounded-lg no-underline transition-colors">
            Open App
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white text-2xl bg-transparent border-none cursor-pointer">
          {open ? '\u2715' : '\u2630'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-border px-6 pb-6">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block py-3 text-base no-underline border-b border-border/50 ${pathname === l.to ? 'text-white font-semibold' : 'text-muted'}`}>
              {l.label}
            </Link>
          ))}
          <a href="https://riflt-mvp.vercel.app" target="_blank" rel="noopener noreferrer"
            className="block mt-4 text-center bg-accent text-white font-semibold py-3 rounded-lg no-underline">
            Open App
          </a>
        </div>
      )}
    </nav>
  );
}
