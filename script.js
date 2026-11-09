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
