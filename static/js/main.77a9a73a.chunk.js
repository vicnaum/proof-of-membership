(this.webpackJsonpui=this.webpackJsonpui||[]).push([[0],{225:function(e,t,n){},227:function(e,t,n){},240:function(e,t){},249:function(e,t){},253:function(e,t,n){"use strict";n.r(t);var c,s=n(0),a=n.n(s),r=n(111),i=n.n(r),o=(n(225),n(43)),l=n(6),j=n.n(l),d=n(155),b=n(14),h=n(183),u=(n(227),n(304)),O=n(115),f=n(284),x=n(285),p=n(300),m=n(305),g=n(203),v=n(306),S=n(286),y=n(299),C=n(302),w=n(307),B=n(297),P=n(277),k=n(184),z=n.n(k),I=n(37),T=n(13),$=function(e){var t=e.isOpen,n=e.isClose,c=e.membershipProof,s=Object(I.f)();return Object(T.jsxs)(B.a,{isOpen:t,onClose:n,children:[Object(T.jsx)(B.g,{}),Object(T.jsxs)(B.d,{children:[Object(T.jsx)(B.f,{children:"Certificate"}),Object(T.jsx)(B.c,{}),Object(T.jsx)(B.b,{children:Object(T.jsx)(P.a,{children:Object(T.jsx)(z.a,{value:c})})}),Object(T.jsx)(B.e,{children:Object(T.jsx)(g.a,{variant:"ghost",onClick:function(){return s.push("/".concat(c))},children:"Print"})})]})]})},_=n(190),H=n(83),M=Object(y.a)(c||(c=Object(h.a)(["\n    query GetUsers($balance_gt: Int!, $balance_lt: Int!, $size: Int!) {\n        users(\n            first: $size\n            where: { balance_gt: $balance_gt, balance_lt: $balance_lt }\n        ) {\n            address\n            balance\n        }\n    }\n"]))),W=function(){var e,t,n,c=Object(s.useState)(100),a=Object(b.a)(c,2),r=a[0],i=a[1],l=Object(s.useState)(200),h=Object(b.a)(l,2),y=h[0],B=h[1],P=Object(s.useState)(200),k=Object(b.a)(P,2),z=k[0],I=k[1],W=Object(s.useState)(!1),X=Object(b.a)(W,2),q=X[0],R=X[1],U=Object(s.useState)(!1),J=Object(b.a)(U,2),A=J[0],D=J[1],E=Object(s.useState)("345345tsdfga"),F=Object(b.a)(E,2),L=F[0],G=F[1],N=Object(s.useState)({}),Q=Object(b.a)(N,2),K=Q[0],Z=Q[1],V=(new _.a.providers.Web3Provider(null===(e=window)||void 0===e?void 0:e.ethereum).getSigner(),null===(t=window)||void 0===t||null===(n=t.ethereum)||void 0===n?void 0:n.request({method:"eth_requestAccounts"}).then((function(){console.log("accounts",V[0]),V.length&&V[0]}))),Y=Object(C.a)(M,{fetchPolicy:"network-only"}),ee=Object(b.a)(Y,2),te=ee[0],ne=ee[1],ce=ne.data,se=ne.loading;return Object(s.useEffect)((function(){if(console.log("data",ce),ce){var e={proofHash:"dfsdf",minUsdc:r,maxUsdc:y,setSize:z,addressSet:{data:ce}},t={method:"GET",headers:{"Content-Type":"application/json"}};console.log("data",ce);var n=new Map,c=new Map,s=ce.users.map((function(e){return fetch("https://api.etherscan.io/api?module=account&action=txlist&address=".concat(e.address,"&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=9SQ26N4VERJTXBWXQ4H94X4X98UZ4VFPHB"),t).then(function(){var t=Object(d.a)(j.a.mark((function t(s){var a;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,s.json();case 2:a=t.sent,n.set(e.address,a.result[0].hash),c.set(a.result[0].hash,e.address);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}));Object(d.a)(j.a.mark((function e(){var t,c;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(s);case 2:e.sent,new Map,t=Object(o.a)(n.keys()).map((function(e){return n.get(e)})),c=t.map((function(e,t){return'{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["'.concat(e,'"],"id":').concat(t,"}")})),console.log("["+c+"]"),fetch("https://eth-mainnet.alchemyapi.io/v2/wCzaTDAfLI6S5Mdc2suiOXcpf7Xzlk_w",{method:"POST",body:"["+c+"]"}).then((function(e){return e.json()})).then((function(e){console.log(e),e.map((function(e){var t=H.utils.joinSignature({v:e.result.v,r:e.result.r,s:e.result.s}),n=H.utils.recoverPublicKey(e.result.hash,t);console.log(n)}))}));case 8:case"end":return e.stop()}}),e)})))(),function(e){var t={method:"POST",headers:{"Content-Type":"application/json","X-Master-Key":"$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO"},body:JSON.stringify(e)};return fetch("https://api.jsonbin.io/v3/b",t).then((function(e){return e.json()}))}(e).then((function(e){console.log(e),G(e.metadata.id),R(!0)}))}}),[ce]),Object(T.jsxs)(u.a,{children:[Object(T.jsxs)(O.a,{id:"min",isRequired:!0,children:[Object(T.jsx)(f.a,{mt:10,children:"Message"}),Object(T.jsx)(x.a,{min:0,color:"tomato",variant:"filled",placeholder:"Alice proofs Bob that she owns 100 USDC",onChange:function(e){return i(parseInt(e))},style:{fontWeight:"bold"}})]}),Object(T.jsxs)(O.a,{id:"min",isRequired:!0,children:[Object(T.jsx)(f.a,{mt:10,children:"Minimum USDC Balance"}),Object(T.jsx)(p.c,{min:0,color:"tomato",variant:"filled",onChange:function(e){return i(parseInt(e))},children:Object(T.jsx)(p.d,{style:{fontWeight:"bold"}})})]}),Object(T.jsxs)(O.a,{id:"max",isRequired:!0,children:[Object(T.jsx)(f.a,{children:"Maximum USDC Balance"}),Object(T.jsx)(p.c,{color:"tomato",variant:"filled",min:0,onChange:function(e){return B(parseInt(e))},children:Object(T.jsx)(p.d,{style:{fontWeight:"bold"}})})]}),Object(T.jsxs)(O.a,{id:"address",isRequired:!0,children:[Object(T.jsx)(f.a,{children:"Size of Address Set"}),Object(T.jsxs)(p.c,{color:"tomato",variant:"filled",min:1,max:5,onChange:function(e){I(parseInt(e)),console.log(z)},children:[Object(T.jsx)(p.d,{}),Object(T.jsxs)(p.e,{children:[Object(T.jsx)(p.b,{}),Object(T.jsx)(p.a,{})]})]})]}),Object(T.jsxs)(O.a,{id:"amount",isRequired:!0,children:[Object(T.jsx)(f.a,{children:"Your address"}),Object(T.jsx)(p.c,{min:0,mb:10,onChange:function(e){console.log(e)},children:Object(T.jsx)(x.a,{color:"tomato",variant:"filled",placeholder:"0xBc11295936Aa79d594139de1B2e12629414F3BDB",style:{fontWeight:"bold"}})})]}),Object(T.jsxs)(m.a,{columns:2,spacing:5,children:[Object(T.jsx)(g.a,{variant:"solid",colorScheme:"orange",isLoading:se,onClick:function(){return te({variables:{balance_gt:r,balance_lt:y,size:z}})},children:"Generate Proof"}),Object(T.jsx)(g.a,{disabled:!q,onClick:function(){Z({minBalance:r,maxBalance:y,size:z}),D(!0)},children:"Mint certificate"})]}),q&&Object(T.jsxs)(v.a,{status:"success",variant:"subtle",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",height:"200px",children:[Object(T.jsx)(v.c,{boxSize:"40px",mr:0}),Object(T.jsx)(v.d,{mt:4,mb:1,fontSize:"lg",children:"Proof generated!"}),Object(T.jsxs)(v.b,{maxWidth:"sm",children:[L," ",console.log(K),Object(T.jsx)(S.a,{"aria-label":"copy",colorScheme:"green",size:"xs",variant:"outline",icon:Object(T.jsx)(w.a,{})})]})]}),Object(T.jsx)($,{isOpen:A,isClose:function(){return D(!1)},membershipProof:L})]})},X=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,309)).then((function(t){var n=t.getCLS,c=t.getFID,s=t.getFCP,a=t.getLCP,r=t.getTTFB;n(e),c(e),s(e),a(e),r(e)}))},q=n(303),R=n(295),U=n(287),J=n(296),A=n(298),D=n(301),E=n(294),F=n(288),L=function(){return Object(T.jsxs)(U.a,{bg:"orange.500",w:"100%",p:4,mt:20,children:["Crafted by the"," ",Object(T.jsx)(F.a,{href:"https://nethermind.io/",isExternal:!0,children:"Nethermind team"})]})},G=n(121),N=n(289),Q=function(e){var t=e.users;return t&&Object(T.jsxs)(N.a,{variant:"simple",mt:20,colorScheme:"orange",children:[Object(T.jsx)(N.d,{children:Object(T.jsxs)(N.e,{children:[Object(T.jsx)(N.c,{children:"Address"}),Object(T.jsx)(N.c,{children:"Balance"})]})}),Object(T.jsx)(N.b,{children:t.map((function(e){return Object(T.jsxs)(N.e,{children:[Object(T.jsx)(N.c,{children:e.address}),Object(T.jsx)(N.c,{children:e.balance})]})}))})]})},K=function(){var e=Object(I.g)().proofHash,t=Object(s.useState)([]),n=Object(b.a)(t,2),c=n[0],a=n[1];return console.log("proofHash",e),Object(s.useEffect)((function(){(function(e){return fetch("https://api.jsonbin.io/v3/b/".concat(e,"/latest"),{method:"GET",headers:{"Content-Type":"application/json","X-Master-Key":"$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO"}}).then((function(e){return e.json()}))})(e).then((function(e){a(e.record.addressSet.data.users)}))}),[]),Object(T.jsx)(Q,{users:c})},Z=new A.a({uri:"https://api.thegraph.com/subgraphs/name/centrehq/usdc",cache:new D.a});console.log("process.env.PUBLIC_URL","/proof-of-membership"),i.a.render(Object(T.jsx)(a.a.StrictMode,{children:Object(T.jsx)(q.a,{children:Object(T.jsx)(E.a,{client:Z,children:Object(T.jsxs)(R.a,{style:{height:"100vh"},direction:"column",justifyContent:"space-between",children:[Object(T.jsx)(U.a,{bgGradient:"linear(to-b, orange.50, transparent)",children:Object(T.jsx)(J.a,{children:Object(T.jsxs)(u.a,{children:[Object(T.jsx)("img",{src:"./logo.svg",alt:""}),Object(T.jsx)(G.a,{basename:"/proof-of-membership",children:Object(T.jsxs)(I.c,{children:[Object(T.jsx)(I.a,{path:"/:proofHash",children:Object(T.jsx)(K,{})}),Object(T.jsx)(I.a,{path:"/",children:Object(T.jsx)(W,{})})]})})]})})}),Object(T.jsx)(L,{})]})})})}),document.getElementById("root")),X()}},[[253,1,2]]]);
//# sourceMappingURL=main.77a9a73a.chunk.js.map