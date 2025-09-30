import { useEffect, useState } from "react";

export default function Cart(){
  const [cart,setCart] = useState([]);
  useEffect(()=>{ setCart(JSON.parse(localStorage.getItem("pp_cart")||"[]")); },[]);
  const total = cart.reduce((s,i)=> s + (i.price * i.qty), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-3">Cart</h2>
      {cart.length===0 ? <p>Your cart is empty.</p> : (
        <>
          <ul className="divide-y">
            {cart.map((it,idx)=>(
              <li key={idx} className="py-3 flex justify-between">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.qty}</div>
                </div>
                <div className="font-semibold">₱{(it.price*it.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-bold">Total: ₱{total.toFixed(2)}</div>
          <p className="mt-4 text-sm text-gray-500">Payments accepted: COD (primary), GCash, Bank Transfer, PayMaya.</p>
        </>
      )}
    </div>
  );
}
