#!/usr/bin/env node
/**
 * engineering-agent installer
 *
 * Copies the engineering agent definition into the target project:
 *   - .opencode/agent/engineering-agent.md  (opencode agent, loadable after restart)
 *   - AGENT.md                              (canonical spec)
 *
 * Usage:
 *   npx engineering-agent [target-dir] [--force]
 *   node scripts/install.mjs [target-dir] [--force]
 *
 * Dependency-free (Node stdlib only) so it runs instantly via npx.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");

const MANIFEST = [
  {
    src: path.join(PKG_ROOT, "AGENT.md"),
    rel: path.join("AGENT.md"),
  },
  {
    src: path.join(PKG_ROOT, ".opencode", "agent", "engineering-agent.md"),
    rel: path.join(".opencode", "agent", "engineering-agent.md"),
  },
];

const HELP = `engineering-agent installer

Usage:
  npx engineering-agent [target-dir] [--force]

Copies the engineering agent into the target project (default: current directory).
Existing files are skipped unless --force is passed.

Examples:
  npx engineering-agent                       # install into current directory
  npx engineering-agent ../my-app --force     # force-overwrite in ../my-app
`;

function main() {
  const argv = process.argv.slice(2);

  if (argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  const force = argv.includes("--force");
  const positional = argv.filter((a) => !a.startsWith("--"));
  const target = path.resolve(positional[0] ?? process.cwd());

  if (!existsSync(target)) {
    console.error(`error: target directory does not exist: ${target}`);
    process.exit(1);
  }

  let installed = 0;
  let skipped = 0;

  for (const entry of MANIFEST) {
    const dest = path.join(target, entry.rel);
    try {
      if (existsSync(dest) && !force) {
        console.log(`skip   ${entry.rel} (already exists; use --force to overwrite)`);
        skipped += 1;
        continue;
      }
      mkdirSync(path.dirname(dest), { recursive: true });
      copyFileSync(entry.src, dest);
      console.log(`copy   ${entry.rel}`);
      installed += 1;
    } catch (err) {
      console.error(`error  failed to install ${entry.rel}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log("");
  console.log(`Installed ${installed} file(s) into ${target}${skipped ? ` (${skipped} skipped)` : ""}.`);
  console.log("Next steps:");
  console.log("  1. Restart opencode so the new agent is picked up.");
  console.log('  2. Select the "engineering-agent" agent (or invoke it from another agent).');
  console.log("  3. Read AGENT.md for the full definition.");
}

main();
