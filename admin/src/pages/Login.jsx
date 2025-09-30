import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post("/api/auth/login",{ email, password });
      if(res.data.role !== "admin"){ setMsg("Not an admin account"); return; }
      localStorage.setItem("pp_admin_token", res.data.token);
      nav("/");
    }catch(e){
      setMsg(e.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="container" style={{maxWidth:420}}>
      <div className="card">
        <h2>Admin Login</h2>
        <p className="badge" style={{margin:"8px 0"}}>Use the seeded admin from server/.env</p>
        <form onSubmit={submit} className="grid" style={{gap:10}}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@printingpal.local" />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          <button className="btn" style={{marginTop:6}}>Login</button>
        </form>
        <div style={{marginTop:10, color:"#ef4444"}}>{msg}</div>
      </div>
    </div>
  );
}
