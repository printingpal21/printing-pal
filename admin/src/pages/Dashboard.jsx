import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard(){
  const [stats,setStats] = useState({ products:0, quotes:0 });

  useEffect(()=>{
    Promise.all([api.get("/api/products"), api.get("/api/quotes")])
      .then(([p,q])=> setStats({ products:p.data.length, quotes:q.data.length }))
      .catch(()=>{});
  },[]);

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card"><b>Products</b><div>{stats.products}</div></div>
      <div className="card"><b>Quotes (all)</b><div>{stats.quotes}</div></div>
      <div className="card">
        <b>Payment Options</b>
        <ul>
          <li>COD (primary)</li>
          <li>GCash</li>
          <li>Bank Transfer</li>
          <li>PayMaya</li>
        </ul>
      </div>
    </div>
  );
}
