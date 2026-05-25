(() => {
  if (window.__focusTabInstalled) return;
  window.__focusTabInstalled = true;

  const STATE = { enabled: true };
  window.__focusTabState = STATE;

  const docProto = Object.getPrototypeOf(document) || Document.prototype;

  const realHasFocus = document.hasFocus.bind(document);
  const realHiddenDesc =
    Object.getOwnPropertyDescriptor(docProto, "hidden") ||
    Object.getOwnPropertyDescriptor(Document.prototype, "hidden");
  const realVisibilityDesc =
    Object.getOwnPropertyDescriptor(docProto, "visibilityState") ||
    Object.getOwnPropertyDescriptor(Document.prototype, "visibilityState");
  const realWebkitHiddenDesc =
    Object.getOwnPropertyDescriptor(docProto, "webkitHidden") ||
    Object.getOwnPropertyDescriptor(Document.prototype, "webkitHidden");
  const realWebkitVisibilityDesc =
    Object.getOwnPropertyDescriptor(docProto, "webkitVisibilityState") ||
    Object.getOwnPropertyDescriptor(Document.prototype, "webkitVisibilityState");

  try {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get() {
        if (STATE.enabled) return false;
        return realHiddenDesc ? realHiddenDesc.get.call(this) : false;
      },
    });
  } catch (_) {}

  try {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get() {
        if (STATE.enabled) return "visible";
        return realVisibilityDesc ? realVisibilityDesc.get.call(this) : "visible";
      },
    });
  } catch (_) {}

  try {
    Object.defineProperty(document, "webkitHidden", {
      configurable: true,
      get() {
        if (STATE.enabled) return false;
        return realWebkitHiddenDesc ? realWebkitHiddenDesc.get.call(this) : false;
      },
    });
  } catch (_) {}

  try {
    Object.defineProperty(document, "webkitVisibilityState", {
      configurable: true,
      get() {
        if (STATE.enabled) return "visible";
        return realWebkitVisibilityDesc
          ? realWebkitVisibilityDesc.get.call(this)
          : "visible";
      },
    });
  } catch (_) {}

  try {
    document.hasFocus = function () {
      if (STATE.enabled) return true;
      return realHasFocus();
    };
  } catch (_) {}

  const BLOCKED_EVENTS = new Set([
    "visibilitychange",
    "webkitvisibilitychange",
    "blur",
    "focusout",
    "pagehide",
    "freeze",
  ]);

  const stopper = (e) => {
    if (!STATE.enabled) return;
    if (BLOCKED_EVENTS.has(e.type)) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  };

  for (const evt of BLOCKED_EVENTS) {
    window.addEventListener(evt, stopper, true);
    document.addEventListener(evt, stopper, true);
  }

  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (
      STATE.enabled &&
      typeof type === "string" &&
      BLOCKED_EVENTS.has(type.toLowerCase()) &&
      (this === window || this === document)
    ) {
      return;
    }
    return origAdd.call(this, type, listener, options);
  };

  const onPropsToNeutralize = ["onvisibilitychange", "onblur", "onpagehide"];
  for (const prop of onPropsToNeutralize) {
    try {
      Object.defineProperty(document, prop, {
        configurable: true,
        get() {
          return null;
        },
        set() {
          /* swallow */
        },
      });
    } catch (_) {}
    try {
      Object.defineProperty(window, prop, {
        configurable: true,
        get() {
          return null;
        },
        set() {
          /* swallow */
        },
      });
    } catch (_) {}
  }

  window.addEventListener("__focusTabSetState", (e) => {
    const next = e.detail && typeof e.detail.enabled === "boolean";
    if (next) STATE.enabled = e.detail.enabled;
  });
})();
