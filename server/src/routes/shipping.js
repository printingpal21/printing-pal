import express from "express";
const router = express.Router();

const RATES = [
  { name:"J&T Express",    base: 70, perKg: 40 },
  { name:"Flash Express",  base: 65, perKg: 45 },
  { name:"LBC",            base: 80, perKg: 35 },
];

router.get("/quote", (req,res)=>{
  const weight = Math.max(0.25, parseFloat(req.query.weight || "0.5"));
  const quotes = RATES.map(r => ({
    courier: r.name,
    price: Math.round((r.base + r.perKg * Math.max(0, weight-1)) * 100)/100
  }));
  const cheapest = quotes.reduce((a,b)=> a.price<b.price ? a : b );
  res.json({ quotes, cheapest });
});

export default router;
