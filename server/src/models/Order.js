import mongoose from "mongoose";
const ItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  qty: Number,
});
const OrderSchema = new mongoose.Schema({
  items: [ItemSchema],
  total: Number,
  paymentMethod: { type: String, enum: ["COD","GCash","BankTransfer","PayMaya"], default: "COD" },
  shippingAddress: {
    fullName: String, phone: String,
    street: String, city: String, province: String, postal: String
  },
  courier: { type: String },
  status: { type: String, enum: ["pending","paid","shipped","delivered","cancelled"], default: "pending" }
},{ timestamps:true });
export default mongoose.model("Order", OrderSchema);
