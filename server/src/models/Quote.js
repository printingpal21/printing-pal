import mongoose from "mongoose";
const QuoteSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  customerName: String,
  customerEmail: String,
  notes: String,
  fileUrl: String,
  status: {
    type: String,
    enum: ["pending","accepted","lowered","rejected","customer_accepted","customer_rejected","customer_counter"],
    default: "pending"
  },
  amount: { type: Number },
  counterAmount: { type: Number },
},{ timestamps:true });
export default mongoose.model("Quote", QuoteSchema);
