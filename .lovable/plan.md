

## Slack Integration for Notifications

### Overview
Send automatic Slack notifications whenever someone submits the contact form or books an appointment through Aria.

### Step 1: Connect Slack
Use the Slack connector to link a bot to the Xiilio workspace. You will be prompted to authorize the Lovable App in your Slack workspace. The bot can post to any public channel by default.

### Step 2: Update `submit-contact` Edge Function
After the successful database insert, add a call to the Slack connector gateway to post a formatted message:

```text
🔔 New Contact Form Submission
Name: {name}
Email: {email}
Company: {company}
Message: {message}
```

Uses `LOVABLE_API_KEY` and `SLACK_API_KEY` via the connector gateway (`https://connector-gateway.lovable.dev/slack/api/chat.postMessage`). Slack failures are logged but do not block the form response.

### Step 3: Update `vapi-webhook` Edge Function
After a successful `book_appointment` tool call, post a notification:

```text
📅 New Appointment Booked
Name: {name}
Email: {email}
Time: {start_time}
```

Same gateway pattern. Slack failures are non-blocking.

### Step 4: Channel Targeting
Both functions will post to `#general` by default (looked up via `conversations.list`). The channel name will be a constant that can be easily changed later.

### Technical Details
- **Gateway URL**: `https://connector-gateway.lovable.dev/slack/api`
- **Auth headers**: `Authorization: Bearer $LOVABLE_API_KEY`, `X-Connection-Api-Key: $SLACK_API_KEY`
- **Files modified**: `supabase/functions/submit-contact/index.ts`, `supabase/functions/vapi-webhook/index.ts`
- **No new files created** -- logic inlined into existing functions
- **Non-blocking**: Slack notification errors are caught and logged, never fail the main request

