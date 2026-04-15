import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import AudioPlayButton from "../AudioPlayButton.jsx";

describe("AudioPlayButton", () => {
  it("renders a Play button", () => {
    render(
      <AudioPlayButton
        onChange={vi.fn()}
        allNotes={[]}
        tempo={1}
        volume={-20}
        audioError={null}
      />
    );
    expect(screen.getByRole("button", { name: /Play/i })).toBeInTheDocument();
  });

  it("calls onChange with allNotes, tempo, and volume when clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const allNotes = ["C4", "D4", "E4"];
    const tempo = 1.5;
    const volume = -10;

    render(
      <AudioPlayButton
        onChange={onChange}
        allNotes={allNotes}
        tempo={tempo}
        volume={volume}
        audioError={null}
      />
    );
    await user.click(screen.getByRole("button", { name: /Play/i }));
    expect(onChange).toHaveBeenCalledWith(allNotes, tempo, volume);
  });

  it("calls onChange exactly once per click", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AudioPlayButton
        onChange={onChange}
        allNotes={[]}
        tempo={1}
        volume={-20}
        audioError={null}
      />
    );
    await user.click(screen.getByRole("button", { name: /Play/i }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not display an error message when audioError is null", () => {
    render(
      <AudioPlayButton
        onChange={vi.fn()}
        allNotes={[]}
        tempo={1}
        volume={-20}
        audioError={null}
      />
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(document.querySelector(".audio-error")).not.toBeInTheDocument();
  });

  it("displays the audioError message when one is provided", () => {
    const errorMsg = "Audio playback is not supported in this browser.";
    render(
      <AudioPlayButton
        onChange={vi.fn()}
        allNotes={[]}
        tempo={1}
        volume={-20}
        audioError={errorMsg}
      />
    );
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });
});
