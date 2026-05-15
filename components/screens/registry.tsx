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
import { Screen21 } from "@/components/screens/act2/screen-2-1";
import { Screen22 } from "@/components/screens/act2/screen-2-2";
import { Screen23 } from "@/components/screens/act2/screen-2-3";
import { Screen24 } from "@/components/screens/act2/screen-2-4";
import { Screen25 } from "@/components/screens/act2/screen-2-5";
import { Screen26 } from "@/components/screens/act2/screen-2-6";
import { Screen27 } from "@/components/screens/act2/screen-2-7";
import { Screen28 } from "@/components/screens/act2/screen-2-8";
import { Screen29 } from "@/components/screens/act2/screen-2-9";
import { Screen210 } from "@/components/screens/act2/screen-2-10";
import { Screen211 } from "@/components/screens/act2/screen-2-11";
import { Screen212 } from "@/components/screens/act2/screen-2-12";
import { Screen213 } from "@/components/screens/act2/screen-2-13";
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
// Act 5 — Cattle path
import { Screen5C1 } from "@/components/screens/act5/screen-5c-1";
import { Screen5C2 } from "@/components/screens/act5/screen-5c-2";
import { Screen5C3 } from "@/components/screens/act5/screen-5c-3";
import { Screen5C4 } from "@/components/screens/act5/screen-5c-4";
import { Screen5C5 } from "@/components/screens/act5/screen-5c-5";
import { Screen5C6 } from "@/components/screens/act5/screen-5c-6";
// Act 5 — Silver path
import { Screen5S1 } from "@/components/screens/act5/screen-5s-1";
import { Screen5S2 } from "@/components/screens/act5/screen-5s-2";
import { Screen5S3 } from "@/components/screens/act5/screen-5s-3";
import { Screen5S4 } from "@/components/screens/act5/screen-5s-4";
import { Screen5S5 } from "@/components/screens/act5/screen-5s-5";
import { Screen5S6 } from "@/components/screens/act5/screen-5s-6";
// Act 5 — Gold path
import { Screen5G1 } from "@/components/screens/act5/screen-5g-1";
import { Screen5G2 } from "@/components/screens/act5/screen-5g-2";
import { Screen5G3 } from "@/components/screens/act5/screen-5g-3";

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
  "2.1":  (ctx) => <Screen21 {...ctx} />,
  "2.2":  (ctx) => <Screen22 {...ctx} />,
  "2.3":  (ctx) => <Screen23 {...ctx} />,
  "2.4":  (ctx) => <Screen24 {...ctx} />,
  "2.5":  (ctx) => <Screen25 {...ctx} />,
  "2.6":  (ctx) => <Screen26 {...ctx} />,
  "2.7":  (ctx) => <Screen27 {...ctx} />,
  "2.8":  (ctx) => <Screen28 {...ctx} />,
  "2.9":  (ctx) => <Screen29 {...ctx} />,
  "2.10": (ctx) => <Screen210 {...ctx} />,
  "2.11": (ctx) => <Screen211 {...ctx} />,
  "2.12": (ctx) => <Screen212 {...ctx} />,
  "2.13": (ctx) => <Screen213 {...ctx} />,
  "3.1":  (ctx) => <Screen31 {...ctx} />,
  "3.2":  (ctx) => <Screen32 {...ctx} />,
  "3.3":  (ctx) => <Screen33 {...ctx} />,
  "3.4":  (ctx) => <Screen34 {...ctx} />,
  "3.5":  (ctx) => <Screen35 {...ctx} />,
  "3.6":  (ctx) => <Screen36 {...ctx} />,
  "4.1":  (ctx) => <Screen41 {...ctx} />,
  "4.2":  (ctx) => <Screen42 {...ctx} />,
  "4.3":  (ctx) => <Screen43 {...ctx} />,
  "4.4":  (ctx) => <Screen44 {...ctx} />,
  "4.5":  (ctx) => <Screen45 {...ctx} />,
  // Act 5 — Cattle path
  "5C.1": (ctx) => <Screen5C1 {...ctx} />,
  "5C.2": (ctx) => <Screen5C2 {...ctx} />,
  "5C.3": (ctx) => <Screen5C3 {...ctx} />,
  "5C.4": (ctx) => <Screen5C4 {...ctx} />,
  "5C.5": (ctx) => <Screen5C5 {...ctx} />,
  "5C.6": (ctx) => <Screen5C6 {...ctx} />,
  // Act 5 — Silver path
  "5S.1": (ctx) => <Screen5S1 {...ctx} />,
  "5S.2": (ctx) => <Screen5S2 {...ctx} />,
  "5S.3": (ctx) => <Screen5S3 {...ctx} />,
  "5S.4": (ctx) => <Screen5S4 {...ctx} />,
  "5S.5": (ctx) => <Screen5S5 {...ctx} />,
  "5S.6": (ctx) => <Screen5S6 {...ctx} />,
  // Act 5 — Gold path
  "5G.1": (ctx) => <Screen5G1 {...ctx} />,
  "5G.2": (ctx) => <Screen5G2 {...ctx} />,
  "5G.3": (ctx) => <Screen5G3 {...ctx} />,
};

export function renderScreen(ctx: RenderContext): ReactNode | null {
  const fn = REGISTRY[ctx.screen.id];
  return fn ? fn(ctx) : null;
}

export function isScreenImplemented(id: string): boolean {
  return id in REGISTRY;
}
