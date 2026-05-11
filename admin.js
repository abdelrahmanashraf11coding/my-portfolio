/* ===================================================
   ADMIN PANEL — admin.js  (clean rewrite)
   Abdelrahman Ashraf Portfolio
   =================================================== */

/* ===== CONFIG ===== */
const STORAGE_KEY  = 'aa_portfolio_projects';
const AUTH_KEY     = 'aa_admin_auth';
const PASS_KEY     = 'aa_admin_pass';
const DEFAULT_PASS = 'abdelrahmanashraf123'; // Change this default password before first use!

/* ===== DEFAULT PROJECTS ===== */
const DEFAULT_PROJECTS = [
  {
    id:'p1', title:'Business Leads Automation', titleAr:'أداة أتمتة العملاء المحتملين',
    desc:'Automated tool that collects 20+ business leads from Google Maps in seconds. Generates professional Excel reports with contact details, ratings, and market analysis.',
    descAr:'أداة آلية تجمع أكثر من 20 عميلاً محتملاً من خرائط Google في ثوانٍ.',
    tags:['Python','Google API','Excel'], emoji:'🗺️', color:'blue',
    github:'https://github.com/abdelrahmanashraf11coding/business-leads-automatio',
    stats:[], status:'active', order:0, media:null
  },
  {
    id:'p2', title:'AI Competitor Analysis', titleAr:'تحليل المنافسين بالذكاء الاصطناعي',
    desc:'Analyzed 23,906 car sales records from Kaggle. Built 4 professional charts revealing market leaders, price positioning, regional strength, and body style demand.',
    descAr:'تحليل 23,906 سجل مبيعات سيارات من Kaggle.',
    tags:['Python','Pandas','Matplotlib'], emoji:'📊', color:'purple',
    github:'https://github.com/abdelrahmanashraf11coding/car-competitor-analysis',
    stats:[], status:'active', order:1, media:null
  },
  {
    id:'p3', title:'WhatsApp Sales Dashboard', titleAr:'لوحة تحكم مبيعات WhatsApp',
    desc:'Automated sales analytics dashboard analyzing 9,800+ sales records. Visualizes revenue trends, top products, and regional performance automatically.',
    descAr:'لوحة تحليلات مبيعات آلية تحلل أكثر من 9,800 سجل مبيعات.',
    tags:['Python','Pandas','Dashboard'], emoji:'📱', color:'green',
    github:'https://github.com/abdelrahmanashraf11coding',
    stats:[], status:'active', order:2, media:null
  },
  {
    id:'p4', title:'Amazon Sales Forecasting AI', titleAr:'توقع مبيعات Amazon بالذكاء الاصطناعي',
    desc:'Analyzed 128,975 real Amazon India orders. Cleaned to 108,071 rows, identified top category (Set clothing) & top state (Maharashtra). Used Linear Regression ML model to forecast 39.5M ₹ revenue.',
    descAr:'تحليل 128,975 طلب Amazon هندي حقيقي. استخدام نموذج ML للتنبؤ بـ 39.5 مليون روبية.',
    tags:['Machine Learning','Scikit-learn','Forecasting'], emoji:'🛒', color:'orange',
    github:'https://github.com/abdelrahmanashraf11coding/amazon-sales-forecasting',
    stats:['📦 128K Orders','💰 71.6M ₹','🔮 AI Forecast'], status:'active', order:3, media:null
  }
];

/* ===== STATE ===== */
let projects     = [];
let deleteTarget = null;
let _mediaData   = { type:null, value:null, name:null };
let dragSrcId    = null;

/* ===== UTILS ===== */
const getPass     = () => localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
const isLoggedIn  = () => sessionStorage.getItem(AUTH_KEY) === '1';
const genId       = () => 'p_' + Date.now();
const saveProjects= () => localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
const loadProjects= () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { projects = JSON.parse(raw); } catch { projects = [...DEFAULT_PROJECTS]; } }
  else      { projects = [...DEFAULT_PROJECTS]; saveProjects(); }
};

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
    err.textContent = '❌ Wrong password. Try again.';
    setTimeout(() => err.textContent = '', 2500);
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginPassword').focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pwInput = document.getElementById('loginPassword');
  if (pwInput) pwInput.addEventListener('keyup', e => { if (e.key === 'Enter') doLogin(); });
  if (isLoggedIn()) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    init();
  }
});

function doLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
}

/* ===== INIT ===== */
function init() {
  loadProjects();
  renderProjects();
}

/* ===== TABS ===== */
function switchTab(name, el) {
  // hide all tabs
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // show target tab
  const target = document.getElementById('tab-' + name);
  if (target) target.classList.add('active');
  if (el)     el.classList.add('active');

  // update header
  const titles = { projects:'Projects', add:'Add Project', analytics:'Analytics', settings:'Settings' };
  const subs   = { projects:'Manage your portfolio projects', add:'Create a new project entry', analytics:'Site statistics & insights', settings:'Admin preferences' };
  const titleEl = document.getElementById('tabTitle');
  const subEl   = document.getElementById('tabSub');
  if (titleEl) titleEl.textContent = titles[name] || name;
  if (subEl)   subEl.textContent   = subs[name]   || '';

  // tab-specific actions
  if (name === 'projects') renderProjects();
  if (name === 'add')      { resetForm(); document.getElementById('formCardTitle').textContent = 'New Project'; }
  if (name === 'analytics') loadAnalytics();
}

/* ===== RENDER PROJECTS ===== */
function renderProjects() {
  const sorted = [...projects].sort((a,b) => (a.order??0)-(b.order??0));

  document.getElementById('countAll').textContent    = sorted.length;
  document.getElementById('countActive').textContent  = sorted.filter(p=>p.status==='active').length;
  document.getElementById('countHidden').textContent  = sorted.filter(p=>p.status!=='active').length;

  const container = document.getElementById('projectsList');
  if (!container) return;

  if (!sorted.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📂</div><p>No projects yet. Click "Add Project" to start.</p></div>`;
    return;
  }

  container.innerHTML = sorted.map(p => {
    const bg = p.color || 'blue';
    const em = p.emoji || 'X';
    let thumbHtml;
    if (p.media && p.media.type === 'image') {
      thumbHtml = ["<img class=\"card-media-thumb\" src=\"", p.media.value, "\" alt=\"thumb\">"].join("");
    } else {
      thumbHtml = "<div class=\"card-emoji bg-" + bg + "\">" + em + "</div>";
    }

    const tagsHtml = (p.tags||[]).map(t=>`<span class="card-tag">${t}</span>`).join('');
    const statusCls= p.status==='active' ? 'status-active' : 'status-hidden';
    const statusTxt= p.status==='active' ? '● Active' : '○ Hidden';
    const hideBtnTxt= p.status==='active' ? '🙈 Hide' : '👁 Show';

    return `
    <div class="project-admin-card ${p.status!=='active'?'is-hidden':''}"
         draggable="true" id="card-${p.id}"
         ondragstart="dragStart(event,'${p.id}')"
         ondragover="dragOver(event)"
         ondrop="dragDrop(event,'${p.id}')">
      <span class="drag-handle" title="Drag to reorder">⠿</span>
      ${thumbHtml}
      <div class="card-info">
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-tags">${tagsHtml}</div>
      </div>
      <span class="card-status ${statusCls}">${statusTxt}</span>
      <div class="card-actions">
        <button class="btn-edit"   onclick="editProject('${p.id}')">✏️ Edit</button>
        <button class="btn-hide"   onclick="toggleHide('${p.id}')">${hideBtnTxt}</button>
        <button class="btn-delete" onclick="openDeleteModal('${p.id}')">🗑️ Delete</button>
      </div>
    </div>`;
  }).join('');
}

/* ===== EDIT PROJECT ===== */
function editProject(id) {
  const p = projects.find(x=>x.id===id);
  if (!p) return;

  document.getElementById('editId').value   = p.id;
  document.getElementById('fTitle').value   = p.title   || '';
  document.getElementById('fTitleAr').value = p.titleAr || '';
  document.getElementById('fDesc').value    = p.desc    || '';
  document.getElementById('fDescAr').value  = p.descAr  || '';
  document.getElementById('fGithub').value  = p.github  || '';
  document.getElementById('fTags').value    = (p.tags||[]).join(', ');
  document.getElementById('fEmoji').value   = p.emoji   || '📊';
  document.getElementById('fColor').value   = p.color   || 'blue';
  document.getElementById('fStatus').value  = p.status  || 'active';
  document.getElementById('fStats').value   = (p.stats||[]).join('\n');

  document.getElementById('formCardTitle').textContent = '✏️ Edit Project';
  loadMediaIntoForm(p);
  switchTab('add', document.querySelector('[data-tab="add"]'));
}

/* ===== SAVE PROJECT ===== */
function saveProject() {
  const id    = document.getElementById('editId').value;
  const title = document.getElementById('fTitle').value.trim();
  const desc  = document.getElementById('fDesc').value.trim();
  const fb    = document.getElementById('formFeedback');

  if (!title || !desc) {
    fb.textContent = '❌ Title and Description are required.';
    fb.className   = 'form-feedback-admin error';
    return;
  }

  const tags   = document.getElementById('fTags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const statsR = document.getElementById('fStats').value.split('\n').map(s=>s.trim()).filter(Boolean);
  const media  = _mediaData.value ? {..._mediaData} : null;

  const data = {
    title,
    titleAr: document.getElementById('fTitleAr').value.trim(),
    desc,
    descAr:  document.getElementById('fDescAr').value.trim(),
    github:  document.getElementById('fGithub').value.trim(),
    tags,
    emoji:   document.getElementById('fEmoji').value.trim() || '📊',
    color:   document.getElementById('fColor').value,
    status:  document.getElementById('fStatus').value,
    stats:   statsR,
    media,
  };

  if (id) {
    const idx = projects.findIndex(x=>x.id===id);
    if (idx !== -1) projects[idx] = { ...projects[idx], ...data };
  } else {
    data.id    = genId();
    data.order = projects.length;
    projects.push(data);
  }

  saveProjects();
  fb.textContent = id ? '✅ Project updated!' : '✅ Project added!';
  fb.className   = 'form-feedback-admin success';
  setTimeout(() => {
    switchTab('projects', document.querySelector('[data-tab="projects"]'));
    fb.textContent = '';
  }, 1200);
}

/* ===== TOGGLE HIDE ===== */
function toggleHide(id) {
  const p = projects.find(x=>x.id===id);
  if (!p) return;
  p.status = p.status === 'active' ? 'hidden' : 'active';
  saveProjects();
  renderProjects();
}

/* ===== DELETE MODAL ===== */
function openDeleteModal(id) {
  deleteTarget = id;
  const p = projects.find(x=>x.id===id);
  document.getElementById('deleteModalName').textContent = p ? `"${p.title}"` : '';
  document.getElementById('deleteModal').classList.remove('hidden');
}
function closeDeleteModal() {
  deleteTarget = null;
  document.getElementById('deleteModal').classList.add('hidden');
}
function confirmDelete() {
  if (!deleteTarget) return;
  projects = projects.filter(p=>p.id!==deleteTarget);
  saveProjects();
  closeDeleteModal();
  renderProjects();
}

/* ===== CANCEL / RESET FORM ===== */
function cancelEdit() {
  switchTab('projects', document.querySelector('[data-tab="projects"]'));
}

function resetForm() {
  ['editId','fTitle','fTitleAr','fDesc','fDescAr','fGithub','fStats','fMediaUrl','fVideoUrl']
    .forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('fTags').value   = '';
  document.getElementById('fEmoji').value  = '📊';
  document.getElementById('fColor').value  = 'blue';
  document.getElementById('fStatus').value = 'active';
  document.getElementById('formFeedback').textContent = '';
  _mediaData = { type:null, value:null, name:null };
  clearAllPreviews();
  updateCurrentMediaBadge();
  const firstTab = document.querySelector('.media-tab');
  if (firstTab) switchMediaTab('upload', firstTab);
}

/* ===== DRAG & DROP ===== */
function dragStart(e,id) { dragSrcId=id; e.dataTransfer.effectAllowed='move'; }
function dragOver(e)      { e.preventDefault(); e.dataTransfer.dropEffect='move'; }
function dragDrop(e,targetId) {
  e.preventDefault();
  if (dragSrcId===targetId) return;
  const si = projects.findIndex(p=>p.id===dragSrcId);
  const ti = projects.findIndex(p=>p.id===targetId);
  if (si===-1||ti===-1) return;
  const [moved] = projects.splice(si,1);
  projects.splice(ti,0,moved);
  projects.forEach((p,i)=>p.order=i);
  saveProjects();
  renderProjects();
}

/* ===== CHANGE PASSWORD ===== */
function changePassword() {
  const cur  = document.getElementById('sCurrent').value;
  const nw   = document.getElementById('sNew').value;
  const conf = document.getElementById('sConfirm').value;
  const fb   = document.getElementById('settingsFeedback');
  if (cur !== getPass())  { fb.textContent='❌ Current password is wrong.'; fb.className='form-feedback-admin error'; return; }
  if (nw.length < 6)      { fb.textContent='❌ New password must be at least 6 characters.'; fb.className='form-feedback-admin error'; return; }
  if (nw !== conf)        { fb.textContent='❌ Passwords do not match.'; fb.className='form-feedback-admin error'; return; }
  localStorage.setItem(PASS_KEY, nw);
  fb.textContent='✅ Password changed!'; fb.className='form-feedback-admin success';
  document.getElementById('sCurrent').value='';
  document.getElementById('sNew').value='';
  document.getElementById('sConfirm').value='';
}

/* ===== RESET TO DEFAULTS ===== */
function resetToDefaults() {
  if (!confirm('Reset all projects to default?')) return;
  projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  saveProjects();
  renderProjects();
  switchTab('projects', document.querySelector('[data-tab="projects"]'));
}

/* ===== ANALYTICS ===== */
function loadAnalytics() {
  let data = {};
  try { data = JSON.parse(localStorage.getItem('aa_analytics') || '{}'); } catch {}

  const set = (id,val) => { const el=document.getElementById(id); if(el) el.textContent=val; };

  set('an-total',     data.totalVisits || 0);
  set('an-today',     data.todayVisits || 0);
  set('an-lastvisit', data.lastVisit   || '—');

  let projs = [];
  try { projs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch {}
  set('an-projects', projs.length);
  set('an-active',   projs.filter(p=>p.status==='active').length);
  set('an-hidden',   projs.filter(p=>p.status!=='active').length);

  let total = 0;
  for (let k in localStorage) {
    if (localStorage.hasOwnProperty(k)) total += (localStorage[k]||'').length;
  }
  set('an-storage', (total*2/1024).toFixed(1) + ' KB / 5 MB');
}

function resetAnalytics() {
  if (!confirm('Reset all analytics data?')) return;
  localStorage.removeItem('aa_analytics');
  loadAnalytics();
}

/* =====================================================
   MEDIA UPLOAD
   ===================================================== */
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function switchMediaTab(name, el) {
  document.querySelectorAll('.media-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.media-tab').forEach(b=>b.classList.remove('active'));
  const tab = document.getElementById('mediaTab-'+name);
  if (tab) tab.classList.add('active');
  if (el)  el.classList.add('active');
}

function dragOverZone(e)  { e.preventDefault(); document.getElementById('uploadZone').classList.add('drag-over'); }
function dragLeaveZone(e) { document.getElementById('uploadZone').classList.remove('drag-over'); }
function dropOnZone(e)    { e.preventDefault(); document.getElementById('uploadZone').classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f) processFile(f); }
function handleFileUpload(input) { if(input.files&&input.files[0]) processFile(input.files[0]); }

function processFile(file) {
  const fb = document.getElementById('formFeedback');
  if (!file.type.startsWith('image/')) { fb.textContent='❌ Only image files.'; fb.className='form-feedback-admin error'; return; }
  if (file.size > MAX_FILE_BYTES) { fb.textContent=`❌ File too large (${(file.size/1024/1024).toFixed(1)} MB). Max 5 MB.`; fb.className='form-feedback-admin error'; return; }
  fb.textContent='';
  showProgress('uploadPreview');
  const reader = new FileReader();
  reader.onload = e => {
    _mediaData = { type:'image', value:e.target.result, name:file.name };
    showImagePreview('uploadPreview', e.target.result);
    updateCurrentMediaBadge();
  };
  reader.readAsDataURL(file);
}

function previewUrl(url) {
  const box = document.getElementById('urlPreview');
  if (!url) { box.classList.add('hidden'); box.innerHTML=''; return; }
  _mediaData = { type:'image', value:url, name:url.split('/').pop() };
  showImagePreview('urlPreview', url);
  updateCurrentMediaBadge();
}

function previewVideo(url) {
  const box = document.getElementById('videoPreview');
  if (!url) { box.classList.add('hidden'); box.innerHTML=''; return; }
  _mediaData = { type:'video', value:url, name:'Video link' };
  const embed = getVideoEmbed(url);
  box.classList.remove('hidden');
  if (embed)           box.innerHTML=`<iframe src="${embed}" allowfullscreen></iframe>`;
  else if (/\.mp4|webm|ogg/i.test(url)) box.innerHTML=`<video src="${url}" controls></video>`;
  else                 box.innerHTML=`<p style="padding:20px;color:var(--muted)">Preview not available — link saved.</p>`;
  updateCurrentMediaBadge();
}

function getVideoEmbed(url) {
  let m;
  m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  return null;
}

function showImagePreview(boxId, src) {
  const box = document.getElementById(boxId);
  box.classList.remove('hidden');
  box.innerHTML=`<img src="${src}" alt="preview" onerror="this.parentElement.innerHTML='<p style=\\"padding:16px;color:var(--danger)\\">❌ Could not load image</p>'">`;
}

function showProgress(boxId) {
  const box = document.getElementById(boxId);
  box.classList.remove('hidden');
  box.innerHTML=`<div class="upload-progress"><div class="upload-progress-bar" id="pgBar"></div></div>`;
  let w=0;
  const iv=setInterval(()=>{ w=Math.min(w+12,90); const b=document.getElementById('pgBar'); if(b) b.style.width=w+'%'; else clearInterval(iv); },60);
}

function clearAllPreviews() {
  ['uploadPreview','urlPreview','videoPreview'].forEach(id=>{ const el=document.getElementById(id); if(el){el.classList.add('hidden');el.innerHTML='';} });
  ['fMediaFile','fMediaUrl','fVideoUrl'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
}

function updateCurrentMediaBadge() {
  const badge=document.getElementById('currentMedia');
  const name =document.getElementById('currentMediaName');
  if (!badge||!name) return;
  if (_mediaData.value) {
    badge.classList.remove('hidden');
    name.textContent=(_mediaData.type==='video'?'🎬 ':'🖼️ ')+(_mediaData.name||_mediaData.value).slice(0,60);
  } else {
    badge.classList.add('hidden');
  }
}

function removeMedia() {
  _mediaData={type:null,value:null,name:null};
  clearAllPreviews();
  updateCurrentMediaBadge();
}

function loadMediaIntoForm(p) {
  _mediaData={type:null,value:null,name:null};
  clearAllPreviews();
  if (!p.media) { updateCurrentMediaBadge(); return; }
  _mediaData={type:p.media.type, value:p.media.value, name:p.media.name||''};
  if (p.media.type==='image') {
    const urlInput=document.getElementById('fMediaUrl');
    if (urlInput&&!p.media.value.startsWith('data:')) urlInput.value=p.media.value;
    showImagePreview('urlPreview', p.media.value);
    if (!p.media.value.startsWith('data:')) switchMediaTab('url', document.querySelectorAll('.media-tab')[1]);
  } else if (p.media.type==='video') {
    const vidInput=document.getElementById('fVideoUrl');
    if (vidInput) vidInput.value=p.media.value;
    previewVideo(p.media.value);
    switchMediaTab('video', document.querySelectorAll('.media-tab')[2]);
  }
  updateCurrentMediaBadge();
}
