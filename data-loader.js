/* ============================================================
   PORTFOLIO DATA LOADER — Fetches portfolio-data.json,
   merges localStorage overrides, renders all sections.
   ============================================================ */

'use strict';

const STORAGE_KEY = 'vuk-portfolio-data';

async function loadPortfolioData() {
  let baseData = null;
  try {
    // Fetch base data from JSON file
    const res = await fetch('portfolio-data.json?v=' + Date.now());
    baseData = await res.json();
  } catch (e) {
    console.warn('[DataLoader] Failed to fetch portfolio-data.json (this is expected if running offline or via file://):', e);
  }

  // Merge with any localStorage overrides (from Admin Dashboard)
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const override = JSON.parse(stored);
      if (baseData) {
        return deepMerge(baseData, override);
      } else {
        console.log('[DataLoader] Falling back to localStorage data directly.');
        return override;
      }
    }
  } catch (e) {
    console.error('[DataLoader] localStorage error:', e);
  }

  return baseData;
}

function deepMerge(base, override) {
  if (!override) return base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (Array.isArray(override[key])) {
      result[key] = override[key];
    } else if (override[key] && typeof override[key] === 'object' && !Array.isArray(base[key])) {
      result[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

// ── Renderers ────────────────────────────────────────────────

function renderMeta(meta) {
  if (!meta) return;
  document.title = meta.title || document.title;
  const setMeta = (name, val) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
    el.content = val;
  };
  const setProp = (prop, val) => {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
    el.content = val;
  };
  if (meta.description) setMeta('description', meta.description);
  if (meta.keywords) setMeta('keywords', meta.keywords);
  if (meta.author) setMeta('author', meta.author);
  if (meta.ogTitle) setProp('og:title', meta.ogTitle);
  if (meta.ogDescription) setProp('og:description', meta.ogDescription);
}

function renderHero(hero) {
  if (!hero) return;

  // Badge
  const badge = document.getElementById('heroBadge');
  if (badge) badge.innerHTML = `<span class="badge-dot"></span>${hero.badge}`;

  // Name
  const nameEl = document.getElementById('heroName');
  if (nameEl) nameEl.innerHTML = `${hero.firstName}<br /><span class="name-highlight">${hero.lastName}</span>`;

  // Title static
  const titleStatic = document.getElementById('heroTitleStatic');
  if (titleStatic) titleStatic.textContent = hero.titleStatic || 'Senior ';

  // Tagline
  const tagline = document.getElementById('heroTagline');
  if (tagline) tagline.innerHTML = hero.tagline || '';

  // Description
  const desc = document.getElementById('heroDescription');
  if (desc) desc.innerHTML = hero.description || '';

  // Resume buttons
  document.querySelectorAll('.hero-resume-btn').forEach(btn => {
    btn.href = hero.resumeUrl || '#';
  });

  // Tech Stack
  const techBadges = document.getElementById('heroBadges');
  if (techBadges && hero.techStack) {
    techBadges.innerHTML = hero.techStack.map((t, i) =>
      `<span class="tech-badge" style="--delay:${(i + 1) * 0.1}s">${t.emoji} ${t.name}</span>`
    ).join('');
  }

  // Orbit nodes inner
  const ring1 = document.getElementById('orbitRing1');
  if (ring1 && hero.orbitInner) {
    ring1.innerHTML = hero.orbitInner.map((n, i) =>
      `<div class="orbit-node on-${i + 1}" style="--a:${n.angle}" data-tip="${n.tip}">${n.emoji}</div>`
    ).join('');
  }

  // Orbit nodes outer
  const ring2 = document.getElementById('orbitRing2');
  if (ring2 && hero.orbitOuter) {
    ring2.innerHTML = hero.orbitOuter.map((n, i) =>
      `<div class="orbit-node on-${i + 5}" style="--a:${n.angle}" data-tip="${n.tip}">${n.emoji}</div>`
    ).join('');
  }

  // Chips
  const chipsEl = document.getElementById('orbitChips');
  if (chipsEl && hero.chips) {
    chipsEl.innerHTML = hero.chips.map(c =>
      `<div class="orbit-chip chip-${c.pos}">
        <span class="chip-val">${c.value}</span>
        <span class="chip-lbl">${c.label}</span>
      </div>`
    ).join('');
  }

  // Typed words — update global array used by main.js
  if (hero.typedWords && window.__VUK_TYPED_WORDS !== undefined) {
    window.__VUK_TYPED_WORDS = hero.typedWords;
  }
}

function renderAbout(about) {
  if (!about) return;

  // Avatar initials
  document.querySelectorAll('.avatar-inner').forEach(el => { el.textContent = about.initials || 'VUK'; });

  // Status
  const statusEl = document.getElementById('aboutStatus');
  if (statusEl) statusEl.innerHTML = `<span class="status-dot"></span> ${about.status || 'Open to Work'}`;

  // Info items
  const infoEl = document.getElementById('aboutInfo');
  if (infoEl && about.infoItems) {
    infoEl.innerHTML = about.infoItems.map(item =>
      `<div class="info-item"><span class="info-icon">${item.icon}</span><span>${item.text}</span></div>`
    ).join('');
  }

  // Paragraphs
  const parasEl = document.getElementById('aboutParagraphs');
  if (parasEl && about.paragraphs) {
    parasEl.innerHTML = about.paragraphs.map(p => `<p class="about-para">${p}</p>`).join('');
  }

  // Highlights
  const hlEl = document.getElementById('aboutHighlights');
  if (hlEl && about.highlights) {
    hlEl.innerHTML = about.highlights.map(h =>
      `<div class="highlight-chip"><span>${h.emoji}</span> ${h.label}</div>`
    ).join('');
  }
}

function renderStats(stats) {
  if (!stats || !Array.isArray(stats)) return;
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  grid.innerHTML = stats.map((s, i) =>
    `<div class="stat-card reveal" data-delay="${i * 100}">
      <div class="stat-number" data-target="${s.value}" data-suffix="${s.suffix || ''}">${s.value}${s.suffix || ''}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-icon" aria-hidden="true">${s.icon}</div>
    </div>`
  ).join('');
}

function renderSkills(skills) {
  if (!skills) return;

  const catGrid = document.getElementById('skillsGrid');
  if (!catGrid) return;

  // Render categories
  let html = '';
  if (skills.categories) {
    html += skills.categories.map((cat, i) =>
      `<div class="skill-category reveal" data-delay="${i * 100}">
        <div class="skill-cat-header">
          <span class="skill-cat-icon">${cat.icon}</span>
          <h3>${cat.name}</h3>
        </div>
        <div class="skill-tags">
          ${cat.tags.map(t => `<span class="skill-tag tier-${t.tier}">${t.name}</span>`).join('')}
        </div>
      </div>`
    ).join('');
  }

  // Render proficiency bars as a final card in the same grid
  if (skills.proficiency) {
    const delay = (skills.categories ? skills.categories.length : 0) * 100;
    html += `<div class="skill-category reveal" data-delay="${delay}">
      <div class="skill-cat-header">
        <span class="skill-cat-icon">📊</span>
        <h3>Proficiency</h3>
      </div>
      <div class="skill-bars" id="skillBars">
        ${skills.proficiency.map(b =>
          `<div class="skill-bar-item">
            <div class="skill-bar-label"><span>${b.name}</span><span class="skill-pct">${b.pct}%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" data-width="${b.pct}" style="--bar-color: ${b.color}"></div></div>
          </div>`
        ).join('')}
      </div>
    </div>`;
  }

  catGrid.innerHTML = html;
}

function renderCertifications(certs) {
  if (!certs || !Array.isArray(certs)) return;
  const grid = document.getElementById('certsGrid');
  if (!grid) return;
  grid.innerHTML = certs.map((c, i) =>
    `<a class="cert-card reveal" data-delay="${i * 150}" href="${c.badgeUrl}" target="_blank" rel="noopener noreferrer" aria-label="Verify ${c.title} badge on Credly">
      <div class="cert-badge">
        <div class="cert-badge-inner">
          <span class="cert-aws-logo">${c.icon}</span>
          <span class="cert-badge-text">AWS</span>
        </div>
      </div>
      <div class="cert-body">
        <span class="cert-type">${c.type}</span>
        <h3 class="cert-title">${c.title}</h3>
        <p class="cert-subtitle">${c.subtitle}</p>
        <div class="cert-meta">
          <span class="cert-code">${c.code}</span>
          <span class="cert-year">${c.validity}</span>
          <span class="cert-verify">Verify Badge →</span>
        </div>
      </div>
      <div class="cert-shine"></div>
    </a>`
  ).join('');
}

function renderExperience(experience) {
  if (!experience || !Array.isArray(experience)) return;
  const timeline = document.getElementById('experienceTimeline');
  if (!timeline) return;
  timeline.innerHTML = experience.map((exp, i) => {
    const periodBadge = exp.current ? `<span class="tl-period-badge current">Current</span>` : '';
    const dateRange = exp.endDate === 'Present'
      ? `${exp.startDate} – Present`
      : `${exp.startDate} – ${exp.endDate}`;
    return `<div class="timeline-item reveal" data-delay="${i * 100}">
      <div class="timeline-dot"><span class="tl-dot-inner"></span></div>
      <div class="timeline-card">
        <div class="tl-card-header">
          <div class="tl-company-info">
            <div class="tl-company-logo ${exp.logoClass}">${exp.logoText}</div>
            <div>
              <h3 class="tl-company">${exp.company}</h3>
              <p class="tl-role">${exp.role}</p>
            </div>
          </div>
          <div class="tl-period">
            ${periodBadge}
            <span class="tl-dates">${dateRange}</span>
          </div>
        </div>
        <div class="tl-tags">
          ${exp.tags.map(t => `<span class="tl-tag">${t}</span>`).join('')}
        </div>
        <ul class="tl-bullets">
          ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    </div>`;
  }).join('');
}

function renderProjects(projects) {
  if (!projects || !Array.isArray(projects)) return;
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = projects.map((p, i) => {
    const featuredClass = p.featured ? ' featured-project' : '';
    const featuredLabel = p.featured ? `<div class="project-label">Featured</div>` : '';
    return `<div class="project-card reveal${featuredClass}" data-delay="${i * 150}">
      <div class="project-card-inner">
        <div class="project-header">
          <div class="project-icon">${p.icon}</div>
          <div class="project-links">
            <a href="${p.link || '#'}" class="project-link-btn" aria-label="View ${p.title} project" title="${p.title}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
        ${featuredLabel}
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <ul class="project-features">
          ${p.features.map(f => `<li>✅ ${f}</li>`).join('')}
        </ul>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="p-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCloud(cloud) {
  if (!cloud) return;

  // Icons
  const iconsEl = document.getElementById('cloudIcons');
  if (iconsEl && cloud.icons) {
    iconsEl.innerHTML = cloud.icons.map(ic =>
      `<div class="cloud-icon-item" data-tooltip="${ic.tooltip}">
        <div class="cloud-icon-circle ${ic.class}">${ic.emoji}</div>
        <span>${ic.name}</span>
      </div>`
    ).join('');
  }

  // Bars
  const barsEl = document.getElementById('cloudBars');
  if (barsEl && cloud.bars) {
    barsEl.innerHTML = cloud.bars.map(b =>
      `<div class="cloud-bar-item">
        <div class="cloud-bar-label"><span>${b.name}</span><span>${b.pct}%</span></div>
        <div class="cloud-bar-track"><div class="cloud-bar-fill" data-width="${b.pct}" style="--bar-color:${b.color}"></div></div>
      </div>`
    ).join('');
  }
}

function renderEducation(education) {
  if (!education || !Array.isArray(education)) return;
  const grid = document.getElementById('educationGrid');
  if (!grid) return;
  grid.innerHTML = education.map((e, i) =>
    `<div class="edu-card reveal" data-delay="${i * 150}">
      <div class="edu-icon">${e.icon}</div>
      <div class="edu-content">
        <div class="edu-degree-badge">${e.badge}</div>
        <h3 class="edu-degree">${e.degree}</h3>
        <p class="edu-school">${e.school}</p>
        <span class="edu-year">${e.startYear} – ${e.endYear}</span>
      </div>
      <div class="edu-glow"></div>
    </div>`
  ).join('');
}

function renderContact(contact) {
  if (!contact) return;

  const headingEl = document.getElementById('contactHeading');
  if (headingEl) headingEl.textContent = contact.heading || '';

  const textEl = document.getElementById('contactText');
  if (textEl) textEl.textContent = contact.text || '';

  const phoneEl = document.getElementById('contactPhone');
  if (phoneEl) {
    phoneEl.href = contact.phoneHref || `tel:${contact.phone}`;
    const val = phoneEl.querySelector('.contact-card-value');
    if (val) val.textContent = contact.phone || '';
  }

  const emailEl = document.getElementById('contactEmail');
  if (emailEl) {
    emailEl.href = `mailto:${contact.email}`;
    const val = emailEl.querySelector('.contact-card-value');
    if (val) val.textContent = contact.email || '';
  }

  const linkedinEl = document.getElementById('contactLinkedIn');
  if (linkedinEl) {
    linkedinEl.href = contact.linkedinUrl || '#';
    const val = linkedinEl.querySelector('.contact-card-value');
    if (val) val.textContent = contact.linkedinLabel || '';
  }
}

function renderFooter(footer) {
  if (!footer) return;
  const logoEl = document.getElementById('footerLogo');
  if (logoEl) logoEl.innerHTML = `<span class="logo-bracket">&lt;</span>${footer.initials || 'VUK'}<span class="logo-bracket">/&gt;</span>`;
  const nameEl = document.getElementById('footerName');
  if (nameEl) nameEl.textContent = footer.name || '';
  const taglineEl = document.getElementById('footerTagline');
  if (taglineEl) taglineEl.textContent = footer.tagline || '';
  const copyEl = document.getElementById('footerCopy');
  if (copyEl) copyEl.innerHTML = `&copy; ${footer.copyYear || new Date().getFullYear()} ${footer.name || ''}. All rights reserved.`;
}

// ── Re-initialize animations after dynamic render ─────────────
function reinitAnimations() {
  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // Counter animations
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        cObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));

  // Skill / cloud bars
  const fills = document.querySelectorAll('.skill-bar-fill, .cloud-bar-fill');
  const bObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 200);
        bObs.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => bObs.observe(f));

  // Tooltips
  document.querySelectorAll('[data-tooltip]').forEach(item => {
    if (item.querySelector('.vuk-tooltip')) return;
    item.style.position = 'relative';
    const tip = document.createElement('div');
    tip.className = 'vuk-tooltip';
    tip.textContent = item.dataset.tooltip;
    tip.style.cssText = `position:absolute;bottom:110%;left:50%;transform:translateX(-50%);background:#1E293B;color:#E2E8F0;padding:5px 12px;border-radius:6px;font-size:.75rem;font-weight:500;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s ease;border:1px solid rgba(255,255,255,.1);z-index:10;`;
    item.appendChild(tip);
    item.addEventListener('mouseenter', () => tip.style.opacity = '1');
    item.addEventListener('mouseleave', () => tip.style.opacity = '0');
  });

  // Timeline hover
  document.querySelectorAll('.timeline-item').forEach(item => {
    const card = item.querySelector('.timeline-card');
    const dot = item.querySelector('.timeline-dot');
    card?.addEventListener('mouseenter', () => {
      if (dot) { dot.style.transform = 'scale(1.3)'; dot.style.transition = 'transform 0.3s ease'; }
    });
    card?.addEventListener('mouseleave', () => { if (dot) dot.style.transform = 'scale(1)'; });
  });

  // Project tilt
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
      const rotY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const startTime = performance.now();
  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Main init ─────────────────────────────────────────────────
async function initPortfolio() {
  const data = await loadPortfolioData();
  if (!data) {
    console.error('[DataLoader] No data loaded.');
    return;
  }

  renderMeta(data.meta);
  renderHero(data.hero);
  renderAbout(data.about);
  renderStats(data.stats);
  renderSkills(data.skills);
  renderCertifications(data.certifications);
  renderExperience(data.experience);
  renderProjects(data.projects);
  renderCloud(data.cloud);
  renderEducation(data.education);
  renderContact(data.contact);
  renderFooter(data.footer);

  // Re-init typed words if main.js already ran
  if (data.hero && data.hero.typedWords) {
    window.__VUK_TYPED_WORDS = data.hero.typedWords;
  }

  // Small delay to ensure DOM is painted before animation observers attach
  setTimeout(reinitAnimations, 50);

  console.log('%c [DataLoader] Portfolio content loaded from JSON ', 'background:#10B981;color:white;padding:2px 8px;border-radius:4px;');
}

// ── Live reload: listen for Admin Dashboard saves ─────────────
// The `storage` event fires on OTHER tabs when localStorage changes.
// This means: when admin saves, the portfolio tab updates instantly.
window.addEventListener('storage', async (e) => {
  if (e.key === STORAGE_KEY) {
    console.log('[DataLoader] Admin saved changes — re-rendering portfolio...');
    await initPortfolio();
  }
});

// BroadcastChannel for same-tab preview (fallback)
try {
  const bc = new BroadcastChannel('vuk-admin-save');
  bc.onmessage = async (e) => {
    if (e.data === 'save') {
      console.log('[DataLoader] BroadcastChannel: re-rendering...');
      await initPortfolio();
    }
  };
  window.__VUK_BC = bc;
} catch(e) { /* BroadcastChannel not supported — that's fine */ }

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
