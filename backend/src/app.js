import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// Routes
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./admin/user/user.routes.js";
import shopRequestRoutes from "./admin/shopRequest/shopRequest.routes.js";
import planningRoutes from "./admin/planning/planning.routes.js";
import productsRoutes from "./customer/products/product.routes.js";

import {configureGoogleOAuth} from "@/auth/google.oauth.js";
import passport from "passport";


const CORS_ORIGIN = String(process.env.CORS_ORIGIN);

const corsOption = {
  origin: [CORS_ORIGIN],
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

app.use(passport.initialize());

configureGoogleOAuth();

// 404 + erreurs
// app.use(notFound);
// app.use(errorHandler);


app.get("/", (req, res) => {
    res.send("API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/shop-requests", shopRequestRoutes);
app.use("/api/planning", planningRoutes);
app.use("/api/product", productsRoutes);

export default app;
