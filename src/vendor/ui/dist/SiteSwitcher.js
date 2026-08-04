"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ecosystem } from "./ecosystem";
function ExternalLinkIcon({ size = 16 }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), _jsx("polyline", { points: "15 3 21 3 21 9" }), _jsx("line", { x1: "10", y1: "14", x2: "21", y2: "3" })] }));
}
export function SiteSwitcher({ current }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const closeTimeoutRef = useRef(null);
    function clearCloseTimeout() {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }
    function scheduleClose() {
        clearCloseTimeout();
        closeTimeoutRef.current = setTimeout(() => setOpen(false), 300);
    }
    function handleMouseEnter() {
        clearCloseTimeout();
        setOpen(true);
    }
    function handleMouseLeave() {
        scheduleClose();
    }
    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            clearCloseTimeout();
        };
    }, []);
    const siteKeys = Object.keys(ecosystem.sites);
    return (_jsxs("div", { ref: ref, className: "relative", onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [_jsx("button", { onClick: () => setOpen((v) => !v), className: "relative -m-3 rounded-xl p-3 text-sm font-semibold tracking-tight transition-colors hover:text-[var(--gold)]", style: { color: "var(--text)" }, children: _jsx("span", { className: "pointer-events-none", children: "Petr Pisk\u00E1\u010Dek" }) }), open && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute left-0 right-0 top-full h-[22px] z-10", "aria-hidden": "true" }), _jsx("div", { className: "absolute left-0 top-full mt-[14px] w-64 rounded-xl border p-2 shadow-xl z-20", style: {
                            borderColor: "var(--border)",
                            backgroundColor: "var(--bg-secondary)",
                            backdropFilter: "blur(20px)",
                        }, children: siteKeys.map((key) => {
                            const site = ecosystem.sites[key];
                            const isCurrent = key === current;
                            return (_jsxs("a", { href: site.url, target: "_blank", rel: "noopener noreferrer", className: `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${isCurrent ? "font-semibold" : ""}`, style: {
                                    backgroundColor: isCurrent ? "var(--surface)" : "transparent",
                                    color: isCurrent ? "var(--text)" : "var(--text-secondary)",
                                }, onMouseEnter: (e) => {
                                    clearCloseTimeout();
                                    if (!isCurrent)
                                        e.currentTarget.style.backgroundColor = "var(--surface)";
                                }, onMouseLeave: (e) => {
                                    if (!isCurrent)
                                        e.currentTarget.style.backgroundColor = "transparent";
                                }, children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm", children: site.label }), _jsx("div", { className: "text-xs mt-0.5", style: { color: "var(--text-muted)" }, children: site.desc })] }), isCurrent ? (_jsx("span", { className: "text-xs font-medium", style: { color: "var(--gold)" }, children: "tady" })) : (_jsx(ExternalLinkIcon, { size: 12 }))] }, key));
                        }) })] }))] }));
}
//# sourceMappingURL=SiteSwitcher.js.map