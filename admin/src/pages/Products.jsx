import { useEffect, useState } from "react";
import api from "../api";

export default function Products(){
  const [items,setItems] = useState([]);
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState({ name:"", description:"", price:0, images:[], isCustomizable:false, tags:"" });
  const [uploading,setUploading] = useState(false);
  const [uploadStatus,setUploadStatus] = useState([]); // [{name,status:"uploading"|"done"|"error", url?, error?}]

  async function load(){ const res = await api.get("/api/products"); setItems(res.data); }
  useEffect(()=>{ load(); },[]);

  function startNew(){
    setEditing(null);
    setForm({ name:"", description:"", price:0, images:[], isCustomizable:false, tags:"" });
    setUploadStatus([]);
  }
  function startEdit(p){
    setEditing(p._id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || 0,
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
      isCustomizable: !!p.isCustomizable,
      tags: (p.tags||[]).join(",")
    });
    setUploadStatus([]);
  }

  async function onUpload(e){
    const files = Array.from(e.target.files || []);
    if(files.length===0) return;

    // initialize status list
    const start = files.map(f => ({ name:f.name, status:"uploading" }));
    setUploadStatus(prev => [...prev, ...start]);
    setUploading(true);

    try{
      const uploadedUrls = [];
      for (let i=0; i<files.length; i++){
        const f = files[i];
        try{
          const fd = new FormData();
          fd.append("file", f);              // server expects "file"
          const up = await api.post("/api/uploads", fd); // must return { url: "https://..." }
          const url = up?.data?.url;
          if(!url) throw new Error("Upload response missing url");
          uploadedUrls.push(url);

          // mark this file done
          setUploadStatus(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(x => x.name === f.name && x.status === "uploading");
            if (idx !== -1) copy[idx] = { ...copy[idx], status:"done", url };
            return copy;
          });
        }catch(err){
          setUploadStatus(prev => {
            const copy = [...prev];
            const idx = copy.findIndex(x => x.name === f.name && x.status === "uploading");
            if (idx !== -1) copy[idx] = { ...copy[idx], status:"error", error: (err?.response?.data?.error || err.message) };
            return copy;
          });
        }
      }

      // append successes into product images
      if (uploadedUrls.length){
        setForm(prev => ({ ...prev, images: [...(prev.images||[]), ...uploadedUrls] }));
      }
    } finally {
      setUploading(false);
      // clear the file input so choosing the same file again works
      e.target.value = "";
    }
  }

  function removeImage(idx){
    setForm(prev => ({ ...prev, images: prev.images.filter((_,i)=>i!==idx)}));
  }
  function setAsCover(idx){
    setForm(prev => {
      const arr = [...(prev.images||[])];
      const [chosen] = arr.splice(idx,1);
      arr.unshift(chosen);
      return { ...prev, images: arr };
    });
  }

  async function save(e){
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price)||0,
      images: form.images || [],
      isCustomizable: !!form.isCustomizable,
      tags: (form.tags||"").split(",").map(s=>s.trim()).filter(Boolean)
    };
    if(editing){
      await api.put(`/api/products/${editing}`, payload);
    }else{
      await api.post("/api/products", payload);
    }
    await load(); startNew();
  }

  async function remove(id){
    if(!confirm("Delete this product?")) return;
    await api.delete(`/api/products/${id}`);
    await load();
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h3>{editing ? "Edit product" : "New product"}</h3>
        <form onSubmit={save} className="grid" style={{gap:10}}>
          <label>Name</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>

          <label>Description</label>
          <textarea rows="3" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>

          <label>Price (₱)</label>
          <input type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>

          <label>Tags (comma separated)</label>
          <input value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})}/>

          <label>
            <input type="checkbox" checked={!!form.isCustomizable} onChange={e=>setForm({...form, isCustomizable:e.target.checked})}/>
            {" "}Customizable
          </label>

          <div>
            <div className="toolbar" style={{marginBottom:8}}>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.pdf"
                multiple
                onChange={onUpload}
              />
              {uploading && <span>Uploading…</span>}
            </div>

            {/* Upload status list */}
            {uploadStatus.length > 0 && (
              <div style={{marginBottom:8}}>
                {uploadStatus.map((u,i)=>(
                  <div key={i} style={{fontSize:12, color: u.status==="error" ? "#b91c1c" : "#64748b"}}>
                    {u.status==="uploading" && "⬆️ Uploading"}{u.status==="done" && "✅ Uploaded"}{u.status==="error" && "❌ Failed"} — {u.name}
                    {u.error ? ` (${u.error})` : ""}
                  </div>
                ))}
              </div>
            )}

            {/* Thumbnails + controls */}
            <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
              {(form.images||[]).map((u,i)=>(
                <div key={i} className="card" style={{padding:6, width:150}}>
                  <div style={{fontSize:12, marginBottom:6, color:"#64748b"}}>{i===0 ? "Cover" : "Image"}</div>
                  {/\.pdf($|\?)/i.test(u)
                    ? <a href={u} target="_blank" rel="noreferrer">Open PDF</a>
                    : <img src={u} style={{width:"100%", height:90, objectFit:"cover", borderRadius:8}}/>
                  }
                  <div className="toolbar" style={{marginTop:8}}>
                    {i!==0 && <button type="button" className="btn secondary" onClick={()=>setAsCover(i)}>Set cover</button>}
                    <button type="button" className="btn danger" onClick={()=>removeImage(i)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="toolbar" style={{marginTop:8}}>
            <button className="btn">{editing ? "Update" : "Create"}</button>
            {editing && <button type="button" className="btn secondary" onClick={startNew}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Products</h3>
        <table>
          <thead><tr><th>Name</th><th>Price</th><th>Type</th><th>Images</th><th></th></tr></thead>
          <tbody>
            {items.map(p=>(
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₱{(p.price||0).toFixed(2)}</td>
                <td>{p.isCustomizable ? <span className="badge">Customizable</span> : "Standard"}</td>
                <td>{p.images?.length||0}</td>
                <td className="toolbar">
                  <button className="btn secondary" onClick={()=>startEdit(p)}>Edit</button>
                  <button className="btn danger" onClick={()=>remove(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length===0 && <p style={{marginTop:10}}>No products yet.</p>}
      </div>
    </div>
  );
}
