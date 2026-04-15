import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import TonicSelect from "../TonicSelect.jsx";

const majorKeys = ["C#", "F#", "B", "E", "A", "D", "G", "C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
const minorKeys = ["A#", "D#", "G#", "C#", "F#", "B", "E", "A", "D", "G", "C", "F", "Bb", "Eb", "Ab"];

describe("TonicSelect", () => {
  it("renders the Select Tonic label", () => {
    render(
      <TonicSelect
        value="C"
        onChange={vi.fn()}
        selectedScale="Major"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    expect(screen.getByText(/Select Tonic:/)).toBeInTheDocument();
  });

  it("renders major keys as options when selectedScale is Major", () => {
    render(
      <TonicSelect
        value="C"
        onChange={vi.fn()}
        selectedScale="Major"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    majorKeys.forEach((key) => {
      expect(screen.getByRole("option", { name: key })).toBeInTheDocument();
    });
  });

  it("renders minor keys as options when selectedScale is not Major", () => {
    render(
      <TonicSelect
        value="A"
        onChange={vi.fn()}
        selectedScale="Natural Minor"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    minorKeys.forEach((key) => {
      expect(screen.getByRole("option", { name: key })).toBeInTheDocument();
    });
  });

  it("does not show minor-only keys when selectedScale is Major", () => {
    render(
      <TonicSelect
        value="C"
        onChange={vi.fn()}
        selectedScale="Major"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    // A# and D# are only in minorKeys, not majorKeys
    expect(screen.queryByRole("option", { name: "A#" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "D#" })).not.toBeInTheDocument();
  });

  it("does not show major-only keys when selectedScale is Natural Minor", () => {
    render(
      <TonicSelect
        value="A"
        onChange={vi.fn()}
        selectedScale="Natural Minor"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    // Db, Gb, Cb are only in majorKeys, not minorKeys
    expect(screen.queryByRole("option", { name: "Db" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Cb" })).not.toBeInTheDocument();
  });

  it("shows the current value as selected", () => {
    render(
      <TonicSelect
        value="G"
        onChange={vi.fn()}
        selectedScale="Major"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    expect(screen.getByRole("combobox")).toHaveValue("G");
  });

  it("calls onChange with the newly selected tonic", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TonicSelect
        value="C"
        onChange={onChange}
        selectedScale="Major"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    await user.selectOptions(screen.getByRole("combobox"), "G");
    expect(onChange).toHaveBeenCalledWith("G");
  });

  it("calls onChange exactly once per selection", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TonicSelect
        value="C"
        onChange={onChange}
        selectedScale="Major"
        majorKeys={majorKeys}
        minorKeys={minorKeys}
      />
    );
    await user.selectOptions(screen.getByRole("combobox"), "D");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
