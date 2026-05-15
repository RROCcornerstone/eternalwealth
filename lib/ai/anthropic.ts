import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

export const anthropic = new Anthropic({
  apiKey: apiKey ?? "sk-ant-stub-development-only",
});

export const isAnthropicConfigured = (): boolean => {
  return Boolean(apiKey && apiKey.startsWith("sk-ant-") && !apiKey.includes("stub"));
};

export const MODELS = {
  extraction: "claude-sonnet-4-5",
  categorization: "claude-sonnet-4-5",
  analysis: "claude-opus-4-7",
} as const;
