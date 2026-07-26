"use client";

import Link from "next/link";
import { ExternalLinkIcon } from "./icons";
import { useReveal } from "@/lib/use-reveal";

const highlights = [
  {
    slug: "zavri-hubu-nebo-otevru-terminal",
    title: "Zavři hubu nebo otevřu terminál!",
    excerpt: "Čím víc někdo o AI skutečně ví, tím míň má potřebu se k tomu vyjadřovat. Potkal jsem člověka, kterej mi na akci vysvětloval, že LLM jsou jen papoušci.",
    date: "26. 7. 2026",
    readTime: "3 min",
  },
  {
    slug: "vyjimecni-obycejnaci",
    title: "Výjimeční obyčejňáci",
    excerpt: "Nejde o to být nejchytřejší. Jde o to nebýt nejhloupější. A to je maximalistický minimalismus v praxi.",
    date: "25. 7. 2026",
    readTime: "4 min",
  },
  {
    slug: "rozkosne-nedokonalosti",
    title: "Rozkošné nedokonalosti",
    excerpt: "I na půjčeným kole se dá dobře projet. O chaosu, autenticitě a tom, proč jsou nedokonalosti to jediný, co si lidi pamatujou.",
    date: "26. 7. 2026",
    readTime: "3 min",
  },
];

export default function BlogHighlights() {
  const { ref, style } = useReveal({ threshold: 0.1 });

  return (
    <section className="section-apple">
      <div ref={ref} style={style} className="container-read">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="eyebrow">Blog</p>
          <Link
            href="/blog"
            className="text-xs transition-colors hover:text-gold"
            style={{ color: "var(--text-muted)" }}
          >
            Všechny články →
          </Link>
        </div>
        <h2 className="headline-lg mb-8">Co jsem napsal</h2>

        <div className="space-y-6">
          {highlights.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl p-5 transition-all duration-300"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold transition-colors group-hover:text-gold" style={{ color: "var(--text)" }}>
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                  <ExternalLinkIcon size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
