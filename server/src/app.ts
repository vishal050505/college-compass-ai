import express from "express";
import cors from "cors";
import collegeRoutes from "./routes/collegeRoutes";
import predictorRoutes from "./routes/predictorRoutes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "College Compass AI Backend Running ✅" });
});

app.use("/api/colleges", collegeRoutes);
app.use("/api/predictor", predictorRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;