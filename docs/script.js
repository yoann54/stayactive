const links = document.querySelectorAll(".lang a");
const sections = document.querySelectorAll(".lang-section");

const setLang = (lang) => {
  links.forEach((a) => a.classList.toggle("active", a.dataset.lang === lang));
  sections.forEach((s) => s.classList.toggle("active", s.id === lang));
  document.documentElement.lang = lang;
};

links.forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    setLang(a.dataset.lang);
    history.replaceState(null, "", "#" + a.dataset.lang);
  })
);

const initial = (location.hash || "").replace("#", "");
if (initial === "fr") setLang("fr");
else if ((navigator.language || "").toLowerCase().startsWith("fr")) setLang("fr");
