import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";  
import { clerkMiddleware } from '@clerk/express';
import { inngest,functions } from "./lib/inngest.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from  "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());

// credentials:true means server allows a browser to include cookies on req
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object : req.auth()

app.use("/api/inngest",serve({client:inngest , functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({ message: "success from api" });
});

// ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  // });
}

// Start server locally if not on Vercel
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {

  // Connect to DB locally on startup
  connectDB().catch((err) => {
    console.error("❌ Database connection failed on startup:", err);
  });

  const PORT = ENV.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
