# Recruiter CRM / ATS Platform

A portfolio-grade MERN application for recruiters to manage jobs, candidates, pipeline stages, notes, and hiring analytics.

## Why this project stands out

- Recruiter-facing product, so hiring teams immediately understand the use case.
- Full-stack MERN architecture with React, Express, Node, and MongoDB/Mongoose.
- Demo mode runs without MongoDB, while production mode supports MongoDB Atlas through `MONGODB_URI`.
- JWT login, role-ready user model, candidate pipeline, notes, filters, and analytics.

## Demo login

```txt
Email: suraj@talentdeck.dev
Password: suraj123
```

## Run locally

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## MongoDB setup

The app works in seeded demo mode without MongoDB. To use a real database:

1. Set `server/.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string.
3. Run `npm run seed` to create demo data.
4. Run `npm run dev`.

## Portfolio talking points

- Built a recruiter workflow around candidate lifecycle, not generic CRUD.
- Designed API resources for jobs, candidates, notes, timeline activity, and metrics.
- Added Mongo/in-memory data abstraction so the product is demoable anywhere.
- Implemented responsive, recruiter-focused UI with searchable tables and a pipeline board.
