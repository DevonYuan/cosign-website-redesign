import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";

// Covers the requirement that the marketing site be specific to the
// Innershell Cosign GitHub App and no longer carry the legacy Concerto
// reference implementation branding.

const wwwRoot = path.resolve(__dirname, "../..");
const excludedDirs = new Set([
  ".git",
  "node_modules",
  "playwright-report",
  "test-results",
  // This suite itself has to describe the forbidden string to check for it.
  "tests",
]);

function collectFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (excludedDirs.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

test("the marketing site identifies the Innershell Cosign GitHub App", async () => {
  const offenders: string[] = [];

  for (const file of collectFiles(wwwRoot)) {
    const contents = readFileSync(file, "utf-8");
    if (/concerto/i.test(contents) || /concerto-app\.com/i.test(contents)) {
      offenders.push(path.relative(wwwRoot, file));
    }
    if (
      file.endsWith("js/modules-data.js") &&
      /member profile \(enterprise signers\)/i.test(contents)
    ) {
      // Keep the site-specific product story, but not the old legacy brand names.
    }
  }

  expect(offenders).toEqual([]);
  expect(readFileSync(path.join(wwwRoot, "index.html"), "utf-8")).toMatch(
    /Innershell|Cosign/i,
  );
});
