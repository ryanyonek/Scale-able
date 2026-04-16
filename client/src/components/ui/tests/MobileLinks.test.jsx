import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import MobileLinks from "../MobileLinks.jsx";

function renderMobileLinks(onClick = vi.fn(), initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MobileLinks onClick={onClick} mobileLinksStyle={{ width: "100%", display: "block" }} />
    </MemoryRouter>
  );
}

describe("MobileLinks", () => {
  it("renders the Scale Viewer link", () => {
    renderMobileLinks();
    expect(screen.getByRole("link", { name: /Scale Viewer/i })).toBeInTheDocument();
  });

  it("renders the Transpose link", () => {
    renderMobileLinks();
    expect(screen.getByRole("link", { name: /Transpose/i })).toBeInTheDocument();
  });

  it("renders the Worksheet link", () => {
    renderMobileLinks();
    expect(screen.getByRole("link", { name: /Worksheet/i })).toBeInTheDocument();
  });

  it("calls onClick when a link is clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderMobileLinks(onClick);
    await user.click(screen.getByRole("link", { name: /Scale Viewer/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it("Scale Viewer link has the active class when on the '/' route", () => {
    renderMobileLinks(vi.fn(), "/");
    const link = screen.getByRole("link", { name: /Scale Viewer/i });
    expect(link.className).toContain("active-link");
  });
});
