const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));

const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use("/api", applicationRoutes);
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Sever running at http://localhost:${port}`);
});
