import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import chatRoutes from "./routes/chat.route.js"
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
import cors from 'cors'
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://stream-video-chat.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes)

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   })
// }

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
  });
});
