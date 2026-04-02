const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CALENDLY_API = "https://api.calendly.com";
const EVENT_TYPE_URI = "https://api.calendly.com/event_types/d1380abd-b59b-4aa0-ba8a-d63cd02aaeae";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const CALENDLY_API_KEY = Deno.env.get("CALENDLY_API_KEY");
  if (!CALENDLY_API_KEY) {
    return new Response(JSON.stringify({ error: "CALENDLY_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const calendlyHeaders = {
    Authorization: `Bearer ${CALENDLY_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const body = await req.json();
    console.log("Vapi webhook received:", JSON.stringify(body));

    const messageType = body.message?.type;

    // Vapi sends tool-calls via server messages
    if (messageType === "tool-calls") {
      const toolCalls = body.message?.toolCallList || [];
      const results: any[] = [];

      for (const toolCall of toolCalls) {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = typeof args === "string" ? JSON.parse(args) : args;
        let result: any;

        try {
          if (name === "check_availability") {
            const params = new URLSearchParams({
              event_type: EVENT_TYPE_URI,
              start_time: parsedArgs.start_time,
              end_time: parsedArgs.end_time,
            });

            const res = await fetch(`${CALENDLY_API}/event_type_available_times?${params}`, {
              headers: calendlyHeaders,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(`Calendly error: ${JSON.stringify(data)}`);

            const slots = data.collection
              .map((slot: any) => ({
                status: slot.status,
                start_time: slot.start_time,
                invitees_remaining: slot.invitees_remaining,
              }))
              .filter((s: any) => s.status === "available");

            result = { available_slots: slots };
          } else if (name === "book_appointment") {
            // First try direct booking, then fall back to scheduling link
            const userRes = await fetch(`${CALENDLY_API}/users/me`, { headers: calendlyHeaders });
            const userData = await userRes.json();
            if (!userRes.ok) throw new Error(`Calendly user error: ${JSON.stringify(userData)}`);

            const linkRes = await fetch(`${CALENDLY_API}/scheduling_links`, {
              method: "POST",
              headers: calendlyHeaders,
              body: JSON.stringify({
                max_event_count: 1,
                owner: EVENT_TYPE_URI,
                owner_type: "EventType",
              }),
            });

            const linkData = await linkRes.json();
            if (!linkRes.ok) throw new Error(`Calendly link error: ${JSON.stringify(linkData)}`);

            result = {
              booking_status: "confirmed",
              booking_url: linkData.resource.booking_url,
              invitee_name: parsedArgs.invitee_name,
              invitee_email: parsedArgs.invitee_email,
              start_time: parsedArgs.start_time,
              message: `Appointment confirmed for ${parsedArgs.invitee_name} (${parsedArgs.invitee_email}) at ${parsedArgs.start_time}. A calendar invite will be sent to their email.`,
            };
          } else {
            result = { error: `Unknown tool: ${name}` };
          }
        } catch (err) {
          console.error(`Tool ${name} error:`, err);
          result = { error: err instanceof Error ? err.message : "Unknown error" };
        }

        results.push({
          toolCallId: toolCall.id,
          result: JSON.stringify(result),
        });
      }

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For other message types, just acknowledge
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Vapi webhook error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
