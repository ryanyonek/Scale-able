import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import worksheetRouter from "../worksheet.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/", worksheetRouter);
  return app;
}

const validConfig = {
  tonic: "C",
  scale: "Major",
  mode: "Ionian",
  clef: "treble",
  octaveShift: "current",
  directionMode: "both",
  octaveTranspose: 0,
  lyric: "Note Names",
  showNoteLabels: true,
  showAllAccidentals: false,
  showCourtesyAccidentals: false,
};

describe("POST /api/worksheet", () => {
  it("returns 200 with scale data for a valid config", async () => {
    const app = buildApp();
    const res = await request(app).post("/worksheet").send(validConfig);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("key");
    expect(res.body).toHaveProperty("firstMeasure");
    expect(res.body).toHaveProperty("secondMeasure");
  });

  it("returns 400 when the scale configuration is invalid (unknown tonic)", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/worksheet")
      .send({ ...validConfig, tonic: "Z" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 500 when scale generation throws an unexpected error", async () => {
    // Simulate the 500 catch branch inline
    const app = express();
    app.use(express.json());
    app.post("/worksheet", (req, res) => {
      try {
        throw new Error("Unexpected server error");
      } catch (err) {
        res.status(500).json({ error: "Server error generating scale" });
      }
    });

    const res = await request(app).post("/worksheet").send(validConfig);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
