(this.webpackJsonpui=this.webpackJsonpui||[]).push([[0],{178:function(e,t,n){},180:function(e,t,n){},194:function(e,t){},204:function(e,t,n){"use strict";n.r(t);var c,a=n(0),s=n.n(a),r=n(78),i=n.n(r),o=(n(178),n(32)),j=n(12),l=n.n(j),d=n(116),b=n(9),h=n(143),u=(n(180),n(252)),O=n(82),f=n(231),x=n(248),p=n(232),m=n(253),g=n(159),v=n(254),S=n(233),y=n(247),C=n(250),w=n(255),B=n(244),k=n(228),z=n(144),P=n.n(z),T=n(25),$=n(8),H=function(e){var t=e.isOpen,n=e.isClose,c=e.membershipProof,a=Object(T.f)();return Object($.jsxs)(B.a,{isOpen:t,onClose:n,children:[Object($.jsx)(B.g,{}),Object($.jsxs)(B.d,{children:[Object($.jsx)(B.f,{children:"Certificate"}),Object($.jsx)(B.c,{}),Object($.jsx)(B.b,{children:Object($.jsx)(k.a,{children:Object($.jsx)(P.a,{value:c})})}),Object($.jsx)(B.e,{children:Object($.jsx)(g.a,{variant:"ghost",onClick:function(){return a.push("/".concat(c))},children:"Print"})})]})]})},I=n(245),M=Object(y.a)(c||(c=Object(h.a)(["\n    query GetUsers($balance_gt: Int!, $balance_lt: Int!, $size: Int!) {\n        users(\n            first: $size\n            where: { balance_gt: $balance_gt, balance_lt: $balance_lt }\n        ) {\n            address\n            balance\n        }\n    }\n"])));var X=function(){var e=Object(a.useState)(100),t=Object(b.a)(e,2),n=t[0],c=t[1],s=Object(a.useState)(200),r=Object(b.a)(s,2),i=r[0],j=r[1],h=Object(a.useState)(200),y=Object(b.a)(h,2),B=y[0],k=y[1],z=Object(a.useState)(!1),P=Object(b.a)(z,2),T=P[0],X=P[1],_=Object(a.useState)(!1),W=Object(b.a)(_,2),J=W[0],E=W[1],D=Object(a.useState)("345345tsdfga"),F=Object(b.a)(D,2),U=F[0],A=F[1],G=Object(a.useState)({}),N=Object(b.a)(G,2),Q=N[0],R=N[1],q=Object(C.a)(M,{fetchPolicy:"network-only"}),K=Object(b.a)(q,2),L=K[0],Z=K[1],V=Z.data;return Z.loading,Object(a.useEffect)((function(){if(console.log("data",V),V){var e={proofHash:"dfsdf",minUsdc:n,maxUsdc:i,setSize:B,addressSet:{data:V}},t={method:"GET",headers:{"Content-Type":"application/json"}};console.log("data",V);var c=new Map,a=new Map,s=V.users.map((function(e){return fetch("https://api.etherscan.io/api?module=account&action=txlist&address=".concat(e.address,"&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=9SQ26N4VERJTXBWXQ4H94X4X98UZ4VFPHB"),t).then(function(){var t=Object(d.a)(l.a.mark((function t(n){var s;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n.json();case 2:s=t.sent,c.set(e.address,s.result[0].hash),a.set(s.result[0].hash,e.address);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}));Object(d.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(s);case 2:e.sent,new Map,t=Object(o.a)(c.keys()).map((function(e){return c.get(e)})),n=t.map((function(e,t){return'{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["'.concat(e,'"],"id":').concat(t,"}")})),console.log("["+n+"]"),fetch("https://eth-mainnet.alchemyapi.io/v2/wCzaTDAfLI6S5Mdc2suiOXcpf7Xzlk_w",{method:"POST",body:"["+n+"]"}).then((function(e){return e.json()})).then((function(e){console.log(e),e.map((function(e){var t=I.a.joinSignature({v:e.result.v,r:e.result.r,s:e.result.s}),n=I.a.recoverPublicKey(e.result.hash,t);console.log(n)}))}));case 8:case"end":return e.stop()}}),e)})))(),function(e){var t={method:"POST",headers:{"Content-Type":"application/json","X-Master-Key":"$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO"},body:JSON.stringify(e)};return fetch("https://api.jsonbin.io/v3/b",t).then((function(e){return e.json()}))}(e).then((function(e){console.log(e),A(e.metadata.id),X(!0)}))}}),[V]),Object($.jsxs)(u.a,{children:[Object($.jsxs)(O.a,{id:"min",isRequired:!0,children:[Object($.jsx)(f.a,{mt:10,children:"Minimum USDC Balance"}),Object($.jsx)(x.c,{min:0,color:"tomato",variant:"filled",onChange:function(e){return c(parseInt(e))},children:Object($.jsx)(x.d,{style:{fontWeight:"bold"}})})]}),Object($.jsxs)(O.a,{id:"max",children:[Object($.jsx)(f.a,{children:"Maximum USDC Balance"}),Object($.jsx)(x.c,{color:"tomato",variant:"filled",min:0,onChange:function(e){return j(parseInt(e))},children:Object($.jsx)(x.d,{style:{fontWeight:"bold"}})})]}),Object($.jsxs)(O.a,{id:"address",children:[Object($.jsx)(f.a,{children:"Size of Address Set"}),Object($.jsxs)(x.c,{color:"tomato",variant:"filled",min:1,max:5,onChange:function(e){k(parseInt(e)),console.log(B)},children:[Object($.jsx)(x.d,{}),Object($.jsxs)(x.e,{children:[Object($.jsx)(x.b,{}),Object($.jsx)(x.a,{})]})]})]}),Object($.jsxs)(O.a,{id:"amount",children:[Object($.jsx)(f.a,{children:"Your address"}),Object($.jsx)(x.c,{min:0,mb:10,onChange:function(e){console.log(e)},children:Object($.jsx)(p.a,{color:"tomato",variant:"filled",placeholder:"0xBc11295936Aa79d594139de1B2e12629414F3BDB",style:{fontWeight:"bold"}})})]}),Object($.jsxs)(m.a,{columns:2,spacing:5,children:[Object($.jsx)(g.a,{variant:"solid",colorScheme:"orange",onClick:function(){return L({variables:{balance_gt:n,balance_lt:i,size:B}})},children:"Generate Proof"}),Object($.jsx)(g.a,{disabled:!T,onClick:function(){R({minBalance:n,maxBalance:i,size:B}),E(!0)},children:"Mint certificate"})]}),T&&Object($.jsxs)(v.a,{status:"success",variant:"subtle",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",height:"200px",children:[Object($.jsx)(v.c,{boxSize:"40px",mr:0}),Object($.jsx)(v.d,{mt:4,mb:1,fontSize:"lg",children:"Proof generated!"}),Object($.jsxs)(v.b,{maxWidth:"sm",children:[U," ",console.log(Q),Object($.jsx)(S.a,{"aria-label":"copy",colorScheme:"green",size:"xs",variant:"outline",icon:Object($.jsx)(w.a,{})})]})]}),Object($.jsx)(H,{isOpen:J,isClose:function(){return E(!1)},membershipProof:U})]})},_=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,257)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,s=t.getLCP,r=t.getTTFB;n(e),c(e),a(e),s(e),r(e)}))},W=n(251),J=n(242),E=n(234),D=n(243),F=n(246),U=n(249),A=n(241),G=n(235),N=function(){return Object($.jsxs)(E.a,{bg:"orange.500",w:"100%",p:4,mt:20,children:["Crafted by the"," ",Object($.jsx)(G.a,{href:"https://nethermind.io/",isExternal:!0,children:"Nethermind team"})]})},Q=n(88),R=n(236),q=function(e){var t=e.users;return t&&Object($.jsxs)(R.a,{variant:"simple",mt:20,colorScheme:"orange",children:[Object($.jsx)(R.d,{children:Object($.jsxs)(R.e,{children:[Object($.jsx)(R.c,{children:"Address"}),Object($.jsx)(R.c,{children:"Balance"})]})}),Object($.jsx)(R.b,{children:t.map((function(e){return Object($.jsxs)(R.e,{children:[Object($.jsx)(R.c,{children:e.address}),Object($.jsx)(R.c,{children:e.balance})]})}))})]})},K=function(){var e=Object(T.g)().proofHash,t=Object(a.useState)([]),n=Object(b.a)(t,2),c=n[0],s=n[1];return console.log("proofHash",e),Object(a.useEffect)((function(){(function(e){return fetch("https://api.jsonbin.io/v3/b/".concat(e,"/latest"),{method:"GET",headers:{"Content-Type":"application/json","X-Master-Key":"$2b$10$rJt/jHy0W/OoJaX3Som3lu7NepipWzBp/QviO0c28o8Zad0.0RHaO"}}).then((function(e){return e.json()}))})(e).then((function(e){s(e.record.addressSet.data.users)}))}),[]),Object($.jsx)(q,{users:c})},L=new F.a({uri:"https://api.thegraph.com/subgraphs/name/centrehq/usdc",cache:new U.a});i.a.render(Object($.jsx)(s.a.StrictMode,{children:Object($.jsx)(W.a,{children:Object($.jsx)(A.a,{client:L,children:Object($.jsxs)(J.a,{style:{height:"100vh"},direction:"column",justifyContent:"space-between",children:[Object($.jsx)(E.a,{bgGradient:"linear(to-b, orange.50, transparent)",children:Object($.jsx)(D.a,{children:Object($.jsxs)(u.a,{children:[Object($.jsx)("img",{src:"./logo.svg",alt:""}),Object($.jsx)(Q.a,{children:Object($.jsxs)(T.c,{children:[Object($.jsx)(T.a,{path:"/:proofHash",children:Object($.jsx)(K,{})}),Object($.jsx)(T.a,{path:"/",children:Object($.jsx)(X,{})})]})})]})})}),Object($.jsx)(N,{})]})})})}),document.getElementById("root")),_()}},[[204,1,2]]]);
//# sourceMappingURL=main.2fd9a955.chunk.js.map