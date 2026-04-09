# Agent Teams — Master Reference Guide

> This guide is a complete reference for building effective agent teams in Claude Code.
> Source: https://code.claude.com/docs/en/agent-teams + https://code.claude.com/docs/en/sub-agents

---

## Table of Contents

1. [What Are Agent Teams](#1-what-are-agent-teams)
2. [Agent Teams vs Subagents](#2-agent-teams-vs-subagents)
3. [Enabling Agent Teams](#3-enabling-agent-teams)
4. [Architecture](#4-architecture)
5. [Starting a Team](#5-starting-a-team)
6. [Display Modes](#6-display-modes)
7. [Controlling Your Team](#7-controlling-your-team)
8. [Task Management](#8-task-management)
9. [Communication](#9-communication)
10. [Using Subagent Definitions for Teammates](#10-using-subagent-definitions-for-teammates)
11. [Subagent Definition File Format](#11-subagent-definition-file-format)
12. [Hooks for Quality Gates](#12-hooks-for-quality-gates)
13. [Permissions](#13-permissions)
14. [Token Usage](#14-token-usage)
15. [Best Practices](#15-best-practices)
16. [Use Case Examples](#16-use-case-examples)
17. [Troubleshooting](#17-troubleshooting)
18. [Limitations](#18-limitations)
19. [Quick Reference Cheatsheet](#19-quick-reference-cheatsheet)

---

## 1. What Are Agent Teams

Agent teams let you coordinate **multiple Claude Code instances** working together. One session acts as the **team lead**, coordinating work, assigning tasks, and synthesizing results. **Teammates** work independently, each in its own context window, and can communicate directly with each other.

Key properties:
- Each teammate is a full, independent Claude Code session
- Teammates share a task list and can message each other directly
- You can interact with any teammate directly (not just through the lead)
- The lead creates the team, spawns teammates, and coordinates work

Unlike subagents (which run within a single session and only report back), teammates are fully autonomous sessions that collaborate.

---

## 2. Agent Teams vs Subagents

|                   | Subagents                                        | Agent Teams                                         |
|:------------------|:-------------------------------------------------|:----------------------------------------------------|
| **Context**       | Own context window; results return to the caller | Own context window; fully independent               |
| **Communication** | Report results back to the main agent only       | Teammates message each other directly               |
| **Coordination**  | Main agent manages all work                      | Shared task list with self-coordination             |
| **Best for**      | Focused tasks where only the result matters      | Complex work requiring discussion and collaboration |
| **Token cost**    | Lower: results summarized back to main context   | Higher: each teammate is a separate Claude instance |

### When to use agent teams
- Research and review (multiple aspects investigated simultaneously)
- New modules or features (each teammate owns a separate piece)
- Debugging with competing hypotheses (parallel investigation)
- Cross-layer coordination (frontend, backend, tests)

### When NOT to use agent teams
- Sequential tasks
- Same-file edits
- Work with many dependencies between steps
- Routine tasks (single session is more cost-effective)

---

## 3. Enabling Agent Teams

Agent teams are **experimental and disabled by default**. Enable via `settings.json`:

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or set the environment variable directly in your shell.

**Requires:** Claude Code v2.1.32 or later (`claude --version` to check).

---

## 4. Architecture

An agent team consists of four components:

| Component      | Role                                                                                       |
|:---------------|:-------------------------------------------------------------------------------------------|
| **Team lead**  | The main Claude Code session that creates the team, spawns teammates, and coordinates work |
| **Teammates**  | Separate Claude Code instances that each work on assigned tasks                            |
| **Task list**  | Shared list of work items that teammates claim and complete                                |
| **Mailbox**    | Messaging system for communication between agents                                          |

### Storage locations
- **Team config:** `~/.claude/teams/{team-name}/config.json`
- **Task list:** `~/.claude/tasks/{team-name}/`

Both are auto-generated. **Do NOT edit team config by hand** — it's overwritten on every state update.

The team config `members` array contains each teammate's name, agent ID, and agent type. Teammates can read this file to discover other team members.

There is **no project-level** team config. A file like `.claude/teams/teams.json` in your project directory is NOT recognized.

---

## 5. Starting a Team

Tell Claude to create a team in natural language. Describe the task and team structure:

```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles: one
teammate on UX, one on technical architecture, one playing devil's advocate.
```

### How teams get started
1. **You request a team:** Explicitly ask for an agent team. Claude creates one based on your instructions.
2. **Claude proposes a team:** Claude may suggest creating a team if your task benefits from parallel work. You confirm before it proceeds.

Claude will **never** create a team without your approval.

### Specifying teammates and models

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

---

## 6. Display Modes

### In-process mode (default)
- All teammates run inside your main terminal
- Use **Shift+Down** to cycle through teammates
- Type to message them directly
- Press **Enter** to view a teammate's session, **Escape** to interrupt their turn
- Press **Ctrl+T** to toggle the task list
- Works in any terminal

### Split-pane mode
- Each teammate gets its own pane
- See everyone's output at once
- Click into a pane to interact directly
- Requires **tmux** or **iTerm2**
- NOT supported in: VS Code integrated terminal, Windows Terminal, Ghostty

### Configuration

Default is `"auto"` (uses split panes if already in tmux, otherwise in-process).

```json
// ~/.claude.json (global config)
{
  "teammateMode": "in-process"   // or "tmux" or "auto"
}
```

Per-session override:
```bash
claude --teammate-mode in-process
```

---

## 7. Controlling Your Team

### Require plan approval before implementation

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

When a teammate finishes planning, it sends a plan approval request to the lead. The lead reviews and either approves or rejects with feedback. If rejected, the teammate revises and resubmits.

Influence the lead's judgment:
- "Only approve plans that include test coverage"
- "Reject plans that modify the database schema"

### Talk to teammates directly

- **In-process:** Shift+Down to cycle, type to message
- **Split-pane:** Click into a teammate's pane

### Shut down a teammate

```
Ask the researcher teammate to shut down
```

The lead sends a shutdown request. Teammate can approve (exits gracefully) or reject with explanation.

### Clean up the team

```
Clean up the team
```

**Always use the lead to clean up.** Teammates should NOT run cleanup. Shut down all teammates first — cleanup fails if any are still running.

---

## 8. Task Management

Tasks have three states: **pending**, **in progress**, **completed**.

Tasks can have **dependencies**: a pending task with unresolved dependencies cannot be claimed until those dependencies are completed. Dependencies unblock automatically when completed.

### Assignment methods
- **Lead assigns:** Tell the lead which task to give to which teammate
- **Self-claim:** After finishing a task, a teammate picks up the next unassigned, unblocked task

Task claiming uses **file locking** to prevent race conditions.

### Sizing tasks
- **Too small:** Coordination overhead exceeds the benefit
- **Too large:** Teammates work too long without check-ins
- **Just right:** Self-contained units producing a clear deliverable (a function, a test file, a review)

**Target: 5-6 tasks per teammate** for optimal productivity.

---

## 9. Communication

Each teammate has its own context window. When spawned, a teammate loads:
- Same project context as a regular session (CLAUDE.md, MCP servers, skills)
- The spawn prompt from the lead
- **NOT** the lead's conversation history

### Messaging
- **message:** Send to one specific teammate (by name)
- **broadcast:** Send to all teammates simultaneously (use sparingly — costs scale with team size)

### Automatic behaviors
- Messages are delivered automatically to recipients
- Idle notifications: when a teammate finishes, it notifies the lead automatically
- Shared task list: all agents can see task status and claim available work

### Teammate naming
The lead assigns every teammate a name at spawn time. Any teammate can message any other by name. For predictable names, tell the lead what to call each teammate in your spawn instruction.

---

## 10. Using Subagent Definitions for Teammates

You can reference any subagent definition (from any scope) when spawning a teammate:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

The teammate will:
- Honor the definition's `tools` allowlist and `model`
- Append the definition's body to the teammate's system prompt as additional instructions
- Always have team coordination tools (SendMessage, task management) available, even when `tools` restricts other tools

**Note:** The `skills` and `mcpServers` frontmatter fields are NOT applied when running as a teammate. Teammates load skills and MCP servers from your project and user settings.

---

## 11. Subagent Definition File Format

Subagent files are Markdown with YAML frontmatter. They can be used both as subagents AND as teammate definitions.

### File locations (by priority)

| Location                     | Scope             | Priority    |
|:-----------------------------|:------------------|:------------|
| Managed settings             | Organization-wide | 1 (highest) |
| `--agents` CLI flag          | Current session   | 2           |
| `.claude/agents/`            | Current project   | 3           |
| `~/.claude/agents/`          | All your projects | 4           |
| Plugin's `agents/` directory | Plugin scope      | 5 (lowest)  |

### Complete frontmatter reference

```yaml
---
name: my-agent                    # Required. Lowercase letters and hyphens
description: When to use this     # Required. Tells Claude when to delegate
tools: Read, Glob, Grep, Bash     # Optional. Allowlist. Inherits all if omitted
disallowedTools: Write, Edit      # Optional. Denylist. Removed from inherited/specified
model: sonnet                     # Optional. sonnet|opus|haiku|inherit|full-model-id
permissionMode: default           # Optional. default|acceptEdits|auto|dontAsk|bypassPermissions|plan
maxTurns: 10                      # Optional. Max agentic turns before stopping
skills:                           # Optional. Skills injected at startup
  - api-conventions
  - error-handling-patterns
mcpServers:                       # Optional. MCP servers for this agent
  - playwright:                   # Inline definition
      type: stdio
      command: npx
      args: ["-y", "@playwright/mcp@latest"]
  - github                        # Reference by name
hooks:                            # Optional. Lifecycle hooks
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/lint.sh"
memory: user                      # Optional. user|project|local
background: false                 # Optional. Always run as background task
effort: high                      # Optional. low|medium|high|max (Opus 4.6 only)
isolation: worktree               # Optional. Run in temporary git worktree
color: blue                       # Optional. red|blue|green|yellow|purple|orange|pink|cyan
initialPrompt: "Start by..."     # Optional. Auto-submitted first user turn (--agent mode)
---

You are a code reviewer. Analyze the code and provide specific,
actionable feedback on quality, security, and best practices.
```

### Tool control

**Allowlist (tools):** Only these tools are available:
```yaml
tools: Read, Glob, Grep, Bash
```

**Denylist (disallowedTools):** Inherit everything EXCEPT these:
```yaml
disallowedTools: Write, Edit
```

**Restrict spawnable subagents:** `Agent(worker, researcher)` — only these can be spawned.

If both are set, `disallowedTools` is applied first, then `tools` resolves against the remaining pool.

### CLI-defined subagents (session-only)

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger."
  }
}'
```

### Memory scopes

| Scope     | Location                                      | Use when                                       |
|:----------|:----------------------------------------------|:-----------------------------------------------|
| `user`    | `~/.claude/agent-memory/<name>/`              | Learnings across all projects                  |
| `project` | `.claude/agent-memory/<name>/`                | Project-specific, shareable via version control|
| `local`   | `.claude/agent-memory-local/<name>/`          | Project-specific, NOT in version control       |

---

## 12. Hooks for Quality Gates

### Team-specific hooks

| Event            | When it fires                              | Exit code 2 behavior                          |
|:-----------------|:-------------------------------------------|:-----------------------------------------------|
| `TeammateIdle`   | Teammate is about to go idle               | Sends feedback, keeps teammate working         |
| `TaskCreated`    | A task is being created                    | Prevents creation, sends feedback              |
| `TaskCompleted`  | A task is being marked complete            | Prevents completion, sends feedback            |

### Subagent hooks (in settings.json)

| Event           | Matcher input   | When it fires                    |
|:----------------|:----------------|:---------------------------------|
| `SubagentStart` | Agent type name | When a subagent begins execution |
| `SubagentStop`  | Agent type name | When a subagent completes        |

### Hooks in subagent frontmatter

| Event         | Matcher input | When it fires                          |
|:------------- |:------------- |:---------------------------------------|
| `PreToolUse`  | Tool name     | Before the subagent uses a tool        |
| `PostToolUse` | Tool name     | After the subagent uses a tool         |
| `Stop`        | (none)        | When the subagent finishes             |

Example — read-only database agent with hook validation:

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

---

## 13. Permissions

- Teammates start with the **lead's permission settings**
- If lead uses `--dangerously-skip-permissions`, all teammates do too
- You can change individual teammate modes **after spawning** (not at spawn time)
- Pre-approve common operations in your permission settings before spawning to reduce interruptions

### Subagent permission modes

| Mode                | Behavior                                             |
|:--------------------|:-----------------------------------------------------|
| `default`           | Standard permission checking with prompts            |
| `acceptEdits`       | Auto-accept file edits in working directory          |
| `auto`              | Background classifier reviews commands               |
| `dontAsk`           | Auto-deny permission prompts                         |
| `bypassPermissions` | Skip permission prompts (use with caution)           |
| `plan`              | Read-only exploration                                |

If parent uses `bypassPermissions`, it takes precedence and cannot be overridden.
If parent uses `auto` mode, subagent inherits auto mode and frontmatter `permissionMode` is ignored.

---

## 14. Token Usage

- Each teammate has its own context window
- Token usage **scales linearly** with number of active teammates
- Agent teams use **significantly more tokens** than a single session
- Worth it for research, review, and new feature work
- For routine tasks, a single session is more cost-effective

---

## 15. Best Practices

### 1. Give teammates enough context
Teammates don't inherit the lead's conversation history. Include task-specific details in the spawn prompt:

```
Spawn a security reviewer teammate with the prompt: "Review the authentication
module at src/auth/ for security vulnerabilities. Focus on token handling,
session management, and input validation. The app uses JWT tokens stored in
httpOnly cookies. Report any issues with severity ratings."
```

### 2. Choose appropriate team size
- Start with **3-5 teammates** for most workflows
- **5-6 tasks per teammate** keeps everyone productive
- Three focused teammates often outperform five scattered ones
- Scale up only when work genuinely benefits from parallelism

### 3. Size tasks appropriately
- Self-contained units that produce a clear deliverable
- A function, a test file, a review
- Not too small (overhead > benefit) or too large (risk of wasted effort)

### 4. Wait for teammates to finish
If the lead starts implementing instead of waiting:
```
Wait for your teammates to complete their tasks before proceeding
```

### 5. Avoid file conflicts
Break work so each teammate owns a **different set of files**. Two teammates editing the same file leads to overwrites.

### 6. Monitor and steer
Check in on progress, redirect approaches that aren't working, synthesize findings as they come in.

### 7. Start with research and review
If new to agent teams, start with non-code tasks: reviewing a PR, researching a library, investigating a bug.

---

## 16. Use Case Examples

### Parallel Code Review

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Each reviewer applies a different filter. The lead synthesizes findings.

### Competing Hypothesis Investigation

```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

The adversarial debate structure fights anchoring bias. The theory that survives is more likely correct.

### Cross-Layer Feature Work

```
Create an agent team for the new notification feature:
- Backend teammate: build the API endpoints and database schema
- Frontend teammate: build the React components and state management
- Test teammate: write integration and unit tests
Each teammate owns their own files. Coordinate through the task list.
```

### Research and Documentation

```
Create an agent team to audit our dependency security:
- One teammate scanning for known CVEs
- One reviewing our custom middleware for OWASP top 10
- One checking our environment variable handling and secrets management
Have them challenge each other's findings before finalizing the report.
```

---

## 17. Troubleshooting

### Teammates not appearing
- In-process mode: Press **Shift+Down** to cycle — they may already be running
- Task may not be complex enough for Claude to warrant a team
- For split panes: check `which tmux` is installed and in PATH
- For iTerm2: verify `it2` CLI is installed and Python API is enabled

### Too many permission prompts
Pre-approve common operations in your permission settings before spawning.

### Teammates stopping on errors
Check output via Shift+Down or clicking pane. Either:
- Give additional instructions directly
- Spawn a replacement teammate

### Lead shuts down before work is done
Tell it to keep going. Also tell it to wait for teammates before proceeding.

### Orphaned tmux sessions
```bash
tmux ls
tmux kill-session -t <session-name>
```

---

## 18. Limitations

- **No session resumption** with in-process teammates (`/resume` and `/rewind` don't restore them)
- **Task status can lag** — teammates sometimes fail to mark tasks complete
- **Shutdown can be slow** — teammates finish current request before shutting down
- **One team per session** — clean up current team before starting a new one
- **No nested teams** — teammates cannot spawn their own teams
- **Lead is fixed** — can't promote a teammate to lead
- **Permissions set at spawn** — can't set per-teammate modes at spawn time
- **Split panes require tmux/iTerm2** — not supported in VS Code terminal, Windows Terminal, or Ghostty
- **CLAUDE.md works normally** — teammates read CLAUDE.md from their working directory

---

## 19. Quick Reference Cheatsheet

### Enable
```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

### Keyboard shortcuts (in-process mode)
| Key           | Action                          |
|:--------------|:--------------------------------|
| Shift+Down    | Cycle through teammates         |
| Enter         | View teammate's session         |
| Escape        | Interrupt teammate's turn       |
| Ctrl+T        | Toggle task list                |
| Ctrl+B        | Background a running task       |

### Common prompts
| Action                    | Prompt                                                       |
|:--------------------------|:-------------------------------------------------------------|
| Create a team             | "Create an agent team with 3 teammates for..."              |
| Specify model             | "Use Sonnet for each teammate"                               |
| Require plan approval     | "Require plan approval before they make any changes"         |
| Wait for completion       | "Wait for your teammates to complete before proceeding"      |
| Shut down teammate        | "Ask the researcher teammate to shut down"                   |
| Clean up                  | "Clean up the team"                                          |
| Use subagent definition   | "Spawn a teammate using the security-reviewer agent type"    |

### Subagent file template
```markdown
---
name: my-agent
description: When Claude should use this agent
tools: Read, Glob, Grep, Bash
model: sonnet
memory: project
---

You are a specialized agent. Your job is to...
```

### Task states
`pending` -> `in progress` -> `completed`

Tasks can have dependencies. Blocked tasks auto-unblock when dependencies complete.
