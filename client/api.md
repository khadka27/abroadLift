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

## Schools & Programs (AbroadLift API Proxies)

These endpoints route requests to the live AbroadLift API (`api.abroadlift.com`) using server-side proxies to protect the API credentials and optimize performance through a shared caching layer.

### `/api/schools`

- Method: `GET`
- Purpose: Retrieve list of campuses/schools, or extract all represented countries.
- Query params:
  - `page` (optional): Page number (default: `1`).
  - `limit` (optional): Items per page (default: `20` or `100` on page 1).
  - `allCountries` (optional): If set to `true`, extracts unique countries represented across all campuses.
- Response for `allCountries=true`:
  ```json
  {
    "success": true,
    "data": [
      { "code": "CA", "name": "Canada" },
      { "code": "USA", "name": "USA" },
      { "code": "UK", "name": "UK" }
    ]
  }
  ```
- Response for standard listing (contains the complete school profile schema):
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6a298c9c8271bee035d32d01",
        "school_id": 1,
        "_scraped_at": "2026-06-19T07:21:51.206980+00:00",
        "name": "Conestoga College - Doon",
        "about": "<p>Conestoga College is a leader in polytechnic education...</p>",
        "address": "299 Doon Valley Drive",
        "city": "Kitchener",
        "province": "Ontario",
        "country": "Canada",
        "country_code": "CA",
        "postal_code": "N2G 4M4",
        "phone": "1 (519) 748-5220",
        "email": "InternationalAdmissions@conestogac.on.ca",
        "website": "http://www.conestogac.on.ca/international/",
        "institution_type": "Public",
        "founded_in": 1967,
        "school_rank": 6013,
        "total_number_of_students": 26000,
        "number_of_international_students": 8000,
        "cost_of_living": "22895.0",
        "currency": "CAD",
        "conditional_acceptance": true,
        "conditional_acceptance_text": "Even if students do NOT meet Conestoga's minimum English requirement...",
        "coop_participating": true,
        "pgwp_participating": false,
        "video_link": "https://www.youtube.com/embed/5ixP1XfgN-0",
        "logo": {
          "file_name": "Conestoga-College-Logo-Aug2020.png",
          "url": "https://photos.applyboard.com/schools/...Logo.png",
          "url_thumbnail": "https://photos.applyboard.com/schools/...Logo_thumb.png"
        },
        "banner": {
          "file_name": "Conestoga-College-Banner-Oct2020.png",
          "url": "https://photos.applyboard.com/schools/...Banner.png",
          "url_thumbnail": "https://photos.applyboard.com/schools/...Banner_thumb.png"
        },
        "photos": [
          {
            "id": 8093,
            "url": "https://photos.applyboard.com/school_photos/...original.png",
            "url_thumbnail": "https://photos.applyboard.com/school_photos/...thumbnail.png",
            "url_optimized": "https://photos.applyboard.com/school_photos/...optimized.webp",
            "url_optimized_small": "https://photos.applyboard.com/school_photos/...small.webp"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 54,
      "totalPages": 1
    }
  }
  ```
- Source: `client/src/app/api/schools/route.ts`

### `/api/schools/[id]`

- Method: `GET`
- Purpose: Retrieve the details of a single school using its ID (either Mongo `_id` or numerical `school_id`).
- Response:
  ```json
  {
    "success": true,
    "data": {
      "_id": "6a298c9c8271bee035d32d01",
      "school_id": 1,
      "name": "Conestoga College - Doon",
      "about": "<p>Conestoga College is a leader in polytechnic education...</p>",
      "address": "299 Doon Valley Drive",
      "city": "Kitchener",
      "province": "Ontario",
      "country": "Canada",
      "country_code": "CA",
      "phone": "1 (519) 748-5220",
      "email": "InternationalAdmissions@conestogac.on.ca",
      "website": "http://www.conestogac.on.ca/international/",
      "institution_type": "Public",
      "founded_in": 1967,
      "school_rank": 6013,
      "total_number_of_students": 26000,
      "number_of_international_students": 8000,
      "cost_of_living": "22895.0",
      "currency": "CAD",
      "conditional_acceptance": true,
      "conditional_acceptance_text": "Even if students do NOT meet Conestoga's minimum English requirement (IELTS or TOEFL), they can still get conditionally accepted...",
      "coop_participating": true,
      "pgwp_participating": false,
      "video_link": "https://www.youtube.com/embed/5ixP1XfgN-0",
      "logo": {
        "file_name": "Conestoga-College-Logo-Aug2020.png",
        "url": "https://photos.applyboard.com/schools/000/000/001/logos/original/Conestoga-College-Logo-Aug2020.png",
        "url_thumbnail": "https://photos.applyboard.com/schools/000/000/001/logos/small/Conestoga-College-Logo-Aug2020.png"
      },
      "banner": {
        "file_name": "Conestoga-College-Banner-Oct2020.png",
        "url": "https://photos.applyboard.com/schools/000/000/001/banners/original/Conestoga-College-Banner-Oct2020.png",
        "url_thumbnail": "https://photos.applyboard.com/schools/000/000/001/banners/small/Conestoga-College-Banner-Oct2020.png"
      },
      "photos": [
        {
          "id": 8093,
          "url": "https://photos.applyboard.com/school_photos/000/008/093/photos/original/Conestoga-College-Building-June2020.png",
          "url_thumbnail": "https://photos.applyboard.com/school_photos/000/008/093/photos/small/Conestoga-College-Building-June2020.png",
          "url_optimized": "https://photos.applyboard.com/school_photos/000/008/093/photos/optimized/Conestoga-College-Building-June2020.webp",
          "url_optimized_small": "https://photos.applyboard.com/school_photos/000/008/093/photos/optimized_small/Conestoga-College-Building-June2020.webp"
        }
      ]
    }
  }
  ```
- Source: `client/src/app/api/schools/[id]/route.ts`

### `/api/programs`

- Method: `GET`
- Purpose: Fetch paginated list of all academic programs, extract unique study levels, or group programs by field.
- Query params:
  - `page` (optional): Page number (default: `1`).
  - `limit` (optional): Items per page (default: `20`).
  - `allLevels` (optional): If set to `true`, returns a complete, beautifully organized list of all study levels in the database.
  - `allFieldsAndPrograms` (optional): If set to `true`, returns all unique academic fields with up to 15 matching program names for each field.
- Response for `allLevels=true`:
  ```json
  {
    "success": true,
    "data": [
      { "v": "masters_degree", "l": "Master's Degree" },
      { "v": "doctoral_phd", "l": "Doctoral / PhD" },
      { "v": "bachelors", "l": "4-Year Bachelor's Degree" },
      { "v": "3_year_bachelors", "l": "3-Year Bachelor's Degree" },
      { "v": "post_graduate_diploma", "l": "Postgraduate Diploma" },
      { "v": "english", "l": "English as Second Language (ESL)" }
    ]
  }
  ```
- Response for `allFieldsAndPrograms=true`:
  ```json
  {
    "success": true,
    "data": {
      "fields": [
        "Business & Management",
        "Computer Science & IT",
        "Engineering"
      ],
      "programsByField": {
        "Computer Science & IT": [
          "Computer Science",
          "Software Engineering Technology"
        ],
        "Engineering": [
          "Mechanical Engineering",
          "Civil Engineering Technology"
        ]
      }
    }
  }
  ```
- Source: `client/src/app/api/programs/route.ts`

### `/api/programs/school/[id]`

- Method: `GET`
- Purpose: Retrieve all academic programs offered by a specific school.
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6a298c9c8271bee035d32cf7",
        "program_id": 1,
        "_scraped_at": "2026-06-19T06:18:29.549519+00:00",
        "school_id": 1,
        "name": "Bachelor of Applied Health Information Science (Honours) (1131C) (Co-op)",
        "short_name": "Applied Health Information Science",
        "description": "<p>The Bachelor of Applied Health Information Science (Honours) degree is an innovative four-year...</p>",
        "level": "bachelors",
        "level_text": "4-Year Bachelor's Degree",
        "length_breakdown": "4 year bachelor's degree including 8 months of co-op and a field placement",
        "delivery_method": "in_class",
        "coop_length": 8,
        "tuition": "15961.0",
        "application_fee": "100.0",
        "pgwp_participating": true,
        "other_fees": [
          "Leased Device Fees: $1049 per year",
          "ISR Fees: $750 per year",
          "CSI International Health Fees: $530 per year",
          "CSI Health Plan Fees: $300 per year"
        ],
        "requirements": {
          "id": 27909,
          "min_gpa": "70.0",
          "level_text": "Grade 12 / High School",
          "min_ielts_average": "6.5",
          "min_ielts_reading": "6.0",
          "min_ielts_writing": "6.0",
          "min_ielts_listening": "6.0",
          "min_ielts_speaking": "6.0",
          "min_toefl_total": "88.0",
          "min_toefl_reading": "22.0",
          "min_toefl_writing": "22.0",
          "min_toefl_listening": "22.0",
          "min_toefl_speaking": "22.0",
          "min_duolingo_score": 120,
          "min_pte_overall": 58,
          "other_requirements": [
            "Grade 12 English; One Grade 12 Mathematics course with a minimum average of 65%...",
            "Grade 12 Biology with a minimum average of 70%; and Three other Grade 12 courses."
          ]
        }
      }
    ]
  }
  ```
- Source: `client/src/app/api/programs/school/[id]/route.ts`

### `/api/scholarships`

- Method: `GET`
- Purpose: Retrieve a paginated list of scholarship opportunities.
- Query params:
  - `page` (optional): Page number (default: `1`).
  - `limit` (optional): Items per page (default: `20`).
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6a298c9c8271bee035d32dcd",
        "scholarship_id": 178,
        "_scraped_at": "2026-06-19T06:19:08.526097+00:00",
        "title": "Degree Entrance Scholarship",
        "description": "Conestoga College offers the Degree Entrance Scholarship, providing **$3,000** to students starting their studies in the Fall, Winter, or Spring terms. This scholarship recognizes academic excellence...\n\n# Eligibility Criteria  \n- Must be enrolled as a **full-time student** at Conestoga College.\n- Must have **paid their deposit and fees in full by the due dates**...",
        "automatically_applied": true,
        "award_amount_currency_code": "CAD",
        "award_amount_currency_symbol": "$",
        "award_amount_from": "3000.0",
        "award_amount_to": null,
        "award_amount_type": "fixed_amount",
        "eligible_levels": [
          "1-Year Post-Secondary Certificate",
          "2-Year Undergraduate Diploma",
          "3-Year Bachelor's Degree",
          "3-Year Undergraduate Advanced Diploma",
          "4-Year Bachelor's Degree",
          "Doctoral / PhD",
          "Master's Degree",
          "Postgraduate Certificate",
          "Postgraduate Diploma"
        ],
        "eligible_nationalities": [],
        "school_group_name": "Conestoga College - All Campuses",
        "slug": "degree-entrance-scholarship",
        "source_url": "https://www.conestogac.on.ca/international/apply-to-conestoga/awards-and-scholarships"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 178,
      "totalPages": 9
    }
  }
  ```
- Source: `client/src/app/api/scholarships/route.ts`

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
