import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

// Resend caps total attachments at ~40MB. Keep a safety margin.
const MAX_TOTAL_ATTACHMENT_BYTES = 38 * 1024 * 1024;

const SECTION_LABELS: Record<string, string> = {
  special: "Special / Any Changes",
  gallery: "Gallery",
  seeds: "Seeds",
  offers: "Special Offers",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Could not read the submitted form." },
      { status: 400 }
    );
  }

  const section = String(form.get("section") || "");
  const sectionLabel = SECTION_LABELS[section] || "Unknown section";

  // Text fields come through as a JSON blob under "payload".
  let fields: Record<string, string> = {};
  try {
    fields = JSON.parse(String(form.get("payload") || "{}"));
  } catch {
    fields = {};
  }

  // Require at least a description so we never email an empty request.
  if (!fields.description || fields.description.trim().length === 0) {
    return NextResponse.json(
      { ok: false, message: "Please add a description before submitting." },
      { status: 400 }
    );
  }

  // Collect uploaded files.
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  let totalBytes = 0;
  const attachments: { filename: string; content: Buffer }[] = [];
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer());
    totalBytes += buf.length;
    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Those files are too large to email (over ~38MB total). Try smaller or fewer files, or compress the video.",
        },
        { status: 413 }
      );
    }
    attachments.push({
      filename: file.name || "upload",
      content: buf,
    });
  }

  // Build a readable summary of the text fields.
  const fieldRows = Object.entries(fields)
    .filter(([, v]) => v && String(v).trim().length > 0)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#245c22;text-transform:capitalize;vertical-align:top">${escapeHtml(
          k
        )}</td><td style="padding:6px 12px;white-space:pre-wrap">${escapeHtml(
          String(v)
        )}</td></tr>`
    )
    .join("");

  const fileList =
    attachments.length > 0
      ? attachments.map((a) => `• ${escapeHtml(a.filename)}`).join("<br/>")
      : "<em>None</em>";

  const html = `
  <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#1a1a1a;max-width:640px">
    <h2 style="color:#2c7429;margin:0 0 4px">New change request — ${escapeHtml(
      sectionLabel
    )}</h2>
    <p style="color:#666;margin:0 0 16px">Submitted from the Josh Dog Kush portal.</p>
    <table style="border-collapse:collapse;width:100%;border:1px solid #ddf0db;border-radius:8px;overflow:hidden">
      ${fieldRows}
    </table>
    <p style="margin:16px 0 4px;font-weight:600;color:#245c22">Attachments</p>
    <p style="margin:0;color:#333">${fileList}</p>
  </div>`;

  const text =
    `New change request — ${sectionLabel}\n\n` +
    Object.entries(fields)
      .filter(([, v]) => v && String(v).trim().length > 0)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n") +
    `\n\nAttachments: ${
      attachments.map((a) => a.filename).join(", ") || "none"
    }`;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TO_EMAIL || "ethanashergolden@gmail.com";
  const fromEmail =
    process.env.FROM_EMAIL || "Josh Dog Kush Portal <onboarding@resend.dev>";

  // No email key configured → log to the server and acknowledge. This lets the
  // portal be developed/demoed without a Resend account.
  if (!apiKey) {
    console.log("\n=== CHANGE REQUEST (email not configured) ===");
    console.log(text);
    console.log("=== end change request ===\n");
    return NextResponse.json({
      ok: true,
      emailed: false,
      message:
        "Request received. (Email isn't configured on the server yet, so it was logged for the developer.)",
    });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New change request — ${sectionLabel}`,
      html,
      text,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, message: "We couldn't send the email. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      emailed: true,
      message: "Sent! Your change request is on its way. 🌿",
    });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong sending your request." },
      { status: 500 }
    );
  }
}
