(()=>{var e={};e.id=520,e.ids=[520],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},9551:e=>{"use strict";e.exports=require("url")},7911:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>a.a,__next_app__:()=>c,pages:()=>u,routeModule:()=>p,tree:()=>d});var s=r(260),n=r(8203),o=r(5155),a=r.n(o),i=r(7292),l={};for(let e in i)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>i[e]);r.d(t,l);let d=["",{children:["login",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,3642)),"D:\\PROJECTS\\maps-exlored-web\\app\\login\\page.tsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,6055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,9611)),"D:\\PROJECTS\\maps-exlored-web\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,9937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,9116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,1485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,6055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],u=["D:\\PROJECTS\\maps-exlored-web\\app\\login\\page.tsx"],c={require:r,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:n.RouteKind.APP_PAGE,page:"/login/page",pathname:"/login",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},6752:(e,t,r)=>{Promise.resolve().then(r.bind(r,1944))},6480:(e,t,r)=>{Promise.resolve().then(r.bind(r,5183))},4876:(e,t,r)=>{Promise.resolve().then(r.bind(r,3642))},4708:(e,t,r)=>{Promise.resolve().then(r.bind(r,4014))},5009:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,3219,23)),Promise.resolve().then(r.t.bind(r,4863,23)),Promise.resolve().then(r.t.bind(r,5155,23)),Promise.resolve().then(r.t.bind(r,802,23)),Promise.resolve().then(r.t.bind(r,9350,23)),Promise.resolve().then(r.t.bind(r,8530,23)),Promise.resolve().then(r.t.bind(r,8921,23))},8161:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,6959,23)),Promise.resolve().then(r.t.bind(r,3875,23)),Promise.resolve().then(r.t.bind(r,8903,23)),Promise.resolve().then(r.t.bind(r,7174,23)),Promise.resolve().then(r.t.bind(r,4178,23)),Promise.resolve().then(r.t.bind(r,7190,23)),Promise.resolve().then(r.t.bind(r,1365,23))},5183:(e,t,r)=>{"use strict";r.d(t,{AuthProvider:()=>u,A:()=>c});var s=r(5512),n=r(8009),o=r(8628);let a=(0,r(6722).Wp)({apiKey:"AIzaSyBERXsbpdKHB-0SfHfAcbIBTAT1YgJqkvc",authDomain:"mshuecodev-daede.firebaseapp.com",projectId:"mshuecodev-daede",storageBucket:"mshuecodev-daede.firebasestorage.app",messagingSenderId:"453675518398",appId:"1:453675518398:web:af93634aeab4b8a3d051ef",measurementId:"G-JSR0LJVC4G"}),i=(0,o.xI)(a);(0,o.oM)(i,o.iM).catch(e=>{console.error("Error setting persistence:",e)});let l=new o.HF,d=(0,n.createContext)({user:null,loading:!0,token:null,login:async()=>{},handleLogout:async()=>{},handleRegister:async()=>{},loginWithGoogle:async()=>{}}),u=({children:e})=>{let[t,r]=(0,n.useState)(null),[a,u]=(0,n.useState)(!0),[c,p]=(0,n.useState)(null),h=async()=>{let e=await (0,o.df)(i,l);console.log("User logged in with Google:",e.user);let t=await (0,o.p9)(e.user);r(e.user),p(t)},m=async(e,t)=>{let s=await (0,o.x9)(i,e,t),n=await (0,o.p9)(s.user);r(s.user),p(n)},g=async(e,t)=>{let s=await (0,o.eJ)(i,e,t);console.log("User registered:",s.user);let n=await (0,o.p9)(s.user);r(s.user),p(n)},x=async()=>{await (0,o.CI)(i),r(null),p(null)},b=async()=>{t&&p(await (0,o.p9)(t,!0))};return(0,n.useEffect)(()=>{if(t){let e=setTimeout(()=>{console.log("Forcing logout after 30 minutes"),x()},18e5);return()=>clearTimeout(e)}},[t]),(0,n.useEffect)(()=>{let e=(0,o.iZ)(i,async e=>{r(e),u(!1),e?p(await (0,o.p9)(e)):p(null)});return()=>{e()}},[]),(0,n.useEffect)(()=>{let e=setInterval(b,9e5);return()=>clearInterval(e)},[t]),(0,s.jsx)(d.Provider,{value:{user:t,loading:a,token:c,login:m,handleRegister:g,handleLogout:x,loginWithGoogle:h},children:e})},c=()=>(0,n.useContext)(d)},4014:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var s=r(5512),n=r(8009),o=r(9334),a=r(5183);let i=()=>{let[e,t]=(0,n.useState)(""),[r,i]=(0,n.useState)(""),l=(0,o.useRouter)(),{login:d,token:u,loading:c,loginWithGoogle:p}=(0,a.A)(),h=async t=>{t.preventDefault();try{await d(e,r),console.log("Login successful, pushing to dashboard..."),l.push("/dashboard")}catch(e){console.error("Login failed:",e)}},m=async()=>{try{await p(),console.log("Google login successful, pushing to dashboard..."),l.push("/dashboard")}catch(e){console.error("Google login failed:",e)}};return((0,n.useEffect)(()=>{u&&(console.log("Token exists, redirecting to dashboard..."),l.push("/dashboard"))},[u,l]),c)?(0,s.jsx)("main",{className:"min-h-screen flex items-center justify-center bg-gray-100",children:(0,s.jsx)("div",{className:"text-center",children:(0,s.jsx)("p",{className:"text-gray-600",children:"Loading..."})})}):(0,s.jsx)("main",{className:"min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600",children:(0,s.jsxs)("div",{className:"text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-md",children:[(0,s.jsx)("h1",{className:"text-4xl font-extrabold text-gray-800 mb-6",children:"Login"}),(0,s.jsxs)("form",{onSubmit:h,className:"space-y-4",children:[(0,s.jsx)("input",{type:"email",placeholder:"Email",value:e,onChange:e=>t(e.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"}),(0,s.jsx)("input",{type:"password",placeholder:"Password",value:r,onChange:e=>i(e.target.value),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"}),(0,s.jsx)("button",{type:"submit",className:"w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition",children:"Login"})]}),(0,s.jsx)("p",{className:"mt-4 text-gray-600",children:"or"}),(0,s.jsx)("button",{onClick:m,className:"w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition",children:"Login with Google"}),(0,s.jsx)("p",{className:"mt-4 text-gray-600",children:"Don't have an account?"}),(0,s.jsx)("a",{href:"/register",className:"w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition inline-block text-center",children:"Register"})]})})}},9334:(e,t,r)=>{"use strict";var s=r(8686);r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}})},1944:(e,t,r)=>{"use strict";r.d(t,{AuthProvider:()=>n});var s=r(6760);let n=(0,s.registerClientReference)(function(){throw Error("Attempted to call AuthProvider() from the server but AuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\PROJECTS\\maps-exlored-web\\app\\context\\AuthContex.tsx","AuthProvider");(0,s.registerClientReference)(function(){throw Error("Attempted to call useAuth() from the server but useAuth is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\PROJECTS\\maps-exlored-web\\app\\context\\AuthContex.tsx","useAuth")},9611:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u,metadata:()=>d});var s=r(2740),n=r(7879),o=r.n(n),a=r(3298),i=r.n(a);r(2704);var l=r(1944);let d={title:"Create Next App",description:"Generated by create next app"};function u({children:e}){return(0,s.jsx)("html",{lang:"en",children:(0,s.jsx)("body",{className:`${o().variable} ${i().variable} antialiased`,children:(0,s.jsx)(l.AuthProvider,{children:e})})})}},3642:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(6760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"D:\\\\PROJECTS\\\\maps-exlored-web\\\\app\\\\login\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"D:\\PROJECTS\\maps-exlored-web\\app\\login\\page.tsx","default")},6055:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var s=r(8077);let n=async e=>[{type:"image/x-icon",sizes:"16x16",url:(0,s.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]},2704:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[638,305,77],()=>r(7911));module.exports=s})();