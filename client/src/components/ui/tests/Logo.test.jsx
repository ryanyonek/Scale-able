import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import Logo from "../Logo.jsx";

// Wrap with MemoryRouter because Logo uses <Link>
const renderLogo = (props = {}) =>
  render(
    <MemoryRouter>
      <Logo onClick={vi.fn()} toggleMenu={false} {...props} />
    </MemoryRouter>
  );

describe("Logo", () => {
  it("renders an image with the Scale-able alt text", () => {
    renderLogo();
    expect(screen.getByAltText("Scale-able Logo")).toBeInTheDocument();
  });

  it("the logo image is an <img> element", () => {
    renderLogo();
    expect(screen.getByRole("img", { name: /Scale-able Logo/i })).toBeInTheDocument();
  });

  it("the logo links to the home route '/'", () => {
    renderLogo();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("the logo image is wrapped inside the link", () => {
    renderLogo();
    const link = screen.getByRole("link");
    const img = screen.getByRole("img", { name: /Scale-able Logo/i });
    expect(link).toContainElement(img);
  });
});
