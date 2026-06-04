"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  /** Plain-language description of the section the user is in. */
  sectionContext: string;
  sectionLabel: string;
  /** Push the assistant's text into the active section's description field. */
  onInsert: (text: string) => void;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hey Josh! 🌿 Tell me what you want to change and I'll help you write it up. For a product or offer, just give me the gist and I'll turn it into clean copy you can drop straight into the form.",
};

export default function ChatAssistant({
  sectionContext,
  sectionLabel,
  onInsert,
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Drop the canned greeting before sending to the model.
          messages: nextMessages.filter((m) => m !== GREETING),
          sectionContext: `${sectionLabel} — ${sectionContext}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The assistant is unavailable right now.");
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("Network error talking to the assistant.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-kush-800 p-4">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <span>✨</span> Writing assistant
        </h2>
        <p className="mt-0.5 text-xs text-kush-400">
          Helping with: <span className="text-kush-200">{sectionLabel}</span>
        </p>
      </div>

      <div
        ref={scrollRef}
        className="thin-scroll flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-kush-600 text-white"
                  : "bg-kush-900/80 text-kush-50 ring-1 ring-kush-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.role === "assistant" && i !== 0 && (
                <button
                  onClick={() => onInsert(m.content)}
                  className="mt-2 rounded-md bg-kush-700/70 px-2 py-1 text-xs font-medium text-kush-50 transition hover:bg-kush-600"
                >
                  ↘ Insert into description
                </button>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-kush-900/80 px-3.5 py-2.5 text-sm text-kush-300 ring-1 ring-kush-800">
              Thinking…
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-950/60 px-3 py-2 text-xs text-red-200 ring-1 ring-red-900">
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-kush-800 p-3">
        <div className="flex items-end gap-2">
          <textarea
            className="field-input max-h-32 min-h-[44px] flex-1 resize-none py-2.5"
            placeholder="Ask for help writing a description…"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            className="btn-primary px-4 py-2.5"
            onClick={send}
            disabled={busy || !input.trim()}
          >
            Send
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-kush-500">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
