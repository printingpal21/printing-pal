// server/src/index.js  (or app.js if that's your entry)
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import uploadsRouter from "./routes/uploads.js"; // our Cloudinary uploader

// --- App setup
const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow client (5173) and admin (5174)
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : [/^http:\/\/localhost:\d+$/],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Health
app.get("/", (req, res) => res.json({ ok: true, name: "Printing Pal API" }));

// Uploads
app.use("/api/uploads", uploadsRouter);

// --- Mount other routes if they exist (won't crash if missing)
(async () => {
  const optional = [
    ["auth", "/api/auth"],
    ["products", "/api/products"],
    ["quotes", "/api/quotes"],
    ["cart", "/api/cart"],
  ];
  for (const [name, path] of optional) {
    try {
      const mod = await import(`./routes/${name}.js`);
      if (mod?.default) {
        app.use(path, mod.default);
        console.log(`✅ Mounted ${path}`);
      }
    } catch {
      // Route file not found — that's fine
    }
  }
})();

// --- DB + start
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI missing in server/.env");
  process.exit(1);
}
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

export default app;
