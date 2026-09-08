(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const At=(e,t)=>t.some(s=>e instanceof s);let ss,ns;function En(){return ss||(ss=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Bn(){return ns||(ns=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ct=new WeakMap,vt=new WeakMap,dt=new WeakMap;function Dn(e){const t=new Promise((s,n)=>{const a=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{s(he(e.result)),a()},i=()=>{n(e.error),a()};e.addEventListener("success",o),e.addEventListener("error",i)});return dt.set(t,e),t}function Mn(e){if(Ct.has(e))return;const t=new Promise((s,n)=>{const a=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{s(),a()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Ct.set(e,t)}let Lt={get(e,t,s){if(e instanceof IDBTransaction){if(t==="done")return Ct.get(e);if(t==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return he(e[t])},set(e,t,s){return e[t]=s,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Cs(e){Lt=e(Lt)}function Rn(e){return Bn().includes(e)?function(...t){return e.apply(Tt(this),t),he(this.request)}:function(...t){return he(e.apply(Tt(this),t))}}function Pn(e){return typeof e=="function"?Rn(e):(e instanceof IDBTransaction&&Mn(e),At(e,En())?new Proxy(e,Lt):e)}function he(e){if(e instanceof IDBRequest)return Dn(e);if(vt.has(e))return vt.get(e);const t=Pn(e);return t!==e&&(vt.set(e,t),dt.set(t,e)),t}const Tt=e=>dt.get(e);function Nn(e,t,{blocked:s,upgrade:n,blocking:a,terminated:o}={}){const i=indexedDB.open(e,t),r=he(i);return n&&i.addEventListener("upgradeneeded",d=>{n(he(i.result),d.oldVersion,d.newVersion,he(i.transaction),d)}),s&&i.addEventListener("blocked",d=>s(d.oldVersion,d.newVersion,d)),r.then(d=>{o&&d.addEventListener("close",()=>o()),a&&d.addEventListener("versionchange",c=>a(c.oldVersion,c.newVersion,c))}).catch(()=>{}),r}const qn=["get","getKey","getAll","getAllKeys","count"],zn=["put","add","delete","clear"],ft=new Map;function as(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ft.get(t))return ft.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,a=zn.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!(a||qn.includes(s)))return;const o=async function(i,...r){const d=this.transaction(i,a?"readwrite":"readonly");let c=d.store;return n&&(c=c.index(r.shift())),(await Promise.all([c[s](...r),a&&d.done]))[0]};return ft.set(t,o),o}Cs(e=>({...e,get:(t,s,n)=>as(t,s)||e.get(t,s,n),has:(t,s)=>!!as(t,s)||e.has(t,s)}));const jn=["continue","continuePrimaryKey","advance"],is={},Et=new WeakMap,Ls=new WeakMap,Qn={get(e,t){if(!jn.includes(t))return e[t];let s=is[t];return s||(s=is[t]=function(...n){Et.set(this,Ls.get(this)[t](...n))}),s}};async function*On(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const s=new Proxy(t,Qn);for(Ls.set(s,t),dt.set(s,Tt(t));t;)yield s,t=await(Et.get(s)||t.continue()),Et.delete(s)}function os(e,t){return t===Symbol.asyncIterator&&At(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&At(e,[IDBIndex,IDBObjectStore])}Cs(e=>({...e,get(t,s,n){return os(t,s)?On:e.get(t,s,n)},has(t,s){return os(t,s)||e.has(t,s)}}));const Fn="classconnect",Ts=7,ze="settings",ae="feedbackCache",Bt="classconnect:datachange",Gn="classconnect-data-sync",at="cc_teacherAuthenticated",Es="cc_currentStudent",Hn=["apiKey","teacherPin","theme"];let ye=null,bt=null;var Je,As;const Bs=((As=(Je=globalThis.crypto)==null?void 0:Je.randomUUID)==null?void 0:As.call(Je))||`cc-${Date.now()}-${Math.random().toString(16).slice(2)}`;function Ds(){return typeof BroadcastChannel>"u"?null:(bt||(bt=new BroadcastChannel(Gn)),bt)}function H(e,t,s=null){var a;const n={store:e,action:t,recordId:(s==null?void 0:s.id)??(s==null?void 0:s.studentId)??(s==null?void 0:s.cacheKey)??null,timestamp:new Date().toISOString(),sourceId:Bs};typeof window<"u"&&window.dispatchEvent(new CustomEvent(Bt,{detail:n}));try{(a=Ds())==null||a.postMessage(n)}catch{}return n}function Un(e){const t=a=>{a!=null&&a.detail&&e(a.detail)};typeof window<"u"&&window.addEventListener(Bt,t);const s=Ds(),n=a=>{!(a!=null&&a.data)||a.data.sourceId===Bs||e(a.data)};return s==null||s.addEventListener("message",n),()=>{typeof window<"u"&&window.removeEventListener(Bt,t),s==null||s.removeEventListener("message",n)}}function Wn(e,t=null){if(!e.objectStoreNames.contains("classes")){const s=e.createObjectStore("classes",{keyPath:"id",autoIncrement:!0});s.createIndex("gradeLevel","gradeLevel",{unique:!1}),s.createIndex("academicYear","academicYear",{unique:!1})}if(e.objectStoreNames.contains("students")){if(t){const s=t.objectStore("students");s.indexNames.contains("classId")||s.createIndex("classId","classId",{unique:!1}),s.indexNames.contains("indexNumber")||s.createIndex("indexNumber","indexNumber",{unique:!1})}}else{const s=e.createObjectStore("students",{keyPath:"id",autoIncrement:!0});s.createIndex("name","name",{unique:!1}),s.createIndex("classId","classId",{unique:!1}),s.createIndex("indexNumber","indexNumber",{unique:!1})}if(e.objectStoreNames.contains("progress")||e.createObjectStore("progress",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),!e.objectStoreNames.contains("quizResults")){const s=e.createObjectStore("quizResults",{keyPath:"id",autoIncrement:!0});s.createIndex("studentId","studentId",{unique:!1}),s.createIndex("lessonId","lessonId",{unique:!1})}if(e.objectStoreNames.contains("diagnostics")||e.createObjectStore("diagnostics",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),e.objectStoreNames.contains("tutorThreads")||e.createObjectStore("tutorThreads",{keyPath:"studentId"}),e.objectStoreNames.contains("assessments")||e.createObjectStore("assessments",{keyPath:"id",autoIncrement:!0}).createIndex("createdAt","createdAt",{unique:!1}),!e.objectStoreNames.contains("assessmentSubmissions")){const s=e.createObjectStore("assessmentSubmissions",{keyPath:"id",autoIncrement:!0});s.createIndex("assessmentId","assessmentId",{unique:!1}),s.createIndex("studentId","studentId",{unique:!1})}if(!e.objectStoreNames.contains(ae)){const s=e.createObjectStore(ae,{keyPath:"cacheKey"});s.createIndex("questionId","questionId",{unique:!1}),s.createIndex("updatedAt","updatedAt",{unique:!1})}e.objectStoreNames.contains(ze)||e.createObjectStore(ze,{keyPath:"key"})}function C(){return ye||(ye=Nn(Fn,Ts,{upgrade(e,t,s,n){Wn(e,n)},blocked(e,t,s){console.warn(`[ClassConnect] IndexedDB upgrade blocked (v${e} → v${t}). Close other ClassConnect tabs or clear site data, then try again.`)},blocking(e,t,s){s.target.close(),ye=null},terminated(){ye=null}}).catch(e=>{throw ye=null,e})),ye}function Ms(e){try{return localStorage.getItem(`cc_${e}`)}catch{return null}}function Ot(e,t){try{if(t==null||t===""){localStorage.removeItem(`cc_${e}`);return}localStorage.setItem(`cc_${e}`,t)}catch{}}async function Ft(e,t){await(await C()).put(ze,{key:e,value:t,updatedAt:new Date().toISOString()})}async function Kn(){const e=await C();try{await Ut(e)}catch(t){console.warn("[ClassConnect] Default class migration notice:",t)}await Promise.all(Hn.map(async t=>{const s=await e.get(ze,t);if(s!=null&&s.value){Ot(t,s.value);return}const n=Ms(t);n&&await Ft(t,n)}))}function Gt(e){return Ms(e)}function Yn(e,t){Ot(e,t),Ft(e,t)}async function Rs(e,t){Ot(e,t),await Ft(e,t)}function $e(){return Gt("apiKey")}async function Ps(e){await Rs("apiKey",e)}function Ht(){return Gt("teacherPin")}async function Ns(e){await Rs("teacherPin",e)}async function Ut(e=null){const t=e||await C();let n=(await t.getAll("classes"))[0];if(!n){const r=new Date().toISOString();n={id:await t.add("classes",{name:"B7 — JHS 1A",gradeLevel:"B7",stream:"1A",academicYear:"2026/2027",term:"Term 1",teacherName:"Class Teacher",createdAt:r}),name:"B7 — JHS 1A",gradeLevel:"B7",stream:"1A",academicYear:"2026/2027",term:"Term 1",teacherName:"Class Teacher",createdAt:r},H("classes","create",n)}const a=await t.getAll("students"),o=t.transaction("students","readwrite");let i=0;for(const r of a){let d=!1;r.classId||(r.classId=n.id,d=!0),r.status||(r.status="active",d=!0),r.gender||(r.gender="unspecified",d=!0),r.indexNumber||(r.indexNumber=`GES-B7-${String(r.id).padStart(4,"0")}`,d=!0),d&&(await o.store.put(r),i+=1)}return await o.done,{defaultClass:n,migratedCount:i}}async function Vn(e){var i,r;const t=await C(),s=new Date().toISOString(),n={name:((i=e.name)==null?void 0:i.trim())||`${e.gradeLevel||"B7"} — ${e.stream||"Stream A"}`,gradeLevel:e.gradeLevel||"B7",stream:e.stream||"A",academicYear:e.academicYear||"2026/2027",term:e.term||"Term 1",teacherName:((r=e.teacherName)==null?void 0:r.trim())||"Class Teacher",createdAt:s},a=await t.add("classes",n),o={...n,id:a};return H("classes","create",o),o}async function te(){const e=await C(),t=await e.getAll("classes");if(t.length===0){const{defaultClass:s}=await Ut(e);return s?[s]:[]}return t}async function Jn(e,t,s={}){var u,l;const n=await C(),a=await Zn(e,t);if(a)return a;let o=s.classId;o||(o=((u=(await te())[0])==null?void 0:u.id)||1);const i=new Date().toISOString(),r={name:e.trim(),pin:t,classId:o,indexNumber:((l=s.indexNumber)==null?void 0:l.trim())||null,gender:s.gender||"unspecified",status:s.status||"active",createdAt:i},d=await n.add("students",r);r.indexNumber||(r.indexNumber=`GES-B7-${String(d).padStart(4,"0")}`,await n.put("students",{...r,id:d}));const c={...r,id:d};return H("students","create",c),c}async function Zn(e,t){return(await(await C()).getAllFromIndex("students","name",e.trim())).find(a=>a.pin===t)||null}async function Xn(e,t){const s=await C(),n=(e||"").trim().toLowerCase();if(!n)return null;const a=await s.getAll("students"),o=a.find(r=>r.indexNumber&&r.indexNumber.trim().toLowerCase()===n&&r.pin===t);return o||a.find(r=>r.name&&r.name.trim().toLowerCase()===n&&r.pin===t)||null}async function qs(e,t){const s=await C(),n=await s.get("students",e);if(!n)return null;const a={...n,...t,id:e,updatedAt:new Date().toISOString()};return await s.put("students",a),H("students","update",a),a}async function ea(e,t){if(!/^\d{4}$/.test(t))throw new Error("PIN must be exactly 4 numeric digits.");return qs(e,{pin:t})}async function ta(e){var i,r;const t=await C(),s={created:[],updated:[],errors:[]},n=await t.getAll("students"),a=t.transaction("students","readwrite"),o=a.store;for(const d of e)try{const c=(i=d.name)==null?void 0:i.trim(),u=(r=d.indexNumber)==null?void 0:r.trim();if(!c){s.errors.push({item:d,error:"Student name is required."});continue}let l=null;if(u&&(l=n.find(p=>p.indexNumber&&p.indexNumber.toLowerCase()===u.toLowerCase())),l||(l=n.find(p=>p.name&&p.name.toLowerCase()===c.toLowerCase()&&p.classId===(d.classId||p.classId))),l){const p={...l,...d,id:l.id,name:c,indexNumber:u||l.indexNumber,updatedAt:new Date().toISOString()};await o.put(p),s.updated.push(p)}else{const p=d.pin&&/^\d{4}$/.test(d.pin)?d.pin:String(Math.floor(1e3+Math.random()*9e3)),h={name:c,pin:p,classId:d.classId||1,indexNumber:u||null,gender:d.gender||"unspecified",status:d.status||"active",createdAt:new Date().toISOString()},m=await o.add(h);h.indexNumber||(h.indexNumber=`GES-B7-${String(m).padStart(4,"0")}`,await o.put({...h,id:m})),s.created.push({...h,id:m})}}catch(c){s.errors.push({item:d,error:c.message})}return await a.done,H("students","bulk",s),s}async function K(){return(await C()).getAll("students")}async function sa(e,t){const s=await C(),a=(await V(e)).find(d=>d.lessonId===t);if(a)return a;const o=new Date().toISOString(),r={id:await s.add("progress",{studentId:e,lessonId:t,completedAt:o}),studentId:e,lessonId:t,completedAt:o};return H("progress","create",r),r}async function V(e){return(await C()).getAllFromIndex("progress","studentId",e)}async function lt(){return(await C()).getAll("progress")}async function na(e,t){return(await V(e)).some(n=>n.lessonId===t)}async function aa(e){const t=await C(),s=new Date().toISOString(),n={...e,completedAt:s},a=await t.add("quizResults",n),o={...n,id:a};return H("quizResults","create",o),o}async function ge(e){return(await C()).getAllFromIndex("quizResults","studentId",e)}async function ve(){return(await C()).getAll("quizResults")}async function ia(e){const t=await C(),s=new Date().toISOString(),n={...e,completedAt:s},a=await t.add("diagnostics",n),o={...n,id:a};return H("diagnostics","create",o),o}async function zs(e){return(await C()).get("diagnostics",e)}async function oa(e){return(await C()).getAllFromIndex("diagnostics","studentId",e)}async function se(e){return(await oa(e)).slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt))[0]||null}async function ut(){return(await C()).getAll("diagnostics")}async function ra(e){return(await C()).get("tutorThreads",e)}async function rs(e,t){const s=await C(),n={studentId:e,messages:t.slice(-20),updatedAt:new Date().toISOString()};return await s.put("tutorThreads",n),H("tutorThreads","upsert",n),n}async function ca(e){await(await C()).delete("tutorThreads",e),H("tutorThreads","delete",{studentId:e})}async function da(e){const t=await C(),s={...e,createdAt:e.createdAt||new Date().toISOString()},n=await t.add("assessments",s),a={...s,id:n};return H("assessments","create",a),a}async function la(e){return(await C()).get("assessments",e)}async function Fe(){return(await C()).getAll("assessments")}async function ua(e){const t=await C(),s={...e,completedAt:e.completedAt||new Date().toISOString()},n=await t.add("assessmentSubmissions",s),a={...s,id:n};return H("assessmentSubmissions","create",a),a}async function js(e){return(await C()).getAllFromIndex("assessmentSubmissions","studentId",e)}async function fe(){return(await C()).getAll("assessmentSubmissions")}async function pa(e){return(await C()).get(ae,e)}async function ma(e){return(await C()).getAllFromIndex(ae,"questionId",e)}async function ha(e){const t=await C(),s=await t.get(ae,e.cacheKey),n=new Date().toISOString(),a={...s,...e,createdAt:(s==null?void 0:s.createdAt)||e.createdAt||n,updatedAt:n,usageCount:e.usageCount||(s?(s.usageCount||0)+1:1),lastUsedAt:e.lastUsedAt||n};return await t.put(ae,a),a}async function Wt(e){const t=await C(),s=await t.get(ae,e);if(!s)return null;const n={...s,usageCount:(s.usageCount||0)+1,lastUsedAt:new Date().toISOString()};return await t.put(ae,n),n}function ga(e){sessionStorage.setItem(Es,JSON.stringify(e))}function R(){try{const e=sessionStorage.getItem(Es);return e?JSON.parse(e):null}catch{return null}}function cs(e=!0){if(!e){sessionStorage.removeItem(at);return}sessionStorage.setItem(at,JSON.stringify({authenticated:!0,updatedAt:new Date().toISOString()}))}function ds(){var e;try{const t=sessionStorage.getItem(at);return!!(t&&((e=JSON.parse(t))!=null&&e.authenticated))}catch{return!1}}function va(){sessionStorage.removeItem(at)}async function fa(){var n;const e=await K(),t=await ve();let s=`Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)
`;for(const a of t){const o=e.find(d=>d.id===a.studentId),i=o?o.name:"Unknown",r=Math.round((a.totalTimeMs||0)/1e3);s+=`"${i}",${a.lessonId},${a.score},${a.totalQuestions},${((n=a.theta)==null?void 0:n.toFixed(2))||"N/A"},${a.level||"N/A"},"${a.completedAt}",${r}
`}return s}function Qs(e,t="classconnect_data.csv"){const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(s),a=document.createElement("a");a.href=n,a.download=t,a.click(),URL.revokeObjectURL(n)}const ba=["classes","students","progress","quizResults","diagnostics","tutorThreads","assessments","assessmentSubmissions",ae,ze];async function ya(){const e=await C(),t={};for(const s of ba)e.objectStoreNames.contains(s)&&(t[s]=await e.getAll(s));return{app:"ClassConnect",schemaVersion:Ts,exportedAt:new Date().toISOString(),data:t}}async function wa(){const e=await ya(),t=JSON.stringify(e,null,2),s=new Date().toISOString().slice(0,10),n=new Blob([t],{type:"application/json;charset=utf-8;"}),a=URL.createObjectURL(n),o=document.createElement("a");return o.href=a,o.download=`classconnect_school_backup_${s}.json`,o.click(),URL.revokeObjectURL(a),e}async function Ia(e,t="merge"){if(!e||e.app!=="ClassConnect"||!e.data)throw new Error("Invalid ClassConnect backup file. Expected valid JSON with app metadata.");const s=await C(),n={};for(const[a,o]of Object.entries(e.data)){if(!s.objectStoreNames.contains(a)||!Array.isArray(o))continue;const i=s.transaction(a,"readwrite");t==="overwrite"&&await i.store.clear();let r=0;for(const d of o)await i.store.put(d),r+=1;await i.done,n[a]=r}return await Ut(s),H("all","restore",n),n}const _a="dark";function Os(e){return e==="light"?"light":_a}function Kt(){return Os(Gt("theme"))}function Fs(e){const t=Os(e);return document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t,t}function Sa(e){const t=Fs(e);return Yn("theme",t),t}function ka(){return Sa(Kt()==="dark"?"light":"dark")}function xa(){return Fs(Kt())}function Gs(e){return e==="light"?`
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `:`
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `}function $a(){const e=Kt(),t=e==="dark"?"light":"dark";return`
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${t} theme" title="Switch to ${t} theme">
      ${Gs(e)}
    </button>
  `}function M(e={}){const{title:t="ClassConnect",showBack:s=!1,backLabel:n="Back",studentName:a=null,showSettings:o=!1,showLogout:i=!1,logoutLabel:r="Sign out",showThemeToggle:d=!0}=e;return`
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
              ${d?$a():""}
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
  `}function z(e={}){const{onBack:t=null,onSettings:s=null,onBrand:n=null,onLogout:a=null}=e,o=document.getElementById("nav-back-btn");o&&t&&o.addEventListener("click",t);const i=document.getElementById("nav-settings-btn");i&&s&&i.addEventListener("click",s);const r=document.getElementById("nav-logout-btn");r&&a&&r.addEventListener("click",a);const d=document.getElementById("nav-theme-btn");d&&d.addEventListener("click",()=>{const l=ka(),p=l==="dark"?"light":"dark";d.innerHTML=Gs(l),d.setAttribute("aria-label",`Switch to ${p} theme`),d.setAttribute("title",`Switch to ${p} theme`)});const c=document.getElementById("nav-brand");c&&n&&(c.addEventListener("click",n),c.style.cursor="pointer");const u=()=>{const l=document.getElementById("status-dot"),p=document.getElementById("status-text");l&&(l.className=`status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}`),p&&(p.textContent=navigator.onLine?"Online":"Offline")};window.addEventListener("online",u),window.addEventListener("offline",u)}function Aa(){return`
    ${M({title:"ClassConnect"})}
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
  `}function Ca(e){z(),document.getElementById("btn-student").addEventListener("click",()=>{e("/student-login")}),document.getElementById("btn-teacher").addEventListener("click",()=>{e("/teacher-login")})}function Ge(e,t,s=""){const n=t>0?Math.round(e/t*100):0;return`
    <div class="progress-container" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100">
      ${s?`<div class="progress-label">${s}</div>`:""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${n}%"></div>
      </div>
      <div class="progress-text">${n}%</div>
    </div>
  `}function Hs(e){const t=["A","B","C","D"];return`
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
  `}function La(e){return e==="ai"?'<span class="badge badge--primary">AI Feedback</span>':e==="cache"?'<span class="badge badge--accent">Saved Offline</span>':e==="question-cache"?'<span class="badge badge--warning">Common Offline Hint</span>':e==="fallback"?'<span class="badge badge--neutral">Offline Hint</span>':'<span class="badge badge--success">Quick Check</span>'}function Ta(e){return e.source==="ai"?"Powered by Gemini AI and saved for offline reuse.":e.source==="cache"?"Loaded from this device cache so feedback still works offline.":e.source==="question-cache"?"Reused from a common explanation for this question while offline.":e.source==="fallback"?"Using the built-in lesson explanation because no saved AI response matched yet.":""}function Ea(e,t){return t||!e.practiceTip?"":`
    <div class="feedback-card__tip">
      <strong>Next step:</strong> ${e.practiceTip}
    </div>
  `}function Ba(e,t){return t||!e.usageCount&&!e.reusedFromQuestionBank?"":e.reusedFromQuestionBank?'<div class="feedback-card__meta">Misconception memory: reused a common explanation for this question.</div>':(e.usageCount||0)>1?`<div class="feedback-card__meta">Misconception memory: this saved explanation has helped ${e.usageCount} times on this device.</div>`:""}function Yt(e,t){const s=t?"Correct":"Review",n=t?"Correct!":"Let's learn from this",a=Ta(e);return`
    <div class="card feedback-card ${t?"feedback-card--correct":"feedback-card--incorrect"}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${s}</span>
        <span class="feedback-card__title">${n}</span>
        ${La(e.source)}
      </div>
      <div class="feedback-card__body">
        ${e.text}
      </div>
      ${Ea(e,t)}
      ${Ba(e,t)}
      ${a?`<div class="feedback-card__source">${a}</div>`:""}
    </div>
  `}function we(e,t,s,n="primary",a=""){return`
    <div class="card stat-card stat-card--${n}">
      <div class="stat-card__icon">${e}</div>
      <div class="stat-card__value">${t}</div>
      <div class="stat-card__label">${s}</div>
      ${a?`<div class="stat-card__detail">${a}</div>`:""}
    </div>
  `}let Ae=null;function T(e,t="info",s=3e3){Ae||(Ae=document.createElement("div"),Ae.className="toast-container",document.body.appendChild(Ae));const n={success:"OK",error:"X",info:"i"},a=document.createElement("div");a.className=`toast toast--${t}`,a.innerHTML=`<span>${n[t]||""}</span> ${e}`,Ae.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateX(100%)",a.style.transition="all 0.3s ease-out",setTimeout(()=>a.remove(),300)},s)}function Us(e,t){const s=t>0?e/t:0,n=2*Math.PI*45,a=n*(1-s);let o="#FB7185";return s>=.8?o="#34D399":s>=.6?o="#818CF8":s>=.4&&(o="#FBBF24"),`
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
  `}function de(e,t,s=[],n={}){const a=document.createElement("div");a.className="modal-overlay",a.id="modal-overlay";const o=n.modalClass?` ${n.modalClass}`:"";return a.innerHTML=`
    <div class="modal${o}">
      <h3 class="modal__title">${e}</h3>
      <div class="modal__body">${t}</div>
      <div class="modal__actions" id="modal-actions">
        ${s.map((i,r)=>`
          <button class="btn ${i.variant||"btn--ghost"}" id="modal-action-${r}">${i.label}</button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(a),s.forEach((i,r)=>{const d=document.getElementById(`modal-action-${r}`);d&&d.addEventListener("click",async()=>{let c=!0;i.onClick&&(c=await i.onClick(a)!==!1),c&&a.remove()})}),a.addEventListener("click",i=>{i.target===a&&a.remove()}),a}function Da(){return`
    ${M({title:"ClassConnect",showBack:!0})}
    <div class="container container--narrow view-enter" style="padding-top: var(--space-8); padding-bottom: var(--space-12);">
      <div class="card card--glass">
        <div style="text-align: center; margin-bottom: var(--space-8);">
          <h2 class="card__title" style="font-size: var(--font-size-2xl);">Student Login</h2>
          <p class="card__subtitle">Enter your name or student index number and 4-digit PIN.</p>
        </div>

        <form id="login-form" style="display: flex; flex-direction: column; gap: var(--space-6);">
          <div class="input-group">
            <label for="student-name">Full Name or Student Index Number</label>
            <input type="text" id="student-name" class="input" placeholder="e.g., Kwame Mensah or GES-B7-0101" required minlength="2" autocomplete="off">
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
  `}function Ma(e){z({onBack:()=>e("/")});const t=document.getElementById("login-form"),s=document.getElementById("student-name"),n=document.getElementById("student-pin");t.addEventListener("submit",async i=>{var c,u;i.preventDefault();const r=s.value.trim(),d=n.value;if(!r||d.length!==4){T("Please enter your name or index number and a 4-digit PIN.","error");return}try{let l=await Xn(r,d);l||(l=await Jn(r,d)),ga(l);const p=await se(l.id);e(p?"/lessons":"/diagnostic")}catch(l){console.error("[ClassConnect] Student login error:",l);let p="Login failed. Please try again.";(l==null?void 0:l.message)==="The local ClassConnect database is busy."?p="Your saved learning data is busy. Close other ClassConnect tabs, then try again.":((l==null?void 0:l.name)==="VersionError"||(c=l==null?void 0:l.message)!=null&&c.includes("version")||(u=l==null?void 0:l.message)!=null&&u.includes("blocked"))&&(p="A database update is needed. Please close all other ClassConnect tabs and try again."),T(p,"error")}});const a=document.getElementById("recent-students"),o=document.getElementById("recent-student-list");o.addEventListener("click",i=>{const r=i.target.closest(".student-quick-select");r&&(s.value=r.dataset.identifier||r.dataset.name,n.focus())}),Promise.all([K(),te()]).then(([i,r])=>{i.length&&(i.slice(0,6).forEach(d=>{const c=r.find(p=>p.id===d.classId),u=c?` [${c.stream||c.name}]`:"",l=document.createElement("button");l.type="button",l.className="badge badge--neutral student-quick-select",l.dataset.name=d.name,l.dataset.identifier=d.indexNumber||d.name,l.style.cssText="padding: var(--space-2) var(--space-3); cursor: pointer; border: 1px solid var(--color-slate-600);",l.textContent=`${d.name}${u}`,o.append(l)}),a.hidden=!1)}).catch(i=>{console.warn("Recent students could not be loaded.",i)})}function Ra(){const t=!Ht();return`
    ${M({title:"Teacher Access",showBack:!0})}
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
              <input type="password" id="teacher-api-key" class="input" value="${$e()||""}" placeholder="AIzaSy...">
            </div>
          `:""}

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${t?"Save PIN and Open Dashboard":"Open Dashboard"}
          </button>
        </form>
      </div>
    </div>
    <div class="bg-pattern"></div>
  `}function Pa(e){z({onBack:()=>e("/")});const t=Ht(),s=!t,n=document.getElementById("teacher-access-form"),a=document.getElementById("teacher-pin"),o=document.getElementById("teacher-pin-confirm"),i=document.getElementById("teacher-api-key");n.addEventListener("submit",async r=>{r.preventDefault();const d=a.value.trim();if(!/^\d{4}$/.test(d)){T("Enter a valid 4-digit teacher PIN.","error");return}if(s){const c=o==null?void 0:o.value.trim();if(d!==c){T("Teacher PINs do not match yet.","error");return}try{await Ns(d),i!=null&&i.value.trim()&&await Ps(i.value.trim()),cs(!0),T("Teacher access saved for this device.","success"),e("/dashboard")}catch(u){console.error(u),T("Unable to save teacher access right now.","error")}return}if(d!==t){T("That teacher PIN is not correct.","error");return}cs(!0),e("/dashboard")})}const A=[{id:1,title:"What Is a Computer?",duration:"10 min",objectives:["Define what a computer is and explain its basic purpose","Identify different types of computers used today","Understand how computers have evolved through generations"],keyTerms:[{word:"Computer",definition:"An electronic device that accepts data (input), processes it, and produces useful information (output)."},{word:"Data",definition:"Raw facts and figures that have not yet been processed — such as numbers, words, or images."},{word:"Information",definition:"Data that has been processed and organized so it is meaningful and useful."},{word:"Hardware",definition:"The physical parts of a computer that you can see and touch."},{word:"Software",definition:"Programs and instructions that tell the computer what to do."}],content:`
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
    `}],Na={1:{src:"/images/lesson-1-computer-types.png",alt:"Illustration of a desktop computer, laptop, tablet, smartphone, and server tower",caption:"Different types of computers suit different jobs, but they all accept data, process it, and give useful results."},2:{src:"/images/lesson-2-inside-computer.png",alt:"Illustration of a desktop tower opened to show the motherboard, CPU, RAM, storage drive, and power supply",caption:"Internal hardware works together through the motherboard so the CPU, memory, storage, and power system can do their jobs."},3:{src:"/images/lesson-3-input-devices.png",alt:"Illustration collage of a keyboard, mouse, touchscreen tablet, microphone, scanner, and webcam",caption:"Input devices help students send text, sound, touch, and images into a computer."},4:{src:"/images/lesson-4-output-devices.png",alt:"Illustration collage of a monitor, printer, speakers, projector, and plotter",caption:"Output devices help the computer present information as visuals, sound, or printed work."},5:{src:"/images/lesson-5-storage-devices.png",alt:"Illustration comparing a hard drive, solid state drive, flash drive, SD card, optical disc, and cloud storage symbol",caption:"Storage devices keep schoolwork, software, and media safe so learners can use them again later."}};function Ws(e,t=0,s=1){return Math.max(t,Math.min(s,e))}function Vt(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function qa(e){return Math.round(Ws(e)*100)}function Ks(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return new Map(t.map(s=>[s.lessonId,s]))}function za(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).forEach(s=>{t.has(s.lessonId)||t.set(s.lessonId,s)}),t}function ja(e){const t=new Map;return e.slice().sort((s,n)=>new Date(n.completedAt)-new Date(s.completedAt)).slice(0,3).forEach(s=>{var a;const n=((a=s.responses)==null?void 0:a.filter(o=>!o.correct).length)||0;t.set(s.lessonId,(t.get(s.lessonId)||0)+n)}),t}function Qa(e){return e>=.8?"mastered":e>=.6?"growing":e>=.4?"review":"urgent"}function Oa(e){const t=Vt(e.map(n=>n.mastery)),s=e.filter(n=>n.status==="urgent").length;return t>=.75&&s===0?{label:"Ready to Accelerate",tone:"success",description:"You have strong foundations across the strand. Push into harder quizzes and extension practice."}:t>=.55?{label:"Foundations Growing",tone:"accent",description:"You are building confidence. Focus on the weakest topics first, then continue the recommended path."}:{label:"Needs Guided Support",tone:"danger",description:"Your learning path should begin with a few targeted reviews before moving ahead."}}function Fa(e,t,s){const n=ja(t),a=Ks(s);return e.map(i=>{const r=a.get(i.lessonId),d=n.get(i.lessonId)||0,c=[];let u=0;return r&&r.accuracy<.5&&(c.push("low diagnostic readiness"),u+=25),i.latestQuizScore!==null&&i.latestQuizScore<.6&&(c.push("recent quiz performance dropped"),u+=20),d>0&&(c.push(`${d} recent missed question${d===1?"":"s"}`),u+=d*6),i.completed||(u+=8),!c.length&&i.mastery>=.65?null:{lessonId:i.lessonId,title:i.title,priority:u,reason:c.length?c.join(", "):"This topic will benefit from one more focused review.",action:`Revisit ${i.title}, then use the AI Tutor before retaking the quiz.`}}).filter(Boolean).sort((i,r)=>r.priority-i.priority).slice(0,4)}function Ga(e){const t=e.filter(i=>!i.completed&&i.status==="urgent").sort((i,r)=>i.lessonId-r.lessonId),s=e.filter(i=>!i.completed&&i.status==="review").sort((i,r)=>i.lessonId-r.lessonId),n=e.filter(i=>!i.completed&&(i.status==="growing"||i.status==="mastered")).sort((i,r)=>i.lessonId-r.lessonId),a=e.filter(i=>i.completed&&(i.status==="urgent"||i.status==="review")).sort((i,r)=>i.mastery-r.mastery||i.lessonId-r.lessonId),o=e.filter(i=>i.completed&&(i.status==="growing"||i.status==="mastered")).sort((i,r)=>i.lessonId-r.lessonId);return[...t,...s,...n,...a,...o]}function Ha(e,t=[],s=null){var c,u;const n=t.slice().sort((l,p)=>new Date(p.completedAt)-new Date(l.completedAt)),a=n[0]||null,o=n.length>0?Vt(n.map(l=>l.score/l.totalQuestions)):null;let i=0;const r=[];if(s||(i+=10,r.push("no diagnostic profile yet")),e.completionRate<40&&(i+=15,r.push("low lesson completion")),e.knowledgeGaps.length>=3&&(i+=20,r.push("several knowledge gaps remain open")),a){const l=a.score/a.totalQuestions;l<.5?(i+=25,r.push("latest quiz score below 50%")):l<.65&&(i+=12,r.push("latest quiz score needs support")),a.theta<-.75?(i+=25,r.push("ability estimate is trending low")):a.theta<-.25&&(i+=12,r.push("ability estimate suggests review"))}o!==null&&o<.6&&n.length>=2&&(i+=10,r.push("recent quiz trend is still below target"));const d=Math.min(100,i);return d>=60?{score:d,label:"High",badge:"danger",reasons:r,action:`Teacher check-in recommended. Start with ${((c=e.recommendedNext)==null?void 0:c.title)||"the weakest topic"} and review the revision queue.`}:d>=35?{score:d,label:"Moderate",badge:"warning",reasons:r,action:`Guide the learner through ${((u=e.recommendedNext)==null?void 0:u.title)||"the next recommended lesson"} and schedule a tutor session.`}:{score:d,label:"Low",badge:"success",reasons:r.length?r:["steady progress across current evidence"],action:"Keep the learner on the personalized path and use the tutor for stretch support."}}function J({diagnostic:e=null,results:t=[],progressRecords:s=[]}={}){const n=new Set(s.map(m=>m.lessonId)),a=Ks(e),o=za(t),i=A.map(m=>{const g=a.get(m.id),v=t.filter(E=>E.lessonId===m.id).sort((E,j)=>new Date(j.completedAt)-new Date(E.completedAt)),f=o.get(m.id)||null,_=f?f.score/f.totalQuestions:null,b=v.length?Vt(v.map(E=>E.score/E.totalQuestions)):null,y=g?g.accuracy:null,I=n.has(m.id);let w=0,S=0;y!==null&&(w+=y*.35,S+=.35),_!==null&&(w+=_*.45,S+=.45),b!==null&&v.length>1&&(w+=b*.1,S+=.1),I&&(w+=.1,S+=.1);let B=S>0?w/S:.2;I&&S===0&&(B=.55),B=Ws(B);const P=Qa(B);let O="Continue building momentum on this topic.";return g&&g.accuracy<.5?O="The diagnostic found this topic needs early attention.":_!==null&&_<.6?O="Recent quiz results suggest a focused review here.":I||(O="This topic is ready to learn next in your path."),{lessonId:m.id,title:m.title,completed:I,mastery:B,masteryPercent:qa(B),status:P,diagnosticScore:y,latestQuizScore:_,latestTheta:(f==null?void 0:f.theta)??null,attempts:v.length,recommendedFocus:O}}),r=Ga(i),d=i.filter(m=>m.status==="urgent"||m.status==="review").sort((m,g)=>m.mastery-g.mastery).slice(0,3),c=i.filter(m=>m.status==="mastered"||m.status==="growing").sort((m,g)=>g.mastery-m.mastery).slice(0,3),u=Fa(i,t,e),l=Oa(i),p=A.length>0?Math.round(n.size/A.length*100):0,h={lessonProfiles:i,recommendedSequence:r,recommendedNext:r.find(m=>!m.completed)||r[0]||null,knowledgeGaps:d,strengths:c,revisionQueue:u,readiness:l,completionRate:p,completedCount:n.size};return h.risk=Ha(h,t,e),h}function Ua(e,t){var s,n,a,o;return`
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
  `}function Wa(e){return e.revisionQueue.length?`
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
  `:""}function Ka(e){return`
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
  `}async function Ya(){const e=R(),t=e?await V(e.id):[],s=new Set(t.map(i=>i.lessonId)),n=e?await ge(e.id):[],a=e?await se(e.id):null,o=J({diagnostic:a,results:n,progressRecords:t});return`
    ${M({title:"Topics",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <h1 class="lesson-header__title" style="font-size: var(--font-size-2xl); margin-bottom: var(--space-2);">Introduction to Computer Systems</h1>
      <p style="color: var(--text-secondary); margin-bottom: var(--space-8);">Select a lesson to begin. Complete the lesson to unlock the adaptive quiz.</p>
      ${Ua(o,!!a)}
      ${Wa(o)}
      ${Ka(o)}
      ${Ge(s.size,A.length,"Lessons completed")}

      <div class="lesson-list">
        ${A.map((i,r)=>{var p;const d=s.has(i.id),c=o.lessonProfiles.find(h=>h.lessonId===i.id),u=((p=o.recommendedNext)==null?void 0:p.lessonId)===i.id,l=o.knowledgeGaps.some(h=>h.lessonId===i.id);return`
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
  `}function Va(e){z({onBack:()=>e("/")});const t=document.getElementById("btn-open-path");t&&t.addEventListener("click",async()=>{var u;const o=R(),i=o?await V(o.id):[],r=o?await se(o.id):null,d=o?await ge(o.id):[],c=J({diagnostic:r,results:d,progressRecords:i});e(`/lesson/${((u=c.recommendedNext)==null?void 0:u.lessonId)||1}`)});const s=document.getElementById("btn-open-tutor");s&&s.addEventListener("click",()=>e("/tutor"));const n=document.getElementById("btn-open-assessments");n&&n.addEventListener("click",()=>e("/assessments"));const a=document.getElementById("btn-open-diagnostic");a&&a.addEventListener("click",()=>e("/diagnostic")),document.querySelectorAll(".revision-queue__item, .adaptive-preview__item").forEach(o=>{o.addEventListener("click",i=>{const r=Number.parseInt(i.currentTarget.dataset.lessonId,10);e(`/lesson/${r}`)})}),document.querySelectorAll(".lesson-card").forEach(o=>{o.addEventListener("click",i=>{const r=Number.parseInt(i.currentTarget.dataset.id,10);e(`/lesson/${r}`)})})}async function Ja(e){var l;const t=R(),s=A.find(p=>p.id===e);if(!s)return'<div class="container" style="padding: 2rem;">Lesson not found.</div>';const n=A.indexOf(s),a=t?await na(t.id,e):!1,o=Na[e],i=t?await V(t.id):[],r=t?await ge(t.id):[],d=t?await se(t.id):null,u=J({diagnostic:d,results:r,progressRecords:i}).lessonProfiles.find(p=>p.lessonId===e);return`
    ${M({title:"Lesson",showBack:!0,studentName:t==null?void 0:t.name})}

    <div class="container container--narrow view-enter lesson-page">
      ${Ge(n+1,A.length,`Lesson ${n+1} of ${A.length}`)}
      <div class="lesson-progress-strip">
        ${A.map((p,h)=>`
          <div class="lesson-progress-pip ${h===n?"lesson-progress-pip--current":""} ${h<n?"lesson-progress-pip--completed":""}"></div>
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

        ${o?`
          <figure class="lesson-image">
            <img src="${o.src}" alt="${o.alt}" loading="lazy">
            <figcaption class="lesson-image__caption">${o.caption}</figcaption>
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
  `}function Za(e,t){z({onBack:()=>e("/lessons")});const s=R(),n=A.find(c=>c.id===t),a=A.indexOf(n),o=document.getElementById("btn-mark-complete"),i=document.getElementById("btn-take-quiz"),r=document.getElementById("btn-prev-lesson");r&&r.addEventListener("click",()=>{e(`/lesson/${A[a-1].id}`)}),o&&s&&o.addEventListener("click",async()=>{await sa(s.id,t),o.outerHTML='<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>',i&&(i.removeAttribute("disabled"),i.removeAttribute("title")),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}),i&&i.addEventListener("click",()=>{e(`/quiz/${t}`)});const d=document.getElementById("btn-ask-tutor");d&&d.addEventListener("click",()=>{e("/tutor")})}const it=[{id:"L1Q1",lessonId:1,stem:"What is the BEST definition of a computer?",options:["A machine that only plays games and videos","An electronic device that accepts data, processes it, and produces information","Any device that uses electricity","A tool used only for typing documents"],correctIndex:1,difficulty:-1.5,discrimination:1.2,guessing:.25},{id:"L1Q2",lessonId:1,stem:"Which of these is NOT a type of computer?",options:["Desktop","Laptop","Calculator","Tablet"],correctIndex:2,difficulty:-.8,discrimination:1,guessing:.25},{id:"L1Q3",lessonId:1,stem:"What technology did FIRST generation computers use?",options:["Microprocessors","Transistors","Vacuum tubes","Integrated circuits"],correctIndex:2,difficulty:.3,discrimination:1.3,guessing:.25},{id:"L1Q4",lessonId:1,stem:"Which generation of computers introduced the microprocessor?",options:["First generation","Second generation","Third generation","Fourth generation"],correctIndex:3,difficulty:.5,discrimination:1.1,guessing:.25},{id:"L1Q5",lessonId:1,stem:"What is the difference between data and information?",options:["Data is processed; information is raw","Data is raw facts; information is processed and meaningful","They mean the same thing","Data is digital; information is analog"],correctIndex:1,difficulty:0,discrimination:1.4,guessing:.25},{id:"L1Q6",lessonId:1,stem:"A smartphone is a type of computer.",options:["True — it processes data and runs programs","False — it is only a phone","True — but only expensive ones","False — it has no keyboard"],correctIndex:0,difficulty:-1,discrimination:.9,guessing:.25},{id:"L1Q7",lessonId:1,stem:"What does the fifth generation of computers focus on?",options:["Vacuum tubes","Transistors","Artificial Intelligence","Magnetic storage"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L1Q8",lessonId:1,stem:"A server is a powerful computer that:",options:["Only stores personal photos","Provides services to other computers on a network","Cannot connect to the internet","Is smaller than a smartphone"],correctIndex:1,difficulty:.8,discrimination:1.3,guessing:.25},{id:"L2Q1",lessonId:2,stem:"What is the CPU often called?",options:["The heart of the computer","The brain of the computer","The body of the computer","The memory of the computer"],correctIndex:1,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L2Q2",lessonId:2,stem:"What is the main function of the motherboard?",options:["To store files permanently","To display images on screen","To connect all computer components and allow them to communicate","To provide internet access"],correctIndex:2,difficulty:-.3,discrimination:1.2,guessing:.25},{id:"L2Q3",lessonId:2,stem:"What happens to data in RAM when the computer is turned off?",options:["It is saved permanently","It is transferred to the monitor","It disappears (is lost)","It moves to the keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.4,guessing:.25},{id:"L2Q4",lessonId:2,stem:"What unit is used to measure the speed of a CPU?",options:["Kilograms (kg)","Gigahertz (GHz)","Megabytes (MB)","Watts (W)"],correctIndex:1,difficulty:.6,discrimination:1.5,guessing:.25},{id:"L2Q5",lessonId:2,stem:"ROM is different from RAM because ROM:",options:["Is faster than RAM","Loses data when power is off","Keeps its data even when the computer is off","Can hold more data than RAM"],correctIndex:2,difficulty:.4,discrimination:1.3,guessing:.25},{id:"L2Q6",lessonId:2,stem:"What does the Power Supply Unit (PSU) do?",options:["Displays images on the screen","Converts wall electricity into the correct voltage for components","Stores programs permanently","Connects the computer to the internet"],correctIndex:1,difficulty:.1,discrimination:1.1,guessing:.25},{id:"L2Q7",lessonId:2,stem:"If a computer has more RAM, it can generally:",options:["Store more files permanently","Run more tasks at the same time without slowing down","Display brighter colors","Connect to faster internet"],correctIndex:1,difficulty:.3,discrimination:1.2,guessing:.25},{id:"L2Q8",lessonId:2,stem:"Which two types of operations does the CPU perform?",options:["Input and output operations","Arithmetic and logic operations","Printing and scanning operations","Storage and display operations"],correctIndex:1,difficulty:.7,discrimination:1.4,guessing:.25},{id:"L3Q1",lessonId:3,stem:"An input device is used to:",options:["Display information to the user","Send data or commands into a computer","Store data permanently","Print documents on paper"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L3Q2",lessonId:3,stem:"Which of the following is an input device?",options:["Printer","Monitor","Keyboard","Speaker"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L3Q3",lessonId:3,stem:"A scanner converts:",options:["Sound into text","Digital files into paper documents","Physical documents into digital images","Video into audio"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L3Q4",lessonId:3,stem:"A touchscreen is special because it is:",options:["Only an input device","Only an output device","Both an input and output device","A storage device"],correctIndex:2,difficulty:-.2,discrimination:1.4,guessing:.25},{id:"L3Q5",lessonId:3,stem:"A microphone captures _____ and converts it into digital data.",options:["Light","Heat","Sound","Motion"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L3Q6",lessonId:3,stem:"A trackpad is a type of:",options:["Output device found on desktops","Pointing device built into laptops","Storage device","Printer accessory"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L3Q7",lessonId:3,stem:"Which input device would you use to capture your face for a video call?",options:["Scanner","Keyboard","Webcam","Printer"],correctIndex:2,difficulty:-.6,discrimination:1.1,guessing:.25},{id:"L3Q8",lessonId:3,stem:"A wireless keyboard connects to the computer using:",options:["A VGA cable","Bluetooth or a USB receiver","An HDMI cable","A power cable"],correctIndex:1,difficulty:.5,discrimination:1.3,guessing:.25},{id:"L4Q1",lessonId:4,stem:"An output device:",options:["Sends data into the computer","Presents processed data from the computer to the user","Stores data permanently on a disk","Provides electricity to the computer"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L4Q2",lessonId:4,stem:"Which of the following is an output device?",options:["Mouse","Scanner","Monitor","Keyboard"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L4Q3",lessonId:4,stem:'A "hard copy" refers to:',options:["A file saved on a hard disk","A physical paper printout of a document","A very difficult document to read","A backup copy on a flash drive"],correctIndex:1,difficulty:.2,discrimination:1.3,guessing:.25},{id:"L4Q4",lessonId:4,stem:"Which type of printer uses a laser beam and toner powder?",options:["Inkjet printer","Laser printer","3D printer","Dot matrix printer"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L4Q5",lessonId:4,stem:"A projector is used to:",options:["Print documents in large sizes","Display the computer's screen as a large image on a wall","Record sound from the computer","Store data on optical discs"],correctIndex:1,difficulty:-.5,discrimination:1.1,guessing:.25},{id:"L4Q6",lessonId:4,stem:"Speakers convert electrical signals into:",options:["Light","Text","Sound","Images"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L4Q7",lessonId:4,stem:"A device that serves as BOTH input and output is called:",options:["A storage device","An I/O device","A processing device","A network device"],correctIndex:1,difficulty:.6,discrimination:1.4,guessing:.25},{id:"L4Q8",lessonId:4,stem:"A plotter is mainly used to:",options:["Play music files","Draw large-format graphics like maps and architectural plans","Scan photographs","Display video on a wall"],correctIndex:1,difficulty:1,discrimination:1.3,guessing:.25},{id:"L5Q1",lessonId:5,stem:"Why do we need storage devices?",options:["To increase the speed of the CPU","To save data permanently so it can be accessed later","To display images on the screen","To connect to the internet"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L5Q2",lessonId:5,stem:"Which storage device uses spinning magnetic disks?",options:["SSD","Flash drive","HDD","SD card"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L5Q3",lessonId:5,stem:"An SSD is faster than an HDD because it:",options:["Uses larger disks","Has no moving parts — it uses flash memory chips","Uses more electricity","Is always connected to the internet"],correctIndex:1,difficulty:.3,discrimination:1.4,guessing:.25},{id:"L5Q4",lessonId:5,stem:"Google Drive is an example of:",options:["An HDD","Cloud storage","An optical disc","A flash drive"],correctIndex:1,difficulty:-.8,discrimination:1,guessing:.25},{id:"L5Q5",lessonId:5,stem:"The correct order of the computing cycle is:",options:["Output → Input → Storage → Processing","Input → Processing → Output → Storage","Processing → Input → Output → Storage","Storage → Output → Input → Processing"],correctIndex:1,difficulty:.5,discrimination:1.5,guessing:.25},{id:"L5Q6",lessonId:5,stem:"Which storage medium has the LARGEST typical capacity?",options:["SD card","CD","Hard Disk Drive (HDD)","Flash drive"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L5Q7",lessonId:5,stem:"Optical discs (like CDs and DVDs) are read using:",options:["A magnetic head","A laser beam","Radio waves","Electrical contacts"],correctIndex:1,difficulty:.7,discrimination:1.3,guessing:.25},{id:"L5Q8",lessonId:5,stem:"When you save a school report to a flash drive and print it, which component is the storage device?",options:["The printer","The monitor","The flash drive","The keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.1,guessing:.25}];function ie(e,t=2){return Math.round(e*10**t)/10**t}function Ys(e,t){const{discrimination:s,difficulty:n,guessing:a}=t,o=-s*(e-n);return a+(1-a)/(1+Math.exp(o))}function Vs(e,t){const s=Ys(e,t),{discrimination:n,guessing:a}=t;if(s<=a||s>=1)return 0;const o=n*n*(s-a)**2,i=(1-a)**2*s*(1-s);return i>0?o/i:0}function Xa(e){if(e.length===0)return 0;const t=e.every(i=>i.correct),s=e.every(i=>!i.correct);if(t)return Math.min(3,.5*e.length);if(s)return Math.max(-3,-.5*e.length);let n=0;const a=30,o=.001;for(let i=0;i<a;i+=1){let r=0,d=0;for(const u of e){const l=Ys(n,u.item),p=1-l,{discrimination:h,guessing:m}=u.item,g=(l-m)/(1-m),v=h*g*p;u.correct?r+=v/l:r-=v/p,d-=v*v/(l*p)}if(Math.abs(d)<1e-10)break;const c=r/d;if(n-=c,n=Math.max(-3,Math.min(3,n)),Math.abs(c)<o)break}return n}function yt(e,t){let s=0;for(const n of t)s+=Vs(e,n.item);return s>0?1/Math.sqrt(s):999}function ei(e,t){let s=null,n=-1/0;for(const a of t){const o=Vs(e,a);o>n&&(n=o,s=a)}return s}function ls(e){return e<-1?{label:"Beginner",color:"#FB7185",description:"Just getting started — keep learning and practicing!"}:e<0?{label:"Developing",color:"#FBBF24",description:"You understand the basics. Review the tricky parts and try again!"}:e<1?{label:"Proficient",color:"#818CF8",description:"Great understanding! You've got a solid grasp of this topic."}:{label:"Advanced",color:"#34D399",description:"Excellent! You've mastered this topic. Ready for the next challenge!"}}function ti(e=null,t=10){let s=e?it.filter(v=>v.lessonId===e):[...it];s=s.sort(()=>Math.random()-.5);const n=new Set,a=[],o=[];let i=0,r=null,d=0,c=!1,u=null;function l(){if(c)return null;const v=s.filter(f=>!n.has(f.id));return v.length===0||d>=t||d>=5&&yt(i,a)<.3?(c=!0,null):(r=ei(i,v),n.add(r.id),d+=1,u=Date.now(),{question:r,questionNumber:d,totalQuestions:Math.min(t,s.length),currentTheta:i,difficulty:r.difficulty>.5?"Hard":r.difficulty<-.5?"Easy":"Medium"})}function p(v){if(!r)return null;const f=Date.now(),_=i,b=v===r.correctIndex,y={item:r,selectedIndex:v,correct:b,questionNumber:d,presentedAt:u||f,answeredAt:f,elapsedMs:Math.max(0,f-(u||f)),thetaBefore:_};return a.push(y),i=Xa(a),y.thetaAfter=i,y.standardErrorAfter=yt(i,a),o.push({questionId:r.id,questionNumber:d,thetaBefore:ie(_),thetaAfter:ie(i),standardErrorAfter:ie(y.standardErrorAfter),elapsedMs:y.elapsedMs,correct:b}),u=null,{correct:b,correctIndex:r.correctIndex,thetaBefore:_,thetaAfter:i,standardErrorAfter:y.standardErrorAfter,elapsedMs:y.elapsedMs,level:ls(i)}}function h(){return u?Math.max(0,Date.now()-u):0}function m(){const v=a.filter(I=>I.correct).length,f=ls(i),_=yt(i,a),b=a.reduce((I,w)=>I+w.elapsedMs,0),y=a.length>0?Math.round(b/a.length):0;return{score:v,totalQuestions:a.length,theta:ie(i),standardError:ie(_),level:f.label,levelColor:f.color,levelDescription:f.description,totalTimeMs:b,averageTimeMs:y,thetaTrajectory:o,responses:a.map(I=>({questionId:I.item.id,lessonId:I.item.lessonId,stem:I.item.stem,options:I.item.options,selectedIndex:I.selectedIndex,correctIndex:I.item.correctIndex,correct:I.correct,questionNumber:I.questionNumber,elapsedMs:I.elapsedMs,presentedAt:I.presentedAt,answeredAt:I.answeredAt,thetaBefore:ie(I.thetaBefore),thetaAfter:ie(I.thetaAfter),standardErrorAfter:ie(I.standardErrorAfter)}))}}function g(){return c}return{next:l,answer:p,getCurrentElapsedMs:h,getResults:m,isFinished:g}}const si={L1Q1:"A computer is specifically an electronic device that accepts data (input), processes it using instructions, and produces useful information (output). It's not limited to games or typing — it can do many things because of its ability to follow programs.",L1Q2:"A calculator can do math, but it is not a general-purpose computer. It cannot run different programs, browse the internet, or process many types of data. Desktops, laptops, and tablets are all types of computers because they can run software and handle many tasks.",L1Q3:"First generation computers (1940s-1950s) used vacuum tubes — large glass tubes that controlled electrical signals. These made the computers huge (filling entire rooms!) and generated a lot of heat. Transistors came in the second generation.",L1Q4:"The fourth generation (1970s to present) introduced the microprocessor — an entire CPU on a single tiny chip. This breakthrough made personal computers, laptops, and smartphones possible. The Intel 4004 (1971) was one of the first microprocessors.",L1Q5:"Data refers to raw, unprocessed facts and figures (like numbers or words). Information is what you get after data has been processed and organized into something meaningful and useful. For example, student scores (data) become a class ranking (information).",L1Q6:"A smartphone is indeed a type of computer! It has a processor (CPU), memory (RAM), storage, input devices (touchscreen, microphone), and output devices (screen, speaker). It runs software programs (apps) just like a desktop computer.",L1Q7:"The fifth generation of computers focuses on Artificial Intelligence (AI) — making computers that can learn, understand human speech, and make decisions. This includes technologies like voice assistants and self-driving cars.",L1Q8:"A server is a powerful computer that provides services to other computers on a network. When you visit a website, a server sends that information to your device. Servers are typically kept in special rooms and run 24/7.",L2Q1:"The CPU is called the 'brain' of the computer because it carries out all instructions and makes decisions. Just like your brain processes information from your senses, the CPU processes data from input devices and tells other components what to do.",L2Q2:"The motherboard is the main circuit board that connects all computer components together and allows them to communicate. Think of it as the 'backbone' or 'highway system' of the computer — everything plugs into it.",L2Q3:"RAM (Random Access Memory) is temporary memory — it only holds data while the computer is running. When you turn off the computer, all data in RAM is lost. That's why you need to save your work to storage (like a hard drive) to keep it.",L2Q4:"CPU speed is measured in Gigahertz (GHz). One GHz means the CPU can perform one billion basic operations per second! A higher GHz number generally means a faster processor. Megabytes measure storage, not speed.",L2Q5:"ROM (Read-Only Memory) keeps its data even when the computer is turned off — this is called 'non-volatile' memory. RAM loses its data when power is off ('volatile'). ROM stores the essential startup instructions the computer needs to begin loading.",L2Q6:"The Power Supply Unit (PSU) converts AC electricity from the wall outlet into DC electricity at the correct voltages that computer components need. Without it, no component inside the computer would receive power.",L2Q7:"More RAM means the computer can hold more data for active tasks at the same time. This allows you to run multiple programs without the computer slowing down. RAM doesn't affect permanent storage — that's the job of hard drives and SSDs.",L2Q8:"The CPU performs two types of operations: arithmetic (math calculations like adding and multiplying) and logic (comparisons like 'Is A equal to B?' or 'Is X greater than Y?'). All computing tasks ultimately break down into these two types.",L3Q1:"An input device is any hardware that allows you to send data or commands INTO a computer. Without input devices, you would have no way to tell the computer what to do. They are the 'doors' through which data enters the computer.",L3Q2:"A keyboard is an input device — you use it to enter text and commands into the computer. Printers, monitors, and speakers are all output devices because they present data FROM the computer to you.",L3Q3:"A scanner takes a physical document or photograph and converts it into a digital image that the computer can store and display. It works in the opposite direction of a printer — a printer takes digital files and puts them ON paper.",L3Q4:"A touchscreen is special because it serves as BOTH an input device (you tap and swipe to send commands) AND an output device (it displays information). This makes it an I/O (input/output) device.",L3Q5:"A microphone captures sound waves from your voice or the environment and converts them into digital data that the computer can process. This is how voice calls, voice recording, and voice assistants work.",L3Q6:"A trackpad (also called touchpad) is a flat, touch-sensitive surface built into laptops that works like a mouse. You move your finger across it to control the cursor. It's a pointing input device.",L3Q7:"A webcam (web camera) captures video and images, which is exactly what you need for a video call. Scanners capture flat documents, keyboards capture text, and printers are output devices — none of them can capture live video of your face.",L3Q8:"Wireless keyboards connect to the computer using either Bluetooth technology or a small USB receiver that plugs into the computer. This eliminates the need for a cable connection between the keyboard and the computer.",L4Q1:"An output device takes processed data from the computer and presents it in a form that humans can understand. Monitors show visual output, speakers produce audio output, and printers create physical output on paper.",L4Q2:"A monitor is an output device — it displays visual information from the computer to you. Mice, scanners, and keyboards are input devices that send data INTO the computer.",L4Q3:"A 'hard copy' is a physical paper printout of a digital document. The word 'hard' refers to the fact that it's a tangible, physical copy you can hold in your hands, as opposed to a 'soft copy' which exists only on the computer screen.",L4Q4:"A laser printer uses a laser beam to create an image on a drum, which then attracts toner powder. The toner is transferred to paper and fused with heat. Laser printers are fast and great for printing large amounts of text.",L4Q5:"A projector takes the computer's visual display and projects it as a large image on a wall or screen. This makes it ideal for classrooms and meetings where many people need to see the same content at once.",L4Q6:"Speakers receive electrical signals from the computer and convert them into sound waves that we can hear. This is how you hear music, voice in videos, system alerts, and all other audio from a computer.",L4Q7:"A device that serves as both input and output is called an I/O (Input/Output) device. A touchscreen is the best example — you input by touching it, and it outputs by displaying information. Some use the term 'interactive device'.",L4Q8:"A plotter is a specialized output device designed to draw large-format graphics, maps, engineering diagrams, and architectural plans. Unlike regular printers that print line by line, plotters use pens to draw continuous, precise lines.",L5Q1:"Storage devices save data permanently so you can access it later, even after the computer is turned off. Without storage, you would lose all your files every time you shut down — RAM only holds data temporarily while the computer is on.",L5Q2:"A Hard Disk Drive (HDD) uses spinning magnetic disks called platters. A read/write head moves across these platters to store and retrieve data. This mechanical process is what makes HDDs slower than SSDs.",L5Q3:"An SSD (Solid State Drive) uses flash memory chips with no moving parts. Since there are no spinning disks or moving heads, data can be read and written much faster. HDDs are slower because they rely on mechanical, moving parts.",L5Q4:"Google Drive is a cloud storage service. Cloud storage means your files are saved on remote servers accessed through the internet, not on a physical device in your hand. Other examples include Dropbox and OneDrive.",L5Q5:"The correct computing cycle is: Input (data enters) → Processing (CPU works on the data) → Output (results are shown) → Storage (data is saved). This is the fundamental pattern that every computing task follows.",L5Q6:"Hard Disk Drives (HDDs) typically have the largest capacity — they can store 500 GB to several terabytes (TB) of data. SD cards, CDs, and flash drives have much smaller capacities compared to modern HDDs.",L5Q7:"Optical discs like CDs, DVDs, and Blu-ray discs are read using a laser beam. The laser reads tiny pits and lands on the disc surface to retrieve data. That's why they're called 'optical' — they use light (optics) technology.",L5Q8:"In this scenario, the flash drive is the storage device — it permanently saves your school report file. The printer is an output device (it produces a paper copy), the monitor is an output device, and the keyboard is an input device."},ni="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",ai="Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!",Ke=new Map;function us(e=""){return e.toLowerCase().replace(/\s+/g," ").trim()}function ii(e,t,s){return[e,us(t),us(s)].join("::")}function oi(e=""){return e.replace(/\s+/g," ").trim()}function Jt(e,t){return t?(e||"").toLowerCase().includes("difference")?`Practice tip: compare the choices and explain why "${t}" matches the question best.`:`Practice tip: say out loud why "${t}" is the best answer before you continue.`:"Practice tip: explain the key idea in your own words before you move on."}function pt(e,t="cache",s={}){return{text:e.text,source:t,model:e.model||null,practiceTip:e.practiceTip||Jt(e.stem,e.correctAnswer),usageCount:e.usageCount||1,cachedAt:e.updatedAt||e.createdAt||null,savedForOffline:!0,...s}}function ri(e,t,s){return{text:si[e]||ai,source:"fallback",model:null,practiceTip:Jt(t,s),usageCount:0,cachedAt:null,savedForOffline:!1}}async function ci(e,t){const n=(await ma(e)).filter(o=>o.cacheKey!==t&&o.text).sort((o,i)=>{const r=(i.usageCount||1)-(o.usageCount||1);return r!==0?r:new Date(i.lastUsedAt||i.updatedAt||0)-new Date(o.lastUsedAt||o.updatedAt||0)})[0];if(!n)return null;const a=await Wt(n.cacheKey);return pt(a||n,"question-cache",{reusedFromQuestionBank:!0})}async function Ze({questionId:e,stem:t,correctAnswer:s,cacheKey:n,cachedEntry:a,allowQuestionCache:o}){if(a){const i=await Wt(n);return pt(i||a,"cache")}if(o){const i=await ci(e,n);if(i)return i}return ri(e,t,s)}async function di({apiKey:e,questionId:t,stem:s,studentAnswer:n,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r}){var d,c,u,l,p;try{const h=li(s,n,a),m=await fetch(`${ni}?key=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:h}]}],generationConfig:{temperature:.6,maxOutputTokens:180,topP:.9}}),signal:AbortSignal.timeout(1e4)});if(!m.ok)return console.warn("Gemini API error, using offline fallback:",m.status),Ze({questionId:t,stem:s,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r});const g=await m.json(),v=(p=(l=(u=(c=(d=g==null?void 0:g.candidates)==null?void 0:d[0])==null?void 0:c.content)==null?void 0:u.parts)==null?void 0:l[0])==null?void 0:p.text,f=oi(v);if(!f)return Ze({questionId:t,stem:s,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r});const _=await ha({cacheKey:o,questionId:t,stem:s,studentAnswer:n,correctAnswer:a,text:f,practiceTip:Jt(s,a),model:"gemini-2.0-flash",lastUsedAt:new Date().toISOString()});return pt(_,"ai",{model:"gemini-2.0-flash"})}catch(h){return console.warn("AI feedback failed, using offline fallback:",h.message),Ze({questionId:t,stem:s,correctAnswer:a,cacheKey:o,cachedEntry:i,allowQuestionCache:r})}}async function Js(e,t,s,n,a={}){const{preferCached:o=!1,allowQuestionCache:i=!0}=a,r=$e(),d=ii(e,s,n),c=await pa(d);if(!r||!navigator.onLine)return Ze({questionId:e,stem:t,correctAnswer:n,cacheKey:d,cachedEntry:c,allowQuestionCache:i});if(o&&c){const l=await Wt(d);return pt(l||c,"cache")}if(Ke.has(d))return Ke.get(d);const u=di({apiKey:r,questionId:e,stem:t,studentAnswer:s,correctAnswer:n,cacheKey:d,cachedEntry:c,allowQuestionCache:i}).finally(()=>{Ke.delete(d)});return Ke.set(d,u),u}function li(e,t,s){return`You are a friendly, encouraging JHS Computing teacher in Ghana. A student answered a quiz question incorrectly. Explain why the correct answer is right in 2-3 simple sentences for a 12-14 year old. Be warm and supportive. Do not say "you are wrong" or shame the learner.

Question: "${e}"
Student's answer: "${t}"
Correct answer: "${s}"

Give only the short explanation:`}async function ui(e){const t={},s=e.filter(n=>!n.correct);for(const n of s){const a=n.options[n.selectedIndex],o=n.options[n.correctIndex];t[n.questionId]=await Js(n.questionId,n.stem,a,o,{preferCached:!0})}return t}let W=null,ot=null,ke=null,L=null,je=!1,Xe=null,pi=0;function Zs(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function He(){Xe&&(window.clearInterval(Xe),Xe=null)}function ps(){const e=document.getElementById("question-timer");!e||!W||(e.textContent=Zs(W.getCurrentElapsedMs()))}function mi(){He(),ps(),Xe=window.setInterval(ps,1e3)}function Xs(e){return{source:e.source,text:e.aiText,practiceTip:e.practiceTip,usageCount:e.usageCount,reusedFromQuestionBank:e.reusedFromQuestionBank}}function en(e){return e.correct?"Instant success feedback is ready.":e.feedbackLoading?navigator.onLine?"Generating a simple AI explanation and saving it for offline use...":"You are offline. Looking for a saved explanation on this device...":e.source==="ai"?"Live AI feedback is ready and saved for offline reuse.":e.source==="cache"?"Loaded from the saved feedback cache on this device.":e.source==="question-cache"?"Using a common saved explanation for this question while offline.":"Showing the built-in offline explanation."}function hi(e){if(!L)return;L.aiText=e.text,L.source=e.source,L.practiceTip=e.practiceTip,L.usageCount=e.usageCount,L.reusedFromQuestionBank=e.reusedFromQuestionBank,L.feedbackLoading=!1;const t=document.getElementById("feedback-container");t&&(t.innerHTML=Yt(Xs(L),!1));const s=document.getElementById("feedback-status");s&&(s.textContent=en(L))}function gi(e,t,s){const n=`feedback-${++pi}`;L&&(L.feedbackRequestId=n),Js(e.id,e.stem,t,s,{preferCached:!1}).then(a=>{!L||L.feedbackRequestId!==n||hi(a)})}function vi(e){He(),ot=Number.parseInt(e,10),W=ti(ot),ke=W.next(),L=null,je=!1}function fi(e){const t=Number.parseInt(e,10);(!W||ot!==t)&&vi(t)}function bi(){He(),W=null,ot=null,ke=null,L=null,je=!1}function yi(){if(!W||!ke)return'<div class="container">Error initializing quiz.</div>';const e=R(),t=ke;let s="";if(L){const n=L.aiText?Yt(Xs(L),L.correct):'<div class="shimmer" style="height: 116px; width: 100%;"></div>';s=`
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${Zs(L.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${L.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${L.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${L.stem}</p>

        <div class="results-review">
          <div class="review-item ${L.correct?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${L.correct?"review-item__correct-answer":"review-item__your-answer"}">${L.studentAnswerText}</span></div>
            </div>
            ${L.correct?"":`
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${L.correctAnswerText}</span></div>
              </div>
            `}
          </div>
        </div>

        <div class="feedback-status" id="feedback-status">${en(L)}</div>
        <div style="margin-top: var(--space-4);" id="feedback-container">
          ${n}
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${W.isFinished()?"See Final Results":"Next Question"}
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

      ${Ge(t.questionNumber-1,t.totalQuestions,"Quiz progress")}

      <div id="question-container">
        ${Hs(t.question)}
      </div>
    `;return`
    ${M({title:"Adaptive Quiz",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${s}
    </div>
  `}function wi(e,t,s){if(z({onBack:()=>e(`/lesson/${s}`)}),L){He();const a=document.getElementById("btn-next-question");a&&a.addEventListener("click",async()=>{if(L=null,W.isFinished()){await ms(e,s);return}const o=W.next();if(!o){await ms(e,s);return}ke=o,t()});return}mi(),document.querySelectorAll(".option-btn").forEach(a=>{a.addEventListener("click",o=>{if(je)return;je=!0;const i=Number.parseInt(o.currentTarget.dataset.index,10);Ii(i,o.currentTarget,t)})})}function Ii(e,t,s){const n=W.answer(e),a=ke.question;if(He(),document.querySelectorAll(".option-btn").forEach(i=>{i.classList.add("option-btn--disabled"),i.disabled=!0}),n.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const i=document.getElementById(`option-${n.correctIndex}`);i&&i.classList.add("option-btn--highlight-correct")}L={questionId:a.id,stem:a.stem,correct:n.correct,studentAnswerText:a.options[e],correctAnswerText:a.options[n.correctIndex],aiText:n.correct?"Great work - you understood this concept.":null,source:n.correct?"system":null,practiceTip:n.correct?"Keep building on that idea in the next question.":null,usageCount:0,reusedFromQuestionBank:!1,feedbackLoading:!n.correct,feedbackRequestId:null,elapsedMs:n.elapsedMs,thetaAfter:n.thetaAfter,levelLabel:n.level.label},n.correct||gi(a,L.studentAnswerText,L.correctAnswerText),setTimeout(()=>{je=!1,s()},1e3)}async function ms(e,t){const s=R(),n=W.getResults();if(!s){e("/lessons");return}const a=await aa({studentId:s.id,lessonId:Number.parseInt(t,10),...n});e(`/quiz-results/${a.id}`)}function Dt(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}async function _i(e){var d,c,u;const t=R(),s=await ve(),n=s.find(l=>l.id===Number.parseInt(e,10));if(!n)return'<div class="container">Result not found.</div>';const a=t?s.filter(l=>l.studentId===t.id):[],o=t?await se(t.id):null,i=t?await V(t.id):[],r=J({diagnostic:o,results:a,progressRecords:i});return`
    ${M({title:"Quiz Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Lessons"})}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${Us(n.score,n.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${n.levelColor};">
          Level: ${n.level}
        </div>
        <p class="quiz-results__level-desc">${n.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${Dt(n.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${Dt(n.averageTimeMs)}</span>
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
  `}function Si(e,t){z({onBack:()=>e("/lessons")});const s=document.getElementById("btn-next-lesson"),n=document.getElementById("btn-open-tutor"),a=document.getElementById("btn-retry-quiz");ve().then(async o=>{const i=o.find(p=>p.id===Number.parseInt(t,10));if(!i)return;const r=R(),d=r?o.filter(p=>p.studentId===r.id):[],c=r?await se(r.id):null,u=r?await V(r.id):[],l=J({diagnostic:c,results:d,progressRecords:u});s&&s.addEventListener("click",()=>{var h;const p=(h=l.recommendedNext)==null?void 0:h.lessonId;e(p?`/lesson/${p}`:"/lessons")}),n&&n.addEventListener("click",()=>{e("/tutor")}),a&&a.addEventListener("click",()=>{e(`/quiz/${i.lessonId}`)}),ki(i.responses)})}async function ki(e){const t=document.getElementById("review-list");if(!t)return;t.innerHTML=e.map(n=>wt(n,null)).join("");const s=await ui(e);t.innerHTML=e.map(n=>n.correct?wt(n,{text:"Correct! You handled this concept well.",source:"system"}):wt(n,s[n.questionId])).join("")}function wt(e,t){const s=e.options[e.selectedIndex],n=e.options[e.correctIndex];let a="";return t?e.correct||(a=`
        <div class="review-item__feedback">
          ${Yt(t,!1)}
        </div>
      `):e.correct||(a='<div class="shimmer" style="height: 116px; margin-top: var(--space-3);"></div>'),`
    <div class="review-item ${e.correct?"review-item--correct":"review-item--incorrect"}">
      <div class="review-item__question">${e.questionNumber}. ${e.stem}</div>
      <div class="review-item__meta">
        <span>Time: ${Dt(e.elapsedMs)}</span>
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
  `}const xi="modulepreload",$i=function(e){return"/"+e},hs={},Ai=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){let i=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));a=i(s.map(c=>{if(c=$i(c),c in hs)return;hs[c]=!0;const u=c.endsWith(".css"),l=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${l}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":xi,u||(p.as="script"),p.crossOrigin="",p.href=c,d&&p.setAttribute("nonce",d),document.head.appendChild(p),u)return new Promise((h,m)=>{p.addEventListener("load",h),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return a.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return t().catch(o)})};let It=null,gs=!1;async function tn(){return It||(It=Ai(()=>import("./chart-45xamTTr.js"),[]).then(e=>{const t=e.Chart;return gs||(t.register(...e.registerables),gs=!0),t})),It}function Ci(){return["Index Number,Full Name,Class,Gender,PIN","GES-B7-0101,Kwame Mensah,B7 — JHS 1A,Male,1234","GES-B7-0102,Ama Serwaa,B7 — JHS 1A,Female,5678","GES-B7-0103,Kofi Boateng,B7 — JHS 1A,Male,","GES-B7-0104,Abena Osei,B7 — JHS 1B,Female,9012","GES-B7-0105,Yaw Appiah,B7 — JHS 1B,Male,"].join(`
`)}function Li(){const e=Ci(),t=new Blob([e],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download="classconnect_sample_roster.csv",n.click(),URL.revokeObjectURL(s)}function Ti(e){const t=e.split(/\r?\n/)[0]||"",s=(t.match(/,/g)||[]).length,n=(t.match(/;/g)||[]).length,a=(t.match(/\t/g)||[]).length;return a>s&&a>n?"	":n>s?";":","}function Ei(e){const t=Ti(e),s=e.split(/\r?\n/).map(n=>n.trim()).filter(Boolean);return s.length<1?[]:s.map(n=>{const a=[];let o=!1,i="";for(let r=0;r<n.length;r+=1){const d=n[r];d==='"'?o=!o:d===t&&!o?(a.push(i.trim().replace(/^"|"$/g,"")),i=""):i+=d}return a.push(i.trim().replace(/^"|"$/g,"")),a})}function Ce(e,t=[]){const s=e.map(n=>n.toLowerCase().replace(/[^a-z0-9]/g,""));for(const n of t){const a=n.toLowerCase().replace(/[^a-z0-9]/g,""),o=s.indexOf(a);if(o!==-1)return o}return-1}function Bi(e=""){const t=e.trim().toLowerCase();return t.startsWith("m")||t==="boy"?"Male":t.startsWith("f")||t==="girl"?"Female":"Unspecified"}function Di(){return String(Math.floor(1e3+Math.random()*9e3))}function Mi(e,t=[],s=[],n=null){var _,b,y;const a=Ei(e);if(a.length<2)return{success:!1,error:"The CSV file must contain a header row and at least one student record.",validRecords:[],warnings:[],errors:[]};const o=a[0],i=Ce(o,["fullname","name","studentname","learnername"]),r=Ce(o,["indexnumber","indexno","id","admissionno","studentid"]),d=Ce(o,["class","grade","stream","section","classstream"]),c=Ce(o,["gender","sex"]),u=Ce(o,["pin","password","code","logincode"]);if(i===-1&&r===-1)return{success:!1,error:'CSV header must include at least a "Full Name" or "Index Number" column.',validRecords:[],warnings:[],errors:[]};const l=[],p=[],h=[],m=new Set,g=new Set,v=new Map;t.forEach(I=>{v.set(I.name.toLowerCase().trim(),I.id),I.gradeLevel&&I.stream&&(v.set(`${I.gradeLevel} ${I.stream}`.toLowerCase().trim(),I.id),v.set(`${I.gradeLevel}-${I.stream}`.toLowerCase().trim(),I.id))});const f=n||((_=t[0])==null?void 0:_.id)||1;for(let I=1;I<a.length;I+=1){const w=a[I],S=i!==-1?(w[i]||"").trim():"",B=r!==-1?(w[r]||"").trim():"",P=d!==-1?(w[d]||"").trim():"",O=c!==-1?w[c]:"",E=u!==-1?(w[u]||"").trim():"";if(!S&&!B)continue;if(S.length<2&&!B){p.push(`Row ${I+1}: Student name "${S}" is too short.`);continue}let j=f,le=((b=t.find(Z=>Z.id===f))==null?void 0:b.name)||"Default Class";if(P){const Z=v.get(P.toLowerCase().trim());Z?(j=Z,le=((y=t.find(Tn=>Tn.id===Z))==null?void 0:y.name)||P):h.push(`Row ${I+1}: Class "${P}" not recognized. Assigned to ${le}.`)}let be=E,es=!1;if((!be||!/^\d{4}$/.test(be))&&(be=Di(),es=!0),B){if(m.has(B.toLowerCase())){p.push(`Row ${I+1}: Duplicate Index Number "${B}" found in CSV.`);continue}m.add(B.toLowerCase())}const ts=`${S.toLowerCase()}::${j}`;S&&g.has(ts)&&h.push(`Row ${I+1}: Student "${S}" appears multiple times in this class.`),S&&g.add(ts);const We=s.find(Z=>B&&Z.indexNumber&&Z.indexNumber.toLowerCase()===B.toLowerCase()||S&&Z.name.toLowerCase()===S.toLowerCase()&&Z.classId===j);l.push({rowNumber:I+1,name:S||B,indexNumber:B||null,classId:j,className:le,gender:Bi(O),pin:be,pinGenerated:es,status:"active",isUpdate:!!We,existingId:(We==null?void 0:We.id)||null})}return{success:l.length>0,validRecords:l,errors:p,warnings:h,summary:{totalRows:a.length-1,validCount:l.length,errorCount:p.length,warningCount:h.length,newCount:l.filter(I=>!I.isUpdate).length,updateCount:l.filter(I=>I.isUpdate).length,autoPinsGenerated:l.filter(I=>I.pinGenerated).length}}}const Ri=3e4;let x=null,De=[],pe=null,Zt=null,et=null,tt=null,Me=null,Re=null,_e=null,st=!1,xe=null,X="all",rt="";function D(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Pi(e=[]){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function Mt(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),n=String(t%60).padStart(2,"0");return`${s}:${n}`}function Xt(e){return e?new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"Not yet"}function Rt(e){var t;return((t=A.find(s=>s.id===e))==null?void 0:t.title)||`Lesson ${e}`}function Ni(e){const t={};return e.slice().sort((s,n)=>new Date(s.completedAt)-new Date(n.completedAt)).forEach(s=>{t[s.studentId]=s}),Object.values(t)}function qi(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return t.length?Math.round(Pi(t.map(s=>s.accuracy||0))*100):0}function zi(e,t,s,n,a,o){const i=new Map(e.map(c=>[c.id,c])),r=new Map(a.map(c=>[c.id,c])),d=[];return t.forEach(c=>{var p;const u=((p=i.get(c.studentId))==null?void 0:p.name)||"Unknown learner",l=c.totalQuestions>0?Math.round(c.score/c.totalQuestions*100):0;d.push({type:"Quiz",tone:l>=70?"success":l>=50?"warning":"danger",title:`${u} completed ${Rt(c.lessonId)} quiz`,meta:`${l}% score · ${c.level||"No level"} · ${Mt(c.totalTimeMs)}`,timestamp:c.completedAt})}),s.forEach(c=>{var l;const u=((l=i.get(c.studentId))==null?void 0:l.name)||"Unknown learner";d.push({type:"Progress",tone:"primary",title:`${u} completed ${Rt(c.lessonId)}`,meta:"Lesson completion saved to the local database.",timestamp:c.completedAt})}),n.forEach(c=>{var l;const u=((l=i.get(c.studentId))==null?void 0:l.name)||"Unknown learner";d.push({type:"Diagnostic",tone:"accent",title:`${u} completed the readiness diagnostic`,meta:`${qi(c)}% average readiness across sampled lessons.`,timestamp:c.completedAt})}),a.forEach(c=>{d.push({type:"Assess",tone:"accent",title:`Published ${c.title}`,meta:`${c.questions.length} questions · ${c.objectiveCoverage.length} objectives covered.`,timestamp:c.createdAt})}),o.forEach(c=>{var g,v,f,_,b;const u=((g=i.get(c.studentId))==null?void 0:g.name)||"Unknown learner",l=((v=r.get(c.assessmentId))==null?void 0:v.title)||"an assessment",p=((f=c.integrity)==null?void 0:f.label)||"Low",h=((_=c.proctor)==null?void 0:_.label)||"Low",m=((b=c.grading)==null?void 0:b.percentage)??0;d.push({type:"Submit",tone:p==="High"||h==="High"?"warning":"success",title:`${u} submitted ${l}`,meta:`${m}% score · Integrity ${p} · Proctor ${h}`,timestamp:c.completedAt})}),d.sort((c,u)=>new Date(u.timestamp)-new Date(c.timestamp)).slice(0,8)}function ji(e,t,s,n,a,o){const i=Ni(t),r={};n.slice().sort((w,S)=>new Date(S.completedAt)-new Date(w.completedAt)).forEach(w=>{r[w.studentId]||(r[w.studentId]=w)});const d=e.map(w=>{const S=t.filter(E=>E.studentId===w.id),B=s.filter(E=>E.studentId===w.id),P=r[w.id]||null,O=J({diagnostic:P,results:S,progressRecords:B});return{student:w,results:S,progressRecords:B,diagnostic:P,profile:O}}),c=e.length>0?Math.round(s.length/(e.length*A.length)*100):0,u=i.length>0?Math.round(i.reduce((w,S)=>w+S.score/S.totalQuestions,0)/i.length*100):0,l=d.filter(w=>w.profile.risk.score>=60).length,p=e.length>0?Math.round(d.filter(w=>w.diagnostic).length/e.length*100):0,h={},m={};t.forEach(w=>{h[w.lessonId]=(h[w.lessonId]||0)+w.score/w.totalQuestions,m[w.lessonId]=(m[w.lessonId]||0)+1});const g=A.map(w=>m[w.id]?Math.round(h[w.id]/m[w.id]*100):0),v={Advanced:0,Proficient:0,Developing:0,Beginner:0};i.forEach(w=>{v[w.level]!==void 0&&(v[w.level]+=1)});const f={};t.forEach(w=>{w.responses.forEach(S=>{if(S.correct)return;const B=`${S.questionId}|${S.stem}|${S.options[S.selectedIndex]}`;f[B]=(f[B]||0)+1})});const _=Object.entries(f).map(([w,S])=>{const[B,P,O]=w.split("|");return{questionId:B,stem:P,answer:O,count:S}}).sort((w,S)=>S.count-w.count).slice(0,7),b=A.map(w=>{const S=d.map(B=>{var P;return((P=B.profile.lessonProfiles.find(O=>O.lessonId===w.id))==null?void 0:P.mastery)||0});return{lessonId:w.id,title:w.title,averageMastery:S.length?Math.round(S.reduce((B,P)=>B+P,0)/S.length*100):0}}),y=d.filter(w=>w.profile.risk.score>=35).sort((w,S)=>S.profile.risk.score-w.profile.risk.score).slice(0,6),I=zi(e,t,s,n,a,o);return{students:e,results:t,progressRecords:s,diagnostics:n,assessments:a,assessmentSubmissions:o,studentProfiles:d,latestResults:i,recentActivity:I,summary:{totalStudents:e.length,averageScore:u,completionRate:c,studentsAtRisk:l,diagnosticCoverage:p,totalAssessments:a.length,totalAssessmentSubmissions:o.length},charts:{lessonLabels:A.map(w=>`Lesson ${w.id}`),lessonScoreData:g,levelCounts:v,misconceptions:_},interventionQueue:y,masterySnapshot:b}}async function sn(){const[e,t,s,n,a,o,i]=await Promise.all([te(),K(),ve(),lt(),ut(),Fe(),fe()]),r=e.map(m=>({...m,studentCount:t.filter(g=>g.classId===m.id).length})),d=X==="all"?t:t.filter(m=>String(m.classId)===String(X)),c=new Set(d.map(m=>m.id)),u=X==="all"?s:s.filter(m=>c.has(m.studentId)),l=X==="all"?n:n.filter(m=>c.has(m.studentId)),p=X==="all"?a:a.filter(m=>c.has(m.studentId)),h=X==="all"?i:i.filter(m=>c.has(m.studentId));return x=ji(d,u,l,p,o,h),x.classes=r,x.allStudents=t,x.selectedClassId=X,Zt=new Date().toISOString(),x}function Qi(e){return`
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
              <span class="activity-item__time">${Xt(t.timestamp)}</span>
            </div>
            <div class="activity-item__title">${t.title}</div>
            <div class="activity-item__meta">${t.meta}</div>
          </div>
        `).join(""):'<div class="insight-empty">Waiting for learner activity on this device.</div>'}
      </div>
    </div>
  `}function nn(e){if(!e.students.length)return`
      <div class="empty-state dashboard-empty">
        <div class="empty-state__icon">Data</div>
        <h2 class="empty-state__title">No Students in Selected View</h2>
        <p class="empty-state__text">Import a CSV roster or change your class filter to display student learning records.</p>
      </div>
    `;const t=rt.trim().toLowerCase(),s=t?e.students.filter(n=>n.name&&n.name.toLowerCase().includes(t)||n.indexNumber&&n.indexNumber.toLowerCase().includes(t)):e.students;return s.length?`
    <div class="student-table-wrap">
      <table class="student-table">
        <thead>
          <tr>
            <th>Index #</th>
            <th>Name</th>
            <th>Class / Stream</th>
            <th>Gender</th>
            <th>Lessons</th>
            <th>Quizzes</th>
            <th>Latest Score</th>
            <th>Risk</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(n=>{var u;const a=e.results.filter(l=>l.studentId===n.id).sort((l,p)=>new Date(p.completedAt)-new Date(l.completedAt)),o=a[0],i=e.progressRecords.filter(l=>l.studentId===n.id).length,r=e.studentProfiles.find(l=>l.student.id===n.id),d=r==null?void 0:r.profile.risk,c=((u=e.classes.find(l=>l.id===n.classId))==null?void 0:u.name)||"General";return`
              <tr class="student-row" data-id="${n.id}">
                <td><code style="font-size: var(--font-size-xs);">${D(n.indexNumber||`GES-B7-${n.id}`)}</code></td>
                <td class="student-table__name">${D(n.name)}</td>
                <td><span class="badge badge--neutral">${D(c)}</span></td>
                <td>${D(n.gender||"Unspecified")}</td>
                <td>${i}/${A.length}</td>
                <td>${a.length}</td>
                <td class="student-table__score">${o?`${Math.round(o.score/o.totalQuestions*100)}%`:"-"}</td>
                <td><span class="badge badge--${(d==null?void 0:d.badge)||"neutral"}">${(d==null?void 0:d.label)||"No Data"}</span></td>
                <td style="text-align: right; white-space: nowrap;" onclick="event.stopPropagation();">
                  <button class="btn btn--ghost btn--xs btn-quick-report-card" data-id="${n.id}" title="View Terminal Report Card">Report Card</button>
                  <button class="btn btn--ghost btn--xs btn-quick-reset-pin" data-id="${n.id}" title="Reset 4-digit PIN">Reset PIN</button>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `:`
      <div class="empty-state dashboard-empty">
        <h3 class="empty-state__title">No Matching Learners</h3>
        <p class="empty-state__text">No students matched "${D(rt)}". Try searching for another name or index number.</p>
      </div>
    `}function an(e){const{summary:t}=e;return`
    <div class="dashboard-header">
      <div class="dashboard-header__top">
        <div>
          <h1 class="dashboard-header__title">Class Overview</h1>
          <p class="dashboard-header__subtitle">Analytics based on learning data stored on this device.</p>
        </div>
        <div class="dashboard-header__actions">
          <div class="class-selector-box" style="display: flex; align-items: center; gap: var(--space-2);">
            <select id="class-filter-select" class="select-class" title="Filter by Class">
              <option value="all" ${e.selectedClassId==="all"?"selected":""}>All Classes (${e.classes.length})</option>
              ${e.classes.map(s=>`
                <option value="${s.id}" ${String(e.selectedClassId)===String(s.id)?"selected":""}>
                  ${D(s.name)} (${s.studentCount})
                </option>
              `).join("")}
            </select>
            <button class="btn btn--secondary btn--sm" id="btn-manage-classes">Classes</button>
          </div>
          <div class="dashboard-live-pill">
            <span class="dashboard-live-pill__dot"></span>
            Live database sync
          </div>
          <button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh Now</button>
        </div>
      </div>

      <div class="dashboard-live-bar">
        <div class="dashboard-live-bar__item"><strong>Last updated:</strong> <span id="dashboard-live-updated">${Xt(Zt)}</span></div>
        <div class="dashboard-live-bar__item" id="dashboard-live-status-text"><strong>Sync mode:</strong> Instant local updates plus a 30 second heartbeat refresh.</div>
      </div>
    </div>

    <div class="stat-grid">
      ${we("Students",t.totalStudents,"Total Students","primary",`${e.results.length} quizzes recorded`)}
      ${we("Average",`${t.averageScore}%`,"Average Score","accent","Latest quiz per student")}
      ${we("Progress",`${t.completionRate}%`,"Completion Rate","success",`${e.progressRecords.length} lesson completions logged`)}
      ${we("Support",t.studentsAtRisk,"High Risk Learners",t.studentsAtRisk>0?"danger":"success","Prediction score 60+")}
      ${we("Diagnostic",`${t.diagnosticCoverage}%`,"Diagnostic Coverage",t.diagnosticCoverage<100?"accent":"success","Students with readiness profiles")}
      ${we("Assess",t.totalAssessments,"Published Assessments",t.totalAssessments>0?"primary":"accent",`${t.totalAssessmentSubmissions} assessment submissions logged`)}
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

      ${Qi(e)}
    </div>

    <div class="student-section">
      <div class="student-section__header">
        <div>
          <h3 class="student-section__title">Student Roster</h3>
          <p class="dashboard-header__subtitle">Manage learners, view continuous assessment broadsheets, print report cards, or reset PINs.</p>
        </div>
        <div class="export-area" style="margin-top: 0; display: flex; gap: var(--space-2); flex-wrap: wrap;">
          <button class="btn btn--secondary btn--sm" id="btn-import-roster">Import Roster (CSV)</button>
          <button class="btn btn--secondary btn--sm" id="btn-print-slips">Print Login Slips</button>
          <button class="btn btn--primary btn--sm" id="btn-open-gradebook">📊 Broadsheet Gradebook</button>
          <button class="btn btn--secondary btn--sm" id="btn-open-assessment-lab">Assessment Lab</button>
          <button class="btn btn--primary btn--sm" id="btn-open-lab-monitor">Live Lab Monitor</button>
          <button class="btn btn--ghost btn--sm" id="btn-export-csv">Export CSV</button>
        </div>
      </div>

      <div class="roster-filter-bar">
        <input type="search" id="roster-search-input" class="input input--sm roster-search-input" placeholder="Search roster by name or index #..." value="${D(rt)}">
      </div>

      <div id="roster-table-container">
        ${nn(e)}
      </div>
    </div>
  `}function Te(){return!!document.getElementById("dashboard-live-root")}function on(){De.forEach(e=>e.destroy()),De=[]}function rn(e){const t=document.getElementById("btn-export-csv"),s=document.getElementById("btn-open-assessment-lab"),n=document.getElementById("btn-open-lab-monitor"),a=document.getElementById("btn-refresh-dashboard"),o=document.getElementById("class-filter-select"),i=document.getElementById("btn-manage-classes"),r=document.getElementById("btn-import-roster"),d=document.getElementById("btn-print-slips"),c=document.getElementById("roster-search-input");t&&t.addEventListener("click",async()=>{const l=await fa();Qs(l),T("Data exported successfully","success")}),s&&s.addEventListener("click",()=>{e("/assessment-lab")}),n&&n.addEventListener("click",()=>e("/lab-monitor"));const u=document.getElementById("btn-open-gradebook");u&&u.addEventListener("click",()=>{e("/gradebook")}),a&&a.addEventListener("click",()=>{U("manual")}),o&&o.addEventListener("change",l=>{X=l.target.value,U("manual")}),i&&i.addEventListener("click",()=>{Wi()}),r&&r.addEventListener("click",()=>{Ki()}),d&&d.addEventListener("click",()=>{Yi()}),c&&c.addEventListener("input",l=>{rt=l.target.value;const p=document.getElementById("roster-table-container");p&&x&&(p.innerHTML=nn(x),vs())}),vs()}function vs(){document.querySelectorAll(".student-row").forEach(e=>{e.addEventListener("click",t=>{const s=Number.parseInt(t.currentTarget.dataset.id,10);Vi(s)})}),document.querySelectorAll(".btn-quick-reset-pin").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const s=Number.parseInt(t.currentTarget.dataset.id,10);cn(s)})}),document.querySelectorAll(".btn-quick-report-card").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const s=Number.parseInt(t.currentTarget.dataset.id,10);xe&&xe(`/report-card/${s}`)})})}async function U(e="live-update"){if(!Te()){Qe();return}if(_e)return st=!0,_e;const t=document.getElementById("btn-refresh-dashboard"),s=(t==null?void 0:t.textContent)||"Refresh Now",n=document.getElementById("dashboard-live-status-text");return t&&(t.disabled=!0,t.textContent="Refreshing..."),n&&(n.innerHTML="<strong>Sync mode:</strong> Refreshing live analytics from the local database..."),_e=(async()=>{await sn();const a=document.getElementById("dashboard-live-root");if(!a)return;a.innerHTML=an(x),rn(xe),await dn();const o=document.getElementById("dashboard-live-updated");o&&(o.textContent=Xt(Zt));const i=document.getElementById("dashboard-live-status-text");if(i){const r=e==="manual"?"Manual refresh complete.":"Live sync updated after a local database change.";i.innerHTML=`<strong>Sync mode:</strong> ${r}`}})().catch(a=>{console.error(a),T("Dashboard refresh failed. Please try again.","error")}).finally(()=>{t&&(t.disabled=!1,t.textContent=s),_e=null,st&&(st=!1,U("queued"))}),_e}function Oi(){et=Un(()=>{if(!Te()){Qe();return}U("database-event")}),Me=()=>{document.visibilityState==="visible"&&Te()&&U("visibility")},Re=()=>{Te()&&U("focus")},document.addEventListener("visibilitychange",Me),window.addEventListener("focus",Re),tt=window.setInterval(()=>{if(!Te()){Qe();return}document.visibilityState==="visible"&&U("heartbeat")},Ri)}function Qe(){et&&(et(),et=null),tt&&(window.clearInterval(tt),tt=null),Me&&(document.removeEventListener("visibilitychange",Me),Me=null),Re&&(window.removeEventListener("focus",Re),Re=null),on(),pe&&(pe.destroy(),pe=null),_e=null,st=!1}async function Fi(){return await sn(),`
    ${M({title:"Teacher Dashboard",showBack:!0,showSettings:!0,showLogout:!0})}
    <div class="container view-enter dashboard-page" style="padding-top: var(--space-6);">
      <div id="dashboard-live-root">
        ${an(x)}
      </div>
    </div>
  `}function Gi(e){Qe(),xe=e,z({onBack:()=>e("/"),onSettings:Hi,onLogout:()=>{va(),e("/")}}),rn(e),dn(),Oi()}function Hi(){var o;const e=$e()||"",t=Ht()||"",s=`
    <div class="input-group" style="margin-bottom: var(--space-4);">
      <label>Google Gemini API Key</label>
      <input type="password" id="settings-api-key" class="input" value="${e}" placeholder="AIzaSy...">
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">Used for quiz explanations, diagnostic coaching, and the AI tutor. You can update this any time.</p>
    </div>
    <div class="input-group">
      <label>Teacher PIN</label>
      <input type="password" id="settings-teacher-pin" class="input input--pin" value="${t}" placeholder="0000" maxlength="4" inputmode="numeric">
    </div>

    <div class="divider" style="margin: var(--space-5) 0;"></div>

    <div>
      <h4 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-2); color: var(--text-primary);">School Backup & Disaster Recovery</h4>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-bottom: var(--space-3);">
        Export a full snapshot of classes, rosters, quiz histories, and assessments. You can restore this JSON file on any computer.
      </p>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
        <button type="button" class="btn btn--secondary btn--sm" id="btn-backup-download">Download Full Backup (.json)</button>
        <button type="button" class="btn btn--ghost btn--sm" id="btn-backup-restore">Restore from Backup File</button>
        <input type="file" id="backup-restore-file" accept=".json" style="display: none;">
      </div>
    </div>
  `;de("Dashboard Settings",s,[{label:"Cancel",variant:"btn--ghost"},{label:"Save",variant:"btn--primary",onClick:async()=>{const i=document.getElementById("settings-api-key"),r=document.getElementById("settings-teacher-pin"),d=(i==null?void 0:i.value.trim())||"",c=(r==null?void 0:r.value.trim())||"";return c&&!/^\d{4}$/.test(c)?(T("Teacher PIN must stay 4 digits.","error"),!1):(await Ps(d),c&&await Ns(c),T("Settings saved","success"),!0)}}]),(o=document.getElementById("btn-backup-download"))==null||o.addEventListener("click",async()=>{await wa(),T("School database backup downloaded.","success")});const n=document.getElementById("btn-backup-restore"),a=document.getElementById("backup-restore-file");n&&a&&(n.addEventListener("click",()=>a.click()),a.addEventListener("change",i=>{var c;const r=(c=i.target.files)==null?void 0:c[0];if(!r)return;const d=new FileReader;d.onload=async u=>{try{const l=JSON.parse(u.target.result);confirm("Are you sure you want to restore data from this backup? Any new records will be merged.")&&(await Ia(l,"merge"),T("School database restored successfully!","success"),U("manual"))}catch(l){console.error(l),T("Failed to restore backup: "+l.message,"error")}},d.readAsText(r)}))}async function cn(e){const s=((x==null?void 0:x.students)||await K()).find(o=>o.id===e);if(!s)return;const n=String(Math.floor(1e3+Math.random()*9e3)),a=`
    <p style="margin-bottom: var(--space-4);">
      Reset the secret 4-digit PIN for <strong>${D(s.name)}</strong> (Index: <code>${D(s.indexNumber||"")}</code>).
    </p>
    <div class="input-group">
      <label for="reset-pin-input">New 4-Digit PIN</label>
      <input type="password" id="reset-pin-input" class="input input--pin" value="${n}" maxlength="4" pattern="[0-9]{4}" inputmode="numeric" required>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-1);">A random 4-digit PIN has been suggested, or you can enter a custom one.</p>
    </div>
  `;de(`Reset PIN: ${s.name}`,a,[{label:"Cancel",variant:"btn--ghost"},{label:"Save PIN",variant:"btn--primary",onClick:async()=>{var i;const o=(i=document.getElementById("reset-pin-input"))==null?void 0:i.value.trim();return!o||!/^\d{4}$/.test(o)?(T("PIN must be exactly 4 digits.","error"),!1):(await ea(e,o),T(`PIN for ${s.name} updated to ${o}`,"success"),U("manual"),!0)}}])}async function Ui(e){const t=(x==null?void 0:x.students)||await K(),s=(x==null?void 0:x.classes)||await te(),n=t.find(o=>o.id===e);if(!n)return;const a=`
    <form id="form-edit-student" style="display: flex; flex-direction: column; gap: var(--space-3);">
      <div class="input-group">
        <label for="edit-student-name">Full Name</label>
        <input type="text" id="edit-student-name" class="input" value="${D(n.name)}" required>
      </div>
      <div class="input-group">
        <label for="edit-student-index">Index / Admission Number</label>
        <input type="text" id="edit-student-index" class="input" value="${D(n.indexNumber||"")}" placeholder="e.g., GES-B7-0101">
      </div>
      <div class="input-group">
        <label for="edit-student-class">Assigned Class</label>
        <select id="edit-student-class" class="input">
          ${s.map(o=>`
            <option value="${o.id}" ${o.id===n.classId?"selected":""}>${D(o.name)}</option>
          `).join("")}
        </select>
      </div>
      <div class="input-group">
        <label for="edit-student-gender">Gender</label>
        <select id="edit-student-gender" class="input">
          <option value="Male" ${n.gender==="Male"?"selected":""}>Male</option>
          <option value="Female" ${n.gender==="Female"?"selected":""}>Female</option>
          <option value="Unspecified" ${n.gender==="Unspecified"||!n.gender?"selected":""}>Unspecified</option>
        </select>
      </div>
      <div class="input-group">
        <label for="edit-student-status">Enrollment Status</label>
        <select id="edit-student-status" class="input">
          <option value="active" ${n.status==="active"||!n.status?"selected":""}>Active</option>
          <option value="transferred" ${n.status==="transferred"?"selected":""}>Transferred</option>
          <option value="graduated" ${n.status==="graduated"?"selected":""}>Graduated</option>
        </select>
      </div>
    </form>
  `;de(`Edit Student: ${n.name}`,a,[{label:"Cancel",variant:"btn--ghost"},{label:"Save Changes",variant:"btn--primary",onClick:async()=>{var u,l,p,h,m;const o=(u=document.getElementById("edit-student-name"))==null?void 0:u.value.trim(),i=(l=document.getElementById("edit-student-index"))==null?void 0:l.value.trim(),r=Number.parseInt((p=document.getElementById("edit-student-class"))==null?void 0:p.value,10),d=(h=document.getElementById("edit-student-gender"))==null?void 0:h.value,c=(m=document.getElementById("edit-student-status"))==null?void 0:m.value;return o?(await qs(e,{name:o,indexNumber:i||null,classId:r||n.classId,gender:d,status:c}),T("Student information updated.","success"),U("manual"),!0):(T("Student name is required.","error"),!1)}}])}async function Wi(){const e=await te(),t=await K(),n=`
    <div style="margin-bottom: var(--space-4);">
      <h4 style="font-size: var(--font-size-sm); margin-bottom: var(--space-2); color: var(--text-secondary);">Active Classes</h4>
      <div class="class-manage-list">
        ${e.map(o=>{const i=t.filter(r=>r.classId===o.id).length;return`
      <div class="class-manage-item">
        <div class="class-manage-item__info">
          <div class="class-manage-item__title">${D(o.name)}</div>
          <div class="class-manage-item__meta">${o.gradeLevel||"B7"} · ${o.academicYear||"2026/2027"} · ${o.term||"Term 1"} · Teacher: ${D(o.teacherName||"Not set")}</div>
        </div>
        <div>
          <span class="badge badge--primary">${i} learners</span>
        </div>
      </div>
    `}).join("")||'<div class="insight-empty">No classes registered yet.</div>'}
      </div>
    </div>

    <div class="divider"></div>

    <form id="form-create-class" style="margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
      <h4 style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary);">Create New Class</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="input-group">
          <label for="new-class-grade">Grade Level</label>
          <select id="new-class-grade" class="input">
            <option value="B7">Basic 7 (JHS 1)</option>
            <option value="B8">Basic 8 (JHS 2)</option>
            <option value="B9">Basic 9 (JHS 3)</option>
          </select>
        </div>
        <div class="input-group">
          <label for="new-class-stream">Stream / Section</label>
          <input type="text" id="new-class-stream" class="input" placeholder="e.g., 1A or Gold" required>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
        <div class="input-group">
          <label for="new-class-year">Academic Year</label>
          <input type="text" id="new-class-year" class="input" value="2026/2027">
        </div>
        <div class="input-group">
          <label for="new-class-term">Term</label>
          <select id="new-class-term" class="input">
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
      </div>
      <div class="input-group">
        <label for="new-class-teacher">Class Teacher Name</label>
        <input type="text" id="new-class-teacher" class="input" placeholder="e.g., Mr. Osei Prempeh">
      </div>
      <button type="submit" class="btn btn--primary" style="align-self: flex-start; margin-top: var(--space-2);">Create Class</button>
    </form>
  `;de("Manage School Classes",n,[{label:"Close",variant:"btn--ghost"}]);const a=document.getElementById("form-create-class");a&&a.addEventListener("submit",async o=>{var p,h,m,g,v;o.preventDefault();const i=((p=document.getElementById("new-class-grade"))==null?void 0:p.value)||"B7",r=((h=document.getElementById("new-class-stream"))==null?void 0:h.value.trim())||"A",d=((m=document.getElementById("new-class-year"))==null?void 0:m.value.trim())||"2026/2027",c=((g=document.getElementById("new-class-term"))==null?void 0:g.value)||"Term 1",u=((v=document.getElementById("new-class-teacher"))==null?void 0:v.value.trim())||"Class Teacher",l=await Vn({name:`${i} — JHS ${r}`,gradeLevel:i,stream:r,academicYear:d,term:c,teacherName:u});T(`Class "${l.name}" created successfully!`,"success"),U("manual")})}async function Ki(){var c;const e=await te(),t=await K(),n=`
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
        <p class="dashboard-header__subtitle" style="margin: 0;">Upload a CSV file to bulk import multiple students in seconds.</p>
        <button type="button" class="btn btn--ghost btn--xs" id="btn-download-sample-csv">Download Sample CSV</button>
      </div>

      <div class="input-group" style="margin-bottom: var(--space-4);">
        <label for="import-default-class">Assign to Class (if unspecified in CSV)</label>
        <select id="import-default-class" class="input">
          ${e.map(u=>`
    <option value="${u.id}">${D(u.name)}</option>
  `).join("")}
        </select>
      </div>

      <div class="import-dropzone" id="import-dropzone">
        <div class="import-dropzone__icon">📄</div>
        <div class="import-dropzone__title">Click or drag & drop student CSV roster here</div>
        <div class="import-dropzone__subtitle">Supports UTF-8 CSV with Index Number, Full Name, Class, Gender, PIN</div>
        <input type="file" id="import-file-input" accept=".csv,.txt" style="display: none;">
      </div>

      <div id="import-preview-area" style="display: none;">
        <div class="import-summary-bar" id="import-summary-bar"></div>
        <div class="import-preview-wrap">
          <table class="student-table" style="font-size: var(--font-size-xs);">
            <thead>
              <tr>
                <th>Row</th>
                <th>Index #</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Assigned PIN</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="import-preview-body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;let a=null;de("Bulk Import Student Roster",n,[{label:"Cancel",variant:"btn--ghost"},{label:"Commit & Import Roster",variant:"btn--primary",onClick:async()=>{if(!a||!a.validRecords.length)return T("Please choose a valid CSV file first.","error"),!1;const u=await ta(a.validRecords);return T(`Import complete! Created ${u.created.length} new student(s) and updated ${u.updated.length}.`,"success"),U("manual"),!0}}],{modalClass:"modal--wide"}),(c=document.getElementById("btn-download-sample-csv"))==null||c.addEventListener("click",()=>{Li(),T("Sample roster CSV downloaded.","info")});const o=document.getElementById("import-dropzone"),i=document.getElementById("import-file-input");o&&i&&(o.addEventListener("click",()=>i.click()),o.addEventListener("dragover",u=>{u.preventDefault(),o.classList.add("import-dropzone--active")}),o.addEventListener("dragleave",()=>o.classList.remove("import-dropzone--active")),o.addEventListener("drop",u=>{var p;u.preventDefault(),o.classList.remove("import-dropzone--active");const l=(p=u.dataTransfer.files)==null?void 0:p[0];l&&r(l)}),i.addEventListener("change",u=>{var p;const l=(p=u.target.files)==null?void 0:p[0];l&&r(l)}));function r(u){const l=new FileReader;l.onload=p=>{var g,v;const h=(g=p.target)==null?void 0:g.result;if(typeof h!="string")return;const m=Number.parseInt((v=document.getElementById("import-default-class"))==null?void 0:v.value,10)||null;a=Mi(h,e,t,m),d(a)},l.readAsText(u)}function d(u){const l=document.getElementById("import-preview-area"),p=document.getElementById("import-summary-bar"),h=document.getElementById("import-preview-body");if(!u.success){T(u.error||"Unable to parse CSV file.","error");return}l.style.display="block",p.innerHTML=`
      <div><strong>Total rows:</strong> ${u.summary.totalRows}</div>
      <div style="color: var(--color-success-400);"><strong>New learners:</strong> ${u.summary.newCount}</div>
      <div style="color: var(--color-accent-400);"><strong>Updates:</strong> ${u.summary.updateCount}</div>
      <div style="color: var(--color-warning-400);"><strong>Auto-PINs:</strong> ${u.summary.autoPinsGenerated}</div>
      ${u.summary.errorCount?`<div style="color: var(--color-danger-400);"><strong>Errors skipped:</strong> ${u.summary.errorCount}</div>`:""}
    `,h.innerHTML=u.validRecords.map(m=>`
      <tr>
        <td>${m.rowNumber}</td>
        <td><code>${D(m.indexNumber||"Auto")}</code></td>
        <td style="font-weight: var(--font-weight-semibold);">${D(m.name)}</td>
        <td>${D(m.className)}</td>
        <td>${m.gender}</td>
        <td><span style="font-family: monospace; font-weight: bold;">${m.pin}</span> ${m.pinGenerated?'<small style="color: var(--color-warning-400);">(auto)</small>':""}</td>
        <td><span class="badge badge--${m.isUpdate?"warning":"success"}">${m.isUpdate?"Update":"Create"}</span></td>
      </tr>
    `).join("")}}async function Yi(){var d;const e=await te(),t=await K(),s=X!=="all"?Number.parseInt(X,10):(d=e[0])==null?void 0:d.id,n=`
    <div class="no-print" style="margin-bottom: var(--space-4);">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <label for="print-class-select" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);">Filter Class:</label>
          <select id="print-class-select" class="input input--sm">
            <option value="all">All Classes (${t.length} students)</option>
            ${e.map(c=>`
              <option value="${c.id}" ${c.id===s?"selected":""}>
                ${D(c.name)} (${t.filter(u=>u.classId===c.id).length} students)
              </option>
            `).join("")}
          </select>
        </div>
        <button type="button" class="btn btn--primary btn--sm" id="btn-trigger-print">🖨️ Print All Cards</button>
      </div>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-2);">
        Formatted for standard A4 printing (8 cards per page). Cut and distribute to learners for secure lab logins.
      </p>
    </div>

    <div class="print-slips-modal-content">
      <div class="print-slips-container" id="slips-container">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;de("Print Student Login Slips",n,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"});const a=document.getElementById("slips-container"),o=document.getElementById("print-class-select"),i=document.getElementById("btn-trigger-print");function r(c){const u=c==="all"?t:t.filter(l=>String(l.classId)===String(c));if(!u.length){a.innerHTML='<div class="insight-empty no-print">No students found in this class.</div>';return}a.innerHTML=u.map(l=>{const p=e.find(m=>m.id===l.classId),h=p?p.name:"JHS Computing";return`
        <div class="slip-card">
          <div class="slip-card__header">
            <div class="slip-card__school">ClassConnect — Lab Pass</div>
            <div class="slip-card__app">GES CCP B7</div>
          </div>
          <div class="slip-card__name">${D(l.name)}</div>
          <div class="slip-card__meta">
            <span><strong>Index:</strong> ${D(l.indexNumber||`GES-B7-${l.id}`)}</span>
            <span><strong>Class:</strong> ${D(h)}</span>
          </div>
          <div class="slip-card__pin-box">
            <span class="slip-card__pin-label">Your 4-Digit Login PIN:</span>
            <span class="slip-card__pin-value">${l.pin}</span>
          </div>
          <div class="slip-card__footer">
            Keep this PIN secret. Login at http://localhost:5173/student-login
          </div>
        </div>
      `}).join("")}r(s),o==null||o.addEventListener("change",c=>{r(c.target.value)}),i==null||i.addEventListener("click",()=>{window.print()})}async function Vi(e){var g,v,f,_,b;const t=(x==null?void 0:x.students)||await K(),s=(x==null?void 0:x.classes)||await te(),n=(x==null?void 0:x.results)||await ve(),a=(x==null?void 0:x.progressRecords)||await lt(),o=(x==null?void 0:x.diagnostics)||await ut(),i=t.find(y=>y.id===e);if(!i)return;const r=s.find(y=>y.id===i.classId),d=n.filter(y=>y.studentId===e).sort((y,I)=>new Date(y.completedAt)-new Date(I.completedAt)),c=o.filter(y=>y.studentId===e).sort((y,I)=>new Date(I.completedAt)-new Date(y.completedAt))[0]||null,u=J({diagnostic:c,results:d,progressRecords:a.filter(y=>y.studentId===e)}),l=d.at(-1),p=d.length>0?Math.round(d.reduce((y,I)=>y+I.score/I.totalQuestions,0)/d.length*100):0;a.filter(y=>y.studentId===e).length,d.flatMap(y=>y.responses.map(I=>({...I,lessonId:y.lessonId,completedAt:y.completedAt}))).sort((y,I)=>new Date(I.answeredAt||I.completedAt)-new Date(y.answeredAt||y.completedAt));const m=`
    <div class="student-detail">
      <div class="student-detail__header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3);">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div class="student-detail__avatar">${i.name.slice(0,2).toUpperCase()}</div>
          <div>
            <div class="student-detail__name">${D(i.name)}</div>
            <div class="dashboard-header__subtitle">
              Index: <code>${D(i.indexNumber||`GES-B7-${i.id}`)}</code> · Class: <strong>${D(r?r.name:"General")}</strong> · Gender: ${D(i.gender||"Unspecified")}
            </div>
            <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
              <button class="btn btn--primary btn--xs" id="btn-modal-report-card">Terminal Report Card</button>
              <button class="btn btn--secondary btn--xs" id="btn-modal-reset-pin">Reset PIN</button>
              <button class="btn btn--ghost btn--xs" id="btn-modal-edit-student">Edit / Transfer</button>
            </div>
          </div>
        </div>
      </div>

      <div class="student-detail__stats">
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${d.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${p}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${l?l.level:"-"}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${l?Mt(l.averageTimeMs):"00:00"}</div>
          <div class="student-detail__stat-label">Avg Question Time</div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-bottom: var(--space-4);">
        <h4 class="student-detail__history-title">Personalization Snapshot</h4>
        <div class="student-detail__snapshot">
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${u.readiness.tone}">${u.readiness.label}</span>
            <div class="student-detail__snapshot-text">${c?`Diagnostic completed on ${new Date(c.completedAt).toLocaleDateString()}`:"Diagnostic not completed yet."}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${u.risk.badge}">Risk ${u.risk.score}</span>
            <div class="student-detail__snapshot-text">${u.risk.action}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--primary">Next Focus</span>
            <div class="student-detail__snapshot-text">${((g=u.recommendedNext)==null?void 0:g.title)||"Lesson 1"} - ${((v=u.recommendedNext)==null?void 0:v.recommendedFocus)||"Continue the learning path."}</div>
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
            ${d.length>0?d.slice().reverse().map(y=>`
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${y.lessonId}: ${Rt(y.lessonId)}</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${new Date(y.completedAt).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: var(--font-weight-bold); color: ${y.score/y.totalQuestions>=.7?"var(--color-success-400)":"var(--color-warning-400)"};">${Math.round(y.score/y.totalQuestions*100)}%</div>
                  <div style="font-size: var(--font-size-xs); color: var(--text-muted);">theta ${y.theta.toFixed(2)}</div>
                </div>
              </div>
            `).join(""):'<div style="padding: var(--space-4); text-align: center; color: var(--text-muted); font-size: var(--font-size-sm);">No quizzes taken yet.</div>'}
          </div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-top: var(--space-6);">
        <h4 class="student-detail__history-title">Question Breakdown (Latest Quiz)</h4>
        <div class="student-detail__table-wrap">
          <table class="student-detail__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Concept</th>
                <th>Result</th>
                <th>Time</th>
                <th>Ability (theta)</th>
              </tr>
            </thead>
            <tbody>
              ${l&&l.responses?l.responses.map((y,I)=>`
                <tr>
                  <td>${I+1}</td>
                  <td>${D(y.concept||"General")}</td>
                  <td><span class="badge badge--${y.correct?"success":"danger"}">${y.correct?"Correct":"Review"}</span></td>
                  <td>${Mt(y.elapsedMs)}</td>
                  <td>${y.thetaAfter}</td>
                </tr>
              `).join(""):'<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;de("Student Profile",m,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),(f=document.getElementById("btn-modal-report-card"))==null||f.addEventListener("click",()=>{var y;(y=document.querySelector(".modal-backdrop"))==null||y.remove(),xe&&xe(`/report-card/${e}`)}),(_=document.getElementById("btn-modal-reset-pin"))==null||_.addEventListener("click",()=>{cn(e)}),(b=document.getElementById("btn-modal-edit-student"))==null||b.addEventListener("click",()=>{Ui(e)}),d.length>0&&setTimeout(()=>{Ji(d)},0)}async function dn(){if(!x)return;on();const e=await tn();e.defaults.color="#94A3B8",e.defaults.borderColor="rgba(148, 163, 184, 0.1)";const t=document.getElementById("chart-scores");t&&De.push(new e(t,{type:"bar",data:{labels:x.charts.lessonLabels,datasets:[{label:"Average Score (%)",data:x.charts.lessonScoreData,backgroundColor:"rgba(99, 102, 241, 0.8)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100}}}}));const s=document.getElementById("chart-levels");s&&De.push(new e(s,{type:"doughnut",data:{labels:Object.keys(x.charts.levelCounts),datasets:[{data:Object.values(x.charts.levelCounts),backgroundColor:["#34D399","#818CF8","#FBBF24","#FB7185"],borderWidth:0,cutout:"70%"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right"}}}}));const n=document.getElementById("chart-misconceptions");if(n){const a=x.charts.misconceptions.map(i=>i.stem),o=x.charts.misconceptions.map(i=>i.count);De.push(new e(n,{type:"bar",data:{labels:a,datasets:[{label:"Times missed",data:o,backgroundColor:"rgba(244, 63, 94, 0.75)",borderRadius:6}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{tooltip:{callbacks:{label(i){const r=x.charts.misconceptions[i.dataIndex];return`${i.raw} misses - common wrong answer: ${r.answer}`}}}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{ticks:{callback(i,r){return`Q${r+1}`}}}}}}))}}async function Ji(e){const t=document.getElementById("student-theta-chart");if(!t)return;const s=await tn();pe&&(pe.destroy(),pe=null);const n=e.map(o=>`L${o.lessonId}`),a=e.map(o=>o.theta);pe=new s(t,{type:"line",data:{labels:n,datasets:[{label:"Theta",data:a,borderColor:"#818CF8",backgroundColor:"rgba(129, 140, 248, 0.15)",fill:!0,tension:.35,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{min:-3,max:3}},plugins:{legend:{display:!1}}}})}function Zi(){return new Map(A.map(e=>{const t=it.filter(s=>s.lessonId===e.id).sort((s,n)=>{const a=Math.abs(s.difficulty)-Math.abs(n.difficulty);return a!==0?a:n.discrimination-s.discrimination});return[e.id,t]}))}function Xi(e,t){return e>=.75&&t===0?"Ready to Accelerate":e>=.5?"Foundations Growing":"Needs Guided Support"}function fs(e){return A.map(t=>{const s=e.get(t.id)||[],n=s.filter(i=>i.correct).length,a=s.length,o=a>0?n/a:0;return{lessonId:t.id,lessonTitle:t.title,correct:n,attempted:a,accuracy:o}})}function eo(){const e=Zi(),t=A.map(g=>{var v;return(v=e.get(g.id))==null?void 0:v[0]}).filter(Boolean),s=new Map(A.map(g=>[g.id,(e.get(g.id)||[]).slice(1)])),n=new Set,a=[];let o=0,i=null,r=[],d=!1,c=!1;function u(){const g=new Map;for(const f of a){const _=g.get(f.lessonId)||[];_.push(f),g.set(f.lessonId,_)}r=fs(g).sort((f,_)=>f.accuracy!==_.accuracy?f.accuracy-_.accuracy:f.lessonId-_.lessonId).slice(0,3).map(f=>(s.get(f.lessonId)||[]).find(b=>!n.has(b.id))||null).filter(Boolean),d=!0}function l(){if(c)return null;let g=null;if(t.length>0?g=t.shift():(d||u(),g=r.shift()||null),!g)return c=!0,null;n.add(g.id),i=g,o+=1;const v=A.find(f=>f.id===g.lessonId);return{question:g,questionNumber:o,totalQuestions:8,lessonId:g.lessonId,lessonTitle:(v==null?void 0:v.title)||`Lesson ${g.lessonId}`,phase:o<=5?"coverage":"follow-up"}}function p(g){if(!i)return null;const v=g===i.correctIndex,f={questionId:i.id,lessonId:i.lessonId,stem:i.stem,options:i.options,selectedIndex:g,correctIndex:i.correctIndex,correct:v};return a.push(f),i=null,{correct:v,correctIndex:f.correctIndex}}function h(){const g=new Map;for(const w of a){const S=g.get(w.lessonId)||[];S.push(w),g.set(w.lessonId,S)}const v=fs(g),f=v.filter(w=>w.accuracy<.5),_=v.filter(w=>w.accuracy>=.75),b=a.filter(w=>w.correct).length,y=a.length,I=y>0?b/y:0;return{score:b,totalQuestions:y,readiness:Xi(I,f.length),generationMethod:"adaptive diagnostic",lessonBreakdown:v,knowledgeGaps:f,strengths:_,responses:a}}function m(){return c}return{next:l,answer:p,getResults:h,isFinished:m}}let re=null,G=null,Oe=!1;function to(){re=eo(),G=re.next(),Oe=!1}function so(){(!re||!G)&&to()}function ln(){re=null,G=null,Oe=!1}function no(){if(!re||!G)return'<div class="container">Error loading diagnostic assessment.</div>';const e=R();return`
    ${M({title:"Diagnostic Assessment",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter diagnostic-page" style="padding-top: var(--space-6);">
      <div class="card card--glass diagnostic-hero">
        <div class="diagnostic-hero__eyebrow">AI-guided readiness check</div>
        <h1 class="diagnostic-hero__title">Let us map your starting point</h1>
        <p class="diagnostic-hero__text">This short pre-assessment samples all five lessons, then follows up on the topics that need the most attention.</p>
        <div class="diagnostic-hero__meta">
          <span class="badge badge--neutral">8 questions max</span>
          <span class="badge badge--accent">${G.phase==="coverage"?"Checking broad coverage":"Following up on weak areas"}</span>
          <span class="badge badge--primary">${G.lessonTitle}</span>
        </div>
      </div>

      <div class="diagnostic-stage">
        <div class="diagnostic-stage__header">
          <div>
            <div class="diagnostic-stage__label">Question ${G.questionNumber}</div>
            <h2 class="diagnostic-stage__title">${G.lessonTitle}</h2>
          </div>
          <span class="badge badge--neutral">${G.phase==="coverage"?"Coverage pass":"Adaptive follow-up"}</span>
        </div>

        ${Ge(G.questionNumber-1,G.totalQuestions,"Diagnostic progress")}

        <div id="diagnostic-question-wrap">
          ${Hs(G.question)}
        </div>
      </div>
    </div>
  `}function ao(e,t){z({onBack:()=>e("/lessons")}),document.querySelectorAll(".option-btn").forEach(s=>{s.addEventListener("click",async n=>{if(Oe)return;Oe=!0;const a=Number.parseInt(n.currentTarget.dataset.index,10);await io(a,n.currentTarget,e,t)})})}async function io(e,t,s,n){const a=re.answer(e);if(document.querySelectorAll(".option-btn").forEach(r=>{r.classList.add("option-btn--disabled"),r.disabled=!0}),a.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const r=document.getElementById(`option-${a.correctIndex}`);r&&r.classList.add("option-btn--highlight-correct")}await new Promise(r=>setTimeout(r,500));const i=re.next();if(!i){await oo(s);return}G=i,Oe=!1,await n()}async function oo(e){const t=R(),s=re.getResults();if(!t){e("/student-login");return}const n=await ia({studentId:t.id,...s});ln(),e(`/diagnostic-results/${n.id}`)}const ro="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function co(e){const t=e.objectives.slice(0,2).join("; "),s=(e.keyTerms||[]).slice(0,3).map(n=>`${n.word}: ${n.definition}`).join("; ");return`${e.title}. Objectives: ${t}. Key terms: ${s}`}function un(e){var o;const t=e.knowledgeGaps.map(i=>i.title).join(", ")||"none identified",s=e.strengths.map(i=>i.title).join(", ")||"still emerging",n=((o=e.recommendedNext)==null?void 0:o.title)||"Lesson 1",a=e.revisionQueue.map(i=>`${i.title} (${i.reason})`).join("; ")||"none";return[`Readiness: ${e.readiness.label}.`,`Completion rate: ${e.completionRate}%.`,`Knowledge gaps: ${t}.`,`Strengths: ${s}.`,`Recommended next lesson: ${n}.`,`Revision queue: ${a}.`].join(" ")}function lo(e){const t=e.toLowerCase();return A.find(s=>t.includes(s.title.toLowerCase())?!0:(s.keyTerms||[]).some(n=>t.includes(n.word.toLowerCase())))||null}function uo(e){var n,a,o;const t=((n=e.strengths[0])==null?void 0:n.title)||"your earliest lessons",s=((a=e.knowledgeGaps[0])==null?void 0:a.title)||((o=e.recommendedNext)==null?void 0:o.title)||"the next lesson";return`You are showing the most confidence in ${t}. Focus next on ${s}, then use the AI Tutor to clear up anything that still feels confusing. Small, steady review sessions will move your readiness up quickly.`}function po(e,t){var i,r;const s=lo(e),n=t.knowledgeGaps[0],a=t.recommendedNext,o=e.toLowerCase();if(o.includes("next")||o.includes("study")||o.includes("path"))return`Your best next step is ${(a==null?void 0:a.title)||"the next lesson in your path"}. It is recommended because ${n?`${n.title} still needs review`:"it keeps your momentum going"}. After that, revisit one item from your revision queue before taking the quiz.`;if(s){const d=(i=s.keyTerms)==null?void 0:i[0],c=(r=s.objectives)==null?void 0:r[0];return`${s.title} is mainly about ${(c==null?void 0:c.toLowerCase())||"this topic area"}. Start with this idea: ${d?`${d.word} means ${d.definition}`:"focus on the core lesson objective first"}. Then compare it with your own words and try one practice question before moving on.`}return o.includes("struggling")||o.includes("stuck")||o.includes("hard")?`It looks like ${(n==null?void 0:n.title)||"one of your current topics"} needs a slower, more guided review. Break it into two parts: reread the lesson objectives first, then ask me one specific question about a term or idea that is still unclear.`:`I remember your current path is strongest when we keep things focused. Start with ${(a==null?void 0:a.title)||"your next recommended lesson"}, and if a concept feels confusing, ask me about one term or one example at a time so we can unpack it together.`}async function pn(e){var s,n,a,o,i,r;const t=$e();if(!t||!navigator.onLine)return null;try{const d=await fetch(`${ro}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.6,maxOutputTokens:300,topP:.9}}),signal:AbortSignal.timeout(12e3)});if(!d.ok)return null;const c=await d.json();return((r=(i=(o=(a=(n=(s=c==null?void 0:c.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:a.parts)==null?void 0:o[0])==null?void 0:i.text)==null?void 0:r.trim())||null}catch{return null}}async function mo(e,t,s){const n=["You are a warm, concise learning coach for Basic 7 Computing.",`Student: ${e.name}.`,`Diagnostic readiness: ${t.readiness}.`,un(s),"Write exactly 3 supportive sentences for the student.","Sentence 1: celebrate one strength.","Sentence 2: explain the most important gap to focus on next.","Sentence 3: give a short action plan using the tutor and the next lesson."].join(`
`),a=await pn(n);return{text:a||uo(s),source:a?"ai":"fallback"}}async function ho({student:e,message:t,history:s=[],profile:n}){const a=A.map(co).join(`
`),o=s.slice(-8).map(d=>`${d.role}: ${d.content}`).join(`
`),i=["You are ClassConnect Tutor, a supportive Basic 7 Computing tutor.",`Student: ${e.name}.`,un(n),"Use the profile and memory below. Keep answers clear, age-appropriate, and practical.","If the learner asks what to study next, recommend the personalized path.","If the learner asks about a concept, explain it simply and connect it to one lesson.","Respond in 2 short paragraphs maximum.","Lesson references:",a,"Conversation memory:",o||"No prior messages yet.",`Student message: ${t}`].join(`
`),r=await pn(i);return{text:r||po(t,n),source:r?"ai":"fallback"}}function bs(e,t,s){return e.length?e.map(n=>`
    <div class="insight-pill insight-pill--${s}">
      <div class="insight-pill__title">${n.lessonTitle||n.title}</div>
      <div class="insight-pill__meta">${n.accuracy!==void 0?`${Math.round(n.accuracy*100)}% diagnostic accuracy`:n.recommendedFocus||"Ready for the next step"}</div>
    </div>
  `).join(""):`<div class="insight-empty">${t}</div>`}async function go(e){var d;const t=R(),s=await zs(Number.parseInt(e,10));if(!t||!s||s.studentId!==t.id)return'<div class="container" style="padding: 2rem;">Diagnostic result not found.</div>';const n=await se(t.id),a=await V(t.id),o=await ge(t.id),i=J({diagnostic:n,results:o,progressRecords:a}),r=s.totalQuestions>0?Math.round(s.score/s.totalQuestions*100):0;return`
    ${M({title:"Diagnostic Results",showBack:!0,studentName:t.name})}
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
            ${bs(s.knowledgeGaps,"No urgent gaps were detected in the diagnostic.","warning")}
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Current Strengths</h3>
          <div class="insight-pill-list">
            ${bs(s.strengths,"Your strengths will appear here as you build more evidence.","success")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="diagnostic-section__title">Adaptive Content Path</h3>
        <p class="diagnostic-section__subtitle">These lessons are now prioritized using your diagnostic, lesson completion, and quiz evidence.</p>
        <div class="path-preview">
          ${i.recommendedSequence.slice(0,4).map((c,u)=>`
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
  `}function vo(e,t){z({onBack:()=>e("/lessons")});const s=document.getElementById("btn-open-path"),n=document.getElementById("btn-open-tutor"),a=document.getElementById("btn-retake-diagnostic");zs(Number.parseInt(t,10)).then(async o=>{const i=R();if(!i||!o)return;const r=await se(i.id),d=await V(i.id),c=await ge(i.id),u=J({diagnostic:r,results:c,progressRecords:d});s&&s.addEventListener("click",()=>{var m;e(`/lesson/${((m=u.recommendedNext)==null?void 0:m.lessonId)||1}`)}),n&&n.addEventListener("click",()=>{e("/tutor")}),a&&a.addEventListener("click",()=>{e("/diagnostic")}),document.querySelectorAll(".path-preview__item").forEach(m=>{m.addEventListener("click",g=>{const v=Number.parseInt(g.currentTarget.dataset.lessonId,10);e(`/lesson/${v}`)})});const l=await mo(i,o,u),p=document.getElementById("diagnostic-insight"),h=document.getElementById("diagnostic-insight-source");p&&(p.textContent=l.text),h&&(h.textContent=l.source==="ai"?"AI generated":"Offline-ready insight",h.className=`badge ${l.source==="ai"?"badge--primary":"badge--neutral"}`)})}const fo=["What should I study next?","Explain RAM and storage in simple words.","Help me review my weakest topic."];let q={studentId:null,messages:[],sending:!1};function bo(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function yo(e){if(q.studentId===e)return;const t=await ra(e);q={studentId:e,messages:(t==null?void 0:t.messages)||[],sending:!1}}function wo(){return q.messages.length?q.messages.map(e=>`
    <div class="chat-bubble chat-bubble--${e.role}">
      <div class="chat-bubble__role">${e.role==="assistant"?"AI Tutor":"You"}</div>
      <div class="chat-bubble__text">${bo(e.content)}</div>
      ${e.source?`<div class="chat-bubble__meta">${e.source==="ai"?"AI response":"Offline support response"}</div>`:""}
    </div>
  `).join(""):`
      <div class="tutor-empty">
        <div class="tutor-empty__title">Your tutor is ready</div>
        <p class="tutor-empty__text">Ask for an explanation, revision tip, or what to study next. The tutor will answer using your lesson history and diagnostic profile.</p>
      </div>
    `}async function Io(){var o,i,r,d;const e=R();if(!e)return'<div class="container" style="padding: 2rem;">Student session not found.</div>';await yo(e.id);const t=await se(e.id),s=await V(e.id),n=await ge(e.id),a=J({diagnostic:t,results:n,progressRecords:s});return`
    ${M({title:"AI Tutor",showBack:!0,studentName:e.name})}
    <div class="container container--narrow view-enter tutor-page">
      <div class="card card--glass tutor-hero">
        <div class="tutor-hero__header">
          <div>
            <div class="diagnostic-hero__eyebrow">Context-aware tutor with memory</div>
            <h1 class="tutor-hero__title">Ask for help at your own pace</h1>
          </div>
          ${q.messages.length?'<button class="btn btn--ghost btn--sm" id="btn-clear-chat">Clear chat</button>':""}
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
          ${wo()}
          ${q.sending?'<div class="chat-bubble chat-bubble--assistant"><div class="chat-bubble__role">AI Tutor</div><div class="shimmer" style="height: 52px;"></div></div>':""}
        </div>

        <div class="tutor-prompts">
          ${fo.map(c=>`
            <button class="tutor-prompt" data-prompt="${c}">${c}</button>
          `).join("")}
        </div>

        <form class="tutor-composer" id="tutor-form">
          <textarea id="tutor-input" class="input tutor-composer__input" rows="3" placeholder="Ask a question about a lesson, concept, or what to study next..." ${q.sending?"disabled":""}></textarea>
          <button class="btn btn--primary" type="submit" ${q.sending?"disabled":""}>Send</button>
        </form>
      </div>
    </div>
  `}function _o(e,t){z({onBack:()=>e("/lessons")});const s=document.getElementById("tutor-form"),n=document.getElementById("tutor-input"),a=document.getElementById("btn-clear-chat"),o=document.getElementById("tutor-thread");o&&(o.scrollTop=o.scrollHeight),a&&a.addEventListener("click",async()=>{const i=R();i&&(await ca(i.id),q={studentId:i.id,messages:[],sending:!1},await t())}),document.querySelectorAll(".tutor-prompt").forEach(i=>{i.addEventListener("click",async r=>{const d=r.currentTarget.dataset.prompt;d&&await ys(d,t)})}),s&&n&&s.addEventListener("submit",async i=>{i.preventDefault();const r=n.value.trim();if(!r){T("Type a question for the tutor first.","error");return}await ys(r,t)})}async function ys(e,t){const s=R();if(!s||q.sending)return;const n=await se(s.id),a=await V(s.id),o=await ge(s.id),i=J({diagnostic:n,results:o,progressRecords:a}),r={role:"user",content:e,createdAt:new Date().toISOString()};q={...q,sending:!0,messages:[...q.messages,r]},await rs(s.id,q.messages),await t();const d=await ho({student:s,message:e,history:q.messages,profile:i});q={...q,sending:!1,messages:[...q.messages,{role:"assistant",content:d.text,source:d.source,createdAt:new Date().toISOString()}]},await rs(s.id,q.messages),await t()}const So="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",ws={1:{prompt:"Write a JavaScript function named `isPortableComputer(type)` that returns `true` for portable computers like a laptop, tablet, or smartphone, and `false` for a desktop or server.",starterCode:`function isPortableComputer(type) {
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
`}};function mn(e=""){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function _t(e,t){const s=e.slice(),n=[];for(;s.length>0&&n.length<t;)n.push(s.shift());return n}function Pt(e){const t=A.filter(s=>e.includes(s.id));return t.length>0?t:A.slice(0,2)}function ko(e=""){const t=e.match(/```json\s*([\s\S]*?)```/i);if(t!=null&&t[1])return t[1].trim();const s=e.indexOf("{"),n=e.lastIndexOf("}");return s>=0&&n>s?e.slice(s,n+1):e}function xo(e,t,s){const n=["mcq","short","code"].includes(e.type)?e.type:"short",a=s.includes(e.lessonId)?e.lessonId:s[0],o=Number.isFinite(e.maxScore)?e.maxScore:n==="mcq"?1:5,i=Array.isArray(e.rubric)&&e.rubric.length>0?e.rubric.map(r=>({criterion:r.criterion||"Quality",description:r.description||"Addresses the prompt clearly.",points:Number.isFinite(r.points)?r.points:2,keywords:Array.isArray(r.keywords)?r.keywords:[]})):[{criterion:"Accuracy",description:"Uses correct subject knowledge.",points:o,keywords:[]}];return{id:`GEN-Q${t+1}`,type:n,lessonId:a,objective:e.objective||"Generated from lesson objectives",prompt:e.prompt||e.stem||`Generated question ${t+1}`,options:n==="mcq"&&Array.isArray(e.options)&&e.options.length===4?e.options:void 0,correctIndex:n==="mcq"&&Number.isInteger(e.correctIndex)?e.correctIndex:void 0,starterCode:n==="code"?e.starterCode||"":void 0,answerKey:e.answerKey||"",sampleSolution:e.sampleSolution||"",rubric:i,maxScore:o}}function $o(e,t,s){const n=(e.keyTerms||[]).slice(0,3),a=n.map(i=>i.word.toLowerCase()),o=`In 3-5 sentences, ${t.charAt(0).toLowerCase()}${t.slice(1)}. Use at least one correct computing term from this lesson.`;return{id:`SA-Q${s+1}`,type:"short",lessonId:e.id,objective:t,prompt:o,answerKey:n.map(i=>`${i.word}: ${i.definition}`).join(" "),rubric:[{criterion:"Concept accuracy",description:"The response explains the idea correctly.",points:3,keywords:a},{criterion:"Use of subject vocabulary",description:"The response uses at least one correct computing term.",points:1,keywords:a},{criterion:"Clarity",description:"The response is easy to follow and stays on task.",points:1,keywords:[]}],maxScore:5}}function Ao(e,t,s){const n=ws[e.id]||ws[5];return{id:`CODE-Q${s+1}`,type:"code",lessonId:e.id,objective:t,prompt:`${n.prompt}

Learning objective: ${t}`,starterCode:n.starterCode,answerKey:n.sampleSolution,sampleSolution:n.sampleSolution,rubric:[{criterion:"Correct logic",description:"The code follows the expected rule from the lesson.",points:3,keywords:n.keyConcepts},{criterion:"Programming structure",description:"The answer uses a function, return value, and clear condition or lookup.",points:2,keywords:["function","return"]}],maxScore:5}}function Co(e,t){return{id:`MCQ-Q${t+1}`,type:"mcq",lessonId:e.lessonId,objective:"Check core understanding of the lesson objective.",prompt:e.stem,options:e.options,correctIndex:e.correctIndex,answerKey:e.options[e.correctIndex],rubric:[{criterion:"Correct answer",description:"Selects the correct option.",points:1,keywords:[]}],maxScore:1}}function Lo(e){const t=Pt(e.lessonIds),s=t.flatMap(h=>h.objectives.map(m=>({lesson:h,objective:m}))),n=s.length>0?s:A.slice(0,1).flatMap(h=>h.objectives.map(m=>({lesson:h,objective:m}))),a=n.map(h=>({lessonId:h.lesson.id,lessonTitle:h.lesson.title,objective:h.objective})),o=it.filter(h=>e.lessonIds.includes(h.lessonId)).sort((h,m)=>m.discrimination-h.discrimination||h.difficulty-m.difficulty),i=_t(n,e.shortAnswerCount||0),r=_t(n.slice().reverse(),e.codingCount||0),d=_t(o,e.mcqCount||0).map(Co),c=i.map((h,m)=>$o(h.lesson,h.objective,m)),u=r.map((h,m)=>Ao(h.lesson,h.objective,m)),l=[...d,...c,...u].map((h,m)=>({...h,id:`${mn(e.title||"assessment")}-q${m+1}`})),p=l.length;return{title:e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"fallback",published:!0,lessonIds:t.map(h=>h.id),objectiveCoverage:a,durationMinutes:e.durationMinutes||Math.max(15,p*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:l}}async function To(e){var o,i,r,d,c;const t=$e();if(!t||!navigator.onLine)return null;const n=Pt(e.lessonIds).map(u=>[`Lesson ${u.id}: ${u.title}`,`Objectives: ${u.objectives.join("; ")}`,`Key terms: ${(u.keyTerms||[]).map(l=>`${l.word}=${l.definition}`).join("; ")}`].join(`
`)).join(`

`),a=["You are building a classroom assessment for Basic 7 Computing.","Return valid JSON only.",`Title: ${e.title}`,`Question counts: ${e.mcqCount} multiple choice, ${e.shortAnswerCount} short answer, ${e.codingCount} coding.`,`Target duration in minutes: ${e.durationMinutes}.`,"Each question must include: type, lessonId, objective, prompt, maxScore, rubric[].","MCQ questions must also include options[4] and correctIndex.","Code questions must also include starterCode and sampleSolution.","Include an objectiveCoverage array with lessonId, lessonTitle, objective.","Keep questions age-appropriate and aligned to the lessons below.",n,"JSON shape:",'{"title":"","objectiveCoverage":[{"lessonId":1,"lessonTitle":"","objective":""}],"questions":[{"type":"mcq","lessonId":1,"objective":"","prompt":"","options":["","","",""],"correctIndex":0,"maxScore":1,"rubric":[{"criterion":"","description":"","points":1,"keywords":[""]}]}]}'].join(`

`);try{const u=await fetch(`${So}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:a}]}],generationConfig:{temperature:.7,maxOutputTokens:1200,topP:.9}}),signal:AbortSignal.timeout(15e3)});if(!u.ok)return null;const l=await u.json(),p=(c=(d=(r=(i=(o=l==null?void 0:l.candidates)==null?void 0:o[0])==null?void 0:i.content)==null?void 0:r.parts)==null?void 0:d[0])==null?void 0:c.text;if(!p)return null;const h=JSON.parse(ko(p));if(!Array.isArray(h.questions)||h.questions.length===0)return null;const m=h.questions.map((g,v)=>xo(g,v,e.lessonIds));return{title:h.title||e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"ai",published:!0,lessonIds:e.lessonIds,objectiveCoverage:Array.isArray(h.objectiveCoverage)&&h.objectiveCoverage.length>0?h.objectiveCoverage:Pt(e.lessonIds).flatMap(g=>g.objectives.map(v=>({lessonId:g.id,lessonTitle:g.title,objective:v}))),durationMinutes:e.durationMinutes||Math.max(15,m.length*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:m.map((g,v)=>({...g,id:`${mn(e.title||"assessment")}-q${v+1}`}))}}catch{return null}}function Eo(){return A.map(e=>({lessonId:e.id,title:e.title,objectives:e.objectives}))}async function Bo(e){var n;const t={title:((n=e.title)==null?void 0:n.trim())||"Assessment Blueprint",lessonIds:Array.isArray(e.lessonIds)&&e.lessonIds.length>0?e.lessonIds:[1,2],mcqCount:Math.max(0,Number.parseInt(e.mcqCount,10)||0),shortAnswerCount:Math.max(0,Number.parseInt(e.shortAnswerCount,10)||0),codingCount:Math.max(0,Number.parseInt(e.codingCount,10)||0),durationMinutes:Math.max(10,Number.parseInt(e.durationMinutes,10)||20)};return await To(t)||Lo(t)}function Ee(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function St(e,t=2){return Math.round(e*10**t)/10**t}function Do(e,t){const s=t.map(r=>{var d;return{...r,totalNormalized:(d=r.grading)!=null&&d.maxScore?r.grading.totalScore/r.grading.maxScore:0}}),n=s.slice().sort((r,d)=>d.totalNormalized-r.totalNormalized),a=Math.max(1,Math.ceil(n.length/3)),o=n.slice(0,a),i=n.slice(-a);return e.questions.map(r=>{const d=s.map(m=>{var g,v;return(v=(g=m.grading)==null?void 0:g.questionScores)==null?void 0:v.find(f=>f.questionId===r.id)}).filter(Boolean),c=Ee(d.map(m=>m.normalizedScore)),u=Ee(o.map(m=>{var g,v,f;return(f=(v=(g=m.grading)==null?void 0:g.questionScores)==null?void 0:v.find(_=>_.questionId===r.id))==null?void 0:f.normalizedScore}).filter(m=>typeof m=="number")),l=Ee(i.map(m=>{var g,v,f;return(f=(v=(g=m.grading)==null?void 0:g.questionScores)==null?void 0:v.find(_=>_.questionId===r.id))==null?void 0:f.normalizedScore}).filter(m=>typeof m=="number")),p=u-l;let h="Healthy";return c<.25?h="Too Hard":c>.85?h="Too Easy":p<.15&&(h="Weak Discriminator"),{questionId:r.id,type:r.type,prompt:r.prompt,objective:r.objective,difficultyIndex:St(c),discriminationIndex:St(p),meanScore:St(Ee(d.map(m=>m.score||0))),status:h,submissionCount:d.length}})}function hn(e,t){const s=Do(e,t),n=t.length>0?Math.round(Ee(t.map(i=>{var r;return((r=i.grading)==null?void 0:r.percentage)||0}))):0,a=t.filter(i=>{var r;return((r=i.integrity)==null?void 0:r.label)==="High"}).length,o=t.filter(i=>{var r;return((r=i.proctor)==null?void 0:r.label)==="High"}).length;return{assessmentId:e.id,title:e.title,generatedBy:e.generatedBy,submissionCount:t.length,averagePercentage:n,flaggedIntegrityCount:a,flaggedProctorCount:o,itemAnalysis:s}}function kt(e,t){return e.filter(s=>s.type===t).length}function Mo(){return Eo().map(t=>`
    <label class="assessment-check">
      <input type="checkbox" name="lesson-id" value="${t.lessonId}" ${t.lessonId<=3?"checked":""}>
      <span class="assessment-check__body">
        <span class="assessment-check__title">Lesson ${t.lessonId}: ${t.title}</span>
        <span class="assessment-check__meta">${t.objectives.length} objectives available</span>
      </span>
    </label>
  `).join("")}function Ro(e,t){return e.length?e.map(s=>{const n=t.filter(o=>o.assessmentId===s.id),a=hn(s,n);return`
      <div class="card assessment-admin-card">
        <div class="assessment-admin-card__header">
          <div>
            <div class="assessment-admin-card__eyebrow">${s.generatedBy==="ai"?"AI generated":"Objective-based fallback"}</div>
            <h3 class="assessment-admin-card__title">${s.title}</h3>
            <p class="assessment-admin-card__meta">${s.durationMinutes} min | ${s.questions.length} questions | ${s.objectiveCoverage.length} objectives covered</p>
          </div>
          <div class="assessment-admin-card__badges">
            <span class="badge badge--primary">${kt(s.questions,"mcq")} MCQ</span>
            <span class="badge badge--accent">${kt(s.questions,"short")} Short</span>
            <span class="badge badge--warning">${kt(s.questions,"code")} Code</span>
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
    `}function Is(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Po(e){const t=await Fe(),s=await fe(),n=await K(),a=t.find(c=>c.id===e);if(!a)return;const o=s.filter(c=>c.assessmentId===a.id),i=hn(a,o),r=o.filter(c=>{var u,l;return((u=c.integrity)==null?void 0:u.label)!=="Low"||((l=c.proctor)==null?void 0:l.label)!=="Low"}).map(c=>{var l,p,h,m,g;const u=n.find(v=>v.id===c.studentId);return`
        <tr>
          <td>${(u==null?void 0:u.name)||"Unknown"}</td>
          <td>${((l=c.grading)==null?void 0:l.percentage)||0}%</td>
          <td>${((p=c.integrity)==null?void 0:p.label)||"Low"} (${((h=c.integrity)==null?void 0:h.score)||0})</td>
          <td>${((m=c.proctor)==null?void 0:m.label)||"Low"} (${((g=c.proctor)==null?void 0:g.anomalyScore)||0})</td>
        </tr>
      `}).join(""),d=`
    <div class="analysis-modal">
      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Objective Coverage</h4>
        <div class="analysis-modal__chips">
          ${a.objectiveCoverage.map(c=>`
            <span class="badge badge--neutral">${Is(c.lessonTitle||`Lesson ${c.lessonId}`)}: ${Is(c.objective)}</span>
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
              ${i.itemAnalysis.map((c,u)=>`
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
  `;de(a.title,d,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"})}async function No(){const e=(await Fe()).slice().sort((s,n)=>new Date(n.createdAt)-new Date(s.createdAt)),t=await fe();return`
    ${M({title:"Assessment Lab",showBack:!0,showSettings:!1,showLogout:!1})}
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
                ${Mo()}
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
            ${Ro(e,t)}
          </div>
        </div>
      </div>
    </div>
  `}function qo(e){z({onBack:()=>e("/dashboard")});const t=document.getElementById("assessment-builder-form");t&&t.addEventListener("submit",async s=>{var r,d,c,u,l;s.preventDefault();const n=[...document.querySelectorAll('input[name="lesson-id"]:checked')].map(p=>Number.parseInt(p.value,10)).filter(Boolean),a={title:((r=document.getElementById("assessment-title"))==null?void 0:r.value)||"",durationMinutes:((d=document.getElementById("assessment-duration"))==null?void 0:d.value)||"25",mcqCount:((c=document.getElementById("assessment-mcq-count"))==null?void 0:c.value)||"0",shortAnswerCount:((u=document.getElementById("assessment-short-count"))==null?void 0:u.value)||"0",codingCount:((l=document.getElementById("assessment-code-count"))==null?void 0:l.value)||"0",lessonIds:n},o=Number.parseInt(a.mcqCount,10)+Number.parseInt(a.shortAnswerCount,10)+Number.parseInt(a.codingCount,10);if(n.length===0){T("Choose at least one lesson for the blueprint.","error");return}if(o<=0){T("Add at least one question to the assessment.","error");return}const i=t.querySelector('button[type="submit"]');i&&(i.disabled=!0,i.textContent="Generating...");try{const p=await Bo(a);await da(p),T(`Assessment published with ${p.questions.length} questions.`,"success"),await e("/assessment-lab")}catch(p){console.error(p),T("Assessment generation failed. Please try again.","error"),i&&(i.disabled=!1,i.textContent="Generate and Publish Assessment")}}),document.querySelectorAll(".btn-view-analysis").forEach(s=>{s.addEventListener("click",async n=>{const a=Number.parseInt(n.currentTarget.dataset.assessmentId,10);await Po(a)})})}async function zo(){const e=R(),t=(await Fe()).filter(n=>n.published!==!1).sort((n,a)=>new Date(a.createdAt)-new Date(n.createdAt)),s=e?await js(e.id):[];return`
    ${M({title:"Assessment Center",showBack:!0,studentName:e==null?void 0:e.name})}
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
  `}function jo(e){z({onBack:()=>e("/lessons")}),document.querySelectorAll(".btn-start-assessment").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.assessmentId,10);e(`/assessment/${n}`)})}),document.querySelectorAll(".btn-view-assessment-result").forEach(t=>{t.addEventListener("click",s=>{const n=Number.parseInt(s.currentTarget.dataset.submissionId,10);e(`/assessment-results/${n}`)})})}function gn(){return new Date().toISOString()}function Qo(e,t={}){return{type:e,detail:t,timestamp:gn()}}function Oo({onEvent:e=null}={}){const t=[],s=[],n=new Map;let a=null;function o(p,h={}){const m=Qo(p,h);t.push(m),e==null||e(m)}function i(p,h,m,g){p.addEventListener(h,m,g),s.push(()=>p.removeEventListener(h,m,g))}async function r(){try{!document.fullscreenElement&&document.documentElement.requestFullscreen&&await document.documentElement.requestFullscreen()}catch{o("fullscreen-request-failed")}}async function d(){a=Date.now(),await r(),i(document,"visibilitychange",()=>{document.hidden&&o("tab-hidden")}),i(window,"blur",()=>{o("window-blur")}),i(document,"fullscreenchange",()=>{document.fullscreenElement||o("fullscreen-exit")}),i(document,"contextmenu",p=>{p.preventDefault(),o("context-menu-open")}),["copy","cut","paste"].forEach(p=>{i(document,p,h=>{h.preventDefault(),o(`${p}-attempt`)})}),i(document,"keydown",p=>{(p.key==="F12"||p.ctrlKey&&["c","v","x","p","s","u"].includes(p.key.toLowerCase())||p.ctrlKey&&p.shiftKey&&["i","j","c"].includes(p.key.toLowerCase()))&&(p.preventDefault(),o("blocked-shortcut",{key:p.key}))}),window.onbeforeunload=()=>"Assessment still in progress.",o("proctor-started")}function c(p,h){const m=(h||"").length,g=n.get(p)||{length:0,updatedAt:Date.now()},v=Date.now(),f=m-g.length,_=v-g.updatedAt;f>=80&&_<1500&&o("burst-typing",{questionId:p,deltaLength:f,deltaTime:_}),n.set(p,{length:m,updatedAt:v})}function u(){const p=t.reduce((m,g)=>(m[g.type]=(m[g.type]||0)+1,m),{}),h=Math.min(100,(p["fullscreen-exit"]||0)*18+(p["tab-hidden"]||0)*16+(p["window-blur"]||0)*12+(p["paste-attempt"]||0)*12+(p["copy-attempt"]||0)*8+(p["cut-attempt"]||0)*8+(p["blocked-shortcut"]||0)*7+(p["burst-typing"]||0)*10+(p["context-menu-open"]||0)*6);return{startedAt:a?new Date(a).toISOString():null,endedAt:gn(),durationMs:a?Date.now()-a:0,anomalyScore:h,label:h>=60?"High":h>=30?"Moderate":"Low",counts:p,events:t}}async function l(){s.splice(0).forEach(p=>p()),window.onbeforeunload=null;try{document.fullscreenElement&&document.exitFullscreen&&await document.exitFullscreen()}catch{}return o("proctor-stopped"),u()}return{start:d,stop:l,summarize:u,logEvent:o,trackTextEntry:c}}const Fo="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";function Pe(e,t,s){return Math.max(t,Math.min(s,e))}function Go(e,t=2){return Math.round(e*10**t)/10**t}function Ho(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function Uo(e,t=[]){return t.length?t.reduce((s,n)=>e.includes(String(n).toLowerCase())?s+1:s,0):0}function Wo(e){return e.filter(Boolean).join(" ")}async function Ko(e){var s,n,a,o,i;const t=$e();if(!t||!navigator.onLine)return null;try{const r=await fetch(`${Fo}?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.3,maxOutputTokens:400,topP:.85}}),signal:AbortSignal.timeout(12e3)});if(!r.ok)return null;const d=await r.json(),c=(i=(o=(a=(n=(s=d==null?void 0:d.candidates)==null?void 0:s[0])==null?void 0:n.content)==null?void 0:a.parts)==null?void 0:o[0])==null?void 0:i.text;if(!c)return null;const u=c.includes("{")?c.slice(c.indexOf("{"),c.lastIndexOf("}")+1):c;return JSON.parse(u)}catch{return null}}function Yo(e,t){var c;const s=e.maxScore||((c=e.rubric)==null?void 0:c.reduce((u,l)=>u+l.points,0))||5,n=t.trim();if(!n)return{score:0,maxScore:s,rubricBreakdown:(e.rubric||[]).map(u=>({criterion:u.criterion,score:0,maxScore:u.points,evidence:"No evidence yet."})),feedback:"No response was submitted for this question.",source:"fallback"};const a=Ho(n),o=/function|return|if|const|let|=>/i.test(n),i=(e.rubric||[]).map(u=>{var m,g;const l=Uo(a,u.keywords),p=(m=u.keywords)!=null&&m.length?l/u.keywords.length:.6;let h=(g=u.keywords)!=null&&g.length?Math.round(Pe(p,0,1)*u.points):Math.ceil(u.points*.6);return e.type==="code"&&o&&/function|return/i.test(n)&&/Programming structure/i.test(u.description)&&(h=Math.max(h,Math.ceil(u.points*.75))),h=Pe(h,0,u.points),{criterion:u.criterion,score:h,maxScore:u.points,evidence:l>0?`Matched ${l} expected concept${l===1?"":"s"}.`:"Only partial evidence of the expected concept."}});let r=i.reduce((u,l)=>u+l.score,0);a.length>24&&r<s&&(r=Math.min(s,r+1));const d=Wo([r>=s*.8?"Strong response.":"This response shows some understanding but still needs refinement.",e.type==="code"?"Check that the code logic matches the lesson rule and that the function returns the expected values.":"Use more precise lesson vocabulary and include the key concept directly in your explanation."]);return{score:Pe(r,0,s),maxScore:s,rubricBreakdown:i,feedback:d,source:"fallback"}}async function Vo(e,t){var o;const s=e.maxScore||((o=e.rubric)==null?void 0:o.reduce((i,r)=>i+r.points,0))||5,n=["You are grading a Basic 7 Computing assessment.","Return valid JSON only with keys: score, feedback, rubricBreakdown.",`Question type: ${e.type}`,`Prompt: ${e.prompt}`,`Sample answer: ${e.sampleSolution||e.answerKey||""}`,`Rubric: ${JSON.stringify(e.rubric||[])}`,`Student response: ${t}`,`Maximum score: ${s}`].join(`
`),a=await Ko(n);return a&&Number.isFinite(a.score)?{score:Pe(Math.round(a.score),0,s),maxScore:s,rubricBreakdown:Array.isArray(a.rubricBreakdown)&&a.rubricBreakdown.length>0?a.rubricBreakdown.map(i=>({criterion:i.criterion||"Quality",score:Pe(Math.round(i.score||0),0,Number.isFinite(i.maxScore)?i.maxScore:s),maxScore:Number.isFinite(i.maxScore)?i.maxScore:s,evidence:i.evidence||""})):[],feedback:a.feedback||"AI grading completed.",source:"ai"}:Yo(e,t)}function Jo(e,t){const s=Number.parseInt(t==null?void 0:t.selectedIndex,10)===e.correctIndex;return{score:s?e.maxScore||1:0,maxScore:e.maxScore||1,rubricBreakdown:[{criterion:"Correct answer",score:s?e.maxScore||1:0,maxScore:e.maxScore||1,evidence:s?"Correct option selected.":"Incorrect option selected."}],feedback:s?"Correct. You selected the best answer for this concept.":`Review this concept and compare your answer with the correct option: ${e.answerKey}.`,source:"system"}}async function Zo({assessment:e,answers:t}){const s=[];for(const c of e.questions){const u=t.find(h=>h.questionId===c.id)||{};let l=null;c.type==="mcq"?l=Jo(c,u):l=await Vo(c,u.responseText||"");const p=l.maxScore>0?l.score/l.maxScore:0;s.push({questionId:c.id,prompt:c.prompt,lessonId:c.lessonId,objective:c.objective,type:c.type,score:l.score,maxScore:l.maxScore,normalizedScore:Go(p),feedback:l.feedback,rubricBreakdown:l.rubricBreakdown,gradingSource:l.source,flaggedForReview:c.type!=="mcq"&&l.source==="fallback"&&p>=.4&&p<=.7,answerPreview:c.type==="mcq"?u.selectedIndex:u.responseText||""})}const n=s.reduce((c,u)=>c+u.score,0),a=s.reduce((c,u)=>c+u.maxScore,0),o=a>0?Math.round(n/a*100):0,i=s.filter(c=>c.normalizedScore<.6).map(c=>({lessonId:c.lessonId,objective:c.objective,questionId:c.questionId,reason:c.feedback})),r=s.filter(c=>c.normalizedScore>=.8).map(c=>({lessonId:c.lessonId,objective:c.objective,questionId:c.questionId})),d=i.slice(0,4).map(c=>{var u;return{lessonId:c.lessonId,objective:c.objective,action:`Review this objective again and retry a similar ${((u=s.find(l=>l.questionId===c.questionId))==null?void 0:u.type)||"assessment"} question.`}});return{totalScore:n,maxScore:a,percentage:o,questionScores:s,weakObjectives:i,strengths:r,remediationPlan:d}}function Y(e,t=2){return Math.round(e*10**t)/10**t}function Se(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function Xo(e=""){return e.split(/[.!?]+/).map(t=>t.trim()).filter(Boolean)}function ee(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function er(e){if(e.length<2)return 0;const t=ee(e);return ee(e.map(s=>(s-t)**2))}function _s(e,t){const s=new Set(e),n=new Set(t),a=[...s].filter(i=>n.has(i)).length,o=new Set([...s,...n]).size;return o>0?a/o:0}function tr(e){if(!e.length)return 0;const t=new Map;return e.forEach(s=>{t.set(s,(t.get(s)||0)+1)}),[...t.values()].reduce((s,n)=>{const a=n/e.length;return s-a*Math.log2(a)},0)}function vn(e){const t=Se(e),s=Xo(e),n=s.map(l=>Se(l).length).filter(Boolean),a=new Set(t).size,o=t.length>0?a/t.length:0,i=n.length>0?ee(n):t.length,r=n.length>1?er(n)/Math.max(1,i):0,d=tr(t),c=t.length>0?2**d:0,u=(e.match(/\b(overall|in conclusion|therefore|moreover|furthermore|additionally)\b/gi)||[]).length;return{tokenCount:t.length,sentenceCount:s.length,lexicalDiversity:Y(o),averageSentenceLength:Y(i),burstiness:Y(r),perplexityProxy:Y(c),templatePhraseCount:u}}function fn(e){return typeof e.responseText=="string"?e.responseText.trim():""}function sr(e=[]){const t=e.flatMap(n=>n.answers||[]).map(fn).filter(n=>n.length>0),s=t.map(vn);return{texts:t,avgLexicalDiversity:ee(s.map(n=>n.lexicalDiversity)),avgSentenceLength:ee(s.map(n=>n.averageSentenceLength))}}function nr({answers:e,priorSubmissions:t=[]}){const s=e.filter(b=>b.type==="short"||b.type==="code").map(b=>({questionId:b.questionId,type:b.type,text:fn(b)})).filter(b=>b.text.length>0),n=s.map(b=>({...b,metrics:vn(b.text)})),a=sr(t),o=ee(n.map(b=>b.metrics.lexicalDiversity)),i=ee(n.map(b=>b.metrics.averageSentenceLength)),r=ee(n.map(b=>b.metrics.burstiness)),d=ee(n.map(b=>b.metrics.perplexityProxy)),c=n.reduce((b,y)=>b+y.metrics.templatePhraseCount,0),u=[];for(let b=0;b<n.length;b+=1)for(let y=b+1;y<n.length;y+=1)u.push(_s(Se(n[b].text),Se(n[y].text)));const l=ee(u),p=a.texts.length>0?Math.abs(o-a.avgLexicalDiversity)+Math.abs(i-a.avgSentenceLength)/20:0,h=a.texts.length>0&&s.length>0?Math.max(...s.map(b=>Math.max(...a.texts.map(y=>_s(Se(b.text),Se(y))),0)),0):0;let m=0;const g=[],v=[];if(s.length===0)return{score:0,label:"Low",reasons:["No open-ended writing to analyze."],metrics:{lexicalDiversity:0,averageSentenceLength:0,burstiness:0,perplexityProxy:0,internalSimilarity:0,historicalOverlap:0},flaggedSegments:v};o>.62&&r<1.2&&(m+=18,g.push("Writing is unusually uniform across responses.")),d>35&&r<1.4&&(m+=16,g.push("Perplexity proxy suggests highly polished and predictable wording.")),c>=2&&(m+=10,g.push("Several template-like transition phrases were reused.")),l>.45&&(m+=18,g.push("Multiple answers reuse very similar vocabulary patterns.")),p>.35&&(m+=22,g.push("Writing style differs noticeably from the student’s earlier responses.")),h>.75&&(m+=20,g.push("One or more answers overlap heavily with earlier saved writing.")),n.forEach(b=>{b.metrics.burstiness<.5&&b.metrics.tokenCount>30&&v.push({questionId:b.questionId,reason:"Low burstiness and long response length."})});const f=Math.min(100,Math.round(m)),_=f>=65?"High":f>=35?"Moderate":"Low";return g.length||g.push("Writing patterns look reasonably consistent."),{score:f,label:_,reasons:g,metrics:{lexicalDiversity:Y(o),averageSentenceLength:Y(i),burstiness:Y(r),perplexityProxy:Y(d),internalSimilarity:Y(l),historicalOverlap:Y(h),styleShift:Y(p)},flaggedSegments:v}}const Nt="cc_lab_room",Ss=new Set;function ar(){var e,t;return((t=(e=globalThis.crypto)==null?void 0:e.randomUUID)==null?void 0:t.call(e))||`lab-${Date.now()}-${Math.random().toString(36).slice(2)}`}function mt(){const e=new URLSearchParams(window.location.search).get("lab");return e&&localStorage.setItem(Nt,e),e||localStorage.getItem(Nt)||""}function ir(){const e=ar();return localStorage.setItem(Nt,e),e}function bn(e=mt()){const t=new URL("/student-login",window.location.origin);return t.searchParams.set("lab",e),t.toString()}function yn(e){return e&&Ss.add(e),mt(),()=>Ss.delete(e)}function wn(e,t={}){return mt(),!1}function qt(e,t={}){return wn("status",{...t})}function xt(e,t={}){return wn("control",{...t})}let $=null,ct=null,oe=new Map,ce=!1,Q=null,Ne=null,ne=0,ue=!1,Ye=null;function In(e=0){const t=String(Math.floor(e/60)).padStart(2,"0"),s=String(e%60).padStart(2,"0");return`${t}:${s}`}function ks(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function _n(e){return e.type==="mcq"?{questionId:e.id,type:e.type,selectedIndex:null}:{questionId:e.id,type:e.type,responseText:e.type==="code"&&e.starterCode||""}}function Sn(e,t){if(!t)return!1;if(e.type==="mcq")return Number.isInteger(t.selectedIndex);const s=(t.responseText||"").trim();return!(!s||e.type==="code"&&s===(e.starterCode||"").trim())}function or(e,t,s){return e.type==="mcq"?`
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
          <pre>${ks(e.starterCode)}</pre>
        </div>
      `:""}
      <textarea
        class="input assessment-response ${e.type==="code"?"assessment-response--code":""}"
        data-question-id="${e.id}"
        rows="${e.type==="code"?10:5}"
        placeholder="${e.type==="code"?"Write your code here...":"Write your response here..."}"
      >${ks((s==null?void 0:s.responseText)||"")}</textarea>
    </div>
  `}function kn(){return($==null?void 0:$.questions.map(e=>oe.get(e.id)||_n(e)))||[]}function xs(){const e=document.getElementById("assessment-session-timer");e&&(e.textContent=In(ne))}function ht(){Ne&&(window.clearInterval(Ne),Ne=null)}async function rr(e){const t=Number.parseInt(e,10);$&&ct===t||($=await la(t),ct=t,oe=new Map((($==null?void 0:$.questions)||[]).map(s=>[s.id,_n(s)])),ce=!1,Q=null,ne=(($==null?void 0:$.durationMinutes)||20)*60,ht(),ue=!1)}function cr(){ht(),Q&&Q.stop(),$=null,ct=null,oe=new Map,ce=!1,Q=null,ne=0,ue=!1}async function dr(e){if(!$||ce)return;const t=R();Q=Oo({onEvent:s=>{["fullscreen-exit","tab-hidden","window-blur"].includes(s.type)&&qt("Taking Assessment",{studentId:t==null?void 0:t.id,studentName:t==null?void 0:t.name,detail:`${$.title}: ${s.type.replaceAll("-"," ")}`,alert:!0})}}),await Q.start(),qt("Taking Assessment",{studentId:t==null?void 0:t.id,studentName:t==null?void 0:t.name,detail:`${$.title} (Q1/${$.questions.length})`}),ce=!0,ne=($.durationMinutes||20)*60,await e()}async function zt(e){if(!$||ue)return;ue=!0,ht();const t=R();if(!t){ue=!1,e("/student-login");return}try{const s=kn().map(d=>{const c=$.questions.find(u=>u.id===d.questionId);return!c||c.type==="mcq"?d:{...d,responseText:Sn(c,d)?d.responseText:""}}),n=await js(t.id),a=await Zo({assessment:$,answers:s}),o=nr({answers:s,priorSubmissions:n}),i=Q?await Q.stop():{anomalyScore:0,label:"Low",counts:{},events:[]},r=await ua({assessmentId:$.id,studentId:t.id,answers:s,grading:a,integrity:o,proctor:i});qt("Completed",{studentId:t.id,studentName:t.name,detail:`${$.title} submitted`,alert:i.label!=="Low"}),$=null,ct=null,oe=new Map,ce=!1,Q=null,ne=0,ue=!1,e(`/assessment-results/${r.id}`)}catch(s){console.error(s),T("Unable to submit the assessment right now.","error"),ue=!1}}function lr(e){!ce||Ne||!$||(xs(),Ne=window.setInterval(async()=>{ne=Math.max(0,ne-1),xs(),ne===0&&(ht(),T("Time is up. Submitting your assessment now.","info"),await zt(e))},1e3))}function ur(){return{completed:kn().filter(s=>{const n=$==null?void 0:$.questions.find(a=>a.id===s.questionId);return n?Sn(n,s):!1}).length,total:($==null?void 0:$.questions.length)||0}}function pr(){var n;const e=R();if(!$)return'<div class="container" style="padding: 2rem;">Assessment not found.</div>';const t=ur(),s=(n=Q==null?void 0:Q.summarize)==null?void 0:n.call(Q);return ce?`
    ${M({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-session-page">
      <div class="card card--glass assessment-session-topbar">
        <div>
          <div class="assessment-hero__eyebrow">Assessment in progress</div>
          <h1 class="assessment-session-topbar__title">${$.title}</h1>
        </div>
        <div class="assessment-session-topbar__meta">
          <span class="badge badge--warning" id="assessment-session-timer">${In(ne)}</span>
          <span class="badge badge--neutral">${t.completed}/${t.total} answered</span>
          <span class="badge badge--${(s==null?void 0:s.label)==="High"?"danger":(s==null?void 0:s.label)==="Moderate"?"warning":"success"}">Proctor ${(s==null?void 0:s.label)||"Low"}</span>
        </div>
      </div>

      ${Ge(t.completed,t.total,"Assessment completion")}

      <form id="assessment-session-form" class="assessment-session-form">
        ${$.questions.map((a,o)=>or(a,o,oe.get(a.id))).join("")}

        <div class="assessment-session-submit">
          <button class="btn btn--primary btn--lg" id="btn-submit-assessment" type="submit">Submit Assessment</button>
        </div>
      </form>
    </div>
  `:`
      ${M({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
      <div class="container container--narrow view-enter assessment-session-page">
        <div class="card card--glass assessment-start-card">
          <div class="assessment-hero__eyebrow">Proctored assessment</div>
          <h1 class="assessment-hero__title">${$.title}</h1>
          <p class="assessment-hero__text">This assessment uses browser-based proctoring, open-response grading, item analysis, and integrity review.</p>

          <div class="assessment-start-card__grid">
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${$.durationMinutes}</span>
              <span class="assessment-start-card__label">Minutes</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${$.questions.length}</span>
              <span class="assessment-start-card__label">Questions</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${$.objectiveCoverage.length}</span>
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
    `}function mr(e,t,s){if(Ye==null||Ye(),Ye=yn(a=>{a.type==="control"&&a.action==="lock-screens"&&(document.querySelectorAll("input, textarea, button").forEach(o=>{o.closest("#main-nav")||(o.disabled=!0)}),T("The teacher has locked this assessment screen.","warning")),a.type==="control"&&a.action==="force-submit"&&zt(e)}),z({onBack:()=>e("/assessments")}),!ce){const a=document.getElementById("btn-begin-assessment");a&&a.addEventListener("click",async()=>{await dr(t)});return}lr(e),document.querySelectorAll(".assessment-option").forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.dataset.questionId,r=Number.parseInt(o.currentTarget.dataset.optionIndex,10),d=oe.get(i)||{questionId:i,type:"mcq",selectedIndex:null};oe.set(i,{...d,selectedIndex:r}),document.querySelectorAll(`.assessment-option[data-question-id="${i}"]`).forEach(c=>{c.classList.toggle("option-btn--selected",Number.parseInt(c.dataset.optionIndex,10)===r)})})}),document.querySelectorAll(".assessment-response").forEach(a=>{a.addEventListener("input",o=>{const i=o.currentTarget.dataset.questionId,r=$.questions.find(d=>d.id===i);r&&(oe.set(i,{questionId:i,type:r.type,responseText:o.currentTarget.value}),Q==null||Q.trackTextEntry(i,o.currentTarget.value))})});const n=document.getElementById("assessment-session-form");n&&n.addEventListener("submit",async a=>{a.preventDefault(),await zt(e)})}function Ie(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function hr(e){const t=R(),s=await fe(),n=await Fe(),a=s.find(i=>i.id===Number.parseInt(e,10)),o=n.find(i=>i.id===(a==null?void 0:a.assessmentId));return!a||!o?'<div class="container" style="padding: 2rem;">Assessment result not found.</div>':`
    ${M({title:"Assessment Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Assessments"})}
    <div class="container container--narrow view-enter assessment-results-page">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <div class="assessment-hero__eyebrow">Assessment complete</div>
        <h1 class="assessment-hero__title">${o.title}</h1>
        <p class="assessment-hero__text">Your open responses were graded against rubrics, then reviewed for integrity and browser behavior.</p>
      </div>

      ${Us(a.grading.totalScore,a.grading.maxScore)}

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
              <div class="assessment-remediation-item__objective">${Ie(i.objective)}</div>
              <div class="assessment-remediation-item__action">${Ie(i.action)}</div>
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
            <div class="review-item__question">${r+1}. ${Ie(i.prompt)}</div>
            <div class="review-item__meta">
              <span>${i.type}</span>
              <span>${i.score}/${i.maxScore} points</span>
              <span>${i.gradingSource==="ai"?"AI graded":i.gradingSource==="fallback"?"Rubric fallback":"Auto graded"}</span>
            </div>
            <div class="review-item__answer">
              <div>${Ie(i.feedback)}</div>
            </div>
            ${(d=i.rubricBreakdown)!=null&&d.length?`
              <div class="assessment-rubric-breakdown">
                ${i.rubricBreakdown.map(c=>`
                  <div class="assessment-rubric-breakdown__item">
                    <strong>${Ie(c.criterion)}:</strong> ${c.score}/${c.maxScore} - ${Ie(c.evidence||"")}
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
  `}function gr(e,t){z({onBack:()=>e("/assessments")});const s=document.getElementById("btn-back-to-center"),n=document.getElementById("btn-retake-assessment");fe().then(a=>{const o=a.find(i=>i.id===Number.parseInt(t,10));o&&(s&&s.addEventListener("click",()=>e("/assessments")),n&&n.addEventListener("click",()=>e(`/assessment/${o.assessmentId}`)))})}const gt={sbaPercent:30,diagnosticPercent:20,examPercent:50};function vr(e){const t=Math.max(0,Math.min(100,Math.round(e||0)));return t>=90?{grade:1,label:"Grade 1",descriptor:"Excellent",letter:"A1",tone:"success",remark:"Outstanding performance and deep conceptual mastery."}:t>=80?{grade:2,label:"Grade 2",descriptor:"Very Good",letter:"B2",tone:"success",remark:"Very strong mastery; consistently demonstrates high ability."}:t>=70?{grade:3,label:"Grade 3",descriptor:"Good",letter:"B3",tone:"primary",remark:"Solid grasp of fundamental computing concepts."}:t>=60?{grade:4,label:"Grade 4",descriptor:"High Average",letter:"C4",tone:"primary",remark:"Satisfactory work; demonstrates steady progress in computing tasks."}:t>=55?{grade:5,label:"Grade 5",descriptor:"Average",letter:"C5",tone:"accent",remark:"Fair understanding; needs targeted practice on technical terms."}:t>=50?{grade:6,label:"Grade 6",descriptor:"Low Average",letter:"C6",tone:"warning",remark:"Average performance; additional review of key concepts required."}:t>=45?{grade:7,label:"Grade 7",descriptor:"Lower",letter:"D7",tone:"warning",remark:"Below expected standard; regular remediation recommended."}:t>=40?{grade:8,label:"Grade 8",descriptor:"Lowest",letter:"E8",tone:"danger",remark:"Weak performance; urgent intervention needed in basic computing."}:{grade:9,label:"Grade 9",descriptor:"Fail",letter:"F9",tone:"danger",remark:"Did not meet minimum competency requirements. Remedial support required."}}function fr(e){const t=["th","st","nd","rd"],s=e%100;return e+(t[(s-20)%10]||t[s]||t[0])}function br(e,{results:t=[],progress:s=[],diagnostics:n=[],submissions:a=[],weights:o=gt}){const i=t.filter(E=>E.studentId===e.id),r=s.filter(E=>E.studentId===e.id),d=n.filter(E=>E.studentId===e.id),c=a.filter(E=>E.studentId===e.id),u={};A.forEach(E=>{const j=i.filter(le=>le.lessonId===E.id).sort((le,be)=>new Date(be.completedAt)-new Date(le.completedAt))[0];u[E.id]=j&&j.totalQuestions>0?Math.round(j.score/j.totalQuestions*100):null});const l=Object.values(u).filter(E=>E!==null),p=l.length>0?l.reduce((E,j)=>E+j,0)/l.length:0,h=r.length/Math.max(1,A.length)*100,m=Math.round(p*.8+h*.2),g=d.sort((E,j)=>new Date(j.completedAt)-new Date(E.completedAt))[0];let v=50;if(g){const E=g.estimatedTheta??0;v=Math.max(0,Math.min(100,Math.round(50+E*16.67)))}const f=c.sort((E,j)=>new Date(j.completedAt)-new Date(E.completedAt))[0];let _=null;f&&f.maxScore>0?_=Math.round(f.totalScore/f.maxScore*100):l.length>0?_=Math.round(p):_=0;const b=(o.sbaPercent||30)/100,y=(o.diagnosticPercent||20)/100,I=(o.examPercent||50)/100,w=Math.round(m*b),S=Math.round(v*y),B=Math.round(_*I),P=Math.round(w+S+B),O=vr(P);return{student:e,lessonScores:u,rawQuizAverage:Math.round(p),completionCount:r.length,sbaRaw:m,weightedSBA:w,diagnosticRaw:v,weightedDiag:S,examRaw:_,weightedExam:B,totalPercentage:P,bece:O,quizzesTaken:i.length,hasExamSubmission:!!f,latestDiagnostic:g}}function yr(e){return e.slice().sort((s,n)=>n.totalPercentage!==s.totalPercentage?n.totalPercentage-s.totalPercentage:n.sbaRaw-s.sbaRaw).map((s,n)=>({...s,rankNumber:n+1,rankOrdinal:fr(n+1),isTopThree:n<3}))}function xn(e,{classes:t=[],students:s=[],results:n=[],progress:a=[],diagnostics:o=[],submissions:i=[],weights:r=gt}){const d=e==="all"?{id:"all",name:"All Classes",gradeLevel:"B7",academicYear:"2026/2027",term:"Term 1"}:t.find(v=>String(v.id)===String(e))||t[0]||{id:1,name:"General",gradeLevel:"B7"},u=(e==="all"?s:s.filter(v=>String(v.classId)===String(d.id))).map(v=>br(v,{results:n,progress:a,diagnostics:o,submissions:i,weights:r})),l=yr(u),p=l.length>0?Math.round(l.reduce((v,f)=>v+f.totalPercentage,0)/l.length):0,h=l.length>0?Math.max(...l.map(v=>v.totalPercentage)):0,m=l.length>0?Math.min(...l.map(v=>v.totalPercentage)):0,g={};for(let v=1;v<=9;v+=1)g[v]=l.filter(f=>f.bece.grade===v).length;return{classInfo:d,weights:r,lessons:A,students:l,statistics:{totalStudents:l.length,classAverage:p,highestScore:h,lowestScore:m,gradeDistribution:g}}}function wr(e){const t=["Rank","Index Number","Student Name","Class",...A.map(n=>`L${n.id}: ${n.title}`),`SBA Raw (${e.weights.sbaPercent}%)`,`Diagnostic Raw (${e.weights.diagnosticPercent}%)`,`Exam Raw (${e.weights.examPercent}%)`,"Total Percentage","BECE Grade","Descriptor"],s=e.students.map(n=>[n.rankOrdinal,`"${n.student.indexNumber||""}"`,`"${n.student.name}"`,`"${e.classInfo.name}"`,...A.map(a=>n.lessonScores[a.id]!==null?`${n.lessonScores[a.id]}%`:"N/A"),`${n.sbaRaw}%`,`${n.diagnosticRaw}%`,`${n.examRaw}%`,`${n.totalPercentage}%`,`Grade ${n.bece.grade}`,`"${n.bece.descriptor}"`]);return[t.join(","),...s.map(n=>n.join(","))].join(`
`)}function Ir(e,{classes:t=[],students:s=[],results:n=[],progress:a=[],diagnostics:o=[],submissions:i=[],weights:r=gt}){const d=s.find(g=>g.id===Number.parseInt(e,10));if(!d)return null;const c=t.find(g=>g.id===d.classId)||t[0]||{id:1,name:"B7 — JHS 1A",gradeLevel:"B7",academicYear:"2026/2027",term:"Term 1",teacherName:"Class Teacher"},u=xn(c.id,{classes:t,students:s,results:n,progress:a,diagnostics:o,submissions:i,weights:r}),l=u.students.find(g=>g.student.id===d.id);if(!l)return null;const h=n.filter(g=>g.studentId===d.id).sort((g,v)=>new Date(g.completedAt)-new Date(v.completedAt)).map(g=>{var v;return{completedAt:g.completedAt,lessonId:g.lessonId,lessonTitle:((v=A.find(f=>f.id===g.lessonId))==null?void 0:v.title)||`Lesson ${g.lessonId}`,theta:Number((g.theta||0).toFixed(2))}}),m=A.map(g=>{const v=l.lessonScores[g.id],f=a.some(b=>b.studentId===d.id&&b.lessonId===g.id);let _="Not yet attempted.";return v!==null&&(v>=80?_="Mastered core objectives.":v>=60?_="Demonstrates competent understanding.":_="Requires further reinforcement."),{id:g.id,title:g.title,strand:`Strand ${g.id}: Computer Systems`,score:v,isCompleted:f,remark:_}});return{student:d,studentClass:c,studentData:l,classTotalStudents:u.students.length,classAverage:u.statistics.classAverage,strands:m,thetaHistory:h,weights:r,attendance:{daysPresent:Math.min(60,52+d.id%8),totalDays:60},conduct:l.totalPercentage>=70?"Exemplary behavior, attentive during lab practicals, and shows positive initiative.":"Well behaved; advised to dedicate more time to hands-on computer practice.",headmasterRemark:l.totalPercentage>=70?"An impressive performance. Keep up the high standard.":"Has potential to do much better with consistent study and practice."}}let nt="all",$n={...gt},qe=null;function Le(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function jt(){const[e,t,s,n,a,o]=await Promise.all([te(),K(),ve(),lt(),ut(),fe()]);qe=xn(nt,{classes:e,students:t,results:s,progress:n,diagnostics:a,submissions:o,weights:$n});const{classInfo:i,statistics:r,weights:d,lessons:c,students:u}=qe;return`
    ${M({title:"Master Broadsheet Gradebook",showBack:!0})}
    <div class="container view-enter gradebook-page" style="padding-top: var(--space-6);">
      
      <div class="gradebook-header">
        <div>
          <h1 class="gradebook-header__title">${Le(i.name)} — Continuous Assessment</h1>
          <p class="dashboard-header__subtitle">
            GES Standard 9-Point Grading & Weighted Terminal Broadsheet · Academic Year ${Le(i.academicYear||"2026/2027")}
          </p>
        </div>
        <div class="gradebook-header__actions">
          <select id="gradebook-class-select" class="select-class">
            <option value="all" ${nt==="all"?"selected":""}>All Classes (${t.length} students)</option>
            ${e.map(l=>`
              <option value="${l.id}" ${String(nt)===String(l.id)?"selected":""}>
                ${Le(l.name)} (${t.filter(p=>p.classId===l.id).length})
              </option>
            `).join("")}
          </select>
          <button class="btn btn--secondary btn--sm" id="btn-export-broadsheet-csv">📥 Export Broadsheet (CSV)</button>
        </div>
      </div>

      <!-- Weights Configuration Panel -->
      <div class="weights-panel">
        <div>
          <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); margin-bottom: 2px;">
            Assessment Weighting Scheme
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--text-muted);">
            Formula: SBA Quizzes + Diagnostic Baseline + Terminal Examination = 100%
          </div>
        </div>
        <div class="weights-form">
          <div class="weight-input-group">
            <label for="weight-sba">SBA (Quizzes):</label>
            <input type="number" id="weight-sba" class="input input--sm weight-input" value="${d.sbaPercent}" min="0" max="100">%
          </div>
          <div class="weight-input-group">
            <label for="weight-diag">Diagnostic:</label>
            <input type="number" id="weight-diag" class="input input--sm weight-input" value="${d.diagnosticPercent}" min="0" max="100">%
          </div>
          <div class="weight-input-group">
            <label for="weight-exam">Exam:</label>
            <input type="number" id="weight-exam" class="input input--sm weight-input" value="${d.examPercent}" min="0" max="100">%
          </div>
          <button class="btn btn--ghost btn--xs" id="btn-apply-weights">Apply Weights</button>
        </div>
      </div>

      <!-- Broadsheet Summary Bar -->
      <div class="broadsheet-stats-bar">
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value">${r.totalStudents}</div>
          <div class="broadsheet-stat-card__label">Enrolled Learners</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value">${r.classAverage}%</div>
          <div class="broadsheet-stat-card__label">Class Average</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value" style="color: var(--color-success-400);">${r.highestScore}%</div>
          <div class="broadsheet-stat-card__label">Highest Mark</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value" style="color: var(--color-accent-400);">${r.gradeDistribution[1]+r.gradeDistribution[2]}</div>
          <div class="broadsheet-stat-card__label">Grade 1 & 2 Passes</div>
        </div>
      </div>

      <!-- Master Broadsheet Grid -->
      <div class="broadsheet-table-wrap">
        <table class="broadsheet-table">
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">Rank</th>
              <th>Index #</th>
              <th>Student Name</th>
              ${c.map(l=>`<th style="text-align: center;">L${l.id}<br><small style="font-weight: normal; opacity: 0.7;">Quiz</small></th>`).join("")}
              <th style="text-align: center; background: rgba(99, 102, 241, 0.08);">SBA Raw<br><small style="opacity: 0.8;">(${d.sbaPercent}%)</small></th>
              <th style="text-align: center; background: rgba(56, 189, 248, 0.08);">Diag<br><small style="opacity: 0.8;">(${d.diagnosticPercent}%)</small></th>
              <th style="text-align: center; background: rgba(245, 158, 11, 0.08);">Exam<br><small style="opacity: 0.8;">(${d.examPercent}%)</small></th>
              <th style="text-align: center; background: rgba(16, 185, 129, 0.1);">Total Mark<br><small style="opacity: 0.8;">(100%)</small></th>
              <th style="text-align: center;">BECE Grade</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${u.length>0?u.map(l=>{let p="rank-badge--other";return l.rankNumber===1?p="rank-badge--1":l.rankNumber===2?p="rank-badge--2":l.rankNumber===3&&(p="rank-badge--3"),`
                <tr>
                  <td style="text-align: center;">
                    <span class="rank-badge ${p}">${l.rankNumber}</span>
                  </td>
                  <td><code>${Le(l.student.indexNumber||`GES-B7-${l.student.id}`)}</code></td>
                  <td style="font-weight: var(--font-weight-semibold);">${Le(l.student.name)}</td>
                  ${c.map(h=>{const m=l.lessonScores[h.id];return`<td style="text-align: center; color: ${m!==null?"var(--text-primary)":"var(--text-muted)"};">${m!==null?`${m}%`:"—"}</td>`}).join("")}
                  <td style="text-align: center; font-weight: bold; background: rgba(99, 102, 241, 0.04);">${l.sbaRaw}%</td>
                  <td style="text-align: center; background: rgba(56, 189, 248, 0.04);">${l.diagnosticRaw}%</td>
                  <td style="text-align: center; font-weight: bold; background: rgba(245, 158, 11, 0.04);">${l.examRaw}%</td>
                  <td style="text-align: center; font-weight: var(--font-weight-extrabold); font-size: var(--font-size-sm); color: var(--color-success-400); background: rgba(16, 185, 129, 0.06);">${l.totalPercentage}%</td>
                  <td style="text-align: center;">
                    <span class="badge badge--${l.bece.tone}">${l.bece.label} (${l.bece.letter})</span>
                  </td>
                  <td style="text-align: center;">
                    <button class="btn btn--ghost btn--xs btn-view-report-card" data-student-id="${l.student.id}">
                      Report Card
                    </button>
                  </td>
                </tr>
              `}).join(""):`
              <tr>
                <td colspan="${c.length+8}" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
                  No student records available for this class view.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

    </div>
  `}function Qt(e){z({onBack:()=>e("/dashboard")});const t=document.getElementById("gradebook-class-select");t&&t.addEventListener("change",async a=>{nt=a.target.value;const o=await jt(),i=document.getElementById("app");i&&(i.innerHTML=o,Qt(e))});const s=document.getElementById("btn-apply-weights");s&&s.addEventListener("click",async()=>{var c,u,l;const a=Number.parseInt((c=document.getElementById("weight-sba"))==null?void 0:c.value,10)||0,o=Number.parseInt((u=document.getElementById("weight-diag"))==null?void 0:u.value,10)||0,i=Number.parseInt((l=document.getElementById("weight-exam"))==null?void 0:l.value,10)||0;if(a+o+i!==100){T(`Weights must sum to 100% (currently ${a+o+i}%).`,"error");return}$n={sbaPercent:a,diagnosticPercent:o,examPercent:i},T("Gradebook weighting updated.","success");const r=await jt(),d=document.getElementById("app");d&&(d.innerHTML=r,Qt(e))});const n=document.getElementById("btn-export-broadsheet-csv");n&&n.addEventListener("click",()=>{if(!qe)return;const a=wr(qe),o=`broadsheet_${qe.classInfo.name.toLowerCase().replace(/[^a-z0-9]/g,"_")}.csv`;Qs(a,o),T("Broadsheet exported successfully.","success")}),document.querySelectorAll(".btn-view-report-card").forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.dataset.studentId;e(`/report-card/${i}`)})})}let $s=null;function F(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function _r(e=null){var _;const[t,s,n,a,o,i]=await Promise.all([te(),K(),ve(),lt(),ut(),fe()]);$s=e?Number.parseInt(e,10):(_=s[0])==null?void 0:_.id;const r=s.find(b=>b.id===$s)||s[0];if(!r)return`
      ${M({title:"Terminal Report Card",showBack:!0})}
      <div class="container view-enter" style="padding-top: var(--space-12); text-align: center;">
        <h2>No Student Learning Records Found</h2>
        <p class="text-secondary">Please add students or record quiz completions first.</p>
      </div>
    `;const d=Ir(r.id,{classes:t,students:s,results:n,progress:a,diagnostics:o,submissions:i});if(!d)return`
      ${M({title:"Terminal Report Card",showBack:!0})}
      <div class="container view-enter" style="padding-top: var(--space-12); text-align: center;">
        <h2>Unable to Generate Report Card</h2>
        <p class="text-secondary">Could not assemble academic data for this learner.</p>
      </div>
    `;const{student:c,studentClass:u,studentData:l,classTotalStudents:p,classAverage:h,strands:m,attendance:g,conduct:v,headmasterRemark:f}=d;return`
    ${M({title:"Student Terminal Report",showBack:!0})}
    <div class="container view-enter report-card-page" style="padding-top: var(--space-6);">

      <!-- Top Action Bar (hidden on print) -->
      <div class="report-card-nav-bar no-print">
        <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
          <label for="report-student-select" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">Select Student:</label>
          <select id="report-student-select" class="select-class">
            ${s.map(b=>`
              <option value="${b.id}" ${b.id===c.id?"selected":""}>
                ${F(b.name)} (${F(b.indexNumber||`GES-B7-${b.id}`)})
              </option>
            `).join("")}
          </select>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button class="btn btn--secondary btn--sm" id="btn-back-gradebook">Back to Broadsheet</button>
          <button class="btn btn--primary btn--sm" id="btn-print-report-card">🖨️ Print Terminal Report</button>
        </div>
      </div>

      <!-- Printable Report Document Sheet -->
      <div class="report-card-print-area">
        <div class="report-sheet">
          
          <!-- Header -->
          <div class="report-header">
            <div class="report-header__flag-strip"></div>
            <div class="report-header__republic">Republic of Ghana · Ministry of Education · GES</div>
            <h1 class="report-header__title">ClassConnect Demonstration JHS</h1>
            <div class="report-header__subtitle">Basic Education Certificate Continuous Assessment Terminal Report</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
              Academic Year: <strong>${F(u.academicYear||"2026/2027")}</strong> · Term: <strong>${F(u.term||"Term 1")}</strong>
            </div>
          </div>

          <!-- Student Profile Grid -->
          <div class="report-meta-grid">
            <div class="report-meta-item">
              <span class="report-meta-label">Pupil Name</span>
              <span class="report-meta-value">${F(c.name)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Student Index No.</span>
              <span class="report-meta-value">${F(c.indexNumber||`GES-B7-${c.id}`)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class & Stream</span>
              <span class="report-meta-value">${F(u.name)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Terminal Attendance</span>
              <span class="report-meta-value">${g.daysPresent} / ${g.totalDays} Days</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class Position / Rank</span>
              <span class="report-meta-value" style="color: #4338ca;">${l.rankOrdinal} of ${p}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class Average Score</span>
              <span class="report-meta-value">${h}%</span>
            </div>
          </div>

          <!-- Academic Performance Table -->
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th>Curriculum Strand / Subject Module</th>
                <th style="width: 85px; text-align: center;">Quiz Score</th>
                <th style="width: 85px; text-align: center;">Exam Mark</th>
                <th style="width: 90px; text-align: center;">Weighted %</th>
                <th>Teacher Competency Assessment</th>
              </tr>
            </thead>
            <tbody>
              ${m.map(b=>{const y=b.score!==null?`${b.score}%`:"Pending",I=l.examRaw!==null?`${l.examRaw}%`:"Pending",w=b.score!==null?`${Math.round(b.score*.4+(l.examRaw||0)*.6)}%`:"—";return`
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${b.id}</td>
                    <td>
                      <strong>${F(b.title)}</strong>
                      <div style="font-size: 10px; color: #64748b;">${F(b.strand)}</div>
                    </td>
                    <td style="text-align: center; font-weight: 600;">${y}</td>
                    <td style="text-align: center; font-weight: 600;">${I}</td>
                    <td style="text-align: center; font-weight: 700; color: #1e1b4b;">${w}</td>
                    <td style="font-size: 11px; color: #334155;">${F(b.remark)}</td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>

          <!-- Summary Score Ribbon -->
          <div class="report-summary-ribbon">
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Continuous SBA (30%)</span>
              <span class="report-summary-ribbon__value">${l.weightedSBA}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Terminal Exam (50%)</span>
              <span class="report-summary-ribbon__value">${l.weightedExam}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Overall Composite %</span>
              <span class="report-summary-ribbon__value" style="color: #15803d;">${l.totalPercentage}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Official BECE Grade</span>
              <span class="report-summary-ribbon__value" style="color: #4338ca;">
                ${l.bece.label} (${l.bece.letter})
              </span>
            </div>
          </div>

          <!-- Remarks & Recommendations -->
          <div class="report-remarks-box">
            <div class="report-remarks-title">Class Teacher's Appraisal & General Conduct</div>
            <div style="font-size: 12px; color: #1e293b; margin-bottom: 8px;">
              ${F(v)} ${F(l.bece.remark)}
            </div>
          </div>

          <div class="report-remarks-box">
            <div class="report-remarks-title">Headmaster / Principal's Terminal Remark</div>
            <div style="font-size: 12px; color: #1e293b;">
              ${F(f)}
            </div>
          </div>

          <!-- Signature Blocks -->
          <div class="report-signatures-grid">
            <div>
              <div class="report-sig-line">
                <strong>${F(u.teacherName||"Class Teacher")}</strong><br>
                Class Teacher Signature & Date
              </div>
            </div>
            <div>
              <div class="report-sig-line">
                <strong>Headmaster / School Authority</strong><br>
                Official School Stamp & Signature
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `}function Sr(e,t){z({onBack:()=>e("/gradebook")});const s=document.getElementById("report-student-select");s&&s.addEventListener("change",o=>{e(`/report-card/${o.target.value}`)});const n=document.getElementById("btn-back-gradebook");n&&n.addEventListener("click",()=>{e("/gradebook")});const a=document.getElementById("btn-print-report-card");a&&a.addEventListener("click",()=>{window.print()})}const Ue=new Map;let Be=null;function Ve(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function An(){const e=mt(),t=[...Ue.values()].sort((s,n)=>String(s.studentName||s.clientId).localeCompare(String(n.studentName||n.clientId)));return`
    <div class="container view-enter lab-monitor-page">
      <section class="card card--glass lab-monitor-hero">
        <div><div class="assessment-hero__eyebrow">Exam Control</div><h1 class="assessment-hero__title">Live classroom monitor</h1><p class="assessment-hero__text">Keep this teacher tab open while students work. Status is relayed only across the local Vite lab host.</p></div>
        <div class="lab-monitor-actions"><button class="btn btn--secondary" id="lab-new-room">${e?"New lab session":"Start lab session"}</button><button class="btn btn--primary" id="lab-unlock">Unlock assessment</button><button class="btn btn--warning" id="lab-lock">Lock all screens</button><button class="btn btn--danger" id="lab-submit">Force submit all</button></div>
        ${e?`<div class="lab-join"><strong>Student link:</strong> <code>${Ve(bn(e))}</code><button class="btn btn--ghost btn--sm" id="lab-copy-link">Copy</button><span>Open this link on each PC (or turn it into a QR code using the browser’s Share menu).</span></div>`:""}
      </section>
      <div class="lab-monitor-summary"><span>${t.length} active PC${t.length===1?"":"s"}</span><span class="badge badge--danger" id="lab-alert-count">${t.filter(s=>s.alert).length} proctor alert${t.filter(s=>s.alert).length===1?"":"s"}</span></div>
      <section class="lab-monitor-grid">${t.length?t.map(s=>`<article class="card lab-student-card ${s.alert?"lab-student-card--alert":""}"><div class="lab-student-card__head"><strong>${Ve(s.studentName||s.clientId||"Student PC")}</strong><span class="badge badge--${s.alert?"danger":s.status==="Completed"?"success":"primary"}">${Ve(s.status||"Connected")}</span></div><p>${Ve(s.detail||"Waiting for activity")}</p><small>Last seen ${new Date(s.sentAt||Date.now()).toLocaleTimeString()}</small>${s.alert?'<div class="lab-alert">Fullscreen exit or hidden tab detected</div>':""}</article>`).join(""):'<div class="card insight-empty">No student PCs have reported yet. Share the student link above and keep this page open.</div>'}</section>
    </div>`}function Cn(){const e=document.getElementById("lab-monitor-root");e&&(e.innerHTML=An()),Ln()}function Ln(){var e,t,s,n,a;(e=document.getElementById("lab-new-room"))==null||e.addEventListener("click",()=>{ir(),Ue.clear(),Cn()}),(t=document.getElementById("lab-unlock"))==null||t.addEventListener("click",()=>xt()),(s=document.getElementById("lab-lock"))==null||s.addEventListener("click",()=>xt()),(n=document.getElementById("lab-submit"))==null||n.addEventListener("click",()=>xt()),(a=document.getElementById("lab-copy-link"))==null||a.addEventListener("click",async()=>{var o;await((o=navigator.clipboard)==null?void 0:o.writeText(bn()))})}function kr(){return`${M({title:"Lab Monitor",showBack:!0,showLogout:!0})}<div id="lab-monitor-root">${An()}</div>`}function xr(e){z({onBack:()=>e("/dashboard")}),Be=yn(t=>{if(t.type!=="status")return;const s=t.clientId||t.studentId||t.studentName||$r();Ue.set(s,t),Cn()}),Ln()}function $r(){return`pc-${Ue.size+1}`}function Ar(){Be==null||Be(),Be=null,Ue.clear()}let k=window.location.pathname;const $t=document.getElementById("app"),Cr=4e3;async function Lr(){let e;try{await Promise.race([Kn(),new Promise((t,s)=>{e=window.setTimeout(()=>{s(new Error("Saved settings did not load in time."))},Cr)})])}finally{window.clearTimeout(e)}}async function N(e,t=!0){t&&e!==window.location.pathname&&window.history.pushState({},"",e),k=e,await me()}window.addEventListener("popstate",()=>{k=window.location.pathname,me()});function Tr(e){return e==="/lessons"||e==="/diagnostic"||e==="/assessments"||e.startsWith("/diagnostic-results/")||e.startsWith("/assessment/")||e.startsWith("/assessment-results/")||e.startsWith("/lesson/")||e.startsWith("/quiz/")||e.startsWith("/quiz-results/")||e==="/tutor"}async function me(){k==="/dashboard"&&!ds()&&(k="/teacher-login",window.history.replaceState({},"","/teacher-login")),(k==="/assessment-lab"||k==="/lab-monitor")&&!ds()&&(k="/teacher-login",window.history.replaceState({},"","/teacher-login")),Tr(k)&&!R()&&(k="/student-login",window.history.replaceState({},"","/student-login"));const e=document.getElementById("app-loader");e&&!e.classList.contains("hidden")&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),1e3)),k.startsWith("/quiz/")||bi(),k!=="/diagnostic"&&ln(),k.startsWith("/assessment/")||cr(),k!=="/dashboard"&&Qe(),k!=="/lab-monitor"&&Ar(),$t.firstElementChild&&($t.firstElementChild.classList.add("view-exit"),await new Promise(n=>setTimeout(n,200)));let t="",s=()=>{};if(k==="/"||k==="/index.html")t=Aa(),s=()=>Ca(N);else if(k==="/student-login")t=await Da(),s=()=>Ma(N);else if(k==="/teacher-login")t=Ra(),s=()=>Pa(N);else if(k==="/lessons")t=await Ya(),s=()=>Va(N);else if(k==="/assessments")t=await zo(),s=()=>jo(N);else if(k==="/diagnostic")so(),t=no(),s=()=>ao(N,me);else if(k.startsWith("/diagnostic-results/")){const n=k.split("/")[2];t=await go(n),s=()=>vo(N,n)}else if(k.startsWith("/lesson/")){const n=Number.parseInt(k.split("/")[2],10);t=await Ja(n),s=()=>Za(N,n)}else if(k.startsWith("/quiz/")){const n=Number.parseInt(k.split("/")[2],10);fi(n),t=yi(),s=()=>wi(N,me,n)}else if(k.startsWith("/quiz-results/")){const n=k.split("/")[2];t=await _i(n),s=()=>Si(N,n)}else if(k.startsWith("/assessment-results/")){const n=k.split("/")[2];t=await hr(n),s=()=>gr(N,n)}else if(k.startsWith("/assessment/")){const n=Number.parseInt(k.split("/")[2],10);await rr(n),t=pr(),s=()=>mr(N,me)}else if(k==="/tutor")t=await Io(),s=()=>_o(N,me);else if(k==="/assessment-lab")t=await No(),s=()=>qo(N);else if(k==="/lab-monitor")t=kr(),s=()=>xr(N);else if(k==="/gradebook")t=await jt(),s=()=>Qt(N);else if(k==="/report-card"||k.startsWith("/report-card/")){const n=k.split("/")[2]||null;t=await _r(n),s=()=>Sr(N)}else if(k==="/dashboard")t=await Fi(),s=()=>Gi(N);else{N("/",!1);return}$t.innerHTML=t,setTimeout(s,0),window.scrollTo(0,0)}window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).has("capture")?0:1500;setTimeout(async()=>{try{await Lr()}catch(s){console.error("Unable to load saved ClassConnect settings.",s)}xa(),await me()},t)});
