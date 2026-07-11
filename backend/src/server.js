import express from "express"
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";  
import { clerkMiddleware } from '@clerk/express';
import { inngest,functions } from "./lib/inngest.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from  "./routes/chatRoutes.js";


const app = express();

const __dirname = path.resolve();

// middleware

app.use(express.json())


app.use(cors({ origin:ENV.CLIENT_URL,credentials:true })); //credentials:true means server allows a browser to include cookies on req
app.use(clerkMiddleware()); // this adds auth field to request object : req.auth()


app.use("/api/inngest",serve({client:inngest , functions }));
app.use("/api/chat", chatRoutes)



app.get("/health", (req, res) => {
  res.status(200).json({ message: "success from api" });
});




// ready for delpoyment

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
  });

}

const startServer = async () => {
  try {
    await connectDB();  
    app.listen(ENV.PORT, () => {
  console.log("server is running on port ", ENV.PORT);
  
  });
  } 
  catch (error) {
    console.error("❌Connection failed due to ", error);
    process.exit(1); // Exit the process with an error code 0=sucess, 1=error
  }
};

startServer();

    