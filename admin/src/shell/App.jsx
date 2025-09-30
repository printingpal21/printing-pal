import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function App(){
  const nav = useNavigate();
  function logout(){
    localStorage.removeItem("pp_admin_token");
    nav("/login");
  }
  return (
    <>
      <header>
        <div className="container" style={{display:"flex", alignItems:"center", gap:16}}>
          <div style={{fontWeight:800, fontSize:18,
            background:"linear-gradient(90deg, var(--brand-pink), var(--brand-purple), var(--brand-blue))",
            WebkitBackgroundClip:"text", color:"transparent"}}
          >
            Printing Pal • Admin
          </div>
          <nav className="nav" style={{marginLeft:"auto"}}>
            <NavLink to="/" end className={({isActive})=> isActive ? "active" : ""}>Dashboard</NavLink>
            <NavLink to="/products" className={({isActive})=> isActive ? "active" : ""}>Products</NavLink>
            <NavLink to="/quotes" className={({isActive})=> isActive ? "active" : ""}>Quotes</NavLink>
            <a href="#" onClick={(e)=>{e.preventDefault();logout();}}>Logout</a>
          </nav>
        </div>
      </header>
      <div className="container" style={{paddingTop:16}}>
        <Outlet/>
      </div>
    </>
  );
}
