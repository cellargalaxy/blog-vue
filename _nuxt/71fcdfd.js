(window.webpackJsonp=window.webpackJsonp||[]).push([[15,16,17],{452:function(t,e){},455:function(t,e,l){var content=l(465);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,l(83).default)("4cba49aa",content,!0,{sourceMap:!1})},461:function(t,e,l){"use strict";l.r(e);var n={name:"fullImage",props:{url:{default:function(){return"https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png"}}}},r=(l(464),l(81)),c=l(466),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"full-image",style:{backgroundImage:"url("+t.url+")"}})}),[],!1,null,"01e101de",null);"function"==typeof c.default&&Object(c.default)(component);e.default=component.exports},464:function(t,e,l){"use strict";l(455)},465:function(t,e,l){var n=l(82)(!1);n.push([t.i,".full-image[data-v-01e101de]{background-repeat:no-repeat;background-position:50%;background-attachment:fixed;background-size:cover;height:100vh}",""]),t.exports=n},466:function(t,e,l){"use strict";var n=l(452),r=l.n(n);e.default=r.a},478:function(t,e){},503:function(t,e,l){var content=l(519);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,l(83).default)("6cc856d8",content,!0,{sourceMap:!1})},510:function(t,e){},517:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAABlBMVEVHcEwAAACfKoRRAAAAAXRSTlMAQObYZgAAAAxJREFUCNdjYGQAAgAACwAC91XSmQAAAABJRU5ErkJggg=="},518:function(t,e,l){"use strict";l(503)},519:function(t,e,l){var n=l(82)(!1);n.push([t.i,".full-scrub-image[data-v-003ffee6]{background-repeat:repeat,no-repeat;background-position:0 0,50%;background-attachment:scroll,fixed;background-size:auto,cover;height:100vh}",""]),t.exports=n},520:function(t,e,l){"use strict";var n=l(478),r=l.n(n);e.default=r.a},521:function(t,e,l){"use strict";l.r(e);var n={name:"fullScrubImage",props:{scrub:{default:function(){return l(517)}},url:{default:function(){return"https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png"}}}},r=(l(518),l(81)),c=l(520),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"full-scrub-image",style:{backgroundImage:"url("+t.scrub+"), url("+t.url+")"}})}),[],!1,null,"003ffee6",null);"function"==typeof c.default&&Object(c.default)(component);e.default=component.exports},525:function(t,e,l){"use strict";var n=l(510),r=l.n(n);e.default=r.a},529:function(t,e,l){"use strict";l.r(e);var n={name:"fullCarousel",props:{config:{default:function(){return{interval:5e3,brands:[{imageUrl:"https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png",title:"这是大招牌-1",texts:["这是一段招牌的演示文字-1-1","这是一段招牌的演示文字-1-2"]},{imageUrl:"https://i.loli.net/2018/04/10/5accdcbcb1738.jpg",title:"这是大招牌-2",texts:["这是一段招牌的演示文字-2-1","这是一段招牌的演示文字-2-2"]},{imageUrl:"https://i.loli.net/2018/08/21/5b7bbc8ec3633.jpg",title:"这是大招牌-3",texts:["这是一段招牌的演示文字-3-1","这是一段招牌的演示文字-3-2"]}],navs:[{text:"twitter",url:"https://twitter.com/"},{text:"facebook",url:"https://facebook.com/"},{text:"微博",url:"https://weibo.com/"},{text:"知乎",url:"https://www.zhihu.com/"}]}}}},components:{fullImage:l(521).default}},r=l(81),c=l(525),component=Object(r.a)(n,(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("b-carousel",{attrs:{interval:t.config.interval,fade:"",indicators:""}},t._l(t.config.brands,(function(e,i){return l("b-carousel-slide",{key:i,attrs:{background:"rgba(255, 255, 255, 1)"},scopedSlots:t._u([{key:"img",fn:function(){return[l("full-image",{attrs:{url:e.imageUrl}})]},proxy:!0}],null,!0)},[t._v(" "),l("b-container",{attrs:{fluid:""}},[l("b-row",{staticClass:"text-center",attrs:{"align-v":"center"}},[l("b-col",{attrs:{lg:"2",md:"1",sm:"0",xl:"2"}}),t._v(" "),l("b-col",{attrs:{lg:"8",md:"10",sm:"12",xl:"8"}},[e.title?l("b-card",{staticClass:"black-background-5",staticStyle:{border:"none"},attrs:{title:e.title,"title-tag":"h1"}},t._l(e.texts,(function(text,e){return l("b-card-text",{key:e,staticClass:"white"},[t._v(t._s(text))])})),1):t._e()],1),t._v(" "),l("b-col",{attrs:{lg:"2",md:"1",sm:"0",xl:"2"}})],1),t._v(" "),l("b-row",{staticClass:"text-center",attrs:{"align-v":"center"}},[l("b-col",{attrs:{lg:"2",md:"1",sm:"0",xl:"2"}}),t._v(" "),l("b-col",{attrs:{lg:"8",md:"10",sm:"12",xl:"8"}},t._l(t.config.navs,(function(nav,e){return l("b-badge",{key:e,staticClass:"black-background-5",attrs:{pill:""}},[l("a",{staticClass:"white",attrs:{href:nav.url,target:"_blank"},domProps:{textContent:t._s(nav.text)}})])})),1),t._v(" "),l("b-col",{attrs:{lg:"2",md:"1",sm:"0",xl:"2"}})],1)],1)],1)})),1)}),[],!1,null,"26b2b3f5",null);"function"==typeof c.default&&Object(c.default)(component);e.default=component.exports;installComponents(component,{FullImage:l(461).default})}}]);