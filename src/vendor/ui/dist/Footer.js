"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { GithubIcon, MailIcon, ExternalLinkIcon } from "./icons";
import { ecosystem } from "./ecosystem";
export function Footer({ tagline, links = ["cz", "online", "cloud"], email = ecosystem.email, githubUrl = ecosystem.github, className = "py-8", }) {
    const [year, setYear] = useState(2026);
    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (_jsx("footer", { className: `border-t ${className}`, style: { borderColor: "var(--border)" }, children: _jsx("div", { className: "container-apple px-5", children: _jsxs("div", { className: "flex flex-col items-center justify-between gap-4 sm:flex-row", children: [_jsxs("div", { className: "flex flex-col items-center gap-1 sm:items-start", children: [_jsxs("p", { className: "text-xs", style: { color: "var(--text-muted)" }, children: ["\u00A9 ", year, " ", ecosystem.author] }), tagline && (_jsx("p", { className: "text-[10px] opacity-50 italic", style: { color: "var(--text-muted)" }, children: tagline }))] }), _jsxs("div", { className: "flex items-center gap-4", children: [links.map((key) => {
                                const site = ecosystem.sites[key];
                                return (_jsxs("a", { href: site.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-xs transition-colors hover:text-[var(--gold)]", style: { color: "var(--text-muted)" }, children: [site.label.replace("petrpiskacek.", "."), _jsx(ExternalLinkIcon, { size: 10 })] }, key));
                            }), _jsx("a", { href: githubUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-xs transition-colors", style: { color: "var(--text-muted)" }, children: _jsx(GithubIcon, { size: 14 }) }), _jsx("a", { href: `mailto:${email}`, className: "inline-flex items-center gap-1 text-xs transition-colors", style: { color: "var(--text-muted)" }, children: _jsx(MailIcon, { size: 14 }) })] })] }) }) }));
}
//# sourceMappingURL=Footer.js.map