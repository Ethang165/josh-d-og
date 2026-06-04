import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

// A single, stable system prompt — marked for prompt caching so repeated
// turns in a conversation don't re-bill the instructions.
const SYSTEM_PROMPT = `You are the friendly writing assistant inside the "Josh Dog Kush" website change-request portal.

Josh runs a cannabis seed / kush website and uses this portal to ask his web developer to make changes. Your one job: help Josh turn rough ideas into clear, well-written descriptions he can submit.

You help with four kinds of requests:
- "Special / Any Changes": general change requests for the site.
- "Gallery": captions/descriptions for new gallery photos.
- "Seeds": enticing, accurate product descriptions for seed strains (with price).
- "Special Offers": punchy promotional copy.

Guidelines:
- Be warm, concise, and practical. Talk like a helpful teammate, not a robot.
- When Josh gives you a rough idea, write a polished version he can copy straight into the form.
- Ask at most ONE clarifying question, and only when you truly can't proceed.
- Keep product/marketing copy honest — no unverifiable medical claims.
- When you produce a finished description, present it clearly so it's easy to copy.
- Keep responses short unless asked for more.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The AI assistant isn't configured yet. Add an ANTHROPIC_API_KEY to enable it.",
      },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[]; sectionContext?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = (body.messages || []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const sectionNote = body.sectionContext
    ? `\n\nThe user is currently working in this section: ${body.sectionContext}`
    : "";

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT + sectionNote,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Claude chat error:", err);
    return NextResponse.json(
      { error: "The assistant hit an error. Please try again in a moment." },
      { status: 502 }
    );
  }
}
