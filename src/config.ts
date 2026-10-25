import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

const TargetConfigSchema = z.object({
  name: z.string().min(1),
  platform: z.literal("ios"),
  mode: z.enum(["white-box", "black-box"]),
  app: z
    .object({
      bundleId: z.string().min(1).optional(),
      appPath: z.string().min(1).optional(),
    })
    .refine((app) => app.bundleId !== undefined || app.appPath !== undefined, {
      message: "must define app.bundleId or app.appPath",
    }),
  device: z.object({
    name: z.string().min(1),
    platformVersion: z.string().min(1).optional(),
  }),
  capabilities: z.record(z.string(), z.boolean()).default({}),
});

export type TargetConfig = z.infer<typeof TargetConfigSchema>;

export class TargetConfigError extends Error {
  override name = "TargetConfigError";
}

export function loadTargetConfig(path: string): TargetConfig {
  const fullPath = resolve(path);

  let raw: string;
  try {
    raw = readFileSync(fullPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new TargetConfigError(`Target config not found: ${fullPath}`);
    }
    throw new TargetConfigError(`Cannot read target config ${fullPath}: ${(error as Error).message}`);
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (error) {
    throw new TargetConfigError(
      `Target config is not valid JSON: ${fullPath}: ${(error as Error).message}`,
    );
  }

  const result = TargetConfigSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new TargetConfigError(`Invalid target config ${fullPath}:\n${issues}`);
  }
  return result.data;
}
