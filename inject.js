(() => {
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

  window.addEventListener("__focusTabSetState", (e) => {
    if (typeof e.detail === "boolean") STATE.enabled = e.detail;
  });
})();
