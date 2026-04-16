import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import App from "./App.jsx";

// Mock NavBar — it creates its own BrowserRouter and renders heavy pages
vi.mock("./components/ui/NavBar.jsx", () => ({
  default: () => <div data-testid="navbar" />,
}));

// Mock Footer — avoids any rendering side effects
vi.mock("./components/ui/Footer.jsx", () => ({
  default: () => <div data-testid="footer" />,
}));

describe("App", () => {
  it("renders NavBar and Footer", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
