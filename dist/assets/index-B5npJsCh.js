(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const Fe=(e,t)=>t.some(s=>e instanceof s);let it,rt;function gs(){return it||(it=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function vs(){return rt||(rt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ue=new WeakMap,Be=new WeakMap,Le=new WeakMap;function fs(e){const t=new Promise((s,n)=>{const a=()=>{e.removeEventListener("success",i),e.removeEventListener("error",o)},i=()=>{s(X(e.result)),a()},o=()=>{n(e.error),a()};e.addEventListener("success",i),e.addEventListener("error",o)});return Le.set(t,e),t}function bs(e){if(Ue.has(e))return;const t=new Promise((s,n)=>{const a=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",o),e.removeEventListener("abort",o)},i=()=>{s(),a()},o=()=>{n(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",i),e.addEventListener("error",o),e.addEventListener("abort",o)});Ue.set(e,t)}let He={get(e,t,s){if(e instanceof IDBTransaction){if(t==="done")return Ue.get(e);if(t==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return X(e[t])},set(e,t,s){return e[t]=s,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Tt(e){He=e(He)}function ys(e){return vs().includes(e)?function(...t){return e.apply(We(this),t),X(this.request)}:function(...t){return X(e.apply(We(this),t))}}function ws(e){return typeof e=="function"?ys(e):(e instanceof IDBTransaction&&bs(e),Fe(e,gs())?new Proxy(e,He):e)}function X(e){if(e instanceof IDBRequest)return fs(e);if(Be.has(e))return Be.get(e);const t=ws(e);return t!==e&&(Be.set(e,t),Le.set(t,e)),t}const We=e=>Le.get(e);function _s(e,t,{blocked:s,upgrade:n,blocking:a,terminated:i}={}){const o=indexedDB.open(e,t),r=X(o);return n&&o.addEventListener("upgradeneeded",d=>{n(X(o.result),d.oldVersion,d.newVersion,X(o.transaction),d)}),s&&o.addEventListener("blocked",d=>s(d.oldVersion,d.newVersion,d)),r.then(d=>{i&&d.addEventListener("close",()=>i()),a&&d.addEventListener("versionchange",c=>a(c.oldVersion,c.newVersion,c))}).catch(()=>{}),r}const Is=["get","getKey","getAll","getAllKeys","count"],ks=["put","add","delete","clear"],Ee=new Map;function ct(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Ee.get(t))return Ee.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,a=ks.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!(a||Is.includes(s)))return;const i=async function(o,...r){const d=this.transaction(o,a?"readwrite":"readonly");let c=d.store;return n&&(c=c.index(r.shift())),(await Promise.all([c[s](...r),a&&d.done]))[0]};return Ee.set(t,i),i}Tt(e=>({...e,get:(t,s,n)=>ct(t,s)||e.get(t,s,n),has:(t,s)=>!!ct(t,s)||e.has(t,s)}));const Ss=["continue","continuePrimaryKey","advance"],dt={},Ge=new WeakMap,Lt=new WeakMap,xs={get(e,t){if(!Ss.includes(t))return e[t];let s=dt[t];return s||(s=dt[t]=function(...n){Ge.set(this,Lt.get(this)[t](...n))}),s}};async function*$s(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const s=new Proxy(t,xs);for(Lt.set(s,t),Le.set(s,We(t));t;)yield s,t=await(Ge.get(s)||t.continue()),Ge.delete(s)}function lt(e,t){return t===Symbol.asyncIterator&&Fe(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Fe(e,[IDBIndex,IDBObjectStore])}Tt(e=>({...e,get(t,s,n){return lt(t,s)?$s:e.get(t,s,n)},has(t,s){return lt(t,s)||e.has(t,s)}}));const As="classconnect",Cs=5,xe="settings",K="feedbackCache",$e="cc_teacherAuthenticated",Dt="cc_currentStudent",Ts=["apiKey","teacherPin","theme"];let qe=null;function Ls(e){if(e.objectStoreNames.contains("students")||e.createObjectStore("students",{keyPath:"id",autoIncrement:!0}).createIndex("name","name",{unique:!1}),e.objectStoreNames.contains("progress")||e.createObjectStore("progress",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),!e.objectStoreNames.contains("quizResults")){const t=e.createObjectStore("quizResults",{keyPath:"id",autoIncrement:!0});t.createIndex("studentId","studentId",{unique:!1}),t.createIndex("lessonId","lessonId",{unique:!1})}if(e.objectStoreNames.contains("diagnostics")||e.createObjectStore("diagnostics",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),e.objectStoreNames.contains("tutorThreads")||e.createObjectStore("tutorThreads",{keyPath:"studentId"}),e.objectStoreNames.contains("assessments")||e.createObjectStore("assessments",{keyPath:"id",autoIncrement:!0}).createIndex("createdAt","createdAt",{unique:!1}),!e.objectStoreNames.contains("assessmentSubmissions")){const t=e.createObjectStore("assessmentSubmissions",{keyPath:"id",autoIncrement:!0});t.createIndex("assessmentId","assessmentId",{unique:!1}),t.createIndex("studentId","studentId",{unique:!1})}if(!e.objectStoreNames.contains(K)){const t=e.createObjectStore(K,{keyPath:"cacheKey"});t.createIndex("questionId","questionId",{unique:!1}),t.createIndex("updatedAt","updatedAt",{unique:!1})}e.objectStoreNames.contains(xe)||e.createObjectStore(xe,{keyPath:"key"})}function A(){return qe||(qe=_s(As,Cs,{upgrade(e){Ls(e)}})),qe}function Mt(e){try{return localStorage.getItem(`cc_${e}`)}catch{return null}}function Je(e,t){try{if(t==null||t===""){localStorage.removeItem(`cc_${e}`);return}localStorage.setItem(`cc_${e}`,t)}catch{}}async function Ve(e,t){await(await A()).put(xe,{key:e,value:t,updatedAt:new Date().toISOString()})}async function Ds(){const e=await A();await Promise.all(Ts.map(async t=>{const s=await e.get(xe,t);if(s!=null&&s.value){Je(t,s.value);return}const n=Mt(t);n&&await Ve(t,n)}))}function Ze(e){return Mt(e)}function Ms(e,t){Je(e,t),Ve(e,t)}async function Bt(e,t){Je(e,t),await Ve(e,t)}function ie(){return Ze("apiKey")}async function Et(e){await Bt("apiKey",e)}function Xe(){return Ze("teacherPin")}async function qt(e){await Bt("teacherPin",e)}async function Bs(e,t){const s=await A(),n=await Es(e,t);if(n)return n;const a=new Date().toISOString();return{id:await s.add("students",{name:e.trim(),pin:t,createdAt:a}),name:e.trim(),pin:t,createdAt:a}}async function Es(e,t){return(await(await A()).getAllFromIndex("students","name",e.trim())).find(a=>a.pin===t)||null}async function he(){return(await A()).getAll("students")}async function qs(e,t){const s=await A(),a=(await j(e)).find(r=>r.lessonId===t);if(a)return a;const i=new Date().toISOString();return{id:await s.add("progress",{studentId:e,lessonId:t,completedAt:i}),studentId:e,lessonId:t,completedAt:i}}async function j(e){return(await A()).getAllFromIndex("progress","studentId",e)}async function Pt(){return(await A()).getAll("progress")}async function Ps(e,t){return(await j(e)).some(n=>n.lessonId===t)}async function Rs(e){const t=await A(),s=new Date().toISOString(),n={...e,completedAt:s},a=await t.add("quizResults",n);return{...n,id:a}}async function ee(e){return(await A()).getAllFromIndex("quizResults","studentId",e)}async function ge(){return(await A()).getAll("quizResults")}async function zs(e){const t=await A(),s=new Date().toISOString(),n={...e,completedAt:s},a=await t.add("diagnostics",n);return{...n,id:a}}async function Rt(e){return(await A()).get("diagnostics",e)}async function Qs(e){return(await A()).getAllFromIndex("diagnostics","studentId",e)}async function U(e){return(await Qs(e)).slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt))[0]||null}async function zt(){return(await A()).getAll("diagnostics")}async function js(e){return(await A()).get("tutorThreads",e)}async function ut(e,t){const s=await A(),n={studentId:e,messages:t.slice(-20),updatedAt:new Date().toISOString()};return await s.put("tutorThreads",n),n}async function Ns(e){await(await A()).delete("tutorThreads",e)}async function Os(e){const t=await A(),s={...e,createdAt:e.createdAt||new Date().toISOString()},n=await t.add("assessments",s);return{...s,id:n}}async function Fs(e){return(await A()).get("assessments",e)}async function ve(){return(await A()).getAll("assessments")}async function Us(e){const t=await A(),s={...e,completedAt:e.completedAt||new Date().toISOString()},n=await t.add("assessmentSubmissions",s);return{...s,id:n}}async function Qt(e){return(await A()).getAllFromIndex("assessmentSubmissions","studentId",e)}async function fe(){return(await A()).getAll("assessmentSubmissions")}async function Hs(e){return(await A()).get(K,e)}async function Ws(e){return(await A()).getAllFromIndex(K,"questionId",e)}async function Gs(e){const t=await A(),s=await t.get(K,e.cacheKey),n=new Date().toISOString(),a={...s,...e,createdAt:(s==null?void 0:s.createdAt)||e.createdAt||n,updatedAt:n,usageCount:e.usageCount||(s?(s.usageCount||0)+1:1),lastUsedAt:e.lastUsedAt||n};return await t.put(K,a),a}async function et(e){const t=await A(),s=await t.get(K,e);if(!s)return null;const n={...s,usageCount:(s.usageCount||0)+1,lastUsedAt:new Date().toISOString()};return await t.put(K,n),n}function Ks(e){sessionStorage.setItem(Dt,JSON.stringify(e))}function T(){try{const e=sessionStorage.getItem(Dt);return e?JSON.parse(e):null}catch{return null}}function pt(e=!0){if(!e){sessionStorage.removeItem($e);return}sessionStorage.setItem($e,JSON.stringify({authenticated:!0,updatedAt:new Date().toISOString()}))}function mt(){var e;try{const t=sessionStorage.getItem($e);return!!(t&&((e=JSON.parse(t))!=null&&e.authenticated))}catch{return!1}}function Ys(){sessionStorage.removeItem($e)}async function Js(){var n;const e=await he(),t=await ge();let s=`Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)
`;for(const a of t){const i=e.find(d=>d.id===a.studentId),o=i?i.name:"Unknown",r=Math.round((a.totalTimeMs||0)/1e3);s+=`"${o}",${a.lessonId},${a.score},${a.totalQuestions},${((n=a.theta)==null?void 0:n.toFixed(2))||"N/A"},${a.level||"N/A"},"${a.completedAt}",${r}
`}return s}function Vs(e,t="classconnect_data.csv"){const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(s),a=document.createElement("a");a.href=n,a.download=t,a.click(),URL.revokeObjectURL(n)}const Zs="dark";function jt(e){return e==="light"?"light":Zs}function tt(){return jt(Ze("theme"))}function Nt(e){const t=jt(e);return document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t,t}function Xs(e){const t=Nt(e);return Ms("theme",t),t}function en(){return Xs(tt()==="dark"?"light":"dark")}function tn(){return Nt(tt())}function Ot(e){return e==="light"?`
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `:`
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `}function sn(){const e=tt(),t=e==="dark"?"light":"dark";return`
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${t} theme" title="Switch to ${t} theme">
      ${Ot(e)}
    </button>
  `}function B(e={}){const{title:t="ClassConnect",showBack:s=!1,backLabel:n="Back",studentName:a=null,showSettings:i=!1,showLogout:o=!1,logoutLabel:r="Sign out",showThemeToggle:d=!0}=e;return`
    <nav class="nav" id="main-nav">
      <div class="container">
        <div class="nav__inner">
          <div class="nav__left">
            ${s?`
              <button class="nav__back-btn" id="nav-back-btn" aria-label="Go back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${n}</span>
              </button>
            `:`
              <div class="nav__brand" id="nav-brand">
                <svg class="nav__logo" width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <rect x="4" y="8" width="56" height="40" rx="4" stroke="#818CF8" stroke-width="3" fill="none"/>
                  <rect x="20" y="52" width="24" height="4" rx="2" fill="#818CF8"/>
                  <circle cx="32" cy="28" r="8" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
                  <path d="M32 20v8l5.5 3" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span class="nav__brand-text">${t}</span>
              </div>
            `}
          </div>
          <div class="nav__right">
            ${a?`
              <span class="nav__student-name">
                <span class="nav__student-icon">Student</span>
                ${a}
              </span>
            `:""}
            <span class="nav__status" id="nav-status">
              <span class="status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}" id="status-dot"></span>
              <span class="nav__status-text" id="status-text">${navigator.onLine?"Online":"Offline"}</span>
            </span>
            <div class="nav__toolbar">
              ${d?sn():""}
              ${i?`
                <button class="btn btn--icon btn--ghost nav__settings-btn" id="nav-settings-btn" aria-label="Settings">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M16.5 10a6.5 6.5 0 01-.4 2.2l1.7 1.3-1.5 2.6-2-.6a6.5 6.5 0 01-3.8 2.2L10 20l-10.5-.3L9 17.7a6.5 6.5 0 01-3.8-2.2l-2 .6L1.7 13.5l1.7-1.3A6.5 6.5 0 013 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              `:""}
              ${o?`
                <button class="btn btn--ghost nav__logout-btn" id="nav-logout-btn" aria-label="${r}">
                  ${r}
                </button>
              `:""}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `}function P(e={}){const{onBack:t=null,onSettings:s=null,onBrand:n=null,onLogout:a=null}=e,i=document.getElementById("nav-back-btn");i&&t&&i.addEventListener("click",t);const o=document.getElementById("nav-settings-btn");o&&s&&o.addEventListener("click",s);const r=document.getElementById("nav-logout-btn");r&&a&&r.addEventListener("click",a);const d=document.getElementById("nav-theme-btn");d&&d.addEventListener("click",()=>{const l=en(),p=l==="dark"?"light":"dark";d.innerHTML=Ot(l),d.setAttribute("aria-label",`Switch to ${p} theme`),d.setAttribute("title",`Switch to ${p} theme`)});const c=document.getElementById("nav-brand");c&&n&&(c.addEventListener("click",n),c.style.cursor="pointer");const u=()=>{const l=document.getElementById("status-dot"),p=document.getElementById("status-text");l&&(l.className=`status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}`),p&&(p.textContent=navigator.onLine?"Online":"Offline")};window.addEventListener("online",u),window.addEventListener("offline",u)}function nn(){return`
    ${B({title:"ClassConnect"})}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-12); padding-bottom: var(--space-12);">
      <div style="text-align: center; margin-bottom: var(--space-10);">
        <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); background: linear-gradient(135deg, var(--color-primary-400), var(--color-accent-400)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: var(--font-weight-extrabold);">
          Welcome to ClassConnect
        </h1>
        <p style="color: var(--text-secondary); font-size: var(--font-size-lg);">
          Learn Computing with diagnostics, adaptive paths, AI tutoring, and secure AI-powered assessments.
        </p>
      </div>

      <div style="display: grid; gap: var(--space-6);">
        <button class="card card--glass card--interactive card--glow" id="btn-student" style="text-align: left; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">Student</div>
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2); color: var(--color-primary-300);">I am a Student</h2>
          <p style="color: var(--text-secondary);">Start with a diagnostic, follow a personalized lesson path, ask the AI tutor for help, and take secure assessments.</p>
        </button>

        <button class="card card--glass card--interactive card--glow" id="btn-teacher" style="text-align: left; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">Teacher</div>
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2); color: var(--color-accent-300);">I am a Teacher</h2>
          <p style="color: var(--text-secondary);">View risk predictions, build assessments, analyze submissions, and monitor intervention-ready analytics.</p>
        </button>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function an(e){P(),document.getElementById("btn-student").addEventListener("click",()=>{e("/student-login")}),document.getElementById("btn-teacher").addEventListener("click",()=>{e("/teacher-login")})}function be(e,t,s=""){const n=t>0?Math.round(e/t*100):0;return`
    <div class="progress-container" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100">
      ${s?`<div class="progress-label">${s}</div>`:""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${n}%"></div>
      </div>
      <div class="progress-text">${n}%</div>
    </div>
  `}function Ft(e){const t=["A","B","C","D"];return`
    <div class="question-card">
      <div class="question-card__stem">${e.stem}</div>
      <div class="question-options" id="question-options">
        ${e.options.map((s,n)=>`
          <button class="option-btn" data-index="${n}" id="option-${n}">
            <span class="option-btn__letter">${t[n]}</span>
            <span class="option-btn__text">${s}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `}function on(e){return e==="ai"?'<span class="badge badge--primary">AI Feedback</span>':e==="cache"?'<span class="badge badge--accent">Saved Offline</span>':e==="question-cache"?'<span class="badge badge--warning">Common Offline Hint</span>':e==="fallback"?'<span class="badge badge--neutral">Offline Hint</span>':'<span class="badge badge--success">Quick Check</span>'}function rn(e){return e.source==="ai"?"Powered by Gemini AI and saved for offline reuse.":e.source==="cache"?"Loaded from this device cache so feedback still works offline.":e.source==="question-cache"?"Reused from a common explanation for this question while offline.":e.source==="fallback"?"Using the built-in lesson explanation because no saved AI response matched yet.":""}function cn(e,t){return t||!e.practiceTip?"":`
    <div class="feedback-card__tip">
      <strong>Next step:</strong> ${e.practiceTip}
    </div>
  `}function dn(e,t){return t||!e.usageCount&&!e.reusedFromQuestionBank?"":e.reusedFromQuestionBank?'<div class="feedback-card__meta">Misconception memory: reused a common explanation for this question.</div>':(e.usageCount||0)>1?`<div class="feedback-card__meta">Misconception memory: this saved explanation has helped ${e.usageCount} times on this device.</div>`:""}function st(e,t){const s=t?"Correct":"Review",n=t?"Correct!":"Let's learn from this",a=rn(e);return`
    <div class="card feedback-card ${t?"feedback-card--correct":"feedback-card--incorrect"}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${s}</span>
        <span class="feedback-card__title">${n}</span>
        ${on(e.source)}
      </div>
      <div class="feedback-card__body">
        ${e.text}
      </div>
      ${cn(e,t)}
      ${dn(e,t)}
      ${a?`<div class="feedback-card__source">${a}</div>`:""}
    </div>
  `}function se(e,t,s,n="primary",a=""){return`
    <div class="card stat-card stat-card--${n}">
      <div class="stat-card__icon">${e}</div>
      <div class="stat-card__value">${t}</div>
      <div class="stat-card__label">${s}</div>
      ${a?`<div class="stat-card__detail">${a}</div>`:""}
    </div>
  `}let re=null;function D(e,t="info",s=3e3){re||(re=document.createElement("div"),re.className="toast-container",document.body.appendChild(re));const n={success:"OK",error:"X",info:"i"},a=document.createElement("div");a.className=`toast toast--${t}`,a.innerHTML=`<span>${n[t]||""}</span> ${e}`,re.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(100%)",a.style.transition="all 0.3s ease-out",setTimeout(()=>a.remove(),300)},s)}function Ut(e,t){const s=t>0?e/t:0,n=2*Math.PI*45,a=n*(1-s);let i="#FB7185";return s>=.8?i="#34D399":s>=.6?i="#818CF8":s>=.4&&(i="#FBBF24"),`
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"/>
        <circle class="ring-fill" cx="50" cy="50" r="45"
          stroke="${i}"
          stroke-dasharray="${n}"
          stroke-dashoffset="${a}"
          style="animation: ringDraw 1.5s ease-out forwards;"
        />
      </svg>
      <div class="quiz-results__score-label">
        <div class="quiz-results__score-value" style="color: ${i}">${e}</div>
        <div class="quiz-results__score-total">out of ${t}</div>
      </div>
    </div>
  `}function nt(e,t,s=[],n={}){const a=document.createElement("div");a.className="modal-overlay",a.id="modal-overlay";const i=n.modalClass?` ${n.modalClass}`:"";return a.innerHTML=`
    <div class="modal${i}">
      <h3 class="modal__title">${e}</h3>
      <div class="modal__body">${t}</div>
      <div class="modal__actions" id="modal-actions">
        ${s.map((o,r)=>`
          <button class="btn ${o.variant||"btn--ghost"}" id="modal-action-${r}">${o.label}</button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(a),s.forEach((o,r)=>{const d=document.getElementById(`modal-action-${r}`);d&&d.addEventListener("click",async()=>{let c=!0;o.onClick&&(c=await o.onClick(a)!==!1),c&&a.remove()})}),a.addEventListener("click",o=>{o.target===a&&a.remove()}),a}async function ln(){const e=await he();return`
    ${B({title:"ClassConnect",showBack:!0})}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-8); padding-bottom: var(--space-12);">
      <div class="card card--glass">
        <div style="text-align: center; margin-bottom: var(--space-8);">
          <h2 class="card__title" style="font-size: var(--font-size-2xl);">Student Login</h2>
          <p class="card__subtitle">Enter your name and a 4-digit PIN.</p>
        </div>

        <form id="login-form" style="display: flex; flex-direction: column; gap: var(--space-6);">
          <div class="input-group">
            <label for="student-name">Your Full Name</label>
            <input type="text" id="student-name" class="input" placeholder="e.g., Kwame Mensah" required minlength="2" autocomplete="off">
          </div>
          <div class="input-group">
            <label for="student-pin">4-Digit PIN (Keep this secret!)</label>
            <input type="password" id="student-pin" class="input input--pin" placeholder="••••" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric">
          </div>
          <button type="submit" class="btn btn--primary btn--lg btn--full">Continue to Your Learning Path</button>
        </form>

        ${e.length>0?`
          <div class="divider"></div>
          <h3 style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">Recent Students</h3>
          <div style="display: flex; flex-wrap: wrap; gap: var(--space-3);">
            ${e.slice(0,5).map(t=>`
              <button class="badge badge--neutral student-quick-select" data-name="${t.name}" style="padding: var(--space-2) var(--space-3); cursor: pointer; border: 1px solid var(--color-slate-600);">
                ${t.name}
              </button>
            `).join("")}
          </div>
        `:""}
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function un(e){P({onBack:()=>e("/")});const t=document.getElementById("login-form"),s=document.getElementById("student-name"),n=document.getElementById("student-pin");t.addEventListener("submit",async a=>{a.preventDefault();const i=s.value.trim(),o=n.value;if(!i||o.length!==4){D("Please enter your name and a 4-digit PIN.","error");return}try{const r=await Bs(i,o);Ks(r);const d=await U(r.id);e(d?"/lessons":"/diagnostic")}catch(r){console.error(r),D("Login failed. Please try again.","error")}}),document.querySelectorAll(".student-quick-select").forEach(a=>{a.addEventListener("click",i=>{s.value=i.target.dataset.name,n.focus()})})}function pn(){const t=!Xe();return`
    ${B({title:"Teacher Access",showBack:!0})}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-8); padding-bottom: var(--space-12);">
      <div class="card card--glass">
        <div style="text-align: center; margin-bottom: var(--space-8);">
          <h2 class="card__title" style="font-size: var(--font-size-2xl);">
            ${t?"Set Up Teacher Access":"Teacher Sign In"}
          </h2>
          <p class="card__subtitle">
            ${t?"Create a 4-digit teacher PIN for this device. You can also save a Gemini API key now or later.":"Enter your teacher PIN to open the dashboard on this device."}
          </p>
        </div>

        <form id="teacher-access-form" style="display: flex; flex-direction: column; gap: var(--space-6);">
          <div class="input-group">
            <label for="teacher-pin">${t?"Create 4-digit Teacher PIN":"Teacher PIN"}</label>
            <input type="password" id="teacher-pin" class="input input--pin" placeholder="0000" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric">
          </div>

          ${t?`
            <div class="input-group">
              <label for="teacher-pin-confirm">Confirm Teacher PIN</label>
              <input type="password" id="teacher-pin-confirm" class="input input--pin" placeholder="0000" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric">
            </div>
            <div class="input-group">
              <label for="teacher-api-key">Gemini API Key (optional)</label>
              <input type="password" id="teacher-api-key" class="input" value="${ie()||""}" placeholder="AIzaSy...">
            </div>
          `:""}

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${t?"Save PIN and Open Dashboard":"Open Dashboard"}
          </button>
        </form>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function mn(e){P({onBack:()=>e("/")});const t=Xe(),s=!t,n=document.getElementById("teacher-access-form"),a=document.getElementById("teacher-pin"),i=document.getElementById("teacher-pin-confirm"),o=document.getElementById("teacher-api-key");n.addEventListener("submit",async r=>{r.preventDefault();const d=a.value.trim();if(!/^\d{4}$/.test(d)){D("Enter a valid 4-digit teacher PIN.","error");return}if(s){const c=i==null?void 0:i.value.trim();if(d!==c){D("Teacher PINs do not match yet.","error");return}try{await qt(d),o!=null&&o.value.trim()&&await Et(o.value.trim()),pt(!0),D("Teacher access saved for this device.","success"),e("/dashboard")}catch(u){console.error(u),D("Unable to save teacher access right now.","error")}return}if(d!==t){D("That teacher PIN is not correct.","error");return}pt(!0),e("/dashboard")})}const x=[{id:1,title:"What Is a Computer?",duration:"10 min",objectives:["Define what a computer is and explain its basic purpose","Identify different types of computers used today","Understand how computers have evolved through generations"],keyTerms:[{word:"Computer",definition:"An electronic device that accepts data (input), processes it, and produces useful information (output)."},{word:"Data",definition:"Raw facts and figures that have not yet been processed — such as numbers, words, or images."},{word:"Information",definition:"Data that has been processed and organized so it is meaningful and useful."},{word:"Hardware",definition:"The physical parts of a computer that you can see and touch."},{word:"Software",definition:"Programs and instructions that tell the computer what to do."}],content:`
      <h2>What Exactly Is a Computer?</h2>
      <p>A <strong>computer</strong> is an electronic device that can accept data, process it according to a set of instructions (called a <em>program</em>), and produce results as information. Think of it as a very fast, very obedient machine that follows instructions perfectly.</p>
      <p>Computers are all around us — in our classrooms, homes, banks, hospitals, and even in our pockets as smartphones. They help people work faster, communicate easily, and solve complex problems.</p>

      <div class="info-box">
        <div class="info-box__title">💡 Did You Know?</div>
        <div class="info-box__text">The word "computer" originally referred to a <strong>person</strong> who performed calculations! It was only in the 20th century that the word began to mean the electronic machines we know today.</div>
      </div>

      <h2>Types of Computers</h2>
      <p>Computers come in many sizes and shapes. Here are the most common types you will encounter:</p>
      <ul>
        <li><strong>Desktop Computer</strong> — A computer designed to sit on a desk. It has a separate monitor, keyboard, mouse, and system unit. Desktops are powerful and commonly used in offices and computer labs.</li>
        <li><strong>Laptop Computer</strong> — A portable computer that folds open and has everything built in — screen, keyboard, and trackpad. You can carry it in a bag and use it anywhere.</li>
        <li><strong>Tablet</strong> — A flat, touch-screen computer. It is lighter than a laptop and you control it by tapping and swiping the screen. Examples include the iPad and Samsung Galaxy Tab.</li>
        <li><strong>Smartphone</strong> — A small, powerful computer that also makes phone calls. Modern smartphones can browse the internet, take photos, run apps, and much more.</li>
        <li><strong>Server</strong> — A powerful computer that provides services to other computers on a network. When you visit a website, a server somewhere is sending that information to your device.</li>
      </ul>

      <h2>Generations of Computers</h2>
      <p>Computers have changed dramatically over the years. We group these changes into <strong>generations</strong>:</p>
      <ol>
        <li><strong>First Generation (1940s–1950s)</strong> — Used vacuum tubes. These computers were enormous (filling entire rooms!), very expensive, and generated a lot of heat. Example: ENIAC.</li>
        <li><strong>Second Generation (1950s–1960s)</strong> — Used transistors instead of vacuum tubes. They were smaller, faster, and more reliable.</li>
        <li><strong>Third Generation (1960s–1970s)</strong> — Used integrated circuits (tiny chips with many transistors). Computers became even smaller and more affordable.</li>
        <li><strong>Fourth Generation (1970s–Present)</strong> — Used microprocessors (entire CPUs on a single chip). This is the generation that gave us personal computers, laptops, and smartphones.</li>
        <li><strong>Fifth Generation (Present & Future)</strong> — Focuses on artificial intelligence (AI). These computers can learn, understand speech, and make decisions.</li>
      </ol>

      <div class="info-box">
        <div class="info-box__title">🇬🇭 Local Connection</div>
        <div class="info-box__text">Many JHS schools in Ghana now have computer labs with desktop computers. Some teachers use tablets and smartphones to support classroom learning. Understanding these types of computers will help you use them more effectively!</div>
      </div>

      <h2>Summary</h2>
      <p>A computer is an electronic device that processes data into information. There are many types — from large desktops to small smartphones — and they have evolved through five generations, getting smaller, faster, and smarter with each generation.</p>
    `},{id:2,title:"Inside the Computer",duration:"12 min",objectives:["Identify the main internal components of a computer system","Explain the function of the CPU, RAM, and motherboard","Understand the difference between RAM and storage"],keyTerms:[{word:"CPU",definition:'Central Processing Unit — the "brain" of the computer that carries out instructions and performs calculations.'},{word:"RAM",definition:"Random Access Memory — temporary, fast memory that holds data the computer is currently using. It loses its contents when the computer is turned off."},{word:"Motherboard",definition:"The main circuit board inside the computer. All other components connect to it."},{word:"ROM",definition:"Read-Only Memory — permanent memory that holds startup instructions. It keeps its contents even when the computer is off."},{word:"Power Supply Unit",definition:"A component that converts electricity from the wall outlet into the correct voltage for computer components."}],content:`
      <h2>Opening Up the Computer</h2>
      <p>Have you ever wondered what is inside a computer? If you carefully open the case of a desktop computer (called the <strong>system unit</strong>), you will find several important components working together. Let's explore them!</p>

      <h2>The Motherboard</h2>
      <p>The <strong>motherboard</strong> is the largest circuit board inside the computer. Think of it as the "backbone" — it connects all the other parts together and allows them to communicate. Every component, from the CPU to the storage drive, plugs into the motherboard.</p>
      <p>If you look at a motherboard, you will see many slots, sockets, and connectors. Each one has a specific purpose.</p>

      <h2>The CPU — The Brain</h2>
      <p>The <strong>Central Processing Unit (CPU)</strong> is the most important component. It is often called the "brain" of the computer because it carries out all the instructions from software programs.</p>
      <p>The CPU does two main things:</p>
      <ul>
        <li><strong>Arithmetic operations</strong> — calculations like adding, subtracting, multiplying</li>
        <li><strong>Logic operations</strong> — comparisons like "Is A greater than B?"</li>
      </ul>
      <p>Modern CPUs are incredibly fast. They can perform <em>billions</em> of operations per second! The speed of a CPU is measured in <strong>GHz (gigahertz)</strong>.</p>

      <h2>RAM — The Short-Term Memory</h2>
      <p><strong>RAM (Random Access Memory)</strong> is like a desk where the computer puts things it is currently working on. It is very fast, but it is <em>temporary</em> — when you turn off the computer, everything in RAM disappears.</p>
      <p>The more RAM a computer has, the more tasks it can handle at the same time without slowing down. Most modern computers have between 4 GB and 16 GB of RAM.</p>

      <div class="info-box">
        <div class="info-box__title">🤔 RAM vs. Storage — What's the Difference?</div>
        <div class="info-box__text">
          Think of it this way: <strong>RAM</strong> is like your school desk — it holds what you're working on right now, but you clear it at the end of the day. <strong>Storage</strong> (like a hard drive) is like your school locker — it keeps your books and files safely even when you're not using them.
        </div>
      </div>

      <h2>ROM — The Permanent Instructions</h2>
      <p><strong>ROM (Read-Only Memory)</strong> contains permanent instructions that the computer needs to start up. Unlike RAM, ROM keeps its contents even when the power is off. When you press the power button, the computer reads ROM first to know how to begin loading the operating system.</p>

      <h2>The Power Supply Unit (PSU)</h2>
      <p>The <strong>Power Supply Unit</strong> converts the electricity from the wall outlet (AC power) into the type of electricity the computer components need (DC power). Without the PSU, nothing inside the computer would work.</p>

      <h2>How They All Work Together</h2>
      <p>Here's how a simple task works inside the computer:</p>
      <ol>
        <li>You type something on the keyboard (<strong>input</strong>)</li>
        <li>The signal travels through the <strong>motherboard</strong> to the <strong>CPU</strong></li>
        <li>The CPU retrieves instructions and data from <strong>RAM</strong></li>
        <li>The CPU processes the data</li>
        <li>The result is sent to the monitor (<strong>output</strong>)</li>
      </ol>

      <h2>Summary</h2>
      <p>Inside every computer, you'll find a motherboard (the backbone), a CPU (the brain), RAM (short-term memory), ROM (permanent startup instructions), and a power supply. These components work together to process data into useful information.</p>
    `},{id:3,title:"Input Devices",duration:"10 min",objectives:["Define what an input device is","Identify and describe common input devices","Explain how input devices are used in everyday life"],keyTerms:[{word:"Input Device",definition:"Any hardware that allows you to enter data or commands into a computer."},{word:"Keyboard",definition:"An input device with keys (letters, numbers, symbols) used to type text and commands."},{word:"Mouse",definition:"A pointing device used to move the cursor on screen and select items by clicking."},{word:"Scanner",definition:"A device that reads images or text from paper and converts them into digital format."},{word:"Touchscreen",definition:"A display that detects touch, allowing you to interact directly with what is shown on screen."}],content:`
      <h2>What Are Input Devices?</h2>
      <p>An <strong>input device</strong> is any piece of hardware that lets you send data or commands into a computer. Without input devices, you would have no way to tell the computer what to do!</p>
      <p>When you type a letter, click a button, or speak into a microphone, you are using an input device. The computer receives this input, processes it, and then gives you a result.</p>

      <h2>Common Input Devices</h2>

      <h3>1. Keyboard</h3>
      <p>The <strong>keyboard</strong> is one of the most common input devices. It has keys for letters (A-Z), numbers (0-9), symbols, and special function keys. You use it to type documents, enter passwords, write emails, and give commands to the computer.</p>
      <p>There are different types of keyboards: <strong>wired keyboards</strong> that connect with a cable, and <strong>wireless keyboards</strong> that use Bluetooth or a USB receiver.</p>

      <h3>2. Mouse</h3>
      <p>The <strong>mouse</strong> is a pointing device that controls the cursor (arrow) on the screen. By moving the mouse on a flat surface, you can point to items on the screen. You use buttons on the mouse to select, open, and drag items.</p>
      <p>Types include: <strong>optical mouse</strong> (uses a light sensor), <strong>wireless mouse</strong>, and the <strong>trackpad</strong> (built into laptops).</p>

      <h3>3. Touchscreen</h3>
      <p>A <strong>touchscreen</strong> is both a display and an input device. You interact with it by tapping, swiping, and pinching directly on the screen. Smartphones, tablets, and some modern laptops have touchscreens.</p>

      <h3>4. Microphone</h3>
      <p>A <strong>microphone</strong> captures sound (your voice, music, etc.) and converts it into digital data that the computer can process. It is used for voice calls, recording audio, and voice commands (like talking to a virtual assistant).</p>

      <h3>5. Scanner</h3>
      <p>A <strong>scanner</strong> takes a physical document or photo and converts it into a digital image that you can view, edit, or save on the computer. Scanners are commonly used in offices and schools.</p>

      <h3>6. Webcam (Camera)</h3>
      <p>A <strong>webcam</strong> captures video and images. It is used for video calls, online classes, and taking photos. Most laptops have a built-in webcam above the screen.</p>

      <div class="info-box">
        <div class="info-box__title">🇬🇭 In the Ghanaian Classroom</div>
        <div class="info-box__text">In many JHS computer labs in Ghana, students use keyboards and mice to interact with desktop computers. As smartphones become more common, touchscreens are becoming a familiar input method for many students. Understanding these devices helps you make the most of the technology available to you.</div>
      </div>

      <h2>Summary</h2>
      <p>Input devices allow us to send data and commands to the computer. The most common input devices are the keyboard, mouse, touchscreen, microphone, scanner, and webcam. Each one captures a different type of input — text, movement, touch, sound, images, or video.</p>
    `},{id:4,title:"Output Devices",duration:"10 min",objectives:["Define what an output device is","Identify and describe common output devices","Explain the difference between input and output devices"],keyTerms:[{word:"Output Device",definition:"Any hardware that presents or displays processed data from the computer to the user."},{word:"Monitor",definition:"A screen that displays visual output — text, images, video — from the computer."},{word:"Printer",definition:"A device that produces a physical (hard) copy of digital documents on paper."},{word:"Speaker",definition:"A device that outputs sound — music, voice, alerts — from the computer."},{word:"Projector",definition:"A device that projects the computer's display onto a large screen or wall."}],content:`
      <h2>What Are Output Devices?</h2>
      <p>An <strong>output device</strong> is any piece of hardware that takes processed data from the computer and presents it in a form that humans can understand — such as text on a screen, sound from a speaker, or a printed page.</p>
      <p>If input devices let you <em>talk</em> to the computer, then output devices let the computer <em>talk back</em> to you!</p>

      <h2>Common Output Devices</h2>

      <h3>1. Monitor (Screen)</h3>
      <p>The <strong>monitor</strong> is the most common output device. It displays everything you see — your documents, websites, videos, and the desktop. Monitors come in different sizes and types:</p>
      <ul>
        <li><strong>LCD (Liquid Crystal Display)</strong> — thin, lightweight, and energy-efficient</li>
        <li><strong>LED (Light Emitting Diode)</strong> — a type of LCD that uses LED backlighting for brighter, sharper images</li>
        <li><strong>Touchscreen monitors</strong> — serve as both input and output devices</li>
      </ul>

      <h3>2. Printer</h3>
      <p>A <strong>printer</strong> produces a <em>hard copy</em> (physical paper version) of digital documents. There are several types:</p>
      <ul>
        <li><strong>Inkjet Printer</strong> — sprays tiny drops of ink onto paper. Good for photos and color documents.</li>
        <li><strong>Laser Printer</strong> — uses a laser beam and toner powder. Fast and efficient for large amounts of text.</li>
        <li><strong>3D Printer</strong> — creates three-dimensional physical objects from digital designs!</li>
      </ul>

      <h3>3. Speakers and Headphones</h3>
      <p><strong>Speakers</strong> convert electrical signals into sound. They output music, voice, sound effects, and system alerts. <strong>Headphones</strong> work the same way but deliver sound directly to your ears privately.</p>

      <h3>4. Projector</h3>
      <p>A <strong>projector</strong> takes the computer's display and projects it as a large image on a wall or screen. Projectors are widely used in classrooms and meetings to show presentations and videos to a large audience.</p>

      <h3>5. Plotter</h3>
      <p>A <strong>plotter</strong> is a special type of printer that draws high-quality graphics, maps, architectural plans, and engineering designs on large paper. Unlike regular printers, plotters use pens to draw continuous lines.</p>

      <div class="info-box">
        <div class="info-box__title">🔄 Input vs. Output — A Quick Comparison</div>
        <div class="info-box__text">
          <strong>Input devices</strong> send data TO the computer (keyboard, mouse, microphone).<br/>
          <strong>Output devices</strong> receive data FROM the computer (monitor, printer, speaker).<br/><br/>
          Some devices do both! A <strong>touchscreen</strong> is both input (you tap it) and output (it displays information). These are sometimes called <em>I/O devices</em>.
        </div>
      </div>

      <h2>Summary</h2>
      <p>Output devices display or present processed data from the computer. The most common output devices are monitors, printers, speakers, projectors, and plotters. Together with input devices, they allow us to interact with computers effectively.</p>
    `},{id:5,title:"Storage & Putting It All Together",duration:"12 min",objectives:["Explain what storage devices are and why they are needed","Compare different types of storage media","Describe how all components of a computer system work together"],keyTerms:[{word:"Storage Device",definition:"Hardware that saves (stores) data permanently so it can be accessed later, even after the computer is turned off."},{word:"Hard Disk Drive (HDD)",definition:"A storage device that uses spinning magnetic disks to read and write data. It offers large capacity at lower cost."},{word:"Solid State Drive (SSD)",definition:"A storage device that uses flash memory chips (no moving parts). It is much faster than an HDD but costs more."},{word:"Flash Drive (Pen Drive)",definition:"A small, portable storage device that connects via USB. It uses flash memory and is easy to carry around."},{word:"Cloud Storage",definition:"Storing data on remote servers accessed through the internet (e.g., Google Drive, Dropbox) instead of on a physical device."}],content:`
      <h2>Why Do We Need Storage?</h2>
      <p>Remember that <strong>RAM</strong> only holds data temporarily — it disappears when the computer shuts down. So where do we keep our files, photos, documents, and programs permanently? That's the job of <strong>storage devices</strong>.</p>
      <p>Storage devices save data so you can access it later — even days, months, or years from now.</p>

      <h2>Types of Storage</h2>

      <h3>1. Hard Disk Drive (HDD)</h3>
      <p>An <strong>HDD</strong> is one of the oldest types of storage still in use today. Inside, it has spinning magnetic disks (called <em>platters</em>) and a read/write head that moves across them to store and retrieve data.</p>
      <ul>
        <li><strong>Advantages:</strong> Large storage capacity (500 GB to several TB), relatively cheap</li>
        <li><strong>Disadvantages:</strong> Slower than SSDs, has moving parts that can break if dropped</li>
      </ul>

      <h3>2. Solid State Drive (SSD)</h3>
      <p>An <strong>SSD</strong> stores data on flash memory chips — there are no moving parts. This makes it much faster, more durable, and quieter than an HDD.</p>
      <ul>
        <li><strong>Advantages:</strong> Very fast read/write speeds, durable (no moving parts), silent</li>
        <li><strong>Disadvantages:</strong> More expensive per gigabyte than HDDs</li>
      </ul>

      <h3>3. Flash Drive (USB Pen Drive)</h3>
      <p>A <strong>flash drive</strong> (sometimes called a pen drive or thumb drive) is a small, portable storage device that plugs into a USB port. It uses the same flash memory technology as SSDs but in a tiny, carry-anywhere form.</p>
      <p>Flash drives typically range from 4 GB to 256 GB and are very convenient for moving files between computers.</p>

      <h3>4. Memory Card (SD Card)</h3>
      <p>An <strong>SD card</strong> is a tiny storage card used in cameras, smartphones, and tablets. Despite its small size, it can hold a large amount of data — from photos to videos to apps.</p>

      <h3>5. Optical Discs (CD, DVD, Blu-ray)</h3>
      <p><strong>Optical discs</strong> store data that is read by a laser beam. CDs hold about 700 MB, DVDs about 4.7 GB, and Blu-ray discs up to 50 GB. They are less common today but are still used for movies, music, and software distribution.</p>

      <h3>6. Cloud Storage</h3>
      <p><strong>Cloud storage</strong> saves your files on remote servers accessed through the internet. Services like <strong>Google Drive</strong>, <strong>Dropbox</strong>, and <strong>OneDrive</strong> allow you to store, access, and share files from any device with an internet connection.</p>

      <div class="info-box">
        <div class="info-box__title">⚡ Quick Comparison</div>
        <div class="info-box__text">
          <strong>Speed:</strong> SSD > Flash Drive > HDD > Optical Disc<br/>
          <strong>Capacity:</strong> HDD > SSD > Blu-ray > Flash Drive > SD Card > CD<br/>
          <strong>Portability:</strong> Flash Drive > SD Card > SSD > HDD
        </div>
      </div>

      <h2>Putting It All Together: The Computer System</h2>
      <p>Now you know all the main parts of a computer system. Let's see how they work together in a real example:</p>
      <p><em>Imagine you want to type a school report and print it:</em></p>
      <ol>
        <li><strong>Input:</strong> You type your report using the <strong>keyboard</strong> (input device)</li>
        <li><strong>Processing:</strong> The <strong>CPU</strong> processes each keystroke, using <strong>RAM</strong> to temporarily hold your document</li>
        <li><strong>Output:</strong> The <strong>monitor</strong> (output device) displays your text as you type</li>
        <li><strong>Storage:</strong> You save the file to the <strong>hard drive</strong> (storage device) so you won't lose it</li>
        <li><strong>Output:</strong> You send the document to the <strong>printer</strong> (output device) to get a paper copy</li>
      </ol>
      <p>This is the complete cycle: <strong>Input → Processing → Output → Storage</strong>. Every task on a computer follows this pattern!</p>

      <div class="info-box">
        <div class="info-box__title">🇬🇭 Local Connection</div>
        <div class="info-box__text">In many Ghanaian schools, students use flash drives to save their work and carry it between home and the computer lab. Understanding storage helps you keep your schoolwork safe and organized. Always remember to safely eject your flash drive before removing it!</div>
      </div>

      <h2>Summary</h2>
      <p>Storage devices keep our data safe permanently. HDDs offer large, affordable storage; SSDs are faster but costlier; flash drives are portable and convenient; and cloud storage lets us access files anywhere with internet. Together, input devices, the CPU, RAM, output devices, and storage devices form a complete computer system that follows the cycle: Input → Processing → Output → Storage.</p>
    `}],hn={1:{src:"/images/lesson-1-computer-types.png",alt:"Illustration of a desktop computer, laptop, tablet, smartphone, and server tower",caption:"Different types of computers suit different jobs, but they all accept data, process it, and give useful results."},2:{src:"/images/lesson-2-inside-computer.png",alt:"Illustration of a desktop tower opened to show the motherboard, CPU, RAM, storage drive, and power supply",caption:"Internal hardware works together through the motherboard so the CPU, memory, storage, and power system can do their jobs."},3:{src:"/images/lesson-3-input-devices.png",alt:"Illustration collage of a keyboard, mouse, touchscreen tablet, microphone, scanner, and webcam",caption:"Input devices help students send text, sound, touch, and images into a computer."},4:{src:"/images/lesson-4-output-devices.png",alt:"Illustration collage of a monitor, printer, speakers, projector, and plotter",caption:"Output devices help the computer present information as visuals, sound, or printed work."},5:{src:"/images/lesson-5-storage-devices.png",alt:"Illustration comparing a hard drive, solid state drive, flash drive, SD card, optical disc, and cloud storage symbol",caption:"Storage devices keep schoolwork, software, and media safe so learners can use them again later."}};function Ht(e,t=0,s=1){return Math.max(t,Math.min(s,e))}function at(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function gn(e){return Math.round(Ht(e)*100)}function Wt(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return new Map(t.map(s=>[s.lessonId,s]))}function vn(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).forEach(s=>{t.has(s.lessonId)||t.set(s.lessonId,s)}),t}function fn(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).slice(0,3).forEach(s=>{var a;const n=((a=s.responses)==null?void 0:a.filter(i=>!i.correct).length)||0;t.set(s.lessonId,(t.get(s.lessonId)||0)+n)}),t}function bn(e){return e>=.8?"mastered":e>=.6?"growing":e>=.4?"review":"urgent"}function yn(e){const t=at(e.map(n=>n.mastery)),s=e.filter(n=>n.status==="urgent").length;return t>=.75&&s===0?{label:"Ready to Accelerate",tone:"success",description:"You have strong foundations across the strand. Push into harder quizzes and extension practice."}:t>=.55?{label:"Foundations Growing",tone:"accent",description:"You are building confidence. Focus on the weakest topics first, then continue the recommended path."}:{label:"Needs Guided Support",tone:"danger",description:"Your learning path should begin with a few targeted reviews before moving ahead."}}function wn(e,t,s){const n=fn(t),a=Wt(s);return e.map(o=>{const r=a.get(o.lessonId),d=n.get(o.lessonId)||0,c=[];let u=0;return r&&r.accuracy<.5&&(c.push("low diagnostic readiness"),u+=25),o.latestQuizScore!==null&&o.latestQuizScore<.6&&(c.push("recent quiz performance dropped"),u+=20),d>0&&(c.push(`${d} recent missed question${d===1?"":"s"}`),u+=d*6),o.completed||(u+=8),!c.length&&o.mastery>=.65?null:{lessonId:o.lessonId,title:o.title,priority:u,reason:c.length?c.join(", "):"This topic will benefit from one more focused review.",action:`Revisit ${o.title}, then use the AI Tutor before retaking the quiz.`}}).filter(Boolean).sort((o,r)=>r.priority-o.priority).slice(0,4)}function _n(e){const t=e.filter(o=>!o.completed&&o.status==="urgent").sort((o,r)=>o.lessonId-r.lessonId),s=e.filter(o=>!o.completed&&o.status==="review").sort((o,r)=>o.lessonId-r.lessonId),n=e.filter(o=>!o.completed&&(o.status==="growing"||o.status==="mastered")).sort((o,r)=>o.lessonId-r.lessonId),a=e.filter(o=>o.completed&&(o.status==="urgent"||o.status==="review")).sort((o,r)=>o.mastery-r.mastery||o.lessonId-r.lessonId),i=e.filter(o=>o.completed&&(o.status==="growing"||o.status==="mastered")).sort((o,r)=>o.lessonId-r.lessonId);return[...t,...s,...n,...a,...i]}function In(e,t=[],s=null){var c,u;const n=t.slice().sort((l,p)=>new Date(p.completedAt)-new Date(l.completedAt)),a=n[0]||null,i=n.length>0?at(n.map(l=>l.score/l.totalQuestions)):null;let o=0;const r=[];if(s||(o+=10,r.push("no diagnostic profile yet")),e.completionRate<40&&(o+=15,r.push("low lesson completion")),e.knowledgeGaps.length>=3&&(o+=20,r.push("several knowledge gaps remain open")),a){const l=a.score/a.totalQuestions;l<.5?(o+=25,r.push("latest quiz score below 50%")):l<.65&&(o+=12,r.push("latest quiz score needs support")),a.theta<-.75?(o+=25,r.push("ability estimate is trending low")):a.theta<-.25&&(o+=12,r.push("ability estimate suggests review"))}i!==null&&i<.6&&n.length>=2&&(o+=10,r.push("recent quiz trend is still below target"));const d=Math.min(100,o);return d>=60?{score:d,label:"High",badge:"danger",reasons:r,action:`Teacher check-in recommended. Start with ${((c=e.recommendedNext)==null?void 0:c.title)||"the weakest topic"} and review the revision queue.`}:d>=35?{score:d,label:"Moderate",badge:"warning",reasons:r,action:`Guide the learner through ${((u=e.recommendedNext)==null?void 0:u.title)||"the next recommended lesson"} and schedule a tutor session.`}:{score:d,label:"Low",badge:"success",reasons:r.length?r:["steady progress across current evidence"],action:"Keep the learner on the personalized path and use the tutor for stretch support."}}function N({diagnostic:e=null,results:t=[],progressRecords:s=[]}={}){const n=new Set(s.map(m=>m.lessonId)),a=Wt(e),i=vn(t),o=x.map(m=>{const f=a.get(m.id),b=t.filter(te=>te.lessonId===m.id).sort((te,hs)=>new Date(hs.completedAt)-new Date(te.completedAt)),h=i.get(m.id)||null,w=h?h.score/h.totalQuestions:null,v=b.length?at(b.map(te=>te.score/te.totalQuestions)):null,y=f?f.accuracy:null,_=n.has(m.id);let C=0,E=0;y!==null&&(C+=y*.35,E+=.35),w!==null&&(C+=w*.45,E+=.45),v!==null&&b.length>1&&(C+=v*.1,E+=.1),_&&(C+=.1,E+=.1);let O=E>0?C/E:.2;_&&E===0&&(O=.55),O=Ht(O);const ms=bn(O);let we="Continue building momentum on this topic.";return f&&f.accuracy<.5?we="The diagnostic found this topic needs early attention.":w!==null&&w<.6?we="Recent quiz results suggest a focused review here.":_||(we="This topic is ready to learn next in your path."),{lessonId:m.id,title:m.title,completed:_,mastery:O,masteryPercent:gn(O),status:ms,diagnosticScore:y,latestQuizScore:w,latestTheta:(h==null?void 0:h.theta)??null,attempts:b.length,recommendedFocus:we}}),r=_n(o),d=o.filter(m=>m.status==="urgent"||m.status==="review").sort((m,f)=>m.mastery-f.mastery).slice(0,3),c=o.filter(m=>m.status==="mastered"||m.status==="growing").sort((m,f)=>f.mastery-m.mastery).slice(0,3),u=wn(o,t,e),l=yn(o),p=x.length>0?Math.round(n.size/x.length*100):0,g={lessonProfiles:o,recommendedSequence:r,recommendedNext:r.find(m=>!m.completed)||r[0]||null,knowledgeGaps:d,strengths:c,revisionQueue:u,readiness:l,completionRate:p,completedCount:n.size};return g.risk=In(g,t,e),g}function kn(e,t){var s,n,a,i;return`
    <div class="card card--glass learning-hub">
      <div class="learning-hub__header">
        <div>
          <div class="learning-hub__eyebrow">Personalized learning path</div>
          <h2 class="learning-hub__title">${e.readiness.label}</h2>
          <p class="learning-hub__text">${e.readiness.description}</p>
        </div>
        <div class="learning-hub__badges">
          <span class="badge badge--${e.readiness.tone}">${e.completionRate}% complete</span>
          <span class="badge badge--${t?"primary":"warning"}">${t?"Diagnostic complete":"Diagnostic recommended"}</span>
          <span class="badge badge--neutral">Risk: ${e.risk.label}</span>
        </div>
      </div>

      <div class="learning-hub__grid">
        <div class="learning-hub__panel">
          <div class="learning-hub__panel-label">Recommended next lesson</div>
          <div class="learning-hub__panel-value">${((s=e.recommendedNext)==null?void 0:s.title)||"Lesson 1"}</div>
          <div class="learning-hub__panel-meta">${((n=e.recommendedNext)==null?void 0:n.recommendedFocus)||"Start with the first lesson to build your path."}</div>
        </div>

        <div class="learning-hub__panel">
          <div class="learning-hub__panel-label">Top focus area</div>
          <div class="learning-hub__panel-value">${((a=e.knowledgeGaps[0])==null?void 0:a.title)||"Keep building across all lessons"}</div>
          <div class="learning-hub__panel-meta">${((i=e.revisionQueue[0])==null?void 0:i.reason)||"Your current evidence is looking steady."}</div>
        </div>
      </div>

      <div class="learning-hub__actions">
        <button class="btn btn--primary" id="btn-open-path">Start Recommended Lesson</button>
        <button class="btn btn--accent" id="btn-open-assessments">Assessment Center</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-open-diagnostic">${t?"Retake Diagnostic":"Take Diagnostic"}</button>
      </div>
    </div>
  `}function Sn(e){return e.revisionQueue.length?`
    <div class="card revision-queue">
      <div class="revision-queue__header">
        <div>
          <h3 class="revision-queue__title">Smart Revision Queue</h3>
          <p class="revision-queue__subtitle">These are the best topics to review next based on your diagnostic and quiz history.</p>
        </div>
      </div>

      <div class="revision-queue__list">
        ${e.revisionQueue.map(t=>`
          <button class="revision-queue__item" data-lesson-id="${t.lessonId}">
            <div class="revision-queue__title-row">
              <span class="revision-queue__item-title">${t.title}</span>
              <span class="badge badge--warning">Priority ${t.priority}</span>
            </div>
            <div class="revision-queue__reason">${t.reason}</div>
            <div class="revision-queue__action">${t.action}</div>
          </button>
        `).join("")}
      </div>
    </div>
  `:""}function xn(e){return`
    <div class="card adaptive-preview">
      <div class="revision-queue__header">
        <div>
          <h3 class="revision-queue__title">Adaptive Content Path</h3>
          <p class="revision-queue__subtitle">Lesson sequencing updates as your evidence changes.</p>
        </div>
      </div>

      <div class="adaptive-preview__list">
        ${e.recommendedSequence.slice(0,4).map((t,s)=>`
          <button class="adaptive-preview__item" data-lesson-id="${t.lessonId}">
            <div class="adaptive-preview__step">${s+1}</div>
            <div class="adaptive-preview__body">
              <div class="adaptive-preview__title">${t.title}</div>
              <div class="adaptive-preview__meta">${t.masteryPercent}% mastery | ${t.recommendedFocus}</div>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  `}async function $n(){const e=T(),t=e?await j(e.id):[],s=new Set(t.map(o=>o.lessonId)),n=e?await ee(e.id):[],a=e?await U(e.id):null,i=N({diagnostic:a,results:n,progressRecords:t});return`
    ${B({title:"Topics",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${kn(i,!!a)}
      ${Sn(i)}
      ${xn(i)}
      ${be(s.size,x.length,"Lessons completed")}

      <div class="lesson-list">
        ${x.map((o,r)=>{var p;const d=s.has(o.id),c=i.lessonProfiles.find(g=>g.lessonId===o.id),u=((p=i.recommendedNext)==null?void 0:p.lessonId)===o.id,l=i.knowledgeGaps.some(g=>g.lessonId===o.id);return`
            <div class="card card--interactive lesson-card" data-id="${o.id}">
              <div class="lesson-card__number ${d?"lesson-card__number--completed":""}">
                ${d?"Done":r+1}
              </div>
              <div class="lesson-card__info">
                <div class="lesson-card__title">${o.title}</div>
                <div class="lesson-card__meta">
                  <span>${o.duration}</span>
                  <span>${o.objectives.length} objectives</span>
                  <span>${(c==null?void 0:c.masteryPercent)||0}% mastery</span>
                </div>
                <div class="lesson-card__badges">
                  ${u?'<span class="badge badge--primary">Recommended next</span>':""}
                  ${l?'<span class="badge badge--warning">Focus</span>':""}
                </div>
              </div>
              <div class="lesson-card__status">
                ${d?'<span class="badge badge--success">Completed</span>':'<span class="badge badge--neutral">Start</span>'}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function An(e){P({onBack:()=>e("/")});const t=document.getElementById("btn-open-path");t&&t.addEventListener("click",async()=>{var u;const i=T(),o=i?await j(i.id):[],r=i?await U(i.id):null,d=i?await ee(i.id):[],c=N({diagnostic:r,results:d,progressRecords:o});e(`/lesson/${((u=c.recommendedNext)==null?void 0:u.lessonId)||1}`)});const s=document.getElementById("btn-open-tutor");s&&s.addEventListener("click",()=>e("/tutor"));const n=document.getElementById("btn-open-assessments");n&&n.addEventListener("click",()=>e("/assessments"));const a=document.getElementById("btn-open-diagnostic");a&&a.addEventListener("click",()=>e("/diagnostic")),document.querySelectorAll(".revision-queue__item, .adaptive-preview__item").forEach(i=>{i.addEventListener("click",o=>{const r=Number.parseInt(o.currentTarget.dataset.lessonId,10);e(`/lesson/${r}`)})}),document.querySelectorAll(".lesson-card").forEach(i=>{i.addEventListener("click",o=>{const r=Number.parseInt(o.currentTarget.dataset.id,10);e(`/lesson/${r}`)})})}async function Cn(e){var l;const t=T(),s=x.find(p=>p.id===e);if(!s)return'<div class="container" style="padding: 2rem;">Lesson not found.</div>';const n=x.indexOf(s),a=t?await Ps(t.id,e):!1,i=hn[e],o=t?await j(t.id):[],r=t?await ee(t.id):[],d=t?await U(t.id):null,u=N({diagnostic:d,results:r,progressRecords:o}).lessonProfiles.find(p=>p.lessonId===e);return`
    ${B({title:"Lesson",showBack:!0,studentName:t==null?void 0:t.name})}

    <div class="container container--narrow view-enter lesson-page">
      ${be(n+1,x.length,`Lesson ${n+1} of ${x.length}`)}
      <div class="lesson-progress-strip">
        ${x.map((p,g)=>`
          <div class="lesson-progress-pip ${g===n?"lesson-progress-pip--current":""} ${g<n?"lesson-progress-pip--completed":""}"></div>
        `).join("")}
      </div>

      <div class="lesson-header">
        <div class="lesson-header__meta">
          <span class="lesson-header__number">Lesson ${n+1}</span>
          <span class="badge badge--neutral">${s.duration}</span>
          <span class="badge badge--${(u==null?void 0:u.status)==="mastered"?"success":(u==null?void 0:u.status)==="growing"?"accent":"warning"}">${(u==null?void 0:u.masteryPercent)||0}% mastery</span>
        </div>
        <h1 class="lesson-header__title">${s.title}</h1>

        <div class="lesson-header__objectives">
          ${s.objectives.map(p=>`
            <div class="lesson-header__objective">${p}</div>
          `).join("")}
        </div>
      </div>

      <div class="lesson-content">
        <div class="lesson-support card card--glass">
          <div>
            <div class="lesson-support__title">Need help with this lesson?</div>
            <div class="lesson-support__text">${(u==null?void 0:u.recommendedFocus)||"Use the AI Tutor for an explanation before you take the quiz."}</div>
          </div>
          <button class="btn btn--accent btn--sm" id="btn-ask-tutor">Ask AI Tutor</button>
        </div>

        ${i?`
          <figure class="lesson-image">
            <img src="${i.src}" alt="${i.alt}" loading="lazy">
            <figcaption class="lesson-image__caption">${i.caption}</figcaption>
          </figure>
        `:""}
        ${s.content}

        ${(l=s.keyTerms)!=null&&l.length?`
          <div class="key-terms">
            <div class="key-terms__title">Key Terms to Remember</div>
            <div class="key-terms__list">
              ${s.keyTerms.map(p=>`
                <div class="key-term">
                  <div class="key-term__word">${p.word}</div>
                  <div class="key-term__def">${p.definition}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}
      </div>

      <div class="lesson-actions">
        <div class="lesson-actions__nav">
          ${n>0?'<button class="btn btn--ghost" id="btn-prev-lesson">Previous Lesson</button>':"<div></div>"}
        </div>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: flex-end;">
          ${a?`
            <span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
              Completed
            </span>
          `:`
            <button class="btn btn--primary" id="btn-mark-complete">Mark as Complete</button>
          `}

          <button class="btn btn--accent" id="btn-take-quiz" ${a?"":'disabled title="Complete lesson first"'}>
            Take Adaptive Quiz
          </button>
        </div>
      </div>
    </div>
  `}function Tn(e,t){P({onBack:()=>e("/lessons")});const s=T(),n=x.find(c=>c.id===t),a=x.indexOf(n),i=document.getElementById("btn-mark-complete"),o=document.getElementById("btn-take-quiz"),r=document.getElementById("btn-prev-lesson");r&&r.addEventListener("click",()=>{e(`/lesson/${x[a-1].id}`)}),i&&s&&i.addEventListener("click",async()=>{await qs(s.id,t),i.outerHTML='<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>',o&&(o.removeAttribute("disabled"),o.removeAttribute("title")),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}),o&&o.addEventListener("click",()=>{e(`/quiz/${t}`)});const d=document.getElementById("btn-ask-tutor");d&&d.addEventListener("click",()=>{e("/tutor")})}const Ae=[{id:"L1Q1",lessonId:1,stem:"What is the BEST definition of a computer?",options:["A machine that only plays games and videos","An electronic device that accepts data, processes it, and produces information","Any device that uses electricity","A tool used only for typing documents"],correctIndex:1,difficulty:-1.5,discrimination:1.2,guessing:.25},{id:"L1Q2",lessonId:1,stem:"Which of these is NOT a type of computer?",options:["Desktop","Laptop","Calculator","Tablet"],correctIndex:2,difficulty:-.8,discrimination:1,guessing:.25},{id:"L1Q3",lessonId:1,stem:"What technology did FIRST generation computers use?",options:["Microprocessors","Transistors","Vacuum tubes","Integrated circuits"],correctIndex:2,difficulty:.3,discrimination:1.3,guessing:.25},{id:"L1Q4",lessonId:1,stem:"Which generation of computers introduced the microprocessor?",options:["First generation","Second generation","Third generation","Fourth generation"],correctIndex:3,difficulty:.5,discrimination:1.1,guessing:.25},{id:"L1Q5",lessonId:1,stem:"What is the difference between data and information?",options:["Data is processed; information is raw","Data is raw facts; information is processed and meaningful","They mean the same thing","Data is digital; information is analog"],correctIndex:1,difficulty:0,discrimination:1.4,guessing:.25},{id:"L1Q6",lessonId:1,stem:"A smartphone is a type of computer.",options:["True — it processes data and runs programs","False — it is only a phone","True — but only expensive ones","False — it has no keyboard"],correctIndex:0,difficulty:-1,discrimination:.9,guessing:.25},{id:"L1Q7",lessonId:1,stem:"What does the fifth generation of computers focus on?",options:["Vacuum tubes","Transistors","Artificial Intelligence","Magnetic storage"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L1Q8",lessonId:1,stem:"A server is a powerful computer that:",options:["Only stores personal photos","Provides services to other computers on a network","Cannot connect to the internet","Is smaller than a smartphone"],correctIndex:1,difficulty:.8,discrimination:1.3,guessing:.25},{id:"L2Q1",lessonId:2,stem:"What is the CPU often called?",options:["The heart of the computer","The brain of the computer","The body of the computer","The memory of the computer"],correctIndex:1,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L2Q2",lessonId:2,stem:"What is the main function of the motherboard?",options:["To store files permanently","To display images on screen","To connect all computer components and allow them to communicate","To provide internet access"],correctIndex:2,difficulty:-.3,discrimination:1.2,guessing:.25},{id:"L2Q3",lessonId:2,stem:"What happens to data in RAM when the computer is turned off?",options:["It is saved permanently","It is transferred to the monitor","It disappears (is lost)","It moves to the keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.4,guessing:.25},{id:"L2Q4",lessonId:2,stem:"What unit is used to measure the speed of a CPU?",options:["Kilograms (kg)","Gigahertz (GHz)","Megabytes (MB)","Watts (W)"],correctIndex:1,difficulty:.6,discrimination:1.5,guessing:.25},{id:"L2Q5",lessonId:2,stem:"ROM is different from RAM because ROM:",options:["Is faster than RAM","Loses data when power is off","Keeps its data even when the computer is off","Can hold more data than RAM"],correctIndex:2,difficulty:.4,discrimination:1.3,guessing:.25},{id:"L2Q6",lessonId:2,stem:"What does the Power Supply Unit (PSU) do?",options:["Displays images on the screen","Converts wall electricity into the correct voltage for components","Stores programs permanently","Connects the computer to the internet"],correctIndex:1,difficulty:.1,discrimination:1.1,guessing:.25},{id:"L2Q7",lessonId:2,stem:"If a computer has more RAM, it can generally:",options:["Store more files permanently","Run more tasks at the same time without slowing down","Display brighter colors","Connect to faster internet"],correctIndex:1,difficulty:.3,discrimination:1.2,guessing:.25},{id:"L2Q8",lessonId:2,stem:"Which two types of operations does the CPU perform?",options:["Input and output operations","Arithmetic and logic operations","Printing and scanning operations","Storage and display operations"],correctIndex:1,difficulty:.7,discrimination:1.4,guessing:.25},{id:"L3Q1",lessonId:3,stem:"An input device is used to:",options:["Display information to the user","Send data or commands into a computer","Store data permanently","Print documents on paper"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L3Q2",lessonId:3,stem:"Which of the following is an input device?",options:["Printer","Monitor","Keyboard","Speaker"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L3Q3",lessonId:3,stem:"A scanner converts:",options:["Sound into text","Digital files into paper documents","Physical documents into digital images","Video into audio"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L3Q4",lessonId:3,stem:"A touchscreen is special because it is:",options:["Only an input device","Only an output device","Both an input and output device","A storage device"],correctIndex:2,difficulty:-.2,discrimination:1.4,guessing:.25},{id:"L3Q5",lessonId:3,stem:"A microphone captures _____ and converts it into digital data.",options:["Light","Heat","Sound","Motion"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L3Q6",lessonId:3,stem:"A trackpad is a type of:",options:["Output device found on desktops","Pointing device built into laptops","Storage device","Printer accessory"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L3Q7",lessonId:3,stem:"Which input device would you use to capture your face for a video call?",options:["Scanner","Keyboard","Webcam","Printer"],correctIndex:2,difficulty:-.6,discrimination:1.1,guessing:.25},{id:"L3Q8",lessonId:3,stem:"A wireless keyboard connects to the computer using:",options:["A VGA cable","Bluetooth or a USB receiver","An HDMI cable","A power cable"],correctIndex:1,difficulty:.5,discrimination:1.3,guessing:.25},{id:"L4Q1",lessonId:4,stem:"An output device:",options:["Sends data into the computer","Presents processed data from the computer to the user","Stores data permanently on a disk","Provides electricity to the computer"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L4Q2",lessonId:4,stem:"Which of the following is an output device?",options:["Mouse","Scanner","Monitor","Keyboard"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L4Q3",lessonId:4,stem:'A "hard copy" refers to:',options:["A file saved on a hard disk","A physical paper printout of a document","A very difficult document to read","A backup copy on a flash drive"],correctIndex:1,difficulty:.2,discrimination:1.3,guessing:.25},{id:"L4Q4",lessonId:4,stem:"Which type of printer uses a laser beam and toner powder?",options:["Inkjet printer","Laser printer","3D printer","Dot matrix printer"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L4Q5",lessonId:4,stem:"A projector is used to:",options:["Print documents in large sizes","Display the computer's screen as a large image on a wall","Record sound from the computer","Store data on optical discs"],correctIndex:1,difficulty:-.5,discrimination:1.1,guessing:.25},{id:"L4Q6",lessonId:4,stem:"Speakers convert electrical signals into:",options:["Light","Text","Sound","Images"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L4Q7",lessonId:4,stem:"A device that serves as BOTH input and output is called:",options:["A storage device","An I/O device","A processing device","A network device"],correctIndex:1,difficulty:.6,discrimination:1.4,guessing:.25},{id:"L4Q8",lessonId:4,stem:"A plotter is mainly used to:",options:["Play music files","Draw large-format graphics like maps and architectural plans","Scan photographs","Display video on a wall"],correctIndex:1,difficulty:1,discrimination:1.3,guessing:.25},{id:"L5Q1",lessonId:5,stem:"Why do we need storage devices?",options:["To increase the speed of the CPU","To save data permanently so it can be accessed later","To display images on the screen","To connect to the internet"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L5Q2",lessonId:5,stem:"Which storage device uses spinning magnetic disks?",options:["SSD","Flash drive","HDD","SD card"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L5Q3",lessonId:5,stem:"An SSD is faster than an HDD because it:",options:["Uses larger disks","Has no moving parts — it uses flash memory chips","Uses more electricity","Is always connected to the internet"],correctIndex:1,difficulty:.3,discrimination:1.4,guessing:.25},{id:"L5Q4",lessonId:5,stem:"Google Drive is an example of:",options:["An HDD","Cloud storage","An optical disc","A flash drive"],correctIndex:1,difficulty:-.8,discrimination:1,guessing:.25},{id:"L5Q5",lessonId:5,stem:"The correct order of the computing cycle is:",options:["Output → Input → Storage → Processing","Input → Processing → Output → Storage","Processing → Input → Output → Storage","Storage → Output → Input → Processing"],correctIndex:1,difficulty:.5,discrimination:1.5,guessing:.25},{id:"L5Q6",lessonId:5,stem:"Which storage medium has the LARGEST typical capacity?",options:["SD card","CD","Hard Disk Drive (HDD)","Flash drive"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L5Q7",lessonId:5,stem:"Optical discs (like CDs and DVDs) are read using:",options:["A magnetic head","A laser beam","Radio waves","Electrical contacts"],correctIndex:1,difficulty:.7,discrimination:1.3,guessing:.25},{id:"L5Q8",lessonId:5,stem:"When you save a school report to a flash drive and print it, which component is the storage device?",options:["The printer","The monitor","The flash drive","The keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.1,guessing:.25}];function W(e,t=2){return Math.round(e*10**t)/10**t}function Gt(e,t){const{discrimination:s,difficulty:n,guessing:a}=t,i=-s*(e-n);return a+(1-a)/(1+Math.exp(i))}function Kt(e,t){const s=Gt(e,t),{discrimination:n,guessing:a}=t;if(s<=a||s>=1)return 0;const i=n*n*(s-a)**2,o=(1-a)**2*s*(1-s);return o>0?i/o:0}function Ln(e){if(e.length===0)return 0;const t=e.every(o=>o.correct),s=e.every(o=>!o.correct);if(t)return Math.min(3,.5*e.length);if(s)return Math.max(-3,-.5*e.length);let n=0;const a=30,i=.001;for(let o=0;o<a;o+=1){let r=0,d=0;for(const u of e){const l=Gt(n,u.item),p=1-l,{discrimination:g,guessing:m}=u.item,f=(l-m)/(1-m),b=g*f*p;u.correct?r+=b/l:r-=b/p,d-=b*b/(l*p)}if(Math.abs(d)<1e-10)break;const c=r/d;if(n-=c,n=Math.max(-3,Math.min(3,n)),Math.abs(c)<i)break}return n}function Pe(e,t){let s=0;for(const n of t)s+=Kt(e,n.item);return s>0?1/Math.sqrt(s):999}function Dn(e,t){let s=null,n=-1/0;for(const a of t){const i=Kt(e,a);i>n&&(n=i,s=a)}return s}function ht(e){return e<-1?{label:"Beginner",color:"#FB7185",description:"Just getting started — keep learning and practicing!"}:e<0?{label:"Developing",color:"#FBBF24",description:"You understand the basics. Review the tricky parts and try again!"}:e<1?{label:"Proficient",color:"#818CF8",description:"Great understanding! You've got a solid grasp of this topic."}:{label:"Advanced",color:"#34D399",description:"Excellent! You've mastered this topic. Ready for the next challenge!"}}function Mn(e=null,t=10){let s=e?Ae.filter(b=>b.lessonId===e):[...Ae];s=s.sort(()=>Math.random()-.5);const n=new Set,a=[],i=[];let o=0,r=null,d=0,c=!1,u=null;function l(){if(c)return null;const b=s.filter(h=>!n.has(h.id));return b.length===0||d>=t||d>=5&&Pe(o,a)<.3?(c=!0,null):(r=Dn(o,b),n.add(r.id),d+=1,u=Date.now(),{question:r,questionNumber:d,totalQuestions:Math.min(t,s.length),currentTheta:o,difficulty:r.difficulty>.5?"Hard":r.difficulty<-.5?"Easy":"Medium"})}function p(b){if(!r)return null;const h=Date.now(),w=o,v=b===r.correctIndex,y={item:r,selectedIndex:b,correct:v,questionNumber:d,presentedAt:u||h,answeredAt:h,elapsedMs:Math.max(0,h-(u||h)),thetaBefore:w};return a.push(y),o=Ln(a),y.thetaAfter=o,y.standardErrorAfter=Pe(o,a),i.push({questionId:r.id,questionNumber:d,thetaBefore:W(w),thetaAfter:W(o),standardErrorAfter:W(y.standardErrorAfter),elapsedMs:y.elapsedMs,correct:v}),u=null,{correct:v,correctIndex:r.correctIndex,thetaBefore:w,thetaAfter:o,standardErrorAfter:y.standardErrorAfter,elapsedMs:y.elapsedMs,level:ht(o)}}function g(){return u?Math.max(0,Date.now()-u):0}function m(){const b=a.filter(_=>_.correct).length,h=ht(o),w=Pe(o,a),v=a.reduce((_,C)=>_+C.elapsedMs,0),y=a.length>0?Math.round(v/a.length):0;return{score:b,totalQuestions:a.length,theta:W(o),standardError:W(w),level:h.label,levelColor:h.color,levelDescription:h.description,totalTimeMs:v,averageTimeMs:y,thetaTrajectory:i,responses:a.map(_=>({questionId:_.item.id,lessonId:_.item.lessonId,stem:_.item.stem,options:_.item.options,selectedIndex:_.selectedIndex,correctIndex:_.item.correctIndex,correct:_.correct,questionNumber:_.questionNumber,elapsedMs:_.elapsedMs,presentedAt:_.presentedAt,answeredAt:_.answeredAt,thetaBefore:W(_.thetaBefore),thetaAfter:W(_.thetaAfter),standardErrorAfter:W(_.standardErrorAfter)}))}}function f(){return c}return{next:l,answer:p,getCurrentElapsedMs:g,getResults:m,isFinished:f}}const Bn={L1Q1:"A computer is specifically an electronic device that accepts data (input), processes it using instructions, and produces useful information (output). It's not limited to games or typing — it can do many things because of its ability to follow programs.",L1Q2:"A calculator can do math, but it is not a general-purpose computer. It cannot run different programs, browse the internet, or process many types of data. Desktops, laptops, and tablets are all types of computers because they can run software and handle many tasks.",L1Q3:"First generation computers (1940s-1950s) used vacuum tubes — large glass tubes that controlled electrical signals. These made the computers huge (filling entire rooms!) and generated a lot of heat. Transistors came in the second generation.",L1Q4:"The fourth generation (1970s to present) introduced the microprocessor — an entire CPU on a single tiny chip. This breakthrough made personal computers, laptops, and smartphones possible. The Intel 4004 (1971) was one of the first microprocessors.",L1Q5:"Data refers to raw, unprocessed facts and figures (like numbers or words). Information is what you get after data has been processed and organized into something meaningful and useful. For example, student scores (data) become a class ranking (information).",L1Q6:"A smartphone is indeed a type of computer! It has a processor (CPU), memory (RAM), storage, input devices (touchscreen, microphone), and output devices (screen, speaker). It runs software programs (apps) just like a desktop computer.",L1Q7:"The fifth generation of computers focuses on Artificial Intelligence (AI) — making computers that can learn, understand human speech, and make decisions. This includes technologies like voice assistants and self-driving cars.",L1Q8:"A server is a powerful computer that provides services to other computers on a network. When you visit a website, a server sends that information to your device. Servers are typically kept in special rooms and run 24/7.",L2Q1:"The CPU is called the 'brain' of the computer because it carries out all instructions and makes decisions. Just like your brain processes information from your senses, the CPU processes data from input devices and tells other components what to do.",L2Q2:"The motherboard is the main circuit board that connects all computer components together and allows them to communicate. Think of it as the 'backbone' or 'highway system' of the computer — everything plugs into it.",L2Q3:"RAM (Random Access Memory) is temporary memory — it only holds data while the computer is running. When you turn off the computer, all data in RAM is lost. That's why you need to save your work to storage (like a hard drive) to keep it.",L2Q4:"CPU speed is measured in Gigahertz (GHz). One GHz means the CPU can perform one billion basic operations per second! A higher GHz number generally means a faster processor. Megabytes measure storage, not speed.",L2Q5:"ROM (Read-Only Memory) keeps its data even when the computer is turned off — this is called 'non-volatile' memory. RAM loses its data when power is off ('volatile'). ROM stores the essential startup instructions the computer needs to begin loading.",L2Q6:"The Power Supply Unit (PSU) converts AC electricity from the wall outlet into DC electricity at the correct voltages that computer components need. Without it, no component inside the computer would receive power.",L2Q7:"More RAM means the computer can hold more data for active tasks at the same time. This allows you to run multiple programs without the computer slowing down. RAM doesn't affect permanent storage — that's the job of hard drives and SSDs.",L2Q8:"The CPU performs two types of operations: arithmetic (math calculations like adding and multiplying) and logic (comparisons like 'Is A equal to B?' or 'Is X greater than Y?'). All computing tasks ultimately break down into these two types.",L3Q1:"An input device is any hardware that allows you to send data or commands INTO a computer. Without input devices, you would have no way to tell the computer what to do. They are the 'doors' through which data enters the computer.",L3Q2:"A keyboard is an input device — you use it to enter text and commands into the computer. Printers, monitors, and speakers are all output devices because they present data FROM the computer to you.",L3Q3:"A scanner takes a physical document or photograph and converts it into a digital image that the computer can store and display. It works in the opposite direction of a printer — a printer takes digital files and puts them ON paper.",L3Q4:"A touchscreen is special because it serves as BOTH an input device (you tap and swipe to send commands) AND an output device (it displays information). This makes it an I/O (input/output) device.",L3Q5:"A microphone captures sound waves from your voice or the environment and converts them into digital data that the computer can process. This is how voice calls, voice recording, and voice assistants work.",L3Q6:"A trackpad (also called touchpad) is a flat, touch-sensitive surface built into laptops that works like a mouse. You move your finger across it to control the cursor. It's a pointing input device.",L3Q7:"A webcam (web camera) captures video and images, which is exactly what you need for a video call. Scanners capture flat documents, keyboards capture text, and printers are output devices — none of them can capture live video of your face.",L3Q8:"Wireless keyboards connect to the computer using either Bluetooth technology or a small USB receiver that plugs into the computer. This eliminates the need for a cable connection between the keyboard and the computer.",L4Q1:"An output device takes processed data from the computer and presents it in a form that humans can understand. Monitors show visual output, speakers produce audio output, and printers create physical output on paper.",L4Q2:"A monitor is an output device — it displays visual information from the computer to you. Mice, scanners, and keyboards are input devices that send data INTO the computer.",L4Q3:"A 'hard copy' is a physical paper printout of a digital document. The word 'hard' refers to the fact that it's a tangible, physical copy you can hold in your hands, as opposed to a 'soft copy' which exists only on the computer screen.",L4Q4:"A laser printer uses a laser beam to create an image on a drum, which then attracts toner powder. The toner is transferred to paper and fused with heat. Laser printers are fast and great for printing large amounts of text.",L4Q5:"A projector takes the computer's visual display and projects it as a large image on a wall or screen. This makes it ideal for classrooms and meetings where many people need to see the same content at once.",L4Q6:"Speakers receive electrical signals from the computer and convert them into sound waves that we can hear. This is how you hear music, voice in videos, system alerts, and all other audio from a computer.",L4Q7:"A device that serves as both input and output is called an I/O (Input/Output) device. A touchscreen is the best example — you input by touching it, and it outputs by displaying information. Some use the term 'interactive device'.",L4Q8:"A plotter is a specialized output device designed to draw large-format graphics, maps, engineering diagrams, and architectural plans. Unlike regular printers that print line by line, plotters use pens to draw continuous, precise lines.",L5Q1:"Storage devices save data permanently so you can access it later, even after the computer is turned off. Without storage, you would lose all your files every time you shut down — RAM only holds data temporarily while the computer is on.",L5Q2:"A Hard Disk Drive (HDD) uses spinning magnetic disks called platters. A read/write head moves across these platters to store and retrieve data. This mechanical process is what makes HDDs slower than SSDs.",L5Q3:"An SSD (Solid State Drive) uses flash memory chips with no moving parts. Since there are no spinning disks or moving heads, data can be read and written much faster. HDDs are slower because they rely on mechanical, moving parts.",L5Q4:"Google Drive is a cloud storage service. Cloud storage means your files are saved on remote servers accessed through the internet, not on a physical device in your hand. Other examples include Dropbox and OneDrive.",L5Q5:"The correct computing cycle is: Input (data enters) → Processing (CPU works on the data) → Output (results are shown) → Storage (data is saved). This is the fundamental pattern that every computing task follows.",L5Q6:"Hard Disk Drives (HDDs) typically have the largest capacity — they can store 500 GB to several terabytes (TB) of data. SD cards, CDs, and flash drives have much smaller capacities compared to modern HDDs.",L5Q7:"Optical discs like CDs, DVDs, and Blu-ray discs are read using a laser beam. The laser reads tiny pits and lands on the disc surface to retrieve data. That's why they're called 'optical' — they use light (optics) technology.",L5Q8:"In this scenario, the flash drive is the storage device — it permanently saves your school report file. The printer is an output device (it produces a paper copy), the monitor is an output device, and the keyboard is an input device."},En="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",qn="Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!",_e=new Map;function gt(e=""){return e.toLowerCase().replace(/\s+/g," ").trim()}function Pn(e,t,s){return[e,gt(t),gt(s)].join("::")}function Rn(e=""){return e.replace(/\s+/g," ").trim()}function ot(e,t){return t?(e||"").toLowerCase().includes("difference")?`Practice tip: compare the choices and explain why "${t}" matches the question best.`:`Practice tip: say out loud why "${t}" is the best answer before you continue.`:"Practice tip: explain the key idea in your own words before you move on."}function De(e,t="cache",s={}){return{text:e.text,source:t,model:e.model||null,practiceTip:e.practiceTip||ot(e.stem,e.correctAnswer),usageCount:e.usageCount||1,cachedAt:e.updatedAt||e.createdAt||null,savedForOffline:!0,...s}}function zn(e,t,s){return{text:Bn[e]||qn,source:"fallback",model:null,practiceTip:ot(t,s),usageCount:0,cachedAt:null,savedForOffline:!1}}async function Qn(e,t){const n=(await Ws(e)).filter(i=>i.cacheKey!==t&&i.text).sort((i,o)=>{const r=(o.usageCount||1)-(i.usageCount||1);return r!==0?r:new Date(o.lastUsedAt||o.updatedAt||0)-new Date(i.lastUsedAt||i.updatedAt||0)})[0];if(!n)return null;const a=await et(n.cacheKey);return De(a||n,"question-cache",{reusedFromQuestionBank:!0})}async function ke({questionId:e,stem:t,correctAnswer:s,cacheKey:n,cachedEntry:a,allowQuestionCache:i}){if(a){const o=await et(n);return De(o||a,"cache")}if(i){const o=await Qn(e,n);if(o)return o}return zn(e,t,s)}async function jn({apiKey:e,questionId:t,stem:s,studentAnswer:n,correctAnswer:a,cacheKey:i,cachedEntry:o,allowQuestionCache:r}){var d,c,u,l,p;try{const g=Nn(s,n,a),m=await fetch(`${En}?key=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:g}]}],generationConfig:{temperature:.6,maxOutputTokens:180,topP:.9}}),signal:AbortSignal.timeout(1e4)});if(!m.ok)return console.warn("Gemini API error, using offline fallback:",m.status),ke({questionId:t,stem:s,correctAnswer:a,cacheKey:i,cachedEntry:o,allowQuestionCache:r});const f=await m.json(),b=(p=(l=(u=(c=(d=f==null?void 0:f.candidates)==null?void 0:d[0])==null?void 0:c.content)==null?void 0:u.parts)==null?void 0:l[0])==null?void 0:p.text,h=Rn(b);if(!h)return ke({questionId:t,stem:s,correctAnswer:a,cacheKey:i,cachedEntry:o,allowQuestionCache:r});const w=await Gs({cacheKey:i,questionId:t,stem:s,studentAnswer:n,correctAnswer:a,text:h,practiceTip:ot(s,a),model:"gemini-2.0-flash",lastUsedAt:new Date().toISOString()});return De(w,"ai",{model:"gemini-2.0-flash"})}catch(g){return console.warn("AI feedback failed, using offline fallback:",g.message),ke({questionId:t,stem:s,correctAnswer:a,cacheKey:i,cachedEntry:o,allowQuestionCache:r})}}async function Yt(e,t,s,n,a={}){const{preferCached:i=!1,allowQuestionCache:o=!0}=a,r=ie(),d=Pn(e,s,n),c=await Hs(d);if(!r||!navigator.onLine)return ke({questionId:e,stem:t,correctAnswer:n,cacheKey:d,cachedEntry:c,allowQuestionCache:o});if(i&&c){const l=await et(d);return De(l||c,"cache")}if(_e.has(d))return _e.get(d);const u=jn({apiKey:r,questionId:e,stem:t,studentAnswer:s,correctAnswer:n,cacheKey:d,cachedEntry:c,allowQuestionCache:o}).finally(()=>{_e.delete(d)});return _e.set(d,u),u}function Nn(e,t,s){return`You are a friendly, encouraging JHS Computing teacher in Ghana. A student answered a quiz question incorrectly. Explain why the correct answer is right in 2-3 simple sentences for a 12-14 year old. Be warm and supportive. Do not say "you are wrong" or shame the learner.

Question: "${e}"
Student's answer: "${t}"
Correct answer: "${s}"

Give only the short explanation:`}async function On(e){const t={},s=e.filter(n=>!n.correct);for(const n of s){const a=n.options[n.selectedIndex],i=n.options[n.correctIndex];t[n.questionId]=await Yt(n.questionId,n.stem,a,i,{preferCached:!0})}return t}let z=null,Ce=null,oe=null,I=null,pe=!1,Se=null,Fn=0;function Jt(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function ye(){Se&&(window.clearInterval(Se),Se=null)}function vt(){const e=document.getElementById("question-timer");!e||!z||(e.textContent=Jt(z.getCurrentElapsedMs()))}function Un(){ye(),vt(),Se=window.setInterval(vt,1e3)}function Vt(e){return{source:e.source,text:e.aiText,practiceTip:e.practiceTip,usageCount:e.usageCount,reusedFromQuestionBank:e.reusedFromQuestionBank}}function Zt(e){return e.correct?"Instant success feedback is ready.":e.feedbackLoading?navigator.onLine?"Generating a simple AI explanation and saving it for offline use...":"You are offline. Looking for a saved explanation on this device...":e.source==="ai"?"Live AI feedback is ready and saved for offline reuse.":e.source==="cache"?"Loaded from the saved feedback cache on this device.":e.source==="question-cache"?"Using a common saved explanation for this question while offline.":"Showing the built-in offline explanation."}function Hn(e){if(!I)return;I.aiText=e.text,I.source=e.source,I.practiceTip=e.practiceTip,I.usageCount=e.usageCount,I.reusedFromQuestionBank=e.reusedFromQuestionBank,I.feedbackLoading=!1;const t=document.getElementById("feedback-container");t&&(t.innerHTML=st(Vt(I),!1));const s=document.getElementById("feedback-status");s&&(s.textContent=Zt(I))}function Wn(e,t,s){const n=`feedback-${++Fn}`;I&&(I.feedbackRequestId=n),Yt(e.id,e.stem,t,s,{preferCached:!1}).then(a=>{!I||I.feedbackRequestId!==n||Hn(a)})}function Gn(e){ye(),Ce=Number.parseInt(e,10),z=Mn(Ce),oe=z.next(),I=null,pe=!1}function Kn(e){const t=Number.parseInt(e,10);(!z||Ce!==t)&&Gn(t)}function Yn(){ye(),z=null,Ce=null,oe=null,I=null,pe=!1}function Jn(){if(!z||!oe)return'<div class="container">Error initializing quiz.</div>';const e=T(),t=oe;let s="";if(I){const n=I.aiText?st(Vt(I),I.correct):'<div class="shimmer" style="height: 116px; width: 100%;"></div>';s=`
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${Jt(I.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${I.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${I.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${I.stem}</p>

        <div class="results-review">
          <div class="review-item ${I.correct?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${I.correct?"review-item__correct-answer":"review-item__your-answer"}">${I.studentAnswerText}</span></div>
            </div>
            ${I.correct?"":`
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${I.correctAnswerText}</span></div>
              </div>
            `}
          </div>
        </div>

        <div class="feedback-status" id="feedback-status">${Zt(I)}</div>
        <div style="margin-top: var(--space-4);" id="feedback-container">
          ${n}
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${z.isFinished()?"See Final Results":"Next Question"}
          </button>
        </div>
      </div>
    `}else s=`
      <div class="quiz-header">
        <div class="quiz-header__info">
          <span class="quiz-header__question-num">Question ${t.questionNumber} of ${t.totalQuestions}</span>
        </div>
        <div class="quiz-header__meta">
          <span class="badge badge--neutral quiz-header__timer" id="question-timer">00:00</span>
          <span class="badge badge--neutral quiz-header__difficulty">Level: ${t.difficulty}</span>
        </div>
      </div>

      ${be(t.questionNumber-1,t.totalQuestions,"Quiz progress")}

      <div id="question-container">
        ${Ft(t.question)}
      </div>
    `;return`
    ${B({title:"Adaptive Quiz",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${s}
    </div>
  `}function Vn(e,t,s){if(P({onBack:()=>e(`/lesson/${s}`)}),I){ye();const a=document.getElementById("btn-next-question");a&&a.addEventListener("click",async()=>{if(I=null,z.isFinished()){await ft(e,s);return}const i=z.next();if(!i){await ft(e,s);return}oe=i,t()});return}Un(),document.querySelectorAll(".option-btn").forEach(a=>{a.addEventListener("click",i=>{if(pe)return;pe=!0;const o=Number.parseInt(i.currentTarget.dataset.index,10);Zn(o,i.currentTarget,t)})})}function Zn(e,t,s){const n=z.answer(e),a=oe.question;if(ye(),document.querySelectorAll(".option-btn").forEach(o=>{o.classList.add("option-btn--disabled"),o.disabled=!0}),n.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const o=document.getElementById(`option-${n.correctIndex}`);o&&o.classList.add("option-btn--highlight-correct")}I={questionId:a.id,stem:a.stem,correct:n.correct,studentAnswerText:a.options[e],correctAnswerText:a.options[n.correctIndex],aiText:n.correct?"Great work - you understood this concept.":null,source:n.correct?"system":null,practiceTip:n.correct?"Keep building on that idea in the next question.":null,usageCount:0,reusedFromQuestionBank:!1,feedbackLoading:!n.correct,feedbackRequestId:null,elapsedMs:n.elapsedMs,thetaAfter:n.thetaAfter,levelLabel:n.level.label},n.correct||Wn(a,I.studentAnswerText,I.correctAnswerText),setTimeout(()=>{pe=!1,s()},1e3)}async function ft(e,t){const s=T(),n=z.getResults();if(!s){e("/lessons");return}const a=await Rs({studentId:s.id,lessonId:Number.parseInt(t,10),...n});e(`/quiz-results/${a.id}`)}function Ke(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}async function Xn(e){var d,c,u;const t=T(),s=await ge(),n=s.find(l=>l.id===Number.parseInt(e,10));if(!n)return'<div class="container">Result not found.</div>';const a=t?s.filter(l=>l.studentId===t.id):[],i=t?await U(t.id):null,o=t?await j(t.id):[],r=N({diagnostic:i,results:a,progressRecords:o});return`
    ${B({title:"Quiz Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Lessons"})}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${Ut(n.score,n.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${n.levelColor};">
          Level: ${n.level}
        </div>
        <p class="quiz-results__level-desc">${n.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${Ke(n.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${Ke(n.averageTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Standard error</span>
          <span class="quiz-result-metric__value">${n.standardError}</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Adaptive content path</div>
        <h3 class="results-next-step__title">Recommended next: ${((d=r.recommendedNext)==null?void 0:d.title)||"Return to lessons"}</h3>
        <p class="results-next-step__text">${((c=r.recommendedNext)==null?void 0:c.recommendedFocus)||"Keep following your personalized path."}</p>
        <div class="results-next-step__chips">
          <span class="badge badge--${r.risk.badge}">Risk: ${r.risk.label}</span>
          <span class="badge badge--neutral">${((u=r.revisionQueue[0])==null?void 0:u.title)||"Revision queue updated"}</span>
        </div>
      </div>

      <div class="results-review">
        <h3 class="results-review__title">Question Review</h3>
        <div id="review-list">
          <div class="shimmer" style="height: 100px; margin-bottom: var(--space-3);"></div>
          <div class="shimmer" style="height: 100px; margin-bottom: var(--space-3);"></div>
        </div>
      </div>

      <div class="quiz-results__actions">
        <button class="btn btn--primary btn--lg" id="btn-next-lesson">Continue Personalized Path</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-retry-quiz">Retry Quiz</button>
      </div>
    </div>
  `}function ea(e,t){P({onBack:()=>e("/lessons")});const s=document.getElementById("btn-next-lesson"),n=document.getElementById("btn-open-tutor"),a=document.getElementById("btn-retry-quiz");ge().then(async i=>{const o=i.find(p=>p.id===Number.parseInt(t,10));if(!o)return;const r=T(),d=r?i.filter(p=>p.studentId===r.id):[],c=r?await U(r.id):null,u=r?await j(r.id):[],l=N({diagnostic:c,results:d,progressRecords:u});s&&s.addEventListener("click",()=>{var g;const p=(g=l.recommendedNext)==null?void 0:g.lessonId;e(p?`/lesson/${p}`:"/lessons")}),n&&n.addEventListener("click",()=>{e("/tutor")}),a&&a.addEventListener("click",()=>{e(`/quiz/${o.lessonId}`)}),ta(o.responses)})}async function ta(e){const t=document.getElementById("review-list");if(!t)return;t.innerHTML=e.map(n=>Re(n,null)).join("");const s=await On(e);t.innerHTML=e.map(n=>n.correct?Re(n,{text:"Correct! You handled this concept well.",source:"system"}):Re(n,s[n.questionId])).join("")}function Re(e,t){const s=e.options[e.selectedIndex],n=e.options[e.correctIndex];let a="";return t?e.correct||(a=`
        <div class="review-item__feedback">
          ${st(t,!1)}
        </div>
      `):e.correct||(a='<div class="shimmer" style="height: 116px; margin-top: var(--space-3);"></div>'),`
    <div class="review-item ${e.correct?"review-item--correct":"review-item--incorrect"}">
      <div class="review-item__question">${e.questionNumber}. ${e.stem}</div>
      <div class="review-item__meta">
        <span>Time: ${Ke(e.elapsedMs)}</span>
        <span>Theta after: ${e.thetaAfter}</span>
      </div>
      <div class="review-item__answer">
        <div><strong>Your answer:</strong> <span class="${e.correct?"review-item__correct-answer":"review-item__your-answer"}">${s}</span></div>
      </div>
      ${e.correct?"":`
        <div class="review-item__answer" style="margin-top: var(--space-1);">
          <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${n}</span></div>
        </div>
      `}
      ${a}
    </div>
  `}const sa="modulepreload",na=function(e){return"/"+e},bt={},aa=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){let o=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=o(s.map(c=>{if(c=na(c),c in bt)return;bt[c]=!0;const u=c.endsWith(".css"),l=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${l}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":sa,u||(p.as="script"),p.crossOrigin="",p.href=c,d&&p.setAttribute("nonce",d),document.head.appendChild(p),u)return new Promise((g,m)=>{p.addEventListener("load",g),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return a.then(o=>{for(const r of o||[])r.status==="rejected"&&i(r.reason);return t().catch(i)})};let ze=null,yt=!1;async function Xt(){return ze||(ze=aa(()=>import("./chart-45xamTTr.js"),[]).then(e=>{const t=e.Chart;return yt||(t.register(...e.registerables),yt=!0),t})),ze}let $=null,de=[],Ie=null;function wt(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function oa(e){const t={};return e.slice().sort((s,n)=>new Date(s.completedAt)-new Date(n.completedAt)).forEach(s=>{t[s.studentId]=s}),Object.values(t)}function ia(e,t,s,n){const a=oa(t),i={};n.slice().sort((v,y)=>new Date(y.completedAt)-new Date(v.completedAt)).forEach(v=>{i[v.studentId]||(i[v.studentId]=v)});const o=e.map(v=>{const y=t.filter(O=>O.studentId===v.id),_=s.filter(O=>O.studentId===v.id),C=i[v.id]||null,E=N({diagnostic:C,results:y,progressRecords:_});return{student:v,results:y,progressRecords:_,diagnostic:C,profile:E}}),r=e.length>0?Math.round(s.length/(e.length*x.length)*100):0,d=a.length>0?Math.round(a.reduce((v,y)=>v+y.score/y.totalQuestions,0)/a.length*100):0,c=o.filter(v=>v.profile.risk.score>=60).length,u=e.length>0?Math.round(o.filter(v=>v.diagnostic).length/e.length*100):0,l={},p={};for(const v of t)l[v.lessonId]=(l[v.lessonId]||0)+v.score/v.totalQuestions,p[v.lessonId]=(p[v.lessonId]||0)+1;const g=x.map(v=>p[v.id]?Math.round(l[v.id]/p[v.id]*100):0),m={Advanced:0,Proficient:0,Developing:0,Beginner:0};for(const v of a)m[v.level]!==void 0&&(m[v.level]+=1);const f={};for(const v of t)for(const y of v.responses){if(y.correct)continue;const _=`${y.questionId}|${y.stem}|${y.options[y.selectedIndex]}`;f[_]=(f[_]||0)+1}const b=Object.entries(f).map(([v,y])=>{const[_,C,E]=v.split("|");return{questionId:_,stem:C,answer:E,count:y}}).sort((v,y)=>y.count-v.count).slice(0,7),h=x.map(v=>{const y=o.map(_=>{var C;return((C=_.profile.lessonProfiles.find(E=>E.lessonId===v.id))==null?void 0:C.mastery)||0});return{lessonId:v.id,title:v.title,averageMastery:y.length?Math.round(y.reduce((_,C)=>_+C,0)/y.length*100):0}}),w=o.filter(v=>v.profile.risk.score>=35).sort((v,y)=>y.profile.risk.score-v.profile.risk.score).slice(0,6);return{students:e,results:t,progressRecords:s,diagnostics:n,studentProfiles:o,latestResults:a,summary:{totalStudents:e.length,averageScore:d,completionRate:r,studentsAtRisk:c,diagnosticCoverage:u},charts:{lessonLabels:x.map(v=>`Lesson ${v.id}`),lessonScoreData:g,levelCounts:m,misconceptions:b},interventionQueue:w,masterySnapshot:h}}async function ra(){const e=await he(),t=await ge(),s=await Pt(),n=await zt(),a=await ve(),i=await fe();if($=ia(e,t,s,n),e.length===0)return`
      ${B({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
      <div class="container view-enter dashboard-page" style="padding-top: var(--space-8);">
        <div class="empty-state">
          <div class="empty-state__icon">Data</div>
          <h2 class="empty-state__title">No Data Yet</h2>
          <p class="empty-state__text">Students need to log in and take quizzes before analytics will appear here.</p>
        </div>
      </div>
    `;const{summary:o}=$;return`
    ${B({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div class="dashboard-header">
        <h1 class="dashboard-header__title">Class Overview</h1>
        <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
      </div>

      <div class="stat-grid">
        ${se("Students",o.totalStudents,"Total Students","primary",`${$.results.length} quizzes recorded`)}
        ${se("Average",`${o.averageScore}%`,"Average Score","accent","Latest quiz per student")}
        ${se("Progress",`${o.completionRate}%`,"Completion Rate","success",`${$.progressRecords.length} lesson completions logged`)}
        ${se("Support",o.studentsAtRisk,"High Risk Learners",o.studentsAtRisk>0?"danger":"success","Prediction score 60+")}
        ${se("Diagnostic",`${o.diagnosticCoverage}%`,"Diagnostic Coverage",o.diagnosticCoverage<100?"accent":"success","Students with readiness profiles")}
        ${se("Assess",a.length,"Published Assessments",a.length>0?"primary":"accent",`${i.length} assessment submissions logged`)}
      </div>

      <div class="charts-section">
        <div class="card chart-card">
          <h3 class="chart-card__title">Average Score by Lesson</h3>
          <div class="chart-card__canvas-wrap">
            <canvas id="chart-scores"></canvas>
          </div>
        </div>
        <div class="card chart-card">
          <h3 class="chart-card__title">Ability Level Distribution</h3>
          <div class="chart-card__canvas-wrap">
            <canvas id="chart-levels"></canvas>
          </div>
        </div>
      </div>

      <div class="charts-section" style="grid-template-columns: 1fr;">
        <div class="card chart-card">
          <h3 class="chart-card__title">Most Commonly Missed Questions</h3>
          <p class="chart-card__subtitle">This horizontal chart highlights the misconceptions showing up most often across the class.</p>
          <div class="chart-card__canvas-wrap chart-card__canvas-wrap--tall">
            <canvas id="chart-misconceptions"></canvas>
          </div>
        </div>
      </div>

      <div class="dashboard-panels">
        <div class="card dashboard-panel">
          <h3 class="chart-card__title">Intervention Queue</h3>
          <p class="chart-card__subtitle">Students who would benefit most from targeted teacher support right now.</p>
          <div class="intervention-list">
            ${$.interventionQueue.length>0?$.interventionQueue.map(r=>`
              <div class="intervention-item">
                <div>
                  <div class="intervention-item__name">${r.student.name}</div>
                  <div class="intervention-item__meta">${r.profile.risk.reasons.join(" | ")}</div>
                </div>
                <div style="text-align: right;">
                  <div class="badge badge--${r.profile.risk.badge}">Risk ${r.profile.risk.score}</div>
                  <div class="intervention-item__action">${r.profile.risk.action}</div>
                </div>
              </div>
            `).join(""):'<div class="insight-empty">No learners are currently flagged for intervention.</div>'}
          </div>
        </div>

        <div class="card dashboard-panel">
          <h3 class="chart-card__title">Class Mastery Snapshot</h3>
          <p class="chart-card__subtitle">Average mastery by lesson after combining diagnostics, completion, and quiz performance.</p>
          <div class="mastery-grid">
            ${$.masterySnapshot.map(r=>`
              <div class="mastery-grid__item">
                <div class="mastery-grid__label">Lesson ${r.lessonId}</div>
                <div class="mastery-grid__title">${r.title}</div>
                <div class="mastery-grid__value">${r.averageMastery}%</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="student-section">
        <div class="student-section__header">
          <div>
            <h3 class="student-section__title">Student Roster</h3>
            <p class="dashboard-header__subtitle">Tap a student row to open quiz history, risk signals, diagnostic summary, and per-question performance.</p>
          </div>
          <div class="export-area" style="margin-top: 0;">
            <button class="btn btn--primary btn--sm" id="btn-open-assessment-lab">Assessment Lab</button>
            <button class="btn btn--ghost btn--sm" id="btn-export-csv">Export CSV</button>
          </div>
        </div>

        <div class="student-table-wrap">
          <table class="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Lessons Completed</th>
                <th>Quizzes Taken</th>
                <th>Latest Score</th>
                <th>Next Focus</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              ${e.map(r=>{var m;const d=t.filter(f=>f.studentId===r.id).sort((f,b)=>new Date(b.completedAt)-new Date(f.completedAt)),c=d[0],u=s.filter(f=>f.studentId===r.id).length,l=$.studentProfiles.find(f=>f.student.id===r.id),p=l==null?void 0:l.profile.risk,g=((m=l==null?void 0:l.profile.recommendedNext)==null?void 0:m.title)||"-";return`
                  <tr class="student-row" data-id="${r.id}">
                    <td class="student-table__name">${r.name}</td>
                    <td>${u}/${x.length}</td>
                    <td>${d.length}</td>
                    <td class="student-table__score">${c?`${Math.round(c.score/c.totalQuestions*100)}%`:"-"}</td>
                    <td>${g}</td>
                    <td><span class="badge badge--${(p==null?void 0:p.badge)||"neutral"}">${(p==null?void 0:p.label)||"No Data"}</span></td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function ca(e){P({onBack:()=>e("/"),onSettings:da,onLogout:()=>{Ys(),e("/")}});const t=document.getElementById("btn-export-csv"),s=document.getElementById("btn-open-assessment-lab");t&&t.addEventListener("click",async()=>{const n=await Js();Vs(n),D("Data exported successfully","success")}),s&&s.addEventListener("click",()=>{e("/assessment-lab")}),pa(),document.querySelectorAll(".student-row").forEach(n=>{n.addEventListener("click",a=>{const i=Number.parseInt(a.currentTarget.dataset.id,10);la(i)})})}function da(){const e=ie()||"",t=Xe()||"",s=`
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${e}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Used for quiz explanations, diagnostic coaching, and the AI tutor. You can update this any time.</p>
    </div>
    <div class="input-group">
      <label>Teacher PIN</label>
      <input type="password" id="settings-teacher-pin" class="input input--pin" value="${t}" placeholder="0000" maxlength="4" inputmode="numeric">
    </div>
  `;nt("Dashboard Settings",s,[{label:"Cancel",variant:"btn--ghost"},{label:"Save",variant:"btn--primary",onClick:async()=>{const n=document.getElementById("settings-api-key"),a=document.getElementById("settings-teacher-pin"),i=(n==null?void 0:n.value.trim())||"",o=(a==null?void 0:a.value.trim())||"";return o&&!/^\d{4}$/.test(o)?(D("Teacher PIN must stay 4 digits.","error"),!1):(await Et(i),o&&await qt(o),D("Settings saved","success"),!0)}}])}async function la(e){var f,b;const t=($==null?void 0:$.students)||await he(),s=($==null?void 0:$.results)||await ge(),n=($==null?void 0:$.progressRecords)||await Pt(),a=($==null?void 0:$.diagnostics)||await zt(),i=t.find(h=>h.id===e),o=s.filter(h=>h.studentId===e).sort((h,w)=>new Date(h.completedAt)-new Date(w.completedAt)),r=a.filter(h=>h.studentId===e).sort((h,w)=>new Date(w.completedAt)-new Date(h.completedAt))[0]||null,d=N({diagnostic:r,results:o,progressRecords:n.filter(h=>h.studentId===e)}),c=o.at(-1),u=o.length>0?Math.round(o.reduce((h,w)=>h+w.score/w.totalQuestions,0)/o.length*100):0,l=n.filter(h=>h.studentId===e).length,p=o.flatMap(h=>h.responses.map(w=>({...w,lessonId:h.lessonId,completedAt:h.completedAt}))).sort((h,w)=>new Date(w.answeredAt||w.completedAt)-new Date(h.answeredAt||h.completedAt));if(!i)return;const m=`
    <div class="student-detail">
      <div class="student-detail__header">
        <div class="student-detail__avatar">${i.name.slice(0,2).toUpperCase()}</div>
        <div>
          <div class="student-detail__name">${i.name}</div>
          <div class="dashboard-header__subtitle">Lessons completed: ${l}/${x.length}</div>
        </div>
      </div>

      <div class="student-detail__stats">
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${o.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${u}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${c?c.level:"-"}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${c?wt(c.averageTimeMs):"00:00"}</div>
          <div class="student-detail__stat-label">Avg Question Time</div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-bottom: var(--space-4);">
        <h4 class="student-detail__history-title">Personalization Snapshot</h4>
        <div class="student-detail__snapshot">
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${d.readiness.tone}">${d.readiness.label}</span>
            <div class="student-detail__snapshot-text">${r?`Diagnostic completed on ${new Date(r.completedAt).toLocaleDateString()}`:"Diagnostic not completed yet."}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${d.risk.badge}">Risk ${d.risk.score}</span>
            <div class="student-detail__snapshot-text">${d.risk.action}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--primary">Next Focus</span>
            <div class="student-detail__snapshot-text">${((f=d.recommendedNext)==null?void 0:f.title)||"Lesson 1"} - ${((b=d.recommendedNext)==null?void 0:b.recommendedFocus)||"Continue the learning path."}</div>
          </div>
        </div>
      </div>

      <div class="student-detail__layout">
        <div class="student-detail__panel">
          <h4 class="student-detail__history-title">Theta Trajectory</h4>
          <div class="student-detail__chart-wrap">
            <canvas id="student-theta-chart"></canvas>
          </div>
        </div>

        <div class="student-detail__panel">
          <h4 class="student-detail__history-title">Quiz History</h4>
          <div class="student-detail__quiz-list">
            ${o.length>0?o.slice().reverse().map(h=>{var w;return`
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${h.lessonId}: ${((w=x.find(v=>v.id===h.lessonId))==null?void 0:w.title)||"Unknown"}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${new Date(h.completedAt).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: var(--font-weight-bold); color: ${h.score/h.totalQuestions>=.7?"var(--color-success-400)":"var(--color-warning-400)"};">${Math.round(h.score/h.totalQuestions*100)}%</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">theta ${h.theta.toFixed(2)}</div>
                </div>
              </div>
            `}).join(""):'<div style="padding: var(--space-4); text-align: center; color: var(--text-muted); font-size: var(--font-size-sm);">No quizzes taken yet.</div>'}
          </div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-top: var(--space-6);">
        <h4 class="student-detail__history-title">Per-Question Performance</h4>
        <div class="student-detail__table-wrap">
          <table class="student-detail__table">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Question</th>
                <th>Result</th>
                <th>Time</th>
                <th>Theta After</th>
              </tr>
            </thead>
            <tbody>
              ${p.length>0?p.slice(0,18).map(h=>`
                <tr>
                  <td>${h.lessonId}</td>
                  <td>
                    <div class="student-detail__question">${h.stem}</div>
                    <div class="student-detail__question-sub">${h.options[h.selectedIndex]} ${h.correct?"":`→ ${h.options[h.correctIndex]}`}</div>
                  </td>
                  <td><span class="badge badge--${h.correct?"success":"danger"}">${h.correct?"Correct":"Review"}</span></td>
                  <td>${wt(h.elapsedMs)}</td>
                  <td>${h.thetaAfter}</td>
                </tr>
              `).join(""):'<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;nt("Student Profile",m,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),o.length>0&&setTimeout(()=>{ma(o)},0)}function ua(){de.forEach(e=>e.destroy()),de=[]}async function pa(){if(!$)return;ua();const e=await Xt();e.defaults.color="#94A3B8",e.defaults.borderColor="rgba(148, 163, 184, 0.1)";const t=document.getElementById("chart-scores");t&&de.push(new e(t,{type:"bar",data:{labels:$.charts.lessonLabels,datasets:[{label:"Average Score (%)",data:$.charts.lessonScoreData,backgroundColor:"rgba(99, 102, 241, 0.8)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100}}}}));const s=document.getElementById("chart-levels");s&&de.push(new e(s,{type:"doughnut",data:{labels:Object.keys($.charts.levelCounts),datasets:[{data:Object.values($.charts.levelCounts),backgroundColor:["#34D399","#818CF8","#FBBF24","#FB7185"],borderWidth:0,cutout:"70%"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right"}}}}));const n=document.getElementById("chart-misconceptions");if(n){const a=$.charts.misconceptions.map(o=>o.stem),i=$.charts.misconceptions.map(o=>o.count);de.push(new e(n,{type:"bar",data:{labels:a,datasets:[{label:"Times missed",data:i,backgroundColor:"rgba(244, 63, 94, 0.75)",borderRadius:6}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{tooltip:{callbacks:{label(o){const r=$.charts.misconceptions[o.dataIndex];return`${o.raw} misses — common wrong answer: ${r.answer}`}}}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{ticks:{callback(o,r){return`Q${r+1}`}}}}}}))}}async function ma(e){const t=document.getElementById("student-theta-chart");if(!t)return;const s=await Xt();Ie&&(Ie.destroy(),Ie=null);const n=e.map(i=>`L${i.lessonId}`),a=e.map(i=>i.theta);Ie=new s(t,{type:"line",data:{labels:n,datasets:[{label:"Theta",data:a,borderColor:"#818CF8",backgroundColor:"rgba(129, 140, 248, 0.15)",fill:!0,tension:.35,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{min:-3,max:3}},plugins:{legend:{display:!1}}}})}function ha(){return new Map(x.map(e=>{const t=Ae.filter(s=>s.lessonId===e.id).sort((s,n)=>{const a=Math.abs(s.difficulty)-Math.abs(n.difficulty);return a!==0?a:n.discrimination-s.discrimination});return[e.id,t]}))}function ga(e,t){return e>=.75&&t===0?"Ready to Accelerate":e>=.5?"Foundations Growing":"Needs Guided Support"}function _t(e){return x.map(t=>{const s=e.get(t.id)||[],n=s.filter(o=>o.correct).length,a=s.length,i=a>0?n/a:0;return{lessonId:t.id,lessonTitle:t.title,correct:n,attempted:a,accuracy:i}})}function va(){const e=ha(),t=x.map(f=>{var b;return(b=e.get(f.id))==null?void 0:b[0]}).filter(Boolean),s=new Map(x.map(f=>[f.id,(e.get(f.id)||[]).slice(1)])),n=new Set,a=[];let i=0,o=null,r=[],d=!1,c=!1;function u(){const f=new Map;for(const h of a){const w=f.get(h.lessonId)||[];w.push(h),f.set(h.lessonId,w)}r=_t(f).sort((h,w)=>h.accuracy!==w.accuracy?h.accuracy-w.accuracy:h.lessonId-w.lessonId).slice(0,3).map(h=>(s.get(h.lessonId)||[]).find(v=>!n.has(v.id))||null).filter(Boolean),d=!0}function l(){if(c)return null;let f=null;if(t.length>0?f=t.shift():(d||u(),f=r.shift()||null),!f)return c=!0,null;n.add(f.id),o=f,i+=1;const b=x.find(h=>h.id===f.lessonId);return{question:f,questionNumber:i,totalQuestions:8,lessonId:f.lessonId,lessonTitle:(b==null?void 0:b.title)||`Lesson ${f.lessonId}`,phase:i<=5?"coverage":"follow-up"}}function p(f){if(!o)return null;const b=f===o.correctIndex,h={questionId:o.id,lessonId:o.lessonId,stem:o.stem,options:o.options,selectedIndex:f,correctIndex:o.correctIndex,correct:b};return a.push(h),o=null,{correct:b,correctIndex:h.correctIndex}}function g(){const f=new Map;for(const C of a){const E=f.get(C.lessonId)||[];E.push(C),f.set(C.lessonId,E)}const b=_t(f),h=b.filter(C=>C.accuracy<.5),w=b.filter(C=>C.accuracy>=.75),v=a.filter(C=>C.correct).length,y=a.length,_=y>0?v/y:0;return{score:v,totalQuestions:y,readiness:ga(_,h.length),generationMethod:"adaptive diagnostic",lessonBreakdown:b,knowledgeGaps:h,strengths:w,responses:a}}function m(){return c}return{next:l,answer:p,getResults:g,isFinished:m}}let Y=null,R=null,me=!1;function fa(){Y=va(),R=Y.next(),me=!1}function ba(){(!Y||!R)&&fa()}function es(){Y=null,R=null,me=!1}function ya(){if(!Y||!R)return'<div class="container">Error loading diagnostic assessment.</div>';const e=T();return`
    ${B({title:"Diagnostic Assessment",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter diagnostic-page" style="padding-top: var(--space-6);">
      <div class="card card--glass diagnostic-hero">
        <div class="diagnostic-hero__eyebrow">AI-guided readiness check</div>
        <h1 class="diagnostic-hero__title">Let us map your starting point</h1>
        <p class="diagnostic-hero__text">This short pre-assessment samples all five lessons, then follows up on the topics that need the most attention.</p>
        <div class="diagnostic-hero__meta">
          <span class="badge badge--neutral">8 questions max</span>
          <span class="badge badge--accent">${R.phase==="coverage"?"Checking broad coverage":"Following up on weak areas"}</span>
          <span class="badge badge--primary">${R.lessonTitle}</span>
        </div>
      </div>

      <div class="diagnostic-stage">
        <div class="diagnostic-stage__header">
          <div>
            <div class="diagnostic-stage__label">Question ${R.questionNumber}</div>
            <h2 class="diagnostic-stage__title">${R.lessonTitle}</h2>
          </div>
          <span class="badge badge--neutral">${R.phase==="coverage"?"Coverage pass":"Adaptive follow-up"}</span>
        </div>

        ${be(R.questionNumber-1,R.totalQuestions,"Diagnostic progress")}

        <div id="diagnostic-question-wrap">
          ${Ft(R.question)}
        </div>
      </div>
    </div>
  `}function wa(e,t){P({onBack:()=>e("/lessons")}),document.querySelectorAll(".option-btn").forEach(s=>{s.addEventListener("click",async n=>{if(me)return;me=!0;const a=Number.parseInt(n.currentTarget.dataset.index,10);await _a(a,n.currentTarget,e,t)})})}async function _a(e,t,s,n){const a=Y.answer(e);if(document.querySelectorAll(".option-btn").forEach(r=>{r.classList.add("option-btn--disabled"),r.disabled=!0}),a.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const r=document.getElementById(`option-${a.correctIndex}`);r&&r.classList.add("option-btn--highlight-correct")}await new Promise(r=>setTimeout(r,500));const o=Y.next();if(!o){await Ia(s);return}R=o,me=!1,await n()}async function Ia(e){const t=T(),s=Y.getResults();if(!t){e("/student-login");return}const n=await zs({studentId:t.id,...s});es(),e(`/diagnostic-results/${n.id}`)}const ka="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function Sa(e){const t=e.objectives.slice(0,2).join("; "),s=(e.keyTerms||[]).slice(0,3).map(n=>`${n.word}: ${n.definition}`).join("; ");return`${e.title}. Objectives: ${t}. Key terms: ${s}`}function ts(e){var i;const t=e.knowledgeGaps.map(o=>o.title).join(", ")||"none identified",s=e.strengths.map(o=>o.title).join(", ")||"still emerging",n=((i=e.recommendedNext)==null?void 0:i.title)||"Lesson 1",a=e.revisionQueue.map(o=>`${o.title} (${o.reason})`).join("; ")||"none";return[`Readiness: ${e.readiness.label}.`,`Completion rate: ${e.completionRate}%.`,`Knowledge gaps: ${t}.`,`Strengths: ${s}.`,`Recommended next lesson: ${n}.`,`Revision queue: ${a}.`].join(" ")}function xa(e){const t=e.toLowerCase();return x.find(s=>t.includes(s.title.toLowerCase())?!0:(s.keyTerms||[]).some(n=>t.includes(n.word.toLowerCase())))||null}function $a(e){var n,a,i;const t=((n=e.strengths[0])==null?void 0:n.title)||"your earliest lessons",s=((a=e.knowledgeGaps[0])==null?void 0:a.title)||((i=e.recommendedNext)==null?void 0:i.title)||"the next lesson";return`You are showing the most confidence in ${t}. Focus next on ${s}, then use the AI Tutor to clear up anything that still feels confusing. Small, steady review sessions will move your readiness up quickly.`}function Aa(e,t){var o,r;const s=xa(e),n=t.knowledgeGaps[0],a=t.recommendedNext,i=e.toLowerCase();if(i.includes("next")||i.includes("study")||i.includes("path"))return`Your best next step is ${(a==null?void 0:a.title)||"the next lesson in your path"}. It is recommended because ${n?`${n.title} still needs review`:"it keeps your momentum going"}. After that, revisit one item from your revision queue before taking the quiz.`;if(s){const d=(o=s.keyTerms)==null?void 0:o[0],c=(r=s.objectives)==null?void 0:r[0];return`${s.title} is mainly about ${(c==null?void 0:c.toLowerCase())||"this topic area"}. Start with this idea: ${d?`${d.word} means ${d.definition}`:"focus on the core lesson objective first"}. Then compare it with your own words and try one practice question before moving on.`}return i.includes("struggling")||i.includes("stuck")||i.includes("hard")?`It looks like ${(n==null?void 0:n.title)||"one of your current topics"} needs a slower, more guided review. Break it into two parts: reread the lesson objectives first, then ask me one specific question about a term or idea that is still unclear.`:`I remember your current path is strongest when we keep things focused. Start with ${(a==null?void 0:a.title)||"your next recommended lesson"}, and if a concept feels confusing, ask me about one term or one example at a time so we can unpack it together.`}async function ss(e){var s,n,a,i,o,r;const t=ie();if(!t||!navigator.onLine)return null;try{const d=await fetch(`${ka}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.6,maxOutputTokens:300,topP:.9}}),signal:AbortSignal.timeout(12e3)});if(!d.ok)return null;const c=await d.json();return((r=(o=(i=(a=(n=(s=c==null?void 0:c.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:a.parts)==null?void 0:i[0])==null?void 0:o.text)==null?void 0:r.trim())||null}catch{return null}}async function Ca(e,t,s){const n=["You are a warm, concise learning coach for Basic 7 Computing.",`Student: ${e.name}.`,`Diagnostic readiness: ${t.readiness}.`,ts(s),"Write exactly 3 supportive sentences for the student.","Sentence 1: celebrate one strength.","Sentence 2: explain the most important gap to focus on next.","Sentence 3: give a short action plan using the tutor and the next lesson."].join(`
`),a=await ss(n);return{text:a||$a(s),source:a?"ai":"fallback"}}async function Ta({student:e,message:t,history:s=[],profile:n}){const a=x.map(Sa).join(`
`),i=s.slice(-8).map(d=>`${d.role}: ${d.content}`).join(`
`),o=["You are ClassConnect Tutor, a supportive Basic 7 Computing tutor.",`Student: ${e.name}.`,ts(n),"Use the profile and memory below. Keep answers clear, age-appropriate, and practical.","If the learner asks what to study next, recommend the personalized path.","If the learner asks about a concept, explain it simply and connect it to one lesson.","Respond in 2 short paragraphs maximum.","Lesson references:",a,"Conversation memory:",i||"No prior messages yet.",`Student message: ${t}`].join(`
`),r=await ss(o);return{text:r||Aa(t,n),source:r?"ai":"fallback"}}function It(e,t,s){return e.length?e.map(n=>`
    <div class="insight-pill insight-pill--${s}">
      <div class="insight-pill__title">${n.lessonTitle||n.title}</div>
      <div class="insight-pill__meta">${n.accuracy!==void 0?`${Math.round(n.accuracy*100)}% diagnostic accuracy`:n.recommendedFocus||"Ready for the next step"}</div>
    </div>
  `).join(""):`<div class="insight-empty">${t}</div>`}async function La(e){var d;const t=T(),s=await Rt(Number.parseInt(e,10));if(!t||!s||s.studentId!==t.id)return'<div class="container" style="padding: 2rem;">Diagnostic result not found.</div>';const n=await U(t.id),a=await j(t.id),i=await ee(t.id),o=N({diagnostic:n,results:i,progressRecords:a}),r=s.totalQuestions>0?Math.round(s.score/s.totalQuestions*100):0;return`
    ${B({title:"Diagnostic Results",showBack:!0,studentName:t.name})}
    <div class="container container--narrow view-enter diagnostic-results-page">
      <div class="card card--glass diagnostic-summary">
        <div class="diagnostic-summary__eyebrow">Personalized readiness snapshot</div>
        <h1 class="diagnostic-summary__title">${s.readiness}</h1>
        <p class="diagnostic-summary__text">Your pre-assessment is complete. We can now personalize lesson order, revision, and tutor support.</p>

        <div class="diagnostic-metrics">
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${r}%</div>
            <div class="diagnostic-metric__label">Diagnostic score</div>
          </div>
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${s.knowledgeGaps.length}</div>
            <div class="diagnostic-metric__label">Knowledge gaps</div>
          </div>
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${((d=o.recommendedNext)==null?void 0:d.lessonId)||1}</div>
            <div class="diagnostic-metric__label">Recommended start</div>
          </div>
        </div>
      </div>

      <div class="card diagnostic-coach-card">
        <div class="diagnostic-coach-card__header">
          <div>
            <h2 class="diagnostic-coach-card__title">AI Coach Summary</h2>
            <p class="diagnostic-coach-card__subtitle">A personalized explanation based on your readiness profile.</p>
          </div>
          <span class="badge badge--neutral" id="diagnostic-insight-source">Preparing insight...</span>
        </div>
        <div id="diagnostic-insight" class="diagnostic-coach-card__body">
          <div class="shimmer" style="height: 84px;"></div>
        </div>
      </div>

      <div class="diagnostic-grid">
        <div class="card">
          <h3 class="diagnostic-section__title">Focus First</h3>
          <div class="insight-pill-list">
            ${It(s.knowledgeGaps,"No urgent gaps were detected in the diagnostic.","warning")}
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Current Strengths</h3>
          <div class="insight-pill-list">
            ${It(s.strengths,"Your strengths will appear here as you build more evidence.","success")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="diagnostic-section__title">Adaptive Content Path</h3>
        <p class="diagnostic-section__subtitle">These lessons are now prioritized using your diagnostic, lesson completion, and quiz evidence.</p>
        <div class="path-preview">
          ${o.recommendedSequence.slice(0,4).map((c,u)=>`
            <button class="path-preview__item" data-lesson-id="${c.lessonId}">
              <div class="path-preview__index">${u+1}</div>
              <div class="path-preview__body">
                <div class="path-preview__title">${c.title}</div>
                <div class="path-preview__meta">${c.masteryPercent}% mastery | ${c.recommendedFocus}</div>
              </div>
            </button>
          `).join("")}
        </div>
      </div>

      <div class="diagnostic-actions">
        <button class="btn btn--primary btn--lg" id="btn-open-path">Open Personalized Path</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-retake-diagnostic">Retake Diagnostic</button>
      </div>
    </div>
  `}function Da(e,t){P({onBack:()=>e("/lessons")});const s=document.getElementById("btn-open-path"),n=document.getElementById("btn-open-tutor"),a=document.getElementById("btn-retake-diagnostic");Rt(Number.parseInt(t,10)).then(async i=>{const o=T();if(!o||!i)return;const r=await U(o.id),d=await j(o.id),c=await ee(o.id),u=N({diagnostic:r,results:c,progressRecords:d});s&&s.addEventListener("click",()=>{var m;e(`/lesson/${((m=u.recommendedNext)==null?void 0:m.lessonId)||1}`)}),n&&n.addEventListener("click",()=>{e("/tutor")}),a&&a.addEventListener("click",()=>{e("/diagnostic")}),document.querySelectorAll(".path-preview__item").forEach(m=>{m.addEventListener("click",f=>{const b=Number.parseInt(f.currentTarget.dataset.lessonId,10);e(`/lesson/${b}`)})});const l=await Ca(o,i,u),p=document.getElementById("diagnostic-insight"),g=document.getElementById("diagnostic-insight-source");p&&(p.textContent=l.text),g&&(g.textContent=l.source==="ai"?"AI generated":"Offline-ready insight",g.className=`badge ${l.source==="ai"?"badge--primary":"badge--neutral"}`)})}const Ma=["What should I study next?","Explain RAM and storage in simple words.","Help me review my weakest topic."];let L={studentId:null,messages:[],sending:!1};function Ba(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Ea(e){if(L.studentId===e)return;const t=await js(e);L={studentId:e,messages:(t==null?void 0:t.messages)||[],sending:!1}}function qa(){return L.messages.length?L.messages.map(e=>`
    <div class="chat-bubble chat-bubble--${e.role}">
      <div class="chat-bubble__role">${e.role==="assistant"?"AI Tutor":"You"}</div>
      <div class="chat-bubble__text">${Ba(e.content)}</div>
      ${e.source?`<div class="chat-bubble__meta">${e.source==="ai"?"AI response":"Offline support response"}</div>`:""}
    </div>
  `).join(""):`
      <div class="tutor-empty">
        <div class="tutor-empty__title">Your tutor is ready</div>
        <p class="tutor-empty__text">Ask for an explanation, revision tip, or what to study next. The tutor will answer using your lesson history and diagnostic profile.</p>
      </div>
    `}async function Pa(){var i,o,r,d;const e=T();if(!e)return'<div class="container" style="padding: 2rem;">Student session not found.</div>';await Ea(e.id);const t=await U(e.id),s=await j(e.id),n=await ee(e.id),a=N({diagnostic:t,results:n,progressRecords:s});return`
    ${B({title:"AI Tutor",showBack:!0,studentName:e.name})}
    <div class="container container--narrow view-enter tutor-page">
      <div class="card card--glass tutor-hero">
        <div class="tutor-hero__header">
          <div>
            <div class="diagnostic-hero__eyebrow">Context-aware tutor with memory</div>
            <h1 class="tutor-hero__title">Ask for help at your own pace</h1>
          </div>
          ${L.messages.length?'<button class="btn btn--ghost btn--sm" id="btn-clear-chat">Clear chat</button>':""}
        </div>

        <div class="tutor-hero__chips">
          <span class="badge badge--${a.readiness.tone}">${a.readiness.label}</span>
          <span class="badge badge--primary">Next: ${((i=a.recommendedNext)==null?void 0:i.title)||"Lesson 1"}</span>
          <span class="badge badge--neutral">Risk: ${a.risk.label}</span>
        </div>

        <p class="tutor-hero__memory">
          I remember that your strongest current evidence is in <strong>${((o=a.strengths[0])==null?void 0:o.title)||"the topics you have already practiced"}</strong>,
          while the biggest focus area is <strong>${((r=a.knowledgeGaps[0])==null?void 0:r.title)||((d=a.recommendedNext)==null?void 0:d.title)||"the next lesson in your path"}</strong>.
        </p>
      </div>

      <div class="card tutor-thread-card">
        <div class="tutor-thread" id="tutor-thread">
          ${qa()}
          ${L.sending?'<div class="chat-bubble chat-bubble--assistant"><div class="chat-bubble__role">AI Tutor</div><div class="shimmer" style="height: 52px;"></div></div>':""}
        </div>

        <div class="tutor-prompts">
          ${Ma.map(c=>`
            <button class="tutor-prompt" data-prompt="${c}">${c}</button>
          `).join("")}
        </div>

        <form class="tutor-composer" id="tutor-form">
          <textarea id="tutor-input" class="input tutor-composer__input" rows="3" placeholder="Ask a question about a lesson, concept, or what to study next..." ${L.sending?"disabled":""}></textarea>
          <button class="btn btn--primary" type="submit" ${L.sending?"disabled":""}>Send</button>
        </form>
      </div>
    </div>
  `}function Ra(e,t){P({onBack:()=>e("/lessons")});const s=document.getElementById("tutor-form"),n=document.getElementById("tutor-input"),a=document.getElementById("btn-clear-chat"),i=document.getElementById("tutor-thread");i&&(i.scrollTop=i.scrollHeight),a&&a.addEventListener("click",async()=>{const o=T();o&&(await Ns(o.id),L={studentId:o.id,messages:[],sending:!1},await t())}),document.querySelectorAll(".tutor-prompt").forEach(o=>{o.addEventListener("click",async r=>{const d=r.currentTarget.dataset.prompt;d&&await kt(d,t)})}),s&&n&&s.addEventListener("submit",async o=>{o.preventDefault();const r=n.value.trim();if(!r){D("Type a question for the tutor first.","error");return}await kt(r,t)})}async function kt(e,t){const s=T();if(!s||L.sending)return;const n=await U(s.id),a=await j(s.id),i=await ee(s.id),o=N({diagnostic:n,results:i,progressRecords:a}),r={role:"user",content:e,createdAt:new Date().toISOString()};L={...L,sending:!0,messages:[...L.messages,r]},await ut(s.id,L.messages),await t();const d=await Ta({student:s,message:e,history:L.messages,profile:o});L={...L,sending:!1,messages:[...L.messages,{role:"assistant",content:d.text,source:d.source,createdAt:new Date().toISOString()}]},await ut(s.id,L.messages),await t()}const za="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",St={1:{prompt:"Write a JavaScript function named `isPortableComputer(type)` that returns `true` for portable computers like a laptop, tablet, or smartphone, and `false` for a desktop or server.",starterCode:`function isPortableComputer(type) {
  // your code here
}
`,keyConcepts:["function","return","laptop","tablet","smartphone","desktop","server"],sampleSolution:`function isPortableComputer(type) {
  const portable = ['laptop', 'tablet', 'smartphone'];
  return portable.includes(String(type).toLowerCase());
}
`},2:{prompt:'Write a JavaScript function named `classifyMemory(part)` that returns `"temporary"` for RAM and `"permanent"` for ROM. For any other part, return `"unknown"`.',starterCode:`function classifyMemory(part) {
  // your code here
}
`,keyConcepts:["function","return","ram","rom","temporary","permanent","unknown"],sampleSolution:`function classifyMemory(part) {
  const normalized = String(part).toLowerCase();
  if (normalized === 'ram') return 'temporary';
  if (normalized === 'rom') return 'permanent';
  return 'unknown';
}
`},3:{prompt:"Write a JavaScript function named `isInputDevice(device)` that returns `true` for keyboard, mouse, microphone, scanner, or webcam, and `false` otherwise.",starterCode:`function isInputDevice(device) {
  // your code here
}
`,keyConcepts:["function","return","keyboard","mouse","microphone","scanner","webcam"],sampleSolution:`function isInputDevice(device) {
  const inputs = ['keyboard', 'mouse', 'microphone', 'scanner', 'webcam'];
  return inputs.includes(String(device).toLowerCase());
}
`},4:{prompt:'Write a JavaScript function named `deviceRole(device)` that returns `"output"` for monitor, speaker, or printer, `"io"` for touchscreen, and `"unknown"` for anything else.',starterCode:`function deviceRole(device) {
  // your code here
}
`,keyConcepts:["function","return","monitor","speaker","printer","touchscreen","output","io","unknown"],sampleSolution:`function deviceRole(device) {
  const normalized = String(device).toLowerCase();
  if (['monitor', 'speaker', 'printer'].includes(normalized)) return 'output';
  if (normalized === 'touchscreen') return 'io';
  return 'unknown';
}
`},5:{prompt:'Write a JavaScript function named `recommendStorage(needsSpeed, needsLowCost)` that returns `"SSD"` when speed matters most, `"HDD"` when lower cost matters most, and `"Flash Drive"` when both values are false.',starterCode:`function recommendStorage(needsSpeed, needsLowCost) {
  // your code here
}
`,keyConcepts:["function","return","ssd","hdd","flash","if"],sampleSolution:`function recommendStorage(needsSpeed, needsLowCost) {
  if (needsSpeed) return 'SSD';
  if (needsLowCost) return 'HDD';
  return 'Flash Drive';
}
`}};function ns(e=""){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Qe(e,t){const s=e.slice(),n=[];for(;s.length>0&&n.length<t;)n.push(s.shift());return n}function Ye(e){const t=x.filter(s=>e.includes(s.id));return t.length>0?t:x.slice(0,2)}function Qa(e=""){const t=e.match(/```json\s*([\s\S]*?)```/i);if(t!=null&&t[1])return t[1].trim();const s=e.indexOf("{"),n=e.lastIndexOf("}");return s>=0&&n>s?e.slice(s,n+1):e}function ja(e,t,s){const n=["mcq","short","code"].includes(e.type)?e.type:"short",a=s.includes(e.lessonId)?e.lessonId:s[0],i=Number.isFinite(e.maxScore)?e.maxScore:n==="mcq"?1:5,o=Array.isArray(e.rubric)&&e.rubric.length>0?e.rubric.map(r=>({criterion:r.criterion||"Quality",description:r.description||"Addresses the prompt clearly.",points:Number.isFinite(r.points)?r.points:2,keywords:Array.isArray(r.keywords)?r.keywords:[]})):[{criterion:"Accuracy",description:"Uses correct subject knowledge.",points:i,keywords:[]}];return{id:`GEN-Q${t+1}`,type:n,lessonId:a,objective:e.objective||"Generated from lesson objectives",prompt:e.prompt||e.stem||`Generated question ${t+1}`,options:n==="mcq"&&Array.isArray(e.options)&&e.options.length===4?e.options:void 0,correctIndex:n==="mcq"&&Number.isInteger(e.correctIndex)?e.correctIndex:void 0,starterCode:n==="code"?e.starterCode||"":void 0,answerKey:e.answerKey||"",sampleSolution:e.sampleSolution||"",rubric:o,maxScore:i}}function Na(e,t,s){const n=(e.keyTerms||[]).slice(0,3),a=n.map(o=>o.word.toLowerCase()),i=`In 3-5 sentences, ${t.charAt(0).toLowerCase()}${t.slice(1)}. Use at least one correct computing term from this lesson.`;return{id:`SA-Q${s+1}`,type:"short",lessonId:e.id,objective:t,prompt:i,answerKey:n.map(o=>`${o.word}: ${o.definition}`).join(" "),rubric:[{criterion:"Concept accuracy",description:"The response explains the idea correctly.",points:3,keywords:a},{criterion:"Use of subject vocabulary",description:"The response uses at least one correct computing term.",points:1,keywords:a},{criterion:"Clarity",description:"The response is easy to follow and stays on task.",points:1,keywords:[]}],maxScore:5}}function Oa(e,t,s){const n=St[e.id]||St[5];return{id:`CODE-Q${s+1}`,type:"code",lessonId:e.id,objective:t,prompt:`${n.prompt}

Learning objective: ${t}`,starterCode:n.starterCode,answerKey:n.sampleSolution,sampleSolution:n.sampleSolution,rubric:[{criterion:"Correct logic",description:"The code follows the expected rule from the lesson.",points:3,keywords:n.keyConcepts},{criterion:"Programming structure",description:"The answer uses a function, return value, and clear condition or lookup.",points:2,keywords:["function","return"]}],maxScore:5}}function Fa(e,t){return{id:`MCQ-Q${t+1}`,type:"mcq",lessonId:e.lessonId,objective:"Check core understanding of the lesson objective.",prompt:e.stem,options:e.options,correctIndex:e.correctIndex,answerKey:e.options[e.correctIndex],rubric:[{criterion:"Correct answer",description:"Selects the correct option.",points:1,keywords:[]}],maxScore:1}}function Ua(e){const t=Ye(e.lessonIds),s=t.flatMap(g=>g.objectives.map(m=>({lesson:g,objective:m}))),n=s.length>0?s:x.slice(0,1).flatMap(g=>g.objectives.map(m=>({lesson:g,objective:m}))),a=n.map(g=>({lessonId:g.lesson.id,lessonTitle:g.lesson.title,objective:g.objective})),i=Ae.filter(g=>e.lessonIds.includes(g.lessonId)).sort((g,m)=>m.discrimination-g.discrimination||g.difficulty-m.difficulty),o=Qe(n,e.shortAnswerCount||0),r=Qe(n.slice().reverse(),e.codingCount||0),d=Qe(i,e.mcqCount||0).map(Fa),c=o.map((g,m)=>Na(g.lesson,g.objective,m)),u=r.map((g,m)=>Oa(g.lesson,g.objective,m)),l=[...d,...c,...u].map((g,m)=>({...g,id:`${ns(e.title||"assessment")}-q${m+1}`})),p=l.length;return{title:e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"fallback",published:!0,lessonIds:t.map(g=>g.id),objectiveCoverage:a,durationMinutes:e.durationMinutes||Math.max(15,p*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:l}}async function Ha(e){var i,o,r,d,c;const t=ie();if(!t||!navigator.onLine)return null;const n=Ye(e.lessonIds).map(u=>[`Lesson ${u.id}: ${u.title}`,`Objectives: ${u.objectives.join("; ")}`,`Key terms: ${(u.keyTerms||[]).map(l=>`${l.word}=${l.definition}`).join("; ")}`].join(`
`)).join(`

`),a=["You are building a classroom assessment for Basic 7 Computing.","Return valid JSON only.",`Title: ${e.title}`,`Question counts: ${e.mcqCount} multiple choice, ${e.shortAnswerCount} short answer, ${e.codingCount} coding.`,`Target duration in minutes: ${e.durationMinutes}.`,"Each question must include: type, lessonId, objective, prompt, maxScore, rubric[].","MCQ questions must also include options[4] and correctIndex.","Code questions must also include starterCode and sampleSolution.","Include an objectiveCoverage array with lessonId, lessonTitle, objective.","Keep questions age-appropriate and aligned to the lessons below.",n,"JSON shape:",'{"title":"","objectiveCoverage":[{"lessonId":1,"lessonTitle":"","objective":""}],"questions":[{"type":"mcq","lessonId":1,"objective":"","prompt":"","options":["","","",""],"correctIndex":0,"maxScore":1,"rubric":[{"criterion":"","description":"","points":1,"keywords":[""]}]}]}'].join(`

`);try{const u=await fetch(`${za}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a}]}],generationConfig:{temperature:.7,maxOutputTokens:1200,topP:.9}}),signal:AbortSignal.timeout(15e3)});if(!u.ok)return null;const l=await u.json(),p=(c=(d=(r=(o=(i=l==null?void 0:l.candidates)==null?void 0:i[0])==null?void 0:o.content)==null?void 0:r.parts)==null?void 0:d[0])==null?void 0:c.text;if(!p)return null;const g=JSON.parse(Qa(p));if(!Array.isArray(g.questions)||g.questions.length===0)return null;const m=g.questions.map((f,b)=>ja(f,b,e.lessonIds));return{title:g.title||e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"ai",published:!0,lessonIds:e.lessonIds,objectiveCoverage:Array.isArray(g.objectiveCoverage)&&g.objectiveCoverage.length>0?g.objectiveCoverage:Ye(e.lessonIds).flatMap(f=>f.objectives.map(b=>({lessonId:f.id,lessonTitle:f.title,objective:b}))),durationMinutes:e.durationMinutes||Math.max(15,m.length*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:m.map((f,b)=>({...f,id:`${ns(e.title||"assessment")}-q${b+1}`}))}}catch{return null}}function Wa(){return x.map(e=>({lessonId:e.id,title:e.title,objectives:e.objectives}))}async function Ga(e){var n;const t={title:((n=e.title)==null?void 0:n.trim())||"Assessment Blueprint",lessonIds:Array.isArray(e.lessonIds)&&e.lessonIds.length>0?e.lessonIds:[1,2],mcqCount:Math.max(0,Number.parseInt(e.mcqCount,10)||0),shortAnswerCount:Math.max(0,Number.parseInt(e.shortAnswerCount,10)||0),codingCount:Math.max(0,Number.parseInt(e.codingCount,10)||0),durationMinutes:Math.max(10,Number.parseInt(e.durationMinutes,10)||20)};return await Ha(t)||Ua(t)}function ce(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function je(e,t=2){return Math.round(e*10**t)/10**t}function Ka(e,t){const s=t.map(r=>{var d;return{...r,totalNormalized:(d=r.grading)!=null&&d.maxScore?r.grading.totalScore/r.grading.maxScore:0}}),n=s.slice().sort((r,d)=>d.totalNormalized-r.totalNormalized),a=Math.max(1,Math.ceil(n.length/3)),i=n.slice(0,a),o=n.slice(-a);return e.questions.map(r=>{const d=s.map(m=>{var f,b;return(b=(f=m.grading)==null?void 0:f.questionScores)==null?void 0:b.find(h=>h.questionId===r.id)}).filter(Boolean),c=ce(d.map(m=>m.normalizedScore)),u=ce(i.map(m=>{var f,b,h;return(h=(b=(f=m.grading)==null?void 0:f.questionScores)==null?void 0:b.find(w=>w.questionId===r.id))==null?void 0:h.normalizedScore}).filter(m=>typeof m=="number")),l=ce(o.map(m=>{var f,b,h;return(h=(b=(f=m.grading)==null?void 0:f.questionScores)==null?void 0:b.find(w=>w.questionId===r.id))==null?void 0:h.normalizedScore}).filter(m=>typeof m=="number")),p=u-l;let g="Healthy";return c<.25?g="Too Hard":c>.85?g="Too Easy":p<.15&&(g="Weak Discriminator"),{questionId:r.id,type:r.type,prompt:r.prompt,objective:r.objective,difficultyIndex:je(c),discriminationIndex:je(p),meanScore:je(ce(d.map(m=>m.score||0))),status:g,submissionCount:d.length}})}function as(e,t){const s=Ka(e,t),n=t.length>0?Math.round(ce(t.map(o=>{var r;return((r=o.grading)==null?void 0:r.percentage)||0}))):0,a=t.filter(o=>{var r;return((r=o.integrity)==null?void 0:r.label)==="High"}).length,i=t.filter(o=>{var r;return((r=o.proctor)==null?void 0:r.label)==="High"}).length;return{assessmentId:e.id,title:e.title,generatedBy:e.generatedBy,submissionCount:t.length,averagePercentage:n,flaggedIntegrityCount:a,flaggedProctorCount:i,itemAnalysis:s}}function Ne(e,t){return e.filter(s=>s.type===t).length}function Ya(){return Wa().map(t=>`
    <label class="assessment-check">
      <input type="checkbox" name="lesson-id" value="${t.lessonId}" ${t.lessonId<=3?"checked":""}>
      <span class="assessment-check__body">
        <span class="assessment-check__title">Lesson ${t.lessonId}: ${t.title}</span>
        <span class="assessment-check__meta">${t.objectives.length} objectives available</span>
      </span>
    </label>
  `).join("")}function Ja(e,t){return e.length?e.map(s=>{const n=t.filter(i=>i.assessmentId===s.id),a=as(s,n);return`
      <div class="card assessment-admin-card">
        <div class="assessment-admin-card__header">
          <div>
            <div class="assessment-admin-card__eyebrow">${s.generatedBy==="ai"?"AI generated":"Objective-based fallback"}</div>
            <h3 class="assessment-admin-card__title">${s.title}</h3>
            <p class="assessment-admin-card__meta">${s.durationMinutes} min | ${s.questions.length} questions | ${s.objectiveCoverage.length} objectives covered</p>
          </div>
          <div class="assessment-admin-card__badges">
            <span class="badge badge--primary">${Ne(s.questions,"mcq")} MCQ</span>
            <span class="badge badge--accent">${Ne(s.questions,"short")} Short</span>
            <span class="badge badge--warning">${Ne(s.questions,"code")} Code</span>
          </div>
        </div>

        <div class="assessment-admin-card__metrics">
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${a.submissionCount}</span>
            <span class="assessment-admin-card__metric-label">Submissions</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${a.averagePercentage}%</span>
            <span class="assessment-admin-card__metric-label">Average Score</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${a.flaggedIntegrityCount}</span>
            <span class="assessment-admin-card__metric-label">High AI Risk</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${a.flaggedProctorCount}</span>
            <span class="assessment-admin-card__metric-label">High Proctor Alerts</span>
          </div>
        </div>

        <div class="assessment-admin-card__footer">
          <span class="badge badge--neutral">${s.advancedFeature||"Advanced feature enabled"}</span>
          <button class="btn btn--ghost btn--sm btn-view-analysis" data-assessment-id="${s.id}">View Analysis</button>
        </div>
      </div>
    `}).join(""):`
      <div class="empty-state">
        <div class="empty-state__icon">Assess</div>
        <h2 class="empty-state__title">No Assessments Yet</h2>
        <p class="empty-state__text">Generate your first AI-powered assessment blueprint to publish it to the student assessment center.</p>
      </div>
    `}function xt(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Va(e){const t=await ve(),s=await fe(),n=await he(),a=t.find(c=>c.id===e);if(!a)return;const i=s.filter(c=>c.assessmentId===a.id),o=as(a,i),r=i.filter(c=>{var u,l;return((u=c.integrity)==null?void 0:u.label)!=="Low"||((l=c.proctor)==null?void 0:l.label)!=="Low"}).map(c=>{var l,p,g,m,f;const u=n.find(b=>b.id===c.studentId);return`
        <tr>
          <td>${(u==null?void 0:u.name)||"Unknown"}</td>
          <td>${((l=c.grading)==null?void 0:l.percentage)||0}%</td>
          <td>${((p=c.integrity)==null?void 0:p.label)||"Low"} (${((g=c.integrity)==null?void 0:g.score)||0})</td>
          <td>${((m=c.proctor)==null?void 0:m.label)||"Low"} (${((f=c.proctor)==null?void 0:f.anomalyScore)||0})</td>
        </tr>
      `}).join(""),d=`
    <div class="analysis-modal">
      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Objective Coverage</h4>
        <div class="analysis-modal__chips">
          ${a.objectiveCoverage.map(c=>`
            <span class="badge badge--neutral">${xt(c.lessonTitle||`Lesson ${c.lessonId}`)}: ${xt(c.objective)}</span>
          `).join("")}
        </div>
      </div>

      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Item Analysis</h4>
        <div class="student-detail__table-wrap">
          <table class="student-detail__table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Discrimination</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${o.itemAnalysis.map((c,u)=>`
                <tr>
                  <td>Q${u+1}</td>
                  <td>${c.type}</td>
                  <td>${c.difficultyIndex}</td>
                  <td>${c.discriminationIndex}</td>
                  <td>${c.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Flagged Submissions</h4>
        ${r?`
          <div class="student-detail__table-wrap">
            <table class="student-detail__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                  <th>AI / Style Risk</th>
                  <th>Proctoring</th>
                </tr>
              </thead>
              <tbody>${r}</tbody>
            </table>
          </div>
        `:'<div class="insight-empty">No submissions are currently flagged.</div>'}
      </div>
    </div>
  `;nt(a.title,d,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"})}async function Za(){const e=(await ve()).slice().sort((s,n)=>new Date(n.createdAt)-new Date(s.createdAt)),t=await fe();return`
    ${B({title:"Assessment Lab",showBack:!0,showSettings:!1,showLogout:!1})}
    <div class="container view-enter assessment-lab-page" style="padding-top: var(--space-6);">
      <div class="card card--glass assessment-hero">
        <div class="assessment-hero__eyebrow">AI-powered assessment platform</div>
        <h1 class="assessment-hero__title">Generate, grade, protect, and analyze assessments</h1>
        <p class="assessment-hero__text">Create multiple-choice, short answer, and coding tasks from lesson objectives. ClassConnect will grade open responses, estimate AI-writing risk, monitor browser anomalies, and compute item analysis automatically.</p>
      </div>

      <div class="assessment-lab-layout">
        <div class="card assessment-builder-card">
          <h2 class="assessment-builder-card__title">AI Question Generator</h2>
          <p class="assessment-builder-card__subtitle">Build an assessment blueprint from selected lessons. If Gemini is available, the app will try AI generation first and fall back locally if needed.</p>

          <form id="assessment-builder-form" class="assessment-builder-form">
            <div class="input-group">
              <label for="assessment-title">Assessment Title</label>
              <input id="assessment-title" class="input" type="text" value="Mid-Unit Computing Assessment" minlength="4" required>
            </div>

            <div class="assessment-builder-form__grid">
              <div class="input-group">
                <label for="assessment-duration">Duration (minutes)</label>
                <input id="assessment-duration" class="input" type="number" min="10" value="25">
              </div>
              <div class="input-group">
                <label for="assessment-mcq-count">MCQ Count</label>
                <input id="assessment-mcq-count" class="input" type="number" min="0" value="4">
              </div>
              <div class="input-group">
                <label for="assessment-short-count">Short Answer Count</label>
                <input id="assessment-short-count" class="input" type="number" min="0" value="2">
              </div>
              <div class="input-group">
                <label for="assessment-code-count">Coding Count</label>
                <input id="assessment-code-count" class="input" type="number" min="0" value="1">
              </div>
            </div>

            <div class="input-group">
              <label>Lesson Objective Coverage</label>
              <div class="assessment-checklist">
                ${Ya()}
              </div>
            </div>

            <div class="assessment-builder-form__actions">
              <button class="btn btn--primary btn--lg" type="submit">Generate and Publish Assessment</button>
            </div>
          </form>
        </div>

        <div class="assessment-admin-panel">
          <div class="assessment-admin-panel__header">
            <h2 class="assessment-builder-card__title">Published Assessments</h2>
            <p class="assessment-builder-card__subtitle">Students will see these in the local Assessment Center on this device.</p>
          </div>
          <div class="assessment-admin-list">
            ${Ja(e,t)}
          </div>
        </div>
      </div>
    </div>
  `}function Xa(e){P({onBack:()=>e("/dashboard")});const t=document.getElementById("assessment-builder-form");t&&t.addEventListener("submit",async s=>{var r,d,c,u,l;s.preventDefault();const n=[...document.querySelectorAll('input[name="lesson-id"]:checked')].map(p=>Number.parseInt(p.value,10)).filter(Boolean),a={title:((r=document.getElementById("assessment-title"))==null?void 0:r.value)||"",durationMinutes:((d=document.getElementById("assessment-duration"))==null?void 0:d.value)||"25",mcqCount:((c=document.getElementById("assessment-mcq-count"))==null?void 0:c.value)||"0",shortAnswerCount:((u=document.getElementById("assessment-short-count"))==null?void 0:u.value)||"0",codingCount:((l=document.getElementById("assessment-code-count"))==null?void 0:l.value)||"0",lessonIds:n},i=Number.parseInt(a.mcqCount,10)+Number.parseInt(a.shortAnswerCount,10)+Number.parseInt(a.codingCount,10);if(n.length===0){D("Choose at least one lesson for the blueprint.","error");return}if(i<=0){D("Add at least one question to the assessment.","error");return}const o=t.querySelector('button[type="submit"]');o&&(o.disabled=!0,o.textContent="Generating...");try{const p=await Ga(a);await Os(p),D(`Assessment published with ${p.questions.length} questions.`,"success"),await e("/assessment-lab")}catch(p){console.error(p),D("Assessment generation failed. Please try again.","error"),o&&(o.disabled=!1,o.textContent="Generate and Publish Assessment")}}),document.querySelectorAll(".btn-view-analysis").forEach(s=>{s.addEventListener("click",async n=>{const a=Number.parseInt(n.currentTarget.dataset.assessmentId,10);await Va(a)})})}async function eo(){const e=T(),t=(await ve()).filter(n=>n.published!==!1).sort((n,a)=>new Date(a.createdAt)-new Date(n.createdAt)),s=e?await Qt(e.id):[];return`
    ${B({title:"Assessment Center",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-center-page" style="padding-top: var(--space-6);">
      <div class="card card--glass assessment-hero">
        <div class="assessment-hero__eyebrow">Secure assessment workspace</div>
        <h1 class="assessment-hero__title">Take published assessments and review your feedback</h1>
        <p class="assessment-hero__text">Open-ended responses are graded against rubrics, browser anomalies are logged locally, and every submission gets an integrity review plus a remediation plan.</p>
      </div>

      <div class="assessment-student-list">
        ${t.length>0?t.map(n=>{var o,r;const a=s.filter(d=>d.assessmentId===n.id).sort((d,c)=>new Date(c.completedAt)-new Date(d.completedAt))[0],i=n.questions.length;return`
            <div class="card assessment-student-card">
              <div class="assessment-student-card__header">
                <div>
                  <div class="assessment-admin-card__eyebrow">${n.generatedBy==="ai"?"AI blueprint":"Objective blueprint"}</div>
                  <h2 class="assessment-student-card__title">${n.title}</h2>
                  <p class="assessment-student-card__meta">${n.durationMinutes} min | ${i} questions | ${n.objectiveCoverage.length} objectives</p>
                </div>
                ${a?`<span class="badge badge--${((o=a.integrity)==null?void 0:o.label)==="High"?"warning":"success"}">${((r=a.grading)==null?void 0:r.percentage)||0}% latest</span>`:'<span class="badge badge--neutral">Not taken yet</span>'}
              </div>

              <div class="assessment-student-card__actions">
                <button class="btn btn--primary btn--sm btn-start-assessment" data-assessment-id="${n.id}">
                  ${a?"Retake Assessment":"Start Assessment"}
                </button>
                ${a?`
                  <button class="btn btn--ghost btn--sm btn-view-assessment-result" data-submission-id="${a.id}">
                    Review Latest Result
                  </button>
                `:""}
              </div>
            </div>
          `}).join(""):`
          <div class="empty-state">
            <div class="empty-state__icon">Assess</div>
            <h2 class="empty-state__title">No Published Assessments</h2>
            <p class="empty-state__text">Your teacher has not published an assessment on this device yet.</p>
          </div>
        `}
      </div>
    </div>
  `}function to(e){P({onBack:()=>e("/lessons")}),document.querySelectorAll(".btn-start-assessment").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.assessmentId,10);e(`/assessment/${n}`)})}),document.querySelectorAll(".btn-view-assessment-result").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.submissionId,10);e(`/assessment-results/${n}`)})})}function os(){return new Date().toISOString()}function so(e,t={}){return{type:e,detail:t,timestamp:os()}}function no(){const e=[],t=[],s=new Map;let n=null;function a(l,p={}){e.push(so(l,p))}function i(l,p,g,m){l.addEventListener(p,g,m),t.push(()=>l.removeEventListener(p,g,m))}async function o(){try{!document.fullscreenElement&&document.documentElement.requestFullscreen&&await document.documentElement.requestFullscreen()}catch{a("fullscreen-request-failed")}}async function r(){n=Date.now(),await o(),i(document,"visibilitychange",()=>{document.hidden&&a("tab-hidden")}),i(window,"blur",()=>{a("window-blur")}),i(document,"fullscreenchange",()=>{document.fullscreenElement||a("fullscreen-exit")}),i(document,"contextmenu",l=>{l.preventDefault(),a("context-menu-open")}),["copy","cut","paste"].forEach(l=>{i(document,l,p=>{p.preventDefault(),a(`${l}-attempt`)})}),i(document,"keydown",l=>{(l.key==="F12"||l.ctrlKey&&["c","v","x","p","s","u"].includes(l.key.toLowerCase())||l.ctrlKey&&l.shiftKey&&["i","j","c"].includes(l.key.toLowerCase()))&&(l.preventDefault(),a("blocked-shortcut",{key:l.key}))}),window.onbeforeunload=()=>"Assessment still in progress.",a("proctor-started")}function d(l,p){const g=(p||"").length,m=s.get(l)||{length:0,updatedAt:Date.now()},f=Date.now(),b=g-m.length,h=f-m.updatedAt;b>=80&&h<1500&&a("burst-typing",{questionId:l,deltaLength:b,deltaTime:h}),s.set(l,{length:g,updatedAt:f})}function c(){const l=e.reduce((g,m)=>(g[m.type]=(g[m.type]||0)+1,g),{}),p=Math.min(100,(l["fullscreen-exit"]||0)*18+(l["tab-hidden"]||0)*16+(l["window-blur"]||0)*12+(l["paste-attempt"]||0)*12+(l["copy-attempt"]||0)*8+(l["cut-attempt"]||0)*8+(l["blocked-shortcut"]||0)*7+(l["burst-typing"]||0)*10+(l["context-menu-open"]||0)*6);return{startedAt:n?new Date(n).toISOString():null,endedAt:os(),durationMs:n?Date.now()-n:0,anomalyScore:p,label:p>=60?"High":p>=30?"Moderate":"Low",counts:l,events:e}}async function u(){t.splice(0).forEach(l=>l()),window.onbeforeunload=null;try{document.fullscreenElement&&document.exitFullscreen&&await document.exitFullscreen()}catch{}return a("proctor-stopped"),c()}return{start:r,stop:u,summarize:c,logEvent:a,trackTextEntry:d}}const ao="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function le(e,t,s){return Math.max(t,Math.min(s,e))}function oo(e,t=2){return Math.round(e*10**t)/10**t}function io(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function ro(e,t=[]){return t.length?t.reduce((s,n)=>e.includes(String(n).toLowerCase())?s+1:s,0):0}function co(e){return e.filter(Boolean).join(" ")}async function lo(e){var s,n,a,i,o;const t=ie();if(!t||!navigator.onLine)return null;try{const r=await fetch(`${ao}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.3,maxOutputTokens:400,topP:.85}}),signal:AbortSignal.timeout(12e3)});if(!r.ok)return null;const d=await r.json(),c=(o=(i=(a=(n=(s=d==null?void 0:d.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:a.parts)==null?void 0:i[0])==null?void 0:o.text;if(!c)return null;const u=c.includes("{")?c.slice(c.indexOf("{"),c.lastIndexOf("}")+1):c;return JSON.parse(u)}catch{return null}}function uo(e,t){var c;const s=e.maxScore||((c=e.rubric)==null?void 0:c.reduce((u,l)=>u+l.points,0))||5,n=t.trim();if(!n)return{score:0,maxScore:s,rubricBreakdown:(e.rubric||[]).map(u=>({criterion:u.criterion,score:0,maxScore:u.points,evidence:"No evidence yet."})),feedback:"No response was submitted for this question.",source:"fallback"};const a=io(n),i=/function|return|if|const|let|=>/i.test(n),o=(e.rubric||[]).map(u=>{var m,f;const l=ro(a,u.keywords),p=(m=u.keywords)!=null&&m.length?l/u.keywords.length:.6;let g=(f=u.keywords)!=null&&f.length?Math.round(le(p,0,1)*u.points):Math.ceil(u.points*.6);return e.type==="code"&&i&&/function|return/i.test(n)&&/Programming structure/i.test(u.description)&&(g=Math.max(g,Math.ceil(u.points*.75))),g=le(g,0,u.points),{criterion:u.criterion,score:g,maxScore:u.points,evidence:l>0?`Matched ${l} expected concept${l===1?"":"s"}.`:"Only partial evidence of the expected concept."}});let r=o.reduce((u,l)=>u+l.score,0);a.length>24&&r<s&&(r=Math.min(s,r+1));const d=co([r>=s*.8?"Strong response.":"This response shows some understanding but still needs refinement.",e.type==="code"?"Check that the code logic matches the lesson rule and that the function returns the expected values.":"Use more precise lesson vocabulary and include the key concept directly in your explanation."]);return{score:le(r,0,s),maxScore:s,rubricBreakdown:o,feedback:d,source:"fallback"}}async function po(e,t){var i;const s=e.maxScore||((i=e.rubric)==null?void 0:i.reduce((o,r)=>o+r.points,0))||5,n=["You are grading a Basic 7 Computing assessment.","Return valid JSON only with keys: score, feedback, rubricBreakdown.",`Question type: ${e.type}`,`Prompt: ${e.prompt}`,`Sample answer: ${e.sampleSolution||e.answerKey||""}`,`Rubric: ${JSON.stringify(e.rubric||[])}`,`Student response: ${t}`,`Maximum score: ${s}`].join(`
`),a=await lo(n);return a&&Number.isFinite(a.score)?{score:le(Math.round(a.score),0,s),maxScore:s,rubricBreakdown:Array.isArray(a.rubricBreakdown)&&a.rubricBreakdown.length>0?a.rubricBreakdown.map(o=>({criterion:o.criterion||"Quality",score:le(Math.round(o.score||0),0,Number.isFinite(o.maxScore)?o.maxScore:s),maxScore:Number.isFinite(o.maxScore)?o.maxScore:s,evidence:o.evidence||""})):[],feedback:a.feedback||"AI grading completed.",source:"ai"}:uo(e,t)}function mo(e,t){const s=Number.parseInt(t==null?void 0:t.selectedIndex,10)===e.correctIndex;return{score:s?e.maxScore||1:0,maxScore:e.maxScore||1,rubricBreakdown:[{criterion:"Correct answer",score:s?e.maxScore||1:0,maxScore:e.maxScore||1,evidence:s?"Correct option selected.":"Incorrect option selected."}],feedback:s?"Correct. You selected the best answer for this concept.":`Review this concept and compare your answer with the correct option: ${e.answerKey}.`,source:"system"}}async function ho({assessment:e,answers:t}){const s=[];for(const c of e.questions){const u=t.find(g=>g.questionId===c.id)||{};let l=null;c.type==="mcq"?l=mo(c,u):l=await po(c,u.responseText||"");const p=l.maxScore>0?l.score/l.maxScore:0;s.push({questionId:c.id,prompt:c.prompt,lessonId:c.lessonId,objective:c.objective,type:c.type,score:l.score,maxScore:l.maxScore,normalizedScore:oo(p),feedback:l.feedback,rubricBreakdown:l.rubricBreakdown,gradingSource:l.source,flaggedForReview:c.type!=="mcq"&&l.source==="fallback"&&p>=.4&&p<=.7,answerPreview:c.type==="mcq"?u.selectedIndex:u.responseText||""})}const n=s.reduce((c,u)=>c+u.score,0),a=s.reduce((c,u)=>c+u.maxScore,0),i=a>0?Math.round(n/a*100):0,o=s.filter(c=>c.normalizedScore<.6).map(c=>({lessonId:c.lessonId,objective:c.objective,questionId:c.questionId,reason:c.feedback})),r=s.filter(c=>c.normalizedScore>=.8).map(c=>({lessonId:c.lessonId,objective:c.objective,questionId:c.questionId})),d=o.slice(0,4).map(c=>{var u;return{lessonId:c.lessonId,objective:c.objective,action:`Review this objective again and retry a similar ${((u=s.find(l=>l.questionId===c.questionId))==null?void 0:u.type)||"assessment"} question.`}});return{totalScore:n,maxScore:a,percentage:i,questionScores:s,weakObjectives:o,strengths:r,remediationPlan:d}}function Q(e,t=2){return Math.round(e*10**t)/10**t}function ae(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function go(e=""){return e.split(/[.!?]+/).map(t=>t.trim()).filter(Boolean)}function F(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function vo(e){if(e.length<2)return 0;const t=F(e);return F(e.map(s=>(s-t)**2))}function $t(e,t){const s=new Set(e),n=new Set(t),a=[...s].filter(o=>n.has(o)).length,i=new Set([...s,...n]).size;return i>0?a/i:0}function fo(e){if(!e.length)return 0;const t=new Map;return e.forEach(s=>{t.set(s,(t.get(s)||0)+1)}),[...t.values()].reduce((s,n)=>{const a=n/e.length;return s-a*Math.log2(a)},0)}function is(e){const t=ae(e),s=go(e),n=s.map(l=>ae(l).length).filter(Boolean),a=new Set(t).size,i=t.length>0?a/t.length:0,o=n.length>0?F(n):t.length,r=n.length>1?vo(n)/Math.max(1,o):0,d=fo(t),c=t.length>0?2**d:0,u=(e.match(/\b(overall|in conclusion|therefore|moreover|furthermore|additionally)\b/gi)||[]).length;return{tokenCount:t.length,sentenceCount:s.length,lexicalDiversity:Q(i),averageSentenceLength:Q(o),burstiness:Q(r),perplexityProxy:Q(c),templatePhraseCount:u}}function rs(e){return typeof e.responseText=="string"?e.responseText.trim():""}function bo(e=[]){const t=e.flatMap(n=>n.answers||[]).map(rs).filter(n=>n.length>0),s=t.map(is);return{texts:t,avgLexicalDiversity:F(s.map(n=>n.lexicalDiversity)),avgSentenceLength:F(s.map(n=>n.averageSentenceLength))}}function yo({answers:e,priorSubmissions:t=[]}){const s=e.filter(v=>v.type==="short"||v.type==="code").map(v=>({questionId:v.questionId,type:v.type,text:rs(v)})).filter(v=>v.text.length>0),n=s.map(v=>({...v,metrics:is(v.text)})),a=bo(t),i=F(n.map(v=>v.metrics.lexicalDiversity)),o=F(n.map(v=>v.metrics.averageSentenceLength)),r=F(n.map(v=>v.metrics.burstiness)),d=F(n.map(v=>v.metrics.perplexityProxy)),c=n.reduce((v,y)=>v+y.metrics.templatePhraseCount,0),u=[];for(let v=0;v<n.length;v+=1)for(let y=v+1;y<n.length;y+=1)u.push($t(ae(n[v].text),ae(n[y].text)));const l=F(u),p=a.texts.length>0?Math.abs(i-a.avgLexicalDiversity)+Math.abs(o-a.avgSentenceLength)/20:0,g=a.texts.length>0&&s.length>0?Math.max(...s.map(v=>Math.max(...a.texts.map(y=>$t(ae(v.text),ae(y))),0)),0):0;let m=0;const f=[],b=[];if(s.length===0)return{score:0,label:"Low",reasons:["No open-ended writing to analyze."],metrics:{lexicalDiversity:0,averageSentenceLength:0,burstiness:0,perplexityProxy:0,internalSimilarity:0,historicalOverlap:0},flaggedSegments:b};i>.62&&r<1.2&&(m+=18,f.push("Writing is unusually uniform across responses.")),d>35&&r<1.4&&(m+=16,f.push("Perplexity proxy suggests highly polished and predictable wording.")),c>=2&&(m+=10,f.push("Several template-like transition phrases were reused.")),l>.45&&(m+=18,f.push("Multiple answers reuse very similar vocabulary patterns.")),p>.35&&(m+=22,f.push("Writing style differs noticeably from the student’s earlier responses.")),g>.75&&(m+=20,f.push("One or more answers overlap heavily with earlier saved writing.")),n.forEach(v=>{v.metrics.burstiness<.5&&v.metrics.tokenCount>30&&b.push({questionId:v.questionId,reason:"Low burstiness and long response length."})});const h=Math.min(100,Math.round(m)),w=h>=65?"High":h>=35?"Moderate":"Low";return f.length||f.push("Writing patterns look reasonably consistent."),{score:h,label:w,reasons:f,metrics:{lexicalDiversity:Q(i),averageSentenceLength:Q(o),burstiness:Q(r),perplexityProxy:Q(d),internalSimilarity:Q(l),historicalOverlap:Q(g),styleShift:Q(p)},flaggedSegments:b}}let k=null,Te=null,G=new Map,J=!1,M=null,ue=null,H=0,V=!1;function cs(e=0){const t=String(Math.floor(e/60)).padStart(2,"0"),s=String(e%60).padStart(2,"0");return`${t}:${s}`}function At(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function ds(e){return e.type==="mcq"?{questionId:e.id,type:e.type,selectedIndex:null}:{questionId:e.id,type:e.type,responseText:e.type==="code"&&e.starterCode||""}}function ls(e,t){if(!t)return!1;if(e.type==="mcq")return Number.isInteger(t.selectedIndex);const s=(t.responseText||"").trim();return!(!s||e.type==="code"&&s===(e.starterCode||"").trim())}function wo(e,t,s){return e.type==="mcq"?`
      <div class="assessment-question card">
        <div class="assessment-question__header">
          <span class="badge badge--primary">Question ${t+1}</span>
          <span class="badge badge--neutral">MCQ</span>
          <span class="badge badge--neutral">${e.maxScore} point${e.maxScore===1?"":"s"}</span>
        </div>
        <h3 class="assessment-question__prompt">${e.prompt}</h3>
        <div class="question-options">
          ${e.options.map((n,a)=>`
            <button class="option-btn assessment-option ${(s==null?void 0:s.selectedIndex)===a?"option-btn--selected":""}" type="button" data-question-id="${e.id}" data-option-index="${a}">
              <span class="option-btn__letter">${String.fromCharCode(65+a)}</span>
              <span class="option-btn__text">${n}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `:`
    <div class="assessment-question card">
      <div class="assessment-question__header">
        <span class="badge badge--${e.type==="code"?"warning":"accent"}">Question ${t+1}</span>
        <span class="badge badge--neutral">${e.type==="code"?"Coding":"Short Answer"}</span>
        <span class="badge badge--neutral">${e.maxScore} points</span>
      </div>
      <h3 class="assessment-question__prompt">${e.prompt}</h3>
      ${e.type==="code"&&e.starterCode?`
        <div class="assessment-question__starter">
          <div class="assessment-question__starter-label">Starter code</div>
          <pre>${At(e.starterCode)}</pre>
        </div>
      `:""}
      <textarea
        class="input assessment-response ${e.type==="code"?"assessment-response--code":""}"
        data-question-id="${e.id}"
        rows="${e.type==="code"?10:5}"
        placeholder="${e.type==="code"?"Write your code here...":"Write your response here..."}"
      >${At((s==null?void 0:s.responseText)||"")}</textarea>
    </div>
  `}function us(){return(k==null?void 0:k.questions.map(e=>G.get(e.id)||ds(e)))||[]}function Ct(){const e=document.getElementById("assessment-session-timer");e&&(e.textContent=cs(H))}function Me(){ue&&(window.clearInterval(ue),ue=null)}async function _o(e){const t=Number.parseInt(e,10);k&&Te===t||(k=await Fs(t),Te=t,G=new Map(((k==null?void 0:k.questions)||[]).map(s=>[s.id,ds(s)])),J=!1,M=null,H=((k==null?void 0:k.durationMinutes)||20)*60,Me(),V=!1)}function Io(){Me(),M&&M.stop(),k=null,Te=null,G=new Map,J=!1,M=null,H=0,V=!1}async function ko(e){!k||J||(M=no(),await M.start(),J=!0,H=(k.durationMinutes||20)*60,await e())}async function ps(e){if(!k||V)return;V=!0,Me();const t=T();if(!t){V=!1,e("/student-login");return}try{const s=us().map(d=>{const c=k.questions.find(u=>u.id===d.questionId);return!c||c.type==="mcq"?d:{...d,responseText:ls(c,d)?d.responseText:""}}),n=await Qt(t.id),a=await ho({assessment:k,answers:s}),i=yo({answers:s,priorSubmissions:n}),o=M?await M.stop():{anomalyScore:0,label:"Low",counts:{},events:[]},r=await Us({assessmentId:k.id,studentId:t.id,answers:s,grading:a,integrity:i,proctor:o});k=null,Te=null,G=new Map,J=!1,M=null,H=0,V=!1,e(`/assessment-results/${r.id}`)}catch(s){console.error(s),D("Unable to submit the assessment right now.","error"),V=!1}}function So(e){!J||ue||!k||(Ct(),ue=window.setInterval(async()=>{H=Math.max(0,H-1),Ct(),H===0&&(Me(),D("Time is up. Submitting your assessment now.","info"),await ps(e))},1e3))}function xo(){return{completed:us().filter(s=>{const n=k==null?void 0:k.questions.find(a=>a.id===s.questionId);return n?ls(n,s):!1}).length,total:(k==null?void 0:k.questions.length)||0}}function $o(){var n;const e=T();if(!k)return'<div class="container" style="padding: 2rem;">Assessment not found.</div>';const t=xo(),s=(n=M==null?void 0:M.summarize)==null?void 0:n.call(M);return J?`
    ${B({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-session-page">
      <div class="card card--glass assessment-session-topbar">
        <div>
          <div class="assessment-hero__eyebrow">Assessment in progress</div>
          <h1 class="assessment-session-topbar__title">${k.title}</h1>
        </div>
        <div class="assessment-session-topbar__meta">
          <span class="badge badge--warning" id="assessment-session-timer">${cs(H)}</span>
          <span class="badge badge--neutral">${t.completed}/${t.total} answered</span>
          <span class="badge badge--${(s==null?void 0:s.label)==="High"?"danger":(s==null?void 0:s.label)==="Moderate"?"warning":"success"}">Proctor ${(s==null?void 0:s.label)||"Low"}</span>
        </div>
      </div>

      ${be(t.completed,t.total,"Assessment completion")}

      <form id="assessment-session-form" class="assessment-session-form">
        ${k.questions.map((a,i)=>wo(a,i,G.get(a.id))).join("")}

        <div class="assessment-session-submit">
          <button class="btn btn--primary btn--lg" id="btn-submit-assessment" type="submit">Submit Assessment</button>
        </div>
      </form>
    </div>
  `:`
      ${B({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
      <div class="container container--narrow view-enter assessment-session-page">
        <div class="card card--glass assessment-start-card">
          <div class="assessment-hero__eyebrow">Proctored assessment</div>
          <h1 class="assessment-hero__title">${k.title}</h1>
          <p class="assessment-hero__text">This assessment uses browser-based proctoring, open-response grading, item analysis, and integrity review.</p>

          <div class="assessment-start-card__grid">
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${k.durationMinutes}</span>
              <span class="assessment-start-card__label">Minutes</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${k.questions.length}</span>
              <span class="assessment-start-card__label">Questions</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${k.objectiveCoverage.length}</span>
              <span class="assessment-start-card__label">Objectives</span>
            </div>
          </div>

          <div class="assessment-start-card__rules">
            <div class="assessment-start-card__rule">Secure mode will request fullscreen and log tab switches, blur events, copy/paste attempts, and suspicious typing bursts.</div>
            <div class="assessment-start-card__rule">Open-ended answers are graded with rubric alignment, then checked for style consistency and AI-writing risk.</div>
            <div class="assessment-start-card__rule">Coding questions use a safe static review instead of executing submitted code.</div>
          </div>

          <button class="btn btn--primary btn--lg" id="btn-begin-assessment">Begin Secure Assessment</button>
        </div>
      </div>
    `}function Ao(e,t,s){if(P({onBack:()=>e("/assessments")}),!J){const a=document.getElementById("btn-begin-assessment");a&&a.addEventListener("click",async()=>{await ko(t)});return}So(e),document.querySelectorAll(".assessment-option").forEach(a=>{a.addEventListener("click",i=>{const o=i.currentTarget.dataset.questionId,r=Number.parseInt(i.currentTarget.dataset.optionIndex,10),d=G.get(o)||{questionId:o,type:"mcq",selectedIndex:null};G.set(o,{...d,selectedIndex:r}),document.querySelectorAll(`.assessment-option[data-question-id="${o}"]`).forEach(c=>{c.classList.toggle("option-btn--selected",Number.parseInt(c.dataset.optionIndex,10)===r)})})}),document.querySelectorAll(".assessment-response").forEach(a=>{a.addEventListener("input",i=>{const o=i.currentTarget.dataset.questionId,r=k.questions.find(d=>d.id===o);r&&(G.set(o,{questionId:o,type:r.type,responseText:i.currentTarget.value}),M==null||M.trackTextEntry(o,i.currentTarget.value))})});const n=document.getElementById("assessment-session-form");n&&n.addEventListener("submit",async a=>{a.preventDefault(),await ps(e)})}function ne(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Co(e){const t=T(),s=await fe(),n=await ve(),a=s.find(o=>o.id===Number.parseInt(e,10)),i=n.find(o=>o.id===(a==null?void 0:a.assessmentId));return!a||!i?'<div class="container" style="padding: 2rem;">Assessment result not found.</div>':`
    ${B({title:"Assessment Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Assessments"})}
    <div class="container container--narrow view-enter assessment-results-page">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <div class="assessment-hero__eyebrow">Assessment complete</div>
        <h1 class="assessment-hero__title">${i.title}</h1>
        <p class="assessment-hero__text">Your open responses were graded against rubrics, then reviewed for integrity and browser behavior.</p>
      </div>

      ${Ut(a.grading.totalScore,a.grading.maxScore)}

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Percentage</span>
          <span class="quiz-result-metric__value">${a.grading.percentage}%</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">AI / Style Risk</span>
          <span class="quiz-result-metric__value">${a.integrity.label} (${a.integrity.score})</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Proctoring</span>
          <span class="quiz-result-metric__value">${a.proctor.label} (${a.proctor.anomalyScore})</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Advanced feature: auto remediation plan</div>
        <h3 class="results-next-step__title">What to improve next</h3>
        <div class="assessment-remediation-list">
          ${a.grading.remediationPlan.length>0?a.grading.remediationPlan.map(o=>`
            <div class="assessment-remediation-item">
              <div class="assessment-remediation-item__title">Lesson ${o.lessonId}</div>
              <div class="assessment-remediation-item__objective">${ne(o.objective)}</div>
              <div class="assessment-remediation-item__action">${ne(o.action)}</div>
            </div>
          `).join(""):'<div class="insight-empty">No urgent remediation tasks were created for this submission.</div>'}
        </div>
      </div>

      <div class="assessment-results-grid">
        <div class="card">
          <h3 class="diagnostic-section__title">Integrity Review</h3>
          <p class="diagnostic-section__subtitle">${a.integrity.reasons.join(" | ")}</p>
          <div class="assessment-integrity-metrics">
            <span class="badge badge--neutral">Lexical diversity ${a.integrity.metrics.lexicalDiversity}</span>
            <span class="badge badge--neutral">Perplexity proxy ${a.integrity.metrics.perplexityProxy}</span>
            <span class="badge badge--neutral">Similarity ${a.integrity.metrics.internalSimilarity}</span>
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Proctoring Summary</h3>
          <p class="diagnostic-section__subtitle">Browser events logged during this attempt.</p>
          <div class="assessment-integrity-metrics">
            <span class="badge badge--neutral">Hidden tabs ${a.proctor.counts["tab-hidden"]||0}</span>
            <span class="badge badge--neutral">Fullscreen exits ${a.proctor.counts["fullscreen-exit"]||0}</span>
            <span class="badge badge--neutral">Paste attempts ${a.proctor.counts["paste-attempt"]||0}</span>
            <span class="badge badge--neutral">Blocked shortcuts ${a.proctor.counts["blocked-shortcut"]||0}</span>
          </div>
        </div>
      </div>

      <div class="results-review">
        <h3 class="results-review__title">Question Feedback</h3>
        ${a.grading.questionScores.map((o,r)=>{var d;return`
          <div class="review-item ${o.normalizedScore>=.6?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__question">${r+1}. ${ne(o.prompt)}</div>
            <div class="review-item__meta">
              <span>${o.type}</span>
              <span>${o.score}/${o.maxScore} points</span>
              <span>${o.gradingSource==="ai"?"AI graded":o.gradingSource==="fallback"?"Rubric fallback":"Auto graded"}</span>
            </div>
            <div class="review-item__answer">
              <div>${ne(o.feedback)}</div>
            </div>
            ${(d=o.rubricBreakdown)!=null&&d.length?`
              <div class="assessment-rubric-breakdown">
                ${o.rubricBreakdown.map(c=>`
                  <div class="assessment-rubric-breakdown__item">
                    <strong>${ne(c.criterion)}:</strong> ${c.score}/${c.maxScore} - ${ne(c.evidence||"")}
                  </div>
                `).join("")}
              </div>
            `:""}
          </div>
        `}).join("")}
      </div>

      <div class="quiz-results__actions">
        <button class="btn btn--primary btn--lg" id="btn-back-to-center">Back to Assessment Center</button>
        <button class="btn btn--ghost" id="btn-retake-assessment">Retake Assessment</button>
      </div>
    </div>
  `}function To(e,t){P({onBack:()=>e("/assessments")});const s=document.getElementById("btn-back-to-center"),n=document.getElementById("btn-retake-assessment");fe().then(a=>{const i=a.find(o=>o.id===Number.parseInt(t,10));i&&(s&&s.addEventListener("click",()=>e("/assessments")),n&&n.addEventListener("click",()=>e(`/assessment/${i.assessmentId}`)))})}let S=window.location.pathname;const Oe=document.getElementById("app");async function q(e,t=!0){t&&e!==window.location.pathname&&window.history.pushState({},"",e),S=e,await Z()}window.addEventListener("popstate",()=>{S=window.location.pathname,Z()});function Lo(e){return e==="/lessons"||e==="/diagnostic"||e==="/assessments"||e.startsWith("/diagnostic-results/")||e.startsWith("/assessment/")||e.startsWith("/assessment-results/")||e.startsWith("/lesson/")||e.startsWith("/quiz/")||e.startsWith("/quiz-results/")||e==="/tutor"}async function Z(){S==="/dashboard"&&!mt()&&(S="/teacher-login",window.history.replaceState({},"","/teacher-login")),S==="/assessment-lab"&&!mt()&&(S="/teacher-login",window.history.replaceState({},"","/teacher-login")),Lo(S)&&!T()&&(S="/student-login",window.history.replaceState({},"","/student-login"));const e=document.getElementById("app-loader");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),1e3)),S.startsWith("/quiz/")||Yn(),S!=="/diagnostic"&&es(),S.startsWith("/assessment/")||Io(),Oe.firstElementChild&&(Oe.firstElementChild.classList.add("view-exit"),await new Promise(n=>setTimeout(n,200)));let t="",s=()=>{};if(S==="/"||S==="/index.html")t=nn(),s=()=>an(q);else if(S==="/student-login")t=await ln(),s=()=>un(q);else if(S==="/teacher-login")t=pn(),s=()=>mn(q);else if(S==="/lessons")t=await $n(),s=()=>An(q);else if(S==="/assessments")t=await eo(),s=()=>to(q);else if(S==="/diagnostic")ba(),t=ya(),s=()=>wa(q,Z);else if(S.startsWith("/diagnostic-results/")){const n=S.split("/")[2];t=await La(n),s=()=>Da(q,n)}else if(S.startsWith("/lesson/")){const n=Number.parseInt(S.split("/")[2],10);t=await Cn(n),s=()=>Tn(q,n)}else if(S.startsWith("/quiz/")){const n=Number.parseInt(S.split("/")[2],10);Kn(n),t=Jn(),s=()=>Vn(q,Z,n)}else if(S.startsWith("/quiz-results/")){const n=S.split("/")[2];t=await Xn(n),s=()=>ea(q,n)}else if(S.startsWith("/assessment-results/")){const n=S.split("/")[2];t=await Co(n),s=()=>To(q,n)}else if(S.startsWith("/assessment/")){const n=Number.parseInt(S.split("/")[2],10);await _o(n),t=$o(),s=()=>Ao(q,Z)}else if(S==="/tutor")t=await Pa(),s=()=>Ra(q,Z);else if(S==="/assessment-lab")t=await Za(),s=()=>Xa(q);else if(S==="/dashboard")t=await ra(),s=()=>ca(q);else{q("/",!1);return}Oe.innerHTML=t,setTimeout(s,0),window.scrollTo(0,0)}window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).has("capture")?0:1500;setTimeout(async()=>{await Ds(),tn(),Z()},t)});
