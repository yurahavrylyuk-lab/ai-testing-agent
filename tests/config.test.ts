import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { loadTargetConfig, TargetConfigError } from "../src/config.ts";

const TARGET_A = "targets/example.target.json";
const TARGET_B = "targets/example-second.target.json";

const tempDir = mkdtempSync(join(tmpdir(), "target-config-"));
afterAll(() => rmSync(tempDir, { recursive: true, force: true }));

function writeTemp(name: string, contents: string): string {
  const path = join(tempDir, name);
  writeFileSync(path, contents);
  return path;
}

const validTarget = {
  name: "Valid App",
  platform: "ios",
  mode: "black-box",
  app: { bundleId: "com.example.valid" },
  device: { name: "iPhone 16" },
};

describe("loadTargetConfig", () => {
  it("loads a valid target with defaults applied", () => {
    const config = loadTargetConfig(writeTemp("valid.json", JSON.stringify(validTarget)));

    expect(config).toEqual({ ...validTarget, capabilities: {} });
  });

  it("accepts appPath without bundleId", () => {
    const path = writeTemp(
      "app-path.json",
      JSON.stringify({ ...validTarget, app: { appPath: "builds/Valid.app" } }),
    );

    expect(loadTargetConfig(path).app).toEqual({ appPath: "builds/Valid.app" });
  });

  it("fails clearly when the file does not exist", () => {
    const path = join(tempDir, "missing.json");

    expect(() => loadTargetConfig(path)).toThrow(TargetConfigError);
    expect(() => loadTargetConfig(path)).toThrow(/not found/i);
  });

  it("fails clearly on malformed JSON", () => {
    const path = writeTemp("malformed.json", "{ \"name\": ");

    expect(() => loadTargetConfig(path)).toThrow(TargetConfigError);
    expect(() => loadTargetConfig(path)).toThrow(/not valid JSON/i);
  });

  it("fails clearly when a required field is missing", () => {
    const { name: _name, ...withoutName } = validTarget;
    const path = writeTemp("no-name.json", JSON.stringify(withoutName));

    expect(() => loadTargetConfig(path)).toThrow(TargetConfigError);
    expect(() => loadTargetConfig(path)).toThrow(/name/);
  });

  it("rejects an unsupported platform", () => {
    const path = writeTemp("android.json", JSON.stringify({ ...validTarget, platform: "android" }));

    expect(() => loadTargetConfig(path)).toThrow(/platform/);
  });

  it("rejects an unknown mode", () => {
    const path = writeTemp("grey-box.json", JSON.stringify({ ...validTarget, mode: "grey-box" }));

    expect(() => loadTargetConfig(path)).toThrow(/mode/);
  });

  it("rejects a target that does not identify the app", () => {
    const path = writeTemp("no-app-id.json", JSON.stringify({ ...validTarget, app: {} }));

    expect(() => loadTargetConfig(path)).toThrow(/bundleId or app\.appPath/);
  });

  it("loads target A from targets/example.target.json", () => {
    const config = loadTargetConfig(TARGET_A);

    expect(config.name).toBe("Example App");
    expect(config.platform).toBe("ios");
    expect(config.mode).toBe("black-box");
    expect(config.app.bundleId).toBe("com.example.app");
  });

  it("loads target B from targets/example-second.target.json", () => {
    const config = loadTargetConfig(TARGET_B);

    expect(config.name).toBe("Example Second App");
    expect(config.platform).toBe("ios");
    expect(config.mode).toBe("white-box");
    expect(config.app.bundleId).toBe("com.example.second");
  });

  it("selects a different app purely by target path", () => {
    const [a, b] = [TARGET_A, TARGET_B].map((path) => loadTargetConfig(path));

    expect(a.name).not.toBe(b.name);
    expect(a.app).not.toEqual(b.app);
    expect(a.device).not.toEqual(b.device);
  });
});
