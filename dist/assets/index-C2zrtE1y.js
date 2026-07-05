(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=s(o);fetch(o.href,a)}})();const fe=(e,t)=>t.some(s=>e instanceof s);let Le,Ce;function yt(){return Le||(Le=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function bt(){return Ce||(Ce=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ye=new WeakMap,ue=new WeakMap,re=new WeakMap;function wt(e){const t=new Promise((s,n)=>{const o=()=>{e.removeEventListener("success",a),e.removeEventListener("error",i)},a=()=>{s(F(e.result)),o()},i=()=>{n(e.error),o()};e.addEventListener("success",a),e.addEventListener("error",i)});return re.set(t,e),t}function _t(e){if(ye.has(e))return;const t=new Promise((s,n)=>{const o=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",i),e.removeEventListener("abort",i)},a=()=>{s(),o()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",a),e.addEventListener("error",i),e.addEventListener("abort",i)});ye.set(e,t)}let be={get(e,t,s){if(e instanceof IDBTransaction){if(t==="done")return ye.get(e);if(t==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return F(e[t])},set(e,t,s){return e[t]=s,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function He(e){be=e(be)}function It(e){return bt().includes(e)?function(...t){return e.apply(we(this),t),F(this.request)}:function(...t){return F(e.apply(we(this),t))}}function kt(e){return typeof e=="function"?It(e):(e instanceof IDBTransaction&&_t(e),fe(e,yt())?new Proxy(e,be):e)}function F(e){if(e instanceof IDBRequest)return wt(e);if(ue.has(e))return ue.get(e);const t=kt(e);return t!==e&&(ue.set(e,t),re.set(t,e)),t}const we=e=>re.get(e);function xt(e,t,{blocked:s,upgrade:n,blocking:o,terminated:a}={}){const i=indexedDB.open(e,t),r=F(i);return n&&i.addEventListener("upgradeneeded",c=>{n(F(i.result),c.oldVersion,c.newVersion,F(i.transaction),c)}),s&&i.addEventListener("blocked",c=>s(c.oldVersion,c.newVersion,c)),r.then(c=>{a&&c.addEventListener("close",()=>a()),o&&c.addEventListener("versionchange",d=>o(d.oldVersion,d.newVersion,d))}).catch(()=>{}),r}const $t=["get","getKey","getAll","getAllKeys","count"],St=["put","add","delete","clear"],pe=new Map;function Me(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(pe.get(t))return pe.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,o=St.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!(o||$t.includes(s)))return;const a=async function(i,...r){const c=this.transaction(i,o?"readwrite":"readonly");let d=c.store;return n&&(d=d.index(r.shift())),(await Promise.all([d[s](...r),o&&c.done]))[0]};return pe.set(t,a),a}He(e=>({...e,get:(t,s,n)=>Me(t,s)||e.get(t,s,n),has:(t,s)=>!!Me(t,s)||e.has(t,s)}));const At=["continue","continuePrimaryKey","advance"],Be={},_e=new WeakMap,Ge=new WeakMap,Tt={get(e,t){if(!At.includes(t))return e[t];let s=Be[t];return s||(s=Be[t]=function(...n){_e.set(this,Ge.get(this)[t](...n))}),s}};async function*Dt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const s=new Proxy(t,Tt);for(Ge.set(s,t),re.set(s,we(t));t;)yield s,t=await(_e.get(s)||t.continue()),_e.delete(s)}function Ee(e,t){return t===Symbol.asyncIterator&&fe(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&fe(e,[IDBIndex,IDBObjectStore])}He(e=>({...e,get(t,s,n){return Ee(t,s)?Dt:e.get(t,s,n)},has(t,s){return Ee(t,s)||e.has(t,s)}}));const Lt="classconnect",Ct=3,oe="settings",ie="cc_teacherAuthenticated",We="cc_currentStudent",Mt=["apiKey","teacherPin","theme"];let me=null;function Bt(e){if(e.objectStoreNames.contains("students")||e.createObjectStore("students",{keyPath:"id",autoIncrement:!0}).createIndex("name","name",{unique:!1}),e.objectStoreNames.contains("progress")||e.createObjectStore("progress",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),!e.objectStoreNames.contains("quizResults")){const t=e.createObjectStore("quizResults",{keyPath:"id",autoIncrement:!0});t.createIndex("studentId","studentId",{unique:!1}),t.createIndex("lessonId","lessonId",{unique:!1})}e.objectStoreNames.contains("diagnostics")||e.createObjectStore("diagnostics",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),e.objectStoreNames.contains("tutorThreads")||e.createObjectStore("tutorThreads",{keyPath:"studentId"}),e.objectStoreNames.contains(oe)||e.createObjectStore(oe,{keyPath:"key"})}function T(){return me||(me=xt(Lt,Ct,{upgrade(e){Bt(e)}})),me}function Ye(e){try{return localStorage.getItem(`cc_${e}`)}catch{return null}}function xe(e,t){try{if(t==null||t===""){localStorage.removeItem(`cc_${e}`);return}localStorage.setItem(`cc_${e}`,t)}catch{}}async function $e(e,t){await(await T()).put(oe,{key:e,value:t,updatedAt:new Date().toISOString()})}async function Et(){const e=await T();await Promise.all(Mt.map(async t=>{const s=await e.get(oe,t);if(s!=null&&s.value){xe(t,s.value);return}const n=Ye(t);n&&await $e(t,n)}))}function Se(e){return Ye(e)}function Rt(e,t){xe(e,t),$e(e,t)}async function Ke(e,t){xe(e,t),await $e(e,t)}function ce(){return Se("apiKey")}async function Ve(e){await Ke("apiKey",e)}function Ae(){return Se("teacherPin")}async function Je(e){await Ke("teacherPin",e)}async function zt(e,t){const s=await T(),n=await Pt(e,t);if(n)return n;const o=new Date().toISOString();return{id:await s.add("students",{name:e.trim(),pin:t,createdAt:o}),name:e.trim(),pin:t,createdAt:o}}async function Pt(e,t){return(await(await T()).getAllFromIndex("students","name",e.trim())).find(o=>o.pin===t)||null}async function de(){return(await T()).getAll("students")}async function qt(e,t){const s=await T(),o=(await z(e)).find(r=>r.lessonId===t);if(o)return o;const a=new Date().toISOString();return{id:await s.add("progress",{studentId:e,lessonId:t,completedAt:a}),studentId:e,lessonId:t,completedAt:a}}async function z(e){return(await T()).getAllFromIndex("progress","studentId",e)}async function Ze(){return(await T()).getAll("progress")}async function Qt(e,t){return(await z(e)).some(n=>n.lessonId===t)}async function Nt(e){const t=await T(),s=new Date().toISOString(),n={...e,completedAt:s},o=await t.add("quizResults",n);return{...n,id:o}}async function U(e){return(await T()).getAllFromIndex("quizResults","studentId",e)}async function X(){return(await T()).getAll("quizResults")}async function Ot(e){const t=await T(),s=new Date().toISOString(),n={...e,completedAt:s},o=await t.add("diagnostics",n);return{...n,id:o}}async function Xe(e){return(await T()).get("diagnostics",e)}async function jt(e){return(await T()).getAllFromIndex("diagnostics","studentId",e)}async function N(e){return(await jt(e)).slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt))[0]||null}async function et(){return(await T()).getAll("diagnostics")}async function Ft(e){return(await T()).get("tutorThreads",e)}async function Re(e,t){const s=await T(),n={studentId:e,messages:t.slice(-20),updatedAt:new Date().toISOString()};return await s.put("tutorThreads",n),n}async function Ut(e){await(await T()).delete("tutorThreads",e)}function Ht(e){sessionStorage.setItem(We,JSON.stringify(e))}function L(){try{const e=sessionStorage.getItem(We);return e?JSON.parse(e):null}catch{return null}}function ze(e=!0){if(!e){sessionStorage.removeItem(ie);return}sessionStorage.setItem(ie,JSON.stringify({authenticated:!0,updatedAt:new Date().toISOString()}))}function Gt(){var e;try{const t=sessionStorage.getItem(ie);return!!(t&&((e=JSON.parse(t))!=null&&e.authenticated))}catch{return!1}}function Wt(){sessionStorage.removeItem(ie)}async function Yt(){var n;const e=await de(),t=await X();let s=`Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)
`;for(const o of t){const a=e.find(c=>c.id===o.studentId),i=a?a.name:"Unknown",r=Math.round((o.totalTimeMs||0)/1e3);s+=`"${i}",${o.lessonId},${o.score},${o.totalQuestions},${((n=o.theta)==null?void 0:n.toFixed(2))||"N/A"},${o.level||"N/A"},"${o.completedAt}",${r}
`}return s}function Kt(e,t="classconnect_data.csv"){const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(s),o=document.createElement("a");o.href=n,o.download=t,o.click(),URL.revokeObjectURL(n)}const Vt="dark";function tt(e){return e==="light"?"light":Vt}function Te(){return tt(Se("theme"))}function st(e){const t=tt(e);return document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t,t}function Jt(e){const t=st(e);return Rt("theme",t),t}function Zt(){return Jt(Te()==="dark"?"light":"dark")}function Xt(){return st(Te())}function nt(e){return e==="light"?`
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `:`
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `}function es(){const e=Te(),t=e==="dark"?"light":"dark";return`
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${t} theme" title="Switch to ${t} theme">
      ${nt(e)}
    </button>
  `}function B(e={}){const{title:t="ClassConnect",showBack:s=!1,backLabel:n="Back",studentName:o=null,showSettings:a=!1,showLogout:i=!1,logoutLabel:r="Sign out",showThemeToggle:c=!0}=e;return`
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
            ${o?`
              <span class="nav__student-name">
                <span class="nav__student-icon">Student</span>
                ${o}
              </span>
            `:""}
            <span class="nav__status" id="nav-status">
              <span class="status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}" id="status-dot"></span>
              <span class="nav__status-text" id="status-text">${navigator.onLine?"Online":"Offline"}</span>
            </span>
            <div class="nav__toolbar">
              ${c?es():""}
              ${a?`
                <button class="btn btn--icon btn--ghost nav__settings-btn" id="nav-settings-btn" aria-label="Settings">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M16.5 10a6.5 6.5 0 01-.4 2.2l1.7 1.3-1.5 2.6-2-.6a6.5 6.5 0 01-3.8 2.2L10 20l-10.5-.3L9 17.7a6.5 6.5 0 01-3.8-2.2l-2 .6L1.7 13.5l1.7-1.3A6.5 6.5 0 013 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              `:""}
              ${i?`
                <button class="btn btn--ghost nav__logout-btn" id="nav-logout-btn" aria-label="${r}">
                  ${r}
                </button>
              `:""}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `}function P(e={}){const{onBack:t=null,onSettings:s=null,onBrand:n=null,onLogout:o=null}=e,a=document.getElementById("nav-back-btn");a&&t&&a.addEventListener("click",t);const i=document.getElementById("nav-settings-btn");i&&s&&i.addEventListener("click",s);const r=document.getElementById("nav-logout-btn");r&&o&&r.addEventListener("click",o);const c=document.getElementById("nav-theme-btn");c&&c.addEventListener("click",()=>{const h=Zt(),m=h==="dark"?"light":"dark";c.innerHTML=nt(h),c.setAttribute("aria-label",`Switch to ${m} theme`),c.setAttribute("title",`Switch to ${m} theme`)});const d=document.getElementById("nav-brand");d&&n&&(d.addEventListener("click",n),d.style.cursor="pointer");const u=()=>{const h=document.getElementById("status-dot"),m=document.getElementById("status-text");h&&(h.className=`status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}`),m&&(m.textContent=navigator.onLine?"Online":"Offline")};window.addEventListener("online",u),window.addEventListener("offline",u)}function ts(){return`
    ${B({title:"ClassConnect"})}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-12); padding-bottom: var(--space-12);">
      <div style="text-align: center; margin-bottom: var(--space-10);">
        <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); background: linear-gradient(135deg, var(--color-primary-400), var(--color-accent-400)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: var(--font-weight-extrabold);">
          Welcome to ClassConnect
        </h1>
        <p style="color: var(--text-secondary); font-size: var(--font-size-lg);">
          Learn Computing with diagnostics, adaptive paths, an AI tutor, and live progress tracking.
        </p>
      </div>

      <div style="display: grid; gap: var(--space-6);">
        <button class="card card--glass card--interactive card--glow" id="btn-student" style="text-align: left; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">Student</div>
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2); color: var(--color-primary-300);">I am a Student</h2>
          <p style="color: var(--text-secondary);">Start with a diagnostic, follow a personalized lesson path, and ask the AI tutor for help.</p>
        </button>

        <button class="card card--glass card--interactive card--glow" id="btn-teacher" style="text-align: left; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">Teacher</div>
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2); color: var(--color-accent-300);">I am a Teacher</h2>
          <p style="color: var(--text-secondary);">View risk predictions, misconceptions, diagnostic coverage, and intervention-ready analytics.</p>
        </button>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function ss(e){P(),document.getElementById("btn-student").addEventListener("click",()=>{e("/student-login")}),document.getElementById("btn-teacher").addEventListener("click",()=>{e("/teacher-login")})}function le(e,t,s=""){const n=t>0?Math.round(e/t*100):0;return`
    <div class="progress-container" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100">
      ${s?`<div class="progress-label">${s}</div>`:""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${n}%"></div>
      </div>
      <div class="progress-text">${n}%</div>
    </div>
  `}function ot(e){const t=["A","B","C","D"];return`
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
  `}function ns(e){return e==="ai"?'<span class="badge badge--primary">AI Feedback</span>':e==="fallback"?'<span class="badge badge--neutral">Offline Hint</span>':'<span class="badge badge--success">Quick Check</span>'}function it(e,t){return`
    <div class="card feedback-card ${t?"feedback-card--correct":"feedback-card--incorrect"}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${t?"Correct":"Review"}</span>
        <span class="feedback-card__title">${t?"Correct!":"Let's learn from this"}</span>
        ${ns(e.source)}
      </div>
      <div class="feedback-card__body">
        ${e.text}
      </div>
      ${e.source==="ai"?'<div class="feedback-card__source">Powered by Gemini AI</div>':""}
    </div>
  `}function Y(e,t,s,n="primary",o=""){return`
    <div class="card stat-card stat-card--${n}">
      <div class="stat-card__icon">${e}</div>
      <div class="stat-card__value">${t}</div>
      <div class="stat-card__label">${s}</div>
      ${o?`<div class="stat-card__detail">${o}</div>`:""}
    </div>
  `}let K=null;function R(e,t="info",s=3e3){K||(K=document.createElement("div"),K.className="toast-container",document.body.appendChild(K));const n={success:"OK",error:"X",info:"i"},o=document.createElement("div");o.className=`toast toast--${t}`,o.innerHTML=`<span>${n[t]||""}</span> ${e}`,K.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100%)",o.style.transition="all 0.3s ease-out",setTimeout(()=>o.remove(),300)},s)}function os(e,t){const s=t>0?e/t:0,n=2*Math.PI*45,o=n*(1-s);let a="#FB7185";return s>=.8?a="#34D399":s>=.6?a="#818CF8":s>=.4&&(a="#FBBF24"),`
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"/>
        <circle class="ring-fill" cx="50" cy="50" r="45"
          stroke="${a}"
          stroke-dasharray="${n}"
          stroke-dashoffset="${o}"
          style="animation: ringDraw 1.5s ease-out forwards;"
        />
      </svg>
      <div class="quiz-results__score-label">
        <div class="quiz-results__score-value" style="color: ${a}">${e}</div>
        <div class="quiz-results__score-total">out of ${t}</div>
      </div>
    </div>
  `}function at(e,t,s=[],n={}){const o=document.createElement("div");o.className="modal-overlay",o.id="modal-overlay";const a=n.modalClass?` ${n.modalClass}`:"";return o.innerHTML=`
    <div class="modal${a}">
      <h3 class="modal__title">${e}</h3>
      <div class="modal__body">${t}</div>
      <div class="modal__actions" id="modal-actions">
        ${s.map((i,r)=>`
          <button class="btn ${i.variant||"btn--ghost"}" id="modal-action-${r}">${i.label}</button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(o),s.forEach((i,r)=>{const c=document.getElementById(`modal-action-${r}`);c&&c.addEventListener("click",async()=>{let d=!0;i.onClick&&(d=await i.onClick(o)!==!1),d&&o.remove()})}),o.addEventListener("click",i=>{i.target===o&&o.remove()}),o}async function is(){const e=await de();return`
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
  `}function as(e){P({onBack:()=>e("/")});const t=document.getElementById("login-form"),s=document.getElementById("student-name"),n=document.getElementById("student-pin");t.addEventListener("submit",async o=>{o.preventDefault();const a=s.value.trim(),i=n.value;if(!a||i.length!==4){R("Please enter your name and a 4-digit PIN.","error");return}try{const r=await zt(a,i);Ht(r);const c=await N(r.id);e(c?"/lessons":"/diagnostic")}catch(r){console.error(r),R("Login failed. Please try again.","error")}}),document.querySelectorAll(".student-quick-select").forEach(o=>{o.addEventListener("click",a=>{s.value=a.target.dataset.name,n.focus()})})}function rs(){const t=!Ae();return`
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
              <input type="password" id="teacher-api-key" class="input" value="${ce()||""}" placeholder="AIzaSy...">
            </div>
          `:""}

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${t?"Save PIN and Open Dashboard":"Open Dashboard"}
          </button>
        </form>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function cs(e){P({onBack:()=>e("/")});const t=Ae(),s=!t,n=document.getElementById("teacher-access-form"),o=document.getElementById("teacher-pin"),a=document.getElementById("teacher-pin-confirm"),i=document.getElementById("teacher-api-key");n.addEventListener("submit",async r=>{r.preventDefault();const c=o.value.trim();if(!/^\d{4}$/.test(c)){R("Enter a valid 4-digit teacher PIN.","error");return}if(s){const d=a==null?void 0:a.value.trim();if(c!==d){R("Teacher PINs do not match yet.","error");return}try{await Je(c),i!=null&&i.value.trim()&&await Ve(i.value.trim()),ze(!0),R("Teacher access saved for this device.","success"),e("/dashboard")}catch(u){console.error(u),R("Unable to save teacher access right now.","error")}return}if(c!==t){R("That teacher PIN is not correct.","error");return}ze(!0),e("/dashboard")})}const $=[{id:1,title:"What Is a Computer?",duration:"10 min",objectives:["Define what a computer is and explain its basic purpose","Identify different types of computers used today","Understand how computers have evolved through generations"],keyTerms:[{word:"Computer",definition:"An electronic device that accepts data (input), processes it, and produces useful information (output)."},{word:"Data",definition:"Raw facts and figures that have not yet been processed — such as numbers, words, or images."},{word:"Information",definition:"Data that has been processed and organized so it is meaningful and useful."},{word:"Hardware",definition:"The physical parts of a computer that you can see and touch."},{word:"Software",definition:"Programs and instructions that tell the computer what to do."}],content:`
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
    `}],ds={1:{src:"/images/lesson-1-computer-types.png",alt:"Illustration of a desktop computer, laptop, tablet, smartphone, and server tower",caption:"Different types of computers suit different jobs, but they all accept data, process it, and give useful results."},2:{src:"/images/lesson-2-inside-computer.png",alt:"Illustration of a desktop tower opened to show the motherboard, CPU, RAM, storage drive, and power supply",caption:"Internal hardware works together through the motherboard so the CPU, memory, storage, and power system can do their jobs."},3:{src:"/images/lesson-3-input-devices.png",alt:"Illustration collage of a keyboard, mouse, touchscreen tablet, microphone, scanner, and webcam",caption:"Input devices help students send text, sound, touch, and images into a computer."},4:{src:"/images/lesson-4-output-devices.png",alt:"Illustration collage of a monitor, printer, speakers, projector, and plotter",caption:"Output devices help the computer present information as visuals, sound, or printed work."},5:{src:"/images/lesson-5-storage-devices.png",alt:"Illustration comparing a hard drive, solid state drive, flash drive, SD card, optical disc, and cloud storage symbol",caption:"Storage devices keep schoolwork, software, and media safe so learners can use them again later."}};function rt(e,t=0,s=1){return Math.max(t,Math.min(s,e))}function De(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function ls(e){return Math.round(rt(e)*100)}function ct(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return new Map(t.map(s=>[s.lessonId,s]))}function us(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).forEach(s=>{t.has(s.lessonId)||t.set(s.lessonId,s)}),t}function ps(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).slice(0,3).forEach(s=>{var o;const n=((o=s.responses)==null?void 0:o.filter(a=>!a.correct).length)||0;t.set(s.lessonId,(t.get(s.lessonId)||0)+n)}),t}function ms(e){return e>=.8?"mastered":e>=.6?"growing":e>=.4?"review":"urgent"}function hs(e){const t=De(e.map(n=>n.mastery)),s=e.filter(n=>n.status==="urgent").length;return t>=.75&&s===0?{label:"Ready to Accelerate",tone:"success",description:"You have strong foundations across the strand. Push into harder quizzes and extension practice."}:t>=.55?{label:"Foundations Growing",tone:"accent",description:"You are building confidence. Focus on the weakest topics first, then continue the recommended path."}:{label:"Needs Guided Support",tone:"danger",description:"Your learning path should begin with a few targeted reviews before moving ahead."}}function gs(e,t,s){const n=ps(t),o=ct(s);return e.map(i=>{const r=o.get(i.lessonId),c=n.get(i.lessonId)||0,d=[];let u=0;return r&&r.accuracy<.5&&(d.push("low diagnostic readiness"),u+=25),i.latestQuizScore!==null&&i.latestQuizScore<.6&&(d.push("recent quiz performance dropped"),u+=20),c>0&&(d.push(`${c} recent missed question${c===1?"":"s"}`),u+=c*6),i.completed||(u+=8),!d.length&&i.mastery>=.65?null:{lessonId:i.lessonId,title:i.title,priority:u,reason:d.length?d.join(", "):"This topic will benefit from one more focused review.",action:`Revisit ${i.title}, then use the AI Tutor before retaking the quiz.`}}).filter(Boolean).sort((i,r)=>r.priority-i.priority).slice(0,4)}function vs(e){const t=e.filter(i=>!i.completed&&i.status==="urgent").sort((i,r)=>i.lessonId-r.lessonId),s=e.filter(i=>!i.completed&&i.status==="review").sort((i,r)=>i.lessonId-r.lessonId),n=e.filter(i=>!i.completed&&(i.status==="growing"||i.status==="mastered")).sort((i,r)=>i.lessonId-r.lessonId),o=e.filter(i=>i.completed&&(i.status==="urgent"||i.status==="review")).sort((i,r)=>i.mastery-r.mastery||i.lessonId-r.lessonId),a=e.filter(i=>i.completed&&(i.status==="growing"||i.status==="mastered")).sort((i,r)=>i.lessonId-r.lessonId);return[...t,...s,...n,...o,...a]}function fs(e,t=[],s=null){var d,u;const n=t.slice().sort((h,m)=>new Date(m.completedAt)-new Date(h.completedAt)),o=n[0]||null,a=n.length>0?De(n.map(h=>h.score/h.totalQuestions)):null;let i=0;const r=[];if(s||(i+=10,r.push("no diagnostic profile yet")),e.completionRate<40&&(i+=15,r.push("low lesson completion")),e.knowledgeGaps.length>=3&&(i+=20,r.push("several knowledge gaps remain open")),o){const h=o.score/o.totalQuestions;h<.5?(i+=25,r.push("latest quiz score below 50%")):h<.65&&(i+=12,r.push("latest quiz score needs support")),o.theta<-.75?(i+=25,r.push("ability estimate is trending low")):o.theta<-.25&&(i+=12,r.push("ability estimate suggests review"))}a!==null&&a<.6&&n.length>=2&&(i+=10,r.push("recent quiz trend is still below target"));const c=Math.min(100,i);return c>=60?{score:c,label:"High",badge:"danger",reasons:r,action:`Teacher check-in recommended. Start with ${((d=e.recommendedNext)==null?void 0:d.title)||"the weakest topic"} and review the revision queue.`}:c>=35?{score:c,label:"Moderate",badge:"warning",reasons:r,action:`Guide the learner through ${((u=e.recommendedNext)==null?void 0:u.title)||"the next recommended lesson"} and schedule a tutor session.`}:{score:c,label:"Low",badge:"success",reasons:r.length?r:["steady progress across current evidence"],action:"Keep the learner on the personalized path and use the tutor for stretch support."}}function q({diagnostic:e=null,results:t=[],progressRecords:s=[]}={}){const n=new Set(s.map(y=>y.lessonId)),o=ct(e),a=us(t),i=$.map(y=>{const g=o.get(y.id),v=t.filter(H=>H.lessonId===y.id).sort((H,ft)=>new Date(ft.completedAt)-new Date(H.completedAt)),l=a.get(y.id)||null,b=l?l.score/l.totalQuestions:null,p=v.length?De(v.map(H=>H.score/H.totalQuestions)):null,f=g?g.accuracy:null,_=n.has(y.id);let k=0,D=0;f!==null&&(k+=f*.35,D+=.35),b!==null&&(k+=b*.45,D+=.45),p!==null&&v.length>1&&(k+=p*.1,D+=.1),_&&(k+=.1,D+=.1);let Q=D>0?k/D:.2;_&&D===0&&(Q=.55),Q=rt(Q);const vt=ms(Q);let te="Continue building momentum on this topic.";return g&&g.accuracy<.5?te="The diagnostic found this topic needs early attention.":b!==null&&b<.6?te="Recent quiz results suggest a focused review here.":_||(te="This topic is ready to learn next in your path."),{lessonId:y.id,title:y.title,completed:_,mastery:Q,masteryPercent:ls(Q),status:vt,diagnosticScore:f,latestQuizScore:b,latestTheta:(l==null?void 0:l.theta)??null,attempts:v.length,recommendedFocus:te}}),r=vs(i),c=i.filter(y=>y.status==="urgent"||y.status==="review").sort((y,g)=>y.mastery-g.mastery).slice(0,3),d=i.filter(y=>y.status==="mastered"||y.status==="growing").sort((y,g)=>g.mastery-y.mastery).slice(0,3),u=gs(i,t,e),h=hs(i),m=$.length>0?Math.round(n.size/$.length*100):0,w={lessonProfiles:i,recommendedSequence:r,recommendedNext:r.find(y=>!y.completed)||r[0]||null,knowledgeGaps:c,strengths:d,revisionQueue:u,readiness:h,completionRate:m,completedCount:n.size};return w.risk=fs(w,t,e),w}function ys(e,t){var s,n,o,a;return`
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
          <div class="learning-hub__panel-value">${((o=e.knowledgeGaps[0])==null?void 0:o.title)||"Keep building across all lessons"}</div>
          <div class="learning-hub__panel-meta">${((a=e.revisionQueue[0])==null?void 0:a.reason)||"Your current evidence is looking steady."}</div>
        </div>
      </div>

      <div class="learning-hub__actions">
        <button class="btn btn--primary" id="btn-open-path">Start Recommended Lesson</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-open-diagnostic">${t?"Retake Diagnostic":"Take Diagnostic"}</button>
      </div>
    </div>
  `}function bs(e){return e.revisionQueue.length?`
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
  `:""}function ws(e){return`
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
  `}async function _s(){const e=L(),t=e?await z(e.id):[],s=new Set(t.map(i=>i.lessonId)),n=e?await U(e.id):[],o=e?await N(e.id):null,a=q({diagnostic:o,results:n,progressRecords:t});return`
    ${B({title:"Topics",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${ys(a,!!o)}
      ${bs(a)}
      ${ws(a)}
      ${le(s.size,$.length,"Lessons completed")}

      <div class="lesson-list">
        ${$.map((i,r)=>{var m;const c=s.has(i.id),d=a.lessonProfiles.find(w=>w.lessonId===i.id),u=((m=a.recommendedNext)==null?void 0:m.lessonId)===i.id,h=a.knowledgeGaps.some(w=>w.lessonId===i.id);return`
            <div class="card card--interactive lesson-card" data-id="${i.id}">
              <div class="lesson-card__number ${c?"lesson-card__number--completed":""}">
                ${c?"Done":r+1}
              </div>
              <div class="lesson-card__info">
                <div class="lesson-card__title">${i.title}</div>
                <div class="lesson-card__meta">
                  <span>${i.duration}</span>
                  <span>${i.objectives.length} objectives</span>
                  <span>${(d==null?void 0:d.masteryPercent)||0}% mastery</span>
                </div>
                <div class="lesson-card__badges">
                  ${u?'<span class="badge badge--primary">Recommended next</span>':""}
                  ${h?'<span class="badge badge--warning">Focus</span>':""}
                </div>
              </div>
              <div class="lesson-card__status">
                ${c?'<span class="badge badge--success">Completed</span>':'<span class="badge badge--neutral">Start</span>'}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function Is(e){P({onBack:()=>e("/")});const t=document.getElementById("btn-open-path");t&&t.addEventListener("click",async()=>{var d;const o=L(),a=o?await z(o.id):[],i=o?await N(o.id):null,r=o?await U(o.id):[],c=q({diagnostic:i,results:r,progressRecords:a});e(`/lesson/${((d=c.recommendedNext)==null?void 0:d.lessonId)||1}`)});const s=document.getElementById("btn-open-tutor");s&&s.addEventListener("click",()=>e("/tutor"));const n=document.getElementById("btn-open-diagnostic");n&&n.addEventListener("click",()=>e("/diagnostic")),document.querySelectorAll(".revision-queue__item, .adaptive-preview__item").forEach(o=>{o.addEventListener("click",a=>{const i=Number.parseInt(a.currentTarget.dataset.lessonId,10);e(`/lesson/${i}`)})}),document.querySelectorAll(".lesson-card").forEach(o=>{o.addEventListener("click",a=>{const i=Number.parseInt(a.currentTarget.dataset.id,10);e(`/lesson/${i}`)})})}async function ks(e){var h;const t=L(),s=$.find(m=>m.id===e);if(!s)return'<div class="container" style="padding: 2rem;">Lesson not found.</div>';const n=$.indexOf(s),o=t?await Qt(t.id,e):!1,a=ds[e],i=t?await z(t.id):[],r=t?await U(t.id):[],c=t?await N(t.id):null,u=q({diagnostic:c,results:r,progressRecords:i}).lessonProfiles.find(m=>m.lessonId===e);return`
    ${B({title:"Lesson",showBack:!0,studentName:t==null?void 0:t.name})}

    <div class="container container--narrow view-enter lesson-page">
      ${le(n+1,$.length,`Lesson ${n+1} of ${$.length}`)}
      <div class="lesson-progress-strip">
        ${$.map((m,w)=>`
          <div class="lesson-progress-pip ${w===n?"lesson-progress-pip--current":""} ${w<n?"lesson-progress-pip--completed":""}"></div>
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
          ${s.objectives.map(m=>`
            <div class="lesson-header__objective">${m}</div>
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

        ${a?`
          <figure class="lesson-image">
            <img src="${a.src}" alt="${a.alt}" loading="lazy">
            <figcaption class="lesson-image__caption">${a.caption}</figcaption>
          </figure>
        `:""}
        ${s.content}

        ${(h=s.keyTerms)!=null&&h.length?`
          <div class="key-terms">
            <div class="key-terms__title">Key Terms to Remember</div>
            <div class="key-terms__list">
              ${s.keyTerms.map(m=>`
                <div class="key-term">
                  <div class="key-term__word">${m.word}</div>
                  <div class="key-term__def">${m.definition}</div>
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
          ${o?`
            <span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
              Completed
            </span>
          `:`
            <button class="btn btn--primary" id="btn-mark-complete">Mark as Complete</button>
          `}

          <button class="btn btn--accent" id="btn-take-quiz" ${o?"":'disabled title="Complete lesson first"'}>
            Take Adaptive Quiz
          </button>
        </div>
      </div>
    </div>
  `}function xs(e,t){P({onBack:()=>e("/lessons")});const s=L(),n=$.find(d=>d.id===t),o=$.indexOf(n),a=document.getElementById("btn-mark-complete"),i=document.getElementById("btn-take-quiz"),r=document.getElementById("btn-prev-lesson");r&&r.addEventListener("click",()=>{e(`/lesson/${$[o-1].id}`)}),a&&s&&a.addEventListener("click",async()=>{await qt(s.id,t),a.outerHTML='<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>',i&&(i.removeAttribute("disabled"),i.removeAttribute("title")),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}),i&&i.addEventListener("click",()=>{e(`/quiz/${t}`)});const c=document.getElementById("btn-ask-tutor");c&&c.addEventListener("click",()=>{e("/tutor")})}const Ie=[{id:"L1Q1",lessonId:1,stem:"What is the BEST definition of a computer?",options:["A machine that only plays games and videos","An electronic device that accepts data, processes it, and produces information","Any device that uses electricity","A tool used only for typing documents"],correctIndex:1,difficulty:-1.5,discrimination:1.2,guessing:.25},{id:"L1Q2",lessonId:1,stem:"Which of these is NOT a type of computer?",options:["Desktop","Laptop","Calculator","Tablet"],correctIndex:2,difficulty:-.8,discrimination:1,guessing:.25},{id:"L1Q3",lessonId:1,stem:"What technology did FIRST generation computers use?",options:["Microprocessors","Transistors","Vacuum tubes","Integrated circuits"],correctIndex:2,difficulty:.3,discrimination:1.3,guessing:.25},{id:"L1Q4",lessonId:1,stem:"Which generation of computers introduced the microprocessor?",options:["First generation","Second generation","Third generation","Fourth generation"],correctIndex:3,difficulty:.5,discrimination:1.1,guessing:.25},{id:"L1Q5",lessonId:1,stem:"What is the difference between data and information?",options:["Data is processed; information is raw","Data is raw facts; information is processed and meaningful","They mean the same thing","Data is digital; information is analog"],correctIndex:1,difficulty:0,discrimination:1.4,guessing:.25},{id:"L1Q6",lessonId:1,stem:"A smartphone is a type of computer.",options:["True — it processes data and runs programs","False — it is only a phone","True — but only expensive ones","False — it has no keyboard"],correctIndex:0,difficulty:-1,discrimination:.9,guessing:.25},{id:"L1Q7",lessonId:1,stem:"What does the fifth generation of computers focus on?",options:["Vacuum tubes","Transistors","Artificial Intelligence","Magnetic storage"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L1Q8",lessonId:1,stem:"A server is a powerful computer that:",options:["Only stores personal photos","Provides services to other computers on a network","Cannot connect to the internet","Is smaller than a smartphone"],correctIndex:1,difficulty:.8,discrimination:1.3,guessing:.25},{id:"L2Q1",lessonId:2,stem:"What is the CPU often called?",options:["The heart of the computer","The brain of the computer","The body of the computer","The memory of the computer"],correctIndex:1,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L2Q2",lessonId:2,stem:"What is the main function of the motherboard?",options:["To store files permanently","To display images on screen","To connect all computer components and allow them to communicate","To provide internet access"],correctIndex:2,difficulty:-.3,discrimination:1.2,guessing:.25},{id:"L2Q3",lessonId:2,stem:"What happens to data in RAM when the computer is turned off?",options:["It is saved permanently","It is transferred to the monitor","It disappears (is lost)","It moves to the keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.4,guessing:.25},{id:"L2Q4",lessonId:2,stem:"What unit is used to measure the speed of a CPU?",options:["Kilograms (kg)","Gigahertz (GHz)","Megabytes (MB)","Watts (W)"],correctIndex:1,difficulty:.6,discrimination:1.5,guessing:.25},{id:"L2Q5",lessonId:2,stem:"ROM is different from RAM because ROM:",options:["Is faster than RAM","Loses data when power is off","Keeps its data even when the computer is off","Can hold more data than RAM"],correctIndex:2,difficulty:.4,discrimination:1.3,guessing:.25},{id:"L2Q6",lessonId:2,stem:"What does the Power Supply Unit (PSU) do?",options:["Displays images on the screen","Converts wall electricity into the correct voltage for components","Stores programs permanently","Connects the computer to the internet"],correctIndex:1,difficulty:.1,discrimination:1.1,guessing:.25},{id:"L2Q7",lessonId:2,stem:"If a computer has more RAM, it can generally:",options:["Store more files permanently","Run more tasks at the same time without slowing down","Display brighter colors","Connect to faster internet"],correctIndex:1,difficulty:.3,discrimination:1.2,guessing:.25},{id:"L2Q8",lessonId:2,stem:"Which two types of operations does the CPU perform?",options:["Input and output operations","Arithmetic and logic operations","Printing and scanning operations","Storage and display operations"],correctIndex:1,difficulty:.7,discrimination:1.4,guessing:.25},{id:"L3Q1",lessonId:3,stem:"An input device is used to:",options:["Display information to the user","Send data or commands into a computer","Store data permanently","Print documents on paper"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L3Q2",lessonId:3,stem:"Which of the following is an input device?",options:["Printer","Monitor","Keyboard","Speaker"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L3Q3",lessonId:3,stem:"A scanner converts:",options:["Sound into text","Digital files into paper documents","Physical documents into digital images","Video into audio"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L3Q4",lessonId:3,stem:"A touchscreen is special because it is:",options:["Only an input device","Only an output device","Both an input and output device","A storage device"],correctIndex:2,difficulty:-.2,discrimination:1.4,guessing:.25},{id:"L3Q5",lessonId:3,stem:"A microphone captures _____ and converts it into digital data.",options:["Light","Heat","Sound","Motion"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L3Q6",lessonId:3,stem:"A trackpad is a type of:",options:["Output device found on desktops","Pointing device built into laptops","Storage device","Printer accessory"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L3Q7",lessonId:3,stem:"Which input device would you use to capture your face for a video call?",options:["Scanner","Keyboard","Webcam","Printer"],correctIndex:2,difficulty:-.6,discrimination:1.1,guessing:.25},{id:"L3Q8",lessonId:3,stem:"A wireless keyboard connects to the computer using:",options:["A VGA cable","Bluetooth or a USB receiver","An HDMI cable","A power cable"],correctIndex:1,difficulty:.5,discrimination:1.3,guessing:.25},{id:"L4Q1",lessonId:4,stem:"An output device:",options:["Sends data into the computer","Presents processed data from the computer to the user","Stores data permanently on a disk","Provides electricity to the computer"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L4Q2",lessonId:4,stem:"Which of the following is an output device?",options:["Mouse","Scanner","Monitor","Keyboard"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L4Q3",lessonId:4,stem:'A "hard copy" refers to:',options:["A file saved on a hard disk","A physical paper printout of a document","A very difficult document to read","A backup copy on a flash drive"],correctIndex:1,difficulty:.2,discrimination:1.3,guessing:.25},{id:"L4Q4",lessonId:4,stem:"Which type of printer uses a laser beam and toner powder?",options:["Inkjet printer","Laser printer","3D printer","Dot matrix printer"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L4Q5",lessonId:4,stem:"A projector is used to:",options:["Print documents in large sizes","Display the computer's screen as a large image on a wall","Record sound from the computer","Store data on optical discs"],correctIndex:1,difficulty:-.5,discrimination:1.1,guessing:.25},{id:"L4Q6",lessonId:4,stem:"Speakers convert electrical signals into:",options:["Light","Text","Sound","Images"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L4Q7",lessonId:4,stem:"A device that serves as BOTH input and output is called:",options:["A storage device","An I/O device","A processing device","A network device"],correctIndex:1,difficulty:.6,discrimination:1.4,guessing:.25},{id:"L4Q8",lessonId:4,stem:"A plotter is mainly used to:",options:["Play music files","Draw large-format graphics like maps and architectural plans","Scan photographs","Display video on a wall"],correctIndex:1,difficulty:1,discrimination:1.3,guessing:.25},{id:"L5Q1",lessonId:5,stem:"Why do we need storage devices?",options:["To increase the speed of the CPU","To save data permanently so it can be accessed later","To display images on the screen","To connect to the internet"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L5Q2",lessonId:5,stem:"Which storage device uses spinning magnetic disks?",options:["SSD","Flash drive","HDD","SD card"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L5Q3",lessonId:5,stem:"An SSD is faster than an HDD because it:",options:["Uses larger disks","Has no moving parts — it uses flash memory chips","Uses more electricity","Is always connected to the internet"],correctIndex:1,difficulty:.3,discrimination:1.4,guessing:.25},{id:"L5Q4",lessonId:5,stem:"Google Drive is an example of:",options:["An HDD","Cloud storage","An optical disc","A flash drive"],correctIndex:1,difficulty:-.8,discrimination:1,guessing:.25},{id:"L5Q5",lessonId:5,stem:"The correct order of the computing cycle is:",options:["Output → Input → Storage → Processing","Input → Processing → Output → Storage","Processing → Input → Output → Storage","Storage → Output → Input → Processing"],correctIndex:1,difficulty:.5,discrimination:1.5,guessing:.25},{id:"L5Q6",lessonId:5,stem:"Which storage medium has the LARGEST typical capacity?",options:["SD card","CD","Hard Disk Drive (HDD)","Flash drive"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L5Q7",lessonId:5,stem:"Optical discs (like CDs and DVDs) are read using:",options:["A magnetic head","A laser beam","Radio waves","Electrical contacts"],correctIndex:1,difficulty:.7,discrimination:1.3,guessing:.25},{id:"L5Q8",lessonId:5,stem:"When you save a school report to a flash drive and print it, which component is the storage device?",options:["The printer","The monitor","The flash drive","The keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.1,guessing:.25}];function O(e,t=2){return Math.round(e*10**t)/10**t}function dt(e,t){const{discrimination:s,difficulty:n,guessing:o}=t,a=-s*(e-n);return o+(1-o)/(1+Math.exp(a))}function lt(e,t){const s=dt(e,t),{discrimination:n,guessing:o}=t;if(s<=o||s>=1)return 0;const a=n*n*(s-o)**2,i=(1-o)**2*s*(1-s);return i>0?a/i:0}function $s(e){if(e.length===0)return 0;const t=e.every(i=>i.correct),s=e.every(i=>!i.correct);if(t)return Math.min(3,.5*e.length);if(s)return Math.max(-3,-.5*e.length);let n=0;const o=30,a=.001;for(let i=0;i<o;i+=1){let r=0,c=0;for(const u of e){const h=dt(n,u.item),m=1-h,{discrimination:w,guessing:y}=u.item,g=(h-y)/(1-y),v=w*g*m;u.correct?r+=v/h:r-=v/m,c-=v*v/(h*m)}if(Math.abs(c)<1e-10)break;const d=r/c;if(n-=d,n=Math.max(-3,Math.min(3,n)),Math.abs(d)<a)break}return n}function he(e,t){let s=0;for(const n of t)s+=lt(e,n.item);return s>0?1/Math.sqrt(s):999}function Ss(e,t){let s=null,n=-1/0;for(const o of t){const a=lt(e,o);a>n&&(n=a,s=o)}return s}function Pe(e){return e<-1?{label:"Beginner",color:"#FB7185",description:"Just getting started — keep learning and practicing!"}:e<0?{label:"Developing",color:"#FBBF24",description:"You understand the basics. Review the tricky parts and try again!"}:e<1?{label:"Proficient",color:"#818CF8",description:"Great understanding! You've got a solid grasp of this topic."}:{label:"Advanced",color:"#34D399",description:"Excellent! You've mastered this topic. Ready for the next challenge!"}}function As(e=null,t=10){let s=e?Ie.filter(v=>v.lessonId===e):[...Ie];s=s.sort(()=>Math.random()-.5);const n=new Set,o=[],a=[];let i=0,r=null,c=0,d=!1,u=null;function h(){if(d)return null;const v=s.filter(l=>!n.has(l.id));return v.length===0||c>=t||c>=5&&he(i,o)<.3?(d=!0,null):(r=Ss(i,v),n.add(r.id),c+=1,u=Date.now(),{question:r,questionNumber:c,totalQuestions:Math.min(t,s.length),currentTheta:i,difficulty:r.difficulty>.5?"Hard":r.difficulty<-.5?"Easy":"Medium"})}function m(v){if(!r)return null;const l=Date.now(),b=i,p=v===r.correctIndex,f={item:r,selectedIndex:v,correct:p,questionNumber:c,presentedAt:u||l,answeredAt:l,elapsedMs:Math.max(0,l-(u||l)),thetaBefore:b};return o.push(f),i=$s(o),f.thetaAfter=i,f.standardErrorAfter=he(i,o),a.push({questionId:r.id,questionNumber:c,thetaBefore:O(b),thetaAfter:O(i),standardErrorAfter:O(f.standardErrorAfter),elapsedMs:f.elapsedMs,correct:p}),u=null,{correct:p,correctIndex:r.correctIndex,thetaBefore:b,thetaAfter:i,standardErrorAfter:f.standardErrorAfter,elapsedMs:f.elapsedMs,level:Pe(i)}}function w(){return u?Math.max(0,Date.now()-u):0}function y(){const v=o.filter(_=>_.correct).length,l=Pe(i),b=he(i,o),p=o.reduce((_,k)=>_+k.elapsedMs,0),f=o.length>0?Math.round(p/o.length):0;return{score:v,totalQuestions:o.length,theta:O(i),standardError:O(b),level:l.label,levelColor:l.color,levelDescription:l.description,totalTimeMs:p,averageTimeMs:f,thetaTrajectory:a,responses:o.map(_=>({questionId:_.item.id,lessonId:_.item.lessonId,stem:_.item.stem,options:_.item.options,selectedIndex:_.selectedIndex,correctIndex:_.item.correctIndex,correct:_.correct,questionNumber:_.questionNumber,elapsedMs:_.elapsedMs,presentedAt:_.presentedAt,answeredAt:_.answeredAt,thetaBefore:O(_.thetaBefore),thetaAfter:O(_.thetaAfter),standardErrorAfter:O(_.standardErrorAfter)}))}}function g(){return d}return{next:h,answer:m,getCurrentElapsedMs:w,getResults:y,isFinished:g}}const Ts={L1Q1:"A computer is specifically an electronic device that accepts data (input), processes it using instructions, and produces useful information (output). It's not limited to games or typing — it can do many things because of its ability to follow programs.",L1Q2:"A calculator can do math, but it is not a general-purpose computer. It cannot run different programs, browse the internet, or process many types of data. Desktops, laptops, and tablets are all types of computers because they can run software and handle many tasks.",L1Q3:"First generation computers (1940s-1950s) used vacuum tubes — large glass tubes that controlled electrical signals. These made the computers huge (filling entire rooms!) and generated a lot of heat. Transistors came in the second generation.",L1Q4:"The fourth generation (1970s to present) introduced the microprocessor — an entire CPU on a single tiny chip. This breakthrough made personal computers, laptops, and smartphones possible. The Intel 4004 (1971) was one of the first microprocessors.",L1Q5:"Data refers to raw, unprocessed facts and figures (like numbers or words). Information is what you get after data has been processed and organized into something meaningful and useful. For example, student scores (data) become a class ranking (information).",L1Q6:"A smartphone is indeed a type of computer! It has a processor (CPU), memory (RAM), storage, input devices (touchscreen, microphone), and output devices (screen, speaker). It runs software programs (apps) just like a desktop computer.",L1Q7:"The fifth generation of computers focuses on Artificial Intelligence (AI) — making computers that can learn, understand human speech, and make decisions. This includes technologies like voice assistants and self-driving cars.",L1Q8:"A server is a powerful computer that provides services to other computers on a network. When you visit a website, a server sends that information to your device. Servers are typically kept in special rooms and run 24/7.",L2Q1:"The CPU is called the 'brain' of the computer because it carries out all instructions and makes decisions. Just like your brain processes information from your senses, the CPU processes data from input devices and tells other components what to do.",L2Q2:"The motherboard is the main circuit board that connects all computer components together and allows them to communicate. Think of it as the 'backbone' or 'highway system' of the computer — everything plugs into it.",L2Q3:"RAM (Random Access Memory) is temporary memory — it only holds data while the computer is running. When you turn off the computer, all data in RAM is lost. That's why you need to save your work to storage (like a hard drive) to keep it.",L2Q4:"CPU speed is measured in Gigahertz (GHz). One GHz means the CPU can perform one billion basic operations per second! A higher GHz number generally means a faster processor. Megabytes measure storage, not speed.",L2Q5:"ROM (Read-Only Memory) keeps its data even when the computer is turned off — this is called 'non-volatile' memory. RAM loses its data when power is off ('volatile'). ROM stores the essential startup instructions the computer needs to begin loading.",L2Q6:"The Power Supply Unit (PSU) converts AC electricity from the wall outlet into DC electricity at the correct voltages that computer components need. Without it, no component inside the computer would receive power.",L2Q7:"More RAM means the computer can hold more data for active tasks at the same time. This allows you to run multiple programs without the computer slowing down. RAM doesn't affect permanent storage — that's the job of hard drives and SSDs.",L2Q8:"The CPU performs two types of operations: arithmetic (math calculations like adding and multiplying) and logic (comparisons like 'Is A equal to B?' or 'Is X greater than Y?'). All computing tasks ultimately break down into these two types.",L3Q1:"An input device is any hardware that allows you to send data or commands INTO a computer. Without input devices, you would have no way to tell the computer what to do. They are the 'doors' through which data enters the computer.",L3Q2:"A keyboard is an input device — you use it to enter text and commands into the computer. Printers, monitors, and speakers are all output devices because they present data FROM the computer to you.",L3Q3:"A scanner takes a physical document or photograph and converts it into a digital image that the computer can store and display. It works in the opposite direction of a printer — a printer takes digital files and puts them ON paper.",L3Q4:"A touchscreen is special because it serves as BOTH an input device (you tap and swipe to send commands) AND an output device (it displays information). This makes it an I/O (input/output) device.",L3Q5:"A microphone captures sound waves from your voice or the environment and converts them into digital data that the computer can process. This is how voice calls, voice recording, and voice assistants work.",L3Q6:"A trackpad (also called touchpad) is a flat, touch-sensitive surface built into laptops that works like a mouse. You move your finger across it to control the cursor. It's a pointing input device.",L3Q7:"A webcam (web camera) captures video and images, which is exactly what you need for a video call. Scanners capture flat documents, keyboards capture text, and printers are output devices — none of them can capture live video of your face.",L3Q8:"Wireless keyboards connect to the computer using either Bluetooth technology or a small USB receiver that plugs into the computer. This eliminates the need for a cable connection between the keyboard and the computer.",L4Q1:"An output device takes processed data from the computer and presents it in a form that humans can understand. Monitors show visual output, speakers produce audio output, and printers create physical output on paper.",L4Q2:"A monitor is an output device — it displays visual information from the computer to you. Mice, scanners, and keyboards are input devices that send data INTO the computer.",L4Q3:"A 'hard copy' is a physical paper printout of a digital document. The word 'hard' refers to the fact that it's a tangible, physical copy you can hold in your hands, as opposed to a 'soft copy' which exists only on the computer screen.",L4Q4:"A laser printer uses a laser beam to create an image on a drum, which then attracts toner powder. The toner is transferred to paper and fused with heat. Laser printers are fast and great for printing large amounts of text.",L4Q5:"A projector takes the computer's visual display and projects it as a large image on a wall or screen. This makes it ideal for classrooms and meetings where many people need to see the same content at once.",L4Q6:"Speakers receive electrical signals from the computer and convert them into sound waves that we can hear. This is how you hear music, voice in videos, system alerts, and all other audio from a computer.",L4Q7:"A device that serves as both input and output is called an I/O (Input/Output) device. A touchscreen is the best example — you input by touching it, and it outputs by displaying information. Some use the term 'interactive device'.",L4Q8:"A plotter is a specialized output device designed to draw large-format graphics, maps, engineering diagrams, and architectural plans. Unlike regular printers that print line by line, plotters use pens to draw continuous, precise lines.",L5Q1:"Storage devices save data permanently so you can access it later, even after the computer is turned off. Without storage, you would lose all your files every time you shut down — RAM only holds data temporarily while the computer is on.",L5Q2:"A Hard Disk Drive (HDD) uses spinning magnetic disks called platters. A read/write head moves across these platters to store and retrieve data. This mechanical process is what makes HDDs slower than SSDs.",L5Q3:"An SSD (Solid State Drive) uses flash memory chips with no moving parts. Since there are no spinning disks or moving heads, data can be read and written much faster. HDDs are slower because they rely on mechanical, moving parts.",L5Q4:"Google Drive is a cloud storage service. Cloud storage means your files are saved on remote servers accessed through the internet, not on a physical device in your hand. Other examples include Dropbox and OneDrive.",L5Q5:"The correct computing cycle is: Input (data enters) → Processing (CPU works on the data) → Output (results are shown) → Storage (data is saved). This is the fundamental pattern that every computing task follows.",L5Q6:"Hard Disk Drives (HDDs) typically have the largest capacity — they can store 500 GB to several terabytes (TB) of data. SD cards, CDs, and flash drives have much smaller capacities compared to modern HDDs.",L5Q7:"Optical discs like CDs, DVDs, and Blu-ray discs are read using a laser beam. The laser reads tiny pits and lands on the disc surface to retrieve data. That's why they're called 'optical' — they use light (optics) technology.",L5Q8:"In this scenario, the flash drive is the storage device — it permanently saves your school report file. The printer is an output device (it produces a paper copy), the monitor is an output device, and the keyboard is an input device."},Ds="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";async function ut(e,t,s,n){var a,i,r,c,d;const o=ce();if(!o||!navigator.onLine)return se(e);try{const u=Ls(t,s,n),h=await fetch(`${Ds}?key=${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:u}]}],generationConfig:{temperature:.7,maxOutputTokens:200,topP:.9}}),signal:AbortSignal.timeout(1e4)});if(!h.ok)return console.warn("Gemini API error, using fallback:",h.status),se(e);const m=await h.json(),w=(d=(c=(r=(i=(a=m==null?void 0:m.candidates)==null?void 0:a[0])==null?void 0:i.content)==null?void 0:r.parts)==null?void 0:c[0])==null?void 0:d.text;return w?{text:w.trim(),source:"ai",model:"gemini-2.0-flash"}:se(e)}catch(u){return console.warn("AI feedback failed, using fallback:",u.message),se(e)}}function se(e){return{text:Ts[e]||"Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!",source:"fallback",model:null}}function Ls(e,t,s){return`You are a friendly, encouraging JHS Computing teacher in Ghana. A student just answered a quiz question wrong. Explain why the correct answer is right in 2-3 simple sentences that a 12-14 year old would understand. Be warm and supportive. Do NOT say "you're wrong" — instead, gently explain the concept.

Question: "${e}"
Student's answer: "${t}"
Correct answer: "${s}"

Give a brief, clear explanation (2-3 sentences only):`}async function Cs(e){const t={},s=e.filter(n=>!n.correct);for(const n of s){const o=n.options[n.selectedIndex],a=n.options[n.correctIndex];t[n.questionId]=await ut(n.questionId,n.stem,o,a)}return t}let E=null,ae=null,W=null,x=null,J=!1,ne=null;function pt(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function ee(){ne&&(window.clearInterval(ne),ne=null)}function qe(){const e=document.getElementById("question-timer");!e||!E||(e.textContent=pt(E.getCurrentElapsedMs()))}function Ms(){ee(),qe(),ne=window.setInterval(qe,1e3)}function Bs(e){ee(),ae=Number.parseInt(e,10),E=As(ae),W=E.next(),x=null,J=!1}function Es(e){const t=Number.parseInt(e,10);(!E||ae!==t)&&Bs(t)}function Rs(){ee(),E=null,ae=null,W=null,x=null,J=!1}function zs(){if(!E||!W)return'<div class="container">Error initializing quiz.</div>';const e=L(),t=W;let s="";return x?s=`
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${pt(x.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${x.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${x.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${x.stem}</p>

        <div class="results-review">
          <div class="review-item ${x.correct?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${x.correct?"review-item__correct-answer":"review-item__your-answer"}">${x.studentAnswerText}</span></div>
            </div>
            ${x.correct?"":`
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${x.correctAnswerText}</span></div>
              </div>
            `}
          </div>
        </div>

        <div style="margin-top: var(--space-6);" id="feedback-container">
          ${x.aiText?it({source:x.source,text:x.aiText},x.correct):'<div class="shimmer" style="height: 100px; width: 100%;"></div>'}
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${E.isFinished()?"See Final Results":"Next Question"}
          </button>
        </div>
      </div>
    `:s=`
      <div class="quiz-header">
        <div class="quiz-header__info">
          <span class="quiz-header__question-num">Question ${t.questionNumber} of ${t.totalQuestions}</span>
        </div>
        <div class="quiz-header__meta">
          <span class="badge badge--neutral quiz-header__timer" id="question-timer">00:00</span>
          <span class="badge badge--neutral quiz-header__difficulty">Level: ${t.difficulty}</span>
        </div>
      </div>

      ${le(t.questionNumber-1,t.totalQuestions,"Quiz progress")}

      <div id="question-container">
        ${ot(t.question)}
      </div>
    `,`
    ${B({title:"Adaptive Quiz",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${s}
    </div>
  `}function Ps(e,t,s){if(P({onBack:()=>e(`/lesson/${s}`)}),x){ee();const o=document.getElementById("btn-next-question");o&&o.addEventListener("click",async()=>{if(x=null,E.isFinished()){await Qe(e,s);return}const a=E.next();if(!a){await Qe(e,s);return}W=a,t()}),!x.aiText&&!x.correct&&ut(x.questionId,x.stem,x.studentAnswerText,x.correctAnswerText).then(a=>{x.aiText=a.text,x.source=a.source;const i=document.getElementById("feedback-container");i&&(i.innerHTML=it({source:a.source,text:a.text},!1))});return}Ms(),document.querySelectorAll(".option-btn").forEach(o=>{o.addEventListener("click",a=>{if(J)return;J=!0;const i=Number.parseInt(a.currentTarget.dataset.index,10);qs(i,a.currentTarget,t)})})}function qs(e,t,s){const n=E.answer(e),o=W.question;if(ee(),document.querySelectorAll(".option-btn").forEach(i=>{i.classList.add("option-btn--disabled"),i.disabled=!0}),n.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const i=document.getElementById(`option-${n.correctIndex}`);i&&i.classList.add("option-btn--highlight-correct")}x={questionId:o.id,stem:o.stem,correct:n.correct,studentAnswerText:o.options[e],correctAnswerText:o.options[n.correctIndex],aiText:n.correct?"Great work — you understood this concept.":null,source:n.correct?"system":null,elapsedMs:n.elapsedMs,thetaAfter:n.thetaAfter,levelLabel:n.level.label},setTimeout(()=>{J=!1,s()},1e3)}async function Qe(e,t){const s=L(),n=E.getResults();if(!s){e("/lessons");return}const o=await Nt({studentId:s.id,lessonId:Number.parseInt(t,10),...n});e(`/quiz-results/${o.id}`)}function ke(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}async function Qs(e){var c,d,u;const t=L(),s=await X(),n=s.find(h=>h.id===Number.parseInt(e,10));if(!n)return'<div class="container">Result not found.</div>';const o=t?s.filter(h=>h.studentId===t.id):[],a=t?await N(t.id):null,i=t?await z(t.id):[],r=q({diagnostic:a,results:o,progressRecords:i});return`
    ${B({title:"Quiz Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Lessons"})}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${os(n.score,n.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${n.levelColor};">
          Level: ${n.level}
        </div>
        <p class="quiz-results__level-desc">${n.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${ke(n.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${ke(n.averageTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Standard error</span>
          <span class="quiz-result-metric__value">${n.standardError}</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Adaptive content path</div>
        <h3 class="results-next-step__title">Recommended next: ${((c=r.recommendedNext)==null?void 0:c.title)||"Return to lessons"}</h3>
        <p class="results-next-step__text">${((d=r.recommendedNext)==null?void 0:d.recommendedFocus)||"Keep following your personalized path."}</p>
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
  `}function Ns(e,t){P({onBack:()=>e("/lessons")});const s=document.getElementById("btn-next-lesson"),n=document.getElementById("btn-open-tutor"),o=document.getElementById("btn-retry-quiz");X().then(async a=>{const i=a.find(m=>m.id===Number.parseInt(t,10));if(!i)return;const r=L(),c=r?a.filter(m=>m.studentId===r.id):[],d=r?await N(r.id):null,u=r?await z(r.id):[],h=q({diagnostic:d,results:c,progressRecords:u});s&&s.addEventListener("click",()=>{var w;const m=(w=h.recommendedNext)==null?void 0:w.lessonId;e(m?`/lesson/${m}`:"/lessons")}),n&&n.addEventListener("click",()=>{e("/tutor")}),o&&o.addEventListener("click",()=>{e(`/quiz/${i.lessonId}`)}),Os(i.responses)})}async function Os(e){const t=document.getElementById("review-list");if(!t)return;t.innerHTML=e.map(n=>ge(n,null)).join("");const s=await Cs(e);t.innerHTML=e.map(n=>n.correct?ge(n,{text:"Correct! You handled this concept well.",source:"system"}):ge(n,s[n.questionId])).join("")}function ge(e,t){const s=e.options[e.selectedIndex],n=e.options[e.correctIndex];let o="";return t?e.correct||(o=`
        <div style="margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid rgba(148, 163, 184, 0.1);">
          <div style="font-size: var(--font-size-xs); color: var(--color-accent-300); margin-bottom: var(--space-1); font-weight: var(--font-weight-bold);">
            ${t.source==="ai"?"AI Explanation":"Explanation"}
          </div>
          <div style="font-size: var(--font-size-sm); color: var(--text-secondary); line-height: 1.4;">${t.text}</div>
        </div>
      `):e.correct||(o='<div class="shimmer" style="height: 40px; margin-top: var(--space-3);"></div>'),`
    <div class="review-item ${e.correct?"review-item--correct":"review-item--incorrect"}">
      <div class="review-item__question">${e.questionNumber}. ${e.stem}</div>
      <div class="review-item__meta">
        <span>Time: ${ke(e.elapsedMs)}</span>
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
      ${o}
    </div>
  `}let I=null,V=[];function Ne(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function js(e){const t={};return e.slice().sort((s,n)=>new Date(s.completedAt)-new Date(n.completedAt)).forEach(s=>{t[s.studentId]=s}),Object.values(t)}function Fs(e,t,s,n){const o=js(t),a={};n.slice().sort((p,f)=>new Date(f.completedAt)-new Date(p.completedAt)).forEach(p=>{a[p.studentId]||(a[p.studentId]=p)});const i=e.map(p=>{const f=t.filter(Q=>Q.studentId===p.id),_=s.filter(Q=>Q.studentId===p.id),k=a[p.id]||null,D=q({diagnostic:k,results:f,progressRecords:_});return{student:p,results:f,progressRecords:_,diagnostic:k,profile:D}}),r=e.length>0?Math.round(s.length/(e.length*$.length)*100):0,c=o.length>0?Math.round(o.reduce((p,f)=>p+f.score/f.totalQuestions,0)/o.length*100):0,d=i.filter(p=>p.profile.risk.score>=60).length,u=e.length>0?Math.round(i.filter(p=>p.diagnostic).length/e.length*100):0,h={},m={};for(const p of t)h[p.lessonId]=(h[p.lessonId]||0)+p.score/p.totalQuestions,m[p.lessonId]=(m[p.lessonId]||0)+1;const w=$.map(p=>m[p.id]?Math.round(h[p.id]/m[p.id]*100):0),y={Advanced:0,Proficient:0,Developing:0,Beginner:0};for(const p of o)y[p.level]!==void 0&&(y[p.level]+=1);const g={};for(const p of t)for(const f of p.responses){if(f.correct)continue;const _=`${f.questionId}|${f.stem}|${f.options[f.selectedIndex]}`;g[_]=(g[_]||0)+1}const v=Object.entries(g).map(([p,f])=>{const[_,k,D]=p.split("|");return{questionId:_,stem:k,answer:D,count:f}}).sort((p,f)=>f.count-p.count).slice(0,7),l=$.map(p=>{const f=i.map(_=>{var k;return((k=_.profile.lessonProfiles.find(D=>D.lessonId===p.id))==null?void 0:k.mastery)||0});return{lessonId:p.id,title:p.title,averageMastery:f.length?Math.round(f.reduce((_,k)=>_+k,0)/f.length*100):0}}),b=i.filter(p=>p.profile.risk.score>=35).sort((p,f)=>f.profile.risk.score-p.profile.risk.score).slice(0,6);return{students:e,results:t,progressRecords:s,diagnostics:n,studentProfiles:i,latestResults:o,summary:{totalStudents:e.length,averageScore:c,completionRate:r,studentsAtRisk:d,diagnosticCoverage:u},charts:{lessonLabels:$.map(p=>`Lesson ${p.id}`),lessonScoreData:w,levelCounts:y,misconceptions:v},interventionQueue:b,masterySnapshot:l}}async function Us(){const e=await de(),t=await X(),s=await Ze(),n=await et();if(I=Fs(e,t,s,n),e.length===0)return`
      ${B({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
      <div class="container view-enter dashboard-page" style="padding-top: var(--space-8);">
        <div class="empty-state">
          <div class="empty-state__icon">Data</div>
          <h2 class="empty-state__title">No Data Yet</h2>
          <p class="empty-state__text">Students need to log in and take quizzes before analytics will appear here.</p>
        </div>
      </div>
    `;const{summary:o}=I;return`
    ${B({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div class="dashboard-header">
        <h1 class="dashboard-header__title">Class Overview</h1>
        <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
      </div>

      <div class="stat-grid">
        ${Y("Students",o.totalStudents,"Total Students","primary",`${I.results.length} quizzes recorded`)}
        ${Y("Average",`${o.averageScore}%`,"Average Score","accent","Latest quiz per student")}
        ${Y("Progress",`${o.completionRate}%`,"Completion Rate","success",`${I.progressRecords.length} lesson completions logged`)}
        ${Y("Support",o.studentsAtRisk,"High Risk Learners",o.studentsAtRisk>0?"danger":"success","Prediction score 60+")}
        ${Y("Diagnostic",`${o.diagnosticCoverage}%`,"Diagnostic Coverage",o.diagnosticCoverage<100?"accent":"success","Students with readiness profiles")}
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
            ${I.interventionQueue.length>0?I.interventionQueue.map(a=>`
              <div class="intervention-item">
                <div>
                  <div class="intervention-item__name">${a.student.name}</div>
                  <div class="intervention-item__meta">${a.profile.risk.reasons.join(" | ")}</div>
                </div>
                <div style="text-align: right;">
                  <div class="badge badge--${a.profile.risk.badge}">Risk ${a.profile.risk.score}</div>
                  <div class="intervention-item__action">${a.profile.risk.action}</div>
                </div>
              </div>
            `).join(""):'<div class="insight-empty">No learners are currently flagged for intervention.</div>'}
          </div>
        </div>

        <div class="card dashboard-panel">
          <h3 class="chart-card__title">Class Mastery Snapshot</h3>
          <p class="chart-card__subtitle">Average mastery by lesson after combining diagnostics, completion, and quiz performance.</p>
          <div class="mastery-grid">
            ${I.masterySnapshot.map(a=>`
              <div class="mastery-grid__item">
                <div class="mastery-grid__label">Lesson ${a.lessonId}</div>
                <div class="mastery-grid__title">${a.title}</div>
                <div class="mastery-grid__value">${a.averageMastery}%</div>
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
              ${e.map(a=>{var m;const i=t.filter(w=>w.studentId===a.id).sort((w,y)=>new Date(y.completedAt)-new Date(w.completedAt)),r=i[0],c=s.filter(w=>w.studentId===a.id).length,d=I.studentProfiles.find(w=>w.student.id===a.id),u=d==null?void 0:d.profile.risk,h=((m=d==null?void 0:d.profile.recommendedNext)==null?void 0:m.title)||"-";return`
                  <tr class="student-row" data-id="${a.id}">
                    <td class="student-table__name">${a.name}</td>
                    <td>${c}/${$.length}</td>
                    <td>${i.length}</td>
                    <td class="student-table__score">${r?`${Math.round(r.score/r.totalQuestions*100)}%`:"-"}</td>
                    <td>${h}</td>
                    <td><span class="badge badge--${(u==null?void 0:u.badge)||"neutral"}">${(u==null?void 0:u.label)||"No Data"}</span></td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function Hs(e){P({onBack:()=>e("/"),onSettings:Gs,onLogout:()=>{Wt(),e("/")}});const t=document.getElementById("btn-export-csv");if(t&&t.addEventListener("click",async()=>{const s=await Yt();Kt(s),R("Data exported successfully","success")}),window.Chart)Oe();else{const s=document.getElementById("chartjs-script");s&&s.addEventListener("load",Oe,{once:!0})}document.querySelectorAll(".student-row").forEach(s=>{s.addEventListener("click",n=>{const o=Number.parseInt(n.currentTarget.dataset.id,10);Ws(o)})})}function Gs(){const e=ce()||"",t=Ae()||"",s=`
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${e}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Used for quiz explanations, diagnostic coaching, and the AI tutor. You can update this any time.</p>
    </div>
    <div class="input-group">
      <label>Teacher PIN</label>
      <input type="password" id="settings-teacher-pin" class="input input--pin" value="${t}" placeholder="0000" maxlength="4" inputmode="numeric">
    </div>
  `;at("Dashboard Settings",s,[{label:"Cancel",variant:"btn--ghost"},{label:"Save",variant:"btn--primary",onClick:async()=>{const n=document.getElementById("settings-api-key"),o=document.getElementById("settings-teacher-pin"),a=(n==null?void 0:n.value.trim())||"",i=(o==null?void 0:o.value.trim())||"";return i&&!/^\d{4}$/.test(i)?(R("Teacher PIN must stay 4 digits.","error"),!1):(await Ve(a),i&&await Je(i),R("Settings saved","success"),!0)}}])}async function Ws(e){var g,v;const t=(I==null?void 0:I.students)||await de(),s=(I==null?void 0:I.results)||await X(),n=(I==null?void 0:I.progressRecords)||await Ze(),o=(I==null?void 0:I.diagnostics)||await et(),a=t.find(l=>l.id===e),i=s.filter(l=>l.studentId===e).sort((l,b)=>new Date(l.completedAt)-new Date(b.completedAt)),r=o.filter(l=>l.studentId===e).sort((l,b)=>new Date(b.completedAt)-new Date(l.completedAt))[0]||null,c=q({diagnostic:r,results:i,progressRecords:n.filter(l=>l.studentId===e)}),d=i.at(-1),u=i.length>0?Math.round(i.reduce((l,b)=>l+b.score/b.totalQuestions,0)/i.length*100):0,h=n.filter(l=>l.studentId===e).length,m=i.flatMap(l=>l.responses.map(b=>({...b,lessonId:l.lessonId,completedAt:l.completedAt}))).sort((l,b)=>new Date(b.answeredAt||b.completedAt)-new Date(l.answeredAt||l.completedAt));if(!a)return;const y=`
    <div class="student-detail">
      <div class="student-detail__header">
        <div class="student-detail__avatar">${a.name.slice(0,2).toUpperCase()}</div>
        <div>
          <div class="student-detail__name">${a.name}</div>
          <div class="dashboard-header__subtitle">Lessons completed: ${h}/${$.length}</div>
        </div>
      </div>

      <div class="student-detail__stats">
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${i.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${u}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${d?d.level:"-"}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${d?Ne(d.averageTimeMs):"00:00"}</div>
          <div class="student-detail__stat-label">Avg Question Time</div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-bottom: var(--space-4);">
        <h4 class="student-detail__history-title">Personalization Snapshot</h4>
        <div class="student-detail__snapshot">
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${c.readiness.tone}">${c.readiness.label}</span>
            <div class="student-detail__snapshot-text">${r?`Diagnostic completed on ${new Date(r.completedAt).toLocaleDateString()}`:"Diagnostic not completed yet."}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${c.risk.badge}">Risk ${c.risk.score}</span>
            <div class="student-detail__snapshot-text">${c.risk.action}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--primary">Next Focus</span>
            <div class="student-detail__snapshot-text">${((g=c.recommendedNext)==null?void 0:g.title)||"Lesson 1"} - ${((v=c.recommendedNext)==null?void 0:v.recommendedFocus)||"Continue the learning path."}</div>
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
            ${i.length>0?i.slice().reverse().map(l=>{var b;return`
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${l.lessonId}: ${((b=$.find(p=>p.id===l.lessonId))==null?void 0:b.title)||"Unknown"}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${new Date(l.completedAt).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: var(--font-weight-bold); color: ${l.score/l.totalQuestions>=.7?"var(--color-success-400)":"var(--color-warning-400)"};">${Math.round(l.score/l.totalQuestions*100)}%</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">theta ${l.theta.toFixed(2)}</div>
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
              ${m.length>0?m.slice(0,18).map(l=>`
                <tr>
                  <td>${l.lessonId}</td>
                  <td>
                    <div class="student-detail__question">${l.stem}</div>
                    <div class="student-detail__question-sub">${l.options[l.selectedIndex]} ${l.correct?"":`→ ${l.options[l.correctIndex]}`}</div>
                  </td>
                  <td><span class="badge badge--${l.correct?"success":"danger"}">${l.correct?"Correct":"Review"}</span></td>
                  <td>${Ne(l.elapsedMs)}</td>
                  <td>${l.thetaAfter}</td>
                </tr>
              `).join(""):'<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;at("Student Profile",y,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),window.Chart&&i.length>0&&setTimeout(()=>Ks(i),0)}function Ys(){V.forEach(e=>e.destroy()),V=[]}function Oe(){if(!window.Chart||!I)return;Ys();const{Chart:e}=window;e.defaults.color="#94A3B8",e.defaults.borderColor="rgba(148, 163, 184, 0.1)";const t=document.getElementById("chart-scores");t&&V.push(new e(t,{type:"bar",data:{labels:I.charts.lessonLabels,datasets:[{label:"Average Score (%)",data:I.charts.lessonScoreData,backgroundColor:"rgba(99, 102, 241, 0.8)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100}}}}));const s=document.getElementById("chart-levels");s&&V.push(new e(s,{type:"doughnut",data:{labels:Object.keys(I.charts.levelCounts),datasets:[{data:Object.values(I.charts.levelCounts),backgroundColor:["#34D399","#818CF8","#FBBF24","#FB7185"],borderWidth:0,cutout:"70%"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right"}}}}));const n=document.getElementById("chart-misconceptions");if(n){const o=I.charts.misconceptions.map(i=>i.stem),a=I.charts.misconceptions.map(i=>i.count);V.push(new e(n,{type:"bar",data:{labels:o,datasets:[{label:"Times missed",data:a,backgroundColor:"rgba(244, 63, 94, 0.75)",borderRadius:6}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{tooltip:{callbacks:{label(i){const r=I.charts.misconceptions[i.dataIndex];return`${i.raw} misses — common wrong answer: ${r.answer}`}}}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{ticks:{callback(i,r){return`Q${r+1}`}}}}}}))}}function Ks(e){const t=document.getElementById("student-theta-chart");if(!t||!window.Chart)return;const{Chart:s}=window,n=e.map(a=>`L${a.lessonId}`),o=e.map(a=>a.theta);new s(t,{type:"line",data:{labels:n,datasets:[{label:"Theta",data:o,borderColor:"#818CF8",backgroundColor:"rgba(129, 140, 248, 0.15)",fill:!0,tension:.35,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{min:-3,max:3}},plugins:{legend:{display:!1}}}})}function Vs(){return new Map($.map(e=>{const t=Ie.filter(s=>s.lessonId===e.id).sort((s,n)=>{const o=Math.abs(s.difficulty)-Math.abs(n.difficulty);return o!==0?o:n.discrimination-s.discrimination});return[e.id,t]}))}function Js(e,t){return e>=.75&&t===0?"Ready to Accelerate":e>=.5?"Foundations Growing":"Needs Guided Support"}function je(e){return $.map(t=>{const s=e.get(t.id)||[],n=s.filter(i=>i.correct).length,o=s.length,a=o>0?n/o:0;return{lessonId:t.id,lessonTitle:t.title,correct:n,attempted:o,accuracy:a}})}function Zs(){const e=Vs(),t=$.map(g=>{var v;return(v=e.get(g.id))==null?void 0:v[0]}).filter(Boolean),s=new Map($.map(g=>[g.id,(e.get(g.id)||[]).slice(1)])),n=new Set,o=[];let a=0,i=null,r=[],c=!1,d=!1;function u(){const g=new Map;for(const l of o){const b=g.get(l.lessonId)||[];b.push(l),g.set(l.lessonId,b)}r=je(g).sort((l,b)=>l.accuracy!==b.accuracy?l.accuracy-b.accuracy:l.lessonId-b.lessonId).slice(0,3).map(l=>(s.get(l.lessonId)||[]).find(p=>!n.has(p.id))||null).filter(Boolean),c=!0}function h(){if(d)return null;let g=null;if(t.length>0?g=t.shift():(c||u(),g=r.shift()||null),!g)return d=!0,null;n.add(g.id),i=g,a+=1;const v=$.find(l=>l.id===g.lessonId);return{question:g,questionNumber:a,totalQuestions:8,lessonId:g.lessonId,lessonTitle:(v==null?void 0:v.title)||`Lesson ${g.lessonId}`,phase:a<=5?"coverage":"follow-up"}}function m(g){if(!i)return null;const v=g===i.correctIndex,l={questionId:i.id,lessonId:i.lessonId,stem:i.stem,options:i.options,selectedIndex:g,correctIndex:i.correctIndex,correct:v};return o.push(l),i=null,{correct:v,correctIndex:l.correctIndex}}function w(){const g=new Map;for(const k of o){const D=g.get(k.lessonId)||[];D.push(k),g.set(k.lessonId,D)}const v=je(g),l=v.filter(k=>k.accuracy<.5),b=v.filter(k=>k.accuracy>=.75),p=o.filter(k=>k.correct).length,f=o.length,_=f>0?p/f:0;return{score:p,totalQuestions:f,readiness:Js(_,l.length),generationMethod:"adaptive diagnostic",lessonBreakdown:v,knowledgeGaps:l,strengths:b,responses:o}}function y(){return d}return{next:h,answer:m,getResults:w,isFinished:y}}let j=null,C=null,Z=!1;function Xs(){j=Zs(),C=j.next(),Z=!1}function en(){(!j||!C)&&Xs()}function mt(){j=null,C=null,Z=!1}function tn(){if(!j||!C)return'<div class="container">Error loading diagnostic assessment.</div>';const e=L();return`
    ${B({title:"Diagnostic Assessment",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter diagnostic-page" style="padding-top: var(--space-6);">
      <div class="card card--glass diagnostic-hero">
        <div class="diagnostic-hero__eyebrow">AI-guided readiness check</div>
        <h1 class="diagnostic-hero__title">Let us map your starting point</h1>
        <p class="diagnostic-hero__text">This short pre-assessment samples all five lessons, then follows up on the topics that need the most attention.</p>
        <div class="diagnostic-hero__meta">
          <span class="badge badge--neutral">8 questions max</span>
          <span class="badge badge--accent">${C.phase==="coverage"?"Checking broad coverage":"Following up on weak areas"}</span>
          <span class="badge badge--primary">${C.lessonTitle}</span>
        </div>
      </div>

      <div class="diagnostic-stage">
        <div class="diagnostic-stage__header">
          <div>
            <div class="diagnostic-stage__label">Question ${C.questionNumber}</div>
            <h2 class="diagnostic-stage__title">${C.lessonTitle}</h2>
          </div>
          <span class="badge badge--neutral">${C.phase==="coverage"?"Coverage pass":"Adaptive follow-up"}</span>
        </div>

        ${le(C.questionNumber-1,C.totalQuestions,"Diagnostic progress")}

        <div id="diagnostic-question-wrap">
          ${ot(C.question)}
        </div>
      </div>
    </div>
  `}function sn(e,t){P({onBack:()=>e("/lessons")}),document.querySelectorAll(".option-btn").forEach(s=>{s.addEventListener("click",async n=>{if(Z)return;Z=!0;const o=Number.parseInt(n.currentTarget.dataset.index,10);await nn(o,n.currentTarget,e,t)})})}async function nn(e,t,s,n){const o=j.answer(e);if(document.querySelectorAll(".option-btn").forEach(r=>{r.classList.add("option-btn--disabled"),r.disabled=!0}),o.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const r=document.getElementById(`option-${o.correctIndex}`);r&&r.classList.add("option-btn--highlight-correct")}await new Promise(r=>setTimeout(r,500));const i=j.next();if(!i){await on(s);return}C=i,Z=!1,await n()}async function on(e){const t=L(),s=j.getResults();if(!t){e("/student-login");return}const n=await Ot({studentId:t.id,...s});mt(),e(`/diagnostic-results/${n.id}`)}const an="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function rn(e){const t=e.objectives.slice(0,2).join("; "),s=(e.keyTerms||[]).slice(0,3).map(n=>`${n.word}: ${n.definition}`).join("; ");return`${e.title}. Objectives: ${t}. Key terms: ${s}`}function ht(e){var a;const t=e.knowledgeGaps.map(i=>i.title).join(", ")||"none identified",s=e.strengths.map(i=>i.title).join(", ")||"still emerging",n=((a=e.recommendedNext)==null?void 0:a.title)||"Lesson 1",o=e.revisionQueue.map(i=>`${i.title} (${i.reason})`).join("; ")||"none";return[`Readiness: ${e.readiness.label}.`,`Completion rate: ${e.completionRate}%.`,`Knowledge gaps: ${t}.`,`Strengths: ${s}.`,`Recommended next lesson: ${n}.`,`Revision queue: ${o}.`].join(" ")}function cn(e){const t=e.toLowerCase();return $.find(s=>t.includes(s.title.toLowerCase())?!0:(s.keyTerms||[]).some(n=>t.includes(n.word.toLowerCase())))||null}function dn(e){var n,o,a;const t=((n=e.strengths[0])==null?void 0:n.title)||"your earliest lessons",s=((o=e.knowledgeGaps[0])==null?void 0:o.title)||((a=e.recommendedNext)==null?void 0:a.title)||"the next lesson";return`You are showing the most confidence in ${t}. Focus next on ${s}, then use the AI Tutor to clear up anything that still feels confusing. Small, steady review sessions will move your readiness up quickly.`}function ln(e,t){var i,r;const s=cn(e),n=t.knowledgeGaps[0],o=t.recommendedNext,a=e.toLowerCase();if(a.includes("next")||a.includes("study")||a.includes("path"))return`Your best next step is ${(o==null?void 0:o.title)||"the next lesson in your path"}. It is recommended because ${n?`${n.title} still needs review`:"it keeps your momentum going"}. After that, revisit one item from your revision queue before taking the quiz.`;if(s){const c=(i=s.keyTerms)==null?void 0:i[0],d=(r=s.objectives)==null?void 0:r[0];return`${s.title} is mainly about ${(d==null?void 0:d.toLowerCase())||"this topic area"}. Start with this idea: ${c?`${c.word} means ${c.definition}`:"focus on the core lesson objective first"}. Then compare it with your own words and try one practice question before moving on.`}return a.includes("struggling")||a.includes("stuck")||a.includes("hard")?`It looks like ${(n==null?void 0:n.title)||"one of your current topics"} needs a slower, more guided review. Break it into two parts: reread the lesson objectives first, then ask me one specific question about a term or idea that is still unclear.`:`I remember your current path is strongest when we keep things focused. Start with ${(o==null?void 0:o.title)||"your next recommended lesson"}, and if a concept feels confusing, ask me about one term or one example at a time so we can unpack it together.`}async function gt(e){var s,n,o,a,i,r;const t=ce();if(!t||!navigator.onLine)return null;try{const c=await fetch(`${an}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.6,maxOutputTokens:300,topP:.9}}),signal:AbortSignal.timeout(12e3)});if(!c.ok)return null;const d=await c.json();return((r=(i=(a=(o=(n=(s=d==null?void 0:d.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:o.parts)==null?void 0:a[0])==null?void 0:i.text)==null?void 0:r.trim())||null}catch{return null}}async function un(e,t,s){const n=["You are a warm, concise learning coach for Basic 7 Computing.",`Student: ${e.name}.`,`Diagnostic readiness: ${t.readiness}.`,ht(s),"Write exactly 3 supportive sentences for the student.","Sentence 1: celebrate one strength.","Sentence 2: explain the most important gap to focus on next.","Sentence 3: give a short action plan using the tutor and the next lesson."].join(`
`),o=await gt(n);return{text:o||dn(s),source:o?"ai":"fallback"}}async function pn({student:e,message:t,history:s=[],profile:n}){const o=$.map(rn).join(`
`),a=s.slice(-8).map(c=>`${c.role}: ${c.content}`).join(`
`),i=["You are ClassConnect Tutor, a supportive Basic 7 Computing tutor.",`Student: ${e.name}.`,ht(n),"Use the profile and memory below. Keep answers clear, age-appropriate, and practical.","If the learner asks what to study next, recommend the personalized path.","If the learner asks about a concept, explain it simply and connect it to one lesson.","Respond in 2 short paragraphs maximum.","Lesson references:",o,"Conversation memory:",a||"No prior messages yet.",`Student message: ${t}`].join(`
`),r=await gt(i);return{text:r||ln(t,n),source:r?"ai":"fallback"}}function Fe(e,t,s){return e.length?e.map(n=>`
    <div class="insight-pill insight-pill--${s}">
      <div class="insight-pill__title">${n.lessonTitle||n.title}</div>
      <div class="insight-pill__meta">${n.accuracy!==void 0?`${Math.round(n.accuracy*100)}% diagnostic accuracy`:n.recommendedFocus||"Ready for the next step"}</div>
    </div>
  `).join(""):`<div class="insight-empty">${t}</div>`}async function mn(e){var c;const t=L(),s=await Xe(Number.parseInt(e,10));if(!t||!s||s.studentId!==t.id)return'<div class="container" style="padding: 2rem;">Diagnostic result not found.</div>';const n=await N(t.id),o=await z(t.id),a=await U(t.id),i=q({diagnostic:n,results:a,progressRecords:o}),r=s.totalQuestions>0?Math.round(s.score/s.totalQuestions*100):0;return`
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
            <div class="diagnostic-metric__value">${((c=i.recommendedNext)==null?void 0:c.lessonId)||1}</div>
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
            ${Fe(s.knowledgeGaps,"No urgent gaps were detected in the diagnostic.","warning")}
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Current Strengths</h3>
          <div class="insight-pill-list">
            ${Fe(s.strengths,"Your strengths will appear here as you build more evidence.","success")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="diagnostic-section__title">Adaptive Content Path</h3>
        <p class="diagnostic-section__subtitle">These lessons are now prioritized using your diagnostic, lesson completion, and quiz evidence.</p>
        <div class="path-preview">
          ${i.recommendedSequence.slice(0,4).map((d,u)=>`
            <button class="path-preview__item" data-lesson-id="${d.lessonId}">
              <div class="path-preview__index">${u+1}</div>
              <div class="path-preview__body">
                <div class="path-preview__title">${d.title}</div>
                <div class="path-preview__meta">${d.masteryPercent}% mastery | ${d.recommendedFocus}</div>
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
  `}function hn(e,t){P({onBack:()=>e("/lessons")});const s=document.getElementById("btn-open-path"),n=document.getElementById("btn-open-tutor"),o=document.getElementById("btn-retake-diagnostic");Xe(Number.parseInt(t,10)).then(async a=>{const i=L();if(!i||!a)return;const r=await N(i.id),c=await z(i.id),d=await U(i.id),u=q({diagnostic:r,results:d,progressRecords:c});s&&s.addEventListener("click",()=>{var y;e(`/lesson/${((y=u.recommendedNext)==null?void 0:y.lessonId)||1}`)}),n&&n.addEventListener("click",()=>{e("/tutor")}),o&&o.addEventListener("click",()=>{e("/diagnostic")}),document.querySelectorAll(".path-preview__item").forEach(y=>{y.addEventListener("click",g=>{const v=Number.parseInt(g.currentTarget.dataset.lessonId,10);e(`/lesson/${v}`)})});const h=await un(i,a,u),m=document.getElementById("diagnostic-insight"),w=document.getElementById("diagnostic-insight-source");m&&(m.textContent=h.text),w&&(w.textContent=h.source==="ai"?"AI generated":"Offline-ready insight",w.className=`badge ${h.source==="ai"?"badge--primary":"badge--neutral"}`)})}const gn=["What should I study next?","Explain RAM and storage in simple words.","Help me review my weakest topic."];let A={studentId:null,messages:[],sending:!1};function vn(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function fn(e){if(A.studentId===e)return;const t=await Ft(e);A={studentId:e,messages:(t==null?void 0:t.messages)||[],sending:!1}}function yn(){return A.messages.length?A.messages.map(e=>`
    <div class="chat-bubble chat-bubble--${e.role}">
      <div class="chat-bubble__role">${e.role==="assistant"?"AI Tutor":"You"}</div>
      <div class="chat-bubble__text">${vn(e.content)}</div>
      ${e.source?`<div class="chat-bubble__meta">${e.source==="ai"?"AI response":"Offline support response"}</div>`:""}
    </div>
  `).join(""):`
      <div class="tutor-empty">
        <div class="tutor-empty__title">Your tutor is ready</div>
        <p class="tutor-empty__text">Ask for an explanation, revision tip, or what to study next. The tutor will answer using your lesson history and diagnostic profile.</p>
      </div>
    `}async function bn(){var a,i,r,c;const e=L();if(!e)return'<div class="container" style="padding: 2rem;">Student session not found.</div>';await fn(e.id);const t=await N(e.id),s=await z(e.id),n=await U(e.id),o=q({diagnostic:t,results:n,progressRecords:s});return`
    ${B({title:"AI Tutor",showBack:!0,studentName:e.name})}
    <div class="container container--narrow view-enter tutor-page">
      <div class="card card--glass tutor-hero">
        <div class="tutor-hero__header">
          <div>
            <div class="diagnostic-hero__eyebrow">Context-aware tutor with memory</div>
            <h1 class="tutor-hero__title">Ask for help at your own pace</h1>
          </div>
          ${A.messages.length?'<button class="btn btn--ghost btn--sm" id="btn-clear-chat">Clear chat</button>':""}
        </div>

        <div class="tutor-hero__chips">
          <span class="badge badge--${o.readiness.tone}">${o.readiness.label}</span>
          <span class="badge badge--primary">Next: ${((a=o.recommendedNext)==null?void 0:a.title)||"Lesson 1"}</span>
          <span class="badge badge--neutral">Risk: ${o.risk.label}</span>
        </div>

        <p class="tutor-hero__memory">
          I remember that your strongest current evidence is in <strong>${((i=o.strengths[0])==null?void 0:i.title)||"the topics you have already practiced"}</strong>,
          while the biggest focus area is <strong>${((r=o.knowledgeGaps[0])==null?void 0:r.title)||((c=o.recommendedNext)==null?void 0:c.title)||"the next lesson in your path"}</strong>.
        </p>
      </div>

      <div class="card tutor-thread-card">
        <div class="tutor-thread" id="tutor-thread">
          ${yn()}
          ${A.sending?'<div class="chat-bubble chat-bubble--assistant"><div class="chat-bubble__role">AI Tutor</div><div class="shimmer" style="height: 52px;"></div></div>':""}
        </div>

        <div class="tutor-prompts">
          ${gn.map(d=>`
            <button class="tutor-prompt" data-prompt="${d}">${d}</button>
          `).join("")}
        </div>

        <form class="tutor-composer" id="tutor-form">
          <textarea id="tutor-input" class="input tutor-composer__input" rows="3" placeholder="Ask a question about a lesson, concept, or what to study next..." ${A.sending?"disabled":""}></textarea>
          <button class="btn btn--primary" type="submit" ${A.sending?"disabled":""}>Send</button>
        </form>
      </div>
    </div>
  `}function wn(e,t){P({onBack:()=>e("/lessons")});const s=document.getElementById("tutor-form"),n=document.getElementById("tutor-input"),o=document.getElementById("btn-clear-chat"),a=document.getElementById("tutor-thread");a&&(a.scrollTop=a.scrollHeight),o&&o.addEventListener("click",async()=>{const i=L();i&&(await Ut(i.id),A={studentId:i.id,messages:[],sending:!1},await t())}),document.querySelectorAll(".tutor-prompt").forEach(i=>{i.addEventListener("click",async r=>{const c=r.currentTarget.dataset.prompt;c&&await Ue(c,t)})}),s&&n&&s.addEventListener("submit",async i=>{i.preventDefault();const r=n.value.trim();if(!r){R("Type a question for the tutor first.","error");return}await Ue(r,t)})}async function Ue(e,t){const s=L();if(!s||A.sending)return;const n=await N(s.id),o=await z(s.id),a=await U(s.id),i=q({diagnostic:n,results:a,progressRecords:o}),r={role:"user",content:e,createdAt:new Date().toISOString()};A={...A,sending:!0,messages:[...A.messages,r]},await Re(s.id,A.messages),await t();const c=await pn({student:s,message:e,history:A.messages,profile:i});A={...A,sending:!1,messages:[...A.messages,{role:"assistant",content:c.text,source:c.source,createdAt:new Date().toISOString()}]},await Re(s.id,A.messages),await t()}function _n(){if(!window.Chart&&!document.getElementById("chartjs-script")){const e=document.createElement("script");e.id="chartjs-script",e.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.js",document.head.appendChild(e)}}let S=window.location.pathname;const ve=document.getElementById("app");async function M(e,t=!0){t&&e!==window.location.pathname&&window.history.pushState({},"",e),S=e,await G()}window.addEventListener("popstate",()=>{S=window.location.pathname,G()});function In(e){return e==="/lessons"||e==="/diagnostic"||e.startsWith("/diagnostic-results/")||e.startsWith("/lesson/")||e.startsWith("/quiz/")||e.startsWith("/quiz-results/")||e==="/tutor"}async function G(){S==="/dashboard"&&!Gt()&&(S="/teacher-login",window.history.replaceState({},"","/teacher-login")),In(S)&&!L()&&(S="/student-login",window.history.replaceState({},"","/student-login"));const e=document.getElementById("app-loader");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),1e3)),S==="/dashboard"&&_n(),S.startsWith("/quiz/")||Rs(),S!=="/diagnostic"&&mt(),ve.firstElementChild&&(ve.firstElementChild.classList.add("view-exit"),await new Promise(n=>setTimeout(n,200)));let t="",s=()=>{};if(S==="/"||S==="/index.html")t=ts(),s=()=>ss(M);else if(S==="/student-login")t=await is(),s=()=>as(M);else if(S==="/teacher-login")t=rs(),s=()=>cs(M);else if(S==="/lessons")t=await _s(),s=()=>Is(M);else if(S==="/diagnostic")en(),t=tn(),s=()=>sn(M,G);else if(S.startsWith("/diagnostic-results/")){const n=S.split("/")[2];t=await mn(n),s=()=>hn(M,n)}else if(S.startsWith("/lesson/")){const n=Number.parseInt(S.split("/")[2],10);t=await ks(n),s=()=>xs(M,n)}else if(S.startsWith("/quiz/")){const n=Number.parseInt(S.split("/")[2],10);Es(n),t=zs(),s=()=>Ps(M,G,n)}else if(S.startsWith("/quiz-results/")){const n=S.split("/")[2];t=await Qs(n),s=()=>Ns(M,n)}else if(S==="/tutor")t=await bn(),s=()=>wn(M,G);else if(S==="/dashboard")t=await Us(),s=()=>Hs(M);else{M("/",!1);return}ve.innerHTML=t,setTimeout(s,0),window.scrollTo(0,0)}window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).has("capture")?0:1500;setTimeout(async()=>{await Et(),Xt(),G()},t)});
