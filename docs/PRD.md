# AzarFaith — Product Requirements Document (PRD)

**Version:** 1.0
**Date:** June 30, 2026
**Status:** Draft for Development Handoff

---

## 1. Executive Summary

**AzarFaith** is a faith-based crowdfunding web platform that connects donors to churches, missionaries, orphanages, and faith-based schools across Nigeria. The platform enables grassroots faith-based organizations — small churches, rural missions, community orphanages — to raise funds, collect items, recruit volunteers, and receive professional help through one-time campaigns and recurring giving programs.

**Tagline:** _"Give to those doing God's work."_

**Target Market:** Nigerian Christian community, both domestic diaspora and international supporters of Nigerian faith-based causes.

**Currency:** Nigerian Naira (NGN) exclusively.

---

## 2. Product Vision & Goals

### 2.1 Vision

To become the most trusted and accessible giving platform for the Nigerian faith-based community, empowering grassroots ministries to fund their missions through transparent, verifiable, and seamless digital giving.

### 2.2 Goals

| Goal                    | Metric                             | Target                |
| ----------------------- | ---------------------------------- | --------------------- |
| Launch MVP              | Ship production-ready platform     | Q3 2026               |
| Organization Onboarding | Verified organizations on platform | 50 within 6 months    |
| Donor Activation        | Registered donors                  | 5,000 within 6 months |
| Transaction Volume      | Monthly donation volume            | ₦10M within 6 months  |
| Trust & Safety          | Organization verification rate     | 80%+ verified         |
| Retention               | Recurring donor retention rate     | 60%+ at 3 months      |

### 2.3 Non-Goals (Explicitly Out of Scope for MVP)

- Mobile native apps (iOS/Android) — web-only for MVP
- Multi-currency support — NGN only
- Marketplace for physical goods
- Social media integration beyond sharing links
- Donor-organized group giving / pooling
- Tax receipt generation (Nigerian context — not applicable)

---

## 3. Target Users & Personas

### 3.1 Persona: Donor — "Chidinma"

- **Age:** 25–45
- **Profile:** Working professional, active church member, wants to give to trusted causes
- **Needs:** Easy way to find legitimate causes, set up recurring giving, track her donations
- **Pain Points:** Skeptical of online giving (fear of fraud), wants transparency on how funds are used
- **Tech Comfort:** Moderate — uses mobile banking, WhatsApp, social media daily

### 3.2 Persona: Organization Admin — "Pastor Emeka"

- **Age:** 35–60
- **Profile:** Pastor or administrator of a small church/mission/orphanage
- **Needs:** Simple way to create campaigns, receive funds, share with congregation, provide updates
- **Pain Points:** Limited tech skills, needs something dead simple, wants to build trust with donors
- **Tech Comfort:** Low to moderate — uses smartphone, may not be comfortable with complex dashboards

### 3.3 Persona: Platform Admin — "Tunde"

- **Age:** 28–40
- **Profile:** AzarFaith team member responsible for verification, support, and operations
- **Needs:** Tools to verify organizations, monitor campaigns, handle disputes, manage platform health
- **Pain Points:** Needs efficient workflows, clear data visibility, automated fraud detection
- **Tech Comfort:** High

---

## 4. System Architecture Overview

### 4.1 Technology Stack

| Layer        | Technology                                  | Rationale                                                          |
| ------------ | ------------------------------------------- | ------------------------------------------------------------------ |
| Frontend     | React 19 + TanStack Router + TanStack Start | SSR-capable, file-based routing, type-safe                         |
| Styling      | Tailwind CSS v4 + shadcn/ui                 | Rapid UI development, consistent design system                     |
| State        | Zustand (client) + TanStack Query (server)  | Lightweight client state + server cache management                 |
| Backend      | Node.js (serverless on Vercel)              | Co-located with frontend, easy deployment                          |
| Database     | PostgreSQL (via Supabase or Neon)           | Relational data, ACID compliance for financial records             |
| ORM          | Prisma                                      | Type-safe database access, migrations                              |
| Auth         | Supabase Auth or custom JWT                 | Email/password + Google OAuth + phone OTP                          |
| Payments     | Paystack                                    | Nigerian payment leader, supports cards, bank transfers, recurring |
| File Storage | Cloudflare R2 or AWS S3                     | Campaign images, org photos, avatars                               |
| Hosting      | Vercel                                      | SSR support, edge functions, analytics                             |
| Email        | Resend or SendGrid                          | Transactional emails (welcome, receipts, notifications)            |
| SMS          | Termii or Africa's Talking                  | OTP delivery for phone verification (Nigerian provider)            |

### 4.2 Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                   │
│  React 19 + TanStack Router/Start + Tailwind + shadcn   │
│  Zustand (UI state) + TanStack Query (server cache)     │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────┐
│                   API LAYER (Vercel Serverless)          │
│  TanStack Start Server Functions / API Routes            │
│  Input validation (Zod) + Auth middleware + Rate limiting│
└──────┬────────────┬───────────┬────────────┬───────────┘
       │            │           │            │
┌──────▼──────┐ ┌───▼────┐ ┌───▼────┐ ┌────▼─────────┐
│  Database   │ │ Paystack│ │  File  │ │  Email/SMS   │
│ (PostgreSQL │ │  API    │ │ Storage│ │   Service    │
│  via Prisma)│ │         │ │  (R2)  │ │ (Resend/Termii)│
└─────────────┘ └────────┘ └────────┘ └──────────────┘
```

---

## 5. Information Architecture & Sitemap

```
Home (/)
├── Discover (/discover)
│   ├── All Campaigns
│   ├── Ongoing Campaigns
│   ├── One-Time Campaigns
│   └── Organizations
├── Campaign Detail (/campaign/:id)
│   ├── Story Tab
│   ├── Gallery Tab
│   ├── Updates Tab
│   ├── Comments Tab
│   └── Donate Widget
├── Organization Profile (/org/:id)
│   ├── About
│   ├── Campaigns
│   ├── Gallery
│   └── Support CTA
├── Donate (/donate/:id)
│   ├── Amount Selection
│   ├── Payment Method
│   ├── Anonymous Toggle
│   ├── Tip (Optional)
│   └── Review & Confirm
├── Create Campaign (/create) [Authenticated]
│   ├── Step 1: Mode (One-Time / Ongoing)
│   ├── Step 2: Type (Money / Items / Volunteer / Professional / Emergency)
│   ├── Step 3: Story & Details
│   ├── Step 4: Media Upload
│   ├── Step 5: Frequencies (Ongoing only)
│   └── Step 6: Preview & Publish
├── Register Organization (/register-org) [Authenticated]
│   ├── Step 1: Organization Details
│   ├── Step 2: Mission & Bio
│   ├── Step 3: Media Upload
│   └── Step 4: Preview & Submit
├── Authentication
│   ├── Login (/login)
│   ├── Sign Up (/signup)
│   └── Forgot Password (/forgot-password)
├── Dashboard [Authenticated]
│   ├── My Giving (/my-giving)
│   └── Profile (/profile)
└── Admin Dashboard (/admin) [Platform Admin Only]
    ├── Organization Verification
    ├── Campaign Moderation
    ├── User Management
    └── Platform Analytics
```

---

## 6. Data Models (Entity Definitions)

### 6.1 User

| Field         | Type     | Constraints                              | Notes                     |
| ------------- | -------- | ---------------------------------------- | ------------------------- |
| id            | UUID     | PK                                       | Auto-generated            |
| email         | String   | Unique, required                         | Login identifier          |
| passwordHash  | String   | Required                                 | bcrypt hashed             |
| firstName     | String   | Required                                 |                           |
| lastName      | String   | Required                                 |                           |
| phone         | String   | Unique, required                         | Nigerian format (+234...) |
| phoneVerified | Boolean  | Default false                            | After OTP verification    |
| emailVerified | Boolean  | Default false                            | After email confirmation  |
| avatar        | String?  | Nullable                                 | URL to uploaded image     |
| role          | Enum     | "donor" / "org_admin" / "platform_admin" | Default: "donor"          |
| bvnVerified   | Boolean  | Default false                            | Bank Verification Number  |
| createdAt     | DateTime | Required                                 |                           |
| updatedAt     | DateTime | Required                                 |                           |

### 6.2 Organization

| Field              | Type      | Constraints                                             | Notes                            |
| ------------------ | --------- | ------------------------------------------------------- | -------------------------------- |
| id                 | UUID      | PK                                                      |                                  |
| name               | String    | Required, max 120 chars                                 |                                  |
| tagline            | String    | Required, max 200 chars                                 |                                  |
| category           | Enum      | "church" / "mission" / "orphanage" / "school" / "other" |                                  |
| denomination       | String?   | Nullable                                                | Christian denomination           |
| location           | String    | Required                                                | City, State, Nigeria             |
| bio                | Text      | Required                                                | Rich text / markdown             |
| coverPhoto         | String    | Required                                                | URL                              |
| photos             | String[]  | Required                                                | Array of URLs, min 3             |
| videos             | String[]  | Optional                                                | YouTube/Vimeo URLs               |
| founded            | String    | Required                                                | Year or date                     |
| website            | String?   | Nullable                                                |                                  |
| socialLinks        | JSON?     | Optional                                                | { facebook, instagram, twitter } |
| verificationStatus | Enum      | "unverified" / "pending" / "verified"                   | Default: "unverified"            |
| verifiedAt         | DateTime? | Nullable                                                | When verification completed      |
| verificationNotes  | Text?     | Nullable                                                | Admin notes                      |
| totalReceived      | Decimal   | Default 0                                               | Running sum of donations         |
| supporters         | Integer   | Default 0                                               | Unique donor count               |
| createdBy          | UUID      | FK → User                                               | The user who registered this org |
| createdAt          | DateTime  | Required                                                |                                  |
| updatedAt          | DateTime  | Required                                                |                                  |

### 6.3 Campaign

| Field              | Type      | Constraints                                                   | Notes                                  |
| ------------------ | --------- | ------------------------------------------------------------- | -------------------------------------- |
| id                 | UUID      | PK                                                            |                                        |
| orgId              | UUID?     | FK → Organization, Nullable                                   | null if individual raiser              |
| raiserId           | UUID      | FK → User                                                     | The user who created it                |
| mode               | Enum      | "one-time" / "ongoing"                                        |                                        |
| type               | Enum      | "money" / "item" / "volunteer" / "professional" / "emergency" |                                        |
| title              | String    | Required, max 150 chars                                       |                                        |
| story              | Text      | Required                                                      | Detailed campaign story (markdown)     |
| faithCategory      | Enum      | One of 8 categories (see 6.3a)                                |                                        |
| cover              | String    | Required                                                      | Cover image URL                        |
| gallery            | String[]  | Required                                                      | Min 1 image                            |
| goal               | Decimal?  | Required if mode="one-time"                                   | Fundraising target in NGN              |
| raised             | Decimal   | Default 0                                                     | Running total donated                  |
| donors             | Integer   | Default 0                                                     | Unique donor count                     |
| currency           | String    | Default "NGN"                                                 |                                        |
| location           | String    | Required                                                      | Campaign location                      |
| urgency            | Enum      | "low" / "medium" / "high" / "critical"                        | Default: "medium"                      |
| verificationStatus | Enum      | "unverified" / "pending" / "verified"                         |                                        |
| status             | Enum      | "draft" / "active" / "completed" / "cancelled" / "expired"    | Default: "draft"                       |
| publishedAt        | DateTime? | Nullable                                                      | When status became "active"            |
| expiresAt          | DateTime? | Nullable                                                      | Auto-expire for one-time               |
| needs              | String[]? | Optional                                                      | For non-money campaigns (items needed) |
| frequencies        | Enum[]?   | Required if mode="ongoing"                                    | "weekly" / "monthly" / "quarterly"     |
| createdAt          | DateTime  | Required                                                      |                                        |
| updatedAt          | DateTime  | Required                                                      |                                        |

#### 6.3a Faith Categories

1. Church Building
2. Missions & Outreach
3. Orphanage
4. Education
5. Food & Relief
6. Medical Mission
7. Emergency
8. Community Development

### 6.4 Donation

| Field               | Type      | Constraints                                    | Notes                          |
| ------------------- | --------- | ---------------------------------------------- | ------------------------------ |
| id                  | UUID      | PK                                             |                                |
| campaignId          | UUID      | FK → Campaign                                  |                                |
| donorId             | UUID?     | FK → User, Nullable                            | null if anonymous              |
| amount              | Decimal   | Required, min ₦100                             | Donation amount in NGN         |
| platformFee         | Decimal   | Required                                       | 2.5% of amount                 |
| paystackFee         | Decimal   | Required                                       | Paystack's fee                 |
| netAmount           | Decimal   | Required                                       | Amount after all fees          |
| currency            | String    | Default "NGN"                                  |                                |
| paymentMethod       | Enum      | "card" / "bank_transfer" / "ussd"              |                                |
| paystackRef         | String    | Unique                                         | Paystack transaction reference |
| paystackStatus      | Enum      | "pending" / "success" / "failed" / "abandoned" |                                |
| anonymous           | Boolean   | Default false                                  | Hide donor name on campaign    |
| tipAmount           | Decimal   | Default 0                                      | Optional tip to AzarFaith      |
| note                | String?   | Nullable                                       | Donor's message                |
| isRecurring         | Boolean   | Default false                                  |                                |
| recurringDonationId | UUID?     | FK → RecurringDonation, Nullable               |                                |
| refundedAt          | DateTime? | Nullable                                       | If refunded                    |
| refundReason        | String?   | Nullable                                       |                                |
| createdAt           | DateTime  | Required                                       |                                |
| updatedAt           | DateTime  | Required                                       |                                |

### 6.5 RecurringDonation

| Field                  | Type      | Constraints                                  | Notes                                           |
| ---------------------- | --------- | -------------------------------------------- | ----------------------------------------------- |
| id                     | UUID      | PK                                           |                                                 |
| donorId                | UUID      | FK → User                                    |                                                 |
| campaignId             | UUID      | FK → Campaign                                |                                                 |
| amount                 | Decimal   | Required                                     | Per-period amount                               |
| frequency              | Enum      | "weekly" / "monthly" / "quarterly"           |                                                 |
| mode                   | Enum      | "auto" / "pledge"                            | Auto = Paystack subscription, Pledge = reminder |
| paystackSubscriptionId | String?   | Nullable                                     | Paystack plan code                              |
| nextChargeDate         | DateTime  | Required                                     |                                                 |
| lastChargeDate         | DateTime? | Nullable                                     |                                                 |
| status                 | Enum      | "active" / "paused" / "cancelled" / "failed" | Default: "active"                               |
| failureCount           | Integer   | Default 0                                    | Consecutive failures before auto-cancel         |
| maxFailures            | Integer   | Default 3                                    | Threshold to auto-cancel                        |
| totalDonated           | Decimal   | Default 0                                    | Running total across all charges                |
| cancelledAt            | DateTime? | Nullable                                     |                                                 |
| cancelReason           | String?   | Nullable                                     |                                                 |
| createdAt              | DateTime  | Required                                     |                                                 |
| updatedAt              | DateTime  | Required                                     |                                                 |

### 6.6 CampaignUpdate

| Field      | Type      | Constraints             | Notes            |
| ---------- | --------- | ----------------------- | ---------------- |
| id         | UUID      | PK                      |                  |
| campaignId | UUID      | FK → Campaign           |                  |
| authorId   | UUID      | FK → User               | Campaign creator |
| title      | String    | Required, max 200 chars |                  |
| body       | Text      | Required                | Rich text update |
| images     | String[]? | Optional                |                  |
| createdAt  | DateTime  | Required                |                  |

### 6.7 CampaignComment

| Field      | Type      | Constraints              | Notes       |
| ---------- | --------- | ------------------------ | ----------- |
| id         | UUID      | PK                       |             |
| campaignId | UUID      | FK → Campaign            |             |
| authorId   | UUID      | FK → User                |             |
| body       | Text      | Required, max 1000 chars |             |
| editedAt   | DateTime? | Nullable                 |             |
| deletedAt  | DateTime? | Nullable                 | Soft delete |
| createdAt  | DateTime  | Required                 |             |

### 6.8 OTP

| Field     | Type      | Constraints                           | Notes      |
| --------- | --------- | ------------------------------------- | ---------- |
| id        | UUID      | PK                                    |            |
| phone     | String    | Required                              |            |
| code      | String    | Required, 6 digits                    |            |
| purpose   | Enum      | "signup" / "login" / "password_reset" |            |
| attempts  | Integer   | Default 0                             | Max 5      |
| expiresAt | DateTime  | Required                              | 10 min TTL |
| usedAt    | DateTime? | Nullable                              |            |
| createdAt | DateTime  | Required                              |            |

### 6.9 PlatformSettings

| Field               | Type    | Default | Notes                               |
| ------------------- | ------- | ------- | ----------------------------------- |
| platformFeePercent  | Decimal | 2.5     | % of donation                       |
| minDonation         | Decimal | 100     | Minimum NGN                         |
| maxDonation         | Decimal | 5000000 | Maximum NGN                         |
| maxTipAmount        | Decimal | 2500    | Max tip per donation                |
| autoVerifyThreshold | Integer | 5       | Donations before auto-verify prompt |
| campaignExpiryDays  | Integer | 90      | Auto-expire one-time campaigns      |

---

## 7. Modules — Detailed Requirements

---

### MODULE 1: Authentication & User Management

#### 1.1 Overview

Secure, Nigerian-context-aware authentication supporting email/password, Google OAuth, and phone OTP verification. Phone verification is mandatory for all users to build platform trust.

#### 1.2 User Stories

**US-1.1: Email/Password Registration**

> As a new donor, I want to register with my email and password so that I can start giving to causes.

**Acceptance Criteria:**

- Registration form collects: first name, last name, email, phone (Nigerian format), password, confirm password
- Email must be unique in the system
- Phone must be unique and in Nigerian format (+234XXXXXXXXXX)
- Password must be minimum 8 characters, include at least 1 uppercase, 1 lowercase, 1 number
- Upon registration, a 6-digit OTP is sent via SMS to the provided phone number
- User must verify phone OTP before account is activated
- Account is created in "unverified" state until phone is confirmed
- Welcome email is sent upon successful registration
- Redirect to onboarding or home page after successful signup

**US-1.2: Phone OTP Verification**

> As a registered user, I want to verify my phone number via OTP so that my identity is confirmed on the platform.

**Acceptance Criteria:**

- OTP is 6 digits, numeric only
- OTP expires after 10 minutes
- Maximum 5 incorrect attempts before OTP is invalidated
- User can request a new OTP after 60 seconds (cooldown)
- Maximum 3 OTP resend requests within 10 minutes
- On successful verification: user's `phoneVerified` is set to true, account becomes active
- On max failures: account is temporarily locked for 15 minutes
- OTP is delivered via SMS (Termii or Africa's Talking)

**US-1.3: Email/Password Login**

> As a registered user, I want to log in with my email and password so that I can access my account.

**Acceptance Criteria:**

- Login form accepts email and password
- On success: JWT access token (15 min) + refresh token (7 days) issued
- Refresh token stored as httpOnly cookie; access token in memory
- On failure after 5 consecutive attempts: account locked for 15 minutes, email notification sent
- "Remember me" option extends refresh token to 30 days
- Redirect to previous page or home after login

**US-1.4: Google OAuth Login/Registration**

> As a user, I want to sign in with my Google account so that I don't have to create another password.

**Acceptance Criteria:**

- "Continue with Google" button on login and signup pages
- On first Google login: account is created automatically from Google profile data
- Phone number is required after first Google login (cannot proceed without it)
- Google OAuth flow uses PKCE (Authorization Code flow with code verifier)
- On subsequent logins: existing account is linked and logged in
- Google profile picture is used as avatar
- Google email must not already exist with password-based auth (show conflict error)

**US-1.5: Forgot/Reset Password**

> As a user who forgot my password, I want to reset it via email so that I can regain access to my account.

**Acceptance Criteria:**

- User enters email address on forgot password page
- If email exists: password reset link sent via email (valid for 1 hour)
- If email does not exist: same success message shown (do not reveal if email exists)
- Reset link contains a one-time-use JWT token
- New password must meet strength requirements (same as registration)
- Password history: cannot reuse last 3 passwords
- After successful reset: all existing sessions are invalidated
- Confirmation email sent after successful password change

**US-1.6: Session Management**

> As a user, I want my session to be secure and manageable so that I feel safe using the platform.

**Acceptance Criteria:**

- Access tokens expire after 15 minutes; refresh tokens after 7 days
- Token refresh happens transparently in the background
- User can view active sessions (device, browser, last active)
- User can revoke individual sessions or all other sessions
- Sessions are invalidated on password change
- Logout clears all tokens and cookies

**US-1.7: Profile Management**

> As a registered user, I want to view and edit my profile so that my information is accurate.

**Acceptance Criteria:**

- Profile page shows: name, email, phone, avatar, join date, total given, active recurring gifts
- User can edit: first name, last name, avatar
- User can change password (requires current password)
- User can view verification badges: BVN, Phone, Email
- Avatar upload: max 5MB, JPEG/PNG/WebP, cropped to square
- Profile updates are reflected immediately across the platform

---

### MODULE 2: Organization Registration & Management

#### 2.1 Overview

Faith-based organizations (churches, missions, orphanages, schools, ministries) register on the platform, undergo verification, and manage their campaigns and donor relationships.

#### 2.2 User Stories

**US-2.1: Register Organization**

> As a church leader, I want to register my church on AzarFaith so that people can find and support our work.

**Acceptance Criteria:**

- 4-step registration wizard:
  - **Step 1 — Details:** Organization name (max 120 chars), category (church/mission/orphanage/school/other), denomination (if applicable), location (city, state), founded year
  - **Step 2 — Mission:** Tagline (max 200 chars), full bio/rich text (min 100 words)
  - **Step 3 — Media:** Cover photo upload, minimum 3 photos (max 5MB each, JPEG/PNG/WebP), optional YouTube/Vimeo video URLs
  - **Step 4 — Review:** Preview all information, confirm and submit
- Only authenticated users can register an organization
- One user can register multiple organizations
- Organization is created in "unverified" status
- Submission triggers admin notification for verification review
- User can save as draft and return later
- Form validation at each step (can't proceed with errors)
- Progress indicator shows current step and completion

**US-2.2: Organization Profile Page**

> As a visitor, I want to view an organization's full profile so that I can learn about their mission before giving.

**Acceptance Criteria:**

- Page displays: cover photo, name, tagline, category badge, location, verification badge
- Stats section: total received (NGN), number of supporters, number of campaigns, founded year
- About section: full bio, denomination
- Photo gallery with lightbox viewer
- Videos section (embedded YouTube/Vimeo)
- List of organization's active campaigns (both ongoing and one-time)
- Share buttons: WhatsApp, Twitter, Facebook, copy link
- "Support this organization" CTA button
- If unverified: prominent "Organization not yet verified" notice
- 404 page if organization not found

**US-2.3: Edit Organization Profile**

> As an organization admin, I want to update my organization's information so that it stays current.

**Acceptance Criteria:**

- Only the organization creator (or platform admin) can edit
- All fields from registration are editable
- Changes to critical fields (name, category) trigger re-verification review
- Media changes: can add/remove photos, update cover
- Changes save as draft until explicitly published
- Edit history is maintained (for admin audit)

**US-2.4: Organization Verification**

> As a platform admin, I want to verify organizations so that donors can trust the causes on the platform.

**Acceptance Criteria:**

- Verification review queue shows all "pending" organizations
- Admin can view: all registration details, submitted documents, contact info
- Admin can approve (status → "verified"), reject (with reason), or request more information
- Verification criteria: legitimate organization, real location, verifiable leadership, genuine mission
- Verification badge displayed on organization profile and all their campaigns
- Notification sent to organization admin on verification decision
- Rejected organizations can re-apply after 30 days
- Verified organizations can flag urgent campaigns for faster approval

**US-2.5: Organization Dashboard**

> As an organization admin, I want a dashboard to manage my campaigns, view donations, and track supporter growth.

**Acceptance Criteria:**

- Overview cards: total raised, total supporters, active campaigns, pending campaigns
- Campaign list with: title, status, raised/goal, donor count, last donation date
- Donation feed: recent donations with donor info (unless anonymous), amount, date
- Recurring donor count and projected monthly income
- Ability to post campaign updates from dashboard
- Export donations as CSV (for accounting)
- Notification center for new donations

---

### MODULE 3: Campaign Creation & Management

#### 3.1 Overview

Users create fundraising campaigns (one-time or ongoing) with different types and goals. Campaigns go through a creation wizard, review, and publishing workflow.

#### 3.2 User Stories

**US-3.1: Create One-Time Campaign**

> As a church leader, I want to create a one-time fundraising campaign so that I can raise money for a specific need (e.g., build a hall, buy equipment).

**Acceptance Criteria:**

- 6-step creation wizard:
  - **Step 1 — Mode:** Select "One-Time" (vs. "Ongoing")
  - **Step 2 — Type:** Select type: Raise Funds / Request Items / Find Volunteers / Professional Help / Emergency
  - **Step 3 — Story:** Campaign title (max 150 chars), faith category dropdown, detailed story (rich text, min 100 words), urgency level (low/medium/high/critical)
  - **Step 4 — Details & Media:** Fundraising goal in NGN (min ₦5,000), cover image upload, gallery images (min 1), location
  - **Step 5 — Preview:** Full preview of campaign as donors will see it
  - **Step 6 — Publish:** Confirm and publish (or save as draft)
- Link to organization profile (if registered org admin)
- Progress bar shows campaign completion during creation
- Campaign is created in "draft" status
- Publish triggers admin moderation queue
- Draft campaigns can be edited and published later

**US-3.2: Create Ongoing Campaign**

> As a missionary, I want to set up an ongoing support campaign so that people can support my work monthly or quarterly.

**Acceptance Criteria:**

- Steps 1-3 identical to one-time campaign
- **Step 4 — Details:** No fundraising goal (or optional target), cover image, gallery, location
- **Step 5 — Frequencies:** Select available frequencies: weekly, monthly, quarterly (at least one required)
- **Step 6 — Preview & Publish:** Same as one-time
- Ongoing campaigns show frequency options on campaign page
- No expiration date for ongoing campaigns
- Ongoing campaigns show "Ongoing Support" badge

**US-3.3: Campaign Types**

> As a platform, we need to support different types of campaigns so that organizations can ask for various forms of help.

**Acceptance Criteria:**

- **Raise Funds:** Standard monetary campaign with goal
- **Request Items:** Lists specific items needed (e.g., "50 bags of rice, 100 chairs"); donors see a needs checklist
- **Find Volunteers:** Lists volunteer roles needed; donors can express interest
- **Professional Help:** Asks for specific professional skills (e.g., "accountant, architect"); donors can offer help
- **Emergency:** Marked with high/critical urgency; highlighted in UI; fast-tracked in moderation

**US-3.4: Campaign Detail Page**

> As a donor, I want to see all details about a campaign so that I can make an informed decision to give.

**Acceptance Criteria:**

- Hero section: cover image, title, organization/raiser info, location, urgency badge
- Progress bar: raised amount / goal (NGN), donor count, days remaining (one-time) or "Ongoing" badge
- Tabbed content:
  - **Story:** Full campaign story (rendered markdown)
  - **Gallery:** Photo grid with lightbox, embedded videos
  - **Updates:** Chronological list of campaign updates from creator
  - **Comments:** Donor comments, ability to post (if authenticated)
- Sidebar/sticky widget: Donate button, amount presets, share buttons
- Recent donations list (names, amounts, dates — unless anonymous)
- If ongoing: frequency selector and "Set up recurring giving" CTA
- If one-time: progress bar + countdown to expiry
- Organization link (if applicable)
- 404 page for non-existent campaigns
- SEO: Open Graph tags, Twitter cards, structured data for Google

**US-3.5: Campaign Updates**

> As a campaign creator, I want to post updates so that donors know how their giving is making a difference.

**Acceptance Criteria:**

- Only campaign creator can post updates
- Update has: title (max 200 chars), body (rich text), optional images
- Updates appear in reverse chronological order on campaign page
- Email notification sent to all donors when an update is posted
- Updates are permanent (cannot be deleted, only edited with "edited" badge)

**US-3.6: Campaign Comments**

> As a donor, I want to leave a comment on a campaign so that I can encourage the creator and other donors.

**Acceptance Criteria:**

- Only authenticated users can comment
- Comment body: max 1000 characters
- Comments appear in chronological order
- Campaign creator can reply (threaded, 1 level deep)
- Comment author can edit/delete their own comments
- Deleted comments show "[Comment removed]" placeholder
- No profanity filtering in MVP (manual moderation)

**US-3.7: Campaign Moderation**

> As a platform admin, I want to moderate campaigns before they go live so that we maintain platform integrity.

**Acceptance Criteria:**

- All new campaigns enter moderation queue upon publish
- Admin review: content appropriateness, legitimacy, completeness
- Admin can approve, reject (with reason), or request changes
- Approved campaigns go live immediately
- Rejected campaigns: creator notified with reason, can edit and resubmit
- Emergency campaigns: fast-tracked (reviewed within 2 hours)
- Automated checks: minimum content length, image count, goal reasonableness

---

### MODULE 4: Donation Flow & Payments

#### 4.1 Overview

The core giving experience — donors give to campaigns via Paystack with support for one-time and recurring donations, anonymous giving, optional tips, and transparent fee breakdown.

#### 4.2 User Stories

**US-4.1: One-Time Donation**

> As a donor, I want to make a one-time donation to a campaign so that I can support a cause I believe in.

**Acceptance Criteria:**

- Donation entry from campaign page or donate page
- Step 1 — Amount: Preset amounts (₦2,000 / ₦5,000 / ₦10,000 / ₦25,000 / ₦50,000) + custom amount field
- Minimum donation: ₦100; Maximum: ₦5,000,000
- Custom amount input validates: numeric, within range, no decimals
- Step 2 — Payment Method: Card, Bank Transfer, USSD (via Paystack)
- Step 3 — Options: Anonymous toggle, optional tip to AzarFaith (₦0 – ₦2,500), personal note (max 200 chars)
- Step 4 — Review: Amount, fee breakdown (platform fee 2.5% + Paystack fee), net amount to cause, tip amount, total charge
- Paystack inline popup for card payment
- On success: confirmation screen with receipt details, confetti animation, share buttons
- On failure: clear error message, option to retry, no charge
- Donation record created with status "pending" → "success" or "failed"
- Campaign's `raised` and `donors` counts updated atomically on success
- Organization's `totalReceived` and `supporters` updated atomically
- Email receipt sent to donor
- Push notification to campaign creator: "You received a donation of ₦X from [Donor Name]!"

**US-4.2: Anonymous Donation**

> As a donor, I want to give anonymously so that my giving remains private.

**Acceptance Criteria:**

- Anonymous toggle on donation flow
- When enabled: donor name shows as "Anonymous Donor" on campaign page
- Donation record still tracks donor ID internally (for receipts and records)
- Campaign creator sees "Anonymous" in their donation feed
- Email receipt still shows donor's real name
- Statistics (donor count) still include anonymous donors

**US-4.3: Donor Tip**

> As a donor, I want to leave an optional tip to AzarFaith so that I can support the platform.

**Acceptance Criteria:**

- Tip input appears after amount selection
- Preset tip amounts: ₦0 / ₦500 / ₦1,000 / ₦2,500 / Custom
- Tip is separate from donation amount
- Tip amount shown in review step
- Tip is charged in the same Paystack transaction
- Tip revenue goes to AzarFaith's Paystack account
- Donor can choose ₦0 (no tip) without any pressure or guilt-inducing UI

**US-4.4: Recurring Donation — Automatic (Paystack Subscription)**

> As a donor, I want to set up automatic recurring giving so that I consistently support a cause without manual effort.

**Acceptance Criteria:**

- Available for ongoing campaigns only
- Donor selects frequency: weekly, monthly, or quarterly
- Donor selects amount (same validation as one-time)
- Paystack is configured with a subscription plan
- First charge is immediate; subsequent charges follow the frequency schedule
- Donor receives email confirmation: "Your ₦X [monthly] gift to [Campaign] is set up!"
- Donor receives email reminder 3 days before each charge
- Each charge generates a new Donation record linked to the RecurringDonation
- If charge fails: retry after 3 days, up to 3 consecutive failures, then auto-cancel
- Donor notified on each failed charge
- Donor can pause, resume, or cancel from "My Giving" dashboard
- Campaign creator sees: "X recurring supporters, projected ₦Y/month"

**US-4.5: Recurring Donation — Pledge (Reminder-Based)**

> As a donor, I want to set up a pledge where I'm reminded to give rather than auto-charged, so that I stay in control of my finances.

**Acceptance Criteria:**

- Donor selects "Pledge" mode during recurring setup
- Frequency and amount recorded
- Email/SMS reminder sent on each scheduled date
- Reminder includes direct link to donate page with pre-filled amount
- No automatic charge — donor must manually complete each donation
- If donor completes pledge: linked to the RecurringDonation record
- If donor misses 2 consecutive pledges: gentle reminder + option to cancel
- Pledge status tracked: on-track / missed / completed

**US-4.6: Payment Failure Handling**

> As a platform, we need to gracefully handle payment failures so that donors aren't frustrated and campaigns aren't disrupted.

**Acceptance Criteria:**

- Clear error messages from Paystack are surfaced to donor
- Failed donations are logged but not counted in campaign totals
- Donor is offered retry option immediately
- For recurring: exponential backoff retry schedule (3 days, 7 days, 14 days)
- After 3 consecutive failures: recurring donation auto-cancelled, donor notified
- Campaign creator is NOT notified of individual failures (only aggregate stats affected)
- Stuck pending transactions are auto-resolved after 30 minutes (webhook-based)

**US-4.7: Donation Receipts & Notifications**

> As a donor, I want to receive a receipt for my donation so that I have a record of my giving.

**Acceptance Criteria:**

- Email receipt sent immediately on successful donation
- Receipt includes: donor name, amount, campaign name, organization, date, transaction reference, fee breakdown
- Receipt is PDF-attached (or HTML email with print option)
- Donation history accessible from donor's profile
- Campaign creator receives notification (name, amount, date — not financial details)
- Monthly giving summary email sent to donors (total given, campaigns supported)

---

### MODULE 5: Discovery & Search

#### 5.1 Overview

Users browse, search, and filter campaigns and organizations to find causes they care about.

#### 5.2 User Stories

**US-5.1: Browse Campaigns**

> As a visitor, I want to browse campaigns so that I can discover causes to support.

**Acceptance Criteria:**

- Discover page shows campaigns in a responsive grid
- Tabs: All Campaigns / Ongoing / One-Time / Organizations
- Default sort: newest first
- Each card shows: cover image, title, organization/raiser, location, category badge, urgency badge (if high/critical), progress bar (one-time), frequency badge (ongoing)
- Infinite scroll or pagination (20 items per page)
- Loading skeletons during fetch
- Empty state: "No campaigns found" with CTA to create one

**US-5.2: Search**

> As a donor, I want to search for campaigns by keyword so that I can find specific causes.

**Acceptance Criteria:**

- Search bar prominently placed on discover page
- Searches campaign titles, stories, organization names
- Real-time search with debounce (300ms)
- Search results highlight matching terms
- Recent searches saved locally (for logged-in users)
- Clear search option
- Minimum 3 characters to trigger search

**US-5.3: Filter & Sort**

> As a donor, I want to filter campaigns by category, urgency, and type so that I can narrow down to what matters to me.

**Acceptance Criteria:**

- Filter by: faith category (8 options), urgency (4 levels), campaign type (5 options), location (state)
- Filters are composable (multiple can be active)
- Active filters shown as removable chips
- Sort by: newest, most funded, ending soon, most popular (donor count)
- Filter state persists in URL (shareable links)
- Clear all filters option
- Filter count badges show number of results per filter

**US-5.4: Featured & Trending**

> As a donor, I want to see featured and trending campaigns on the home page so that I can quickly find impactful causes.

**Acceptance Criteria:**

- Home page hero section with featured campaign (admin-curated or algorithmically selected)
- "Featured Organizations" carousel (verified orgs with most supporters)
- "Ongoing Campaigns" section showing active recurring campaigns
- "One-Time Campaigns" section showing campaigns closest to goal
- Trending: campaigns with most donations in last 7 days
- Featured content refreshes daily

---

### MODULE 6: Donor Dashboard & Giving History

#### 6.1 Overview

Donors manage their giving activity, track recurring donations, and view their impact.

#### 6.2 User Stories

**US-6.1: My Giving Dashboard**

> As a donor, I want a dashboard showing all my giving activity so that I can track my generosity.

**Acceptance Criteria:**

- Two sections: Active Recurring / Completed One-Time
- Active Recurring list: campaign name, amount, frequency, next date, status (active/paused), cancel button
- Completed list: campaign name, amount, date, receipt link
- Total given: lifetime and current month
- Number of campaigns supported
- Impact summary: "You've supported X causes, impacting Y lives" (placeholder for future metrics)

**US-6.2: Manage Recurring Donations**

> As a donor, I want to pause, resume, or cancel my recurring donations so that I can manage my giving based on my financial situation.

**Acceptance Criteria:**

- Pause: temporarily stops charges, preserves schedule, resume anytime
- Resume: reactivates with next scheduled charge
- Cancel: permanently stops recurring, asks for reason (optional), confirmation modal
- All changes take effect immediately
- Email confirmation for each action
- Campaign creator notified: "A recurring supporter has [paused/cancelled] their gift" (no donor identity in notification)

**US-6.3: Donation Impact**

> As a donor, I want to see the impact of my donations so that I feel my giving matters.

**Acceptance Criteria:**

- On campaign detail page: "You've given ₦X to this campaign" (if authenticated and donated)
- Campaign updates section: see how funds are being used
- Monthly email digest: "Your giving this month: ₦X across Y campaigns"
- Future: impact metrics (lives touched, meals served, etc.) — not MVP

---

### MODULE 7: Platform Admin Dashboard

#### 7.1 Overview

Internal tools for AzarFaith team to manage organizations, campaigns, users, and platform health.

#### 7.2 User Stories

**US-7.1: Admin Authentication & Access**

> As a platform admin, I want secure access to the admin dashboard so that I can manage the platform.

**Acceptance Criteria:**

- Admin access restricted to users with `platform_admin` role
- Admin route guard: unauthorized users redirected to home
- Admin role assigned manually (no self-registration for admin)
- Admin session has shorter expiry (1 hour) for security
- All admin actions are audit-logged

**US-7.2: Organization Verification Queue**

> As a platform admin, I want to review and verify organizations so that only legitimate causes are on the platform.

**Acceptance Criteria:**

- Queue shows all organizations with status "pending"
- Each entry shows: name, category, location, submitted date, contact info
- Detail view: all registration data, photos, bio
- Actions: Approve / Reject (with reason) / Request More Info
- Batch actions for bulk approval
- SLA tracking: organizations reviewed within 48 hours
- Notification to org admin on decision

**US-7.3: Campaign Moderation Queue**

> As a platform admin, I want to review campaigns before they go live so that platform quality is maintained.

**Acceptance Criteria:**

- Queue shows all campaigns with status "pending"
- Each entry: title, type, mode, raiser, organization, submitted date
- Detail view: full campaign preview as donor would see it
- Actions: Approve / Reject (with reason) / Request Changes
- Emergency campaigns highlighted and prioritized
- Auto-approve option for verified organizations (configurable)
- Bulk moderation for high volume

**US-7.4: User Management**

> As a platform admin, I want to manage users so that I can handle reports and maintain trust.

**Acceptance Criteria:**

- User list with search and filters (role, verification status, join date)
- User detail view: profile info, donations, campaigns, activity log
- Actions: Suspend (with reason), reactivate, change role
- Suspended users cannot login or make donations
- Suspension notification sent to user
- Appeal process: user can request review via email

**US-7.5: Platform Analytics**

> As a platform admin, I want to see key metrics so that I can track platform health and growth.

**Acceptance Criteria:**

- Dashboard with cards: Total Users, Total Organizations, Total Campaigns, Total Raised (MTD, YTD)
- Charts: Donations over time, New users over time, Campaign creation rate
- Top campaigns by donation volume
- Top organizations by supporter count
- Geographic distribution of donations
- Recurring donation metrics: MRR, churn rate, avg. recurring amount
- Export data as CSV for reporting

**US-7.6: Content Moderation**

> As a platform admin, I want to moderate comments and updates so that platform content remains appropriate.

**Acceptance Criteria:**

- Flagged content queue (auto-flagged or user-reported)
- Comment moderation: hide, delete, warn user
- Campaign update moderation: edit request, hide, remove
- User warning system: 3 warnings → account review → suspension
- No auto-moderation in MVP (manual review only)

---

### MODULE 8: Notifications & Communications

#### 8.1 Overview

Transactional emails, SMS, and in-app notifications to keep users engaged and informed.

#### 8.2 User Stories

**US-8.1: Transactional Emails**

> As a user, I want to receive relevant email notifications so that I stay informed about my giving activity.

**Acceptance Criteria:**
| Trigger | Recipient | Email |
|---|---|---|
| Registration | New user | Welcome email with verification link |
| Password reset | User | Reset link (1 hour expiry) |
| Donation success | Donor | Receipt with details |
| Donation received | Campaign creator | Notification (amount, donor name or "Anonymous") |
| Campaign update | All donors of campaign | Update notification with link |
| Recurring charge | Donor | Upcoming charge reminder (3 days before) |
| Recurring failed | Donor | Failure notice with retry info |
| Recurring cancelled | Donor + Creator | Cancellation confirmation |
| Org verification | Org admin | Decision notification |
| Campaign approved | Campaign creator | Approval notification |
| Campaign rejected | Campaign creator | Rejection with reason |
| Monthly digest | Donor | Monthly giving summary |

**US-8.2: SMS Notifications**

> As a user, I want critical notifications via SMS so that I don't miss important updates.

**Acceptance Criteria:**

- OTP delivery (signup, login, password reset)
- Large donation alert (donations > ₦100,000): SMS to campaign creator
- Recurring payment failure: SMS to donor
- SMS is sent via Termii or Africa's Talking (Nigerian provider)

**US-8.3: In-App Notifications**

> As a user, I want in-app notifications so that I see updates when I'm on the platform.

**Acceptance Criteria:**

- Notification bell icon in navbar with unread count badge
- Notification types: donations received, campaign updates, comments, system messages
- Mark as read / mark all as read
- Notification preferences: user can opt out of specific types
- Notifications stored in database, paginated loading
- Real-time not required for MVP (poll on page load)

---

### MODULE 9: SEO, Sharing & Social

#### 9.1 Overview

Optimize for organic discovery and social sharing to drive platform growth.

#### 9.2 User Stories

**US-9.1: SEO Optimization**

> As a platform, we want campaign and org pages to be SEO-optimized so that we rank in Google search results.

**Acceptance Criteria:**

- Server-side rendering (SSR) for all public pages
- Dynamic meta tags: title, description, OG tags, Twitter cards per page
- Open Graph image: campaign cover or org cover photo
- Structured data (JSON-LD): Organization, Event, or Product schema
- Sitemap.xml generated automatically
- robots.txt configured for crawling
- Canonical URLs to prevent duplicate content
- Page speed: Lighthouse score > 90

**US-9.2: Social Sharing**

> As a donor, I want to share campaigns on social media so that I can help spread the word.

**Acceptance Criteria:**

- Share buttons on campaign detail page: WhatsApp, Twitter/X, Facebook, Copy Link
- Share link includes campaign title and preview image (via OG tags)
- WhatsApp share includes pre-filled message: "Support [Campaign Title] on AzarFaith: [link]"
- Twitter share includes campaign title and link
- Copy link with toast confirmation
- Share count displayed (optional, future)

**US-9.3: Referral Tracking**

> As a platform, we want to track referral sources so that we understand our growth channels.

**Acceptance Criteria:**

- Share links include referral parameter (e.g., `?ref=user_abc`)
- Referral stored with donation record
- Referral source tracked: direct, social, email, search
- Monthly report: top referrers, conversion rates by channel

---

### MODULE 10: Security, Compliance & Trust

#### 10.1 Overview

Ensure platform security, data protection, and trust mechanisms are robust.

#### 10.2 User Stories

**US-10.1: Input Validation & Sanitization**

> As a platform, we need to validate and sanitize all user inputs so that we prevent injection attacks and data corruption.

**Acceptance Criteria:**

- All inputs validated with Zod schemas on both client and server
- Rich text (stories, comments) sanitized against XSS (use DOMPurify)
- File uploads: validate type, size, and scan for malware (basic: extension + MIME type check)
- Rate limiting on all API endpoints: 100 requests/minute per user, 10 requests/minute for auth endpoints
- CSRF protection on all state-changing requests
- SQL injection prevented by Prisma parameterized queries

**US-10.2: Data Privacy**

> As a user, I want my personal data to be protected so that I trust the platform.

**Acceptance Criteria:**

- Passwords hashed with bcrypt (12 rounds)
- Sensitive data encrypted at rest (phone numbers, BVN)
- HTTPS enforced on all pages
- No sensitive data in logs
- User data export available (GDPR-adjacent, good practice)
- Account deletion: user can request; PII anonymized within 30 days
- Privacy policy and terms of service pages

**US-10.3: Trust Score System**

> As a donor, I want to see trust indicators so that I can evaluate the credibility of campaigns and organizations.

**Acceptance Criteria:**

- Verification badges: Verified (green), Pending (yellow), Unverified (gray)
- Organization verification requires: legitimate registration, real location, verifiable leadership
- Campaign trust signals: progress percentage, donor count, update frequency, creator verification
- Donor verification levels: Email verified, Phone verified, BVN verified
- Trust score displayed on profiles (internal metric, not exposed as number)

**US-10.4: Fraud Prevention**

> As a platform, we need to detect and prevent fraudulent activity so that donors are protected.

**Acceptance Criteria:**

- Automated flags: duplicate campaigns, unusual donation patterns, rapid campaign creation
- Manual review queue for flagged items
- IP-based rate limiting for account creation
- Device fingerprinting for suspicious activity detection
- Campaign creation requires phone-verified account
- Donations over ₦500,000 trigger manual review
- Admin alert system for high-risk activity

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric                         | Target  |
| ------------------------------ | ------- |
| First Contentful Paint (FCP)   | < 1.5s  |
| Largest Contentful Paint (LCP) | < 2.5s  |
| Time to Interactive (TTI)      | < 3.5s  |
| Cumulative Layout Shift (CLS)  | < 0.1   |
| API Response Time (p95)        | < 500ms |
| Database Query Time (p95)      | < 100ms |
| Lighthouse Score               | > 90    |

### 8.2 Scalability

- Target: 10,000 concurrent users at launch
- Database: connection pooling, read replicas if needed
- File storage: CDN-backed (Cloudflare R2)
- Stateless API: horizontal scaling via serverless
- Caching: TanStack Query client-side, Redis for hot data (future)

### 8.3 Availability

- Target uptime: 99.9% (8.76 hours downtime/year max)
- Health check endpoint for monitoring
- Graceful degradation: cached pages served if API is down
- Error boundaries on all page components

### 8.4 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation on all interactive elements
- Screen reader compatible (semantic HTML, ARIA labels)
- Color contrast ratio: 4.5:1 minimum
- Focus indicators visible
- Alt text required on all images

### 8.5 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 15+)
- Chrome for Android

---

## 9. Design System & Brand Guidelines

### 9.1 Color Palette

| Color          | Usage                           | Value                       |
| -------------- | ------------------------------- | --------------------------- |
| Primary        | CTA buttons, links, accents     | Amber/Gold (#F59E0B family) |
| Secondary      | Supporting elements             | Warm cream/tan              |
| Background     | Page background                 | White / Off-white           |
| Text Primary   | Headings, body                  | Dark charcoal/black         |
| Text Secondary | Captions, labels                | Gray                        |
| Success        | Verified badges, success states | Green                       |
| Warning        | Pending states                  | Yellow                      |
| Error          | Errors, urgency                 | Red                         |
| Surface        | Cards, modals                   | White with subtle shadow    |

### 9.2 Typography

| Role    | Font              | Weight  |
| ------- | ----------------- | ------- |
| Display | Fraunces          | 600-900 |
| Heading | Fraunces          | 600-700 |
| Body    | Plus Jakarta Sans | 400-600 |
| Caption | Plus Jakarta Sans | 400     |
| Mono    | JetBrains Mono    | 400     |

### 9.3 Component Library

- Build with shadcn/ui as base
- Custom components: Campaign Card, Org Card, Donation Widget, Progress Bar, OTP Input, Multi-step Wizard, File Upload
- Responsive: mobile-first, breakpoints at sm(640), md(768), lg(1024), xl(1280)

---

## 10. API Endpoints (Summary)

### Authentication

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/forgot-password` — Send reset email
- `POST /api/auth/reset-password` — Reset password
- `POST /api/auth/verify-otp` — Verify phone OTP
- `POST /api/auth/resend-otp` — Resend OTP
- `GET /api/auth/google` — Google OAuth redirect
- `GET /api/auth/google/callback` — Google OAuth callback

### Users

- `GET /api/users/me` — Get current user
- `PATCH /api/users/me` — Update profile
- `POST /api/users/me/avatar` — Upload avatar
- `PATCH /api/users/me/password` — Change password
- `GET /api/users/me/sessions` — List active sessions
- `DELETE /api/users/me/sessions/:id` — Revoke session

### Organizations

- `POST /api/orgs` — Create organization
- `GET /api/orgs` — List organizations (with filters)
- `GET /api/orgs/:id` — Get organization detail
- `PATCH /api/orgs/:id` — Update organization
- `GET /api/orgs/:id/campaigns` — List org's campaigns
- `GET /api/orgs/:id/donations` — List org's donations

### Campaigns

- `POST /api/campaigns` — Create campaign
- `GET /api/campaigns` — List campaigns (with filters, search, sort)
- `GET /api/campaigns/:id` — Get campaign detail
- `PATCH /api/campaigns/:id` — Update campaign
- `DELETE /api/campaigns/:id` — Delete campaign (soft delete)
- `POST /api/campaigns/:id/publish` — Publish draft
- `GET /api/campaigns/:id/updates` — List updates
- `POST /api/campaigns/:id/updates` — Post update
- `GET /api/campaigns/:id/comments` — List comments
- `POST /api/campaigns/:id/comments` — Post comment
- `DELETE /api/campaigns/:id/comments/:commentId` — Delete comment

### Donations

- `POST /api/donations` — Initiate donation (returns Paystack authorization URL)
- `GET /api/donations/:id` — Get donation detail
- `GET /api/donations` — List user's donations
- `POST /api/donations/webhook` — Paystack webhook handler

### Recurring Donations

- `POST /api/recurring` — Set up recurring donation
- `GET /api/recurring` — List user's recurring donations
- `PATCH /api/recurring/:id/pause` — Pause recurring
- `PATCH /api/recurring/:id/resume` — Resume recurring
- `DELETE /api/recurring/:id` — Cancel recurring

### Admin

- `GET /api/admin/orgs/pending` — Pending organizations
- `PATCH /api/admin/orgs/:id/verify` — Approve/reject org
- `GET /api/admin/campaigns/pending` — Pending campaigns
- `PATCH /api/admin/campaigns/:id/moderate` — Approve/reject campaign
- `GET /api/admin/users` — List users
- `PATCH /api/admin/users/:id/suspend` — Suspend user
- `GET /api/admin/analytics` — Platform metrics

---

## 11. Deployment & DevOps

### 11.1 Environments

| Environment | Purpose                | URL                     |
| ----------- | ---------------------- | ----------------------- |
| Development | Local dev              | `localhost:3000`        |
| Staging     | Pre-production testing | `staging.azarfaith.com` |
| Production  | Live platform          | `azarfaith.com`         |

### 11.2 CI/CD Pipeline

1. Push to `main` → triggers staging deployment
2. Staging tests pass → manual promotion to production
3. Pull requests → preview deployments on Vercel
4. All PRs require: lint pass, type check, test pass, code review

### 11.3 Monitoring & Observability

- Vercel Analytics for web vitals
- Sentry for error tracking (client + server)
- Database monitoring via Supabase/Neon dashboard
- Paystack dashboard for payment reconciliation
- Uptime monitoring (BetterStack or UptimeRobot)
- Log aggregation (Vercel Logs or Axiom)

### 11.4 Backups

- Database: daily automated backups, 30-day retention
- File storage: versioning enabled on R2/S3
- Restore procedure documented and tested quarterly

---

## 12. Success Metrics & KPIs

| Category        | Metric                   | Target (6 months)      |
| --------------- | ------------------------ | ---------------------- |
| **Growth**      | Registered donors        | 5,000                  |
| **Growth**      | Verified organizations   | 50                     |
| **Growth**      | Active campaigns         | 200                    |
| **Revenue**     | Monthly donation volume  | ₦10M                   |
| **Revenue**     | Platform fee revenue     | ₦250K/month            |
| **Engagement**  | Recurring donor rate     | 30% of donors          |
| **Engagement**  | Campaign completion rate | 60%+                   |
| **Trust**       | Org verification rate    | 80%+                   |
| **Trust**       | Fraud incidents          | < 0.1% of transactions |
| **Performance** | Lighthouse score         | > 90                   |
| **Retention**   | Monthly active donors    | 60% of registered      |

---

## 13. Milestones & Phasing

### Phase 1: Foundation (Weeks 1-4)

- [ ] Project setup (TanStack Start, Tailwind, shadcn/ui, Prisma, Supabase)
- [ ] Database schema and migrations
- [ ] Authentication system (email/password, OTP, Google OAuth)
- [ ] User profile management
- [ ] Basic layout and navigation

### Phase 2: Core Platform (Weeks 5-8)

- [ ] Organization registration and profile pages
- [ ] Campaign creation wizard
- [ ] Campaign detail pages
- [ ] Discovery/search/browse
- [ ] File upload infrastructure

### Phase 3: Payments & Giving (Weeks 9-12)

- [ ] Paystack integration (one-time donations)
- [ ] Recurring donation setup (Paystack subscriptions)
- [ ] Pledge-based recurring (reminder emails)
- [ ] Donation receipts and notifications
- [ ] Donor dashboard and giving history

### Phase 4: Admin & Trust (Weeks 13-16)

- [ ] Platform admin dashboard
- [ ] Organization verification workflow
- [ ] Campaign moderation workflow
- [ ] User management
- [ ] Analytics dashboard
- [ ] Trust and verification system

### Phase 5: Polish & Launch (Weeks 17-20)

- [ ] SEO optimization
- [ ] Social sharing
- [ ] Email templates and notifications
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Load testing
- [ ] Bug fixes and polish
- [ ] Staging testing
- [ ] Production deployment

---

## 14. Open Questions (For Stakeholder Alignment)

1. **Org Verification Fee:** Should organizations pay a verification fee (e.g., ₦5,000) to reduce spam registrations?
2. **Campaign Expiry:** Should one-time campaigns auto-expire after 90 days, or should creators set custom expiry?
3. **Platform Fee:** Is 2.5% the final fee structure? Should there be a minimum fee (e.g., ₦50)?
4. **Emergency Campaigns:** Should emergency campaigns bypass moderation (auto-approved for verified orgs)?
5. **Multi-currency:** Any near-term need for USD/GBP support for diaspora donors?
6. **Mobile App:** Is a PWA sufficient, or is a native app planned for Phase 2?
7. **Tax Deductions:** Are there plans for partnership with organizations that provide tax receipts?
8. **Withdrawal:** How do organizations withdraw funds from the platform — direct Paystack transfer, manual disbursement?

---

## 15. Appendix

### A. Glossary

| Term                   | Definition                                                     |
| ---------------------- | -------------------------------------------------------------- |
| **Campaign**           | A fundraising initiative (one-time or ongoing)                 |
| **Organization**       | A verified faith-based entity on the platform                  |
| **Raiser**             | The user who creates a campaign                                |
| **Donor**              | A user who makes a donation                                    |
| **Recurring Donation** | An automatic or pledge-based periodic donation                 |
| **Platform Fee**       | AzarFaith's commission on donations (2.5%)                     |
| **Paystack Fee**       | Payment processor's fee (varies by payment method)             |
| **Verification**       | Admin-reviewed process confirming an organization's legitimacy |
| **Faith Category**     | Classification of a campaign's religious/charitable purpose    |

### B. Competitive Landscape

| Platform        | Strength                       | Weakness                                 |
| --------------- | ------------------------------ | ---------------------------------------- |
| GoFundMe        | Global reach, brand trust      | Not NGN-native, no faith focus           |
| Donorbox        | Recurring giving, integrations | US-centric, no Nigerian payment methods  |
| Pure Charity    | Faith-based, church-focused    | Limited Nigerian presence                |
| Paystack Giving | Native payments                | Not purpose-built for faith-based giving |

**AzarFaith's Differentiation:** Nigeria-first, faith-focused, NGN-native, organization verification, recurring giving built-in.

---

_End of PRD_
