# AzarFaith Admin Dashboard — Technical Build Spec

**Date:** June 30, 2026
**Scope:** Full admin dashboard built within existing TanStack Start app at `/admin/*` routes
**Data:** Mock data (Zustand store) — no backend
**Layout:** Dedicated admin layout (sidebar + header, distinct from public site)

---

## 1. Architecture Overview

### Route Structure

```
/admin                          → Dashboard overview (analytics cards + recent activity)
/admin/orgs                     → Organization management (list + filters)
/admin/orgs/$id                 → Organization detail + verification actions
/admin/campaigns                → Campaign management (list + filters)
/admin/campaigns/$id            → Campaign detail + moderation actions
/admin/users                    → User management (list + search)
/admin/users/$id                → User detail + actions
/admin/settings                 → Platform settings (fees, limits, configs)
```

### Auth Guard

- Add `role: "donor" | "org_admin" | "platform_admin"` to user state in Zustand
- Admin routes check `role === "platform_admin"` — redirect to `/` if not
- Mock login for admin: add a toggle or hardcoded check for demo

### Layout

- Left sidebar (fixed, 240px width): navigation links, org logo, user info
- Top header: page title, breadcrumbs, search, notifications bell, user avatar dropdown
- Main content area: scrollable, padded
- Collapsible sidebar on mobile (hamburger → slide-out)

---

## 2. Shadcn Components to Install

Run `npx shadcn@latest add` for each:

```
button
input
label
card
badge
table
tabs
select
dialog
alert-dialog
sheet
dropdown-menu
separator
avatar
progress
tooltip
popover
command
skeleton
textarea
switch
checkbox
form
```

---

## 3. Zustand Store Extensions

Add to `src/lib/store.ts`:

```ts
// ─── Admin State ───
users: User[];
adminRole: "platform_admin" | "org_admin" | "donor" | null;
setAdminRole: (role: "platform_admin" | "org_admin" | "donor" | null) => void;

// ─── Admin Actions ───
verifyOrg: (id: string, status: "verified" | "rejected", notes?: string) => void;
moderateCampaign: (id: string, status: "verified" | "rejected", notes?: string) => void;
suspendUser: (id: string, reason: string) => void;
reactivateUser: (id: string) => void;
updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
```

### New Types to Add

```ts
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "donor" | "org_admin" | "platform_admin";
  phoneVerified: boolean;
  emailVerified: boolean;
  bvnVerified: boolean;
  status: "active" | "suspended";
  suspendedAt?: string;
  suspendReason?: string;
  joinedAt: string;
  totalGiven: number;
  donationsCount: number;
  campaignsCreated: number;
};

type PlatformSettings = {
  platformFeePercent: number;
  minDonation: number;
  maxDonation: number;
  maxTipAmount: number;
  campaignExpiryDays: number;
  autoApproveVerifiedOrgs: boolean;
};

type AdminNotification = {
  id: string;
  type: "org_verification" | "campaign_moderation" | "user_report" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
};
```

### Mock Data to Add (`src/lib/mock.ts`)

- **10+ Users** (mix of donors, org admins, platform admin) with Nigerian names
- **Platform settings** with defaults
- **Admin notifications** (pending verifications, pending campaigns)
- **Analytics seed data** (monthly totals, daily donation sums)

---

## 4. Admin Layout Component

**File:** `src/components/admin/AdminLayout.tsx`

Structure:

```
┌──────────┬────────────────────────────────────────┐
│          │  Header (title, search, bell, avatar)   │
│ Sidebar  ├────────────────────────────────────────┤
│          │                                         │
│  Logo    │         Main Content Area               │
│  Nav     │         (children / <Outlet />)          │
│  Links   │                                         │
│          │                                         │
│  User    │                                         │
│  Info    │                                         │
└──────────┴────────────────────────────────────────┘
```

### Sidebar Navigation Items

| Icon            | Label         | Route            | Badge         |
| --------------- | ------------- | ---------------- | ------------- |
| LayoutDashboard | Dashboard     | /admin           | —             |
| Building2       | Organizations | /admin/orgs      | pending count |
| Megaphone       | Campaigns     | /admin/campaigns | pending count |
| Users           | Users         | /admin/users     | —             |
| Settings        | Settings      | /admin/settings  | —             |
| ArrowLeft       | Back to Site  | /                | —             |

### Header

- Page title (dynamic based on route)
- Search input (command palette style, future)
- Notification bell with unread count badge
- User avatar + dropdown (Profile, Settings, Logout)

---

## 5. Page Specifications

---

### PAGE 5.1: Admin Dashboard (`/admin`)

**Purpose:** At-a-glance platform health and key metrics.

**Layout:**

- 4 stat cards across top (responsive grid)
- Charts section (2 charts side by side)
- Recent activity feed
- Pending action items

**Stat Cards:**
| Card | Value | Icon | Trend |
|---|---|---|---|
| Total Users | count | Users | +X this week |
| Verified Orgs | count / total | Building2 | X pending |
| Active Campaigns | count | Megaphone | X pending review |
| Total Raised (MTD) | ₦ amount | TrendingUp | +X% vs last month |

**Charts (use simple CSS bar charts — no chart library needed for MVP):**

- **Donations Over Time:** Last 7 days, horizontal bar chart showing daily totals
- **Campaign Status Distribution:** Donut-style breakdown (active / completed / pending / rejected)

**Recent Activity Feed:**

- Last 10 actions: "New org registered: ECWA Kano", "Campaign submitted: Build a school", "Donation: ₦25,000 to Grace Harvest"
- Each item: icon (based on type), description, timestamp, link to detail

**Pending Actions:**

- Organizations awaiting verification: count + "Review" link
- Campaigns awaiting moderation: count + "Review" link
- Suspended users needing review: count + "View" link

---

### PAGE 5.2: Organization List (`/admin/orgs`)

**Purpose:** Browse, search, filter, and manage all organizations.

**Layout:**

- Filter bar: status (All / Pending / Verified / Unverified), category, search
- Data table with columns: Name, Category, Location, Status, Total Received, Supporters, Submitted, Actions
- Pagination (10 per page)

**Table Columns:**
| Column | Width | Sortable | Notes |
|---|---|---|---|
| Name | 20% | Yes | With category badge inline |
| Category | 12% | Yes | Church / Mission / Orphanage / School / Other |
| Location | 15% | No | City, State |
| Status | 12% | Yes | Badge: Verified (green) / Pending (yellow) / Unverified (gray) |
| Total Received | 13% | Yes | Formatted NGN |
| Supporters | 10% | Yes | Number |
| Submitted | 10% | Yes | Relative date |
| Actions | 8% | No | View / Verify buttons |

**Row Actions:**

- View: navigates to `/admin/orgs/$id`
- Quick Verify (if pending): opens confirmation dialog
- Quick Reject (if pending): opens rejection dialog with reason input

**Bulk Actions (checkbox selection):**

- Bulk approve selected
- Bulk reject selected

**Empty States:**

- No organizations: "No organizations registered yet"
- No results: "No organizations match your filters"

---

### PAGE 5.3: Organization Detail (`/admin/orgs/$id`)

**Purpose:** Full view of an organization with verification workflow.

**Layout:**

- Header: org name, category badge, status badge, action buttons
- 2-column layout:
  - Left (60%): Cover photo, about, photos gallery, videos
  - Right (40%): Stats, metadata, verification panel

**Left Column:**

- Cover photo (full width)
- About section (bio text)
- Photo gallery (grid)
- Embedded videos

**Right Column — Stats Card:**

- Total Received: ₦X
- Supporters: X
- Campaigns: X
- Founded: Year

**Right Column — Metadata Card:**

- Denomination
- Location
- Registered by: [User name]
- Registered on: [Date]
- Last updated: [Date]

**Right Column — Verification Panel:**

- Current status: [Badge]
- Verification notes (if any)
- Action buttons:
  - **Approve** (green button) → confirmation dialog → sets status to "verified"
  - **Request Info** (amber button) → text input dialog → sends notification
  - **Reject** (red button) → reason input dialog → sets status to "rejected"

**Verification Dialog (Approve):**

```
Title: "Verify Organization"
Body: "Are you sure you want to verify [Org Name]?"
Confirm: "Verify" (green)
Cancel: "Cancel"
```

**Rejection Dialog:**

```
Title: "Reject Organization"
Body: "Please provide a reason for rejecting this organization."
Input: textarea (required)
Confirm: "Reject" (red)
Cancel: "Cancel"
```

---

### PAGE 5.4: Campaign List (`/admin/campaigns`)

**Purpose:** Browse, search, filter, and moderate all campaigns.

**Layout:**

- Filter bar: status (All / Pending / Active / Completed / Rejected), mode (All / One-time / Ongoing), type, urgency, search
- Data table with columns: Title, Type, Mode, Raiser/Org, Urgency, Status, Raised, Donors, Created, Actions
- Pagination

**Table Columns:**
| Column | Width | Sortable | Notes |
|---|---|---|---|
| Title | 22% | Yes | With mode badge inline |
| Type | 10% | Yes | Money / Item / Volunteer / Professional / Emergency |
| Mode | 8% | Yes | One-time / Ongoing badge |
| Raiser | 15% | Yes | Name + avatar or Org name |
| Urgency | 8% | Yes | Badge (color-coded) |
| Status | 10% | Yes | Badge |
| Raised | 10% | Yes | ₦ amount |
| Donors | 7% | Yes | Count |
| Created | 10% | Yes | Relative date |
| Actions | 8% | No | View / Moderate |

**Row Actions:**

- View: navigates to `/admin/campaigns/$id`
- Quick Approve (if pending): confirmation dialog
- Quick Reject (if pending): rejection dialog with reason

---

### PAGE 5.5: Campaign Detail (`/admin/campaigns/$id`)

**Purpose:** Full view of a campaign with moderation workflow.

**Layout:**

- Header: title, status badge, urgency badge, type badge, action buttons
- 2-column layout:
  - Left (65%): Cover, story, gallery, updates, comments
  - Right (35%): Stats, metadata, moderation panel

**Left Column:**

- Cover image
- Story (rendered markdown)
- Photo gallery
- Updates list
- Comments list

**Right Column — Stats Card:**

- Goal: ₦X (if one-time)
- Raised: ₦X (%)
- Donors: X
- Urgency: [badge]
- Mode: One-time / Ongoing
- Created: [date]

**Right Column — Raiser Info Card:**

- Avatar + name
- Location
- Trust score
- Link to org (if applicable)

**Right Column — Moderation Panel:**

- Current status: [badge]
- Verification notes
- Action buttons:
  - **Approve** → confirmation dialog
  - **Request Changes** → text input dialog
  - **Reject** → reason input dialog

---

### PAGE 5.6: User List (`/admin/users`)

**Purpose:** Browse, search, and manage all platform users.

**Layout:**

- Filter bar: role (All / Donor / Org Admin / Platform Admin), status (All / Active / Suspended), search
- Data table with columns: Name, Email, Phone, Role, Status, Verified, Total Given, Joined, Actions
- Pagination

**Table Columns:**
| Column | Width | Sortable | Notes |
|---|---|---|---|
| Name | 18% | Yes | With avatar |
| Email | 20% | Yes | |
| Phone | 14% | No | Nigerian format |
| Role | 10% | Yes | Badge |
| Status | 10% | Yes | Active (green) / Suspended (red) |
| Verified | 12% | No | Phone ✓ / Email ✓ / BVN ✓ icons |
| Total Given | 10% | Yes | ₦ amount |
| Joined | 10% | Yes | Date |
| Actions | 6% | No | View / Suspend |

**Row Actions:**

- View: navigates to `/admin/users/$id`
- Suspend (if active): opens suspension dialog
- Reactivate (if suspended): opens confirmation dialog

---

### PAGE 5.7: User Detail (`/admin/users/$id`)

**Purpose:** Full view of a user with management actions.

**Layout:**

- Header: avatar, name, email, role badge, status badge, action buttons
- 2-column layout:
  - Left (60%): Profile info, verification badges, donation history
  - Right (40%): Stats, activity, admin actions

**Left Column — Profile Card:**

- Avatar (large)
- Full name
- Email
- Phone
- Role
- Joined date
- Verification badges: Phone ✓, Email ✓, BVN ✓

**Left Column — Donation History:**

- Table: Campaign, Amount, Date, Status
- Last 10 donations

**Right Column — Stats Card:**

- Total Given: ₦X
- Donations Count: X
- Campaigns Created: X
- Active Recurring: X

**Right Column — Admin Actions Card:**

- Suspend User button (red) → opens dialog with reason textarea
- Reactivate User button (green, if suspended)
- Change Role dropdown (donor / org_admin / platform_admin)
- Activity log (last 10 actions)

**Suspension Dialog:**

```
Title: "Suspend User"
Body: "Are you sure you want to suspend [User Name]?"
Input: Reason textarea (required)
Warning: "Suspended users cannot login or make donations."
Confirm: "Suspend" (red)
Cancel: "Cancel"
```

---

### PAGE 5.8: Platform Settings (`/admin/settings`)

**Purpose:** Configure platform-wide settings.

**Layout:**

- Settings form organized in cards/sections
- Save button at bottom

**Sections:**

**Section 1: Fee Configuration**

- Platform Fee Percentage: number input (default 2.5, range 0-10)
- Minimum Donation: number input (default ₦100)
- Maximum Donation: number input (default ₦5,000,000)
- Maximum Tip Amount: number input (default ₦2,500)

**Section 2: Campaign Settings**

- Campaign Expiry Days: number input (default 90)
- Auto-approve campaigns from verified orgs: toggle switch

**Section 3: Verification Settings**

- Require phone verification for campaign creation: toggle
- Minimum days before re-application (rejected orgs): number input (default 30)

**Section 4: Notification Settings**

- Email notifications enabled: toggle
- SMS notifications enabled: toggle
- Admin notification email: email input

**Save Behavior:**

- "Save Changes" button → updates Zustand store → toast confirmation
- "Reset to Defaults" button → restores defaults with confirmation

---

## 6. Component Inventory

### New Components to Create

```
src/components/admin/
├── AdminLayout.tsx          (sidebar + header + content area)
├── AdminSidebar.tsx         (sidebar navigation)
├── AdminHeader.tsx          (top header with search, bell, avatar)
├── AdminStatCard.tsx        (reusable stat card with icon, value, trend)
├── AdminTable.tsx           (reusable data table with sorting, pagination)
├── AdminTableRow.tsx        (table row component)
├── AdminPagination.tsx      (page navigation)
├── AdminFilterBar.tsx       (search + filter pills)
├── AdminBadge.tsx           (status/role/urgency badges)
├── AdminConfirmDialog.tsx   (confirmation modal)
├── AdminRejectDialog.tsx    (rejection with reason input modal)
├── AdminActivityFeed.tsx    (recent activity list)
├── AdminBarChart.tsx        (simple CSS bar chart)
└── AdminEmptyState.tsx      (empty state placeholder)
```

### Existing Components to Reuse

- `cn()` from `src/lib/utils.ts`
- `formatMoney()` from `src/lib/mock.ts`
- Sonner toast from `src/components/ui/sonner.tsx`
- All shadcn components (Button, Input, Card, Table, etc.)

---

## 7. File Creation Plan

```
NEW FILES:
├── src/routes/
│   ├── admin.tsx                    (admin layout route — layoutRoute wrapper)
│   ├── admin/
│   │   ├── index.tsx                (/admin → dashboard)
│   │   ├── orgs.tsx                 (/admin/orgs → org list)
│   │   ├── orgs.$id.tsx             (/admin/orgs/$id → org detail)
│   │   ├── campaigns.tsx            (/admin/campaigns → campaign list)
│   │   ├── campaigns.$id.tsx        (/admin/campaigns/$id → campaign detail)
│   │   ├── users.tsx                (/admin/users → user list)
│   │   ├── users.$id.tsx            (/admin/users/$id → user detail)
│   │   └── settings.tsx             (/admin/settings → platform settings)
├── src/components/admin/
│   ├── AdminLayout.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminHeader.tsx
│   ├── AdminStatCard.tsx
│   ├── AdminTable.tsx
│   ├── AdminPagination.tsx
│   ├── AdminFilterBar.tsx
│   ├── AdminBadge.tsx
│   ├── AdminConfirmDialog.tsx
│   ├── AdminRejectDialog.tsx
│   ├── AdminActivityFeed.tsx
│   ├── AdminBarChart.tsx
│   └── AdminEmptyState.tsx

MODIFIED FILES:
├── src/lib/store.ts                 (add admin state + actions + users)
├── src/lib/mock.ts                  (add User type, admin mock data, settings)
├── src/components/Navbar.tsx        (add admin link when role=platform_admin)
```

---

## 8. Build Order (Execution Sequence)

### Phase 1: Foundation (Install + Layout)

1. Install all shadcn/ui components
2. Add types and mock data to `mock.ts` (User, PlatformSettings, AdminNotification)
3. Extend Zustand store in `store.ts` (admin state, users, actions)
4. Create `AdminLayout.tsx` with sidebar + header
5. Create `AdminSidebar.tsx`
6. Create `AdminHeader.tsx`
7. Create `admin.tsx` layout route

### Phase 2: Shared Components

8. Create `AdminStatCard.tsx`
9. Create `AdminTable.tsx` (with sorting)
10. Create `AdminPagination.tsx`
11. Create `AdminFilterBar.tsx`
12. Create `AdminBadge.tsx`
13. Create `AdminConfirmDialog.tsx`
14. Create `AdminRejectDialog.tsx`
15. Create `AdminActivityFeed.tsx`
16. Create `AdminBarChart.tsx`
17. Create `AdminEmptyState.tsx`

### Phase 3: Dashboard

18. Build `/admin` dashboard page (stat cards, charts, activity feed, pending actions)

### Phase 4: Organization Management

19. Build `/admin/orgs` list page (table, filters, pagination, bulk actions)
20. Build `/admin/orgs/$id` detail page (info, verification workflow)

### Phase 5: Campaign Management

21. Build `/admin/campaigns` list page (table, filters, pagination)
22. Build `/admin/campaigns/$id` detail page (info, moderation workflow)

### Phase 6: User Management

23. Build `/admin/users` list page (table, filters, pagination)
24. Build `/admin/users/$id` detail page (profile, stats, suspension)

### Phase 7: Settings

25. Build `/admin/settings` page (config form, save/reset)

### Phase 8: Integration

26. Add admin link to Navbar (conditional on role)
27. Test all routes and interactions
28. Final polish and responsive tweaks

---

## 9. Design Tokens for Admin

The admin uses the same amber theme as the public site. Additional admin-specific tokens:

- **Sidebar bg:** `bg-gray-950` (dark sidebar, common admin pattern)
- **Sidebar text:** `text-gray-400` (inactive), `text-white` (active)
- **Sidebar active:** `bg-amber-500/10 text-amber-500`
- **Content bg:** `bg-gray-50` (slightly off-white for depth)
- **Card:** `bg-white border border-gray-200 rounded-xl`
- **Table header:** `bg-gray-50 text-gray-500 text-xs font-medium uppercase`
- **Table row hover:** `hover:bg-gray-50`
- **Status badges:** Green (verified/active), Yellow (pending), Gray (unverified), Red (suspended/rejected)
