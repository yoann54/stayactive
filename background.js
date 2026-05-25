chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(["enabled"]);
  if (typeof stored.enabled !== "boolean") {
    await chrome.storage.local.set({ enabled: true });
  }
  updateBadge(stored.enabled !== false);
});

chrome.runtime.onStartup.addListener(async () => {
  const stored = await chrome.storage.local.get(["enabled"]);
  updateBadge(stored.enabled !== false);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.enabled) return;
  updateBadge(!!changes.enabled.newValue);
});

function updateBadge(enabled) {
  chrome.action.setBadgeText({ text: enabled ? "ON" : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#1f8a4c" });
}
