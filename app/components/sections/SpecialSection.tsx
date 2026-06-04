"use client";

import { useState } from "react";
import FileUpload from "../FileUpload";
import SubmitBar from "../SubmitBar";
import { submitRequest } from "../../lib/submit";

interface Props {
  description: string;
  setDescription: (v: string) => void;
}

export default function SpecialSection({ description, setDescription }: Props) {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label" htmlFor="special-title">
          What does this change relate to? (optional)
        </label>
        <input
          id="special-title"
          className="field-input"
          placeholder="e.g. Homepage banner, contact page, pricing…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="special-desc">
          Describe the change
        </label>
        <textarea
          id="special-desc"
          className="field-input min-h-[140px] resize-y"
          placeholder="Tell us exactly what you'd like changed. Not sure how to word it? Use the assistant on the right. 🌿"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <FileUpload
        files={files}
        onChange={setFiles}
        accept="image/*,video/*"
        label="Add a picture and/or video (optional)"
        hint="Images or video — drop as many as you need"
      />

      <SubmitBar
        onSubmit={() =>
          submitRequest("special", { title, description }, files)
        }
        onSuccess={() => {
          setTitle("");
          setDescription("");
          setFiles([]);
        }}
      />
    </div>
  );
}
