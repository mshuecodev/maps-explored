(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[105],{7784:(e,s,r)=>{Promise.resolve().then(r.bind(r,5399))},2255:(e,s,r)=>{"use strict";r.d(s,{AuthProvider:()=>o,A:()=>u});var t=r(5155),l=r(2115),a=r(399);let n=(0,r(9904).Wp)({apiKey:"AIzaSyBERXsbpdKHB-0SfHfAcbIBTAT1YgJqkvc",authDomain:"mshuecodev-daede.firebaseapp.com",projectId:"mshuecodev-daede",storageBucket:"mshuecodev-daede.firebasestorage.app",messagingSenderId:"453675518398",appId:"1:453675518398:web:af93634aeab4b8a3d051ef",measurementId:"G-JSR0LJVC4G"}),i=(0,a.xI)(n);(0,a.oM)(i,a.iM).catch(e=>{console.error("Error setting persistence:",e)});let c=new a.HF,d=(0,l.createContext)({user:null,loading:!0,token:null,login:async()=>{},handleLogout:async()=>{},handleRegister:async()=>{},loginWithGoogle:async()=>{}}),o=e=>{let{children:s}=e,[r,n]=(0,l.useState)(null),[o,u]=(0,l.useState)(!0),[h,x]=(0,l.useState)(null),g=async()=>{let e=await (0,a.df)(i,c);console.log("User logged in with Google:",e.user);let s=await (0,a.p9)(e.user);n(e.user),x(s)},m=async(e,s)=>{let r=await (0,a.x9)(i,e,s),t=await (0,a.p9)(r.user);n(r.user),x(t)},p=async(e,s)=>{let r=await (0,a.eJ)(i,e,s);console.log("User registered:",r.user);let t=await (0,a.p9)(r.user);n(r.user),x(t)},f=async()=>{await (0,a.CI)(i),n(null),x(null)},j=async()=>{r&&x(await (0,a.p9)(r,!0))};return(0,l.useEffect)(()=>{if(r){let e=setTimeout(()=>{console.log("Forcing logout after 30 minutes"),f()},18e5);return()=>clearTimeout(e)}},[r]),(0,l.useEffect)(()=>{let e=(0,a.iZ)(i,async e=>{n(e),u(!1),e?x(await (0,a.p9)(e)):x(null)});return()=>{e()}},[]),(0,l.useEffect)(()=>{let e=setInterval(j,9e5);return()=>clearInterval(e)},[r]),(0,t.jsx)(d.Provider,{value:{user:r,loading:o,token:h,login:m,handleRegister:p,handleLogout:f,loginWithGoogle:g},children:s})},u=()=>(0,l.useContext)(d)},5399:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>i});var t=r(5155),l=r(2255),a=r(6046),n=r(2115);let i=()=>{let{user:e,loading:s,token:r,handleLogout:i}=(0,l.A)(),c=(0,a.useRouter)();return((0,n.useEffect)(()=>{s||r||c.push("/login")},[r,s,c]),s)?(0,t.jsx)("main",{className:"min-h-screen flex items-center justify-center bg-gray-100",children:(0,t.jsx)("div",{className:"text-center",children:(0,t.jsx)("p",{className:"text-gray-600",children:"Loading..."})})}):(0,t.jsx)("main",{className:"min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600",children:(0,t.jsxs)("div",{className:"text-center p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl",children:[(0,t.jsx)("h1",{className:"text-4xl font-extrabold text-gray-800 mb-6",children:"Dashboard"}),e?(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[(0,t.jsxs)("div",{className:"text-left text-gray-700 space-y-2",children:[(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Display Name:"})," ",e.displayName||"N/A"]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Email:"})," ",e.email]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Photo URL:"})," ",e.photoURL?(0,t.jsx)("img",{src:e.photoURL,alt:"User Photo",className:"rounded-full w-16 h-16 mx-auto"}):"N/A"]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"UID:"})," ",e.uid]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Email Verified:"})," ",e.emailVerified?"Yes":"No"]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Phone Number:"})," ",e.phoneNumber||"N/A"]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("strong",{children:"Provider ID:"})," ",e.providerId]})]}),(0,t.jsxs)("div",{className:"text-left text-gray-700 space-y-2",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"Features"}),(0,t.jsxs)("ul",{className:"list-disc list-inside",children:[(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:"/maps",className:"text-blue-500 hover:underline",children:"Maps"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:"/feature2",className:"text-blue-500 hover:underline",children:"Feature 2"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:"/feature3",className:"text-blue-500 hover:underline",children:"Feature 3"})}),(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:"/feature4",className:"text-blue-500 hover:underline",children:"Feature 4"})})]})]})]}):(0,t.jsx)("p",{className:"text-gray-700",children:"You are not logged in."}),e&&(0,t.jsx)("button",{onClick:i,className:"mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition",children:"Logout"})]})})}},6046:(e,s,r)=>{"use strict";var t=r(6658);r.o(t,"useRouter")&&r.d(s,{useRouter:function(){return t.useRouter}})}},e=>{var s=s=>e(e.s=s);e.O(0,[523,361,441,517,358],()=>s(7784)),_N_E=e.O()}]);