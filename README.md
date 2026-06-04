# Josh Dog Kush — Change Request Portal 🐶🌿

A simple website where Josh can request changes to his **Josh Dog Kush** site.
He picks what he wants to change, an AI assistant helps him write the
description, he attaches photos or video, and the request is **emailed straight
to the developer**.

## Sections

| Section | What it does |
| --- | --- |
| **Special / Any Changes** | Describe any change to the site — with an optional picture **and/or** video. |
| **Gallery** | Add an image to the gallery with a description. |
| **Seeds** | Add a seed product — multiple photos, a price, and a description. |
| **Special Offers** | Update a special offer — image and description. |

Every section has an **AI writing assistant** (powered by Claude) on the side
that helps Josh turn rough ideas into clean copy. One click inserts the
assistant's text right into the description field.

## Tech

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Claude API** (`@anthropic-ai/sdk`) for the writing assistant
- **Resend** for emailing change requests (with attachments)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```

### Environment variables

See `.env.example`. All are optional for a quick demo:

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Enables the AI writing assistant. Without it, the chat shows a friendly "not configured" notice. |
| `ANTHROPIC_MODEL` | Override the model (default `claude-sonnet-4-6`). |
| `RESEND_API_KEY` | Enables emailing requests. **Without it, requests are logged to the server console** so you can develop without an account. |
| `TO_EMAIL` | Where requests are delivered (default: the developer's email). |
| `FROM_EMAIL` | The "from" address. Use `onboarding@resend.dev` for testing, or a verified domain in production. |

## How submissions work

The browser sends the form as `multipart/form-data` (text fields as JSON,
files as attachments) to `/api/submit`. The server composes a tidy email and
sends it via Resend with the images/video attached. Total attachments are
capped at ~38 MB (Resend's limit) — large videos should be compressed first.

## Deploy

Deploys cleanly to **Vercel**: push the repo, set the environment variables in
the project settings, and you're live. `npm run build` produces a production
build.
