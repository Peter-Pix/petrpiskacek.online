import { type SiteKey } from "./ecosystem";
interface FooterProps {
    /** Optional tagline shown under the copyright. */
    tagline?: string;
    /** Which sites to link. Default: all three. */
    links?: SiteKey[];
    /** Email for the mail icon. Defaults to ecosystem.json. */
    email?: string;
    /** GitHub profile URL. Defaults to ecosystem.json. */
    githubUrl?: string;
    /** Vertical padding class override. */
    className?: string;
}
export declare function Footer({ tagline, links, email, githubUrl, className, }: FooterProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Footer.d.ts.map