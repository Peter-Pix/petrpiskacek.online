"use client";

import { MailIcon } from "./icons";

export default function Contact() {
  return (
    <section id="kontakt" className="section-apple">
      <div className="container-read text-center">
        <p className="eyebrow mb-3">Kontakt</p>
        <h2 className="headline-lg mb-4">Chceš to zkusit?</h2>
        <p className="subhead mb-8 mx-auto max-w-md">
          Napiš mi. Domluvíme se, co potřebuješ, a já ti ukážu, jak to udělat.
          Žádný korporát. Žádný zbytečný meetingy.
        </p>
        <a
          href="mailto:ppix50@gmail.com"
          className="btn-apple btn-apple-primary inline-flex items-center gap-2"
        >
          <MailIcon size={18} />
          Napiš mi
        </a>
      </div>
    </section>
  );
}
