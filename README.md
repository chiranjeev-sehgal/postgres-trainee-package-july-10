# Debugging Olympics - Month 2: PostgreSQL Track

This repository contains the PostgreSQL track for the Month 2 individual trainee hackathon. It evaluates debugging across Next.js API routes, Prisma queries, PostgreSQL reasoning, automated tests, and disciplined Git usage. Instructor material is included in this repository and must not be distributed to trainees.

## PostgreSQL Track Designation

This is the PostgreSQL version of the assessment. A MongoDB companion repository should match the same domain, contracts, fixtures, intended defects, scoring, and expected effort, with persistence implementation as the only major difference.

## Prerequisites

- Node.js 20
- npm
- Docker Desktop or another Docker runtime compatible with Testcontainers

## Installation

```bash
npm install
cp .env.example .env
```

## Environment Setup

Set `DATABASE_URL` in `.env` for local development. Automated tests override the database URL with a Testcontainers-managed PostgreSQL instance.

## Prisma Generation and Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Local Development

```bash
npm run db:up
npm run dev
```

## docker-compose Usage

The local PostgreSQL service uses development-only credentials and a named volume:

```bash
npm run db:up
npm run db:down
```

## Test Commands

```bash
npm test
npm run test:visible
npm run test:hidden
npm run test:all
```

## Seed Command

```bash
npm run prisma:seed
```

## Build Command

```bash
npm run build
```

## Repository Structure

- `pages/api/tickets`: API routes under assessment
- `lib`: Prisma, validation, logging, and shared helpers
- `repositories`: Ticket data access logic
- `prisma`: schema, migration, and deterministic seed
- `tests/visible`: trainee-visible tests
- `tests/helpers`: test container, fixture, request, and database helpers
- `instructor`: hidden tests, scoring guide, and answer key

## Instructor Instructions

Use `npm run evaluate` to produce evaluation reports. Hidden tests should be run only from instructor-controlled environments. Use `npm run package:trainee` to generate a trainee-safe distribution without instructor material.
