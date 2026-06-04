"use client";

import { useState } from "react";
import FileUpload from "../FileUpload";
import SubmitBar from "../SubmitBar";
import { submitRequest } from "../../lib/submit";

interface Props {
  description: string;
  setDescription: (v: string) => void;
}

export default function GallerySection({ description, setDescription }: Props) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-5">
      <FileUpload
        files={files}
        onChange={setFiles}
        accept="image/*"
        label="Gallery image(s)"
        hint="Add one or more photos for the gallery"
      />

      <div>
        <label className="field-label" htmlFor="gallery-desc">
          Image description
        </label>
        <textarea
          id="gallery-desc"
          className="field-input min-h-[120px] resize-y"
          placeholder="Describe the photo / caption for the gallery. The assistant can help you write it."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <SubmitBar
        label="Add to gallery"
        onSubmit={() => submitRequest("gallery", { description }, files)}
        onSuccess={() => {
          setDescription("");
          setFiles([]);
        }}
      />
    </div>
  );
}
