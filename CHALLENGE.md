# Debugging Olympics - Month 2: PostgreSQL Track

## Duration

45 minutes

## Objective

Investigate the existing PostgreSQL-backed ticket APIs, identify the business defects, and repair the implementation with minimal, well-justified changes.

## Permitted Resources

- Local documentation
- Official package documentation
- Your editor, terminal, and test tools
- AI assistance if fully disclosed in `SUBMISSION.md`

## AI Policy

AI usage is allowed only if you document the tools used, the prompts submitted, and any output you rejected or corrected. You are responsible for the final code.

## Rules

- Do not modify visible tests to hide failures.
- Do not modify fixture data.
- Do not modify Prisma migrations unless a fix explicitly requires migration work.
- Do not rewrite the repository from scratch.
- Do not replace database logic with static responses.
- Do not hardcode expected ticket IDs, titles, counts, or statistics.
- Do not replace PostgreSQL with arrays, SQLite, MongoDB, or another persistence strategy.
- Only commits created before the deadline count.

## Submission Requirements

- Commit your work to your branch.
- Record the final commit SHA in `SUBMISSION.md`.
- Summarize the bugs found, root causes, files changed, and commands run.

## Grading Categories

- Functional correctness
- Debugging quality
- Test quality
- Code quality and safety
- Git discipline
- Live explanation
