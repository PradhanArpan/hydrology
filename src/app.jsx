import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { renderMd, enhance, esc } from "./md.js";
import { WIDGETS } from "./widgets.jsx";
import { ILLOS } from "./illos.jsx";
import { Menu, Search, Sun, Moon, X, Check, Printer, Calculator, Lock, FlaskConical, ChevronRight } from "lucide-react";

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
const UB = ["", "u1b", "u2b", "u3b", "u4b", "u5b"];
const ROMAN = ["", "I", "II", "III", "IV", "V"];
const SOFT = { "HEC-HMS": "hms", "HEC-RAS": "ras", "QGIS": "gis", "Spreadsheet": "sheet" };
const Chip = ({ s }) => <span className={"chip " + (SOFT[s] || "other")}>{s}</span>;

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

function Toc({ heads }) {
  if (!heads || !heads.length) return null;
  return (
    <div className="rail-box">
      <h5>On this tab</h5>
      <div className="pad">
        {heads.map(h => (
          <a key={h.id} href="#" className={h.lv === "H3" ? "h3" : ""} onClick={e => jump(e, h.id)}>
            {h.t}
          </a>
        ))}
      </div>
    </div>
  );
}

function UnitRail({ data, unit, cur, preview, visited }) {
  const ss = data.sessions.filter(s => s.unit === unit);
  return (
    <div className="rail-box">
      <h5>Unit {ROMAN[unit]} sessions</h5>
      <div className="pad">
        {ss.map(s => {
          const isVisited = visited && visited.includes(s.id);
          return (
            <a key={s.id} href={"#/s/" + s.id} className={(s.id === cur ? "cur " : "") + (s.enabled || preview ? "" : "lock")}>
              <span className="d">{s.id}</span>
              <span style={{ flex: 1 }}>{s.title}</span>
              {isVisited && <span style={{ color: "var(--green)", fontSize: 11, marginLeft: 4 }}>✓</span>}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function LabRail({ data, ids, cur, preview, title }) {
  const ls = (ids ? ids.map(id => data.labs.find(l => l.id === id)) : data.labs).filter(Boolean);
  if (!ls.length) return null;
  return (
    <div className="rail-box">
      <h5>{title}</h5>
      <div className="pad">
        {ls.map(l => (
          <a key={l.id} href={"#/lab/" + l.id} className={(l.id === cur ? "cur " : "") + (l.enabled || preview ? "" : "lock")}>
            <span className="d">{l.id}</span>
            {l.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function SoftRail({ data, cur }) {
  return (
    <div className="rail-box">
      <h5>Meet the software</h5>
      <div className="pad">
        {data.software.map(p => (
          <a key={p.id} href={"#/sw/" + p.id} className={p.id === cur ? "cur" : ""}>
            <span className="d">{p.ni}</span>
            {p.title}
          </a>
        ))}
      </div>
    </div>
  );
}

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
          </div>
          <div className="fb-drawer__group">
            <p className="fb-drawer__label">Data and software links</p>
            {data.links.map(([t, u]) => (
              <a key={t} className="fb-drawer__link" href={u} target="_blank" rel="noopener">{t}</a>
            ))}
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
  useEffect(() => {
    if (!rail) { setShownTool(null); return; }
    const slots = [...rail.querySelectorAll(".fb-tool")].filter(el => el.dataset.tab === String(tab));
    const topId = "t" + tab + "-top";
    const match = slots.find(el => el.dataset.section === (active || topId));
    rail.querySelectorAll(".fb-tool").forEach(el => (el.hidden = el !== match));
    setShownTool(match ? match.dataset.sectionTitle || "This session" : null);
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
    </div>
  );
}
/* ---------- Home ---------- */
function Home({ data, visited, completedLabs }) {
  const open = data.sessions.filter(s => s.enabled).length;
  const lopen = data.labs.filter(l => l.enabled).length;
  const visCount = visited ? visited.length : 0;
  const totalVisPercent = Math.round((visCount / Math.max(1, open)) * 100);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1>Course Delivery Hub</h1>
          <div className="hook">{data.course.title} · {data.course.programme}</div>
        </div>
        <div className="ph-tag">{data.course.code} · 2026–27</div>
      </div>

      <div className="progress-banner">
        <div className="pb-left">
          <b>Your Learning Progress</b>
          <span>
            {visCount} of {open} released theory sessions visited · {completedLabs} software labs underway
          </span>
        </div>
        <div className="pb-bar-wrap">
          <div className="pb-bar-bg">
            <div className="pb-bar-fill" style={{ width: `${Math.min(100, totalVisPercent)}%` }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--g400)", marginTop: 4, textAlign: "right" }}>
            {totalVisPercent}% theory explored
          </div>
        </div>
      </div>

      <div className="inst-box">
        <div>
          <div className="ib-lbl">⚙ Instructor — to release a session before class</div>
          <div className="ib-text">
            Edit <code>sessions.json</code> on GitHub → change <code>"enabled": false</code> to <code>"enabled": true</code> (theory sessions and labs are listed separately) → Commit. Students refresh after about a minute.
          </div>
        </div>
        <a className="edit-btn" href={REPO + "/edit/main/sessions.json"} target="_blank" rel="noopener">
          ⚙ Edit sessions.json →
        </a>
      </div>

      <div className="stat-grid">
        <div className="stat"><div className="sv">{open}</div><div className="sl">Theory sessions open</div></div>
        <div className="stat"><div className="sv">{lopen}</div><div className="sl">Labs open</div></div>
        <div className="stat"><div className="sv">{data.sessions.length}</div><div className="sl">Total sessions</div></div>
        <div className="stat"><div className="sv">{data.labs.length}</div><div className="sl">Software labs</div></div>
      </div>

      <div className="flow">
        <div>
          <i>01 · BEFORE CLASS</i>
          <b>Read the Theory</b>
          <span>Notes, slide figures, solved numericals and interactive tools — everything examinable.</span>
        </div>
        <div>
          <i>02 · IN CLASS</i>
          <b>Concept by hand</b>
          <span>A short worked problem or data exercise so the numbers mean something.</span>
        </div>
        <div>
          <i>03 · IN CLASS · LAB TRACK</i>
          <b>Same idea in software</b>
          <span>Step-by-step HEC-HMS / QGIS / HEC-RAS lab that rebuilds what you computed.</span>
        </div>
      </div>

      <div className="sec-title">Units — click to view sessions</div>
      {data.units.map(u => {
        const ss = data.sessions.filter(s => s.unit === u.n);
        const openInUnit = ss.filter(s => s.enabled).length;
        const visInUnit = ss.filter(s => visited && visited.includes(s.id)).length;
        return (
          <a key={u.n} className="unc" href={"#/unit/" + u.n}>
            <div className="unc-l">
              <div className={"unc-badge " + UB[u.n]}>U{u.n}</div>
              <div>
                <div className="unc-title">{u.title}</div>
                <div className="unc-sub">
                  Days {ss[0].day}–{ss[ss.length - 1].day} · {u.co} · {openInUnit} of {ss.length} open
                  {visInUnit > 0 && ` · ${visInUnit} visited`}
                </div>
              </div>
            </div>
            <div className="unc-r">{u.hours} HRS →</div>
          </a>
        );
      })}

      <a className="unc" href="#/labs">
        <div className="unc-l">
          <div className="unc-badge ulb">LAB</div>
          <div>
            <div className="unc-title">Software lab track — HEC-HMS, QGIS, HEC-RAS</div>
            <div className="unc-sub">
              Step-by-step labs that run in parallel with the theory · {lopen} of {data.labs.length} open
            </div>
          </div>
        </div>
        <div className="unc-r">PARALLEL →</div>
      </a>
    </div>
  );
}

/* ---------- Unit page ---------- */
function Status({ on, rel }) {
  return on ? <span className="s-open">OPEN</span> : <span className="s-lock">{rel ? "OPENS " + rel : "LOCKED"}</span>;
}

function UnitPage({ data, n, preview, visited }) {
  const u = data.units.find(x => x.n === n);
  if (!u) return <div className="page">Unit not found.</div>;
  const ss = data.sessions.filter(s => s.unit === n);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="crumb"><a href="#/">CE633</a> / Unit {ROMAN[n]}</div>
          <h1>Unit {n} — {u.title}</h1>
        </div>
        <div className="ph-tag">Days {ss[0].day}–{ss[ss.length - 1].day}</div>
      </div>

      <div className="unit-hero">
        <div>
          <div className="uh-num">Unit {ROMAN[n]} · {u.co}</div>
          <div className="uh-name">{u.title}</div>
          <div className="uh-syl">{u.syllabus}</div>
        </div>
        <div className="uh-right">
          <span className="hrs-badge">{String(u.hours).padStart(2, "0")} Hours</span>
          <span className={"co-badge " + UB[n]}>{u.co}</span>
        </div>
      </div>

      <div className="tw">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 56 }}>Day</th>
              <th>Topic &amp; hook</th>
              <th>Theory</th>
              <th>Software lab</th>
              <th style={{ width: 92 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {ss.map(s => {
              const can = s.enabled || preview;
              const labs = (s.labs || []).map(id => data.labs.find(l => l.id === id)).filter(Boolean);
              const isVis = visited && visited.includes(s.id);

              return (
                <tr key={s.id} className={s.enabled ? "" : "locked"}>
                  <td>
                    <span className="day-num">{String(s.day).padStart(2, "0")}</span>
                  </td>
                  <td>
                    <div className="t-topic">
                      {s.title} {isVis && <span style={{ color: "var(--green)", fontSize: 12 }}>✓</span>}
                    </div>
                    <div className="t-hook">{s.hook}</div>
                    <div style={{ marginTop: 4 }}>
                      {(s.software || []).map(x => <Chip key={x} s={x} />)}
                    </div>
                  </td>
                  <td>
                    {can ? (
                      <a className="lnk theory" href={"#/s/" + s.id}>
                        ▶ {s.ready ? "Open notes" : "Outline"}
                      </a>
                    ) : (
                      <span className="locked-pill">🔒 locked</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-row">
                      {labs.length ? (
                        labs.map(l =>
                          l.enabled || preview ? (
                            <a key={l.id} className="lnk lab" href={"#/lab/" + l.id}>
                              {l.id}
                            </a>
                          ) : (
                            <span key={l.id} className="locked-pill">{l.id}</span>
                          )
                        )
                      ) : s.lab ? (
                        <span style={{ color: "var(--g600)", fontSize: 11, fontStyle: "italic" }} title={s.lab}>
                          {s.lab.length > 32 ? s.lab.slice(0, 30) + "…" : s.lab}
                        </span>
                      ) : (
                        <span style={{ color: "var(--g400)", fontSize: 11 }}>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Status on={s.enabled} rel={s.release} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {preview && (
        <p className="footer-note">
          Instructor preview is on: locked sessions are viewable in this browser tab.
        </p>
      )}
    </div>
  );
}

/* ---------- Lab track page ---------- */
function LabsPage({ data, preview }) {
  const groups = [...new Set(data.labs.map(l => l.unit))];

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="crumb"><a href="#/">CE633</a> / Labs</div>
          <h1>Software lab track</h1>
        </div>
        <div className="ph-tag">HEC-HMS · QGIS · HEC-RAS</div>
      </div>

      <div className="unit-hero">
        <div>
          <div className="uh-num">Runs in parallel with the theory</div>
          <div className="uh-name">Learn the software one step at a time</div>
          <div className="uh-syl">
            Each lab is a sequence of small steps: what to click, what you should see, and what to do if it goes wrong. Labs build on each other — one HEC-HMS project grows through the semester — so do them in order. The "With theory" column shows which theory session each lab accompanies.
          </div>
        </div>
        <div className="uh-right">
          <a className="edit-btn" href="#/page/setup">Install software →</a>
        </div>
      </div>

      <div className="sec-title">Meet the software first</div>
      <div className="softcards">
        {data.software.map(p => (
          <a key={p.id} className="softcard" href={"#/sw/" + p.id} style={{ borderTopColor: p.color }}>
            <i>{p.when}</i>
            <b>{p.title}</b>
            <span>{p.hook}</span>
          </a>
        ))}
      </div>

      {groups.map(g => (
        <div key={g}>
          <div className="sec-title">Unit {ROMAN[g]} labs</div>
          <div className="tw">
            <table className="t">
              <thead>
                <tr>
                  <th style={{ width: 56 }}>Lab</th>
                  <th>What you will do</th>
                  <th>Software</th>
                  <th>With theory</th>
                  <th>Open</th>
                  <th style={{ width: 92 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.labs
                  .filter(l => l.unit === g)
                  .map(l => {
                    const can = l.enabled || preview;
                    return (
                      <tr key={l.id} className={l.enabled ? "" : "locked"}>
                        <td><span className="day-num">{l.id}</span></td>
                        <td>
                          <div className="t-topic">{l.title}</div>
                          <div className="t-hook">{l.goal}</div>
                        </td>
                        <td>{l.software.map(x => <Chip key={x} s={x} />)}</td>
                        <td>
                          <div className="btn-row">
                            {l.sessions.map(s => (
                              <a key={s} className="lnk theory" href={"#/s/" + s}>{s}</a>
                            ))}
                          </div>
                        </td>
                        <td>
                          {can ? (
                            <a className="lnk lab" href={"#/lab/" + l.id}>
                              ▶ Start · {l.minutes} min
                            </a>
                          ) : (
                            <span className="locked-pill">🔒 locked</span>
                          )}
                        </td>
                        <td><Status on={l.enabled} rel={l.release} /></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
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

function StepCard({ st, k, n, all, done, toggle, setCur, setDone }) {
  return (
    <div className="stepcard">
      <div className="sh">
        <div className="n">{k + 1}</div>
        <h3>{st.title}</h3>
      </div>
      <div className="sb2">
        <Content md={st.md} />
      </div>
      {!all && (
        <div className="sf">
          <button className="btn ghost" disabled={k === 0} onClick={() => setCur(k - 1)}>
            ← Back
          </button>
          <label>
            <input type="checkbox" checked={done.includes(k)} onChange={() => toggle(k)} />
            I have completed this step
          </label>
          {k < n - 1 ? (
            <button
              className="btn"
              onClick={() => {
                if (!done.includes(k)) setDone([...done, k]);
                setCur(k + 1);
              }}
            >
              Done — next step →
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                if (!done.includes(k)) setDone([...done, k]);
                const o = document.getElementById("lab-outro");
                if (o) o.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Finish lab ✓
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LabView({ data, id, preview, refreshLabs }) {
  const l = data.labs.find(x => x.id === id);
  const src = useText(l && (l.enabled || preview) ? l.file : null);
  const key = "ce633-lab-" + id;
  const [cur, setCur] = useState(0);
  const [done, setDone] = useState([]);
  const [all, setAll] = useState(false);

  useEffect(() => {
    const st = store(key) || {};
    setCur(st.cur || 0);
    setDone(st.done || []);
    setAll(false);
  }, [id]);

  useEffect(() => {
    store(key, { cur, done });
    if (refreshLabs) refreshLabs();
  }, [cur, done]);

  if (!l) return <div className="page"><div className="locked-box">Lab not found.</div></div>;

  const { intro, steps, outro } = src ? parseLab(src) : { steps: [] };
  const vis = data.labs.filter(x => x.enabled || preview);
  const i = vis.findIndex(x => x.id === id);
  const prev = vis[i - 1];
  const next = vis[i + 1];
  const toggle = k => setDone(done.includes(k) ? done.filter(x => x !== k) : [...done, k]);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="crumb"><a href="#/">CE633</a> / <a href="#/labs">Lab track</a> / {l.id}</div>
          <h1>{l.title}</h1>
          <div className="hook">{l.goal}</div>
          <div className="sess-meta">
            {l.software.map(x => <Chip key={x} s={x} />)}
            <span className="chip other">≈ {l.minutes} min</span>
            {l.sessions.map(s => (
              <a key={s} className="lnk theory" href={"#/s/" + s}>Theory {s}</a>
            ))}
            {!l.enabled && <span className="chip other">locked · instructor preview</span>}
          </div>
          <div className="topnav">
            {prev && <a href={"#/lab/" + prev.id}>← {prev.id}: {prev.title.slice(0, 24)}…</a>}
            <a href="#/labs">All labs</a>
            {next && <a href={"#/lab/" + next.id}>{next.id}: {next.title.slice(0, 24)}… →</a>}
          </div>
        </div>
        <div className="ph-tag">{l.id}</div>
      </div>

      {!l.enabled && !preview ? (
        <div className="locked-box">
          <p style={{ fontSize: 28, marginBottom: 8 }}>🔒</p>
          <p style={{ fontWeight: 600 }}>This lab has not been released yet.</p>
        </div>
      ) : !src ? (
        <p style={{ padding: "30px 0" }}>Loading lab guide…</p>
      ) : (
        <>
          <Content md={intro} />
          {steps.length > 0 && (
            <div className="lab-wrap">
              <div className="steplist">
                <div className="pg">
                  {done.length} / {steps.length} steps completed
                  <div className="bar">
                    <i style={{ width: (100 * done.length) / steps.length + "%" }} />
                  </div>
                </div>
                {steps.map((st, k) => (
                  <button
                    key={k}
                    className={(k === cur && !all ? "cur " : "") + (done.includes(k) ? "done" : "")}
                    onClick={() => {
                      setAll(false);
                      setCur(k);
                    }}
                  >
                    <span className="dot">{done.includes(k) ? "✓" : k + 1}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{st.title}</span>
                  </button>
                ))}
                <div style={{ padding: "8px 14px 0" }}>
                  <button className="btn ghost" style={{ width: "100%" }} onClick={() => setAll(!all)}>
                    {all ? "One step at a time" : "Show all steps"}
                  </button>
                </div>
                {done.length > 0 && (
                  <div style={{ padding: "6px 14px 0" }}>
                    <button
                      className="btn ghost"
                      style={{ width: "100%" }}
                      onClick={() => {
                        setDone([]);
                        setCur(0);
                      }}
                    >
                      Reset progress
                    </button>
                  </div>
                )}
              </div>
              <div>
                {all ? (
                  <div className="allsteps">
                    {steps.map((st, k) => (
                      <StepCard
                        key={id + k}
                        st={st}
                        k={k}
                        n={steps.length}
                        all={all}
                        done={done}
                        toggle={toggle}
                        setCur={setCur}
                        setDone={setDone}
                      />
                    ))}
                  </div>
                ) : (
                  (() => {
                    const k = Math.min(cur, steps.length - 1);
                    return (
                      <StepCard
                        key={id + k}
                        st={steps[k]}
                        k={k}
                        n={steps.length}
                        all={all}
                        done={done}
                        toggle={toggle}
                        setCur={setCur}
                        setDone={setDone}
                      />
                    );
                  })()
                )}
              </div>
            </div>
          )}
          <div id="lab-outro">
            <Content md={outro} />
          </div>
          <div className="pager">
            {prev ? (
              <a href={"#/lab/" + prev.id}>
                <small>← PREVIOUS LAB</small>
                {prev.id} · {prev.title}
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={"#/lab/" + next.id} style={{ textAlign: "right" }}>
                <small>NEXT LAB →</small>
                {next.id} · {next.title}
              </a>
            ) : (
              <span />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function PageView({ data, id, list, kind }) {
  const p = list.find(x => x.id === id);
  const src = useText(p && p.file);
  const [heads, setHeads] = useState([]);

  if (!p) return <div className="page">Page not found.</div>;

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="crumb">
            <a href="#/">CE633</a> / {kind === "sw" ? <a href="#/labs">Software</a> : "Course"} / {p.title}
          </div>
          <h1>{p.title}</h1>
          <div className="hook">{p.hook}</div>
        </div>
        <div className="ph-tag">{kind === "sw" ? "SOFTWARE" : data.course.code}</div>
      </div>
      <div className="with-rail">
        <div>{src ? <Content md={src} onHeads={setHeads} /> : "Loading…"}</div>
        <aside className="rail">
          {kind === "sw" ? (
            <>
              <SoftRail data={data} cur={id} />
              <LabRail data={data} title="Lab track" />
            </>
          ) : (
            <div className="rail-box">
              <h5>Course pages</h5>
              <div className="pad">
                {data.pages.map(q => (
                  <a key={q.id} href={"#/page/" + q.id} className={q.id === id ? "cur" : ""}>
                    <span className="d">{q.ni}</span>
                    {q.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          <Toc heads={heads} />
        </aside>
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
      view = <PageView data={data} id={route[1]} list={data.pages} kind="page" />;
      break;
    case "sw":
      view = <PageView key={"sw" + route[1]} data={data} id={route[1]} list={data.software} kind="sw" />;
      break;
    default:
      view = <Home data={data} visited={visited} completedLabs={completedLabs} />;
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
