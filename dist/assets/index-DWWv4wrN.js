(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function s(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=s(o);fetch(o.href,i)}})();const se=(e,t)=>t.some(s=>e instanceof s);let ve,fe;function We(){return ve||(ve=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ge(){return fe||(fe=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ne=new WeakMap,V=new WeakMap,G=new WeakMap;function Ke(e){const t=new Promise((s,n)=>{const o=()=>{e.removeEventListener("success",i),e.removeEventListener("error",a)},i=()=>{s(C(e.result)),o()},a=()=>{n(e.error),o()};e.addEventListener("success",i),e.addEventListener("error",a)});return G.set(t,e),t}function Ye(e){if(ne.has(e))return;const t=new Promise((s,n)=>{const o=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",a),e.removeEventListener("abort",a)},i=()=>{s(),o()},a=()=>{n(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",i),e.addEventListener("error",a),e.addEventListener("abort",a)});ne.set(e,t)}let oe={get(e,t,s){if(e instanceof IDBTransaction){if(t==="done")return ne.get(e);if(t==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return C(e[t])},set(e,t,s){return e[t]=s,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function De(e){oe=e(oe)}function Ve(e){return Ge().includes(e)?function(...t){return e.apply(ae(this),t),C(this.request)}:function(...t){return C(e.apply(ae(this),t))}}function Je(e){return typeof e=="function"?Ve(e):(e instanceof IDBTransaction&&Ye(e),se(e,We())?new Proxy(e,oe):e)}function C(e){if(e instanceof IDBRequest)return Ke(e);if(V.has(e))return V.get(e);const t=Je(e);return t!==e&&(V.set(e,t),G.set(t,e)),t}const ae=e=>G.get(e);function Ze(e,t,{blocked:s,upgrade:n,blocking:o,terminated:i}={}){const a=indexedDB.open(e,t),r=C(a);return n&&a.addEventListener("upgradeneeded",c=>{n(C(a.result),c.oldVersion,c.newVersion,C(a.transaction),c)}),s&&a.addEventListener("blocked",c=>s(c.oldVersion,c.newVersion,c)),r.then(c=>{i&&c.addEventListener("close",()=>i()),o&&c.addEventListener("versionchange",u=>o(u.oldVersion,u.newVersion,u))}).catch(()=>{}),r}const Xe=["get","getKey","getAll","getAllKeys","count"],et=["put","add","delete","clear"],J=new Map;function ye(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(J.get(t))return J.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,o=et.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!(o||Xe.includes(s)))return;const i=async function(a,...r){const c=this.transaction(a,o?"readwrite":"readonly");let u=c.store;return n&&(u=u.index(r.shift())),(await Promise.all([u[s](...r),o&&c.done]))[0]};return J.set(t,i),i}De(e=>({...e,get:(t,s,n)=>ye(t,s)||e.get(t,s,n),has:(t,s)=>!!ye(t,s)||e.has(t,s)}));const tt=["continue","continuePrimaryKey","advance"],be={},ie=new WeakMap,Le=new WeakMap,st={get(e,t){if(!tt.includes(t))return e[t];let s=be[t];return s||(s=be[t]=function(...n){ie.set(this,Le.get(this)[t](...n))}),s}};async function*nt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const s=new Proxy(t,st);for(Le.set(s,t),G.set(s,ae(t));t;)yield s,t=await(ie.get(s)||t.continue()),ie.delete(s)}function we(e,t){return t===Symbol.asyncIterator&&se(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&se(e,[IDBIndex,IDBObjectStore])}De(e=>({...e,get(t,s,n){return we(t,s)?nt:e.get(t,s,n)},has(t,s){return we(t,s)||e.has(t,s)}}));const ot="classconnect",at=2,F="settings",H="cc_teacherAuthenticated",$e="cc_currentStudent",it=["apiKey","teacherPin","theme"];let Z=null;function rt(e){if(e.objectStoreNames.contains("students")||e.createObjectStore("students",{keyPath:"id",autoIncrement:!0}).createIndex("name","name",{unique:!1}),e.objectStoreNames.contains("progress")||e.createObjectStore("progress",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),!e.objectStoreNames.contains("quizResults")){const t=e.createObjectStore("quizResults",{keyPath:"id",autoIncrement:!0});t.createIndex("studentId","studentId",{unique:!1}),t.createIndex("lessonId","lessonId",{unique:!1})}e.objectStoreNames.contains(F)||e.createObjectStore(F,{keyPath:"key"})}function A(){return Z||(Z=Ze(ot,at,{upgrade(e){rt(e)}})),Z}function Ce(e){try{return localStorage.getItem(`cc_${e}`)}catch{return null}}function ce(e,t){try{if(t==null||t===""){localStorage.removeItem(`cc_${e}`);return}localStorage.setItem(`cc_${e}`,t)}catch{}}async function de(e,t){await(await A()).put(F,{key:e,value:t,updatedAt:new Date().toISOString()})}async function ct(){const e=await A();await Promise.all(it.map(async t=>{const s=await e.get(F,t);if(s!=null&&s.value){ce(t,s.value);return}const n=Ce(t);n&&await de(t,n)}))}function le(e){return Ce(e)}function dt(e,t){ce(e,t),de(e,t)}async function Me(e,t){ce(e,t),await de(e,t)}function ue(){return le("apiKey")}async function Ee(e){await Me("apiKey",e)}function pe(){return le("teacherPin")}async function Be(e){await Me("teacherPin",e)}async function lt(e,t){const s=await A(),n=await ut(e,t);if(n)return n;const o=new Date().toISOString();return{id:await s.add("students",{name:e.trim(),pin:t,createdAt:o}),name:e.trim(),pin:t,createdAt:o}}async function ut(e,t){return(await(await A()).getAllFromIndex("students","name",e.trim())).find(o=>o.pin===t)||null}async function K(){return(await A()).getAll("students")}async function pt(e,t){const s=await A(),o=(await he(e)).find(r=>r.lessonId===t);if(o)return o;const i=new Date().toISOString();return{id:await s.add("progress",{studentId:e,lessonId:t,completedAt:i}),studentId:e,lessonId:t,completedAt:i}}async function he(e){return(await A()).getAllFromIndex("progress","studentId",e)}async function Pe(){return(await A()).getAll("progress")}async function ht(e,t){return(await he(e)).some(n=>n.lessonId===t)}async function mt(e){const t=await A(),s=new Date().toISOString(),n={...e,completedAt:s},o=await t.add("quizResults",n);return{...n,id:o}}async function q(){return(await A()).getAll("quizResults")}function gt(e){sessionStorage.setItem($e,JSON.stringify(e))}function M(){try{const e=sessionStorage.getItem($e);return e?JSON.parse(e):null}catch{return null}}function Ie(e=!0){if(!e){sessionStorage.removeItem(H);return}sessionStorage.setItem(H,JSON.stringify({authenticated:!0,updatedAt:new Date().toISOString()}))}function vt(){var e;try{const t=sessionStorage.getItem(H);return!!(t&&((e=JSON.parse(t))!=null&&e.authenticated))}catch{return!1}}function ft(){sessionStorage.removeItem(H)}async function yt(){var n;const e=await K(),t=await q();let s=`Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)
`;for(const o of t){const i=e.find(c=>c.id===o.studentId),a=i?i.name:"Unknown",r=Math.round((o.totalTimeMs||0)/1e3);s+=`"${a}",${o.lessonId},${o.score},${o.totalQuestions},${((n=o.theta)==null?void 0:n.toFixed(2))||"N/A"},${o.level||"N/A"},"${o.completedAt}",${r}
`}return s}function bt(e,t="classconnect_data.csv"){const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(s),o=document.createElement("a");o.href=n,o.download=t,o.click(),URL.revokeObjectURL(n)}const wt="dark";function ze(e){return e==="light"?"light":wt}function me(){return ze(le("theme"))}function Qe(e){const t=ze(e);return document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t,t}function It(e){const t=Qe(e);return dt("theme",t),t}function kt(){return It(me()==="dark"?"light":"dark")}function _t(){return Qe(me())}function Re(e){return e==="light"?`
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `:`
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `}function At(){const e=me(),t=e==="dark"?"light":"dark";return`
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${t} theme" title="Switch to ${t} theme">
      ${Re(e)}
    </button>
  `}function T(e={}){const{title:t="ClassConnect",showBack:s=!1,backLabel:n="Back",studentName:o=null,showSettings:i=!1,showLogout:a=!1,logoutLabel:r="Sign out",showThemeToggle:c=!0}=e;return`
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
              ${c?At():""}
              ${i?`
                <button class="btn btn--icon btn--ghost nav__settings-btn" id="nav-settings-btn" aria-label="Settings">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M16.5 10a6.5 6.5 0 01-.4 2.2l1.7 1.3-1.5 2.6-2-.6a6.5 6.5 0 01-3.8 2.2L10 20l-10.5-.3L9 17.7a6.5 6.5 0 01-3.8-2.2l-2 .6L1.7 13.5l1.7-1.3A6.5 6.5 0 013 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              `:""}
              ${a?`
                <button class="btn btn--ghost nav__logout-btn" id="nav-logout-btn" aria-label="${r}">
                  ${r}
                </button>
              `:""}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `}function $(e={}){const{onBack:t=null,onSettings:s=null,onBrand:n=null,onLogout:o=null}=e,i=document.getElementById("nav-back-btn");i&&t&&i.addEventListener("click",t);const a=document.getElementById("nav-settings-btn");a&&s&&a.addEventListener("click",s);const r=document.getElementById("nav-logout-btn");r&&o&&r.addEventListener("click",o);const c=document.getElementById("nav-theme-btn");c&&c.addEventListener("click",()=>{const m=kt(),d=m==="dark"?"light":"dark";c.innerHTML=Re(m),c.setAttribute("aria-label",`Switch to ${d} theme`),c.setAttribute("title",`Switch to ${d} theme`)});const u=document.getElementById("nav-brand");u&&n&&(u.addEventListener("click",n),u.style.cursor="pointer");const p=()=>{const m=document.getElementById("status-dot"),d=document.getElementById("status-text");m&&(m.className=`status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}`),d&&(d.textContent=navigator.onLine?"Online":"Offline")};window.addEventListener("online",p),window.addEventListener("offline",p)}function St(){return`
    ${T({title:"ClassConnect"})}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-12); padding-bottom: var(--space-12);">
      <div style="text-align: center; margin-bottom: var(--space-10);">
        <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--space-4); background: linear-gradient(135deg, var(--color-primary-400), var(--color-accent-400)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: var(--font-weight-extrabold);">
          Welcome to ClassConnect
        </h1>
        <p style="color: var(--text-secondary); font-size: var(--font-size-lg);">
          Learn Computing. Take Adaptive Quizzes. Track Progress.
        </p>
      </div>

      <div style="display: grid; gap: var(--space-6);">
        <button class="card card--glass card--interactive card--glow" id="btn-student" style="text-align: left; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">Student</div>
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2); color: var(--color-primary-300);">I am a Student</h2>
          <p style="color: var(--text-secondary);">Access your lessons, take quizzes, and see your progress.</p>
        </button>

        <button class="card card--glass card--interactive card--glow" id="btn-teacher" style="text-align: left; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-4);">Teacher</div>
          <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2); color: var(--color-accent-300);">I am a Teacher</h2>
          <p style="color: var(--text-secondary);">View class analytics, identify misconceptions, and track student performance.</p>
        </button>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function xt(e){$(),document.getElementById("btn-student").addEventListener("click",()=>{e("/student-login")}),document.getElementById("btn-teacher").addEventListener("click",()=>{e("/teacher-login")})}function ge(e,t,s=""){const n=t>0?Math.round(e/t*100):0;return`
    <div class="progress-container" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100">
      ${s?`<div class="progress-label">${s}</div>`:""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${n}%"></div>
      </div>
      <div class="progress-text">${n}%</div>
    </div>
  `}function Tt(e){const t=["A","B","C","D"];return`
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
  `}function Dt(e){return e==="ai"?'<span class="badge badge--primary">AI Feedback</span>':e==="fallback"?'<span class="badge badge--neutral">Offline Hint</span>':'<span class="badge badge--success">Quick Check</span>'}function qe(e,t){return`
    <div class="card feedback-card ${t?"feedback-card--correct":"feedback-card--incorrect"}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${t?"Correct":"Review"}</span>
        <span class="feedback-card__title">${t?"Correct!":"Let's learn from this"}</span>
        ${Dt(e.source)}
      </div>
      <div class="feedback-card__body">
        ${e.text}
      </div>
      ${e.source==="ai"?'<div class="feedback-card__source">Powered by Gemini AI</div>':""}
    </div>
  `}function N(e,t,s,n="primary",o=""){return`
    <div class="card stat-card stat-card--${n}">
      <div class="stat-card__icon">${e}</div>
      <div class="stat-card__value">${t}</div>
      <div class="stat-card__label">${s}</div>
      ${o?`<div class="stat-card__detail">${o}</div>`:""}
    </div>
  `}let z=null;function _(e,t="info",s=3e3){z||(z=document.createElement("div"),z.className="toast-container",document.body.appendChild(z));const n={success:"OK",error:"X",info:"i"},o=document.createElement("div");o.className=`toast toast--${t}`,o.innerHTML=`<span>${n[t]||""}</span> ${e}`,z.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100%)",o.style.transition="all 0.3s ease-out",setTimeout(()=>o.remove(),300)},s)}function Lt(e,t){const s=t>0?e/t:0,n=2*Math.PI*45,o=n*(1-s);let i="#FB7185";return s>=.8?i="#34D399":s>=.6?i="#818CF8":s>=.4&&(i="#FBBF24"),`
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"/>
        <circle class="ring-fill" cx="50" cy="50" r="45"
          stroke="${i}"
          stroke-dasharray="${n}"
          stroke-dashoffset="${o}"
          style="animation: ringDraw 1.5s ease-out forwards;"
        />
      </svg>
      <div class="quiz-results__score-label">
        <div class="quiz-results__score-value" style="color: ${i}">${e}</div>
        <div class="quiz-results__score-total">out of ${t}</div>
      </div>
    </div>
  `}function Oe(e,t,s=[],n={}){const o=document.createElement("div");o.className="modal-overlay",o.id="modal-overlay";const i=n.modalClass?` ${n.modalClass}`:"";return o.innerHTML=`
    <div class="modal${i}">
      <h3 class="modal__title">${e}</h3>
      <div class="modal__body">${t}</div>
      <div class="modal__actions" id="modal-actions">
        ${s.map((a,r)=>`
          <button class="btn ${a.variant||"btn--ghost"}" id="modal-action-${r}">${a.label}</button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(o),s.forEach((a,r)=>{const c=document.getElementById(`modal-action-${r}`);c&&c.addEventListener("click",async()=>{let u=!0;a.onClick&&(u=await a.onClick(o)!==!1),u&&o.remove()})}),o.addEventListener("click",a=>{a.target===o&&o.remove()}),o}async function $t(){const e=await K();return`
    ${T({title:"ClassConnect",showBack:!0})}
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
          <button type="submit" class="btn btn--primary btn--lg btn--full">Continue to Lessons</button>
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
  `}function Ct(e){$({onBack:()=>e("/")});const t=document.getElementById("login-form"),s=document.getElementById("student-name"),n=document.getElementById("student-pin");t.addEventListener("submit",async o=>{o.preventDefault();const i=s.value.trim(),a=n.value;if(!i||a.length!==4){_("Please enter your name and a 4-digit PIN.","error");return}try{const r=await lt(i,a);gt(r),e("/lessons")}catch(r){console.error(r),_("Login failed. Please try again.","error")}}),document.querySelectorAll(".student-quick-select").forEach(o=>{o.addEventListener("click",i=>{s.value=i.target.dataset.name,n.focus()})})}function Mt(){const t=!pe();return`
    ${T({title:"Teacher Access",showBack:!0})}
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
              <input type="password" id="teacher-api-key" class="input" value="${ue()||""}" placeholder="AIzaSy...">
            </div>
          `:""}

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${t?"Save PIN and Open Dashboard":"Open Dashboard"}
          </button>
        </form>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function Et(e){$({onBack:()=>e("/")});const t=pe(),s=!t,n=document.getElementById("teacher-access-form"),o=document.getElementById("teacher-pin"),i=document.getElementById("teacher-pin-confirm"),a=document.getElementById("teacher-api-key");n.addEventListener("submit",async r=>{r.preventDefault();const c=o.value.trim();if(!/^\d{4}$/.test(c)){_("Enter a valid 4-digit teacher PIN.","error");return}if(s){const u=i==null?void 0:i.value.trim();if(c!==u){_("Teacher PINs do not match yet.","error");return}try{await Be(c),a!=null&&a.value.trim()&&await Ee(a.value.trim()),Ie(!0),_("Teacher access saved for this device.","success"),e("/dashboard")}catch(p){console.error(p),_("Unable to save teacher access right now.","error")}return}if(c!==t){_("That teacher PIN is not correct.","error");return}Ie(!0),e("/dashboard")})}const w=[{id:1,title:"What Is a Computer?",duration:"10 min",objectives:["Define what a computer is and explain its basic purpose","Identify different types of computers used today","Understand how computers have evolved through generations"],keyTerms:[{word:"Computer",definition:"An electronic device that accepts data (input), processes it, and produces useful information (output)."},{word:"Data",definition:"Raw facts and figures that have not yet been processed — such as numbers, words, or images."},{word:"Information",definition:"Data that has been processed and organized so it is meaningful and useful."},{word:"Hardware",definition:"The physical parts of a computer that you can see and touch."},{word:"Software",definition:"Programs and instructions that tell the computer what to do."}],content:`
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
    `}],Bt={1:{src:"/images/lesson-1-computer-types.png",alt:"Illustration of a desktop computer, laptop, tablet, smartphone, and server tower",caption:"Different types of computers suit different jobs, but they all accept data, process it, and give useful results."},2:{src:"/images/lesson-2-inside-computer.png",alt:"Illustration of a desktop tower opened to show the motherboard, CPU, RAM, storage drive, and power supply",caption:"Internal hardware works together through the motherboard so the CPU, memory, storage, and power system can do their jobs."},3:{src:"/images/lesson-3-input-devices.png",alt:"Illustration collage of a keyboard, mouse, touchscreen tablet, microphone, scanner, and webcam",caption:"Input devices help students send text, sound, touch, and images into a computer."},4:{src:"/images/lesson-4-output-devices.png",alt:"Illustration collage of a monitor, printer, speakers, projector, and plotter",caption:"Output devices help the computer present information as visuals, sound, or printed work."},5:{src:"/images/lesson-5-storage-devices.png",alt:"Illustration comparing a hard drive, solid state drive, flash drive, SD card, optical disc, and cloud storage symbol",caption:"Storage devices keep schoolwork, software, and media safe so learners can use them again later."}};async function Pt(){const e=M(),t=e?await he(e.id):[],s=new Set(t.map(n=>n.lessonId));return`
    ${T({title:"Topics",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${ge(s.size,w.length,"Lessons completed")}

      <div class="lesson-list">
        ${w.map((n,o)=>{const i=s.has(n.id);return`
            <div class="card card--interactive lesson-card" data-id="${n.id}">
              <div class="lesson-card__number ${i?"lesson-card__number--completed":""}">
                ${i?"Done":o+1}
              </div>
              <div class="lesson-card__info">
                <div class="lesson-card__title">${n.title}</div>
                <div class="lesson-card__meta">
                  <span>${n.duration}</span>
                  <span>${n.objectives.length} objectives</span>
                </div>
              </div>
              <div class="lesson-card__status">
                ${i?'<span class="badge badge--success">Completed</span>':'<span class="badge badge--neutral">Start</span>'}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function zt(e){$({onBack:()=>e("/")}),document.querySelectorAll(".lesson-card").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.id,10);e(`/lesson/${n}`)})})}async function Qt(e){var a;const t=M(),s=w.find(r=>r.id===e);if(!s)return'<div class="container" style="padding: 2rem;">Lesson not found.</div>';const n=w.indexOf(s),o=t?await ht(t.id,e):!1,i=Bt[e];return`
    ${T({title:"Lesson",showBack:!0,studentName:t==null?void 0:t.name})}

    <div class="container container--narrow view-enter lesson-page">
      ${ge(n+1,w.length,`Lesson ${n+1} of ${w.length}`)}
      <div class="lesson-progress-strip">
        ${w.map((r,c)=>`
          <div class="lesson-progress-pip ${c===n?"lesson-progress-pip--current":""} ${c<n?"lesson-progress-pip--completed":""}"></div>
        `).join("")}
      </div>

      <div class="lesson-header">
        <div class="lesson-header__meta">
          <span class="lesson-header__number">Lesson ${n+1}</span>
          <span class="badge badge--neutral">${s.duration}</span>
        </div>
        <h1 class="lesson-header__title">${s.title}</h1>

        <div class="lesson-header__objectives">
          ${s.objectives.map(r=>`
            <div class="lesson-header__objective">${r}</div>
          `).join("")}
        </div>
      </div>

      <div class="lesson-content">
        ${i?`
          <figure class="lesson-image">
            <img src="${i.src}" alt="${i.alt}" loading="lazy">
            <figcaption class="lesson-image__caption">${i.caption}</figcaption>
          </figure>
        `:""}
        ${s.content}

        ${(a=s.keyTerms)!=null&&a.length?`
          <div class="key-terms">
            <div class="key-terms__title">Key Terms to Remember</div>
            <div class="key-terms__list">
              ${s.keyTerms.map(r=>`
                <div class="key-term">
                  <div class="key-term__word">${r.word}</div>
                  <div class="key-term__def">${r.definition}</div>
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
  `}function Rt(e,t){$({onBack:()=>e("/lessons")});const s=M(),n=w.find(c=>c.id===t),o=w.indexOf(n),i=document.getElementById("btn-mark-complete"),a=document.getElementById("btn-take-quiz"),r=document.getElementById("btn-prev-lesson");r&&r.addEventListener("click",()=>{e(`/lesson/${w[o-1].id}`)}),i&&s&&i.addEventListener("click",async()=>{await pt(s.id,t),i.outerHTML='<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>',a&&(a.removeAttribute("disabled"),a.removeAttribute("title")),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}),a&&a.addEventListener("click",()=>{e(`/quiz/${t}`)})}const ke=[{id:"L1Q1",lessonId:1,stem:"What is the BEST definition of a computer?",options:["A machine that only plays games and videos","An electronic device that accepts data, processes it, and produces information","Any device that uses electricity","A tool used only for typing documents"],correctIndex:1,difficulty:-1.5,discrimination:1.2,guessing:.25},{id:"L1Q2",lessonId:1,stem:"Which of these is NOT a type of computer?",options:["Desktop","Laptop","Calculator","Tablet"],correctIndex:2,difficulty:-.8,discrimination:1,guessing:.25},{id:"L1Q3",lessonId:1,stem:"What technology did FIRST generation computers use?",options:["Microprocessors","Transistors","Vacuum tubes","Integrated circuits"],correctIndex:2,difficulty:.3,discrimination:1.3,guessing:.25},{id:"L1Q4",lessonId:1,stem:"Which generation of computers introduced the microprocessor?",options:["First generation","Second generation","Third generation","Fourth generation"],correctIndex:3,difficulty:.5,discrimination:1.1,guessing:.25},{id:"L1Q5",lessonId:1,stem:"What is the difference between data and information?",options:["Data is processed; information is raw","Data is raw facts; information is processed and meaningful","They mean the same thing","Data is digital; information is analog"],correctIndex:1,difficulty:0,discrimination:1.4,guessing:.25},{id:"L1Q6",lessonId:1,stem:"A smartphone is a type of computer.",options:["True — it processes data and runs programs","False — it is only a phone","True — but only expensive ones","False — it has no keyboard"],correctIndex:0,difficulty:-1,discrimination:.9,guessing:.25},{id:"L1Q7",lessonId:1,stem:"What does the fifth generation of computers focus on?",options:["Vacuum tubes","Transistors","Artificial Intelligence","Magnetic storage"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L1Q8",lessonId:1,stem:"A server is a powerful computer that:",options:["Only stores personal photos","Provides services to other computers on a network","Cannot connect to the internet","Is smaller than a smartphone"],correctIndex:1,difficulty:.8,discrimination:1.3,guessing:.25},{id:"L2Q1",lessonId:2,stem:"What is the CPU often called?",options:["The heart of the computer","The brain of the computer","The body of the computer","The memory of the computer"],correctIndex:1,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L2Q2",lessonId:2,stem:"What is the main function of the motherboard?",options:["To store files permanently","To display images on screen","To connect all computer components and allow them to communicate","To provide internet access"],correctIndex:2,difficulty:-.3,discrimination:1.2,guessing:.25},{id:"L2Q3",lessonId:2,stem:"What happens to data in RAM when the computer is turned off?",options:["It is saved permanently","It is transferred to the monitor","It disappears (is lost)","It moves to the keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.4,guessing:.25},{id:"L2Q4",lessonId:2,stem:"What unit is used to measure the speed of a CPU?",options:["Kilograms (kg)","Gigahertz (GHz)","Megabytes (MB)","Watts (W)"],correctIndex:1,difficulty:.6,discrimination:1.5,guessing:.25},{id:"L2Q5",lessonId:2,stem:"ROM is different from RAM because ROM:",options:["Is faster than RAM","Loses data when power is off","Keeps its data even when the computer is off","Can hold more data than RAM"],correctIndex:2,difficulty:.4,discrimination:1.3,guessing:.25},{id:"L2Q6",lessonId:2,stem:"What does the Power Supply Unit (PSU) do?",options:["Displays images on the screen","Converts wall electricity into the correct voltage for components","Stores programs permanently","Connects the computer to the internet"],correctIndex:1,difficulty:.1,discrimination:1.1,guessing:.25},{id:"L2Q7",lessonId:2,stem:"If a computer has more RAM, it can generally:",options:["Store more files permanently","Run more tasks at the same time without slowing down","Display brighter colors","Connect to faster internet"],correctIndex:1,difficulty:.3,discrimination:1.2,guessing:.25},{id:"L2Q8",lessonId:2,stem:"Which two types of operations does the CPU perform?",options:["Input and output operations","Arithmetic and logic operations","Printing and scanning operations","Storage and display operations"],correctIndex:1,difficulty:.7,discrimination:1.4,guessing:.25},{id:"L3Q1",lessonId:3,stem:"An input device is used to:",options:["Display information to the user","Send data or commands into a computer","Store data permanently","Print documents on paper"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L3Q2",lessonId:3,stem:"Which of the following is an input device?",options:["Printer","Monitor","Keyboard","Speaker"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L3Q3",lessonId:3,stem:"A scanner converts:",options:["Sound into text","Digital files into paper documents","Physical documents into digital images","Video into audio"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L3Q4",lessonId:3,stem:"A touchscreen is special because it is:",options:["Only an input device","Only an output device","Both an input and output device","A storage device"],correctIndex:2,difficulty:-.2,discrimination:1.4,guessing:.25},{id:"L3Q5",lessonId:3,stem:"A microphone captures _____ and converts it into digital data.",options:["Light","Heat","Sound","Motion"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L3Q6",lessonId:3,stem:"A trackpad is a type of:",options:["Output device found on desktops","Pointing device built into laptops","Storage device","Printer accessory"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L3Q7",lessonId:3,stem:"Which input device would you use to capture your face for a video call?",options:["Scanner","Keyboard","Webcam","Printer"],correctIndex:2,difficulty:-.6,discrimination:1.1,guessing:.25},{id:"L3Q8",lessonId:3,stem:"A wireless keyboard connects to the computer using:",options:["A VGA cable","Bluetooth or a USB receiver","An HDMI cable","A power cable"],correctIndex:1,difficulty:.5,discrimination:1.3,guessing:.25},{id:"L4Q1",lessonId:4,stem:"An output device:",options:["Sends data into the computer","Presents processed data from the computer to the user","Stores data permanently on a disk","Provides electricity to the computer"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L4Q2",lessonId:4,stem:"Which of the following is an output device?",options:["Mouse","Scanner","Monitor","Keyboard"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L4Q3",lessonId:4,stem:'A "hard copy" refers to:',options:["A file saved on a hard disk","A physical paper printout of a document","A very difficult document to read","A backup copy on a flash drive"],correctIndex:1,difficulty:.2,discrimination:1.3,guessing:.25},{id:"L4Q4",lessonId:4,stem:"Which type of printer uses a laser beam and toner powder?",options:["Inkjet printer","Laser printer","3D printer","Dot matrix printer"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L4Q5",lessonId:4,stem:"A projector is used to:",options:["Print documents in large sizes","Display the computer's screen as a large image on a wall","Record sound from the computer","Store data on optical discs"],correctIndex:1,difficulty:-.5,discrimination:1.1,guessing:.25},{id:"L4Q6",lessonId:4,stem:"Speakers convert electrical signals into:",options:["Light","Text","Sound","Images"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L4Q7",lessonId:4,stem:"A device that serves as BOTH input and output is called:",options:["A storage device","An I/O device","A processing device","A network device"],correctIndex:1,difficulty:.6,discrimination:1.4,guessing:.25},{id:"L4Q8",lessonId:4,stem:"A plotter is mainly used to:",options:["Play music files","Draw large-format graphics like maps and architectural plans","Scan photographs","Display video on a wall"],correctIndex:1,difficulty:1,discrimination:1.3,guessing:.25},{id:"L5Q1",lessonId:5,stem:"Why do we need storage devices?",options:["To increase the speed of the CPU","To save data permanently so it can be accessed later","To display images on the screen","To connect to the internet"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L5Q2",lessonId:5,stem:"Which storage device uses spinning magnetic disks?",options:["SSD","Flash drive","HDD","SD card"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L5Q3",lessonId:5,stem:"An SSD is faster than an HDD because it:",options:["Uses larger disks","Has no moving parts — it uses flash memory chips","Uses more electricity","Is always connected to the internet"],correctIndex:1,difficulty:.3,discrimination:1.4,guessing:.25},{id:"L5Q4",lessonId:5,stem:"Google Drive is an example of:",options:["An HDD","Cloud storage","An optical disc","A flash drive"],correctIndex:1,difficulty:-.8,discrimination:1,guessing:.25},{id:"L5Q5",lessonId:5,stem:"The correct order of the computing cycle is:",options:["Output → Input → Storage → Processing","Input → Processing → Output → Storage","Processing → Input → Output → Storage","Storage → Output → Input → Processing"],correctIndex:1,difficulty:.5,discrimination:1.5,guessing:.25},{id:"L5Q6",lessonId:5,stem:"Which storage medium has the LARGEST typical capacity?",options:["SD card","CD","Hard Disk Drive (HDD)","Flash drive"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L5Q7",lessonId:5,stem:"Optical discs (like CDs and DVDs) are read using:",options:["A magnetic head","A laser beam","Radio waves","Electrical contacts"],correctIndex:1,difficulty:.7,discrimination:1.3,guessing:.25},{id:"L5Q8",lessonId:5,stem:"When you save a school report to a flash drive and print it, which component is the storage device?",options:["The printer","The monitor","The flash drive","The keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.1,guessing:.25}];function L(e,t=2){return Math.round(e*10**t)/10**t}function Ne(e,t){const{discrimination:s,difficulty:n,guessing:o}=t,i=-s*(e-n);return o+(1-o)/(1+Math.exp(i))}function je(e,t){const s=Ne(e,t),{discrimination:n,guessing:o}=t;if(s<=o||s>=1)return 0;const i=n*n*(s-o)**2,a=(1-o)**2*s*(1-s);return a>0?i/a:0}function qt(e){if(e.length===0)return 0;const t=e.every(a=>a.correct),s=e.every(a=>!a.correct);if(t)return Math.min(3,.5*e.length);if(s)return Math.max(-3,-.5*e.length);let n=0;const o=30,i=.001;for(let a=0;a<o;a+=1){let r=0,c=0;for(const p of e){const m=Ne(n,p.item),d=1-m,{discrimination:l,guessing:f}=p.item,D=(m-f)/(1-f),b=l*D*d;p.correct?r+=b/m:r-=b/d,c-=b*b/(m*d)}if(Math.abs(c)<1e-10)break;const u=r/c;if(n-=u,n=Math.max(-3,Math.min(3,n)),Math.abs(u)<i)break}return n}function X(e,t){let s=0;for(const n of t)s+=je(e,n.item);return s>0?1/Math.sqrt(s):999}function Ot(e,t){let s=null,n=-1/0;for(const o of t){const i=je(e,o);i>n&&(n=i,s=o)}return s}function _e(e){return e<-1?{label:"Beginner",color:"#FB7185",description:"Just getting started — keep learning and practicing!"}:e<0?{label:"Developing",color:"#FBBF24",description:"You understand the basics. Review the tricky parts and try again!"}:e<1?{label:"Proficient",color:"#818CF8",description:"Great understanding! You've got a solid grasp of this topic."}:{label:"Advanced",color:"#34D399",description:"Excellent! You've mastered this topic. Ready for the next challenge!"}}function Nt(e=null,t=10){let s=e?ke.filter(b=>b.lessonId===e):[...ke];s=s.sort(()=>Math.random()-.5);const n=new Set,o=[],i=[];let a=0,r=null,c=0,u=!1,p=null;function m(){if(u)return null;const b=s.filter(I=>!n.has(I.id));return b.length===0||c>=t||c>=5&&X(a,o)<.3?(u=!0,null):(r=Ot(a,b),n.add(r.id),c+=1,p=Date.now(),{question:r,questionNumber:c,totalQuestions:Math.min(t,s.length),currentTheta:a,difficulty:r.difficulty>.5?"Hard":r.difficulty<-.5?"Easy":"Medium"})}function d(b){if(!r)return null;const I=Date.now(),P=a,E=b===r.correctIndex,S={item:r,selectedIndex:b,correct:E,questionNumber:c,presentedAt:p||I,answeredAt:I,elapsedMs:Math.max(0,I-(p||I)),thetaBefore:P};return o.push(S),a=qt(o),S.thetaAfter=a,S.standardErrorAfter=X(a,o),i.push({questionId:r.id,questionNumber:c,thetaBefore:L(P),thetaAfter:L(a),standardErrorAfter:L(S.standardErrorAfter),elapsedMs:S.elapsedMs,correct:E}),p=null,{correct:E,correctIndex:r.correctIndex,thetaBefore:P,thetaAfter:a,standardErrorAfter:S.standardErrorAfter,elapsedMs:S.elapsedMs,level:_e(a)}}function l(){return p?Math.max(0,Date.now()-p):0}function f(){const b=o.filter(y=>y.correct).length,I=_e(a),P=X(a,o),E=o.reduce((y,He)=>y+He.elapsedMs,0),S=o.length>0?Math.round(E/o.length):0;return{score:b,totalQuestions:o.length,theta:L(a),standardError:L(P),level:I.label,levelColor:I.color,levelDescription:I.description,totalTimeMs:E,averageTimeMs:S,thetaTrajectory:i,responses:o.map(y=>({questionId:y.item.id,lessonId:y.item.lessonId,stem:y.item.stem,options:y.item.options,selectedIndex:y.selectedIndex,correctIndex:y.item.correctIndex,correct:y.correct,questionNumber:y.questionNumber,elapsedMs:y.elapsedMs,presentedAt:y.presentedAt,answeredAt:y.answeredAt,thetaBefore:L(y.thetaBefore),thetaAfter:L(y.thetaAfter),standardErrorAfter:L(y.standardErrorAfter)}))}}function D(){return u}return{next:m,answer:d,getCurrentElapsedMs:l,getResults:f,isFinished:D}}const jt={L1Q1:"A computer is specifically an electronic device that accepts data (input), processes it using instructions, and produces useful information (output). It's not limited to games or typing — it can do many things because of its ability to follow programs.",L1Q2:"A calculator can do math, but it is not a general-purpose computer. It cannot run different programs, browse the internet, or process many types of data. Desktops, laptops, and tablets are all types of computers because they can run software and handle many tasks.",L1Q3:"First generation computers (1940s-1950s) used vacuum tubes — large glass tubes that controlled electrical signals. These made the computers huge (filling entire rooms!) and generated a lot of heat. Transistors came in the second generation.",L1Q4:"The fourth generation (1970s to present) introduced the microprocessor — an entire CPU on a single tiny chip. This breakthrough made personal computers, laptops, and smartphones possible. The Intel 4004 (1971) was one of the first microprocessors.",L1Q5:"Data refers to raw, unprocessed facts and figures (like numbers or words). Information is what you get after data has been processed and organized into something meaningful and useful. For example, student scores (data) become a class ranking (information).",L1Q6:"A smartphone is indeed a type of computer! It has a processor (CPU), memory (RAM), storage, input devices (touchscreen, microphone), and output devices (screen, speaker). It runs software programs (apps) just like a desktop computer.",L1Q7:"The fifth generation of computers focuses on Artificial Intelligence (AI) — making computers that can learn, understand human speech, and make decisions. This includes technologies like voice assistants and self-driving cars.",L1Q8:"A server is a powerful computer that provides services to other computers on a network. When you visit a website, a server sends that information to your device. Servers are typically kept in special rooms and run 24/7.",L2Q1:"The CPU is called the 'brain' of the computer because it carries out all instructions and makes decisions. Just like your brain processes information from your senses, the CPU processes data from input devices and tells other components what to do.",L2Q2:"The motherboard is the main circuit board that connects all computer components together and allows them to communicate. Think of it as the 'backbone' or 'highway system' of the computer — everything plugs into it.",L2Q3:"RAM (Random Access Memory) is temporary memory — it only holds data while the computer is running. When you turn off the computer, all data in RAM is lost. That's why you need to save your work to storage (like a hard drive) to keep it.",L2Q4:"CPU speed is measured in Gigahertz (GHz). One GHz means the CPU can perform one billion basic operations per second! A higher GHz number generally means a faster processor. Megabytes measure storage, not speed.",L2Q5:"ROM (Read-Only Memory) keeps its data even when the computer is turned off — this is called 'non-volatile' memory. RAM loses its data when power is off ('volatile'). ROM stores the essential startup instructions the computer needs to begin loading.",L2Q6:"The Power Supply Unit (PSU) converts AC electricity from the wall outlet into DC electricity at the correct voltages that computer components need. Without it, no component inside the computer would receive power.",L2Q7:"More RAM means the computer can hold more data for active tasks at the same time. This allows you to run multiple programs without the computer slowing down. RAM doesn't affect permanent storage — that's the job of hard drives and SSDs.",L2Q8:"The CPU performs two types of operations: arithmetic (math calculations like adding and multiplying) and logic (comparisons like 'Is A equal to B?' or 'Is X greater than Y?'). All computing tasks ultimately break down into these two types.",L3Q1:"An input device is any hardware that allows you to send data or commands INTO a computer. Without input devices, you would have no way to tell the computer what to do. They are the 'doors' through which data enters the computer.",L3Q2:"A keyboard is an input device — you use it to enter text and commands into the computer. Printers, monitors, and speakers are all output devices because they present data FROM the computer to you.",L3Q3:"A scanner takes a physical document or photograph and converts it into a digital image that the computer can store and display. It works in the opposite direction of a printer — a printer takes digital files and puts them ON paper.",L3Q4:"A touchscreen is special because it serves as BOTH an input device (you tap and swipe to send commands) AND an output device (it displays information). This makes it an I/O (input/output) device.",L3Q5:"A microphone captures sound waves from your voice or the environment and converts them into digital data that the computer can process. This is how voice calls, voice recording, and voice assistants work.",L3Q6:"A trackpad (also called touchpad) is a flat, touch-sensitive surface built into laptops that works like a mouse. You move your finger across it to control the cursor. It's a pointing input device.",L3Q7:"A webcam (web camera) captures video and images, which is exactly what you need for a video call. Scanners capture flat documents, keyboards capture text, and printers are output devices — none of them can capture live video of your face.",L3Q8:"Wireless keyboards connect to the computer using either Bluetooth technology or a small USB receiver that plugs into the computer. This eliminates the need for a cable connection between the keyboard and the computer.",L4Q1:"An output device takes processed data from the computer and presents it in a form that humans can understand. Monitors show visual output, speakers produce audio output, and printers create physical output on paper.",L4Q2:"A monitor is an output device — it displays visual information from the computer to you. Mice, scanners, and keyboards are input devices that send data INTO the computer.",L4Q3:"A 'hard copy' is a physical paper printout of a digital document. The word 'hard' refers to the fact that it's a tangible, physical copy you can hold in your hands, as opposed to a 'soft copy' which exists only on the computer screen.",L4Q4:"A laser printer uses a laser beam to create an image on a drum, which then attracts toner powder. The toner is transferred to paper and fused with heat. Laser printers are fast and great for printing large amounts of text.",L4Q5:"A projector takes the computer's visual display and projects it as a large image on a wall or screen. This makes it ideal for classrooms and meetings where many people need to see the same content at once.",L4Q6:"Speakers receive electrical signals from the computer and convert them into sound waves that we can hear. This is how you hear music, voice in videos, system alerts, and all other audio from a computer.",L4Q7:"A device that serves as both input and output is called an I/O (Input/Output) device. A touchscreen is the best example — you input by touching it, and it outputs by displaying information. Some use the term 'interactive device'.",L4Q8:"A plotter is a specialized output device designed to draw large-format graphics, maps, engineering diagrams, and architectural plans. Unlike regular printers that print line by line, plotters use pens to draw continuous, precise lines.",L5Q1:"Storage devices save data permanently so you can access it later, even after the computer is turned off. Without storage, you would lose all your files every time you shut down — RAM only holds data temporarily while the computer is on.",L5Q2:"A Hard Disk Drive (HDD) uses spinning magnetic disks called platters. A read/write head moves across these platters to store and retrieve data. This mechanical process is what makes HDDs slower than SSDs.",L5Q3:"An SSD (Solid State Drive) uses flash memory chips with no moving parts. Since there are no spinning disks or moving heads, data can be read and written much faster. HDDs are slower because they rely on mechanical, moving parts.",L5Q4:"Google Drive is a cloud storage service. Cloud storage means your files are saved on remote servers accessed through the internet, not on a physical device in your hand. Other examples include Dropbox and OneDrive.",L5Q5:"The correct computing cycle is: Input (data enters) → Processing (CPU works on the data) → Output (results are shown) → Storage (data is saved). This is the fundamental pattern that every computing task follows.",L5Q6:"Hard Disk Drives (HDDs) typically have the largest capacity — they can store 500 GB to several terabytes (TB) of data. SD cards, CDs, and flash drives have much smaller capacities compared to modern HDDs.",L5Q7:"Optical discs like CDs, DVDs, and Blu-ray discs are read using a laser beam. The laser reads tiny pits and lands on the disc surface to retrieve data. That's why they're called 'optical' — they use light (optics) technology.",L5Q8:"In this scenario, the flash drive is the storage device — it permanently saves your school report file. The printer is an output device (it produces a paper copy), the monitor is an output device, and the keyboard is an input device."},Ut="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";async function Ue(e,t,s,n){var i,a,r,c,u;const o=ue();if(!o||!navigator.onLine)return j(e);try{const p=Ft(t,s,n),m=await fetch(`${Ut}?key=${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:p}]}],generationConfig:{temperature:.7,maxOutputTokens:200,topP:.9}}),signal:AbortSignal.timeout(1e4)});if(!m.ok)return console.warn("Gemini API error, using fallback:",m.status),j(e);const d=await m.json(),l=(u=(c=(r=(a=(i=d==null?void 0:d.candidates)==null?void 0:i[0])==null?void 0:a.content)==null?void 0:r.parts)==null?void 0:c[0])==null?void 0:u.text;return l?{text:l.trim(),source:"ai",model:"gemini-2.0-flash"}:j(e)}catch(p){return console.warn("AI feedback failed, using fallback:",p.message),j(e)}}function j(e){return{text:jt[e]||"Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!",source:"fallback",model:null}}function Ft(e,t,s){return`You are a friendly, encouraging JHS Computing teacher in Ghana. A student just answered a quiz question wrong. Explain why the correct answer is right in 2-3 simple sentences that a 12-14 year old would understand. Be warm and supportive. Do NOT say "you're wrong" — instead, gently explain the concept.

Question: "${e}"
Student's answer: "${t}"
Correct answer: "${s}"

Give a brief, clear explanation (2-3 sentences only):`}async function Ht(e){const t={},s=e.filter(n=>!n.correct);for(const n of s){const o=n.options[n.selectedIndex],i=n.options[n.correctIndex];t[n.questionId]=await Ue(n.questionId,n.stem,o,i)}return t}let k=null,W=null,B=null,h=null,R=!1,U=null;function Fe(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function O(){U&&(window.clearInterval(U),U=null)}function Ae(){const e=document.getElementById("question-timer");!e||!k||(e.textContent=Fe(k.getCurrentElapsedMs()))}function Wt(){O(),Ae(),U=window.setInterval(Ae,1e3)}function Gt(e){O(),W=Number.parseInt(e,10),k=Nt(W),B=k.next(),h=null,R=!1}function Kt(e){const t=Number.parseInt(e,10);(!k||W!==t)&&Gt(t)}function Yt(){O(),k=null,W=null,B=null,h=null,R=!1}function Vt(){if(!k||!B)return'<div class="container">Error initializing quiz.</div>';const e=M(),t=B;let s="";return h?s=`
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${Fe(h.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${h.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${h.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${h.stem}</p>

        <div class="results-review">
          <div class="review-item ${h.correct?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${h.correct?"review-item__correct-answer":"review-item__your-answer"}">${h.studentAnswerText}</span></div>
            </div>
            ${h.correct?"":`
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${h.correctAnswerText}</span></div>
              </div>
            `}
          </div>
        </div>

        <div style="margin-top: var(--space-6);" id="feedback-container">
          ${h.aiText?qe({source:h.source,text:h.aiText},h.correct):'<div class="shimmer" style="height: 100px; width: 100%;"></div>'}
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${k.isFinished()?"See Final Results":"Next Question"}
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

      ${ge(t.questionNumber-1,t.totalQuestions,"Quiz progress")}

      <div id="question-container">
        ${Tt(t.question)}
      </div>
    `,`
    ${T({title:"Adaptive Quiz",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${s}
    </div>
  `}function Jt(e,t,s){if($({onBack:()=>e(`/lesson/${s}`)}),h){O();const o=document.getElementById("btn-next-question");o&&o.addEventListener("click",async()=>{if(h=null,k.isFinished()){await Se(e,s);return}const i=k.next();if(!i){await Se(e,s);return}B=i,t()}),!h.aiText&&!h.correct&&Ue(h.questionId,h.stem,h.studentAnswerText,h.correctAnswerText).then(i=>{h.aiText=i.text,h.source=i.source;const a=document.getElementById("feedback-container");a&&(a.innerHTML=qe({source:i.source,text:i.text},!1))});return}Wt(),document.querySelectorAll(".option-btn").forEach(o=>{o.addEventListener("click",i=>{if(R)return;R=!0;const a=Number.parseInt(i.currentTarget.dataset.index,10);Zt(a,i.currentTarget,t)})})}function Zt(e,t,s){const n=k.answer(e),o=B.question;if(O(),document.querySelectorAll(".option-btn").forEach(a=>{a.classList.add("option-btn--disabled"),a.disabled=!0}),n.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const a=document.getElementById(`option-${n.correctIndex}`);a&&a.classList.add("option-btn--highlight-correct")}h={questionId:o.id,stem:o.stem,correct:n.correct,studentAnswerText:o.options[e],correctAnswerText:o.options[n.correctIndex],aiText:n.correct?"Great work — you understood this concept.":null,source:n.correct?"system":null,elapsedMs:n.elapsedMs,thetaAfter:n.thetaAfter,levelLabel:n.level.label},setTimeout(()=>{R=!1,s()},1e3)}async function Se(e,t){const s=M(),n=k.getResults();if(!s){e("/lessons");return}const o=await mt({studentId:s.id,lessonId:Number.parseInt(t,10),...n});e(`/quiz-results/${o.id}`)}function re(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}async function Xt(e){const t=M(),n=(await q()).find(o=>o.id===Number.parseInt(e,10));return n?`
    ${T({title:"Quiz Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Lessons"})}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${Lt(n.score,n.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${n.levelColor};">
          Level: ${n.level}
        </div>
        <p class="quiz-results__level-desc">${n.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${re(n.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${re(n.averageTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Standard error</span>
          <span class="quiz-result-metric__value">${n.standardError}</span>
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
        <button class="btn btn--primary btn--lg" id="btn-next-lesson">Continue to Next Lesson</button>
        <button class="btn btn--ghost" id="btn-retry-quiz">Retry Quiz</button>
      </div>
    </div>
  `:'<div class="container">Result not found.</div>'}function es(e,t){$({onBack:()=>e("/lessons")});const s=document.getElementById("btn-next-lesson"),n=document.getElementById("btn-retry-quiz");q().then(o=>{const i=o.find(a=>a.id===Number.parseInt(t,10));i&&(s&&s.addEventListener("click",()=>{const a=i.lessonId+1;e(a<=5?`/lesson/${a}`:"/lessons")}),n&&n.addEventListener("click",()=>{e(`/quiz/${i.lessonId}`)}),ts(i.responses))})}async function ts(e){const t=document.getElementById("review-list");if(!t)return;t.innerHTML=e.map(n=>ee(n,null)).join("");const s=await Ht(e);t.innerHTML=e.map(n=>n.correct?ee(n,{text:"Correct! You handled this concept well.",source:"system"}):ee(n,s[n.questionId])).join("")}function ee(e,t){const s=e.options[e.selectedIndex],n=e.options[e.correctIndex];let o="";return t?e.correct||(o=`
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
        <span>Time: ${re(e.elapsedMs)}</span>
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
  `}let g=null,Q=[];function xe(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function ss(e){const t={};return e.slice().sort((s,n)=>new Date(s.completedAt)-new Date(n.completedAt)).forEach(s=>{t[s.studentId]=s}),Object.values(t)}function ns(e,t,s){const n=ss(t),o=e.length>0?Math.round(s.length/(e.length*w.length)*100):0,i=n.length>0?Math.round(n.reduce((l,f)=>l+f.score/f.totalQuestions,0)/n.length*100):0,a=n.filter(l=>l.theta<-.5).length,r={},c={};for(const l of t)r[l.lessonId]=(r[l.lessonId]||0)+l.score/l.totalQuestions,c[l.lessonId]=(c[l.lessonId]||0)+1;const u=w.map(l=>c[l.id]?Math.round(r[l.id]/c[l.id]*100):0),p={Advanced:0,Proficient:0,Developing:0,Beginner:0};for(const l of n)p[l.level]!==void 0&&(p[l.level]+=1);const m={};for(const l of t)for(const f of l.responses){if(f.correct)continue;const D=`${f.questionId}|${f.stem}|${f.options[f.selectedIndex]}`;m[D]=(m[D]||0)+1}const d=Object.entries(m).map(([l,f])=>{const[D,b,I]=l.split("|");return{questionId:D,stem:b,answer:I,count:f}}).sort((l,f)=>f.count-l.count).slice(0,7);return{students:e,results:t,progressRecords:s,latestResults:n,summary:{totalStudents:e.length,averageScore:i,completionRate:o,studentsAtRisk:a},charts:{lessonLabels:w.map(l=>`Lesson ${l.id}`),lessonScoreData:u,levelCounts:p,misconceptions:d}}}async function os(){const e=await K(),t=await q(),s=await Pe();if(g=ns(e,t,s),e.length===0)return`
      ${T({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
      <div class="container view-enter dashboard-page" style="padding-top: var(--space-8);">
        <div class="empty-state">
          <div class="empty-state__icon">Data</div>
          <h2 class="empty-state__title">No Data Yet</h2>
          <p class="empty-state__text">Students need to log in and take quizzes before analytics will appear here.</p>
        </div>
      </div>
    `;const{summary:n}=g;return`
    ${T({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div class="dashboard-header">
        <h1 class="dashboard-header__title">Class Overview</h1>
        <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
      </div>

      <div class="stat-grid">
        ${N("Students",n.totalStudents,"Total Students","primary",`${g.results.length} quizzes recorded`)}
        ${N("Average",`${n.averageScore}%`,"Average Score","accent","Latest quiz per student")}
        ${N("Progress",`${n.completionRate}%`,"Completion Rate","success",`${g.progressRecords.length} lesson completions logged`)}
        ${N("Support",n.studentsAtRisk,"Students At Risk",n.studentsAtRisk>0?"danger":"success","Theta below -0.5")}
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

      <div class="student-section">
        <div class="student-section__header">
          <div>
            <h3 class="student-section__title">Student Roster</h3>
            <p class="dashboard-header__subtitle">Tap a student row to open quiz history, theta trajectory, and per-question performance.</p>
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
                <th>Latest Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${e.map(o=>{const i=t.filter(p=>p.studentId===o.id).sort((p,m)=>new Date(m.completedAt)-new Date(p.completedAt)),a=i[0],r=s.filter(p=>p.studentId===o.id).length;let c="No Data",u="neutral";return a&&(a.theta<-.5?(c="At Risk",u="danger"):a.theta<.5?(c="Needs Help",u="warning"):(c="On Track",u="success")),`
                  <tr class="student-row" data-id="${o.id}">
                    <td class="student-table__name">${o.name}</td>
                    <td>${r}/${w.length}</td>
                    <td>${i.length}</td>
                    <td class="student-table__score">${a?`${Math.round(a.score/a.totalQuestions*100)}%`:"-"}</td>
                    <td>${a?a.level:"-"}</td>
                    <td><span class="badge badge--${u}">${c}</span></td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `}function as(e){$({onBack:()=>e("/"),onSettings:is,onLogout:()=>{ft(),e("/")}});const t=document.getElementById("btn-export-csv");if(t&&t.addEventListener("click",async()=>{const s=await yt();bt(s),_("Data exported successfully","success")}),window.Chart)Te();else{const s=document.getElementById("chartjs-script");s&&s.addEventListener("load",Te,{once:!0})}document.querySelectorAll(".student-row").forEach(s=>{s.addEventListener("click",n=>{const o=Number.parseInt(n.currentTarget.dataset.id,10);rs(o)})})}function is(){const e=ue()||"",t=pe()||"",s=`
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${e}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Required for personalized AI feedback. You can update this any time.</p>
    </div>
    <div class="input-group">
      <label>Teacher PIN</label>
      <input type="password" id="settings-teacher-pin" class="input input--pin" value="${t}" placeholder="0000" maxlength="4" inputmode="numeric">
    </div>
  `;Oe("Dashboard Settings",s,[{label:"Cancel",variant:"btn--ghost"},{label:"Save",variant:"btn--primary",onClick:async()=>{const n=document.getElementById("settings-api-key"),o=document.getElementById("settings-teacher-pin"),i=(n==null?void 0:n.value.trim())||"",a=(o==null?void 0:o.value.trim())||"";return a&&!/^\d{4}$/.test(a)?(_("Teacher PIN must stay 4 digits.","error"),!1):(await Ee(i),a&&await Be(a),_("Settings saved","success"),!0)}}])}async function rs(e){const t=(g==null?void 0:g.students)||await K(),s=(g==null?void 0:g.results)||await q(),n=(g==null?void 0:g.progressRecords)||await Pe(),o=t.find(d=>d.id===e),i=s.filter(d=>d.studentId===e).sort((d,l)=>new Date(d.completedAt)-new Date(l.completedAt)),a=i.at(-1),r=i.length>0?Math.round(i.reduce((d,l)=>d+l.score/l.totalQuestions,0)/i.length*100):0,c=n.filter(d=>d.studentId===e).length,u=i.flatMap(d=>d.responses.map(l=>({...l,lessonId:d.lessonId,completedAt:d.completedAt}))).sort((d,l)=>new Date(l.answeredAt||l.completedAt)-new Date(d.answeredAt||d.completedAt));if(!o)return;const m=`
    <div class="student-detail">
      <div class="student-detail__header">
        <div class="student-detail__avatar">${o.name.slice(0,2).toUpperCase()}</div>
        <div>
          <div class="student-detail__name">${o.name}</div>
          <div class="dashboard-header__subtitle">Lessons completed: ${c}/${w.length}</div>
        </div>
      </div>

      <div class="student-detail__stats">
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${i.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${r}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${a?a.level:"-"}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${a?xe(a.averageTimeMs):"00:00"}</div>
          <div class="student-detail__stat-label">Avg Question Time</div>
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
            ${i.length>0?i.slice().reverse().map(d=>{var l;return`
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${d.lessonId}: ${((l=w.find(f=>f.id===d.lessonId))==null?void 0:l.title)||"Unknown"}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${new Date(d.completedAt).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: var(--font-weight-bold); color: ${d.score/d.totalQuestions>=.7?"var(--color-success-400)":"var(--color-warning-400)"};">${Math.round(d.score/d.totalQuestions*100)}%</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">theta ${d.theta.toFixed(2)}</div>
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
              ${u.length>0?u.slice(0,18).map(d=>`
                <tr>
                  <td>${d.lessonId}</td>
                  <td>
                    <div class="student-detail__question">${d.stem}</div>
                    <div class="student-detail__question-sub">${d.options[d.selectedIndex]} ${d.correct?"":`→ ${d.options[d.correctIndex]}`}</div>
                  </td>
                  <td><span class="badge badge--${d.correct?"success":"danger"}">${d.correct?"Correct":"Review"}</span></td>
                  <td>${xe(d.elapsedMs)}</td>
                  <td>${d.thetaAfter}</td>
                </tr>
              `).join(""):'<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;Oe("Student Profile",m,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),window.Chart&&i.length>0&&setTimeout(()=>ds(i),0)}function cs(){Q.forEach(e=>e.destroy()),Q=[]}function Te(){if(!window.Chart||!g)return;cs();const{Chart:e}=window;e.defaults.color="#94A3B8",e.defaults.borderColor="rgba(148, 163, 184, 0.1)";const t=document.getElementById("chart-scores");t&&Q.push(new e(t,{type:"bar",data:{labels:g.charts.lessonLabels,datasets:[{label:"Average Score (%)",data:g.charts.lessonScoreData,backgroundColor:"rgba(99, 102, 241, 0.8)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100}}}}));const s=document.getElementById("chart-levels");s&&Q.push(new e(s,{type:"doughnut",data:{labels:Object.keys(g.charts.levelCounts),datasets:[{data:Object.values(g.charts.levelCounts),backgroundColor:["#34D399","#818CF8","#FBBF24","#FB7185"],borderWidth:0,cutout:"70%"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right"}}}}));const n=document.getElementById("chart-misconceptions");if(n){const o=g.charts.misconceptions.map(a=>a.stem),i=g.charts.misconceptions.map(a=>a.count);Q.push(new e(n,{type:"bar",data:{labels:o,datasets:[{label:"Times missed",data:i,backgroundColor:"rgba(244, 63, 94, 0.75)",borderRadius:6}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{tooltip:{callbacks:{label(a){const r=g.charts.misconceptions[a.dataIndex];return`${a.raw} misses — common wrong answer: ${r.answer}`}}}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{ticks:{callback(a,r){return`Q${r+1}`}}}}}}))}}function ds(e){const t=document.getElementById("student-theta-chart");if(!t||!window.Chart)return;const{Chart:s}=window,n=e.map(i=>`L${i.lessonId}`),o=e.map(i=>i.theta);new s(t,{type:"line",data:{labels:n,datasets:[{label:"Theta",data:o,borderColor:"#818CF8",backgroundColor:"rgba(129, 140, 248, 0.15)",fill:!0,tension:.35,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{min:-3,max:3}},plugins:{legend:{display:!1}}}})}function ls(){if(!window.Chart&&!document.getElementById("chartjs-script")){const e=document.createElement("script");e.id="chartjs-script",e.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.js",document.head.appendChild(e)}}let v=window.location.pathname;const te=document.getElementById("app");async function x(e,t=!0){t&&e!==window.location.pathname&&window.history.pushState({},"",e),v=e,await Y()}window.addEventListener("popstate",()=>{v=window.location.pathname,Y()});function us(e){return e==="/lessons"||e.startsWith("/lesson/")||e.startsWith("/quiz/")||e.startsWith("/quiz-results/")}async function Y(){v==="/dashboard"&&!vt()&&(v="/teacher-login",window.history.replaceState({},"","/teacher-login")),us(v)&&!M()&&(v="/student-login",window.history.replaceState({},"","/student-login"));const e=document.getElementById("app-loader");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),1e3)),v==="/dashboard"&&ls(),v.startsWith("/quiz/")||Yt(),te.firstElementChild&&(te.firstElementChild.classList.add("view-exit"),await new Promise(n=>setTimeout(n,200)));let t="",s=()=>{};if(v==="/"||v==="/index.html")t=St(),s=()=>xt(x);else if(v==="/student-login")t=await $t(),s=()=>Ct(x);else if(v==="/teacher-login")t=Mt(),s=()=>Et(x);else if(v==="/lessons")t=await Pt(),s=()=>zt(x);else if(v.startsWith("/lesson/")){const n=Number.parseInt(v.split("/")[2],10);t=await Qt(n),s=()=>Rt(x,n)}else if(v.startsWith("/quiz/")){const n=Number.parseInt(v.split("/")[2],10);Kt(n),t=Vt(),s=()=>Jt(x,Y,n)}else if(v.startsWith("/quiz-results/")){const n=v.split("/")[2];t=await Xt(n),s=()=>es(x,n)}else if(v==="/dashboard")t=await os(),s=()=>as(x);else{x("/",!1);return}te.innerHTML=t,setTimeout(s,0),window.scrollTo(0,0)}window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).has("capture")?0:1500;setTimeout(async()=>{await ct(),_t(),Y()},t)});
