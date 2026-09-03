(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const st=(e,t)=>t.some(s=>e instanceof s);let St,$t;function js(){return St||(St=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ns(){return $t||($t=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const nt=new WeakMap,He=new WeakMap,Oe=new WeakMap;function Os(e){const t=new Promise((s,n)=>{const a=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{s(ae(e.result)),a()},i=()=>{n(e.error),a()};e.addEventListener("success",o),e.addEventListener("error",i)});return Oe.set(t,e),t}function Fs(e){if(nt.has(e))return;const t=new Promise((s,n)=>{const a=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{s(),a()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});nt.set(e,t)}let at={get(e,t,s){if(e instanceof IDBTransaction){if(t==="done")return nt.get(e);if(t==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return ae(e[t])},set(e,t,s){return e[t]=s,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Gt(e){at=e(at)}function Us(e){return Ns().includes(e)?function(...t){return e.apply(it(this),t),ae(this.request)}:function(...t){return ae(e.apply(it(this),t))}}function Hs(e){return typeof e=="function"?Us(e):(e instanceof IDBTransaction&&Fs(e),st(e,js())?new Proxy(e,at):e)}function ae(e){if(e instanceof IDBRequest)return Os(e);if(He.has(e))return He.get(e);const t=Hs(e);return t!==e&&(He.set(e,t),Oe.set(t,e)),t}const it=e=>Oe.get(e);function Ws(e,t,{blocked:s,upgrade:n,blocking:a,terminated:o}={}){const i=indexedDB.open(e,t),r=ae(i);return n&&i.addEventListener("upgradeneeded",d=>{n(ae(i.result),d.oldVersion,d.newVersion,ae(i.transaction),d)}),s&&i.addEventListener("blocked",d=>s(d.oldVersion,d.newVersion,d)),r.then(d=>{o&&d.addEventListener("close",()=>o()),a&&d.addEventListener("versionchange",c=>a(c.oldVersion,c.newVersion,c))}).catch(()=>{}),r}const Gs=["get","getKey","getAll","getAllKeys","count"],Ks=["put","add","delete","clear"],We=new Map;function xt(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(We.get(t))return We.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,a=Ks.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!(a||Gs.includes(s)))return;const o=async function(i,...r){const d=this.transaction(i,a?"readwrite":"readonly");let c=d.store;return n&&(c=c.index(r.shift())),(await Promise.all([c[s](...r),a&&d.done]))[0]};return We.set(t,o),o}Gt(e=>({...e,get:(t,s,n)=>xt(t,s)||e.get(t,s,n),has:(t,s)=>!!xt(t,s)||e.has(t,s)}));const Ys=["continue","continuePrimaryKey","advance"],At={},ot=new WeakMap,Kt=new WeakMap,Vs={get(e,t){if(!Ys.includes(t))return e[t];let s=At[t];return s||(s=At[t]=function(...n){ot.set(this,Kt.get(this)[t](...n))}),s}};async function*Js(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const s=new Proxy(t,Vs);for(Kt.set(s,t),Oe.set(s,it(t));t;)yield s,t=await(ot.get(s)||t.continue()),ot.delete(s)}function Ct(e,t){return t===Symbol.asyncIterator&&st(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&st(e,[IDBIndex,IDBObjectStore])}Gt(e=>({...e,get(t,s,n){return Ct(t,s)?Js:e.get(t,s,n)},has(t,s){return Ct(t,s)||e.has(t,s)}}));const Zs="classconnect",Xs=6,Re="settings",J="feedbackCache",rt="classconnect:datachange",en="classconnect-data-sync",ze="cc_teacherAuthenticated",Yt="cc_currentStudent",tn=["apiKey","teacherPin","theme"];let Ge=null,Ke=null;var De,Wt;const Vt=((Wt=(De=globalThis.crypto)==null?void 0:De.randomUUID)==null?void 0:Wt.call(De))||`cc-${Date.now()}-${Math.random().toString(16).slice(2)}`;function Jt(){return typeof BroadcastChannel>"u"?null:(Ke||(Ke=new BroadcastChannel(en)),Ke)}function ee(e,t,s=null){var a;const n={store:e,action:t,recordId:(s==null?void 0:s.id)??(s==null?void 0:s.studentId)??(s==null?void 0:s.cacheKey)??null,timestamp:new Date().toISOString(),sourceId:Vt};typeof window<"u"&&window.dispatchEvent(new CustomEvent(rt,{detail:n}));try{(a=Jt())==null||a.postMessage(n)}catch{}return n}function sn(e){const t=a=>{a!=null&&a.detail&&e(a.detail)};typeof window<"u"&&window.addEventListener(rt,t);const s=Jt(),n=a=>{!(a!=null&&a.data)||a.data.sourceId===Vt||e(a.data)};return s==null||s.addEventListener("message",n),()=>{typeof window<"u"&&window.removeEventListener(rt,t),s==null||s.removeEventListener("message",n)}}function nn(e){if(e.objectStoreNames.contains("students")||e.createObjectStore("students",{keyPath:"id",autoIncrement:!0}).createIndex("name","name",{unique:!1}),e.objectStoreNames.contains("progress")||e.createObjectStore("progress",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),!e.objectStoreNames.contains("quizResults")){const t=e.createObjectStore("quizResults",{keyPath:"id",autoIncrement:!0});t.createIndex("studentId","studentId",{unique:!1}),t.createIndex("lessonId","lessonId",{unique:!1})}if(e.objectStoreNames.contains("diagnostics")||e.createObjectStore("diagnostics",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),e.objectStoreNames.contains("tutorThreads")||e.createObjectStore("tutorThreads",{keyPath:"studentId"}),e.objectStoreNames.contains("assessments")||e.createObjectStore("assessments",{keyPath:"id",autoIncrement:!0}).createIndex("createdAt","createdAt",{unique:!1}),!e.objectStoreNames.contains("assessmentSubmissions")){const t=e.createObjectStore("assessmentSubmissions",{keyPath:"id",autoIncrement:!0});t.createIndex("assessmentId","assessmentId",{unique:!1}),t.createIndex("studentId","studentId",{unique:!1})}if(!e.objectStoreNames.contains(J)){const t=e.createObjectStore(J,{keyPath:"cacheKey"});t.createIndex("questionId","questionId",{unique:!1}),t.createIndex("updatedAt","updatedAt",{unique:!1})}e.objectStoreNames.contains(Re)||e.createObjectStore(Re,{keyPath:"key"})}function x(){return Ge||(Ge=Ws(Zs,Xs,{upgrade(e){nn(e)}})),Ge}function Zt(e){try{return localStorage.getItem(`cc_${e}`)}catch{return null}}function pt(e,t){try{if(t==null||t===""){localStorage.removeItem(`cc_${e}`);return}localStorage.setItem(`cc_${e}`,t)}catch{}}async function mt(e,t){await(await x()).put(Re,{key:e,value:t,updatedAt:new Date().toISOString()})}async function an(){const e=await x();await Promise.all(tn.map(async t=>{const s=await e.get(Re,t);if(s!=null&&s.value){pt(t,s.value);return}const n=Zt(t);n&&await mt(t,n)}))}function ht(e){return Zt(e)}function on(e,t){pt(e,t),mt(e,t)}async function Xt(e,t){pt(e,t),await mt(e,t)}function pe(){return ht("apiKey")}async function es(e){await Xt("apiKey",e)}function gt(){return ht("teacherPin")}async function ts(e){await Xt("teacherPin",e)}async function rn(e,t){const s=await x(),n=await cn(e,t);if(n)return n;const a=new Date().toISOString(),i={id:await s.add("students",{name:e.trim(),pin:t,createdAt:a}),name:e.trim(),pin:t,createdAt:a};return ee("students","create",i),i}async function cn(e,t){return(await(await x()).getAllFromIndex("students","name",e.trim())).find(a=>a.pin===t)||null}async function Se(){return(await x()).getAll("students")}async function dn(e,t){const s=await x(),a=(await O(e)).find(d=>d.lessonId===t);if(a)return a;const o=new Date().toISOString(),r={id:await s.add("progress",{studentId:e,lessonId:t,completedAt:o}),studentId:e,lessonId:t,completedAt:o};return ee("progress","create",r),r}async function O(e){return(await x()).getAllFromIndex("progress","studentId",e)}async function ss(){return(await x()).getAll("progress")}async function ln(e,t){return(await O(e)).some(n=>n.lessonId===t)}async function un(e){const t=await x(),s=new Date().toISOString(),n={...e,completedAt:s},a=await t.add("quizResults",n),o={...n,id:a};return ee("quizResults","create",o),o}async function ie(e){return(await x()).getAllFromIndex("quizResults","studentId",e)}async function $e(){return(await x()).getAll("quizResults")}async function pn(e){const t=await x(),s=new Date().toISOString(),n={...e,completedAt:s},a=await t.add("diagnostics",n),o={...n,id:a};return ee("diagnostics","create",o),o}async function ns(e){return(await x()).get("diagnostics",e)}async function mn(e){return(await x()).getAllFromIndex("diagnostics","studentId",e)}async function G(e){return(await mn(e)).slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt))[0]||null}async function as(){return(await x()).getAll("diagnostics")}async function hn(e){return(await x()).get("tutorThreads",e)}async function Tt(e,t){const s=await x(),n={studentId:e,messages:t.slice(-20),updatedAt:new Date().toISOString()};return await s.put("tutorThreads",n),ee("tutorThreads","upsert",n),n}async function gn(e){await(await x()).delete("tutorThreads",e),ee("tutorThreads","delete",{studentId:e})}async function vn(e){const t=await x(),s={...e,createdAt:e.createdAt||new Date().toISOString()},n=await t.add("assessments",s),a={...s,id:n};return ee("assessments","create",a),a}async function fn(e){return(await x()).get("assessments",e)}async function xe(){return(await x()).getAll("assessments")}async function bn(e){const t=await x(),s={...e,completedAt:e.completedAt||new Date().toISOString()},n=await t.add("assessmentSubmissions",s),a={...s,id:n};return ee("assessmentSubmissions","create",a),a}async function is(e){return(await x()).getAllFromIndex("assessmentSubmissions","studentId",e)}async function Ae(){return(await x()).getAll("assessmentSubmissions")}async function yn(e){return(await x()).get(J,e)}async function wn(e){return(await x()).getAllFromIndex(J,"questionId",e)}async function _n(e){const t=await x(),s=await t.get(J,e.cacheKey),n=new Date().toISOString(),a={...s,...e,createdAt:(s==null?void 0:s.createdAt)||e.createdAt||n,updatedAt:n,usageCount:e.usageCount||(s?(s.usageCount||0)+1:1),lastUsedAt:e.lastUsedAt||n};return await t.put(J,a),a}async function vt(e){const t=await x(),s=await t.get(J,e);if(!s)return null;const n={...s,usageCount:(s.usageCount||0)+1,lastUsedAt:new Date().toISOString()};return await t.put(J,n),n}function In(e){sessionStorage.setItem(Yt,JSON.stringify(e))}function L(){try{const e=sessionStorage.getItem(Yt);return e?JSON.parse(e):null}catch{return null}}function Lt(e=!0){if(!e){sessionStorage.removeItem(ze);return}sessionStorage.setItem(ze,JSON.stringify({authenticated:!0,updatedAt:new Date().toISOString()}))}function Dt(){var e;try{const t=sessionStorage.getItem(ze);return!!(t&&((e=JSON.parse(t))!=null&&e.authenticated))}catch{return!1}}function kn(){sessionStorage.removeItem(ze)}async function Sn(){var n;const e=await Se(),t=await $e();let s=`Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)
`;for(const a of t){const o=e.find(d=>d.id===a.studentId),i=o?o.name:"Unknown",r=Math.round((a.totalTimeMs||0)/1e3);s+=`"${i}",${a.lessonId},${a.score},${a.totalQuestions},${((n=a.theta)==null?void 0:n.toFixed(2))||"N/A"},${a.level||"N/A"},"${a.completedAt}",${r}
`}return s}function $n(e,t="classconnect_data.csv"){const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(s),a=document.createElement("a");a.href=n,a.download=t,a.click(),URL.revokeObjectURL(n)}const xn="dark";function os(e){return e==="light"?"light":xn}function ft(){return os(ht("theme"))}function rs(e){const t=os(e);return document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t,t}function An(e){const t=rs(e);return on("theme",t),t}function Cn(){return An(ft()==="dark"?"light":"dark")}function Tn(){return rs(ft())}function cs(e){return e==="light"?`
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `:`
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `}function Ln(){const e=ft(),t=e==="dark"?"light":"dark";return`
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${t} theme" title="Switch to ${t} theme">
      ${cs(e)}
    </button>
  `}function P(e={}){const{title:t="ClassConnect",showBack:s=!1,backLabel:n="Back",studentName:a=null,showSettings:o=!1,showLogout:i=!1,logoutLabel:r="Sign out",showThemeToggle:d=!0}=e;return`
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
              ${d?Ln():""}
              ${o?`
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
  `}function R(e={}){const{onBack:t=null,onSettings:s=null,onBrand:n=null,onLogout:a=null}=e,o=document.getElementById("nav-back-btn");o&&t&&o.addEventListener("click",t);const i=document.getElementById("nav-settings-btn");i&&s&&i.addEventListener("click",s);const r=document.getElementById("nav-logout-btn");r&&a&&r.addEventListener("click",a);const d=document.getElementById("nav-theme-btn");d&&d.addEventListener("click",()=>{const u=Cn(),m=u==="dark"?"light":"dark";d.innerHTML=cs(u),d.setAttribute("aria-label",`Switch to ${m} theme`),d.setAttribute("title",`Switch to ${m} theme`)});const c=document.getElementById("nav-brand");c&&n&&(c.addEventListener("click",n),c.style.cursor="pointer");const l=()=>{const u=document.getElementById("status-dot"),m=document.getElementById("status-text");u&&(u.className=`status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}`),m&&(m.textContent=navigator.onLine?"Online":"Offline")};window.addEventListener("online",l),window.addEventListener("offline",l)}function Dn(){return`
    ${P({title:"ClassConnect"})}
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
  `}function Mn(e){R(),document.getElementById("btn-student").addEventListener("click",()=>{e("/student-login")}),document.getElementById("btn-teacher").addEventListener("click",()=>{e("/teacher-login")})}function Ce(e,t,s=""){const n=t>0?Math.round(e/t*100):0;return`
    <div class="progress-container" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100">
      ${s?`<div class="progress-label">${s}</div>`:""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${n}%"></div>
      </div>
      <div class="progress-text">${n}%</div>
    </div>
  `}function ds(e){const t=["A","B","C","D"];return`
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
  `}function En(e){return e==="ai"?'<span class="badge badge--primary">AI Feedback</span>':e==="cache"?'<span class="badge badge--accent">Saved Offline</span>':e==="question-cache"?'<span class="badge badge--warning">Common Offline Hint</span>':e==="fallback"?'<span class="badge badge--neutral">Offline Hint</span>':'<span class="badge badge--success">Quick Check</span>'}function Bn(e){return e.source==="ai"?"Powered by Gemini AI and saved for offline reuse.":e.source==="cache"?"Loaded from this device cache so feedback still works offline.":e.source==="question-cache"?"Reused from a common explanation for this question while offline.":e.source==="fallback"?"Using the built-in lesson explanation because no saved AI response matched yet.":""}function qn(e,t){return t||!e.practiceTip?"":`
    <div class="feedback-card__tip">
      <strong>Next step:</strong> ${e.practiceTip}
    </div>
  `}function Pn(e,t){return t||!e.usageCount&&!e.reusedFromQuestionBank?"":e.reusedFromQuestionBank?'<div class="feedback-card__meta">Misconception memory: reused a common explanation for this question.</div>':(e.usageCount||0)>1?`<div class="feedback-card__meta">Misconception memory: this saved explanation has helped ${e.usageCount} times on this device.</div>`:""}function bt(e,t){const s=t?"Correct":"Review",n=t?"Correct!":"Let's learn from this",a=Bn(e);return`
    <div class="card feedback-card ${t?"feedback-card--correct":"feedback-card--incorrect"}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${s}</span>
        <span class="feedback-card__title">${n}</span>
        ${En(e.source)}
      </div>
      <div class="feedback-card__body">
        ${e.text}
      </div>
      ${qn(e,t)}
      ${Pn(e,t)}
      ${a?`<div class="feedback-card__source">${a}</div>`:""}
    </div>
  `}function oe(e,t,s,n="primary",a=""){return`
    <div class="card stat-card stat-card--${n}">
      <div class="stat-card__icon">${e}</div>
      <div class="stat-card__value">${t}</div>
      <div class="stat-card__label">${s}</div>
      ${a?`<div class="stat-card__detail">${a}</div>`:""}
    </div>
  `}let me=null;function E(e,t="info",s=3e3){me||(me=document.createElement("div"),me.className="toast-container",document.body.appendChild(me));const n={success:"OK",error:"X",info:"i"},a=document.createElement("div");a.className=`toast toast--${t}`,a.innerHTML=`<span>${n[t]||""}</span> ${e}`,me.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(100%)",a.style.transition="all 0.3s ease-out",setTimeout(()=>a.remove(),300)},s)}function ls(e,t){const s=t>0?e/t:0,n=2*Math.PI*45,a=n*(1-s);let o="#FB7185";return s>=.8?o="#34D399":s>=.6?o="#818CF8":s>=.4&&(o="#FBBF24"),`
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"/>
        <circle class="ring-fill" cx="50" cy="50" r="45"
          stroke="${o}"
          stroke-dasharray="${n}"
          stroke-dashoffset="${a}"
          style="animation: ringDraw 1.5s ease-out forwards;"
        />
      </svg>
      <div class="quiz-results__score-label">
        <div class="quiz-results__score-value" style="color: ${o}">${e}</div>
        <div class="quiz-results__score-total">out of ${t}</div>
      </div>
    </div>
  `}function yt(e,t,s=[],n={}){const a=document.createElement("div");a.className="modal-overlay",a.id="modal-overlay";const o=n.modalClass?` ${n.modalClass}`:"";return a.innerHTML=`
    <div class="modal${o}">
      <h3 class="modal__title">${e}</h3>
      <div class="modal__body">${t}</div>
      <div class="modal__actions" id="modal-actions">
        ${s.map((i,r)=>`
          <button class="btn ${i.variant||"btn--ghost"}" id="modal-action-${r}">${i.label}</button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(a),s.forEach((i,r)=>{const d=document.getElementById(`modal-action-${r}`);d&&d.addEventListener("click",async()=>{let c=!0;i.onClick&&(c=await i.onClick(a)!==!1),c&&a.remove()})}),a.addEventListener("click",i=>{i.target===a&&a.remove()}),a}function Rn(){return`
    ${P({title:"ClassConnect",showBack:!0})}
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

        <div id="recent-students" hidden>
          <div class="divider"></div>
          <h3 style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-4);">Recent Students</h3>
          <div id="recent-student-list" style="display: flex; flex-wrap: wrap; gap: var(--space-3);"></div>
        </div>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function zn(e){R({onBack:()=>e("/")});const t=document.getElementById("login-form"),s=document.getElementById("student-name"),n=document.getElementById("student-pin");t.addEventListener("submit",async i=>{i.preventDefault();const r=s.value.trim(),d=n.value;if(!r||d.length!==4){E("Please enter your name and a 4-digit PIN.","error");return}try{const c=await rn(r,d);In(c);const l=await G(c.id);e(l?"/lessons":"/diagnostic")}catch(c){console.error(c);const l=(c==null?void 0:c.message)==="The local ClassConnect database is busy."?"Your saved learning data is busy. Close other ClassConnect tabs, then try again.":"Login failed. Please try again.";E(l,"error")}});const a=document.getElementById("recent-students"),o=document.getElementById("recent-student-list");o.addEventListener("click",i=>{const r=i.target.closest(".student-quick-select");r&&(s.value=r.dataset.name,n.focus())}),Se().then(i=>{i.length&&(i.slice(0,5).forEach(r=>{const d=document.createElement("button");d.type="button",d.className="badge badge--neutral student-quick-select",d.dataset.name=r.name,d.style.cssText="padding: var(--space-2) var(--space-3); cursor: pointer; border: 1px solid var(--color-slate-600);",d.textContent=r.name,o.append(d)}),a.hidden=!1)}).catch(i=>{console.warn("Recent students could not be loaded.",i)})}function Qn(){const t=!gt();return`
    ${P({title:"Teacher Access",showBack:!0})}
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
              <input type="password" id="teacher-api-key" class="input" value="${pe()||""}" placeholder="AIzaSy...">
            </div>
          `:""}

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${t?"Save PIN and Open Dashboard":"Open Dashboard"}
          </button>
        </form>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function jn(e){R({onBack:()=>e("/")});const t=gt(),s=!t,n=document.getElementById("teacher-access-form"),a=document.getElementById("teacher-pin"),o=document.getElementById("teacher-pin-confirm"),i=document.getElementById("teacher-api-key");n.addEventListener("submit",async r=>{r.preventDefault();const d=a.value.trim();if(!/^\d{4}$/.test(d)){E("Enter a valid 4-digit teacher PIN.","error");return}if(s){const c=o==null?void 0:o.value.trim();if(d!==c){E("Teacher PINs do not match yet.","error");return}try{await ts(d),i!=null&&i.value.trim()&&await es(i.value.trim()),Lt(!0),E("Teacher access saved for this device.","success"),e("/dashboard")}catch(l){console.error(l),E("Unable to save teacher access right now.","error")}return}if(d!==t){E("That teacher PIN is not correct.","error");return}Lt(!0),e("/dashboard")})}const $=[{id:1,title:"What Is a Computer?",duration:"10 min",objectives:["Define what a computer is and explain its basic purpose","Identify different types of computers used today","Understand how computers have evolved through generations"],keyTerms:[{word:"Computer",definition:"An electronic device that accepts data (input), processes it, and produces useful information (output)."},{word:"Data",definition:"Raw facts and figures that have not yet been processed — such as numbers, words, or images."},{word:"Information",definition:"Data that has been processed and organized so it is meaningful and useful."},{word:"Hardware",definition:"The physical parts of a computer that you can see and touch."},{word:"Software",definition:"Programs and instructions that tell the computer what to do."}],content:`
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
    `}],Nn={1:{src:"/images/lesson-1-computer-types.png",alt:"Illustration of a desktop computer, laptop, tablet, smartphone, and server tower",caption:"Different types of computers suit different jobs, but they all accept data, process it, and give useful results."},2:{src:"/images/lesson-2-inside-computer.png",alt:"Illustration of a desktop tower opened to show the motherboard, CPU, RAM, storage drive, and power supply",caption:"Internal hardware works together through the motherboard so the CPU, memory, storage, and power system can do their jobs."},3:{src:"/images/lesson-3-input-devices.png",alt:"Illustration collage of a keyboard, mouse, touchscreen tablet, microphone, scanner, and webcam",caption:"Input devices help students send text, sound, touch, and images into a computer."},4:{src:"/images/lesson-4-output-devices.png",alt:"Illustration collage of a monitor, printer, speakers, projector, and plotter",caption:"Output devices help the computer present information as visuals, sound, or printed work."},5:{src:"/images/lesson-5-storage-devices.png",alt:"Illustration comparing a hard drive, solid state drive, flash drive, SD card, optical disc, and cloud storage symbol",caption:"Storage devices keep schoolwork, software, and media safe so learners can use them again later."}};function us(e,t=0,s=1){return Math.max(t,Math.min(s,e))}function wt(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function On(e){return Math.round(us(e)*100)}function ps(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return new Map(t.map(s=>[s.lessonId,s]))}function Fn(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).forEach(s=>{t.has(s.lessonId)||t.set(s.lessonId,s)}),t}function Un(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).slice(0,3).forEach(s=>{var a;const n=((a=s.responses)==null?void 0:a.filter(o=>!o.correct).length)||0;t.set(s.lessonId,(t.get(s.lessonId)||0)+n)}),t}function Hn(e){return e>=.8?"mastered":e>=.6?"growing":e>=.4?"review":"urgent"}function Wn(e){const t=wt(e.map(n=>n.mastery)),s=e.filter(n=>n.status==="urgent").length;return t>=.75&&s===0?{label:"Ready to Accelerate",tone:"success",description:"You have strong foundations across the strand. Push into harder quizzes and extension practice."}:t>=.55?{label:"Foundations Growing",tone:"accent",description:"You are building confidence. Focus on the weakest topics first, then continue the recommended path."}:{label:"Needs Guided Support",tone:"danger",description:"Your learning path should begin with a few targeted reviews before moving ahead."}}function Gn(e,t,s){const n=Un(t),a=ps(s);return e.map(i=>{const r=a.get(i.lessonId),d=n.get(i.lessonId)||0,c=[];let l=0;return r&&r.accuracy<.5&&(c.push("low diagnostic readiness"),l+=25),i.latestQuizScore!==null&&i.latestQuizScore<.6&&(c.push("recent quiz performance dropped"),l+=20),d>0&&(c.push(`${d} recent missed question${d===1?"":"s"}`),l+=d*6),i.completed||(l+=8),!c.length&&i.mastery>=.65?null:{lessonId:i.lessonId,title:i.title,priority:l,reason:c.length?c.join(", "):"This topic will benefit from one more focused review.",action:`Revisit ${i.title}, then use the AI Tutor before retaking the quiz.`}}).filter(Boolean).sort((i,r)=>r.priority-i.priority).slice(0,4)}function Kn(e){const t=e.filter(i=>!i.completed&&i.status==="urgent").sort((i,r)=>i.lessonId-r.lessonId),s=e.filter(i=>!i.completed&&i.status==="review").sort((i,r)=>i.lessonId-r.lessonId),n=e.filter(i=>!i.completed&&(i.status==="growing"||i.status==="mastered")).sort((i,r)=>i.lessonId-r.lessonId),a=e.filter(i=>i.completed&&(i.status==="urgent"||i.status==="review")).sort((i,r)=>i.mastery-r.mastery||i.lessonId-r.lessonId),o=e.filter(i=>i.completed&&(i.status==="growing"||i.status==="mastered")).sort((i,r)=>i.lessonId-r.lessonId);return[...t,...s,...n,...a,...o]}function Yn(e,t=[],s=null){var c,l;const n=t.slice().sort((u,m)=>new Date(m.completedAt)-new Date(u.completedAt)),a=n[0]||null,o=n.length>0?wt(n.map(u=>u.score/u.totalQuestions)):null;let i=0;const r=[];if(s||(i+=10,r.push("no diagnostic profile yet")),e.completionRate<40&&(i+=15,r.push("low lesson completion")),e.knowledgeGaps.length>=3&&(i+=20,r.push("several knowledge gaps remain open")),a){const u=a.score/a.totalQuestions;u<.5?(i+=25,r.push("latest quiz score below 50%")):u<.65&&(i+=12,r.push("latest quiz score needs support")),a.theta<-.75?(i+=25,r.push("ability estimate is trending low")):a.theta<-.25&&(i+=12,r.push("ability estimate suggests review"))}o!==null&&o<.6&&n.length>=2&&(i+=10,r.push("recent quiz trend is still below target"));const d=Math.min(100,i);return d>=60?{score:d,label:"High",badge:"danger",reasons:r,action:`Teacher check-in recommended. Start with ${((c=e.recommendedNext)==null?void 0:c.title)||"the weakest topic"} and review the revision queue.`}:d>=35?{score:d,label:"Moderate",badge:"warning",reasons:r,action:`Guide the learner through ${((l=e.recommendedNext)==null?void 0:l.title)||"the next recommended lesson"} and schedule a tutor session.`}:{score:d,label:"Low",badge:"success",reasons:r.length?r:["steady progress across current evidence"],action:"Keep the learner on the personalized path and use the tutor for stretch support."}}function F({diagnostic:e=null,results:t=[],progressRecords:s=[]}={}){const n=new Set(s.map(h=>h.lessonId)),a=ps(e),o=Fn(t),i=$.map(h=>{const v=a.get(h.id),f=t.filter(H=>H.lessonId===h.id).sort((H,Qs)=>new Date(Qs.completedAt)-new Date(H.completedAt)),p=o.get(h.id)||null,w=p?p.score/p.totalQuestions:null,y=f.length?wt(f.map(H=>H.score/H.totalQuestions)):null,A=v?v.accuracy:null,C=n.has(h.id);let b=0,_=0;A!==null&&(b+=A*.35,_+=.35),w!==null&&(b+=w*.45,_+=.45),y!==null&&f.length>1&&(b+=y*.1,_+=.1),C&&(b+=.1,_+=.1);let M=_>0?b/_:.2;C&&_===0&&(M=.55),M=us(M);const j=Hn(M);let U="Continue building momentum on this topic.";return v&&v.accuracy<.5?U="The diagnostic found this topic needs early attention.":w!==null&&w<.6?U="Recent quiz results suggest a focused review here.":C||(U="This topic is ready to learn next in your path."),{lessonId:h.id,title:h.title,completed:C,mastery:M,masteryPercent:On(M),status:j,diagnosticScore:A,latestQuizScore:w,latestTheta:(p==null?void 0:p.theta)??null,attempts:f.length,recommendedFocus:U}}),r=Kn(i),d=i.filter(h=>h.status==="urgent"||h.status==="review").sort((h,v)=>h.mastery-v.mastery).slice(0,3),c=i.filter(h=>h.status==="mastered"||h.status==="growing").sort((h,v)=>v.mastery-h.mastery).slice(0,3),l=Gn(i,t,e),u=Wn(i),m=$.length>0?Math.round(n.size/$.length*100):0,g={lessonProfiles:i,recommendedSequence:r,recommendedNext:r.find(h=>!h.completed)||r[0]||null,knowledgeGaps:d,strengths:c,revisionQueue:l,readiness:u,completionRate:m,completedCount:n.size};return g.risk=Yn(g,t,e),g}function Vn(e,t){var s,n,a,o;return`
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
          <div class="learning-hub__panel-meta">${((o=e.revisionQueue[0])==null?void 0:o.reason)||"Your current evidence is looking steady."}</div>
        </div>
      </div>

      <div class="learning-hub__actions">
        <button class="btn btn--primary" id="btn-open-path">Start Recommended Lesson</button>
        <button class="btn btn--accent" id="btn-open-assessments">Assessment Center</button>
        <button class="btn btn--accent" id="btn-open-tutor">Ask AI Tutor</button>
        <button class="btn btn--ghost" id="btn-open-diagnostic">${t?"Retake Diagnostic":"Take Diagnostic"}</button>
      </div>
    </div>
  `}function Jn(e){return e.revisionQueue.length?`
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
  `:""}function Zn(e){return`
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
  `}async function Xn(){const e=L(),t=e?await O(e.id):[],s=new Set(t.map(i=>i.lessonId)),n=e?await ie(e.id):[],a=e?await G(e.id):null,o=F({diagnostic:a,results:n,progressRecords:t});return`
    ${P({title:"Topics",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${Vn(o,!!a)}
      ${Jn(o)}
      ${Zn(o)}
      ${Ce(s.size,$.length,"Lessons completed")}

      <div class="lesson-list">
        ${$.map((i,r)=>{var m;const d=s.has(i.id),c=o.lessonProfiles.find(g=>g.lessonId===i.id),l=((m=o.recommendedNext)==null?void 0:m.lessonId)===i.id,u=o.knowledgeGaps.some(g=>g.lessonId===i.id);return`
            <div class="card card--interactive lesson-card" data-id="${i.id}">
              <div class="lesson-card__number ${d?"lesson-card__number--completed":""}">
                ${d?"Done":r+1}
              </div>
              <div class="lesson-card__info">
                <div class="lesson-card__title">${i.title}</div>
                <div class="lesson-card__meta">
                  <span>${i.duration}</span>
                  <span>${i.objectives.length} objectives</span>
                  <span>${(c==null?void 0:c.masteryPercent)||0}% mastery</span>
                </div>
                <div class="lesson-card__badges">
                  ${l?'<span class="badge badge--primary">Recommended next</span>':""}
                  ${u?'<span class="badge badge--warning">Focus</span>':""}
                </div>
              </div>
              <div class="lesson-card__status">
                ${d?'<span class="badge badge--success">Completed</span>':'<span class="badge badge--neutral">Start</span>'}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function ea(e){R({onBack:()=>e("/")});const t=document.getElementById("btn-open-path");t&&t.addEventListener("click",async()=>{var l;const o=L(),i=o?await O(o.id):[],r=o?await G(o.id):null,d=o?await ie(o.id):[],c=F({diagnostic:r,results:d,progressRecords:i});e(`/lesson/${((l=c.recommendedNext)==null?void 0:l.lessonId)||1}`)});const s=document.getElementById("btn-open-tutor");s&&s.addEventListener("click",()=>e("/tutor"));const n=document.getElementById("btn-open-assessments");n&&n.addEventListener("click",()=>e("/assessments"));const a=document.getElementById("btn-open-diagnostic");a&&a.addEventListener("click",()=>e("/diagnostic")),document.querySelectorAll(".revision-queue__item, .adaptive-preview__item").forEach(o=>{o.addEventListener("click",i=>{const r=Number.parseInt(i.currentTarget.dataset.lessonId,10);e(`/lesson/${r}`)})}),document.querySelectorAll(".lesson-card").forEach(o=>{o.addEventListener("click",i=>{const r=Number.parseInt(i.currentTarget.dataset.id,10);e(`/lesson/${r}`)})})}async function ta(e){var u;const t=L(),s=$.find(m=>m.id===e);if(!s)return'<div class="container" style="padding: 2rem;">Lesson not found.</div>';const n=$.indexOf(s),a=t?await ln(t.id,e):!1,o=Nn[e],i=t?await O(t.id):[],r=t?await ie(t.id):[],d=t?await G(t.id):null,l=F({diagnostic:d,results:r,progressRecords:i}).lessonProfiles.find(m=>m.lessonId===e);return`
    ${P({title:"Lesson",showBack:!0,studentName:t==null?void 0:t.name})}

    <div class="container container--narrow view-enter lesson-page">
      ${Ce(n+1,$.length,`Lesson ${n+1} of ${$.length}`)}
      <div class="lesson-progress-strip">
        ${$.map((m,g)=>`
          <div class="lesson-progress-pip ${g===n?"lesson-progress-pip--current":""} ${g<n?"lesson-progress-pip--completed":""}"></div>
        `).join("")}
      </div>

      <div class="lesson-header">
        <div class="lesson-header__meta">
          <span class="lesson-header__number">Lesson ${n+1}</span>
          <span class="badge badge--neutral">${s.duration}</span>
          <span class="badge badge--${(l==null?void 0:l.status)==="mastered"?"success":(l==null?void 0:l.status)==="growing"?"accent":"warning"}">${(l==null?void 0:l.masteryPercent)||0}% mastery</span>
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
            <div class="lesson-support__text">${(l==null?void 0:l.recommendedFocus)||"Use the AI Tutor for an explanation before you take the quiz."}</div>
          </div>
          <button class="btn btn--accent btn--sm" id="btn-ask-tutor">Ask AI Tutor</button>
        </div>

        ${o?`
          <figure class="lesson-image">
            <img src="${o.src}" alt="${o.alt}" loading="lazy">
            <figcaption class="lesson-image__caption">${o.caption}</figcaption>
          </figure>
        `:""}
        ${s.content}

        ${(u=s.keyTerms)!=null&&u.length?`
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
  `}function sa(e,t){R({onBack:()=>e("/lessons")});const s=L(),n=$.find(c=>c.id===t),a=$.indexOf(n),o=document.getElementById("btn-mark-complete"),i=document.getElementById("btn-take-quiz"),r=document.getElementById("btn-prev-lesson");r&&r.addEventListener("click",()=>{e(`/lesson/${$[a-1].id}`)}),o&&s&&o.addEventListener("click",async()=>{await dn(s.id,t),o.outerHTML='<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>',i&&(i.removeAttribute("disabled"),i.removeAttribute("title")),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}),i&&i.addEventListener("click",()=>{e(`/quiz/${t}`)});const d=document.getElementById("btn-ask-tutor");d&&d.addEventListener("click",()=>{e("/tutor")})}const Qe=[{id:"L1Q1",lessonId:1,stem:"What is the BEST definition of a computer?",options:["A machine that only plays games and videos","An electronic device that accepts data, processes it, and produces information","Any device that uses electricity","A tool used only for typing documents"],correctIndex:1,difficulty:-1.5,discrimination:1.2,guessing:.25},{id:"L1Q2",lessonId:1,stem:"Which of these is NOT a type of computer?",options:["Desktop","Laptop","Calculator","Tablet"],correctIndex:2,difficulty:-.8,discrimination:1,guessing:.25},{id:"L1Q3",lessonId:1,stem:"What technology did FIRST generation computers use?",options:["Microprocessors","Transistors","Vacuum tubes","Integrated circuits"],correctIndex:2,difficulty:.3,discrimination:1.3,guessing:.25},{id:"L1Q4",lessonId:1,stem:"Which generation of computers introduced the microprocessor?",options:["First generation","Second generation","Third generation","Fourth generation"],correctIndex:3,difficulty:.5,discrimination:1.1,guessing:.25},{id:"L1Q5",lessonId:1,stem:"What is the difference between data and information?",options:["Data is processed; information is raw","Data is raw facts; information is processed and meaningful","They mean the same thing","Data is digital; information is analog"],correctIndex:1,difficulty:0,discrimination:1.4,guessing:.25},{id:"L1Q6",lessonId:1,stem:"A smartphone is a type of computer.",options:["True — it processes data and runs programs","False — it is only a phone","True — but only expensive ones","False — it has no keyboard"],correctIndex:0,difficulty:-1,discrimination:.9,guessing:.25},{id:"L1Q7",lessonId:1,stem:"What does the fifth generation of computers focus on?",options:["Vacuum tubes","Transistors","Artificial Intelligence","Magnetic storage"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L1Q8",lessonId:1,stem:"A server is a powerful computer that:",options:["Only stores personal photos","Provides services to other computers on a network","Cannot connect to the internet","Is smaller than a smartphone"],correctIndex:1,difficulty:.8,discrimination:1.3,guessing:.25},{id:"L2Q1",lessonId:2,stem:"What is the CPU often called?",options:["The heart of the computer","The brain of the computer","The body of the computer","The memory of the computer"],correctIndex:1,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L2Q2",lessonId:2,stem:"What is the main function of the motherboard?",options:["To store files permanently","To display images on screen","To connect all computer components and allow them to communicate","To provide internet access"],correctIndex:2,difficulty:-.3,discrimination:1.2,guessing:.25},{id:"L2Q3",lessonId:2,stem:"What happens to data in RAM when the computer is turned off?",options:["It is saved permanently","It is transferred to the monitor","It disappears (is lost)","It moves to the keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.4,guessing:.25},{id:"L2Q4",lessonId:2,stem:"What unit is used to measure the speed of a CPU?",options:["Kilograms (kg)","Gigahertz (GHz)","Megabytes (MB)","Watts (W)"],correctIndex:1,difficulty:.6,discrimination:1.5,guessing:.25},{id:"L2Q5",lessonId:2,stem:"ROM is different from RAM because ROM:",options:["Is faster than RAM","Loses data when power is off","Keeps its data even when the computer is off","Can hold more data than RAM"],correctIndex:2,difficulty:.4,discrimination:1.3,guessing:.25},{id:"L2Q6",lessonId:2,stem:"What does the Power Supply Unit (PSU) do?",options:["Displays images on the screen","Converts wall electricity into the correct voltage for components","Stores programs permanently","Connects the computer to the internet"],correctIndex:1,difficulty:.1,discrimination:1.1,guessing:.25},{id:"L2Q7",lessonId:2,stem:"If a computer has more RAM, it can generally:",options:["Store more files permanently","Run more tasks at the same time without slowing down","Display brighter colors","Connect to faster internet"],correctIndex:1,difficulty:.3,discrimination:1.2,guessing:.25},{id:"L2Q8",lessonId:2,stem:"Which two types of operations does the CPU perform?",options:["Input and output operations","Arithmetic and logic operations","Printing and scanning operations","Storage and display operations"],correctIndex:1,difficulty:.7,discrimination:1.4,guessing:.25},{id:"L3Q1",lessonId:3,stem:"An input device is used to:",options:["Display information to the user","Send data or commands into a computer","Store data permanently","Print documents on paper"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L3Q2",lessonId:3,stem:"Which of the following is an input device?",options:["Printer","Monitor","Keyboard","Speaker"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L3Q3",lessonId:3,stem:"A scanner converts:",options:["Sound into text","Digital files into paper documents","Physical documents into digital images","Video into audio"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L3Q4",lessonId:3,stem:"A touchscreen is special because it is:",options:["Only an input device","Only an output device","Both an input and output device","A storage device"],correctIndex:2,difficulty:-.2,discrimination:1.4,guessing:.25},{id:"L3Q5",lessonId:3,stem:"A microphone captures _____ and converts it into digital data.",options:["Light","Heat","Sound","Motion"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L3Q6",lessonId:3,stem:"A trackpad is a type of:",options:["Output device found on desktops","Pointing device built into laptops","Storage device","Printer accessory"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L3Q7",lessonId:3,stem:"Which input device would you use to capture your face for a video call?",options:["Scanner","Keyboard","Webcam","Printer"],correctIndex:2,difficulty:-.6,discrimination:1.1,guessing:.25},{id:"L3Q8",lessonId:3,stem:"A wireless keyboard connects to the computer using:",options:["A VGA cable","Bluetooth or a USB receiver","An HDMI cable","A power cable"],correctIndex:1,difficulty:.5,discrimination:1.3,guessing:.25},{id:"L4Q1",lessonId:4,stem:"An output device:",options:["Sends data into the computer","Presents processed data from the computer to the user","Stores data permanently on a disk","Provides electricity to the computer"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L4Q2",lessonId:4,stem:"Which of the following is an output device?",options:["Mouse","Scanner","Monitor","Keyboard"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L4Q3",lessonId:4,stem:'A "hard copy" refers to:',options:["A file saved on a hard disk","A physical paper printout of a document","A very difficult document to read","A backup copy on a flash drive"],correctIndex:1,difficulty:.2,discrimination:1.3,guessing:.25},{id:"L4Q4",lessonId:4,stem:"Which type of printer uses a laser beam and toner powder?",options:["Inkjet printer","Laser printer","3D printer","Dot matrix printer"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L4Q5",lessonId:4,stem:"A projector is used to:",options:["Print documents in large sizes","Display the computer's screen as a large image on a wall","Record sound from the computer","Store data on optical discs"],correctIndex:1,difficulty:-.5,discrimination:1.1,guessing:.25},{id:"L4Q6",lessonId:4,stem:"Speakers convert electrical signals into:",options:["Light","Text","Sound","Images"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L4Q7",lessonId:4,stem:"A device that serves as BOTH input and output is called:",options:["A storage device","An I/O device","A processing device","A network device"],correctIndex:1,difficulty:.6,discrimination:1.4,guessing:.25},{id:"L4Q8",lessonId:4,stem:"A plotter is mainly used to:",options:["Play music files","Draw large-format graphics like maps and architectural plans","Scan photographs","Display video on a wall"],correctIndex:1,difficulty:1,discrimination:1.3,guessing:.25},{id:"L5Q1",lessonId:5,stem:"Why do we need storage devices?",options:["To increase the speed of the CPU","To save data permanently so it can be accessed later","To display images on the screen","To connect to the internet"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L5Q2",lessonId:5,stem:"Which storage device uses spinning magnetic disks?",options:["SSD","Flash drive","HDD","SD card"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L5Q3",lessonId:5,stem:"An SSD is faster than an HDD because it:",options:["Uses larger disks","Has no moving parts — it uses flash memory chips","Uses more electricity","Is always connected to the internet"],correctIndex:1,difficulty:.3,discrimination:1.4,guessing:.25},{id:"L5Q4",lessonId:5,stem:"Google Drive is an example of:",options:["An HDD","Cloud storage","An optical disc","A flash drive"],correctIndex:1,difficulty:-.8,discrimination:1,guessing:.25},{id:"L5Q5",lessonId:5,stem:"The correct order of the computing cycle is:",options:["Output → Input → Storage → Processing","Input → Processing → Output → Storage","Processing → Input → Output → Storage","Storage → Output → Input → Processing"],correctIndex:1,difficulty:.5,discrimination:1.5,guessing:.25},{id:"L5Q6",lessonId:5,stem:"Which storage medium has the LARGEST typical capacity?",options:["SD card","CD","Hard Disk Drive (HDD)","Flash drive"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L5Q7",lessonId:5,stem:"Optical discs (like CDs and DVDs) are read using:",options:["A magnetic head","A laser beam","Radio waves","Electrical contacts"],correctIndex:1,difficulty:.7,discrimination:1.3,guessing:.25},{id:"L5Q8",lessonId:5,stem:"When you save a school report to a flash drive and print it, which component is the storage device?",options:["The printer","The monitor","The flash drive","The keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.1,guessing:.25}];function Y(e,t=2){return Math.round(e*10**t)/10**t}function ms(e,t){const{discrimination:s,difficulty:n,guessing:a}=t,o=-s*(e-n);return a+(1-a)/(1+Math.exp(o))}function hs(e,t){const s=ms(e,t),{discrimination:n,guessing:a}=t;if(s<=a||s>=1)return 0;const o=n*n*(s-a)**2,i=(1-a)**2*s*(1-s);return i>0?o/i:0}function na(e){if(e.length===0)return 0;const t=e.every(i=>i.correct),s=e.every(i=>!i.correct);if(t)return Math.min(3,.5*e.length);if(s)return Math.max(-3,-.5*e.length);let n=0;const a=30,o=.001;for(let i=0;i<a;i+=1){let r=0,d=0;for(const l of e){const u=ms(n,l.item),m=1-u,{discrimination:g,guessing:h}=l.item,v=(u-h)/(1-h),f=g*v*m;l.correct?r+=f/u:r-=f/m,d-=f*f/(u*m)}if(Math.abs(d)<1e-10)break;const c=r/d;if(n-=c,n=Math.max(-3,Math.min(3,n)),Math.abs(c)<o)break}return n}function Ye(e,t){let s=0;for(const n of t)s+=hs(e,n.item);return s>0?1/Math.sqrt(s):999}function aa(e,t){let s=null,n=-1/0;for(const a of t){const o=hs(e,a);o>n&&(n=o,s=a)}return s}function Mt(e){return e<-1?{label:"Beginner",color:"#FB7185",description:"Just getting started — keep learning and practicing!"}:e<0?{label:"Developing",color:"#FBBF24",description:"You understand the basics. Review the tricky parts and try again!"}:e<1?{label:"Proficient",color:"#818CF8",description:"Great understanding! You've got a solid grasp of this topic."}:{label:"Advanced",color:"#34D399",description:"Excellent! You've mastered this topic. Ready for the next challenge!"}}function ia(e=null,t=10){let s=e?Qe.filter(f=>f.lessonId===e):[...Qe];s=s.sort(()=>Math.random()-.5);const n=new Set,a=[],o=[];let i=0,r=null,d=0,c=!1,l=null;function u(){if(c)return null;const f=s.filter(p=>!n.has(p.id));return f.length===0||d>=t||d>=5&&Ye(i,a)<.3?(c=!0,null):(r=aa(i,f),n.add(r.id),d+=1,l=Date.now(),{question:r,questionNumber:d,totalQuestions:Math.min(t,s.length),currentTheta:i,difficulty:r.difficulty>.5?"Hard":r.difficulty<-.5?"Easy":"Medium"})}function m(f){if(!r)return null;const p=Date.now(),w=i,y=f===r.correctIndex,A={item:r,selectedIndex:f,correct:y,questionNumber:d,presentedAt:l||p,answeredAt:p,elapsedMs:Math.max(0,p-(l||p)),thetaBefore:w};return a.push(A),i=na(a),A.thetaAfter=i,A.standardErrorAfter=Ye(i,a),o.push({questionId:r.id,questionNumber:d,thetaBefore:Y(w),thetaAfter:Y(i),standardErrorAfter:Y(A.standardErrorAfter),elapsedMs:A.elapsedMs,correct:y}),l=null,{correct:y,correctIndex:r.correctIndex,thetaBefore:w,thetaAfter:i,standardErrorAfter:A.standardErrorAfter,elapsedMs:A.elapsedMs,level:Mt(i)}}function g(){return l?Math.max(0,Date.now()-l):0}function h(){const f=a.filter(C=>C.correct).length,p=Mt(i),w=Ye(i,a),y=a.reduce((C,b)=>C+b.elapsedMs,0),A=a.length>0?Math.round(y/a.length):0;return{score:f,totalQuestions:a.length,theta:Y(i),standardError:Y(w),level:p.label,levelColor:p.color,levelDescription:p.description,totalTimeMs:y,averageTimeMs:A,thetaTrajectory:o,responses:a.map(C=>({questionId:C.item.id,lessonId:C.item.lessonId,stem:C.item.stem,options:C.item.options,selectedIndex:C.selectedIndex,correctIndex:C.item.correctIndex,correct:C.correct,questionNumber:C.questionNumber,elapsedMs:C.elapsedMs,presentedAt:C.presentedAt,answeredAt:C.answeredAt,thetaBefore:Y(C.thetaBefore),thetaAfter:Y(C.thetaAfter),standardErrorAfter:Y(C.standardErrorAfter)}))}}function v(){return c}return{next:u,answer:m,getCurrentElapsedMs:g,getResults:h,isFinished:v}}const oa={L1Q1:"A computer is specifically an electronic device that accepts data (input), processes it using instructions, and produces useful information (output). It's not limited to games or typing — it can do many things because of its ability to follow programs.",L1Q2:"A calculator can do math, but it is not a general-purpose computer. It cannot run different programs, browse the internet, or process many types of data. Desktops, laptops, and tablets are all types of computers because they can run software and handle many tasks.",L1Q3:"First generation computers (1940s-1950s) used vacuum tubes — large glass tubes that controlled electrical signals. These made the computers huge (filling entire rooms!) and generated a lot of heat. Transistors came in the second generation.",L1Q4:"The fourth generation (1970s to present) introduced the microprocessor — an entire CPU on a single tiny chip. This breakthrough made personal computers, laptops, and smartphones possible. The Intel 4004 (1971) was one of the first microprocessors.",L1Q5:"Data refers to raw, unprocessed facts and figures (like numbers or words). Information is what you get after data has been processed and organized into something meaningful and useful. For example, student scores (data) become a class ranking (information).",L1Q6:"A smartphone is indeed a type of computer! It has a processor (CPU), memory (RAM), storage, input devices (touchscreen, microphone), and output devices (screen, speaker). It runs software programs (apps) just like a desktop computer.",L1Q7:"The fifth generation of computers focuses on Artificial Intelligence (AI) — making computers that can learn, understand human speech, and make decisions. This includes technologies like voice assistants and self-driving cars.",L1Q8:"A server is a powerful computer that provides services to other computers on a network. When you visit a website, a server sends that information to your device. Servers are typically kept in special rooms and run 24/7.",L2Q1:"The CPU is called the 'brain' of the computer because it carries out all instructions and makes decisions. Just like your brain processes information from your senses, the CPU processes data from input devices and tells other components what to do.",L2Q2:"The motherboard is the main circuit board that connects all computer components together and allows them to communicate. Think of it as the 'backbone' or 'highway system' of the computer — everything plugs into it.",L2Q3:"RAM (Random Access Memory) is temporary memory — it only holds data while the computer is running. When you turn off the computer, all data in RAM is lost. That's why you need to save your work to storage (like a hard drive) to keep it.",L2Q4:"CPU speed is measured in Gigahertz (GHz). One GHz means the CPU can perform one billion basic operations per second! A higher GHz number generally means a faster processor. Megabytes measure storage, not speed.",L2Q5:"ROM (Read-Only Memory) keeps its data even when the computer is turned off — this is called 'non-volatile' memory. RAM loses its data when power is off ('volatile'). ROM stores the essential startup instructions the computer needs to begin loading.",L2Q6:"The Power Supply Unit (PSU) converts AC electricity from the wall outlet into DC electricity at the correct voltages that computer components need. Without it, no component inside the computer would receive power.",L2Q7:"More RAM means the computer can hold more data for active tasks at the same time. This allows you to run multiple programs without the computer slowing down. RAM doesn't affect permanent storage — that's the job of hard drives and SSDs.",L2Q8:"The CPU performs two types of operations: arithmetic (math calculations like adding and multiplying) and logic (comparisons like 'Is A equal to B?' or 'Is X greater than Y?'). All computing tasks ultimately break down into these two types.",L3Q1:"An input device is any hardware that allows you to send data or commands INTO a computer. Without input devices, you would have no way to tell the computer what to do. They are the 'doors' through which data enters the computer.",L3Q2:"A keyboard is an input device — you use it to enter text and commands into the computer. Printers, monitors, and speakers are all output devices because they present data FROM the computer to you.",L3Q3:"A scanner takes a physical document or photograph and converts it into a digital image that the computer can store and display. It works in the opposite direction of a printer — a printer takes digital files and puts them ON paper.",L3Q4:"A touchscreen is special because it serves as BOTH an input device (you tap and swipe to send commands) AND an output device (it displays information). This makes it an I/O (input/output) device.",L3Q5:"A microphone captures sound waves from your voice or the environment and converts them into digital data that the computer can process. This is how voice calls, voice recording, and voice assistants work.",L3Q6:"A trackpad (also called touchpad) is a flat, touch-sensitive surface built into laptops that works like a mouse. You move your finger across it to control the cursor. It's a pointing input device.",L3Q7:"A webcam (web camera) captures video and images, which is exactly what you need for a video call. Scanners capture flat documents, keyboards capture text, and printers are output devices — none of them can capture live video of your face.",L3Q8:"Wireless keyboards connect to the computer using either Bluetooth technology or a small USB receiver that plugs into the computer. This eliminates the need for a cable connection between the keyboard and the computer.",L4Q1:"An output device takes processed data from the computer and presents it in a form that humans can understand. Monitors show visual output, speakers produce audio output, and printers create physical output on paper.",L4Q2:"A monitor is an output device — it displays visual information from the computer to you. Mice, scanners, and keyboards are input devices that send data INTO the computer.",L4Q3:"A 'hard copy' is a physical paper printout of a digital document. The word 'hard' refers to the fact that it's a tangible, physical copy you can hold in your hands, as opposed to a 'soft copy' which exists only on the computer screen.",L4Q4:"A laser printer uses a laser beam to create an image on a drum, which then attracts toner powder. The toner is transferred to paper and fused with heat. Laser printers are fast and great for printing large amounts of text.",L4Q5:"A projector takes the computer's visual display and projects it as a large image on a wall or screen. This makes it ideal for classrooms and meetings where many people need to see the same content at once.",L4Q6:"Speakers receive electrical signals from the computer and convert them into sound waves that we can hear. This is how you hear music, voice in videos, system alerts, and all other audio from a computer.",L4Q7:"A device that serves as both input and output is called an I/O (Input/Output) device. A touchscreen is the best example — you input by touching it, and it outputs by displaying information. Some use the term 'interactive device'.",L4Q8:"A plotter is a specialized output device designed to draw large-format graphics, maps, engineering diagrams, and architectural plans. Unlike regular printers that print line by line, plotters use pens to draw continuous, precise lines.",L5Q1:"Storage devices save data permanently so you can access it later, even after the computer is turned off. Without storage, you would lose all your files every time you shut down — RAM only holds data temporarily while the computer is on.",L5Q2:"A Hard Disk Drive (HDD) uses spinning magnetic disks called platters. A read/write head moves across these platters to store and retrieve data. This mechanical process is what makes HDDs slower than SSDs.",L5Q3:"An SSD (Solid State Drive) uses flash memory chips with no moving parts. Since there are no spinning disks or moving heads, data can be read and written much faster. HDDs are slower because they rely on mechanical, moving parts.",L5Q4:"Google Drive is a cloud storage service. Cloud storage means your files are saved on remote servers accessed through the internet, not on a physical device in your hand. Other examples include Dropbox and OneDrive.",L5Q5:"The correct computing cycle is: Input (data enters) → Processing (CPU works on the data) → Output (results are shown) → Storage (data is saved). This is the fundamental pattern that every computing task follows.",L5Q6:"Hard Disk Drives (HDDs) typically have the largest capacity — they can store 500 GB to several terabytes (TB) of data. SD cards, CDs, and flash drives have much smaller capacities compared to modern HDDs.",L5Q7:"Optical discs like CDs, DVDs, and Blu-ray discs are read using a laser beam. The laser reads tiny pits and lands on the disc surface to retrieve data. That's why they're called 'optical' — they use light (optics) technology.",L5Q8:"In this scenario, the flash drive is the storage device — it permanently saves your school report file. The printer is an output device (it produces a paper copy), the monitor is an output device, and the keyboard is an input device."},ra="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",ca="Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!",Le=new Map;function Et(e=""){return e.toLowerCase().replace(/\s+/g," ").trim()}function da(e,t,s){return[e,Et(t),Et(s)].join("::")}function la(e=""){return e.replace(/\s+/g," ").trim()}function _t(e,t){return t?(e||"").toLowerCase().includes("difference")?`Practice tip: compare the choices and explain why "${t}" matches the question best.`:`Practice tip: say out loud why "${t}" is the best answer before you continue.`:"Practice tip: explain the key idea in your own words before you move on."}function Fe(e,t="cache",s={}){return{text:e.text,source:t,model:e.model||null,practiceTip:e.practiceTip||_t(e.stem,e.correctAnswer),usageCount:e.usageCount||1,cachedAt:e.updatedAt||e.createdAt||null,savedForOffline:!0,...s}}function ua(e,t,s){return{text:oa[e]||ca,source:"fallback",model:null,practiceTip:_t(t,s),usageCount:0,cachedAt:null,savedForOffline:!1}}async function pa(e,t){const n=(await wn(e)).filter(o=>o.cacheKey!==t&&o.text).sort((o,i)=>{const r=(i.usageCount||1)-(o.usageCount||1);return r!==0?r:new Date(i.lastUsedAt||i.updatedAt||0)-new Date(o.lastUsedAt||o.updatedAt||0)})[0];if(!n)return null;const a=await vt(n.cacheKey);return Fe(a||n,"question-cache",{reusedFromQuestionBank:!0})}async function Me({questionId:e,stem:t,correctAnswer:s,cacheKey:n,cachedEntry:a,allowQuestionCache:o}){if(a){const i=await vt(n);return Fe(i||a,"cache")}if(o){const i=await pa(e,n);if(i)return i}return ua(e,t,s)}async function ma({apiKey:e,questionId:t,stem:s,studentAnswer:n,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r}){var d,c,l,u,m;try{const g=ha(s,n,a),h=await fetch(`${ra}?key=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:g}]}],generationConfig:{temperature:.6,maxOutputTokens:180,topP:.9}}),signal:AbortSignal.timeout(1e4)});if(!h.ok)return console.warn("Gemini API error, using offline fallback:",h.status),Me({questionId:t,stem:s,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r});const v=await h.json(),f=(m=(u=(l=(c=(d=v==null?void 0:v.candidates)==null?void 0:d[0])==null?void 0:c.content)==null?void 0:l.parts)==null?void 0:u[0])==null?void 0:m.text,p=la(f);if(!p)return Me({questionId:t,stem:s,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r});const w=await _n({cacheKey:o,questionId:t,stem:s,studentAnswer:n,correctAnswer:a,text:p,practiceTip:_t(s,a),model:"gemini-2.0-flash",lastUsedAt:new Date().toISOString()});return Fe(w,"ai",{model:"gemini-2.0-flash"})}catch(g){return console.warn("AI feedback failed, using offline fallback:",g.message),Me({questionId:t,stem:s,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r})}}async function gs(e,t,s,n,a={}){const{preferCached:o=!1,allowQuestionCache:i=!0}=a,r=pe(),d=da(e,s,n),c=await yn(d);if(!r||!navigator.onLine)return Me({questionId:e,stem:t,correctAnswer:n,cacheKey:d,cachedEntry:c,allowQuestionCache:i});if(o&&c){const u=await vt(d);return Fe(u||c,"cache")}if(Le.has(d))return Le.get(d);const l=ma({apiKey:r,questionId:e,stem:t,studentAnswer:s,correctAnswer:n,cacheKey:d,cachedEntry:c,allowQuestionCache:i}).finally(()=>{Le.delete(d)});return Le.set(d,l),l}function ha(e,t,s){return`You are a friendly, encouraging JHS Computing teacher in Ghana. A student answered a quiz question incorrectly. Explain why the correct answer is right in 2-3 simple sentences for a 12-14 year old. Be warm and supportive. Do not say "you are wrong" or shame the learner.

Question: "${e}"
Student's answer: "${t}"
Correct answer: "${s}"

Give only the short explanation:`}async function ga(e){const t={},s=e.filter(n=>!n.correct);for(const n of s){const a=n.options[n.selectedIndex],o=n.options[n.correctIndex];t[n.questionId]=await gs(n.questionId,n.stem,a,o,{preferCached:!0})}return t}let Q=null,je=null,ue=null,k=null,_e=!1,Ee=null,va=0;function vs(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function Te(){Ee&&(window.clearInterval(Ee),Ee=null)}function Bt(){const e=document.getElementById("question-timer");!e||!Q||(e.textContent=vs(Q.getCurrentElapsedMs()))}function fa(){Te(),Bt(),Ee=window.setInterval(Bt,1e3)}function fs(e){return{source:e.source,text:e.aiText,practiceTip:e.practiceTip,usageCount:e.usageCount,reusedFromQuestionBank:e.reusedFromQuestionBank}}function bs(e){return e.correct?"Instant success feedback is ready.":e.feedbackLoading?navigator.onLine?"Generating a simple AI explanation and saving it for offline use...":"You are offline. Looking for a saved explanation on this device...":e.source==="ai"?"Live AI feedback is ready and saved for offline reuse.":e.source==="cache"?"Loaded from the saved feedback cache on this device.":e.source==="question-cache"?"Using a common saved explanation for this question while offline.":"Showing the built-in offline explanation."}function ba(e){if(!k)return;k.aiText=e.text,k.source=e.source,k.practiceTip=e.practiceTip,k.usageCount=e.usageCount,k.reusedFromQuestionBank=e.reusedFromQuestionBank,k.feedbackLoading=!1;const t=document.getElementById("feedback-container");t&&(t.innerHTML=bt(fs(k),!1));const s=document.getElementById("feedback-status");s&&(s.textContent=bs(k))}function ya(e,t,s){const n=`feedback-${++va}`;k&&(k.feedbackRequestId=n),gs(e.id,e.stem,t,s,{preferCached:!1}).then(a=>{!k||k.feedbackRequestId!==n||ba(a)})}function wa(e){Te(),je=Number.parseInt(e,10),Q=ia(je),ue=Q.next(),k=null,_e=!1}function _a(e){const t=Number.parseInt(e,10);(!Q||je!==t)&&wa(t)}function Ia(){Te(),Q=null,je=null,ue=null,k=null,_e=!1}function ka(){if(!Q||!ue)return'<div class="container">Error initializing quiz.</div>';const e=L(),t=ue;let s="";if(k){const n=k.aiText?bt(fs(k),k.correct):'<div class="shimmer" style="height: 116px; width: 100%;"></div>';s=`
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${vs(k.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${k.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${k.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${k.stem}</p>

        <div class="results-review">
          <div class="review-item ${k.correct?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${k.correct?"review-item__correct-answer":"review-item__your-answer"}">${k.studentAnswerText}</span></div>
            </div>
            ${k.correct?"":`
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${k.correctAnswerText}</span></div>
              </div>
            `}
          </div>
        </div>

        <div class="feedback-status" id="feedback-status">${bs(k)}</div>
        <div style="margin-top: var(--space-4);" id="feedback-container">
          ${n}
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${Q.isFinished()?"See Final Results":"Next Question"}
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

      ${Ce(t.questionNumber-1,t.totalQuestions,"Quiz progress")}

      <div id="question-container">
        ${ds(t.question)}
      </div>
    `;return`
    ${P({title:"Adaptive Quiz",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${s}
    </div>
  `}function Sa(e,t,s){if(R({onBack:()=>e(`/lesson/${s}`)}),k){Te();const a=document.getElementById("btn-next-question");a&&a.addEventListener("click",async()=>{if(k=null,Q.isFinished()){await qt(e,s);return}const o=Q.next();if(!o){await qt(e,s);return}ue=o,t()});return}fa(),document.querySelectorAll(".option-btn").forEach(a=>{a.addEventListener("click",o=>{if(_e)return;_e=!0;const i=Number.parseInt(o.currentTarget.dataset.index,10);$a(i,o.currentTarget,t)})})}function $a(e,t,s){const n=Q.answer(e),a=ue.question;if(Te(),document.querySelectorAll(".option-btn").forEach(i=>{i.classList.add("option-btn--disabled"),i.disabled=!0}),n.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const i=document.getElementById(`option-${n.correctIndex}`);i&&i.classList.add("option-btn--highlight-correct")}k={questionId:a.id,stem:a.stem,correct:n.correct,studentAnswerText:a.options[e],correctAnswerText:a.options[n.correctIndex],aiText:n.correct?"Great work - you understood this concept.":null,source:n.correct?"system":null,practiceTip:n.correct?"Keep building on that idea in the next question.":null,usageCount:0,reusedFromQuestionBank:!1,feedbackLoading:!n.correct,feedbackRequestId:null,elapsedMs:n.elapsedMs,thetaAfter:n.thetaAfter,levelLabel:n.level.label},n.correct||ya(a,k.studentAnswerText,k.correctAnswerText),setTimeout(()=>{_e=!1,s()},1e3)}async function qt(e,t){const s=L(),n=Q.getResults();if(!s){e("/lessons");return}const a=await un({studentId:s.id,lessonId:Number.parseInt(t,10),...n});e(`/quiz-results/${a.id}`)}function ct(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}async function xa(e){var d,c,l;const t=L(),s=await $e(),n=s.find(u=>u.id===Number.parseInt(e,10));if(!n)return'<div class="container">Result not found.</div>';const a=t?s.filter(u=>u.studentId===t.id):[],o=t?await G(t.id):null,i=t?await O(t.id):[],r=F({diagnostic:o,results:a,progressRecords:i});return`
    ${P({title:"Quiz Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Lessons"})}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${ls(n.score,n.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${n.levelColor};">
          Level: ${n.level}
        </div>
        <p class="quiz-results__level-desc">${n.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${ct(n.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${ct(n.averageTimeMs)}</span>
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
          <span class="badge badge--neutral">${((l=r.revisionQueue[0])==null?void 0:l.title)||"Revision queue updated"}</span>
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
  `}function Aa(e,t){R({onBack:()=>e("/lessons")});const s=document.getElementById("btn-next-lesson"),n=document.getElementById("btn-open-tutor"),a=document.getElementById("btn-retry-quiz");$e().then(async o=>{const i=o.find(m=>m.id===Number.parseInt(t,10));if(!i)return;const r=L(),d=r?o.filter(m=>m.studentId===r.id):[],c=r?await G(r.id):null,l=r?await O(r.id):[],u=F({diagnostic:c,results:d,progressRecords:l});s&&s.addEventListener("click",()=>{var g;const m=(g=u.recommendedNext)==null?void 0:g.lessonId;e(m?`/lesson/${m}`:"/lessons")}),n&&n.addEventListener("click",()=>{e("/tutor")}),a&&a.addEventListener("click",()=>{e(`/quiz/${i.lessonId}`)}),Ca(i.responses)})}async function Ca(e){const t=document.getElementById("review-list");if(!t)return;t.innerHTML=e.map(n=>Ve(n,null)).join("");const s=await ga(e);t.innerHTML=e.map(n=>n.correct?Ve(n,{text:"Correct! You handled this concept well.",source:"system"}):Ve(n,s[n.questionId])).join("")}function Ve(e,t){const s=e.options[e.selectedIndex],n=e.options[e.correctIndex];let a="";return t?e.correct||(a=`
        <div class="review-item__feedback">
          ${bt(t,!1)}
        </div>
      `):e.correct||(a='<div class="shimmer" style="height: 116px; margin-top: var(--space-3);"></div>'),`
    <div class="review-item ${e.correct?"review-item--correct":"review-item--incorrect"}">
      <div class="review-item__question">${e.questionNumber}. ${e.stem}</div>
      <div class="review-item__meta">
        <span>Time: ${ct(e.elapsedMs)}</span>
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
  `}const Ta="modulepreload",La=function(e){return"/"+e},Pt={},Da=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){let i=function(c){return Promise.all(c.map(l=>Promise.resolve(l).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=i(s.map(c=>{if(c=La(c),c in Pt)return;Pt[c]=!0;const l=c.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":Ta,l||(m.as="script"),m.crossOrigin="",m.href=c,d&&m.setAttribute("nonce",d),document.head.appendChild(m),l)return new Promise((g,h)=>{m.addEventListener("load",g),m.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return a.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return t().catch(o)})};let Je=null,Rt=!1;async function ys(){return Je||(Je=Da(()=>import("./chart-45xamTTr.js"),[]).then(e=>{const t=e.Chart;return Rt||(t.register(...e.registerables),Rt=!0),t})),Je}const Ma=3e4;let T=null,ve=[],se=null,It=null,Be=null,qe=null,fe=null,be=null,ce=null,Pe=!1,ws=null;function Ea(e=[]){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function dt(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function kt(e){return e?new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"Not yet"}function lt(e){var t;return((t=$.find(s=>s.id===e))==null?void 0:t.title)||`Lesson ${e}`}function Ba(e){const t={};return e.slice().sort((s,n)=>new Date(s.completedAt)-new Date(n.completedAt)).forEach(s=>{t[s.studentId]=s}),Object.values(t)}function qa(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return t.length?Math.round(Ea(t.map(s=>s.accuracy||0))*100):0}function Pa(e,t,s,n,a,o){const i=new Map(e.map(c=>[c.id,c])),r=new Map(a.map(c=>[c.id,c])),d=[];return t.forEach(c=>{var m;const l=((m=i.get(c.studentId))==null?void 0:m.name)||"Unknown learner",u=c.totalQuestions>0?Math.round(c.score/c.totalQuestions*100):0;d.push({type:"Quiz",tone:u>=70?"success":u>=50?"warning":"danger",title:`${l} completed ${lt(c.lessonId)} quiz`,meta:`${u}% score · ${c.level||"No level"} · ${dt(c.totalTimeMs)}`,timestamp:c.completedAt})}),s.forEach(c=>{var u;const l=((u=i.get(c.studentId))==null?void 0:u.name)||"Unknown learner";d.push({type:"Progress",tone:"primary",title:`${l} completed ${lt(c.lessonId)}`,meta:"Lesson completion saved to the local database.",timestamp:c.completedAt})}),n.forEach(c=>{var u;const l=((u=i.get(c.studentId))==null?void 0:u.name)||"Unknown learner";d.push({type:"Diagnostic",tone:"accent",title:`${l} completed the readiness diagnostic`,meta:`${qa(c)}% average readiness across sampled lessons.`,timestamp:c.completedAt})}),a.forEach(c=>{d.push({type:"Assess",tone:"accent",title:`Published ${c.title}`,meta:`${c.questions.length} questions · ${c.objectiveCoverage.length} objectives covered.`,timestamp:c.createdAt})}),o.forEach(c=>{var v,f,p,w,y;const l=((v=i.get(c.studentId))==null?void 0:v.name)||"Unknown learner",u=((f=r.get(c.assessmentId))==null?void 0:f.title)||"an assessment",m=((p=c.integrity)==null?void 0:p.label)||"Low",g=((w=c.proctor)==null?void 0:w.label)||"Low",h=((y=c.grading)==null?void 0:y.percentage)??0;d.push({type:"Submit",tone:m==="High"||g==="High"?"warning":"success",title:`${l} submitted ${u}`,meta:`${h}% score · Integrity ${m} · Proctor ${g}`,timestamp:c.completedAt})}),d.sort((c,l)=>new Date(l.timestamp)-new Date(c.timestamp)).slice(0,8)}function Ra(e,t,s,n,a,o){const i=Ba(t),r={};n.slice().sort((b,_)=>new Date(_.completedAt)-new Date(b.completedAt)).forEach(b=>{r[b.studentId]||(r[b.studentId]=b)});const d=e.map(b=>{const _=t.filter(H=>H.studentId===b.id),M=s.filter(H=>H.studentId===b.id),j=r[b.id]||null,U=F({diagnostic:j,results:_,progressRecords:M});return{student:b,results:_,progressRecords:M,diagnostic:j,profile:U}}),c=e.length>0?Math.round(s.length/(e.length*$.length)*100):0,l=i.length>0?Math.round(i.reduce((b,_)=>b+_.score/_.totalQuestions,0)/i.length*100):0,u=d.filter(b=>b.profile.risk.score>=60).length,m=e.length>0?Math.round(d.filter(b=>b.diagnostic).length/e.length*100):0,g={},h={};t.forEach(b=>{g[b.lessonId]=(g[b.lessonId]||0)+b.score/b.totalQuestions,h[b.lessonId]=(h[b.lessonId]||0)+1});const v=$.map(b=>h[b.id]?Math.round(g[b.id]/h[b.id]*100):0),f={Advanced:0,Proficient:0,Developing:0,Beginner:0};i.forEach(b=>{f[b.level]!==void 0&&(f[b.level]+=1)});const p={};t.forEach(b=>{b.responses.forEach(_=>{if(_.correct)return;const M=`${_.questionId}|${_.stem}|${_.options[_.selectedIndex]}`;p[M]=(p[M]||0)+1})});const w=Object.entries(p).map(([b,_])=>{const[M,j,U]=b.split("|");return{questionId:M,stem:j,answer:U,count:_}}).sort((b,_)=>_.count-b.count).slice(0,7),y=$.map(b=>{const _=d.map(M=>{var j;return((j=M.profile.lessonProfiles.find(U=>U.lessonId===b.id))==null?void 0:j.mastery)||0});return{lessonId:b.id,title:b.title,averageMastery:_.length?Math.round(_.reduce((M,j)=>M+j,0)/_.length*100):0}}),A=d.filter(b=>b.profile.risk.score>=35).sort((b,_)=>_.profile.risk.score-b.profile.risk.score).slice(0,6),C=Pa(e,t,s,n,a,o);return{students:e,results:t,progressRecords:s,diagnostics:n,assessments:a,assessmentSubmissions:o,studentProfiles:d,latestResults:i,recentActivity:C,summary:{totalStudents:e.length,averageScore:l,completionRate:c,studentsAtRisk:u,diagnosticCoverage:m,totalAssessments:a.length,totalAssessmentSubmissions:o.length},charts:{lessonLabels:$.map(b=>`Lesson ${b.id}`),lessonScoreData:v,levelCounts:f,misconceptions:w},interventionQueue:A,masterySnapshot:y}}async function _s(){const[e,t,s,n,a,o]=await Promise.all([Se(),$e(),ss(),as(),xe(),Ae()]);return T=Ra(e,t,s,n,a,o),It=new Date().toISOString(),T}function za(e){return`
    <div class="card dashboard-panel">
      <div class="dashboard-panel__header">
        <h3 class="chart-card__title">Live Activity Feed</h3>
        <span class="badge badge--primary">Database</span>
      </div>
      <p class="chart-card__subtitle">New local records appear here as students learn, submit work, and complete milestones.</p>
      <div class="activity-feed">
        ${e.recentActivity.length>0?e.recentActivity.map(t=>`
          <div class="activity-item">
            <div class="activity-item__top">
              <span class="badge badge--${t.tone}">${t.type}</span>
              <span class="activity-item__time">${kt(t.timestamp)}</span>
            </div>
            <div class="activity-item__title">${t.title}</div>
            <div class="activity-item__meta">${t.meta}</div>
          </div>
        `).join(""):'<div class="insight-empty">Waiting for learner activity on this device.</div>'}
      </div>
    </div>
  `}function Qa(e){return e.students.length?`
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
          ${e.students.map(t=>{var d;const s=e.results.filter(c=>c.studentId===t.id).sort((c,l)=>new Date(l.completedAt)-new Date(c.completedAt)),n=s[0],a=e.progressRecords.filter(c=>c.studentId===t.id).length,o=e.studentProfiles.find(c=>c.student.id===t.id),i=o==null?void 0:o.profile.risk,r=((d=o==null?void 0:o.profile.recommendedNext)==null?void 0:d.title)||"-";return`
              <tr class="student-row" data-id="${t.id}">
                <td class="student-table__name">${t.name}</td>
                <td>${a}/${$.length}</td>
                <td>${s.length}</td>
                <td class="student-table__score">${n?`${Math.round(n.score/n.totalQuestions*100)}%`:"-"}</td>
                <td>${r}</td>
                <td><span class="badge badge--${(i==null?void 0:i.badge)||"neutral"}">${(i==null?void 0:i.label)||"No Data"}</span></td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `:`
      <div class="empty-state dashboard-empty">
        <div class="empty-state__icon">Data</div>
        <h2 class="empty-state__title">No Student Learning Data Yet</h2>
        <p class="empty-state__text">As students log in, complete diagnostics, and take quizzes, this live roster will update automatically.</p>
      </div>
    `}function Is(e){const{summary:t}=e;return`
    <div class="dashboard-header">
      <div class="dashboard-header__top">
        <div>
          <h1 class="dashboard-header__title">Class Overview</h1>
          <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
        </div>
        <div class="dashboard-header__actions">
          <div class="dashboard-live-pill">
            <span class="dashboard-live-pill__dot"></span>
            Live database sync
          </div>
          <button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh Now</button>
        </div>
      </div>

      <div class="dashboard-live-bar">
        <div class="dashboard-live-bar__item"><strong>Last updated:</strong> <span id="dashboard-live-updated">${kt(It)}</span></div>
        <div class="dashboard-live-bar__item" id="dashboard-live-status-text"><strong>Sync mode:</strong> Instant local updates plus a 30 second heartbeat refresh.</div>
      </div>
    </div>

    <div class="stat-grid">
      ${oe("Students",t.totalStudents,"Total Students","primary",`${e.results.length} quizzes recorded`)}
      ${oe("Average",`${t.averageScore}%`,"Average Score","accent","Latest quiz per student")}
      ${oe("Progress",`${t.completionRate}%`,"Completion Rate","success",`${e.progressRecords.length} lesson completions logged`)}
      ${oe("Support",t.studentsAtRisk,"High Risk Learners",t.studentsAtRisk>0?"danger":"success","Prediction score 60+")}
      ${oe("Diagnostic",`${t.diagnosticCoverage}%`,"Diagnostic Coverage",t.diagnosticCoverage<100?"accent":"success","Students with readiness profiles")}
      ${oe("Assess",t.totalAssessments,"Published Assessments",t.totalAssessments>0?"primary":"accent",`${t.totalAssessmentSubmissions} assessment submissions logged`)}
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
          ${e.interventionQueue.length>0?e.interventionQueue.map(s=>`
            <div class="intervention-item">
              <div>
                <div class="intervention-item__name">${s.student.name}</div>
                <div class="intervention-item__meta">${s.profile.risk.reasons.join(" | ")}</div>
              </div>
              <div style="text-align: right;">
                <div class="badge badge--${s.profile.risk.badge}">Risk ${s.profile.risk.score}</div>
                <div class="intervention-item__action">${s.profile.risk.action}</div>
              </div>
            </div>
          `).join(""):'<div class="insight-empty">No learners are currently flagged for intervention.</div>'}
        </div>
      </div>

      <div class="card dashboard-panel">
        <h3 class="chart-card__title">Class Mastery Snapshot</h3>
        <p class="chart-card__subtitle">Average mastery by lesson after combining diagnostics, completion, and quiz performance.</p>
        <div class="mastery-grid">
          ${e.masterySnapshot.map(s=>`
            <div class="mastery-grid__item">
              <div class="mastery-grid__label">Lesson ${s.lessonId}</div>
              <div class="mastery-grid__title">${s.title}</div>
              <div class="mastery-grid__value">${s.averageMastery}%</div>
            </div>
          `).join("")}
        </div>
      </div>

      ${za(e)}
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

      ${Qa(e)}
    </div>
  `}function he(){return!!document.getElementById("dashboard-live-root")}function ks(){ve.forEach(e=>e.destroy()),ve=[]}function Ss(e){const t=document.getElementById("btn-export-csv"),s=document.getElementById("btn-open-assessment-lab"),n=document.getElementById("btn-refresh-dashboard");t&&t.addEventListener("click",async()=>{const a=await Sn();$n(a),E("Data exported successfully","success")}),s&&s.addEventListener("click",()=>{e("/assessment-lab")}),n&&n.addEventListener("click",()=>{de("manual")}),document.querySelectorAll(".student-row").forEach(a=>{a.addEventListener("click",o=>{const i=Number.parseInt(o.currentTarget.dataset.id,10);Ua(i)})})}async function de(e="live-update"){if(!he()){Ie();return}if(ce)return Pe=!0,ce;const t=document.getElementById("btn-refresh-dashboard"),s=(t==null?void 0:t.textContent)||"Refresh Now",n=document.getElementById("dashboard-live-status-text");return t&&(t.disabled=!0,t.textContent="Refreshing..."),n&&(n.innerHTML="<strong>Sync mode:</strong> Refreshing live analytics from the local database..."),ce=(async()=>{await _s();const a=document.getElementById("dashboard-live-root");if(!a)return;a.innerHTML=Is(T),Ss(ws),await $s();const o=document.getElementById("dashboard-live-updated");o&&(o.textContent=kt(It));const i=document.getElementById("dashboard-live-status-text");if(i){const r=e==="manual"?"Manual refresh complete.":"Live sync updated after a local database change.";i.innerHTML=`<strong>Sync mode:</strong> ${r}`}})().catch(a=>{console.error(a),E("Dashboard refresh failed. Please try again.","error")}).finally(()=>{t&&(t.disabled=!1,t.textContent=s),ce=null,Pe&&(Pe=!1,de("queued"))}),ce}function ja(){Be=sn(()=>{if(!he()){Ie();return}de("database-event")}),fe=()=>{document.visibilityState==="visible"&&he()&&de("visibility")},be=()=>{he()&&de("focus")},document.addEventListener("visibilitychange",fe),window.addEventListener("focus",be),qe=window.setInterval(()=>{if(!he()){Ie();return}document.visibilityState==="visible"&&de("heartbeat")},Ma)}function Ie(){Be&&(Be(),Be=null),qe&&(window.clearInterval(qe),qe=null),fe&&(document.removeEventListener("visibilitychange",fe),fe=null),be&&(window.removeEventListener("focus",be),be=null),ks(),se&&(se.destroy(),se=null),ce=null,Pe=!1}async function Na(){return await _s(),`
    ${P({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div id="dashboard-live-root">
        ${Is(T)}
      </div>
    </div>
  `}function Oa(e){Ie(),ws=e,R({onBack:()=>e("/"),onSettings:Fa,onLogout:()=>{kn(),e("/")}}),Ss(e),$s(),ja()}function Fa(){const e=pe()||"",t=gt()||"",s=`
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${e}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Used for quiz explanations, diagnostic coaching, and the AI tutor. You can update this any time.</p>
    </div>
    <div class="input-group">
      <label>Teacher PIN</label>
      <input type="password" id="settings-teacher-pin" class="input input--pin" value="${t}" placeholder="0000" maxlength="4" inputmode="numeric">
    </div>
  `;yt("Dashboard Settings",s,[{label:"Cancel",variant:"btn--ghost"},{label:"Save",variant:"btn--primary",onClick:async()=>{const n=document.getElementById("settings-api-key"),a=document.getElementById("settings-teacher-pin"),o=(n==null?void 0:n.value.trim())||"",i=(a==null?void 0:a.value.trim())||"";return i&&!/^\d{4}$/.test(i)?(E("Teacher PIN must stay 4 digits.","error"),!1):(await es(o),i&&await ts(i),E("Settings saved","success"),!0)}}])}async function Ua(e){var v,f;const t=(T==null?void 0:T.students)||await Se(),s=(T==null?void 0:T.results)||await $e(),n=(T==null?void 0:T.progressRecords)||await ss(),a=(T==null?void 0:T.diagnostics)||await as(),o=t.find(p=>p.id===e),i=s.filter(p=>p.studentId===e).sort((p,w)=>new Date(p.completedAt)-new Date(w.completedAt)),r=a.filter(p=>p.studentId===e).sort((p,w)=>new Date(w.completedAt)-new Date(p.completedAt))[0]||null,d=F({diagnostic:r,results:i,progressRecords:n.filter(p=>p.studentId===e)}),c=i.at(-1),l=i.length>0?Math.round(i.reduce((p,w)=>p+w.score/w.totalQuestions,0)/i.length*100):0,u=n.filter(p=>p.studentId===e).length,m=i.flatMap(p=>p.responses.map(w=>({...w,lessonId:p.lessonId,completedAt:p.completedAt}))).sort((p,w)=>new Date(w.answeredAt||w.completedAt)-new Date(p.answeredAt||p.completedAt));if(!o)return;const h=`
    <div class="student-detail">
      <div class="student-detail__header">
        <div class="student-detail__avatar">${o.name.slice(0,2).toUpperCase()}</div>
        <div>
          <div class="student-detail__name">${o.name}</div>
          <div class="dashboard-header__subtitle">Lessons completed: ${u}/${$.length}</div>
        </div>
      </div>

      <div class="student-detail__stats">
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${i.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${l}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${c?c.level:"-"}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${c?dt(c.averageTimeMs):"00:00"}</div>
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
            <div class="student-detail__snapshot-text">${((v=d.recommendedNext)==null?void 0:v.title)||"Lesson 1"} - ${((f=d.recommendedNext)==null?void 0:f.recommendedFocus)||"Continue the learning path."}</div>
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
            ${i.length>0?i.slice().reverse().map(p=>`
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${p.lessonId}: ${lt(p.lessonId)}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${new Date(p.completedAt).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: var(--font-weight-bold); color: ${p.score/p.totalQuestions>=.7?"var(--color-success-400)":"var(--color-warning-400)"};">${Math.round(p.score/p.totalQuestions*100)}%</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">theta ${p.theta.toFixed(2)}</div>
                </div>
              </div>
            `).join(""):'<div style="padding: var(--space-4); text-align: center; color: var(--text-muted); font-size: var(--font-size-sm);">No quizzes taken yet.</div>'}
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
              ${m.length>0?m.slice(0,18).map(p=>`
                <tr>
                  <td>${p.lessonId}</td>
                  <td>
                    <div class="student-detail__question">${p.stem}</div>
                    <div class="student-detail__question-sub">${p.options[p.selectedIndex]} ${p.correct?"":`-> ${p.options[p.correctIndex]}`}</div>
                  </td>
                  <td><span class="badge badge--${p.correct?"success":"danger"}">${p.correct?"Correct":"Review"}</span></td>
                  <td>${dt(p.elapsedMs)}</td>
                  <td>${p.thetaAfter}</td>
                </tr>
              `).join(""):'<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;yt("Student Profile",h,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),i.length>0&&setTimeout(()=>{Ha(i)},0)}async function $s(){if(!T)return;ks();const e=await ys();e.defaults.color="#94A3B8",e.defaults.borderColor="rgba(148, 163, 184, 0.1)";const t=document.getElementById("chart-scores");t&&ve.push(new e(t,{type:"bar",data:{labels:T.charts.lessonLabels,datasets:[{label:"Average Score (%)",data:T.charts.lessonScoreData,backgroundColor:"rgba(99, 102, 241, 0.8)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100}}}}));const s=document.getElementById("chart-levels");s&&ve.push(new e(s,{type:"doughnut",data:{labels:Object.keys(T.charts.levelCounts),datasets:[{data:Object.values(T.charts.levelCounts),backgroundColor:["#34D399","#818CF8","#FBBF24","#FB7185"],borderWidth:0,cutout:"70%"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right"}}}}));const n=document.getElementById("chart-misconceptions");if(n){const a=T.charts.misconceptions.map(i=>i.stem),o=T.charts.misconceptions.map(i=>i.count);ve.push(new e(n,{type:"bar",data:{labels:a,datasets:[{label:"Times missed",data:o,backgroundColor:"rgba(244, 63, 94, 0.75)",borderRadius:6}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{tooltip:{callbacks:{label(i){const r=T.charts.misconceptions[i.dataIndex];return`${i.raw} misses - common wrong answer: ${r.answer}`}}}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{ticks:{callback(i,r){return`Q${r+1}`}}}}}}))}}async function Ha(e){const t=document.getElementById("student-theta-chart");if(!t)return;const s=await ys();se&&(se.destroy(),se=null);const n=e.map(o=>`L${o.lessonId}`),a=e.map(o=>o.theta);se=new s(t,{type:"line",data:{labels:n,datasets:[{label:"Theta",data:a,borderColor:"#818CF8",backgroundColor:"rgba(129, 140, 248, 0.15)",fill:!0,tension:.35,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{min:-3,max:3}},plugins:{legend:{display:!1}}}})}function Wa(){return new Map($.map(e=>{const t=Qe.filter(s=>s.lessonId===e.id).sort((s,n)=>{const a=Math.abs(s.difficulty)-Math.abs(n.difficulty);return a!==0?a:n.discrimination-s.discrimination});return[e.id,t]}))}function Ga(e,t){return e>=.75&&t===0?"Ready to Accelerate":e>=.5?"Foundations Growing":"Needs Guided Support"}function zt(e){return $.map(t=>{const s=e.get(t.id)||[],n=s.filter(i=>i.correct).length,a=s.length,o=a>0?n/a:0;return{lessonId:t.id,lessonTitle:t.title,correct:n,attempted:a,accuracy:o}})}function Ka(){const e=Wa(),t=$.map(v=>{var f;return(f=e.get(v.id))==null?void 0:f[0]}).filter(Boolean),s=new Map($.map(v=>[v.id,(e.get(v.id)||[]).slice(1)])),n=new Set,a=[];let o=0,i=null,r=[],d=!1,c=!1;function l(){const v=new Map;for(const p of a){const w=v.get(p.lessonId)||[];w.push(p),v.set(p.lessonId,w)}r=zt(v).sort((p,w)=>p.accuracy!==w.accuracy?p.accuracy-w.accuracy:p.lessonId-w.lessonId).slice(0,3).map(p=>(s.get(p.lessonId)||[]).find(y=>!n.has(y.id))||null).filter(Boolean),d=!0}function u(){if(c)return null;let v=null;if(t.length>0?v=t.shift():(d||l(),v=r.shift()||null),!v)return c=!0,null;n.add(v.id),i=v,o+=1;const f=$.find(p=>p.id===v.lessonId);return{question:v,questionNumber:o,totalQuestions:8,lessonId:v.lessonId,lessonTitle:(f==null?void 0:f.title)||`Lesson ${v.lessonId}`,phase:o<=5?"coverage":"follow-up"}}function m(v){if(!i)return null;const f=v===i.correctIndex,p={questionId:i.id,lessonId:i.lessonId,stem:i.stem,options:i.options,selectedIndex:v,correctIndex:i.correctIndex,correct:f};return a.push(p),i=null,{correct:f,correctIndex:p.correctIndex}}function g(){const v=new Map;for(const b of a){const _=v.get(b.lessonId)||[];_.push(b),v.set(b.lessonId,_)}const f=zt(v),p=f.filter(b=>b.accuracy<.5),w=f.filter(b=>b.accuracy>=.75),y=a.filter(b=>b.correct).length,A=a.length,C=A>0?y/A:0;return{score:y,totalQuestions:A,readiness:Ga(C,p.length),generationMethod:"adaptive diagnostic",lessonBreakdown:f,knowledgeGaps:p,strengths:w,responses:a}}function h(){return c}return{next:u,answer:m,getResults:g,isFinished:h}}let Z=null,z=null,ke=!1;function Ya(){Z=Ka(),z=Z.next(),ke=!1}function Va(){(!Z||!z)&&Ya()}function xs(){Z=null,z=null,ke=!1}function Ja(){if(!Z||!z)return'<div class="container">Error loading diagnostic assessment.</div>';const e=L();return`
    ${P({title:"Diagnostic Assessment",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter diagnostic-page" style="padding-top: var(--space-6);">
      <div class="card card--glass diagnostic-hero">
        <div class="diagnostic-hero__eyebrow">AI-guided readiness check</div>
        <h1 class="diagnostic-hero__title">Let us map your starting point</h1>
        <p class="diagnostic-hero__text">This short pre-assessment samples all five lessons, then follows up on the topics that need the most attention.</p>
        <div class="diagnostic-hero__meta">
          <span class="badge badge--neutral">8 questions max</span>
          <span class="badge badge--accent">${z.phase==="coverage"?"Checking broad coverage":"Following up on weak areas"}</span>
          <span class="badge badge--primary">${z.lessonTitle}</span>
        </div>
      </div>

      <div class="diagnostic-stage">
        <div class="diagnostic-stage__header">
          <div>
            <div class="diagnostic-stage__label">Question ${z.questionNumber}</div>
            <h2 class="diagnostic-stage__title">${z.lessonTitle}</h2>
          </div>
          <span class="badge badge--neutral">${z.phase==="coverage"?"Coverage pass":"Adaptive follow-up"}</span>
        </div>

        ${Ce(z.questionNumber-1,z.totalQuestions,"Diagnostic progress")}

        <div id="diagnostic-question-wrap">
          ${ds(z.question)}
        </div>
      </div>
    </div>
  `}function Za(e,t){R({onBack:()=>e("/lessons")}),document.querySelectorAll(".option-btn").forEach(s=>{s.addEventListener("click",async n=>{if(ke)return;ke=!0;const a=Number.parseInt(n.currentTarget.dataset.index,10);await Xa(a,n.currentTarget,e,t)})})}async function Xa(e,t,s,n){const a=Z.answer(e);if(document.querySelectorAll(".option-btn").forEach(r=>{r.classList.add("option-btn--disabled"),r.disabled=!0}),a.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const r=document.getElementById(`option-${a.correctIndex}`);r&&r.classList.add("option-btn--highlight-correct")}await new Promise(r=>setTimeout(r,500));const i=Z.next();if(!i){await ei(s);return}z=i,ke=!1,await n()}async function ei(e){const t=L(),s=Z.getResults();if(!t){e("/student-login");return}const n=await pn({studentId:t.id,...s});xs(),e(`/diagnostic-results/${n.id}`)}const ti="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function si(e){const t=e.objectives.slice(0,2).join("; "),s=(e.keyTerms||[]).slice(0,3).map(n=>`${n.word}: ${n.definition}`).join("; ");return`${e.title}. Objectives: ${t}. Key terms: ${s}`}function As(e){var o;const t=e.knowledgeGaps.map(i=>i.title).join(", ")||"none identified",s=e.strengths.map(i=>i.title).join(", ")||"still emerging",n=((o=e.recommendedNext)==null?void 0:o.title)||"Lesson 1",a=e.revisionQueue.map(i=>`${i.title} (${i.reason})`).join("; ")||"none";return[`Readiness: ${e.readiness.label}.`,`Completion rate: ${e.completionRate}%.`,`Knowledge gaps: ${t}.`,`Strengths: ${s}.`,`Recommended next lesson: ${n}.`,`Revision queue: ${a}.`].join(" ")}function ni(e){const t=e.toLowerCase();return $.find(s=>t.includes(s.title.toLowerCase())?!0:(s.keyTerms||[]).some(n=>t.includes(n.word.toLowerCase())))||null}function ai(e){var n,a,o;const t=((n=e.strengths[0])==null?void 0:n.title)||"your earliest lessons",s=((a=e.knowledgeGaps[0])==null?void 0:a.title)||((o=e.recommendedNext)==null?void 0:o.title)||"the next lesson";return`You are showing the most confidence in ${t}. Focus next on ${s}, then use the AI Tutor to clear up anything that still feels confusing. Small, steady review sessions will move your readiness up quickly.`}function ii(e,t){var i,r;const s=ni(e),n=t.knowledgeGaps[0],a=t.recommendedNext,o=e.toLowerCase();if(o.includes("next")||o.includes("study")||o.includes("path"))return`Your best next step is ${(a==null?void 0:a.title)||"the next lesson in your path"}. It is recommended because ${n?`${n.title} still needs review`:"it keeps your momentum going"}. After that, revisit one item from your revision queue before taking the quiz.`;if(s){const d=(i=s.keyTerms)==null?void 0:i[0],c=(r=s.objectives)==null?void 0:r[0];return`${s.title} is mainly about ${(c==null?void 0:c.toLowerCase())||"this topic area"}. Start with this idea: ${d?`${d.word} means ${d.definition}`:"focus on the core lesson objective first"}. Then compare it with your own words and try one practice question before moving on.`}return o.includes("struggling")||o.includes("stuck")||o.includes("hard")?`It looks like ${(n==null?void 0:n.title)||"one of your current topics"} needs a slower, more guided review. Break it into two parts: reread the lesson objectives first, then ask me one specific question about a term or idea that is still unclear.`:`I remember your current path is strongest when we keep things focused. Start with ${(a==null?void 0:a.title)||"your next recommended lesson"}, and if a concept feels confusing, ask me about one term or one example at a time so we can unpack it together.`}async function Cs(e){var s,n,a,o,i,r;const t=pe();if(!t||!navigator.onLine)return null;try{const d=await fetch(`${ti}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.6,maxOutputTokens:300,topP:.9}}),signal:AbortSignal.timeout(12e3)});if(!d.ok)return null;const c=await d.json();return((r=(i=(o=(a=(n=(s=c==null?void 0:c.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:a.parts)==null?void 0:o[0])==null?void 0:i.text)==null?void 0:r.trim())||null}catch{return null}}async function oi(e,t,s){const n=["You are a warm, concise learning coach for Basic 7 Computing.",`Student: ${e.name}.`,`Diagnostic readiness: ${t.readiness}.`,As(s),"Write exactly 3 supportive sentences for the student.","Sentence 1: celebrate one strength.","Sentence 2: explain the most important gap to focus on next.","Sentence 3: give a short action plan using the tutor and the next lesson."].join(`
`),a=await Cs(n);return{text:a||ai(s),source:a?"ai":"fallback"}}async function ri({student:e,message:t,history:s=[],profile:n}){const a=$.map(si).join(`
`),o=s.slice(-8).map(d=>`${d.role}: ${d.content}`).join(`
`),i=["You are ClassConnect Tutor, a supportive Basic 7 Computing tutor.",`Student: ${e.name}.`,As(n),"Use the profile and memory below. Keep answers clear, age-appropriate, and practical.","If the learner asks what to study next, recommend the personalized path.","If the learner asks about a concept, explain it simply and connect it to one lesson.","Respond in 2 short paragraphs maximum.","Lesson references:",a,"Conversation memory:",o||"No prior messages yet.",`Student message: ${t}`].join(`
`),r=await Cs(i);return{text:r||ii(t,n),source:r?"ai":"fallback"}}function Qt(e,t,s){return e.length?e.map(n=>`
    <div class="insight-pill insight-pill--${s}">
      <div class="insight-pill__title">${n.lessonTitle||n.title}</div>
      <div class="insight-pill__meta">${n.accuracy!==void 0?`${Math.round(n.accuracy*100)}% diagnostic accuracy`:n.recommendedFocus||"Ready for the next step"}</div>
    </div>
  `).join(""):`<div class="insight-empty">${t}</div>`}async function ci(e){var d;const t=L(),s=await ns(Number.parseInt(e,10));if(!t||!s||s.studentId!==t.id)return'<div class="container" style="padding: 2rem;">Diagnostic result not found.</div>';const n=await G(t.id),a=await O(t.id),o=await ie(t.id),i=F({diagnostic:n,results:o,progressRecords:a}),r=s.totalQuestions>0?Math.round(s.score/s.totalQuestions*100):0;return`
    ${P({title:"Diagnostic Results",showBack:!0,studentName:t.name})}
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
            <div class="diagnostic-metric__value">${((d=i.recommendedNext)==null?void 0:d.lessonId)||1}</div>
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
            ${Qt(s.knowledgeGaps,"No urgent gaps were detected in the diagnostic.","warning")}
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Current Strengths</h3>
          <div class="insight-pill-list">
            ${Qt(s.strengths,"Your strengths will appear here as you build more evidence.","success")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="diagnostic-section__title">Adaptive Content Path</h3>
        <p class="diagnostic-section__subtitle">These lessons are now prioritized using your diagnostic, lesson completion, and quiz evidence.</p>
        <div class="path-preview">
          ${i.recommendedSequence.slice(0,4).map((c,l)=>`
            <button class="path-preview__item" data-lesson-id="${c.lessonId}">
              <div class="path-preview__index">${l+1}</div>
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
  `}function di(e,t){R({onBack:()=>e("/lessons")});const s=document.getElementById("btn-open-path"),n=document.getElementById("btn-open-tutor"),a=document.getElementById("btn-retake-diagnostic");ns(Number.parseInt(t,10)).then(async o=>{const i=L();if(!i||!o)return;const r=await G(i.id),d=await O(i.id),c=await ie(i.id),l=F({diagnostic:r,results:c,progressRecords:d});s&&s.addEventListener("click",()=>{var h;e(`/lesson/${((h=l.recommendedNext)==null?void 0:h.lessonId)||1}`)}),n&&n.addEventListener("click",()=>{e("/tutor")}),a&&a.addEventListener("click",()=>{e("/diagnostic")}),document.querySelectorAll(".path-preview__item").forEach(h=>{h.addEventListener("click",v=>{const f=Number.parseInt(v.currentTarget.dataset.lessonId,10);e(`/lesson/${f}`)})});const u=await oi(i,o,l),m=document.getElementById("diagnostic-insight"),g=document.getElementById("diagnostic-insight-source");m&&(m.textContent=u.text),g&&(g.textContent=u.source==="ai"?"AI generated":"Offline-ready insight",g.className=`badge ${u.source==="ai"?"badge--primary":"badge--neutral"}`)})}const li=["What should I study next?","Explain RAM and storage in simple words.","Help me review my weakest topic."];let D={studentId:null,messages:[],sending:!1};function ui(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function pi(e){if(D.studentId===e)return;const t=await hn(e);D={studentId:e,messages:(t==null?void 0:t.messages)||[],sending:!1}}function mi(){return D.messages.length?D.messages.map(e=>`
    <div class="chat-bubble chat-bubble--${e.role}">
      <div class="chat-bubble__role">${e.role==="assistant"?"AI Tutor":"You"}</div>
      <div class="chat-bubble__text">${ui(e.content)}</div>
      ${e.source?`<div class="chat-bubble__meta">${e.source==="ai"?"AI response":"Offline support response"}</div>`:""}
    </div>
  `).join(""):`
      <div class="tutor-empty">
        <div class="tutor-empty__title">Your tutor is ready</div>
        <p class="tutor-empty__text">Ask for an explanation, revision tip, or what to study next. The tutor will answer using your lesson history and diagnostic profile.</p>
      </div>
    `}async function hi(){var o,i,r,d;const e=L();if(!e)return'<div class="container" style="padding: 2rem;">Student session not found.</div>';await pi(e.id);const t=await G(e.id),s=await O(e.id),n=await ie(e.id),a=F({diagnostic:t,results:n,progressRecords:s});return`
    ${P({title:"AI Tutor",showBack:!0,studentName:e.name})}
    <div class="container container--narrow view-enter tutor-page">
      <div class="card card--glass tutor-hero">
        <div class="tutor-hero__header">
          <div>
            <div class="diagnostic-hero__eyebrow">Context-aware tutor with memory</div>
            <h1 class="tutor-hero__title">Ask for help at your own pace</h1>
          </div>
          ${D.messages.length?'<button class="btn btn--ghost btn--sm" id="btn-clear-chat">Clear chat</button>':""}
        </div>

        <div class="tutor-hero__chips">
          <span class="badge badge--${a.readiness.tone}">${a.readiness.label}</span>
          <span class="badge badge--primary">Next: ${((o=a.recommendedNext)==null?void 0:o.title)||"Lesson 1"}</span>
          <span class="badge badge--neutral">Risk: ${a.risk.label}</span>
        </div>

        <p class="tutor-hero__memory">
          I remember that your strongest current evidence is in <strong>${((i=a.strengths[0])==null?void 0:i.title)||"the topics you have already practiced"}</strong>,
          while the biggest focus area is <strong>${((r=a.knowledgeGaps[0])==null?void 0:r.title)||((d=a.recommendedNext)==null?void 0:d.title)||"the next lesson in your path"}</strong>.
        </p>
      </div>

      <div class="card tutor-thread-card">
        <div class="tutor-thread" id="tutor-thread">
          ${mi()}
          ${D.sending?'<div class="chat-bubble chat-bubble--assistant"><div class="chat-bubble__role">AI Tutor</div><div class="shimmer" style="height: 52px;"></div></div>':""}
        </div>

        <div class="tutor-prompts">
          ${li.map(c=>`
            <button class="tutor-prompt" data-prompt="${c}">${c}</button>
          `).join("")}
        </div>

        <form class="tutor-composer" id="tutor-form">
          <textarea id="tutor-input" class="input tutor-composer__input" rows="3" placeholder="Ask a question about a lesson, concept, or what to study next..." ${D.sending?"disabled":""}></textarea>
          <button class="btn btn--primary" type="submit" ${D.sending?"disabled":""}>Send</button>
        </form>
      </div>
    </div>
  `}function gi(e,t){R({onBack:()=>e("/lessons")});const s=document.getElementById("tutor-form"),n=document.getElementById("tutor-input"),a=document.getElementById("btn-clear-chat"),o=document.getElementById("tutor-thread");o&&(o.scrollTop=o.scrollHeight),a&&a.addEventListener("click",async()=>{const i=L();i&&(await gn(i.id),D={studentId:i.id,messages:[],sending:!1},await t())}),document.querySelectorAll(".tutor-prompt").forEach(i=>{i.addEventListener("click",async r=>{const d=r.currentTarget.dataset.prompt;d&&await jt(d,t)})}),s&&n&&s.addEventListener("submit",async i=>{i.preventDefault();const r=n.value.trim();if(!r){E("Type a question for the tutor first.","error");return}await jt(r,t)})}async function jt(e,t){const s=L();if(!s||D.sending)return;const n=await G(s.id),a=await O(s.id),o=await ie(s.id),i=F({diagnostic:n,results:o,progressRecords:a}),r={role:"user",content:e,createdAt:new Date().toISOString()};D={...D,sending:!0,messages:[...D.messages,r]},await Tt(s.id,D.messages),await t();const d=await ri({student:s,message:e,history:D.messages,profile:i});D={...D,sending:!1,messages:[...D.messages,{role:"assistant",content:d.text,source:d.source,createdAt:new Date().toISOString()}]},await Tt(s.id,D.messages),await t()}const vi="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",Nt={1:{prompt:"Write a JavaScript function named `isPortableComputer(type)` that returns `true` for portable computers like a laptop, tablet, or smartphone, and `false` for a desktop or server.",starterCode:`function isPortableComputer(type) {
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
`}};function Ts(e=""){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Ze(e,t){const s=e.slice(),n=[];for(;s.length>0&&n.length<t;)n.push(s.shift());return n}function ut(e){const t=$.filter(s=>e.includes(s.id));return t.length>0?t:$.slice(0,2)}function fi(e=""){const t=e.match(/```json\s*([\s\S]*?)```/i);if(t!=null&&t[1])return t[1].trim();const s=e.indexOf("{"),n=e.lastIndexOf("}");return s>=0&&n>s?e.slice(s,n+1):e}function bi(e,t,s){const n=["mcq","short","code"].includes(e.type)?e.type:"short",a=s.includes(e.lessonId)?e.lessonId:s[0],o=Number.isFinite(e.maxScore)?e.maxScore:n==="mcq"?1:5,i=Array.isArray(e.rubric)&&e.rubric.length>0?e.rubric.map(r=>({criterion:r.criterion||"Quality",description:r.description||"Addresses the prompt clearly.",points:Number.isFinite(r.points)?r.points:2,keywords:Array.isArray(r.keywords)?r.keywords:[]})):[{criterion:"Accuracy",description:"Uses correct subject knowledge.",points:o,keywords:[]}];return{id:`GEN-Q${t+1}`,type:n,lessonId:a,objective:e.objective||"Generated from lesson objectives",prompt:e.prompt||e.stem||`Generated question ${t+1}`,options:n==="mcq"&&Array.isArray(e.options)&&e.options.length===4?e.options:void 0,correctIndex:n==="mcq"&&Number.isInteger(e.correctIndex)?e.correctIndex:void 0,starterCode:n==="code"?e.starterCode||"":void 0,answerKey:e.answerKey||"",sampleSolution:e.sampleSolution||"",rubric:i,maxScore:o}}function yi(e,t,s){const n=(e.keyTerms||[]).slice(0,3),a=n.map(i=>i.word.toLowerCase()),o=`In 3-5 sentences, ${t.charAt(0).toLowerCase()}${t.slice(1)}. Use at least one correct computing term from this lesson.`;return{id:`SA-Q${s+1}`,type:"short",lessonId:e.id,objective:t,prompt:o,answerKey:n.map(i=>`${i.word}: ${i.definition}`).join(" "),rubric:[{criterion:"Concept accuracy",description:"The response explains the idea correctly.",points:3,keywords:a},{criterion:"Use of subject vocabulary",description:"The response uses at least one correct computing term.",points:1,keywords:a},{criterion:"Clarity",description:"The response is easy to follow and stays on task.",points:1,keywords:[]}],maxScore:5}}function wi(e,t,s){const n=Nt[e.id]||Nt[5];return{id:`CODE-Q${s+1}`,type:"code",lessonId:e.id,objective:t,prompt:`${n.prompt}

Learning objective: ${t}`,starterCode:n.starterCode,answerKey:n.sampleSolution,sampleSolution:n.sampleSolution,rubric:[{criterion:"Correct logic",description:"The code follows the expected rule from the lesson.",points:3,keywords:n.keyConcepts},{criterion:"Programming structure",description:"The answer uses a function, return value, and clear condition or lookup.",points:2,keywords:["function","return"]}],maxScore:5}}function _i(e,t){return{id:`MCQ-Q${t+1}`,type:"mcq",lessonId:e.lessonId,objective:"Check core understanding of the lesson objective.",prompt:e.stem,options:e.options,correctIndex:e.correctIndex,answerKey:e.options[e.correctIndex],rubric:[{criterion:"Correct answer",description:"Selects the correct option.",points:1,keywords:[]}],maxScore:1}}function Ii(e){const t=ut(e.lessonIds),s=t.flatMap(g=>g.objectives.map(h=>({lesson:g,objective:h}))),n=s.length>0?s:$.slice(0,1).flatMap(g=>g.objectives.map(h=>({lesson:g,objective:h}))),a=n.map(g=>({lessonId:g.lesson.id,lessonTitle:g.lesson.title,objective:g.objective})),o=Qe.filter(g=>e.lessonIds.includes(g.lessonId)).sort((g,h)=>h.discrimination-g.discrimination||g.difficulty-h.difficulty),i=Ze(n,e.shortAnswerCount||0),r=Ze(n.slice().reverse(),e.codingCount||0),d=Ze(o,e.mcqCount||0).map(_i),c=i.map((g,h)=>yi(g.lesson,g.objective,h)),l=r.map((g,h)=>wi(g.lesson,g.objective,h)),u=[...d,...c,...l].map((g,h)=>({...g,id:`${Ts(e.title||"assessment")}-q${h+1}`})),m=u.length;return{title:e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"fallback",published:!0,lessonIds:t.map(g=>g.id),objectiveCoverage:a,durationMinutes:e.durationMinutes||Math.max(15,m*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:u}}async function ki(e){var o,i,r,d,c;const t=pe();if(!t||!navigator.onLine)return null;const n=ut(e.lessonIds).map(l=>[`Lesson ${l.id}: ${l.title}`,`Objectives: ${l.objectives.join("; ")}`,`Key terms: ${(l.keyTerms||[]).map(u=>`${u.word}=${u.definition}`).join("; ")}`].join(`
`)).join(`

`),a=["You are building a classroom assessment for Basic 7 Computing.","Return valid JSON only.",`Title: ${e.title}`,`Question counts: ${e.mcqCount} multiple choice, ${e.shortAnswerCount} short answer, ${e.codingCount} coding.`,`Target duration in minutes: ${e.durationMinutes}.`,"Each question must include: type, lessonId, objective, prompt, maxScore, rubric[].","MCQ questions must also include options[4] and correctIndex.","Code questions must also include starterCode and sampleSolution.","Include an objectiveCoverage array with lessonId, lessonTitle, objective.","Keep questions age-appropriate and aligned to the lessons below.",n,"JSON shape:",'{"title":"","objectiveCoverage":[{"lessonId":1,"lessonTitle":"","objective":""}],"questions":[{"type":"mcq","lessonId":1,"objective":"","prompt":"","options":["","","",""],"correctIndex":0,"maxScore":1,"rubric":[{"criterion":"","description":"","points":1,"keywords":[""]}]}]}'].join(`

`);try{const l=await fetch(`${vi}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a}]}],generationConfig:{temperature:.7,maxOutputTokens:1200,topP:.9}}),signal:AbortSignal.timeout(15e3)});if(!l.ok)return null;const u=await l.json(),m=(c=(d=(r=(i=(o=u==null?void 0:u.candidates)==null?void 0:o[0])==null?void 0:i.content)==null?void 0:r.parts)==null?void 0:d[0])==null?void 0:c.text;if(!m)return null;const g=JSON.parse(fi(m));if(!Array.isArray(g.questions)||g.questions.length===0)return null;const h=g.questions.map((v,f)=>bi(v,f,e.lessonIds));return{title:g.title||e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"ai",published:!0,lessonIds:e.lessonIds,objectiveCoverage:Array.isArray(g.objectiveCoverage)&&g.objectiveCoverage.length>0?g.objectiveCoverage:ut(e.lessonIds).flatMap(v=>v.objectives.map(f=>({lessonId:v.id,lessonTitle:v.title,objective:f}))),durationMinutes:e.durationMinutes||Math.max(15,h.length*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:h.map((v,f)=>({...v,id:`${Ts(e.title||"assessment")}-q${f+1}`}))}}catch{return null}}function Si(){return $.map(e=>({lessonId:e.id,title:e.title,objectives:e.objectives}))}async function $i(e){var n;const t={title:((n=e.title)==null?void 0:n.trim())||"Assessment Blueprint",lessonIds:Array.isArray(e.lessonIds)&&e.lessonIds.length>0?e.lessonIds:[1,2],mcqCount:Math.max(0,Number.parseInt(e.mcqCount,10)||0),shortAnswerCount:Math.max(0,Number.parseInt(e.shortAnswerCount,10)||0),codingCount:Math.max(0,Number.parseInt(e.codingCount,10)||0),durationMinutes:Math.max(10,Number.parseInt(e.durationMinutes,10)||20)};return await ki(t)||Ii(t)}function ge(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function Xe(e,t=2){return Math.round(e*10**t)/10**t}function xi(e,t){const s=t.map(r=>{var d;return{...r,totalNormalized:(d=r.grading)!=null&&d.maxScore?r.grading.totalScore/r.grading.maxScore:0}}),n=s.slice().sort((r,d)=>d.totalNormalized-r.totalNormalized),a=Math.max(1,Math.ceil(n.length/3)),o=n.slice(0,a),i=n.slice(-a);return e.questions.map(r=>{const d=s.map(h=>{var v,f;return(f=(v=h.grading)==null?void 0:v.questionScores)==null?void 0:f.find(p=>p.questionId===r.id)}).filter(Boolean),c=ge(d.map(h=>h.normalizedScore)),l=ge(o.map(h=>{var v,f,p;return(p=(f=(v=h.grading)==null?void 0:v.questionScores)==null?void 0:f.find(w=>w.questionId===r.id))==null?void 0:p.normalizedScore}).filter(h=>typeof h=="number")),u=ge(i.map(h=>{var v,f,p;return(p=(f=(v=h.grading)==null?void 0:v.questionScores)==null?void 0:f.find(w=>w.questionId===r.id))==null?void 0:p.normalizedScore}).filter(h=>typeof h=="number")),m=l-u;let g="Healthy";return c<.25?g="Too Hard":c>.85?g="Too Easy":m<.15&&(g="Weak Discriminator"),{questionId:r.id,type:r.type,prompt:r.prompt,objective:r.objective,difficultyIndex:Xe(c),discriminationIndex:Xe(m),meanScore:Xe(ge(d.map(h=>h.score||0))),status:g,submissionCount:d.length}})}function Ls(e,t){const s=xi(e,t),n=t.length>0?Math.round(ge(t.map(i=>{var r;return((r=i.grading)==null?void 0:r.percentage)||0}))):0,a=t.filter(i=>{var r;return((r=i.integrity)==null?void 0:r.label)==="High"}).length,o=t.filter(i=>{var r;return((r=i.proctor)==null?void 0:r.label)==="High"}).length;return{assessmentId:e.id,title:e.title,generatedBy:e.generatedBy,submissionCount:t.length,averagePercentage:n,flaggedIntegrityCount:a,flaggedProctorCount:o,itemAnalysis:s}}function et(e,t){return e.filter(s=>s.type===t).length}function Ai(){return Si().map(t=>`
    <label class="assessment-check">
      <input type="checkbox" name="lesson-id" value="${t.lessonId}" ${t.lessonId<=3?"checked":""}>
      <span class="assessment-check__body">
        <span class="assessment-check__title">Lesson ${t.lessonId}: ${t.title}</span>
        <span class="assessment-check__meta">${t.objectives.length} objectives available</span>
      </span>
    </label>
  `).join("")}function Ci(e,t){return e.length?e.map(s=>{const n=t.filter(o=>o.assessmentId===s.id),a=Ls(s,n);return`
      <div class="card assessment-admin-card">
        <div class="assessment-admin-card__header">
          <div>
            <div class="assessment-admin-card__eyebrow">${s.generatedBy==="ai"?"AI generated":"Objective-based fallback"}</div>
            <h3 class="assessment-admin-card__title">${s.title}</h3>
            <p class="assessment-admin-card__meta">${s.durationMinutes} min | ${s.questions.length} questions | ${s.objectiveCoverage.length} objectives covered</p>
          </div>
          <div class="assessment-admin-card__badges">
            <span class="badge badge--primary">${et(s.questions,"mcq")} MCQ</span>
            <span class="badge badge--accent">${et(s.questions,"short")} Short</span>
            <span class="badge badge--warning">${et(s.questions,"code")} Code</span>
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
    `}function Ot(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Ti(e){const t=await xe(),s=await Ae(),n=await Se(),a=t.find(c=>c.id===e);if(!a)return;const o=s.filter(c=>c.assessmentId===a.id),i=Ls(a,o),r=o.filter(c=>{var l,u;return((l=c.integrity)==null?void 0:l.label)!=="Low"||((u=c.proctor)==null?void 0:u.label)!=="Low"}).map(c=>{var u,m,g,h,v;const l=n.find(f=>f.id===c.studentId);return`
        <tr>
          <td>${(l==null?void 0:l.name)||"Unknown"}</td>
          <td>${((u=c.grading)==null?void 0:u.percentage)||0}%</td>
          <td>${((m=c.integrity)==null?void 0:m.label)||"Low"} (${((g=c.integrity)==null?void 0:g.score)||0})</td>
          <td>${((h=c.proctor)==null?void 0:h.label)||"Low"} (${((v=c.proctor)==null?void 0:v.anomalyScore)||0})</td>
        </tr>
      `}).join(""),d=`
    <div class="analysis-modal">
      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Objective Coverage</h4>
        <div class="analysis-modal__chips">
          ${a.objectiveCoverage.map(c=>`
            <span class="badge badge--neutral">${Ot(c.lessonTitle||`Lesson ${c.lessonId}`)}: ${Ot(c.objective)}</span>
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
              ${i.itemAnalysis.map((c,l)=>`
                <tr>
                  <td>Q${l+1}</td>
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
  `;yt(a.title,d,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"})}async function Li(){const e=(await xe()).slice().sort((s,n)=>new Date(n.createdAt)-new Date(s.createdAt)),t=await Ae();return`
    ${P({title:"Assessment Lab",showBack:!0,showSettings:!1,showLogout:!1})}
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
                ${Ai()}
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
            ${Ci(e,t)}
          </div>
        </div>
      </div>
    </div>
  `}function Di(e){R({onBack:()=>e("/dashboard")});const t=document.getElementById("assessment-builder-form");t&&t.addEventListener("submit",async s=>{var r,d,c,l,u;s.preventDefault();const n=[...document.querySelectorAll('input[name="lesson-id"]:checked')].map(m=>Number.parseInt(m.value,10)).filter(Boolean),a={title:((r=document.getElementById("assessment-title"))==null?void 0:r.value)||"",durationMinutes:((d=document.getElementById("assessment-duration"))==null?void 0:d.value)||"25",mcqCount:((c=document.getElementById("assessment-mcq-count"))==null?void 0:c.value)||"0",shortAnswerCount:((l=document.getElementById("assessment-short-count"))==null?void 0:l.value)||"0",codingCount:((u=document.getElementById("assessment-code-count"))==null?void 0:u.value)||"0",lessonIds:n},o=Number.parseInt(a.mcqCount,10)+Number.parseInt(a.shortAnswerCount,10)+Number.parseInt(a.codingCount,10);if(n.length===0){E("Choose at least one lesson for the blueprint.","error");return}if(o<=0){E("Add at least one question to the assessment.","error");return}const i=t.querySelector('button[type="submit"]');i&&(i.disabled=!0,i.textContent="Generating...");try{const m=await $i(a);await vn(m),E(`Assessment published with ${m.questions.length} questions.`,"success"),await e("/assessment-lab")}catch(m){console.error(m),E("Assessment generation failed. Please try again.","error"),i&&(i.disabled=!1,i.textContent="Generate and Publish Assessment")}}),document.querySelectorAll(".btn-view-analysis").forEach(s=>{s.addEventListener("click",async n=>{const a=Number.parseInt(n.currentTarget.dataset.assessmentId,10);await Ti(a)})})}async function Mi(){const e=L(),t=(await xe()).filter(n=>n.published!==!1).sort((n,a)=>new Date(a.createdAt)-new Date(n.createdAt)),s=e?await is(e.id):[];return`
    ${P({title:"Assessment Center",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-center-page" style="padding-top: var(--space-6);">
      <div class="card card--glass assessment-hero">
        <div class="assessment-hero__eyebrow">Secure assessment workspace</div>
        <h1 class="assessment-hero__title">Take published assessments and review your feedback</h1>
        <p class="assessment-hero__text">Open-ended responses are graded against rubrics, browser anomalies are logged locally, and every submission gets an integrity review plus a remediation plan.</p>
      </div>

      <div class="assessment-student-list">
        ${t.length>0?t.map(n=>{var i,r;const a=s.filter(d=>d.assessmentId===n.id).sort((d,c)=>new Date(c.completedAt)-new Date(d.completedAt))[0],o=n.questions.length;return`
            <div class="card assessment-student-card">
              <div class="assessment-student-card__header">
                <div>
                  <div class="assessment-admin-card__eyebrow">${n.generatedBy==="ai"?"AI blueprint":"Objective blueprint"}</div>
                  <h2 class="assessment-student-card__title">${n.title}</h2>
                  <p class="assessment-student-card__meta">${n.durationMinutes} min | ${o} questions | ${n.objectiveCoverage.length} objectives</p>
                </div>
                ${a?`<span class="badge badge--${((i=a.integrity)==null?void 0:i.label)==="High"?"warning":"success"}">${((r=a.grading)==null?void 0:r.percentage)||0}% latest</span>`:'<span class="badge badge--neutral">Not taken yet</span>'}
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
  `}function Ei(e){R({onBack:()=>e("/lessons")}),document.querySelectorAll(".btn-start-assessment").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.assessmentId,10);e(`/assessment/${n}`)})}),document.querySelectorAll(".btn-view-assessment-result").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.submissionId,10);e(`/assessment-results/${n}`)})})}function Ds(){return new Date().toISOString()}function Bi(e,t={}){return{type:e,detail:t,timestamp:Ds()}}function qi(){const e=[],t=[],s=new Map;let n=null;function a(u,m={}){e.push(Bi(u,m))}function o(u,m,g,h){u.addEventListener(m,g,h),t.push(()=>u.removeEventListener(m,g,h))}async function i(){try{!document.fullscreenElement&&document.documentElement.requestFullscreen&&await document.documentElement.requestFullscreen()}catch{a("fullscreen-request-failed")}}async function r(){n=Date.now(),await i(),o(document,"visibilitychange",()=>{document.hidden&&a("tab-hidden")}),o(window,"blur",()=>{a("window-blur")}),o(document,"fullscreenchange",()=>{document.fullscreenElement||a("fullscreen-exit")}),o(document,"contextmenu",u=>{u.preventDefault(),a("context-menu-open")}),["copy","cut","paste"].forEach(u=>{o(document,u,m=>{m.preventDefault(),a(`${u}-attempt`)})}),o(document,"keydown",u=>{(u.key==="F12"||u.ctrlKey&&["c","v","x","p","s","u"].includes(u.key.toLowerCase())||u.ctrlKey&&u.shiftKey&&["i","j","c"].includes(u.key.toLowerCase()))&&(u.preventDefault(),a("blocked-shortcut",{key:u.key}))}),window.onbeforeunload=()=>"Assessment still in progress.",a("proctor-started")}function d(u,m){const g=(m||"").length,h=s.get(u)||{length:0,updatedAt:Date.now()},v=Date.now(),f=g-h.length,p=v-h.updatedAt;f>=80&&p<1500&&a("burst-typing",{questionId:u,deltaLength:f,deltaTime:p}),s.set(u,{length:g,updatedAt:v})}function c(){const u=e.reduce((g,h)=>(g[h.type]=(g[h.type]||0)+1,g),{}),m=Math.min(100,(u["fullscreen-exit"]||0)*18+(u["tab-hidden"]||0)*16+(u["window-blur"]||0)*12+(u["paste-attempt"]||0)*12+(u["copy-attempt"]||0)*8+(u["cut-attempt"]||0)*8+(u["blocked-shortcut"]||0)*7+(u["burst-typing"]||0)*10+(u["context-menu-open"]||0)*6);return{startedAt:n?new Date(n).toISOString():null,endedAt:Ds(),durationMs:n?Date.now()-n:0,anomalyScore:m,label:m>=60?"High":m>=30?"Moderate":"Low",counts:u,events:e}}async function l(){t.splice(0).forEach(u=>u()),window.onbeforeunload=null;try{document.fullscreenElement&&document.exitFullscreen&&await document.exitFullscreen()}catch{}return a("proctor-stopped"),c()}return{start:r,stop:l,summarize:c,logEvent:a,trackTextEntry:d}}const Pi="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function ye(e,t,s){return Math.max(t,Math.min(s,e))}function Ri(e,t=2){return Math.round(e*10**t)/10**t}function zi(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function Qi(e,t=[]){return t.length?t.reduce((s,n)=>e.includes(String(n).toLowerCase())?s+1:s,0):0}function ji(e){return e.filter(Boolean).join(" ")}async function Ni(e){var s,n,a,o,i;const t=pe();if(!t||!navigator.onLine)return null;try{const r=await fetch(`${Pi}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.3,maxOutputTokens:400,topP:.85}}),signal:AbortSignal.timeout(12e3)});if(!r.ok)return null;const d=await r.json(),c=(i=(o=(a=(n=(s=d==null?void 0:d.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:a.parts)==null?void 0:o[0])==null?void 0:i.text;if(!c)return null;const l=c.includes("{")?c.slice(c.indexOf("{"),c.lastIndexOf("}")+1):c;return JSON.parse(l)}catch{return null}}function Oi(e,t){var c;const s=e.maxScore||((c=e.rubric)==null?void 0:c.reduce((l,u)=>l+u.points,0))||5,n=t.trim();if(!n)return{score:0,maxScore:s,rubricBreakdown:(e.rubric||[]).map(l=>({criterion:l.criterion,score:0,maxScore:l.points,evidence:"No evidence yet."})),feedback:"No response was submitted for this question.",source:"fallback"};const a=zi(n),o=/function|return|if|const|let|=>/i.test(n),i=(e.rubric||[]).map(l=>{var h,v;const u=Qi(a,l.keywords),m=(h=l.keywords)!=null&&h.length?u/l.keywords.length:.6;let g=(v=l.keywords)!=null&&v.length?Math.round(ye(m,0,1)*l.points):Math.ceil(l.points*.6);return e.type==="code"&&o&&/function|return/i.test(n)&&/Programming structure/i.test(l.description)&&(g=Math.max(g,Math.ceil(l.points*.75))),g=ye(g,0,l.points),{criterion:l.criterion,score:g,maxScore:l.points,evidence:u>0?`Matched ${u} expected concept${u===1?"":"s"}.`:"Only partial evidence of the expected concept."}});let r=i.reduce((l,u)=>l+u.score,0);a.length>24&&r<s&&(r=Math.min(s,r+1));const d=ji([r>=s*.8?"Strong response.":"This response shows some understanding but still needs refinement.",e.type==="code"?"Check that the code logic matches the lesson rule and that the function returns the expected values.":"Use more precise lesson vocabulary and include the key concept directly in your explanation."]);return{score:ye(r,0,s),maxScore:s,rubricBreakdown:i,feedback:d,source:"fallback"}}async function Fi(e,t){var o;const s=e.maxScore||((o=e.rubric)==null?void 0:o.reduce((i,r)=>i+r.points,0))||5,n=["You are grading a Basic 7 Computing assessment.","Return valid JSON only with keys: score, feedback, rubricBreakdown.",`Question type: ${e.type}`,`Prompt: ${e.prompt}`,`Sample answer: ${e.sampleSolution||e.answerKey||""}`,`Rubric: ${JSON.stringify(e.rubric||[])}`,`Student response: ${t}`,`Maximum score: ${s}`].join(`
`),a=await Ni(n);return a&&Number.isFinite(a.score)?{score:ye(Math.round(a.score),0,s),maxScore:s,rubricBreakdown:Array.isArray(a.rubricBreakdown)&&a.rubricBreakdown.length>0?a.rubricBreakdown.map(i=>({criterion:i.criterion||"Quality",score:ye(Math.round(i.score||0),0,Number.isFinite(i.maxScore)?i.maxScore:s),maxScore:Number.isFinite(i.maxScore)?i.maxScore:s,evidence:i.evidence||""})):[],feedback:a.feedback||"AI grading completed.",source:"ai"}:Oi(e,t)}function Ui(e,t){const s=Number.parseInt(t==null?void 0:t.selectedIndex,10)===e.correctIndex;return{score:s?e.maxScore||1:0,maxScore:e.maxScore||1,rubricBreakdown:[{criterion:"Correct answer",score:s?e.maxScore||1:0,maxScore:e.maxScore||1,evidence:s?"Correct option selected.":"Incorrect option selected."}],feedback:s?"Correct. You selected the best answer for this concept.":`Review this concept and compare your answer with the correct option: ${e.answerKey}.`,source:"system"}}async function Hi({assessment:e,answers:t}){const s=[];for(const c of e.questions){const l=t.find(g=>g.questionId===c.id)||{};let u=null;c.type==="mcq"?u=Ui(c,l):u=await Fi(c,l.responseText||"");const m=u.maxScore>0?u.score/u.maxScore:0;s.push({questionId:c.id,prompt:c.prompt,lessonId:c.lessonId,objective:c.objective,type:c.type,score:u.score,maxScore:u.maxScore,normalizedScore:Ri(m),feedback:u.feedback,rubricBreakdown:u.rubricBreakdown,gradingSource:u.source,flaggedForReview:c.type!=="mcq"&&u.source==="fallback"&&m>=.4&&m<=.7,answerPreview:c.type==="mcq"?l.selectedIndex:l.responseText||""})}const n=s.reduce((c,l)=>c+l.score,0),a=s.reduce((c,l)=>c+l.maxScore,0),o=a>0?Math.round(n/a*100):0,i=s.filter(c=>c.normalizedScore<.6).map(c=>({lessonId:c.lessonId,objective:c.objective,questionId:c.questionId,reason:c.feedback})),r=s.filter(c=>c.normalizedScore>=.8).map(c=>({lessonId:c.lessonId,objective:c.objective,questionId:c.questionId})),d=i.slice(0,4).map(c=>{var l;return{lessonId:c.lessonId,objective:c.objective,action:`Review this objective again and retry a similar ${((l=s.find(u=>u.questionId===c.questionId))==null?void 0:l.type)||"assessment"} question.`}});return{totalScore:n,maxScore:a,percentage:o,questionScores:s,weakObjectives:i,strengths:r,remediationPlan:d}}function N(e,t=2){return Math.round(e*10**t)/10**t}function le(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function Wi(e=""){return e.split(/[.!?]+/).map(t=>t.trim()).filter(Boolean)}function W(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function Gi(e){if(e.length<2)return 0;const t=W(e);return W(e.map(s=>(s-t)**2))}function Ft(e,t){const s=new Set(e),n=new Set(t),a=[...s].filter(i=>n.has(i)).length,o=new Set([...s,...n]).size;return o>0?a/o:0}function Ki(e){if(!e.length)return 0;const t=new Map;return e.forEach(s=>{t.set(s,(t.get(s)||0)+1)}),[...t.values()].reduce((s,n)=>{const a=n/e.length;return s-a*Math.log2(a)},0)}function Ms(e){const t=le(e),s=Wi(e),n=s.map(u=>le(u).length).filter(Boolean),a=new Set(t).size,o=t.length>0?a/t.length:0,i=n.length>0?W(n):t.length,r=n.length>1?Gi(n)/Math.max(1,i):0,d=Ki(t),c=t.length>0?2**d:0,l=(e.match(/\b(overall|in conclusion|therefore|moreover|furthermore|additionally)\b/gi)||[]).length;return{tokenCount:t.length,sentenceCount:s.length,lexicalDiversity:N(o),averageSentenceLength:N(i),burstiness:N(r),perplexityProxy:N(c),templatePhraseCount:l}}function Es(e){return typeof e.responseText=="string"?e.responseText.trim():""}function Yi(e=[]){const t=e.flatMap(n=>n.answers||[]).map(Es).filter(n=>n.length>0),s=t.map(Ms);return{texts:t,avgLexicalDiversity:W(s.map(n=>n.lexicalDiversity)),avgSentenceLength:W(s.map(n=>n.averageSentenceLength))}}function Vi({answers:e,priorSubmissions:t=[]}){const s=e.filter(y=>y.type==="short"||y.type==="code").map(y=>({questionId:y.questionId,type:y.type,text:Es(y)})).filter(y=>y.text.length>0),n=s.map(y=>({...y,metrics:Ms(y.text)})),a=Yi(t),o=W(n.map(y=>y.metrics.lexicalDiversity)),i=W(n.map(y=>y.metrics.averageSentenceLength)),r=W(n.map(y=>y.metrics.burstiness)),d=W(n.map(y=>y.metrics.perplexityProxy)),c=n.reduce((y,A)=>y+A.metrics.templatePhraseCount,0),l=[];for(let y=0;y<n.length;y+=1)for(let A=y+1;A<n.length;A+=1)l.push(Ft(le(n[y].text),le(n[A].text)));const u=W(l),m=a.texts.length>0?Math.abs(o-a.avgLexicalDiversity)+Math.abs(i-a.avgSentenceLength)/20:0,g=a.texts.length>0&&s.length>0?Math.max(...s.map(y=>Math.max(...a.texts.map(A=>Ft(le(y.text),le(A))),0)),0):0;let h=0;const v=[],f=[];if(s.length===0)return{score:0,label:"Low",reasons:["No open-ended writing to analyze."],metrics:{lexicalDiversity:0,averageSentenceLength:0,burstiness:0,perplexityProxy:0,internalSimilarity:0,historicalOverlap:0},flaggedSegments:f};o>.62&&r<1.2&&(h+=18,v.push("Writing is unusually uniform across responses.")),d>35&&r<1.4&&(h+=16,v.push("Perplexity proxy suggests highly polished and predictable wording.")),c>=2&&(h+=10,v.push("Several template-like transition phrases were reused.")),u>.45&&(h+=18,v.push("Multiple answers reuse very similar vocabulary patterns.")),m>.35&&(h+=22,v.push("Writing style differs noticeably from the student’s earlier responses.")),g>.75&&(h+=20,v.push("One or more answers overlap heavily with earlier saved writing.")),n.forEach(y=>{y.metrics.burstiness<.5&&y.metrics.tokenCount>30&&f.push({questionId:y.questionId,reason:"Low burstiness and long response length."})});const p=Math.min(100,Math.round(h)),w=p>=65?"High":p>=35?"Moderate":"Low";return v.length||v.push("Writing patterns look reasonably consistent."),{score:p,label:w,reasons:v,metrics:{lexicalDiversity:N(o),averageSentenceLength:N(i),burstiness:N(r),perplexityProxy:N(d),internalSimilarity:N(u),historicalOverlap:N(g),styleShift:N(m)},flaggedSegments:f}}let S=null,Ne=null,V=new Map,X=!1,B=null,we=null,K=0,te=!1;function Bs(e=0){const t=String(Math.floor(e/60)).padStart(2,"0"),s=String(e%60).padStart(2,"0");return`${t}:${s}`}function Ut(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function qs(e){return e.type==="mcq"?{questionId:e.id,type:e.type,selectedIndex:null}:{questionId:e.id,type:e.type,responseText:e.type==="code"&&e.starterCode||""}}function Ps(e,t){if(!t)return!1;if(e.type==="mcq")return Number.isInteger(t.selectedIndex);const s=(t.responseText||"").trim();return!(!s||e.type==="code"&&s===(e.starterCode||"").trim())}function Ji(e,t,s){return e.type==="mcq"?`
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
          <pre>${Ut(e.starterCode)}</pre>
        </div>
      `:""}
      <textarea
        class="input assessment-response ${e.type==="code"?"assessment-response--code":""}"
        data-question-id="${e.id}"
        rows="${e.type==="code"?10:5}"
        placeholder="${e.type==="code"?"Write your code here...":"Write your response here..."}"
      >${Ut((s==null?void 0:s.responseText)||"")}</textarea>
    </div>
  `}function Rs(){return(S==null?void 0:S.questions.map(e=>V.get(e.id)||qs(e)))||[]}function Ht(){const e=document.getElementById("assessment-session-timer");e&&(e.textContent=Bs(K))}function Ue(){we&&(window.clearInterval(we),we=null)}async function Zi(e){const t=Number.parseInt(e,10);S&&Ne===t||(S=await fn(t),Ne=t,V=new Map(((S==null?void 0:S.questions)||[]).map(s=>[s.id,qs(s)])),X=!1,B=null,K=((S==null?void 0:S.durationMinutes)||20)*60,Ue(),te=!1)}function Xi(){Ue(),B&&B.stop(),S=null,Ne=null,V=new Map,X=!1,B=null,K=0,te=!1}async function eo(e){!S||X||(B=qi(),await B.start(),X=!0,K=(S.durationMinutes||20)*60,await e())}async function zs(e){if(!S||te)return;te=!0,Ue();const t=L();if(!t){te=!1,e("/student-login");return}try{const s=Rs().map(d=>{const c=S.questions.find(l=>l.id===d.questionId);return!c||c.type==="mcq"?d:{...d,responseText:Ps(c,d)?d.responseText:""}}),n=await is(t.id),a=await Hi({assessment:S,answers:s}),o=Vi({answers:s,priorSubmissions:n}),i=B?await B.stop():{anomalyScore:0,label:"Low",counts:{},events:[]},r=await bn({assessmentId:S.id,studentId:t.id,answers:s,grading:a,integrity:o,proctor:i});S=null,Ne=null,V=new Map,X=!1,B=null,K=0,te=!1,e(`/assessment-results/${r.id}`)}catch(s){console.error(s),E("Unable to submit the assessment right now.","error"),te=!1}}function to(e){!X||we||!S||(Ht(),we=window.setInterval(async()=>{K=Math.max(0,K-1),Ht(),K===0&&(Ue(),E("Time is up. Submitting your assessment now.","info"),await zs(e))},1e3))}function so(){return{completed:Rs().filter(s=>{const n=S==null?void 0:S.questions.find(a=>a.id===s.questionId);return n?Ps(n,s):!1}).length,total:(S==null?void 0:S.questions.length)||0}}function no(){var n;const e=L();if(!S)return'<div class="container" style="padding: 2rem;">Assessment not found.</div>';const t=so(),s=(n=B==null?void 0:B.summarize)==null?void 0:n.call(B);return X?`
    ${P({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-session-page">
      <div class="card card--glass assessment-session-topbar">
        <div>
          <div class="assessment-hero__eyebrow">Assessment in progress</div>
          <h1 class="assessment-session-topbar__title">${S.title}</h1>
        </div>
        <div class="assessment-session-topbar__meta">
          <span class="badge badge--warning" id="assessment-session-timer">${Bs(K)}</span>
          <span class="badge badge--neutral">${t.completed}/${t.total} answered</span>
          <span class="badge badge--${(s==null?void 0:s.label)==="High"?"danger":(s==null?void 0:s.label)==="Moderate"?"warning":"success"}">Proctor ${(s==null?void 0:s.label)||"Low"}</span>
        </div>
      </div>

      ${Ce(t.completed,t.total,"Assessment completion")}

      <form id="assessment-session-form" class="assessment-session-form">
        ${S.questions.map((a,o)=>Ji(a,o,V.get(a.id))).join("")}

        <div class="assessment-session-submit">
          <button class="btn btn--primary btn--lg" id="btn-submit-assessment" type="submit">Submit Assessment</button>
        </div>
      </form>
    </div>
  `:`
      ${P({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
      <div class="container container--narrow view-enter assessment-session-page">
        <div class="card card--glass assessment-start-card">
          <div class="assessment-hero__eyebrow">Proctored assessment</div>
          <h1 class="assessment-hero__title">${S.title}</h1>
          <p class="assessment-hero__text">This assessment uses browser-based proctoring, open-response grading, item analysis, and integrity review.</p>

          <div class="assessment-start-card__grid">
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${S.durationMinutes}</span>
              <span class="assessment-start-card__label">Minutes</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${S.questions.length}</span>
              <span class="assessment-start-card__label">Questions</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${S.objectiveCoverage.length}</span>
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
    `}function ao(e,t,s){if(R({onBack:()=>e("/assessments")}),!X){const a=document.getElementById("btn-begin-assessment");a&&a.addEventListener("click",async()=>{await eo(t)});return}to(e),document.querySelectorAll(".assessment-option").forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.dataset.questionId,r=Number.parseInt(o.currentTarget.dataset.optionIndex,10),d=V.get(i)||{questionId:i,type:"mcq",selectedIndex:null};V.set(i,{...d,selectedIndex:r}),document.querySelectorAll(`.assessment-option[data-question-id="${i}"]`).forEach(c=>{c.classList.toggle("option-btn--selected",Number.parseInt(c.dataset.optionIndex,10)===r)})})}),document.querySelectorAll(".assessment-response").forEach(a=>{a.addEventListener("input",o=>{const i=o.currentTarget.dataset.questionId,r=S.questions.find(d=>d.id===i);r&&(V.set(i,{questionId:i,type:r.type,responseText:o.currentTarget.value}),B==null||B.trackTextEntry(i,o.currentTarget.value))})});const n=document.getElementById("assessment-session-form");n&&n.addEventListener("submit",async a=>{a.preventDefault(),await zs(e)})}function re(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function io(e){const t=L(),s=await Ae(),n=await xe(),a=s.find(i=>i.id===Number.parseInt(e,10)),o=n.find(i=>i.id===(a==null?void 0:a.assessmentId));return!a||!o?'<div class="container" style="padding: 2rem;">Assessment result not found.</div>':`
    ${P({title:"Assessment Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Assessments"})}
    <div class="container container--narrow view-enter assessment-results-page">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <div class="assessment-hero__eyebrow">Assessment complete</div>
        <h1 class="assessment-hero__title">${o.title}</h1>
        <p class="assessment-hero__text">Your open responses were graded against rubrics, then reviewed for integrity and browser behavior.</p>
      </div>

      ${ls(a.grading.totalScore,a.grading.maxScore)}

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
          ${a.grading.remediationPlan.length>0?a.grading.remediationPlan.map(i=>`
            <div class="assessment-remediation-item">
              <div class="assessment-remediation-item__title">Lesson ${i.lessonId}</div>
              <div class="assessment-remediation-item__objective">${re(i.objective)}</div>
              <div class="assessment-remediation-item__action">${re(i.action)}</div>
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
        ${a.grading.questionScores.map((i,r)=>{var d;return`
          <div class="review-item ${i.normalizedScore>=.6?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__question">${r+1}. ${re(i.prompt)}</div>
            <div class="review-item__meta">
              <span>${i.type}</span>
              <span>${i.score}/${i.maxScore} points</span>
              <span>${i.gradingSource==="ai"?"AI graded":i.gradingSource==="fallback"?"Rubric fallback":"Auto graded"}</span>
            </div>
            <div class="review-item__answer">
              <div>${re(i.feedback)}</div>
            </div>
            ${(d=i.rubricBreakdown)!=null&&d.length?`
              <div class="assessment-rubric-breakdown">
                ${i.rubricBreakdown.map(c=>`
                  <div class="assessment-rubric-breakdown__item">
                    <strong>${re(c.criterion)}:</strong> ${c.score}/${c.maxScore} - ${re(c.evidence||"")}
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
  `}function oo(e,t){R({onBack:()=>e("/assessments")});const s=document.getElementById("btn-back-to-center"),n=document.getElementById("btn-retake-assessment");Ae().then(a=>{const o=a.find(i=>i.id===Number.parseInt(t,10));o&&(s&&s.addEventListener("click",()=>e("/assessments")),n&&n.addEventListener("click",()=>e(`/assessment/${o.assessmentId}`)))})}let I=window.location.pathname;const tt=document.getElementById("app"),ro=4e3;async function co(){let e;try{await Promise.race([an(),new Promise((t,s)=>{e=window.setTimeout(()=>{s(new Error("Saved settings did not load in time."))},ro)})])}finally{window.clearTimeout(e)}}async function q(e,t=!0){t&&e!==window.location.pathname&&window.history.pushState({},"",e),I=e,await ne()}window.addEventListener("popstate",()=>{I=window.location.pathname,ne()});function lo(e){return e==="/lessons"||e==="/diagnostic"||e==="/assessments"||e.startsWith("/diagnostic-results/")||e.startsWith("/assessment/")||e.startsWith("/assessment-results/")||e.startsWith("/lesson/")||e.startsWith("/quiz/")||e.startsWith("/quiz-results/")||e==="/tutor"}async function ne(){I==="/dashboard"&&!Dt()&&(I="/teacher-login",window.history.replaceState({},"","/teacher-login")),I==="/assessment-lab"&&!Dt()&&(I="/teacher-login",window.history.replaceState({},"","/teacher-login")),lo(I)&&!L()&&(I="/student-login",window.history.replaceState({},"","/student-login"));const e=document.getElementById("app-loader");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),1e3)),I.startsWith("/quiz/")||Ia(),I!=="/diagnostic"&&xs(),I.startsWith("/assessment/")||Xi(),I!=="/dashboard"&&Ie(),tt.firstElementChild&&(tt.firstElementChild.classList.add("view-exit"),await new Promise(n=>setTimeout(n,200)));let t="",s=()=>{};if(I==="/"||I==="/index.html")t=Dn(),s=()=>Mn(q);else if(I==="/student-login")t=await Rn(),s=()=>zn(q);else if(I==="/teacher-login")t=Qn(),s=()=>jn(q);else if(I==="/lessons")t=await Xn(),s=()=>ea(q);else if(I==="/assessments")t=await Mi(),s=()=>Ei(q);else if(I==="/diagnostic")Va(),t=Ja(),s=()=>Za(q,ne);else if(I.startsWith("/diagnostic-results/")){const n=I.split("/")[2];t=await ci(n),s=()=>di(q,n)}else if(I.startsWith("/lesson/")){const n=Number.parseInt(I.split("/")[2],10);t=await ta(n),s=()=>sa(q,n)}else if(I.startsWith("/quiz/")){const n=Number.parseInt(I.split("/")[2],10);_a(n),t=ka(),s=()=>Sa(q,ne,n)}else if(I.startsWith("/quiz-results/")){const n=I.split("/")[2];t=await xa(n),s=()=>Aa(q,n)}else if(I.startsWith("/assessment-results/")){const n=I.split("/")[2];t=await io(n),s=()=>oo(q,n)}else if(I.startsWith("/assessment/")){const n=Number.parseInt(I.split("/")[2],10);await Zi(n),t=no(),s=()=>ao(q,ne)}else if(I==="/tutor")t=await hi(),s=()=>gi(q,ne);else if(I==="/assessment-lab")t=await Li(),s=()=>Di(q);else if(I==="/dashboard")t=await Na(),s=()=>Oa(q);else{q("/",!1);return}tt.innerHTML=t,setTimeout(s,0),window.scrollTo(0,0)}window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).has("capture")?0:1500;setTimeout(async()=>{try{await co()}catch(s){console.error("Unable to load saved ClassConnect settings.",s)}Tn(),await ne()},t)});
