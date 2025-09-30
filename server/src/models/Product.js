import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: String,
  price: { type: Number, default: 0 },
  images: [{ type: String }],
  isCustomizable: { type: Boolean, default: false },
  tags: [String],
},{ timestamps:true });
export default mongoose.model("Product", ProductSchema);
