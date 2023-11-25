"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = __importDefault(require("next/router"));
var __1 = require("..");
// eslint-disable-next-line @typescript-eslint/init-declarations
var mockRouteChangeComplete;
// eslint-disable-next-line @typescript-eslint/init-declarations
var mockRouteChangeStart;
jest.mock("next/router", function () {
    var query = {};
    return {
        events: {
            emit: function (_event, route) {
                if (/\?/.exec(route) !== null) {
                    var search = route.split("?")[1];
                    // eslint-disable-next-line @typescript-eslint/prefer-includes
                    if (search.indexOf("=") > -1) {
                        var values_1 = JSON.parse("{\"" + decodeURI(search)
                            .replace(/"/g, '\\"')
                            .replace(/&/g, '","')
                            .replace(/=/g, '":"') + "\"}");
                        Object.keys(values_1).forEach(function (key) {
                            query[key] = decodeURIComponent(values_1[key]);
                        });
                    }
                }
                if (_event === "routeChangeStart") {
                    mockRouteChangeStart(route);
                }
                else {
                    mockRouteChangeComplete(route);
                }
                jest.fn();
            },
            on: function (_event, cb) {
                if (_event === "routeChangeStart") {
                    mockRouteChangeStart = cb;
                }
                else {
                    mockRouteChangeComplete = cb;
                }
            },
        },
        query: query,
    };
});
// default window.location.pathname
Object.defineProperty(window, "location", {
    value: {
        pathname: "/",
    },
});
describe("init", function () {
    beforeEach(function () {
        global._paq = [];
    });
    it("should create a js tag and initialize", function () {
        // we need to add a fake script node so
        // init can insert matomo tracker code before it
        document.head.appendChild(document.createElement("script"));
        __1.init({ siteId: "42", url: "https://YO" });
        expect(global._paq).toMatchSnapshot();
    });
    it("should NOT create events when url is not provided", function () {
        // we need to add a fake script node so
        // init can insert matomo tracker code before it
        document.head.appendChild(document.createElement("script"));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        __1.init({ siteId: "42" });
        expect(global._paq).toMatchSnapshot();
    });
});
describe("push", function () {
    test("should append data to window._paq", function () {
        __1.init({ siteId: "42", url: "YO" });
        window._paq = [];
        __1.push(["trackEvent", "kikoo", "lol"]);
        expect(window._paq).toMatchSnapshot();
    });
    test("should append dimensions data to window._paq", function () {
        __1.init({ siteId: "42", url: "YO" });
        window._paq = [];
        __1.push([
            "trackEvent",
            "kikoo",
            "lol",
            null,
            null,
            { dimension1: "ok", dimension2: "foobar" },
        ]);
        expect(window._paq).toMatchSnapshot();
    });
});
describe("onInitialization", function () {
    test("should work if the surcharge of the operator", function () {
        __1.init({
            onInitialization: function () {
                __1.push(["during_initialization", "hello"]);
            },
            siteId: "42",
            url: "YO",
        });
        expect(window._paq).toEqual(expect.arrayContaining([["during_initialization", "hello"]]));
    });
});
describe("router.routeChangeStart event", function () {
    beforeEach(function () {
        global._paq = [];
        jest.resetAllMocks();
    });
    test("should setReferrerUrl and setCustomUrl on route change start", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            __1.init({ siteId: "42", url: "YO" });
            window._paq = [];
            router_1.default.events.emit("routeChangeStart", "/path/to/hello?world");
            return [2 /*return*/, new Promise(function (resolve) {
                    expect(window._paq).toEqual([
                        ["setReferrerUrl", "/"],
                        ["setCustomUrl", "/path/to/hello"],
                        ["deleteCustomVariables", "page"],
                    ]);
                    resolve();
                })];
        });
    }); });
    test("should use previousPath as referer on consecutive route change", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            document.title = "test page 2";
            router_1.default.events.emit("routeChangeStart", "/path/to/hello2?world");
            return [2 /*return*/, new Promise(function (resolve) {
                    expect(window._paq).toEqual([
                        ["setReferrerUrl", "/path/to/hello"],
                        ["setCustomUrl", "/path/to/hello2"],
                        ["deleteCustomVariables", "page"],
                    ]);
                    resolve();
                })];
        });
    }); });
    test("should work if the surcharge of the operator", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            __1.init({
                onRouteChangeStart: function (path) {
                    __1.push(["newOperatorStart", "COMPLETE"]);
                    __1.push(["path", path]);
                },
                siteId: "42",
                url: "YO",
            });
            router_1.default.events.emit("routeChangeStart", "/bonjour");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toEqual(expect.arrayContaining([
                            ["newOperatorStart", "COMPLETE"],
                            ["path", "/bonjour"],
                        ]));
                        resolve();
                    }, 0);
                })];
        });
    }); });
});
describe("router.routeChangeComplete event", function () {
    beforeEach(function () {
        global._paq = [];
        jest.resetAllMocks();
    });
    test("should trackPageView with correct title on route change", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            __1.init({ siteId: "42", url: "YO" });
            window._paq = [];
            document.title = "test page";
            router_1.default.events.emit("routeChangeComplete", "/path/to/hello?world");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
    test("should use previousPath as referer on consecutive route change", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            document.title = "test page 2";
            router_1.default.events.emit("routeChangeComplete", "/path/to/hello2?world");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
    test("should track route as search in /recherche", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            document.title = "search results";
            router_1.default.events.emit("routeChangeComplete", "/recherche?q=some+query");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
    test("should track route as search in /search", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            document.title = "search results";
            router_1.default.events.emit("routeChangeComplete", "/search?q=some+query");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
    test("should work if the surcharge of the operator", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            __1.init({
                onRouteChangeComplete: function (path) {
                    __1.push(["newOperatorComplete", "COMPLETE"]);
                    __1.push(["path", path]);
                },
                siteId: "42",
                url: "YO",
            });
            router_1.default.events.emit("routeChangeComplete", "/hello-world");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toEqual(expect.arrayContaining([
                            ["newOperatorComplete", "COMPLETE"],
                            ["path", "/hello-world"],
                        ]));
                        resolve();
                    }, 0);
                })];
        });
    }); });
});
describe("excludeUrlsPatterns", function () {
    beforeEach(function () {
        global._paq = [];
        document.title = "some page";
        jest.resetAllMocks();
    });
    it("should excluded login.php and token variables", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // we need to add a fake script node so
            // init can insert matomo tracker code before it
            document.head.appendChild(document.createElement("script"));
            __1.init({
                excludeUrlsPatterns: [/^\/login.php/, /\?token=.+/],
                siteId: "42",
                url: "https://YO",
            });
            router_1.default.events.emit("routeChangeStart", "/login.php");
            router_1.default.events.emit("routeChangeStart", "/path/to/page.php");
            router_1.default.events.emit("routeChangeStart", "/path/to/page.php?token=pouet");
            router_1.default.events.emit("routeChangeComplete", "/login.php");
            router_1.default.events.emit("routeChangeComplete", "/path/to/page.php");
            router_1.default.events.emit("routeChangeComplete", "/path/to/page.php?token=pouet");
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
    it("should exclude initial page tracking", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            window.location.pathname = "/change-password-pouet";
            document.head.appendChild(document.createElement("script"));
            __1.init({
                excludeUrlsPatterns: [/^\/change-password/],
                siteId: "42",
                url: "https://YO",
            });
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
    it("should track initial page if not excluded", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            window.location.pathname = "/some-page";
            document.head.appendChild(document.createElement("script"));
            __1.init({
                excludeUrlsPatterns: [/^\/change-password/],
                siteId: "42",
                url: "https://YO",
            });
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        expect(window._paq).toMatchSnapshot();
                        resolve();
                    }, 0);
                })];
        });
    }); });
});
// todo: should track pageview on next router routeChangeComplete
describe("disableCookies", function () {
    test("should NOT append disableCookies to window._paq by default", function () {
        __1.init({ disableCookies: false, siteId: "42", url: "YO" });
        expect(window._paq).not.toEqual(expect.arrayContaining([["disableCookies"]]));
    });
    test("should append disableCookies to window._paq", function () {
        __1.init({ disableCookies: true, siteId: "42", url: "YO" });
        expect(window._paq).toEqual(expect.arrayContaining([["disableCookies"]]));
    });
});
//# sourceMappingURL=matomo.test.js.map