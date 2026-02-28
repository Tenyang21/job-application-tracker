import express from "express";
import applicationRoutes from "./routes/applicationRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = 5000;

import cors from "cors";
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use("/api", applicationRoutes);
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Sever running at http://localhost:${port}`);
});
