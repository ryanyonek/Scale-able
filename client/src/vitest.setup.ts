import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import "./styles/main.scss";

afterEach(() => {
  cleanup();
});
