import express from "express";
import Quote from "../models/Quote.js";
import { requireAdmin } from "../middleware/auth.js";
const router = express.Router();

router.post("/", async (req,res)=>{
  const { productId, customerName, customerEmail, notes, fileUrl } = req.body;
  const q = await Quote.create({ product: productId, customerName, customerEmail, notes, fileUrl, status: "pending" });
  res.json(q);
});

router.patch("/:id/admin", requireAdmin, async (req,res)=>{
  const { action, amount } = req.body; // accept|lower|reject
  const q = await Quote.findById(req.params.id);
  if(!q) return res.status(404).json({error:"Not found"});
  if(action==="accept"){ q.status="accepted"; if (amount != null) q.amount = amount; }
  else if(action==="lower"){ q.status="lowered"; q.amount = amount; }
  else if(action==="reject"){ q.status="rejected"; }
  await q.save();
  res.json(q);
});

router.patch("/:id/customer", async (req,res)=>{
  const { action, counterAmount } = req.body; // accept|reject|counter
  const q = await Quote.findById(req.params.id);
  if(!q) return res.status(404).json({error:"Not found"});
  if(action==="accept"){ q.status="customer_accepted"; }
  else if(action==="reject"){ q.status="customer_rejected"; }
  else if(action==="counter"){ q.status="customer_counter"; q.counterAmount = counterAmount; }
  await q.save();
  res.json(q);
});

router.get("/", requireAdmin, async (_req,res)=>{
  const list = await Quote.find().sort({ createdAt:-1 });
  res.json(list);
});

export default router;
