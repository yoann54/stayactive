const updateBadge = async (enabled) => {
  await chrome.action.setBadgeBackgroundColor({ color: "#1f8a4c" });
  await chrome.action.setBadgeText({ text: enabled ? "ON" : "" });
};

const syncBadge = async () => {
  const { enabled } = await chrome.storage.local.get(["enabled"]);
  await updateBadge(enabled !== false);
};

chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get(["enabled"]);
  if (typeof enabled !== "boolean") {
    await chrome.storage.local.set({ enabled: true });
  }
  await syncBadge();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.enabled) return;
  updateBadge(changes.enabled.newValue !== false).catch(console.error);
});

// Runs every time the service worker starts: browser startup, and also when
// the extension is re-enabled from chrome://extensions, which fires neither
// onStartup nor onInstalled.
syncBadge().catch(console.error);
