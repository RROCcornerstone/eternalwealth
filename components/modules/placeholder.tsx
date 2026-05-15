"use client";

import type { ModuleInteractiveProps } from "./module-renderer";

export function PlaceholderModule({ data: _data, onChange: _onChange }: ModuleInteractiveProps) {
  return (
    <div className="text-center py-12">
      <p className="font-display text-lg text-muted-foreground">
        This module&rsquo;s interactive content is being built.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        You can save and continue to keep your place in the framework.
      </p>
    </div>
  );
}
