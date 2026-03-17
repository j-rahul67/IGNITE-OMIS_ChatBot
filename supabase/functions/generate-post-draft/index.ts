import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type DraftRequest = {
  name: string;
  email: string;
  zid: string;
  postType: "promotion" | "achievement" | "event" | "announcement";
  title: string;
  summary: string;
  highlights?: string[];
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await request.json()) as DraftRequest;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Placeholder generation keeps the workflow testable before a live model is connected.
    const draftContent = buildDraft(body);

    const { data, error } = await supabase
      .from("linkedin_post_requests")
      .insert({
        name: body.name,
        email: body.email,
        zid: body.zid,
        post_type: body.postType,
        title: body.title,
        summary: body.summary,
        highlights: body.highlights ?? [],
        draft_content: draftContent,
        status: "pending_review"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json(
      { request: data },
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error"
      },
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});

function buildDraft(body: DraftRequest) {
  const intro = `I'm excited to share ${body.title}.`;
  const context = body.summary.trim();
  const highlights = (body.highlights ?? [])
    .map((item) => `- ${item}`)
    .join("\n");
  const closing =
    body.postType === "event"
      ? "Looking forward to seeing everyone there."
      : "Grateful for the support and excited for what comes next.";

  return [intro, "", context, highlights ? `\nHighlights:\n${highlights}` : "", "\n" + closing]
    .filter(Boolean)
    .join("\n");
}
