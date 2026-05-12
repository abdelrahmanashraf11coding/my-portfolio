/* ===================================================
   ADMIN PANEL — admin.js  (clean rewrite)
   Abdelrahman Ashraf Portfolio
   =================================================== */

/* ===== KEYS ===== */
const STORAGE_KEY  = 'aa_portfolio_projects';
const AUTH_KEY     = 'aa_admin_auth';
const PASS_KEY     = 'aa_admin_pass';
const SKILLS_KEY   = 'aa_portfolio_skills';
const THEME_KEY    = 'aa_portfolio_theme';
const SITEINFO_KEY = 'aa_portfolio_siteinfo';
const DEFAULT_PASS = 'abdelrahman2003';

/* ===== DEFAULTS ===== */
const DEFAULT_PROJECTS = [
  { id:'p1', title:'Business Leads Automation', titleAr:'أداة أتمتة العملاء المحتملين',
    desc:'Automated tool that collects 20+ business leads from Google Maps in seconds. Generates professional Excel reports.',
    descAr:'أداة آلية تجمع أكثر من 20 عميلاً من خرائط Google في ثوانٍ.',
    tags:['Python','Google API','Excel'], emoji:'🗺️', color:'blue',
    github:'https://github.com/abdelrahmanashraf11coding/business-leads-automatio',
    stats:[], status:'active', order:0, media:null },
  { id:'p2', title:'AI Competitor Analysis', titleAr:'تحليل المنافسين بالذكاء الاصطناعي',
    desc:'Analyzed 23,906 car sales records from Kaggle. Built 4 professional charts.',
    descAr:'تحليل 23,906 سجل مبيعات سيارات من Kaggle.',
    tags:['Python','Pandas','Matplotlib'], emoji:'📊', color:'purple',
    github:'https://github.com/abdelrahmanashraf11coding/car-competitor-analysis',
    stats:[], status:'active', order:1, media:null },
  { id:'p3', title:'WhatsApp Sales Dashboard', titleAr:'لوحة تحكم مبيعات WhatsApp',
    desc:'Automated sales analytics dashboard analyzing 9,800+ sales records.',
    descAr:'لوحة تحليلات مبيعات آلية تحلل أكثر من 9,800 سجل مبيعات.',
    tags:['Python','Pandas','Dashboard'], emoji:'📱', color:'green',
    github:'https://github.com/abdelrahmanashraf11coding',
    stats:[], status:'active', order:2, media:null },
  { id:'p4', title:'Amazon Sales Forecasting AI', titleAr:'توقع مبيعات Amazon بالذكاء الاصطناعي',
    desc:'Analyzed 128,975 real Amazon India orders. Used Linear Regression ML model to forecast 39.5M ₹ revenue.',
    descAr:'تحليل 128,975 طلب Amazon هندي. استخدام نموذج ML للتنبؤ بـ 39.5 مليون روبية.',
    tags:['Machine Learning','Scikit-learn','Forecasting'], emoji:'🛒', color:'orange',
    github:'https://github.com/abdelrahmanashraf11coding/amazon-sales-forecasting',
    stats:['📦 128K Orders','💰 71.6M ₹','🔮 AI Forecast'], status:'active', order:3, media:null }
];

const DEFAULT_SKILLS = [
  { id:'sk1', emoji:'🐍', name:'Python',             nameAr:'بايثون',            desc:'Pandas, NumPy, Matplotlib, Seaborn', descAr:'باندا، نمباي، ماتبلوتليب' },
  { id:'sk2', emoji:'📊', name:'Data Analysis',      nameAr:'تحليل البيانات',    desc:'Cleaning, transforming large datasets', descAr:'تنظيف وتحويل البيانات الكبيرة' },
  { id:'sk3', emoji:'🤖', name:'AI Automation',      nameAr:'أتمتة الذكاء الاصطناعي', desc:'Google APIs, REST APIs, automated reporting', descAr:'Google APIs، REST APIs' },
  { id:'sk4', emoji:'📈', name:'Excel Reports',      nameAr:'تقارير Excel',      desc:'Professional dashboards using OpenPyXL', descAr:'لوحات احترافية باستخدام OpenPyXL' },
  { id:'sk5', emoji:'🔗', name:'APIs & Integration', nameAr:'الـ APIs والتكامل', desc:'Google Maps API, Places API, REST API', descAr:'Google Maps API، Places API' },
  { id:'sk6', emoji:'💻', name:'Git & GitHub',       nameAr:'جيت وجيتهاب',      desc:'Version control, collaborative development', descAr:'التحكم في الإصدار' },
];

const DEFAULT_SITEINFO = {
  name:'Abdelrahman', nameAr:'عبدالرحمن', lastName:'Ashraf', lastNameAr:'أشرف',
  title:'Data Analyst & AI Automation Expert',
  titleAr:'محلل بيانات وخبير أتمتة بالذكاء الاصطناعي',
  desc:'I help businesses grow by turning raw data into actionable insights.',
  descAr:'أساعد الشركات على النمو من خلال تحويل البيانات الخام إلى رؤى قابلة للتنفيذ.',
  email:'abdelrahmanwork68@gmail.com', phone:'01115713256',
  whatsapp:'201115713256', location:'Cairo, Egypt 🇪🇬',
  linkedin:'https://linkedin.com/in/abdelrahmanashraf-dev',
  github:'https://github.com/abdelrahmanashraf11coding',
  stat1:'Projects Built', stat1n:'3+', stat2:'Records Analyzed', stat2n:'23K+',
};

const PRESETS = {
  cyber:  {'--accent':'#00d4ff','--accent2':'#0066ff','--accent3':'#7b2fff','--bg':'#060a12','--surface':'#0d1421','--text':'#e8edf5','--muted':'#7a8899'},
  purple: {'--accent':'#d4aaff','--accent2':'#9b59b6','--accent3':'#7b2fff','--bg':'#08050f','--surface':'#110d1a','--text':'#ede8f5','--muted':'#8a7a99'},
  green:  {'--accent':'#00d4aa','--accent2':'#00a855','--accent3':'#007a3d','--bg':'#050f09','--surface':'#0a1a10','--text':'#e8f5ee','--muted':'#7a9980'},
  orange: {'--accent':'#ff8c00','--accent2':'#e65c00','--accent3':'#cc3300','--bg':'#0f0800','--surface':'#1a0f00','--text':'#f5ede8','--muted':'#997a6a'},
  pink:   {'--accent':'#ff6eb4','--accent2':'#d63af9','--accent3':'#9b00d4','--bg':'#0f050f','--surface':'#1a0d1a','--text':'#f5e8f5','--muted':'#997a99'},
  gold:   {'--accent':'#ffd700','--accent2':'#ff8c00','--accent3':'#cc6600','--bg':'#0f0d00','--surface':'#1a1800','--text':'#f5f0e0','--muted':'#998870'},
};

/* ===== STATE ===== */
let projects     = [];
let skills       = [];
let deleteTarget = null;
let dragSrcId    = null;
let _mediaData   = {type:null,value:null,name:null};

/* ===== UTILS ===== */
const getPass      = () => localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
const isLoggedIn   = () => sessionStorage.getItem(AUTH_KEY) === '1';
const genId        = () => 'p_' + Date.now();
const saveProjects = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
const saveSkills   = () => localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try { projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS]; } catch { projects = [...DEFAULT_PROJECTS]; }
  if (!raw) saveProjects();
}
function loadSkillsData() {
  const raw = localStorage.getItem(SKILLS_KEY);
  try { skills = raw ? JSON.parse(raw) : [...DEFAULT_SKILLS]; } catch { skills = [...DEFAULT_SKILLS]; }
  if (!raw) saveSkills();
}

/* ===== AUTH ===== */
function doLogin() {
  const val = document.getElementById('loginPassword').value;
  if (val === getPass()) {
    sessionStorage.setItem(AUTH_KEY, '1');
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    init();
  } else {
    const err = document.getElementById('loginError');
    err.textContent = '❌ Wrong password.';
    setTimeout(() => err.textContent = '', 2500);
    document.getElementById('loginPassword').value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pw = document.getElementById('loginPassword');
  if (pw) pw.addEventListener('keyup', e => { if (e.key === 'Enter') doLogin(); });
  if (isLoggedIn()) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    init();
  }
  loadSavedTheme();
});

function doLogout() { sessionStorage.removeItem(AUTH_KEY); location.reload(); }

/* ===== INIT ===== */
function init() { loadProjects(); renderProjects(); }

/* ===== TABS — single function ===== */
function switchTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('tab-' + name);
  if (target) target.classList.add('active');
  if (el)     el.classList.add('active');

  const titles = { projects:'Projects', add:'Add Project', skills:'Skills', theme:'Theme Customizer', siteinfo:'Site Info', analytics:'Analytics', settings:'Settings' };
  const subs   = { projects:'Manage your portfolio projects', add:'Create a new project entry', skills:'Manage technical skills', theme:'Customize your portfolio colors', siteinfo:'Edit your personal information', analytics:'Site statistics', settings:'Admin preferences' };
  const t = document.getElementById('tabTitle'); if (t) t.textContent = titles[name] || name;
  const s = document.getElementById('tabSub');   if (s) s.textContent = subs[name]   || '';

  if (name === 'projects')  renderProjects();
  if (name === 'add')       { resetForm(); document.getElementById('formCardTitle').textContent = 'New Project'; }
  if (name === 'skills')    renderSkillsAdmin();
  if (name === 'theme')     loadSavedTheme();
  if (name === 'siteinfo')  loadSiteInfoForm();
  if (name === 'analytics') loadAnalytics();
}

/* ===================================================
   PROJECTS
   =================================================== */
function renderProjects() {
  loadProjects();
  const sorted = [...projects].sort((a,b)=>(a.order??0)-(b.order??0));
  const el = id => document.getElementById(id);
  if(el('countAll'))    el('countAll').textContent    = sorted.length;
  if(el('countActive')) el('countActive').textContent  = sorted.filter(p=>p.status==='active').length;
  if(el('countHidden')) el('countHidden').textContent  = sorted.filter(p=>p.status!=='active').length;

  const container = document.getElementById('projectsList');
  if (!container) return;
  if (!sorted.length) { container.innerHTML='<div class="empty-state"><div class="empty-icon">📂</div><p>No projects yet.</p></div>'; return; }

  container.innerHTML = sorted.map(p => {
    const bg = p.color||'blue'; const em = p.emoji||'📊';
    let thumb;
    if (p.media && p.media.type === 'image') {
      thumb = '<img class="card-media-thumb" src="' + p.media.value + '" alt="thumb" onerror="this.style.display=\'none\'">';
    } else {
      thumb = '<div class="card-emoji bg-' + bg + '">' + em + '</div>';
    }
    const tags   = (p.tags||[]).map(t=>'<span class="card-tag">'+t+'</span>').join('');
    const stCls  = p.status==='active'?'status-active':'status-hidden';
    const stTxt  = p.status==='active'?'● Active':'○ Hidden';
    const hideTxt= p.status==='active'?'🙈 Hide':'👁 Show';
    return '<div class="project-admin-card '+(p.status!=='active'?'is-hidden':'')+'" draggable="true" id="card-'+p.id+'" ondragstart="dragStart(event,\''+p.id+'\')" ondragover="dragOver(event)" ondrop="dragDrop(event,\''+p.id+'\')">'
      +'<span class="drag-handle" title="Reorder">⠿</span>'
      +thumb
      +'<div class="card-info"><div class="card-title">'+p.title+'</div><div class="card-desc">'+p.desc+'</div><div class="card-tags">'+tags+'</div></div>'
      +'<span class="card-status '+stCls+'">'+stTxt+'</span>'
      +'<div class="card-actions">'
      +'<button class="btn-edit" onclick="editProject(\''+p.id+'\')">✏️ Edit</button>'
      +'<button class="btn-hide" onclick="toggleHide(\''+p.id+'\')">'+hideTxt+'</button>'
      +'<button class="btn-delete" onclick="openDeleteModal(\''+p.id+'\')">🗑️ Delete</button>'
      +'</div></div>';
  }).join('');
}

function editProject(id) {
  const p = projects.find(x=>x.id===id); if(!p) return;
  const set = (eid,val) => { const el=document.getElementById(eid); if(el) el.value=val||''; };
  set('editId',p.id); set('fTitle',p.title); set('fTitleAr',p.titleAr);
  set('fDesc',p.desc); set('fDescAr',p.descAr); set('fGithub',p.github);
  set('fTags',(p.tags||[]).join(', ')); set('fEmoji',p.emoji||'📊');
  const col=document.getElementById('fColor'); if(col) col.value=p.color||'blue';
  const sta=document.getElementById('fStatus'); if(sta) sta.value=p.status||'active';
  set('fStats',(p.stats||[]).join('\n'));
  document.getElementById('formCardTitle').textContent='✏️ Edit Project';
  loadMediaIntoForm(p);
  switchTab('add', document.querySelector('[data-tab="add"]'));
}

function saveProject() {
  const id=document.getElementById('editId').value;
  const title=document.getElementById('fTitle').value.trim();
  const desc=document.getElementById('fDesc').value.trim();
  const fb=document.getElementById('formFeedback');
  if(!title||!desc){ fb.textContent='❌ Title and Description required.'; fb.className='form-feedback-admin error'; return; }

  const tags  =document.getElementById('fTags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const statsR=document.getElementById('fStats').value.split('\n').map(s=>s.trim()).filter(Boolean);
  const media =_mediaData.value?{..._mediaData}:null;
  const g=id=>{ const el=document.getElementById(id); return el?el.value.trim():''; };
  const data={title,titleAr:g('fTitleAr'),desc,descAr:g('fDescAr'),github:g('fGithub'),
    tags,emoji:g('fEmoji')||'📊',color:document.getElementById('fColor').value,
    status:document.getElementById('fStatus').value,stats:statsR,media};

  if(id){ const idx=projects.findIndex(x=>x.id===id); if(idx!==-1) projects[idx]={...projects[idx],...data}; }
  else  { data.id=genId(); data.order=projects.length; projects.push(data); }

  saveProjects();
  fb.textContent=id?'✅ Updated!':'✅ Added!'; fb.className='form-feedback-admin success';
  setTimeout(()=>{ fb.textContent=''; switchTab('projects',document.querySelector('[data-tab="projects"]')); },1200);
}

function toggleHide(id) {
  const p=projects.find(x=>x.id===id); if(!p) return;
  p.status=p.status==='active'?'hidden':'active';
  saveProjects(); renderProjects();
}

function openDeleteModal(id) {
  deleteTarget=id;
  const p=projects.find(x=>x.id===id);
  const el=document.getElementById('deleteModalName'); if(el) el.textContent=p?'"'+p.title+'"':'';
  document.getElementById('deleteModal').classList.remove('hidden');
}
function closeDeleteModal() { deleteTarget=null; document.getElementById('deleteModal').classList.add('hidden'); }
function confirmDelete() {
  if(!deleteTarget) return;
  projects=projects.filter(p=>p.id!==deleteTarget);
  saveProjects(); closeDeleteModal(); renderProjects();
}
function cancelEdit() { switchTab('projects',document.querySelector('[data-tab="projects"]')); }

function resetForm() {
  ['editId','fTitle','fTitleAr','fDesc','fDescAr','fGithub','fStats','fMediaUrl','fVideoUrl']
    .forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('fTags').value='';
  document.getElementById('fEmoji').value='📊';
  document.getElementById('fColor').value='blue';
  document.getElementById('fStatus').value='active';
  document.getElementById('formFeedback').textContent='';
  _mediaData={type:null,value:null,name:null};
  clearAllPreviews(); updateCurrentMediaBadge();
  const ft=document.querySelector('.media-tab'); if(ft) switchMediaTab('upload',ft);
}

/* DRAG & DROP */
function dragStart(e,id){ dragSrcId=id; e.dataTransfer.effectAllowed='move'; }
function dragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect='move'; }
function dragDrop(e,targetId){
  e.preventDefault(); if(dragSrcId===targetId) return;
  const si=projects.findIndex(p=>p.id===dragSrcId);
  const ti=projects.findIndex(p=>p.id===targetId);
  if(si===-1||ti===-1) return;
  const [moved]=projects.splice(si,1); projects.splice(ti,0,moved);
  projects.forEach((p,i)=>p.order=i); saveProjects(); renderProjects();
}

/* ===================================================
   SKILLS
   =================================================== */
function renderSkillsAdmin() {
  loadSkillsData();
  const c=document.getElementById('skillsList'); if(!c) return;
  if(!skills.length){ c.innerHTML='<div class="empty-state"><div class="empty-icon">🧠</div><p>No skills yet.</p></div>'; return; }
  c.innerHTML=skills.map(sk=>
    '<div class="skill-admin-card">'
    +'<div class="skill-admin-icon">'+(sk.emoji||'⚡')+'</div>'
    +'<div class="skill-admin-info"><div class="skill-admin-name">'+(sk.name||'')+'</div><div class="skill-admin-desc">'+(sk.desc||'')+'</div></div>'
    +'<div class="skill-admin-actions">'
    +'<button class="btn-sk-edit" onclick="editSkill(\''+sk.id+'\')">✏️</button>'
    +'<button class="btn-sk-delete" onclick="deleteSkill(\''+sk.id+'\')">🗑️</button>'
    +'</div></div>'
  ).join('');
}

function openAddSkill(){
  ['skillEditId','skName','skNameAr','skEmoji','skDesc','skDescAr'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('skillFormTitle').textContent='New Skill';
  document.getElementById('skillFormWrap').classList.remove('hidden');
  document.getElementById('skName').focus();
}

function editSkill(id){
  const sk=skills.find(s=>s.id===id); if(!sk) return;
  const s=(eid,val)=>{ const el=document.getElementById(eid); if(el) el.value=val||''; };
  s('skillEditId',sk.id); s('skName',sk.name); s('skNameAr',sk.nameAr);
  s('skEmoji',sk.emoji); s('skDesc',sk.desc); s('skDescAr',sk.descAr);
  document.getElementById('skillFormTitle').textContent='✏️ Edit Skill';
  document.getElementById('skillFormWrap').classList.remove('hidden');
}

function saveSkill(){
  const id=document.getElementById('skillEditId').value;
  const name=document.getElementById('skName').value.trim();
  const fb=document.getElementById('skillFeedback');
  if(!name){ fb.textContent='❌ Name required.'; fb.className='form-feedback-admin error'; return; }
  const g=eid=>{ const el=document.getElementById(eid); return el?el.value.trim():''; };
  const data={name,nameAr:g('skNameAr'),emoji:g('skEmoji')||'⚡',desc:g('skDesc'),descAr:g('skDescAr')};
  if(id){ const idx=skills.findIndex(s=>s.id===id); if(idx!==-1) skills[idx]={...skills[idx],...data}; }
  else  { data.id='sk_'+Date.now(); skills.push(data); }
  saveSkills();
  fb.textContent='✅ Saved!'; fb.className='form-feedback-admin success';
  setTimeout(()=>{ fb.textContent=''; closeSkillForm(); renderSkillsAdmin(); },800);
}

function deleteSkill(id){ if(!confirm('Delete this skill?')) return; skills=skills.filter(s=>s.id!==id); saveSkills(); renderSkillsAdmin(); }
function closeSkillForm(){ document.getElementById('skillFormWrap').classList.add('hidden'); }

/* ===================================================
   THEME
   =================================================== */
function liveColor(varName,value){
  document.documentElement.style.setProperty(varName,value);
  const map={'--bg':'thBgVal','--surface':'thSurfaceVal','--accent':'thAccentVal','--accent2':'thAccent2Val','--accent3':'thAccent3Val','--text':'thTextVal','--muted':'thMutedVal'};
  if(map[varName]){ const el=document.getElementById(map[varName]); if(el) el.textContent=value; }
}

function applyPreset(name){
  const p=PRESETS[name]; if(!p) return;
  const pm={'--bg':'thBg','--surface':'thSurface','--accent':'thAccent','--accent2':'thAccent2','--accent3':'thAccent3','--text':'thText','--muted':'thMuted'};
  Object.entries(p).forEach(([k,v])=>{ liveColor(k,v); const el=document.getElementById(pm[k]); if(el) el.value=v; });
}

function saveTheme(){
  const vars=['--bg','--surface','--accent','--accent2','--accent3','--text','--muted'];
  const theme={};
  vars.forEach(v=>theme[v]=getComputedStyle(document.documentElement).getPropertyValue(v).trim());
  localStorage.setItem(THEME_KEY,JSON.stringify(theme));
  const fb=document.getElementById('themeFeedback');
  fb.textContent='✅ Theme saved! Refresh portfolio to see changes.'; fb.className='form-feedback-admin success';
  setTimeout(()=>fb.textContent='',3000);
}

function resetTheme(){
  localStorage.removeItem(THEME_KEY); applyPreset('cyber');
  const fb=document.getElementById('themeFeedback');
  fb.textContent='✅ Reset to default.'; fb.className='form-feedback-admin success';
  setTimeout(()=>fb.textContent='',2000);
}

function loadSavedTheme(){
  const raw=localStorage.getItem(THEME_KEY); if(!raw) return;
  let t; try{t=JSON.parse(raw);}catch{return;}
  const pm={'--bg':'thBg','--surface':'thSurface','--accent':'thAccent','--accent2':'thAccent2','--accent3':'thAccent3','--text':'thText','--muted':'thMuted'};
  Object.entries(t).forEach(([k,v])=>{ liveColor(k,v); const el=document.getElementById(pm[k]); if(el) el.value=v; });
}

/* ===================================================
   SITE INFO
   =================================================== */
function loadSiteInfoForm(){
  const raw=localStorage.getItem(SITEINFO_KEY);
  let info=DEFAULT_SITEINFO;
  try{ if(raw) info={...DEFAULT_SITEINFO,...JSON.parse(raw)}; }catch{}
  const s=(id,val)=>{ const el=document.getElementById(id); if(el) el.value=val||''; };
  s('siName',info.name); s('siNameAr',info.nameAr);
  s('siTitle',info.title); s('siTitleAr',info.titleAr);
  s('siDesc',info.desc); s('siDescAr',info.descAr);
  s('siEmail',info.email); s('siPhone',info.phone);
  s('siWhatsapp',info.whatsapp); s('siLocation',info.location);
  s('siLinkedin',info.linkedin); s('siGithub',info.github);
  s('siStat1',info.stat1); s('siStat1n',info.stat1n);
  s('siStat2',info.stat2); s('siStat2n',info.stat2n);
}

function saveSiteInfo(){
  const g=id=>{ const el=document.getElementById(id); return el?el.value.trim():''; };
  const info={
    name:g('siName'),nameAr:g('siNameAr'),lastName:'Ashraf',lastNameAr:'أشرف',
    title:g('siTitle'),titleAr:g('siTitleAr'),
    desc:g('siDesc'),descAr:g('siDescAr'),
    email:g('siEmail'),phone:g('siPhone'),
    whatsapp:g('siWhatsapp'),location:g('siLocation'),
    linkedin:g('siLinkedin'),github:g('siGithub'),
    stat1:g('siStat1'),stat1n:g('siStat1n'),
    stat2:g('siStat2'),stat2n:g('siStat2n'),
  };
  localStorage.setItem(SITEINFO_KEY,JSON.stringify(info));
  const fb=document.getElementById('siteInfoFeedback');
  fb.textContent='✅ Saved! Refresh portfolio to see changes.'; fb.className='form-feedback-admin success';
  setTimeout(()=>fb.textContent='',3000);
}

function resetSiteInfo(){
  if(!confirm('Reset to default?')) return;
  localStorage.removeItem(SITEINFO_KEY); loadSiteInfoForm();
  const fb=document.getElementById('siteInfoFeedback');
  fb.textContent='✅ Reset.'; fb.className='form-feedback-admin success';
  setTimeout(()=>fb.textContent='',2000);
}

/* ===================================================
   ANALYTICS
   =================================================== */
function loadAnalytics(){
  let d={}; try{d=JSON.parse(localStorage.getItem('aa_analytics')||'{}');}catch{}
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('an-total',d.totalVisits||0); set('an-today',d.todayVisits||0); set('an-lastvisit',d.lastVisit||'—');
  let projs=[]; try{projs=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch{}
  set('an-projects',projs.length);
  set('an-active',projs.filter(p=>p.status==='active').length);
  set('an-hidden',projs.filter(p=>p.status!=='active').length);
  let total=0; for(let k in localStorage){ if(localStorage.hasOwnProperty(k)) total+=(localStorage[k]||'').length; }
  set('an-storage',(total*2/1024).toFixed(1)+' KB / 5 MB');
}
function resetAnalytics(){ if(!confirm('Reset analytics?')) return; localStorage.removeItem('aa_analytics'); loadAnalytics(); }

/* ===================================================
   SETTINGS
   =================================================== */
function changePassword(){
  const cur=document.getElementById('sCurrent').value;
  const nw=document.getElementById('sNew').value;
  const conf=document.getElementById('sConfirm').value;
  const fb=document.getElementById('settingsFeedback');
  if(cur!==getPass()){ fb.textContent='❌ Wrong current password.'; fb.className='form-feedback-admin error'; return; }
  if(nw.length<6){ fb.textContent='❌ Min 6 characters.'; fb.className='form-feedback-admin error'; return; }
  if(nw!==conf){ fb.textContent='❌ Passwords do not match.'; fb.className='form-feedback-admin error'; return; }
  localStorage.setItem(PASS_KEY,nw);
  fb.textContent='✅ Password changed!'; fb.className='form-feedback-admin success';
  ['sCurrent','sNew','sConfirm'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
}
function resetToDefaults(){
  if(!confirm('Reset all projects to default?')) return;
  projects=JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  saveProjects(); renderProjects();
  switchTab('projects',document.querySelector('[data-tab="projects"]'));
}

/* ===================================================
   MEDIA UPLOAD
   =================================================== */
const MAX_FILE = 5*1024*1024;

function switchMediaTab(name,el){
  document.querySelectorAll('.media-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.media-tab').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById('mediaTab-'+name); if(tab) tab.classList.add('active');
  if(el) el.classList.add('active');
}
function dragOverZone(e){ e.preventDefault(); document.getElementById('uploadZone').classList.add('drag-over'); }
function dragLeaveZone(){ document.getElementById('uploadZone').classList.remove('drag-over'); }
function dropOnZone(e){ e.preventDefault(); dragLeaveZone(); const f=e.dataTransfer.files[0]; if(f) processFile(f); }
function handleFileUpload(input){ if(input.files&&input.files[0]) processFile(input.files[0]); }

function processFile(file){
  const fb=document.getElementById('formFeedback');
  if(!file.type.startsWith('image/')){ fb.textContent='❌ Images only.'; fb.className='form-feedback-admin error'; return; }
  if(file.size>MAX_FILE){ fb.textContent='❌ Max 5 MB.'; fb.className='form-feedback-admin error'; return; }
  fb.textContent='';
  const box=document.getElementById('uploadPreview');
  box.classList.remove('hidden');
  box.innerHTML='<div class="upload-progress"><div class="upload-progress-bar" id="pgBar"></div></div>';
  let w=0; const iv=setInterval(()=>{ w=Math.min(w+12,90); const b=document.getElementById('pgBar'); if(b) b.style.width=w+'%'; else clearInterval(iv); },60);
  const reader=new FileReader();
  reader.onload=e=>{ clearInterval(iv); _mediaData={type:'image',value:e.target.result,name:file.name}; showImgPreview('uploadPreview',e.target.result); updateMediaBadge(); };
  reader.readAsDataURL(file);
}

function previewUrl(url){
  const box=document.getElementById('urlPreview');
  if(!url){ box.classList.add('hidden'); box.innerHTML=''; return; }
  _mediaData={type:'image',value:url,name:url.split('/').pop()};
  showImgPreview('urlPreview',url); updateMediaBadge();
}

function previewVideo(url){
  const box=document.getElementById('videoPreview');
  if(!url){ box.classList.add('hidden'); box.innerHTML=''; return; }
  _mediaData={type:'video',value:url,name:'Video'};
  const emb=getVidEmbed(url);
  box.classList.remove('hidden');
  if(emb) box.innerHTML='<iframe src="'+emb+'" allowfullscreen></iframe>';
  else if(/\.mp4|webm|ogg/i.test(url)) box.innerHTML='<video src="'+url+'" controls></video>';
  else box.innerHTML='<p style="padding:20px;color:var(--muted)">Link saved.</p>';
  updateMediaBadge();
}

function getVidEmbed(url){
  let m;
  m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/); if(m) return 'https://www.youtube.com/embed/'+m[1];
  m=url.match(/vimeo\.com\/(\d+)/); if(m) return 'https://player.vimeo.com/video/'+m[1];
  return null;
}
function showImgPreview(boxId,src){
  const box=document.getElementById(boxId); if(!box) return;
  box.classList.remove('hidden');
  box.innerHTML='<img src="'+src+'" alt="preview" onerror="this.parentElement.innerHTML=\'<p style=\\"padding:16px;color:var(--danger)\\">❌ Cannot load image</p>\'">';
}
function clearAllPreviews(){
  ['uploadPreview','urlPreview','videoPreview'].forEach(id=>{ const el=document.getElementById(id); if(el){el.classList.add('hidden');el.innerHTML='';} });
  ['fMediaFile','fMediaUrl','fVideoUrl'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
}
function updateMediaBadge(){
  const badge=document.getElementById('currentMedia');
  const name=document.getElementById('currentMediaName');
  if(!badge||!name) return;
  if(_mediaData.value){ badge.classList.remove('hidden'); name.textContent=(_mediaData.type==='video'?'🎬 ':'🖼️ ')+(_mediaData.name||'').slice(0,60); }
  else badge.classList.add('hidden');
}
function updateCurrentMediaBadge(){ updateMediaBadge(); }
function removeMedia(){ _mediaData={type:null,value:null,name:null}; clearAllPreviews(); updateMediaBadge(); }

function loadMediaIntoForm(p){
  _mediaData={type:null,value:null,name:null}; clearAllPreviews();
  if(!p.media){ updateMediaBadge(); return; }
  _mediaData={type:p.media.type,value:p.media.value,name:p.media.name||''};
  if(p.media.type==='image'){
    const el=document.getElementById('fMediaUrl');
    if(el&&!p.media.value.startsWith('data:')) el.value=p.media.value;
    showImgPreview('urlPreview',p.media.value);
    if(!p.media.value.startsWith('data:')) switchMediaTab('url',document.querySelectorAll('.media-tab')[1]);
  } else if(p.media.type==='video'){
    const el=document.getElementById('fVideoUrl'); if(el) el.value=p.media.value;
    previewVideo(p.media.value);
    switchMediaTab('video',document.querySelectorAll('.media-tab')[2]);
  }
  updateMediaBadge();
}
