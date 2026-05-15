/**
 * Registry mapping screen IDs to their React components.
 * Subagents populate components/screens/act{N}/screen-{id}.tsx and
 * we wire them up here as they land.
 */

import type { ScreenDef, Brand } from "@/lib/content/acts";
import { type ReactNode } from "react";

export interface RenderContext {
  screen: ScreenDef;
  userId: string;
  brand: Brand | null;
  initialData: Record<string, unknown>;
  profile: any;
  progress: any;
}

type Renderer = (ctx: RenderContext) => ReactNode;

// Lazy imports — only the screens that exist on disk get wired. Missing ones fall through to placeholder.
import { Screen11 } from "@/components/screens/act1/screen-1-1";
import { Screen12 } from "@/components/screens/act1/screen-1-2";
import { Screen13 } from "@/components/screens/act1/screen-1-3";
import { Screen14 } from "@/components/screens/act1/screen-1-4";
import { Screen15 } from "@/components/screens/act1/screen-1-5";
import { Screen16 } from "@/components/screens/act1/screen-1-6";
import { Screen17 } from "@/components/screens/act1/screen-1-7";
import { Screen18 } from "@/components/screens/act1/screen-1-8";
import { Screen19 } from "@/components/screens/act1/screen-1-9";
import { Screen110 } from "@/components/screens/act1/screen-1-10";
import { Screen111 } from "@/components/screens/act1/screen-1-11";
import { Screen112 } from "@/components/screens/act1/screen-1-12";
import { Screen31 } from "@/components/screens/act3/screen-3-1";
import { Screen32 } from "@/components/screens/act3/screen-3-2";
import { Screen33 } from "@/components/screens/act3/screen-3-3";
import { Screen34 } from "@/components/screens/act3/screen-3-4";
import { Screen35 } from "@/components/screens/act3/screen-3-5";
import { Screen36 } from "@/components/screens/act3/screen-3-6";
import { Screen41 } from "@/components/screens/act4/screen-4-1";
import { Screen42 } from "@/components/screens/act4/screen-4-2";
import { Screen43 } from "@/components/screens/act4/screen-4-3";
import { Screen44 } from "@/components/screens/act4/screen-4-4";
import { Screen45 } from "@/components/screens/act4/screen-4-5";

const REGISTRY: Record<string, Renderer> = {
  "1.1":  (ctx) => <Screen11 {...ctx} />,
  "1.2":  (ctx) => <Screen12 {...ctx} />,
  "1.3":  (ctx) => <Screen13 {...ctx} />,
  "1.4":  (ctx) => <Screen14 {...ctx} />,
  "1.5":  (ctx) => <Screen15 {...ctx} />,
  "1.6":  (ctx) => <Screen16 {...ctx} />,
  "1.7":  (ctx) => <Screen17 {...ctx} />,
  "1.8":  (ctx) => <Screen18 {...ctx} />,
  "1.9":  (ctx) => <Screen19 {...ctx} />,
  "1.10": (ctx) => <Screen110 {...ctx} />,
  "1.11": (ctx) => <Screen111 {...ctx} />,
  "1.12": (ctx) => <Screen112 {...ctx} />,
};

export function renderScreen(ctx: RenderContext): ReactNode | null {
  const fn = REGISTRY[ctx.screen.id];
  return fn ? fn(ctx) : null;
}

export function isScreenImplemented(id: string): boolean {
  return id in REGISTRY;
}
