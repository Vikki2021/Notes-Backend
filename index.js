import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI,{
  })
  .then(() => {
    console.log("Connected to mongoDB")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// to make input as json
app.use(express.json())
app.use(cors({ origin: "https://notes-frontend-sable.vercel.app", methods:["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
  ,credentials: true }))
// app.use(cors());

app.listen(5000, () => {
  console.log("Server is running on port 5000")
})

// import routes
import authRouter from "./routes/auth.route.js"
import noteRouter from "./routes/note.route.js"

app.use("/api/auth", authRouter)
app.use("/api/note", noteRouter)

// error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Serer Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
