import { parseArgs } from "node:util";
import { config as loadEnv } from "dotenv";
import { loadTargetConfig } from "./config.ts";

export function parseTargetArg(argv: string[]): string {
  const { values } = parseArgs({
    args: argv,
    options: { target: { type: "string" } },
    strict: true,
  });
  if (!values.target) {
    throw new Error("Missing required argument: --target <path>");
  }
  return values.target;
}

export function runCli(argv: string[]): number {
  try {
    const target = loadTargetConfig(parseTargetArg(argv));
    console.log(`Target loaded: ${target.name}`);
    console.log(`Platform: ${target.platform}`);
    console.log(`Mode: ${target.mode}`);
    if (target.app.bundleId) console.log(`Bundle ID: ${target.app.bundleId}`);
    if (target.app.appPath) console.log(`App path: ${target.app.appPath}`);
    console.log(`Device: ${target.device.name}`);
    return 0;
  } catch (error) {
    console.error((error as Error).message);
    return 1;
  }
}

if (import.meta.main) {
  loadEnv({ quiet: true });
  process.exitCode = runCli(process.argv.slice(2));
}
