/* ===================================================
   PORTFOLIO — main.js  (clean)
   Abdelrahman Ashraf
   =================================================== */

/* ===== 1. APPLY ADMIN THEME (first thing) ===== */
(function() {
  const raw = localStorage.getItem('aa_portfolio_theme');
  if (!raw) return;
  let t; try { t = JSON.parse(raw); } catch { return; }
  Object.entries(t).forEach(([k,v]) => document.documentElement.style.setProperty(k,v));
})();

/* ===== 2. CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  if(cursor) cursor.style.transform = `translate(${mx-6}px,${my-6}px)`;
});
(function animateRing(){
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  if(ring) ring.style.transform = `translate(${rx-20}px,${ry-20}px)`;
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ if(ring) ring.style.borderColor='rgba(0,212,255,0.8)'; });
  el.addEventListener('mouseleave',()=>{ if(ring) ring.style.borderColor='rgba(0,212,255,0.4)'; });
});

/* ===== 3. SCROLL REVEAL ===== */
const observer = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{ if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'),i*80); });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ===== 4. MOBILE MENU ===== */
const navToggle   = document.getElementById('navToggle');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
if(navToggle)   navToggle.addEventListener('click',  ()=>mobileMenu.classList.add('open'));
if(mobileClose) mobileClose.addEventListener('click',()=>mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>mobileMenu.classList.remove('open')));

/* ===== 5. LOADING SCREEN ===== */
(function(){
  const fill=document.getElementById('loadingFill');
  const screen=document.getElementById('loadingScreen');
  if(!screen) return;
  let p=0;
  const iv=setInterval(()=>{
    p+=Math.random()*18; if(p>=100){p=100;clearInterval(iv);}
    if(fill) fill.style.width=p+'%';
    if(p===100){ setTimeout(()=>screen.classList.add('hide'),300); setTimeout(()=>screen.remove(),900); }
  },80);
  window.addEventListener('load',()=>{
    clearInterval(iv);
    if(fill) fill.style.width='100%';
    setTimeout(()=>screen.classList.add('hide'),200);
    setTimeout(()=>screen.remove(),800);
  });
})();

/* ===== 6. BACK TO TOP ===== */
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll',()=>{ if(backBtn) backBtn.classList.toggle('visible',window.scrollY>400); });

/* ===== 7. DARK/LIGHT MODE ===== */
function toggleTheme(){
  document.body.classList.toggle('light-mode');
  const icon=document.getElementById('themeIcon');
  const isLight=document.body.classList.contains('light-mode');
  if(icon) icon.textContent=isLight?'🌙':'☀️';
  localStorage.setItem('theme',isLight?'light':'dark');
}
(function(){
  const saved=localStorage.getItem('theme');
  const icon=document.getElementById('themeIcon');
  if(saved==='light'){ document.body.classList.add('light-mode'); if(icon) icon.textContent='🌙'; }
})();

/* ===== 8. STATS COUNTER ===== */
function animateCounter(el){
  const target=parseInt(el.getAttribute('data-target'),10);
  const inc=target/(2000/16); let cur=0;
  const iv=setInterval(()=>{
    cur+=inc; if(cur>=target){cur=target;clearInterval(iv);}
    el.textContent=Math.floor(cur).toLocaleString();
  },16);
}
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){animateCounter(e.target);cntObs.unobserve(e.target);} });
},{threshold:0.5});
document.querySelectorAll('.counter-num').forEach(el=>cntObs.observe(el));

/* ===== 9. PROJECT FILTER ===== */
function filterProjects(tag,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card=>{
    if(tag==='all'){ card.classList.remove('hidden-filter'); return; }
    const tags=Array.from(card.querySelectorAll('.tag')).map(t=>t.textContent.trim());
    card.classList.toggle('hidden-filter',!tags.includes(tag));
  });
}

/* ===== 10. CONTACT FORM (FormSubmit) ===== */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const btn=document.getElementById('submitBtn');
    const msg=document.getElementById('formMsg');
    const name=document.getElementById('fromName').value.trim();
    const email=document.getElementById('fromEmail').value.trim();
    const subject=document.getElementById('subject').value.trim();
    const message=document.getElementById('message').value.trim();
    if(!name||!email||!subject||!message){
      msg.textContent='❌ Please fill all fields.'; msg.className='form-feedback error'; return;
    }
    btn.textContent='⏳ Sending...'; btn.disabled=true;
    try{
      const res=await fetch('https://formsubmit.co/ajax/abdelrahmanwork68@gmail.com',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({name,email,subject,message,_subject:'📩 Portfolio: '+subject,_template:'table',_captcha:'false'})
      });
      const data=await res.json();
      if(data.success==='true'||data.success===true){
        msg.textContent='✅ Message sent! I will reply within 24 hours.'; msg.className='form-feedback success';
        contactForm.reset();
      } else throw new Error();
    }catch{
      msg.textContent='❌ Failed. Email: abdelrahmanwork68@gmail.com'; msg.className='form-feedback error';
    }finally{ btn.textContent='Send Message ✉️'; btn.disabled=false; }
  });
}

/* ===== 11. ANALYTICS TRACKING ===== */
(function(){
  const key='aa_analytics'; const today=new Date().toISOString().slice(0,10);
  let d={}; try{d=JSON.parse(localStorage.getItem(key)||'{}');}catch{}
  d.totalVisits=(d.totalVisits||0)+1;
  d.todayVisits=d.lastDate===today?(d.todayVisits||0)+1:1;
  d.lastDate=today; d.lastVisit=today;
  localStorage.setItem(key,JSON.stringify(d));
})();

/* =====================================================
   ADMIN DATA: SKILLS, THEME, SITE INFO, PROJECTS
   ===================================================== */

/* ── BG map for project cards ── */
const BG_MAP={
  blue:'linear-gradient(135deg,#001a3a,#003d7a)',
  purple:'linear-gradient(135deg,#1a0030,#3d006b)',
  green:'linear-gradient(135deg,#001a10,#003d25)',
  orange:'linear-gradient(135deg,#1a0a00,#4a2000)',
  red:'linear-gradient(135deg,#1a0000,#4a0000)',
  teal:'linear-gradient(135deg,#001a1a,#003d3d)',
};

/* ── Build project card HTML ── */
function buildProjectCard(p,lang){
  const title=(lang==='ar'&&p.titleAr)?p.titleAr:p.title;
  const desc=(lang==='ar'&&p.descAr)?p.descAr:p.desc;
  const arrow=lang==='ar'?'←':'→';
  const tags=(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
  const stats=(p.stats||[]).length
    ?`<div class="project-stats-row">${(p.stats).map(s=>`<span class="pstat">${s}</span>`).join('')}</div>`:'';
  const ghLink=p.github?`<a href="${p.github}" target="_blank" class="project-link link-primary">GitHub ${arrow}</a>`:'';
  let topArea;
  if(p.media&&p.media.value){
    if(p.media.type==='image'){
      topArea=`<div class="project-img project-img-media"><img class="project-media-img" src="${p.media.value}" alt="${title}" onerror="this.style.display='none'"></div>`;
    } else {
      const emb=getVideoEmbedPortfolio(p.media.value);
      topArea=emb
        ?`<div class="project-img project-img-media"><div class="project-media-video"><iframe src="${emb}" allowfullscreen></iframe></div></div>`
        :`<div class="project-img project-img-media"><video class="project-media-img" src="${p.media.value}" controls></video></div>`;
    }
  } else {
    topArea=`<div class="project-img" style="background:${BG_MAP[p.color]||BG_MAP.blue}">${p.emoji||'📊'}</div>`;
  }
  return `<div class="project-card reveal" data-id="${p.id}">${topArea}
    <div class="project-body">
      <div class="project-tags">${tags}</div>
      <div class="project-title">${title}</div>
      <p class="project-desc">${desc}</p>
      ${stats}
      <div class="project-links">${ghLink}</div>
    </div></div>`;
}

function getVideoEmbedPortfolio(url){
  let m;
  m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if(m) return `https://www.youtube.com/embed/${m[1]}`;
  m=url.match(/vimeo\.com\/(\d+)/);
  if(m) return `https://player.vimeo.com/video/${m[1]}`;
  return null;
}

/* ── Render projects from admin storage ── */
function renderPortfolioProjects(lang){
  const raw=localStorage.getItem('aa_portfolio_projects');
  if(!raw) return;
  let projects; try{projects=JSON.parse(raw);}catch{return;}
  const active=projects.filter(p=>p.status==='active').sort((a,b)=>(a.order??0)-(b.order??0));
  if(!active.length) return;
  const grid=document.querySelector('.projects-grid');
  if(!grid) return;
  grid.innerHTML=active.map(p=>buildProjectCard(p,lang)).join('');
  grid.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

/* ── Apply skills from admin ── */
function applyAdminSkills(lang){
  const raw=localStorage.getItem('aa_portfolio_skills');
  if(!raw) return;
  let skills; try{skills=JSON.parse(raw);}catch{return;}
  if(!skills.length) return;
  const grid=document.querySelector('.skills-grid');
  if(!grid) return;
  grid.innerHTML=skills.map(sk=>`
    <div class="skill-card reveal">
      <div class="skill-icon">${sk.emoji||'⚡'}</div>
      <div class="skill-name">${lang==='ar'?(sk.nameAr||sk.name):sk.name}</div>
      <div class="skill-desc">${lang==='ar'?(sk.descAr||sk.desc):sk.desc}</div>
    </div>`).join('');
  grid.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

/* ── Apply site info from admin ── */
function applySiteInfo(lang){
  const raw=localStorage.getItem('aa_portfolio_siteinfo');
  if(!raw) return;
  let info; try{info=JSON.parse(raw);}catch{return;}

  const heroName=document.querySelector('.hero-name');
  if(heroName&&info.name){
    const n =lang==='ar'?(info.nameAr||info.name):info.name;
    const ln=lang==='ar'?(info.lastNameAr||info.lastName||''):( info.lastName||'');
    heroName.innerHTML=n+'<br><span>'+ln+'</span>';
  }
  const heroTitle=document.querySelector('.hero-title');
  if(heroTitle) heroTitle.textContent=lang==='ar'?(info.titleAr||info.title||''):(info.title||'');
  const heroDesc=document.querySelector('.hero-desc');
  if(heroDesc)  heroDesc.textContent =lang==='ar'?(info.descAr||info.desc||''):(info.desc||'');

  const nums=document.querySelectorAll('.stat-item .num');
  const labs=document.querySelectorAll('.stat-item .label');
  if(nums[0]&&info.stat1n) nums[0].textContent=info.stat1n;
  if(nums[1]&&info.stat2n) nums[1].textContent=info.stat2n;
  if(labs[0]&&info.stat1)  labs[0].textContent=lang==='ar'?(info.stat1Ar||info.stat1):info.stat1;
  if(labs[1]&&info.stat2)  labs[1].textContent=lang==='ar'?(info.stat2Ar||info.stat2):info.stat2;

  const infoVals=document.querySelectorAll('.info-val');
  if(infoVals[0]&&info.email)    infoVals[0].textContent=info.email;
  if(infoVals[1]&&info.phone)    infoVals[1].textContent=info.phone;
  if(infoVals[2]&&info.location) infoVals[2].textContent=info.location;

  const wa=document.querySelector('.whatsapp-btn');
  if(wa&&info.whatsapp) wa.href='https://wa.me/'+info.whatsapp;

  const fps=document.querySelectorAll('footer p');
  if(fps[0]&&info.name) fps[0].textContent='© 2026 '+(info.name)+' '+(info.lastName||'')+' · '+(info.title||'');
  if(fps[1]&&info.location) fps[1].textContent=info.location;
}

/* =====================================================
   BILINGUAL — single applyLang function
   ===================================================== */
let currentLang='en';

const TR={
  en:{
    badge:'Available for Freelance',
    heroName:'Abdelrahman<br><span>Ashraf</span>',
    heroTitle:'Data Analyst & AI Automation Expert',
    heroDesc:"I help businesses grow by turning raw data into actionable insights. Specializing in Python automation, business leads generation, and competitor analysis.",
    heroBtn1:'View Projects', heroBtn2:'Hire Me',
    stat1:'Projects Built', stat2:'Records Analyzed', stat3:'Python Powered',
    skillsTag:'What I Do', skillsTitle:'Technical Skills',
    projTag:'Portfolio', projTitle:'Featured Projects',
    aboutTag:'About Me', aboutTitle:'Who I Am',
    aboutP1:"I'm a Data Analyst & AI Automation Expert from Cairo, Egypt. I specialize in turning messy raw data into clear, actionable business insights using Python and automation tools.",
    aboutP2:"Currently studying Management Information Systems at EGI Academy, I've built a portfolio of real-world projects that solve actual business problems.",
    contactTag:'Get In Touch', contactTitle:"Let's Work Together",
    formName:'Your Name', formEmail:'Your Email', formSubject:'Subject', formMsg:'Message',
    formBtn:'Send Message ✉️',
    namePH:'John Smith', emailPH:'john@company.com', subjectPH:'Data Analysis Project', msgPH:'Tell me about your project...',
    cvText:'Download my full CV', cvBtn:'📄 Download CV',
    footerL:'© 2026 Abdelrahman Ashraf · Data Analyst & AI Automation Expert',
    footerR:'Cairo, Egypt 🇪🇬',
    p1t:'Business Leads Automation', p1d:'Automated tool that collects 20+ business leads from Google Maps in seconds.',
    p2t:'AI Competitor Analysis',    p2d:'Analyzed 23,906 car sales records from Kaggle.',
    p3t:'WhatsApp Sales Dashboard',  p3d:'Automated sales analytics dashboard analyzing 9,800+ sales records.',
    p4t:'Amazon Sales Forecasting AI',p4d:'Analyzed 128,975 real Amazon India orders. Used ML to forecast 39.5M ₹.',
    github:'GitHub →', dir:'ltr', langBtn:'🌐 AR',
  },
  ar:{
    badge:'متاح للعمل الحر',
    heroName:'عبدالرحمن<br><span>أشرف</span>',
    heroTitle:'محلل بيانات وخبير أتمتة بالذكاء الاصطناعي',
    heroDesc:'أساعد الشركات على النمو من خلال تحويل البيانات الخام إلى رؤى قابلة للتنفيذ.',
    heroBtn1:'عرض المشاريع', heroBtn2:'وظفني',
    stat1:'مشاريع منجزة', stat2:'سجل تم تحليله', stat3:'مدعوم بـ Python',
    skillsTag:'ما أقدمه', skillsTitle:'المهارات التقنية',
    projTag:'أعمالي', projTitle:'المشاريع المميزة',
    aboutTag:'عني', aboutTitle:'من أنا',
    aboutP1:'أنا محلل بيانات وخبير أتمتة بالذكاء الاصطناعي من القاهرة، مصر.',
    aboutP2:'أدرس حاليًا نظم المعلومات الإدارية في معهد الجزيرة العالي.',
    contactTag:'تواصل معي', contactTitle:'لنعمل معاً',
    formName:'اسمك', formEmail:'بريدك الإلكتروني', formSubject:'الموضوع', formMsg:'الرسالة',
    formBtn:'إرسال الرسالة ✉️',
    namePH:'محمد أحمد', emailPH:'mohammed@company.com', subjectPH:'مشروع تحليل بيانات', msgPH:'أخبرني عن مشروعك...',
    cvText:'تحميل السيرة الذاتية', cvBtn:'📄 تحميل CV',
    footerL:'© 2026 عبدالرحمن أشرف · محلل بيانات وخبير أتمتة',
    footerR:'القاهرة، مصر 🇪🇬',
    p1t:'أداة أتمتة العملاء المحتملين', p1d:'أداة آلية تجمع أكثر من 20 عميلاً من خرائط Google.',
    p2t:'تحليل المنافسين بالذكاء الاصطناعي', p2d:'تحليل 23,906 سجل مبيعات سيارات من Kaggle.',
    p3t:'لوحة تحكم مبيعات WhatsApp', p3d:'لوحة تحليلات مبيعات آلية تحلل أكثر من 9,800 سجل.',
    p4t:'توقع مبيعات Amazon بالذكاء الاصطناعي', p4d:'تحليل 128,975 طلب Amazon هندي. استخدام ML للتنبؤ بـ 39.5 مليون روبية.',
    github:'GitHub ←', dir:'rtl', langBtn:'🌐 EN',
  }
};

/* ── Single toggleLang ── */
function toggleLang(){
  currentLang=currentLang==='en'?'ar':'en';
  applyLang(currentLang);
}

/* ── Single applyLang ── */
function applyLang(lang){
  const t=TR[lang];
  document.documentElement.dir =t.dir;
  document.documentElement.lang=lang;

  const langBtn=document.getElementById('langBtn');
  if(langBtn) langBtn.textContent=t.langBtn;

  /* Hero */
  const badge=document.querySelector('.hero-badge');
  if(badge) badge.innerHTML=`<span class="badge-dot"></span> ${t.badge}`;

  // Use admin site info if available, else fallback to translations
  const siteInfoRaw=localStorage.getItem('aa_portfolio_siteinfo');
  let siteInfo=null; try{if(siteInfoRaw) siteInfo=JSON.parse(siteInfoRaw);}catch{}

  const heroName=document.querySelector('.hero-name');
  if(heroName){
    if(siteInfo&&siteInfo.name){
      const n=lang==='ar'?(siteInfo.nameAr||siteInfo.name):siteInfo.name;
      const ln=lang==='ar'?(siteInfo.lastNameAr||siteInfo.lastName||''):(siteInfo.lastName||'');
      heroName.innerHTML=n+'<br><span>'+ln+'</span>';
    } else { heroName.innerHTML=t.heroName; }
  }
  const heroTitle=document.querySelector('.hero-title');
  if(heroTitle) heroTitle.textContent=siteInfo?(lang==='ar'?(siteInfo.titleAr||siteInfo.title||t.heroTitle):(siteInfo.title||t.heroTitle)):t.heroTitle;
  const heroDesc=document.querySelector('.hero-desc');
  if(heroDesc)  heroDesc.textContent=siteInfo?(lang==='ar'?(siteInfo.descAr||siteInfo.desc||t.heroDesc):(siteInfo.desc||t.heroDesc)):t.heroDesc;

  const heroBtns=document.querySelectorAll('.hero-cta a');
  if(heroBtns[0]) heroBtns[0].textContent=t.heroBtn1;
  if(heroBtns[1]) heroBtns[1].textContent=t.heroBtn2;

  const statLabs=document.querySelectorAll('.stat-item .label');
  if(statLabs[0]) statLabs[0].textContent=siteInfo?(lang==='ar'?(siteInfo.stat1Ar||siteInfo.stat1||t.stat1):(siteInfo.stat1||t.stat1)):t.stat1;
  if(statLabs[1]) statLabs[1].textContent=siteInfo?(lang==='ar'?(siteInfo.stat2Ar||siteInfo.stat2||t.stat2):(siteInfo.stat2||t.stat2)):t.stat2;
  if(statLabs[2]) statLabs[2].textContent=t.stat3;

  /* Skills */
  const sTag=document.querySelector('#skills .section-tag');
  const sTitle=document.querySelector('#skills .section-title');
  if(sTag)   sTag.textContent=t.skillsTag;
  if(sTitle) sTitle.textContent=t.skillsTitle;
  applyAdminSkills(lang); // re-render skills in correct language

  /* Projects */
  const pTag=document.querySelector('#projects .section-tag');
  const pTitle=document.querySelector('#projects .section-title');
  if(pTag)   pTag.textContent=t.projTag;
  if(pTitle) pTitle.textContent=t.projTitle;
  renderPortfolioProjects(lang); // re-render projects in correct language

  /* If no admin projects data → update static cards */
  if(!localStorage.getItem('aa_portfolio_projects')){
    const pts=document.querySelectorAll('.project-title');
    const pds=document.querySelectorAll('.project-desc');
    const pls=document.querySelectorAll('.project-link.link-primary');
    const pd=[{t:t.p1t,d:t.p1d},{t:t.p2t,d:t.p2d},{t:t.p3t,d:t.p3d},{t:t.p4t,d:t.p4d}];
    pts.forEach((el,i)=>{ if(pd[i]) el.textContent=pd[i].t; });
    pds.forEach((el,i)=>{ if(pd[i]) el.textContent=pd[i].d; });
    pls.forEach(el=>el.textContent=t.github);
  }

  /* About */
  const aTag=document.querySelector('#about .section-tag');
  const aTitle=document.querySelector('#about .section-title');
  const aPs=document.querySelectorAll('.about-text p');
  if(aTag)   aTag.textContent=t.aboutTag;
  if(aTitle) aTitle.textContent=t.aboutTitle;
  if(aPs[0]) aPs[0].textContent=t.aboutP1;
  if(aPs[1]) aPs[1].textContent=t.aboutP2;

  /* Contact */
  const cTag=document.querySelector('#contact .section-tag');
  const cTitle=document.querySelector('#contact .section-title');
  if(cTag)   cTag.textContent=t.contactTag;
  if(cTitle) cTitle.textContent=t.contactTitle;

  /* Form */
  const fLabels=document.querySelectorAll('.form-label');
  [t.formName,t.formEmail,t.formSubject,t.formMsg].forEach((txt,i)=>{ if(fLabels[i]) fLabels[i].textContent=txt; });
  const phs={fromName:t.namePH,fromEmail:t.emailPH,subject:t.subjectPH,message:t.msgPH};
  Object.entries(phs).forEach(([id,ph])=>{ const el=document.getElementById(id); if(el) el.placeholder=ph; });
  const submitBtn=document.getElementById('submitBtn');
  if(submitBtn) submitBtn.textContent=t.formBtn;

  /* CV */
  const cvTxt=document.querySelector('.cv-download p');
  const cvBtn=document.querySelector('.btn-cv');
  if(cvTxt) cvTxt.textContent=t.cvText;
  if(cvBtn) cvBtn.textContent=t.cvBtn;

  /* Footer */
  const fps=document.querySelectorAll('footer p');
  if(fps[0]) fps[0].textContent=siteInfo?(lang==='ar'?('© 2026 '+(siteInfo.nameAr||siteInfo.name)+' · '+(siteInfo.titleAr||siteInfo.title)):('© 2026 '+siteInfo.name+' '+(siteInfo.lastName||'')+' · '+(siteInfo.title||''))):t.footerL;
  if(fps[1]) fps[1].textContent=siteInfo?(siteInfo.location||t.footerR):t.footerR;

  /* Arabic font */
  if(lang==='ar'){
    document.body.style.fontFamily="'DM Sans','Cairo',sans-serif";
    if(!document.getElementById('arabicFont')){
      const link=Object.assign(document.createElement('link'),{href:'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap',rel:'stylesheet',id:'arabicFont'});
      document.head.appendChild(link);
    }
  } else { document.body.style.fontFamily="'DM Sans',sans-serif"; }
}

/* ===== INIT — apply all admin data on load ===== */
renderPortfolioProjects(currentLang);
applyAdminSkills(currentLang);
applySiteInfo(currentLang);
