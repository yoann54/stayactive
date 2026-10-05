const toggle = document.getElementById("toggle");
const card = document.querySelector(".card");
const statusLabel = document.getElementById("statusLabel");
const statusDetail = document.getElementById("statusDetail");
const tagline = document.getElementById("tagline");
const hint = document.getElementById("hint");
const switchLabel = document.getElementById("switch");

const t = (key) => chrome.i18n.getMessage(key) || key;

tagline.textContent = t("popupTagline");
hint.textContent = t("hint");
document.documentElement.lang = chrome.i18n.getUILanguage();
toggle.setAttribute("aria-label", t("toggleLabel"));
switchLabel.title = t("toggleLabel");

const render = (enabled) => {
  toggle.checked = !!enabled;
  card.dataset.state = enabled ? "on" : "off";
  statusLabel.textContent = enabled ? t("statusOn") : t("statusOff");
  statusDetail.textContent = enabled ? t("statusOnDetail") : t("statusOffDetail");
};

(async () => {
  const { enabled } = await chrome.storage.local.get(["enabled"]);
  render(enabled !== false);
})();

toggle.addEventListener("change", async () => {
  await chrome.storage.local.set({ enabled: toggle.checked });
  render(toggle.checked);
});
