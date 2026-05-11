/* ===================================================
   PORTFOLIO — main.js
   Abdelrahman Ashraf | Data Analyst & AI Automation
   =================================================== */

/* ===== 1. CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.borderColor = 'rgba(0,212,255,0.8)';
    ring.style.transform  += ' scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.borderColor = 'rgba(0,212,255,0.4)';
  });
});

/* ===== 2. SCROLL REVEAL ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===== 3. MOBILE MENU ===== */
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

navToggle.addEventListener('click',   () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== 4. CONTACT FORM (EmailJS) ===== */
/* Contact form using FormSubmit — no account needed */
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMsg');

  const name    = document.getElementById('fromName').value.trim();
  const email   = document.getElementById('fromEmail').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    msg.textContent = '❌ Please fill all fields.';
    msg.className   = 'form-feedback error';
    return;
  }

  btn.textContent = '⏳ Sending...';
  btn.disabled    = true;

  try {
    const res = await fetch('https://formsubmit.co/ajax/abdelrahmanwork68@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:    name,
        email:   email,
        subject: subject,
        message: message,
        _subject: '📩 New message from Portfolio: ' + subject,
        _template: 'table',
        _captcha:  'false'
      })
    });

    const data = await res.json();

    if (data.success === 'true' || data.success === true) {
      msg.textContent = '✅ Message sent! I will reply within 24 hours.';
      msg.className   = 'form-feedback success';
      document.getElementById('contactForm').reset();
    } else {
      throw new Error('failed');
    }
  } catch {
    msg.textContent = '❌ Failed to send. Email me directly: abdelrahmanwork68@gmail.com';
    msg.className   = 'form-feedback error';
  } finally {
    btn.textContent = 'Send Message ✉️';
    btn.disabled    = false;
  }
});

/* ===== 5. ADMIN PROJECTS — localStorage ===== */
const STORAGE_KEY = 'aa_portfolio_projects';

const BG_MAP = {
  blue:   'linear-gradient(135deg,#001a3a,#003d7a)',
  purple: 'linear-gradient(135deg,#1a0030,#3d006b)',
  green:  'linear-gradient(135deg,#001a10,#003d25)',
  orange: 'linear-gradient(135deg,#1a0a00,#4a2000)',
  red:    'linear-gradient(135deg,#1a0000,#4a0000)',
  teal:   'linear-gradient(135deg,#001a1a,#003d3d)',
};

function buildProjectCard(p, lang) {
  const title  = (lang === 'ar' && p.titleAr) ? p.titleAr : p.title;
  const desc   = (lang === 'ar' && p.descAr)  ? p.descAr  : p.desc;
  const arrow  = lang === 'ar' ? '←' : '→';
  const tags   = (p.tags  || []).map(t => `<span class="tag">${t}</span>`).join('');
  const stats  = (p.stats || []).length
    ? `<div class="project-stats-row">${p.stats.map(s => `<span class="pstat">${s}</span>`).join('')}</div>` : '';
  const ghLink = p.github
    ? `<a href="${p.github}" target="_blank" class="project-link link-primary">GitHub ${arrow}</a>` : '';

  // Build media area
  let mediaHtml = '';
  if (p.media && p.media.value) {
    if (p.media.type === 'image') {
      mediaHtml = `<img class="project-media-img" src="${p.media.value}" alt="${title}"
                        onerror="this.style.display='none'">`;
    } else if (p.media.type === 'video') {
      const embed = getVideoEmbedPortfolio(p.media.value);
      if (embed) {
        mediaHtml = `<div class="project-media-video"><iframe src="${embed}" allowfullscreen></iframe></div>`;
      } else {
        mediaHtml = `<video class="project-media-img" src="${p.media.value}" controls></video>`;
      }
    }
  }

  // If has media → show it instead of colour block, else emoji block
  const topArea = mediaHtml
    ? `<div class="project-img project-img-media">${mediaHtml}</div>`
    : `<div class="project-img" style="background:${BG_MAP[p.color] || BG_MAP.blue}">${p.emoji || '📊'}</div>`;

  return `
    <div class="project-card reveal" data-id="${p.id}">
      ${topArea}
      <div class="project-body">
        <div class="project-tags">${tags}</div>
        <div class="project-title">${title}</div>
        <p class="project-desc">${desc}</p>
        ${stats}
        <div class="project-links">${ghLink}</div>
      </div>
    </div>`;
}

function getVideoEmbedPortfolio(url) {
  let m;
  m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  return null;
}

function renderPortfolioProjects(lang) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  let projects;
  try { projects = JSON.parse(raw); } catch { return; }

  const active = projects
    .filter(p => p.status === 'active')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!active.length) return;

  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  grid.innerHTML = active.map(p => buildProjectCard(p, lang)).join('');
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== 6. BILINGUAL (AR / EN) ===== */
let currentLang = 'en';

const translations = {
  en: {
    badge: '● Available for Freelance',
    heroName: 'Abdelrahman<br><span>Ashraf</span>',
    heroTitle: 'Data Analyst & AI Automation Expert',
    heroDesc: "I help businesses grow by turning raw data into actionable insights. Specializing in Python automation, business leads generation, and competitor analysis.",
    heroBtn1: 'View Projects', heroBtn2: 'Hire Me',
    stat1Label: 'Projects Built', stat2Label: 'Records Analyzed', stat3Label: 'Python Powered',
    skillsTag: 'What I Do', skillsTitle: 'Technical Skills',
    projectsTag: 'Portfolio', projectsTitle: 'Featured Projects',
    aboutTag: 'About Me', aboutTitle: 'Who I Am',
    aboutP1: "I'm a Data Analyst & AI Automation Expert from Cairo, Egypt. I specialize in turning messy raw data into clear, actionable business insights using Python and automation tools.",
    aboutP2: "Currently studying Management Information Systems at EGI Academy, I've built a portfolio of real-world projects that solve actual business problems — from automated lead generation to competitor market analysis.",
    contactTag: 'Get In Touch', contactTitle: "Let's Work Together",
    formName: 'Your Name', formEmail: 'Your Email', formSubject: 'Subject', formMsg: 'Message',
    formBtn: 'Send Message ✉️',
    namePH: 'John Smith', emailPH: 'john@company.com',
    subjectPH: 'Data Analysis Project', msgPH: 'Tell me about your project...',
    cvText: 'Download my full CV', cvBtn: '📄 Download CV',
    footerLeft: '© 2026 Abdelrahman Ashraf · Data Analyst & AI Automation Expert',
    footerRight: 'Cairo, Egypt 🇪🇬',
    p1Title: 'Business Leads Automation',
    p1Desc: 'Automated tool that collects 20+ business leads from Google Maps in seconds. Generates professional Excel reports with contact details, ratings, and market analysis.',
    p2Title: 'AI Competitor Analysis',
    p2Desc: 'Analyzed 23,906 car sales records from Kaggle. Built 4 professional charts revealing market leaders, price positioning, regional strength, and body style demand.',
    p3Title: 'WhatsApp Sales Dashboard',
    p3Desc: 'Automated sales analytics dashboard analyzing 9,800+ sales records. Visualizes revenue trends, top products, and regional performance automatically.',
    p4Title: 'Amazon Sales Forecasting AI',
    p4Desc: 'Analyzed 128,975 real Amazon India orders. Cleaned to 108,071 rows. Used Linear Regression ML model to forecast 39.5M ₹ revenue.',
    github: 'GitHub →', dir: 'ltr', langBtn: '🌐 AR',
  },
  ar: {
    badge: '● متاح للعمل الحر',
    heroName: 'عبدالرحمن<br><span>أشرف</span>',
    heroTitle: 'محلل بيانات وخبير أتمتة بالذكاء الاصطناعي',
    heroDesc: 'أساعد الشركات على النمو من خلال تحويل البيانات الخام إلى رؤى قابلة للتنفيذ. متخصص في أتمتة Python وتوليد العملاء المحتملين وتحليل المنافسين.',
    heroBtn1: 'عرض المشاريع', heroBtn2: 'وظفني',
    stat1Label: 'مشاريع منجزة', stat2Label: 'سجل تم تحليله', stat3Label: 'مدعوم بـ Python',
    skillsTag: 'ما أقدمه', skillsTitle: 'المهارات التقنية',
    projectsTag: 'أعمالي', projectsTitle: 'المشاريع المميزة',
    aboutTag: 'عني', aboutTitle: 'من أنا',
    aboutP1: 'أنا محلل بيانات وخبير أتمتة بالذكاء الاصطناعي من القاهرة، مصر. أتخصص في تحويل البيانات الفوضوية إلى رؤى أعمال واضحة وقابلة للتنفيذ باستخدام Python وأدوات الأتمتة.',
    aboutP2: 'أدرس حاليًا نظم المعلومات الإدارية في معهد الجزيرة العالي، وقد بنيت محفظة من المشاريع الحقيقية التي تحل مشاكل تجارية فعلية.',
    contactTag: 'تواصل معي', contactTitle: 'لنعمل معاً',
    formName: 'اسمك', formEmail: 'بريدك الإلكتروني', formSubject: 'الموضوع', formMsg: 'الرسالة',
    formBtn: 'إرسال الرسالة ✉️',
    namePH: 'محمد أحمد', emailPH: 'mohammed@company.com',
    subjectPH: 'مشروع تحليل بيانات', msgPH: 'أخبرني عن مشروعك...',
    cvText: 'تحميل السيرة الذاتية كاملة', cvBtn: '📄 تحميل CV',
    footerLeft: '© 2026 عبدالرحمن أشرف · محلل بيانات وخبير أتمتة',
    footerRight: 'القاهرة، مصر 🇪🇬',
    p1Title: 'أداة أتمتة العملاء المحتملين',
    p1Desc: 'أداة آلية تجمع أكثر من 20 عميلاً محتملاً من خرائط Google في ثوانٍ. تولد تقارير Excel احترافية مع بيانات الاتصال والتقييمات وتحليل السوق.',
    p2Title: 'تحليل المنافسين بالذكاء الاصطناعي',
    p2Desc: 'تحليل 23,906 سجل مبيعات سيارات من Kaggle. بناء 4 مخططات احترافية تكشف عن قادة السوق وتحديد المواقع والقوة الإقليمية.',
    p3Title: 'لوحة تحكم مبيعات WhatsApp',
    p3Desc: 'لوحة تحليلات مبيعات آلية تحلل أكثر من 9,800 سجل مبيعات. تصور اتجاهات الإيرادات وأفضل المنتجات والأداء الإقليمي تلقائياً.',
    p4Title: 'توقع مبيعات Amazon بالذكاء الاصطناعي',
    p4Desc: 'تحليل 128,975 طلب Amazon هندي حقيقي. استخدام نموذج ML للتنبؤ بـ 39.5 مليون روبية.',
    github: 'GitHub ←', dir: 'rtl', langBtn: '🌐 EN',
  }
};

/* ===== toggleLang — يُستدعى من onclick في HTML ===== */
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLang(currentLang);
}

/* ===== applyLang — دالة واحدة فقط ===== */
function applyLang(lang) {
  const t = translations[lang];

  /* Direction & lang attr */
  document.documentElement.dir  = t.dir;
  document.documentElement.lang = lang;

  /* Nav button */
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = t.langBtn;

  /* Hero */
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) heroBadge.innerHTML = `<span class="badge-dot"></span> ${lang === 'ar' ? 'متاح للعمل الحر' : 'Available for Freelance'}`;

  const heroName = document.querySelector('.hero-name');
  if (heroName) heroName.innerHTML = t.heroName;

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.textContent = t.heroTitle;

  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) heroDesc.textContent = t.heroDesc;

  const heroBtns = document.querySelectorAll('.hero-cta a');
  if (heroBtns[0]) heroBtns[0].textContent = t.heroBtn1;
  if (heroBtns[1]) heroBtns[1].textContent = t.heroBtn2;

  const statLabels = document.querySelectorAll('.stat-item .label');
  if (statLabels[0]) statLabels[0].textContent = t.stat1Label;
  if (statLabels[1]) statLabels[1].textContent = t.stat2Label;
  if (statLabels[2]) statLabels[2].textContent = t.stat3Label;

  /* Skills */
  const el_sTag   = document.querySelector('#skills .section-tag');
  const el_sTitle = document.querySelector('#skills .section-title');
  if (el_sTag)   el_sTag.textContent   = t.skillsTag;
  if (el_sTitle) el_sTitle.textContent = t.skillsTitle;

  /* Projects section labels */
  const el_pTag   = document.querySelector('#projects .section-tag');
  const el_pTitle = document.querySelector('#projects .section-title');
  if (el_pTag)   el_pTag.textContent   = t.projectsTag;
  if (el_pTitle) el_pTitle.textContent = t.projectsTitle;

  /* Re-render project cards with new language */
  renderPortfolioProjects(lang);

  /* If no admin data → update static cards */
  if (!localStorage.getItem(STORAGE_KEY)) {
    const projTitles = document.querySelectorAll('.project-title');
    const projDescs  = document.querySelectorAll('.project-desc');
    const projLinks  = document.querySelectorAll('.project-link.link-primary');
    const projData   = [
      { title: t.p1Title, desc: t.p1Desc },
      { title: t.p2Title, desc: t.p2Desc },
      { title: t.p3Title, desc: t.p3Desc },
      { title: t.p4Title, desc: t.p4Desc },
    ];
    projTitles.forEach((el, i) => { if (projData[i]) el.textContent = projData[i].title; });
    projDescs.forEach((el, i)  => { if (projData[i]) el.textContent = projData[i].desc; });
    projLinks.forEach(el        => { el.textContent = t.github; });
  }

  /* About */
  const el_aTag   = document.querySelector('#about .section-tag');
  const el_aTitle = document.querySelector('#about .section-title');
  const aboutPs   = document.querySelectorAll('.about-text p');
  if (el_aTag)   el_aTag.textContent   = t.aboutTag;
  if (el_aTitle) el_aTitle.textContent = t.aboutTitle;
  if (aboutPs[0]) aboutPs[0].textContent = t.aboutP1;
  if (aboutPs[1]) aboutPs[1].textContent = t.aboutP2;

  /* Contact */
  const el_cTag   = document.querySelector('#contact .section-tag');
  const el_cTitle = document.querySelector('#contact .section-title');
  if (el_cTag)   el_cTag.textContent   = t.contactTag;
  if (el_cTitle) el_cTitle.textContent = t.contactTitle;

  /* Form */
  const labels = document.querySelectorAll('.form-label');
  [t.formName, t.formEmail, t.formSubject, t.formMsg].forEach((txt, i) => {
    if (labels[i]) labels[i].textContent = txt;
  });
  const placeholders = { fromName: t.namePH, fromEmail: t.emailPH, subject: t.subjectPH, message: t.msgPH };
  Object.entries(placeholders).forEach(([id, ph]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = ph;
  });
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.textContent = t.formBtn;

  /* CV */
  const cvText = document.querySelector('.cv-download p');
  const cvBtn  = document.querySelector('.btn-cv');
  if (cvText) cvText.textContent = t.cvText;
  if (cvBtn)  cvBtn.textContent  = t.cvBtn;

  /* Footer */
  const footerPs = document.querySelectorAll('footer p');
  if (footerPs[0]) footerPs[0].textContent = t.footerLeft;
  if (footerPs[1]) footerPs[1].textContent = t.footerRight;

  /* Arabic font */
  if (lang === 'ar') {
    document.body.style.fontFamily = "'DM Sans', 'Cairo', sans-serif";
    if (!document.getElementById('arabicFont')) {
      const link = Object.assign(document.createElement('link'), {
        href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap',
        rel:  'stylesheet',
        id:   'arabicFont'
      });
      document.head.appendChild(link);
    }
  } else {
    document.body.style.fontFamily = "'DM Sans', sans-serif";
  }
}

/* ===== 7. INIT ===== */
// Load projects from admin storage on page start
renderPortfolioProjects(currentLang);
