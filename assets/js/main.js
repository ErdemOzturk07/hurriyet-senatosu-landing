/* Hürriyet Senatosu landing v2 — vanilla JS, tracker yok */
const CONFIG = {
  APPLY_URL: "https://hursenato.com/", // platform başvuru adresi (?ref= bu adrese eklenir)
  LOGIN_URL: "https://hursenato.com/", // platform giriş ekranı
  STORE_URL: "{{STORE_URL}}",
  VSL_URL: "assets/video/vsl.mp4?v=7", // yerel mp4 (dosya yolu) veya YouTube linki
  REF_PARAM: "ref", // platform farklı parametre adı kullanıyorsa burayı değiştir
  POPUP_DELAY_MS: 12000, // davet pop-up'ı gecikmesi (ms). Demo için URL'ye ?popup=8 yaz: 8 sn.
};

function isPlaceholder(v) {
  return !v || v.indexOf("{{") !== -1;
}

function currentRef() {
  try {
    const q = new URLSearchParams(window.location.search);
    const r = (q.get(CONFIG.REF_PARAM) || "").trim();
    return /^[A-Za-z0-9-]{1,32}$/.test(r) ? r : "";
  } catch { return ""; }
}

function withRef(url, ref) {
  if (isPlaceholder(url) || !ref) return url;
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set(CONFIG.REF_PARAM, ref);
    return u.toString();
  } catch { return url; }
}

function youtubeId(url) {
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return m ? m[1] : "";
}

document.addEventListener("DOMContentLoaded", () => {
  const ref = currentRef();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Ref parametresini linklere taşı (cookie/localStorage'a yazma) ---------- */
  document.querySelectorAll("[data-apply-link]").forEach((a) => {
    if (!isPlaceholder(CONFIG.APPLY_URL)) a.href = withRef(CONFIG.APPLY_URL, ref);
  });
  document.querySelectorAll("[data-login-link]").forEach((a) => {
    if (!isPlaceholder(CONFIG.LOGIN_URL)) a.href = CONFIG.LOGIN_URL;
  });
  document.querySelectorAll('a[href="{{STORE_URL}}"]').forEach((a) => {
    if (!isPlaceholder(CONFIG.STORE_URL)) a.href = CONFIG.STORE_URL;
  });
  if (ref) {
    const note = document.getElementById("refNote");
    if (note) note.hidden = false;
  }
  /* Doldurulmamış {{YER_TUTUCU}} linkler kırık kalmasın.
     Cümle içindeyse metin kalır, link devre dışı olur; tek başınaysa (footer gibi) gizlenir.
     Gerçek değeri yazdığın anda link normale döner. */
  document.querySelectorAll('a[href*="{{"]').forEach((a) => {
    if (a.closest("p, li, dd, figcaption")) {
      a.removeAttribute("href");
      a.classList.add("link-off");
    } else {
      a.hidden = true;
    }
  });

  /* ---------- Hamburger menü ---------- */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Aktif bölüm vurgusu (scrollspy) ---------- */
  (function scrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const links = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
    if (!links.length) return;
    const map = new Map();
    links.forEach((a) => {
      const sec = document.querySelector(a.getAttribute("href"));
      if (sec) map.set(sec, a);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) => l.removeAttribute("aria-current"));
            const a = map.get(en.target);
            if (a) a.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    map.forEach((_a, sec) => io.observe(sec));
  })();

  /* ---------- VSL: dikey (short-form) oynatıcı + kendi kontrol şeridi ---------- */
  const video = document.getElementById("vslVideo");
  const source = document.getElementById("vslSource");
  const play = document.getElementById("vslPlay");
  const soon = document.getElementById("vslSoon");
  const fallback = document.getElementById("vslFallback");
  const frame = document.getElementById("vslFrame");
  const vslBarEl = document.getElementById("vslBar");
  const tgl = document.getElementById("vslToggle");
  const glyph = document.getElementById("vslToggleGlyph");
  const prog = document.getElementById("vslProg");
  const timeEl = document.getElementById("vslTime");

  const mmss = (s) => {
    const v = Math.max(0, Math.floor(Number(s) || 0));
    return Math.floor(v / 60) + ":" + String(v % 60).padStart(2, "0");
  };

  // YouTube IFrame API'si yalnızca kullanıcı oynat'a basınca yüklenir (sayfa açılışında üçüncü taraf istek yok)
  const loadYouTubeApi = (cb) => {
    if (window.YT && window.YT.Player) { cb(); return; }
    const q = window.__ytQueue || (window.__ytQueue = []);
    q.push(cb);
    window.onYouTubeIframeAPIReady = () => {
      const list = window.__ytQueue || [];
      window.__ytQueue = [];
      list.forEach((fn) => { try { fn(); } catch { /* yoksay */ } });
    };
    if (!document.querySelector("script[data-yt-api]")) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.setAttribute("data-yt-api", "");
      s.onerror = () => { if (soon) { play.hidden = true; soon.hidden = false; } };
      document.head.appendChild(s);
    }
  };

  if (video && source && play && soon && frame) {
    const hasVideo = !isPlaceholder(CONFIG.VSL_URL);
    const ytId = hasVideo ? youtubeId(CONFIG.VSL_URL) : "";
    const st = { player: null, t: 0, dur: 0, playing: false, drag: false };
    let ticker = 0;

    if (hasVideo && fallback) fallback.href = CONFIG.VSL_URL;
    video.removeAttribute("controls"); // kontrol şeridi bizde

    const paint = () => {
      if (timeEl) timeEl.textContent = mmss(st.t) + " / " + (st.dur ? mmss(st.dur) : "--:--");
      if (prog) {
        const pct = st.dur ? (st.t / st.dur) * 100 : 0;
        prog.value = String(st.dur ? Math.min(100, pct) : 0);
        prog.style.setProperty("--p", pct.toFixed(2) + "%");
        prog.setAttribute("aria-valuetext", mmss(st.t) + " / " + (st.dur ? mmss(st.dur) : "--:--"));
      }
    };

    const setToggle = (isPlaying) => {
      st.playing = isPlaying;
      if (glyph) glyph.textContent = isPlaying ? "❙❙" : "▶";
      if (tgl) {
        tgl.setAttribute("aria-pressed", isPlaying ? "false" : "true");
        tgl.setAttribute("aria-label", isPlaying ? "Duraklat" : "Oynat");
      }
    };

    const showBar = () => { if (vslBarEl) vslBarEl.hidden = false; };

    const doSeek = (t) => {
      st.t = Math.max(0, Math.min(st.dur || 0, t));
      paint();
      if (st.player && st.player.seekTo) { try { st.player.seekTo(st.t, true); } catch { /* hazır değil */ } }
      else if (source.src) video.currentTime = st.t;
    };

    // YouTube tarafında süreyi/konumu düzenli aralıkla oku
    const startTick = (player) => {
      if (ticker) return;
      ticker = window.setInterval(() => {
        if (st.drag) return;
        try {
          const d = player.getDuration();
          if (d && d > 0) st.dur = d;
          st.t = player.getCurrentTime() || 0;
          paint();
        } catch { /* yoksay */ }
      }, 400);
    };

    if (prog) {
      prog.addEventListener("pointerdown", () => { st.drag = true; });
      prog.addEventListener("input", () => {
        st.drag = true;
        st.t = (Number(prog.value) / 100) * (st.dur || 0);
        paint();
      });
      prog.addEventListener("change", () => {
        st.drag = false;
        doSeek((Number(prog.value) / 100) * (st.dur || 0));
      });
    }

    if (tgl) {
      tgl.addEventListener("click", () => {
        if (st.player && st.player.playVideo) {
          try { st.playing ? st.player.pauseVideo() : st.player.playVideo(); } catch { /* hazır değil */ }
        } else if (source.src) {
          st.playing ? video.pause() : video.play().catch(() => {});
        }
      });
    }

    const linkCaption = () => {
      const cap = document.getElementById("vslCaption");
      if (!cap) return;
      cap.textContent = "";
      const a = document.createElement("a");
      a.href = CONFIG.VSL_URL;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Kaynağı YouTube'da aç ↗";
      cap.appendChild(a);
    };

    if (!hasVideo) {
      // Video kaynağı yok: poster kalır, oynat'a basınca "yakında" notu görünür
      play.addEventListener("click", () => {
        play.hidden = true;
        soon.hidden = false;
      });
    } else if (ytId) {
      // Gizlilik dostu: YouTube'a yalnızca "oynat"a basılınca bağlanılır.
      // Kontrol şeridi bizde olduğu için oynatıcı controls=0 ile gömülür.
      play.addEventListener("click", () => {
        video.style.display = "none";
        play.hidden = true;
        frame.classList.add("is-playing");
        showBar();
        linkCaption();
        setToggle(true);

        const mount = document.createElement("div");
        mount.id = "vslYt";
        frame.appendChild(mount);

        loadYouTubeApi(() => {
          if (!window.YT || !window.YT.Player) return;
          st.player = new window.YT.Player(mount, {
            videoId: ytId,
            host: "https://www.youtube-nocookie.com",
            playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
            events: {
              onReady: (e) => {
                const d = e.target.getDuration();
                if (d && d > 0) st.dur = d;
                paint();
                try { e.target.playVideo(); } catch { /* yoksay */ }
                startTick(e.target);
              },
              onStateChange: (e) => {
                // 1 oynuyor, 3 tampon, 2 duraklatıldı, 0 bitti
                if (e.data === 1 || e.data === 3) setToggle(true);
                if (e.data === 0 || e.data === 2) setToggle(false);
              },
            },
          });
        });
      });
    } else {
      // Doğrudan video dosyası (mp4 vb.) — üçüncü taraf yok.
      // Dosya, "oynat"a basılana kadar indirilmez (preload=none + tembel yükleme).
      const capEl = document.getElementById("vslCaption");
      const spin = document.getElementById("vslSpin");
      const setCap = (txt) => { if (capEl) capEl.textContent = txt; };
      const showSpin = (on) => { if (spin) spin.hidden = !on; };

      const ensureSrc = () => {
        if (!source.src && !video.getAttribute("src")) {
          source.src = CONFIG.VSL_URL;
          video.load();
        }
      };

      video.addEventListener("loadedmetadata", () => {
        if (video.duration && isFinite(video.duration)) { st.dur = video.duration; paint(); }
        if (st.dur) setCap("Tanıtım videosu · " + mmss(st.dur));
      });
      video.addEventListener("timeupdate", () => {
        if (st.drag) return;
        st.t = video.currentTime;
        if (!st.dur && video.duration) st.dur = video.duration;
        paint();
      });
      video.addEventListener("play", () => {
        play.hidden = true;
        soon.hidden = true;
        frame.classList.add("is-playing");
        setToggle(true);
        showBar();
      });
      video.addEventListener("playing", () => {
        showSpin(false);
        if (st.dur) setCap("Tanıtım videosu · " + mmss(st.dur));
      });
      video.addEventListener("waiting", () => {
        if (!video.paused) { showSpin(true); setCap("Video yükleniyor…"); }
      });
      video.addEventListener("pause", () => setToggle(false));
      video.addEventListener("ended", () => { setToggle(false); showSpin(false); });
      video.addEventListener("error", () => {
        showSpin(false);
        play.hidden = true;
        soon.textContent = "Video şu an yüklenemedi. Bağlantını kontrol edip tekrar dene.";
        soon.hidden = false;
      });
      // Oynarken videoya tıkla → duraklat / devam
      video.addEventListener("click", () => {
        if (video.paused) { video.play().catch(() => {}); } else { video.pause(); }
      });
      play.addEventListener("click", () => {
        ensureSrc();
        setCap("Video yükleniyor…");
        video.play().catch(() => {
          showSpin(false);
          play.hidden = true;
          soon.textContent = "Video şu an yüklenemedi. Bağlantını kontrol edip tekrar dene.";
          soon.hidden = false;
        });
      });
    }
  }

  /* ---------- Davet pop-up'ı: VSL'e dokunmayan ziyaretçiye ~12 sn sonra bir kez ---------- */
  (function davetPopup() {
    const dlg = document.getElementById("davet");
    if (!dlg || typeof dlg.showModal !== "function") return;
    const kapatBtn = document.getElementById("davetKapat");
    // Gösterildi mi? Yalnızca sekme oturumunda hatırlanır (çerez/localStorage kullanılmaz).
    const goruldu = () => { try { return sessionStorage.getItem("hs_davet") === "1"; } catch { return false; } };
    const isaretle = () => { try { sessionStorage.setItem("hs_davet", "1"); } catch {} };
    if (goruldu()) return;
    // Demo kolaylığı: ?popup=8 → 8 saniye sonra göster (1-120 sn)
    const demoSn = (() => {
      try {
        const n = parseInt(new URLSearchParams(window.location.search).get("popup") || "", 10);
        return n >= 1 && n <= 120 ? n * 1000 : 0;
      } catch { return 0; }
    })();
    // VSL'e dokunulduysa (oynat düğmesi, video oynatma veya duraklat düğmesi) davet gösterilmez.
    let vslDokunuldu = false;
    const dokun = () => { vslDokunuldu = true; };
    if (video) video.addEventListener("play", dokun);
    if (play) play.addEventListener("click", dokun);
    if (tgl) tgl.addEventListener("click", dokun);

    const kapat = () => { if (dlg.open) dlg.close(); };
    const ac = () => {
      if (goruldu() || vslDokunuldu) return;
      if (video && !video.paused && !video.ended) return; // video oynuyorsa dokunma
      isaretle();
      dlg.showModal();
      document.body.classList.add("popup-acik");
    };
    if (kapatBtn) kapatBtn.addEventListener("click", kapat);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) kapat(); }); // arka plana tıklayınca kapan
    dlg.addEventListener("close", () => document.body.classList.remove("popup-acik"));
    dlg.querySelectorAll("[data-apply-link]").forEach((a) => a.addEventListener("click", isaretle));

    setTimeout(() => {
      if (document.visibilityState === "hidden") {
        document.addEventListener("visibilitychange", function gor() {
          document.removeEventListener("visibilitychange", gor);
          ac();
        });
      } else { ac(); }
    }, demoSn || CONFIG.POPUP_DELAY_MS || 12000);
  })();

  /* ---------- Sorun şeridi: kesintisiz (sonsuz) döngü ---------- */
  const track = document.getElementById("tickerTrack");
  if (track) {
    const base = track.innerHTML;
    // Yarım tur (translateX(-50%)) bandı her zaman dolduracak kadar çoğalt,
    // kopya sayısı çift olsun ki iki yarım birebir aynı olsun.
    const band = track.parentElement;
    const unit = Math.max(1, track.scrollWidth);
    let copies = Math.max(2, Math.ceil((band.clientWidth * 2) / unit) + 1);
    if (copies % 2) copies++;
    for (let i = 1; i < copies; i++) track.innerHTML += base;
    // Hızı sabitle: ~70 px/sn
    const halfWidth = (copies / 2) * unit;
    track.style.animationDuration = Math.max(12, halfWidth / 70).toFixed(1) + "s";
    track.style.animationPlayState = reduced ? "paused" : "running";
  }

  /* ---------- Sayaç animasyonu (16 / 5.000) ---------- */
  (function counters() {
    const els = Array.from(document.querySelectorAll("[data-count]"));
    if (!els.length) return;
    const fmt = new Intl.NumberFormat("tr-TR");
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduced) { el.textContent = fmt.format(target); return; }
      const dur = 1000;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt.format(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
          });
        },
        { threshold: 0.6 }
      );
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach(animate);
    }
  })();

  /* ---------- 16 imzacı görseli: sırayla doldur ---------- */
  (function sigGrid() {
    const grid = document.getElementById("sigGrid");
    if (!grid) return;
    const cells = Array.from(grid.children).filter((li) => !li.classList.contains("is-you"));
    if (!cells.length) return;
    const fill = () => cells.forEach((c, i) => setTimeout(() => c.classList.add("on"), reduced ? 0 : 90 * i));
    if (!reduced && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => { if (e.isIntersecting) { fill(); io.disconnect(); } });
        },
        { threshold: 0.4 }
      );
      io.observe(grid);
    } else {
      fill();
    }
  })();

  /* ---------- Çözüm filtresi ---------- */
  (function filters() {
    const chips = Array.from(document.querySelectorAll(".chip[data-filter]"));
    const cards = Array.from(document.querySelectorAll(".cards article[data-tags]"));
    const status = document.getElementById("filterStatus");
    if (!chips.length || !cards.length) return;
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        chips.forEach((c) => {
          const active = c === chip;
          c.classList.toggle("is-active", active);
          c.setAttribute("aria-pressed", active ? "true" : "false");
        });
        const f = chip.dataset.filter;
        let shown = 0;
        cards.forEach((card) => {
          const show = f === "all" || card.dataset.tags.split(" ").includes(f);
          const yeniGorunecek = show && card.classList.contains("hide");
          card.classList.toggle("hide", !show);
          card.classList.remove("pop");
          if (show) {
            shown++;
            card.classList.add("in"); // reveal animasyonuyla çakışmasın
            // Yalnızca yeni görünenler animasyonla gelsin; ekranda duranlar
            // yeniden oynamasın (geçişte gecikme hissi yaratıyordu).
            if (yeniGorunecek) {
              void card.offsetWidth;
              card.classList.add("pop");
            }
          }
        });
        if (status) status.textContent = shown + " çözüm gösteriliyor.";
      })
    );
  })();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    ".hero-grid > div, .hero-card, .section h2, .section-sub, .lede, .lede-light, " +
    ".hero-pledge, .steps li, .cards article, .feature-grid li, .trust-list li, .timeline div, " +
    ".hero-media, .hero-welcome, .vsl-frame, .manifesto p, #sss details, .final-cta .cta-row, " +
    ".filters, .sig-grid, .card-tag, .milestones li, .neq-grid li, " +
    ".chain li, .glossary div, .sub-h, .manifesto-note"
  );
  if ("IntersectionObserver" in window && !reduced) {
    // Reveal için verilen gecikme kalıcı kalırsa hover/filtre animasyonlarına da
    // bulaşıyor (gecikmeli tepki). Reveal bitince inline gecikme temizlenir.
    const clearDelay = (el) => {
      if (!el.style.transitionDelay) return;
      const d = parseFloat(el.style.transitionDelay) || 0;
      window.setTimeout(() => { el.style.transitionDelay = ""; }, d + 700);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
            clearDelay(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => {
      el.setAttribute("data-reveal", "");
      const sibs = Array.from(el.parentNode.children);
      const i = sibs.indexOf(el);
      if (i > 0 && sibs.length > 2) el.style.transitionDelay = Math.min(i, 6) * 70 + "ms";
      io.observe(el);
    });

    // Emniyet kemeri: çok hızlı kaydırmada gözden kaçan öğeler görünür alandaysa aç
    let revealT = 0;
    const revealSafety = () => {
      revealEls.forEach((el) => {
        if (el.classList.contains("in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.96 && r.bottom > -40) {
          el.classList.add("in");
          clearDelay(el);
        }
      });
    };
    window.addEventListener("scroll", () => {
      if (revealT) return;
      revealT = window.setTimeout(() => { revealT = 0; revealSafety(); }, 160);
    }, { passive: true });
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Header gölgesi + okuma çubuğu + başa dön ---------- */
  const header = document.getElementById("ust");
  const bar = document.getElementById("progress");
  const toTop = document.getElementById("toTop");
  let ticking = false;
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", h.scrollTop > 600);
    if (header) header.classList.toggle("scrolled", h.scrollTop > 8);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    );
  }

  /* ---------- Sticky CTA: final bölümünde gizle ---------- */
  const sticky = document.querySelector(".sticky-cta");
  const fin = document.querySelector(".final-cta");
  if (sticky && fin && "IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => entries.forEach((e) => sticky.classList.toggle("hide", e.isIntersecting)),
      { threshold: 0.2 }
    ).observe(fin);
  }

  /* ---------- Yıl ---------- */
  const y = document.getElementById("yil");
  if (y) y.textContent = String(new Date().getFullYear());
});
