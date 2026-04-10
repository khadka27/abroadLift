# API Endpoints (Client App)

This file lists all API routes currently implemented under `client/src/app/api`.

Base URL (local): `http://localhost:3000`
All paths below are relative to that base (example: `/api/profile`).

## Authentication

### `/api/auth/[...nextauth]`

- Methods: `GET`, `POST`
- Purpose: NextAuth built-in auth/session handler.
- Source: `client/src/app/api/auth/[...nextauth]/route.ts`

### `/api/auth/register`

- Method: `POST`
- Purpose: Register user + send OTP.
- Body (main fields):
  - `name`, `email`, `countryDialCode`, `phoneNumber`, `prefersWhatsApp`
  - optional profile fields: `nationality`, `currentCountry`, `gpa`
- Success: `201` with `user` and `otp` payload.
- Source: `client/src/app/api/auth/register/route.ts`

### `/api/auth/request-otp`

- Method: `POST`
- Purpose: Send OTP to existing user.
- Body:
  - `phoneE164` OR (`countryDialCode` + `phoneNumber`)
- Success: `200` with `sent` and `channel`.
- Source: `client/src/app/api/auth/request-otp/route.ts`

### `/api/auth/verify-signup-otp`

- Method: `POST`
- Purpose: Verify OTP and mark phone as verified.
- Body:
  - `phoneE164` OR (`countryDialCode` + `phoneNumber`)
  - `otp`
- Success: `200` with `verified: true`.
- Source: `client/src/app/api/auth/verify-signup-otp/route.ts`

### `/api/auth/mobile/login`

- Method: `POST`
- Purpose: OTP-based mobile login and JWT issue.
- Body:
  - `phoneE164`, `otp`
- Success: `200` with `user` and `token`.
- Source: `client/src/app/api/auth/mobile/login/route.ts`

## Profile

### `/api/profile`

- Methods: `GET`, `PUT`
- Auth: Required (token/session via `getUserIdFromRequest`).
- `GET` purpose: Fetch user profile + recent matching records.
- `PUT` purpose: Update user + student profile details.
- `PUT` body: large profile payload (education, tests, preferences, budget, readiness flags, etc.).
- Source: `client/src/app/api/profile/route.ts`

## Matching

### `/api/match`

- Method: `GET`
- Auth: Required.
- Purpose: DB-based eligibility match from saved student profile and universities.
- Source: `client/src/app/api/match/route.ts`

### `/api/matches`

- Method: `GET`
- Purpose: Search and generate match list using WorqNow + Hipolabs sources.
- Query params:
  - `countries` (comma-separated) OR `country`
  - `budget`
  - `degreeLevel`
  - `field`
- Notes:
  - Country aliases are normalized.
  - If country not provided, uses `POPULAR_STUDY_COUNTRIES` env.
- Source: `client/src/app/api/matches/route.ts`

### `/api/matches/save`

- Method: `POST`
- Auth: Required.
- Purpose: Save selected match result and sync/update student profile.
- Body:
  - `formData`
  - `matchData`
- Success: `200` with `{ success: true, id }`.
- Source: `client/src/app/api/matches/save/route.ts`

### `/api/universities/search`

- Method: `GET`
- Purpose: University search by text and countries using WorqNow + Hipolabs.
- Query params:
  - `q`
  - `countries` (comma-separated)
- Notes:
  - If countries omitted, uses `POPULAR_STUDY_COUNTRIES` env.
- Source: `client/src/app/api/universities/search/route.ts`

## Visa

### `/api/visa`

- Methods: `GET`, `POST`, `PUT`
- Auth: Required.
- Purpose:
  - `GET`: list user's visa rate checks
  - `POST`: create visa rate check
  - `PUT`: update visa rate check
- Body for `POST`/`PUT`:
  - `nationality`, `destination`, `degreeLevel`, `fundsAvailable`, `ieltsScore`, `pastRejections`
  - `PUT` also needs `id`
- Source: `client/src/app/api/visa/route.ts`

### `/api/visa-guidance`

- Method: `GET`
- Purpose: Proxy visa guidance from WorqNow with fallback steps.
- Query params:
  - `countryCode` (default `usa`)
- Source: `client/src/app/api/visa-guidance/route.ts`

## Cost & Destination Insights

### `/api/cost-estimate`

- Method: `GET`
- Purpose: Estimate annual and monthly study/living costs in NPR.
- Query params:
  - `city` (default `New York`)
  - `country` (default `US`)
  - `tuition_usd` (default `20000`)
- Source: `client/src/app/api/cost-estimate/route.ts`

### `/api/cost-of-living`

- Method: `GET`
- Purpose: Country-level annual estimate + breakdown.
- Query params:
  - `countryCode` (default `US`)
- Source: `client/src/app/api/cost-of-living/route.ts`

### `/api/relocation-index`

- Method: `GET`
- Purpose: Country relocation index data.
- Query params:
  - `countryCode` (default `US`)
- Source: `client/src/app/api/relocation-index/route.ts`

### `/api/destination-insight`

- Method: `GET`
- Purpose: City weather/time/location insights + distance from Kathmandu.
- Query params:
  - `city` (default `London`)
  - `country` (default `GB`)
- Source: `client/src/app/api/destination-insight/route.ts`

## Admin

### `/api/admin/users`

- Method: `GET`
- Auth: Admin required.
- Purpose: List users for admin dashboard.
- Source: `client/src/app/api/admin/users/route.ts`

### `/api/admin/users/register`

- Method: `POST`
- Auth: Admin required.
- Purpose: Admin creates a user account.
- Body:
  - `name`, `email`, `username`, `password`
  - optional: `phoneNumber`, `role`
- Source: `client/src/app/api/admin/users/register/route.ts`

### `/api/admin/students`

- Method: `GET`
- Auth: Admin required.
- Purpose: List student users with profile/applications/visa checks.
- Source: `client/src/app/api/admin/students/route.ts`

### `/api/admin/sync-universities`

- Method: `POST`
- Auth: Admin required.
- Purpose: Sync external universities into DB (current fetch target uses CA endpoint).
- Source: `client/src/app/api/admin/sync-universities/route.ts`

---

## Environment Variables Used By APIs

- `NEXTAUTH_SECRET`
- `WORQNOW_API_KEY`
- `WORQNOW_BASE_URL`
- `HIPOLABS_API_URL`
- `POPULAR_STUDY_COUNTRIES`
- `API_NINJAS_KEY`
- `WHERENEXT_API_URL`
- `WHERENEXT_RELOCATION_URL`

---

## Study Intakes By Country (Reference)

Use this section for intake guidance in forms, profile advice, and roadmap messaging.

### USA

- Intakes:
  - Fall (main): Aug-Sep
  - Spring: Jan
  - Summer (limited): May
- Typical application windows:
  - Fall intake: Nov-Jan
  - Spring intake: Jul-Sep

### UK

- Intakes:
  - September (main)
  - January (limited)
- Typical application windows:
  - September intake: Dec-Jun
  - January intake: Sep-Nov

### Canada

- Intakes:
  - September (main)
  - January
  - May (limited)
- Typical application windows:
  - September intake: Nov-Mar
  - January intake: Jul-Oct

### Australia

- Intakes:
  - February (main)
  - July
  - November (some colleges)
- Typical application windows:
  - February intake: Oct-Dec
  - July intake: Mar-May

### Germany

- Intakes:
  - Winter (main): Oct
  - Summer: Apr
- Typical application windows:
  - October intake: May-Jul
  - April intake: Dec-Jan

### Japan

- Intakes:
  - April (main)
  - October
- Typical application windows:
  - April intake: Oct-Jan
  - October intake: Apr-Jun

### South Korea

- Intakes:
  - March (Spring)
  - September (Fall)
- Typical application windows:
  - March intake: Sep-Nov
  - September intake: May-Jun

### Ireland

- Intakes:
  - September (main)
  - January
- Typical application windows:
  - September intake: Nov-May
  - January intake: Jul-Oct

### Netherlands

- Intakes:
  - September (main)
  - February (limited)
- Typical application windows:
  - September intake: Dec-Apr
  - February intake: Sep-Nov

### France

- Intakes:
  - September (main)
  - January (some)
- Typical application windows:
  - September intake: Jan-Apr

### Italy

- Intakes:
  - September (main)
  - February (limited)
- Typical application windows:
  - September intake: Jan-May

### Spain

- Intakes:
  - September (main)
  - January
- Typical application windows:
  - September intake: Jan-May

### Sweden

- Intakes:
  - Aug-Sep (main)
  - January
- Typical application windows:
  - September intake: Oct-Jan (strict deadlines)

### Switzerland

- Intakes:
  - September (main)
  - February
- Typical application windows:
  - September intake: Dec-Apr

### New Zealand

- Intakes:
  - February (main)
  - July
- Typical application windows:
  - February intake: Oct-Nov
  - July intake: Apr-May

### Singapore

- Intakes:
  - August (main)
  - January (some)
- Typical application windows:
  - August intake: Oct-Mar

### UAE

- Intakes:
  - September
  - January
  - May
- Typical application windows:
  - September intake: Apr-Aug
  - January intake: Oct-Dec

## Quick Intake Summary

- Sep/Fall: USA, UK, Canada, most of Europe
- Jan: UK, Canada, Ireland, selected Asia programs
- Feb/Mar: Australia, New Zealand, South Korea
- Oct: Germany, Japan

## Notes

- Timelines vary by university and by visa processing time.
- For high-demand programs, aim to apply 2-4 months earlier than the typical window.
