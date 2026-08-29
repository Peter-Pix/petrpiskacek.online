"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { trackEvent } from "@/lib/track";

/**
 * Trackované CTA na článek blogu — posílá GA4 click_cta při kliknutí.
 * Client wrapper, aby šel použít i v server komponentách.
 */
export default function TrackedArticleLink({
  slug,
  location,
  children,
  className,
  style,
}: {
  slug: string;
  location: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={className}
      style={style}
      onClick={() =>
        trackEvent("click_cta", { cta: "blog_article", article: slug, location })
      }
    >
      {children}
    </Link>
  );
}
