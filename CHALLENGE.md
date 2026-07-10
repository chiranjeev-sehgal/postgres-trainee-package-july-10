# Debugging Olympics - Month 2: PostgreSQL Track

## Duration

45 minutes

## Objective

Investigate the existing PostgreSQL-backed ticket APIs, identify the business defects, and repair the implementation with minimal, well-justified changes.

## Permitted Resources

- Local documentation in this repository
- Official documentation for tools and libraries used in this project (for example Next.js, Prisma, PostgreSQL, Node.js, Vitest)
- Your editor, terminal, and test tools

## AI Policy

AI usage is strictly prohibited. Do not use AI coding assistants, chatbots, code generators, or any AI-powered tooling (including editor-integrated AI) at any point during the challenge.

You may consult official documentation for the tools and libraries used in this project. You may not use AI to summarize, search, or interpret that documentation.

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
