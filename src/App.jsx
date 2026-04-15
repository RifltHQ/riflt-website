import { HashRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Science from './pages/Science';
import Features from './pages/Features';
import About from './pages/About';
import Beta from './pages/Beta';
import './index.css';

export default function App() {
  return (
    <HashRouter>
      <Nav />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/science" element={<Science />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/beta" element={<Beta />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
