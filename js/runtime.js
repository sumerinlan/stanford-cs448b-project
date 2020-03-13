// @observablehq/runtime v4.7.0 Copyright 2020 Observable, Inc.
function e(e, t, n) { n = n || {}; var r = e.ownerDocument,
        i = r.defaultView.CustomEvent; "function" == typeof i ? i = new i(t, { detail: n }) : ((i = r.createEvent("Event")).initEvent(t, !1, !1), i.detail = n), e.dispatchEvent(i) }

function t(e) { return Array.isArray(e) || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array }

function n(e) { return e === (0 | e) + "" }

function r(e) { const t = document.createElement("span"); return t.className = "observablehq--cellname", t.textContent = `${e} = `, t }
const i = Symbol.prototype.toString;

function o(e) { return i.call(e) }
const { getOwnPropertySymbols: a, prototype: { hasOwnProperty: s } } = Object, { toStringTag: l } = Symbol, u = {}, c = a;

function d(e, t) { return s.call(e, t) }

function f(e) { return e[l] || e.constructor && e.constructor.name || "Object" }

function h(e, t) { try { const n = e[t]; return n && n.constructor, n } catch (e) { return u } }
const p = [{ symbol: "@@__IMMUTABLE_INDEXED__@@", name: "Indexed", modifier: !0 }, { symbol: "@@__IMMUTABLE_KEYED__@@", name: "Keyed", modifier: !0 }, { symbol: "@@__IMMUTABLE_LIST__@@", name: "List", arrayish: !0 }, { symbol: "@@__IMMUTABLE_MAP__@@", name: "Map" }, { symbol: "@@__IMMUTABLE_ORDERED__@@", name: "Ordered", modifier: !0, prefix: !0 }, { symbol: "@@__IMMUTABLE_RECORD__@@", name: "Record" }, { symbol: "@@__IMMUTABLE_SET__@@", name: "Set", arrayish: !0, setish: !0 }, { symbol: "@@__IMMUTABLE_STACK__@@", name: "Stack", arrayish: !0 }];

function m(e) { try { let t = p.filter(({ symbol: t }) => !0 === e[t]); if (!t.length) return; const n = t.find(e => !e.modifier),
            r = "Map" === n.name && t.find(e => e.modifier && e.prefix),
            i = t.some(e => e.arrayish),
            o = t.some(e => e.setish); return { name: `${r?r.name:""}${n.name}`, symbols: t, arrayish: i && !o, setish: o } } catch (e) { return null } }
const { getPrototypeOf: v, getOwnPropertyDescriptors: b } = Object, _ = v({});

function w(n, i, o, a) { let s, l, u, c, d = t(n);
    n instanceof Map ? (s = `Map(${n.size})`, l = g) : n instanceof Set ? (s = `Set(${n.size})`, l = y) : d ? (s = `${n.constructor.name}(${n.length})`, l = E) : (c = m(n)) ? (s = `Immutable.${c.name}${"Record"===c.name?"":`(${n.size})`}`, d = c.arrayish, l = c.arrayish ? C : c.setish ? x : P) : a ? (s = f(n), l = N) : (s = f(n), l = S); const h = document.createElement("span");
    h.className = "observablehq--expanded", o && h.appendChild(r(o)); const p = h.appendChild(document.createElement("a"));
    p.innerHTML = "<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M4 7L0 1h8z' fill='currentColor' />\n  </svg>", p.appendChild(document.createTextNode(`${s}${d?" [":" {"}`)), p.addEventListener("mouseup", function(e) { e.stopPropagation(), se(h, k(n, null, o, a)) }), l = l(n); for (let e = 0; !(u = l.next()).done && e < 20; ++e) h.appendChild(u.value); if (!u.done) { const t = h.appendChild(document.createElement("a"));
        t.className = "observablehq--field", t.style.display = "block", t.appendChild(document.createTextNode("  … more")), t.addEventListener("mouseup", function(t) { t.stopPropagation(), h.insertBefore(u.value, h.lastChild.previousSibling); for (let e = 0; !(u = l.next()).done && e < 19; ++e) h.insertBefore(u.value, h.lastChild.previousSibling);
            u.done && h.removeChild(h.lastChild.previousSibling), e(h, "load") }) } return h.appendChild(document.createTextNode(d ? "]" : "}")), h }

function* g(e) { for (const [t, n] of e) yield $(t, n);
    yield* S(e) }

function* y(e) { for (const t of e) yield L(t);
    yield* S(e) }

function* x(e) { for (const t of e) yield L(t) }

function* E(e) { for (let t = 0, n = e.length; t < n; ++t) t in e && (yield M(t, h(e, t), "observablehq--index")); for (const t in e) !n(t) && d(e, t) && (yield M(t, h(e, t), "observablehq--key")); for (const t of c(e)) yield M(o(t), h(e, t), "observablehq--symbol") }

function* C(e) { let t = 0; for (const n = e.size; t < n; ++t) yield M(t, e.get(t), !0) }

function* N(e) { for (const t in b(e)) yield M(t, h(e, t), "observablehq--key"); for (const t of c(e)) yield M(o(t), h(e, t), "observablehq--symbol"); const t = v(e);
    t && t !== _ && (yield q(t)) }

function* S(e) { for (const t in e) d(e, t) && (yield M(t, h(e, t), "observablehq--key")); for (const t of c(e)) yield M(o(t), h(e, t), "observablehq--symbol"); const t = v(e);
    t && t !== _ && (yield q(t)) }

function* P(e) { for (const [t, n] of e) yield M(t, n, "observablehq--key") }

function q(e) { const t = document.createElement("div"),
        n = t.appendChild(document.createElement("span")); return t.className = "observablehq--field", n.className = "observablehq--prototype-key", n.textContent = "  <prototype>", t.appendChild(document.createTextNode(": ")), t.appendChild(ae(e, void 0, void 0, void 0, !0)), t }

function M(e, t, n) { const r = document.createElement("div"),
        i = r.appendChild(document.createElement("span")); return r.className = "observablehq--field", i.className = n, i.textContent = `  ${e}`, r.appendChild(document.createTextNode(": ")), r.appendChild(ae(t)), r }

function $(e, t) { const n = document.createElement("div"); return n.className = "observablehq--field", n.appendChild(document.createTextNode("  ")), n.appendChild(ae(e)), n.appendChild(document.createTextNode(" => ")), n.appendChild(ae(t)), n }

function L(e) { const t = document.createElement("div"); return t.className = "observablehq--field", t.appendChild(document.createTextNode("  ")), t.appendChild(ae(e)), t }

function j(e) { const t = window.getSelection(); return "Range" === t.type && (t.containsNode(e, !0) || t.anchorNode.isSelfOrDescendant(e) || t.focusNode.isSelfOrDescendant(e)) }

function k(e, n, i, o) { let a, s, l, u, c = t(e); if (e instanceof Map ? (a = `Map(${e.size})`, s = T) : e instanceof Set ? (a = `Set(${e.size})`, s = A) : c ? (a = `${e.constructor.name}(${e.length})`, s = R) : (u = m(e)) ? (a = `Immutable.${u.name}${"Record"===u.name?"":`(${e.size})`}`, c = u.arrayish, s = u.arrayish ? U : u.setish ? O : F) : (a = f(e), s = D), n) { const t = document.createElement("span"); return t.className = "observablehq--shallow", i && t.appendChild(r(i)), t.appendChild(document.createTextNode(a)), t.addEventListener("mouseup", function(n) { j(t) || (n.stopPropagation(), se(t, k(e))) }), t } const d = document.createElement("span");
    d.className = "observablehq--collapsed", i && d.appendChild(r(i)); const h = d.appendChild(document.createElement("a"));
    h.innerHTML = "<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M7 4L1 8V0z' fill='currentColor' />\n  </svg>", h.appendChild(document.createTextNode(`${a}${c?" [":" {"}`)), d.addEventListener("mouseup", function(t) { j(d) || (t.stopPropagation(), se(d, w(e, 0, i, o))) }, !0), s = s(e); for (let e = 0; !(l = s.next()).done && e < 20; ++e) e > 0 && d.appendChild(document.createTextNode(", ")), d.appendChild(l.value); return l.done || d.appendChild(document.createTextNode(", …")), d.appendChild(document.createTextNode(c ? "]" : "}")), d }

function* T(e) { for (const [t, n] of e) yield B(t, n);
    yield* D(e) }

function* A(e) { for (const t of e) yield ae(t, !0);
    yield* D(e) }

function* O(e) { for (const t of e) yield ae(t, !0) }

function* U(e) { let t = -1,
        n = 0; for (const r = e.size; n < r; ++n) n > t + 1 && (yield I(n - t - 1)), yield ae(e.get(n), !0), t = n;
    n > t + 1 && (yield I(n - t - 1)) }

function* R(e) { let t = -1,
        r = 0; for (const n = e.length; r < n; ++r) r in e && (r > t + 1 && (yield I(r - t - 1)), yield ae(h(e, r), !0), t = r);
    r > t + 1 && (yield I(r - t - 1)); for (const t in e) !n(t) && d(e, t) && (yield z(t, h(e, t), "observablehq--key")); for (const t of c(e)) yield z(o(t), h(e, t), "observablehq--symbol") }

function* D(e) { for (const t in e) d(e, t) && (yield z(t, h(e, t), "observablehq--key")); for (const t of c(e)) yield z(o(t), h(e, t), "observablehq--symbol") }

function* F(e) { for (const [t, n] of e) yield z(t, n, "observablehq--key") }

function I(e) { const t = document.createElement("span"); return t.className = "observablehq--empty", t.textContent = 1 === e ? "empty" : `empty × ${e}`, t }

function z(e, t, n) { const r = document.createDocumentFragment(),
        i = r.appendChild(document.createElement("span")); return i.className = n, i.textContent = e, r.appendChild(document.createTextNode(": ")), r.appendChild(ae(t, !0)), r }

function B(e, t) { const n = document.createDocumentFragment(); return n.appendChild(ae(e, !0)), n.appendChild(document.createTextNode(" => ")), n.appendChild(ae(t, !0)), n }

function H(e, t) { var n = e + "",
        r = n.length; return r < t ? new Array(t - r + 1).join(0) + n : n }

function W(e) { return e < 0 ? "-" + H(-e, 6) : e > 9999 ? "+" + H(e, 6) : H(e, 4) }
var V = Error.prototype.toString;
var G = RegExp.prototype.toString;
const K = 20;

function Y(e) { return e.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, J) }

function J(e) { var t = e.charCodeAt(0); switch (t) {
        case 8:
            return "\\b";
        case 9:
            return "\\t";
        case 11:
            return "\\v";
        case 12:
            return "\\f";
        case 13:
            return "\\r" } return t < 16 ? "\\x0" + t.toString(16) : t < 32 ? "\\x" + t.toString(16) : "\\" + e }

function X(e, t) { for (var n = 0; t.exec(e);) ++n; return n }
var Q = Function.prototype.toString,
    Z = { prefix: "async ƒ" },
    ee = { prefix: "async ƒ*" },
    te = { prefix: "class" },
    ne = { prefix: "ƒ" },
    re = { prefix: "ƒ*" };

function ie(e, t, n) { var i = document.createElement("span");
    i.className = "observablehq--function", n && i.appendChild(r(n)); var o = i.appendChild(document.createElement("span")); return o.className = "observablehq--keyword", o.textContent = e.prefix, i.appendChild(document.createTextNode(t)), i }
const { prototype: { toString: oe } } = Object;

function ae(e, t, n, i, a) { let s = typeof e; switch (s) {
        case "boolean":
        case "undefined":
            e += ""; break;
        case "number":
            e = 0 === e && 1 / e < 0 ? "-0" : e + ""; break;
        case "bigint":
            e += "n"; break;
        case "symbol":
            e = o(e); break;
        case "function":
            return function(e, t) { var n, r, i = Q.call(e); switch (e.constructor && e.constructor.name) {
                    case "AsyncFunction":
                        n = Z; break;
                    case "AsyncGeneratorFunction":
                        n = ee; break;
                    case "GeneratorFunction":
                        n = re; break;
                    default:
                        n = /^class\b/.test(i) ? te : ne } return n === te ? ie(n, "", t) : (r = /^(?:async\s*)?(\w+)\s*=>/.exec(i)) ? ie(n, "(" + r[1] + ")", t) : (r = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(i)) ? ie(n, r[1] ? "(" + r[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t) : (r = /^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(i)) ? ie(n, r[1] ? "(" + r[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t) : ie(n, "(…)", t) }(e, i);
        case "string":
            return function(e, t, n, i) { if (!1 === t) { if (X(e, /["\n]/g) <= X(e, /`|\${/g)) { const t = document.createElement("span");
                        i && t.appendChild(r(i)); const n = t.appendChild(document.createElement("span")); return n.className = "observablehq--string", n.textContent = JSON.stringify(e), t } const o = e.split("\n"); if (o.length > K && !n) { const n = document.createElement("div");
                        i && n.appendChild(r(i)); const a = n.appendChild(document.createElement("span"));
                        a.className = "observablehq--string", a.textContent = "`" + Y(o.slice(0, K).join("\n")); const s = n.appendChild(document.createElement("span")),
                            l = o.length - K; return s.textContent = `Show ${l} truncated line${l>1?"s":""}`, s.className = "observablehq--string-expand", s.addEventListener("mouseup", function(r) { r.stopPropagation(), se(n, ae(e, t, !0, i)) }), n } const a = document.createElement("span");
                    i && a.appendChild(r(i)); const s = a.appendChild(document.createElement("span")); return s.className = `observablehq--string${n?" observablehq--expanded":""}`, s.textContent = "`" + Y(e) + "`", a } const o = document.createElement("span");
                i && o.appendChild(r(i)); const a = o.appendChild(document.createElement("span")); return a.className = "observablehq--string", a.textContent = JSON.stringify(e.length > 100 ? `${e.slice(0,50)}…${e.slice(-49)}` : e), o }(e, t, n, i);
        default:
            if (null === e) { s = null, e = "null"; break } if (e instanceof Date) { s = "date", l = e, e = isNaN(l) ? "Invalid Date" : function(e) { return 0 === e.getUTCMilliseconds() && 0 === e.getUTCSeconds() && 0 === e.getUTCMinutes() && 0 === e.getUTCHours() }(l) ? W(l.getUTCFullYear()) + "-" + H(l.getUTCMonth() + 1, 2) + "-" + H(l.getUTCDate(), 2) : W(l.getFullYear()) + "-" + H(l.getMonth() + 1, 2) + "-" + H(l.getDate(), 2) + "T" + H(l.getHours(), 2) + ":" + H(l.getMinutes(), 2) + (l.getMilliseconds() ? ":" + H(l.getSeconds(), 2) + "." + H(l.getMilliseconds(), 3) : l.getSeconds() ? ":" + H(l.getSeconds(), 2) : ""); break } if (e === u) { s = "forbidden", e = "[forbidden]"; break } switch (oe.call(e)) {
                case "[object RegExp]":
                    s = "regexp", e = function(e) { return G.call(e) }(e); break;
                case "[object Error]":
                case "[object DOMException]":
                    s = "error", e = function(e) { return e.stack || V.call(e) }(e); break;
                default:
                    return (n ? w : k)(e, t, i, a) } } var l; const c = document.createElement("span");
    i && c.appendChild(r(i)); const d = c.appendChild(document.createElement("span")); return d.className = `observablehq--${s}`, d.textContent = e, c }

function se(t, n) { t.classList.contains("observablehq--inspect") && n.classList.add("observablehq--inspect"), t.parentNode.replaceChild(n, t), e(n, "load") }
const le = /\s+\(\d+:\d+\)$/m;
class ue { constructor(e) { if (!e) throw new Error("invalid node");
        this._node = e, e.classList.add("observablehq") } pending() { const { _node: e } = this;
        e.classList.remove("observablehq--error"), e.classList.add("observablehq--running") } fulfilled(t, n) { const { _node: r } = this; if ((!(t instanceof Element || t instanceof Text) || t.parentNode && t.parentNode !== r) && (t = ae(t, !1, r.firstChild && r.firstChild.classList && r.firstChild.classList.contains("observablehq--expanded"), n)).classList.add("observablehq--inspect"), r.classList.remove("observablehq--running", "observablehq--error"), r.firstChild !== t)
            if (r.firstChild) { for (; r.lastChild !== r.firstChild;) r.removeChild(r.lastChild);
                r.replaceChild(t, r.firstChild) } else r.appendChild(t);
        e(r, "update") } rejected(t, n) { const { _node: i } = this; for (i.classList.remove("observablehq--running"), i.classList.add("observablehq--error"); i.lastChild;) i.removeChild(i.lastChild); var o = document.createElement("div");
        o.className = "observablehq--inspect", n && o.appendChild(r(n)), o.appendChild(document.createTextNode((t + "").replace(le, ""))), i.appendChild(o), e(i, "error", { error: t }) } } async function ce(e) { const t = await fetch(await e.url()); if (!t.ok) throw new Error(`Unable to load file: ${e.name}`); return t } ue.into = function(e) { if ("string" == typeof e && null == (e = document.querySelector(e))) throw new Error("container not found"); return function() { return new ue(e.appendChild(document.createElement("div"))) } };
class FileAttachment { constructor(e, t) { Object.defineProperties(this, { _url: { value: e }, name: { value: t, enumerable: !0 } }) } async url() { return this._url } async blob() { return (await ce(this)).blob() } async arrayBuffer() { return (await ce(this)).arrayBuffer() } async text() { return (await ce(this)).text() } async json() { return (await ce(this)).json() } async stream() { return (await ce(this)).body } async image() { const e = await this.url(); return new Promise((t, n) => { const r = new Image;
            new URL(e, document.baseURI).origin !== new URL(location).origin && (r.crossOrigin = "anonymous"), r.onload = () => t(r), r.onerror = () => n(new Error(`Unable to load file: ${this.name}`)), r.src = e }) } }

function de(e) { throw new Error(`File not found: ${e}`) }
const fe = new Map,
    he = [],
    pe = he.map,
    me = he.some,
    ve = he.hasOwnProperty,
    be = "https://cdn.jsdelivr.net/npm/",
    _e = /^((?:@[^\/@]+\/)?[^\/@]+)(?:@([^\/]+))?(?:\/(.*))?$/,
    we = /^\d+\.\d+\.\d+(-[\w-.+]+)?$/,
    ge = /\.[^\/]*$/,
    ye = ["unpkg", "jsdelivr", "browser", "main"];
class RequireError extends Error { constructor(e) { super(e) } }

function xe(e) { const t = _e.exec(e); return t && { name: t[1], version: t[2], path: t[3] } }

function Ee(e) { const t = `${be}${e.name}${e.version?`@${e.version}`:""}/package.json`; let n = fe.get(t); return n || fe.set(t, n = fetch(t).then(e => { if (!e.ok) throw new RequireError("unable to load package.json"); return e.redirected && !fe.has(e.url) && fe.set(e.url, n), e.json() })), n } RequireError.prototype.name = RequireError.name;
var Ce = Ne(async function(e, t) { if (e.startsWith(be) && (e = e.substring(be.length)), /^(\w+:)|\/\//i.test(e)) return e; if (/^[.]{0,2}\//i.test(e)) return new URL(e, null == t ? location : t).href; if (!e.length || /^[\s._]/.test(e) || /\s$/.test(e)) throw new RequireError("illegal name"); const n = xe(e); if (!n) return `${be}${e}`; if (!n.version && null != t && t.startsWith(be)) { const e = await Ee(xe(t.substring(be.length)));
        n.version = e.dependencies && e.dependencies[n.name] || e.peerDependencies && e.peerDependencies[n.name] } if (n.path && !ge.test(n.path) && (n.path += ".js"), n.path && n.version && we.test(n.version)) return `${be}${n.name}@${n.version}/${n.path}`; const r = await Ee(n); return `${be}${r.name}@${r.version}/${n.path||function(e){for(const t of ye){const n=e[t];if("string"==typeof n)return ge.test(n)?n:`${n}.js`}}(r)||"index.js"}` });

function Ne(e) { const t = new Map,
        n = i(null);

    function r(e) { if ("string" != typeof e) return e; let n = t.get(e); return n || t.set(e, n = new Promise((t, n) => { const r = document.createElement("script");
            r.onload = () => { try { t(he.pop()(i(e))) } catch (e) { n(new RequireError("invalid module")) } r.remove() }, r.onerror = () => { n(new RequireError("unable to load module")), r.remove() }, r.async = !0, r.src = e, window.define = Me, document.head.appendChild(r) })), n }

    function i(t) { return n => Promise.resolve(e(n, t)).then(r) }

    function o(e) { return arguments.length > 1 ? Promise.all(pe.call(arguments, n)).then(Se) : n(e) } return o.alias = function(t) { return Ne((n, r) => n in t && (r = null, "string" != typeof(n = t[n])) ? n : e(n, r)) }, o.resolve = e, o }

function Se(e) { const t = {}; for (const n of e)
        for (const e in n) ve.call(n, e) && (null == n[e] ? Object.defineProperty(t, e, { get: Pe(n, e) }) : t[e] = n[e]); return t }

function Pe(e, t) { return () => e[t] }

function qe(e) { return "exports" === (e += "") || "module" === e }

function Me(e, t, n) { const r = arguments.length;
    r < 2 ? (n = e, t = []) : r < 3 && (n = t, t = "string" == typeof e ? [] : e), he.push(me.call(t, qe) ? e => { const r = {},
            i = { exports: r }; return Promise.all(pe.call(t, t => "exports" === (t += "") ? r : "module" === t ? i : e(t))).then(e => (n.apply(null, e), i.exports)) } : e => Promise.all(pe.call(t, e)).then(e => "function" == typeof n ? n.apply(null, e) : n)) }

function $e(e) { return function() { return e } } Me.amd = {};
var Le = { math: "http://www.w3.org/1998/Math/MathML", svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/" };
var je = 0;

function ke(e) { this.id = e, this.href = new URL(`#${e}`, location) + "" } ke.prototype.toString = function() { return "url(" + this.href + ")" };
var Te = { canvas: function(e, t) { var n = document.createElement("canvas"); return n.width = e, n.height = t, n }, context2d: function(e, t, n) { null == n && (n = devicePixelRatio); var r = document.createElement("canvas");
        r.width = e * n, r.height = t * n, r.style.width = e + "px"; var i = r.getContext("2d"); return i.scale(n, n), i }, download: function(e, t = "untitled", n = "Save") { const r = document.createElement("a"),
            i = r.appendChild(document.createElement("button"));
        async function o() { await new Promise(requestAnimationFrame), URL.revokeObjectURL(r.href), r.removeAttribute("href"), i.textContent = n, i.disabled = !1 }
        return i.textContent = n, r.download = t, r.onclick = async t => { if (i.disabled = !0, r.href) return o();
            i.textContent = "Saving…"; try { const t = await ("function" == typeof e ? e() : e);
                i.textContent = "Download", r.href = URL.createObjectURL(t) } catch (e) { i.textContent = n } if (t.eventPhase) return o();
            i.disabled = !1 }, r }, element: function(e, t) { var n, r = e += "",
            i = r.indexOf(":");
        i >= 0 && "xmlns" !== (r = e.slice(0, i)) && (e = e.slice(i + 1)); var o = Le.hasOwnProperty(r) ? document.createElementNS(Le[r], e) : document.createElement(e); if (t)
            for (var a in t) i = (r = a).indexOf(":"), n = t[a], i >= 0 && "xmlns" !== (r = a.slice(0, i)) && (a = a.slice(i + 1)), Le.hasOwnProperty(r) ? o.setAttributeNS(Le[r], a, n) : o.setAttribute(a, n); return o }, input: function(e) { var t = document.createElement("input"); return null != e && (t.type = e), t }, range: function(e, t, n) { 1 === arguments.length && (t = e, e = null); var r = document.createElement("input"); return r.min = e = null == e ? 0 : +e, r.max = t = null == t ? 1 : +t, r.step = null == n ? "any" : n = +n, r.type = "range", r }, select: function(e) { var t = document.createElement("select"); return Array.prototype.forEach.call(e, function(e) { var n = document.createElement("option");
            n.value = n.textContent = e, t.appendChild(n) }), t }, svg: function(e, t) { var n = document.createElementNS("http://www.w3.org/2000/svg", "svg"); return n.setAttribute("viewBox", [0, 0, e, t]), n.setAttribute("width", e), n.setAttribute("height", t), n }, text: function(e) { return document.createTextNode(e) }, uid: function(e) { return new ke("O-" + (null == e ? "" : e + "-") + ++je) } };
var Ae = { buffer: function(e) { return new Promise(function(t, n) { var r = new FileReader;
            r.onload = function() { t(r.result) }, r.onerror = n, r.readAsArrayBuffer(e) }) }, text: function(e) { return new Promise(function(t, n) { var r = new FileReader;
            r.onload = function() { t(r.result) }, r.onerror = n, r.readAsText(e) }) }, url: function(e) { return new Promise(function(t, n) { var r = new FileReader;
            r.onload = function() { t(r.result) }, r.onerror = n, r.readAsDataURL(e) }) } };

function Oe() { return this }

function Ue(e, t) { let n = !1; return {
        [Symbol.iterator]: Oe, next: () => n ? { done: !0 } : (n = !0, { done: !1, value: e }), return: () => (n = !0, t(e), { done: !0 }), throw: () => ({ done: n = !0 }) } }

function Re(e) { let t, n, r = !1; const i = e(function(e) { n ? (n(e), n = null) : r = !0; return t = e }); return {
        [Symbol.iterator]: Oe, throw: () => ({ done: !0 }), return: () => (null != i && i(), { done: !0 }), next: function() { return { done: !1, value: r ? (r = !1, Promise.resolve(t)) : new Promise(e => n = e) } } } }

function De(e) { switch (e.type) {
        case "range":
        case "number":
            return e.valueAsNumber;
        case "date":
            return e.valueAsDate;
        case "checkbox":
            return e.checked;
        case "file":
            return e.multiple ? e.files : e.files[0];
        default:
            return e.value } }
var Fe = { disposable: Ue, filter: function*(e, t) { for (var n, r = -1; !(n = e.next()).done;) t(n.value, ++r) && (yield n.value) }, input: function(e) { return Re(function(t) { var n = function(e) { switch (e.type) {
                        case "button":
                        case "submit":
                        case "checkbox":
                            return "click";
                        case "file":
                            return "change";
                        default:
                            return "input" } }(e),
                r = De(e);

            function i() { t(De(e)) } return e.addEventListener(n, i), void 0 !== r && t(r),
                function() { e.removeEventListener(n, i) } }) }, map: function*(e, t) { for (var n, r = -1; !(n = e.next()).done;) yield t(n.value, ++r) }, observe: Re, queue: function(e) { let t; const n = [],
            r = e(function(e) { n.push(e), t && (t(n.shift()), t = null); return e }); return {
            [Symbol.iterator]: Oe, throw: () => ({ done: !0 }), return: () => (null != r && r(), { done: !0 }), next: function() { return { done: !1, value: n.length ? Promise.resolve(n.shift()) : new Promise(e => t = e) } } } }, range: function*(e, t, n) { e = +e, t = +t, n = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +n; for (var r = -1, i = 0 | Math.max(0, Math.ceil((t - e) / n)); ++r < i;) yield e + r * n }, valueAt: function(e, t) { if (!(!isFinite(t = +t) || t < 0 || t != t | 0))
            for (var n, r = -1; !(n = e.next()).done;)
                if (++r === t) return n.value }, worker: function(e) { const t = URL.createObjectURL(new Blob([e], { type: "text/javascript" })),
            n = new Worker(t); return Ue(n, () => { n.terminate(), URL.revokeObjectURL(t) }) } };

function Ie(e, t) { return function(n) { var r, i, o, a, s, l, u, c, d = n[0],
            f = [],
            h = null,
            p = -1; for (s = 1, l = arguments.length; s < l; ++s) { if ((r = arguments[s]) instanceof Node) f[++p] = r, d += "\x3c!--o:" + p + "--\x3e";
            else if (Array.isArray(r)) { for (u = 0, c = r.length; u < c; ++u)(i = r[u]) instanceof Node ? (null === h && (f[++p] = h = document.createDocumentFragment(), d += "\x3c!--o:" + p + "--\x3e"), h.appendChild(i)) : (h = null, d += i);
                h = null } else d += r;
            d += n[s] } if (h = e(d), ++p > 0) { for (o = new Array(p), a = document.createTreeWalker(h, NodeFilter.SHOW_COMMENT, null, !1); a.nextNode();) i = a.currentNode, /^o:/.test(i.nodeValue) && (o[+i.nodeValue.slice(2)] = i); for (s = 0; s < p; ++s)(i = o[s]) && i.parentNode.replaceChild(f[s], i) } return 1 === h.childNodes.length ? h.removeChild(h.firstChild) : 11 === h.nodeType ? ((i = t()).appendChild(h), i) : h } }
var ze = Ie(function(e) { var t = document.createElement("template"); return t.innerHTML = e.trim(), document.importNode(t.content, !0) }, function() { return document.createElement("span") });
const Be = "https://cdn.jsdelivr.net/npm/@observablehq/highlight.js@2.0.0/";

function He(e) { return function() { return e("marked@0.3.12/marked.min.js").then(function(t) { return Ie(function(n) { var r = document.createElement("div");
                r.innerHTML = t(n, { langPrefix: "" }).trim(); var i = r.querySelectorAll("pre code[class]"); return i.length > 0 && e(Be + "highlight.min.js").then(function(t) { i.forEach(function(n) {
                        function r() { t.highlightBlock(n), n.parentNode.classList.add("observablehq--md-pre") } t.getLanguage(n.className) ? r() : e(Be + "async-languages/index.js").then(r => { if (r.has(n.className)) return e(Be + "async-languages/" + r.get(n.className)).then(e => { t.registerLanguage(n.className, e) }) }).then(r, r) }) }), r }, function() { return document.createElement("div") }) }) } }

function We(e) { let t;
    Object.defineProperties(this, { generator: { value: Re(e => void(t = e)) }, value: { get: () => e, set: n => t(e = n) } }), void 0 !== e && t(e) }

function* Ve() { for (;;) yield Date.now() }
var Ge = new Map;

function Ke(e, t) { var n; return (n = Ge.get(e = +e)) ? n.then($e(t)) : (n = Date.now()) >= e ? Promise.resolve(t) : function(e, t) { var n = new Promise(function(n) { Ge.delete(t); var r = t - e; if (!(r > 0)) throw new Error("invalid time"); if (r > 2147483647) throw new Error("too long to wait");
            setTimeout(n, r) }); return Ge.set(t, n), n }(n, e).then($e(t)) }
var Ye = { delay: function(e, t) { return new Promise(function(n) { setTimeout(function() { n(t) }, e) }) }, tick: function(e, t) { return Ke(Math.ceil((Date.now() + 1) / e) * e, t) }, when: Ke };

function Je(e, t) { if (/^(\w+:)|\/\//i.test(e)) return e; if (/^[.]{0,2}\//i.test(e)) return new URL(e, null == t ? location : t).href; if (!e.length || /^[\s._]/.test(e) || /\s$/.test(e)) throw new Error("illegal name"); return "https://unpkg.com/" + e }

function Xe(e) { return null == e ? Ce : Ne(e) }
var Qe = Ie(function(e) { var t = document.createElementNS("http://www.w3.org/2000/svg", "g"); return t.innerHTML = e.trim(), t }, function() { return document.createElementNS("http://www.w3.org/2000/svg", "g") }),
    Ze = String.raw;

function et(e) { return new Promise(function(t, n) { var r = document.createElement("link");
        r.rel = "stylesheet", r.href = e, r.onerror = n, r.onload = t, document.head.appendChild(r) }) }

function tt(e) { return function() { return Promise.all([e("@observablehq/katex@0.11.1/dist/katex.min.js"), e.resolve("@observablehq/katex@0.11.1/dist/katex.min.css").then(et)]).then(function(e) { var t = e[0],
                n = r();

            function r(e) { return function() { var n = document.createElement("div"); return t.render(Ze.apply(String, arguments), n, e), n.removeChild(n.firstChild) } } return n.options = r, n.block = r({ displayMode: !0 }), n }) } }

function nt() { return Re(function(e) { var t = e(document.body.clientWidth);

        function n() { var n = document.body.clientWidth;
            n !== t && e(t = n) } return window.addEventListener("resize", n),
            function() { window.removeEventListener("resize", n) } }) }
var rt = Object.assign(function(e) { const t = Xe(e);
    Object.defineProperties(this, { DOM: { value: Te, writable: !0, enumerable: !0 }, FileAttachment: { value: $e(de), writable: !0, enumerable: !0 }, Files: { value: Ae, writable: !0, enumerable: !0 }, Generators: { value: Fe, writable: !0, enumerable: !0 }, html: { value: $e(ze), writable: !0, enumerable: !0 }, md: { value: He(t), writable: !0, enumerable: !0 }, Mutable: { value: $e(We), writable: !0, enumerable: !0 }, now: { value: Ve, writable: !0, enumerable: !0 }, Promises: { value: Ye, writable: !0, enumerable: !0 }, require: { value: $e(t), writable: !0, enumerable: !0 }, resolve: { value: $e(Je), writable: !0, enumerable: !0 }, svg: { value: $e(Qe), writable: !0, enumerable: !0 }, tex: { value: tt(t), writable: !0, enumerable: !0 }, width: { value: nt, writable: !0, enumerable: !0 } }) }, { resolve: Ce.resolve });

function it(e, t) { this.message = e + "", this.input = t } it.prototype = Object.create(Error.prototype), it.prototype.name = "RuntimeError", it.prototype.constructor = it;
var ot = Array.prototype,
    at = ot.map,
    st = ot.forEach;

function lt(e) { return function() { return e } }

function ut(e) { return e }

function ct() {}
var dt = 1,
    ft = 2,
    ht = 3,
    pt = {};

function mt(e, t, n) { var r;
    null == n && (n = pt), Object.defineProperties(this, { _observer: { value: n, writable: !0 }, _definition: { value: _t, writable: !0 }, _duplicate: { value: void 0, writable: !0 }, _duplicates: { value: void 0, writable: !0 }, _indegree: { value: NaN, writable: !0 }, _inputs: { value: [], writable: !0 }, _invalidate: { value: ct, writable: !0 }, _module: { value: t }, _name: { value: null, writable: !0 }, _outputs: { value: new Set, writable: !0 }, _promise: { value: Promise.resolve(void 0), writable: !0 }, _reachable: { value: n !== pt, writable: !0 }, _rejector: { value: (r = this, function(e) { if (e === _t) throw new it(r._name + " is not defined", r._name); throw new it(r._name + " could not be resolved", r._name) }) }, _type: { value: e }, _value: { value: void 0, writable: !0 }, _version: { value: 0, writable: !0 } }) }

function vt(e) { e._module._runtime._dirty.add(e), e._outputs.add(this) }

function bt(e) { e._module._runtime._dirty.add(e), e._outputs.delete(this) }

function _t() { throw _t }

function wt(e) { return function() { throw new it(e + " is defined more than once") } }

function gt(e, t, n) { var r = this._module._scope,
        i = this._module._runtime; if (this._inputs.forEach(bt, this), t.forEach(vt, this), this._inputs = t, this._definition = n, this._value = void 0, n === ct ? i._variables.delete(this) : i._variables.add(this), e == this._name && r.get(e) === this) this._outputs.forEach(i._updates.add, i._updates);
    else { var o, a; if (this._name)
            if (this._outputs.size) r.delete(this._name), (a = this._module._resolve(this._name))._outputs = this._outputs, this._outputs = new Set, a._outputs.forEach(function(e) { e._inputs[e._inputs.indexOf(this)] = a }, this), a._outputs.forEach(i._updates.add, i._updates), i._dirty.add(a).add(this), r.set(this._name, a);
            else if ((a = r.get(this._name)) === this) r.delete(this._name);
        else { if (a._type !== ht) throw new Error;
            a._duplicates.delete(this), this._duplicate = void 0, 1 === a._duplicates.size && (a = a._duplicates.keys().next().value, o = r.get(this._name), a._outputs = o._outputs, o._outputs = new Set, a._outputs.forEach(function(e) { e._inputs[e._inputs.indexOf(o)] = a }), a._definition = a._duplicate, a._duplicate = void 0, i._dirty.add(o).add(a), i._updates.add(a), r.set(this._name, a)) } if (this._outputs.size) throw new Error;
        e && ((a = r.get(e)) ? a._type === ht ? (this._definition = wt(e), this._duplicate = n, a._duplicates.add(this)) : a._type === ft ? (this._outputs = a._outputs, a._outputs = new Set, this._outputs.forEach(function(e) { e._inputs[e._inputs.indexOf(a)] = this }, this), i._dirty.add(a).add(this), r.set(e, this)) : (a._duplicate = a._definition, this._duplicate = n, (o = new mt(ht, this._module))._name = e, o._definition = this._definition = a._definition = wt(e), o._outputs = a._outputs, a._outputs = new Set, o._outputs.forEach(function(e) { e._inputs[e._inputs.indexOf(a)] = o }), o._duplicates = new Set([this, a]), i._dirty.add(a).add(o), i._updates.add(a).add(o), r.set(e, o)) : r.set(e, this)), this._name = e } return i._updates.add(this), i._compute(), this }

function yt(e, t = []) { Object.defineProperties(this, { _runtime: { value: e }, _scope: { value: new Map }, _builtins: { value: new Map([
                ["invalidation", Ct],
                ["visibility", Nt], ...t
            ]) }, _source: { value: null, writable: !0 } }) }

function xt(e) { return e._name } Object.defineProperties(mt.prototype, { _pending: { value: function() { this._observer.pending && this._observer.pending() }, writable: !0, configurable: !0 }, _fulfilled: { value: function(e) { this._observer.fulfilled && this._observer.fulfilled(e, this._name) }, writable: !0, configurable: !0 }, _rejected: { value: function(e) { this._observer.rejected && this._observer.rejected(e, this._name) }, writable: !0, configurable: !0 }, define: { value: function(e, t, n) { switch (arguments.length) {
                case 1:
                    n = e, e = t = null; break;
                case 2:
                    n = t, "string" == typeof e ? t = null : (t = e, e = null) } return gt.call(this, null == e ? null : e + "", null == t ? [] : at.call(t, this._module._resolve, this._module), "function" == typeof n ? n : lt(n)) }, writable: !0, configurable: !0 }, delete: { value: function() { return gt.call(this, null, [], ct) }, writable: !0, configurable: !0 }, import: { value: function(e, t, n) { arguments.length < 3 && (n = t, t = e); return gt.call(this, t + "", [n._resolve(e + "")], ut) }, writable: !0, configurable: !0 } }), Object.defineProperties(yt.prototype, { _copy: { value: function(e, t) { e._source = this, t.set(this, e); for (const [o, a] of this._scope) { var n = e._scope.get(o); if (!n || n._type !== dt)
                    if (a._definition === ut) { var r = a._inputs[0],
                            i = r._module;
                        e.import(r._name, o, t.get(i) || (i._source ? i._copy(new yt(e._runtime, e._builtins), t) : i)) } else e.define(o, a._inputs.map(xt), a._definition) } return e }, writable: !0, configurable: !0 }, _resolve: { value: function(e) { var t, n = this._scope.get(e); if (!n)
                if (n = new mt(ft, this), this._builtins.has(e)) n.define(e, lt(this._builtins.get(e)));
                else if (this._runtime._builtin._scope.has(e)) n.import(e, this._runtime._builtin);
            else { try { t = this._runtime._global(e) } catch (t) { return n.define(e, (r = t, function() { throw r })) } void 0 === t ? this._scope.set(n._name = e, n) : n.define(e, lt(t)) } var r; return n }, writable: !0, configurable: !0 }, redefine: { value: function(e) { var t = this._scope.get(e); if (!t) throw new it(e + " is not defined"); if (t._type === ht) throw new it(e + " is defined more than once"); return t.define.apply(t, arguments) }, writable: !0, configurable: !0 }, define: { value: function() { var e = new mt(dt, this); return e.define.apply(e, arguments) }, writable: !0, configurable: !0 }, derive: { value: function(e, t) { var n = new yt(this._runtime, this._builtins); return n._source = this, st.call(e, function(e) { "object" != typeof e && (e = { name: e + "" }), null == e.alias && (e.alias = e.name), n.import(e.name, e.alias, t) }), Promise.resolve().then(() => { const e = new Set([this]); for (const t of e)
                    for (const n of t._scope.values())
                        if (n._definition === ut) { const t = n._inputs[0]._module,
                                r = t._source || t; if (r === this) return void console.warn("circular module definition; ignoring");
                            e.add(r) } this._copy(n, new Map) }), n }, writable: !0, configurable: !0 }, import: { value: function() { var e = new mt(dt, this); return e.import.apply(e, arguments) }, writable: !0, configurable: !0 }, value: { value: async function(e) { var t = this._scope.get(e); if (!t) throw new it(e + " is not defined");
            t._observer === pt && (t._observer = !0, this._runtime._dirty.add(t)); return await this._runtime._compute(), t._promise }, writable: !0, configurable: !0 }, variable: { value: function(e) { return new mt(dt, this, e) }, writable: !0, configurable: !0 }, builtin: { value: function(e, t) { this._builtins.set(e, t) }, writable: !0, configurable: !0 } });
const Et = "function" == typeof requestAnimationFrame ? requestAnimationFrame : setImmediate;
var Ct = {},
    Nt = {};

function St(e = new rt, t = function(e) { return window[e] }) { var n = this.module(); if (Object.defineProperties(this, { _dirty: { value: new Set }, _updates: { value: new Set }, _computing: { value: null, writable: !0 }, _init: { value: null, writable: !0 }, _modules: { value: new Map }, _variables: { value: new Set }, _disposed: { value: !1, writable: !0 }, _builtin: { value: n }, _global: { value: t } }), e)
        for (var r in e) new mt(ft, n).define(r, [], e[r]) }

function Pt(e) { const t = new Set(e._inputs); for (const n of t) { if (n === e) return !0;
        n._inputs.forEach(t.add, t) } return !1 }

function qt(e) {++e._indegree }

function Mt(e) {--e._indegree }

function $t(e) { return e._promise.catch(e._rejector) }

function Lt(e) { return new Promise(function(t) { e._invalidate = t }) }

function jt(e, t) { let n, r, i = "function" == typeof IntersectionObserver && t._observer && t._observer._node,
        o = !i,
        a = ct,
        s = ct; return i && ((r = new IntersectionObserver(([e]) => (o = e.isIntersecting) && (n = null, a()))).observe(i), e.then(() => (r.disconnect(), r = null, s()))),
        function(e) { return o ? Promise.resolve(e) : r ? (n || (n = new Promise((e, t) => (a = e, s = t))), n.then(() => e)) : Promise.reject() } }

function kt(e) { e._invalidate(), e._invalidate = ct, e._pending(); var t = e._value,
        n = ++e._version,
        r = null,
        i = e._promise = Promise.all(e._inputs.map($t)).then(function(i) { if (e._version === n) { for (var o = 0, a = i.length; o < a; ++o) switch (i[o]) {
                    case Ct:
                        i[o] = r = Lt(e); break;
                    case Nt:
                        r || (r = Lt(e)), i[o] = jt(r, e) }
                return e._definition.apply(t, i) } }).then(function(t) { return function(e) { return e && "function" == typeof e.next && "function" == typeof e.return }(t) ? e._version !== n ? void t.return() : ((r || Lt(e)).then((o = t, function() { o.return() })), function(e, t, n, r) {
                function i() { var n = new Promise(function(e) { e(r.next()) }).then(function(r) { return r.done ? void 0 : Promise.resolve(r.value).then(function(r) { if (e._version === t) return Tt(e, r, n).then(i), e._fulfilled(r), r }) });
                    n.catch(function(r) { e._version === t && (Tt(e, void 0, n), e._rejected(r)) }) } return new Promise(function(e) { e(r.next()) }).then(function(e) { if (!e.done) return n.then(i), e.value }) }(e, n, i, t)) : t; var o });
    i.then(function(t) { e._version === n && (e._value = t, e._fulfilled(t)) }, function(t) { e._version === n && (e._value = void 0, e._rejected(t)) }) }

function Tt(e, t, n) { var r = e._module._runtime; return e._value = t, e._promise = n, e._outputs.forEach(r._updates.add, r._updates), r._compute() }

function At(e, t) { e._invalidate(), e._invalidate = ct, e._pending(), ++e._version, e._indegree = NaN, (e._promise = Promise.reject(t)).catch(ct), e._value = void 0, e._rejected(t) } Object.defineProperties(St, { load: { value: function(e, t, n) { if ("function" == typeof t && (n = t, t = null), "function" != typeof n) throw new Error("invalid observer");
            null == t && (t = new rt); const { modules: r, id: i } = e, o = new Map, a = new St(t), s = l(i);

            function l(e) { let t = o.get(e); return t || o.set(e, t = a.module()), t } for (const e of r) { const t = l(e.id); let r = 0; for (const i of e.variables) i.from ? t.import(i.remote, i.name, l(i.from)) : t === s ? t.variable(n(i, r, e.variables)).define(i.name, i.inputs, i.value) : t.define(i.name, i.inputs, i.value), ++r } return a }, writable: !0, configurable: !0 } }), Object.defineProperties(St.prototype, { _compute: { value: function() { return this._computing || (this._computing = this._computeSoon()) }, writable: !0, configurable: !0 }, _computeSoon: { value: function() { var e = this; return new Promise(function(t) { Et(function() { t(), e._disposed || e._computeNow() }) }) }, writable: !0, configurable: !0 }, _computeNow: { value: function() { var e, t, n = [];
            (e = new Set(this._dirty)).forEach(function(t) { t._inputs.forEach(e.add, e); const n = function(e) { if (e._observer !== pt) return !0; var t = new Set(e._outputs); for (const e of t) { if (e._observer !== pt) return !0;
                        e._outputs.forEach(t.add, t) } return !1 }(t);
                n > t._reachable ? this._updates.add(t) : n < t._reachable && t._invalidate(), t._reachable = n }, this), (e = new Set(this._updates)).forEach(function(t) { t._reachable ? (t._indegree = 0, t._outputs.forEach(e.add, e)) : (t._indegree = NaN, e.delete(t)) }), this._computing = null, this._updates.clear(), this._dirty.clear(), e.forEach(function(e) { e._outputs.forEach(qt) });
            do { for (e.forEach(function(e) { 0 === e._indegree && n.push(e) }); t = n.pop();) kt(t), t._outputs.forEach(r), e.delete(t);
                e.forEach(function(t) { Pt(t) && (At(t, new it("circular definition")), t._outputs.forEach(Mt), e.delete(t)) }) } while (e.size);

            function r(e) { 0 == --e._indegree && n.push(e) } }, writable: !0, configurable: !0 }, dispose: { value: function() { this._computing = Promise.resolve(), this._disposed = !0, this._variables.forEach(e => { e._invalidate(), e._version = NaN }) }, writable: !0, configurable: !0 }, module: { value: function(e, t = ct) { let n; if (void 0 === e) return (n = this._init) ? (this._init = null, n) : new yt(this); if (n = this._modules.get(e)) return n;
            this._init = n = new yt(this), this._modules.set(e, n); try { e(this, t) } finally { this._init = null } return n }, writable: !0, configurable: !0 }, fileAttachments: { value: function(e) { return t => { const n = e(t += ""); if (null == n) throw new Error(`File not found: ${t}`); return new FileAttachment(n, t) } }, writable: !0, configurable: !0 } });
export { ue as Inspector, rt as Library, St as Runtime, it as RuntimeError };