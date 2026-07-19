"use client";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Petr Piskáček",
    alternateName: "Peter Pix",
    givenName: "Petr",
    familyName: "Piskáček",
    email: "ppix50@gmail.com",
    url: "https://petrpiskacek.online",
    sameAs: [
      "https://petrpiskacek.cz",
      "https://petrpiskacek.cloud",
      "https://github.com/Peter-Pix",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "LLM",
      "Software Development",
      "Psychology",
    ],
    description:
      "AI konzultant, vývojář, hudebník. Stavím věci, co fungujou.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
