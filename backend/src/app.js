import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { fileURLToPath } from "url";
import cors from "cors";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);

// Routes
import userRoutes from "./admin/user/user.routes.js";
import shopRequestRoutes from "./admin/shopRequest/shopRequest.routes.js";
import planningRoutes from "./admin/planning/planning.routes.js";

dotenv.config({
    path: path.join(currentDir, '..', '..', '.env')
});

const FRONTEND_BASE_URL = String(process.env.FRONTEND_BASE_URL);

const corsOption = {
  origin: [FRONTEND_BASE_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
};

const app = express();

app.use(helmet())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOption));
app.use(cookieParser(cookieOptions));

// 404 + erreurs
// app.use(notFound);
// app.use(errorHandler);


app.get("/", (req, res) => {
    res.send("API is running");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/shop-requests", shopRequestRoutes);
app.use("/api/planning", planningRoutes);

export default app;
