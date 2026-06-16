import "server-only";

import fs from "node:fs";
import path from "node:path";

function parseEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadRootEnv() {
  const repoRoot = path.resolve(process.cwd(), "../..");
  const appRoot = process.cwd();

  for (const dir of [repoRoot, appRoot]) {
    for (const file of [".env.local", ".env"]) {
      parseEnvFile(path.join(dir, file));
    }
  }
}

loadRootEnv();
