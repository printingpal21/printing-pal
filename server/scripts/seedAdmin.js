import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config.js";
import User from "../src/models/User.js";
dotenv.config();

async function run(){
  await connectDB();
  const email = process.env.ADMIN_EMAIL || "admin@printingpal.local";
  const password = process.env.ADMIN_PASSWORD || "Print!ngPal2025";
  let u = await User.findOne({ email });
  const hash = await bcrypt.hash(password, 10);
  if(!u){
    u = await User.create({ email, passwordHash: hash, role:"admin", name:"Printing Pal Admin" });
    console.log("Admin created:", email);
  }else{
    u.passwordHash = hash;
    u.role="admin";
    await u.save();
    console.log("Admin updated:", email);
  }
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
