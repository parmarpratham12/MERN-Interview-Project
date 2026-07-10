import express from "express"
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";


const app = express();

const __dirname = path.resolve();


app.get("/health", (req, res) => {
  res.status(200).json({ message: "success from api" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ message: "this is a book endpoint" });
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

    