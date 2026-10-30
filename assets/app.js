/* CE633 course portal — shared rendering helpers.
   No build step: edit sessions.json and the .md files, push, done. */
(function () {
  "use strict";

  // ---------- theme ----------
  const THEME_KEY = "ce633-theme";
  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  try { applyTheme(localStorage.getItem(THEME_KEY)); } catch (e) {}
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme");
    const dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }

  // ---------- data ----------
  async function loadCourse() {
    const r = await fetch("sessions.json", { cache: "no-store" });
    if (!r.ok) throw new Error("Could not load sessions.json (" + r.status + ")");
    return r.json();
  }
  async function loadText(path) {
    const r = await fetch(path, { cache: "no-store" });
    if (!r.ok) throw new Error("Could not load " + path + " (" + r.status + ")");
    return r.text();
  }

  const SOFT = {
    "HEC-HMS": "hms", "HEC-RAS": "ras", "QGIS": "gis", "Spreadsheet": "sheet",
    "HEC-SSP": "other", "Python": "other", "Field/Video": "other"
  };
  function chip(label, cls) {
    return '<span class="chip ' + (cls || SOFT[label] || "other") + '">' + esc(label) + "</span>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function isPreview() {
    const p = new URLSearchParams(location.search);
    if (p.get("preview") === "1") { try { sessionStorage.setItem("ce633-preview", "1"); } catch (e) {} return true; }
    try { return sessionStorage.getItem("ce633-preview") === "1"; } catch (e) { return false; }
  }

  // ---------- markdown + math + extensions ----------
  let phCount = 0;
  function ph(store, html) { const k = "XQPH" + (phCount++) + "QX"; store[k] = html; return k; }

  function renderMath(tex, display) {
    try { return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore" }); }
    catch (e) { return "<code>" + esc(tex) + "</code>"; }
  }

  function renderQuiz(json) {
    let items;
    try { items = JSON.parse(json); } catch (e) { return '<div class="callout warn">Quiz JSON error: ' + esc(e.message) + "</div>"; }
    const id = "qz" + (phCount++);
    let h = '<div class="quiz" id="' + id + '">';
    items.forEach((it, i) => {
      h += '<div class="qitem" data-ans="' + it.answer + '"><div class="qq">' + (i + 1) + ". " + inline(it.q) + "</div>";
      it.options.forEach((o, j) => {
        h += '<label><input type="radio" name="' + id + "_" + i + '" value="' + j + '"> <span>' + inline(o) + "</span></label>";
      });
      h += '<div class="why">' + inline(it.why || "") + "</div></div>";
    });
    h += '<p class="score" aria-live="polite"></p></div>';
    return h;
  }
  // inline markdown with math (used inside quiz strings)
  function inline(s) {
    const store = {};
    s = String(s).replace(/\$([^$\n]+?)\$/g, (m, t) => ph(store, renderMath(t, false)));
    let h = marked.parseInline(s);
    for (const k in store) h = h.split(k).join(store[k]);
    return h;
  }

  function renderMd(src) {
    const store = {};
    // 1. quiz fences
    src = src.replace(/```quiz\s*\n([\s\S]*?)\n```/g, (m, j) => "\n\n" + ph(store, renderQuiz(j)) + "\n\n");
    // 2. protect other code fences from math processing
    src = src.replace(/```[\s\S]*?```/g, m => ph(store, marked.parse(m)));
    // 3. containers  :::type Title ... :::
    src = src.replace(/^:::(\w+)[ \t]*(.*)\n([\s\S]*?)\n:::[ \t]*$/gm, (m, type, title, body) => {
      const inner = renderMd(body);
      let html;
      if (type === "sol") html = '<details class="sol"><summary>' + esc(title || "Show solution") + "</summary>" + inner + "</details>";
      else if (type === "steps") html = inner.replace("<ol>", '<ol class="steps">');
      else html = '<div class="callout ' + type + '"><span class="ct">' + esc(title || type) + "</span>" + inner + "</div>";
      return "\n\n" + ph(store, html) + "\n\n";
    });
    // 4. math
    src = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => ph(store, renderMath(t, true)));
    src = src.replace(/(^|[^\\$])\$([^\s$](?:[^$\n]*?))\$(?!\d)/g, (m, pre, t) => pre + ph(store, renderMath(t.trim(), false)));
    // 5. markdown
    let html = marked.parse(src, { mangle: false, headerIds: false });
    // 6. restore (repeat for nesting)
    for (let pass = 0; pass < 4; pass++) {
      let changed = false;
      for (const k in store) {
        if (html.indexOf(k) >= 0) {
          html = html.split("<p>" + k + "</p>").join(store[k]).split(k).join(store[k]);
          changed = true;
        }
      }
      if (!changed) break;
    }
    return html;
  }

  function enhance(root) {
    // callouts from > [!type] Title
    root.querySelectorAll("blockquote").forEach(bq => {
      const p = bq.querySelector("p");
      if (!p) return;
      const m = p.innerHTML.match(/^\[!(\w+)\]\s*([^<\n]*)/);
      if (!m) return;
      const div = document.createElement("div");
      div.className = "callout " + m[1].toLowerCase();
      p.innerHTML = p.innerHTML.replace(m[0], "").replace(/^\s*<br>/, "");
      div.innerHTML = '<span class="ct">' + esc(m[2] || m[1]) + "</span>" + bq.innerHTML;
      bq.replaceWith(div);
    });
    // numeric table cells
    root.querySelectorAll("td").forEach(td => {
      if (/^\s*[-−+]?[\d,]*\.?\d+(\s*%)?\s*$/.test(td.textContent)) td.classList.add("num");
    });
    // heading ids
    root.querySelectorAll("h2, h3").forEach((h, i) => {
      if (!h.id) h.id = "h-" + i + "-" + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    });
    // external links in new tab
    root.querySelectorAll('a[href^="http"]').forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
    // quizzes
    root.querySelectorAll(".quiz").forEach(q => {
      const score = q.querySelector(".score");
      const items = q.querySelectorAll(".qitem");
      q.addEventListener("change", e => {
        const it = e.target.closest(".qitem");
        if (!it || it.classList.contains("done")) return;
        const ans = +it.dataset.ans;
        const labels = it.querySelectorAll("label");
        labels.forEach((l, j) => {
          l.querySelector("input").disabled = true;
          if (j === ans) l.classList.add("right");
          else if (l.querySelector("input").checked) l.classList.add("wrong");
        });
        it.classList.add("done");
        it.dataset.ok = (+e.target.value === ans) ? "1" : "0";
        const done = q.querySelectorAll(".qitem.done");
        const ok = q.querySelectorAll('.qitem[data-ok="1"]').length;
        score.textContent = "Score: " + ok + " / " + done.length + (done.length === items.length ? " — all answered" : "");
      });
    });
  }

  function buildToc(root, tocEl) {
    const hs = root.querySelectorAll("h2, h3");
    if (!hs.length) { tocEl.innerHTML = ""; return; }
    let h = "<b>On this tab</b>";
    hs.forEach(x => { h += '<a class="' + x.tagName.toLowerCase() + '" href="#' + x.id + '">' + esc(x.textContent) + "</a>"; });
    tocEl.innerHTML = h;
  }

  window.CE633 = { loadCourse, loadText, renderMd, enhance, buildToc, chip, esc, isPreview, toggleTheme, SOFT };
})();
