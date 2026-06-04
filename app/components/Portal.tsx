"use client";

import { useMemo, useState } from "react";
import { SECTIONS, SectionId } from "../lib/types";
import ChatAssistant from "./ChatAssistant";
import SpecialSection from "./sections/SpecialSection";
import GallerySection from "./sections/GallerySection";
import SeedsSection from "./sections/SeedsSection";
import OffersSection from "./sections/OffersSection";

type Descriptions = Record<SectionId, string>;

const EMPTY_DESCRIPTIONS: Descriptions = {
  special: "",
  gallery: "",
  seeds: "",
  offers: "",
};

export default function Portal() {
  const [active, setActive] = useState<SectionId>("special");
  const [descriptions, setDescriptions] = useState<Descriptions>(EMPTY_DESCRIPTIONS);
  const [chatOpen, setChatOpen] = useState(false);

  const activeMeta = useMemo(
    () => SECTIONS.find((s) => s.id === active)!,
    [active]
  );

  const setDescription = (value: string) =>
    setDescriptions((d) => ({ ...d, [active]: value }));

  // Append the assistant's text into the current section's description.
  const insertIntoDescription = (text: string) => {
    setDescriptions((d) => {
      const existing = d[active].trim();
      return { ...d, [active]: existing ? `${existing}\n\n${text}` : text };
    });
    setChatOpen(false);
  };

  const sectionProps = {
    description: descriptions[active],
    setDescription,
  };

  const renderSection = () => {
    switch (active) {
      case "special":
        return <SpecialSection {...sectionProps} />;
      case "gallery":
        return <GallerySection {...sectionProps} />;
      case "seeds":
        return <SeedsSection {...sectionProps} />;
      case "offers":
        return <OffersSection {...sectionProps} />;
    }
  };

  const chat = (
    <ChatAssistant
      sectionContext={activeMeta.aiContext}
      sectionLabel={activeMeta.label}
      onInsert={insertIntoDescription}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kush-600 text-2xl shadow-lg shadow-kush-900/50">
            🐶
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Josh Dog Kush
            </h1>
            <p className="text-sm text-kush-300">Website change request portal</p>
          </div>
        </div>
        <p className="max-w-2xl text-sm text-kush-300">
          Pick what you want to change, describe it (the assistant can help write
          it), attach any photos or video, and hit submit. It gets sent straight
          to your developer. 🌿
        </p>
      </header>

      {/* Tabs */}
      <nav className="mb-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active === s.id
                ? "bg-kush-500 text-white shadow"
                : "border border-kush-800 bg-kush-900/40 text-kush-200 hover:border-kush-600 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Active section form */}
        <main className="card">
          <h2 className="text-lg font-semibold text-white">{activeMeta.label}</h2>
          <p className="mb-5 mt-0.5 text-sm text-kush-300">{activeMeta.tagline}</p>
          {renderSection()}
        </main>

        {/* Chat — sticky sidebar on desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 h-[calc(100vh-3rem)] overflow-hidden rounded-2xl border border-kush-800 bg-kush-900/40 backdrop-blur">
            {chat}
          </div>
        </aside>
      </div>

      {/* Mobile chat toggle */}
      <button
        onClick={() => setChatOpen(true)}
        className="btn-primary fixed bottom-5 right-5 z-30 shadow-xl lg:hidden"
        aria-label="Open writing assistant"
      >
        ✨ Assistant
      </button>

      {/* Mobile chat drawer */}
      {chatOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setChatOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 top-12 overflow-hidden rounded-t-3xl border-t border-kush-800 bg-kush-950">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setChatOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm text-kush-200 hover:bg-kush-900"
              >
                Close ✕
              </button>
            </div>
            <div className="h-[calc(100%-3rem)]">{chat}</div>
          </div>
        </div>
      )}

      <footer className="mt-10 text-center text-xs text-kush-500">
        Josh Dog Kush · change requests are emailed to your developer.
      </footer>
    </div>
  );
}
