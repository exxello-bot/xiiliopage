

## Customer Portal

### Overview
Build a customer-facing portal at `/portal` where people who submitted a contact form can log in, track the status of their inquiry, and communicate with the Xiilio team. Customers sign up with email/password, and their account is linked to their contact submission via email matching.

### Step 1: Database Changes
- Create a `profiles` table (id, user_id FK to auth.users, full_name, avatar_url, created_at) with auto-creation trigger on signup
- Add a `customer_messages` table for threaded communication between customer and admin (id, submission_id FK, sender_role text, content text, created_at)
- Enable realtime on `customer_messages` for live chat updates
- RLS: customers can only read their own linked submissions and messages; admins can read/write all

### Step 2: Customer Authentication
- Re-enable public signups (customers need to register)
- Update `/login` page with a tab or toggle: **Admin Login** vs **Customer Login**
- Add a `/signup` page for customers (name, email, password)
- Add email confirmation flow
- After signup, auto-link the customer's account to any existing `contact_submissions` matching their email
- Create a `useCustomerAuth` hook that checks if the user has a profile but is NOT an admin

### Step 3: Customer Portal Pages
**`/portal` — Dashboard**
- Show all submissions linked to the customer's email
- Each submission card shows: status badge, stage, date submitted, last update
- Click to open detail view

**`/portal/inquiry/:id` — Inquiry Detail**
- Full view of the original submission (name, company, message)
- Current status and stage displayed as a progress tracker (Inbox → Discovery → Demo → Negotiation → Closed)
- Message thread: customer and admin can exchange messages in real time
- Customer can add follow-up notes

### Step 4: Admin Side Updates
- Add a "Messages" tab or indicator in `LeadDetail` so admins can reply to customer messages from the CRM
- Show unread message count on lead cards in the pipeline

### Step 5: Navigation
- Add "Portal" link to the main site Navbar (next to existing nav items)
- After login, redirect customers to `/portal` (not `/admin`)
- After login, redirect admins to `/admin` (existing behavior)

### Technical Details
- **New tables**: `profiles`, `customer_messages`
- **New pages**: `/signup`, `/portal`, `/portal/inquiry/:id`
- **Modified pages**: `/login` (dual-mode), Admin `LeadDetail` (message thread)
- **New components**: `CustomerPortal`, `InquiryDetail`, `MessageThread`, `StatusTracker`
- **Auth changes**: Enable public signups, add email confirmation
- **RLS policies**: Customer sees only own data; admin sees all
- **Realtime**: `customer_messages` for live messaging

