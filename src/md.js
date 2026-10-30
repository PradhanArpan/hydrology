// Markdown + KaTeX renderer with course extensions.
// Globals `marked` and `katex` are loaded from assets/vendor.
/* global marked, katex */

let n = 0;
const key = () => "XQPH" + n++ + "QX";
export const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function math(tex, display) {
  try { return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore" }); }
  catch (e) { return "<code>" + esc(tex) + "</code>"; }
}

export function inline(s) {
  const store = {};
  s = String(s).replace(/\$([^$\n]+?)\$/g, (m, t) => { const k = key(); store[k] = math(t, false); return k; });
  let h = marked.parseInline(s);
  for (const k in store) h = h.split(k).join(store[k]);
  return h;
}

function quizHtml(json) {
  let items;
  try { items = JSON.parse(json); } catch (e) { return '<div class="callout warn">Quiz JSON error: ' + esc(e.message) + "</div>"; }
  const id = "qz" + n++;
  let h = '<div class="quiz" id="' + id + '">';
  items.forEach((it, i) => {
    h += '<div class="qitem" data-ans="' + it.answer + '"><div class="qq">' + (i + 1) + ". " + inline(it.q) + "</div>";
    it.options.forEach((o, j) => { h += '<label><input type="radio" name="' + id + "_" + i + '" value="' + j + '"> <span>' + inline(o) + "</span></label>"; });
    h += '<div class="why" hidden>' + inline(it.why || "") + "</div></div>";
  });
  return h + '<p class="qscore" aria-live="polite"></p></div>';
}

function checkHtml(json) {
  let items;
  try { items = JSON.parse(json); } catch (e) { return '<div class="callout warn">Check JSON error: ' + esc(e.message) + "</div>"; }
  if (!Array.isArray(items)) items = [items];
  return items.map(it => '<div class="chk" data-a="' + it.answer + '" data-tol="' + (it.tol == null ? 0.02 : it.tol) + '">' +
    '<div class="cq">✎ ' + inline(it.q) + '</div><div class="row"><input type="text" inputmode="decimal" placeholder="your answer"> <span>' + esc(it.unit || "") + '</span> ' +
    '<button class="btn">Check</button>' + (it.hint ? ' <button class="btn ghost" data-k="hint">Hint</button>' : "") + (it.solution ? ' <button class="btn ghost" data-k="solx">Show working</button>' : "") + '</div>' +
    '<div class="fb" hidden></div>' + (it.hint ? '<div class="hint" hidden>' + inline(it.hint) + '</div>' : "") + (it.solution ? '<div class="solx" hidden>' + inline(it.solution) + '</div>' : "") + '</div>').join("");
}

export function renderMd(src) {
  src = String(src).replace(/\r\n?/g, "\n");
  const store = {};
  const put = html => { const k = key(); store[k] = html; return "\n\n" + k + "\n\n"; };
  src = src.replace(/```quiz\s*\n([\s\S]*?)\n```/g, (m, j) => put(quizHtml(j)));
  src = src.replace(/```check\s*\n([\s\S]*?)\n```/g, (m, j) => put(checkHtml(j)));
  src = src.replace(/```[\s\S]*?```/g, m => put(marked.parse(m)));
  src = src.replace(/^::widget\[([\w-]+)\]\s*$/gm, (m, w) => put('<div class="wg-mount" data-w="' + w + '"></div>'));
  src = src.replace(/^:::(\w+)[ \t]*(.*)\n([\s\S]*?)\n:::[ \t]*$/gm, (m, type, title, body) => {
    const inner = renderMd(body);
    if (type === "sol") return put('<details class="sol"><summary>' + inline(title || "Show solution") + "</summary>" + inner + "</details>");
    if (type === "gallery") return put('<div class="gallery">' + inner.replace(/<\/?p>/g, "") + "</div>");
    return put('<div class="callout ' + type + '"><span class="ct">' + inline(title || type) + "</span>" + inner + "</div>");
  });
  src = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => put(math(t, true)).trim());
  src = src.replace(/(^|[^\\$])\$([^\s$](?:[^$\n]*?))\$(?!\d)/g, (m, pre, t) => { const k = key(); store[k] = math(t.trim(), false); return pre + k; });
  let html = marked.parse(src, { mangle: false, headerIds: false });
  for (let pass = 0; pass < 5; pass++) {
    let changed = false;
    for (const k in store) if (html.indexOf(k) >= 0) { html = html.split("<p>" + k + "</p>").join(store[k]).split(k).join(store[k]); changed = true; }
    if (!changed) break;
  }
  return html;
}

// DOM post-processing after the HTML is inserted.
export function enhance(root) {
  root.querySelectorAll("blockquote").forEach(bq => {
    const p = bq.querySelector("p"); if (!p) return;
    const m = p.innerHTML.match(/^\[!(\w+)\]\s*([^<\n]*)/); if (!m) return;
    const div = document.createElement("div");
    div.className = "callout " + m[1].toLowerCase();
    p.innerHTML = p.innerHTML.replace(m[0], "").replace(/^\s*<br>/, "");
    div.innerHTML = '<span class="ct">' + esc(m[2] || m[1]) + "</span>" + bq.innerHTML;
    bq.replaceWith(div);
  });
  // lone images -> figures with captions (alt text; " — " splits caption and source)
  root.querySelectorAll("p > img:only-child").forEach(img => {
    const p = img.parentElement; if (p.textContent.trim()) return;
    const fig = document.createElement("figure");
    const [cap, src] = (img.alt || "").split(" — ");
    fig.appendChild(img.cloneNode());
    if (cap) { const fc = document.createElement("figcaption"); fc.innerHTML = esc(cap) + (src ? ' <span class="src">' + esc(src) + "</span>" : ""); fig.appendChild(fc); }
    p.replaceWith(fig);
  });
  root.querySelectorAll(".gallery > img").forEach(img => {
    const fig = document.createElement("figure"); fig.appendChild(img.cloneNode());
    const fc = document.createElement("figcaption"); fc.textContent = (img.alt || "").split(" — ")[0]; fig.appendChild(fc);
    img.replaceWith(fig);
  });
  root.querySelectorAll("img").forEach(i => {
    i.loading = "lazy";
    i.addEventListener("click", () => {
      const o = document.createElement("div"); o.className = "lightbox";
      o.innerHTML = '<img src="' + i.getAttribute("src") + '" alt=""><p>' + esc((i.alt || "").replace(" — ", " · ")) + "</p>";
      o.addEventListener("click", () => o.remove()); document.body.appendChild(o);
    });
  });
  root.querySelectorAll("td").forEach(td => { if (/^\s*[-−+]?[\d,]*\.?\d+(\s*%)?\s*$/.test(td.textContent)) td.classList.add("num"); });
  root.querySelectorAll('a[href^="http"]').forEach(a => { a.target = "_blank"; a.rel = "noopener"; });
  root.querySelectorAll(".chk").forEach(c => {
    const inp = c.querySelector("input"), fb = c.querySelector(".fb"), a = +c.dataset.a, tol = +c.dataset.tol;
    const test = () => {
      const v = parseFloat(String(inp.value).replace(/,/g, "").replace("−", "-"));
      fb.hidden = false;
      if (!isFinite(v)) { fb.className = "fb no"; fb.textContent = "Enter a number."; return; }
      const ok = Math.abs(v - a) <= Math.max(Math.abs(a) * tol, 1e-9);
      fb.className = "fb " + (ok ? "ok" : "no");
      fb.textContent = ok ? "✓ Correct — " + a + " (within " + Math.round(tol * 100) + " %)." : (Math.abs(v - a) <= Math.abs(a) * 0.15 ? "Close, but not within " + Math.round(tol * 100) + " %. Check rounding and units." : "Not yet. Try again, or open the hint.");
    };
    c.querySelector(".btn:not(.ghost)").addEventListener("click", test);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") test(); });
    c.querySelectorAll("[data-k]").forEach(b => b.addEventListener("click", () => { const el = c.querySelector("." + b.dataset.k); el.hidden = !el.hidden; }));
  });
  root.querySelectorAll(".quiz").forEach(q => {
    const score = q.querySelector(".qscore"), items = q.querySelectorAll(".qitem");
    q.addEventListener("change", e => {
      const it = e.target.closest(".qitem"); if (!it || it.dataset.done) return;
      const ans = +it.dataset.ans;
      it.querySelectorAll("label").forEach((l, j) => {
        const inp = l.querySelector("input"); inp.disabled = true;
        if (j === ans) l.classList.add("right"); else if (inp.checked) l.classList.add("wrong");
      });
      it.dataset.done = "1"; it.dataset.ok = +e.target.value === ans ? "1" : "0";
      it.querySelector(".why").hidden = false;
      const done = q.querySelectorAll(".qitem[data-done]").length, ok = q.querySelectorAll('.qitem[data-ok="1"]').length;
      score.textContent = "Score " + ok + " / " + done + (done === items.length ? " · all answered" : "");
    });
  });
}
