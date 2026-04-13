module.exports=[93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},26445,e=>e.a(async(t,a)=>{try{let t=await e.y("firebase-admin-e3d715f982ecab0e/app");e.n(t),a()}catch(e){a(e)}},!0),13356,e=>e.a(async(t,a)=>{try{let t=await e.y("firebase-admin-e3d715f982ecab0e/auth");e.n(t),a()}catch(e){a(e)}},!0),28296,e=>e.a(async(t,a)=>{try{let t=await e.y("firebase-admin-e3d715f982ecab0e/firestore");e.n(t),a()}catch(e){a(e)}},!0),1690,e=>e.a(async(t,a)=>{try{let t=await e.y("firebase-admin-e3d715f982ecab0e/storage");e.n(t),a()}catch(e){a(e)}},!0),69997,e=>e.a(async(t,a)=>{try{var r=e.i(26445),n=e.i(13356),o=e.i(28296),i=e.i(1690),s=e.i(80756),l=t([r,n,o,i]);function c(){if((0,r.getApps)().length>0)return(0,r.getApp)();let e=process.env.FIREBASE_PROJECT_ID,t=process.env.FIREBASE_CLIENT_EMAIL,a=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,"\n");if(!e||!t||!a)throw Error("Firebase Admin : variables d'environnement manquantes (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).");return(0,r.initializeApp)({credential:(0,r.cert)({projectId:e,clientEmail:t,privateKey:a})})}function p(){return(0,n.getAuth)(c())}function g(){return(0,o.getFirestore)(c())}function h(){let e=process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;if(!e)throw Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET manquant dans .env.local");return(0,i.getStorage)(c()).bucket(e)}async function d(e){let t=e.cookies.get("__session")?.value;if(!t)return s.NextResponse.json({error:"Non autorisé."},{status:401});try{return await p().verifySessionCookie(t,!0),null}catch{return s.NextResponse.json({error:"Session expirée."},{status:401})}}[r,n,o,i]=l.then?(await l)():l,e.s(["checkAdminSession",()=>d,"getAdminAuth",()=>p,"getAdminFirestore",()=>g,"getAdminStorage",()=>h]),a()}catch(e){a(e)}},!1),78227,e=>{"use strict";function t(e){return e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").slice(0,80)}function a(){let e=new Date;return`${e.getDate()} ${["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"][e.getMonth()]} ${e.getFullYear()}`}function r(e){let t=Math.max(1,Math.ceil(e.trim().split(/\s+/).length/200));return`${t} min`}e.s(["estimateReadTime",()=>r,"formatDateFR",()=>a,"generateSlug",()=>t])},8325,e=>e.a(async(t,a)=>{try{var r=e.i(69997),n=t([r]);async function o(e,t){let a=process.env.GEMINI_API_KEY;if(!a)throw Error("GEMINI_API_KEY manquant dans .env.local");let n=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${a}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})});if(!n.ok){let e=await n.text();throw Error(`Erreur Gemini API (${n.status}): ${e}`)}let o=await n.json(),i=o.candidates?.[0]?.content?.parts;if(!i||0===i.length)throw Error("Aucune image générée par Gemini");let s=i.find(e=>e.inlineData?.mimeType?.startsWith("image/"));if(!s?.inlineData?.data)throw Error("Aucune image trouvée dans la réponse Gemini");let l=s.inlineData.mimeType,c=Buffer.from(s.inlineData.data,"base64"),p=`${t}.${"image/jpeg"===l?"jpg":"png"}`,g=(0,r.getAdminStorage)().file(p);await g.save(c,{metadata:{contentType:l}}),await g.makePublic();let h=process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;return`https://storage.googleapis.com/${h}/${p}`}async function i(e,t,a){var r,n;let i=(r=e,n=t,`Create a wide-format editorial photograph (16:9) for a professional blog article. The image must feel like a real photograph taken by a skilled photographer — NOT a 3D render, NOT a CGI illustration, NOT generic stock imagery.

Article: "${r}"
Summary: "${n}"

Instructions:
1. READ the article topic carefully and choose an appropriate real-world scene that visually tells the story. Examples:
   - AI / automation article → person working at a clean desk, hands on keyboard, soft natural light from a window, shallow depth of field
   - Collaboration / meetings → two or three people around a table, seen from behind or 3/4 angle, lively body language, a modern office
   - Retail / customer experience → a real store aisle or showroom with warm ambient light, product displays in the background
   - VR / immersive tech → someone wearing a headset in a bright, open space (not dark) — show wonder, not dystopia
   - Business strategy → close-up of hands on a notepad or whiteboard, natural textures, candid feel

2. PHOTOGRAPHY STYLE — choose the most appropriate for the topic:
   - Documentary / editorial: natural light, candid moments, authentic textures
   - Architectural / product: clean geometry, precise framing, calm atmosphere
   - Lifestyle: warm golden light, shallow depth of field, human presence implied
   - Corporate reportage: real offices, real people (backs or silhouettes only), no posed feel

3. AVOID at all costs:
   - Dark backgrounds with floating glowing 3D objects
   - Blue/teal/neon color grading
   - Sci-fi CGI aesthetics
   - Generic stock photo compositions (handshakes, suits pointing at charts)
   - Any text, logos, watermarks, or UI elements in the image

4. MAKE IT SPECIFIC to this article. A "collaboration" article and an "AI" article should produce visually distinct images.

Generate the image only, no text in the response.`);return o(i,`images/blog/${a}`)}async function s(e,t){var a;let r=(a=e,`Create an editorial photograph to illustrate a specific moment or concept within a professional blog article.

Scene: "${a}"

The image must look like a real photograph — natural lighting, authentic environment, genuine textures. Think: shot by a photojournalist or a high-end magazine photographer on assignment.

Guidelines:
- Choose a specific, concrete scene that SHOWS the concept rather than symbolising it abstractly
- Real environment: office, workshop, street, showroom — whatever fits the scene
- Human presence where relevant: hands, silhouettes, backs of people — never faces
- Natural, varied lighting: could be morning light, office overhead, window backlight — whatever serves the mood
- Candid, unposed feel — something is actually happening in the frame
- Interesting composition: rule of thirds, leading lines, foreground/background relationship
- Avoid: dark glowing 3D renders, neon colors, floating abstract shapes, hollow tech clich\xe9s
- No text, no logos, no watermarks

Generate the image only, no text in the response.`);return o(r,`images/blog/${t}`)}[r]=n.then?(await n)():n,e.s(["generateArticleImage",()=>i,"generateInlineImage",()=>s]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__ea7d4168._.js.map