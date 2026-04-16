import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.hoisted variables are available inside vi.mock factory (which is hoisted too)
const mocks = vi.hoisted(() => {
  const mockTriggerAttackRelease = vi.fn();
  const mockVolumeRef = { value: 0 };
  const mockPartStart = vi.fn();
  const mockPartCallback = { fn: null }; // captures callback passed to new Part(cb, ...)
  const mockEventsArray = { arr: null }; // captures events passed to new Part(_, events)
  const mockToneStart = vi.fn().mockResolvedValue(undefined);
  const mockTransport = {
    stop: vi.fn(),
    cancel: vi.fn(),
    start: vi.fn(),
    bpm: { value: 120 },
  };
  return {
    mockTriggerAttackRelease,
    mockVolumeRef,
    mockPartStart,
    mockPartCallback,
    mockEventsArray,
    mockToneStart,
    mockTransport,
  };
});

vi.mock("tone", () => {
  // PolySynth must be a real class (arrow functions can't be called with `new`)
  class MockPolySynth {
    constructor() {
      this.volume = mocks.mockVolumeRef;
      this.triggerAttackRelease = mocks.mockTriggerAttackRelease;
    }
    toDestination() {
      return this;
    }
  }

  class MockPart {
    constructor(callback, events) {
      mocks.mockPartCallback.fn = callback;
      mocks.mockEventsArray.arr = events;
    }
    start(time) {
      mocks.mockPartStart(time);
      return this;
    }
  }

  return {
    PolySynth: MockPolySynth,
    Synth: class Synth {},
    Transport: mocks.mockTransport,
    Part: MockPart,
    start: mocks.mockToneStart,
  };
});

import { useToneScaleAudio } from "../useToneScaleAudio.js";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mockToneStart.mockResolvedValue(undefined);
  mocks.mockTransport.bpm.value = 120;
  mocks.mockVolumeRef.value = 0;
  mocks.mockPartCallback.fn = null;
  mocks.mockEventsArray.arr = null;
});

describe("useToneScaleAudio", () => {
  it("returns play, stop, setTempo, and audioError", () => {
    const { result } = renderHook(() => useToneScaleAudio());
    expect(typeof result.current.play).toBe("function");
    expect(typeof result.current.stop).toBe("function");
    expect(typeof result.current.setTempo).toBe("function");
    expect(result.current.audioError).toBeNull();
  });

  it("play — calls Tone.start then starts Transport", async () => {
    const { result } = renderHook(() => useToneScaleAudio());

    await act(async () => {
      await result.current.play(["c/4", "d/4", "e/4"], 1, -10);
    });

    expect(mocks.mockToneStart).toHaveBeenCalled();
    expect(mocks.mockTransport.stop).toHaveBeenCalled();
    expect(mocks.mockTransport.cancel).toHaveBeenCalled();
    expect(mocks.mockPartStart).toHaveBeenCalledWith(0);
    expect(mocks.mockTransport.start).toHaveBeenCalled();
  });

  it("play — sets synth volume to the provided dB value", async () => {
    const { result } = renderHook(() => useToneScaleAudio());

    await act(async () => {
      await result.current.play(["c/4"], 1, -15);
    });

    expect(mocks.mockVolumeRef.value).toBe(-15);
  });

  it("play — Part callback invokes triggerAttackRelease with note, duration, and time", async () => {
    const { result } = renderHook(() => useToneScaleAudio());

    await act(async () => {
      await result.current.play(["c/4"], 1, 0);
    });

    // Fire the Part callback as Tone would
    mocks.mockPartCallback.fn(0, "c4");
    expect(mocks.mockTriggerAttackRelease).toHaveBeenCalledWith("c4", "8n", 0);
  });

  it("play — maps notes with speed affecting the timing interval", async () => {
    const { result } = renderHook(() => useToneScaleAudio());

    await act(async () => {
      await result.current.play(["c/4", "d/4"], 2, 0);
    });

    expect(mocks.mockEventsArray.arr[0][0]).toBe(0);
    expect(mocks.mockEventsArray.arr[1][0]).toBe(0.25); // 0.5 / speed(2)
  });

  it("stop — calls Transport.stop and Transport.cancel", () => {
    const { result } = renderHook(() => useToneScaleAudio());

    act(() => {
      result.current.stop();
    });

    expect(mocks.mockTransport.stop).toHaveBeenCalled();
    expect(mocks.mockTransport.cancel).toHaveBeenCalled();
  });

  it("setTempo — sets Transport.bpm.value to 120 * multiplier", () => {
    const { result } = renderHook(() => useToneScaleAudio());

    act(() => {
      result.current.setTempo(2);
    });

    expect(mocks.mockTransport.bpm.value).toBe(240);
  });

  it("play — sets audioError and returns early when Tone.start throws", async () => {
    mocks.mockToneStart.mockRejectedValueOnce(new Error("Audio context blocked"));

    const { result } = renderHook(() => useToneScaleAudio());

    await act(async () => {
      await result.current.play(["c/4"], 1, 0);
    });

    expect(result.current.audioError).toBe(
      "Audio playback is not supported in this browser."
    );
    // Transport should not have been started since we returned early
    expect(mocks.mockTransport.start).not.toHaveBeenCalled();
  });

  it("play — sets audioError when Transport.stop throws (inner catch branch)", async () => {
    // Make Transport.stop throw to trigger the inner try/catch block (lines 44-47)
    mocks.mockTransport.stop.mockImplementationOnce(() => {
      throw new Error("Transport error");
    });

    const { result } = renderHook(() => useToneScaleAudio());

    await act(async () => {
      await result.current.play(["c/4"], 1, 0);
    });

    expect(result.current.audioError).toBe("Audio playback failed unexpectedly.");
  });
});
