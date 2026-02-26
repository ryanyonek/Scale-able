import express from "express";
import cors from "cors";

import scaleRouter from "./routes/scale.js";
import transposeRouter from "./routes/transpose.js";
import worksheetRouter from "./routes/worksheet.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/scale", scaleRouter);
app.use("/api/transpose", transposeRouter);
app.use("/api/worksheet", worksheetRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});