import { createClient } from "npm:@supabase/supabase-js@2";
import QRCode from "npm:qrcode@1.5.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const rawSecretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");

if (!supabaseUrl) throw new Error("SUPABASE_URL is required");
if (!rawSecretKeys) throw new Error("SUPABASE_SECRET_KEYS is required");

const secretKeys = JSON.parse(rawSecretKeys) as Record<string, string>;
const secretKey = secretKeys["generate_qr_edge_to_db"];

if (!secretKey) {
  throw new Error('Secret API key "generate_qr_edge_to_db" is missing');
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "X-Content-Type-Options": "nosniff",
};

const errorHeaders = {
  ...corsHeaders,
  "Cache-Control": "no-store",
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        ...errorHeaders,
        Allow: "GET, OPTIONS",
      },
    });
  }

  const id = new URL(req.url).searchParams.get("id");

  if (!id || !uuidPattern.test(id)) {
    console.warn("Invalid ticket ID format");
    return new Response("A valid ticket id is required", {
      status: 400,
      headers: errorHeaders,
    });
  }

  const { data, error } = await supabase
    .from("entradas")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Ticket lookup failed", error);
    return new Response("Unable to verify ticket", {
      status: 500,
      headers: errorHeaders,
    });
  }

  if (!data) {
    console.warn("Ticket not found");
    return new Response("Ticket not found", {
      status: 404,
      headers: errorHeaders,
    });
  }

  let pngBuffer: Uint8Array;
  try {
    pngBuffer = await QRCode.toBuffer(id, {
      type: "png",
      width: 320,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#487575ff",
        light: "#ffffffff",
      },
    });
  } catch (err) {
    console.error("QR generation failed", err);
    return new Response("Unable to generate QR", {
      status: 500,
      headers: errorHeaders,
    });
  }

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});