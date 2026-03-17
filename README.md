# IGNITE OMIS Chatbot Extension

Standalone chatbot extension for the IGNITE website. This project is designed to be built independently first, then embedded into the main IGNITE site once the flow is stable.

## Goal

The extension helps users submit details for a LinkedIn post request. It generates a first-pass draft, stores the request in Supabase, and supports an admin approval workflow before anything is published.

## Architecture Fit

This starter mirrors the main IGNITE backend patterns:

- `Supabase` for data storage and edge functions
- `@supabase/supabase-js` on the frontend
- `@tanstack/react-query` for client data flow
- password-protected admin edge functions
- server-side secrets for privileged operations

## Project Structure

```text
frontend/
  src/
    components/
    hooks/
    lib/
supabase/
  functions/
  migrations/
```

## Planned Flow

1. A user opens the chatbot widget on the website.
2. The widget collects details about a promotion, event, award, or announcement.
3. The frontend invokes the `generate-post-draft` edge function.
4. The edge function generates a draft and stores the request in Supabase.
5. A notification function can email admins about the new request.
6. Admins review requests through `admin-post-requests`.
7. Approved content can later be sent to LinkedIn through a publishing function.

## Environment Variables

Copy `.env.example` to `.env` for local frontend development, and configure the same values in Supabase for edge functions.

### Frontend

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_FUNCTIONS_URL`

### Supabase Edge Functions

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL`

## Database

The starter migration creates a `linkedin_post_requests` table for chatbot submissions, draft content, status tracking, and review notes.

## Next Steps

1. Create the Supabase project objects from `supabase/migrations`.
2. Configure the edge function secrets.
3. Install frontend dependencies and run the widget locally.
4. Embed the widget into the main IGNITE website.
5. Add admin screens and LinkedIn publishing once the request flow is stable.

## Notes

- This repo currently contains a starter scaffold only.
- `generate-post-draft` currently uses a placeholder draft builder so the request flow can be wired up before adding a live OpenAI call.
- The AI generation and admin approval flow are intentionally conservative so they match the existing IGNITE architecture.
