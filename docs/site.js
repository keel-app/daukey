// daukey.keellabs.dev: download links from version.json (updated by the release job)
// and the visitor's system picked out. The page works without this script.
(function () {
  const NAMES = { macos: "macOS", windows: "Windows", linux: "Linux" };

  function detectOS() {
    const p = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent).toLowerCase();
    if (p.includes("mac")) return "macos";
    if (p.includes("win")) return "windows";
    if (p.includes("linux") && !/android/i.test(navigator.userAgent)) return "linux";
    return null; // phones and others: no recommendation
  }

  function apply(info) {
    document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = info.version; });
    const released = info.released !== false;
    const note = document.getElementById("release-note");
    note.textContent = released
      ? `Phiên bản ${info.version}. Miễn phí, không quảng cáo.`
      : `Phiên bản ${info.version} sắp phát hành. Theo dõi trang phát hành để tải khi có.`;

    // Secondary links (portable .zip, ARM64) only show when the release has that file.
    document.querySelectorAll(".alt-download").forEach((a) => {
      const url = released && info.downloads && info.downloads[a.dataset.download];
      if (url) a.href = url; else a.hidden = true;
    });
    document.querySelectorAll(".button[data-download]").forEach((a) => {
      const os = a.dataset.download;
      if (released && info.downloads && info.downloads[os]) {
        a.href = info.downloads[os];
        a.removeAttribute("aria-disabled");
      } else {
        a.href = info.page;
        a.setAttribute("aria-disabled", "true");
        a.textContent = `${NAMES[os]}: sắp có`;
      }
    });

    const os = detectOS();
    const primary = document.getElementById("primary-download");
    if (os) {
      const card = document.querySelector(`.downloads .card[data-os="${os}"]`);
      if (card) card.classList.add("recommended");
      const guide = document.querySelector(`.guides details[data-os="${os}"]`);
      if (guide) {
        document.querySelectorAll(".guides details").forEach((d) => { d.open = d === guide; });
      }
      if (released && info.downloads && info.downloads[os]) {
        primary.href = info.downloads[os];
        primary.textContent = `Tải cho ${NAMES[os]}`;
      } else {
        primary.href = "#tai-ve";
        primary.textContent = `Bản cho ${NAMES[os]} sắp có`;
      }
    }
  }

  fetch("version.json", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(apply)
    .catch(() => { /* keep the static links to the releases page */ });
})();

// Hero: type "Vieetj Nam" once, key by key, then stop on the finished word.
// Without this script (or with reduced motion) the page already shows the result.
(function () {
  const stage = document.querySelector(".stage");
  if (!stage || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const text = stage.querySelector(".stage-text");
  const keys = stage.querySelectorAll("kbd");
  const steps = ["V", "Vi", "Vie", "Viê", "Viêt", "Việt", "Việt ", "Việt N", "Việt Na", "Việt Nam"];
  text.textContent = "";
  stage.classList.add("typing");
  keys.forEach((key, i) => {
    setTimeout(() => {
      text.textContent = steps[i];
      key.classList.add("down");
      setTimeout(() => key.classList.remove("down"), 140);
      if (i === keys.length - 1) setTimeout(() => stage.classList.remove("typing"), 600);
    }, 700 + i * 220);
  });
})();
