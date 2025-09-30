import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function firstImage(p) {
  return p?.images?.[0]
    || p?.image
    || p?.imageUrl
    || "https://picsum.photos/seed/printingpal-2/800/600";
}

export default function ProductDetail(){
  const { slug } = useParams();
  const [p,setP] = useState(null);
  const [qty,setQty] = useState(1);

  useEffect(()=>{ load(); },[slug]);
  async function load(){
    const res = await api.get(`/api/products/${slug}`);
    setP(res.data);
  }

  async function addToCart(){
    const cart = JSON.parse(localStorage.getItem("pp_cart")||"[]");
    cart.push({ product:p._id, name:p.name, price:p.price||0, qty });
    localStorage.setItem("pp_cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  if(!p) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <img src={firstImage(p)} alt={p.name} className="w-full rounded-xl border"/>
      <div>
        <h2 className="text-2xl font-bold">{p.name}</h2>
        <p className="text-gray-600 mt-2">{p.description}</p>
        <div className="mt-3 font-bold text-xl">₱{(p.price||0).toFixed(2)}</div>

        {!p.isCustomizable && (
          <div className="mt-4 flex gap-2 items-center">
            <input type="number" value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))} className="border rounded px-3 py-2 w-24"/>
            <button onClick={addToCart} className="px-4 py-2 rounded bg-brandBlue text-white">Add to Cart</button>
          </div>
        )}

        {p.isCustomizable && <QuoteForm productId={p._id} />}
      </div>
    </div>
  );
}

function QuoteForm({ productId }){
  const [hasDesign,setHasDesign] = useState(true);
  const [file,setFile] = useState(null);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [notes,setNotes] = useState("");
  const [msg,setMsg] = useState("");

  async function submit(e){
    e.preventDefault();

    // Validation according to the toggle
    if (hasDesign && !file) {
      alert("Please upload your design/layout file.");
      return;
    }
    if (!hasDesign && (!notes || notes.trim().length < 10)) {
      alert("Please add sizes and layout/design requests in the notes (at least 10 characters).");
      return;
    }

    try{
      let fileUrl = "";
      if(hasDesign && file){
        const form = new FormData();
        form.append("file", file);
        const up = await api.post("/api/uploads", form); // server returns { url }
        fileUrl = up.data.url;
      }

      await api.post("/api/quotes", {
        productId,
        customerName:name,
        customerEmail:email,
        notes,
        fileUrl
      });

      setMsg("Quote submitted! Quote review may take up to 4 hours – within the day.");
      setFile(null); setNotes(""); setName(""); setEmail("");
    }catch(e){
      setMsg(e.response?.data?.error || "Failed to submit quote");
    }
  }

  return (
    <div className="mt-6 border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Customizable — Request a Quote</h3>
      <p className="text-sm text-gray-600 mb-3">Quote review may take up to 4 hours – within the day.</p>

      <form onSubmit={submit} className="grid gap-3">
        <div className="flex items-center gap-3">
          <label className="font-medium">Have a design/layout?</label>
          <label className="flex items-center gap-2">
            <input type="radio" name="hasDesign" checked={hasDesign} onChange={()=>setHasDesign(true)} />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="hasDesign" checked={!hasDesign} onChange={()=>setHasDesign(false)} />
            <span>No</span>
          </label>
        </div>

        {hasDesign ? (
          <div className="grid gap-2">
            <label className="text-sm text-gray-700">Upload file (PNG, JPG, JPEG, PDF)</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={e=>setFile(e.target.files?.[0] || null)}
              className="border rounded px-3 py-2"
              required
            />
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No upload needed. Please include <b>all sizes and layout/design requests</b> in the order notes below.
          </p>
        )}

        <input className="border rounded px-3 py-2" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input type="email" className="border rounded px-3 py-2" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <textarea className="border rounded px-3 py-2" rows="4" placeholder="Notes / sizes / special requests" value={notes} onChange={e=>setNotes(e.target.value)} />
        <button className="px-4 py-2 rounded bg-brandPurple text-white">Request Quote</button>
      </form>

      <div className="text-sm mt-2">{msg}</div>
    </div>
  );
}
