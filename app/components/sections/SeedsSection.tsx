"use client";

import { useState } from "react";
import FileUpload from "../FileUpload";
import SubmitBar from "../SubmitBar";
import { submitRequest } from "../../lib/submit";

interface Props {
  description: string;
  setDescription: (v: string) => void;
}

export default function SeedsSection({ description, setDescription }: Props) {
  const [strain, setStrain] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="seed-strain">
            Strain / product name
          </label>
          <input
            id="seed-strain"
            className="field-input"
            placeholder="e.g. Northern Lights Auto"
            value={strain}
            onChange={(e) => setStrain(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="seed-price">
            Price
          </label>
          <input
            id="seed-price"
            className="field-input"
            placeholder="e.g. $45 for 5 seeds"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <FileUpload
        files={files}
        onChange={setFiles}
        accept="image/*"
        label="Product photos"
        hint="Upload multiple images of the seeds / plant"
      />

      <div>
        <label className="field-label" htmlFor="seed-desc">
          Description
        </label>
        <textarea
          id="seed-desc"
          className="field-input min-h-[140px] resize-y"
          placeholder="Describe the strain — effects, flavour, grow notes… The assistant can write this for you."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <SubmitBar
        label="Add seeds"
        onSubmit={() =>
          submitRequest("seeds", { strain, price, description }, files)
        }
        onSuccess={() => {
          setStrain("");
          setPrice("");
          setDescription("");
          setFiles([]);
        }}
      />
    </div>
  );
}
