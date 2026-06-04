"use client";

import { useState } from "react";
import { SubmitResult } from "../lib/types";

interface SubmitBarProps {
  onSubmit: () => Promise<SubmitResult>;
  /** Called after a successful submit so the section can reset itself. */
  onSuccess?: () => void;
  label?: string;
}

export default function SubmitBar({
  onSubmit,
  onSuccess,
  label = "Submit change request",
}: SubmitBarProps) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function handleClick() {
    setBusy(true);
    setResult(null);
    const res = await onSubmit();
    setResult(res);
    setBusy(false);
    if (res.ok) onSuccess?.();
  }

  return (
    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button className="btn-primary" onClick={handleClick} disabled={busy}>
        {busy ? "Sending…" : label}
      </button>
      {result && (
        <p
          role="status"
          className={`text-sm ${
            result.ok ? "text-kush-200" : "text-red-300"
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
