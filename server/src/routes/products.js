import express from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";
import slugify from "slugify";
const router = express.Router();

router.post("/", requireAdmin, async (req,res)=>{
  const { name, description, price, images=[], isCustomizable=false, tags=[] } = req.body;
  const slug = slugify(name, { lower:true, strict:true });
  const p = await Product.create({ name, description, price, images, isCustomizable, tags, slug });
  res.json(p);
});

router.put("/:id", requireAdmin, async (req,res)=>{
  const update = req.body;
  if(update.name) update.slug = slugify(update.name, { lower:true, strict:true });
  const p = await Product.findByIdAndUpdate(req.params.id, update, { new:true });
  res.json(p);
});

router.delete("/:id", requireAdmin, async (req,res)=>{
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

router.get("/", async (req,res)=>{
  const { q, tag } = req.query;
  const filter = {};
  if(q) filter.name = { $regex: q, $options:"i" };
  if(tag) filter.tags = tag;
  const list = await Product.find(filter).sort({ createdAt:-1 });
  res.json(list);
});

router.get("/:slug", async (req,res)=>{
  const p = await Product.findOne({ slug: req.params.slug });
  if(!p) return res.status(404).json({error:"Not found"});
  res.json(p);
});

export default router;
