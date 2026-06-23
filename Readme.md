# CareerLens

CareerLens is a full-stack AI career preparation platform. Upload a resume and a job description, and it analyzes the fit, surfaces skill gaps, generates tailored interview questions, runs a scored mock interview, and produces an ATS-optimized resume PDF.

It's built as a MERN application with a clear separation between backend services and a layered frontend architecture, with Groq's llama-3.3-70b model handling the analysis, scoring, and chat features.

## Live Demo

career-lens-brown-six.vercel.app

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Technical Decisions](#technical-decisions)

## Features

**Authentication.** Signup and login with JWT stored in HTTP-only cookies, session persistence across refreshes, and full data isolation between accounts.

**Resume analysis.** Upload a resume PDF and paste a job description to get a match score, a list of skill gaps with importance levels and learning suggestions, strengths relevant to the role, fifteen or more tailored technical questions, eight or more behavioral questions with answering tips, and a 30-day roadmap broken down by week.

**ATS resume generation.** The analysis includes a rewritten, ATS-optimized version of the resume that pulls in keywords from the job description and rewrites experience as achievement-focused bullet points. This gets rendered into a downloadable PDF.

**Mock interview.** Pick topics, difficulty, and time per question, then answer questions one at a time with a countdown timer. Each answer is scored out of 10 with feedback on what was good, what was missing, a model answer, and an improvement tip. At the end you get a scorecard with topic-level breakdowns and the weakest areas called out.

**AI chat.** A chat panel with full context of the resume, job description, and analysis results, so you can ask follow-up questions about specific skills or how to frame your experience.

**Analysis history.** Every analysis is saved, and the dashboard sidebar lets you reload a past analysis at any time, with chat, interview, and resume download all working against it.

## Tech Stack

**Backend:** Node.js, Express, MongoDB with Mongoose, JWT with HTTP-only cookies, bcrypt, Multer, pdf-parse, Groq SDK, Puppeteer, Handlebars, validator.

**Frontend:** React (Vite), Redux Toolkit, React Router DOM, Axios, Tailwind CSS, DaisyUI, Lucide React.

## Architecture

The backend follows a standard layered structure — config, models, middleware, controllers, routes, utils — with JWT generation and password comparison implemented as instance methods on the User model rather than scattered through controllers.

```
Backend/src/
├── config/database.js
├── models/
│   ├── user.js
│   └── analysis.js
├── middlewares/auth.js
├── controllers/
│   ├── authController.js
│   └── aiController.js
├── routes/
│   ├── authRoutes.js
│   └── aiRoutes.js
└── utils/
    ├── ai.js
    ├── pdfGenerator.js
    └── resumeTemplate.hbs
```

The frontend is split into four layers, each with one job: the store holds state, services make API calls, hooks orchestrate logic and dispatch to the store, and pages render UI by calling hooks. Page-specific UI is broken down further into components so no single file mixes more than one concern.

```
Frontend/src/
├── store/        authSlice, aiSlice
├── services/     axiosInstance, authService, aiService
├── hooks/        useAuth, useAI
├── components/
│   ├── shared/
│   ├── dashboard/
│   └── interview/
└── pages/
```


## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the backend listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `GROQ_API_KEY` | API key for Groq |

## API Reference

**Auth**

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

**AI**

```
POST   /api/ai/analyze
POST   /api/ai/download-resume
GET    /api/ai/analyses
GET    /api/ai/analyses/:id
POST   /api/ai/interview-answer
POST   /api/ai/chat
```

## Project Structure

```
CareerLens/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   └── store/
    ├── index.html
    └── package.json
```

## Technical Decisions

**JWT in HTTP-only cookies instead of localStorage.** A token in localStorage is readable by any script running on the page, which makes it vulnerable to XSS. HTTP-only cookies aren't accessible from JavaScript at all, and `withCredentials: true` on the Axios instance ensures the cookie gets attached automatically on every request.

**Validation and auth logic live on the model.** Email format checks happen at the schema level with the `validator` package, and `user.getJWT()` / `user.comparePassword()` are instance methods on the User model. Controllers stay thin and just call into the model.

**Groq over OpenAI or Gemini.** Groq's free tier gives solid access to llama-3.3-70b with fast inference and no billing requirement. Gemini's free tier had regional quota restrictions that made it unreliable for this project.

**Puppeteer plus Handlebars for the resume PDF.** Puppeteer renders real HTML/CSS through headless Chrome, which gives more control over the final layout than most PDF libraries. Handlebars keeps the template as a separate `.hbs` file instead of building HTML strings inline in JavaScript.

**Multer with memory storage.** Resume PDFs are kept as an in-memory buffer rather than written to disk. The buffer goes straight into pdf-parse for text extraction and is discarded once the request finishes, so there's no file cleanup to manage.

**Redux Toolkit over Context API.** Auth state, analysis results, and interview progress all need to be shared across several pages, and Redux Toolkit's slices keep that state predictable and easy to trace as the app grows.

## Author

Shobhit Jain — [GitHub](https://github.com/Shobhit1805)
