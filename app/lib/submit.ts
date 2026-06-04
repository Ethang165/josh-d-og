import { SectionId, SubmitResult } from "./types";

/**
 * Sends a change request to the server as multipart form data:
 * text fields are JSON-encoded under "payload", files under "files".
 */
export async function submitRequest(
  section: SectionId,
  fields: Record<string, string>,
  files: File[]
): Promise<SubmitResult> {
  const form = new FormData();
  form.append("section", section);
  form.append("payload", JSON.stringify(fields));
  for (const file of files) {
    form.append("files", file, file.name);
  }

  try {
    const res = await fetch("/api/submit", { method: "POST", body: form });
    const data = (await res.json()) as SubmitResult;
    return data;
  } catch {
    return {
      ok: false,
      message: "Network error — please check your connection and try again.",
    };
  }
}
