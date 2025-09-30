import { useEffect, useState } from "react";
import api from "../api";

export default function Quotes(){
  const [items,setItems] = useState([]);
  const [busy,setBusy] = useState(false);

  async function load(){ const res = await api.get("/api/quotes"); setItems(res.data); }
  useEffect(()=>{ load(); },[]);

  async function act(id, action, amount){
    setBusy(true);
    try{
      const payload = { action };
      if (action === "accept" || action === "lower") payload.amount = Number(amount)||0;
      await api.patch(`/api/quotes/${id}/admin`, payload);
      await load();
    } finally { setBusy(false); }
  }

  return (
    <div className="card">
      <h3>Quote Requests</h3>
      <table>
        <thead>
          <tr>
            <th>Submitted</th>
            <th>Customer</th>
            <th>Notes</th>
            <th>File</th>
            <th>Status / Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(q=>(
            <tr key={q._id}>
              <td>{new Date(q.createdAt).toLocaleString()}</td>
              <td>
                <div>{q.customerName}</div>
                <div style={{fontSize:12, color:"#64748b"}}>{q.customerEmail}</div>
              </td>
              <td style={{maxWidth:320, whiteSpace:"pre-wrap"}}>{q.notes}</td>
              <td>{q.fileUrl ? <a href={q.fileUrl} target="_blank" rel="noreferrer">Open</a> : "-"}</td>
              <td>
                {q.status}
                {typeof q.amount === "number" ? ` (₱${q.amount})` : ""}
                {typeof q.counterAmount === "number" ? ` / counter ₱${q.counterAmount}` : ""}
              </td>
              <td className="toolbar">
                <button disabled={busy} className="btn"
                  onClick={()=>act(q._id,"accept", prompt("Accept for amount (₱):", q.amount ?? 0))}>
                  Accept
                </button>
                <button disabled={busy} className="btn secondary"
                  onClick={()=>act(q._id,"lower", prompt("Lower quote to (₱):", q.amount ?? 0))}>
                  Lower
                </button>
                <button disabled={busy} className="btn danger" onClick={()=>act(q._id,"reject")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length===0 && <p style={{marginTop:12}}>No quotes yet.</p>}
    </div>
  );
}
