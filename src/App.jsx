import { HashRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Science from './pages/Science';
import Features from './pages/Features';
import About from './pages/About';
import Beta from './pages/Beta';
import Signup from './pages/Signup';
import './index.css';

// F4 / PR-S4 routing changes:
//   - `/`        → Beta (was Home). Per spec, riflt.com lands on Beta for
//                  closed-beta posture.
//   - `/home`    → Home (preserved at a new URL — accessible directly,
//                  removed from Nav since `/` no longer points here).
//   - `/beta`    → Beta (still works; same component as `/`)
//   - `/signup`  → NEW. Promo-gated signup form. Not in nav, has noindex
//                  meta set on mount. Only reachable via Peggy's invitation
//                  links with ?promo=BETA-XXX-001.
//   - /science /features /about — unchanged, marketing story intact.

export default function App() {
  return (
    <HashRouter>
      <Nav />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Beta />} />
          <Route path="/home" element={<Home />} />
          <Route path="/science" element={<Science />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/beta" element={<Beta />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
