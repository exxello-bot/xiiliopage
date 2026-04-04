

## CRM-Style Lead Capture Dashboard

### Overview
Build a password-protected admin dashboard at `/admin` where you can view, filter, and manage all leads captured through the contact form. Leads will have pipeline stages, scores, statuses, and notes — a functional CRM built on top of the existing `contact_submissions` table.

### Step 1: Add Authentication
- Create login page at `/login` with email/password auth
- Create a `user_roles` table with an `admin` role to restrict dashboard access
- No signup flow — admin accounts created manually via the database

### Step 2: Extend the Database
Add new columns to `contact_submissions` via migration:
- `status` (text, default `'new'`) — New Lead, Contacted, Qualified, Proposal Sent, Won, Lost
- `score` (integer, default `0`) — lead score 0–100
- `stage` (text, default `'inbox'`) — Inbox, Discovery, Demo, Negotiation, Closed
- `notes` (text, nullable) — internal notes
- `assigned_to` (text, nullable) — team member name

Create a `user_roles` table for admin access control with RLS.

### Step 3: Build the Dashboard
Create `/admin` route with sidebar layout:

**Pipeline Board View**
- Kanban-style columns by stage (Inbox → Discovery → Demo → Negotiation → Closed)
- Drag-and-drop cards showing name, company, score, status
- Click to open lead detail panel

**Table View**
- Sortable/filterable table of all leads
- Columns: Name, Email, Company, Status, Score, Stage, Date, Assigned To
- Inline status/stage dropdowns for quick updates
- Search bar filtering by name, email, or company

**Lead Detail Panel**
- Side panel or modal with full lead info
- Edit score, status, stage, notes, assignment
- View original message
- Timeline of status changes

**Stats Header**
- Total leads, new this week, qualified count, conversion rate

### Step 4: Update Edge Functions
- Modify `submit-contact` to use the new default column values
- Add an `update-lead` edge function for updating lead status, score, stage, notes (admin-only, JWT-verified)

### Technical Details
- **New pages**: `/login`, `/admin`
- **New components**: `AdminLayout`, `LeadPipeline`, `LeadTable`, `LeadDetail`, `LeadStats`
- **Database changes**: Alter `contact_submissions` (add columns), create `user_roles` table
- **Auth**: Email/password login, role-based access via `has_role()` function
- **RLS**: Admin-only read/update on `contact_submissions`, service_role insert preserved
- **New edge function**: `update-lead` for PATCH operations on leads

