import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "path";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  serverExternalPackages: ["@piskacek/ui"],
};

// Turbopack (Next 16) respektuje tsconfig paths automaticky,
// ale pro jistotu explicitně aliasujeme na vendored balík.
// (path.resolve kvůli absolutní cestě při buildu)

const withMDX = createMDX({});

export default withMDX(nextConfig);
