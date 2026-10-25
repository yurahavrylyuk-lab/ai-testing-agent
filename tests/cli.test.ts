import { afterEach, describe, expect, it, vi } from "vitest";
import { parseTargetArg, runCli } from "../src/cli.ts";

afterEach(() => vi.restoreAllMocks());

describe("parseTargetArg", () => {
  it("reads --target <path>", () => {
    expect(parseTargetArg(["--target", "targets/example.target.json"])).toBe(
      "targets/example.target.json",
    );
  });

  it("reads --target=<path>", () => {
    expect(parseTargetArg(["--target=targets/example.target.json"])).toBe(
      "targets/example.target.json",
    );
  });

  it("fails when --target is missing", () => {
    expect(() => parseTargetArg([])).toThrow(/--target/);
  });

  it("fails on unknown arguments", () => {
    expect(() => parseTargetArg(["--target", "a.json", "--bogus"])).toThrow();
  });
});

describe("runCli", () => {
  it("returns 0 and prints the selected target", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    expect(runCli(["--target", "targets/example-second.target.json"])).toBe(0);
    expect(log.mock.calls.flat().join("\n")).toContain("Example Second App");
  });

  it("returns 1 for a missing target file", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(runCli(["--target", "targets/does-not-exist.target.json"])).toBe(1);
    expect(error.mock.calls.flat().join("\n")).toMatch(/not found/i);
  });

  it("returns 1 when --target is not supplied", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(runCli([])).toBe(1);
  });
});
