/**
 * Categorize transactions into one of the 10 buckets.
 *
 * Primary path: Anthropic Claude in batches of 50.
 * Fallback: deterministic keyword matcher.
 */

import { anthropic, isAnthropicConfigured, MODELS } from "@/lib/ai/anthropic";
import { CATEGORIZATION_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import type { CategoryId } from "@/lib/math/cashflow-engine";

export interface InputTxn {
  id: string;
  date: string;
  description: string;
  amount_cents: number;
}

export interface CategorizedTxn {
  transaction_id: string;
  category: CategoryId | null; // null for transfers / skip
  confidence: number;
  reasoning?: string;
}

export async function categorizeTransactions(txns: InputTxn[]): Promise<CategorizedTxn[]> {
  if (isAnthropicConfigured()) {
    try {
      return await categorizeBatched(txns);
    } catch (err) {
      console.warn("[categorize] Claude failed, falling back to keyword matcher:", err);
    }
  }
  return txns.map((t) => keywordCategorize(t));
}

/* ------------------------------------------------------------------ */
/* Claude batched path                                                 */
/* ------------------------------------------------------------------ */

async function categorizeBatched(txns: InputTxn[]): Promise<CategorizedTxn[]> {
  const out: CategorizedTxn[] = [];
  for (let i = 0; i < txns.length; i += 50) {
    const batch = txns.slice(i, i + 50);
    const userMsg = JSON.stringify(batch.map((t) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      amount_cents: t.amount_cents,
    })));

    const response = await anthropic.messages.create({
      model: MODELS.categorization,
      max_tokens: 4000,
      system: CATEGORIZATION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    });

    const block = response.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
    if (!block) continue;
    const raw = block.text.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(raw) as { transaction_id: string; category: string; confidence: number; reasoning?: string }[];

    for (const r of parsed) {
      const catId = CATEGORY_NAME_TO_ID[r.category] ?? null;
      out.push({
        transaction_id: r.transaction_id,
        category: catId,
        confidence: r.confidence,
        reasoning: r.reasoning,
      });
    }
  }
  return out;
}

const CATEGORY_NAME_TO_ID: Record<string, CategoryId> = {
  tithes_offerings: 1,
  core_bills: 2,
  food: 3,
  health_wellness: 4,
  savings: 5,
  debt_repayment: 6,
  retirement_investment: 7,
  leisure_lifestyle: 8,
  skill_business_prep: 9,
  active_business_investment: 10,
};

/* ------------------------------------------------------------------ */
/* Keyword fallback                                                    */
/* ------------------------------------------------------------------ */

interface Rule { test: RegExp; category: CategoryId; confidence: number }

const RULES: Rule[] = [
  // 1 — Tithes / Offerings
  { test: /\bchurch|tithe|offering|givelify|pushpay|easyTithe|fellowship|ministry|cathedral|cha?pel\b/i, category: 1, confidence: 0.9 },
  // 2 — Core bills & housing
  { test: /\brent|mortgage|hoa|electr(ic|icity)|water utility|sewer|gas company|spectrum|xfinity|comcast|verizon|at&t|t-mobile|tmobile|insurance|geico|state farm|allstate|car payment|auto loan\b/i, category: 2, confidence: 0.9 },
  // 3 — Food
  { test: /\b(whole foods|trader joe|publix|kroger|safeway|costco|walmart grocery|aldi|wegmans|target.*grocer|starbucks|chipotle|mcdonald|wendy|burger|chick-fil|panera|domino|pizza|uber.*eats|doordash|grubhub|instacart|sweetgreen|cava|restaurant|cafe|coffee|bakery)\b/i, category: 3, confidence: 0.9 },
  // 4 — Health & wellness
  { test: /\b(gym|equinox|planet fitness|crossfit|yoga|peloton|cvs|walgreens|pharmacy|doctor|clinic|dental|therapy|psych|chiro|supplement|vitamin)\b/i, category: 4, confidence: 0.85 },
  // 5 — Savings transfers
  { test: /\b(savings|hysa|wealthfront|betterment|ally savings|marcus|sofi savings)\b/i, category: 5, confidence: 0.8 },
  // 6 — Debt repayment
  { test: /\b(credit card payment|cc pmt|loan payment|student loan|navient|nelnet|sallie mae|discover.*pmt|chase.*pmt|amex.*pmt)\b/i, category: 6, confidence: 0.85 },
  // 7 — Retirement / investments
  { test: /\b(401k|403b|ira|roth|fidelity|vanguard|schwab|brokerage|coinbase|gemini|kraken|robinhood)\b/i, category: 7, confidence: 0.85 },
  // 8 — Leisure & lifestyle
  { test: /\b(netflix|spotify|hulu|disney|hbo|apple\.com\/bill|amazon prime|youtube premium|airbnb|expedia|hotel|airline|delta|united|southwest|amc|cinemark|movie|concert|ticketmaster|nike|adidas|lululemon|nordstrom|macy)\b/i, category: 8, confidence: 0.85 },
  // 9 — Skill / business prep
  { test: /\b(udemy|coursera|skillshare|masterclass|teachable|kajabi|conference|seminar|book|amazon\.com.*book)\b/i, category: 9, confidence: 0.75 },
  // 10 — Active business investment
  { test: /\b(ads|advertising|facebook ads|google ads|tiktok ads|shopify|stripe fees|payroll|gusto|quickbooks)\b/i, category: 10, confidence: 0.75 },
];

export function keywordCategorize(t: InputTxn): CategorizedTxn {
  // Transfers between own accounts → skip
  if (/\btransfer\b|\bxfer\b|\bach\b/i.test(t.description) && /own|internal|self/i.test(t.description)) {
    return { transaction_id: t.id, category: null, confidence: 0.5, reasoning: "transfer between own accounts" };
  }
  for (const rule of RULES) {
    if (rule.test.test(t.description)) {
      return { transaction_id: t.id, category: rule.category, confidence: rule.confidence };
    }
  }
  // Default: ATM-style withdrawals → leisure low-conf; otherwise leisure with lower conf
  if (/\batm\b|\bcash withdrawal\b/i.test(t.description)) {
    return { transaction_id: t.id, category: 8, confidence: 0.3, reasoning: "ATM withdrawal — unknown use" };
  }
  return { transaction_id: t.id, category: 8, confidence: 0.4, reasoning: "uncategorized — defaulted to leisure" };
}
