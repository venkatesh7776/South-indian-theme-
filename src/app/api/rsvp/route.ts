import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Stores RSVPs as JSON lines in /data/rsvps.jsonl.
 * Fine for local / single-server hosting. On serverless hosts (e.g. Vercel)
 * the filesystem is not persistent — swap this for a database, a Google Sheet
 * or an email/WhatsApp hook before going live.
 */
export async function POST(req: Request) {
  let body: { name?: unknown; response?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const response = typeof body.response === "string" ? body.response.trim().slice(0, 60) : "";
  if (!name || !response) return Response.json({ error: "Name and response are required" }, { status: 400 });

  const entry = { name, response, at: new Date().toISOString() };
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "rsvps.jsonl"), JSON.stringify(entry) + "\n");
  } catch {
    // read-only filesystem (e.g. Vercel): keep the RSVP in the deployment logs instead
    console.log("RSVP", JSON.stringify(entry));
  }
  return Response.json({ ok: true });
}
