import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import NavBar from "../NavBar.jsx";

// Mock page components to avoid fetch/VexFlow/Tone.js setup
vi.mock("../../../pages/Scale.jsx", () => ({
  default: () => <div data-testid="scale-page">Scale Page</div>,
}));
vi.mock("../../../pages/Transpose.jsx", () => ({
  default: () => <div data-testid="transpose-page">Transpose Page</div>,
}));
vi.mock("../../../pages/Worksheet.jsx", () => ({
  default: () => <div data-testid="worksheet-page">Worksheet Page</div>,
}));

// Mock nav sub-components with simple stubs (use <div> to avoid extra <nav> roles)
vi.mock("../Links.jsx", () => ({
  default: () => <div data-testid="desktop-links" />,
}));
vi.mock("../MobileLinks.jsx", () => ({
  default: ({ onClick }) => (
    <div data-testid="mobile-links" onClick={onClick} />
  ),
}));
vi.mock("../Logo.jsx", () => ({
  default: ({ onClick, toggleMenu }) => (
    <div data-testid="logo" data-toggle={String(toggleMenu)} onClick={onClick} />
  ),
}));

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Helper to set a simulated window width before each render
function setWindowWidth(width) {
  Object.defineProperty(window, "innerWidth", { writable: true, value: width });
}

describe("NavBar", () => {
  afterEach(() => {
    setWindowWidth(1024); // Reset to desktop width after each test
  });

  it("renders a <nav> element", () => {
    setWindowWidth(1024);
    render(<NavBar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("shows desktop links when window width is greater than 480", () => {
    setWindowWidth(1024);
    render(<NavBar />);
    expect(screen.getByTestId("desktop-links")).toBeInTheDocument();
  });

  it("does not show the hamburger menu on desktop width", () => {
    setWindowWidth(1024);
    render(<NavBar />);
    expect(screen.queryByText("☰")).not.toBeInTheDocument();
  });

  it("does not show desktop links on mobile width (≤ 480)", () => {
    setWindowWidth(320);
    render(<NavBar />);
    expect(screen.queryByTestId("desktop-links")).not.toBeInTheDocument();
  });

  it("shows the hamburger toggle button on mobile width (≤ 480)", () => {
    setWindowWidth(320);
    render(<NavBar />);
    expect(screen.getByText("☰")).toBeInTheDocument();
  });

  it("mobile links are hidden by default", () => {
    setWindowWidth(320);
    render(<NavBar />);
    expect(screen.queryByTestId("mobile-links")).not.toBeInTheDocument();
  });

  it("clicking the hamburger reveals mobile links", async () => {
    setWindowWidth(320);
    const user = userEvent.setup();
    render(<NavBar />);
    await user.click(screen.getByText("☰"));
    expect(screen.getByTestId("mobile-links")).toBeInTheDocument();
  });

  it("clicking the hamburger a second time hides mobile links", async () => {
    setWindowWidth(320);
    const user = userEvent.setup();
    render(<NavBar />);
    await user.click(screen.getByText("☰")); // open
    await user.click(screen.getByText("☰")); // close
    expect(screen.queryByTestId("mobile-links")).not.toBeInTheDocument();
  });

  it("renders the Scale page at the default route '/'", () => {
    setWindowWidth(1024);
    render(<NavBar />);
    expect(screen.getByTestId("scale-page")).toBeInTheDocument();
  });

  it("renders the Logo component", () => {
    setWindowWidth(1024);
    render(<NavBar />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });
});
