import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroller from "@/components/layout/SmoothScroller";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalCanvas from "@/components/three/GlobalCanvas";

import Home from "@/pages/Home";
import Figure from "@/pages/Figure";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalCanvas />
      <SmoothScroller>
        <Navbar />
        <main className="w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/figure" element={<Figure />} />
          </Routes>
        </main>
        <Footer />
      </SmoothScroller>
    </BrowserRouter>
  );
}
