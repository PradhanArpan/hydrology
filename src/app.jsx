import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { renderMd, enhance, esc } from "./md.js";
import { WIDGETS } from "./widgets.jsx";
import { ILLOS } from "./illos.jsx";
import { Menu, Search, Sun, Moon, X, Check, Printer, Lock, FlaskConical, ChevronRight, Maximize2 } from "lucide-react";

const ALL_COMPONENTS = { ...ILLOS, ...WIDGETS };

// Interactive tools that dock in the session workbench (the rest stay inline as figures).
const DOCK_TOOLS = {
  waterbudget: "Water-budget calculator",
  abstractions: "Where does a storm's rain go?",
  dalton: "Dalton's law",
  tipping: "Tipping-bucket rain gauge",
  network: "Optimum number of rain gauges",
  dmc: "Double mass curve",
  thiessen: "Thiessen polygons",
  missing: "Missing rainfall",
  storm: "Hyetograph and mass curve",
  movavg: "Moving average",
  risk: "Return period, risk and reliability",
  idf: "Plotting position and IDF curves",
  d8: "D8 flow direction",
  hortonfit: "Horton's infiltration model",
  phiindex: "φ-index and W-index finder",
  scscn: "SCS Curve Number calculator",
  pencalc: "Evapotranspiration calculator"
};

// Tools with enough controls and charts that the 380px rail is cramped: these get "Open larger".
const EXPANDABLE = new Set(["dmc", "thiessen", "storm", "idf", "missing", "hortonfit", "phiindex", "scscn", "pencalc", "movavg", "d8"]);

const Icon = ({ as: I, size = 18 }) => <I size={size} strokeWidth={2} aria-hidden="true" className="fb-icon" />;

function useMedia(q) {
  const get = () => { try { return window.matchMedia(q).matches; } catch (e) { return false; } };
  const [m, setM] = useState(get);
  useEffect(() => {
    let mq;
    try { mq = window.matchMedia(q); } catch (e) { return; }
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener ? mq.addEventListener("change", f) : mq.addListener(f);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", f) : mq.removeListener(f));
  }, [q]);
  return m;
}

const REPO = "https://github.com/PradhanArpan/hydrology";
const ROMAN = ["", "I", "II", "III", "IV", "V"];

function store(k, v) {
  try {
    if (v === undefined) return JSON.parse(localStorage.getItem(k));
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    return null;
  }
}

function isPreview() {
  if (/preview/.test(location.hash) || /preview=1/.test(location.search)) {
    try { sessionStorage.setItem("ce633-preview", "1"); } catch (e) { }
    return true;
  }
  try { return sessionStorage.getItem("ce633-preview") === "1"; } catch (e) { return false; }
}

function useRoute() {
  const get = () => (location.hash.replace(/^#\/?/, "").replace(/\?.*$/, "") || "home").split("/");
  const [r, setR] = useState(get());
  useEffect(() => {
    const f = () => {
      setR(get());
      const m = document.querySelector(".main");
      if (m) m.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  return r;
}

const go = h => { location.hash = h; };

/* ---------- Theme hook (Dark/Light mode) ---------- */
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("ce633-theme");
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    } catch (e) { }
    return "light";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("ce633-theme", theme);
    } catch (e) { }
  }, [theme]);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

/* ---------- Global Student Progress hook ---------- */
function useProgress() {
  const [visited, setVisited] = useState(() => store("ce633-visited-sessions") || []);
  const [completedLabs, setCompletedLabs] = useState(() => {
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ce633-lab-")) {
          const val = JSON.parse(localStorage.getItem(key) || "{}");
          if (val.done && val.done.length > 0) count++;
        }
      }
      return count;
    } catch (e) {
      return 0;
    }
  });

  const markVisited = id => {
    setVisited(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      store("ce633-visited-sessions", next);
      return next;
    });
  };

  const refreshLabs = () => {
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ce633-lab-")) {
          const val = JSON.parse(localStorage.getItem(key) || "{}");
          if (val.done && val.done.length > 0) count++;
        }
      }
      setCompletedLabs(count);
    } catch (e) { }
  };

  return { visited, markVisited, completedLabs, refreshLabs };
}

/* ---------- Markdown block with live React widgets ---------- */
// dock: { rail: HTMLElement, tab: number } — when given, interactive tools render into the
// workbench rail (one slot per tool, tagged with its section) and leave a short note inline.
function Content({ md, onHeads, dock, idPrefix = "" }) {
  const ref = useRef();
  const [mounts, setMounts] = useState([]);
  const html = useMemo(() => renderMd(md), [md]);
  const rail = dock && dock.rail;

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html;
    enhance(ref.current);
    const hs = [...ref.current.querySelectorAll("h2, h3")].map((h, k) => {
      h.id = h.id || idPrefix + "h" + k + "-" + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
      return { id: h.id, t: h.textContent, lv: h.tagName };
    });
    if (onHeads) onHeads(hs);
    // walk headings and mounts in document order so each tool knows its section
    let section = { id: idPrefix + "top", t: "" };
    const list = [];
    ref.current.querySelectorAll("h2, .wg-mount").forEach(el => {
      if (el.tagName === "H2") { section = { id: el.id, t: el.textContent }; return; }
      const name = el.dataset.w;
      if (rail && DOCK_TOOLS[name]) {
        const slot = document.createElement("div");
        slot.className = "fb-tool";
        slot.dataset.section = section.id;
        slot.dataset.tool = name;
        slot.dataset.sectionTitle = section.t;
        slot.dataset.tab = String(dock.tab);
        slot.hidden = true;
        rail.appendChild(slot);
        el.innerHTML = '<div class="fb-docked-note"><b>' + esc(DOCK_TOOLS[name]) + "</b>&nbsp;is open in the workbench beside this section.</div>";
        list.push({ el: slot, name });
      } else list.push({ el, name });
    });
    setMounts(list);
    return () => list.forEach(m => { if (m.el.classList.contains("fb-tool")) m.el.remove(); });
  }, [html, rail]);

  return (
    <>
      <div className="prose" ref={ref} />
      {mounts.map((m, i) => {
        const W = ALL_COMPONENTS[m.name];
        return createPortal(W ? <W /> : <div className="callout warn">Unknown widget: {m.name}</div>, m.el, i);
      })}
    </>
  );
}

const jump = (e, id) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

function useText(path) {
  const [t, setT] = useState(null);
  useEffect(() => {
    if (!path) return;
    setT(null);
    fetch(path, { cache: "no-cache" })
      .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(t => setT(t.replace(/\r\n?/g, "\n")))  // tolerate Windows (CRLF) line endings
      .catch(e => setT("> [!warn] Could not load\n> " + path + " (" + e + ")"));
  }, [path]);
  return t;
}

function splitTabs(src) {
  const parts = [], re = /<!--\s*tab:\s*(.+?)\s*-->/g;
  let m, last = null, idx = 0;
  while ((m = re.exec(src))) {
    if (last !== null) parts.push({ name: last, md: src.slice(idx, m.index) });
    else if (src.slice(0, m.index).trim()) parts.push({ name: "Overview", md: src.slice(0, m.index) });
    last = m[1];
    idx = re.lastIndex;
  }
  if (last !== null) parts.push({ name: last, md: src.slice(idx) });
  return parts.length ? parts : [{ name: "", md: src }];
}

/* ---------- Search Modal ---------- */
function SearchModal({ data, open, onClose, preview }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleKey = e => {
      if (e.key === "Escape" && open) onClose();
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && !open) {
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
          // open modal
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !data) return [];
    const list = [];

    // Search sessions
    data.sessions.forEach(s => {
      if (!s.enabled && !preview) return;
      const matchTitle = (s.title || "").toLowerCase().includes(q);
      const matchHook = (s.hook || "").toLowerCase().includes(q);
      const matchKeywords = (s.keywords || "").toLowerCase().includes(q);
      const matchId = s.id.toLowerCase().includes(q) || ("day " + s.day).includes(q);
      if (matchTitle || matchHook || matchKeywords || matchId) {
        list.push({
          type: "Theory Session",
          badge: s.id,
          title: s.title,
          hook: s.hook,
          url: "#/s/" + s.id
        });
      }
    });

    // Search labs
    data.labs.forEach(l => {
      if (!l.enabled && !preview) return;
      const matchTitle = (l.title || "").toLowerCase().includes(q);
      const matchGoal = (l.goal || "").toLowerCase().includes(q);
      const matchId = l.id.toLowerCase().includes(q);
      if (matchTitle || matchGoal || matchId) {
        list.push({
          type: "Software Lab",
          badge: l.id,
          title: l.title,
          hook: l.goal,
          url: "#/lab/" + l.id
        });
      }
    });

    // Search software pages
    data.software.forEach(sw => {
      if ((sw.title || "").toLowerCase().includes(q) || (sw.hook || "").toLowerCase().includes(q)) {
        list.push({
          type: "Software Info",
          badge: sw.ni,
          title: sw.title,
          hook: sw.hook,
          url: "#/sw/" + sw.id
        });
      }
    });

    // Search course pages
    data.pages.forEach(p => {
      if ((p.title || "").toLowerCase().includes(q) || (p.hook || "").toLowerCase().includes(q)) {
        list.push({
          type: "Course Page",
          badge: p.ni,
          title: p.title,
          hook: p.hook,
          url: "#/page/" + p.id
        });
      }
    });

    return list.slice(0, 12);
  }, [query, data, preview]);

  if (!open) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Icon as={Search} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search sessions, topics, labs, keywords… (Esc to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-close-btn" onClick={onClose} aria-label="Close search"><Icon as={X} /></button>
        </div>
        <div className="search-results">
          {query.trim() === "" ? (
            <div style={{ padding: "20px 18px", color: "var(--g400)", fontSize: 13 }}>
              Type a topic (e.g. <i>Horton</i>, <i>Thiessen</i>, <i>SCS-CN</i>, <i>HEC-HMS</i>, <i>Infiltration</i>) to search across all sessions and labs.
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "20px 18px", color: "var(--g400)", fontSize: 13 }}>
              No matches found for "{query}".
            </div>
          ) : (
            results.map((r, idx) => (
              <a
                key={idx}
                className="search-result-item"
                href={r.url}
                onClick={onClose}
              >
                <div className="search-item-top">
                  <span className="chip other">{r.type}</span>
                  <span className="day-num">{r.badge}</span>
                  <span className="search-item-title">{r.title}</span>
                </div>
                <div className="search-item-hook">{r.hook}</div>
              </a>
            ))
          )}
        </div>
        <div className="search-footer">
          <span>{results.length} result(s)</span>
          <span>Tip: press <kbd>/</kbd> anywhere to search</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell: header, menu drawer, preview bar ---------- */
function SiteHeader({ data, onMenu, onSearch, theme, toggleTheme }) {
  const c = data.course;
  return (
    <header className="fb-header">
      <button className="fb-header__menu" onClick={onMenu} aria-label="Open course menu">
        <Icon as={Menu} /> <span>Menu</span>
      </button>
      <a className="fb-header__brand" href="#/">
        <span className="fb-header__code">{c.code}</span>
        <span className="fb-header__name">{c.title}</span>
      </a>
      <button className="fb-header__search" onClick={onSearch} aria-label="Search the course">
        <Icon as={Search} />
        <span>Search sessions, labs, formulas</span>
        <kbd>/</kbd>
      </button>
      <button className="fb-iconbtn fb-header__searchicon" onClick={onSearch} aria-label="Search the course">
        <Icon as={Search} size={20} />
      </button>
      <button className="fb-iconbtn" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
        <Icon as={theme === "dark" ? Sun : Moon} size={20} />
      </button>
    </header>
  );
}

function MenuDrawer({ data, route, open, close, preview, visited }) {
  const closeRef = useRef();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    setTimeout(() => closeRef.current && closeRef.current.focus(), 0);
    const onKey = e => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); if (prev && prev.focus) prev.focus(); };
  }, [open]);
  if (!open) return null;
  const c = data.course;
  const sess = route[0] === "s" ? data.sessions.find(s => s.id === route[1]) : null;
  const curUnit = sess ? sess.unit : route[0] === "unit" ? +route[1] : null;
  const cur = (cond) => (cond ? { "aria-current": "page" } : {});
  return (
    <>
      <div className="fb-scrim" onClick={close} />
      <nav className="fb-drawer" aria-label="Course menu">
        <div className="fb-drawer__head">
          <span className="fb-drawer__title">{c.code} Hydrology</span>
          <button ref={closeRef} className="fb-iconbtn" onClick={close} aria-label="Close menu"><Icon as={X} size={20} /></button>
        </div>
        <div className="fb-drawer__body" onClick={e => { if (e.target.closest("a")) close(); }}>
          <div className="fb-drawer__group">
            <a className="fb-drawer__link" href="#/" {...cur(route[0] === "home")}>Home</a>
          </div>
          <div className="fb-drawer__group">
            <p className="fb-drawer__label">Units</p>
            {data.units.map(u => (
              <React.Fragment key={u.n}>
                <a className="fb-drawer__link" href={"#/unit/" + u.n} {...cur(route[0] === "unit" && +route[1] === u.n)}>
                  <span className="fb-drawer__num">{ROMAN[u.n]}</span>{u.short}
                </a>
                {curUnit === u.n && (
                  <div className="fb-drawer__sub">
                    {data.sessions.filter(s => s.unit === u.n && (s.enabled || preview)).map(s => (
                      <a key={s.id} className="fb-drawer__link" href={"#/s/" + s.id} {...cur(sess && sess.id === s.id)}>
                        <span className="fb-drawer__num">{s.day}</span>
                        <span style={{ flex: 1 }}>{s.title}</span>
                        {visited && visited.includes(s.id) && <span className="fb-sidenav__read"><Icon as={Check} size={16} /><span className="fb-sr">Read</span></span>}
                      </a>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="fb-drawer__group">
            <p className="fb-drawer__label">Software</p>
            <a className="fb-drawer__link" href="#/labs" {...cur(route[0] === "labs" || route[0] === "lab")}>Lab track</a>
            {data.software.map(p => (
              <a key={p.id} className="fb-drawer__link" href={"#/sw/" + p.id} {...cur(route[0] === "sw" && route[1] === p.id)}>{p.title}</a>
            ))}
          </div>
          <div className="fb-drawer__group">
            <p className="fb-drawer__label">Course</p>
            {data.pages.map(p => (
              <a key={p.id} className="fb-drawer__link" href={"#/page/" + p.id} {...cur(route[0] === "page" && route[1] === p.id)}>{p.title}</a>
            ))}
            <a className="fb-drawer__link" href="#/page/links" {...cur(route[0] === "page" && route[1] === "links")}>Data and software links</a>
          </div>
        </div>
        <div className="fb-drawer__foot">
          <div>{c.instructor}</div>
          <div>{c.email}</div>
        </div>
      </nav>
    </>
  );
}

function PreviewBar() {
  return (
    <div className="fb-previewbar" role="status">
      <span><b>Preview mode.</b> You can see unreleased sessions and labs; students can't.</span>
      <a href={REPO + "/edit/main/sessions.json"} target="_blank" rel="noopener">Release sessions in sessions.json</a>
    </div>
  );
}

function SideNav({ data, unit, cur, preview, visited }) {
  const u = data.units.find(x => x.n === unit);
  const ss = data.sessions.filter(s => s.unit === unit);
  return (
    <nav className="fb-sidenav" aria-label={"Unit " + ROMAN[unit] + " sessions"}>
      <p className="fb-sidenav__unit"><a href={"#/unit/" + unit}>Unit {ROMAN[unit]}  {u ? u.short : ""}</a></p>
      <ol>
        {ss.map((s, k) => {
          const open = s.enabled || preview;
          const read = visited && visited.includes(s.id);
          return (
            <li key={s.id}>
              {open ? (
                <a className="fb-sidenav__item" href={"#/s/" + s.id} aria-current={s.id === cur ? "page" : undefined}>
                  <span className="fb-sidenav__num">{k + 1}</span>
                  <span>{s.title}</span>
                  {read && <span className="fb-sidenav__read"><Icon as={Check} size={16} /><span className="fb-sr">Read</span></span>}
                </a>
              ) : (
                <span className="fb-sidenav__locked"><span className="fb-sidenav__num">{k + 1}</span><span>{s.title}</span></span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Session page: reading column + docked workbench ---------- */
function SessionTabs({ parts, tab, pick }) {
  const refs = useRef([]);
  const onKey = (e, j) => {
    const n = parts.length;
    let k = null;
    if (e.key === "ArrowRight") k = (j + 1) % n;
    if (e.key === "ArrowLeft") k = (j - 1 + n) % n;
    if (e.key === "Home") k = 0;
    if (e.key === "End") k = n - 1;
    if (k === null) return;
    e.preventDefault();
    pick(k);
    refs.current[k] && refs.current[k].focus();
  };
  return (
    <div className="fb-tabs" role="tablist" aria-label="Session parts">
      {parts.map((p, j) => (
        <button
          key={p.name}
          ref={el => (refs.current[j] = el)}
          role="tab"
          id={"tab-" + j}
          aria-selected={j === tab}
          aria-controls={"panel-" + j}
          tabIndex={j === tab ? 0 : -1}
          onClick={() => pick(j)}
          onKeyDown={e => onKey(e, j)}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

function useActiveSection(rootSel, deps) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const root = document.querySelector(rootSel);
      if (!root) return;
      const line = window.innerHeight * 0.35;
      let id = null;
      root.querySelectorAll(".prose h2").forEach(h => { if (h.offsetParent !== null && h.getBoundingClientRect().top <= line) id = h.id; });
      setActive(id);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    const t = setTimeout(calc, 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { clearTimeout(t); if (raf) cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, deps);
  return active;
}

function SessionView({ data, id, preview, markVisited, visited }) {
  const s = data.sessions.find(x => x.id === id);
  const src = useText(s && (s.enabled || preview) ? s.file : null);
  const [tab, setTab] = useState(0);
  const [heads, setHeads] = useState({});
  const wide = useMedia("(min-width: 1180px)");
  const [rail, setRail] = useState(null);
  const [toolTick, setToolTick] = useState(0);

  useEffect(() => {
    setTab(0);
    setHeads({});
    if (s && markVisited) markVisited(s.id);
  }, [id]);

  const active = useActiveSection(".fb-article", [id, tab, src, toolTick]);

  // show only the tool for the section in view (and the current tab)
  const [shownTool, setShownTool] = useState(null);
  const [shownName, setShownName] = useState(null);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => { setExpanded(null); }, [id, tab, wide]);
  useEffect(() => {
    if (expanded) return;
    if (!rail) { setShownTool(null); setShownName(null); return; }
    const slots = [...rail.querySelectorAll(".fb-tool")].filter(el => el.dataset.tab === String(tab));
    const topId = "t" + tab + "-top";
    const match = slots.find(el => el.dataset.section === (active || topId));
    rail.querySelectorAll(".fb-tool").forEach(el => (el.hidden = el !== match));
    setShownTool(match ? match.dataset.sectionTitle || "This session" : null);
    setShownName(match ? match.dataset.tool : null);
  });

  if (!s) return <div className="fb-session"><div className="fb-status fb-status--empty"><div><h3>Session not found</h3><p>Open the <a href="#/">Home page</a> to find the next session.</p></div></div></div>;

  const u = data.units.find(x => x.n === s.unit);
  const unitSessions = data.sessions.filter(x => x.unit === s.unit);
  const pos = unitSessions.findIndex(x => x.id === id) + 1;
  const labs = (s.labs || []).map(l => data.labs.find(x => x.id === l)).filter(Boolean);
  const openLabs = labs.filter(l => l.enabled || preview);
  const vis = data.sessions.filter(x => x.enabled || preview);
  const i = vis.findIndex(x => x.id === id);
  const prev = vis[i - 1];
  const next = vis[i + 1];
  const parts = src ? splitTabs(src) : [];
  const locked = !s.enabled && !preview;
  const curHeads = (heads[tab] || []).filter(h => h.lv === "H2");

  const pick = j => {
    setTab(j);
    window.scrollTo(0, 0);
  };

  const meta = [s.co, s.refs ? "textbook " + s.refs : null, (s.software || []).length ? (s.software || []).join(" and ") : null].filter(Boolean).join(", ");

  return (
    <div className={"fb-session fb-session--rail"}>
      <aside className="fb-session__nav">
        <SideNav data={data} unit={s.unit} cur={s.id} preview={preview} visited={visited} />
      </aside>

      <article className="fb-article">
        <p className="fb-crumb">
          <a href={"#/unit/" + u.n}>Unit {ROMAN[u.n]}</a> / Session {pos} of {unitSessions.length} / Day {s.day}
          {!s.enabled && preview && <> / <b>Unreleased</b></>}
        </p>
        <h1 className="fb-title">{s.title}</h1>
        {s.hook && <p className="fb-lede">{s.hook}</p>}
        {meta && <p className="fb-meta">{meta}</p>}

        {!locked && (
          <div className="fb-actions">
            {openLabs.map((l, k) => (
              <a key={l.id} className={"fb-btn " + (k === 0 ? "fb-btn--primary" : "fb-btn--secondary")} href={"#/lab/" + l.id}>
                <Icon as={FlaskConical} /> Lab {l.id}: {l.title}
              </a>
            ))}
            <button className="fb-btn fb-btn--ghost" onClick={() => window.print()}>
              <Icon as={Printer} /> Print notes
            </button>
          </div>
        )}

        {locked ? (
          <div className="fb-status fb-status--empty">
            <Icon as={Lock} size={20} />
            <div>
              <h3>This session opens closer to Day {s.day}</h3>
              <p>Revise the sessions already open in <a href={"#/unit/" + u.n}>Unit {ROMAN[u.n]}</a> in the meantime.</p>
            </div>
          </div>
        ) : !src ? (
          <div className="fb-skeleton" aria-busy="true" aria-label="Loading session">
            <span style={{ width: "60%", height: 24 }} /><span /><span /><span style={{ width: "85%" }} /><span /><span style={{ width: "70%" }} />
          </div>
        ) : (
          <>
            {parts.length > 1 && <SessionTabs parts={parts} tab={tab} pick={pick} />}
            {parts.map((p, j) => (
              <div key={id + j} role={parts.length > 1 ? "tabpanel" : undefined} id={"panel-" + j} aria-labelledby={parts.length > 1 ? "tab-" + j : undefined} hidden={j !== tab}>
                <Content
                  md={p.md}
                  idPrefix={"t" + j + "-"}
                  dock={wide && rail ? { rail, tab: j } : null}
                  onHeads={h => { setHeads(o => ({ ...o, [j]: h })); setToolTick(x => x + 1); }}
                />
              </div>
            ))}
            <nav className="fb-pager" aria-label="Sessions">
              {prev ? (
                <a href={"#/s/" + prev.id}><small>Previous session</small>{prev.title}</a>
              ) : <span />}
              {next ? (
                <a className="fb-pager__next" href={"#/s/" + next.id}><small>Next session</small>{next.title}</a>
              ) : <span />}
            </nav>
          </>
        )}
      </article>

      <aside className="fb-rail" aria-label="Workbench">
        <div className="fb-workbench" hidden={!shownTool}>
          <div className="fb-workbench__head">
            <h2 className="fb-workbench__title">Workbench</h2>
            <span className="fb-workbench__context">{shownTool}</span>
          </div>
          {shownName && EXPANDABLE.has(shownName) && (
            <button className="fb-btn fb-btn--secondary fb-workbench__expand" onClick={() => { const slot = rail && rail.querySelector(".fb-tool:not([hidden])"); if (slot) setExpanded(slot); }}>
              <Icon as={Maximize2} /> Open larger
            </button>
          )}
          <div ref={setRail} />
        </div>
        {!shownTool && !locked && (
          <>
            {openLabs.length > 0 && (
              <section className="fb-panel">
                <h2>Try it in software</h2>
                <ul>
                  {openLabs.map(l => (
                    <li key={l.id}><a href={"#/lab/" + l.id}><Icon as={FlaskConical} size={16} /> Lab {l.id}: {l.title}</a></li>
                  ))}
                </ul>
              </section>
            )}
            {curHeads.length > 0 && (
              <section className="fb-panel">
                <h2>On this page</h2>
                <ul>
                  {curHeads.map(h => (
                    <li key={h.id}><a href="#" aria-current={h.id === active ? "true" : undefined} onClick={e => jump(e, h.id)}>{h.t}</a></li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </aside>
      {expanded && <ToolModal slot={expanded} home={rail} title={DOCK_TOOLS[expanded.dataset.tool] || "Workbench"} context={expanded.dataset.sectionTitle} onClose={() => setExpanded(null)} />}
    </div>
  );
}

// A large window for one workbench tool. The tool's own element is moved in and back out,
// so its inputs and results are kept exactly as the student left them.
function ToolModal({ slot, home, title, context, onClose }) {
  const bodyRef = useRef();
  const closeRef = useRef();
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.appendChild(slot);
    slot.hidden = false;
    const prevFocus = document.activeElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current && closeRef.current.focus();
    return () => {
      if (home) home.appendChild(slot);
      document.documentElement.style.overflow = prevOverflow;
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, [slot]);
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="fb-modal" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fb-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="fb-modal-title">
        <div className="fb-modal__head">
          <div>
            <h2 className="fb-modal__title" id="fb-modal-title">{title}</h2>
            {context && <p className="fb-modal__context">{context}</p>}
          </div>
          <button ref={closeRef} className="fb-btn fb-btn--secondary" onClick={onClose}><Icon as={X} /> Back to reading</button>
        </div>
        <div className="fb-modal__body" ref={bodyRef} />
      </div>
    </div>,
    document.body
  );
}

/* ---------- Shared bits for the redesigned pages ---------- */
const listJoin = xs => (xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1]);
const sentence = t => {
  if (!t || t !== t.toUpperCase()) return t;
  const out = String(t).replace(/\s·\s/g, ", ").toLowerCase().replace(/\b([ls]\d+)\b/g, m => m.toUpperCase()).replace(/\b(i{1,3}|iv|v)\b/g, m => m.toUpperCase());
  return out.charAt(0).toUpperCase() + out.slice(1);
};

const sessionState = (s, preview, visited) => {
  if (visited && visited.includes(s.id)) return "read";
  if (s.enabled) return "open";
  if (preview) return "preview";
  return "locked";
};

function StatusText({ state, release }) {
  if (state === "read") return <span className="fb-state fb-state--read"><Icon as={Check} size={16} /> Read</span>;
  if (state === "open") return <span className="fb-state">Open</span>;
  if (state === "preview") return <span className="fb-state fb-state--locked"><Icon as={Lock} size={16} /> Unreleased</span>;
  return <span className="fb-state fb-state--locked"><Icon as={Lock} size={16} /> {release ? "Opens " + release : "Opens later"}</span>;
}

function labState(l, preview) {
  const st = store("ce633-lab-" + l.id) || {};
  if (st.total && st.done && st.done.length >= st.total) return "read";
  if (l.enabled) return "open";
  return preview ? "preview" : "locked";
}

const RowLink = ({ href, children }) => (href ? <a className="fb-row" href={href}>{children}</a> : <div className="fb-row fb-row--locked">{children}</div>);

/* ---------- Home ---------- */
function Home({ data, visited, preview }) {
  const released = data.sessions.filter(s => s.enabled);
  const unread = released.filter(s => !(visited || []).includes(s.id));
  const nextS = unread[0] || null;
  const revise = !nextS && released.length ? released[released.length - 1] : null;
  const target = nextS || revise;
  const tu = target && data.units.find(u => u.n === target.unit);
  const tpos = target ? data.sessions.filter(x => x.unit === target.unit).findIndex(x => x.id === target.id) + 1 : 0;
  const tlabs = target ? (target.labs || []).map(id => data.labs.find(l => l.id === id)).filter(l => l && (l.enabled || preview)) : [];
  const readN = data.sessions.filter(s => (visited || []).includes(s.id)).length;
  const toRead = unread.length;
  const toCome = data.sessions.filter(s => !s.enabled).length;

  return (
    <div className="fb-single">
      {target ? (
        <section className="fb-nextclass" aria-labelledby="nextclass-title">
          <div className="fb-nextclass__body">
            <p className="fb-crumb">{nextS ? "Next class" : "Revise"}: Session {tpos}, Unit {ROMAN[target.unit]}{tu ? "  " + tu.short : ""}</p>
            <h1 className="fb-title" id="nextclass-title">{target.title}</h1>
            {target.hook && <p className="fb-lede" style={{ marginBottom: 0 }}>{target.hook}</p>}
          </div>
          <div className="fb-nextclass__actions">
            <a className="fb-btn fb-btn--primary" href={"#/s/" + target.id}>{nextS ? "Read before class" : "Revise this session"}</a>
            {tlabs[0] && <a className="fb-btn fb-btn--secondary" href={"#/lab/" + tlabs[0].id} title={tlabs[0].title}><Icon as={FlaskConical} /> Start Lab {tlabs[0].id}</a>}
          </div>
        </section>
      ) : (
        <div className="fb-status fb-status--empty">
          <Icon as={Lock} size={20} />
          <div><h3>The course opens on the first day of class</h3><p>Set up the software in the meantime: <a href="#/page/setup">Software setup</a>.</p></div>
        </div>
      )}

      <section className="fb-timeline" aria-label="Semester progress">
        <div className="fb-timeline__meta">
          <span>Your semester, {data.sessions.length} sessions</span>
          <span>{readN} read, {toRead} to read, {toCome} to come</span>
        </div>
        <div className="fb-timeline__bars" aria-hidden="true">
          {data.sessions.map((s, k) => {
            const st = (visited || []).includes(s.id) ? "done" : target && s.id === target.id && nextS ? "next" : s.enabled ? "open" : "upcoming";
            const start = k > 0 && s.unit !== data.sessions[k - 1].unit;
            return <span key={s.id} className={"fb-timeline__bar fb-timeline__bar--" + st + (start ? " fb-timeline__bar--unit-start" : "")} title={s.id + ": " + s.title} />;
          })}
        </div>
        <div className="fb-timeline__units" aria-hidden="true">
          {data.units.map(u => <span key={u.n}>Unit {ROMAN[u.n]}</span>)}
        </div>
      </section>

      <section aria-labelledby="units-title">
        <h2 className="fb-h2" id="units-title">Units</h2>
        <div className="fb-rows">
          {data.units.map(u => {
            const ss = data.sessions.filter(s => s.unit === u.n);
            const open = ss.filter(s => s.enabled).length;
            const read = ss.filter(s => (visited || []).includes(s.id)).length;
            const status = open === 0 ? "Not yet open" : open + " of " + ss.length + " open" + (read ? ", " + read + " read" : "");
            return (
              <RowLink key={u.n} href={"#/unit/" + u.n}>
                <span className="fb-row__num">{ROMAN[u.n]}</span>
                <span className="fb-row__main"><span className="fb-row__title">{u.title}</span><span className="fb-row__sub">{u.hours} hours, {u.co}</span></span>
                <span className="fb-row__side">{status}</span>
              </RowLink>
            );
          })}
        </div>
      </section>

      <p className="fb-links-row">
        <a className="fb-btn fb-btn--secondary" href="#/labs"><Icon as={FlaskConical} /> Software lab track</a>
        <a className="fb-btn fb-btn--ghost" href="#/page/setup">Software setup</a>
      </p>
    </div>
  );
}

/* ---------- Unit page ---------- */
function UnitPage({ data, n, preview, visited }) {
  const u = data.units.find(x => x.n === n);
  if (!u) return <div className="fb-single"><div className="fb-status fb-status--empty"><div><h3>Unit not found</h3><p>Open the <a href="#/">Home page</a> to see all five units.</p></div></div></div>;
  const ss = data.sessions.filter(s => s.unit === n);
  const labs = data.labs.filter(l => l.unit === n);
  const read = ss.filter(s => (visited || []).includes(s.id)).length;
  const open = ss.filter(s => s.enabled).length;

  return (
    <div className="fb-session fb-session--rail">
      <aside className="fb-session__nav">
        <nav className="fb-sidenav" aria-label="Units">
          <p className="fb-sidenav__unit">Units</p>
          <ol>
            {data.units.map(x => (
              <li key={x.n}><a className="fb-sidenav__item" href={"#/unit/" + x.n} aria-current={x.n === n ? "page" : undefined}><span className="fb-sidenav__num">{ROMAN[x.n]}</span><span>{x.short}</span></a></li>
            ))}
          </ol>
        </nav>
      </aside>
      <article className="fb-article">
        <p className="fb-crumb">Unit {ROMAN[n]}</p>
        <h1 className="fb-title">{u.title}</h1>
        <p className="fb-meta">{u.hours} hours, {u.co}, days {ss[0].day} to {ss[ss.length - 1].day}</p>
        <details className="fb-disclosure">
          <summary>Syllabus</summary>
          <p>{u.syllabus}</p>
        </details>
        {open === 0 && !preview && (
          <div className="fb-status fb-status--empty" style={{ marginBottom: "var(--space-5)" }}>
            <Icon as={Lock} size={20} />
            <div><h3>Unit {ROMAN[n]} opens after Unit {ROMAN[n - 1] || "I"}</h3><p>The session list below shows what is coming.</p></div>
          </div>
        )}
        <div className="fb-rows">
          {ss.map((s, k) => {
            const state = sessionState(s, preview, visited);
            const sl = (s.labs || []).filter(id => data.labs.some(l => l.id === id));
            return (
              <RowLink key={s.id} href={s.enabled || preview ? "#/s/" + s.id : null}>
                <span className="fb-row__num">{k + 1}</span>
                <span className="fb-row__main">
                  <span className="fb-row__title">{s.title}</span>
                  {s.hook && <span className="fb-row__sub">{s.hook}</span>}
                  <span className="fb-row__meta">Day {s.day}{sl.length ? (sl.length > 1 ? ", labs " : ", lab ") + listJoin(sl) : ""}{s.ready === false ? ", outline only" : ""}</span>
                </span>
                <span className="fb-row__side"><StatusText state={state} release={s.release} /></span>
              </RowLink>
            );
          })}
        </div>
      </article>
      <aside className="fb-rail" aria-label="Unit progress and labs">
        <section className="fb-panel">
          <h2>Your progress</h2>
          <p className="fb-panel__big">{read} of {ss.length} read</p>
          <div className="fb-progress" aria-hidden="true"><i style={{ width: (100 * read) / ss.length + "%" }} /></div>
        </section>
        {labs.length > 0 && (
          <section className="fb-panel">
            <h2>Labs in this unit</h2>
            <ul>
              {labs.map(l => (
                <li key={l.id}>{l.enabled || preview ? <a href={"#/lab/" + l.id}><Icon as={FlaskConical} size={16} /> {l.id}: {l.title}</a> : <span className="fb-panel__muted">{l.id}: {l.title}</span>}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}

/* ---------- Lab track page ---------- */
function LabsPage({ data, preview }) {
  const groups = [...new Set(data.labs.map(l => l.unit))];
  return (
    <div className="fb-single">
      <p className="fb-crumb">Software</p>
      <h1 className="fb-title">Software lab track</h1>
      <p className="fb-lede">Each lab is a short sequence of steps: what to click, what you should see, and what to do if it goes wrong. One HEC-HMS project grows through the semester, so do the labs in order.</p>
      <p className="fb-links-row" style={{ marginTop: 0 }}>
        <a className="fb-btn fb-btn--secondary" href="#/page/setup">Install the software</a>
      </p>

      <h2 className="fb-h2">Software guides</h2>
      <div className="fb-rows">
        {data.software.map(p => (
          <RowLink key={p.id} href={"#/sw/" + p.id}>
            <span className="fb-row__main"><span className="fb-row__title">{p.title}</span><span className="fb-row__sub">{p.hook}</span></span>
            <span className="fb-row__side">{sentence(p.when)}</span>
          </RowLink>
        ))}
      </div>

      {groups.map(g => (
        <section key={g}>
          <h2 className="fb-h2">Unit {ROMAN[g]} labs</h2>
          <div className="fb-rows">
            {data.labs.filter(l => l.unit === g).map(l => (
              <RowLink key={l.id} href={l.enabled || preview ? "#/lab/" + l.id : null}>
                <span className="fb-row__num">{l.id}</span>
                <span className="fb-row__main">
                  <span className="fb-row__title">{l.title}</span>
                  {l.goal && <span className="fb-row__sub">{l.goal}</span>}
                  <span className="fb-row__meta">{listJoin(l.software)}, about {l.minutes} min, goes with {listJoin(l.sessions)}</span>
                </span>
                <span className="fb-row__side"><StatusText state={labState(l, preview)} release={l.release} /></span>
              </RowLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------- Lab view (stepper) ---------- */
function parseLab(src) {
  const a = src.indexOf("<!--step:"), z = src.indexOf("<!--end-->");
  if (a < 0) return { intro: src, steps: [], outro: "" };
  const intro = src.slice(0, a);
  const body = src.slice(a, z < 0 ? undefined : z);
  const outro = z < 0 ? "" : src.slice(z + 10);
  const steps = [];
  const re = /<!--step:\s*(.+?)\s*-->/g;
  let m, last = null, idx = 0;
  while ((m = re.exec(body))) {
    if (last) steps.push({ title: last, md: body.slice(idx, m.index) });
    last = m[1];
    idx = re.lastIndex;
  }
  if (last) steps.push({ title: last, md: body.slice(idx) });
  return { intro, steps, outro };
}

function LabStep({ st, k, n, all, done, toggle, go, finish }) {
  const isDone = done.includes(k);
  return (
    <section className={"fb-labstep" + (isDone ? " is-done" : "")} id={"step-" + (k + 1)} aria-labelledby={"step-title-" + k}>
      <h2 className="fb-labstep__head" id={"step-title-" + k}>
        <span className="fb-labstep__num">{isDone ? <Icon as={Check} size={16} /> : k + 1}</span>
        <span>{st.title}</span>
      </h2>
      <Content md={st.md} />
      <div className="fb-labstep__foot">
        <label className="fb-check">
          <input type="checkbox" checked={isDone} onChange={() => toggle(k)} />
          <span>Done</span>
        </label>
        {!all && (
          <div className="fb-labstep__nav">
            {k > 0 && <button className="fb-btn fb-btn--ghost" onClick={() => go(k - 1)}>Back</button>}
            {k < n - 1 ? (
              <button className="fb-btn fb-btn--primary" onClick={() => { if (!isDone) toggle(k); go(k + 1); }}>Done, next step</button>
            ) : (
              <button className="fb-btn fb-btn--primary" onClick={() => { if (!isDone) toggle(k); finish(); }}>Finish the lab</button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function LabProgress({ steps, done, cur, all, setAll, go, reset }) {
  return (
    <section className="fb-panel fb-labprogress">
      <h2>Steps</h2>
      <p className="fb-panel__big">{done.length} of {steps.length} done</p>
      <div className="fb-progress" aria-hidden="true"><i style={{ width: (100 * done.length) / Math.max(1, steps.length) + "%" }} /></div>
      <ol className="fb-steplist">
        {steps.map((st, k) => (
          <li key={k}>
            <button className={"fb-steplist__item" + (k === cur && !all ? " is-current" : "")} aria-current={k === cur && !all ? "step" : undefined} onClick={() => go(k)}>
              <span className="fb-steplist__num">{done.includes(k) ? <><Icon as={Check} size={14} /><span className="fb-sr">Done:</span></> : k + 1}</span>
              <span>{st.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="fb-labprogress__actions">
        <button className="fb-btn fb-btn--ghost" onClick={() => setAll(!all)}>{all ? "One step at a time" : "Show all steps"}</button>
        {done.length > 0 && <button className="fb-btn fb-btn--ghost" onClick={reset}>Reset progress</button>}
      </div>
    </section>
  );
}

function LabNav({ data, cur, preview }) {
  return (
    <nav className="fb-sidenav fb-sidenav--labs" aria-label="Labs">
      <p className="fb-sidenav__unit"><a href="#/labs">Lab track</a></p>
      <ol>
        {data.labs.map(l => {
          const open = l.enabled || preview;
          const finished = labState(l, preview) === "read";
          return (
            <li key={l.id}>
              {open ? (
                <a className="fb-sidenav__item" href={"#/lab/" + l.id} aria-current={l.id === cur ? "page" : undefined}>
                  <span className="fb-sidenav__num">{l.id}</span><span>{l.title}</span>
                  {finished && <span className="fb-sidenav__read"><Icon as={Check} size={16} /><span className="fb-sr">Finished</span></span>}
                </a>
              ) : (
                <span className="fb-sidenav__locked"><span className="fb-sidenav__num">{l.id}</span><span>{l.title}</span></span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function LabView({ data, id, preview, refreshLabs }) {
  const l = data.labs.find(x => x.id === id);
  const src = useText(l && (l.enabled || preview) ? l.file : null);
  const key = "ce633-lab-" + id;
  const [cur, setCur] = useState(0);
  const [done, setDone] = useState([]);
  const [all, setAll] = useState(false);
  const parsed = useMemo(() => (src ? parseLab(src) : { intro: "", steps: [], outro: "" }), [src]);
  const { intro, steps, outro } = parsed;

  useEffect(() => {
    const st = store(key) || {};
    setCur(st.cur || 0);
    setDone(st.done || []);
    setAll(false);
  }, [id]);

  useEffect(() => {
    store(key, { cur, done, total: steps.length || (store(key) || {}).total || 0 });
    if (refreshLabs) refreshLabs();
  }, [cur, done, steps.length]);

  if (!l) return <div className="fb-single"><div className="fb-status fb-status--empty"><div><h3>Lab not found</h3><p>Open the <a href="#/labs">lab track</a> to see every lab.</p></div></div></div>;

  const vis = data.labs.filter(x => x.enabled || preview);
  const i = vis.findIndex(x => x.id === id);
  const prev = vis[i - 1];
  const next = vis[i + 1];
  const toggle = k => setDone(d => (d.includes(k) ? d.filter(x => x !== k) : [...d, k]));
  const go = k => {
    setCur(k);
    if (all) {
      const el = document.getElementById("step-" + (k + 1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = document.getElementById("lab-steps");
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" });
    }
  };
  const finish = () => { const o = document.getElementById("lab-outro"); if (o) o.scrollIntoView({ behavior: "smooth" }); };
  const locked = !l.enabled && !preview;
  const k = Math.min(cur, Math.max(0, steps.length - 1));

  return (
    <div className="fb-session fb-session--rail">
      <aside className="fb-session__nav"><LabNav data={data} cur={id} preview={preview} /></aside>
      <article className="fb-article">
        <p className="fb-crumb"><a href="#/labs">Lab track</a> / {l.id}{!l.enabled && preview && <> / <b>Unreleased</b></>}</p>
        <h1 className="fb-title">{l.title}</h1>
        {l.goal && <p className="fb-lede">{l.goal}</p>}
        <p className="fb-meta">
          {l.software.join(" and ")}, about {l.minutes} min, goes with{" "}
          {l.sessions.map((s, j) => <React.Fragment key={s}>{j > 0 && " and "}<a href={"#/s/" + s}>{s}</a></React.Fragment>)}
        </p>
        {locked ? (
          <div className="fb-status fb-status--empty"><Icon as={Lock} size={20} /><div><h3>This lab opens with its theory session</h3><p>Finish the labs already open on the <a href="#/labs">lab track</a> first.</p></div></div>
        ) : !src ? (
          <div className="fb-skeleton" aria-busy="true" aria-label="Loading lab"><span style={{ width: "60%", height: 24 }} /><span /><span /><span style={{ width: "80%" }} /></div>
        ) : (
          <>
            <Content md={intro} />
            {steps.length > 0 && (
              <div id="lab-steps">
                <div className="fb-labprogress--inline">
                  <span>{done.length} of {steps.length} steps done</span>
                  <div className="fb-progress" aria-hidden="true"><i style={{ width: (100 * done.length) / steps.length + "%" }} /></div>
                  <button className="fb-btn fb-btn--ghost" onClick={() => setAll(!all)}>{all ? "One step at a time" : "Show all steps"}</button>
                </div>
                {all
                  ? steps.map((st, j) => <LabStep key={id + j} st={st} k={j} n={steps.length} all={all} done={done} toggle={toggle} go={go} finish={finish} />)
                  : <LabStep key={id + k} st={steps[k]} k={k} n={steps.length} all={all} done={done} toggle={toggle} go={go} finish={finish} />}
              </div>
            )}
            <div id="lab-outro"><Content md={outro} /></div>
            <nav className="fb-pager" aria-label="Labs">
              {prev ? <a href={"#/lab/" + prev.id}><small>Previous lab</small>{prev.id}: {prev.title}</a> : <span />}
              {next ? <a className="fb-pager__next" href={"#/lab/" + next.id}><small>Next lab</small>{next.id}: {next.title}</a> : <span />}
            </nav>
          </>
        )}
      </article>
      <aside className="fb-rail" aria-label="Lab progress">
        {!locked && steps.length > 0 && (
          <LabProgress steps={steps} done={done} cur={k} all={all} setAll={setAll} go={go} reset={() => { setDone([]); setCur(0); }} />
        )}
      </aside>
    </div>
  );
}

/* ---------- Software guides and course pages ---------- */
function PageView({ data, id, list, kind, preview }) {
  const p = list.find(x => x.id === id);
  const src = useText(p && p.file);
  const [heads, setHeads] = useState([]);

  if (!p) return <div className="fb-single"><div className="fb-status fb-status--empty"><div><h3>Page not found</h3><p>Open the menu to see every page.</p></div></div></div>;

  const swName = kind === "sw" ? p.title.replace(/^About\s+/i, "") : null;
  const swLabs = swName ? data.labs.filter(l => (l.software || []).includes(swName)) : [];
  const h2s = heads.filter(h => h.lv === "H2");

  return (
    <div className="fb-session fb-session--rail">
      <aside className="fb-session__nav">
        <nav className="fb-sidenav" aria-label={kind === "sw" ? "Software guides" : "Course pages"}>
          <p className="fb-sidenav__unit">{kind === "sw" ? "Software guides" : "Course"}</p>
          <ol>
            {list.map(q => (
              <li key={q.id}><a className="fb-sidenav__item" href={"#/" + kind + "/" + q.id} aria-current={q.id === id ? "page" : undefined}><span>{q.title}</span></a></li>
            ))}
            {kind === "page" && <li><a className="fb-sidenav__item" href="#/page/links"><span>Data and software links</span></a></li>}
          </ol>
        </nav>
      </aside>
      <article className="fb-article">
        <p className="fb-crumb">{kind === "sw" ? <a href="#/labs">Software</a> : "Course"}</p>
        <h1 className="fb-title">{p.title}</h1>
        {p.hook && <p className="fb-lede">{p.hook}</p>}
        {src ? <Content md={src} onHeads={setHeads} /> : <div className="fb-skeleton" aria-busy="true" aria-label="Loading page"><span style={{ width: "60%", height: 24 }} /><span /><span /><span style={{ width: "80%" }} /></div>}
      </article>
      <aside className="fb-rail" aria-label="Related">
        {swLabs.length > 0 && (
          <section className="fb-panel">
            <h2>Labs that use {swName}</h2>
            <ul>
              {swLabs.map(l => (
                <li key={l.id}>{l.enabled || preview ? <a href={"#/lab/" + l.id}><Icon as={FlaskConical} size={16} /> {l.id}: {l.title}</a> : <span className="fb-panel__muted">{l.id}: {l.title}</span>}</li>
              ))}
            </ul>
          </section>
        )}
        {h2s.length > 0 && (
          <section className="fb-panel">
            <h2>On this page</h2>
            <ul>{h2s.map(h => <li key={h.id}><a href="#" onClick={e => jump(e, h.id)}>{h.t}</a></li>)}</ul>
          </section>
        )}
      </aside>
    </div>
  );
}

function LinksPage({ data }) {
  return (
    <div className="fb-single">
      <p className="fb-crumb">Course</p>
      <h1 className="fb-title">Data and software links</h1>
      <p className="fb-lede">Downloads for the course software and the data sources used in sessions and labs. Links open the provider's site in a new tab.</p>
      <div className="fb-rows">
        {data.links.map(([t, u]) => (
          <a key={t} className="fb-row" href={u} target="_blank" rel="noopener">
            <span className="fb-row__main"><span className="fb-row__title">{t}</span><span className="fb-row__sub">{u.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span></span>
            <span className="fb-row__side"><Icon as={ChevronRight} /></span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Application ---------- */
function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const { visited, markVisited, completedLabs, refreshLabs } = useProgress();

  const route = useRoute();
  const preview = isPreview();
  useEffect(() => { setMenu(false); }, [route.join("/")]);

  useEffect(() => {
    fetch("sessions.json", { cache: "no-cache" })
      .then(r => r.json())
      .then(setData)
      .catch(e => setErr(String(e)));
  }, []);

  useEffect(() => {
    if (data) document.title = data.course.code + " " + data.course.title;
  }, [data]);

  // Global keyboard shortcut for search ('/' or 'Ctrl+K' / 'Cmd+K')
  useEffect(() => {
    const onKey = e => {
      if ((e.key === "/" && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) || ((e.ctrlKey || e.metaKey) && e.key === "k")) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (err) return <div className="page"><div className="locked-box">Could not load sessions.json: {err}</div></div>;
  if (!data) return <div className="page" style={{ padding: "40px" }}>Loading portal…</div>;

  let view;
  switch (route[0]) {
    case "unit":
      view = <UnitPage data={data} n={+route[1]} preview={preview} visited={visited} />;
      break;
    case "s":
      view = <SessionView data={data} id={route[1]} preview={preview} markVisited={markVisited} visited={visited} />;
      break;
    case "labs":
      view = <LabsPage data={data} preview={preview} />;
      break;
    case "lab":
      view = <LabView data={data} id={route[1]} preview={preview} refreshLabs={refreshLabs} />;
      break;
    case "page":
      view = route[1] === "links" ? <LinksPage data={data} /> : <PageView key={"page" + route[1]} data={data} id={route[1]} list={data.pages} kind="page" preview={preview} />;
      break;
    case "sw":
      view = <PageView key={"sw" + route[1]} data={data} id={route[1]} list={data.software} kind="sw" preview={preview} />;
      break;
    default:
      view = <Home data={data} visited={visited} preview={preview} />;
  }

  return (
    <div className="fb-shell">
      <a className="fb-sr" href="#main-content" onClick={e => { e.preventDefault(); const m = document.getElementById("main-content"); if (m) m.focus(); }}>Skip to content</a>
      <SiteHeader data={data} onMenu={() => setMenu(true)} onSearch={() => setSearchOpen(true)} theme={theme} toggleTheme={toggleTheme} />
      {preview && <PreviewBar />}
      <main className="main" id="main-content" tabIndex={-1}>
        {view}
      </main>
      <MenuDrawer data={data} route={route} open={menu} close={() => setMenu(false)} preview={preview} visited={visited} />
      <SearchModal
        data={data}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        preview={preview}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
