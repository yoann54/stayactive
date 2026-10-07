(() => {
  // See the handshake in inject.js.
  const HELLO = "__stayActiveHello";
  const READY = "__stayActiveReady";

  // crypto.randomUUID() needs a secure context; http:// pages must work too.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const channel =
    "__stayActive" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  // inject.js cancels the event to acknowledge it.
  const hello = () =>
    !window.dispatchEvent(new CustomEvent(HELLO, { detail: channel, cancelable: true }));

  if (!hello()) {
    const onReady = () => {
      if (hello()) window.removeEventListener(READY, onReady, true);
    };
    window.addEventListener(READY, onReady, true);
  }

  const apply = (enabled) => {
    window.dispatchEvent(new CustomEvent(channel, { detail: !!enabled }));
  };

  chrome.storage.local.get(["enabled"]).then(
    (stored) => apply(stored.enabled !== false),
    () => apply(true)
  );

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.enabled) return;
    apply(changes.enabled.newValue);
  });
})();
