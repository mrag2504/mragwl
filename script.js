// ========== STARS BACKGROUND ==========
function createStars() {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) return;

  const count = 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    star.style.animationDelay = `${Math.random() * 5}s`;
    starsContainer.appendChild(star);
  }
}

// ========== MOBILE MENU ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// ========== COMMENTS (LocalStorage) ==========
function getComments(postId) {
  return JSON.parse(localStorage.getItem('mrag_comments_' + postId) || '[]');
}

function saveComments(postId, comments) {
  localStorage.setItem('mrag_comments_' + postId, JSON.stringify(comments));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderComments(postId) {
  const list = document.getElementById('commentsList');
  if (!list) return;

  const comments = getComments(postId);

  if (comments.length === 0) {
    list.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
    return;
  }

  list.innerHTML = comments
    .slice()
    .reverse()
    .map(c => `
      <div class="comment-item">
        <div class="c-name">${escapeHtml(c.name)}</div>
        <div class="c-date">${escapeHtml(c.date)}</div>
        <div class="c-text">${escapeHtml(c.text)}</div>
      </div>
    `).join('');
}

function initComments() {
  const main = document.querySelector('main.post-page');
  if (!main) return;

  const postId = main.getAttribute('data-post-id');
  if (!postId) return;

  renderComments(postId);

  const form = document.getElementById('commentForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    if (!name || !text) return;

    const comments = getComments(postId);
    comments.push({
      id: Date.now(),
      name,
      text,
      date: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    saveComments(postId, comments);
    renderComments(postId);
    form.reset();
  });
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initComments();
});
