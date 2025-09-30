import express from "express";
import Order from "../models/Order.js";
const router = express.Router();

router.post("/", async (req,res)=>{
  const { items, total, paymentMethod="COD", shippingAddress, courier } = req.body;
  const o = await Order.create({ items, total, paymentMethod, shippingAddress, courier, status:"pending" });
  res.json(o);
});

export default router;
