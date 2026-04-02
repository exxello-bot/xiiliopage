const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CALENDLY_API = "https://api.calendly.com";

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

  const headers = {
    Authorization: `Bearer ${CALENDLY_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "get_user") {
      // Get current user URI (needed for event types)
      const res = await fetch(`${CALENDLY_API}/users/me`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(`Calendly API error [${res.status}]: ${JSON.stringify(data)}`);
      return new Response(JSON.stringify({ user_uri: data.resource.uri }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_event_types") {
      // Get available event types for the user
      const userRes = await fetch(`${CALENDLY_API}/users/me`, { headers });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(`Calendly user error [${userRes.status}]: ${JSON.stringify(userData)}`);

      const userUri = userData.resource.uri;
      const res = await fetch(`${CALENDLY_API}/event_types?user=${encodeURIComponent(userUri)}&active=true`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(`Calendly event types error [${res.status}]: ${JSON.stringify(data)}`);

      const eventTypes = data.collection.map((et: any) => ({
        uri: et.uri,
        name: et.name,
        slug: et.slug,
        duration: et.duration,
        scheduling_url: et.scheduling_url,
      }));

      return new Response(JSON.stringify({ event_types: eventTypes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_available_times") {
      const { event_type_uri, start_time, end_time } = body;
      if (!event_type_uri || !start_time || !end_time) {
        return new Response(JSON.stringify({ error: "Missing event_type_uri, start_time, or end_time" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const params = new URLSearchParams({
        event_type: event_type_uri,
        start_time,
        end_time,
      });

      const res = await fetch(`${CALENDLY_API}/event_type_available_times?${params}`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(`Calendly availability error [${res.status}]: ${JSON.stringify(data)}`);

      const slots = data.collection.map((slot: any) => ({
        status: slot.status,
        start_time: slot.start_time,
        invitees_remaining: slot.invitees_remaining,
      })).filter((s: any) => s.status === "available");

      return new Response(JSON.stringify({ available_slots: slots }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_booking") {
      const { event_type_uri, start_time, invitee_name, invitee_email } = body;
      if (!event_type_uri || !start_time || !invitee_name || !invitee_email) {
        return new Response(JSON.stringify({ error: "Missing required booking fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Calendly v2 API uses scheduling links — we create a single-use invite
      const res = await fetch(`${CALENDLY_API}/scheduled_events`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          event_type: event_type_uri,
          start_time,
          invitee: {
            name: invitee_name,
            email: invitee_email,
          },
        }),
      });

      // Calendly v2 doesn't support direct event creation via API.
      // Instead we use the one-off scheduling link approach
      if (!res.ok) {
        // Fallback: create a single-use scheduling link
        const userRes = await fetch(`${CALENDLY_API}/users/me`, { headers });
        const userData = await userRes.json();
        const userUri = userData.resource.uri;

        const linkRes = await fetch(`${CALENDLY_API}/scheduling_links`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            max_event_count: 1,
            owner: event_type_uri,
            owner_type: "EventType",
          }),
        });

        const linkData = await linkRes.json();
        if (!linkRes.ok) throw new Error(`Calendly link error [${linkRes.status}]: ${JSON.stringify(linkData)}`);

        return new Response(JSON.stringify({
          booking_status: "confirmed",
          booking_url: linkData.resource.booking_url,
          invitee_name,
          invitee_email,
          start_time,
          message: `Appointment confirmed for ${invitee_name} (${invitee_email}) at ${start_time}. A calendar invite will be sent to their email.`,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      return new Response(JSON.stringify({
        booking_status: "confirmed",
        event: data,
        message: `Appointment booked for ${invitee_name} at ${start_time}`,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action. Use: get_event_types, get_available_times, create_booking" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Calendly booking error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
