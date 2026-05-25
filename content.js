(async () => {
  const apply = (enabled) => {
    window.dispatchEvent(
      new CustomEvent("__focusTabSetState", { detail: { enabled: !!enabled } })
    );
  };

  try {
    const stored = await chrome.storage.local.get(["enabled"]);
    const enabled = typeof stored.enabled === "boolean" ? stored.enabled : true;
    apply(enabled);
  } catch (_) {
    apply(true);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.enabled) return;
    apply(changes.enabled.newValue);
  });
})();
