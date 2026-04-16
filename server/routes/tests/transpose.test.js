import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import transposeRouter from "../transpose.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/", transposeRouter);
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
  transpositionKey: "+2: Bb",
};

describe("POST /api/transpose", () => {
  it("returns 200 with transposed scale data for a valid config", async () => {
    const app = buildApp();
    const res = await request(app).post("/").send(validConfig);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("key");
    expect(res.body).toHaveProperty("firstMeasure");
    expect(res.body).toHaveProperty("secondMeasure");
    expect(res.body).toHaveProperty("tonic");
    expect(res.body).toHaveProperty("octaveTranspose");
  });

  it("C concert pitch transposed by +2: Bb returns D as the new tonic", async () => {
    const app = buildApp();
    const res = await request(app).post("/").send(validConfig);
    expect(res.body.tonic).toBe("D");
  });

  it("returns 400 when the transposition key token is invalid", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/")
      .send({ ...validConfig, transpositionKey: null });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
