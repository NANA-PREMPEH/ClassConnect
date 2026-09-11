(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();const si="modulepreload",ni=function(e){return"/"+e},Ca={},sa=function(t,s,a){let n=Promise.resolve();if(s&&s.length>0){let o=function(l){return Promise.all(l.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),c=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));n=o(s.map(l=>{if(l=ni(l),l in Ca)return;Ca[l]=!0;const d=l.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":si,d||(p.as="script"),p.crossOrigin="",p.href=l,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((m,h)=>{p.addEventListener("load",m),p.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=o,window.dispatchEvent(i),!i.defaultPrevented)throw o}return n.then(o=>{for(const i of o||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})},xn=(e,t)=>t.some(s=>e instanceof s);let xa,Ea;function ai(){return xa||(xa=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ri(){return Ea||(Ea=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const En=new WeakMap,Ps=new WeakMap,gs=new WeakMap;function oi(e){const t=new Promise((s,a)=>{const n=()=>{e.removeEventListener("success",r),e.removeEventListener("error",o)},r=()=>{s(st(e.result)),n()},o=()=>{a(e.error),n()};e.addEventListener("success",r),e.addEventListener("error",o)});return gs.set(t,e),t}function ii(e){if(En.has(e))return;const t=new Promise((s,a)=>{const n=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",o),e.removeEventListener("abort",o)},r=()=>{s(),n()},o=()=>{a(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",r),e.addEventListener("error",o),e.addEventListener("abort",o)});En.set(e,t)}let Ln={get(e,t,s){if(e instanceof IDBTransaction){if(t==="done")return En.get(e);if(t==="store")return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return st(e[t])},set(e,t,s){return e[t]=s,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Br(e){Ln=e(Ln)}function ci(e){return ri().includes(e)?function(...t){return e.apply(Bn(this),t),st(this.request)}:function(...t){return st(e.apply(Bn(this),t))}}function li(e){return typeof e=="function"?ci(e):(e instanceof IDBTransaction&&ii(e),xn(e,ai())?new Proxy(e,Ln):e)}function st(e){if(e instanceof IDBRequest)return oi(e);if(Ps.has(e))return Ps.get(e);const t=li(e);return t!==e&&(Ps.set(e,t),gs.set(t,e)),t}const Bn=e=>gs.get(e);function Tr(e,t,{blocked:s,upgrade:a,blocking:n,terminated:r}={}){const o=indexedDB.open(e,t),i=st(o);return a&&o.addEventListener("upgradeneeded",c=>{a(st(o.result),c.oldVersion,c.newVersion,st(o.transaction),c)}),s&&o.addEventListener("blocked",c=>s(c.oldVersion,c.newVersion,c)),i.then(c=>{r&&c.addEventListener("close",()=>r()),n&&c.addEventListener("versionchange",l=>n(l.oldVersion,l.newVersion,l))}).catch(()=>{}),i}const di=["get","getKey","getAll","getAllKeys","count"],ui=["put","add","delete","clear"],zs=new Map;function La(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(zs.get(t))return zs.get(t);const s=t.replace(/FromIndex$/,""),a=t!==s,n=ui.includes(s);if(!(s in(a?IDBIndex:IDBObjectStore).prototype)||!(n||di.includes(s)))return;const r=async function(o,...i){const c=this.transaction(o,n?"readwrite":"readonly");let l=c.store;return a&&(l=l.index(i.shift())),(await Promise.all([l[s](...i),n&&c.done]))[0]};return zs.set(t,r),r}Br(e=>({...e,get:(t,s,a)=>La(t,s)||e.get(t,s,a),has:(t,s)=>!!La(t,s)||e.has(t,s)}));const mi=["continue","continuePrimaryKey","advance"],Ba={},Tn=new WeakMap,Dr=new WeakMap,pi={get(e,t){if(!mi.includes(t))return e[t];let s=Ba[t];return s||(s=Ba[t]=function(...a){Tn.set(this,Dr.get(this)[t](...a))}),s}};async function*hi(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const s=new Proxy(t,pi);for(Dr.set(s,t),gs.set(s,Bn(t));t;)yield s,t=await(Tn.get(s)||t.continue()),Tn.delete(s)}function Ta(e,t){return t===Symbol.asyncIterator&&xn(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&xn(e,[IDBIndex,IDBObjectStore])}Br(e=>({...e,get(t,s,a){return Ta(t,s)?hi:e.get(t,s,a)},has(t,s){return Ta(t,s)||e.has(t,s)}}));const gi="classconnect-sync",na="outbox",fi=new Set(["classes","students","progress","quizResults","diagnostics","assessments","assessmentSubmissions"]);async function Mr(){return Tr(gi,1,{upgrade(e){e.createObjectStore(na,{keyPath:"operationId"})}})}async function vi(e){if(!fi.has(e.store)||!e.record)return;const t=await Mr(),s={operationId:crypto.randomUUID(),entity:e.store,action:e.action,entityLocalId:String(e.record.id??e.record.studentId??""),payload:e.record,occurredAt:e.timestamp,attempts:0};await t.put(na,s)}async function bi(){return(await Mr()).count(na)}async function yi(){return{synced:0,pending:await bi()}}function wi(){const e=()=>{yi()};return window.addEventListener("online",e),e(),()=>window.removeEventListener("online",e)}const Ii="classconnect",qr=9,zt="settings",Pe="feedbackCache",Dn="classconnect:datachange",Si="classconnect-data-sync",fs="cc_teacherAuthenticated",aa="cc_currentStudent",Nr="cc_staffClassContext",ki=["apiKey","teacherPin","theme"],ae=Object.freeze({ADMIN:"admin",TEACHER:"teacher",INVIGILATOR:"invigilator"}),Ge=Object.freeze({[ae.ADMIN]:"Administrator / Headmaster",[ae.TEACHER]:"Subject Teacher",[ae.INVIGILATOR]:"Lab Technician / Invigilator"}),_i=Object.freeze({[ae.ADMIN]:["dashboard","classes.manage","roster.manage","gradebook","assessment.manage","lab.monitor","cms.manage","data.export","backup.manage","users.manage","audit.view"],[ae.TEACHER]:["dashboard","roster.manage","gradebook","assessment.manage","cms.manage"],[ae.INVIGILATOR]:["lab.monitor"]});function vs(e,t=ws()){return!!(t!=null&&t.authenticated)&&(_i[t.role]||[]).includes(e)}function $i(e=ws()){return!e||e.role===ae.ADMIN?null:Array.isArray(e.classIds)?e.classIds.map(Number):[]}let lt=null,js=null;var ss,Lr;const Rr=((Lr=(ss=globalThis.crypto)==null?void 0:ss.randomUUID)==null?void 0:Lr.call(ss))||`cc-${Date.now()}-${Math.random().toString(16).slice(2)}`;function Pr(){return typeof BroadcastChannel>"u"?null:(js||(js=new BroadcastChannel(Si)),js)}function ie(e,t,s=null){var n;const a={store:e,action:t,recordId:(s==null?void 0:s.id)??(s==null?void 0:s.studentId)??(s==null?void 0:s.cacheKey)??null,timestamp:new Date().toISOString(),sourceId:Rr};typeof window<"u"&&window.dispatchEvent(new CustomEvent(Dn,{detail:a}));try{(n=Pr())==null||n.postMessage(a)}catch{}return vi({...a,record:s}),a}function Ai(e){const t=n=>{n!=null&&n.detail&&e(n.detail)};typeof window<"u"&&window.addEventListener(Dn,t);const s=Pr(),a=n=>{!(n!=null&&n.data)||n.data.sourceId===Rr||e(n.data)};return s==null||s.addEventListener("message",a),()=>{typeof window<"u"&&window.removeEventListener(Dn,t),s==null||s.removeEventListener("message",a)}}function Ci(e,t=null){if(!e.objectStoreNames.contains("classes")){const s=e.createObjectStore("classes",{keyPath:"id",autoIncrement:!0});s.createIndex("gradeLevel","gradeLevel",{unique:!1}),s.createIndex("academicYear","academicYear",{unique:!1})}if(e.objectStoreNames.contains("students")){if(t){const s=t.objectStore("students");s.indexNames.contains("classId")||s.createIndex("classId","classId",{unique:!1}),s.indexNames.contains("indexNumber")||s.createIndex("indexNumber","indexNumber",{unique:!1})}}else{const s=e.createObjectStore("students",{keyPath:"id",autoIncrement:!0});s.createIndex("name","name",{unique:!1}),s.createIndex("classId","classId",{unique:!1}),s.createIndex("indexNumber","indexNumber",{unique:!1})}if(e.objectStoreNames.contains("progress")||e.createObjectStore("progress",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),!e.objectStoreNames.contains("quizResults")){const s=e.createObjectStore("quizResults",{keyPath:"id",autoIncrement:!0});s.createIndex("studentId","studentId",{unique:!1}),s.createIndex("lessonId","lessonId",{unique:!1})}if(e.objectStoreNames.contains("diagnostics")||e.createObjectStore("diagnostics",{keyPath:"id",autoIncrement:!0}).createIndex("studentId","studentId",{unique:!1}),e.objectStoreNames.contains("tutorThreads")||e.createObjectStore("tutorThreads",{keyPath:"studentId"}),e.objectStoreNames.contains("assessments")||e.createObjectStore("assessments",{keyPath:"id",autoIncrement:!0}).createIndex("createdAt","createdAt",{unique:!1}),!e.objectStoreNames.contains("assessmentSubmissions")){const s=e.createObjectStore("assessmentSubmissions",{keyPath:"id",autoIncrement:!0});s.createIndex("assessmentId","assessmentId",{unique:!1}),s.createIndex("studentId","studentId",{unique:!1})}if(!e.objectStoreNames.contains(Pe)){const s=e.createObjectStore(Pe,{keyPath:"cacheKey"});s.createIndex("questionId","questionId",{unique:!1}),s.createIndex("updatedAt","updatedAt",{unique:!1})}if(e.objectStoreNames.contains(zt)||e.createObjectStore(zt,{keyPath:"key"}),e.objectStoreNames.contains("customLessons")||e.createObjectStore("customLessons",{keyPath:"id",autoIncrement:!0}).createIndex("strand","strand",{unique:!1}),e.objectStoreNames.contains("questionBank")||e.createObjectStore("questionBank",{keyPath:"id",autoIncrement:!0}).createIndex("type","type",{unique:!1}),!e.objectStoreNames.contains("users")){const s=e.createObjectStore("users",{keyPath:"id",autoIncrement:!0});s.createIndex("username","username",{unique:!0}),s.createIndex("role","role",{unique:!1})}e.objectStoreNames.contains("auditLog")||e.createObjectStore("auditLog",{keyPath:"id",autoIncrement:!0}).createIndex("createdAt","createdAt",{unique:!1})}function M(){return lt||(lt=Tr(Ii,qr,{upgrade(e,t,s,a){Ci(e,a)},blocked(e,t,s){console.warn(`[ClassConnect] IndexedDB upgrade blocked (v${e} → v${t}). Close other ClassConnect tabs or clear site data, then try again.`)},blocking(e,t,s){s.target.close(),lt=null},terminated(){lt=null}}).catch(e=>{throw lt=null,e})),lt}function zr(e){try{return localStorage.getItem(`cc_${e}`)}catch{return null}}function jr(e,t){try{if(t==null||t===""){localStorage.removeItem(`cc_${e}`);return}localStorage.setItem(`cc_${e}`,t)}catch{}}async function Or(e,t){await(await M()).put(zt,{key:e,value:t,updatedAt:new Date().toISOString()})}async function xi(){const e=await M();try{await oa(e)}catch(t){console.warn("[ClassConnect] Default class migration notice:",t)}await Promise.all(ki.map(async t=>{const s=await e.get(zt,t);if(s!=null&&s.value){jr(t,s.value);return}const a=zr(t);a&&await Or(t,a)}))}function G(e){return zr(e)}function ra(e,t){jr(e,t),Or(e,t)}function Ei(){return G("teacherPin")}async function oa(e=null){const t=e||await M();let a=(await t.getAll("classes"))[0];if(!a){const i=new Date().toISOString();a={id:await t.add("classes",{name:"B7 — JHS 1A",gradeLevel:"B7",stream:"1A",academicYear:"2026/2027",term:"Term 1",teacherName:"Class Teacher",createdAt:i}),name:"B7 — JHS 1A",gradeLevel:"B7",stream:"1A",academicYear:"2026/2027",term:"Term 1",teacherName:"Class Teacher",createdAt:i},ie("classes","create",a)}const n=await t.getAll("students"),r=t.transaction("students","readwrite");let o=0;for(const i of n){let c=!1;i.classId||(i.classId=a.id,c=!0),i.status||(i.status="active",c=!0),i.gender||(i.gender="unspecified",c=!0),i.indexNumber||(i.indexNumber=`GES-B7-${String(i.id).padStart(4,"0")}`,c=!0),c&&(await r.store.put(i),o+=1)}return await r.done,{defaultClass:a,migratedCount:o}}async function Fr(e){var o,i;const t=await M(),s=new Date().toISOString(),a={name:((o=e.name)==null?void 0:o.trim())||`${e.gradeLevel||"B7"} — ${e.stream||"Stream A"}`,gradeLevel:e.gradeLevel||"B7",stream:e.stream||"A",academicYear:e.academicYear||"2026/2027",term:e.term||"Term 1",teacherName:((i=e.teacherName)==null?void 0:i.trim())||"Class Teacher",createdAt:s},n=await t.add("classes",a),r={...a,id:n};return ie("classes","create",r),r}async function de(){const e=await M(),t=await e.getAll("classes");if(t.length===0){const{defaultClass:s}=await oa(e);return s?[s]:[]}return t}async function Li(e,t,s={}){var d,u;const a=await M(),n=await Bi(e,t);if(n)return n;let r=s.classId;r||(r=((d=(await de())[0])==null?void 0:d.id)||1);const o=new Date().toISOString(),i={name:e.trim(),pin:t,classId:r,indexNumber:((u=s.indexNumber)==null?void 0:u.trim())||null,gender:s.gender||"unspecified",status:s.status||"active",createdAt:o},c=await a.add("students",i);i.indexNumber||(i.indexNumber=`GES-B7-${String(c).padStart(4,"0")}`,await a.put("students",{...i,id:c}));const l={...i,id:c};return ie("students","create",l),l}async function Bi(e,t){return(await(await M()).getAllFromIndex("students","name",e.trim())).find(n=>n.pin===t)||null}async function Ti(e,t){const s=await M(),a=(e||"").trim().toLowerCase();if(!a)return null;const n=await s.getAll("students"),r=n.find(i=>i.indexNumber&&i.indexNumber.trim().toLowerCase()===a&&i.pin===t);return r||n.find(i=>i.name&&i.name.trim().toLowerCase()===a&&i.pin===t)||null}async function Ur(e,t){const s=await M(),a=await s.get("students",e);if(!a)return null;const n={...a,...t,id:e,updatedAt:new Date().toISOString()};return await s.put("students",n),ie("students","update",n),await pe(t.pin?"student-pin.reset":"student-record.updated",{studentId:e,fields:Object.keys(t)}),n}async function Di(e,t){if(!/^\d{4}$/.test(t))throw new Error("PIN must be exactly 4 numeric digits.");return Ur(e,{pin:t})}async function Mi(e){var o,i;const t=await M(),s={created:[],updated:[],errors:[]},a=await t.getAll("students"),n=t.transaction("students","readwrite"),r=n.store;for(const c of e)try{const l=(o=c.name)==null?void 0:o.trim(),d=(i=c.indexNumber)==null?void 0:i.trim();if(!l){s.errors.push({item:c,error:"Student name is required."});continue}let u=null;if(d&&(u=a.find(p=>p.indexNumber&&p.indexNumber.toLowerCase()===d.toLowerCase())),u||(u=a.find(p=>p.name&&p.name.toLowerCase()===l.toLowerCase()&&p.classId===(c.classId||p.classId))),u){const p={...u,...c,id:u.id,name:l,indexNumber:d||u.indexNumber,updatedAt:new Date().toISOString()};await r.put(p),s.updated.push(p)}else{const p=c.pin&&/^\d{4}$/.test(c.pin)?c.pin:String(Math.floor(1e3+Math.random()*9e3)),m={name:l,pin:p,classId:c.classId||1,indexNumber:d||null,gender:c.gender||"unspecified",status:c.status||"active",createdAt:new Date().toISOString()},h=await r.add(m);m.indexNumber||(m.indexNumber=`GES-B7-${String(h).padStart(4,"0")}`,await r.put({...m,id:h})),s.created.push({...m,id:h})}}catch(l){s.errors.push({item:c,error:l.message})}return await n.done,ie("students","bulk",s),s}async function we(){return(await M()).getAll("students")}async function qi(e,t){const s=await M(),n=(await xe(e)).find(c=>c.lessonId===t);if(n)return n;const r=result.completedAt||new Date().toISOString(),i={id:await s.add("progress",{studentId:e,lessonId:t,completedAt:r}),studentId:e,lessonId:t,completedAt:r};return ie("progress","create",i),i}async function xe(e){return(await M()).getAllFromIndex("progress","studentId",e)}async function bs(){return(await M()).getAll("progress")}async function Ni(e,t){return(await xe(e)).some(a=>a.lessonId===t)}async function ia(e){const t=await M(),s=new Date().toISOString(),a={...e,completedAt:s},n=await t.add("quizResults",a),r={...a,id:n};return ie("quizResults","create",r),r}async function at(e){return(await M()).getAllFromIndex("quizResults","studentId",e)}async function ze(){return(await M()).getAll("quizResults")}async function Ri(e){const t=await M(),s=new Date().toISOString(),a={...e,completedAt:s},n=await t.add("diagnostics",a),r={...a,id:n};return ie("diagnostics","create",r),r}async function Qr(e){return(await M()).get("diagnostics",e)}async function Pi(e){return(await M()).getAllFromIndex("diagnostics","studentId",e)}async function Me(e){return(await Pi(e)).slice().sort((s,a)=>new Date(a.completedAt)-new Date(s.completedAt))[0]||null}async function ys(){return(await M()).getAll("diagnostics")}async function zi(e){return(await M()).get("tutorThreads",e)}async function Da(e,t){const s=await M(),a={studentId:e,messages:t.slice(-20),updatedAt:new Date().toISOString()};return await s.put("tutorThreads",a),ie("tutorThreads","upsert",a),a}async function ji(e){await(await M()).delete("tutorThreads",e),ie("tutorThreads","delete",{studentId:e})}async function Oi(e){const t=await M(),s={...e,status:e.status||"open",createdAt:e.createdAt||new Date().toISOString()},a=await t.add("assessments",s),n={...s,id:a};return ie("assessments","create",n),await pe("assessment.released",{assessmentId:a,title:n.title}),n}async function Fi(e){return(await M()).get("assessments",e)}async function Qt(){return(await M()).getAll("assessments")}async function ca(e){const t=await M(),s={...e,completedAt:e.completedAt||new Date().toISOString()},a=await t.add("assessmentSubmissions",s),n={...s,id:a};return ie("assessmentSubmissions","create",n),n}async function Hr(e){return(await M()).getAllFromIndex("assessmentSubmissions","studentId",e)}async function je(){return(await M()).getAll("assessmentSubmissions")}async function Ui(e){return(await M()).get(Pe,e)}async function Qi(e){return(await M()).getAllFromIndex(Pe,"questionId",e)}async function Hi(e){const t=await M(),s=await t.get(Pe,e.cacheKey),a=new Date().toISOString(),n={...s,...e,createdAt:(s==null?void 0:s.createdAt)||e.createdAt||a,updatedAt:a,usageCount:e.usageCount||(s?(s.usageCount||0)+1:1),lastUsedAt:e.lastUsedAt||a};return await t.put(Pe,n),n}async function la(e){const t=await M(),s=await t.get(Pe,e);if(!s)return null;const a={...s,usageCount:(s.usageCount||0)+1,lastUsedAt:new Date().toISOString()};return await t.put(Pe,a),a}function Gi(e){sessionStorage.setItem(aa,JSON.stringify(e))}function K(){try{const e=sessionStorage.getItem(aa);return e?JSON.parse(e):null}catch{return null}}function Wi(){sessionStorage.removeItem(aa),sa(async()=>{const{signOutFromSupabase:e}=await Promise.resolve().then(()=>ro);return{signOutFromSupabase:e}},void 0).then(({signOutFromSupabase:e})=>e())}function ws(){try{return JSON.parse(sessionStorage.getItem(fs)||"null")}catch{return null}}function Os(e){sessionStorage.setItem(fs,JSON.stringify({authenticated:!0,userId:e.id,username:e.username,name:e.name||e.username,role:e.role,classIds:e.classIds||[],updatedAt:new Date().toISOString()})),ra("activeTeacher",e.username)}function Kt(){var e;try{const t=sessionStorage.getItem(fs);return!!(t&&((e=JSON.parse(t))!=null&&e.authenticated))}catch{return!1}}function Is(){sessionStorage.removeItem(fs),sa(async()=>{const{signOutFromSupabase:e}=await Promise.resolve().then(()=>ro);return{signOutFromSupabase:e}},void 0).then(({signOutFromSupabase:e})=>e())}function Ss(e=[],t="all"){sessionStorage.setItem(Nr,JSON.stringify({classes:e.map(s=>({id:s.id,name:s.name})),selectedClassId:String(t)}))}function ks(){try{return JSON.parse(sessionStorage.getItem(Nr)||'{"classes":[],"selectedClassId":"all"}')}catch{return{classes:[],selectedClassId:"all"}}}async function Gr(e){const t=await M(),s={...e,updatedAt:new Date().toISOString(),createdAt:e.createdAt||new Date().toISOString()},a=e.id?(await t.put("customLessons",s),e.id):await t.add("customLessons",s),n={...s,id:a};return ie("customLessons",e.id?"update":"create",n),await pe("lesson.saved",{lessonId:a,title:s.title}),n}async function _s(){return(await M()).getAll("customLessons")}async function Vi(){return{app:"ClassConnect",type:"ccpack",version:1,exportedAt:new Date().toISOString(),lessons:await _s(),questions:await Ht()}}async function Ki(e){if(!e||e.app!=="ClassConnect"||e.type!=="ccpack")throw new Error("This is not a ClassConnect lesson pack.");const t=Array.isArray(e.lessons)?e.lessons:[],s=Array.isArray(e.questions)?e.questions:[];for(const a of t){const{id:n,...r}=a;await Gr(r)}for(const a of s){const{id:n,...r}=a;await Wr(r)}return await pe("lesson-pack.imported",{lessons:t.length,questions:s.length}),{lessons:t.length,questions:s.length}}async function Wr(e){const t=await M(),s={...e,updatedAt:new Date().toISOString(),createdAt:e.createdAt||new Date().toISOString()},a=e.id?(await t.put("questionBank",s),e.id):await t.add("questionBank",s),n={...s,id:a};return ie("questionBank",e.id?"update":"create",n),await pe("question.saved",{questionId:a,type:s.type}),n}async function Ht(){return(await M()).getAll("questionBank")}async function $s(e){const t=Object.values(ae).includes(e.role)?e.role:ae.TEACHER,s=String(e.username||"").trim().toLowerCase(),a=String(e.pin||"").trim();if(!/^[a-z0-9._-]{3,40}$/.test(s))throw new Error("Username must use 3-40 letters, numbers, dots, dashes, or underscores.");if(!/^\d{4,8}$/.test(a))throw new Error("Account PIN must contain 4 to 8 digits.");const n=await M(),r={...e,username:s,pin:a,role:t,classIds:Array.isArray(e.classIds)?e.classIds.map(Number).filter(Number.isFinite):[],failedAttempts:0,lockedUntil:null,createdAt:new Date().toISOString()},o=await n.add("users",r),i={...r,id:o};return await pe("user.created",{userId:o,username:r.username,role:r.role}),i}async function Yi(e,t){const s=String(e||"").trim().toLowerCase(),a=await M(),n=await a.getFromIndex("users","username",s);if(!n)return{user:null,error:"Invalid username or PIN."};if(n.lockedUntil&&new Date(n.lockedUntil)>new Date)return{user:null,error:`Account is locked until ${new Date(n.lockedUntil).toLocaleTimeString()}.`};if(n.pin!==String(t||"").trim()){const o=(n.failedAttempts||0)+1,i=o>=5?new Date(Date.now()+300*1e3).toISOString():null;return await a.put("users",{...n,failedAttempts:i?0:o,lockedUntil:i,updatedAt:new Date().toISOString()}),await pe("user.login_failed",{userId:n.id,username:n.username,locked:!!i}),{user:null,error:i?"Too many failed attempts. Account locked for 5 minutes.":"Invalid username or PIN."}}const r={...n,failedAttempts:0,lockedUntil:null,lastLoginAt:new Date().toISOString()};return await a.put("users",r),await pe("user.login",{userId:n.id,username:n.username}),{user:r,error:null}}async function Ji(e,t){const s=await M(),a=await s.get("users",e);if(!a)throw new Error("User not found.");const n=t.role===void 0?a.role:t.role;if(!Object.values(ae).includes(n))throw new Error("Invalid user role.");const r={...a,...t,role:n,classIds:Array.isArray(t.classIds)?t.classIds.map(Number).filter(Number.isFinite):a.classIds||[],id:e,updatedAt:new Date().toISOString()};return await s.put("users",r),await pe("user.updated",{userId:e,role:r.role}),r}async function Zi(e){const t=await M(),s=await t.get("users",e);if((s==null?void 0:s.role)===ae.ADMIN&&(await t.getAllFromIndex("users","role",ae.ADMIN)).length<=1)throw new Error("Keep at least one administrator account.");await t.delete("users",e),await pe("user.deleted",{userId:e})}async function vt(){return(await M()).getAll("users")}async function Xi(){const e=await vt();if(e.length)return e;const t=Ei();return!t||!/^\d{4}$/.test(t)?e:(await $s({username:"admin",name:"School Administrator",pin:t,role:ae.ADMIN}),vt())}async function pe(e,t={}){const a=await(await M()).add("auditLog",{action:e,detail:t,actor:G("activeTeacher")||"teacher",createdAt:new Date().toISOString()});return ie("auditLog","create",{id:a,action:e}),a}async function As(){return(await(await M()).getAll("auditLog")).sort((t,s)=>new Date(s.createdAt)-new Date(t.createdAt))}async function ec(){var a;const e=await we(),t=await ze();let s=`Student Name,Lesson,Score,Total Questions,Ability (theta),Level,Completed At,Total Time (s)
`;for(const n of t){const r=e.find(c=>c.id===n.studentId),o=r?r.name:"Unknown",i=Math.round((n.totalTimeMs||0)/1e3);s+=`"${o}",${n.lessonId},${n.score},${n.totalQuestions},${((a=n.theta)==null?void 0:a.toFixed(2))||"N/A"},${n.level||"N/A"},"${n.completedAt}",${i}
`}return await pe("student-records.exported",{format:"csv",studentCount:e.length}),s}function Vr(e,t="classconnect_data.csv"){const s=new Blob([e],{type:"text/csv;charset=utf-8;"}),a=URL.createObjectURL(s),n=document.createElement("a");n.href=a,n.download=t,n.click(),URL.revokeObjectURL(a)}const tc=["classes","students","progress","quizResults","diagnostics","tutorThreads","assessments","assessmentSubmissions","customLessons","questionBank","users","auditLog",Pe,zt];async function sc(){const e=await M(),t={};for(const s of tc)e.objectStoreNames.contains(s)&&(t[s]=await e.getAll(s));return{app:"ClassConnect",schemaVersion:qr,exportedAt:new Date().toISOString(),data:t}}async function nc(){const e=await sc(),t=JSON.stringify(e,null,2),s=new Date().toISOString().slice(0,10),a=new Blob([t],{type:"application/json;charset=utf-8;"}),n=URL.createObjectURL(a),r=document.createElement("a");return r.href=n,r.download=`classconnect_school_backup_${s}.json`,r.click(),URL.revokeObjectURL(n),await pe("school-backup.exported",{format:"json"}),e}async function ac(e,t="merge"){if(!e||e.app!=="ClassConnect"||!e.data)throw new Error("Invalid ClassConnect backup file. Expected valid JSON with app metadata.");const s=await M(),a={};for(const[n,r]of Object.entries(e.data)){if(!s.objectStoreNames.contains(n)||!Array.isArray(r))continue;const o=s.transaction(n,"readwrite");t==="overwrite"&&await o.store.clear();let i=0;for(const c of r)await o.store.put(c),i+=1;await o.done,a[n]=i}return await oa(s),ie("all","restore",a),a}const rc="dark";function Kr(e){return e==="light"?"light":rc}function da(){return Kr(G("theme"))}function Yr(e){const t=Kr(e);return document.documentElement.dataset.theme=t,document.documentElement.style.colorScheme=t,t}function oc(e){const t=Yr(e);return ra("theme",t),t}function ic(){return oc(da()==="dark"?"light":"dark")}function cc(){return Yr(da())}function Jr(){return"speechSynthesis"in window?window.speechSynthesis.getVoices():[]}function Zr(e,{onEnd:t}={}){if(!("speechSynthesis"in window)||!e)return!1;window.speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(e.replace(/<[^>]*>/g," "));s.rate=Number(G("speechRate")||1),s.pitch=Number(G("speechPitch")||1);const a=G("speechVoice");return a&&(s.voice=Jr().find(n=>n.name===a)||null),t&&s.addEventListener("end",t,{once:!0}),window.speechSynthesis.speak(s),!0}function Xr(){var e;(e=window.speechSynthesis)==null||e.cancel()}function eo(){const e=document.documentElement;e.dataset.contrast=G("highContrast")==="true"?"high":"standard",e.dataset.readingFont=G("dyslexiaFont")==="true"?"dyslexia":"standard",e.dataset.fontScale=G("fontScale")||"standard"}function lc(e){Object.entries(e).forEach(([t,s])=>ra(t,String(s))),eo()}function ua(e=document){e.querySelectorAll("[data-read-aloud-target]").forEach(t=>{t.dataset.readAloudBound!=="true"&&(t.dataset.readAloudBound="true",t.addEventListener("click",()=>{const s=document.getElementById(t.dataset.readAloudTarget);if(!s)return;const a=t.dataset.reading==="true";if(e.querySelectorAll("[data-read-aloud-target]").forEach(r=>{r.dataset.reading="false",r.setAttribute("aria-pressed","false"),r.textContent="Listen"}),a){Xr();return}const n=s.cloneNode(!0);n.querySelectorAll("[data-read-aloud-target]").forEach(r=>r.remove()),t.dataset.reading="true",t.setAttribute("aria-pressed","true"),t.textContent="Stop",Zr(n.textContent.trim(),{onEnd:()=>{t.dataset.reading="false",t.setAttribute("aria-pressed","false"),t.textContent="Listen"}})||(t.dataset.reading="false",t.setAttribute("aria-pressed","false"),t.textContent="Listen")}))})}const Ma=(e="")=>String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");function to(){const e=G("speechVoice");return`<option value="">Device default</option>${Jr().map(s=>`<option value="${Ma(s.name)}" ${s.name===e?"selected":""}>${Ma(`${s.name} (${s.lang})`)}</option>`).join("")}`}function so(e){return e==="light"?`
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3V1.5M10 18.5V17M4.34 4.34L3.28 3.28M16.72 16.72L15.66 15.66M3 10H1.5M18.5 10H17M4.34 15.66L3.28 16.72M16.72 3.28L15.66 4.34M13.5 10A3.5 3.5 0 116.5 10A3.5 3.5 0 0113.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `:`
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15.5 12.5A6.5 6.5 0 017.5 4.5A6.5 6.5 0 1015.5 12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  `}function dc(){const e=da(),t=e==="dark"?"light":"dark";return`
    <button class="btn btn--icon btn--ghost nav__theme-btn" id="nav-theme-btn" aria-label="Switch to ${t} theme" title="Switch to ${t} theme">
      ${so(e)}
    </button>
  `}function V(e={}){const{title:t="ClassConnect",showBack:s=!1,backLabel:a="Back",studentName:n=null,showSettings:r=!1,showLogout:o=!!(n&&["My learning","Lesson library","My progress","Review","Lesson"].includes(t)),logoutLabel:i="Sign out",showThemeToggle:c=!0}=e;return`
    <nav class="nav" id="main-nav">
      <div class="container">
        <div class="nav__inner">
          <div class="nav__left">
            ${s?`
              <button class="nav__back-btn" id="nav-back-btn" aria-label="Go back">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${a}</span>
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
            ${n?`
              <span class="nav__student-name">
                <span class="nav__student-icon">Student</span>
                ${n}
              </span>
            `:""}
            <span class="nav__status" id="nav-status">
              <span class="status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}" id="status-dot"></span>
              <span class="nav__status-text" id="status-text">${navigator.onLine?"Online":"Offline"}</span>
            </span>
            <div class="nav__toolbar">
              <details class="nav__accessibility">
                <summary class="btn btn--icon btn--ghost" aria-label="Accessibility settings" title="Accessibility settings">A</summary>
                <div class="nav__accessibility-panel">
                  <strong>Display support</strong>
                  <label><input id="access-high-contrast" type="checkbox" ${G("highContrast")==="true"?"checked":""}> High contrast</label>
                  <label><input id="access-dyslexia-font" type="checkbox" ${G("dyslexiaFont")==="true"?"checked":""}> Dyslexia-friendly font</label>
                  <label>Text size <select id="access-font-scale"><option value="standard">Standard</option><option value="large" ${G("fontScale")==="large"?"selected":""}>Large</option><option value="extra-large" ${G("fontScale")==="extra-large"?"selected":""}>Extra large</option></select></label>
                  <label>Speech speed <select id="access-speech-rate"><option value="0.8">Slow</option><option value="1" ${G("speechRate")!=="0.8"&&G("speechRate")!=="1.2"?"selected":""}>Normal</option><option value="1.2" ${G("speechRate")==="1.2"?"selected":""}>Fast</option></select></label>
                  <label>Speech pitch <select id="access-speech-pitch"><option value="0.8" ${G("speechPitch")==="0.8"?"selected":""}>Low</option><option value="1" ${G("speechPitch")!=="0.8"&&G("speechPitch")!=="1.2"?"selected":""}>Normal</option><option value="1.2" ${G("speechPitch")==="1.2"?"selected":""}>High</option></select></label>
                  <label>Voice <select id="access-speech-voice">${to()}</select></label>
                </div>
              </details>
              ${c?dc():""}
              ${r?`
                <button class="btn btn--icon btn--ghost nav__settings-btn" id="nav-settings-btn" aria-label="Settings">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M16.5 10a6.5 6.5 0 01-.4 2.2l1.7 1.3-1.5 2.6-2-.6a6.5 6.5 0 01-3.8 2.2L10 20l-10.5-.3L9 17.7a6.5 6.5 0 01-3.8-2.2l-2 .6L1.7 13.5l1.7-1.3A6.5 6.5 0 013 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              `:""}
              ${o?`
                <button class="btn btn--ghost nav__logout-btn" id="nav-logout-btn" aria-label="${i}">
                  ${i}
                </button>
              `:""}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `}function ue(e={}){const{onBack:t=null,onSettings:s=null,onBrand:a=null,onLogout:n=null}=e,r=document.getElementById("nav-back-btn");r&&t&&r.addEventListener("click",t);const o=document.getElementById("nav-settings-btn");o&&s&&o.addEventListener("click",s);const i=document.getElementById("nav-logout-btn");i&&n&&i.addEventListener("click",n);const c=document.getElementById("nav-theme-btn");c&&c.addEventListener("click",()=>{const m=ic(),h=m==="dark"?"light":"dark";c.innerHTML=so(m),c.setAttribute("aria-label",`Switch to ${h} theme`),c.setAttribute("title",`Switch to ${h} theme`)});const l=()=>{var m,h,g,v,b,I;return lc({highContrast:((m=document.getElementById("access-high-contrast"))==null?void 0:m.checked)||!1,dyslexiaFont:((h=document.getElementById("access-dyslexia-font"))==null?void 0:h.checked)||!1,fontScale:((g=document.getElementById("access-font-scale"))==null?void 0:g.value)||"standard",speechRate:((v=document.getElementById("access-speech-rate"))==null?void 0:v.value)||"1",speechPitch:((b=document.getElementById("access-speech-pitch"))==null?void 0:b.value)||"1",speechVoice:((I=document.getElementById("access-speech-voice"))==null?void 0:I.value)||""})};["access-high-contrast","access-dyslexia-font","access-font-scale","access-speech-rate","access-speech-pitch","access-speech-voice"].forEach(m=>{var h;return(h=document.getElementById(m))==null?void 0:h.addEventListener("change",l)});const d=document.getElementById("access-speech-voice");d&&"speechSynthesis"in window&&window.speechSynthesis.addEventListener("voiceschanged",()=>{const m=G("speechVoice");d.innerHTML=to(),d.value=m},{once:!0});const u=document.getElementById("nav-brand");u&&a&&(u.addEventListener("click",a),u.style.cursor="pointer");const p=()=>{const m=document.getElementById("status-dot"),h=document.getElementById("status-text");m&&(m.className=`status-dot ${navigator.onLine?"status-dot--online":"status-dot--offline"}`),h&&(h.textContent=navigator.onLine?"Online":"Offline")};window.addEventListener("online",p),window.addEventListener("offline",p)}function uc(){return`
    ${V({title:"ClassConnect"})}
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
  `}function mc(e){ue(),document.getElementById("btn-student").addEventListener("click",()=>{e("/student-login")}),document.getElementById("btn-teacher").addEventListener("click",()=>{e("/teacher-login")})}function bt(e,t,s=""){const a=t>0?Math.round(e/t*100):0;return`
    <div class="progress-container" role="progressbar" aria-valuenow="${a}" aria-valuemin="0" aria-valuemax="100">
      ${s?`<div class="progress-label">${s}</div>`:""}
      <div class="progress-track">
        <div class="progress-fill" style="width: ${a}%"></div>
      </div>
      <div class="progress-text">${a}%</div>
    </div>
  `}function no(e){const t=["A","B","C","D"];return`
    <div class="question-card">
      <div class="question-card__stem" id="question-stem">${e.stem}<button class="read-aloud-button" type="button" data-read-aloud-target="question-stem" aria-label="Read question aloud" aria-pressed="false">Listen</button></div>
      <div class="question-options" id="question-options">
        ${e.options.map((s,a)=>`
          <button class="option-btn" data-index="${a}" id="option-${a}">
            <span class="option-btn__letter">${t[a]}</span>
            <span class="option-btn__text">${s}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `}function pc(e){return e==="ai"?'<span class="badge badge--primary">AI Feedback</span>':e==="cache"?'<span class="badge badge--accent">Saved Offline</span>':e==="question-cache"?'<span class="badge badge--warning">Common Offline Hint</span>':e==="fallback"?'<span class="badge badge--neutral">Offline Hint</span>':'<span class="badge badge--success">Quick Check</span>'}function hc(e){return e.source==="ai"?"Powered by Gemini AI and saved for offline reuse.":e.source==="cache"?"Loaded from this device cache so feedback still works offline.":e.source==="question-cache"?"Reused from a common explanation for this question while offline.":e.source==="fallback"?"Using the built-in lesson explanation because no saved AI response matched yet.":""}function gc(e,t){return t||!e.practiceTip?"":`
    <div class="feedback-card__tip">
      <strong>Next step:</strong> ${e.practiceTip}
    </div>
  `}function fc(e,t){return t||!e.usageCount&&!e.reusedFromQuestionBank?"":e.reusedFromQuestionBank?'<div class="feedback-card__meta">Misconception memory: reused a common explanation for this question.</div>':(e.usageCount||0)>1?`<div class="feedback-card__meta">Misconception memory: this saved explanation has helped ${e.usageCount} times on this device.</div>`:""}function ma(e,t){const s=t?"Correct":"Review",a=t?"Correct!":"Let's learn from this",n=hc(e);return`
    <div class="card feedback-card ${t?"feedback-card--correct":"feedback-card--incorrect"}">
      <div class="feedback-card__header">
        <span class="feedback-card__icon">${s}</span>
        <span class="feedback-card__title">${a}</span>
        ${pc(e.source)}
      </div>
      <div class="feedback-card__body">
        ${e.text}
      </div>
      ${gc(e,t)}
      ${fc(e,t)}
      ${n?`<div class="feedback-card__source">${n}</div>`:""}
    </div>
  `}function Yt(e,t,s,a="primary",n=""){return`
    <div class="card stat-card stat-card--${a}">
      <div class="stat-card__icon">${e}</div>
      <div class="stat-card__value">${t}</div>
      <div class="stat-card__label">${s}</div>
      ${n?`<div class="stat-card__detail">${n}</div>`:""}
    </div>
  `}let kt=null;function D(e,t="info",s=3e3){kt||(kt=document.createElement("div"),kt.className="toast-container",document.body.appendChild(kt));const a={success:"OK",error:"X",info:"i"},n=document.createElement("div");n.className=`toast toast--${t}`,n.innerHTML=`<span>${a[t]||""}</span> ${e}`,kt.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateX(100%)",n.style.transition="all 0.3s ease-out",setTimeout(()=>n.remove(),300)},s)}function ao(e,t){const s=t>0?e/t:0,a=2*Math.PI*45,n=a*(1-s);let r="#FB7185";return s>=.8?r="#34D399":s>=.6?r="#818CF8":s>=.4&&(r="#FBBF24"),`
    <div class="quiz-results__score-ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-bg" cx="50" cy="50" r="45"/>
        <circle class="ring-fill" cx="50" cy="50" r="45"
          stroke="${r}"
          stroke-dasharray="${a}"
          stroke-dashoffset="${n}"
          style="animation: ringDraw 1.5s ease-out forwards;"
        />
      </svg>
      <div class="quiz-results__score-label">
        <div class="quiz-results__score-value" style="color: ${r}">${e}</div>
        <div class="quiz-results__score-total">out of ${t}</div>
      </div>
    </div>
  `}function he(e,t,s=[],a={}){const n=document.createElement("div");n.className="modal-overlay",n.id="modal-overlay";const r=a.modalClass?` ${a.modalClass}`:"";return n.innerHTML=`
    <div class="modal${r}">
      <h3 class="modal__title">${e}</h3>
      <div class="modal__body">${t}</div>
      <div class="modal__actions" id="modal-actions">
        ${s.map((o,i)=>`
          <button class="btn ${o.variant||"btn--ghost"}" id="modal-action-${i}">${o.label}</button>
        `).join("")}
      </div>
    </div>
  `,document.body.appendChild(n),s.forEach((o,i)=>{const c=document.getElementById(`modal-action-${i}`);c&&c.addEventListener("click",async()=>{let l=!0;o.onClick&&(l=await o.onClick(n)!==!1),l&&n.remove()})}),n.addEventListener("click",o=>{o.target===n&&n.remove()}),n}function pa(){return null}function nt(){return!!pa()}async function ha(e,t,s){const a=pa();if(!a)throw new Error("Supabase is not configured for this environment.");const{data:n,error:r}=await a.auth.signInWithPassword({email:e,password:t});if(r||!n.user)throw new Error((r==null?void 0:r.message)||"Unable to sign in.");const{data:o,error:i}=await a.from("profiles").select("id, school_id, role, display_name").eq("id",n.user.id).single();if(i||!o)throw await a.auth.signOut(),new Error("Your account is not assigned to a ClassConnect school. Ask an administrator for access.");if(s&&o.role!==s)throw await a.auth.signOut(),new Error("This account does not have access to this workspace.");return o}async function vc(){var e;await((e=pa())==null?void 0:e.auth.signOut())}const ro=Object.freeze(Object.defineProperty({__proto__:null,isSupabaseAuthConfigured:nt,signInWithSupabase:ha,signOutFromSupabase:vc},Symbol.toStringTag,{value:"Module"}));function bc(){return`${V({title:"ClassConnect",showBack:!0})}<main class="auth-page view-enter"><section class="auth-layout" aria-labelledby="student-login-title"><aside class="auth-intro"><div class="auth-brand"><span class="auth-brand__mark" aria-hidden="true">⌁</span><span class="auth-brand__name">ClassConnect</span></div><div class="auth-intro__content"><p class="auth-kicker">Learner workspace</p><h1 class="auth-intro__title">Build confidence, one lesson at a time.</h1><p class="auth-intro__text">Pick up where you left off and get learning support tailored to your progress.</p></div><div class="auth-benefits"><p class="auth-benefit"><span class="auth-benefit__icon" aria-hidden="true">✓</span>Your saved progress stays on this device.</p><p class="auth-benefit"><span class="auth-benefit__icon" aria-hidden="true">✓</span>Your PIN keeps your learning path private.</p></div></aside><div class="auth-panel"><header class="auth-panel__header"><p class="auth-panel__eyebrow">Student sign in</p><h1 class="auth-panel__title" id="student-login-title">Welcome back</h1><p class="auth-panel__subtitle">Enter your details to continue to your learning path.</p></header><form id="login-form" class="auth-form"><div class="input-group"><label for="student-name">Full name or student index number</label><input type="text" id="student-name" class="input" placeholder="e.g., Kwame Mensah or GES-B7-0101" required minlength="2" autocomplete="off"></div><div class="input-group"><label for="student-pin">4-digit PIN</label><input type="password" id="student-pin" class="input input--pin" placeholder="••••" required pattern="[0-9]{4}" maxlength="4" inputmode="numeric" autocomplete="current-password" aria-describedby="student-pin-hint"><p class="auth-form__hint" id="student-pin-hint">Keep your PIN private. Ask your teacher if you need help signing in.</p></div><button type="submit" class="btn btn--primary btn--lg btn--full auth-form__submit">Continue to learning</button></form><div id="recent-students" class="auth-recent" hidden><h2 class="auth-recent__heading">Recent learners</h2><div id="recent-student-list" class="auth-recent__list"></div></div><p class="auth-panel__footer"><strong>Using a shared device?</strong> Sign out when you finish so the next learner can access their own work.</p></div></section></main><div class="bg-pattern"></div>`}function yc(e){var o,i;ue({onBack:()=>e("/")});const t=document.getElementById("login-form"),s=document.getElementById("student-name"),a=document.getElementById("student-pin");nt()&&((o=document.querySelector('label[for="student-name"]'))==null||o.replaceChildren("School email address"),(i=document.querySelector('label[for="student-pin"]'))==null||i.replaceChildren("Password"),s.type="email",s.placeholder="student@school.edu.gh",a.removeAttribute("pattern"),a.removeAttribute("maxlength"),a.removeAttribute("inputmode")),t.addEventListener("submit",async c=>{var u,p;c.preventDefault();const l=s.value.trim(),d=a.value;if(!l||!nt()&&d.length!==4){D("Please enter your sign-in details.","error");return}try{let m;if(nt()){const g=await ha(l,d,"student");m={id:g.id,name:g.display_name,schoolId:g.school_id}}else m=await Ti(l,d),m||(m=await Li(l,d));Gi(m);const h=await Me(m.id);e(h?"/lessons":"/diagnostic")}catch(m){console.error("[ClassConnect] Student login error:",m);let h="Login failed. Please try again.";(m==null?void 0:m.message)==="The local ClassConnect database is busy."?h="Your saved learning data is busy. Close other ClassConnect tabs, then try again.":((m==null?void 0:m.name)==="VersionError"||(u=m==null?void 0:m.message)!=null&&u.includes("version")||(p=m==null?void 0:m.message)!=null&&p.includes("blocked"))&&(h="A database update is needed. Please close all other ClassConnect tabs and try again."),D(h,"error")}});const n=document.getElementById("recent-students"),r=document.getElementById("recent-student-list");r.addEventListener("click",c=>{const l=c.target.closest(".student-quick-select");l&&(s.value=l.dataset.identifier||l.dataset.name,a.focus())}),Promise.all([we(),de()]).then(([c,l])=>{c.length&&(c.slice(0,6).forEach(d=>{const u=l.find(h=>h.id===d.classId),p=u?` [${u.stream||u.name}]`:"",m=document.createElement("button");m.type="button",m.className="badge badge--neutral student-quick-select",m.dataset.name=d.name,m.dataset.identifier=d.indexNumber||d.name,m.style.cssText="padding: var(--space-2) var(--space-3); cursor: pointer; border: 1px solid var(--color-slate-600);",m.textContent=`${d.name}${p}`,r.append(m)}),n.hidden=!1)}).catch(c=>console.warn("Recent students could not be loaded.",c))}let Mn={users:[]};async function wc(){const e=nt();e||(await Xi(),Mn.users=await vt());const t=!e&&Mn.users.length===0;return`${V({title:"Staff Access",showBack:!0})}<main class="auth-page view-enter"><section class="auth-layout" aria-labelledby="staff-login-title"><aside class="auth-intro"><div class="auth-brand"><span class="auth-brand__mark" aria-hidden="true">⌁</span><span class="auth-brand__name">ClassConnect</span></div><div class="auth-intro__content"><p class="auth-kicker">Staff workspace</p><h1 class="auth-intro__title">The information you need to support every learner.</h1><p class="auth-intro__text">Secure access to progress, learning resources, and your school’s assessment tools.</p></div><div class="auth-benefits"><p class="auth-benefit"><span class="auth-benefit__icon" aria-hidden="true">✓</span>Role-based access for every member of staff.</p><p class="auth-benefit"><span class="auth-benefit__icon" aria-hidden="true">✓</span>Designed to work reliably in the classroom.</p></div></aside><div class="auth-panel"><header class="auth-panel__header"><p class="auth-panel__eyebrow">${t?"First-time setup":"Staff sign in"}</p><h1 class="auth-panel__title" id="staff-login-title">${t?"Set up your school":"Welcome back"}</h1><p class="auth-panel__subtitle">${t?"Create the first administrator account. You can add teachers and invigilators later.":"Enter your individual staff credentials to open the dashboard."}</p></header><form id="teacher-access-form" class="auth-form">${t?'<div class="input-group"><label for="staff-name">Full name</label><input id="staff-name" class="input" required maxlength="80" autocomplete="name" placeholder="e.g., Mrs. Ama Mensah"></div>':""}<div class="input-group"><label for="staff-username">Username</label><input id="staff-username" class="input" required pattern="[A-Za-z0-9._-]{3,40}" autocomplete="username" placeholder="e.g., ama.mensah"></div><div class="input-group"><label for="staff-pin">${t?"Administrator PIN (4–8 digits)":"Account PIN"}</label><input type="password" id="staff-pin" class="input input--pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" autocomplete="current-password" placeholder="••••"></div>${t?'<div class="input-group"><label for="staff-pin-confirm">Confirm PIN</label><input type="password" id="staff-pin-confirm" class="input input--pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" autocomplete="new-password" placeholder="••••"></div>':""}<button type="submit" class="btn btn--primary btn--lg btn--full auth-form__submit">${t?"Create account and open dashboard":"Sign in to dashboard"}</button></form><p class="auth-panel__footer"><strong>Secure staff access.</strong> Use only your own account and sign out when you finish on a shared device.</p></div></section></main><div class="bg-pattern"></div>`}function Ic(e){var s,a,n;ue({onBack:()=>e("/")});const t=Mn.users.length===0;if(nt()){const r=document.getElementById("staff-username"),o=document.getElementById("staff-pin");(s=document.querySelector('label[for="staff-username"]'))==null||s.replaceChildren("School email address"),(a=document.querySelector('label[for="staff-pin"]'))==null||a.replaceChildren("Password"),r==null||r.setAttribute("type","email"),r==null||r.removeAttribute("pattern"),r==null||r.setAttribute("autocomplete","email"),r==null||r.setAttribute("placeholder","name@school.edu.gh"),o==null||o.removeAttribute("pattern"),o==null||o.removeAttribute("maxlength"),o==null||o.removeAttribute("inputmode")}(n=document.getElementById("teacher-access-form"))==null||n.addEventListener("submit",async r=>{var c,l,d,u;r.preventDefault();const o=(c=document.getElementById("staff-username"))==null?void 0:c.value.trim(),i=(l=document.getElementById("staff-pin"))==null?void 0:l.value.trim();try{if(nt()){const p=await ha(o,i);if(p.role==="student")throw new Error("Use the student sign-in for this account.");Os({id:p.id,username:o,name:p.display_name,role:p.role==="administrator"?ae.ADMIN:p.role,classIds:[]}),D(`Welcome, ${p.display_name}.`,"success")}else if(t){if(i!==((d=document.getElementById("staff-pin-confirm"))==null?void 0:d.value.trim()))throw new Error("PINs do not match.");const p=await $s({name:(u=document.getElementById("staff-name"))==null?void 0:u.value.trim(),username:o,pin:i,role:ae.ADMIN});Os(p),D("Administrator account created.","success")}else{const p=await Yi(o,i);if(!p.user)throw new Error(p.error);Os(p.user),D(`Welcome, ${p.user.name||p.user.username}.`,"success")}e("/dashboard")}catch(p){D(p.message||"Unable to sign in.","error")}})}const q=[{id:1,title:"What Is a Computer?",duration:"10 min",objectives:["Define what a computer is and explain its basic purpose","Identify different types of computers used today","Understand how computers have evolved through generations"],keyTerms:[{word:"Computer",definition:"An electronic device that accepts data (input), processes it, and produces useful information (output)."},{word:"Data",definition:"Raw facts and figures that have not yet been processed — such as numbers, words, or images."},{word:"Information",definition:"Data that has been processed and organized so it is meaningful and useful."},{word:"Hardware",definition:"The physical parts of a computer that you can see and touch."},{word:"Software",definition:"Programs and instructions that tell the computer what to do."}],content:`
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
    `}],Sc={1:{src:"/images/lesson-1-computer-types.png",alt:"Illustration of a desktop computer, laptop, tablet, smartphone, and server tower",caption:"Different types of computers suit different jobs, but they all accept data, process it, and give useful results."},2:{src:"/images/lesson-2-inside-computer.png",alt:"Illustration of a desktop tower opened to show the motherboard, CPU, RAM, storage drive, and power supply",caption:"Internal hardware works together through the motherboard so the CPU, memory, storage, and power system can do their jobs."},3:{src:"/images/lesson-3-input-devices.png",alt:"Illustration collage of a keyboard, mouse, touchscreen tablet, microphone, scanner, and webcam",caption:"Input devices help students send text, sound, touch, and images into a computer."},4:{src:"/images/lesson-4-output-devices.png",alt:"Illustration collage of a monitor, printer, speakers, projector, and plotter",caption:"Output devices help the computer present information as visuals, sound, or printed work."},5:{src:"/images/lesson-5-storage-devices.png",alt:"Illustration comparing a hard drive, solid state drive, flash drive, SD card, optical disc, and cloud storage symbol",caption:"Storage devices keep schoolwork, software, and media safe so learners can use them again later."}};function oo(e,t=0,s=1){return Math.max(t,Math.min(s,e))}function ga(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function kc(e){return Math.round(oo(e)*100)}function io(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return new Map(t.map(s=>[s.lessonId,s]))}function _c(e){const t=new Map;return e.slice().sort((s,a)=>new Date(a.completedAt)-new Date(s.completedAt)).forEach(s=>{t.has(s.lessonId)||t.set(s.lessonId,s)}),t}function $c(e){const t=new Map;return e.slice().sort((s,a)=>new Date(a.completedAt)-new Date(s.completedAt)).slice(0,3).forEach(s=>{var n;const a=((n=s.responses)==null?void 0:n.filter(r=>!r.correct).length)||0;t.set(s.lessonId,(t.get(s.lessonId)||0)+a)}),t}function Ac(e){return e>=.8?"mastered":e>=.6?"growing":e>=.4?"review":"urgent"}function Cc(e){const t=ga(e.map(a=>a.mastery)),s=e.filter(a=>a.status==="urgent").length;return t>=.75&&s===0?{label:"Ready to Accelerate",tone:"success",description:"You have strong foundations across the strand. Push into harder quizzes and extension practice."}:t>=.55?{label:"Foundations Growing",tone:"accent",description:"You are building confidence. Focus on the weakest topics first, then continue the recommended path."}:{label:"Needs Guided Support",tone:"danger",description:"Your learning path should begin with a few targeted reviews before moving ahead."}}function xc(e,t,s){const a=$c(t),n=io(s);return e.map(o=>{const i=n.get(o.lessonId),c=a.get(o.lessonId)||0,l=[];let d=0;return i&&i.accuracy<.5&&(l.push("low diagnostic readiness"),d+=25),o.latestQuizScore!==null&&o.latestQuizScore<.6&&(l.push("recent quiz performance dropped"),d+=20),c>0&&(l.push(`${c} recent missed question${c===1?"":"s"}`),d+=c*6),o.completed||(d+=8),!l.length&&o.mastery>=.65?null:{lessonId:o.lessonId,title:o.title,priority:d,reason:l.length?l.join(", "):"This topic will benefit from one more focused review.",action:`Revisit ${o.title}, then use the AI Tutor before retaking the quiz.`}}).filter(Boolean).sort((o,i)=>i.priority-o.priority).slice(0,4)}function Ec(e){const t=e.filter(o=>!o.completed&&o.status==="urgent").sort((o,i)=>o.lessonId-i.lessonId),s=e.filter(o=>!o.completed&&o.status==="review").sort((o,i)=>o.lessonId-i.lessonId),a=e.filter(o=>!o.completed&&(o.status==="growing"||o.status==="mastered")).sort((o,i)=>o.lessonId-i.lessonId),n=e.filter(o=>o.completed&&(o.status==="urgent"||o.status==="review")).sort((o,i)=>o.mastery-i.mastery||o.lessonId-i.lessonId),r=e.filter(o=>o.completed&&(o.status==="growing"||o.status==="mastered")).sort((o,i)=>o.lessonId-i.lessonId);return[...t,...s,...a,...n,...r]}function Lc(e,t=[],s=null){var l,d;const a=t.slice().sort((u,p)=>new Date(p.completedAt)-new Date(u.completedAt)),n=a[0]||null,r=a.length>0?ga(a.map(u=>u.score/u.totalQuestions)):null;let o=0;const i=[];if(s||(o+=10,i.push("no diagnostic profile yet")),e.completionRate<40&&(o+=15,i.push("low lesson completion")),e.knowledgeGaps.length>=3&&(o+=20,i.push("several knowledge gaps remain open")),n){const u=n.score/n.totalQuestions;u<.5?(o+=25,i.push("latest quiz score below 50%")):u<.65&&(o+=12,i.push("latest quiz score needs support")),n.theta<-.75?(o+=25,i.push("ability estimate is trending low")):n.theta<-.25&&(o+=12,i.push("ability estimate suggests review"))}r!==null&&r<.6&&a.length>=2&&(o+=10,i.push("recent quiz trend is still below target"));const c=Math.min(100,o);return c>=60?{score:c,label:"High",badge:"danger",reasons:i,action:`Teacher check-in recommended. Start with ${((l=e.recommendedNext)==null?void 0:l.title)||"the weakest topic"} and review the revision queue.`}:c>=35?{score:c,label:"Moderate",badge:"warning",reasons:i,action:`Guide the learner through ${((d=e.recommendedNext)==null?void 0:d.title)||"the next recommended lesson"} and schedule a tutor session.`}:{score:c,label:"Low",badge:"success",reasons:i.length?i:["steady progress across current evidence"],action:"Keep the learner on the personalized path and use the tutor for stretch support."}}function Ee({diagnostic:e=null,results:t=[],progressRecords:s=[]}={}){const a=new Set(s.map(h=>h.lessonId)),n=io(e),r=_c(t),o=q.map(h=>{const g=n.get(h.id),v=t.filter(A=>A.lessonId===h.id).sort((A,C)=>new Date(C.completedAt)-new Date(A.completedAt)),b=r.get(h.id)||null,I=b?b.score/b.totalQuestions:null,f=v.length?ga(v.map(A=>A.score/A.totalQuestions)):null,y=g?g.accuracy:null,$=a.has(h.id);let w=0,S=0;y!==null&&(w+=y*.35,S+=.35),I!==null&&(w+=I*.45,S+=.45),f!==null&&v.length>1&&(w+=f*.1,S+=.1),$&&(w+=.1,S+=.1);let _=S>0?w/S:.2;$&&S===0&&(_=.55),_=oo(_);const k=Ac(_);let x="Continue building momentum on this topic.";return g&&g.accuracy<.5?x="The diagnostic found this topic needs early attention.":I!==null&&I<.6?x="Recent quiz results suggest a focused review here.":$||(x="This topic is ready to learn next in your path."),{lessonId:h.id,title:h.title,completed:$,mastery:_,masteryPercent:kc(_),status:k,diagnosticScore:y,latestQuizScore:I,latestTheta:(b==null?void 0:b.theta)??null,attempts:v.length,recommendedFocus:x}}),i=Ec(o),c=o.filter(h=>h.status==="urgent"||h.status==="review").sort((h,g)=>h.mastery-g.mastery).slice(0,3),l=o.filter(h=>h.status==="mastered"||h.status==="growing").sort((h,g)=>g.mastery-h.mastery).slice(0,3),d=xc(o,t,e),u=Cc(o),p=q.length>0?Math.round(a.size/q.length*100):0,m={lessonProfiles:o,recommendedSequence:i,recommendedNext:i.find(h=>!h.completed)||i[0]||null,knowledgeGaps:c,strengths:l,revisionQueue:d,readiness:u,completionRate:p,completedCount:a.size};return m.risk=Lc(m,t,e),m}const fe=(e="")=>String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),fa="Introduction to Computer Systems";function Bc(e=""){return[...new DOMParser().parseFromString(String(e),"text/html").querySelectorAll("h2, h3")].map((s,a)=>({id:`lesson-section-${a+1}`,level:s.tagName.toLowerCase(),title:s.textContent.trim()}))}function Tc(e=""){const t=new Set(["H2","H3","P","STRONG","EM","B","I","UL","OL","LI","BLOCKQUOTE","BR","DIV","SPAN","PRE","CODE","TABLE","THEAD","TBODY","TR","TH","TD"]),s=new DOMParser().parseFromString(String(e),"text/html");return s.body.querySelectorAll("*").forEach(a=>{if(!t.has(a.tagName)){a.replaceWith(s.createTextNode(a.textContent||""));return}[...a.attributes].forEach(n=>{n.name!=="class"&&a.removeAttribute(n.name)})}),s.body.innerHTML}function Dc(e){return typeof e=="string"&&(/^\/images\/[\w./-]+\.png$/i.test(e)||/^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(e))}async function Cs(){const e=K(),[t,s,a,n]=await Promise.all([_s(),e?xe(e.id):[],e?at(e.id):[],e?Me(e.id):null]),r=Ee({diagnostic:n,results:a,progressRecords:s});return{student:e,customLessons:t,progress:s,quizResults:a,diagnostic:n,profile:r,completedIds:new Set(s.map(o=>o.lessonId))}}function xs(e){return`<nav class="lessons-subnav" aria-label="Lessons navigation">${[["dashboard","/lessons","My learning"],["library","/lessons/library","Library"],["progress","/lessons/progress","Progress"],["review","/lessons/review","Review"]].map(([s,a,n])=>`<a class="lessons-subnav__link ${e===s?"lessons-subnav__link--active":""}" href="${a}" data-lessons-route="${a}" ${e===s?'aria-current="page"':""}>${n}</a>`).join("")}</nav>`}function co(e,t){ue({onBack:t,onLogout:()=>{Wi(),e("/",!1)}})}function qn(e,t={}){const{complete:s=!1,mastery:a=null,recommended:n=!1,focus:r=!1,custom:o=!1,index:i=null}=t,c=o?`custom-${e.id}`:e.id,l=s?"Review":n?"Continue":"Start";return`<article class="card card--interactive lesson-card" data-id="${c}" data-title="${fe(e.title).toLowerCase()}" data-complete="${s}" data-custom="${o}" data-recommended="${n}">
    <div class="lesson-card__number ${s?"lesson-card__number--completed":""}">${s?"Done":o?"School":i+1}</div>
    <div class="lesson-card__info"><div class="lesson-card__title">${o?fe(e.title):e.title}</div>
      <div class="lesson-card__meta"><span>${o?fe(e.subject||"Computing"):e.duration}</span><span>${o?fe(e.strand||"School lesson"):`${e.objectives.length} objectives`}</span>${a!==null?`<span>${a}% mastery</span>`:""}</div>
      <div class="lesson-card__badges">${n?'<span class="badge badge--primary">Recommended</span>':""}${r?'<span class="badge badge--warning">Review topic</span>':""}${o?'<span class="badge badge--accent">School lesson</span>':""}</div>
    </div><div class="lesson-card__status"><span class="badge badge--${s?"success":"neutral"}">${s?"Completed":l}</span></div>
  </article>`}async function Mc(){var c,l;const{student:e,progress:t,diagnostic:s,profile:a,completedIds:n}=await Cs(),r=a.recommendedNext||q[0],o=a.lessonProfiles.find(d=>d.lessonId===(r==null?void 0:r.id)),i=a.revisionQueue.slice(0,2);return`
    ${V({title:"My learning",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);">
      <header class="lessons-page-header"><h1>My learning</h1><p>Pick up where you left off, then explore your learning path when you are ready.</p></header>
      ${xs("dashboard")}
      <section class="learning-next card card--glass" aria-labelledby="next-lesson-title"><div class="learning-next__layout" style="width: 100%; padding: 1.5rem;"><div class="learning-next__content"><span class="learning-next__eyebrow">Your next lesson</span><h2 id="next-lesson-title">${(r==null?void 0:r.title)||"Your first lesson"}</h2><p>${(o==null?void 0:o.recommendedFocus)||"Build your computer systems knowledge one lesson at a time."}</p><div class="lesson-card__meta"><span>${(r==null?void 0:r.duration)||"Ready to start"}</span><span>${((c=r==null?void 0:r.objectives)==null?void 0:c.length)||0} objectives</span></div></div><button class="btn btn--primary learning-next__action" id="btn-open-path">${n.has(r==null?void 0:r.id)?"Review lesson":"Continue learning"}</button></div></section>
      <section class="learning-summary" aria-label="Learning summary"><div class="card learning-summary__card"><span>Lessons completed</span><strong>${n.size} of ${q.length}</strong></div><div class="card learning-summary__card"><span>Current mastery</span><strong>${a.completionRate}%</strong></div><div class="card learning-summary__card"><span>Next focus</span><strong>${((l=a.knowledgeGaps[0])==null?void 0:l.title)||"Keep learning"}</strong></div></section>
      ${s?"":'<section class="learning-callout card"><div><h2>Personalise your learning</h2><p>Take a short diagnostic so ClassConnect can suggest the best next topic.</p></div><button class="btn btn--secondary" id="btn-open-diagnostic">Take diagnostic</button></section>'}
      <section class="learning-section" aria-labelledby="review-preview-title"><div class="learning-section__heading"><div><h2 id="review-preview-title">Recommended review</h2><p>Topics selected from your recent learning evidence.</p></div><a href="/lessons/review" data-lessons-route="/lessons/review">See all review topics</a></div>${i.length?`<div class="lesson-list">${i.map(d=>`<button class="revision-queue__item" data-lesson-id="${d.lessonId}"><div class="revision-queue__title-row"><span class="revision-queue__item-title">${d.title}</span><span class="badge badge--warning">Priority ${d.priority}</span></div><div class="revision-queue__reason">${d.reason}</div></button>`).join("")}</div>`:'<div class="card empty-state">You are on track. Keep going with your next lesson.</div>'}</section>
      <a class="learning-library-link card" href="/lessons/library" data-lessons-route="/lessons/library"><span><strong>Browse the lesson library</strong><small>View all lessons, including school lessons from your teacher.</small></span><span aria-hidden="true">→</span></a>
    </div>
  `}async function qc(){const{student:e,customLessons:t,profile:s,completedIds:a}=await Cs(),n=q.map((o,i)=>{var c,l;return qn(o,{index:i,complete:a.has(o.id),mastery:((c=s.lessonProfiles.find(d=>d.lessonId===o.id))==null?void 0:c.masteryPercent)||0,recommended:((l=s.recommendedNext)==null?void 0:l.lessonId)===o.id,focus:s.knowledgeGaps.some(d=>d.lessonId===o.id)})}),r=t.map(o=>qn(o,{custom:!0,complete:a.has(`custom-${o.id}`)}));return`${V({title:"Lesson library",showBack:!0,studentName:e==null?void 0:e.name})}<div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);"><header class="lessons-page-header"><h1>Lesson library</h1><p>Choose a topic to start, continue, or review.</p></header>${xs("library")}<div class="library-toolbar"><label class="sr-only" for="lesson-search">Search lessons</label><input id="lesson-search" class="input" type="search" placeholder="Search lessons"><select id="lesson-status-filter" class="input" aria-label="Filter lessons"><option value="all">All lessons</option><option value="incomplete">To start</option><option value="completed">Completed</option><option value="school">School lessons</option></select><select id="lesson-sort" class="input" aria-label="Sort lessons"><option value="curriculum">Curriculum order</option><option value="recommended">Recommended first</option><option value="completed">Completed first</option><option value="school">School lessons first</option></select></div><section aria-labelledby="core-unit-title"><h2 class="lesson-library__heading" id="core-unit-title">${fa}</h2><div class="lesson-list lesson-library-list" id="lesson-library-list">${n}</div></section>${r.length?`<section class="custom-curriculum" aria-labelledby="school-lessons-title"><div class="custom-curriculum__header"><div><h2 id="school-lessons-title">School lessons</h2><p>Lessons published by your teacher.</p></div></div><div class="lesson-list lesson-library-list" id="school-lesson-library-list">${r}</div></section>`:""}<div class="card empty-state lesson-library-empty" hidden>No lessons match those filters.</div></div>`}async function Nc(){const{student:e,progress:t,quizResults:s,profile:a,completedIds:n}=await Cs();return`${V({title:"My progress",showBack:!0,studentName:e==null?void 0:e.name})}<div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);"><header class="lessons-page-header"><h1>My progress</h1><p>See how your learning is building over time.</p></header>${xs("progress")}<section class="progress-overview card card--glass"><h2>${a.completionRate}% complete</h2>${bt(n.size,q.length,"Core lessons completed")}<p>${n.size?"You are making progress. Keep working through the next recommended lesson.":"Start your first lesson to begin tracking your progress."}</p></section><section class="learning-section"><h2>Progress by unit</h2><div class="card unit-progress"><div><strong>${fa}</strong><span>${n.size} completed · ${Math.max(q.length-n.size,0)} remaining</span></div>${bt(n.size,q.length,"Progress in Introduction to Computer Systems")}</div><p class="mastery-explainer"><strong>Mastery</strong> shows how confidently your quiz and diagnostic results suggest you understand a lesson. It improves as you practise.</p></section><section class="learning-section"><h2>Lessons</h2><div class="lesson-list">${q.map((r,o)=>{var i;return qn(r,{index:o,complete:n.has(r.id),mastery:((i=a.lessonProfiles.find(c=>c.lessonId===r.id))==null?void 0:i.masteryPercent)||0})}).join("")}</div></section><section class="learning-section"><h2>Recent quiz results</h2>${s.length?`<div class="results-list">${s.slice(0,5).map(r=>`<a class="card results-list__item" href="/quiz-results/${r.id}" data-lessons-route="/quiz-results/${r.id}"><strong>${r.score??0}/${r.totalQuestions??0}</strong><span>${r.completedAt?new Date(r.completedAt).toLocaleDateString():"Completed quiz"}</span></a>`).join("")}</div>`:'<div class="card empty-state">Complete a lesson and take its quiz to see results here.</div>'}</section></div>`}async function Rc(){const{student:e,profile:t}=await Cs();return`${V({title:"Review",showBack:!0,studentName:e==null?void 0:e.name})}<div class="container container--narrow view-enter lesson-page" style="padding-top: var(--space-8);"><header class="lessons-page-header"><h1>Recommended review</h1><p>These topics can help you strengthen your understanding.</p></header>${xs("review")}<section class="learning-section">${t.revisionQueue.length?`<div class="lesson-list">${t.revisionQueue.map(s=>`<button class="revision-queue__item" data-lesson-id="${s.lessonId}"><div class="revision-queue__title-row"><span class="revision-queue__item-title">${s.title}</span><span class="badge badge--warning">Priority ${s.priority}</span></div><div class="revision-queue__reason">${s.reason}</div><div class="revision-queue__action">${s.action}</div></button>`).join("")}</div>`:'<div class="card empty-state">You are on track. Continue with your next lesson to keep building your skills.</div>'}</section><section class="learning-section"><h2>Your learning path</h2><div class="adaptive-preview__list">${t.recommendedSequence.map((s,a)=>`<button class="adaptive-preview__item" data-lesson-id="${s.lessonId}"><div class="adaptive-preview__step">${a+1}</div><div class="adaptive-preview__body"><div class="adaptive-preview__title">${s.title}</div><div class="adaptive-preview__meta">${s.masteryPercent}% mastery · ${s.recommendedFocus}</div></div></button>`).join("")}</div></section></div>`}function Es(e){co(e,()=>e("/"));const t=document.getElementById("btn-open-path");t&&t.addEventListener("click",async()=>{var c;const a=K(),n=a?await xe(a.id):[],r=a?await Me(a.id):null,o=a?await at(a.id):[],i=Ee({diagnostic:r,results:o,progressRecords:n});e(`/lesson/${((c=i.recommendedNext)==null?void 0:c.lessonId)||1}`)});const s=document.getElementById("btn-open-diagnostic");s&&s.addEventListener("click",()=>e("/diagnostic")),document.querySelectorAll("[data-lessons-route]").forEach(a=>{a.addEventListener("click",n=>{n.preventDefault(),e(n.currentTarget.dataset.lessonsRoute)})}),document.querySelectorAll(".revision-queue__item, .adaptive-preview__item").forEach(a=>{a.addEventListener("click",n=>{const r=n.currentTarget.dataset.lessonId;e(`/lesson/${r}`)})}),document.querySelectorAll(".lesson-card").forEach(a=>{a.addEventListener("click",n=>{const r=n.currentTarget.dataset.id;e(`/lesson/${r}`)})})}function Pc(e){Es(e);const t=document.getElementById("lesson-search"),s=document.getElementById("lesson-status-filter"),a=()=>{const o=(t==null?void 0:t.value.trim().toLowerCase())||"",i=(s==null?void 0:s.value)||"all";let c=0;document.querySelectorAll(".lesson-library-list .lesson-card").forEach(d=>{const u=d.dataset.complete==="true",p=d.dataset.custom==="true",m=d.dataset.title.includes(o)&&(i==="all"||i==="completed"&&u||i==="incomplete"&&!u||i==="school"&&p);d.hidden=!m,m&&(c+=1)});const l=document.querySelector(".lesson-library-empty");l&&(l.hidden=c>0)},n=document.getElementById("lesson-sort"),r=()=>{const o=(n==null?void 0:n.value)||"curriculum";document.querySelectorAll(".lesson-library-list").forEach(i=>{[...i.querySelectorAll(".lesson-card")].sort((c,l)=>o==="recommended"?+(l.dataset.recommended==="true")-+(c.dataset.recommended==="true"):o==="completed"?+(l.dataset.complete==="true")-+(c.dataset.complete==="true"):o==="school"?+(l.dataset.custom==="true")-+(c.dataset.custom==="true"):0).forEach(c=>i.append(c))})};t==null||t.addEventListener("input",a),s==null||s.addEventListener("change",a),n==null||n.addEventListener("change",r)}function zc(e){Es(e)}function jc(e){Es(e)}async function Oc(e){var b,I;const t=K(),s=typeof e=="string"&&e.startsWith("custom-")?Number.parseInt(e.slice(7),10):null,a=s?(await _s()).find(f=>f.id===s):null,n=!!a,r=a||q.find(f=>f.id===e);if(!r)return'<div class="container" style="padding: 2rem;">Lesson not found.</div>';const o=q.indexOf(r),i=t?await Ni(t.id,e):!1,c=n&&!Dc((b=r.illustration)==null?void 0:b.src)?null:n?r.illustration:Sc[e],l=t?await xe(t.id):[],d=t?await at(t.id):[],u=t?await Me(t.id):null,m=Ee({diagnostic:u,results:d,progressRecords:l}).lessonProfiles.find(f=>f.lessonId===e),h=(r.keyTerms||[]).map(f=>{if(typeof f!="string")return f;const[y,...$]=f.split(/\s[-–—]\s/);return{word:y,definition:$.join(" - ")}}),g=n?Tc(r.content):r.content,v=Bc(g);return`
    ${V({title:"Lesson",showBack:!0,backLabel:"My learning",studentName:t==null?void 0:t.name})}

    <div class="container container--narrow view-enter lesson-page">
       ${n?'<div class="custom-lesson-banner">Teacher-created curriculum lesson</div>':bt(o+1,q.length,`Lesson ${o+1} of ${q.length}`)}
       ${n?"":`<div class="lesson-progress-strip">
        ${q.map((f,y)=>`
          <div class="lesson-progress-pip ${y===o?"lesson-progress-pip--current":""} ${y<o?"lesson-progress-pip--completed":""}"></div>
        `).join("")}
       </div>`}

       <div class="lesson-header">
         <nav class="lesson-breadcrumb" aria-label="Breadcrumb"><a href="/lessons" data-lessons-route="/lessons">My learning</a><span aria-hidden="true">/</span><a href="/lessons/library" data-lessons-route="/lessons/library">${n?"School lessons":fa}</a><span aria-hidden="true">/</span><span aria-current="page">${n?fe(r.title):r.title}</span></nav>
        <div class="lesson-header__meta">
           <span class="lesson-header__number">${n?fe(r.subject||"Custom lesson"):`Lesson ${o+1}`}</span>
           ${r.duration?`<span class="badge badge--neutral">${r.duration}</span>`:""}
           ${n?"":`<span class="badge badge--${(m==null?void 0:m.status)==="mastered"?"success":(m==null?void 0:m.status)==="growing"?"accent":"warning"}">${(m==null?void 0:m.masteryPercent)||0}% mastery</span>`}
        </div>
         <h1 class="lesson-header__title">${n?fe(r.title):r.title}</h1>

        <div class="lesson-header__objectives">
           ${(r.objectives||[]).map(f=>`
             <div class="lesson-header__objective">${n?fe(f):f}</div>
          `).join("")}
        </div>
        <button class="btn btn--secondary btn--sm" id="btn-read-lesson">Listen to lesson</button>
      </div>

       <div class="lesson-content">
         ${v.length?`<details class="lesson-outline"><summary>Lesson outline</summary><ol>${v.map(f=>`<li class="lesson-outline__item lesson-outline__item--${f.level}"><a href="#${f.id}" data-outline-target="${f.id}">${fe(f.title)}</a></li>`).join("")}</ol></details>`:""}
        <div class="lesson-support card card--glass">
          <div>
            <div class="lesson-support__title">Need help with this lesson?</div>
             <div class="lesson-support__text">${n?"Use the AI Tutor for help understanding this classroom lesson.":(m==null?void 0:m.recommendedFocus)||"Use the AI Tutor for an explanation before you take the quiz."}</div>
          </div>
          <button class="btn btn--accent btn--sm" id="btn-ask-tutor">Ask AI Tutor</button>
        </div>

        ${c?`
          <figure class="lesson-image">
            <img src="${c.src}" alt="${fe(c.alt)}" loading="lazy">
            <figcaption class="lesson-image__caption">${fe(c.caption)}</figcaption>
          </figure>
        `:""}
          <div id="lesson-body">${g}</div>

        ${(I=r.keyTerms)!=null&&I.length?`
          <div class="key-terms">
            <div class="key-terms__title">Key Terms to Remember</div>
            <div class="key-terms__list">
           ${h.map(f=>`
                <div class="key-term">
                   <div class="key-term__word">${n?fe(f.word):f.word}</div>
                   <div class="key-term__def">${n?fe(f.definition):f.definition}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}
      </div>

      <div class="lesson-actions">
        <div class="lesson-actions__nav">
           ${!n&&o>0?'<button class="btn btn--ghost" id="btn-prev-lesson">Previous lesson</button>':'<a class="btn btn--ghost" href="/lessons" data-lessons-route="/lessons">Back to My learning</a>'}
        </div>

        <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: flex-end;">
          ${i?`
            <span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
              Completed
            </span>
          `:`
            <button class="btn btn--primary" id="btn-mark-complete">Mark as Complete</button>
          `}

           ${n?"":`<button class="btn btn--accent" id="btn-take-quiz" ${i?"":'disabled title="Complete lesson first"'}>Take Adaptive Quiz</button>`}
           ${!n&&o<q.length-1?'<button class="btn btn--secondary" id="btn-next-lesson">Next lesson</button>':""}
        </div>
      </div>
      <p class="sr-only" id="lesson-completion-status" role="status" aria-live="polite"></p>
    </div>
  `}function Fc(e,t){co(e,()=>e("/lessons"));const s=K(),a=q.find(u=>u.id===t),n=q.indexOf(a),r=document.getElementById("btn-mark-complete"),o=document.getElementById("btn-take-quiz"),i=document.getElementById("btn-prev-lesson"),c=document.getElementById("btn-next-lesson");document.querySelectorAll("[data-lessons-route]").forEach(u=>u.addEventListener("click",p=>{p.preventDefault(),e(p.currentTarget.dataset.lessonsRoute)})),document.querySelectorAll("#lesson-body h2, #lesson-body h3").forEach((u,p)=>{u.id=`lesson-section-${p+1}`}),i&&i.addEventListener("click",()=>{e(`/lesson/${q[n-1].id}`)}),c&&c.addEventListener("click",()=>e(`/lesson/${q[n+1].id}`)),r&&s&&r.addEventListener("click",async()=>{await qi(s.id,t),r.outerHTML='<span class="badge badge--success" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">Completed</span>';const u=document.getElementById("lesson-completion-status");u&&(u.textContent="Lesson completed. Your adaptive quiz is now available."),o&&(o.removeAttribute("disabled"),o.removeAttribute("title")),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}),o&&o.addEventListener("click",()=>{e(`/quiz/${t}`)});const l=document.getElementById("btn-ask-tutor");document.querySelectorAll(".lesson-content p, .key-term").forEach((u,p)=>{u.id=`lesson-read-aloud-${p+1}`;const m=u.classList.contains("key-term")?"Read key term aloud":"Read paragraph aloud";u.insertAdjacentHTML("beforeend",`<button class="read-aloud-button" type="button" data-read-aloud-target="${u.id}" aria-label="${m}" aria-pressed="false">Listen</button>`)}),ua(document.querySelector(".lesson-page"));const d=document.getElementById("btn-read-lesson");d&&d.addEventListener("click",()=>{if(d.dataset.reading==="true"){Xr(),d.dataset.reading="false",d.textContent="Listen to lesson";return}const u=document.querySelector(".lesson-page"),p=u==null?void 0:u.cloneNode(!0);p==null||p.querySelectorAll("[data-read-aloud-target]").forEach(h=>h.remove());const m=(p==null?void 0:p.textContent)||(a==null?void 0:a.title)||"Lesson";Zr(m),d.dataset.reading="true",d.textContent="Stop listening"}),l&&l.addEventListener("click",()=>{e("/tutor")})}const ls=[{id:"L1Q1",lessonId:1,stem:"What is the BEST definition of a computer?",options:["A machine that only plays games and videos","An electronic device that accepts data, processes it, and produces information","Any device that uses electricity","A tool used only for typing documents"],correctIndex:1,difficulty:-1.5,discrimination:1.2,guessing:.25},{id:"L1Q2",lessonId:1,stem:"Which of these is NOT a type of computer?",options:["Desktop","Laptop","Calculator","Tablet"],correctIndex:2,difficulty:-.8,discrimination:1,guessing:.25},{id:"L1Q3",lessonId:1,stem:"What technology did FIRST generation computers use?",options:["Microprocessors","Transistors","Vacuum tubes","Integrated circuits"],correctIndex:2,difficulty:.3,discrimination:1.3,guessing:.25},{id:"L1Q4",lessonId:1,stem:"Which generation of computers introduced the microprocessor?",options:["First generation","Second generation","Third generation","Fourth generation"],correctIndex:3,difficulty:.5,discrimination:1.1,guessing:.25},{id:"L1Q5",lessonId:1,stem:"What is the difference between data and information?",options:["Data is processed; information is raw","Data is raw facts; information is processed and meaningful","They mean the same thing","Data is digital; information is analog"],correctIndex:1,difficulty:0,discrimination:1.4,guessing:.25},{id:"L1Q6",lessonId:1,stem:"A smartphone is a type of computer.",options:["True — it processes data and runs programs","False — it is only a phone","True — but only expensive ones","False — it has no keyboard"],correctIndex:0,difficulty:-1,discrimination:.9,guessing:.25},{id:"L1Q7",lessonId:1,stem:"What does the fifth generation of computers focus on?",options:["Vacuum tubes","Transistors","Artificial Intelligence","Magnetic storage"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L1Q8",lessonId:1,stem:"A server is a powerful computer that:",options:["Only stores personal photos","Provides services to other computers on a network","Cannot connect to the internet","Is smaller than a smartphone"],correctIndex:1,difficulty:.8,discrimination:1.3,guessing:.25},{id:"L2Q1",lessonId:2,stem:"What is the CPU often called?",options:["The heart of the computer","The brain of the computer","The body of the computer","The memory of the computer"],correctIndex:1,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L2Q2",lessonId:2,stem:"What is the main function of the motherboard?",options:["To store files permanently","To display images on screen","To connect all computer components and allow them to communicate","To provide internet access"],correctIndex:2,difficulty:-.3,discrimination:1.2,guessing:.25},{id:"L2Q3",lessonId:2,stem:"What happens to data in RAM when the computer is turned off?",options:["It is saved permanently","It is transferred to the monitor","It disappears (is lost)","It moves to the keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.4,guessing:.25},{id:"L2Q4",lessonId:2,stem:"What unit is used to measure the speed of a CPU?",options:["Kilograms (kg)","Gigahertz (GHz)","Megabytes (MB)","Watts (W)"],correctIndex:1,difficulty:.6,discrimination:1.5,guessing:.25},{id:"L2Q5",lessonId:2,stem:"ROM is different from RAM because ROM:",options:["Is faster than RAM","Loses data when power is off","Keeps its data even when the computer is off","Can hold more data than RAM"],correctIndex:2,difficulty:.4,discrimination:1.3,guessing:.25},{id:"L2Q6",lessonId:2,stem:"What does the Power Supply Unit (PSU) do?",options:["Displays images on the screen","Converts wall electricity into the correct voltage for components","Stores programs permanently","Connects the computer to the internet"],correctIndex:1,difficulty:.1,discrimination:1.1,guessing:.25},{id:"L2Q7",lessonId:2,stem:"If a computer has more RAM, it can generally:",options:["Store more files permanently","Run more tasks at the same time without slowing down","Display brighter colors","Connect to faster internet"],correctIndex:1,difficulty:.3,discrimination:1.2,guessing:.25},{id:"L2Q8",lessonId:2,stem:"Which two types of operations does the CPU perform?",options:["Input and output operations","Arithmetic and logic operations","Printing and scanning operations","Storage and display operations"],correctIndex:1,difficulty:.7,discrimination:1.4,guessing:.25},{id:"L3Q1",lessonId:3,stem:"An input device is used to:",options:["Display information to the user","Send data or commands into a computer","Store data permanently","Print documents on paper"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L3Q2",lessonId:3,stem:"Which of the following is an input device?",options:["Printer","Monitor","Keyboard","Speaker"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L3Q3",lessonId:3,stem:"A scanner converts:",options:["Sound into text","Digital files into paper documents","Physical documents into digital images","Video into audio"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L3Q4",lessonId:3,stem:"A touchscreen is special because it is:",options:["Only an input device","Only an output device","Both an input and output device","A storage device"],correctIndex:2,difficulty:-.2,discrimination:1.4,guessing:.25},{id:"L3Q5",lessonId:3,stem:"A microphone captures _____ and converts it into digital data.",options:["Light","Heat","Sound","Motion"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L3Q6",lessonId:3,stem:"A trackpad is a type of:",options:["Output device found on desktops","Pointing device built into laptops","Storage device","Printer accessory"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L3Q7",lessonId:3,stem:"Which input device would you use to capture your face for a video call?",options:["Scanner","Keyboard","Webcam","Printer"],correctIndex:2,difficulty:-.6,discrimination:1.1,guessing:.25},{id:"L3Q8",lessonId:3,stem:"A wireless keyboard connects to the computer using:",options:["A VGA cable","Bluetooth or a USB receiver","An HDMI cable","A power cable"],correctIndex:1,difficulty:.5,discrimination:1.3,guessing:.25},{id:"L4Q1",lessonId:4,stem:"An output device:",options:["Sends data into the computer","Presents processed data from the computer to the user","Stores data permanently on a disk","Provides electricity to the computer"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L4Q2",lessonId:4,stem:"Which of the following is an output device?",options:["Mouse","Scanner","Monitor","Keyboard"],correctIndex:2,difficulty:-1.8,discrimination:1,guessing:.25},{id:"L4Q3",lessonId:4,stem:'A "hard copy" refers to:',options:["A file saved on a hard disk","A physical paper printout of a document","A very difficult document to read","A backup copy on a flash drive"],correctIndex:1,difficulty:.2,discrimination:1.3,guessing:.25},{id:"L4Q4",lessonId:4,stem:"Which type of printer uses a laser beam and toner powder?",options:["Inkjet printer","Laser printer","3D printer","Dot matrix printer"],correctIndex:1,difficulty:.4,discrimination:1.2,guessing:.25},{id:"L4Q5",lessonId:4,stem:"A projector is used to:",options:["Print documents in large sizes","Display the computer's screen as a large image on a wall","Record sound from the computer","Store data on optical discs"],correctIndex:1,difficulty:-.5,discrimination:1.1,guessing:.25},{id:"L4Q6",lessonId:4,stem:"Speakers convert electrical signals into:",options:["Light","Text","Sound","Images"],correctIndex:2,difficulty:-1,discrimination:1,guessing:.25},{id:"L4Q7",lessonId:4,stem:"A device that serves as BOTH input and output is called:",options:["A storage device","An I/O device","A processing device","A network device"],correctIndex:1,difficulty:.6,discrimination:1.4,guessing:.25},{id:"L4Q8",lessonId:4,stem:"A plotter is mainly used to:",options:["Play music files","Draw large-format graphics like maps and architectural plans","Scan photographs","Display video on a wall"],correctIndex:1,difficulty:1,discrimination:1.3,guessing:.25},{id:"L5Q1",lessonId:5,stem:"Why do we need storage devices?",options:["To increase the speed of the CPU","To save data permanently so it can be accessed later","To display images on the screen","To connect to the internet"],correctIndex:1,difficulty:-1.5,discrimination:1.1,guessing:.25},{id:"L5Q2",lessonId:5,stem:"Which storage device uses spinning magnetic disks?",options:["SSD","Flash drive","HDD","SD card"],correctIndex:2,difficulty:0,discrimination:1.3,guessing:.25},{id:"L5Q3",lessonId:5,stem:"An SSD is faster than an HDD because it:",options:["Uses larger disks","Has no moving parts — it uses flash memory chips","Uses more electricity","Is always connected to the internet"],correctIndex:1,difficulty:.3,discrimination:1.4,guessing:.25},{id:"L5Q4",lessonId:5,stem:"Google Drive is an example of:",options:["An HDD","Cloud storage","An optical disc","A flash drive"],correctIndex:1,difficulty:-.8,discrimination:1,guessing:.25},{id:"L5Q5",lessonId:5,stem:"The correct order of the computing cycle is:",options:["Output → Input → Storage → Processing","Input → Processing → Output → Storage","Processing → Input → Output → Storage","Storage → Output → Input → Processing"],correctIndex:1,difficulty:.5,discrimination:1.5,guessing:.25},{id:"L5Q6",lessonId:5,stem:"Which storage medium has the LARGEST typical capacity?",options:["SD card","CD","Hard Disk Drive (HDD)","Flash drive"],correctIndex:2,difficulty:.2,discrimination:1.2,guessing:.25},{id:"L5Q7",lessonId:5,stem:"Optical discs (like CDs and DVDs) are read using:",options:["A magnetic head","A laser beam","Radio waves","Electrical contacts"],correctIndex:1,difficulty:.7,discrimination:1.3,guessing:.25},{id:"L5Q8",lessonId:5,stem:"When you save a school report to a flash drive and print it, which component is the storage device?",options:["The printer","The monitor","The flash drive","The keyboard"],correctIndex:2,difficulty:-.5,discrimination:1.1,guessing:.25}];function Fe(e,t=2){return Math.round(e*10**t)/10**t}function lo(e,t){const{discrimination:s,difficulty:a,guessing:n}=t,r=-s*(e-a);return n+(1-n)/(1+Math.exp(r))}function uo(e,t){const s=lo(e,t),{discrimination:a,guessing:n}=t;if(s<=n||s>=1)return 0;const r=a*a*(s-n)**2,o=(1-n)**2*s*(1-s);return o>0?r/o:0}function Uc(e){if(e.length===0)return 0;const t=e.every(o=>o.correct),s=e.every(o=>!o.correct);if(t)return Math.min(3,.5*e.length);if(s)return Math.max(-3,-.5*e.length);let a=0;const n=30,r=.001;for(let o=0;o<n;o+=1){let i=0,c=0;for(const d of e){const u=lo(a,d.item),p=1-u,{discrimination:m,guessing:h}=d.item,g=(u-h)/(1-h),v=m*g*p;d.correct?i+=v/u:i-=v/p,c-=v*v/(u*p)}if(Math.abs(c)<1e-10)break;const l=i/c;if(a-=l,a=Math.max(-3,Math.min(3,a)),Math.abs(l)<r)break}return a}function Fs(e,t){let s=0;for(const a of t)s+=uo(e,a.item);return s>0?1/Math.sqrt(s):999}function Qc(e,t){let s=null,a=-1/0;for(const n of t){const r=uo(e,n);r>a&&(a=r,s=n)}return s}function qa(e){return e<-1?{label:"Beginner",color:"#FB7185",description:"Just getting started — keep learning and practicing!"}:e<0?{label:"Developing",color:"#FBBF24",description:"You understand the basics. Review the tricky parts and try again!"}:e<1?{label:"Proficient",color:"#818CF8",description:"Great understanding! You've got a solid grasp of this topic."}:{label:"Advanced",color:"#34D399",description:"Excellent! You've mastered this topic. Ready for the next challenge!"}}function Hc(e=null,t=10){let s=e?ls.filter(v=>v.lessonId===e):[...ls];s=s.sort(()=>Math.random()-.5);const a=new Set,n=[],r=[];let o=0,i=null,c=0,l=!1,d=null;function u(){if(l)return null;const v=s.filter(b=>!a.has(b.id));return v.length===0||c>=t||c>=5&&Fs(o,n)<.3?(l=!0,null):(i=Qc(o,v),a.add(i.id),c+=1,d=Date.now(),{question:i,questionNumber:c,totalQuestions:Math.min(t,s.length),currentTheta:o,difficulty:i.difficulty>.5?"Hard":i.difficulty<-.5?"Easy":"Medium"})}function p(v){if(!i)return null;const b=Date.now(),I=o,f=v===i.correctIndex,y={item:i,selectedIndex:v,correct:f,questionNumber:c,presentedAt:d||b,answeredAt:b,elapsedMs:Math.max(0,b-(d||b)),thetaBefore:I};return n.push(y),o=Uc(n),y.thetaAfter=o,y.standardErrorAfter=Fs(o,n),r.push({questionId:i.id,questionNumber:c,thetaBefore:Fe(I),thetaAfter:Fe(o),standardErrorAfter:Fe(y.standardErrorAfter),elapsedMs:y.elapsedMs,correct:f}),d=null,{correct:f,correctIndex:i.correctIndex,thetaBefore:I,thetaAfter:o,standardErrorAfter:y.standardErrorAfter,elapsedMs:y.elapsedMs,level:qa(o)}}function m(){return d?Math.max(0,Date.now()-d):0}function h(){const v=n.filter($=>$.correct).length,b=qa(o),I=Fs(o,n),f=n.reduce(($,w)=>$+w.elapsedMs,0),y=n.length>0?Math.round(f/n.length):0;return{score:v,totalQuestions:n.length,theta:Fe(o),standardError:Fe(I),level:b.label,levelColor:b.color,levelDescription:b.description,totalTimeMs:f,averageTimeMs:y,thetaTrajectory:r,responses:n.map($=>({questionId:$.item.id,lessonId:$.item.lessonId,stem:$.item.stem,options:$.item.options,selectedIndex:$.selectedIndex,correctIndex:$.item.correctIndex,correct:$.correct,questionNumber:$.questionNumber,elapsedMs:$.elapsedMs,presentedAt:$.presentedAt,answeredAt:$.answeredAt,thetaBefore:Fe($.thetaBefore),thetaAfter:Fe($.thetaAfter),standardErrorAfter:Fe($.standardErrorAfter)}))}}function g(){return l}return{next:u,answer:p,getCurrentElapsedMs:m,getResults:h,isFinished:g}}const Gc={L1Q1:"A computer is specifically an electronic device that accepts data (input), processes it using instructions, and produces useful information (output). It's not limited to games or typing — it can do many things because of its ability to follow programs.",L1Q2:"A calculator can do math, but it is not a general-purpose computer. It cannot run different programs, browse the internet, or process many types of data. Desktops, laptops, and tablets are all types of computers because they can run software and handle many tasks.",L1Q3:"First generation computers (1940s-1950s) used vacuum tubes — large glass tubes that controlled electrical signals. These made the computers huge (filling entire rooms!) and generated a lot of heat. Transistors came in the second generation.",L1Q4:"The fourth generation (1970s to present) introduced the microprocessor — an entire CPU on a single tiny chip. This breakthrough made personal computers, laptops, and smartphones possible. The Intel 4004 (1971) was one of the first microprocessors.",L1Q5:"Data refers to raw, unprocessed facts and figures (like numbers or words). Information is what you get after data has been processed and organized into something meaningful and useful. For example, student scores (data) become a class ranking (information).",L1Q6:"A smartphone is indeed a type of computer! It has a processor (CPU), memory (RAM), storage, input devices (touchscreen, microphone), and output devices (screen, speaker). It runs software programs (apps) just like a desktop computer.",L1Q7:"The fifth generation of computers focuses on Artificial Intelligence (AI) — making computers that can learn, understand human speech, and make decisions. This includes technologies like voice assistants and self-driving cars.",L1Q8:"A server is a powerful computer that provides services to other computers on a network. When you visit a website, a server sends that information to your device. Servers are typically kept in special rooms and run 24/7.",L2Q1:"The CPU is called the 'brain' of the computer because it carries out all instructions and makes decisions. Just like your brain processes information from your senses, the CPU processes data from input devices and tells other components what to do.",L2Q2:"The motherboard is the main circuit board that connects all computer components together and allows them to communicate. Think of it as the 'backbone' or 'highway system' of the computer — everything plugs into it.",L2Q3:"RAM (Random Access Memory) is temporary memory — it only holds data while the computer is running. When you turn off the computer, all data in RAM is lost. That's why you need to save your work to storage (like a hard drive) to keep it.",L2Q4:"CPU speed is measured in Gigahertz (GHz). One GHz means the CPU can perform one billion basic operations per second! A higher GHz number generally means a faster processor. Megabytes measure storage, not speed.",L2Q5:"ROM (Read-Only Memory) keeps its data even when the computer is turned off — this is called 'non-volatile' memory. RAM loses its data when power is off ('volatile'). ROM stores the essential startup instructions the computer needs to begin loading.",L2Q6:"The Power Supply Unit (PSU) converts AC electricity from the wall outlet into DC electricity at the correct voltages that computer components need. Without it, no component inside the computer would receive power.",L2Q7:"More RAM means the computer can hold more data for active tasks at the same time. This allows you to run multiple programs without the computer slowing down. RAM doesn't affect permanent storage — that's the job of hard drives and SSDs.",L2Q8:"The CPU performs two types of operations: arithmetic (math calculations like adding and multiplying) and logic (comparisons like 'Is A equal to B?' or 'Is X greater than Y?'). All computing tasks ultimately break down into these two types.",L3Q1:"An input device is any hardware that allows you to send data or commands INTO a computer. Without input devices, you would have no way to tell the computer what to do. They are the 'doors' through which data enters the computer.",L3Q2:"A keyboard is an input device — you use it to enter text and commands into the computer. Printers, monitors, and speakers are all output devices because they present data FROM the computer to you.",L3Q3:"A scanner takes a physical document or photograph and converts it into a digital image that the computer can store and display. It works in the opposite direction of a printer — a printer takes digital files and puts them ON paper.",L3Q4:"A touchscreen is special because it serves as BOTH an input device (you tap and swipe to send commands) AND an output device (it displays information). This makes it an I/O (input/output) device.",L3Q5:"A microphone captures sound waves from your voice or the environment and converts them into digital data that the computer can process. This is how voice calls, voice recording, and voice assistants work.",L3Q6:"A trackpad (also called touchpad) is a flat, touch-sensitive surface built into laptops that works like a mouse. You move your finger across it to control the cursor. It's a pointing input device.",L3Q7:"A webcam (web camera) captures video and images, which is exactly what you need for a video call. Scanners capture flat documents, keyboards capture text, and printers are output devices — none of them can capture live video of your face.",L3Q8:"Wireless keyboards connect to the computer using either Bluetooth technology or a small USB receiver that plugs into the computer. This eliminates the need for a cable connection between the keyboard and the computer.",L4Q1:"An output device takes processed data from the computer and presents it in a form that humans can understand. Monitors show visual output, speakers produce audio output, and printers create physical output on paper.",L4Q2:"A monitor is an output device — it displays visual information from the computer to you. Mice, scanners, and keyboards are input devices that send data INTO the computer.",L4Q3:"A 'hard copy' is a physical paper printout of a digital document. The word 'hard' refers to the fact that it's a tangible, physical copy you can hold in your hands, as opposed to a 'soft copy' which exists only on the computer screen.",L4Q4:"A laser printer uses a laser beam to create an image on a drum, which then attracts toner powder. The toner is transferred to paper and fused with heat. Laser printers are fast and great for printing large amounts of text.",L4Q5:"A projector takes the computer's visual display and projects it as a large image on a wall or screen. This makes it ideal for classrooms and meetings where many people need to see the same content at once.",L4Q6:"Speakers receive electrical signals from the computer and convert them into sound waves that we can hear. This is how you hear music, voice in videos, system alerts, and all other audio from a computer.",L4Q7:"A device that serves as both input and output is called an I/O (Input/Output) device. A touchscreen is the best example — you input by touching it, and it outputs by displaying information. Some use the term 'interactive device'.",L4Q8:"A plotter is a specialized output device designed to draw large-format graphics, maps, engineering diagrams, and architectural plans. Unlike regular printers that print line by line, plotters use pens to draw continuous, precise lines.",L5Q1:"Storage devices save data permanently so you can access it later, even after the computer is turned off. Without storage, you would lose all your files every time you shut down — RAM only holds data temporarily while the computer is on.",L5Q2:"A Hard Disk Drive (HDD) uses spinning magnetic disks called platters. A read/write head moves across these platters to store and retrieve data. This mechanical process is what makes HDDs slower than SSDs.",L5Q3:"An SSD (Solid State Drive) uses flash memory chips with no moving parts. Since there are no spinning disks or moving heads, data can be read and written much faster. HDDs are slower because they rely on mechanical, moving parts.",L5Q4:"Google Drive is a cloud storage service. Cloud storage means your files are saved on remote servers accessed through the internet, not on a physical device in your hand. Other examples include Dropbox and OneDrive.",L5Q5:"The correct computing cycle is: Input (data enters) → Processing (CPU works on the data) → Output (results are shown) → Storage (data is saved). This is the fundamental pattern that every computing task follows.",L5Q6:"Hard Disk Drives (HDDs) typically have the largest capacity — they can store 500 GB to several terabytes (TB) of data. SD cards, CDs, and flash drives have much smaller capacities compared to modern HDDs.",L5Q7:"Optical discs like CDs, DVDs, and Blu-ray discs are read using a laser beam. The laser reads tiny pits and lands on the disc surface to retrieve data. That's why they're called 'optical' — they use light (optics) technology.",L5Q8:"In this scenario, the flash drive is the storage device — it permanently saves your school report file. The printer is an output device (it produces a paper copy), the monitor is an output device, and the keyboard is an input device."};async function Ls(e,t,s=12e3){var a;if(!navigator.onLine)return null;try{const n=await fetch("/api/ai/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:e,generationConfig:t}),signal:AbortSignal.timeout(s)});if(!n.ok)return null;const r=await n.json();return((a=r==null?void 0:r.text)==null?void 0:a.trim())||null}catch{return null}}const Wc="Review the lesson material to understand why the correct answer is right. Try reading the relevant section again!",Jt=new Map;function Na(e=""){return e.toLowerCase().replace(/\s+/g," ").trim()}function Vc(e,t,s){return[e,Na(t),Na(s)].join("::")}function Kc(e=""){return e.replace(/\s+/g," ").trim()}function va(e,t){return t?(e||"").toLowerCase().includes("difference")?`Practice tip: compare the choices and explain why "${t}" matches the question best.`:`Practice tip: say out loud why "${t}" is the best answer before you continue.`:"Practice tip: explain the key idea in your own words before you move on."}function Bs(e,t="cache",s={}){return{text:e.text,source:t,model:e.model||null,practiceTip:e.practiceTip||va(e.stem,e.correctAnswer),usageCount:e.usageCount||1,cachedAt:e.updatedAt||e.createdAt||null,savedForOffline:!0,...s}}function Yc(e,t,s){return{text:Gc[e]||Wc,source:"fallback",model:null,practiceTip:va(t,s),usageCount:0,cachedAt:null,savedForOffline:!1}}async function Jc(e,t){const a=(await Qi(e)).filter(r=>r.cacheKey!==t&&r.text).sort((r,o)=>{const i=(o.usageCount||1)-(r.usageCount||1);return i!==0?i:new Date(o.lastUsedAt||o.updatedAt||0)-new Date(r.lastUsedAt||r.updatedAt||0)})[0];if(!a)return null;const n=await la(a.cacheKey);return Bs(n||a,"question-cache",{reusedFromQuestionBank:!0})}async function Nn({questionId:e,stem:t,correctAnswer:s,cacheKey:a,cachedEntry:n,allowQuestionCache:r}){if(n){const o=await la(a);return Bs(o||n,"cache")}if(r){const o=await Jc(e,a);if(o)return o}return Yc(e,t,s)}async function Zc({questionId:e,stem:t,studentAnswer:s,correctAnswer:a,cacheKey:n,cachedEntry:r,allowQuestionCache:o}){try{const i=Xc(t,s,a),c=await Ls(i,{temperature:.6,maxOutputTokens:180,topP:.9},1e4),l=Kc(c||"");if(!l)return Nn({questionId:e,stem:t,correctAnswer:a,cacheKey:n,cachedEntry:r,allowQuestionCache:o});const d=await Hi({cacheKey:n,questionId:e,stem:t,studentAnswer:s,correctAnswer:a,text:l,practiceTip:va(t,a),model:"gemini-2.0-flash",lastUsedAt:new Date().toISOString()});return Bs(d,"ai",{model:"gemini-2.0-flash"})}catch(i){return console.warn("AI feedback failed, using offline fallback:",i.message),Nn({questionId:e,stem:t,correctAnswer:a,cacheKey:n,cachedEntry:r,allowQuestionCache:o})}}async function mo(e,t,s,a,n={}){const{preferCached:r=!1,allowQuestionCache:o=!0}=n,i=Vc(e,s,a),c=await Ui(i);if(!navigator.onLine)return Nn({questionId:e,stem:t,correctAnswer:a,cacheKey:i,cachedEntry:c,allowQuestionCache:o});if(r&&c){const d=await la(i);return Bs(d||c,"cache")}if(Jt.has(i))return Jt.get(i);const l=Zc({questionId:e,stem:t,studentAnswer:s,correctAnswer:a,cacheKey:i,cachedEntry:c,allowQuestionCache:o}).finally(()=>{Jt.delete(i)});return Jt.set(i,l),l}function Xc(e,t,s){return`You are a friendly, encouraging JHS Computing teacher in Ghana. A student answered a quiz question incorrectly. Explain why the correct answer is right in 2-3 simple sentences for a 12-14 year old. Be warm and supportive. Do not say "you are wrong" or shame the learner.

Question: "${e}"
Student's answer: "${t}"
Correct answer: "${s}"

Give only the short explanation:`}async function el(e){const t={},s=e.filter(a=>!a.correct);for(const a of s){const n=a.options[a.selectedIndex],r=a.options[a.correctIndex];t[a.questionId]=await mo(a.questionId,a.stem,n,r,{preferCached:!0})}return t}const Rn="cc_lab_room",Ra=new Set;function tl(){var e,t;return((t=(e=globalThis.crypto)==null?void 0:e.randomUUID)==null?void 0:t.call(e))||`lab-${Date.now()}-${Math.random().toString(36).slice(2)}`}function Ye(){const e=new URLSearchParams(window.location.search).get("lab");return e&&localStorage.setItem(Rn,e),e||localStorage.getItem(Rn)||""}function sl(){const e=tl();return localStorage.setItem(Rn,e),e}function ba(e=Ye()){const t=new URL("/student-login",window.location.origin);return t.searchParams.set("lab",e),t.toString()}function po(e){return e&&Ra.add(e),Ye(),()=>Ra.delete(e)}function Ts(e,t={}){return Ye(),!1}function Pn(e,t={}){return Ts("status",{...t})}function Us(e,t={}){return Ts("control",{...t})}let Se=null,ds=null,yt=null,P=null,jt=!1,ns=null,nl=0;function ho(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),a=String(t%60).padStart(2,"0");return`${s}:${a}`}function Gt(){ns&&(window.clearInterval(ns),ns=null)}function Pa(){const e=document.getElementById("question-timer");!e||!Se||(e.textContent=ho(Se.getCurrentElapsedMs()))}function al(){Gt(),Pa(),ns=window.setInterval(Pa,1e3)}function go(e){return{source:e.source,text:e.aiText,practiceTip:e.practiceTip,usageCount:e.usageCount,reusedFromQuestionBank:e.reusedFromQuestionBank}}function fo(e){return e.correct?"Instant success feedback is ready.":e.feedbackLoading?navigator.onLine?"Generating a simple AI explanation and saving it for offline use...":"You are offline. Looking for a saved explanation on this device...":e.source==="ai"?"Live AI feedback is ready and saved for offline reuse.":e.source==="cache"?"Loaded from the saved feedback cache on this device.":e.source==="question-cache"?"Using a common saved explanation for this question while offline.":"Showing the built-in offline explanation."}function rl(e){if(!P)return;P.aiText=e.text,P.source=e.source,P.practiceTip=e.practiceTip,P.usageCount=e.usageCount,P.reusedFromQuestionBank=e.reusedFromQuestionBank,P.feedbackLoading=!1;const t=document.getElementById("feedback-container");t&&(t.innerHTML=ma(go(P),!1));const s=document.getElementById("feedback-status");s&&(s.textContent=fo(P))}function ol(e,t,s){const a=`feedback-${++nl}`;P&&(P.feedbackRequestId=a),mo(e.id,e.stem,t,s,{preferCached:!1}).then(n=>{!P||P.feedbackRequestId!==a||rl(n)})}function il(e){Gt(),ds=Number.parseInt(e,10),Se=Hc(ds),yt=Se.next(),P=null,jt=!1}function cl(e){const t=Number.parseInt(e,10);(!Se||ds!==t)&&il(t)}function ll(){Gt(),Se=null,ds=null,yt=null,P=null,jt=!1}function dl(){if(!Se||!yt)return'<div class="container">Error initializing quiz.</div>';const e=K(),t=yt;let s="";if(P){const a=P.aiText?ma(go(P),P.correct):'<div class="shimmer" style="height: 116px; width: 100%;"></div>';s=`
      <div class="question-card">
        <div class="quiz-review-meta">
          <span class="badge badge--neutral">Time: ${ho(P.elapsedMs)}</span>
          <span class="badge badge--neutral">Ability: ${P.thetaAfter.toFixed(2)}</span>
          <span class="badge badge--neutral">Level: ${P.levelLabel}</span>
        </div>

        <h3 style="margin-bottom: var(--space-4);">Question Review</h3>
        <p style="margin-bottom: var(--space-6); font-size: var(--font-size-lg);">${P.stem}</p>

        <div class="results-review">
          <div class="review-item ${P.correct?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__answer">
              <div><strong>Your answer:</strong> <span class="${P.correct?"review-item__correct-answer":"review-item__your-answer"}">${P.studentAnswerText}</span></div>
            </div>
            ${P.correct?"":`
              <div class="review-item__answer" style="margin-top: var(--space-2);">
                <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${P.correctAnswerText}</span></div>
              </div>
            `}
          </div>
        </div>

        <div class="feedback-status" id="feedback-status">${fo(P)}</div>
        <div style="margin-top: var(--space-4);" id="feedback-container">
          ${a}
        </div>

        <div style="margin-top: var(--space-8); text-align: right;">
          <button class="btn btn--primary btn--lg" id="btn-next-question">
            ${Se.isFinished()?"See Final Results":"Next Question"}
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

      ${bt(t.questionNumber-1,t.totalQuestions,"Quiz progress")}

      <div id="question-container">
        ${no(t.question)}
      </div>
    `;return`
    ${V({title:"Adaptive Quiz",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter quiz-page" style="padding-top: var(--space-4);">
      ${s}
    </div>
  `}function ul(e,t,s){if(ue({onBack:()=>e(`/lesson/${s}`)}),P){Gt();const n=document.getElementById("btn-next-question");n&&n.addEventListener("click",async()=>{if(P=null,Se.isFinished()){await za(e,s);return}const r=Se.next();if(!r){await za(e,s);return}yt=r,t()});return}al(),ua(document.querySelector(".quiz-page")),document.querySelectorAll(".option-btn").forEach(n=>{n.addEventListener("click",r=>{if(jt)return;jt=!0;const o=Number.parseInt(r.currentTarget.dataset.index,10);ml(o,r.currentTarget,t)})})}function ml(e,t,s){const a=Se.answer(e),n=yt.question;if(Gt(),document.querySelectorAll(".option-btn").forEach(o=>{o.classList.add("option-btn--disabled"),o.disabled=!0}),a.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const o=document.getElementById(`option-${a.correctIndex}`);o&&o.classList.add("option-btn--highlight-correct")}P={questionId:n.id,stem:n.stem,correct:a.correct,studentAnswerText:n.options[e],correctAnswerText:n.options[a.correctIndex],aiText:a.correct?"Great work - you understood this concept.":null,source:a.correct?"system":null,practiceTip:a.correct?"Keep building on that idea in the next question.":null,usageCount:0,reusedFromQuestionBank:!1,feedbackLoading:!a.correct,feedbackRequestId:null,elapsedMs:a.elapsedMs,thetaAfter:a.thetaAfter,levelLabel:a.level.label},a.correct||ol(n,P.studentAnswerText,P.correctAnswerText),setTimeout(()=>{jt=!1,s()},1e3)}async function za(e,t){const s=K(),a=Se.getResults();if(!s){e("/lessons");return}const n=await ia({studentId:s.id,lessonId:Number.parseInt(t,10),...a});Ts("quiz-result",{studentId:s.id,studentName:s.name,result:{...n,remoteResultId:`${s.id}-${n.lessonId}-${n.completedAt}`}}),e(`/quiz-results/${n.id}`)}const vo=new TextEncoder,pl=new TextDecoder,Qs=e=>btoa(String.fromCharCode(...e)),Hs=e=>Uint8Array.from(atob(e),t=>t.charCodeAt(0));async function bo(e,t){const s=await crypto.subtle.importKey("raw",vo.encode(`${e.indexNumber}|${e.pin}`),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:12e4,hash:"SHA-256"},s,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function yo(e,t){if(!(e!=null&&e.indexNumber)||!(e!=null&&e.pin))throw new Error("This learner needs an index number and PIN before a USB submission can be sealed.");const s=crypto.getRandomValues(new Uint8Array(16)),a=crypto.getRandomValues(new Uint8Array(12)),n=vo.encode(JSON.stringify({version:1,createdAt:new Date().toISOString(),submission:t})),r=await crypto.subtle.encrypt({name:"AES-GCM",iv:a},await bo(e,s),n);return{app:"ClassConnect",type:"ccsub",version:1,studentIndexNumber:e.indexNumber,salt:Qs(s),iv:Qs(a),ciphertext:Qs(new Uint8Array(r))}}async function hl(e,t){const s=JSON.parse(await e.text());if((s==null?void 0:s.app)!=="ClassConnect"||(s==null?void 0:s.type)!=="ccsub")throw new Error("This is not a ClassConnect submission file.");const a=t.find(n=>n.indexNumber===s.studentIndexNumber);if(!a)throw new Error(`No learner matches ${s.studentIndexNumber}.`);try{const n=await crypto.subtle.decrypt({name:"AES-GCM",iv:Hs(s.iv)},await bo(a,Hs(s.salt)),Hs(s.ciphertext));return{student:a,payload:JSON.parse(pl.decode(n))}}catch{throw new Error(`Verification failed for ${s.studentIndexNumber}; the file may be altered or use a different PIN.`)}}function wo(e,t){const s=document.createElement("a");s.href=URL.createObjectURL(new Blob([JSON.stringify(e)],{type:"application/json"})),s.download=`classconnect-${t}-${Date.now()}.ccsub`,s.click(),URL.revokeObjectURL(s.href)}function zn(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),a=String(t%60).padStart(2,"0");return`${s}:${a}`}async function gl(e){var c,l,d;const t=K(),s=await ze(),a=s.find(u=>u.id===Number.parseInt(e,10));if(!a)return'<div class="container">Result not found.</div>';const n=t?s.filter(u=>u.studentId===t.id):[],r=t?await Me(t.id):null,o=t?await xe(t.id):[],i=Ee({diagnostic:r,results:n,progressRecords:o});return`
    ${V({title:"Quiz Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Lessons"})}
    <div class="container container--narrow view-enter quiz-results">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-extrabold); margin-bottom: var(--space-2);">Quiz Complete!</h1>
        <p style="color: var(--text-secondary);">Here is how you did.</p>
      </div>

      ${ao(a.score,a.totalQuestions)}

      <div class="quiz-results__level">
        <div class="quiz-results__level-label" style="color: ${a.levelColor};">
          Level: ${a.level}
        </div>
        <p class="quiz-results__level-desc">${a.levelDescription}</p>
      </div>

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Total time</span>
          <span class="quiz-result-metric__value">${zn(a.totalTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Average / question</span>
          <span class="quiz-result-metric__value">${zn(a.averageTimeMs)}</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Standard error</span>
          <span class="quiz-result-metric__value">${a.standardError}</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Adaptive content path</div>
        <h3 class="results-next-step__title">Recommended next: ${((c=i.recommendedNext)==null?void 0:c.title)||"Return to lessons"}</h3>
        <p class="results-next-step__text">${((l=i.recommendedNext)==null?void 0:l.recommendedFocus)||"Keep following your personalized path."}</p>
        <div class="results-next-step__chips">
          <span class="badge badge--${i.risk.badge}">Risk: ${i.risk.label}</span>
          <span class="badge badge--neutral">${((d=i.revisionQueue[0])==null?void 0:d.title)||"Revision queue updated"}</span>
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
         <button class="btn btn--secondary" id="btn-save-quiz-usb">Save Submission to USB</button>
      </div>
    </div>
  `}function fl(e,t){ue({onBack:()=>e("/lessons")});const s=document.getElementById("btn-next-lesson"),a=document.getElementById("btn-open-tutor"),n=document.getElementById("btn-retry-quiz"),r=document.getElementById("btn-save-quiz-usb");ze().then(async o=>{const i=o.find(m=>m.id===Number.parseInt(t,10));if(!i)return;const c=K(),l=c?o.filter(m=>m.studentId===c.id):[],d=c?await Me(c.id):null,u=c?await xe(c.id):[],p=Ee({diagnostic:d,results:l,progressRecords:u});s&&s.addEventListener("click",()=>{var h;const m=(h=p.recommendedNext)==null?void 0:h.lessonId;e(m?`/lesson/${m}`:"/lessons")}),a&&a.addEventListener("click",()=>{e("/tutor")}),n&&n.addEventListener("click",()=>{e(`/quiz/${i.lessonId}`)}),r&&r.addEventListener("click",async()=>{try{wo(await yo(c,{kind:"quiz",record:i}),c.indexNumber)}catch(m){alert(m.message)}}),vl(i.responses)})}async function vl(e){const t=document.getElementById("review-list");if(!t)return;t.innerHTML=e.map(a=>Gs(a,null)).join("");const s=await el(e);t.innerHTML=e.map(a=>a.correct?Gs(a,{text:"Correct! You handled this concept well.",source:"system"}):Gs(a,s[a.questionId])).join("")}function Gs(e,t){const s=e.options[e.selectedIndex],a=e.options[e.correctIndex];let n="";return t?e.correct||(n=`
        <div class="review-item__feedback">
          ${ma(t,!1)}
        </div>
      `):e.correct||(n='<div class="shimmer" style="height: 116px; margin-top: var(--space-3);"></div>'),`
    <div class="review-item ${e.correct?"review-item--correct":"review-item--incorrect"}">
      <div class="review-item__question">${e.questionNumber}. ${e.stem}</div>
      <div class="review-item__meta">
        <span>Time: ${zn(e.elapsedMs)}</span>
        <span>Theta after: ${e.thetaAfter}</span>
      </div>
      <div class="review-item__answer">
        <div><strong>Your answer:</strong> <span class="${e.correct?"review-item__correct-answer":"review-item__your-answer"}">${s}</span></div>
      </div>
      ${e.correct?"":`
        <div class="review-item__answer" style="margin-top: var(--space-1);">
          <div><strong>Correct answer:</strong> <span class="review-item__correct-answer">${a}</span></div>
        </div>
      `}
      ${n}
    </div>
  `}const bl=[{href:"/dashboard",label:"Overview",permission:"dashboard",icon:"◫"},{href:"/students",label:"Classes & Learners",permission:"roster.manage",icon:"♙"},{href:"/assessment-lab",label:"Assessments",permission:"assessment.manage",icon:"✓"},{href:"/gradebook",label:"Gradebook & Reports",permission:"gradebook",icon:"▤"},{href:"/lesson-editor",label:"Curriculum",permission:"cms.manage",icon:"▱"},{href:"/lab-monitor",label:"Lab Monitor",permission:"lab.monitor",icon:"◉"},{href:"/admin",label:"Administration",permission:"users.manage",icon:"⚙"}];function Je({title:e,subtitle:t="",activePath:s,content:a}){var i,c;const n=ws(),r=ks(),o=bl.filter(l=>vs(l.permission,n));return`
    ${V({title:"ClassConnect",showBack:!1,showLogout:!0})}
    <div class="staff-shell">
      <aside class="staff-sidebar" aria-label="Staff workspace navigation">
        <div class="staff-sidebar__identity"><div class="staff-sidebar__avatar">${((n==null?void 0:n.name)||(n==null?void 0:n.username)||"S").slice(0,1).toUpperCase()}</div><div><strong>${_t((n==null?void 0:n.name)||(n==null?void 0:n.username)||"Staff")}</strong><span>${_t(Ge[n==null?void 0:n.role]||"Staff")}${(n==null?void 0:n.role)==="teacher"?` · ${((i=n.classIds)==null?void 0:i.length)||0} assigned class${((c=n.classIds)==null?void 0:c.length)===1?"":"es"}`:""}</span></div></div>
        <nav class="staff-sidebar__nav">${o.map(l=>`<button class="staff-nav-item ${s===l.href?"staff-nav-item--active":""}" data-staff-route="${l.href}" aria-current="${s===l.href?"page":"false"}"><span aria-hidden="true">${l.icon}</span>${l.label}</button>`).join("")}</nav>
        <div class="staff-sidebar__footer">Offline school workspace<br><span>Data stays on this device</span></div>
      </aside>
      <main class="staff-main"><header class="staff-page-header"><div><p class="staff-page-header__eyebrow">Staff workspace</p><h1>${_t(e)}</h1>${t?`<p>${_t(t)}</p>`:""}</div><div id="staff-page-actions" class="staff-page-header__actions">${r.classes.length?`<label class="staff-context-select">Class scope<select id="staff-global-class"><option value="all">All permitted classes</option>${r.classes.map(l=>`<option value="${l.id}" ${String(l.id)===String(r.selectedClassId)?"selected":""}>${_t(l.name)}</option>`).join("")}</select></label>`:""}</div></header>${a}</main>
    </div>`}function rt(e,{onLogout:t}={}){var s;ue({onBrand:()=>e("/dashboard"),onLogout:t||(()=>{Is(),e("/")})}),document.querySelectorAll("[data-staff-route]").forEach(a=>a.addEventListener("click",()=>e(a.dataset.staffRoute))),(s=document.getElementById("staff-global-class"))==null||s.addEventListener("change",a=>{const n=ks();Ss(n.classes,a.currentTarget.value),e(window.location.pathname,!1)})}function _t(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function yl(e="/dashboard"){return`${V({title:"ClassConnect",showLogout:!0})}<main class="access-denied"><section class="card"><p class="staff-page-header__eyebrow">Access restricted</p><h1>You do not have access to this workspace</h1><p>Your staff role does not include this area. Return to a workspace available to you.</p><button class="btn btn--primary" data-access-denied-return="${e}">Return to my workspace</button></section></main>`}function wl(e){var t;ue({onLogout:()=>{Is(),e("/")}}),(t=document.querySelector("[data-access-denied-return]"))==null||t.addEventListener("click",s=>e(s.currentTarget.dataset.accessDeniedReturn))}let Ws=null,ja=!1;async function Io(){return Ws||(Ws=sa(()=>import("./chart-45xamTTr.js"),[]).then(e=>{const t=e.Chart;return ja||(t.register(...e.registerables),ja=!0),t})),Ws}function Il(){return["Index Number,Full Name,Class,Gender,PIN","GES-B7-0101,Kwame Mensah,B7 — JHS 1A,Male,1234","GES-B7-0102,Ama Serwaa,B7 — JHS 1A,Female,5678","GES-B7-0103,Kofi Boateng,B7 — JHS 1A,Male,","GES-B7-0104,Abena Osei,B7 — JHS 1B,Female,9012","GES-B7-0105,Yaw Appiah,B7 — JHS 1B,Male,"].join(`
`)}function Sl(){const e=Il(),t=new Blob([e],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(t),a=document.createElement("a");a.href=s,a.download="classconnect_sample_roster.csv",a.click(),URL.revokeObjectURL(s)}function kl(e){const t=e.split(/\r?\n/)[0]||"",s=(t.match(/,/g)||[]).length,a=(t.match(/;/g)||[]).length,n=(t.match(/\t/g)||[]).length;return n>s&&n>a?"	":a>s?";":","}function _l(e){const t=kl(e),s=e.split(/\r?\n/).map(a=>a.trim()).filter(Boolean);return s.length<1?[]:s.map(a=>{const n=[];let r=!1,o="";for(let i=0;i<a.length;i+=1){const c=a[i];c==='"'?r=!r:c===t&&!r?(n.push(o.trim().replace(/^"|"$/g,"")),o=""):o+=c}return n.push(o.trim().replace(/^"|"$/g,"")),n})}function $t(e,t=[]){const s=e.map(a=>a.toLowerCase().replace(/[^a-z0-9]/g,""));for(const a of t){const n=a.toLowerCase().replace(/[^a-z0-9]/g,""),r=s.indexOf(n);if(r!==-1)return r}return-1}function $l(e=""){const t=e.trim().toLowerCase();return t.startsWith("m")||t==="boy"?"Male":t.startsWith("f")||t==="girl"?"Female":"Unspecified"}function Al(){return String(Math.floor(1e3+Math.random()*9e3))}function Cl(e,t=[],s=[],a=null){var I,f,y;const n=_l(e);if(n.length<2)return{success:!1,error:"The CSV file must contain a header row and at least one student record.",validRecords:[],warnings:[],errors:[]};const r=n[0],o=$t(r,["fullname","name","studentname","learnername"]),i=$t(r,["indexnumber","indexno","id","admissionno","studentid"]),c=$t(r,["class","grade","stream","section","classstream"]),l=$t(r,["gender","sex"]),d=$t(r,["pin","password","code","logincode"]);if(o===-1&&i===-1)return{success:!1,error:'CSV header must include at least a "Full Name" or "Index Number" column.',validRecords:[],warnings:[],errors:[]};const u=[],p=[],m=[],h=new Set,g=new Set,v=new Map;t.forEach($=>{v.set($.name.toLowerCase().trim(),$.id),$.gradeLevel&&$.stream&&(v.set(`${$.gradeLevel} ${$.stream}`.toLowerCase().trim(),$.id),v.set(`${$.gradeLevel}-${$.stream}`.toLowerCase().trim(),$.id))});const b=a||((I=t[0])==null?void 0:I.id)||1;for(let $=1;$<n.length;$+=1){const w=n[$],S=o!==-1?(w[o]||"").trim():"",_=i!==-1?(w[i]||"").trim():"",k=c!==-1?(w[c]||"").trim():"",x=l!==-1?w[l]:"",A=d!==-1?(w[d]||"").trim():"";if(!S&&!_)continue;if(S.length<2&&!_){p.push(`Row ${$+1}: Student name "${S}" is too short.`);continue}let C=b,E=((f=t.find(j=>j.id===b))==null?void 0:f.name)||"Default Class";if(k){const j=v.get(k.toLowerCase().trim());j?(C=j,E=((y=t.find(Y=>Y.id===j))==null?void 0:y.name)||k):m.push(`Row ${$+1}: Class "${k}" not recognized. Assigned to ${E}.`)}let L=A,F=!1;if((!L||!/^\d{4}$/.test(L))&&(L=Al(),F=!0),_){if(h.has(_.toLowerCase())){p.push(`Row ${$+1}: Duplicate Index Number "${_}" found in CSV.`);continue}h.add(_.toLowerCase())}const U=`${S.toLowerCase()}::${C}`;S&&g.has(U)&&m.push(`Row ${$+1}: Student "${S}" appears multiple times in this class.`),S&&g.add(U);const z=s.find(j=>_&&j.indexNumber&&j.indexNumber.toLowerCase()===_.toLowerCase()||S&&j.name.toLowerCase()===S.toLowerCase()&&j.classId===C);u.push({rowNumber:$+1,name:S||_,indexNumber:_||null,classId:C,className:E,gender:$l(x),pin:L,pinGenerated:F,status:"active",isUpdate:!!z,existingId:(z==null?void 0:z.id)||null})}return{success:u.length>0,validRecords:u,errors:p,warnings:m,summary:{totalRows:n.length-1,validCount:u.length,errorCount:p.length,warningCount:m.length,newCount:u.filter($=>!$.isUpdate).length,updateCount:u.filter($=>$.isUpdate).length,autoPinsGenerated:u.filter($=>$.pinGenerated).length}}}const xl=3e4;let T=null,Dt=[],et=null,ya=null,as=null,rs=null,Mt=null,qt=null,mt=null,os=!1,wt=null,X="all",us="",wa="overview",$e={status:"all",gender:"all",risk:"all",participation:"all"};function N(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function El(e=[]){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function jn(e=0){const t=Math.max(0,Math.round(e/1e3)),s=String(Math.floor(t/60)).padStart(2,"0"),a=String(t%60).padStart(2,"0");return`${s}:${a}`}function ms(e){return e?new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"Not yet"}function On(e){var t;return((t=q.find(s=>s.id===e))==null?void 0:t.title)||`Lesson ${e}`}function Ll(e){const t={};return e.slice().sort((s,a)=>new Date(s.completedAt)-new Date(a.completedAt)).forEach(s=>{t[s.studentId]=s}),Object.values(t)}function Bl(e){const t=(e==null?void 0:e.lessonBreakdown)||[];return t.length?Math.round(El(t.map(s=>s.accuracy||0))*100):0}function Tl(e,t,s,a,n,r){const o=new Map(e.map(l=>[l.id,l])),i=new Map(n.map(l=>[l.id,l])),c=[];return t.forEach(l=>{var p;const d=((p=o.get(l.studentId))==null?void 0:p.name)||"Unknown learner",u=l.totalQuestions>0?Math.round(l.score/l.totalQuestions*100):0;c.push({type:"Quiz",tone:u>=70?"success":u>=50?"warning":"danger",title:`${d} completed ${On(l.lessonId)} quiz`,meta:`${u}% score · ${l.level||"No level"} · ${jn(l.totalTimeMs)}`,timestamp:l.completedAt})}),s.forEach(l=>{var u;const d=((u=o.get(l.studentId))==null?void 0:u.name)||"Unknown learner";c.push({type:"Progress",tone:"primary",title:`${d} completed ${On(l.lessonId)}`,meta:"Lesson completion saved to the local database.",timestamp:l.completedAt})}),a.forEach(l=>{var u;const d=((u=o.get(l.studentId))==null?void 0:u.name)||"Unknown learner";c.push({type:"Diagnostic",tone:"accent",title:`${d} completed the readiness diagnostic`,meta:`${Bl(l)}% average readiness across sampled lessons.`,timestamp:l.completedAt})}),n.forEach(l=>{c.push({type:"Assess",tone:"accent",title:`Published ${l.title}`,meta:`${l.questions.length} questions · ${l.objectiveCoverage.length} objectives covered.`,timestamp:l.createdAt})}),r.forEach(l=>{var g,v,b,I,f;const d=((g=o.get(l.studentId))==null?void 0:g.name)||"Unknown learner",u=((v=i.get(l.assessmentId))==null?void 0:v.title)||"an assessment",p=((b=l.integrity)==null?void 0:b.label)||"Low",m=((I=l.proctor)==null?void 0:I.label)||"Low",h=((f=l.grading)==null?void 0:f.percentage)??0;c.push({type:"Submit",tone:p==="High"||m==="High"?"warning":"success",title:`${d} submitted ${u}`,meta:`${h}% score · Integrity ${p} · Proctor ${m}`,timestamp:l.completedAt})}),c.sort((l,d)=>new Date(d.timestamp)-new Date(l.timestamp)).slice(0,8)}function Dl(e,t,s,a,n,r){const o=Ll(t),i={};a.slice().sort((w,S)=>new Date(S.completedAt)-new Date(w.completedAt)).forEach(w=>{i[w.studentId]||(i[w.studentId]=w)});const c=e.map(w=>{const S=t.filter(A=>A.studentId===w.id),_=s.filter(A=>A.studentId===w.id),k=i[w.id]||null,x=Ee({diagnostic:k,results:S,progressRecords:_});return{student:w,results:S,progressRecords:_,diagnostic:k,profile:x}}),l=e.length>0?Math.round(s.length/(e.length*q.length)*100):0,d=o.length>0?Math.round(o.reduce((w,S)=>w+S.score/S.totalQuestions,0)/o.length*100):0,u=c.filter(w=>w.profile.risk.score>=60).length,p=e.length>0?Math.round(c.filter(w=>w.diagnostic).length/e.length*100):0,m={},h={};t.forEach(w=>{m[w.lessonId]=(m[w.lessonId]||0)+w.score/w.totalQuestions,h[w.lessonId]=(h[w.lessonId]||0)+1});const g=q.map(w=>h[w.id]?Math.round(m[w.id]/h[w.id]*100):0),v={Advanced:0,Proficient:0,Developing:0,Beginner:0};o.forEach(w=>{v[w.level]!==void 0&&(v[w.level]+=1)});const b={};t.forEach(w=>{w.responses.forEach(S=>{if(S.correct)return;const _=`${S.questionId}|${S.stem}|${S.options[S.selectedIndex]}`;b[_]=(b[_]||0)+1})});const I=Object.entries(b).map(([w,S])=>{const[_,k,x]=w.split("|");return{questionId:_,stem:k,answer:x,count:S}}).sort((w,S)=>S.count-w.count).slice(0,7),f=q.map(w=>{const S=c.map(_=>{var k;return((k=_.profile.lessonProfiles.find(x=>x.lessonId===w.id))==null?void 0:k.mastery)||0});return{lessonId:w.id,title:w.title,averageMastery:S.length?Math.round(S.reduce((_,k)=>_+k,0)/S.length*100):0}}),y=c.filter(w=>w.profile.risk.score>=35).sort((w,S)=>S.profile.risk.score-w.profile.risk.score).slice(0,6),$=Tl(e,t,s,a,n,r);return{students:e,results:t,progressRecords:s,diagnostics:a,assessments:n,assessmentSubmissions:r,studentProfiles:c,latestResults:o,recentActivity:$,summary:{totalStudents:e.length,averageScore:d,completionRate:l,studentsAtRisk:u,diagnosticCoverage:p,totalAssessments:n.length,totalAssessmentSubmissions:r.length},charts:{lessonLabels:q.map(w=>`Lesson ${w.id}`),lessonScoreData:g,levelCounts:v,misconceptions:I},interventionQueue:y,masterySnapshot:f}}async function Ia(){const[e,t,s,a,n,r,o]=await Promise.all([de(),we(),ze(),bs(),ys(),Qt(),je()]),i=$i(),c=i===null?e:e.filter(I=>i.includes(Number(I.id))),l=ks();X==="all"&&l.selectedClassId!=="all"&&(X=l.selectedClassId),X!=="all"&&!c.some(I=>String(I.id)===String(X))&&(X="all");const d=c.map(I=>({...I,studentCount:t.filter(f=>f.classId===I.id).length})),u=i===null?t:t.filter(I=>i.includes(Number(I.classId))),p=X==="all"?u:u.filter(I=>String(I.classId)===String(X)),m=new Set(p.map(I=>I.id)),h=X==="all"?s:s.filter(I=>m.has(I.studentId)),g=X==="all"?a:a.filter(I=>m.has(I.studentId)),v=X==="all"?n:n.filter(I=>m.has(I.studentId)),b=X==="all"?o:o.filter(I=>m.has(I.studentId));return T=Dl(p,h,g,v,r,b),T.classes=d,T.auditEntries=(await As()).slice(0,8),Ss(c,X),T.allStudents=t,T.selectedClassId=X,T.currentTeacher=ws(),ya=new Date().toISOString(),T}function Ml(e){return`
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
              <span class="activity-item__time">${ms(t.timestamp)}</span>
            </div>
            <div class="activity-item__title">${t.title}</div>
            <div class="activity-item__meta">${t.meta}</div>
          </div>
        `).join(""):'<div class="insight-empty">Waiting for learner activity on this device.</div>'}
      </div>
    </div>
  `}function Fn(e){if(!e.students.length)return`
      <div class="empty-state dashboard-empty">
        <div class="empty-state__icon">Data</div>
        <h2 class="empty-state__title">No Students in Selected View</h2>
        <p class="empty-state__text">Import a CSV roster or change your class filter to display student learning records.</p>
      </div>
    `;const t=us.trim().toLowerCase(),a=(t?e.students.filter(n=>n.name&&n.name.toLowerCase().includes(t)||n.indexNumber&&n.indexNumber.toLowerCase().includes(t)):e.students).filter(n=>{var i,c;const r=(i=e.studentProfiles.find(l=>l.student.id===n.id))==null?void 0:i.profile,o=e.results.filter(l=>l.studentId===n.id).length;return($e.status==="all"||(n.status||"active")===$e.status)&&($e.gender==="all"||(n.gender||"unspecified")===$e.gender)&&($e.risk==="all"||((c=r==null?void 0:r.risk)==null?void 0:c.badge)===$e.risk)&&($e.participation==="all"||($e.participation==="started"?o>0:o===0))});return a.length?`
    <div class="student-table-wrap">
      <table class="student-table">
        <thead>
          <tr>
            <th><input type="checkbox" id="select-all-learners" aria-label="Select all visible learners"></th>
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
          ${a.map(n=>{var u;const r=e.results.filter(p=>p.studentId===n.id).sort((p,m)=>new Date(m.completedAt)-new Date(p.completedAt)),o=r[0],i=e.progressRecords.filter(p=>p.studentId===n.id).length,c=e.studentProfiles.find(p=>p.student.id===n.id),l=c==null?void 0:c.profile.risk,d=((u=e.classes.find(p=>p.id===n.classId))==null?void 0:u.name)||"General";return`
              <tr class="student-row" data-id="${n.id}">
                <td><input type="checkbox" class="learner-select" value="${n.id}" aria-label="Select ${N(n.name)}"></td>
                <td><code style="font-size: var(--font-size-xs);">${N(n.indexNumber||`GES-B7-${n.id}`)}</code></td>
                <td class="student-table__name">${N(n.name)}</td>
                <td><span class="badge badge--neutral">${N(d)}</span></td>
                <td>${N(n.gender||"Unspecified")}</td>
                <td>${i}/${q.length}</td>
                <td>${r.length}</td>
                <td class="student-table__score">${o?`${Math.round(o.score/o.totalQuestions*100)}%`:"-"}</td>
                <td><span class="badge badge--${(l==null?void 0:l.badge)||"neutral"}">${(l==null?void 0:l.label)||"No Data"}</span></td>
                <td style="text-align: right; white-space: nowrap;" onclick="event.stopPropagation();">
                  <button class="btn btn--ghost btn--xs btn-quick-profile" data-id="${n.id}" title="Open learner profile">Profile</button>
                  <button class="btn btn--ghost btn--xs btn-quick-report-card" data-id="${n.id}" title="View Terminal Report Card">Report Card</button>
                  <button class="btn btn--ghost btn--xs btn-quick-reset-pin" data-id="${n.id}" title="Reset 4-digit PIN">Reset PIN</button>
                  <button class="btn btn--ghost btn--xs btn-quick-edit-student" data-id="${n.id}" title="Edit or transfer learner">Edit</button>
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `:`
      <div class="empty-state dashboard-empty">
        <h3 class="empty-state__title">No Matching Learners</h3>
        <p class="empty-state__text">No students matched "${N(us)}". Try searching for another name or index number.</p>
      </div>
    `}function Sa(e){return wa==="learners"?Nl(e):ql(e)}function ql(e){const{summary:t}=e,s=n=>vs(n,e.currentTeacher),a=[s("roster.manage")&&["Classes & Learners","Find learners, manage rosters, issue PINs.","/students"],s("assessment.manage")&&["Assessments","Create, publish, and review assessment activity.","/assessment-lab"],s("gradebook")&&["Gradebook & Reports","Review terminal marks and report cards.","/gradebook"],s("cms.manage")&&["Curriculum","Author lessons and maintain the question bank.","/lesson-editor"],s("lab.monitor")&&["Lab Monitor","Monitor active assessment sessions.","/lab-monitor"],s("users.manage")&&["Administration","Staff, classes, backups, and audit records.","/admin"]].filter(Boolean);return`<div class="dashboard-header"><div class="dashboard-header__top"><div><h2 class="dashboard-header__title">School overview</h2><p class="dashboard-header__subtitle">The most important learning signals and next actions for your current access scope.</p></div><div class="dashboard-header__actions"><select id="overview-period" class="input input--sm" aria-label="Overview time period"><option value="term">This term</option><option value="today">Today</option></select><button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh</button></div></div><div class="dashboard-live-bar"><div class="dashboard-live-bar__item"><strong>Last updated:</strong> <span id="dashboard-live-updated">${ms(ya)}</span></div><div class="dashboard-live-bar__item" id="dashboard-live-status-text"><strong>Live sync:</strong> Local school data is up to date.</div></div></div>
    <div class="stat-grid">${Yt("Students",t.totalStudents,"Learners in scope","primary",`${e.results.length} quiz records`)}${Yt("Average",`${t.averageScore}%`,"Average score","accent","Latest quiz per learner")}${Yt("Support",t.studentsAtRisk,"Needs attention",t.studentsAtRisk?"danger":"success","Risk score 60+")}${Yt("Assess",t.totalAssessments,"Published assessments","primary",`${t.totalAssessmentSubmissions} submissions`)}</div>
    <section><div class="staff-section-heading"><div><h2>Quick actions</h2><p>Open a focused workspace instead of managing everything here.</p></div></div><div class="workspace-card-grid">${a.map(([n,r,o])=>`<button class="workspace-action-card" data-workspace-route="${o}"><strong>${n}</strong><span>${r}</span></button>`).join("")}</div></section>
    <div class="dashboard-panels"><div class="card dashboard-panel"><h3 class="chart-card__title">Needs attention</h3><p class="chart-card__subtitle">Learners who would benefit most from a timely follow-up.</p><div class="intervention-list">${e.interventionQueue.slice(0,5).map(n=>`<button class="intervention-item intervention-item--button" data-learner-profile="${n.student.id}"><div><div class="intervention-item__name">${N(n.student.name)}</div><div class="intervention-item__meta">${N(n.profile.risk.reasons.join(" · "))}</div></div><span class="badge badge--${n.profile.risk.badge}">Risk ${n.profile.risk.score}</span></button>`).join("")||'<div class="insight-empty">No learners are currently flagged.</div>'}</div></div>${Ml(e)}</div><details class="card learning-insights"><summary>Learning insights <span>Expand charts and misconception patterns</span></summary><div class="charts-section"><div class="card chart-card"><h3 class="chart-card__title">Average score by lesson</h3><div class="chart-card__canvas-wrap"><canvas id="chart-scores"></canvas></div></div><div class="card chart-card"><h3 class="chart-card__title">Ability level distribution</h3><div class="chart-card__canvas-wrap"><canvas id="chart-levels"></canvas></div></div></div><div class="card chart-card"><h3 class="chart-card__title">Most commonly missed questions</h3><div class="chart-card__canvas-wrap chart-card__canvas-wrap--tall"><canvas id="chart-misconceptions"></canvas></div></div></details><section class="card dashboard-panel"><h3 class="chart-card__title">Recent changes</h3><div class="activity-feed">${e.auditEntries.map(n=>`<div class="activity-item"><div class="activity-item__top"><span class="badge badge--neutral">${N(n.action)}</span><span class="activity-item__time">${ms(n.createdAt)}</span></div><div class="activity-item__meta">${N(n.actor||"system")}</div></div>`).join("")||'<div class="insight-empty">No recent administrative changes.</div>'}</div></section>`}function Nl(e){const t=vs("data.export",e.currentTeacher);return`<div class="dashboard-header"><div class="dashboard-header__top"><div><h2 class="dashboard-header__title">Classes & learners</h2><p class="dashboard-header__subtitle">Search, support, and manage learners in your permitted classes.</p></div><div class="dashboard-header__actions"><select id="class-filter-select" class="select-class" aria-label="Filter learners by class"><option value="all">All permitted classes (${e.classes.length})</option>${e.classes.map(s=>`<option value="${s.id}" ${String(e.selectedClassId)===String(s.id)?"selected":""}>${N(s.name)} (${s.studentCount})</option>`).join("")}</select><button class="btn btn--ghost btn--sm" id="btn-refresh-dashboard">Refresh</button></div></div></div><section class="class-directory"><h3>My classes</h3><div class="class-directory__grid">${e.classes.map(s=>`<button class="class-directory__card" data-class-directory-id="${s.id}"><strong>${N(s.name)}</strong><span>${s.studentCount} learners · ${N(s.term||"Current term")}</span></button>`).join("")||'<p class="insight-empty">No class assignments are available.</p>'}</div></section><section class="student-section"><div class="student-section__header"><div><h3 class="student-section__title">Learner roster</h3><p class="dashboard-header__subtitle">Open a learner to view their history, reset access, transfer them, or issue a report card.</p></div><div class="export-area"><button class="btn btn--secondary btn--sm" id="btn-import-roster">Import roster</button><button class="btn btn--secondary btn--sm" id="btn-print-slips">Print login slips</button>${t?'<button class="btn btn--ghost btn--sm" id="btn-export-csv">Export data</button>':""}</div></div><div class="roster-filter-bar"><input type="search" id="roster-search-input" class="input input--sm roster-search-input" placeholder="Search by learner name or index number" value="${N(us)}"><div class="learner-filter-chips"><select class="input input--sm" data-learner-filter="status"><option value="all">All statuses</option><option value="active" ${$e.status==="active"?"selected":""}>Active</option><option value="transferred" ${$e.status==="transferred"?"selected":""}>Transferred</option></select><select class="input input--sm" data-learner-filter="gender"><option value="all">All genders</option><option value="male">Male</option><option value="female">Female</option></select><select class="input input--sm" data-learner-filter="risk"><option value="all">All risk levels</option><option value="danger">High risk</option><option value="warning">Watch</option><option value="success">On track</option></select><select class="input input--sm" data-learner-filter="participation"><option value="all">Any participation</option><option value="started">Started work</option><option value="not-started">Not started</option></select></div></div><div id="roster-table-container">${Fn(e)}</div></section>`}function Lt(){return!!document.getElementById("dashboard-live-root")}function So(){Dt.forEach(e=>e.destroy()),Dt=[]}async function Rl(e){var o;const t=await we(),s=await ze(),a=await je();let n=0;const r=[];for(const i of[...e].filter(c=>c.name.toLowerCase().endsWith(".ccsub")))try{const{student:c,payload:l}=await hl(i,t),d=(o=l.submission)==null?void 0:o.record;if(!d)throw new Error("No submission record found.");if(l.submission.kind==="quiz"){if(s.some(h=>h.studentId===c.id&&h.lessonId===d.lessonId&&h.completedAt===d.completedAt))continue;const{id:u,studentId:p,...m}=d;await ia({...m,studentId:c.id,completedAt:d.completedAt})}else if(l.submission.kind==="assessment"){if(a.some(h=>h.studentId===c.id&&h.assessmentId===d.assessmentId&&h.completedAt===d.completedAt))continue;const{id:u,studentId:p,...m}=d;await ca({...m,studentId:c.id,completedAt:d.completedAt})}else throw new Error("Unsupported submission type.");n+=1}catch(c){r.push(`${i.name}: ${c.message}`)}D(`${n} USB submission${n===1?"":"s"} imported${r.length?`; ${r.length} rejected`:""}.`,r.length?"warning":"success")}function Pl(){const e=document.createElement("input");e.type="file",e.accept=".ccsub,application/json",e.multiple=!0,e.addEventListener("change",async()=>{var t;(t=e.files)!=null&&t.length&&await Rl(e.files)}),e.click()}function ko(e){var v;const t=document.getElementById("btn-export-csv"),s=document.getElementById("btn-open-assessment-lab"),a=document.getElementById("btn-open-lab-monitor"),n=document.getElementById("btn-open-lesson-editor"),r=document.getElementById("btn-open-question-editor"),o=document.getElementById("btn-refresh-dashboard"),i=document.getElementById("class-filter-select"),c=document.getElementById("btn-manage-classes"),l=document.getElementById("btn-import-roster"),d=document.getElementById("btn-print-slips"),u=document.getElementById("roster-search-input"),p=document.getElementById("btn-manage-users"),m=document.getElementById("btn-view-audit-log"),h=document.getElementById("btn-collect-submissions");document.querySelectorAll("[data-workspace-route]").forEach(b=>b.addEventListener("click",()=>e(b.dataset.workspaceRoute))),t&&t.addEventListener("click",async()=>{const b=await ec();Vr(b),D("Data exported successfully","success")}),s&&s.addEventListener("click",()=>{e("/assessment-lab")}),a&&a.addEventListener("click",()=>e("/lab-monitor")),h&&h.addEventListener("click",()=>Pl()),n&&n.addEventListener("click",()=>e("/lesson-editor")),r&&r.addEventListener("click",()=>e("/question-editor"));const g=document.getElementById("btn-open-gradebook");g&&g.addEventListener("click",()=>{e("/gradebook")}),o&&o.addEventListener("click",()=>{be("manual")}),(v=document.getElementById("overview-period"))==null||v.addEventListener("change",b=>{const I=document.getElementById("dashboard-live-status-text");I&&(I.innerHTML=`<strong>View:</strong> ${b.currentTarget.value==="today"?"Today’s available local activity.":"This term’s available local activity."}`)}),i&&i.addEventListener("change",b=>{X=b.target.value,Ss((T==null?void 0:T.classes)||[],X),be("manual")}),c&&c.addEventListener("click",()=>{Hl()}),l&&l.addEventListener("click",()=>{Gl()}),d&&d.addEventListener("click",()=>{Wl()}),p&&p.addEventListener("click",()=>void Ul()),m&&m.addEventListener("click",()=>void Ql()),u&&u.addEventListener("input",b=>{us=b.target.value;const I=document.getElementById("roster-table-container");I&&T&&(I.innerHTML=Fn(T),Vs())}),document.querySelectorAll("[data-learner-filter]").forEach(b=>b.addEventListener("change",I=>{$e[I.currentTarget.dataset.learnerFilter]=I.currentTarget.value;const f=document.getElementById("roster-table-container");f&&T&&(f.innerHTML=Fn(T),Vs())})),document.querySelectorAll("[data-class-directory-id]").forEach(b=>b.addEventListener("click",I=>{X=I.currentTarget.dataset.classDirectoryId,be("manual")})),document.querySelectorAll("[data-learner-profile]").forEach(b=>b.addEventListener("click",()=>void Un(Number(b.dataset.learnerProfile)))),Vs()}function Vs(){var e;document.querySelectorAll(".student-row").forEach(t=>{t.addEventListener("click",s=>{const a=Number.parseInt(s.currentTarget.dataset.id,10);Un(a)})}),document.querySelectorAll(".btn-quick-reset-pin").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const a=Number.parseInt(s.currentTarget.dataset.id,10);$o(a)})}),document.querySelectorAll(".btn-quick-profile").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation(),Un(Number.parseInt(s.currentTarget.dataset.id,10))})}),document.querySelectorAll(".btn-quick-report-card").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation();const a=Number.parseInt(s.currentTarget.dataset.id,10);wt&&wt(`/report-card/${a}`)})}),document.querySelectorAll(".btn-quick-edit-student").forEach(t=>{t.addEventListener("click",s=>{s.stopPropagation(),Ao(Number.parseInt(s.currentTarget.dataset.id,10))})}),(e=document.getElementById("select-all-learners"))==null||e.addEventListener("change",t=>document.querySelectorAll(".learner-select").forEach(s=>{s.checked=t.currentTarget.checked}))}async function be(e="live-update"){if(!Lt()){Ot();return}if(mt)return os=!0,mt;const t=document.getElementById("btn-refresh-dashboard"),s=(t==null?void 0:t.textContent)||"Refresh Now",a=document.getElementById("dashboard-live-status-text");return t&&(t.disabled=!0,t.textContent="Refreshing..."),a&&(a.innerHTML="<strong>Sync mode:</strong> Refreshing live analytics from the local database..."),mt=(async()=>{await Ia();const n=document.getElementById("dashboard-live-root");if(!n)return;n.innerHTML=Sa(T),ko(wt),await Co();const r=document.getElementById("dashboard-live-updated");r&&(r.textContent=ms(ya));const o=document.getElementById("dashboard-live-status-text");if(o){const i=e==="manual"?"Manual refresh complete.":"Live sync updated after a local database change.";o.innerHTML=`<strong>Sync mode:</strong> ${i}`}})().catch(n=>{console.error(n),D("Dashboard refresh failed. Please try again.","error")}).finally(()=>{t&&(t.disabled=!1,t.textContent=s),mt=null,os&&(os=!1,be("queued"))}),mt}function zl(){as=Ai(()=>{if(!Lt()){Ot();return}be("database-event")}),Mt=()=>{document.visibilityState==="visible"&&Lt()&&be("visibility")},qt=()=>{Lt()&&be("focus")},document.addEventListener("visibilitychange",Mt),window.addEventListener("focus",qt),rs=window.setInterval(()=>{if(!Lt()){Ot();return}document.visibilityState==="visible"&&be("heartbeat")},xl)}function Ot(){as&&(as(),as=null),rs&&(window.clearInterval(rs),rs=null),Mt&&(document.removeEventListener("visibilitychange",Mt),Mt=null),qt&&(window.removeEventListener("focus",qt),qt=null),So(),et&&(et.destroy(),et=null),mt=null,os=!1}async function jl(){return wa="overview",await Ia(),Je({title:"Overview",subtitle:"A focused view of learning, priorities, and the next staff action.",activePath:"/dashboard",content:`<div id="dashboard-live-root">${Sa(T)}</div>`})}async function Ol(){return wa="learners",await Ia(),Je({title:"Classes & Learners",subtitle:"Roster, access, and learner support for your assigned classes.",activePath:"/students",content:`<div id="dashboard-live-root">${Sa(T)}</div>`})}function _o(e){Ot(),wt=e,rt(e,{onLogout:()=>{Is(),e("/")}}),ko(e),Co(),zl()}function Fl(e){_o(e)}async function Ul(){var a;const[e,t]=await Promise.all([vt(),de()]),s=`
    <div class="dashboard-panel" style="margin-bottom:var(--space-5);">
      <h4 class="chart-card__title">Current staff accounts</h4>
      ${e.map(n=>{var r;return`<div style="padding:var(--space-2) 0; border-bottom:1px solid var(--color-slate-700);"><strong>${N(n.name||n.username)}</strong> <span class="badge badge--primary">${N(Ge[n.role]||n.role)}</span><br><small>@${N(n.username)}${n.role===ae.TEACHER?` · ${(r=n.classIds)!=null&&r.length?`${n.classIds.length} assigned class(es)`:"No classes assigned"}`:""}</small></div>`}).join("")}
    </div>
    <form id="staff-account-form" style="display:grid;gap:var(--space-3);">
      <h4 class="chart-card__title">Add staff account</h4>
      <input class="input" id="staff-account-name" required placeholder="Full name">
      <input class="input" id="staff-account-username" required pattern="[A-Za-z0-9._-]{3,40}" placeholder="Username">
      <input class="input input--pin" id="staff-account-pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" placeholder="4–8 digit PIN">
      <select class="input" id="staff-account-role">${Object.entries(Ge).map(([n,r])=>`<option value="${n}">${N(r)}</option>`).join("")}</select>
      <label style="font-size:var(--font-size-sm);">Assigned classes (Subject Teachers only)<select class="input" id="staff-account-classes" multiple size="${Math.min(Math.max(t.length,2),5)}">${t.map(n=>`<option value="${n.id}">${N(n.name)}</option>`).join("")}</select></label>
      <button class="btn btn--primary" type="submit">Create staff account</button>
    </form>`;he("Staff accounts & role access",s,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),(a=document.getElementById("staff-account-form"))==null||a.addEventListener("submit",async n=>{var r;n.preventDefault();try{const o=[...document.getElementById("staff-account-classes").selectedOptions].map(i=>Number(i.value));await $s({name:document.getElementById("staff-account-name").value.trim(),username:document.getElementById("staff-account-username").value.trim(),pin:document.getElementById("staff-account-pin").value.trim(),role:document.getElementById("staff-account-role").value,classIds:o}),D("Staff account created.","success"),(r=document.querySelector(".modal-backdrop"))==null||r.remove(),be("manual")}catch(o){D(o.message||"Could not create staff account.","error")}})}async function Ql(){const e=await As(),t=e.length?`<div style="max-height:60vh;overflow:auto;">${e.map(s=>`<div style="padding:var(--space-3) 0;border-bottom:1px solid var(--color-slate-700);"><strong>${N(s.action)}</strong><br><small>${new Date(s.createdAt).toLocaleString()} · ${N(s.actor||"system")}</small><br><small>${N(JSON.stringify(s.detail||{}))}</small></div>`).join("")}</div>`:'<p class="insight-empty">No audited actions yet.</p>';he("System audit log",t,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"})}async function $o(e){const s=((T==null?void 0:T.students)||await we()).find(r=>r.id===e);if(!s)return;const a=String(Math.floor(1e3+Math.random()*9e3)),n=`
    <p style="margin-bottom: var(--space-4);">
      Reset the secret 4-digit PIN for <strong>${N(s.name)}</strong> (Index: <code>${N(s.indexNumber||"")}</code>).
    </p>
    <div class="input-group">
      <label for="reset-pin-input">New 4-Digit PIN</label>
      <input type="password" id="reset-pin-input" class="input input--pin" value="${a}" maxlength="4" pattern="[0-9]{4}" inputmode="numeric" required>
      <p style="font-size: var(--font-size-xs); color: var(--text-muted); margin-top: var(--space-1);">A random 4-digit PIN has been suggested, or you can enter a custom one.</p>
    </div>
  `;he(`Reset PIN: ${s.name}`,n,[{label:"Cancel",variant:"btn--ghost"},{label:"Save PIN",variant:"btn--primary",onClick:async()=>{var o;const r=(o=document.getElementById("reset-pin-input"))==null?void 0:o.value.trim();return!r||!/^\d{4}$/.test(r)?(D("PIN must be exactly 4 digits.","error"),!1):(await Di(e,r),D(`PIN for ${s.name} updated to ${r}`,"success"),be("manual"),!0)}}])}async function Ao(e){const t=(T==null?void 0:T.students)||await we(),s=(T==null?void 0:T.classes)||await de(),a=t.find(r=>r.id===e);if(!a)return;const n=`
    <form id="form-edit-student" style="display: flex; flex-direction: column; gap: var(--space-3);">
      <div class="input-group">
        <label for="edit-student-name">Full Name</label>
        <input type="text" id="edit-student-name" class="input" value="${N(a.name)}" required>
      </div>
      <div class="input-group">
        <label for="edit-student-index">Index / Admission Number</label>
        <input type="text" id="edit-student-index" class="input" value="${N(a.indexNumber||"")}" placeholder="e.g., GES-B7-0101">
      </div>
      <div class="input-group">
        <label for="edit-student-class">Assigned Class</label>
        <select id="edit-student-class" class="input">
          ${s.map(r=>`
            <option value="${r.id}" ${r.id===a.classId?"selected":""}>${N(r.name)}</option>
          `).join("")}
        </select>
      </div>
      <div class="input-group">
        <label for="edit-student-gender">Gender</label>
        <select id="edit-student-gender" class="input">
          <option value="Male" ${a.gender==="Male"?"selected":""}>Male</option>
          <option value="Female" ${a.gender==="Female"?"selected":""}>Female</option>
          <option value="Unspecified" ${a.gender==="Unspecified"||!a.gender?"selected":""}>Unspecified</option>
        </select>
      </div>
      <div class="input-group">
        <label for="edit-student-status">Enrollment Status</label>
        <select id="edit-student-status" class="input">
          <option value="active" ${a.status==="active"||!a.status?"selected":""}>Active</option>
          <option value="transferred" ${a.status==="transferred"?"selected":""}>Transferred</option>
          <option value="graduated" ${a.status==="graduated"?"selected":""}>Graduated</option>
        </select>
      </div>
    </form>
  `;he(`Edit Student: ${a.name}`,n,[{label:"Cancel",variant:"btn--ghost"},{label:"Save Changes",variant:"btn--primary",onClick:async()=>{var d,u,p,m,h;const r=(d=document.getElementById("edit-student-name"))==null?void 0:d.value.trim(),o=(u=document.getElementById("edit-student-index"))==null?void 0:u.value.trim(),i=Number.parseInt((p=document.getElementById("edit-student-class"))==null?void 0:p.value,10),c=(m=document.getElementById("edit-student-gender"))==null?void 0:m.value,l=(h=document.getElementById("edit-student-status"))==null?void 0:h.value;return r?(await Ur(e,{name:r,indexNumber:o||null,classId:i||a.classId,gender:c,status:l}),D("Student information updated.","success"),be("manual"),!0):(D("Student name is required.","error"),!1)}}])}async function Hl(){const e=await de(),t=await we(),a=`
    <div style="margin-bottom: var(--space-4);">
      <h4 style="font-size: var(--font-size-sm); margin-bottom: var(--space-2); color: var(--text-secondary);">Active Classes</h4>
      <div class="class-manage-list">
        ${e.map(r=>{const o=t.filter(i=>i.classId===r.id).length;return`
      <div class="class-manage-item">
        <div class="class-manage-item__info">
          <div class="class-manage-item__title">${N(r.name)}</div>
          <div class="class-manage-item__meta">${r.gradeLevel||"B7"} · ${r.academicYear||"2026/2027"} · ${r.term||"Term 1"} · Teacher: ${N(r.teacherName||"Not set")}</div>
        </div>
        <div>
          <span class="badge badge--primary">${o} learners</span>
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
  `;he("Manage School Classes",a,[{label:"Close",variant:"btn--ghost"}]);const n=document.getElementById("form-create-class");n&&n.addEventListener("submit",async r=>{var p,m,h,g,v;r.preventDefault();const o=((p=document.getElementById("new-class-grade"))==null?void 0:p.value)||"B7",i=((m=document.getElementById("new-class-stream"))==null?void 0:m.value.trim())||"A",c=((h=document.getElementById("new-class-year"))==null?void 0:h.value.trim())||"2026/2027",l=((g=document.getElementById("new-class-term"))==null?void 0:g.value)||"Term 1",d=((v=document.getElementById("new-class-teacher"))==null?void 0:v.value.trim())||"Class Teacher",u=await Fr({name:`${o} — JHS ${i}`,gradeLevel:o,stream:i,academicYear:c,term:l,teacherName:d});D(`Class "${u.name}" created successfully!`,"success"),be("manual")})}async function Gl(){var l;const e=await de(),t=await we(),a=`
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
        <p class="dashboard-header__subtitle" style="margin: 0;">Upload a CSV file to bulk import multiple students in seconds.</p>
        <button type="button" class="btn btn--ghost btn--xs" id="btn-download-sample-csv">Download Sample CSV</button>
      </div>

      <div class="input-group" style="margin-bottom: var(--space-4);">
        <label for="import-default-class">Assign to Class (if unspecified in CSV)</label>
        <select id="import-default-class" class="input">
          ${e.map(d=>`
    <option value="${d.id}">${N(d.name)}</option>
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
  `;let n=null;he("Bulk Import Student Roster",a,[{label:"Cancel",variant:"btn--ghost"},{label:"Commit & Import Roster",variant:"btn--primary",onClick:async()=>{if(!n||!n.validRecords.length)return D("Please choose a valid CSV file first.","error"),!1;const d=await Mi(n.validRecords);return D(`Import complete! Created ${d.created.length} new student(s) and updated ${d.updated.length}.`,"success"),be("manual"),!0}}],{modalClass:"modal--wide"}),(l=document.getElementById("btn-download-sample-csv"))==null||l.addEventListener("click",()=>{Sl(),D("Sample roster CSV downloaded.","info")});const r=document.getElementById("import-dropzone"),o=document.getElementById("import-file-input");r&&o&&(r.addEventListener("click",()=>o.click()),r.addEventListener("dragover",d=>{d.preventDefault(),r.classList.add("import-dropzone--active")}),r.addEventListener("dragleave",()=>r.classList.remove("import-dropzone--active")),r.addEventListener("drop",d=>{var p;d.preventDefault(),r.classList.remove("import-dropzone--active");const u=(p=d.dataTransfer.files)==null?void 0:p[0];u&&i(u)}),o.addEventListener("change",d=>{var p;const u=(p=d.target.files)==null?void 0:p[0];u&&i(u)}));function i(d){const u=new FileReader;u.onload=p=>{var g,v;const m=(g=p.target)==null?void 0:g.result;if(typeof m!="string")return;const h=Number.parseInt((v=document.getElementById("import-default-class"))==null?void 0:v.value,10)||null;n=Cl(m,e,t,h),c(n)},u.readAsText(d)}function c(d){const u=document.getElementById("import-preview-area"),p=document.getElementById("import-summary-bar"),m=document.getElementById("import-preview-body");if(!d.success){D(d.error||"Unable to parse CSV file.","error");return}u.style.display="block",p.innerHTML=`
      <div><strong>Total rows:</strong> ${d.summary.totalRows}</div>
      <div style="color: var(--color-success-400);"><strong>New learners:</strong> ${d.summary.newCount}</div>
      <div style="color: var(--color-accent-400);"><strong>Updates:</strong> ${d.summary.updateCount}</div>
      <div style="color: var(--color-warning-400);"><strong>Auto-PINs:</strong> ${d.summary.autoPinsGenerated}</div>
      ${d.summary.errorCount?`<div style="color: var(--color-danger-400);"><strong>Errors skipped:</strong> ${d.summary.errorCount}</div>`:""}
    `,m.innerHTML=d.validRecords.map(h=>`
      <tr>
        <td>${h.rowNumber}</td>
        <td><code>${N(h.indexNumber||"Auto")}</code></td>
        <td style="font-weight: var(--font-weight-semibold);">${N(h.name)}</td>
        <td>${N(h.className)}</td>
        <td>${h.gender}</td>
        <td><span style="font-family: monospace; font-weight: bold;">${h.pin}</span> ${h.pinGenerated?'<small style="color: var(--color-warning-400);">(auto)</small>':""}</td>
        <td><span class="badge badge--${h.isUpdate?"warning":"success"}">${h.isUpdate?"Update":"Create"}</span></td>
      </tr>
    `).join("")}}async function Wl(){var c;const e=await de(),t=await we(),s=X!=="all"?Number.parseInt(X,10):(c=e[0])==null?void 0:c.id,a=`
    <div class="no-print" style="margin-bottom: var(--space-4);">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <label for="print-class-select" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);">Filter Class:</label>
          <select id="print-class-select" class="input input--sm">
            <option value="all">All Classes (${t.length} students)</option>
            ${e.map(l=>`
              <option value="${l.id}" ${l.id===s?"selected":""}>
                ${N(l.name)} (${t.filter(d=>d.classId===l.id).length} students)
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
  `;he("Print Student Login Slips",a,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"});const n=document.getElementById("slips-container"),r=document.getElementById("print-class-select"),o=document.getElementById("btn-trigger-print");function i(l){const d=l==="all"?t:t.filter(u=>String(u.classId)===String(l));if(!d.length){n.innerHTML='<div class="insight-empty no-print">No students found in this class.</div>';return}n.innerHTML=d.map(u=>{const p=e.find(h=>h.id===u.classId),m=p?p.name:"JHS Computing";return`
        <div class="slip-card">
          <div class="slip-card__header">
            <div class="slip-card__school">ClassConnect — Lab Pass</div>
            <div class="slip-card__app">GES CCP B7</div>
          </div>
          <div class="slip-card__name">${N(u.name)}</div>
          <div class="slip-card__meta">
            <span><strong>Index:</strong> ${N(u.indexNumber||`GES-B7-${u.id}`)}</span>
            <span><strong>Class:</strong> ${N(m)}</span>
          </div>
          <div class="slip-card__pin-box">
            <span class="slip-card__pin-label">Your 4-Digit Login PIN:</span>
            <span class="slip-card__pin-value">${u.pin}</span>
          </div>
          <div class="slip-card__footer">
            Keep this PIN secret. Login at http://localhost:5173/student-login
          </div>
        </div>
      `}).join("")}i(s),r==null||r.addEventListener("change",l=>{i(l.target.value)}),o==null||o.addEventListener("click",()=>{window.print()})}async function Un(e){var g,v,b,I,f;const t=(T==null?void 0:T.students)||await we(),s=(T==null?void 0:T.classes)||await de(),a=(T==null?void 0:T.results)||await ze(),n=(T==null?void 0:T.progressRecords)||await bs(),r=(T==null?void 0:T.diagnostics)||await ys(),o=t.find(y=>y.id===e);if(!o)return;const i=s.find(y=>y.id===o.classId),c=a.filter(y=>y.studentId===e).sort((y,$)=>new Date(y.completedAt)-new Date($.completedAt)),l=r.filter(y=>y.studentId===e).sort((y,$)=>new Date($.completedAt)-new Date(y.completedAt))[0]||null,d=Ee({diagnostic:l,results:c,progressRecords:n.filter(y=>y.studentId===e)}),u=c.at(-1),p=c.length>0?Math.round(c.reduce((y,$)=>y+$.score/$.totalQuestions,0)/c.length*100):0;n.filter(y=>y.studentId===e).length,c.flatMap(y=>y.responses.map($=>({...$,lessonId:y.lessonId,completedAt:y.completedAt}))).sort((y,$)=>new Date($.answeredAt||$.completedAt)-new Date(y.answeredAt||y.completedAt));const h=`
    <div class="student-detail">
      <div class="student-detail__header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-3);">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div class="student-detail__avatar">${o.name.slice(0,2).toUpperCase()}</div>
          <div>
            <div class="student-detail__name">${N(o.name)}</div>
            <div class="dashboard-header__subtitle">
              Index: <code>${N(o.indexNumber||`GES-B7-${o.id}`)}</code> · Class: <strong>${N(i?i.name:"General")}</strong> · Gender: ${N(o.gender||"Unspecified")}
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
          <div class="student-detail__stat-value">${c.length}</div>
          <div class="student-detail__stat-label">Quizzes Taken</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${p}%</div>
          <div class="student-detail__stat-label">Average Score</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${u?u.level:"-"}</div>
          <div class="student-detail__stat-label">Current Level</div>
        </div>
        <div class="student-detail__stat">
          <div class="student-detail__stat-value">${u?jn(u.averageTimeMs):"00:00"}</div>
          <div class="student-detail__stat-label">Avg Question Time</div>
        </div>
      </div>

      <div class="student-detail__panel" style="margin-bottom: var(--space-4);">
        <h4 class="student-detail__history-title">Personalization Snapshot</h4>
        <div class="student-detail__snapshot">
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${d.readiness.tone}">${d.readiness.label}</span>
            <div class="student-detail__snapshot-text">${l?`Diagnostic completed on ${new Date(l.completedAt).toLocaleDateString()}`:"Diagnostic not completed yet."}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--${d.risk.badge}">Risk ${d.risk.score}</span>
            <div class="student-detail__snapshot-text">${d.risk.action}</div>
          </div>
          <div class="student-detail__snapshot-item">
            <span class="badge badge--primary">Next Focus</span>
            <div class="student-detail__snapshot-text">${((g=d.recommendedNext)==null?void 0:g.title)||"Lesson 1"} - ${((v=d.recommendedNext)==null?void 0:v.recommendedFocus)||"Continue the learning path."}</div>
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
            ${c.length>0?c.slice().reverse().map(y=>`
              <div class="student-detail__quiz-entry">
                <div>
                  <div style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm);">Lesson ${y.lessonId}: ${On(y.lessonId)}</div>
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
              ${u&&u.responses?u.responses.map((y,$)=>`
                <tr>
                  <td>${$+1}</td>
                  <td>${N(y.concept||"General")}</td>
                  <td><span class="badge badge--${y.correct?"success":"danger"}">${y.correct?"Correct":"Review"}</span></td>
                  <td>${jn(y.elapsedMs)}</td>
                  <td>${y.thetaAfter}</td>
                </tr>
              `).join(""):'<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: var(--space-4);">No per-question data yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;he("Student Profile",h,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),(b=document.getElementById("btn-modal-report-card"))==null||b.addEventListener("click",()=>{var y;(y=document.querySelector(".modal-backdrop"))==null||y.remove(),wt&&wt(`/report-card/${e}`)}),(I=document.getElementById("btn-modal-reset-pin"))==null||I.addEventListener("click",()=>{$o(e)}),(f=document.getElementById("btn-modal-edit-student"))==null||f.addEventListener("click",()=>{Ao(e)}),c.length>0&&setTimeout(()=>{Vl(c)},0)}async function Co(){if(!T)return;So();const e=await Io();e.defaults.color="#94A3B8",e.defaults.borderColor="rgba(148, 163, 184, 0.1)";const t=document.getElementById("chart-scores");t&&Dt.push(new e(t,{type:"bar",data:{labels:T.charts.lessonLabels,datasets:[{label:"Average Score (%)",data:T.charts.lessonScoreData,backgroundColor:"rgba(99, 102, 241, 0.8)",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0,max:100}}}}));const s=document.getElementById("chart-levels");s&&Dt.push(new e(s,{type:"doughnut",data:{labels:Object.keys(T.charts.levelCounts),datasets:[{data:Object.values(T.charts.levelCounts),backgroundColor:["#34D399","#818CF8","#FBBF24","#FB7185"],borderWidth:0,cutout:"70%"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right"}}}}));const a=document.getElementById("chart-misconceptions");if(a){const n=T.charts.misconceptions.map(o=>o.stem),r=T.charts.misconceptions.map(o=>o.count);Dt.push(new e(a,{type:"bar",data:{labels:n,datasets:[{label:"Times missed",data:r,backgroundColor:"rgba(244, 63, 94, 0.75)",borderRadius:6}]},options:{indexAxis:"y",responsive:!0,maintainAspectRatio:!1,plugins:{tooltip:{callbacks:{label(o){const i=T.charts.misconceptions[o.dataIndex];return`${o.raw} misses - common wrong answer: ${i.answer}`}}}},scales:{x:{beginAtZero:!0,ticks:{precision:0}},y:{ticks:{callback(o,i){return`Q${i+1}`}}}}}}))}}async function Vl(e){const t=document.getElementById("student-theta-chart");if(!t)return;const s=await Io();et&&(et.destroy(),et=null);const a=e.map(r=>`L${r.lessonId}`),n=e.map(r=>r.theta);et=new s(t,{type:"line",data:{labels:a,datasets:[{label:"Theta",data:n,borderColor:"#818CF8",backgroundColor:"rgba(129, 140, 248, 0.15)",fill:!0,tension:.35,pointRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{min:-3,max:3}},plugins:{legend:{display:!1}}}})}const J=(e="")=>String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");async function Kl(){const[e,t,s]=await Promise.all([vt(),de(),As()]),a=e.map(r=>`<div class="admin-list__item staff-page-row" data-staff-search="${J(`${r.name||""} ${r.username} ${Ge[r.role]||""}`.toLowerCase())}"><div><strong>${J(r.name||r.username)}</strong><span>${J(Ge[r.role]||r.role)} · @${J(r.username)}</span></div><button class="btn btn--ghost btn--xs" data-open-staff-modal>Manage</button></div>`).join(""),n=`<div class="workspace-card-grid"><button class="workspace-action-card" id="admin-staff"><strong>Staff accounts</strong><span>${e.length} staff account${e.length===1?"":"s"} · roles and class assignments</span></button><button class="workspace-action-card" id="admin-classes"><strong>School classes</strong><span>${t.length} class${t.length===1?"":"es"} · academic structure</span></button><button class="workspace-action-card" id="admin-backup"><strong>Backups</strong><span>Download a full school data backup</span></button><button class="workspace-action-card" id="admin-audit"><strong>Audit log</strong><span>${s.length} accountable system events</span></button></div><section class="card dashboard-panel"><h2 class="chart-card__title">Staff management</h2><p class="chart-card__subtitle">Search staff accounts, then manage access, roles, PINs, and class assignments.</p><input id="staff-page-search" class="input input--sm" placeholder="Search staff by name, username, or role"><div class="admin-list" id="staff-page-list">${a}</div><div class="export-area"><button class="btn btn--secondary" id="admin-staff-secondary">Add or manage staff</button><button class="btn btn--secondary" id="admin-classes-secondary">Manage classes</button><button class="btn btn--ghost" id="admin-audit-secondary">View audit log</button><button class="btn btn--ghost" id="admin-restore">Restore backup</button><input type="file" id="admin-restore-file" accept="application/json,.json" hidden></div></section>`;return Je({title:"Administration",subtitle:"Staff access, school setup, records accountability, and data protection.",activePath:"/admin",content:n})}function Yl(e){var t,s,a,n;rt(e,{onLogout:()=>{Is(),e("/")}}),["admin-staff","admin-staff-secondary"].forEach(r=>{var o;return(o=document.getElementById(r))==null?void 0:o.addEventListener("click",()=>void Oa(e))}),document.querySelectorAll("[data-open-staff-modal]").forEach(r=>r.addEventListener("click",()=>void Oa(e))),(t=document.getElementById("staff-page-search"))==null||t.addEventListener("input",r=>{const o=r.currentTarget.value.trim().toLowerCase();document.querySelectorAll(".staff-page-row").forEach(i=>{i.hidden=!!o&&!i.dataset.staffSearch.includes(o)})}),["admin-classes","admin-classes-secondary"].forEach(r=>{var o;return(o=document.getElementById(r))==null?void 0:o.addEventListener("click",()=>void Zl(e))}),["admin-audit","admin-audit-secondary"].forEach(r=>{var o;return(o=document.getElementById(r))==null?void 0:o.addEventListener("click",()=>void Xl())}),(s=document.getElementById("admin-backup"))==null||s.addEventListener("click",async()=>{await nc(),D("Full school backup downloaded.","success")}),(a=document.getElementById("admin-restore"))==null||a.addEventListener("click",()=>{var r;return(r=document.getElementById("admin-restore-file"))==null?void 0:r.click()}),(n=document.getElementById("admin-restore-file"))==null||n.addEventListener("change",r=>{var c;const o=(c=r.target.files)==null?void 0:c[0];if(!o)return;const i=new FileReader;i.onload=async()=>{try{if(!confirm("Restore this backup? Existing records will be merged."))return;await ac(JSON.parse(i.result),"merge"),D("School backup restored.","success"),e("/admin",!1)}catch(l){D(l.message||"Could not restore this backup.","error")}},i.readAsText(o)})}async function Oa(e){var n;const[t,s]=await Promise.all([vt(),de()]),a=`<div class="admin-list">${t.map(r=>`<div class="admin-list__item"><div><strong>${J(r.name||r.username)}</strong><span>${J(Ge[r.role]||r.role)} · @${J(r.username)}</span></div><div><button class="btn btn--ghost btn--xs" data-edit-user="${r.id}">Edit</button>${r.role!==ae.ADMIN?`<button class="btn btn--ghost btn--xs" data-remove-user="${r.id}">Deactivate</button>`:""}</div></div>`).join("")}</div><form id="admin-create-staff" class="admin-form"><h3>Add staff account</h3><input class="input" id="new-staff-name" required placeholder="Full name"><input class="input" id="new-staff-username" required pattern="[A-Za-z0-9._-]{3,40}" placeholder="Username"><input class="input input--pin" id="new-staff-pin" required pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" placeholder="4–8 digit PIN"><select class="input" id="new-staff-role">${Object.entries(Ge).map(([r,o])=>`<option value="${r}">${J(o)}</option>`).join("")}</select><label>Assigned classes<select class="input" id="new-staff-classes" multiple>${s.map(r=>`<option value="${r.id}">${J(r.name)}</option>`).join("")}</select></label><button class="btn btn--primary">Create account</button></form>`;he("Staff accounts",a,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),(n=document.getElementById("admin-create-staff"))==null||n.addEventListener("submit",async r=>{var o;r.preventDefault();try{await $s({name:document.getElementById("new-staff-name").value.trim(),username:document.getElementById("new-staff-username").value.trim(),pin:document.getElementById("new-staff-pin").value.trim(),role:document.getElementById("new-staff-role").value,classIds:[...document.getElementById("new-staff-classes").selectedOptions].map(i=>Number(i.value))}),D("Staff account created.","success"),(o=document.querySelector(".modal-backdrop"))==null||o.remove(),e("/admin",!1)}catch(i){D(i.message,"error")}}),document.querySelectorAll("[data-remove-user]").forEach(r=>r.addEventListener("click",async()=>{var o;confirm("Deactivate this staff account?")&&(await Zi(Number(r.dataset.removeUser)),D("Staff account deactivated.","success"),(o=document.querySelector(".modal-backdrop"))==null||o.remove(),e("/admin",!1))})),document.querySelectorAll("[data-edit-user]").forEach(r=>r.addEventListener("click",()=>Jl(t.find(o=>o.id===Number(r.dataset.editUser)),s,e)))}function Jl(e,t,s){var n;if(!e)return;const a=`<form id="admin-edit-staff" class="admin-form" style="margin-top:0;border-top:0"><input class="input" id="edit-staff-name" value="${J(e.name||"")}" required><select class="input" id="edit-staff-role">${Object.entries(Ge).map(([r,o])=>`<option value="${r}" ${e.role===r?"selected":""}>${J(o)}</option>`).join("")}</select><label>Assigned classes<select class="input" id="edit-staff-classes" multiple>${t.map(r=>`<option value="${r.id}" ${(e.classIds||[]).includes(r.id)?"selected":""}>${J(r.name)}</option>`).join("")}</select></label><input class="input input--pin" id="edit-staff-pin" pattern="[0-9]{4,8}" maxlength="8" inputmode="numeric" placeholder="New PIN (leave blank to keep current)"><button class="btn btn--primary">Save changes</button></form>`;he(`Edit ${e.name||e.username}`,a,[{label:"Cancel",variant:"btn--ghost"}]),(n=document.getElementById("admin-edit-staff"))==null||n.addEventListener("submit",async r=>{var c;r.preventDefault();const o=document.getElementById("edit-staff-role").value;if(o!==e.role&&!confirm(`Change ${e.name||e.username}'s role? This changes what they can access.`))return;const i=document.getElementById("edit-staff-pin").value.trim();await Ji(e.id,{name:document.getElementById("edit-staff-name").value.trim(),role:o,classIds:[...document.getElementById("edit-staff-classes").selectedOptions].map(l=>Number(l.value)),...i?{pin:i}:{}}),D("Staff account updated.","success"),(c=document.querySelector(".modal-backdrop"))==null||c.remove(),s("/admin",!1)})}async function Zl(e){var a;const s=`<div class="admin-list">${(await de()).map(n=>`<div class="admin-list__item"><div><strong>${J(n.name)}</strong><span>${J(n.academicYear||"")} · ${J(n.term||"")} · ${J(n.teacherName||"No class teacher")}</span></div></div>`).join("")}</div><form id="admin-create-class" class="admin-form"><h3>Create class</h3><input class="input" id="new-class-name" required placeholder="e.g., B7 — JHS 1A"><input class="input" id="new-class-year" value="2026/2027" placeholder="Academic year"><select class="input" id="new-class-term"><option>Term 1</option><option>Term 2</option><option>Term 3</option></select><input class="input" id="new-class-teacher" placeholder="Class teacher"><button class="btn btn--primary">Create class</button></form>`;he("School classes",s,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"}),(a=document.getElementById("admin-create-class"))==null||a.addEventListener("submit",async n=>{var r;n.preventDefault(),await Fr({name:document.getElementById("new-class-name").value.trim(),academicYear:document.getElementById("new-class-year").value.trim(),term:document.getElementById("new-class-term").value,teacherName:document.getElementById("new-class-teacher").value.trim()}),D("Class created.","success"),(r=document.querySelector(".modal-backdrop"))==null||r.remove(),e("/admin",!1)})}async function Xl(){const e=await As(),t=n=>n.map(r=>`<div class="admin-list__item"><div><strong>${J(r.action)}</strong><span>${new Date(r.createdAt).toLocaleString()} · Actor: ${J(r.actor||"system")} · Record: ${J(Object.values(r.detail||{}).join(" · ")||"System")}</span></div></div>`).join("")||'<p class="insight-empty">No audit events match these filters.</p>',s=`<div class="audit-filters"><input class="input input--sm" id="audit-search" placeholder="Search actor, action, or record"><input class="input input--sm" id="audit-date" type="date"><select class="input input--sm" id="audit-action"><option value="">All actions</option>${[...new Set(e.map(n=>n.action))].map(n=>`<option>${J(n)}</option>`).join("")}</select></div><div class="admin-list" id="audit-list">${t(e)}</div>`;he("System audit log",s,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"});const a=()=>{const n=document.getElementById("audit-search").value.trim().toLowerCase(),r=document.getElementById("audit-date").value,o=document.getElementById("audit-action").value;document.getElementById("audit-list").innerHTML=t(e.filter(i=>(!n||`${i.actor} ${i.action} ${JSON.stringify(i.detail)}`.toLowerCase().includes(n))&&(!r||i.createdAt.startsWith(r))&&(!o||i.action===o)))};["audit-search","audit-date","audit-action"].forEach(n=>{var r;return(r=document.getElementById(n))==null?void 0:r.addEventListener(n==="audit-search"?"input":"change",a)})}function ed(){return new Map(q.map(e=>{const t=ls.filter(s=>s.lessonId===e.id).sort((s,a)=>{const n=Math.abs(s.difficulty)-Math.abs(a.difficulty);return n!==0?n:a.discrimination-s.discrimination});return[e.id,t]}))}function td(e,t){return e>=.75&&t===0?"Ready to Accelerate":e>=.5?"Foundations Growing":"Needs Guided Support"}function Fa(e){return q.map(t=>{const s=e.get(t.id)||[],a=s.filter(o=>o.correct).length,n=s.length,r=n>0?a/n:0;return{lessonId:t.id,lessonTitle:t.title,correct:a,attempted:n,accuracy:r}})}function sd(){const e=ed(),t=q.map(g=>{var v;return(v=e.get(g.id))==null?void 0:v[0]}).filter(Boolean),s=new Map(q.map(g=>[g.id,(e.get(g.id)||[]).slice(1)])),a=new Set,n=[];let r=0,o=null,i=[],c=!1,l=!1;function d(){const g=new Map;for(const b of n){const I=g.get(b.lessonId)||[];I.push(b),g.set(b.lessonId,I)}i=Fa(g).sort((b,I)=>b.accuracy!==I.accuracy?b.accuracy-I.accuracy:b.lessonId-I.lessonId).slice(0,3).map(b=>(s.get(b.lessonId)||[]).find(f=>!a.has(f.id))||null).filter(Boolean),c=!0}function u(){if(l)return null;let g=null;if(t.length>0?g=t.shift():(c||d(),g=i.shift()||null),!g)return l=!0,null;a.add(g.id),o=g,r+=1;const v=q.find(b=>b.id===g.lessonId);return{question:g,questionNumber:r,totalQuestions:8,lessonId:g.lessonId,lessonTitle:(v==null?void 0:v.title)||`Lesson ${g.lessonId}`,phase:r<=5?"coverage":"follow-up"}}function p(g){if(!o)return null;const v=g===o.correctIndex,b={questionId:o.id,lessonId:o.lessonId,stem:o.stem,options:o.options,selectedIndex:g,correctIndex:o.correctIndex,correct:v};return n.push(b),o=null,{correct:v,correctIndex:b.correctIndex}}function m(){const g=new Map;for(const w of n){const S=g.get(w.lessonId)||[];S.push(w),g.set(w.lessonId,S)}const v=Fa(g),b=v.filter(w=>w.accuracy<.5),I=v.filter(w=>w.accuracy>=.75),f=n.filter(w=>w.correct).length,y=n.length,$=y>0?f/y:0;return{score:f,totalQuestions:y,readiness:td($,b.length),generationMethod:"adaptive diagnostic",lessonBreakdown:v,knowledgeGaps:b,strengths:I,responses:n}}function h(){return l}return{next:u,answer:p,getResults:m,isFinished:h}}let We=null,ve=null,Ft=!1;function nd(){We=sd(),ve=We.next(),Ft=!1}function ad(){(!We||!ve)&&nd()}function xo(){We=null,ve=null,Ft=!1}function rd(){if(!We||!ve)return'<div class="container">Error loading diagnostic assessment.</div>';const e=K();return`
    ${V({title:"Diagnostic Assessment",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter diagnostic-page" style="padding-top: var(--space-6);">
      <div class="card card--glass diagnostic-hero">
        <div class="diagnostic-hero__eyebrow">AI-guided readiness check</div>
        <h1 class="diagnostic-hero__title">Let us map your starting point</h1>
        <p class="diagnostic-hero__text">This short pre-assessment samples all five lessons, then follows up on the topics that need the most attention.</p>
        <div class="diagnostic-hero__meta">
          <span class="badge badge--neutral">8 questions max</span>
          <span class="badge badge--accent">${ve.phase==="coverage"?"Checking broad coverage":"Following up on weak areas"}</span>
          <span class="badge badge--primary">${ve.lessonTitle}</span>
        </div>
      </div>

      <div class="diagnostic-stage">
        <div class="diagnostic-stage__header">
          <div>
            <div class="diagnostic-stage__label">Question ${ve.questionNumber}</div>
            <h2 class="diagnostic-stage__title">${ve.lessonTitle}</h2>
          </div>
          <span class="badge badge--neutral">${ve.phase==="coverage"?"Coverage pass":"Adaptive follow-up"}</span>
        </div>

        ${bt(ve.questionNumber-1,ve.totalQuestions,"Diagnostic progress")}

        <div id="diagnostic-question-wrap">
          ${no(ve.question)}
        </div>
      </div>
    </div>
  `}function od(e,t){ue({onBack:()=>e("/lessons")}),ua(document.querySelector(".diagnostic-page")),document.querySelectorAll(".option-btn").forEach(s=>{s.addEventListener("click",async a=>{if(Ft)return;Ft=!0;const n=Number.parseInt(a.currentTarget.dataset.index,10);await id(n,a.currentTarget,e,t)})})}async function id(e,t,s,a){const n=We.answer(e);if(document.querySelectorAll(".option-btn").forEach(i=>{i.classList.add("option-btn--disabled"),i.disabled=!0}),n.correct)t.classList.add("option-btn--correct");else{t.classList.add("option-btn--incorrect");const i=document.getElementById(`option-${n.correctIndex}`);i&&i.classList.add("option-btn--highlight-correct")}await new Promise(i=>setTimeout(i,500));const o=We.next();if(!o){await cd(s);return}ve=o,Ft=!1,await a()}async function cd(e){const t=K(),s=We.getResults();if(!t){e("/student-login");return}const a=await Ri({studentId:t.id,...s});xo(),e(`/diagnostic-results/${a.id}`)}function ld(e){const t=e.objectives.slice(0,2).join("; "),s=(e.keyTerms||[]).slice(0,3).map(a=>`${a.word}: ${a.definition}`).join("; ");return`${e.title}. Objectives: ${t}. Key terms: ${s}`}function Eo(e){var r;const t=e.knowledgeGaps.map(o=>o.title).join(", ")||"none identified",s=e.strengths.map(o=>o.title).join(", ")||"still emerging",a=((r=e.recommendedNext)==null?void 0:r.title)||"Lesson 1",n=e.revisionQueue.map(o=>`${o.title} (${o.reason})`).join("; ")||"none";return[`Readiness: ${e.readiness.label}.`,`Completion rate: ${e.completionRate}%.`,`Knowledge gaps: ${t}.`,`Strengths: ${s}.`,`Recommended next lesson: ${a}.`,`Revision queue: ${n}.`].join(" ")}function dd(e){const t=e.toLowerCase();return q.find(s=>t.includes(s.title.toLowerCase())?!0:(s.keyTerms||[]).some(a=>t.includes(a.word.toLowerCase())))||null}function ud(e){var a,n,r;const t=((a=e.strengths[0])==null?void 0:a.title)||"your earliest lessons",s=((n=e.knowledgeGaps[0])==null?void 0:n.title)||((r=e.recommendedNext)==null?void 0:r.title)||"the next lesson";return`You are showing the most confidence in ${t}. Focus next on ${s}, then use the AI Tutor to clear up anything that still feels confusing. Small, steady review sessions will move your readiness up quickly.`}function md(e,t){var o,i;const s=dd(e),a=t.knowledgeGaps[0],n=t.recommendedNext,r=e.toLowerCase();if(r.includes("next")||r.includes("study")||r.includes("path"))return`Your best next step is ${(n==null?void 0:n.title)||"the next lesson in your path"}. It is recommended because ${a?`${a.title} still needs review`:"it keeps your momentum going"}. After that, revisit one item from your revision queue before taking the quiz.`;if(s){const c=(o=s.keyTerms)==null?void 0:o[0],l=(i=s.objectives)==null?void 0:i[0];return`${s.title} is mainly about ${(l==null?void 0:l.toLowerCase())||"this topic area"}. Start with this idea: ${c?`${c.word} means ${c.definition}`:"focus on the core lesson objective first"}. Then compare it with your own words and try one practice question before moving on.`}return r.includes("struggling")||r.includes("stuck")||r.includes("hard")?`It looks like ${(a==null?void 0:a.title)||"one of your current topics"} needs a slower, more guided review. Break it into two parts: reread the lesson objectives first, then ask me one specific question about a term or idea that is still unclear.`:`I remember your current path is strongest when we keep things focused. Start with ${(n==null?void 0:n.title)||"your next recommended lesson"}, and if a concept feels confusing, ask me about one term or one example at a time so we can unpack it together.`}async function Lo(e){return Ls(e,{temperature:.6,maxOutputTokens:300,topP:.9})}async function pd(e,t,s){const a=["You are a warm, concise learning coach for Basic 7 Computing.",`Student: ${e.name}.`,`Diagnostic readiness: ${t.readiness}.`,Eo(s),"Write exactly 3 supportive sentences for the student.","Sentence 1: celebrate one strength.","Sentence 2: explain the most important gap to focus on next.","Sentence 3: give a short action plan using the tutor and the next lesson."].join(`
`),n=await Lo(a);return{text:n||ud(s),source:n?"ai":"fallback"}}async function hd({student:e,message:t,history:s=[],profile:a}){const n=q.map(ld).join(`
`),r=s.slice(-8).map(c=>`${c.role}: ${c.content}`).join(`
`),o=["You are ClassConnect Tutor, a supportive Basic 7 Computing tutor.",`Student: ${e.name}.`,Eo(a),"Use the profile and memory below. Keep answers clear, age-appropriate, and practical.","If the learner asks what to study next, recommend the personalized path.","If the learner asks about a concept, explain it simply and connect it to one lesson.","Respond in 2 short paragraphs maximum.","Lesson references:",n,"Conversation memory:",r||"No prior messages yet.",`Student message: ${t}`].join(`
`),i=await Lo(o);return{text:i||md(t,a),source:i?"ai":"fallback"}}function Ua(e,t,s){return e.length?e.map(a=>`
    <div class="insight-pill insight-pill--${s}">
      <div class="insight-pill__title">${a.lessonTitle||a.title}</div>
      <div class="insight-pill__meta">${a.accuracy!==void 0?`${Math.round(a.accuracy*100)}% diagnostic accuracy`:a.recommendedFocus||"Ready for the next step"}</div>
    </div>
  `).join(""):`<div class="insight-empty">${t}</div>`}async function gd(e){var c;const t=K(),s=await Qr(Number.parseInt(e,10));if(!t||!s||s.studentId!==t.id)return'<div class="container" style="padding: 2rem;">Diagnostic result not found.</div>';const a=await Me(t.id),n=await xe(t.id),r=await at(t.id),o=Ee({diagnostic:a,results:r,progressRecords:n}),i=s.totalQuestions>0?Math.round(s.score/s.totalQuestions*100):0;return`
    ${V({title:"Diagnostic Results",showBack:!0,studentName:t.name})}
    <div class="container container--narrow view-enter diagnostic-results-page">
      <div class="card card--glass diagnostic-summary">
        <div class="diagnostic-summary__eyebrow">Personalized readiness snapshot</div>
        <h1 class="diagnostic-summary__title">${s.readiness}</h1>
        <p class="diagnostic-summary__text">Your pre-assessment is complete. We can now personalize lesson order, revision, and tutor support.</p>

        <div class="diagnostic-metrics">
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${i}%</div>
            <div class="diagnostic-metric__label">Diagnostic score</div>
          </div>
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${s.knowledgeGaps.length}</div>
            <div class="diagnostic-metric__label">Knowledge gaps</div>
          </div>
          <div class="diagnostic-metric">
            <div class="diagnostic-metric__value">${((c=o.recommendedNext)==null?void 0:c.lessonId)||1}</div>
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
            ${Ua(s.knowledgeGaps,"No urgent gaps were detected in the diagnostic.","warning")}
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Current Strengths</h3>
          <div class="insight-pill-list">
            ${Ua(s.strengths,"Your strengths will appear here as you build more evidence.","success")}
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="diagnostic-section__title">Adaptive Content Path</h3>
        <p class="diagnostic-section__subtitle">These lessons are now prioritized using your diagnostic, lesson completion, and quiz evidence.</p>
        <div class="path-preview">
          ${o.recommendedSequence.slice(0,4).map((l,d)=>`
            <button class="path-preview__item" data-lesson-id="${l.lessonId}">
              <div class="path-preview__index">${d+1}</div>
              <div class="path-preview__body">
                <div class="path-preview__title">${l.title}</div>
                <div class="path-preview__meta">${l.masteryPercent}% mastery | ${l.recommendedFocus}</div>
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
  `}function fd(e,t){ue({onBack:()=>e("/lessons")});const s=document.getElementById("btn-open-path"),a=document.getElementById("btn-open-tutor"),n=document.getElementById("btn-retake-diagnostic");Qr(Number.parseInt(t,10)).then(async r=>{const o=K();if(!o||!r)return;const i=await Me(o.id),c=await xe(o.id),l=await at(o.id),d=Ee({diagnostic:i,results:l,progressRecords:c});s&&s.addEventListener("click",()=>{var h;e(`/lesson/${((h=d.recommendedNext)==null?void 0:h.lessonId)||1}`)}),a&&a.addEventListener("click",()=>{e("/tutor")}),n&&n.addEventListener("click",()=>{e("/diagnostic")}),document.querySelectorAll(".path-preview__item").forEach(h=>{h.addEventListener("click",g=>{const v=Number.parseInt(g.currentTarget.dataset.lessonId,10);e(`/lesson/${v}`)})});const u=await pd(o,r,d),p=document.getElementById("diagnostic-insight"),m=document.getElementById("diagnostic-insight-source");p&&(p.textContent=u.text),m&&(m.textContent=u.source==="ai"?"AI generated":"Offline-ready insight",m.className=`badge ${u.source==="ai"?"badge--primary":"badge--neutral"}`)})}const vd=["What should I study next?","Explain RAM and storage in simple words.","Help me review my weakest topic."];let Z={studentId:null,messages:[],sending:!1};function bd(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function yd(e){if(Z.studentId===e)return;const t=await zi(e);Z={studentId:e,messages:(t==null?void 0:t.messages)||[],sending:!1}}function wd(){return Z.messages.length?Z.messages.map(e=>`
    <div class="chat-bubble chat-bubble--${e.role}">
      <div class="chat-bubble__role">${e.role==="assistant"?"AI Tutor":"You"}</div>
      <div class="chat-bubble__text">${bd(e.content)}</div>
      ${e.source?`<div class="chat-bubble__meta">${e.source==="ai"?"AI response":"Offline support response"}</div>`:""}
    </div>
  `).join(""):`
      <div class="tutor-empty">
        <div class="tutor-empty__title">Your tutor is ready</div>
        <p class="tutor-empty__text">Ask for an explanation, revision tip, or what to study next. The tutor will answer using your lesson history and diagnostic profile.</p>
      </div>
    `}async function Id(){var r,o,i,c;const e=K();if(!e)return'<div class="container" style="padding: 2rem;">Student session not found.</div>';await yd(e.id);const t=await Me(e.id),s=await xe(e.id),a=await at(e.id),n=Ee({diagnostic:t,results:a,progressRecords:s});return`
    ${V({title:"AI Tutor",showBack:!0,studentName:e.name})}
    <div class="container container--narrow view-enter tutor-page">
      <div class="card card--glass tutor-hero">
        <div class="tutor-hero__header">
          <div>
            <div class="diagnostic-hero__eyebrow">Context-aware tutor with memory</div>
            <h1 class="tutor-hero__title">Ask for help at your own pace</h1>
          </div>
          ${Z.messages.length?'<button class="btn btn--ghost btn--sm" id="btn-clear-chat">Clear chat</button>':""}
        </div>

        <div class="tutor-hero__chips">
          <span class="badge badge--${n.readiness.tone}">${n.readiness.label}</span>
          <span class="badge badge--primary">Next: ${((r=n.recommendedNext)==null?void 0:r.title)||"Lesson 1"}</span>
          <span class="badge badge--neutral">Risk: ${n.risk.label}</span>
        </div>

        <p class="tutor-hero__memory">
          I remember that your strongest current evidence is in <strong>${((o=n.strengths[0])==null?void 0:o.title)||"the topics you have already practiced"}</strong>,
          while the biggest focus area is <strong>${((i=n.knowledgeGaps[0])==null?void 0:i.title)||((c=n.recommendedNext)==null?void 0:c.title)||"the next lesson in your path"}</strong>.
        </p>
      </div>

      <div class="card tutor-thread-card">
        <div class="tutor-thread" id="tutor-thread">
          ${wd()}
          ${Z.sending?'<div class="chat-bubble chat-bubble--assistant"><div class="chat-bubble__role">AI Tutor</div><div class="shimmer" style="height: 52px;"></div></div>':""}
        </div>

        <div class="tutor-prompts">
          ${vd.map(l=>`
            <button class="tutor-prompt" data-prompt="${l}">${l}</button>
          `).join("")}
        </div>

        <form class="tutor-composer" id="tutor-form">
          <textarea id="tutor-input" class="input tutor-composer__input" rows="3" placeholder="Ask a question about a lesson, concept, or what to study next..." ${Z.sending?"disabled":""}></textarea>
          <button class="btn btn--primary" type="submit" ${Z.sending?"disabled":""}>Send</button>
        </form>
      </div>
    </div>
  `}function Sd(e,t){ue({onBack:()=>e("/lessons")});const s=document.getElementById("tutor-form"),a=document.getElementById("tutor-input"),n=document.getElementById("btn-clear-chat"),r=document.getElementById("tutor-thread");r&&(r.scrollTop=r.scrollHeight),n&&n.addEventListener("click",async()=>{const o=K();o&&(await ji(o.id),Z={studentId:o.id,messages:[],sending:!1},await t())}),document.querySelectorAll(".tutor-prompt").forEach(o=>{o.addEventListener("click",async i=>{const c=i.currentTarget.dataset.prompt;c&&await Qa(c,t)})}),s&&a&&s.addEventListener("submit",async o=>{o.preventDefault();const i=a.value.trim();if(!i){D("Type a question for the tutor first.","error");return}await Qa(i,t)})}async function Qa(e,t){const s=K();if(!s||Z.sending)return;const a=await Me(s.id),n=await xe(s.id),r=await at(s.id),o=Ee({diagnostic:a,results:r,progressRecords:n}),i={role:"user",content:e,createdAt:new Date().toISOString()};Z={...Z,sending:!0,messages:[...Z.messages,i]},await Da(s.id,Z.messages),await t();const c=await hd({student:s,message:e,history:Z.messages,profile:o});Z={...Z,sending:!1,messages:[...Z.messages,{role:"assistant",content:c.text,source:c.source,createdAt:new Date().toISOString()}]},await Da(s.id,Z.messages),await t()}const Ha={1:{prompt:"Write a JavaScript function named `isPortableComputer(type)` that returns `true` for portable computers like a laptop, tablet, or smartphone, and `false` for a desktop or server.",starterCode:`function isPortableComputer(type) {
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
`}};function ka(e=""){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function Ks(e,t){const s=e.slice(),a=[];for(;s.length>0&&a.length<t;)a.push(s.shift());return a}function Qn(e){const t=q.filter(s=>e.includes(s.id));return t.length>0?t:q.slice(0,2)}function kd(e=""){const t=e.match(/```json\s*([\s\S]*?)```/i);if(t!=null&&t[1])return t[1].trim();const s=e.indexOf("{"),a=e.lastIndexOf("}");return s>=0&&a>s?e.slice(s,a+1):e}function _d(e,t,s){const a=["mcq","short","code"].includes(e.type)?e.type:"short",n=s.includes(e.lessonId)?e.lessonId:s[0],r=Number.isFinite(e.maxScore)?e.maxScore:a==="mcq"?1:5,o=Array.isArray(e.rubric)&&e.rubric.length>0?e.rubric.map(i=>({criterion:i.criterion||"Quality",description:i.description||"Addresses the prompt clearly.",points:Number.isFinite(i.points)?i.points:2,keywords:Array.isArray(i.keywords)?i.keywords:[]})):[{criterion:"Accuracy",description:"Uses correct subject knowledge.",points:r,keywords:[]}];return{id:`GEN-Q${t+1}`,type:a,lessonId:n,objective:e.objective||"Generated from lesson objectives",prompt:e.prompt||e.stem||`Generated question ${t+1}`,options:a==="mcq"&&Array.isArray(e.options)&&e.options.length===4?e.options:void 0,correctIndex:a==="mcq"&&Number.isInteger(e.correctIndex)?e.correctIndex:void 0,starterCode:a==="code"?e.starterCode||"":void 0,answerKey:e.answerKey||"",sampleSolution:e.sampleSolution||"",rubric:o,maxScore:r}}function $d(e,t,s){const a=(e.keyTerms||[]).slice(0,3),n=a.map(o=>o.word.toLowerCase()),r=`In 3-5 sentences, ${t.charAt(0).toLowerCase()}${t.slice(1)}. Use at least one correct computing term from this lesson.`;return{id:`SA-Q${s+1}`,type:"short",lessonId:e.id,objective:t,prompt:r,answerKey:a.map(o=>`${o.word}: ${o.definition}`).join(" "),rubric:[{criterion:"Concept accuracy",description:"The response explains the idea correctly.",points:3,keywords:n},{criterion:"Use of subject vocabulary",description:"The response uses at least one correct computing term.",points:1,keywords:n},{criterion:"Clarity",description:"The response is easy to follow and stays on task.",points:1,keywords:[]}],maxScore:5}}function Ad(e,t,s){const a=Ha[e.id]||Ha[5];return{id:`CODE-Q${s+1}`,type:"code",lessonId:e.id,objective:t,prompt:`${a.prompt}

Learning objective: ${t}`,starterCode:a.starterCode,answerKey:a.sampleSolution,sampleSolution:a.sampleSolution,rubric:[{criterion:"Correct logic",description:"The code follows the expected rule from the lesson.",points:3,keywords:a.keyConcepts},{criterion:"Programming structure",description:"The answer uses a function, return value, and clear condition or lookup.",points:2,keywords:["function","return"]}],maxScore:5}}function Cd(e,t){return{id:`MCQ-Q${t+1}`,type:"mcq",lessonId:e.lessonId,objective:"Check core understanding of the lesson objective.",prompt:e.stem,options:e.options,correctIndex:e.correctIndex,answerKey:e.options[e.correctIndex],rubric:[{criterion:"Correct answer",description:"Selects the correct option.",points:1,keywords:[]}],maxScore:1}}function xd(e){const t=Qn(e.lessonIds),s=t.flatMap(m=>m.objectives.map(h=>({lesson:m,objective:h}))),a=s.length>0?s:q.slice(0,1).flatMap(m=>m.objectives.map(h=>({lesson:m,objective:h}))),n=a.map(m=>({lessonId:m.lesson.id,lessonTitle:m.lesson.title,objective:m.objective})),r=ls.filter(m=>e.lessonIds.includes(m.lessonId)).sort((m,h)=>h.discrimination-m.discrimination||m.difficulty-h.difficulty),o=Ks(a,e.shortAnswerCount||0),i=Ks(a.slice().reverse(),e.codingCount||0),c=Ks(r,e.mcqCount||0).map(Cd),l=o.map((m,h)=>$d(m.lesson,m.objective,h)),d=i.map((m,h)=>Ad(m.lesson,m.objective,h)),u=[...c,...l,...d].map((m,h)=>({...m,id:`${ka(e.title||"assessment")}-q${h+1}`})),p=u.length;return{title:e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"fallback",published:!0,lessonIds:t.map(m=>m.id),objectiveCoverage:n,durationMinutes:e.durationMinutes||Math.max(15,p*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:u}}async function Ed(e){const s=Qn(e.lessonIds).map(n=>[`Lesson ${n.id}: ${n.title}`,`Objectives: ${n.objectives.join("; ")}`,`Key terms: ${(n.keyTerms||[]).map(r=>`${r.word}=${r.definition}`).join("; ")}`].join(`
`)).join(`

`),a=["You are building a classroom assessment for Basic 7 Computing.","Return valid JSON only.",`Title: ${e.title}`,`Question counts: ${e.mcqCount} multiple choice, ${e.shortAnswerCount} short answer, ${e.codingCount} coding.`,`Target duration in minutes: ${e.durationMinutes}.`,"Each question must include: type, lessonId, objective, prompt, maxScore, rubric[].","MCQ questions must also include options[4] and correctIndex.","Code questions must also include starterCode and sampleSolution.","Include an objectiveCoverage array with lessonId, lessonTitle, objective.","Keep questions age-appropriate and aligned to the lessons below.",s,"JSON shape:",'{"title":"","objectiveCoverage":[{"lessonId":1,"lessonTitle":"","objective":""}],"questions":[{"type":"mcq","lessonId":1,"objective":"","prompt":"","options":["","","",""],"correctIndex":0,"maxScore":1,"rubric":[{"criterion":"","description":"","points":1,"keywords":[""]}]}]}'].join(`

`);try{const n=await Ls(a,{temperature:.7,maxOutputTokens:1200,topP:.9},15e3);if(!n)return null;const r=JSON.parse(kd(n));if(!Array.isArray(r.questions)||r.questions.length===0)return null;const o=r.questions.map((i,c)=>_d(i,c,e.lessonIds));return{title:r.title||e.title||"Generated Assessment",subject:"Basic 7 Computing",generatedBy:"ai",published:!0,lessonIds:e.lessonIds,objectiveCoverage:Array.isArray(r.objectiveCoverage)&&r.objectiveCoverage.length>0?r.objectiveCoverage:Qn(e.lessonIds).flatMap(i=>i.objectives.map(c=>({lessonId:i.id,lessonTitle:i.title,objective:c}))),durationMinutes:e.durationMinutes||Math.max(15,o.length*4),advancedFeature:"Objective Coverage Map",createdAt:new Date().toISOString(),questions:o.map((i,c)=>({...i,id:`${ka(e.title||"assessment")}-q${c+1}`}))}}catch{return null}}function Ld(){return q.map(e=>({lessonId:e.id,title:e.title,objectives:e.objectives}))}function Bd(e,t){var r;const s=t.filter(o=>e.questionIds.includes(o.id));if(!s.length)throw new Error("Choose at least one saved question.");const a=s.map((o,i)=>{var h,g;const c=o.type||"short",l=["mcq","true-false"].includes(c)?"mcq":c==="code"?"code":"short",d=c==="true-false"?(h=o.options)!=null&&h.length?o.options:["True","False"]:o.options,u=Number.parseInt(o.answer,10),p=l==="mcq"?Number.isInteger(u)&&(d!=null&&d[u])?u:Math.max(0,(d==null?void 0:d.findIndex(v=>v.toLowerCase()===String(o.answer||"").toLowerCase()))||0):void 0,m=l==="mcq"?1:5;return{id:`${ka(e.title||"assessment")}-bank-q${i+1}`,sourceQuestionId:o.id,type:l,lessonId:o.lessonId||((g=e.lessonIds)==null?void 0:g[0])||1,objective:`${o.bloom||"Knowledge"} question from the local question bank`,prompt:o.prompt,options:l==="mcq"?d:void 0,correctIndex:p,starterCode:l==="code"?o.starterCode||"":void 0,answerKey:o.answer||"",sampleSolution:l==="code"?o.answer||"":void 0,rubric:[{criterion:l==="mcq"?"Correct answer":"Concept accuracy",description:"Addresses the question accurately.",points:m,keywords:[]}],maxScore:m}}),n=a.map(o=>{var i;return{lessonId:o.lessonId,lessonTitle:((i=q.find(c=>c.id===o.lessonId))==null?void 0:i.title)||"Custom curriculum",objective:o.objective}});return{title:((r=e.title)==null?void 0:r.trim())||"Question Bank Assessment",subject:"Basic 7 Computing",generatedBy:"question-bank",published:!0,lessonIds:[...new Set(a.map(o=>o.lessonId))],objectiveCoverage:n,durationMinutes:Math.max(10,Number.parseInt(e.durationMinutes,10)||a.length*3),advancedFeature:"Teacher-selected Question Bank",createdAt:new Date().toISOString(),questions:a}}async function Td(e){var a;const t={title:((a=e.title)==null?void 0:a.trim())||"Assessment Blueprint",lessonIds:Array.isArray(e.lessonIds)&&e.lessonIds.length>0?e.lessonIds:[1,2],mcqCount:Math.max(0,Number.parseInt(e.mcqCount,10)||0),shortAnswerCount:Math.max(0,Number.parseInt(e.shortAnswerCount,10)||0),codingCount:Math.max(0,Number.parseInt(e.codingCount,10)||0),durationMinutes:Math.max(10,Number.parseInt(e.durationMinutes,10)||20)};return await Ed(t)||xd(t)}function Bt(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function Ys(e,t=2){return Math.round(e*10**t)/10**t}function Dd(e,t){const s=t.map(i=>{var c;return{...i,totalNormalized:(c=i.grading)!=null&&c.maxScore?i.grading.totalScore/i.grading.maxScore:0}}),a=s.slice().sort((i,c)=>c.totalNormalized-i.totalNormalized),n=Math.max(1,Math.ceil(a.length/3)),r=a.slice(0,n),o=a.slice(-n);return e.questions.map(i=>{const c=s.map(h=>{var g,v;return(v=(g=h.grading)==null?void 0:g.questionScores)==null?void 0:v.find(b=>b.questionId===i.id)}).filter(Boolean),l=Bt(c.map(h=>h.normalizedScore)),d=Bt(r.map(h=>{var g,v,b;return(b=(v=(g=h.grading)==null?void 0:g.questionScores)==null?void 0:v.find(I=>I.questionId===i.id))==null?void 0:b.normalizedScore}).filter(h=>typeof h=="number")),u=Bt(o.map(h=>{var g,v,b;return(b=(v=(g=h.grading)==null?void 0:g.questionScores)==null?void 0:v.find(I=>I.questionId===i.id))==null?void 0:b.normalizedScore}).filter(h=>typeof h=="number")),p=d-u;let m="Healthy";return l<.25?m="Too Hard":l>.85?m="Too Easy":p<.15&&(m="Weak Discriminator"),{questionId:i.id,type:i.type,prompt:i.prompt,objective:i.objective,difficultyIndex:Ys(l),discriminationIndex:Ys(p),meanScore:Ys(Bt(c.map(h=>h.score||0))),status:m,submissionCount:c.length}})}function Bo(e,t){const s=Dd(e,t),a=t.length>0?Math.round(Bt(t.map(o=>{var i;return((i=o.grading)==null?void 0:i.percentage)||0}))):0,n=t.filter(o=>{var i;return((i=o.integrity)==null?void 0:i.label)==="High"}).length,r=t.filter(o=>{var i;return((i=o.proctor)==null?void 0:i.label)==="High"}).length;return{assessmentId:e.id,title:e.title,generatedBy:e.generatedBy,submissionCount:t.length,averagePercentage:a,flaggedIntegrityCount:n,flaggedProctorCount:r,itemAnalysis:s}}let pt="published";function Js(e,t){return e.filter(s=>s.type===t).length}function Md(){return Ld().map(t=>`
    <label class="assessment-check">
      <input type="checkbox" name="lesson-id" value="${t.lessonId}" ${t.lessonId<=3?"checked":""}>
      <span class="assessment-check__body">
        <span class="assessment-check__title">Lesson ${t.lessonId}: ${t.title}</span>
        <span class="assessment-check__meta">${t.objectives.length} objectives available</span>
      </span>
    </label>
  `).join("")}function qd(e){return e.length?e.map(t=>`<label class="assessment-check"><input type="checkbox" name="question-bank-id" value="${t.id}"><span class="assessment-check__body"><span class="assessment-check__title">${ft(t.prompt)}</span><span class="assessment-check__meta">${ft(t.type)} - ${ft(t.bloom||"Knowledge")}${t.lessonId?` - Lesson ${t.lessonId}`:""}</span></span></label>`).join(""):'<p class="insight-empty">No saved questions yet. Create them in Question Bank.</p>'}function Ga(e,t){return e.length?e.map(s=>{const a=t.filter(r=>r.assessmentId===s.id),n=Bo(s,a);return`
      <div class="card assessment-admin-card">
        <div class="assessment-admin-card__header">
          <div>
            <div class="assessment-admin-card__eyebrow">${s.generatedBy==="ai"?"AI generated":"Objective-based fallback"}</div>
            <h3 class="assessment-admin-card__title">${s.title}</h3>
            <p class="assessment-admin-card__meta">${s.durationMinutes} min | ${s.questions.length} questions | ${s.objectiveCoverage.length} objectives covered</p>
          </div>
          <div class="assessment-admin-card__badges">
            <span class="badge badge--success">${ft((s.status||"open").toUpperCase())}</span>
            <span class="badge badge--primary">${Js(s.questions,"mcq")} MCQ</span>
            <span class="badge badge--accent">${Js(s.questions,"short")} Short</span>
            <span class="badge badge--warning">${Js(s.questions,"code")} Code</span>
          </div>
        </div>

        <div class="assessment-admin-card__metrics">
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${n.submissionCount}</span>
            <span class="assessment-admin-card__metric-label">Submissions</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${n.averagePercentage}%</span>
            <span class="assessment-admin-card__metric-label">Average Score</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${n.flaggedIntegrityCount}</span>
            <span class="assessment-admin-card__metric-label">High AI Risk</span>
          </div>
          <div class="assessment-admin-card__metric">
            <span class="assessment-admin-card__metric-value">${n.flaggedProctorCount}</span>
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
    `}function ft(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function Nd(e){const t=await Qt(),s=await je(),a=await we(),n=t.find(l=>l.id===e);if(!n)return;const r=s.filter(l=>l.assessmentId===n.id),o=Bo(n,r),i=r.filter(l=>{var d,u;return((d=l.integrity)==null?void 0:d.label)!=="Low"||((u=l.proctor)==null?void 0:u.label)!=="Low"}).map(l=>{var u,p,m,h,g;const d=a.find(v=>v.id===l.studentId);return`
        <tr>
          <td>${(d==null?void 0:d.name)||"Unknown"}</td>
          <td>${((u=l.grading)==null?void 0:u.percentage)||0}%</td>
          <td>${((p=l.integrity)==null?void 0:p.label)||"Low"} (${((m=l.integrity)==null?void 0:m.score)||0})</td>
          <td>${((h=l.proctor)==null?void 0:h.label)||"Low"} (${((g=l.proctor)==null?void 0:g.anomalyScore)||0})</td>
        </tr>
      `}).join(""),c=`
    <div class="analysis-modal">
      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Objective Coverage</h4>
        <div class="analysis-modal__chips">
          ${n.objectiveCoverage.map(l=>`
            <span class="badge badge--neutral">${ft(l.lessonTitle||`Lesson ${l.lessonId}`)}: ${ft(l.objective)}</span>
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
              ${o.itemAnalysis.map((l,d)=>`
                <tr>
                  <td>Q${d+1}</td>
                  <td>${l.type}</td>
                  <td>${l.difficultyIndex}</td>
                  <td>${l.discriminationIndex}</td>
                  <td>${l.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="analysis-modal__section">
        <h4 class="analysis-modal__title">Flagged Submissions</h4>
        ${i?`
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
              <tbody>${i}</tbody>
            </table>
          </div>
        `:'<div class="insight-empty">No submissions are currently flagged.</div>'}
      </div>
    </div>
  `;he(n.title,c,[{label:"Close",variant:"btn--ghost"}],{modalClass:"modal--wide"})}async function Rd(){const e=(await Qt()).slice().sort((n,r)=>new Date(r.createdAt)-new Date(n.createdAt)),t=await je(),s=await Ht(),a=`
    <div class="assessment-lab-page">
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
                ${Md()}
              </div>
            </div>

            <div class="input-group">
              <label>Saved Question Bank <span class="assessment-builder-card__subtitle">optional - uses selected questions instead of generating new ones</span></label>
              <div class="assessment-checklist assessment-checklist--compact">${qd(s)}</div>
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
          <div class="workspace-tabs" role="tablist"><button class="workspace-tab ${pt==="published"?"workspace-tab--active":""}" data-assessment-tab="published">Published</button><button class="workspace-tab ${pt==="submissions"?"workspace-tab--active":""}" data-assessment-tab="submissions">Submissions</button><button class="workspace-tab ${pt==="analysis"?"workspace-tab--active":""}" data-assessment-tab="analysis">Analysis</button></div>
          <div class="assessment-admin-list">
            ${pt==="published"?Ga(e,t):pt==="submissions"?`<div class="card assessment-admin-card"><h3 class="assessment-admin-card__title">Submission activity</h3><p class="assessment-admin-card__meta">${t.length} total submissions across ${e.length} published assessments.</p></div>`:`<div class="card assessment-admin-card"><h3 class="assessment-admin-card__title">Assessment analysis</h3><p class="assessment-admin-card__meta">Open a published assessment below to inspect item performance and integrity flags.</p>${Ga(e,t)}</div>`}
          </div>
        </div>
      </div>
    </div>`;return Je({title:"Assessments",subtitle:"Build, publish, monitor, and analyze assessments in one focused workspace.",activePath:"/assessment-lab",content:a})}function Pd(e){rt(e);const t=document.getElementById("assessment-builder-form");document.querySelectorAll("[data-assessment-tab]").forEach(s=>s.addEventListener("click",()=>{pt=s.dataset.assessmentTab,e("/assessment-lab")})),t&&t.addEventListener("submit",async s=>{var c,l,d,u,p;s.preventDefault();const a=[...document.querySelectorAll('input[name="lesson-id"]:checked')].map(m=>Number.parseInt(m.value,10)).filter(Boolean),n=[...document.querySelectorAll('input[name="question-bank-id"]:checked')].map(m=>Number.parseInt(m.value,10)).filter(Boolean),r={title:((c=document.getElementById("assessment-title"))==null?void 0:c.value)||"",durationMinutes:((l=document.getElementById("assessment-duration"))==null?void 0:l.value)||"25",mcqCount:((d=document.getElementById("assessment-mcq-count"))==null?void 0:d.value)||"0",shortAnswerCount:((u=document.getElementById("assessment-short-count"))==null?void 0:u.value)||"0",codingCount:((p=document.getElementById("assessment-code-count"))==null?void 0:p.value)||"0",lessonIds:a},o=Number.parseInt(r.mcqCount,10)+Number.parseInt(r.shortAnswerCount,10)+Number.parseInt(r.codingCount,10);if(a.length===0&&n.length===0){D("Choose at least one lesson for the blueprint.","error");return}if(o<=0&&n.length===0){D("Add at least one question to the assessment.","error");return}const i=t.querySelector('button[type="submit"]');i&&(i.disabled=!0,i.textContent="Generating...");try{const m=n.length?Bd({...r,questionIds:n},await Ht()):await Td(r);await Oi(m),D(`Assessment published with ${m.questions.length} questions.`,"success"),await e("/assessment-lab")}catch(m){console.error(m),D("Assessment generation failed. Please try again.","error"),i&&(i.disabled=!1,i.textContent="Generate and Publish Assessment")}}),document.querySelectorAll(".btn-view-analysis").forEach(s=>{s.addEventListener("click",async a=>{const n=Number.parseInt(a.currentTarget.dataset.assessmentId,10);await Nd(n)})})}async function zd(){const e=K(),t=(await Qt()).filter(a=>a.published!==!1).sort((a,n)=>new Date(n.createdAt)-new Date(a.createdAt)),s=e?await Hr(e.id):[];return`
    ${V({title:"Assessment Center",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-center-page" style="padding-top: var(--space-6);">
      <div class="card card--glass assessment-hero">
        <div class="assessment-hero__eyebrow">Secure assessment workspace</div>
        <h1 class="assessment-hero__title">Take published assessments and review your feedback</h1>
        <p class="assessment-hero__text">Open-ended responses are graded against rubrics, browser anomalies are logged locally, and every submission gets an integrity review plus a remediation plan.</p>
      </div>

      <div class="assessment-student-list">
        ${t.length>0?t.map(a=>{var o,i;const n=s.filter(c=>c.assessmentId===a.id).sort((c,l)=>new Date(l.completedAt)-new Date(c.completedAt))[0],r=a.questions.length;return`
            <div class="card assessment-student-card">
              <div class="assessment-student-card__header">
                <div>
                  <div class="assessment-admin-card__eyebrow">${a.generatedBy==="ai"?"AI blueprint":"Objective blueprint"}</div>
                  <h2 class="assessment-student-card__title">${a.title}</h2>
                  <p class="assessment-student-card__meta">${a.durationMinutes} min | ${r} questions | ${a.objectiveCoverage.length} objectives</p>
                </div>
                ${n?`<span class="badge badge--${((o=n.integrity)==null?void 0:o.label)==="High"?"warning":"success"}">${((i=n.grading)==null?void 0:i.percentage)||0}% latest</span>`:'<span class="badge badge--neutral">Not taken yet</span>'}
              </div>

              <div class="assessment-student-card__actions">
                <button class="btn btn--primary btn--sm btn-start-assessment" data-assessment-id="${a.id}">
                  ${n?"Retake Assessment":"Start Assessment"}
                </button>
                ${n?`
                  <button class="btn btn--ghost btn--sm btn-view-assessment-result" data-submission-id="${n.id}">
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
  `}function jd(e){ue({onBack:()=>e("/lessons")}),document.querySelectorAll(".btn-start-assessment").forEach(t=>{t.addEventListener("click",s=>{const a=Number.parseInt(s.currentTarget.dataset.assessmentId,10);e(`/assessment/${a}`)})}),document.querySelectorAll(".btn-view-assessment-result").forEach(t=>{t.addEventListener("click",s=>{const a=Number.parseInt(s.currentTarget.dataset.submissionId,10);e(`/assessment-results/${a}`)})})}function To(){return new Date().toISOString()}function Od(e,t={}){return{type:e,detail:t,timestamp:To()}}function Fd({onEvent:e=null}={}){const t=[],s=[],a=new Map;let n=null;function r(p,m={}){const h=Od(p,m);t.push(h),e==null||e(h)}function o(p,m,h,g){p.addEventListener(m,h,g),s.push(()=>p.removeEventListener(m,h,g))}async function i(){try{!document.fullscreenElement&&document.documentElement.requestFullscreen&&await document.documentElement.requestFullscreen()}catch{r("fullscreen-request-failed")}}async function c(){n=Date.now(),await i(),o(document,"visibilitychange",()=>{document.hidden&&r("tab-hidden")}),o(window,"blur",()=>{r("window-blur")}),o(document,"fullscreenchange",()=>{document.fullscreenElement||r("fullscreen-exit")}),o(document,"contextmenu",p=>{p.preventDefault(),r("context-menu-open")}),["copy","cut","paste"].forEach(p=>{o(document,p,m=>{m.preventDefault(),r(`${p}-attempt`)})}),o(document,"keydown",p=>{(p.key==="F12"||p.ctrlKey&&["c","v","x","p","s","u"].includes(p.key.toLowerCase())||p.ctrlKey&&p.shiftKey&&["i","j","c"].includes(p.key.toLowerCase()))&&(p.preventDefault(),r("blocked-shortcut",{key:p.key}))}),window.onbeforeunload=()=>"Assessment still in progress.",r("proctor-started")}function l(p,m){const h=(m||"").length,g=a.get(p)||{length:0,updatedAt:Date.now()},v=Date.now(),b=h-g.length,I=v-g.updatedAt;b>=80&&I<1500&&r("burst-typing",{questionId:p,deltaLength:b,deltaTime:I}),a.set(p,{length:h,updatedAt:v})}function d(){const p=t.reduce((h,g)=>(h[g.type]=(h[g.type]||0)+1,h),{}),m=Math.min(100,(p["fullscreen-exit"]||0)*18+(p["tab-hidden"]||0)*16+(p["window-blur"]||0)*12+(p["paste-attempt"]||0)*12+(p["copy-attempt"]||0)*8+(p["cut-attempt"]||0)*8+(p["blocked-shortcut"]||0)*7+(p["burst-typing"]||0)*10+(p["context-menu-open"]||0)*6);return{startedAt:n?new Date(n).toISOString():null,endedAt:To(),durationMs:n?Date.now()-n:0,anomalyScore:m,label:m>=60?"High":m>=30?"Moderate":"Low",counts:p,events:t}}async function u(){s.splice(0).forEach(p=>p()),window.onbeforeunload=null;try{document.fullscreenElement&&document.exitFullscreen&&await document.exitFullscreen()}catch{}return r("proctor-stopped"),d()}return{start:c,stop:u,summarize:d,logEvent:r,trackTextEntry:l}}function Nt(e,t,s){return Math.max(t,Math.min(s,e))}function Ud(e,t=2){return Math.round(e*10**t)/10**t}function Qd(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function Hd(e,t=[]){return t.length?t.reduce((s,a)=>e.includes(String(a).toLowerCase())?s+1:s,0):0}function Gd(e){return e.filter(Boolean).join(" ")}async function Wd(e){try{const t=await Ls(e,{temperature:.3,maxOutputTokens:400,topP:.85});if(!t)return null;const s=t.includes("{")?t.slice(t.indexOf("{"),t.lastIndexOf("}")+1):t;return JSON.parse(s)}catch{return null}}function Vd(e,t){var l;const s=e.maxScore||((l=e.rubric)==null?void 0:l.reduce((d,u)=>d+u.points,0))||5,a=t.trim();if(!a)return{score:0,maxScore:s,rubricBreakdown:(e.rubric||[]).map(d=>({criterion:d.criterion,score:0,maxScore:d.points,evidence:"No evidence yet."})),feedback:"No response was submitted for this question.",source:"fallback"};const n=Qd(a),r=/function|return|if|const|let|=>/i.test(a),o=(e.rubric||[]).map(d=>{var h,g;const u=Hd(n,d.keywords),p=(h=d.keywords)!=null&&h.length?u/d.keywords.length:.6;let m=(g=d.keywords)!=null&&g.length?Math.round(Nt(p,0,1)*d.points):Math.ceil(d.points*.6);return e.type==="code"&&r&&/function|return/i.test(a)&&/Programming structure/i.test(d.description)&&(m=Math.max(m,Math.ceil(d.points*.75))),m=Nt(m,0,d.points),{criterion:d.criterion,score:m,maxScore:d.points,evidence:u>0?`Matched ${u} expected concept${u===1?"":"s"}.`:"Only partial evidence of the expected concept."}});let i=o.reduce((d,u)=>d+u.score,0);n.length>24&&i<s&&(i=Math.min(s,i+1));const c=Gd([i>=s*.8?"Strong response.":"This response shows some understanding but still needs refinement.",e.type==="code"?"Check that the code logic matches the lesson rule and that the function returns the expected values.":"Use more precise lesson vocabulary and include the key concept directly in your explanation."]);return{score:Nt(i,0,s),maxScore:s,rubricBreakdown:o,feedback:c,source:"fallback"}}async function Kd(e,t){var r;const s=e.maxScore||((r=e.rubric)==null?void 0:r.reduce((o,i)=>o+i.points,0))||5,a=["You are grading a Basic 7 Computing assessment.","Return valid JSON only with keys: score, feedback, rubricBreakdown.",`Question type: ${e.type}`,`Prompt: ${e.prompt}`,`Sample answer: ${e.sampleSolution||e.answerKey||""}`,`Rubric: ${JSON.stringify(e.rubric||[])}`,`Student response: ${t}`,`Maximum score: ${s}`].join(`
`),n=await Wd(a);return n&&Number.isFinite(n.score)?{score:Nt(Math.round(n.score),0,s),maxScore:s,rubricBreakdown:Array.isArray(n.rubricBreakdown)&&n.rubricBreakdown.length>0?n.rubricBreakdown.map(o=>({criterion:o.criterion||"Quality",score:Nt(Math.round(o.score||0),0,Number.isFinite(o.maxScore)?o.maxScore:s),maxScore:Number.isFinite(o.maxScore)?o.maxScore:s,evidence:o.evidence||""})):[],feedback:n.feedback||"AI grading completed.",source:"ai"}:Vd(e,t)}function Yd(e,t){const s=Number.parseInt(t==null?void 0:t.selectedIndex,10)===e.correctIndex;return{score:s?e.maxScore||1:0,maxScore:e.maxScore||1,rubricBreakdown:[{criterion:"Correct answer",score:s?e.maxScore||1:0,maxScore:e.maxScore||1,evidence:s?"Correct option selected.":"Incorrect option selected."}],feedback:s?"Correct. You selected the best answer for this concept.":`Review this concept and compare your answer with the correct option: ${e.answerKey}.`,source:"system"}}async function Jd({assessment:e,answers:t}){const s=[];for(const l of e.questions){const d=t.find(m=>m.questionId===l.id)||{};let u=null;l.type==="mcq"?u=Yd(l,d):u=await Kd(l,d.responseText||"");const p=u.maxScore>0?u.score/u.maxScore:0;s.push({questionId:l.id,prompt:l.prompt,lessonId:l.lessonId,objective:l.objective,type:l.type,score:u.score,maxScore:u.maxScore,normalizedScore:Ud(p),feedback:u.feedback,rubricBreakdown:u.rubricBreakdown,gradingSource:u.source,flaggedForReview:l.type!=="mcq"&&u.source==="fallback"&&p>=.4&&p<=.7,answerPreview:l.type==="mcq"?d.selectedIndex:d.responseText||""})}const a=s.reduce((l,d)=>l+d.score,0),n=s.reduce((l,d)=>l+d.maxScore,0),r=n>0?Math.round(a/n*100):0,o=s.filter(l=>l.normalizedScore<.6).map(l=>({lessonId:l.lessonId,objective:l.objective,questionId:l.questionId,reason:l.feedback})),i=s.filter(l=>l.normalizedScore>=.8).map(l=>({lessonId:l.lessonId,objective:l.objective,questionId:l.questionId})),c=o.slice(0,4).map(l=>{var d;return{lessonId:l.lessonId,objective:l.objective,action:`Review this objective again and retry a similar ${((d=s.find(u=>u.questionId===l.questionId))==null?void 0:d.type)||"assessment"} question.`}});return{totalScore:a,maxScore:n,percentage:r,questionScores:s,weakObjectives:o,strengths:i,remediationPlan:c}}function Ae(e,t=2){return Math.round(e*10**t)/10**t}function gt(e=""){return e.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(Boolean)}function Zd(e=""){return e.split(/[.!?]+/).map(t=>t.trim()).filter(Boolean)}function Be(e){return e.length?e.reduce((t,s)=>t+s,0)/e.length:0}function Xd(e){if(e.length<2)return 0;const t=Be(e);return Be(e.map(s=>(s-t)**2))}function Wa(e,t){const s=new Set(e),a=new Set(t),n=[...s].filter(o=>a.has(o)).length,r=new Set([...s,...a]).size;return r>0?n/r:0}function eu(e){if(!e.length)return 0;const t=new Map;return e.forEach(s=>{t.set(s,(t.get(s)||0)+1)}),[...t.values()].reduce((s,a)=>{const n=a/e.length;return s-n*Math.log2(n)},0)}function Do(e){const t=gt(e),s=Zd(e),a=s.map(u=>gt(u).length).filter(Boolean),n=new Set(t).size,r=t.length>0?n/t.length:0,o=a.length>0?Be(a):t.length,i=a.length>1?Xd(a)/Math.max(1,o):0,c=eu(t),l=t.length>0?2**c:0,d=(e.match(/\b(overall|in conclusion|therefore|moreover|furthermore|additionally)\b/gi)||[]).length;return{tokenCount:t.length,sentenceCount:s.length,lexicalDiversity:Ae(r),averageSentenceLength:Ae(o),burstiness:Ae(i),perplexityProxy:Ae(l),templatePhraseCount:d}}function Mo(e){return typeof e.responseText=="string"?e.responseText.trim():""}function tu(e=[]){const t=e.flatMap(a=>a.answers||[]).map(Mo).filter(a=>a.length>0),s=t.map(Do);return{texts:t,avgLexicalDiversity:Be(s.map(a=>a.lexicalDiversity)),avgSentenceLength:Be(s.map(a=>a.averageSentenceLength))}}function su({answers:e,priorSubmissions:t=[]}){const s=e.filter(f=>f.type==="short"||f.type==="code").map(f=>({questionId:f.questionId,type:f.type,text:Mo(f)})).filter(f=>f.text.length>0),a=s.map(f=>({...f,metrics:Do(f.text)})),n=tu(t),r=Be(a.map(f=>f.metrics.lexicalDiversity)),o=Be(a.map(f=>f.metrics.averageSentenceLength)),i=Be(a.map(f=>f.metrics.burstiness)),c=Be(a.map(f=>f.metrics.perplexityProxy)),l=a.reduce((f,y)=>f+y.metrics.templatePhraseCount,0),d=[];for(let f=0;f<a.length;f+=1)for(let y=f+1;y<a.length;y+=1)d.push(Wa(gt(a[f].text),gt(a[y].text)));const u=Be(d),p=n.texts.length>0?Math.abs(r-n.avgLexicalDiversity)+Math.abs(o-n.avgSentenceLength)/20:0,m=n.texts.length>0&&s.length>0?Math.max(...s.map(f=>Math.max(...n.texts.map(y=>Wa(gt(f.text),gt(y))),0)),0):0;let h=0;const g=[],v=[];if(s.length===0)return{score:0,label:"Low",reasons:["No open-ended writing to analyze."],metrics:{lexicalDiversity:0,averageSentenceLength:0,burstiness:0,perplexityProxy:0,internalSimilarity:0,historicalOverlap:0},flaggedSegments:v};r>.62&&i<1.2&&(h+=18,g.push("Writing is unusually uniform across responses.")),c>35&&i<1.4&&(h+=16,g.push("Perplexity proxy suggests highly polished and predictable wording.")),l>=2&&(h+=10,g.push("Several template-like transition phrases were reused.")),u>.45&&(h+=18,g.push("Multiple answers reuse very similar vocabulary patterns.")),p>.35&&(h+=22,g.push("Writing style differs noticeably from the student’s earlier responses.")),m>.75&&(h+=20,g.push("One or more answers overlap heavily with earlier saved writing.")),a.forEach(f=>{f.metrics.burstiness<.5&&f.metrics.tokenCount>30&&v.push({questionId:f.questionId,reason:"Low burstiness and long response length."})});const b=Math.min(100,Math.round(h)),I=b>=65?"High":b>=35?"Moderate":"Low";return g.length||g.push("Writing patterns look reasonably consistent."),{score:b,label:I,reasons:g,metrics:{lexicalDiversity:Ae(r),averageSentenceLength:Ae(o),burstiness:Ae(i),perplexityProxy:Ae(c),internalSimilarity:Ae(u),historicalOverlap:Ae(m),styleShift:Ae(p)},flaggedSegments:v}}let R=null,ps=null,He=new Map,Ve=!1,ne=null,Rt=null,Re=0,Ze=!1,Zt=null,hs=!1;function qo(e=0){const t=String(Math.floor(e/60)).padStart(2,"0"),s=String(e%60).padStart(2,"0");return`${t}:${s}`}function Va(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function No(e){return e.type==="mcq"?{questionId:e.id,type:e.type,selectedIndex:null}:{questionId:e.id,type:e.type,responseText:e.type==="code"&&e.starterCode||""}}function Ro(e,t){if(!t)return!1;if(e.type==="mcq")return Number.isInteger(t.selectedIndex);const s=(t.responseText||"").trim();return!(!s||e.type==="code"&&s===(e.starterCode||"").trim())}function nu(e,t,s){return e.type==="mcq"?`
      <div class="assessment-question card">
        <div class="assessment-question__header">
          <span class="badge badge--primary">Question ${t+1}</span>
          <span class="badge badge--neutral">MCQ</span>
          <span class="badge badge--neutral">${e.maxScore} point${e.maxScore===1?"":"s"}</span>
        </div>
        <h3 class="assessment-question__prompt">${e.prompt}</h3>
        <div class="question-options">
          ${e.options.map((a,n)=>`
            <button class="option-btn assessment-option ${(s==null?void 0:s.selectedIndex)===n?"option-btn--selected":""}" type="button" data-question-id="${e.id}" data-option-index="${n}">
              <span class="option-btn__letter">${String.fromCharCode(65+n)}</span>
              <span class="option-btn__text">${a}</span>
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
          <pre>${Va(e.starterCode)}</pre>
        </div>
      `:""}
      <textarea
        class="input assessment-response ${e.type==="code"?"assessment-response--code":""}"
        data-question-id="${e.id}"
        rows="${e.type==="code"?10:5}"
        placeholder="${e.type==="code"?"Write your code here...":"Write your response here..."}"
      >${Va((s==null?void 0:s.responseText)||"")}</textarea>
    </div>
  `}function Po(){return(R==null?void 0:R.questions.map(e=>He.get(e.id)||No(e)))||[]}function Ka(){const e=document.getElementById("assessment-session-timer");e&&(e.textContent=qo(Re))}function Ds(){Rt&&(window.clearInterval(Rt),Rt=null)}async function au(e){const t=Number.parseInt(e,10);R&&ps===t||(R=await Fi(t),ps=t,He=new Map(((R==null?void 0:R.questions)||[]).map(s=>[s.id,No(s)])),Ve=!1,hs=!Ye(),ne=null,Re=((R==null?void 0:R.durationMinutes)||20)*60,Ds(),Ze=!1)}function ru(){Ds(),ne&&ne.stop(),R=null,ps=null,He=new Map,Ve=!1,ne=null,Re=0,Ze=!1}async function ou(e){if(!R||Ve)return;const t=K();ne=Fd({onEvent:s=>{["fullscreen-exit","tab-hidden","window-blur"].includes(s.type)&&Pn("Taking Assessment",{studentId:t==null?void 0:t.id,studentName:t==null?void 0:t.name,detail:`${R.title}: ${s.type.replaceAll("-"," ")}`,alert:!0})}}),await ne.start(),Pn("Taking Assessment",{studentId:t==null?void 0:t.id,studentName:t==null?void 0:t.name,detail:`${R.title} (Q1/${R.questions.length})`}),Ve=!0,Re=(R.durationMinutes||20)*60,await e()}async function Hn(e){if(!R||Ze)return;Ze=!0,Ds();const t=K();if(!t){Ze=!1,e("/student-login");return}try{const s=Po().map(c=>{const l=R.questions.find(d=>d.id===c.questionId);return!l||l.type==="mcq"?c:{...c,responseText:Ro(l,c)?c.responseText:""}}),a=await Hr(t.id),n=await Jd({assessment:R,answers:s}),r=su({answers:s,priorSubmissions:a}),o=ne?await ne.stop():{anomalyScore:0,label:"Low",counts:{},events:[]},i=await ca({assessmentId:R.id,studentId:t.id,answers:s,grading:n,integrity:r,proctor:o});Ts("submission",{studentId:t.id,studentName:t.name,submission:{...i,remoteSubmissionId:`${t.id}-${R.id}-${i.completedAt}`}}),Pn("Completed",{studentId:t.id,studentName:t.name,detail:`${R.title} submitted`,alert:o.label!=="Low"}),R=null,ps=null,He=new Map,Ve=!1,ne=null,Re=0,Ze=!1,e(`/assessment-results/${i.id}`)}catch(s){console.error(s),D("Unable to submit the assessment right now.","error"),Ze=!1}}function iu(e){!Ve||Rt||!R||(Ka(),Rt=window.setInterval(async()=>{Re=Math.max(0,Re-1),Ka(),Re===0&&(Ds(),D("Time is up. Submitting your assessment now.","info"),await Hn(e))},1e3))}function cu(){return{completed:Po().filter(s=>{const a=R==null?void 0:R.questions.find(n=>n.id===s.questionId);return a?Ro(a,s):!1}).length,total:(R==null?void 0:R.questions.length)||0}}function lu(){var a;const e=K();if(!R)return'<div class="container" style="padding: 2rem;">Assessment not found.</div>';const t=cu(),s=(a=ne==null?void 0:ne.summarize)==null?void 0:a.call(ne);return Ve?`
    ${V({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
    <div class="container container--narrow view-enter assessment-session-page">
      <div class="card card--glass assessment-session-topbar">
        <div>
          <div class="assessment-hero__eyebrow">Assessment in progress</div>
          <h1 class="assessment-session-topbar__title">${R.title}</h1>
        </div>
        <div class="assessment-session-topbar__meta">
          <span class="badge badge--warning" id="assessment-session-timer">${qo(Re)}</span>
          <span class="badge badge--neutral">${t.completed}/${t.total} answered</span>
          <span class="badge badge--${(s==null?void 0:s.label)==="High"?"danger":(s==null?void 0:s.label)==="Moderate"?"warning":"success"}">Proctor ${(s==null?void 0:s.label)||"Low"}</span>
        </div>
      </div>

      ${bt(t.completed,t.total,"Assessment completion")}

      <form id="assessment-session-form" class="assessment-session-form">
        ${R.questions.map((n,r)=>nu(n,r,He.get(n.id))).join("")}

        <div class="assessment-session-submit">
          <button class="btn btn--primary btn--lg" id="btn-submit-assessment" type="submit">Submit Assessment</button>
        </div>
      </form>
    </div>
  `:`
      ${V({title:"Assessment Session",showBack:!0,studentName:e==null?void 0:e.name})}
      <div class="container container--narrow view-enter assessment-session-page">
        <div class="card card--glass assessment-start-card">
          <div class="assessment-hero__eyebrow">Proctored assessment</div>
          <h1 class="assessment-hero__title">${R.title}</h1>
          <p class="assessment-hero__text">This assessment uses browser-based proctoring, open-response grading, item analysis, and integrity review.</p>

          <div class="assessment-start-card__grid">
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${R.durationMinutes}</span>
              <span class="assessment-start-card__label">Minutes</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${R.questions.length}</span>
              <span class="assessment-start-card__label">Questions</span>
            </div>
            <div class="assessment-start-card__metric">
              <span class="assessment-start-card__value">${R.objectiveCoverage.length}</span>
              <span class="assessment-start-card__label">Objectives</span>
            </div>
          </div>

          <div class="assessment-start-card__rules">
            <div class="assessment-start-card__rule">Secure mode will request fullscreen and log tab switches, blur events, copy/paste attempts, and suspicious typing bursts.</div>
            <div class="assessment-start-card__rule">Open-ended answers are graded with rubric alignment, then checked for style consistency and AI-writing risk.</div>
            <div class="assessment-start-card__rule">Coding questions use a safe static review instead of executing submitted code.</div>
          </div>

          <button class="btn btn--primary btn--lg" id="btn-begin-assessment">Begin Secure Assessment</button>
          ${Ye()&&!hs?'<p class="assessment-start-card__rule" id="lab-unlock-notice">Waiting for the teacher to unlock this lab assessment.</p>':""}
        </div>
      </div>
    `}function du(e,t,s){if(Zt==null||Zt(),Zt=po(n=>{var r;if(n.type==="control"&&n.action==="unlock-assessment"){hs=!0;const o=document.getElementById("btn-begin-assessment");o&&(o.disabled=!1),(r=document.getElementById("lab-unlock-notice"))==null||r.remove(),D("Your teacher unlocked the assessment.","success")}n.type==="control"&&n.action==="lock-screens"&&(document.querySelectorAll("input, textarea, button").forEach(o=>{o.closest("#main-nav")||(o.disabled=!0)}),D("The teacher has locked this assessment screen.","warning")),n.type==="control"&&n.action==="unlock-assessment"&&(document.querySelectorAll("input, textarea, button").forEach(o=>{o.closest("#main-nav")||(o.disabled=!1)}),D("The teacher has unlocked this assessment screen.","success")),n.type==="control"&&n.action==="force-submit"&&Hn(e)}),ue({onBack:()=>e("/assessments")}),!Ve){const n=document.getElementById("btn-begin-assessment");n&&(Ye()&&!hs&&(n.disabled=!0),n.addEventListener("click",async()=>{await ou(t)}));return}iu(e),document.querySelectorAll(".assessment-option").forEach(n=>{n.addEventListener("click",r=>{const o=r.currentTarget.dataset.questionId,i=Number.parseInt(r.currentTarget.dataset.optionIndex,10),c=He.get(o)||{questionId:o,type:"mcq",selectedIndex:null};He.set(o,{...c,selectedIndex:i}),document.querySelectorAll(`.assessment-option[data-question-id="${o}"]`).forEach(l=>{l.classList.toggle("option-btn--selected",Number.parseInt(l.dataset.optionIndex,10)===i)})})}),document.querySelectorAll(".assessment-response").forEach(n=>{n.addEventListener("input",r=>{const o=r.currentTarget.dataset.questionId,i=R.questions.find(c=>c.id===o);i&&(He.set(o,{questionId:o,type:i.type,responseText:r.currentTarget.value}),ne==null||ne.trackTextEntry(o,r.currentTarget.value))})});const a=document.getElementById("assessment-session-form");a&&a.addEventListener("submit",async n=>{n.preventDefault(),await Hn(e)})}function dt(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function uu(e){const t=K(),s=await je(),a=await Qt(),n=s.find(o=>o.id===Number.parseInt(e,10)),r=a.find(o=>o.id===(n==null?void 0:n.assessmentId));return!n||!r?'<div class="container" style="padding: 2rem;">Assessment result not found.</div>':`
    ${V({title:"Assessment Results",showBack:!0,studentName:t==null?void 0:t.name,backLabel:"Back to Assessments"})}
    <div class="container container--narrow view-enter assessment-results-page">
      <div style="text-align: center; margin-bottom: var(--space-8);">
        <div class="assessment-hero__eyebrow">Assessment complete</div>
        <h1 class="assessment-hero__title">${r.title}</h1>
        <p class="assessment-hero__text">Your open responses were graded against rubrics, then reviewed for integrity and browser behavior.</p>
      </div>

      ${ao(n.grading.totalScore,n.grading.maxScore)}

      <div class="quiz-results__metrics">
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Percentage</span>
          <span class="quiz-result-metric__value">${n.grading.percentage}%</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">AI / Style Risk</span>
          <span class="quiz-result-metric__value">${n.integrity.label} (${n.integrity.score})</span>
        </div>
        <div class="quiz-result-metric">
          <span class="quiz-result-metric__label">Proctoring</span>
          <span class="quiz-result-metric__value">${n.proctor.label} (${n.proctor.anomalyScore})</span>
        </div>
      </div>

      <div class="card card--glass results-next-step">
        <div class="results-next-step__eyebrow">Advanced feature: auto remediation plan</div>
        <h3 class="results-next-step__title">What to improve next</h3>
        <div class="assessment-remediation-list">
          ${n.grading.remediationPlan.length>0?n.grading.remediationPlan.map(o=>`
            <div class="assessment-remediation-item">
              <div class="assessment-remediation-item__title">Lesson ${o.lessonId}</div>
              <div class="assessment-remediation-item__objective">${dt(o.objective)}</div>
              <div class="assessment-remediation-item__action">${dt(o.action)}</div>
            </div>
          `).join(""):'<div class="insight-empty">No urgent remediation tasks were created for this submission.</div>'}
        </div>
      </div>

      <div class="assessment-results-grid">
        <div class="card">
          <h3 class="diagnostic-section__title">Integrity Review</h3>
          <p class="diagnostic-section__subtitle">${n.integrity.reasons.join(" | ")}</p>
          <div class="assessment-integrity-metrics">
            <span class="badge badge--neutral">Lexical diversity ${n.integrity.metrics.lexicalDiversity}</span>
            <span class="badge badge--neutral">Perplexity proxy ${n.integrity.metrics.perplexityProxy}</span>
            <span class="badge badge--neutral">Similarity ${n.integrity.metrics.internalSimilarity}</span>
          </div>
        </div>

        <div class="card">
          <h3 class="diagnostic-section__title">Proctoring Summary</h3>
          <p class="diagnostic-section__subtitle">Browser events logged during this attempt.</p>
          <div class="assessment-integrity-metrics">
            <span class="badge badge--neutral">Hidden tabs ${n.proctor.counts["tab-hidden"]||0}</span>
            <span class="badge badge--neutral">Fullscreen exits ${n.proctor.counts["fullscreen-exit"]||0}</span>
            <span class="badge badge--neutral">Paste attempts ${n.proctor.counts["paste-attempt"]||0}</span>
            <span class="badge badge--neutral">Blocked shortcuts ${n.proctor.counts["blocked-shortcut"]||0}</span>
          </div>
        </div>
      </div>

      <div class="results-review">
        <h3 class="results-review__title">Question Feedback</h3>
        ${n.grading.questionScores.map((o,i)=>{var c;return`
          <div class="review-item ${o.normalizedScore>=.6?"review-item--correct":"review-item--incorrect"}">
            <div class="review-item__question">${i+1}. ${dt(o.prompt)}</div>
            <div class="review-item__meta">
              <span>${o.type}</span>
              <span>${o.score}/${o.maxScore} points</span>
              <span>${o.gradingSource==="ai"?"AI graded":o.gradingSource==="fallback"?"Rubric fallback":"Auto graded"}</span>
            </div>
            <div class="review-item__answer">
              <div>${dt(o.feedback)}</div>
            </div>
            ${(c=o.rubricBreakdown)!=null&&c.length?`
              <div class="assessment-rubric-breakdown">
                ${o.rubricBreakdown.map(l=>`
                  <div class="assessment-rubric-breakdown__item">
                    <strong>${dt(l.criterion)}:</strong> ${l.score}/${l.maxScore} - ${dt(l.evidence||"")}
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
        <button class="btn btn--secondary" id="btn-save-assessment-usb">Save Submission to USB</button>
      </div>
    </div>
  `}function mu(e,t){ue({onBack:()=>e("/assessments")});const s=document.getElementById("btn-back-to-center"),a=document.getElementById("btn-retake-assessment"),n=document.getElementById("btn-save-assessment-usb");je().then(r=>{const o=r.find(i=>i.id===Number.parseInt(t,10));o&&(s&&s.addEventListener("click",()=>e("/assessments")),a&&a.addEventListener("click",()=>e(`/assessment/${o.assessmentId}`)),n&&n.addEventListener("click",async()=>{const i=K();try{wo(await yo(i,{kind:"assessment",record:o}),i.indexNumber)}catch(c){alert(c.message)}}))})}const Ms={sbaPercent:30,diagnosticPercent:20,examPercent:50};function pu(e){const t=Math.max(0,Math.min(100,Math.round(e||0)));return t>=90?{grade:1,label:"Grade 1",descriptor:"Excellent",letter:"A1",tone:"success",remark:"Outstanding performance and deep conceptual mastery."}:t>=80?{grade:2,label:"Grade 2",descriptor:"Very Good",letter:"B2",tone:"success",remark:"Very strong mastery; consistently demonstrates high ability."}:t>=70?{grade:3,label:"Grade 3",descriptor:"Good",letter:"B3",tone:"primary",remark:"Solid grasp of fundamental computing concepts."}:t>=60?{grade:4,label:"Grade 4",descriptor:"High Average",letter:"C4",tone:"primary",remark:"Satisfactory work; demonstrates steady progress in computing tasks."}:t>=55?{grade:5,label:"Grade 5",descriptor:"Average",letter:"C5",tone:"accent",remark:"Fair understanding; needs targeted practice on technical terms."}:t>=50?{grade:6,label:"Grade 6",descriptor:"Low Average",letter:"C6",tone:"warning",remark:"Average performance; additional review of key concepts required."}:t>=45?{grade:7,label:"Grade 7",descriptor:"Lower",letter:"D7",tone:"warning",remark:"Below expected standard; regular remediation recommended."}:t>=40?{grade:8,label:"Grade 8",descriptor:"Lowest",letter:"E8",tone:"danger",remark:"Weak performance; urgent intervention needed in basic computing."}:{grade:9,label:"Grade 9",descriptor:"Fail",letter:"F9",tone:"danger",remark:"Did not meet minimum competency requirements. Remedial support required."}}function hu(e){const t=["th","st","nd","rd"],s=e%100;return e+(t[(s-20)%10]||t[s]||t[0])}function gu(e,{results:t=[],progress:s=[],diagnostics:a=[],submissions:n=[],weights:r=Ms}){const o=t.filter(A=>A.studentId===e.id),i=s.filter(A=>A.studentId===e.id),c=a.filter(A=>A.studentId===e.id),l=n.filter(A=>A.studentId===e.id),d={};q.forEach(A=>{const C=o.filter(E=>E.lessonId===A.id).sort((E,L)=>new Date(L.completedAt)-new Date(E.completedAt))[0];d[A.id]=C&&C.totalQuestions>0?Math.round(C.score/C.totalQuestions*100):null});const u=Object.values(d).filter(A=>A!==null),p=u.length>0?u.reduce((A,C)=>A+C,0)/u.length:0,m=i.length/Math.max(1,q.length)*100,h=Math.round(p*.8+m*.2),g=c.sort((A,C)=>new Date(C.completedAt)-new Date(A.completedAt))[0];let v=50;if(g){const A=g.estimatedTheta??0;v=Math.max(0,Math.min(100,Math.round(50+A*16.67)))}const b=l.sort((A,C)=>new Date(C.completedAt)-new Date(A.completedAt))[0];let I=null;b&&b.maxScore>0?I=Math.round(b.totalScore/b.maxScore*100):u.length>0?I=Math.round(p):I=0;const f=(r.sbaPercent||30)/100,y=(r.diagnosticPercent||20)/100,$=(r.examPercent||50)/100,w=Math.round(h*f),S=Math.round(v*y),_=Math.round(I*$),k=Math.round(w+S+_),x=pu(k);return{student:e,lessonScores:d,rawQuizAverage:Math.round(p),completionCount:i.length,sbaRaw:h,weightedSBA:w,diagnosticRaw:v,weightedDiag:S,examRaw:I,weightedExam:_,totalPercentage:k,bece:x,quizzesTaken:o.length,hasExamSubmission:!!b,latestDiagnostic:g}}function fu(e){return e.slice().sort((s,a)=>a.totalPercentage!==s.totalPercentage?a.totalPercentage-s.totalPercentage:a.sbaRaw-s.sbaRaw).map((s,a)=>({...s,rankNumber:a+1,rankOrdinal:hu(a+1),isTopThree:a<3}))}function zo(e,{classes:t=[],students:s=[],results:a=[],progress:n=[],diagnostics:r=[],submissions:o=[],weights:i=Ms}){const c=e==="all"?{id:"all",name:"All Classes",gradeLevel:"B7",academicYear:"2026/2027",term:"Term 1"}:t.find(v=>String(v.id)===String(e))||t[0]||{id:1,name:"General",gradeLevel:"B7"},d=(e==="all"?s:s.filter(v=>String(v.classId)===String(c.id))).map(v=>gu(v,{results:a,progress:n,diagnostics:r,submissions:o,weights:i})),u=fu(d),p=u.length>0?Math.round(u.reduce((v,b)=>v+b.totalPercentage,0)/u.length):0,m=u.length>0?Math.max(...u.map(v=>v.totalPercentage)):0,h=u.length>0?Math.min(...u.map(v=>v.totalPercentage)):0,g={};for(let v=1;v<=9;v+=1)g[v]=u.filter(b=>b.bece.grade===v).length;return{classInfo:c,weights:i,lessons:q,students:u,statistics:{totalStudents:u.length,classAverage:p,highestScore:m,lowestScore:h,gradeDistribution:g}}}function vu(e){const t=["Rank","Index Number","Student Name","Class",...q.map(a=>`L${a.id}: ${a.title}`),`SBA Raw (${e.weights.sbaPercent}%)`,`Diagnostic Raw (${e.weights.diagnosticPercent}%)`,`Exam Raw (${e.weights.examPercent}%)`,"Total Percentage","BECE Grade","Descriptor"],s=e.students.map(a=>[a.rankOrdinal,`"${a.student.indexNumber||""}"`,`"${a.student.name}"`,`"${e.classInfo.name}"`,...q.map(n=>a.lessonScores[n.id]!==null?`${a.lessonScores[n.id]}%`:"N/A"),`${a.sbaRaw}%`,`${a.diagnosticRaw}%`,`${a.examRaw}%`,`${a.totalPercentage}%`,`Grade ${a.bece.grade}`,`"${a.bece.descriptor}"`]);return[t.join(","),...s.map(a=>a.join(","))].join(`
`)}function bu(e,{classes:t=[],students:s=[],results:a=[],progress:n=[],diagnostics:r=[],submissions:o=[],weights:i=Ms}){const c=s.find(g=>g.id===Number.parseInt(e,10));if(!c)return null;const l=t.find(g=>g.id===c.classId)||t[0]||{id:1,name:"B7 — JHS 1A",gradeLevel:"B7",academicYear:"2026/2027",term:"Term 1",teacherName:"Class Teacher"},d=zo(l.id,{classes:t,students:s,results:a,progress:n,diagnostics:r,submissions:o,weights:i}),u=d.students.find(g=>g.student.id===c.id);if(!u)return null;const m=a.filter(g=>g.studentId===c.id).sort((g,v)=>new Date(g.completedAt)-new Date(v.completedAt)).map(g=>{var v;return{completedAt:g.completedAt,lessonId:g.lessonId,lessonTitle:((v=q.find(b=>b.id===g.lessonId))==null?void 0:v.title)||`Lesson ${g.lessonId}`,theta:Number((g.theta||0).toFixed(2))}}),h=q.map(g=>{const v=u.lessonScores[g.id],b=n.some(f=>f.studentId===c.id&&f.lessonId===g.id);let I="Not yet attempted.";return v!==null&&(v>=80?I="Mastered core objectives.":v>=60?I="Demonstrates competent understanding.":I="Requires further reinforcement."),{id:g.id,title:g.title,strand:`Strand ${g.id}: Computer Systems`,score:v,isCompleted:b,remark:I}});return{student:c,studentClass:l,studentData:u,classTotalStudents:d.students.length,classAverage:d.statistics.classAverage,strands:h,thetaHistory:m,weights:i,attendance:{daysPresent:Math.min(60,52+c.id%8),totalDays:60},conduct:u.totalPercentage>=70?"Exemplary behavior, attentive during lab practicals, and shows positive initiative.":"Well behaved; advised to dedicate more time to hands-on computer practice.",headmasterRemark:u.totalPercentage>=70?"An impressive performance. Keep up the high standard.":"Has potential to do much better with consistent study and practice."}}let Xe="all",ht={...Ms},Pt=null;function At(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function is(){const[e,t,s,a,n,r]=await Promise.all([de(),we(),ze(),bs(),ys(),je()]),o=ks();Xe==="all"&&o.selectedClassId!=="all"&&(Xe=o.selectedClassId),Pt=zo(Xe,{classes:e,students:t,results:s,progress:a,diagnostics:n,submissions:r,weights:ht});const{classInfo:i,statistics:c,weights:l,lessons:d,students:u}=Pt,p=`
    <div class="gradebook-page">
      
      <div class="gradebook-header">
        <div>
          <h1 class="gradebook-header__title">${At(i.name)} — Continuous Assessment</h1>
          <p class="dashboard-header__subtitle">
            GES Standard 9-Point Grading & Weighted Terminal Broadsheet · Academic Year ${At(i.academicYear||"2026/2027")}
          </p>
        </div>
        <div class="gradebook-header__actions">
          <select id="gradebook-class-select" class="select-class">
            <option value="all" ${Xe==="all"?"selected":""}>All Classes (${t.length} students)</option>
            ${e.map(m=>`
              <option value="${m.id}" ${String(Xe)===String(m.id)?"selected":""}>
                ${At(m.name)} (${t.filter(h=>h.classId===m.id).length})
              </option>
            `).join("")}
          </select>
          <select id="gradebook-term-select" class="input input--sm" aria-label="Academic term"><option>Current term</option><option>Term 1</option><option>Term 2</option><option>Term 3</option></select>
          <select id="gradebook-subject-select" class="input input--sm" aria-label="Subject"><option>Computing</option></select>
          <button class="btn btn--ghost btn--sm" id="btn-configure-weights">Weighting</button>
          <button class="btn btn--ghost btn--sm" id="btn-print-gradebook">Print</button>
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
            <input type="number" id="weight-sba" class="input input--sm weight-input" value="${l.sbaPercent}" min="0" max="100">%
          </div>
          <div class="weight-input-group">
            <label for="weight-diag">Diagnostic:</label>
            <input type="number" id="weight-diag" class="input input--sm weight-input" value="${l.diagnosticPercent}" min="0" max="100">%
          </div>
          <div class="weight-input-group">
            <label for="weight-exam">Exam:</label>
            <input type="number" id="weight-exam" class="input input--sm weight-input" value="${l.examPercent}" min="0" max="100">%
          </div>
          <button class="btn btn--ghost btn--xs" id="btn-apply-weights">Apply Weights</button>
        </div>
      </div>

      <!-- Broadsheet Summary Bar -->
      <div class="broadsheet-stats-bar">
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value">${c.totalStudents}</div>
          <div class="broadsheet-stat-card__label">Enrolled Learners</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value">${c.classAverage}%</div>
          <div class="broadsheet-stat-card__label">Class Average</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value" style="color: var(--color-success-400);">${c.highestScore}%</div>
          <div class="broadsheet-stat-card__label">Highest Mark</div>
        </div>
        <div class="broadsheet-stat-card">
          <div class="broadsheet-stat-card__value" style="color: var(--color-accent-400);">${c.gradeDistribution[1]+c.gradeDistribution[2]}</div>
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
              ${d.map(m=>`<th style="text-align: center;">L${m.id}<br><small style="font-weight: normal; opacity: 0.7;">Quiz</small></th>`).join("")}
              <th style="text-align: center; background: rgba(99, 102, 241, 0.08);">SBA Raw<br><small style="opacity: 0.8;">(${l.sbaPercent}%)</small></th>
              <th style="text-align: center; background: rgba(56, 189, 248, 0.08);">Diag<br><small style="opacity: 0.8;">(${l.diagnosticPercent}%)</small></th>
              <th style="text-align: center; background: rgba(245, 158, 11, 0.08);">Exam<br><small style="opacity: 0.8;">(${l.examPercent}%)</small></th>
              <th style="text-align: center; background: rgba(16, 185, 129, 0.1);">Total Mark<br><small style="opacity: 0.8;">(100%)</small></th>
              <th style="text-align: center;">BECE Grade</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${u.length>0?u.map(m=>{let h="rank-badge--other";return m.rankNumber===1?h="rank-badge--1":m.rankNumber===2?h="rank-badge--2":m.rankNumber===3&&(h="rank-badge--3"),`
                <tr>
                  <td style="text-align: center;">
                    <span class="rank-badge ${h}">${m.rankNumber}</span>
                  </td>
                  <td><code>${At(m.student.indexNumber||`GES-B7-${m.student.id}`)}</code></td>
                  <td style="font-weight: var(--font-weight-semibold);">${At(m.student.name)}</td>
                  ${d.map(g=>{const v=m.lessonScores[g.id];return`<td style="text-align: center; color: ${v!==null?"var(--text-primary)":"var(--text-muted)"};">${v!==null?`${v}%`:"—"}</td>`}).join("")}
                  <td style="text-align: center; font-weight: bold; background: rgba(99, 102, 241, 0.04);">${m.sbaRaw}%</td>
                  <td style="text-align: center; background: rgba(56, 189, 248, 0.04);">${m.diagnosticRaw}%</td>
                  <td style="text-align: center; font-weight: bold; background: rgba(245, 158, 11, 0.04);">${m.examRaw}%</td>
                  <td style="text-align: center; font-weight: var(--font-weight-extrabold); font-size: var(--font-size-sm); color: var(--color-success-400); background: rgba(16, 185, 129, 0.06);">${m.totalPercentage}%</td>
                  <td style="text-align: center;">
                    <span class="badge badge--${m.bece.tone}">${m.bece.label} (${m.bece.letter})</span>
                  </td>
                  <td style="text-align: center;">
                    <button class="btn btn--ghost btn--xs btn-view-report-card" data-student-id="${m.student.id}">
                      Report Card
                    </button>
                  </td>
                </tr>
              `}).join(""):`
              <tr>
                <td colspan="${d.length+8}" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
                  No student records available for this class view.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

    </div>`;return Je({title:"Gradebook & Reports",subtitle:"GES-aligned terminal performance, weighting, ranking, exports, and report cards.",activePath:"/gradebook",content:p})}function cs(e){var n,r;rt(e);const t=document.getElementById("gradebook-class-select");t&&t.addEventListener("change",async o=>{Xe=o.target.value,Ss(await de(),Xe);const i=await is(),c=document.getElementById("app");c&&(c.innerHTML=i,cs(e))});const s=document.getElementById("btn-apply-weights");s&&s.addEventListener("click",async()=>{var u,p,m;const o=Number.parseInt((u=document.getElementById("weight-sba"))==null?void 0:u.value,10)||0,i=Number.parseInt((p=document.getElementById("weight-diag"))==null?void 0:p.value,10)||0,c=Number.parseInt((m=document.getElementById("weight-exam"))==null?void 0:m.value,10)||0;if(o+i+c!==100){D(`Weights must sum to 100% (currently ${o+i+c}%).`,"error");return}ht={sbaPercent:o,diagnosticPercent:i,examPercent:c},D("Gradebook weighting updated.","success");const l=await is(),d=document.getElementById("app");d&&(d.innerHTML=l,cs(e))});const a=document.getElementById("btn-export-broadsheet-csv");(n=document.getElementById("btn-print-gradebook"))==null||n.addEventListener("click",()=>window.print()),(r=document.getElementById("btn-configure-weights"))==null||r.addEventListener("click",()=>{he("Assessment weighting",`<div class="weights-form"><div class="weight-input-group"><label>SBA (Quizzes)</label><input type="number" id="modal-weight-sba" class="input" value="${ht.sbaPercent}" min="0" max="100">%</div><div class="weight-input-group"><label>Diagnostic</label><input type="number" id="modal-weight-diagnostic" class="input" value="${ht.diagnosticPercent}" min="0" max="100">%</div><div class="weight-input-group"><label>Terminal exam</label><input type="number" id="modal-weight-exam" class="input" value="${ht.examPercent}" min="0" max="100">%</div></div>`,[{label:"Cancel",variant:"btn--ghost"},{label:"Apply",variant:"btn--primary",onClick:async()=>{const o=Number(document.getElementById("modal-weight-sba").value),i=Number(document.getElementById("modal-weight-diagnostic").value),c=Number(document.getElementById("modal-weight-exam").value);if(o+i+c!==100)return D("Weights must total 100%.","error"),!1;ht={sbaPercent:o,diagnosticPercent:i,examPercent:c};const l=await is();return document.getElementById("app").innerHTML=l,cs(e),!0}}])}),a&&a.addEventListener("click",()=>{if(!Pt)return;const o=vu(Pt),i=`broadsheet_${Pt.classInfo.name.toLowerCase().replace(/[^a-z0-9]/g,"_")}.csv`;Vr(o,i),D("Broadsheet exported successfully.","success")}),document.querySelectorAll(".btn-view-report-card").forEach(o=>{o.addEventListener("click",i=>{const c=i.currentTarget.dataset.studentId;e(`/report-card/${c}`)})})}let Ya=null;function me(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}async function yu(e=null){var I;const[t,s,a,n,r,o]=await Promise.all([de(),we(),ze(),bs(),ys(),je()]);Ya=e?Number.parseInt(e,10):(I=s[0])==null?void 0:I.id;const i=s.find(f=>f.id===Ya)||s[0];if(!i)return`
      ${V({title:"Terminal Report Card",showBack:!0})}
      <div class="container view-enter" style="padding-top: var(--space-12); text-align: center;">
        <h2>No Student Learning Records Found</h2>
        <p class="text-secondary">Please add students or record quiz completions first.</p>
      </div>
    `;const c=bu(i.id,{classes:t,students:s,results:a,progress:n,diagnostics:r,submissions:o});if(!c)return`
      ${V({title:"Terminal Report Card",showBack:!0})}
      <div class="container view-enter" style="padding-top: var(--space-12); text-align: center;">
        <h2>Unable to Generate Report Card</h2>
        <p class="text-secondary">Could not assemble academic data for this learner.</p>
      </div>
    `;const{student:l,studentClass:d,studentData:u,classTotalStudents:p,classAverage:m,strands:h,attendance:g,conduct:v,headmasterRemark:b}=c;return`
    ${V({title:"Student Terminal Report",showBack:!0})}
    <div class="container view-enter report-card-page" style="padding-top: var(--space-6);">

      <!-- Top Action Bar (hidden on print) -->
      <div class="report-card-nav-bar no-print">
        <div style="display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap;">
          <label for="report-student-select" style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">Select Student:</label>
          <select id="report-student-select" class="select-class">
            ${s.map(f=>`
              <option value="${f.id}" ${f.id===l.id?"selected":""}>
                ${me(f.name)} (${me(f.indexNumber||`GES-B7-${f.id}`)})
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
              Academic Year: <strong>${me(d.academicYear||"2026/2027")}</strong> · Term: <strong>${me(d.term||"Term 1")}</strong>
            </div>
          </div>

          <!-- Student Profile Grid -->
          <div class="report-meta-grid">
            <div class="report-meta-item">
              <span class="report-meta-label">Pupil Name</span>
              <span class="report-meta-value">${me(l.name)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Student Index No.</span>
              <span class="report-meta-value">${me(l.indexNumber||`GES-B7-${l.id}`)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class & Stream</span>
              <span class="report-meta-value">${me(d.name)}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Terminal Attendance</span>
              <span class="report-meta-value">${g.daysPresent} / ${g.totalDays} Days</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class Position / Rank</span>
              <span class="report-meta-value" style="color: #4338ca;">${u.rankOrdinal} of ${p}</span>
            </div>
            <div class="report-meta-item">
              <span class="report-meta-label">Class Average Score</span>
              <span class="report-meta-value">${m}%</span>
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
              ${h.map(f=>{const y=f.score!==null?`${f.score}%`:"Pending",$=u.examRaw!==null?`${u.examRaw}%`:"Pending",w=f.score!==null?`${Math.round(f.score*.4+(u.examRaw||0)*.6)}%`:"—";return`
                  <tr>
                    <td style="text-align: center; font-weight: bold;">${f.id}</td>
                    <td>
                      <strong>${me(f.title)}</strong>
                      <div style="font-size: 10px; color: #64748b;">${me(f.strand)}</div>
                    </td>
                    <td style="text-align: center; font-weight: 600;">${y}</td>
                    <td style="text-align: center; font-weight: 600;">${$}</td>
                    <td style="text-align: center; font-weight: 700; color: #1e1b4b;">${w}</td>
                    <td style="font-size: 11px; color: #334155;">${me(f.remark)}</td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>

          <!-- Summary Score Ribbon -->
          <div class="report-summary-ribbon">
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Continuous SBA (30%)</span>
              <span class="report-summary-ribbon__value">${u.weightedSBA}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Terminal Exam (50%)</span>
              <span class="report-summary-ribbon__value">${u.weightedExam}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Overall Composite %</span>
              <span class="report-summary-ribbon__value" style="color: #15803d;">${u.totalPercentage}%</span>
            </div>
            <div class="report-summary-ribbon__item">
              <span class="report-summary-ribbon__label">Official BECE Grade</span>
              <span class="report-summary-ribbon__value" style="color: #4338ca;">
                ${u.bece.label} (${u.bece.letter})
              </span>
            </div>
          </div>

          <!-- Remarks & Recommendations -->
          <div class="report-remarks-box">
            <div class="report-remarks-title">Class Teacher's Appraisal & General Conduct</div>
            <div style="font-size: 12px; color: #1e293b; margin-bottom: 8px;">
              ${me(v)} ${me(u.bece.remark)}
            </div>
          </div>

          <div class="report-remarks-box">
            <div class="report-remarks-title">Headmaster / Principal's Terminal Remark</div>
            <div style="font-size: 12px; color: #1e293b;">
              ${me(b)}
            </div>
          </div>

          <!-- Signature Blocks -->
          <div class="report-signatures-grid">
            <div>
              <div class="report-sig-line">
                <strong>${me(d.teacherName||"Class Teacher")}</strong><br>
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
  `}function wu(e,t){ue({onBack:()=>e("/gradebook")});const s=document.getElementById("report-student-select");s&&s.addEventListener("change",r=>{e(`/report-card/${r.target.value}`)});const a=document.getElementById("btn-back-gradebook");a&&a.addEventListener("click",()=>{e("/gradebook")});const n=document.getElementById("btn-print-report-card");n&&n.addEventListener("click",()=>{window.print()})}function Iu(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ut={},Zs,Ja;function Su(){return Ja||(Ja=1,Zs=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Zs}var Xs={},Ue={},Za;function ot(){if(Za)return Ue;Za=1;let e;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return Ue.getSymbolSize=function(a){if(!a)throw new Error('"version" cannot be null or undefined');if(a<1||a>40)throw new Error('"version" should be in range from 1 to 40');return a*4+17},Ue.getSymbolTotalCodewords=function(a){return t[a]},Ue.getBCHDigit=function(s){let a=0;for(;s!==0;)a++,s>>>=1;return a},Ue.setToSJISFunction=function(a){if(typeof a!="function")throw new Error('"toSJISFunc" is not a valid function.');e=a},Ue.isKanjiModeEnabled=function(){return typeof e<"u"},Ue.toSJIS=function(a){return e(a)},Ue}var en={},Xa;function _a(){return Xa||(Xa=1,(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(s){if(typeof s!="string")throw new Error("Param is not a string");switch(s.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+s)}}e.isValid=function(a){return a&&typeof a.bit<"u"&&a.bit>=0&&a.bit<4},e.from=function(a,n){if(e.isValid(a))return a;try{return t(a)}catch{return n}}})(en)),en}var tn,er;function ku(){if(er)return tn;er=1;function e(){this.buffer=[],this.length=0}return e.prototype={get:function(t){const s=Math.floor(t/8);return(this.buffer[s]>>>7-t%8&1)===1},put:function(t,s){for(let a=0;a<s;a++)this.putBit((t>>>s-a-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const s=Math.floor(this.length/8);this.buffer.length<=s&&this.buffer.push(0),t&&(this.buffer[s]|=128>>>this.length%8),this.length++}},tn=e,tn}var sn,tr;function _u(){if(tr)return sn;tr=1;function e(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return e.prototype.set=function(t,s,a,n){const r=t*this.size+s;this.data[r]=a,n&&(this.reservedBit[r]=!0)},e.prototype.get=function(t,s){return this.data[t*this.size+s]},e.prototype.xor=function(t,s,a){this.data[t*this.size+s]^=a},e.prototype.isReserved=function(t,s){return this.reservedBit[t*this.size+s]},sn=e,sn}var nn={},sr;function $u(){return sr||(sr=1,(function(e){const t=ot().getSymbolSize;e.getRowColCoords=function(a){if(a===1)return[];const n=Math.floor(a/7)+2,r=t(a),o=r===145?26:Math.ceil((r-13)/(2*n-2))*2,i=[r-7];for(let c=1;c<n-1;c++)i[c]=i[c-1]-o;return i.push(6),i.reverse()},e.getPositions=function(a){const n=[],r=e.getRowColCoords(a),o=r.length;for(let i=0;i<o;i++)for(let c=0;c<o;c++)i===0&&c===0||i===0&&c===o-1||i===o-1&&c===0||n.push([r[i],r[c]]);return n}})(nn)),nn}var an={},nr;function Au(){if(nr)return an;nr=1;const e=ot().getSymbolSize,t=7;return an.getPositions=function(a){const n=e(a);return[[0,0],[n-t,0],[0,n-t]]},an}var rn={},ar;function Cu(){return ar||(ar=1,(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},e.from=function(n){return e.isValid(n)?parseInt(n,10):void 0},e.getPenaltyN1=function(n){const r=n.size;let o=0,i=0,c=0,l=null,d=null;for(let u=0;u<r;u++){i=c=0,l=d=null;for(let p=0;p<r;p++){let m=n.get(u,p);m===l?i++:(i>=5&&(o+=t.N1+(i-5)),l=m,i=1),m=n.get(p,u),m===d?c++:(c>=5&&(o+=t.N1+(c-5)),d=m,c=1)}i>=5&&(o+=t.N1+(i-5)),c>=5&&(o+=t.N1+(c-5))}return o},e.getPenaltyN2=function(n){const r=n.size;let o=0;for(let i=0;i<r-1;i++)for(let c=0;c<r-1;c++){const l=n.get(i,c)+n.get(i,c+1)+n.get(i+1,c)+n.get(i+1,c+1);(l===4||l===0)&&o++}return o*t.N2},e.getPenaltyN3=function(n){const r=n.size;let o=0,i=0,c=0;for(let l=0;l<r;l++){i=c=0;for(let d=0;d<r;d++)i=i<<1&2047|n.get(l,d),d>=10&&(i===1488||i===93)&&o++,c=c<<1&2047|n.get(d,l),d>=10&&(c===1488||c===93)&&o++}return o*t.N3},e.getPenaltyN4=function(n){let r=0;const o=n.data.length;for(let c=0;c<o;c++)r+=n.data[c];return Math.abs(Math.ceil(r*100/o/5)-10)*t.N4};function s(a,n,r){switch(a){case e.Patterns.PATTERN000:return(n+r)%2===0;case e.Patterns.PATTERN001:return n%2===0;case e.Patterns.PATTERN010:return r%3===0;case e.Patterns.PATTERN011:return(n+r)%3===0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2===0;case e.Patterns.PATTERN101:return n*r%2+n*r%3===0;case e.Patterns.PATTERN110:return(n*r%2+n*r%3)%2===0;case e.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2===0;default:throw new Error("bad maskPattern:"+a)}}e.applyMask=function(n,r){const o=r.size;for(let i=0;i<o;i++)for(let c=0;c<o;c++)r.isReserved(c,i)||r.xor(c,i,s(n,c,i))},e.getBestMask=function(n,r){const o=Object.keys(e.Patterns).length;let i=0,c=1/0;for(let l=0;l<o;l++){r(l),e.applyMask(l,n);const d=e.getPenaltyN1(n)+e.getPenaltyN2(n)+e.getPenaltyN3(n)+e.getPenaltyN4(n);e.applyMask(l,n),d<c&&(c=d,i=l)}return i}})(rn)),rn}var Xt={},rr;function jo(){if(rr)return Xt;rr=1;const e=_a(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],s=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return Xt.getBlocksCount=function(n,r){switch(r){case e.L:return t[(n-1)*4+0];case e.M:return t[(n-1)*4+1];case e.Q:return t[(n-1)*4+2];case e.H:return t[(n-1)*4+3];default:return}},Xt.getTotalCodewordsCount=function(n,r){switch(r){case e.L:return s[(n-1)*4+0];case e.M:return s[(n-1)*4+1];case e.Q:return s[(n-1)*4+2];case e.H:return s[(n-1)*4+3];default:return}},Xt}var on={},Ct={},or;function xu(){if(or)return Ct;or=1;const e=new Uint8Array(512),t=new Uint8Array(256);return(function(){let a=1;for(let n=0;n<255;n++)e[n]=a,t[a]=n,a<<=1,a&256&&(a^=285);for(let n=255;n<512;n++)e[n]=e[n-255]})(),Ct.log=function(a){if(a<1)throw new Error("log("+a+")");return t[a]},Ct.exp=function(a){return e[a]},Ct.mul=function(a,n){return a===0||n===0?0:e[t[a]+t[n]]},Ct}var ir;function Eu(){return ir||(ir=1,(function(e){const t=xu();e.mul=function(a,n){const r=new Uint8Array(a.length+n.length-1);for(let o=0;o<a.length;o++)for(let i=0;i<n.length;i++)r[o+i]^=t.mul(a[o],n[i]);return r},e.mod=function(a,n){let r=new Uint8Array(a);for(;r.length-n.length>=0;){const o=r[0];for(let c=0;c<n.length;c++)r[c]^=t.mul(n[c],o);let i=0;for(;i<r.length&&r[i]===0;)i++;r=r.slice(i)}return r},e.generateECPolynomial=function(a){let n=new Uint8Array([1]);for(let r=0;r<a;r++)n=e.mul(n,new Uint8Array([1,t.exp(r)]));return n}})(on)),on}var cn,cr;function Lu(){if(cr)return cn;cr=1;const e=Eu();function t(s){this.genPoly=void 0,this.degree=s,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(a){this.degree=a,this.genPoly=e.generateECPolynomial(this.degree)},t.prototype.encode=function(a){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(a.length+this.degree);n.set(a);const r=e.mod(n,this.genPoly),o=this.degree-r.length;if(o>0){const i=new Uint8Array(this.degree);return i.set(r,o),i}return r},cn=t,cn}var ln={},dn={},un={},lr;function Oo(){return lr||(lr=1,un.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),un}var Le={},dr;function Fo(){if(dr)return Le;dr=1;const e="[0-9]+",t="[A-Z $%*+\\-./:]+";let s="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";s=s.replace(/u/g,"\\u");const a="(?:(?![A-Z0-9 $%*+\\-./:]|"+s+`)(?:.|[\r
]))+`;Le.KANJI=new RegExp(s,"g"),Le.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),Le.BYTE=new RegExp(a,"g"),Le.NUMERIC=new RegExp(e,"g"),Le.ALPHANUMERIC=new RegExp(t,"g");const n=new RegExp("^"+s+"$"),r=new RegExp("^"+e+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return Le.testKanji=function(c){return n.test(c)},Le.testNumeric=function(c){return r.test(c)},Le.testAlphanumeric=function(c){return o.test(c)},Le}var ur;function it(){return ur||(ur=1,(function(e){const t=Oo(),s=Fo();e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(r,o){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!t.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?r.ccBits[0]:o<27?r.ccBits[1]:r.ccBits[2]},e.getBestModeForData=function(r){return s.testNumeric(r)?e.NUMERIC:s.testAlphanumeric(r)?e.ALPHANUMERIC:s.testKanji(r)?e.KANJI:e.BYTE},e.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},e.isValid=function(r){return r&&r.bit&&r.ccBits};function a(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+n)}}e.from=function(r,o){if(e.isValid(r))return r;try{return a(r)}catch{return o}}})(dn)),dn}var mr;function Bu(){return mr||(mr=1,(function(e){const t=ot(),s=jo(),a=_a(),n=it(),r=Oo(),o=7973,i=t.getBCHDigit(o);function c(p,m,h){for(let g=1;g<=40;g++)if(m<=e.getCapacity(g,h,p))return g}function l(p,m){return n.getCharCountIndicator(p,m)+4}function d(p,m){let h=0;return p.forEach(function(g){const v=l(g.mode,m);h+=v+g.getBitsLength()}),h}function u(p,m){for(let h=1;h<=40;h++)if(d(p,h)<=e.getCapacity(h,m,n.MIXED))return h}e.from=function(m,h){return r.isValid(m)?parseInt(m,10):h},e.getCapacity=function(m,h,g){if(!r.isValid(m))throw new Error("Invalid QR Code version");typeof g>"u"&&(g=n.BYTE);const v=t.getSymbolTotalCodewords(m),b=s.getTotalCodewordsCount(m,h),I=(v-b)*8;if(g===n.MIXED)return I;const f=I-l(g,m);switch(g){case n.NUMERIC:return Math.floor(f/10*3);case n.ALPHANUMERIC:return Math.floor(f/11*2);case n.KANJI:return Math.floor(f/13);case n.BYTE:default:return Math.floor(f/8)}},e.getBestVersionForData=function(m,h){let g;const v=a.from(h,a.M);if(Array.isArray(m)){if(m.length>1)return u(m,v);if(m.length===0)return 1;g=m[0]}else g=m;return c(g.mode,g.getLength(),v)},e.getEncodedBits=function(m){if(!r.isValid(m)||m<7)throw new Error("Invalid QR Code version");let h=m<<12;for(;t.getBCHDigit(h)-i>=0;)h^=o<<t.getBCHDigit(h)-i;return m<<12|h}})(ln)),ln}var mn={},pr;function Tu(){if(pr)return mn;pr=1;const e=ot(),t=1335,s=21522,a=e.getBCHDigit(t);return mn.getEncodedBits=function(r,o){const i=r.bit<<3|o;let c=i<<10;for(;e.getBCHDigit(c)-a>=0;)c^=t<<e.getBCHDigit(c)-a;return(i<<10|c)^s},mn}var pn={},hn,hr;function Du(){if(hr)return hn;hr=1;const e=it();function t(s){this.mode=e.NUMERIC,this.data=s.toString()}return t.getBitsLength=function(a){return 10*Math.floor(a/3)+(a%3?a%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(a){let n,r,o;for(n=0;n+3<=this.data.length;n+=3)r=this.data.substr(n,3),o=parseInt(r,10),a.put(o,10);const i=this.data.length-n;i>0&&(r=this.data.substr(n),o=parseInt(r,10),a.put(o,i*3+1))},hn=t,hn}var gn,gr;function Mu(){if(gr)return gn;gr=1;const e=it(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function s(a){this.mode=e.ALPHANUMERIC,this.data=a}return s.getBitsLength=function(n){return 11*Math.floor(n/2)+6*(n%2)},s.prototype.getLength=function(){return this.data.length},s.prototype.getBitsLength=function(){return s.getBitsLength(this.data.length)},s.prototype.write=function(n){let r;for(r=0;r+2<=this.data.length;r+=2){let o=t.indexOf(this.data[r])*45;o+=t.indexOf(this.data[r+1]),n.put(o,11)}this.data.length%2&&n.put(t.indexOf(this.data[r]),6)},gn=s,gn}var fn,fr;function qu(){if(fr)return fn;fr=1;const e=it();function t(s){this.mode=e.BYTE,typeof s=="string"?this.data=new TextEncoder().encode(s):this.data=new Uint8Array(s)}return t.getBitsLength=function(a){return a*8},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(s){for(let a=0,n=this.data.length;a<n;a++)s.put(this.data[a],8)},fn=t,fn}var vn,vr;function Nu(){if(vr)return vn;vr=1;const e=it(),t=ot();function s(a){this.mode=e.KANJI,this.data=a}return s.getBitsLength=function(n){return n*13},s.prototype.getLength=function(){return this.data.length},s.prototype.getBitsLength=function(){return s.getBitsLength(this.data.length)},s.prototype.write=function(a){let n;for(n=0;n<this.data.length;n++){let r=t.toSJIS(this.data[n]);if(r>=33088&&r<=40956)r-=33088;else if(r>=57408&&r<=60351)r-=49472;else throw new Error("Invalid SJIS character: "+this.data[n]+`
Make sure your charset is UTF-8`);r=(r>>>8&255)*192+(r&255),a.put(r,13)}},vn=s,vn}var bn={exports:{}},br;function Ru(){return br||(br=1,(function(e){var t={single_source_shortest_paths:function(s,a,n){var r={},o={};o[a]=0;var i=t.PriorityQueue.make();i.push(a,0);for(var c,l,d,u,p,m,h,g,v;!i.empty();){c=i.pop(),l=c.value,u=c.cost,p=s[l]||{};for(d in p)p.hasOwnProperty(d)&&(m=p[d],h=u+m,g=o[d],v=typeof o[d]>"u",(v||g>h)&&(o[d]=h,i.push(d,h),r[d]=l))}if(typeof n<"u"&&typeof o[n]>"u"){var b=["Could not find a path from ",a," to ",n,"."].join("");throw new Error(b)}return r},extract_shortest_path_from_predecessor_list:function(s,a){for(var n=[],r=a;r;)n.push(r),s[r],r=s[r];return n.reverse(),n},find_path:function(s,a,n){var r=t.single_source_shortest_paths(s,a,n);return t.extract_shortest_path_from_predecessor_list(r,n)},PriorityQueue:{make:function(s){var a=t.PriorityQueue,n={},r;s=s||{};for(r in a)a.hasOwnProperty(r)&&(n[r]=a[r]);return n.queue=[],n.sorter=s.sorter||a.default_sorter,n},default_sorter:function(s,a){return s.cost-a.cost},push:function(s,a){var n={value:s,cost:a};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(bn)),bn.exports}var yr;function Pu(){return yr||(yr=1,(function(e){const t=it(),s=Du(),a=Mu(),n=qu(),r=Nu(),o=Fo(),i=ot(),c=Ru();function l(b){return unescape(encodeURIComponent(b)).length}function d(b,I,f){const y=[];let $;for(;($=b.exec(f))!==null;)y.push({data:$[0],index:$.index,mode:I,length:$[0].length});return y}function u(b){const I=d(o.NUMERIC,t.NUMERIC,b),f=d(o.ALPHANUMERIC,t.ALPHANUMERIC,b);let y,$;return i.isKanjiModeEnabled()?(y=d(o.BYTE,t.BYTE,b),$=d(o.KANJI,t.KANJI,b)):(y=d(o.BYTE_KANJI,t.BYTE,b),$=[]),I.concat(f,y,$).sort(function(S,_){return S.index-_.index}).map(function(S){return{data:S.data,mode:S.mode,length:S.length}})}function p(b,I){switch(I){case t.NUMERIC:return s.getBitsLength(b);case t.ALPHANUMERIC:return a.getBitsLength(b);case t.KANJI:return r.getBitsLength(b);case t.BYTE:return n.getBitsLength(b)}}function m(b){return b.reduce(function(I,f){const y=I.length-1>=0?I[I.length-1]:null;return y&&y.mode===f.mode?(I[I.length-1].data+=f.data,I):(I.push(f),I)},[])}function h(b){const I=[];for(let f=0;f<b.length;f++){const y=b[f];switch(y.mode){case t.NUMERIC:I.push([y,{data:y.data,mode:t.ALPHANUMERIC,length:y.length},{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.ALPHANUMERIC:I.push([y,{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.KANJI:I.push([y,{data:y.data,mode:t.BYTE,length:l(y.data)}]);break;case t.BYTE:I.push([{data:y.data,mode:t.BYTE,length:l(y.data)}])}}return I}function g(b,I){const f={},y={start:{}};let $=["start"];for(let w=0;w<b.length;w++){const S=b[w],_=[];for(let k=0;k<S.length;k++){const x=S[k],A=""+w+k;_.push(A),f[A]={node:x,lastCount:0},y[A]={};for(let C=0;C<$.length;C++){const E=$[C];f[E]&&f[E].node.mode===x.mode?(y[E][A]=p(f[E].lastCount+x.length,x.mode)-p(f[E].lastCount,x.mode),f[E].lastCount+=x.length):(f[E]&&(f[E].lastCount=x.length),y[E][A]=p(x.length,x.mode)+4+t.getCharCountIndicator(x.mode,I))}}$=_}for(let w=0;w<$.length;w++)y[$[w]].end=0;return{map:y,table:f}}function v(b,I){let f;const y=t.getBestModeForData(b);if(f=t.from(I,y),f!==t.BYTE&&f.bit<y.bit)throw new Error('"'+b+'" cannot be encoded with mode '+t.toString(f)+`.
 Suggested mode is: `+t.toString(y));switch(f===t.KANJI&&!i.isKanjiModeEnabled()&&(f=t.BYTE),f){case t.NUMERIC:return new s(b);case t.ALPHANUMERIC:return new a(b);case t.KANJI:return new r(b);case t.BYTE:return new n(b)}}e.fromArray=function(I){return I.reduce(function(f,y){return typeof y=="string"?f.push(v(y,null)):y.data&&f.push(v(y.data,y.mode)),f},[])},e.fromString=function(I,f){const y=u(I,i.isKanjiModeEnabled()),$=h(y),w=g($,f),S=c.find_path(w.map,"start","end"),_=[];for(let k=1;k<S.length-1;k++)_.push(w.table[S[k]].node);return e.fromArray(m(_))},e.rawSplit=function(I){return e.fromArray(u(I,i.isKanjiModeEnabled()))}})(pn)),pn}var wr;function zu(){if(wr)return Xs;wr=1;const e=ot(),t=_a(),s=ku(),a=_u(),n=$u(),r=Au(),o=Cu(),i=jo(),c=Lu(),l=Bu(),d=Tu(),u=it(),p=Pu();function m(w,S){const _=w.size,k=r.getPositions(S);for(let x=0;x<k.length;x++){const A=k[x][0],C=k[x][1];for(let E=-1;E<=7;E++)if(!(A+E<=-1||_<=A+E))for(let L=-1;L<=7;L++)C+L<=-1||_<=C+L||(E>=0&&E<=6&&(L===0||L===6)||L>=0&&L<=6&&(E===0||E===6)||E>=2&&E<=4&&L>=2&&L<=4?w.set(A+E,C+L,!0,!0):w.set(A+E,C+L,!1,!0))}}function h(w){const S=w.size;for(let _=8;_<S-8;_++){const k=_%2===0;w.set(_,6,k,!0),w.set(6,_,k,!0)}}function g(w,S){const _=n.getPositions(S);for(let k=0;k<_.length;k++){const x=_[k][0],A=_[k][1];for(let C=-2;C<=2;C++)for(let E=-2;E<=2;E++)C===-2||C===2||E===-2||E===2||C===0&&E===0?w.set(x+C,A+E,!0,!0):w.set(x+C,A+E,!1,!0)}}function v(w,S){const _=w.size,k=l.getEncodedBits(S);let x,A,C;for(let E=0;E<18;E++)x=Math.floor(E/3),A=E%3+_-8-3,C=(k>>E&1)===1,w.set(x,A,C,!0),w.set(A,x,C,!0)}function b(w,S,_){const k=w.size,x=d.getEncodedBits(S,_);let A,C;for(A=0;A<15;A++)C=(x>>A&1)===1,A<6?w.set(A,8,C,!0):A<8?w.set(A+1,8,C,!0):w.set(k-15+A,8,C,!0),A<8?w.set(8,k-A-1,C,!0):A<9?w.set(8,15-A-1+1,C,!0):w.set(8,15-A-1,C,!0);w.set(k-8,8,1,!0)}function I(w,S){const _=w.size;let k=-1,x=_-1,A=7,C=0;for(let E=_-1;E>0;E-=2)for(E===6&&E--;;){for(let L=0;L<2;L++)if(!w.isReserved(x,E-L)){let F=!1;C<S.length&&(F=(S[C]>>>A&1)===1),w.set(x,E-L,F),A--,A===-1&&(C++,A=7)}if(x+=k,x<0||_<=x){x-=k,k=-k;break}}}function f(w,S,_){const k=new s;_.forEach(function(L){k.put(L.mode.bit,4),k.put(L.getLength(),u.getCharCountIndicator(L.mode,w)),L.write(k)});const x=e.getSymbolTotalCodewords(w),A=i.getTotalCodewordsCount(w,S),C=(x-A)*8;for(k.getLengthInBits()+4<=C&&k.put(0,4);k.getLengthInBits()%8!==0;)k.putBit(0);const E=(C-k.getLengthInBits())/8;for(let L=0;L<E;L++)k.put(L%2?17:236,8);return y(k,w,S)}function y(w,S,_){const k=e.getSymbolTotalCodewords(S),x=i.getTotalCodewordsCount(S,_),A=k-x,C=i.getBlocksCount(S,_),E=k%C,L=C-E,F=Math.floor(k/C),U=Math.floor(A/C),z=U+1,j=F-U,Y=new c(j);let qe=0;const ee=new Array(C),Ie=new Array(C);let te=0;const ce=new Uint8Array(w.buffer);for(let ke=0;ke<C;ke++){const Oe=ke<L?U:z;ee[ke]=ce.slice(qe,qe+Oe),Ie[ke]=Y.encode(ee[ke]),qe+=Oe,te=Math.max(te,Oe)}const Q=new Uint8Array(k);let ge=0,re,oe;for(re=0;re<te;re++)for(oe=0;oe<C;oe++)re<ee[oe].length&&(Q[ge++]=ee[oe][re]);for(re=0;re<j;re++)for(oe=0;oe<C;oe++)Q[ge++]=Ie[oe][re];return Q}function $(w,S,_,k){let x;if(Array.isArray(w))x=p.fromArray(w);else if(typeof w=="string"){let F=S;if(!F){const U=p.rawSplit(w);F=l.getBestVersionForData(U,_)}x=p.fromString(w,F||40)}else throw new Error("Invalid data");const A=l.getBestVersionForData(x,_);if(!A)throw new Error("The amount of data is too big to be stored in a QR Code");if(!S)S=A;else if(S<A)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+A+`.
`);const C=f(S,_,x),E=e.getSymbolSize(S),L=new a(E);return m(L,S),h(L),g(L,S),b(L,_,0),S>=7&&v(L,S),I(L,C),isNaN(k)&&(k=o.getBestMask(L,b.bind(null,L,_))),o.applyMask(k,L),b(L,_,k),{modules:L,version:S,errorCorrectionLevel:_,maskPattern:k,segments:x}}return Xs.create=function(S,_){if(typeof S>"u"||S==="")throw new Error("No input text");let k=t.M,x,A;return typeof _<"u"&&(k=t.from(_.errorCorrectionLevel,t.M),x=l.from(_.version),A=o.from(_.maskPattern),_.toSJISFunc&&e.setToSJISFunction(_.toSJISFunc)),$(S,x,k,A)},Xs}var yn={},wn={},Ir;function Uo(){return Ir||(Ir=1,(function(e){function t(s){if(typeof s=="number"&&(s=s.toString()),typeof s!="string")throw new Error("Color should be defined as hex string");let a=s.slice().replace("#","").split("");if(a.length<3||a.length===5||a.length>8)throw new Error("Invalid hex color: "+s);(a.length===3||a.length===4)&&(a=Array.prototype.concat.apply([],a.map(function(r){return[r,r]}))),a.length===6&&a.push("F","F");const n=parseInt(a.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+a.slice(0,6).join("")}}e.getOptions=function(a){a||(a={}),a.color||(a.color={});const n=typeof a.margin>"u"||a.margin===null||a.margin<0?4:a.margin,r=a.width&&a.width>=21?a.width:void 0,o=a.scale||4;return{width:r,scale:r?4:o,margin:n,color:{dark:t(a.color.dark||"#000000ff"),light:t(a.color.light||"#ffffffff")},type:a.type,rendererOpts:a.rendererOpts||{}}},e.getScale=function(a,n){return n.width&&n.width>=a+n.margin*2?n.width/(a+n.margin*2):n.scale},e.getImageWidth=function(a,n){const r=e.getScale(a,n);return Math.floor((a+n.margin*2)*r)},e.qrToImageData=function(a,n,r){const o=n.modules.size,i=n.modules.data,c=e.getScale(o,r),l=Math.floor((o+r.margin*2)*c),d=r.margin*c,u=[r.color.light,r.color.dark];for(let p=0;p<l;p++)for(let m=0;m<l;m++){let h=(p*l+m)*4,g=r.color.light;if(p>=d&&m>=d&&p<l-d&&m<l-d){const v=Math.floor((p-d)/c),b=Math.floor((m-d)/c);g=u[i[v*o+b]?1:0]}a[h++]=g.r,a[h++]=g.g,a[h++]=g.b,a[h]=g.a}}})(wn)),wn}var Sr;function ju(){return Sr||(Sr=1,(function(e){const t=Uo();function s(n,r,o){n.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=o,r.width=o,r.style.height=o+"px",r.style.width=o+"px"}function a(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(r,o,i){let c=i,l=o;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),o||(l=a()),c=t.getOptions(c);const d=t.getImageWidth(r.modules.size,c),u=l.getContext("2d"),p=u.createImageData(d,d);return t.qrToImageData(p.data,r,c),s(u,l,d),u.putImageData(p,0,0),l},e.renderToDataURL=function(r,o,i){let c=i;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),c||(c={});const l=e.render(r,o,c),d=c.type||"image/png",u=c.rendererOpts||{};return l.toDataURL(d,u.quality)}})(yn)),yn}var In={},kr;function Ou(){if(kr)return In;kr=1;const e=Uo();function t(n,r){const o=n.a/255,i=r+'="'+n.hex+'"';return o<1?i+" "+r+'-opacity="'+o.toFixed(2).slice(1)+'"':i}function s(n,r,o){let i=n+r;return typeof o<"u"&&(i+=" "+o),i}function a(n,r,o){let i="",c=0,l=!1,d=0;for(let u=0;u<n.length;u++){const p=Math.floor(u%r),m=Math.floor(u/r);!p&&!l&&(l=!0),n[u]?(d++,u>0&&p>0&&n[u-1]||(i+=l?s("M",p+o,.5+m+o):s("m",c,0),c=0,l=!1),p+1<r&&n[u+1]||(i+=s("h",d),d=0)):c++}return i}return In.render=function(r,o,i){const c=e.getOptions(o),l=r.modules.size,d=r.modules.data,u=l+c.margin*2,p=c.color.light.a?"<path "+t(c.color.light,"fill")+' d="M0 0h'+u+"v"+u+'H0z"/>':"",m="<path "+t(c.color.dark,"stroke")+' d="'+a(d,l,c.margin)+'"/>',h='viewBox="0 0 '+u+" "+u+'"',v='<svg xmlns="http://www.w3.org/2000/svg" '+(c.width?'width="'+c.width+'" height="'+c.width+'" ':"")+h+' shape-rendering="crispEdges">'+p+m+`</svg>
`;return typeof i=="function"&&i(null,v),v},In}var _r;function Fu(){if(_r)return ut;_r=1;const e=Su(),t=zu(),s=ju(),a=Ou();function n(r,o,i,c,l){const d=[].slice.call(arguments,1),u=d.length,p=typeof d[u-1]=="function";if(!p&&!e())throw new Error("Callback required as last argument");if(p){if(u<2)throw new Error("Too few arguments provided");u===2?(l=i,i=o,o=c=void 0):u===3&&(o.getContext&&typeof l>"u"?(l=c,c=void 0):(l=c,c=i,i=o,o=void 0))}else{if(u<1)throw new Error("Too few arguments provided");return u===1?(i=o,o=c=void 0):u===2&&!o.getContext&&(c=i,i=o,o=void 0),new Promise(function(m,h){try{const g=t.create(i,c);m(r(g,o,c))}catch(g){h(g)}})}try{const m=t.create(i,c);l(null,r(m,o,c))}catch(m){l(m)}}return ut.create=t.create,ut.toCanvas=n.bind(null,s.render),ut.toDataURL=n.bind(null,s.renderToDataURL),ut.toString=n.bind(null,function(r,o,i){return a.render(r,i)}),ut}var Uu=Fu();const Qu=Iu(Uu),Wt=new Map;let Tt=null,Gn="";async function Qo(){const e=Ye();Gn=e?await Qu.toDataURL(ba(e),{width:176,margin:1,errorCorrectionLevel:"M"}):"";const t=document.getElementById("lab-join-qr");t&&(t.src=Gn)}function es(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Ho(){const e=Ye(),t=[...Wt.values()].sort((s,a)=>String(s.studentName||s.clientId).localeCompare(String(a.studentName||a.clientId)));return`
    <div class="container view-enter lab-monitor-page">
      <section class="card card--glass lab-monitor-hero">
        <div><div class="assessment-hero__eyebrow">Exam Control</div><h1 class="assessment-hero__title">Live classroom monitor</h1><p class="assessment-hero__text">Keep this teacher tab open while students work. Status is relayed only across the local Vite lab host.</p></div>
        <div class="lab-monitor-actions"><button class="btn btn--secondary" id="lab-new-room">${e?"New lab session":"Start lab session"}</button><button class="btn btn--primary" id="lab-unlock">Unlock assessment</button><button class="btn btn--warning" id="lab-lock">Lock all screens</button><button class="btn btn--danger" id="lab-submit">Force submit all</button></div>
        ${e?`<img id="lab-join-qr" class="lab-join__qr" src="${Gn}" alt="QR code for the student join link">`:""}
        ${e?`<div class="lab-join"><strong>Student link:</strong> <code>${es(ba(e))}</code><button class="btn btn--ghost btn--sm" id="lab-copy-link">Copy</button><span>Open this link on each PC (or turn it into a QR code using the browser’s Share menu).</span></div>`:""}
      </section>
      <div class="lab-monitor-summary"><span>${t.length} active PC${t.length===1?"":"s"}</span><span class="badge badge--danger" id="lab-alert-count">${t.filter(s=>s.alert).length} proctor alert${t.filter(s=>s.alert).length===1?"":"s"}</span></div>
      <section class="lab-monitor-grid">${t.length?t.map(s=>`<article class="card lab-student-card ${s.alert?"lab-student-card--alert":""}"><div class="lab-student-card__head"><strong>${es(s.studentName||s.clientId||"Student PC")}</strong><span class="badge badge--${s.alert?"danger":s.status==="Completed"?"success":"primary"}">${es(s.status||"Connected")}</span></div><p>${es(s.detail||"Waiting for activity")}</p><small>Last seen ${new Date(s.sentAt||Date.now()).toLocaleTimeString()}</small>${s.alert?'<div class="lab-alert">Fullscreen exit or hidden tab detected</div>':""}</article>`).join(""):'<div class="card insight-empty">No student PCs have reported yet. Share the student link above and keep this page open.</div>'}</section>
    </div>`}function Go(){const e=document.getElementById("lab-monitor-root");e&&(e.innerHTML=Ho()),Wo(),Qo()}function Wo(){var e,t,s,a,n;(e=document.getElementById("lab-new-room"))==null||e.addEventListener("click",()=>{sl(),Wt.clear(),Go()}),(t=document.getElementById("lab-unlock"))==null||t.addEventListener("click",()=>Us()),(s=document.getElementById("lab-lock"))==null||s.addEventListener("click",()=>Us()),(a=document.getElementById("lab-submit"))==null||a.addEventListener("click",()=>Us()),(n=document.getElementById("lab-copy-link"))==null||n.addEventListener("click",async()=>{var r;await((r=navigator.clipboard)==null?void 0:r.writeText(ba()))})}function Hu(){return Je({title:"Lab monitor",subtitle:"Live operational monitoring without grade or answer-key access.",activePath:"/lab-monitor",content:`<div id="lab-monitor-root">${Ho()}</div>`})}function Gu(e){rt(e),Tt=po(async t=>{var a,n;if(t.type==="submission"&&((a=t.submission)!=null&&a.remoteSubmissionId)){if(!(await je()).some(o=>o.remoteSubmissionId===t.submission.remoteSubmissionId)){const{id:o,...i}=t.submission;await ca(i),await pe("lab.submission_received",{studentId:t.studentId,assessmentId:i.assessmentId,transport:"lan"})}return}if(t.type==="quiz-result"&&((n=t.result)!=null&&n.remoteResultId)){if(!(await ze()).some(o=>o.remoteResultId===t.result.remoteResultId)){const{id:o,...i}=t.result;await ia(i),await pe("lab.quiz_received",{studentId:t.studentId,lessonId:i.lessonId,transport:"lan"})}return}if(t.type!=="status")return;const s=t.clientId||t.studentId||t.studentName||Wu();Wt.set(s,t),Go()}),Wo(),Qo()}function Wu(){return`pc-${Wt.size+1}`}function Vu(){Tt==null||Tt(),Tt=null,Wt.clear()}var W=Uint8Array,ye=Uint16Array,$a=Int32Array,qs=new W([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Ns=new W([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Wn=new W([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Vo=function(e,t){for(var s=new ye(31),a=0;a<31;++a)s[a]=t+=1<<e[a-1];for(var n=new $a(s[30]),a=1;a<30;++a)for(var r=s[a];r<s[a+1];++r)n[r]=r-s[a]<<5|a;return{b:s,r:n}},Ko=Vo(qs,2),Yo=Ko.b,Vn=Ko.r;Yo[28]=258,Vn[258]=28;var Jo=Vo(Ns,0),Ku=Jo.b,$r=Jo.r,Kn=new ye(32768);for(var H=0;H<32768;++H){var Qe=(H&43690)>>1|(H&21845)<<1;Qe=(Qe&52428)>>2|(Qe&13107)<<2,Qe=(Qe&61680)>>4|(Qe&3855)<<4,Kn[H]=((Qe&65280)>>8|(Qe&255)<<8)>>1}var De=(function(e,t,s){for(var a=e.length,n=0,r=new ye(t);n<a;++n)e[n]&&++r[e[n]-1];var o=new ye(t);for(n=1;n<t;++n)o[n]=o[n-1]+r[n-1]<<1;var i;if(s){i=new ye(1<<t);var c=15-t;for(n=0;n<a;++n)if(e[n])for(var l=n<<4|e[n],d=t-e[n],u=o[e[n]-1]++<<d,p=u|(1<<d)-1;u<=p;++u)i[Kn[u]>>c]=l}else for(i=new ye(a),n=0;n<a;++n)e[n]&&(i[n]=Kn[o[e[n]-1]++]>>15-e[n]);return i}),Ke=new W(288);for(var H=0;H<144;++H)Ke[H]=8;for(var H=144;H<256;++H)Ke[H]=9;for(var H=256;H<280;++H)Ke[H]=7;for(var H=280;H<288;++H)Ke[H]=8;var Ut=new W(32);for(var H=0;H<32;++H)Ut[H]=5;var Yu=De(Ke,9,0),Ju=De(Ke,9,1),Zu=De(Ut,5,0),Xu=De(Ut,5,1),Sn=function(e){for(var t=e[0],s=1;s<e.length;++s)e[s]>t&&(t=e[s]);return t},_e=function(e,t,s){var a=t/8|0;return(e[a]|e[a+1]<<8)>>(t&7)&s},kn=function(e,t){var s=t/8|0;return(e[s]|e[s+1]<<8|e[s+2]<<16)>>(t&7)},Aa=function(e){return(e+7)/8|0},Vt=function(e,t,s){return(t==null||t<0)&&(t=0),(s==null||s>e.length)&&(s=e.length),new W(e.subarray(t,s))},em=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],le=function(e,t,s){var a=new Error(t||em[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,le),!s)throw a;return a},tm=function(e,t,s,a){var n=e.length,r=a?a.length:0;if(!n||t.f&&!t.l)return s||new W(0);var o=!s,i=o||t.i!=2,c=t.i;o&&(s=new W(n*3));var l=function(It){var St=s.length;if(It>St){var ct=new W(Math.max(St*2,It));ct.set(s),s=ct}},d=t.f||0,u=t.p||0,p=t.b||0,m=t.l,h=t.d,g=t.m,v=t.n,b=n*8;do{if(!m){d=_e(e,u,1);var I=_e(e,u+1,3);if(u+=3,I)if(I==1)m=Ju,h=Xu,g=9,v=5;else if(I==2){var w=_e(e,u,31)+257,S=_e(e,u+10,15)+4,_=w+_e(e,u+5,31)+1;u+=14;for(var k=new W(_),x=new W(19),A=0;A<S;++A)x[Wn[A]]=_e(e,u+A*3,7);u+=S*3;for(var C=Sn(x),E=(1<<C)-1,L=De(x,C,1),A=0;A<_;){var F=L[_e(e,u,E)];u+=F&15;var f=F>>4;if(f<16)k[A++]=f;else{var U=0,z=0;for(f==16?(z=3+_e(e,u,3),u+=2,U=k[A-1]):f==17?(z=3+_e(e,u,7),u+=3):f==18&&(z=11+_e(e,u,127),u+=7);z--;)k[A++]=U}}var j=k.subarray(0,w),Y=k.subarray(w);g=Sn(j),v=Sn(Y),m=De(j,g,1),h=De(Y,v,1)}else le(1);else{var f=Aa(u)+4,y=e[f-4]|e[f-3]<<8,$=f+y;if($>n){c&&le(0);break}i&&l(p+y),s.set(e.subarray(f,$),p),t.b=p+=y,t.p=u=$*8,t.f=d;continue}if(u>b){c&&le(0);break}}i&&l(p+131072);for(var qe=(1<<g)-1,ee=(1<<v)-1,Ie=u;;Ie=u){var U=m[kn(e,u)&qe],te=U>>4;if(u+=U&15,u>b){c&&le(0);break}if(U||le(2),te<256)s[p++]=te;else if(te==256){Ie=u,m=null;break}else{var ce=te-254;if(te>264){var A=te-257,Q=qs[A];ce=_e(e,u,(1<<Q)-1)+Yo[A],u+=Q}var ge=h[kn(e,u)&ee],re=ge>>4;ge||le(3),u+=ge&15;var Y=Ku[re];if(re>3){var Q=Ns[re];Y+=kn(e,u)&(1<<Q)-1,u+=Q}if(u>b){c&&le(0);break}i&&l(p+131072);var oe=p+ce;if(p<Y){var ke=r-Y,Oe=Math.min(Y,oe);for(ke+p<0&&le(3);p<Oe;++p)s[p]=a[ke+p]}for(;p<oe;++p)s[p]=s[p-Y]}}t.l=m,t.p=Ie,t.b=p,t.f=d,m&&(d=1,t.m=g,t.d=h,t.n=v)}while(!d);return p!=s.length&&o?Vt(s,0,p):s.subarray(0,p)},Ne=function(e,t,s){s<<=t&7;var a=t/8|0;e[a]|=s,e[a+1]|=s>>8},xt=function(e,t,s){s<<=t&7;var a=t/8|0;e[a]|=s,e[a+1]|=s>>8,e[a+2]|=s>>16},_n=function(e,t){for(var s=[],a=0;a<e.length;++a)e[a]&&s.push({s:a,f:e[a]});var n=s.length,r=s.slice();if(!n)return{t:Xo,l:0};if(n==1){var o=new W(s[0].s+1);return o[s[0].s]=1,{t:o,l:1}}s.sort(function($,w){return $.f-w.f}),s.push({s:-1,f:25001});var i=s[0],c=s[1],l=0,d=1,u=2;for(s[0]={s:-1,f:i.f+c.f,l:i,r:c};d!=n-1;)i=s[s[l].f<s[u].f?l++:u++],c=s[l!=d&&s[l].f<s[u].f?l++:u++],s[d++]={s:-1,f:i.f+c.f,l:i,r:c};for(var p=r[0].s,a=1;a<n;++a)r[a].s>p&&(p=r[a].s);var m=new ye(p+1),h=Yn(s[d-1],m,0);if(h>t){var a=0,g=0,v=h-t,b=1<<v;for(r.sort(function(w,S){return m[S.s]-m[w.s]||w.f-S.f});a<n;++a){var I=r[a].s;if(m[I]>t)g+=b-(1<<h-m[I]),m[I]=t;else break}for(g>>=v;g>0;){var f=r[a].s;m[f]<t?g-=1<<t-m[f]++-1:++a}for(;a>=0&&g;--a){var y=r[a].s;m[y]==t&&(--m[y],++g)}h=t}return{t:new W(m),l:h}},Yn=function(e,t,s){return e.s==-1?Math.max(Yn(e.l,t,s+1),Yn(e.r,t,s+1)):t[e.s]=s},Ar=function(e){for(var t=e.length;t&&!e[--t];);for(var s=new ye(++t),a=0,n=e[0],r=1,o=function(c){s[a++]=c},i=1;i<=t;++i)if(e[i]==n&&i!=t)++r;else{if(!n&&r>2){for(;r>138;r-=138)o(32754);r>2&&(o(r>10?r-11<<5|28690:r-3<<5|12305),r=0)}else if(r>3){for(o(n),--r;r>6;r-=6)o(8304);r>2&&(o(r-3<<5|8208),r=0)}for(;r--;)o(n);r=1,n=e[i]}return{c:s.subarray(0,a),n:t}},Et=function(e,t){for(var s=0,a=0;a<t.length;++a)s+=e[a]*t[a];return s},Zo=function(e,t,s){var a=s.length,n=Aa(t+2);e[n]=a&255,e[n+1]=a>>8,e[n+2]=e[n]^255,e[n+3]=e[n+1]^255;for(var r=0;r<a;++r)e[n+r+4]=s[r];return(n+4+a)*8},Cr=function(e,t,s,a,n,r,o,i,c,l,d){Ne(t,d++,s),++n[256];for(var u=_n(n,15),p=u.t,m=u.l,h=_n(r,15),g=h.t,v=h.l,b=Ar(p),I=b.c,f=b.n,y=Ar(g),$=y.c,w=y.n,S=new ye(19),_=0;_<I.length;++_)++S[I[_]&31];for(var _=0;_<$.length;++_)++S[$[_]&31];for(var k=_n(S,7),x=k.t,A=k.l,C=19;C>4&&!x[Wn[C-1]];--C);var E=l+5<<3,L=Et(n,Ke)+Et(r,Ut)+o,F=Et(n,p)+Et(r,g)+o+14+3*C+Et(S,x)+2*S[16]+3*S[17]+7*S[18];if(c>=0&&E<=L&&E<=F)return Zo(t,d,e.subarray(c,c+l));var U,z,j,Y;if(Ne(t,d,1+(F<L)),d+=2,F<L){U=De(p,m,0),z=p,j=De(g,v,0),Y=g;var qe=De(x,A,0);Ne(t,d,f-257),Ne(t,d+5,w-1),Ne(t,d+10,C-4),d+=14;for(var _=0;_<C;++_)Ne(t,d+3*_,x[Wn[_]]);d+=3*C;for(var ee=[I,$],Ie=0;Ie<2;++Ie)for(var te=ee[Ie],_=0;_<te.length;++_){var ce=te[_]&31;Ne(t,d,qe[ce]),d+=x[ce],ce>15&&(Ne(t,d,te[_]>>5&127),d+=te[_]>>12)}}else U=Yu,z=Ke,j=Zu,Y=Ut;for(var _=0;_<i;++_){var Q=a[_];if(Q>255){var ce=Q>>18&31;xt(t,d,U[ce+257]),d+=z[ce+257],ce>7&&(Ne(t,d,Q>>23&31),d+=qs[ce]);var ge=Q&31;xt(t,d,j[ge]),d+=Y[ge],ge>3&&(xt(t,d,Q>>5&8191),d+=Ns[ge])}else xt(t,d,U[Q]),d+=z[Q]}return xt(t,d,U[256]),d+z[256]},sm=new $a([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Xo=new W(0),nm=function(e,t,s,a,n,r){var o=r.z||e.length,i=new W(a+o+5*(1+Math.ceil(o/7e3))+n),c=i.subarray(a,i.length-n),l=r.l,d=(r.r||0)&7;if(t){d&&(c[0]=r.r>>3);for(var u=sm[t-1],p=u>>13,m=u&8191,h=(1<<s)-1,g=r.p||new ye(32768),v=r.h||new ye(h+1),b=Math.ceil(s/3),I=2*b,f=function(Rs){return(e[Rs]^e[Rs+1]<<b^e[Rs+2]<<I)&h},y=new $a(25e3),$=new ye(288),w=new ye(32),S=0,_=0,k=r.i||0,x=0,A=r.w||0,C=0;k+2<o;++k){var E=f(k),L=k&32767,F=v[E];if(g[L]=F,v[E]=L,A<=k){var U=o-k;if((S>7e3||x>24576)&&(U>423||!l)){d=Cr(e,c,0,y,$,w,_,x,C,k-C,d),x=S=_=0,C=k;for(var z=0;z<286;++z)$[z]=0;for(var z=0;z<30;++z)w[z]=0}var j=2,Y=0,qe=m,ee=L-F&32767;if(U>2&&E==f(k-ee))for(var Ie=Math.min(p,U)-1,te=Math.min(32767,k),ce=Math.min(258,U);ee<=te&&--qe&&L!=F;){if(e[k+j]==e[k+j-ee]){for(var Q=0;Q<ce&&e[k+Q]==e[k+Q-ee];++Q);if(Q>j){if(j=Q,Y=ee,Q>Ie)break;for(var ge=Math.min(ee,Q-2),re=0,z=0;z<ge;++z){var oe=k-ee+z&32767,ke=g[oe],Oe=oe-ke&32767;Oe>re&&(re=Oe,F=oe)}}}L=F,F=g[L],ee+=L-F&32767}if(Y){y[x++]=268435456|Vn[j]<<18|$r[Y];var It=Vn[j]&31,St=$r[Y]&31;_+=qs[It]+Ns[St],++$[257+It],++w[St],A=k+j,++S}else y[x++]=e[k],++$[e[k]]}}for(k=Math.max(k,A);k<o;++k)y[x++]=e[k],++$[e[k]];d=Cr(e,c,l,y,$,w,_,x,C,k-C,d),l||(r.r=d&7|c[d/8|0]<<3,d-=7,r.h=v,r.p=g,r.i=k,r.w=A)}else{for(var k=r.w||0;k<o+l;k+=65535){var ct=k+65535;ct>=o&&(c[d/8|0]=l,ct=o),d=Zo(c,d+1,e.subarray(k,ct))}r.i=o}return Vt(i,0,a+Aa(d)+n)},am=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var s=t,a=9;--a;)s=(s&1&&-306674912)^s>>>1;e[t]=s}return e})(),rm=function(){var e=-1;return{p:function(t){for(var s=e,a=0;a<t.length;++a)s=am[s&255^t[a]]^s>>>8;e=s},d:function(){return~e}}},om=function(e,t,s,a,n){if(!n&&(n={l:1},t.dictionary)){var r=t.dictionary.subarray(-32768),o=new W(r.length+e.length);o.set(r),o.set(e,r.length),e=o,n.w=r.length}return nm(e,t.level==null?6:t.level,t.mem==null?n.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,s,a,n)},ei=function(e,t){var s={};for(var a in e)s[a]=e[a];for(var a in t)s[a]=t[a];return s},Te=function(e,t){return e[t]|e[t+1]<<8},Ce=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},$n=function(e,t){return Ce(e,t)+Ce(e,t+4)*4294967296},se=function(e,t,s){for(;s;++t)e[t]=s,s>>>=8};function im(e,t){return om(e,t||{},0,0)}function cm(e,t){return tm(e,{i:2},t&&t.out,t&&t.dictionary)}var ti=function(e,t,s,a){for(var n in e){var r=e[n],o=t+n,i=a;Array.isArray(r)&&(i=ei(a,r[1]),r=r[0]),r instanceof W?s[o]=[r,i]:(s[o+="/"]=[new W(0),i],ti(r,o,s,a))}},xr=typeof TextEncoder<"u"&&new TextEncoder,Jn=typeof TextDecoder<"u"&&new TextDecoder,lm=0;try{Jn.decode(Xo,{stream:!0}),lm=1}catch{}var dm=function(e){for(var t="",s=0;;){var a=e[s++],n=(a>127)+(a>223)+(a>239);if(s+n>e.length)return{s:t,r:Vt(e,s-1)};n?n==3?(a=((a&15)<<18|(e[s++]&63)<<12|(e[s++]&63)<<6|e[s++]&63)-65536,t+=String.fromCharCode(55296|a>>10,56320|a&1023)):n&1?t+=String.fromCharCode((a&31)<<6|e[s++]&63):t+=String.fromCharCode((a&15)<<12|(e[s++]&63)<<6|e[s++]&63):t+=String.fromCharCode(a)}};function Zn(e,t){var s;if(xr)return xr.encode(e);for(var a=e.length,n=new W(e.length+(e.length>>1)),r=0,o=function(l){n[r++]=l},s=0;s<a;++s){if(r+5>n.length){var i=new W(r+8+(a-s<<1));i.set(n),n=i}var c=e.charCodeAt(s);c<128||t?o(c):c<2048?(o(192|c>>6),o(128|c&63)):c>55295&&c<57344?(c=65536+(c&1047552)|e.charCodeAt(++s)&1023,o(240|c>>18),o(128|c>>12&63),o(128|c>>6&63),o(128|c&63)):(o(224|c>>12),o(128|c>>6&63),o(128|c&63))}return Vt(n,0,r)}function Xn(e,t){if(t){for(var s="",a=0;a<e.length;a+=16384)s+=String.fromCharCode.apply(null,e.subarray(a,a+16384));return s}else{if(Jn)return Jn.decode(e);var n=dm(e),r=n.s,s=n.r;return s.length&&le(8),r}}var um=function(e,t){return t+30+Te(e,t+26)+Te(e,t+28)},mm=function(e,t,s){var a=Te(e,t+28),n=Xn(e.subarray(t+46,t+46+a),!(Te(e,t+8)&2048)),r=t+46+a,o=Ce(e,t+20),i=s&&o==4294967295?pm(e,r):[o,Ce(e,t+24),Ce(e,t+42)],c=i[0],l=i[1],d=i[2];return[Te(e,t+10),c,l,n,r+Te(e,t+30)+Te(e,t+32),d]},pm=function(e,t){for(;Te(e,t)!=1;t+=4+Te(e,t+2));return[$n(e,t+12),$n(e,t+4),$n(e,t+20)]},ea=function(e){var t=0;if(e)for(var s in e){var a=e[s].length;a>65535&&le(9),t+=a+4}return t},Er=function(e,t,s,a,n,r,o,i){var c=a.length,l=s.extra,d=i&&i.length,u=ea(l);se(e,t,o!=null?33639248:67324752),t+=4,o!=null&&(e[t++]=20,e[t++]=s.os),e[t]=20,t+=2,e[t++]=s.flag<<1|(r<0&&8),e[t++]=n&&8,e[t++]=s.compression&255,e[t++]=s.compression>>8;var p=new Date(s.mtime==null?Date.now():s.mtime),m=p.getFullYear()-1980;if((m<0||m>119)&&le(10),se(e,t,m<<25|p.getMonth()+1<<21|p.getDate()<<16|p.getHours()<<11|p.getMinutes()<<5|p.getSeconds()>>1),t+=4,r!=-1&&(se(e,t,s.crc),se(e,t+4,r<0?-r-2:r),se(e,t+8,s.size)),se(e,t+12,c),se(e,t+14,u),t+=16,o!=null&&(se(e,t,d),se(e,t+6,s.attrs),se(e,t+10,o),t+=14),e.set(a,t),t+=c,u)for(var h in l){var g=l[h],v=g.length;se(e,t,+h),se(e,t+2,v),e.set(g,t+4),t+=4+v}return d&&(e.set(i,t),t+=d),t},hm=function(e,t,s,a,n){se(e,t,101010256),se(e,t+8,s),se(e,t+10,s),se(e,t+12,a),se(e,t+16,n)};function gm(e,t){t||(t={});var s={},a=[];ti(e,"",s,t);var n=0,r=0;for(var o in s){var i=s[o],c=i[0],l=i[1],d=l.level==0?0:8,u=Zn(o),p=u.length,m=l.comment,h=m&&Zn(m),g=h&&h.length,v=ea(l.extra);p>65535&&le(11);var b=d?im(c,l):c,I=b.length,f=rm();f.p(c),a.push(ei(l,{size:c.length,crc:f.d(),c:b,f:u,m:h,u:p!=o.length||h&&m.length!=g,o:n,compression:d})),n+=30+p+v+I,r+=76+2*(p+v)+(g||0)+I}for(var y=new W(r+22),$=n,w=r-n,S=0;S<a.length;++S){var u=a[S];Er(y,u.o,u,u.f,u.u,u.c.length);var _=30+u.f.length+ea(u.extra);y.set(u.c,u.o+_),Er(y,n,u,u.f,u.u,u.c.length,u.o,u.m),n+=16+_+(u.m?u.m.length:0)}return hm(y,n,a.length,w,$),y}function fm(e,t){for(var s={},a=e.length-22;Ce(e,a)!=101010256;--a)(!a||e.length-a>65558)&&le(13);var n=Te(e,a+8);if(!n)return{};var r=Ce(e,a+16),o=r==4294967295||n==65535;if(o){var i=Ce(e,a-12);o=Ce(e,i)==101075792,o&&(n=Ce(e,i+32),r=Ce(e,i+48))}for(var c=0;c<n;++c){var l=mm(e,r,o),d=l[0],u=l[1],p=l[2],m=l[3],h=l[4],g=l[5],v=um(e,g);r=h,d?d==8?s[m]=cm(e.subarray(v,v+u),{out:new W(p)}):le(14,"unknown compression type "+d):s[m]=Vt(e,v,v+u)}return s}const ta="classconnect-pack.json";function vm(e){const t={...e,version:Math.max(2,Number(e.version)||1),format:"zip"};return new Blob([gm({[ta]:Zn(JSON.stringify(t,null,2))},{level:6})],{type:"application/zip"})}async function bm(e){const t=new Uint8Array(await e.arrayBuffer());if(!(t[0]===80&&t[1]===75))return JSON.parse(Xn(t));const a=fm(t);if(!a[ta])throw new Error("This archive does not contain a ClassConnect lesson pack.");return JSON.parse(Xn(a[ta]))}const ts=(e="")=>String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"),ym=2*1024*1024,wm=[{value:"",label:"No illustration"},{value:"/images/lesson-1-computer-types.png",label:"Computer types"},{value:"/images/lesson-2-inside-computer.png",label:"Inside a computer"},{value:"/images/lesson-3-input-devices.png",label:"Input devices"},{value:"/images/lesson-4-output-devices.png",label:"Output devices"},{value:"/images/lesson-5-storage-devices.png",label:"Storage devices"}];function Im(e){const t=URL.createObjectURL(e),s=document.createElement("a");s.href=t,s.download=`classconnect-${new Date().toISOString().slice(0,10)}.ccpack`,s.click(),URL.revokeObjectURL(t)}function Sm(e){return new Promise((t,s)=>{const a=new FileReader;a.onerror=()=>s(new Error("The illustration could not be read.")),a.onload=()=>t(a.result),a.readAsDataURL(e)})}async function km(){const e=await _s(),t=`<main class="container container--narrow view-enter cms-page">
      <div class="card">
        <h1 class="card__title">Create a custom lesson</h1>
        <p class="card__subtitle">Lessons are stored locally and shared as portable ClassConnect lesson packs.</p>
        <div class="cms-actions"><button class="btn btn--secondary btn--sm" id="btn-export-pack">Export .ccpack</button><label class="btn btn--ghost btn--sm">Import .ccpack<input id="cms-import-pack" type="file" accept=".ccpack,application/json" hidden></label></div>
        <form id="lesson-editor-form" class="cms-form">
          <input class="input" id="cms-title" required placeholder="Lesson title">
          <div class="cms-grid"><input class="input" id="cms-strand" placeholder="Strand (e.g. Networks)"><input class="input" id="cms-subject" placeholder="Subject (e.g. Computing)"></div>
          <textarea class="input" id="cms-objectives" rows="3" placeholder="Objectives, one per line"></textarea>
          <textarea class="input" id="cms-terms" rows="3" placeholder="Key terms: term - definition, one per line"></textarea>
          <textarea class="input" id="cms-body" rows="12" required placeholder="Lesson body (Markdown or safe HTML)"></textarea>
          <fieldset class="cms-illustration">
            <legend>Lesson illustration <span>optional</span></legend>
            <p class="cms-illustration__help">Select a curriculum visual or upload a classroom image (PNG, JPEG, WebP, or GIF; up to 2 MB).</p>
            <div class="cms-grid">
              <label class="cms-field-label">Curriculum visual<select class="input" id="cms-illustration-choice">${wm.map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}</select></label>
              <label class="cms-field-label">Upload a new image<input class="input" id="cms-illustration-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label>
            </div>
            <div class="cms-grid"><input class="input" id="cms-illustration-alt" placeholder="Image description for screen readers"><input class="input" id="cms-illustration-caption" placeholder="Optional image caption"></div>
            <div class="cms-illustration__preview" id="cms-illustration-preview" hidden><img alt=""><span></span></div>
          </fieldset>
          <button class="btn btn--primary" type="submit">Save lesson</button>
        </form>
      </div>
      <section class="card cms-list"><h2>Saved custom lessons</h2>${e.length?e.map(s=>{var a;return`<article class="cms-list__item">${(a=s.illustration)!=null&&a.src?`<img class="cms-list__thumbnail" src="${ts(s.illustration.src)}" alt="">`:""}<div><strong>${ts(s.title)}</strong><span>${ts(s.subject||"Computing")} - ${ts(s.strand||"Unassigned")}</span></div></article>`}).join(""):'<p class="insight-empty">No custom lessons yet.</p>'}</section>
    </main>`;return Je({title:"Curriculum",subtitle:"Create portable lessons, illustrations, and curriculum packs.",activePath:"/lesson-editor",content:t})}function _m(e){var c,l,d;rt(e);const t=document.getElementById("cms-illustration-choice"),s=document.getElementById("cms-illustration-upload"),a=document.getElementById("cms-illustration-alt"),n=document.getElementById("cms-illustration-caption"),r=document.getElementById("cms-illustration-preview");let o="";const i=()=>{const u=o||(t==null?void 0:t.value);r&&(r.hidden=!u,u&&(r.querySelector("img").src=u,r.querySelector("img").alt=(a==null?void 0:a.value)||"Selected lesson illustration",r.querySelector("span").textContent=(n==null?void 0:n.value)||"Illustration ready to publish"))};t==null||t.addEventListener("change",()=>{t.value&&(o="",s.value=""),i()}),s==null||s.addEventListener("change",async()=>{var p;const u=(p=s.files)==null?void 0:p[0];if(u){if(!u.type.startsWith("image/")||u.size>ym){s.value="",D("Choose an image file no larger than 2 MB.","error");return}try{o=await Sm(u),t.value="",i()}catch(m){D(m.message,"error")}}}),a==null||a.addEventListener("input",i),n==null||n.addEventListener("input",i),(c=document.getElementById("lesson-editor-form"))==null||c.addEventListener("submit",async u=>{u.preventDefault();const p=g=>document.getElementById(g).value.trim(),m=o||(t==null?void 0:t.value),h=m?{src:m,alt:p("cms-illustration-alt")||`Illustration for ${p("cms-title")}`,caption:p("cms-illustration-caption")}:null;await Gr({title:p("cms-title"),strand:p("cms-strand"),subject:p("cms-subject"),objectives:p("cms-objectives").split(`
`).map(g=>g.trim()).filter(Boolean),keyTerms:p("cms-terms").split(`
`).map(g=>g.trim()).filter(Boolean),content:p("cms-body"),illustration:h}),D("Custom lesson saved locally.","success"),e("/lesson-editor")}),(l=document.getElementById("btn-export-pack"))==null||l.addEventListener("click",async()=>{Im(vm(await Vi())),D("ZIP lesson pack exported.","success")}),(d=document.getElementById("cms-import-pack"))==null||d.addEventListener("change",async u=>{try{const p=await bm(u.target.files[0]),m=await Ki(p);D(`${m.lessons} lessons and ${m.questions} questions imported.`,"success"),e("/lesson-editor")}catch(p){D(p.message||"Could not import that lesson pack.","error")}})}const An=(e="")=>String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");function $m(e){return`<article class="cms-list__item question-bank-item">
    <div><strong>${An(e.type)} - ${An(e.bloom||"Knowledge")}</strong><span>${An(e.prompt)}</span></div>
    <button class="btn btn--ghost btn--sm btn-edit-question" type="button" data-question-id="${e.id}">Edit</button>
  </article>`}async function Am(){const e=await Ht(),t=`<main class="container container--narrow view-enter cms-page">
      <div class="card"><h1 class="card__title" id="question-editor-title">Author a question</h1>
        <p class="card__subtitle">Save reusable questions, then choose them directly in the Assessment Lab.</p>
        <form id="question-editor-form" class="cms-form">
          <input id="question-id" type="hidden">
          <div class="cms-grid"><select class="input" id="question-type"><option value="mcq">Multiple choice</option><option value="true-false">True / False</option><option value="fill-blank">Fill in the blank</option><option value="short">Short answer</option><option value="code">Coding</option></select><select class="input" id="question-bloom"><option>Knowledge</option><option>Comprehension</option><option>Application</option><option>Analysis</option></select></div>
          <div class="cms-grid"><label class="cms-field-label">Curriculum lesson<select class="input" id="question-lesson"><option value="">General / not tied to a lesson</option><option value="1">Lesson 1</option><option value="2">Lesson 2</option><option value="3">Lesson 3</option><option value="4">Lesson 4</option><option value="5">Lesson 5</option></select></label><label class="cms-field-label">IRT difficulty (-3 to +3)<input class="input" id="question-difficulty" type="number" min="-3" max="3" step="0.1" value="0"></label></div>
          <textarea class="input" id="question-prompt" required rows="4" placeholder="Question prompt"></textarea>
          <textarea class="input" id="question-options" rows="4" placeholder="Options, one per line (MCQ only)"></textarea>
          <input class="input" id="question-answer" placeholder="Correct answer / answer key">
          <div class="cms-actions"><button class="btn btn--primary" id="btn-save-question">Save question</button><button class="btn btn--ghost" id="btn-cancel-question-edit" type="button" hidden>Cancel edit</button></div>
        </form>
      </div>
      <section class="card cms-list"><h2>Saved questions</h2>${e.length?e.map($m).join(""):'<p class="insight-empty">No custom questions yet.</p>'}</section>
    </main>`;return Je({title:"Question bank",subtitle:"Author and reuse assessment questions for the curriculum.",activePath:"/lesson-editor",content:t})}function Cm(e){var n;rt(e);const t=document.getElementById("question-editor-form"),s=r=>{var o;return((o=document.getElementById(r))==null?void 0:o.value.trim())||""},a=()=>{t==null||t.reset(),document.getElementById("question-id").value="",document.getElementById("question-editor-title").textContent="Author a question",document.getElementById("btn-save-question").textContent="Save question",document.getElementById("btn-cancel-question-edit").hidden=!0};document.querySelectorAll(".btn-edit-question").forEach(r=>r.addEventListener("click",async()=>{const o=(await Ht()).find(i=>i.id===Number(r.dataset.questionId));o&&(document.getElementById("question-id").value=o.id,document.getElementById("question-type").value=o.type||"mcq",document.getElementById("question-bloom").value=o.bloom||"Knowledge",document.getElementById("question-lesson").value=o.lessonId||"",document.getElementById("question-prompt").value=o.prompt||"",document.getElementById("question-options").value=(o.options||[]).join(`
`),document.getElementById("question-answer").value=o.answer||"",document.getElementById("question-difficulty").value=o.difficulty??0,document.getElementById("question-editor-title").textContent="Edit saved question",document.getElementById("btn-save-question").textContent="Save changes",document.getElementById("btn-cancel-question-edit").hidden=!1,window.scrollTo({top:0,behavior:"smooth"}))})),(n=document.getElementById("btn-cancel-question-edit"))==null||n.addEventListener("click",a),t==null||t.addEventListener("submit",async r=>{r.preventDefault();const o=Number(s("question-id"))||void 0;await Wr({id:o,type:s("question-type"),bloom:s("question-bloom"),lessonId:Number(s("question-lesson"))||null,prompt:s("question-prompt"),options:s("question-options").split(`
`).map(i=>i.trim()).filter(Boolean),answer:s("question-answer"),difficulty:Number(s("question-difficulty"))}),D(o?"Question updated.":"Question saved to the local bank.","success"),e("/question-editor")})}let B=window.location.pathname;wi();const Cn=document.getElementById("app"),xm=4e3;async function Em(){let e;try{await Promise.race([xi(),new Promise((t,s)=>{e=window.setTimeout(()=>{s(new Error("Saved settings did not load in time."))},xm)})])}finally{window.clearTimeout(e)}}async function O(e,t=!0){t&&e!==window.location.pathname&&window.history.pushState({},"",e),B=e,await tt()}window.addEventListener("popstate",()=>{B=window.location.pathname,tt()});function Lm(e){return e==="/lessons"||e.startsWith("/lessons/")||e==="/diagnostic"||e==="/assessments"||e.startsWith("/diagnostic-results/")||e.startsWith("/assessment/")||e.startsWith("/assessment-results/")||e.startsWith("/lesson/")||e.startsWith("/quiz/")||e.startsWith("/quiz-results/")||e==="/tutor"}function Bm(e){return e==="/dashboard"?"dashboard":e==="/students"?"roster.manage":e==="/admin"?"users.manage":e==="/assessment-lab"?"assessment.manage":e==="/lab-monitor"?"lab.monitor":e==="/lesson-editor"||e==="/question-editor"?"cms.manage":e==="/gradebook"||e==="/report-card"||e.startsWith("/report-card/")?"gradebook":null}async function tt(){let e=!1;B==="/dashboard/legacy"&&(B="/dashboard",window.history.replaceState({},"",B)),B==="/dashboard"&&!Kt()&&(B="/teacher-login",window.history.replaceState({},"","/teacher-login")),(B==="/assessment-lab"||B==="/lab-monitor")&&!Kt()&&(B="/teacher-login",window.history.replaceState({},"","/teacher-login"));const t=Bm(B);t&&(!Kt()||!vs(t))&&(Kt()?e=!0:(B="/teacher-login",window.history.replaceState({},"",B))),Lm(B)&&!K()&&(B="/student-login",window.history.replaceState({},"","/student-login"));const s=document.getElementById("app-loader");s&&!s.classList.contains("hidden")&&(s.classList.add("hidden"),setTimeout(()=>s.remove(),1e3)),B.startsWith("/quiz/")||ll(),B!=="/diagnostic"&&xo(),B.startsWith("/assessment/")||ru(),B!=="/dashboard"&&Ot(),B!=="/lab-monitor"&&Vu(),Cn.firstElementChild&&(Cn.firstElementChild.classList.add("view-exit"),await new Promise(r=>setTimeout(r,200)));let a="",n=()=>{};if(e)a=yl("/dashboard"),n=()=>wl(O);else if(B==="/"||B==="/index.html")a=uc(),n=()=>mc(O);else if(B==="/student-login")a=await bc(),n=()=>yc(O);else if(B==="/teacher-login")a=await wc(),n=()=>Ic(O);else if(B==="/lessons")a=await Mc(),n=()=>Es(O);else if(B==="/lessons/library")a=await qc(),n=()=>Pc(O);else if(B==="/lessons/progress")a=await Nc(),n=()=>zc(O);else if(B==="/lessons/review")a=await Rc(),n=()=>jc(O);else if(B==="/assessments")a=await zd(),n=()=>jd(O);else if(B==="/diagnostic")ad(),a=rd(),n=()=>od(O,tt);else if(B.startsWith("/diagnostic-results/")){const r=B.split("/")[2];a=await gd(r),n=()=>fd(O,r)}else if(B.startsWith("/lesson/")){const r=B.split("/")[2],o=r.startsWith("custom-")?r:Number.parseInt(r,10);a=await Oc(o),n=()=>Fc(O,o)}else if(B.startsWith("/quiz/")){const r=Number.parseInt(B.split("/")[2],10);cl(r),a=dl(),n=()=>ul(O,tt,r)}else if(B.startsWith("/quiz-results/")){const r=B.split("/")[2];a=await gl(r),n=()=>fl(O,r)}else if(B.startsWith("/assessment-results/")){const r=B.split("/")[2];a=await uu(r),n=()=>mu(O,r)}else if(B.startsWith("/assessment/")){const r=Number.parseInt(B.split("/")[2],10);await au(r),a=lu(),n=()=>du(O,tt)}else if(B==="/tutor")a=await Id(),n=()=>Sd(O,tt);else if(B==="/assessment-lab")a=await Rd(),n=()=>Pd(O);else if(B==="/lab-monitor")a=Hu(),n=()=>Gu(O);else if(B==="/lesson-editor")a=await km(),n=()=>_m(O);else if(B==="/question-editor")a=await Am(),n=()=>Cm(O);else if(B==="/gradebook")a=await is(),n=()=>cs(O);else if(B==="/report-card"||B.startsWith("/report-card/")){const r=B.split("/")[2]||null;a=await yu(r),n=()=>wu(O)}else if(B==="/dashboard")a=await jl(),n=()=>_o(O);else if(B==="/students")a=await Ol(),n=()=>Fl(O);else if(B==="/admin")a=await Kl(),n=()=>Yl(O);else{O("/",!1);return}Cn.innerHTML=a,setTimeout(n,0),window.scrollTo(0,0)}window.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(window.location.search).has("capture")?0:1500;setTimeout(async()=>{try{await Em()}catch(s){console.error("Unable to load saved ClassConnect settings.",s)}cc(),eo(),await tt()},t)});
