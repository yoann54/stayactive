(() => {
  // Until content.js reports the stored preference the extension behaves as
  // enabled, so a tab that starts loading in the background is masked from
  // its very first script. If the preference turns out to be "off", the page
  // is told about the real state right away (see setEnabled).
  const STATE = { enabled: true };

  // Captured before any page script runs, so a page that later replaces
  // these globals can neither observe nor break the extension.
  const apply = Reflect.apply;
  const EventCtor = Event;
  const dispatch = EventTarget.prototype.dispatchEvent;

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
        return apply(target, thisArg, args);
      },
    });

  // What the page currently sees, read through the patched accessors.
  const view = {
    hidden: () => false,
    hasFocus: () => true,
  };

  const spoofGetter = (prop, spoofed) => {
    const owner = findOwner(prop);
    if (!owner) return;
    const desc = Object.getOwnPropertyDescriptor(owner, prop);
    if (!desc.get) return;
    const get = wrap(desc.get, spoofed);
    try {
      Object.defineProperty(owner, prop, { ...desc, get });
      if (prop === "hidden") view.hidden = () => apply(get, document, []);
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
      const value = wrap(desc.value, true);
      Object.defineProperty(focusOwner, "hasFocus", { ...desc, value });
      view.hasFocus = () => apply(value, document, []);
    } catch (_) {}
  }

  // focusout is not listed: it only ever targets elements, never the window
  // or the document, so the stopper below would let it through anyway.
  const BLOCKED_EVENTS = ["visibilitychange", "webkitvisibilitychange", "blur"];

  // Registered at document_start, before any page script, as a capture
  // listener on window: it runs first for every event, so stopping it here
  // also hides it from addEventListener listeners and on* handlers. Only
  // events aimed at the window or the document are blocked; blur/focusout on
  // form fields and other elements must keep working.
  let passThrough = false;

  const stopper = (e) => {
    if (!STATE.enabled || passThrough) return;
    if (e.target !== window && e.target !== document) return;
    e.stopImmediatePropagation();
  };

  for (const evt of BLOCKED_EVENTS) {
    window.addEventListener(evt, stopper, true);
  }

  // Synthetic events let the page catch up; they must get past the stopper.
  const fire = (target, type, bubbles) => {
    passThrough = true;
    try {
      apply(dispatch, target, [new EventCtor(type, { bubbles })]);
    } finally {
      passThrough = false;
    }
  };

  // Whenever the switch changes what the page sees, tell it, as the browser
  // would have. Turning off in a background tab reveals "hidden"; turning on
  // in a tab the page already knows is hidden must announce "visible", or
  // the real visibilitychange on return would be blocked and the page would
  // stay paused.
  const setEnabled = (enabled) => {
    if (enabled === STATE.enabled) return;
    const wasHidden = view.hidden();
    const hadFocus = view.hasFocus();
    STATE.enabled = enabled;
    if (view.hidden() !== wasHidden) fire(document, "visibilitychange", true);
    const hasFocus = view.hasFocus();
    if (hasFocus !== hadFocus) fire(window, hasFocus ? "focus" : "blur", false);
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
