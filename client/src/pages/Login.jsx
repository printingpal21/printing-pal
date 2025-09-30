import { useState } from "react";
import api from "../api";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post("/api/auth/login",{ email,password });
      setMsg("Logged in (token in console)");
      console.log("Token:", res.data.token);
    }catch(e){
      setMsg(e.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-brandPurple text-white rounded px-3 py-2">Login</button>
      </form>
      <p className="text-sm mt-3">{msg}</p>
    </div>
  );
}
