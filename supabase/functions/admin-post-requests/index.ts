import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type AdminPayload =
  | { action: "list"; password: string }
  | {
      action: "approve" | "reject" | "delete";
      password: string;
      id: string;
      approvedContent?: string;
      adminNotes?: string;
    };

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await request.json()) as AdminPayload;
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");

    if (!adminPassword || payload.password !== adminPassword) {
      return Response.json(
        { error: "Unauthorized" },
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (payload.action === "list") {
      const { data, error } = await supabase
        .from("linkedin_post_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return Response.json(
        { requests: data },
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (payload.action === "delete") {
      const { error } = await supabase
        .from("linkedin_post_requests")
        .delete()
        .eq("id", payload.id);

      if (error) {
        throw error;
      }

      return Response.json(
        { success: true },
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const nextStatus =
      payload.action === "approve" ? "approved" : "rejected";

    const { data, error } = await supabase
      .from("linkedin_post_requests")
      .update({
        status: nextStatus,
        approved_content: payload.approvedContent ?? null,
        admin_notes: payload.adminNotes ?? null,
        updated_at: new Date().toISOString()
      })
      .eq("id", payload.id)
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
