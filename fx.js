/* ============================================================
   Builds the page from data.js and runs all interactions.
   You never need to edit this file to change content.
   ============================================================ */
(function () {
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const esc = s => String(s ?? "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const cap = s => String(s || "").replace(/^./, c => c.toUpperCase());
  const ext = 'target="_blank" rel="noopener"';
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  /* ================= generative tile art =================
     Every picture on the site is drawn from a seed (a name), so the same
     project always gets the same art, and new projects get new art for free.
     Colours are theme variables, so art recolours with the theme. */
  function rng(seed) {
    let h = 1779033703 ^ seed.length;
    for (const ch of seed) { h = Math.imul(h ^ ch.charCodeAt(0), 3432918353); h = h << 13 | h >>> 19; }
    return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  const FG = ["var(--a1)", "var(--a2)", "var(--a3)", "var(--ink)"];
  const BG = ["var(--card)", "var(--soft)", "var(--bg)"];
  function tile(r, x, y, s) {
    const pick = a => a[r() * a.length | 0];
    const fg = pick(FG), bg = pick(BG), rot = (r() * 4 | 0) * 90, h = s / 2;
    const f = `style="fill:${fg}"`;
    const shapes = [
      `<circle cx="${h}" cy="${h}" r="${s * .4}" ${f}/>`,
      `<path d="M0 ${s}A${h} ${h} 0 0 1 ${s} ${s}Z" ${f}/>`,
      `<path d="M0 ${s}L0 0A${s} ${s} 0 0 1 ${s} ${s}Z" ${f}/>`,
      `<rect x="${s * .2}" y="${s * .2}" width="${s * .6}" height="${s * .6}" rx="${s * .06}" ${f}/>`,
      `<path d="M0 0L${s} 0L0 ${s}Z" ${f}/>`,
      [0.18, 0.43, 0.68].map(k => `<rect x="${s * .14}" y="${s * k}" width="${s * .72}" height="${s * .13}" rx="${s * .06}" ${f}/>`).join(""),
      `<circle cx="${h}" cy="${h}" r="${s * .14}" ${f}/><circle cx="${h}" cy="${h}" r="${s * .34}" style="fill:none;stroke:${fg};stroke-width:${s * .07}"/>`,
      `<path d="M0 0A${s} ${s} 0 0 0 ${s} ${s}L0 ${s}Z" ${f}/><circle cx="${s * .72}" cy="${s * .28}" r="${s * .14}" style="fill:${pick(FG)}"/>`
    ];
    return `<g class="tile" transform="translate(${x} ${y})"><rect width="${s}" height="${s}" style="fill:${bg}"/>` +
      `<g transform="rotate(${rot} ${h} ${h})"><g class="tile-in">${shapes[r() * shapes.length | 0]}</g></g></g>`;
  }
  function art(seed, cols, rows, s) {
    const r = rng(seed); let out = "";
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) out += tile(r, i * s, j * s, s);
    return out;
  }
  const glyph = (seed, px) => `<svg viewBox="0 0 100 100" width="${px}" height="${px}" style="border-radius:inherit;display:block">${art(seed, 2, 2, 50)}</svg>`;

  /* ================= content ================= */
  const P = (window.PROJECTS || []).filter(p => !p.hide), LIMIT = window.PROJECTS_VISIBLE || 6;

  // nav + menu
  $("brand-mark").innerHTML = `<svg viewBox="0 0 100 100">${art(ME.name, 2, 2, 50)}</svg>`;
  $("brand-name").textContent = ME.name;
  $("menu-aside").innerHTML = `
    <div><p>Say hello</p><a href="mailto:${esc(ME.email)}">${esc(ME.email)}</a></div>
    <div><p>Elsewhere</p><a href="${ME.github}" ${ext}>GitHub ↗</a><a href="${ME.linkedin}" ${ext}>LinkedIn ↗</a>${ME.resume ? `<a href="${ME.resume}" ${ext}>Résumé ↗</a>` : ""}</div>`;

  // hero
  $("status").textContent = cap(ME.status);
  let ci = 0;
  const words = (ME.name + ".").split(" ");
  $("name").innerHTML = words.map((w, wi) => `<span style="white-space:nowrap">${[...w].map((c, k) =>
    `<span class="c${wi === words.length - 1 && k === w.length - 1 ? " dot" : ""}" style="--i:${ci++}">${esc(c)}</span>`).join("")}</span>`).join(" ");
  $("name").setAttribute("aria-label", ME.name);
  const [first, ...rest] = String(ME.role).split(" ");
  $("role").innerHTML = `<span class="mark">${esc(first)}<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 13C40 5 85 17 128 9S182 5 197 12"/></svg></span> ${esc(rest.join(" "))}`;
  $("intro").textContent = ME.intro;
  if (ME.resume) $("hero-resume").href = ME.resume; else $("hero-resume").remove();
  const artSvg = $("art-svg");
  artSvg.innerHTML = art(ME.name + " art", 4, 5, 100);
  (ME.focus || []).slice(0, 3).forEach(t => $("art").insertAdjacentHTML("beforeend", `<span class="sticker">${esc(t)}</span>`));

  // skills band
  const items = [...new Set((window.SKILLS || []).flatMap(g => g.items))];
  const row = items.map(s => `<span>${esc(s)}</span><b></b>`).join("");
  $("band").innerHTML = row + row + row;

  // section glyphs
  document.querySelectorAll(".glyph[data-seed]").forEach(g => g.innerHTML = glyph(g.dataset.seed, 46));

  // about
  $("about-text").innerHTML = (window.ABOUT || []).map((p, i) => i === 0
    ? `<p class="big rv" id="statement">${esc(p).split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ")}</p>`
    : `<p class="rv" style="--d:${i * 90}ms">${esc(p)}</p>`).join("");
  $("facts").innerHTML = [["Role", ME.role], ["Company", ME.org], ["Experience", ME.years], ["Based in", ME.base]]
    .filter(r => r[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("");
  $("elsewhere").innerHTML = `<a class="btn" href="${ME.github}" ${ext}>GitHub <span class="ar">↗</span></a><a class="btn" href="${ME.linkedin}" ${ext}>LinkedIn <span class="ar">↗</span></a>`;

  // experience
  const X = window.EXPERIENCE || [];
  const yrs = X.flatMap(j => (j.when.match(/\d{4}/g) || []).map(Number));
  if (yrs.length) $("xp-span").textContent = `${Math.min(...yrs)} → ${X[0] && /present/i.test(X[0].when) ? "now" : Math.max(...yrs)}`;
  $("tl").insertAdjacentHTML("beforeend", X.map((j, i) => `<div class="job rv" style="--d:${i * 60}ms"><div class="card">
    <div class="top"><h3>${esc(j.role)}</h3><span class="when">${esc(j.when)}</span></div>
    <div class="org">${esc(j.org)}${j.place ? ` <span>· ${esc(j.place)}</span>` : ""}</div>
    ${j.line ? `<p>${esc(j.line)}</p>` : ""}
    <div class="pills">${j.type ? `<span class="type">${esc(j.type)}</span>` : ""}${(j.tags || []).map(t => `<span class="pill">${esc(t)}</span>`).join("")}</div>
  </div></div>`).join(""));

  // skills tree
  $("branches").innerHTML = (window.SKILLS || []).map((g, i) => `<div class="branch" data-b="${i}">
    <div class="gnode" style="--ld:${300 + i * 120}ms">${esc(g.group)}</div><div class="leaves">${g.items.map((x, j) =>
      `<span class="leaf" style="--ld:${480 + i * 120 + j * 55}ms">${esc(x)}</span>`).join("")}</div></div>`).join("");

  // projects
  $("proj-count").textContent = `${P.length} project${P.length === 1 ? "" : "s"}`;
  $("proj-grid").innerHTML = P.map((p, i) => {
    const main = p.demo || p.code;
    return `<article class="proj rv${i >= LIMIT ? " hidden" : ""}" style="--d:${(i % 3) * 90}ms;--tilt:${[-3, 2, -2][i % 3]}deg">
      ${main ? `<a class="cover-link" href="${main}" ${ext} aria-label="${esc(p.name)}"></a>` : ""}
      <span class="cover"><svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art(p.name, 8, 3, 50)}</svg></span>
      <div class="bd">
        <div class="meta"><span>${p.year ? esc(p.year) : (p.demo ? "Live project" : "Open source")}</span>${main ? `<span class="go">↗</span>` : ""}</div>
        <h3>${esc(p.name)}</h3><p>${esc(p.line)}</p>
        ${p.stack && p.stack.length ? `<div class="pills">${p.stack.map(s => `<span class="pill">${esc(s)}</span>`).join("")}</div>` : ""}
        ${p.code && p.demo ? `<div class="links"><a class="ul" href="${p.code}" ${ext}>Code</a><a class="ul" href="${p.demo}" ${ext}>Live demo</a></div>` : ""}
      </div></article>`;
  }).join("");
  $("more").innerHTML = (P.length > LIMIT ? `<button class="btn" id="showall">Show all ${P.length}</button>` : "") +
    `<a class="btn" href="${ME.github}" ${ext}>More on GitHub <span class="ar">↗</span></a>`;
  if ($("showall")) $("showall").onclick = e => {
    document.querySelectorAll(".proj.hidden").forEach((c, i) => {
      c.classList.remove("hidden"); c.style.setProperty("--d", (i % 3) * 90 + "ms");
      requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("in")));
    });
    e.currentTarget.remove();
  };

  // recognition
  const R = window.RECOGNITION || [];
  if (!R.length) $("recognition").remove();
  else $("rec").innerHTML = R.map((r, i) => `<div class="award rv" style="--d:${i * 90}ms;--rot:${[-7, 5, -4, 7][i % 4]}deg">${r.when ? `<span class="yr">${esc(r.when)}</span>` : `<span class="yr">&nbsp;</span>`}<b>${esc(r.what)}</b><small>${esc(r.who)}</small></div>`).join("");

  // contact + footer
  $("contact-art").innerHTML = art("contact", 3, 3, 100);
  $("contact-text").textContent = `I'm ${ME.status}. If you're hiring or building something with LLMs, I'd like to hear about it.`;
  $("mail").href = "mailto:" + ME.email; $("mail").textContent = ME.email;
  $("contact-soc").innerHTML = `<a class="btn" href="${ME.linkedin}" ${ext}>LinkedIn <span class="ar">↗</span></a><a class="btn" href="${ME.github}" ${ext}>GitHub <span class="ar">↗</span></a>${ME.resume ? `<a class="btn" href="${ME.resume}" ${ext}>Résumé <span class="ar">↗</span></a>` : ""}`;
  $("copyright").textContent = `© ${new Date().getFullYear()} ${ME.name}`;

  /* ================= interactions ================= */

  // theme switcher
  const setTheme = t => {
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
    document.querySelectorAll("[data-t]").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === t));
  };
  const themes = $("themes");
  const menuThemes = themes.cloneNode(true); menuThemes.id = ""; menuThemes.classList.add("menu-themes");
  $("menu-aside").appendChild(menuThemes);
  document.addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) setTheme(b.dataset.t); });
  setTheme(root.dataset.theme || "paper");

  // full-screen menu, opening as a circle from the button
  const menuBtn = $("menu-btn");
  const setMenu = open => {
    const r = menuBtn.getBoundingClientRect();
    $("overlay").style.setProperty("--ox", r.left + r.width / 2 + "px");
    $("overlay").style.setProperty("--oy", r.top + r.height / 2 + "px");
    root.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    $("overlay").setAttribute("aria-hidden", !open);
    $("menu-label").textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn.onclick = () => setMenu(!root.classList.contains("menu-open"));
  $("overlay").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  // copy email
  $("copy").onclick = async () => {
    const b = $("copy");
    try { await navigator.clipboard.writeText(ME.email); }
    catch (e) { const t = document.createElement("textarea"); t.value = ME.email; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (_) {} t.remove(); }
    b.textContent = "Copied ✓"; b.classList.add("ok");
    setTimeout(() => { b.textContent = "Copy email"; b.classList.remove("ok"); }, 1800);
  };

  // local time clock
  const city = String(ME.base || "").split(",")[0];
  const tick = () => {
    try { $("clock").textContent = `${city} · ${new Intl.DateTimeFormat("en-IN", { timeZone: ME.timezone || "Asia/Kolkata", hour: "numeric", minute: "2-digit" }).format(new Date())}`; }
    catch (e) { $("clock").textContent = city; }
  };
  tick(); setInterval(tick, 30000);

  // hero entrance
  document.fonts.ready.then(() => {
    root.classList.add("go");
    setTimeout(() => root.classList.add("settled"), reduce ? 0 : 250 + ci * 45 + 900);
  });

  // reveal on scroll
  const reveal = el => {
    el.classList.add("in");
    setTimeout(() => el.style.setProperty("--d", "0ms"), 1300);
    // once the tree has grown, hover responds instantly
    if (el.id === "tree") setTimeout(() => el.classList.add("settled-tree"), reduce ? 0 : 2400);
  };
  if (reduce || !("IntersectionObserver" in window)) document.querySelectorAll(".rv").forEach(reveal);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".rv").forEach(el => io.observe(el));
  }

  // skills tree: curved branches from the root to each group, then along each group's items
  const tree = $("tree"), wires = $("tree-wires");
  function drawTree() {
    if (getComputedStyle(wires).display === "none") return;
    const T = tree.getBoundingClientRect();
    const box = el => { const r = el.getBoundingClientRect(); return { l: r.left - T.left, r: r.right - T.left, t: r.top - T.top, b: r.bottom - T.top, cy: r.top - T.top + r.height / 2 }; };
    const rt = box(tree.querySelector(".root"));
    const curve = (x1, y1, x2, y2) => { const dx = Math.max(30, (x2 - x1) * .5); return `M${x1} ${y1}C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`; };
    let out = "", n = 0;
    tree.querySelectorAll(".branch").forEach((br, bi) => {
      const g = box(br.querySelector(".gnode"));
      out += `<path class="wire" data-b="${bi}" pathLength="1" style="--wd:${n++ * 70}ms" d="${curve(rt.r, rt.cy, g.l, g.cy)}"/>`;
      let prev = null;
      br.querySelectorAll(".leaf").forEach(lf => {
        const l = box(lf);
        const d = !prev || Math.abs(l.cy - prev.cy) > 4 ? curve(g.r, g.cy, l.l, l.cy) : `M${prev.r} ${prev.cy}L${l.l} ${l.cy}`;
        out += `<path class="wire" data-b="${bi}" pathLength="1" style="--wd:${n++ * 40}ms" d="${d}"/>`;
        prev = l;
      });
    });
    wires.innerHTML = out;
  }
  tree.addEventListener("pointerover", e => {
    const br = e.target.closest(".branch"); if (!br) return;
    tree.classList.add("dim");
    tree.querySelectorAll(".branch").forEach(b => b.classList.toggle("on", b === br));
    wires.querySelectorAll(".wire").forEach(w => w.classList.toggle("lit", w.dataset.b === br.dataset.b));
  });
  tree.addEventListener("pointerleave", () => {
    tree.classList.remove("dim");
    tree.querySelectorAll(".branch.on").forEach(b => b.classList.remove("on"));
    wires.querySelectorAll(".wire.lit").forEach(w => w.classList.remove("lit"));
  });

  // hero art: a tile quietly changes every couple of seconds; pauses off-screen
  if (!reduce) {
    let seedN = 0, artVisible = true;
    new IntersectionObserver(es => artVisible = es[0].isIntersecting).observe($("art"));
    setInterval(() => {
      if (!artVisible || document.hidden) return;
      const tiles = artSvg.querySelectorAll(".tile"); if (!tiles.length) return;
      const old = tiles[Math.random() * tiles.length | 0];
      const m = old.getAttribute("transform").match(/translate\(([\d.]+) ([\d.]+)\)/);
      const tmp = document.createElementNS("http://www.w3.org/2000/svg", "g");
      tmp.innerHTML = tile(rng("swap" + seedN++), +m[1], +m[2], 100);
      const nu = tmp.firstChild; nu.style.opacity = 0;
      old.after(nu);
      requestAnimationFrame(() => requestAnimationFrame(() => nu.style.opacity = 1));
      setTimeout(() => old.remove(), 950);
    }, 2200);
  }

  /* ---------- scroll-driven bits, batched into one frame ---------- */
  const nav = $("nav"), prog = $("prog"), band = $("band"), tl = $("tl"), fill = $("tl-fill");
  const jobs = [...document.querySelectorAll(".job")];
  const artEl = $("art"), stickers = [...document.querySelectorAll(".sticker")];
  const glyphs = [...document.querySelectorAll(".sh .glyph")];
  const statement = $("statement"), sWords = statement ? [...statement.querySelectorAll(".w")] : [];
  const cards = [...document.querySelectorAll(".proj")];
  const box = document.querySelector(".contact .box");
  let lastY = scrollY, ticking = false, bandW = 0, drift = 0;
  const measure = () => { bandW = band.scrollWidth / 3; drawTree(); };
  function frame() {
    ticking = false;
    const y = scrollY, H = innerHeight;
    nav.classList.toggle("solid", y > 10);
    if (!root.classList.contains("menu-open")) nav.classList.toggle("hide", !reduce && y > H * .7 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove("hide");
    lastY = y;
    const max = document.documentElement.scrollHeight - H;
    prog.style.setProperty("--p", max > 0 ? clamp(y / max) : 0);
    const r = tl.getBoundingClientRect();
    const k = reduce ? 1 : clamp((H * .6 - r.top) / (r.height - 16));
    fill.style.setProperty("--tp", k);
    jobs.forEach(j => j.classList.toggle("hit", j.offsetTop + 30 <= k * (r.height - 16) + 8));
    if (reduce) return;

    // hero: the art drifts slower than the page and tilts; the labels float at their own speeds
    // (only on wide screens: on phones the art sits below the text and would drift into the next section)
    const wide = innerWidth > 980;
    if (y < H * 1.3 || !wide) {
      artEl.style.setProperty("--art-y", wide ? y * .18 + "px" : "0px");
      artEl.style.setProperty("--art-r", wide ? Math.min(10, y * .012) + "deg" : "0deg");
      stickers.forEach((s, i) => s.style.setProperty("--st-y", wide ? -y * (.1 + i * .09) + "px" : "0px"));
    }

    // section icons turn as they pass through the screen
    glyphs.forEach(g => {
      const gr = g.getBoundingClientRect();
      if (gr.bottom > -50 && gr.top < H + 50) g.style.setProperty("--gr", ((gr.top - H / 2) / H) * -140 + "deg");
    });

    // about: the statement lights up word by word as you read
    if (statement) {
      const sr = statement.getBoundingClientRect();
      const sk = clamp((H * .82 - sr.top) / (sr.height + H * .3));
      const n = Math.round(sk * sWords.length);
      sWords.forEach((w, i) => w.classList.toggle("on", i < n));
    }

    // projects: each cover shifts a little inside its frame
    cards.forEach(c => {
      const cr = c.getBoundingClientRect();
      if (cr.bottom > 0 && cr.top < H) c.style.setProperty("--py", ((cr.top + cr.height / 2) - H / 2) * -.07 + "px");
    });

    // contact: the card grows into place and its art turns
    if (box) {
      const br = box.getBoundingClientRect();
      const bk = clamp((H - br.top) / (H * .65));
      box.style.setProperty("--cs", .9 + bk * .1);
      box.style.setProperty("--cr", (1 - bk) * -70 + "deg");
    }
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", request, { passive: true });
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { measure(); request(); }, 120); });
  document.fonts.ready.then(() => { measure(); request(); });
  measure(); frame();

  // the band drifts on its own and speeds along with the scroll
  if (!reduce) {
    let last = performance.now(), visible = true;
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe(band.parentElement);
    (function loop(now) {
      const dt = Math.min(64, now - last); last = now;
      if (visible && bandW) { drift = (drift + dt * .03) % bandW; band.style.transform = `translate3d(${-((scrollY * .35 + drift) % bandW)}px,0,0)`; }
      requestAnimationFrame(loop);
    })(last);
  }
})();
