// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import "dotenv/config";
// import dns from "dns";
// import connectDB from "./src/Config/db.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import authRouter from "./src/Routes/Auth.routes.js";
// import productRouter from "./src/Routes/Product.routes.js";
// import orderRouter from "./src/Routes/Order.routes.js";
// import wishlistRouter from "./src/Routes/Wishlist.routes.js";
// import settingRouter from "./src/Routes/Setting.routes.js";
// import aiRouter from "./src/Routes/Ai.routes.js";

// const app = express();
// const server = http.createServer(app);

// // ─── 1. CORS CONFIGURATION ────────────────────────────────────────────
// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   "http://localhost:5173",
//   "https://vegetable-ecommrnce-backend.vercel.app",
// ].filter(Boolean);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error(`CORS policy: Origin ${origin} not allowed`));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ─── 2. SOCKET.IO SETUP ──────────────────────────────────────────────
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   // Admin client jab connect hoga to admin room join karega
//   socket.on("join-admin-room", () => {
//     socket.join("admin-room");
//   });
// });

// // Controllers mein emit karne ke liye io instance inject karo
// app.set("io", io);

// // ─── 3. BODY PARSERS ──────────────────────────────────────────────────
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());

// // ─── 4. ROUTES ────────────────────────────────────────────────────────
// app.use("/api/auth", authRouter);
// app.use("/api/product", productRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/wishlist", wishlistRouter);
// app.use("/api/settings", settingRouter);
// app.use("/api/ai", aiRouter);

// if (process.env.ENV !== "production") {
//   dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
// }

// connectDB();
// const PORT = process.env.PORT || 3000;

// // app.listen ki jagah server.listen use hoga taake WebSocket request bhi handle ho sakein
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import dns from "dns";
import connectDB from "./src/Config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./src/Routes/Auth.routes.js";
import productRouter from "./src/Routes/Product.routes.js";
import orderRouter from "./src/Routes/Order.routes.js";
import wishlistRouter from "./src/Routes/Wishlist.routes.js";
import settingRouter from "./src/Routes/Setting.routes.js";
import aiRouter from "./src/Routes/Ai.routes.js";

const app = express();
const server = http.createServer(app);

// ─── 1. CORS CONFIGURATION ────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://vegetable-ecommrnce-backend.vercel.app",
  "https://sabzi-mandi.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── 2. SOCKET.IO SETUP ──────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected to Socket:", socket.id);

  socket.on("join-admin-room", () => {
    socket.join("admin-room");
    console.log(`👤 Socket ${socket.id} successfully joined: admin-room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Controllers ke liye io instance inject kiya
app.set("io", io);

// ─── 3. BODY PARSERS ──────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ─── 4. ROUTES ────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/settings", settingRouter);
app.use("/api/ai", aiRouter);

if (process.env.ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
}

app.get("/", (req, res) => {
  res.send("Vegetable Server running successfully ...")
});

connectDB();
const PORT = process.env.PORT || 3000;

// SERVER.LISTEN LAZMI HAI (app.listen se web-sockets listen nahi hotay)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});