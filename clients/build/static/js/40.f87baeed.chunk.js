(this.webpackJsonpemilus=this.webpackJsonpemilus||[]).push([[40],{506:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var c=n(74),r=function(e){if(Object(c.a)()&&window.document.documentElement){var t=Array.isArray(e)?e:[e],n=window.document.documentElement;return t.some((function(e){return e in n.style}))}return!1};function a(e,t){return Array.isArray(e)||void 0===t?r(e):function(e,t){if(!r(e))return!1;var n=document.createElement("div"),c=n.style[e];return n.style[e]=t,n.style[e]!==c}(e,t)}},509:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return r}));function c(){return{width:document.documentElement.clientWidth,height:window.innerHeight||document.documentElement.clientHeight}}function r(e){var t=e.getBoundingClientRect(),n=document.documentElement;return{left:t.left+(window.pageXOffset||n.scrollLeft)-(n.clientLeft||document.body.clientLeft||0),top:t.top+(window.pageYOffset||n.scrollTop)-(n.clientTop||document.body.clientTop||0)}}},639:function(e,t,n){"use strict";n.r(t);var c=n(1),r=n(0),a=n.n(r),i=n(21),s=n(591),o=n(142),u=n(108),l=n(579),d={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"}}]},name:"message",theme:"outlined"},m=n(20),f=function(e,t){return r.createElement(m.a,Object(c.a)(Object(c.a)({},e),{},{ref:t,icon:d}))};f.displayName="MessageOutlined";var h=r.forwardRef(f),j={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M742 318V184h86c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H196c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h86v134c0 81.5 42.4 153.2 106.4 194-64 40.8-106.4 112.5-106.4 194v134h-86c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h632c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-86V706c0-81.5-42.4-153.2-106.4-194 64-40.8 106.4-112.5 106.4-194zm-72 388v134H354V706c0-42.2 16.4-81.9 46.3-111.7C430.1 564.4 469.8 548 512 548s81.9 16.4 111.7 46.3C653.6 624.1 670 663.8 670 706zm0-388c0 42.2-16.4 81.9-46.3 111.7C593.9 459.6 554.2 476 512 476s-81.9-16.4-111.7-46.3A156.63 156.63 0 01354 318V184h316v134z"}}]},name:"hourglass",theme:"outlined"},b=function(e,t){return r.createElement(m.a,Object(c.a)(Object(c.a)({},e),{},{ref:t,icon:j}))};b.displayName="HourglassOutlined";var v=r.forwardRef(b),O=n(501),p=n.n(O),x=n(2),y=function(e){var t=[{key:"no",title:"No",width:60,render:function(e,t,n){return n+1}},{key:"room",title:"Room",render:function(e,t,n){return Object(x.jsx)(s.a.Text,{children:"Rooms Name"})}},{key:"user",title:"User",render:function(e,t,n){return Object(x.jsx)(s.a.Text,{children:"User"})}},{key:"date",title:"Start Date",render:function(){return Object(x.jsx)("div",{className:"w-full",children:Object(x.jsx)(s.a.Text,{children:p()().format("DD MMMM YYYY")})})}},{key:"expires-in",title:"Expires In",render:function(){var e=p()(),t=p()(p()().add(100,"day").format("DD MM YYYY"),"DD MM YYYY").utc(),n=p.a.duration(t.diff(e)).asDays();return Object(x.jsx)("div",{className:"w-full",children:Object(x.jsx)(s.a.Text,{children:n})})}},{key:"action",title:"",render:function(e,t,n){return Object(x.jsxs)("div",{className:"text-right",children:[Object(x.jsx)(o.a,{title:"Send Message to User",children:Object(x.jsx)(u.a,{type:"primary",ghost:!0,size:"small",shape:"circle",icon:Object(x.jsx)(h,{}),className:"ml-2"})}),Object(x.jsx)(o.a,{title:"Room is Ready ?",children:Object(x.jsx)(u.a,{type:"primary",ghost:!0,size:"small",shape:"circle",icon:Object(x.jsx)(v,{}),className:"ml-2"})})]})}}];return Object(x.jsx)(l.a,{dataSource:[{},{}],columns:t})};y.defaultProps={};var g=Object(i.b)((function(){return{}}),{})(a.a.memo(y)),w=function(e){return Object(x.jsx)("div",{className:"w-full",children:Object(x.jsx)(g,Object(c.a)({},e))})};w.defaultProps={};t.default=Object(i.b)((function(){return{}}),{})(a.a.memo(w))}}]);
//# sourceMappingURL=40.f87baeed.chunk.js.map