"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ModuleInteractiveProps } from "./module-renderer";
import { Upload, FileText, AlertCircle } from "lucide-react";

export function GetRealNumbersModule({ data: _d, onChange: _o }: ModuleInteractiveProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p>
          Every man who is broke has lied to himself about a number. The cure is to sit down and
          count. Pull the last three to six months of every account. Add up every dollar. Assign
          each one to a category.
        </p>
        <p>
          We&rsquo;ll do this together. Upload bank statement PDFs and our AI extracts every
          transaction. You&rsquo;ll review them in the next module.
        </p>
      </div>

      <div className="pt-6 border-t border-border/60">
        <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-display text-lg">Drop bank statements here</p>
          <p className="text-xs text-muted-foreground mt-2">
            PDFs up to 50MB each · last 3-6 months · Chase, Wells Fargo, Bank of America supported
          </p>
        </div>

        <Card className="mt-6 border-warning/40 bg-warning/5">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
            <div className="text-sm">
              <strong className="block">PDF upload + AI extraction is being wired up.</strong>
              <p className="text-muted-foreground mt-1">
                The pipeline code lives in <code>app/api/upload-statement/route.ts</code> and{" "}
                <code>lib/ai/prompts.ts</code>. It needs an ANTHROPIC_API_KEY and live Supabase to
                run end-to-end. See <code>ACTION_REQUIRED.md</code> for the setup steps.
              </p>
              {/* DRAFT: Alex to review — Phase 8 upload UI pending live AI integration */}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {["Income", "Outflow", "Top Merchants"].map((s) => (
            <div key={s} className="p-4 rounded-lg border border-border/60 bg-muted/30 text-center">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {s}
              </p>
              <p className="font-display text-2xl mt-1 text-muted-foreground/50">—</p>
              <p className="text-xs text-muted-foreground mt-1">Awaiting upload</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
