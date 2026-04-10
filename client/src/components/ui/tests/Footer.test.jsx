import Footer from "../Footer";
import { render, screen } from "@testing-library/react";

describe("Footer.jsx", () => {
  it("should render the main footer text", () => {
    render(<Footer />);
    expect(screen.getByText(/© ryan yonek 2026/i)).toBeInTheDocument();
  });

  it("should render the github text", () => {
    render(<Footer />);
    expect(screen.getByText(/github/i)).toBeInTheDocument();
  });

  it("should contain the link to the github page", () => {
    render(<Footer />);
    expect(screen.getByText(/github/i)).toHaveAttribute(
      "href",
      "https://github.com/ryanyonek/Scale-able",
    );
  });
});
