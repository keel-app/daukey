// Guide pages: commands and file names always name the current release (version.json
// is updated by the release job), and every command block gets a copy button.
fetch("/version.json").then((r) => r.ok && r.json()).then((v) => {
  if (v && v.version) document.querySelectorAll("[data-v]").forEach((el) => { el.textContent = v.version; });
}).catch(() => {});

document.querySelectorAll("pre").forEach((pre) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "copy";
  b.textContent = "Sao chép";
  b.addEventListener("click", () => {
    navigator.clipboard.writeText(pre.querySelector("code").innerText.trim()).then(() => {
      b.textContent = "Đã chép";
      setTimeout(() => { b.textContent = "Sao chép"; }, 1500);
    });
  });
  // The button sits on a wrapper, not in the <pre>, so it stays put while a long command scrolls.
  const box = document.createElement("div");
  box.className = "pre-box";
  pre.replaceWith(box);
  box.append(pre, b);
});
