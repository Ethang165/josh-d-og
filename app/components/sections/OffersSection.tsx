"use client";

import { useState } from "react";
import FileUpload from "../FileUpload";
import SubmitBar from "../SubmitBar";
import { submitRequest } from "../../lib/submit";

interface Props {
  description: string;
  setDescription: (v: string) => void;
}

export default function OffersSection({ description, setDescription }: Props) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-5">
      <FileUpload
        files={files}
        onChange={setFiles}
        accept="image/*"
        label="Offer image"
        hint="The banner / image for the special offer"
      />

      <div>
        <label className="field-label" htmlFor="offer-desc">
          Offer description
        </label>
        <textarea
          id="offer-desc"
          className="field-input min-h-[120px] resize-y"
          placeholder="Describe the special offer — e.g. 'Buy 5 get 1 free this weekend'. The assistant can punch it up."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <SubmitBar
        label="Update special offer"
        onSubmit={() => submitRequest("offers", { description }, files)}
        onSuccess={() => {
          setDescription("");
          setFiles([]);
        }}
      />
    </div>
  );
}
