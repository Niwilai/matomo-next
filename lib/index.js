"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.push = void 0;
var router_1 = __importDefault(require("next/router"));
var isExcludedUrl = function (url, patterns) {
    var excluded = false;
    patterns.forEach(function (pattern) {
        if (pattern.exec(url) !== null) {
            excluded = true;
        }
    });
    return excluded;
};
// to push custom events
function push(args) {
    if (!window._paq) {
        window._paq = [];
    }
    window._paq.push(args);
}
exports.push = push;
var startsWith = function (str, needle) {
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    return str.substring(0, needle.length) === needle;
};
var trustedPolicyHooks = {
    createScript: function (s) { return s; },
    createScriptURL: function (s) { return s; },
};
var createScript = function (url, nonce, tagManagerId) {
    var _a, _b, _c, _d;
    var matomoFile = "matomo.js";
    var matomoCDNUrl = "https://cdn.matomo.cloud";
    var sanitizer = (_b = (_a = window.trustedTypes) === null || _a === void 0 ? void 0 : _a.createPolicy("matomo-next", trustedPolicyHooks)) !== null && _b !== void 0 ? _b : trustedPolicyHooks;
    var scriptElement = document.createElement("script");
    var refElement = document.getElementsByTagName("script")[0];
    if (nonce) {
        scriptElement.setAttribute("nonce", nonce);
    }
    scriptElement.type = "text/javascript";
    scriptElement.async = true;
    scriptElement.defer = true;
    var fullUrl = !tagManagerId
        ? url + "/" + matomoFile
        : matomoCDNUrl + "/" + url.split("//")[1] + "/" + tagManagerId + ".js";
    scriptElement.src = (_d = (_c = sanitizer.createScriptURL) === null || _c === void 0 ? void 0 : _c.call(sanitizer, fullUrl)) !== null && _d !== void 0 ? _d : fullUrl;
    if (refElement.parentNode) {
        refElement.parentNode.insertBefore(scriptElement, refElement);
    }
};
// initialize the tracker
function init(_a) {
    var url = _a.url, siteId = _a.siteId, tagManagerId = _a.tagManagerId, _b = _a.phpTrackerFile, phpTrackerFile = _b === void 0 ? "matomo.php" : _b, _c = _a.excludeUrlsPatterns, excludeUrlsPatterns = _c === void 0 ? [] : _c, _d = _a.disableCookies, disableCookies = _d === void 0 ? false : _d, _e = _a.onRouteChangeStart, onRouteChangeStart = _e === void 0 ? undefined : _e, _f = _a.onRouteChangeComplete, onRouteChangeComplete = _f === void 0 ? undefined : _f, _g = _a.onInitialization, onInitialization = _g === void 0 ? undefined : _g, nonce = _a.nonce;
    if (tagManagerId) {
        window._mtm = window._mtm !== null ? window._mtm : [];
    }
    window._paq = window._paq !== null ? window._paq : [];
    if (!url) {
        console.warn("Matomo disabled, please provide matomo url");
        return;
    }
    var previousPath = "";
    // order is important -_- so campaign are detected
    var excludedUrl = typeof window !== "undefined" &&
        isExcludedUrl(window.location.pathname, excludeUrlsPatterns);
    if (onInitialization)
        onInitialization();
    if (excludedUrl) {
        if (typeof window !== "undefined") {
            console.log("matomo: exclude track " + window.location.pathname);
        }
    }
    else {
        push(["trackPageView"]);
    }
    if (disableCookies) {
        push(["disableCookies"]);
    }
    push(["enableLinkTracking"]);
    push(["setTrackerUrl", url + "/" + phpTrackerFile]);
    push(["setSiteId", siteId]);
    /**
     * for initial loading we use the location.pathname
     * as the first url visited.
     * Once user navigate across the site,
     * we rely on Router.pathname
     */
    createScript(url, nonce);
    if (tagManagerId) {
        createScript(url, nonce, tagManagerId);
    }
    previousPath = location.pathname;
    var defaultOnRouteChangeStart = function (path) {
        if (isExcludedUrl(path, excludeUrlsPatterns))
            return;
        // We use only the part of the url without the querystring to ensure piwik is happy
        // It seems that piwik doesn't track well page with querystring
        var pathname = path.split("?")[0];
        if (previousPath) {
            push(["setReferrerUrl", "" + previousPath]);
        }
        push(["setCustomUrl", pathname]);
        push(["deleteCustomVariables", "page"]);
        previousPath = pathname;
        if (onRouteChangeStart)
            onRouteChangeStart(path);
    };
    router_1.default.events.on("routeChangeStart", defaultOnRouteChangeStart);
    var defaultOnRouteChangeComplete = function (path) {
        if (isExcludedUrl(path, excludeUrlsPatterns)) {
            return;
        }
        // In order to ensure that the page title had been updated,
        // we delayed pushing the tracking to the next tick.
        setTimeout(function () {
            var q = router_1.default.query.q;
            push(["setDocumentTitle", document.title]);
            if (startsWith(path, "/recherche") || startsWith(path, "/search")) {
                push(["trackSiteSearch", q !== null && q !== void 0 ? q : ""]);
            }
            else {
                push(["trackPageView"]);
            }
        }, 0);
        if (tagManagerId) {
            if (!window._mtm) {
                window._mtm = [];
            }
            window._mtm.push({
                "mtm.startTime": new Date().getTime(),
                event: "mtm.Start",
            });
        }
        if (onRouteChangeComplete)
            onRouteChangeComplete(path);
    };
    router_1.default.events.on("routeChangeComplete", defaultOnRouteChangeComplete);
}
exports.init = init;
exports.default = init;
//# sourceMappingURL=index.js.map