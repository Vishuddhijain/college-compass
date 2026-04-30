import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import collegeRoutes from "./routes/colleges";
import savedRoutes from "./routes/saved";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL. Create backend/.env and set DATABASE_URL.");
}

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET. Create backend/.env and set JWT_SECRET.");
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/saved", savedRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
