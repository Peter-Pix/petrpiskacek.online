export interface EcosystemSite {
    url: string;
    label: string;
    desc: string;
}
export interface EcosystemConfig {
    author: string;
    github: string;
    email: string;
    sites: Record<'cz' | 'online' | 'cloud', EcosystemSite>;
}
export declare const ecosystem: EcosystemConfig;
export type SiteKey = keyof EcosystemConfig['sites'];
//# sourceMappingURL=ecosystem.d.ts.map