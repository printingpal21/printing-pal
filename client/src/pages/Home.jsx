import { Link } from "react-router-dom";
import hero from "../assets/logo.svg";

export default function Home(){
  return (
    <section className="bg-gradient-to-r from-brandPink via-brandPurple to-brandBlue text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <img src={hero} className="w-56 drop-shadow-xl" />
        <div>
          <h2 className="text-4xl font-extrabold mb-3">Print it your way with <span className="underline">Printing Pal</span></h2>
          <p className="opacity-90">Fast, friendly, PH-based printing for stickers, flyers, labels, and more.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/products" className="px-4 py-2 bg-white text-brandPurple rounded-lg font-semibold">Shop Now</Link>
            <Link to="/contact" className="px-4 py-2 border border-white rounded-lg">Get in touch</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
