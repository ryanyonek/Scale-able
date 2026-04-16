import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Links from "../Links.jsx";

function renderLinks(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Links />
    </MemoryRouter>
  );
}

describe("Links", () => {
  it("renders the Scale Viewer nav link", () => {
    renderLinks();
    expect(screen.getByRole("link", { name: /Scale Viewer/i })).toBeInTheDocument();
  });

  it("renders the Transpose nav link", () => {
    renderLinks();
    expect(screen.getByRole("link", { name: /Transpose/i })).toBeInTheDocument();
  });

  it("renders the Worksheet nav link", () => {
    renderLinks();
    expect(screen.getByRole("link", { name: /Worksheet/i })).toBeInTheDocument();
  });

  it("Scale Viewer link has the active class when on the '/' route", () => {
    renderLinks("/");
    const link = screen.getByRole("link", { name: /Scale Viewer/i });
    expect(link.className).toContain("active-link");
  });

  it("Scale Viewer link does not have the active class when on a different route", () => {
    renderLinks("/transpose");
    const link = screen.getByRole("link", { name: /Scale Viewer/i });
    expect(link.className).not.toContain("active-link");
  });
});
