import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const TABLE_NAME =
  import.meta.env.SUPABASE_DOWNLOADS_TABLE || "dp_download_analytics";

const json = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseServiceRoleKey = import.meta.env.SUPABASE_SECRET_KEY;

    // Analytics must never break the download UX.
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return json(202, {
        ok: true,
        tracked: false,
        reason: "supabase-not-configured",
      });
    }

    const body = await request.json().catch(() => null);
    const eventSlug = typeof body?.eventSlug === "string" ? body.eventSlug : "";
    const frameId = typeof body?.frameId === "string" ? body.frameId : "";
    const sourcePath =
      typeof body?.sourcePath === "string" ? body.sourcePath : "";

    if (!eventSlug || !frameId) {
      return json(400, { ok: false, message: "Missing eventSlug or frameId." });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from(TABLE_NAME).insert({
      event_slug: eventSlug,
      frame_id: frameId,
      source_path: sourcePath,
      user_agent: request.headers.get("user-agent") || null,
      downloaded_at: new Date().toISOString(),
    });

    if (error) {
      return json(500, {
        ok: false,
        message: "Failed to write analytics event.",
        details: error.message,
      });
    }

    return json(200, { ok: true, tracked: true });
  } catch {
    return json(500, {
      ok: false,
      message: "Unexpected analytics error.",
    });
  }
};
