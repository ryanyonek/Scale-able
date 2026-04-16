import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ErrorBoundary from "../ErrorBoundary.jsx";

// A child that throws synchronously on render
function ThrowingChild() {
  throw new Error("Test render error");
}

// Suppress React's expected console.error output for error boundary tests
let consoleErrorSpy;
beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("ErrorBoundary", () => {
  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary fallback={<p>Error fallback</p>}>
        <span>Safe content</span>
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe content")).toBeInTheDocument();
    expect(screen.queryByText("Error fallback")).not.toBeInTheDocument();
  });

  it("renders the fallback prop when a child throws", () => {
    render(
      <ErrorBoundary fallback={<p>Custom error message</p>}>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("hides children and shows only the fallback after an error", () => {
    render(
      <ErrorBoundary fallback={<p>Fallback shown</p>}>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(screen.queryByText("Safe content")).not.toBeInTheDocument();
    expect(screen.getByText("Fallback shown")).toBeInTheDocument();
  });

  it("renders the default error message when no fallback prop is given and a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );
    expect(
      screen.getByText(/Something went wrong displaying this section/)
    ).toBeInTheDocument();
  });

  it("renders multiple children without error when none throw", () => {
    render(
      <ErrorBoundary fallback={<p>Error</p>}>
        <span>First</span>
        <span>Second</span>
      </ErrorBoundary>
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
