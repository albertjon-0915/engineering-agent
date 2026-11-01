# @alaric_0915/engineering-agent

A specialized AI engineering agent for hardware and software design.

---

## What's in this repo

| File | Purpose |
|---|---|
| `AGENT.md` | The complete agent definition — identity, responsibilities, workflows, methodologies, standards, and the full verification checklist |
| `.opencode/agent/engineering-agent.md` | The same definition packaged as a loadable **opencode agent** (drop-in, selectable via `@engineering-agent`) |
| `.claude/agents/engineering-agent.md` | The same definition as a **Claude Code** subagent |
| `.codex/agents/engineering-agent.toml` + `AGENTS.md` | The same definition as a **Codex** custom agent + project instructions |
| `package.json` + `scripts/install.mjs` | Installer — copies the agent into any project via `npx` |
| `README.md` | This file |

## Installation (npx)

The repo is an npm package with a `bin` entry. Install the agent into any project with:

```bash
# from inside this repo (local test)
npx .

# from GitHub (requires repo access — public, or SSH/HTTPS auth)
npx github:albertjon-0915/engineering-agent

# from npm (scoped package, no org required)
npx @alaric_0915/engineering-agent
```

Options and examples:

```bash
npx @alaric_0915/engineering-agent                    # install into current directory
npx @alaric_0915/engineering-agent ../my-app          # install into a specific project
npx @alaric_0915/engineering-agent --force            # overwrite existing files
npx @alaric_0915/engineering-agent --help             # usage
```

What gets installed:

- `.opencode/agent/engineering-agent.md` — the opencode agent
- `.claude/agents/engineering-agent.md` — the Claude Code agent
- `.codex/agents/engineering-agent.toml` — the Codex custom agent
- `AGENTS.md` — Codex project instructions
- `AGENT.md` — the canonical spec

**After installing: restart your AI tool** (opencode, Claude Code, or Codex) so it picks up the new agent files. Existing files are skipped unless `--force` is passed.

---

## What the agent does

### Hardware / Electronics
- **Circuit review** — power trees, MCUs, sensors, interfaces, and protection (ESD, reverse polarity, inrush, decoupling)
- **Pinouts & wiring** — ESP32 / Arduino / Raspberry Pi / RP2040 / STM32 and similar; connector pinouts, harnesses, and signal-integrity notes
- **PCB guidance** — footprint selection, net naming, ERC/DRC readiness, hierarchy, and JLCPCB fab handoff (Gerbers, CPL, BOM)
- **BOM & parts** — LCSC-friendly bills of materials with manufacturer PNs, LCSC numbers, packages, quantities, alternates, and stock/lead-time flags
- **Power & safety** — budgets, regulators, level shifting, battery charging/protection (DW01 etc.), fuel gauging

### Software / Firmware
- **Full-stack engineering** — React / Node / TypeScript, Python tooling, APIs, browser UI, tests, CI/CD, refactors
- **Embedded firmware** — C/C++ for ESP32 / Arduino / RP2040 / STM32, with compile verification against the target board package
- **Code <-> hardware cross-check** — pins, I2C addresses, baud rates, and constants in code are matched against wiring tables exactly

### Documentation
- Hardware guides, assembly notes, test procedures, and revision history
- Software READMEs, architecture notes, and API docs

---

## Working Style

- **Plan first, then confirm** — for build tasks, a plan is presented before any files are created or commands run; one approval gate, then execution
- **Documentation-first** — pinouts, registers, and driver APIs are checked against official/datasheet sources or local project files before answering; sources are cited
- **Verification before done** — firmware is compiled for the correct board target; software runs lint/typecheck/build/test; power budgets and ERC checklists are run on every design
- **Honest limits** — static review catches design errors but cannot replace bench testing; every hardware design ships with a smoke-test procedure

## Conventions

| Deliverable | Format |
|---|---|
| BOM | XLSX (preferred) or CSV |
| Documentation | PDF or DOCX (not Markdown/plain text) |
| Diagrams | SVG (hand-authored) or ASCII in chat |
| Schematics | Not generated (design review / pinout / BOM level only) |

- **Parts**: LCSC/JLCPCB-stocked components preferred; BOM entries include reference designator, quantity, value, package, manufacturer PN, LCSC number, and notes.
- **Projects**: cost estimates follow a fixed 3-column XLSX structure (ITEM | PRICE | REMARKS) with materials, labor, and inclusions sections.

## Safety & Standards

- Mains, Li-ion, and high-current designs are flagged with required protections.
- Applicable standards (CE, FCC, UL) are noted where certification review is needed; compliance is never claimed without verification.

---

## License

Private / user-owned repository. See commit history for details.
