import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function firstImage(p) {
  // Support multiple shapes: images[], image, imageUrl; then a safe fallback
  return p?.images?.[0]
    || p?.image
    || p?.imageUrl
    || "https://picsum.photos/seed/printingpal-1/800/600";
}

export default function Products(){
  const [items,setItems] = useState([]);
  const [q,setQ] = useState("");

  useEffect(()=>{ load(); },[]);
  async function load(){
    const res = await api.get("/api/products");
    setItems(res.data);
  }
  async function search(e){
    e.preventDefault();
    const res = await api.get("/api/products",{ params: { q }});
    setItems(res.data);
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <form onSubmit={search} className="mb-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." className="border px-3 py-2 rounded w-full"/>
        <button className="px-3 py-2 rounded bg-brandPurple text-white">Search</button>
      </form>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map(p=>(
          <Link key={p._id} to={`/products/${p.slug}`} className="border rounded-lg overflow-hidden hover:shadow">
            <img src={firstImage(p)} alt={p.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">{p.isCustomizable ? "Customizable" : "Standard"}</div>
              <div className="mt-2 font-bold">₱{p.price?.toFixed(2) ?? "0.00"}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
