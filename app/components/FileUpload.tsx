"use client";

import { useCallback, useId, useRef, useState } from "react";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  /** e.g. "image/*" or "image/*,video/*" */
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const url = isImage || isVideo ? URL.createObjectURL(file) : null;

  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-kush-700 bg-kush-900/60 p-2">
      {isImage && url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={file.name}
          className="h-12 w-12 shrink-0 rounded object-cover"
          onLoad={() => URL.revokeObjectURL(url)}
        />
      ) : isVideo && url ? (
        <video
          src={url}
          className="h-12 w-12 shrink-0 rounded object-cover"
          muted
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-kush-800 text-xs text-kush-200">
          FILE
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-kush-50">{file.name}</p>
        <p className="text-xs text-kush-400">{formatBytes(file.size)}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-kush-300 hover:bg-kush-800 hover:text-white"
        aria-label={`Remove ${file.name}`}
      >
        Remove
      </button>
    </div>
  );
}

export default function FileUpload({
  files,
  onChange,
  accept = "image/*",
  multiple = true,
  label = "Upload media",
  hint = "PNG, JPG, GIF or MP4",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const inputId = useId();

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const next = multiple ? [...files, ...Array.from(incoming)] : [Array.from(incoming)[0]];
      onChange(next.filter(Boolean) as File[]);
    },
    [files, multiple, onChange]
  );

  return (
    <div>
      <span className="field-label">{label}</span>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition ${
          dragging
            ? "border-kush-300 bg-kush-800/60"
            : "border-kush-700 bg-kush-900/40 hover:border-kush-500"
        }`}
      >
        <span className="text-2xl">⬆️</span>
        <span className="mt-1 text-sm font-medium text-kush-100">
          Drag &amp; drop or click to browse
        </span>
        <span className="text-xs text-kush-400">{hint}</span>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <FilePreview
              key={`${file.name}-${i}`}
              file={file}
              onRemove={() => onChange(files.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
