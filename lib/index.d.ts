interface InitSettings {
    url: string;
    siteId: string;
    tagManagerId?: string;
    jsTrackerFile?: string;
    phpTrackerFile?: string;
    excludeUrlsPatterns?: RegExp[];
    disableCookies?: boolean;
    onRouteChangeStart?: (path: string) => void;
    onRouteChangeComplete?: (path: string) => void;
    onInitialization?: () => void;
    nonce?: string;
    trustedPolicyName?: string;
}
interface Dimensions {
    dimension1?: string;
    dimension2?: string;
    dimension3?: string;
    dimension4?: string;
    dimension5?: string;
    dimension6?: string;
    dimension7?: string;
    dimension8?: string;
    dimension9?: string;
    dimension10?: string;
}
export declare function push(args: (Dimensions | number[] | string[] | number | string | null | undefined)[]): void;
export declare function init({ url, siteId, tagManagerId, phpTrackerFile, excludeUrlsPatterns, disableCookies, onRouteChangeStart, onRouteChangeComplete, onInitialization, nonce, }: InitSettings): void;
export default init;
//# sourceMappingURL=index.d.ts.map