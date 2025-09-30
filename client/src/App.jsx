import { Outlet, Link } from "react-router-dom";
import logo from "./assets/logo.svg";

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={logo} alt="Printing Pal" className="w-10 h-10"/>
          <h1 className="text-xl font-bold bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue bg-clip-text text-transparent">Printing Pal</h1>
          <nav className="ml-auto flex gap-4">
            <Link to="/" className="hover:text-brandPurple">Home</Link>
            <Link to="/products" className="hover:text-brandPurple">Products</Link>
            <Link to="/about" className="hover:text-brandPurple">About</Link>
            <Link to="/contact" className="hover:text-brandPurple">Contact</Link>
            <Link to="/cart" className="px-3 py-1 rounded-full bg-brandBlue text-white">Cart</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet/>
      </main>
      <footer className="mt-10 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">
          © {(new Date()).getFullYear()} Printing Pal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
