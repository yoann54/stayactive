(() => {
  // Until content.js reports the stored preference the extension behaves as
  // enabled, so a tab that starts loading in the background is masked from
  // its very first script. If the preference turns out to be "off", the page
  // is told about the real state right away (see setEnabled).
  const STATE = { enabled: true };

  // Patch the prototype that natively owns the property, so the page sees
  // no extra own properties on document or HTMLDocument.prototype.
  const findOwner = (prop) => {
    for (let o = document; o; o = Object.getPrototypeOf(o)) {
      if (Object.prototype.hasOwnProperty.call(o, prop)) return o;
    }
    return null;
  };

  // A Proxy keeps the native name, length and toString() of the function.
  const wrap = (fn, spoofed) =>
    new Proxy(fn, {
      apply(target, thisArg, args) {
        if (STATE.enabled) return spoofed;
        return Reflect.apply(target, thisArg, args);
      },
    });

  const spoofGetter = (prop, spoofed) => {
    const owner = findOwner(prop);
    if (!owner) return;
    const desc = Object.getOwnPropertyDescriptor(owner, prop);
    if (!desc.get) return;
    try {
      Object.defineProperty(owner, prop, { ...desc, get: wrap(desc.get, spoofed) });
    } catch (_) {}
  };

  spoofGetter("hidden", false);
  spoofGetter("visibilityState", "visible");
  spoofGetter("webkitHidden", false);
  spoofGetter("webkitVisibilityState", "visible");

  const focusOwner = findOwner("hasFocus");
  if (focusOwner) {
    try {
      const desc = Object.getOwnPropertyDescriptor(focusOwner, "hasFocus");
      Object.defineProperty(focusOwner, "hasFocus", { ...desc, value: wrap(desc.value, true) });
    } catch (_) {}
  }

  const BLOCKED_EVENTS = [
    "visibilitychange",
    "webkitvisibilitychange",
    "blur",
    "focusout",
  ];

  // Registered at document_start, before any page script, as a capture
  // listener on window: it runs first for every event, so stopping it here
  // also hides it from addEventListener listeners and on* handlers. Only
  // events aimed at the window or the document are blocked; blur/focusout on
  // form fields and other elements must keep working.
  const stopper = (e) => {
    if (!STATE.enabled) return;
    if (e.target !== window && e.target !== document) return;
    e.stopImmediatePropagation();
  };

  for (const evt of BLOCKED_EVENTS) {
    window.addEventListener(evt, stopper, true);
  }

  const setEnabled = (enabled) => {
    if (enabled === STATE.enabled) return;
    STATE.enabled = enabled;
    if (enabled) return;
    // The page has only seen "visible and focused" so far: if that is no
    // longer true, let it catch up now that the real values show through.
    if (document.hidden) {
      document.dispatchEvent(new Event("visibilitychange", { bubbles: true }));
    }
    if (!document.hasFocus()) window.dispatchEvent(new Event("blur"));
  };

  // Private channel with content.js. Both scripts run at document_start,
  // before any page script, so the handshake completes before the page can
  // listen or interfere: content.js sends a random event name once (and
  // retries on READY if it ran first), and only that name is trusted
  // afterwards. A page cannot toggle the extension without knowing it.
  const HELLO = "__stayActiveHello";
  const READY = "__stayActiveReady";

  const onHello = (e) => {
    if (typeof e.detail !== "string") return;
    window.removeEventListener(HELLO, onHello, true);
    e.preventDefault(); // acknowledges receipt to content.js
    window.addEventListener(
      e.detail,
      (ev) => {
        if (typeof ev.detail === "boolean") setEnabled(ev.detail);
      },
      true
    );
  };

  window.addEventListener(HELLO, onHello, true);
  window.dispatchEvent(new CustomEvent(READY));
})();
