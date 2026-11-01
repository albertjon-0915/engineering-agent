#!/usr/bin/env node
/**
 * engineering-agent installer
 *
 * Copies the engineering agent definition into the target project:
 *   - .opencode/agent/engineering-agent.md      (opencode agent)
 *   - .claude/agents/engineering-agent.md       (Claude Code agent)
 *   - .codex/agents/engineering-agent.toml      (Codex agent)
 *   - AGENTS.md                                 (Codex project instructions)
 *   - AGENT.md                                  (canonical spec)
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");

const TOOLS = [
  { dir: ".opencode", src: path.join(".opencode", "agent", "engineering-agent.md"), rel: path.join(".opencode", "agent", "engineering-agent.md") },
  { dir: ".claude", src: path.join(".claude", "agents", "engineering-agent.md"), rel: path.join(".claude", "agents", "engineering-agent.md") },
  { dir: ".codex", src: path.join(".codex", "agents", "engineering-agent.toml"), rel: path.join(".codex", "agents", "engineering-agent.toml") },
];

const HELP = `engineering-agent installer

Usage:
  npx engineering-agent [target-dir] [--force]

Auto-detects which AI tools are present (.opencode, .claude, .codex)
and installs agents only for those. Copies AGENT.md always.

Supported tools: opencode, Claude Code, Codex

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

  // Detect which tool folders exist in the target project
  const detected = TOOLS.filter((t) => existsSync(path.join(target, t.dir)));

  // Fallback: if none detected, use all tools
  const targets = detected.length > 0 ? detected : TOOLS;

  let installed = 0;
  let skipped = 0;

  // Build manifest: AGENT.md always, then tool-specific agents
  const manifest = [
    { src: path.join(PKG_ROOT, "AGENT.md"), rel: "AGENT.md" },
    ...targets.map((t) => ({ src: path.join(PKG_ROOT, t.src), rel: t.rel })),
  ];

  // Also create AGENTS.md for Codex project instructions (alias to AGENT.md)
  if (targets.find((t) => t.dir === ".codex")) {
    manifest.push({ src: path.join(PKG_ROOT, "AGENT.md"), rel: "AGENTS.md" });
  }

  for (const entry of manifest) {
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

  if (detected.length > 0) {
    const names = detected.map((t) =>
      t.dir === ".opencode" ? "opencode" : t.dir === ".claude" ? "Claude Code" : "Codex"
    );
    console.log(`  Detected: ${names.join(", ")}. Agents copied there.`);
  } else {
    console.log("  No existing AI tool folder detected — installed to all (opencode, Claude Code, Codex).");
  }

  if (targets.find((t) => t.dir === ".opencode")) {
    console.log("  Restart opencode so the new agent is picked up.");
  }
  if (targets.find((t) => t.dir === ".claude")) {
    console.log("  In Claude Code — agents in .claude/agents/ load automatically.");
  }
  if (targets.find((t) => t.dir === ".codex")) {
    console.log("  In Codex — agents in .codex/agents/ load automatically. Project instructions in AGENTS.md.");
  }
  console.log("  Read AGENT.md for the full agent definition.");
}

main();
