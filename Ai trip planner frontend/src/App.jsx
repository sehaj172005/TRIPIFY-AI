import Header from "./components/ui/Header";
import Hero from "./components/ui/Hero";
import { Plane, Twitter, Github, Mail } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">Tripify AI</span>
              <span className="text-gray-600 text-sm ml-2">— Your AI travel companion</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Contact</a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Tripify AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
