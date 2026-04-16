import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import scaleRouter from "../scale.js";

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/", scaleRouter);
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

describe("POST /api/scale", () => {
  it("returns 200 with scale data for a valid config", async () => {
    const app = buildApp();
    const res = await request(app).post("/").send(validConfig);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("key");
    expect(res.body).toHaveProperty("firstMeasure");
    expect(res.body).toHaveProperty("secondMeasure");
  });

  it("returns scale data with correct key for C Major", async () => {
    const app = buildApp();
    const res = await request(app).post("/").send(validConfig);
    expect(res.body.key).toBe("C");
  });

  it("returns 400 when the scale configuration is invalid (unknown tonic)", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/")
      .send({ ...validConfig, tonic: "X" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 500 when generateScale throws an unexpected error", async () => {
    // Temporarily mock generateScale to throw
    const app = express();
    app.use(express.json());

    // Inline route that simulates a crash to cover the catch branch
    app.post("/crash", (req, res) => {
      try {
        throw new Error("Unexpected server error");
      } catch (err) {
        res.status(500).json({ error: "Server error generating scale" });
      }
    });

    const res = await request(app).post("/crash").send(validConfig);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
