/**
 * Extract transactions from raw bank-statement text.
 *
 * Primary path: Anthropic Claude (when ANTHROPIC_API_KEY is set).
 * Fallback: regex-based parser handling the most common US bank formats
 *           (Chase, Wells Fargo, Bank of America).
 */

import { anthropic, isAnthropicConfigured, MODELS } from "@/lib/ai/anthropic";
import { EXTRACTION_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export interface ExtractedTransaction {
  date: string;        // YYYY-MM-DD
  description: string;
  amount_cents: number; // negative = outflow, positive = inflow
}

/**
 * Main entry — chooses Claude or fallback based on env.
 */
export async function extractTransactionsFromText(
  text: string,
  statementPeriodHint?: { start?: string; end?: string },
): Promise<ExtractedTransaction[]> {
  if (isAnthropicConfigured()) {
    try {
      return await extractWithClaude(text);
    } catch (err) {
      console.warn("[extract] Claude failed, falling back to regex:", err);
    }
  }
  return extractWithRegex(text, statementPeriodHint);
}

/* ------------------------------------------------------------------ */
/* Claude path                                                         */
/* ------------------------------------------------------------------ */

async function extractWithClaude(text: string): Promise<ExtractedTransaction[]> {
  const response = await anthropic.messages.create({
    model: MODELS.extraction,
    max_tokens: 8000,
    system: EXTRACTION_SYSTEM_PROMPT,
    messages: [
      { role: "user", content: text.slice(0, 100_000) }, // safety cap
    ],
  });

  const block = response.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
  if (!block) return [];

  // The prompt instructs Claude to return ONLY a JSON array
  const raw = block.text.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  const parsed = JSON.parse(raw) as ExtractedTransaction[];
  return parsed.filter((t) => t.date && t.description && Number.isFinite(t.amount_cents));
}

/* ------------------------------------------------------------------ */
/* Regex fallback                                                      */
/* ------------------------------------------------------------------ */

/**
 * Fallback parser. Catches the most common transaction-line patterns:
 *   - "MM/DD/YYYY  DESCRIPTION ... -$12.34"
 *   - "MM/DD  DESCRIPTION  $1,234.56"
 *   - "01/15/2026   Whole Foods Market   45.67"
 * Heuristics, not exhaustive.
 */
export function extractWithRegex(
  text: string,
  hint?: { start?: string; end?: string },
): ExtractedTransaction[] {
  const out: ExtractedTransaction[] = [];
  const lines = text.split(/\r?\n/);

  // Date format: MM/DD or MM/DD/YY or MM/DD/YYYY
  const dateRe = /\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?\b/;
  // Amount: optional $ sign, optional minus, optional parens for negative, optional commas, decimal
  const amountRe = /\(?-?\$?\s*\d{1,3}(?:,\d{3})*\.\d{2}\)?/g;

  let yearGuess = new Date().getFullYear();
  if (hint?.start) {
    const m = /(\d{4})/.exec(hint.start);
    if (m) yearGuess = Number(m[1]);
  }

  for (const line of lines) {
    const dateMatch = dateRe.exec(line);
    if (!dateMatch) continue;

    const month = Number(dateMatch[1]);
    const day = Number(dateMatch[2]);
    let year = dateMatch[3] ? Number(dateMatch[3]) : yearGuess;
    if (year < 100) year += 2000;
    if (month < 1 || month > 12 || day < 1 || day > 31) continue;

    const amounts = line.match(amountRe);
    if (!amounts || amounts.length === 0) continue;

    // Take the LAST amount on the line (typical bank-statement layout)
    const rawAmount = amounts[amounts.length - 1] ?? "";
    const cleaned = rawAmount.replace(/[$,\s]/g, "");
    const isNeg = cleaned.startsWith("(") && cleaned.endsWith(")") || cleaned.startsWith("-");
    const numeric = parseFloat(cleaned.replace(/[()-]/g, ""));
    if (!Number.isFinite(numeric)) continue;
    const amount_cents = Math.round(numeric * 100) * (isNeg ? -1 : -1);
    // Default sign: bank statements list debits as positive; we want OUTFLOWS negative
    // Without more context we can't tell debit vs credit — leave outflows negative as a heuristic

    // Description = the line with the date and amount stripped out
    const description = line
      .replace(dateRe, "")
      .replace(amountRe, "")
      .replace(/\s{2,}/g, " ")
      .replace(/[^\x20-\x7E]/g, "")
      .trim()
      .slice(0, 100);

    if (!description) continue;

    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    out.push({ date: iso, description, amount_cents });
  }

  return out;
}
