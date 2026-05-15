"use client";

import { useRef, useState } from "react";
import { ScreenShell } from "@/components/screens/screen-shell";
import { SCREENS_BY_ID } from "@/lib/content/acts";
import type { RenderContext } from "@/components/screens/registry";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  path: string;
  status: "uploading" | "uploaded" | "error";
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function Screen32({ userId, brand, initialData }: RenderContext) {
  const initial = ((initialData?.uploaded_files as UploadedFile[]) ?? []) as UploadedFile[];
  const [files, setFiles] = useState<UploadedFile[]>(initial);
  const [dragging, setDragging] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <ScreenShell
      screen={SCREENS_BY_ID["3.2"]}
      userId={userId}
      brand={brand}
      initialData={initial.length ? { uploaded_files: initial } : initialData}
      continueLabel="Continue"
      canContinue={files.length > 0}
    >
      {({ setField }) => {
        async function handleFiles(list: FileList | File[]) {
          const arr = Array.from(list);
          for (const file of arr) {
            const entry: UploadedFile = {
              name: file.name,
              size: file.size,
              path: "",
              status: "uploading",
            };
            setFiles((prev) => {
              const next = [...prev, entry];
              setField("uploaded_files", next);
              return next;
            });

            try {
              const supabase = createClient();
              const path = `statements/${userId}/${Date.now()}-${file.name}`;
              const { error: uploadError } = await supabase.storage
                .from("statements")
                .upload(path, file);

              if (uploadError) {
                // Bucket might not exist yet — degrade gracefully.
                setStorageWarning(
                  "Storage isn't fully configured yet — your file was queued locally. You can still continue with sample data.",
                );
                setFiles((prev) => {
                  const next = prev.map((f) =>
                    f === entry
                      ? { ...f, path, status: "uploaded" as const }
                      : f,
                  );
                  setField("uploaded_files", next);
                  return next;
                });
                continue;
              }

              await supabase.from("statement_uploads").insert({
                user_id: userId,
                storage_path: path,
                original_filename: file.name,
                status: "uploaded",
              } as any);

              setFiles((prev) => {
                const next = prev.map((f) =>
                  f === entry
                    ? { ...f, path, status: "uploaded" as const }
                    : f,
                );
                setField("uploaded_files", next);
                return next;
              });

              // Fire-and-forget categorize call (stub returns 501 — we ignore).
              fetch("/api/categorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path, user_id: userId }),
              }).catch(() => {});
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Upload failed";
              setFiles((prev) => {
                const next = prev.map((f) =>
                  f === entry
                    ? { ...f, status: "error" as const, error: msg }
                    : f,
                );
                setField("uploaded_files", next);
                return next;
              });
            }
          }
        }

        return (
          <div className="space-y-6">
            <h1 className="font-display text-3xl sm:text-4xl leading-tight text-foreground">
              Drop your statements here.
            </h1>
            <p className="text-muted-foreground">
              We accept PDF and CSV. Drag in as many as you need.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files?.length) {
                  void handleFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "rounded-lg border-2 border-dashed p-12 text-center cursor-pointer transition-colors",
                dragging
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-foreground/40",
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
            >
              <p className="font-display text-xl text-foreground mb-2">
                Drag &amp; drop statements
              </p>
              <p className="text-sm text-muted-foreground">
                or click to choose files · PDF or CSV
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.csv"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    void handleFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
            </div>

            {storageWarning && (
              <div className="rounded-md border border-warning/40 bg-warning/5 p-3 text-sm text-foreground">
                {storageWarning}
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {files.length} file{files.length === 1 ? "" : "s"} uploaded
                </p>
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="text-foreground">{f.name}</span>
                        <span className="text-xs text-muted-foreground tabular">
                          {formatBytes(f.size)}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "font-mono text-xs uppercase tracking-[0.2em]",
                          f.status === "uploading" && "text-muted-foreground",
                          f.status === "uploaded" && "text-accent",
                          f.status === "error" && "text-destructive",
                        )}
                      >
                        {f.status === "uploading" && "parsing…"}
                        {f.status === "uploaded" && "done"}
                        {f.status === "error" && (f.error ?? "error")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }}
    </ScreenShell>
  );
}
