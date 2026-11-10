
// ========== Minecraft-style REAL page loader ==========
(function mcBootLoader() {
  const tips = [
    "Tame wolves show their health with the position of their tail. Feed them meat to heal them.",
    "Sleep in a bed to set your respawn point and skip the night.",
    "Obsidian is made when water touches a lava source block.",
    "Sneak (shift) near edges to avoid falling off.",
    "A compass always points to your original world spawn.",
    "Use a water bucket to break long falls safely.",
    "MrAG Hub: Updates, Web Games, and Play With Us — all in one place.",
    "Host your friends on Minecraft Bedrock from the Play With Us section.",
  ];
  const statuses = [
    "Initializing server",
    "Loading spawn area",
    "Preparing dimension",
    "Loading resources",
    "Building terrain",
    "Almost ready",
    "Entering world",
  ];

  function $(id) { return document.getElementById(id); }

  function setProgress(p, status) {
    p = Math.max(0, Math.min(100, Math.round(p)));
    var bar = $("mcBar");
    var pct = $("mcPercent");
    var st = $("mcStatus");
    if (bar) bar.style.width = p + "%";
    if (pct) pct.textContent = p + "%";
    if (status && st) st.textContent = status;
  }

  var finished = false;
  function hideLoader() {
    if (finished) return;
    finished = true;
    setProgress(100, "Entering world");
    document.body.classList.remove("mc-loading");
    var el = $("mcLoader");
    if (!el) return;
    el.classList.add("mc-done");
    el.setAttribute("aria-busy", "false");
    setTimeout(function () { try { el.remove(); } catch (e) {} }, 600);
  }

  function bootBody() {
    // Only lock scroll when the Minecraft loader UI exists (home page)
    if (document.body && document.getElementById("mcLoader")) {
      document.body.classList.add("mc-loading");
    }
  }
  bootBody();
  document.addEventListener("DOMContentLoaded", bootBody);

  document.addEventListener("DOMContentLoaded", function () {
    var tipEl = $("mcTip");
    if (tipEl) tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];

    // Skip lazy images — they may never fire "load" until scrolled into view
    var imgs = Array.prototype.slice.call(document.images || []).filter(function (img) {
      return (img.getAttribute("loading") || "").toLowerCase() !== "lazy";
    });
    var total = imgs.length;
    var loaded = 0;
    var progress = 0;
    var statusIdx = 0;

    function paint() {
      if (finished) return;
      setProgress(progress, statuses[Math.min(statusIdx, statuses.length - 1)]);
    }

    function oneDone() {
      loaded += 1;
      if (total > 0) {
        var imgPart = (loaded / total) * 55;
        if (imgPart > progress) progress = imgPart;
        paint();
      }
    }

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) oneDone();
      else {
        img.addEventListener("load", oneDone, { once: true });
        img.addEventListener("error", oneDone, { once: true });
      }
    });

    var advance = setInterval(function () {
      if (finished) { clearInterval(advance); return; }
      progress = Math.min(progress + 4, 90);
      if (progress > 20) statusIdx = Math.max(statusIdx, 1);
      if (progress > 35) statusIdx = Math.max(statusIdx, 2);
      if (progress > 50) statusIdx = Math.max(statusIdx, 3);
      if (progress > 65) statusIdx = Math.max(statusIdx, 4);
      if (progress > 80) statusIdx = Math.max(statusIdx, 5);
      paint();
    }, 160);

    function finish() {
      if (finished) return;
      clearInterval(advance);
      progress = 100;
      statusIdx = statuses.length - 1;
      paint();
      setTimeout(hideLoader, 220);
    }

    if (document.readyState === "complete") {
      setTimeout(finish, 250);
    } else {
      window.addEventListener("load", function () { setTimeout(finish, 180); });
    }
    // Hard cap — never stick
    setTimeout(finish, 3500);
  });
})();


// MrAG — sidebar navigation + helpers

const titles = {
  home: 'Home',
  updates: 'Updates',
  games: 'Web Games',
  play: 'Play With Us',
  about: 'About'
};

function showSection(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('panel-active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const panel = document.getElementById(id);
  if (panel) panel.classList.add('panel-active');

  const nav = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (nav) nav.classList.add('active');

  const title = document.getElementById('topbarTitle');
  if (title) title.textContent = titles[id] || 'MrAG';

  // close mobile sidebar
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNav() {
  document.querySelectorAll('.nav-item[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-section');
      history.replaceState(null, '', '#' + id);
      showSection(id);
    });
  });

  // quick cards on home
  document.querySelectorAll('a.quick-card[href^="#"], a.btn[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      if (document.getElementById(id)?.classList.contains('panel') || document.getElementById(id)?.classList.contains('panel-active') !== undefined) {
        if (document.getElementById(id) && document.getElementById(id).classList.contains('panel')) {
          e.preventDefault();
          history.replaceState(null, '', href);
          showSection(id);
        }
      }
    });
  });

  // hash on load
  const hash = (location.hash || '#home').slice(1);
  if (document.getElementById(hash)) showSection(hash);
  else showSection('home');
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

window.copyId = function (btn, id) {
  const done = () => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1800);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(id).then(done).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = id;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    done();
  }
};


// ---------- Web Games lightning: permanent, mobile-visible ----------
function initLightning() {
  document.querySelector('.nav-item[data-section="games"]')?.classList.add('lightning-on');
  // No mouseenter/mouseleave: effects are always visible on every device.
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initLightning();
});
