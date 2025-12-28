import { getLeads, getLead, updateLead, type Lead } from "@/lib/db";

// GET /api/leads - List all leads
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const lead = getLead(id);
    if (!lead) {
      return new Response(JSON.stringify({ error: "Lead not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(lead), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const leads = getLeads();
  return new Response(JSON.stringify(leads), {
    headers: { "Content-Type": "application/json" },
  });
}

// PATCH /api/leads - Update a lead
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Lead ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lead = updateLead(id, data as Partial<Lead>);
    if (!lead) {
      return new Response(JSON.stringify({ error: "Lead not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(lead), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
