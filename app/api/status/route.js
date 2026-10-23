import { connection } from "next/server";
import { DEFAULT_MODEL } from "@/lib/gemini";

// Which server keys are configured (never the keys themselves), for the Settings page.
export async function GET() {
  await connection();
  return Response.json({
    gemini: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    groq: Boolean(process.env.GROQ_API_KEY),
  });
}
