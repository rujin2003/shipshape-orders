"use client";
import {
  require_react_dom
} from "./chunk-7LVE3BO7.js";
import {
  __toESM,
  require_react
} from "./chunk-ZCND2HWC.js";

// node_modules/sonner/dist/index.mjs
var import_react = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_react4 = __toESM(require_react(), 1);
var kt = (r) => {
  switch (r) {
    case "success":
      return Vt;
    case "info":
      return Kt;
    case "warning":
      return Ot;
    case "error":
      return Jt;
    default:
      return null;
  }
};
var Ut = Array(12).fill(0);
var Dt = ({ visible: r, className: o }) => import_react2.default.createElement("div", { className: ["sonner-loading-wrapper", o].filter(Boolean).join(" "), "data-visible": r }, import_react2.default.createElement("div", { className: "sonner-spinner" }, Ut.map((t, s) => import_react2.default.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${s}` }))));
var Vt = import_react2.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, import_react2.default.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" }));
var Ot = import_react2.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", height: "20", width: "20" }, import_react2.default.createElement("path", { fillRule: "evenodd", d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z", clipRule: "evenodd" }));
var Kt = import_react2.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, import_react2.default.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" }));
var Jt = import_react2.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, import_react2.default.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" }));
var Ht = import_react2.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }, import_react2.default.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), import_react2.default.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
var At = () => {
  let [r, o] = import_react3.default.useState(document.hidden);
  return import_react3.default.useEffect(() => {
    let t = () => {
      o(document.hidden);
    };
    return document.addEventListener("visibilitychange", t), () => window.removeEventListener("visibilitychange", t);
  }, []), r;
};
var ft = 1;
var mt = class {
  constructor() {
    this.subscribe = (o) => (this.subscribers.push(o), () => {
      let t = this.subscribers.indexOf(o);
      this.subscribers.splice(t, 1);
    });
    this.publish = (o) => {
      this.subscribers.forEach((t) => t(o));
    };
    this.addToast = (o) => {
      this.publish(o), this.toasts = [...this.toasts, o];
    };
    this.create = (o) => {
      var P;
      let { message: t, ...s } = o, g = typeof (o == null ? void 0 : o.id) == "number" || ((P = o.id) == null ? void 0 : P.length) > 0 ? o.id : ft++, l = this.toasts.find((h) => h.id === g), E = o.dismissible === void 0 ? true : o.dismissible;
      return l ? this.toasts = this.toasts.map((h) => h.id === g ? (this.publish({ ...h, ...o, id: g, title: t }), { ...h, ...o, id: g, dismissible: E, title: t }) : h) : this.addToast({ title: t, ...s, dismissible: E, id: g }), g;
    };
    this.dismiss = (o) => (o || this.toasts.forEach((t) => {
      this.subscribers.forEach((s) => s({ id: t.id, dismiss: true }));
    }), this.subscribers.forEach((t) => t({ id: o, dismiss: true })), o);
    this.message = (o, t) => this.create({ ...t, message: o });
    this.error = (o, t) => this.create({ ...t, message: o, type: "error" });
    this.success = (o, t) => this.create({ ...t, type: "success", message: o });
    this.info = (o, t) => this.create({ ...t, type: "info", message: o });
    this.warning = (o, t) => this.create({ ...t, type: "warning", message: o });
    this.loading = (o, t) => this.create({ ...t, type: "loading", message: o });
    this.promise = (o, t) => {
      if (!t) return;
      let s;
      t.loading !== void 0 && (s = this.create({ ...t, promise: o, type: "loading", message: t.loading, description: typeof t.description != "function" ? t.description : void 0 }));
      let g = o instanceof Promise ? o : o(), l = s !== void 0, E, P = g.then(async (c) => {
        if (E = ["resolve", c], import_react4.default.isValidElement(c)) l = false, this.create({ id: s, type: "default", message: c });
        else if (Qt(c) && !c.ok) {
          l = false;
          let k = typeof t.error == "function" ? await t.error(`HTTP error! status: ${c.status}`) : t.error, j = typeof t.description == "function" ? await t.description(`HTTP error! status: ${c.status}`) : t.description;
          this.create({ id: s, type: "error", message: k, description: j });
        } else if (t.success !== void 0) {
          l = false;
          let k = typeof t.success == "function" ? await t.success(c) : t.success, j = typeof t.description == "function" ? await t.description(c) : t.description;
          this.create({ id: s, type: "success", message: k, description: j });
        }
      }).catch(async (c) => {
        if (E = ["reject", c], t.error !== void 0) {
          l = false;
          let y = typeof t.error == "function" ? await t.error(c) : t.error, k = typeof t.description == "function" ? await t.description(c) : t.description;
          this.create({ id: s, type: "error", message: y, description: k });
        }
      }).finally(() => {
        var c;
        l && (this.dismiss(s), s = void 0), (c = t.finally) == null || c.call(t);
      }), h = () => new Promise((c, y) => P.then(() => E[0] === "reject" ? y(E[1]) : c(E[1])).catch(y));
      return typeof s != "string" && typeof s != "number" ? { unwrap: h } : Object.assign(s, { unwrap: h });
    };
    this.custom = (o, t) => {
      let s = (t == null ? void 0 : t.id) || ft++;
      return this.create({ jsx: o(s), id: s, ...t }), s;
    };
    this.subscribers = [], this.toasts = [];
  }
};
var T = new mt();
var Gt = (r, o) => {
  let t = (o == null ? void 0 : o.id) || ft++;
  return T.addToast({ title: r, ...o, id: t }), t;
};
var Qt = (r) => r && typeof r == "object" && "ok" in r && typeof r.ok == "boolean" && "status" in r && typeof r.status == "number";
var qt = Gt;
var Zt = () => T.toasts;
var te = Object.assign(qt, { success: T.success, info: T.info, warning: T.warning, error: T.error, custom: T.custom, message: T.message, promise: T.promise, dismiss: T.dismiss, loading: T.loading }, { getHistory: Zt });
function pt(r, { insertAt: o } = {}) {
  if (!r || typeof document == "undefined") return;
  let t = document.head || document.getElementsByTagName("head")[0], s = document.createElement("style");
  s.type = "text/css", o === "top" && t.firstChild ? t.insertBefore(s, t.firstChild) : t.appendChild(s), s.styleSheet ? s.styleSheet.cssText = r : s.appendChild(document.createTextNode(r));
}
pt(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:max(var(--offset),env(safe-area-inset-right))}:where([data-sonner-toaster][data-x-position="left"]){left:max(var(--offset),env(safe-area-inset-left))}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:max(var(--offset),env(safe-area-inset-top))}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:max(var(--offset),env(safe-area-inset-bottom))}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:0;right:0;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation:swipe-out .2s ease-out forwards}@keyframes swipe-out{0%{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));opacity:1}to{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;--mobile-offset: 16px;right:var(--mobile-offset);left:var(--mobile-offset);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset)}[data-sonner-toaster][data-y-position=bottom]{bottom:20px}[data-sonner-toaster][data-y-position=top]{top:20px}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset);right:var(--mobile-offset);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);
function V(r) {
  return r.label !== void 0;
}
var ae = 3;
var ne = "32px";
var Lt = 4e3;
var se = 356;
var re = 14;
var ie = 20;
var le = 200;
function de(...r) {
  return r.filter(Boolean).join(" ");
}
var ce = (r) => {
  var xt, vt, wt, Tt, Rt, St, Et, Nt, Pt, Ct, Bt;
  let { invert: o, toast: t, unstyled: s, interacting: g, setHeights: l, visibleToasts: E, heights: P, index: h, toasts: c, expanded: y, removeToast: k, defaultRichColors: j, closeButton: O, style: st, cancelButtonStyle: i, actionButtonStyle: K, className: J = "", descriptionClassName: rt = "", duration: _, position: it, gap: lt, loadingIcon: X, expandByDefault: C, classNames: a, icons: N, closeButtonAriaLabel: G = "Close toast", pauseWhenPageIsHidden: Q, cn: R } = r, [B, q] = import_react.default.useState(false), [U, dt] = import_react.default.useState(false), [M, A] = import_react.default.useState(false), [Z, L] = import_react.default.useState(false), [Y, tt] = import_react.default.useState(false), [d, u] = import_react.default.useState(0), [b, w] = import_react.default.useState(0), D = import_react.default.useRef(t.duration || _ || Lt), f = import_react.default.useRef(null), H = import_react.default.useRef(null), et = h === 0, ot = h + 1 <= E, x = t.type, F = t.dismissible !== false, jt = t.className || "", Yt = t.descriptionClassName || "", at = import_react.default.useMemo(() => P.findIndex((n) => n.toastId === t.id) || 0, [P, t.id]), Ft = import_react.default.useMemo(() => {
    var n;
    return (n = t.closeButton) != null ? n : O;
  }, [t.closeButton, O]), ue = import_react.default.useMemo(() => t.duration || _ || Lt, [t.duration, _]), ct = import_react.default.useRef(0), $ = import_react.default.useRef(0), gt = import_react.default.useRef(0), nt = import_react.default.useRef(null), [ht, $t] = it.split("-"), bt = import_react.default.useMemo(() => P.reduce((n, m, p) => p >= at ? n : n + m.height, 0), [P, at]), yt = At(), Wt = t.invert || o, ut = x === "loading";
  $.current = import_react.default.useMemo(() => at * lt + bt, [at, bt]), import_react.default.useEffect(() => {
    q(true);
  }, []), import_react.default.useEffect(() => {
    let n = H.current;
    if (n) {
      let m = n.getBoundingClientRect().height;
      return w(m), l((p) => [{ toastId: t.id, height: m, position: t.position }, ...p]), () => l((p) => p.filter((v) => v.toastId !== t.id));
    }
  }, [l, t.id]), import_react.default.useLayoutEffect(() => {
    if (!B) return;
    let n = H.current, m = n.style.height;
    n.style.height = "auto";
    let p = n.getBoundingClientRect().height;
    n.style.height = m, w(p), l((v) => v.find((I) => I.toastId === t.id) ? v.map((I) => I.toastId === t.id ? { ...I, height: p } : I) : [{ toastId: t.id, height: p, position: t.position }, ...v]);
  }, [B, t.title, t.description, l, t.id]);
  let z = import_react.default.useCallback(() => {
    dt(true), u($.current), l((n) => n.filter((m) => m.toastId !== t.id)), setTimeout(() => {
      k(t);
    }, le);
  }, [t, k, l, $]);
  import_react.default.useEffect(() => {
    if (t.promise && x === "loading" || t.duration === 1 / 0 || t.type === "loading") return;
    let n;
    return y || g || Q && yt ? (() => {
      if (gt.current < ct.current) {
        let v = (/* @__PURE__ */ new Date()).getTime() - ct.current;
        D.current = D.current - v;
      }
      gt.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      D.current !== 1 / 0 && (ct.current = (/* @__PURE__ */ new Date()).getTime(), n = setTimeout(() => {
        var v;
        (v = t.onAutoClose) == null || v.call(t, t), z();
      }, D.current));
    })(), () => clearTimeout(n);
  }, [y, g, t, x, Q, yt, z]), import_react.default.useEffect(() => {
    t.delete && z();
  }, [z, t.delete]);
  function _t() {
    var n, m, p;
    return N != null && N.loading ? import_react.default.createElement("div", { className: R(a == null ? void 0 : a.loader, (n = t == null ? void 0 : t.classNames) == null ? void 0 : n.loader, "sonner-loader"), "data-visible": x === "loading" }, N.loading) : X ? import_react.default.createElement("div", { className: R(a == null ? void 0 : a.loader, (m = t == null ? void 0 : t.classNames) == null ? void 0 : m.loader, "sonner-loader"), "data-visible": x === "loading" }, X) : import_react.default.createElement(Dt, { className: R(a == null ? void 0 : a.loader, (p = t == null ? void 0 : t.classNames) == null ? void 0 : p.loader), visible: x === "loading" });
  }
  return import_react.default.createElement("li", { tabIndex: 0, ref: H, className: R(J, jt, a == null ? void 0 : a.toast, (xt = t == null ? void 0 : t.classNames) == null ? void 0 : xt.toast, a == null ? void 0 : a.default, a == null ? void 0 : a[x], (vt = t == null ? void 0 : t.classNames) == null ? void 0 : vt[x]), "data-sonner-toast": "", "data-rich-colors": (wt = t.richColors) != null ? wt : j, "data-styled": !(t.jsx || t.unstyled || s), "data-mounted": B, "data-promise": !!t.promise, "data-swiped": Y, "data-removed": U, "data-visible": ot, "data-y-position": ht, "data-x-position": $t, "data-index": h, "data-front": et, "data-swiping": M, "data-dismissible": F, "data-type": x, "data-invert": Wt, "data-swipe-out": Z, "data-expanded": !!(y || C && B), style: { "--index": h, "--toasts-before": h, "--z-index": c.length - h, "--offset": `${U ? d : $.current}px`, "--initial-height": C ? "auto" : `${b}px`, ...st, ...t.style }, onPointerDown: (n) => {
    ut || !F || (f.current = /* @__PURE__ */ new Date(), u($.current), n.target.setPointerCapture(n.pointerId), n.target.tagName !== "BUTTON" && (A(true), nt.current = { x: n.clientX, y: n.clientY }));
  }, onPointerUp: () => {
    var v, W, I, It;
    if (Z || !F) return;
    nt.current = null;
    let n = Number(((v = H.current) == null ? void 0 : v.style.getPropertyValue("--swipe-amount").replace("px", "")) || 0), m = (/* @__PURE__ */ new Date()).getTime() - ((W = f.current) == null ? void 0 : W.getTime()), p = Math.abs(n) / m;
    if (Math.abs(n) >= ie || p > 0.11) {
      u($.current), (I = t.onDismiss) == null || I.call(t, t), z(), L(true), tt(false);
      return;
    }
    (It = H.current) == null || It.style.setProperty("--swipe-amount", "0px"), A(false);
  }, onPointerMove: (n) => {
    var W, I;
    if (!nt.current || !F) return;
    let m = n.clientY - nt.current.y, p = ((W = window.getSelection()) == null ? void 0 : W.toString().length) > 0, v = ht === "top" ? Math.min(0, m) : Math.max(0, m);
    Math.abs(v) > 0 && tt(true), !p && ((I = H.current) == null || I.style.setProperty("--swipe-amount", `${v}px`));
  } }, Ft && !t.jsx ? import_react.default.createElement("button", { "aria-label": G, "data-disabled": ut, "data-close-button": true, onClick: ut || !F ? () => {
  } : () => {
    var n;
    z(), (n = t.onDismiss) == null || n.call(t, t);
  }, className: R(a == null ? void 0 : a.closeButton, (Tt = t == null ? void 0 : t.classNames) == null ? void 0 : Tt.closeButton) }, (Rt = N == null ? void 0 : N.close) != null ? Rt : Ht) : null, t.jsx || import_react.default.isValidElement(t.title) ? t.jsx ? t.jsx : typeof t.title == "function" ? t.title() : t.title : import_react.default.createElement(import_react.default.Fragment, null, x || t.icon || t.promise ? import_react.default.createElement("div", { "data-icon": "", className: R(a == null ? void 0 : a.icon, (St = t == null ? void 0 : t.classNames) == null ? void 0 : St.icon) }, t.promise || t.type === "loading" && !t.icon ? t.icon || _t() : null, t.type !== "loading" ? t.icon || (N == null ? void 0 : N[x]) || kt(x) : null) : null, import_react.default.createElement("div", { "data-content": "", className: R(a == null ? void 0 : a.content, (Et = t == null ? void 0 : t.classNames) == null ? void 0 : Et.content) }, import_react.default.createElement("div", { "data-title": "", className: R(a == null ? void 0 : a.title, (Nt = t == null ? void 0 : t.classNames) == null ? void 0 : Nt.title) }, typeof t.title == "function" ? t.title() : t.title), t.description ? import_react.default.createElement("div", { "data-description": "", className: R(rt, Yt, a == null ? void 0 : a.description, (Pt = t == null ? void 0 : t.classNames) == null ? void 0 : Pt.description) }, typeof t.description == "function" ? t.description() : t.description) : null), import_react.default.isValidElement(t.cancel) ? t.cancel : t.cancel && V(t.cancel) ? import_react.default.createElement("button", { "data-button": true, "data-cancel": true, style: t.cancelButtonStyle || i, onClick: (n) => {
    var m, p;
    V(t.cancel) && F && ((p = (m = t.cancel).onClick) == null || p.call(m, n), z());
  }, className: R(a == null ? void 0 : a.cancelButton, (Ct = t == null ? void 0 : t.classNames) == null ? void 0 : Ct.cancelButton) }, t.cancel.label) : null, import_react.default.isValidElement(t.action) ? t.action : t.action && V(t.action) ? import_react.default.createElement("button", { "data-button": true, "data-action": true, style: t.actionButtonStyle || K, onClick: (n) => {
    var m, p;
    V(t.action) && ((p = (m = t.action).onClick) == null || p.call(m, n), !n.defaultPrevented && z());
  }, className: R(a == null ? void 0 : a.actionButton, (Bt = t == null ? void 0 : t.classNames) == null ? void 0 : Bt.actionButton) }, t.action.label) : null));
};
function zt() {
  if (typeof window == "undefined" || typeof document == "undefined") return "ltr";
  let r = document.documentElement.getAttribute("dir");
  return r === "auto" || !r ? window.getComputedStyle(document.documentElement).direction : r;
}
function Ce() {
  let [r, o] = import_react.default.useState([]);
  return import_react.default.useEffect(() => T.subscribe((t) => {
    o((s) => {
      if ("dismiss" in t && t.dismiss) return s.filter((l) => l.id !== t.id);
      let g = s.findIndex((l) => l.id === t.id);
      if (g !== -1) {
        let l = [...s];
        return l[g] = { ...l[g], ...t }, l;
      } else return [t, ...s];
    });
  }), []), { toasts: r };
}
var Be = (0, import_react.forwardRef)(function(o, t) {
  let { invert: s, position: g = "bottom-right", hotkey: l = ["altKey", "KeyT"], expand: E, closeButton: P, className: h, offset: c, theme: y = "light", richColors: k, duration: j, style: O, visibleToasts: st = ae, toastOptions: i, dir: K = zt(), gap: J = re, loadingIcon: rt, icons: _, containerAriaLabel: it = "Notifications", pauseWhenPageIsHidden: lt, cn: X = de } = o, [C, a] = import_react.default.useState([]), N = import_react.default.useMemo(() => Array.from(new Set([g].concat(C.filter((d) => d.position).map((d) => d.position)))), [C, g]), [G, Q] = import_react.default.useState([]), [R, B] = import_react.default.useState(false), [q, U] = import_react.default.useState(false), [dt, M] = import_react.default.useState(y !== "system" ? y : typeof window != "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), A = import_react.default.useRef(null), Z = l.join("+").replace(/Key/g, "").replace(/Digit/g, ""), L = import_react.default.useRef(null), Y = import_react.default.useRef(false), tt = import_react.default.useCallback((d) => {
    a((u) => {
      var b;
      return (b = u.find((w) => w.id === d.id)) != null && b.delete || T.dismiss(d.id), u.filter(({ id: w }) => w !== d.id);
    });
  }, []);
  return import_react.default.useEffect(() => T.subscribe((d) => {
    if (d.dismiss) {
      a((u) => u.map((b) => b.id === d.id ? { ...b, delete: true } : b));
      return;
    }
    setTimeout(() => {
      import_react_dom.default.flushSync(() => {
        a((u) => {
          let b = u.findIndex((w) => w.id === d.id);
          return b !== -1 ? [...u.slice(0, b), { ...u[b], ...d }, ...u.slice(b + 1)] : [d, ...u];
        });
      });
    });
  }), []), import_react.default.useEffect(() => {
    if (y !== "system") {
      M(y);
      return;
    }
    if (y === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? M("dark") : M("light")), typeof window == "undefined") return;
    let d = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      d.addEventListener("change", ({ matches: u }) => {
        M(u ? "dark" : "light");
      });
    } catch (u) {
      d.addListener(({ matches: b }) => {
        try {
          M(b ? "dark" : "light");
        } catch (w) {
          console.error(w);
        }
      });
    }
  }, [y]), import_react.default.useEffect(() => {
    C.length <= 1 && B(false);
  }, [C]), import_react.default.useEffect(() => {
    let d = (u) => {
      var w, D;
      l.every((f) => u[f] || u.code === f) && (B(true), (w = A.current) == null || w.focus()), u.code === "Escape" && (document.activeElement === A.current || (D = A.current) != null && D.contains(document.activeElement)) && B(false);
    };
    return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
  }, [l]), import_react.default.useEffect(() => {
    if (A.current) return () => {
      L.current && (L.current.focus({ preventScroll: true }), L.current = null, Y.current = false);
    };
  }, [A.current]), import_react.default.createElement("section", { "aria-label": `${it} ${Z}`, tabIndex: -1, "aria-live": "polite", "aria-relevant": "additions text", "aria-atomic": "false" }, N.map((d, u) => {
    var D;
    let [b, w] = d.split("-");
    return C.length ? import_react.default.createElement("ol", { key: d, dir: K === "auto" ? zt() : K, tabIndex: -1, ref: A, className: h, "data-sonner-toaster": true, "data-theme": dt, "data-y-position": b, "data-lifted": R && C.length > 1 && !E, "data-x-position": w, style: { "--front-toast-height": `${((D = G[0]) == null ? void 0 : D.height) || 0}px`, "--offset": typeof c == "number" ? `${c}px` : c || ne, "--width": `${se}px`, "--gap": `${J}px`, ...O }, onBlur: (f) => {
      Y.current && !f.currentTarget.contains(f.relatedTarget) && (Y.current = false, L.current && (L.current.focus({ preventScroll: true }), L.current = null));
    }, onFocus: (f) => {
      f.target instanceof HTMLElement && f.target.dataset.dismissible === "false" || Y.current || (Y.current = true, L.current = f.relatedTarget);
    }, onMouseEnter: () => B(true), onMouseMove: () => B(true), onMouseLeave: () => {
      q || B(false);
    }, onPointerDown: (f) => {
      f.target instanceof HTMLElement && f.target.dataset.dismissible === "false" || U(true);
    }, onPointerUp: () => U(false) }, C.filter((f) => !f.position && u === 0 || f.position === d).map((f, H) => {
      var et, ot;
      return import_react.default.createElement(ce, { key: f.id, icons: _, index: H, toast: f, defaultRichColors: k, duration: (et = i == null ? void 0 : i.duration) != null ? et : j, className: i == null ? void 0 : i.className, descriptionClassName: i == null ? void 0 : i.descriptionClassName, invert: s, visibleToasts: st, closeButton: (ot = i == null ? void 0 : i.closeButton) != null ? ot : P, interacting: q, position: d, style: i == null ? void 0 : i.style, unstyled: i == null ? void 0 : i.unstyled, classNames: i == null ? void 0 : i.classNames, cancelButtonStyle: i == null ? void 0 : i.cancelButtonStyle, actionButtonStyle: i == null ? void 0 : i.actionButtonStyle, removeToast: tt, toasts: C.filter((x) => x.position == f.position), heights: G.filter((x) => x.position == f.position), setHeights: Q, expandByDefault: E, gap: J, loadingIcon: rt, expanded: R, pauseWhenPageIsHidden: lt, cn: X });
    })) : null;
  }));
});
export {
  Be as Toaster,
  te as toast,
  Ce as useSonner
};
//# sourceMappingURL=sonner.js.map
