(window.webpackJsonp=window.webpackJsonp||[]).push([[25,9,16,18,19,20],{493:function(t,e){},495:function(t,e,n){var content=n(505);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(62).default)("4cba49aa",content,!0,{sourceMap:!1})},499:function(t,e){},500:function(t,e){},503:function(t,e,n){"use strict";n.r(e);var r={name:"fullImage",props:{url:{default:function(){return"https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png"}}}},l=(n(504),n(84)),o=n(506),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"full-image",style:{backgroundImage:"url("+t.url+")"}})}),[],!1,null,"01e101de",null);"function"==typeof o.default&&Object(o.default)(component);e.default=component.exports},504:function(t,e,n){"use strict";n(495)},505:function(t,e,n){var r=n(61)(!1);r.push([t.i,".full-image[data-v-01e101de]{background-repeat:no-repeat;background-position:50%;background-attachment:fixed;background-size:cover;height:100vh}",""]),t.exports=r},506:function(t,e,n){"use strict";var r=n(493),l=n.n(r);e.default=l.a},507:function(t,e){},508:function(t,e){},511:function(t,e,n){var content=n(523);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(62).default)("d4e9668a",content,!0,{sourceMap:!1})},512:function(t,e,n){"use strict";n.r(e);var r={name:"navbar",props:{config:{default:function(){return{brandText:"主页の名",brandUrl:"#",navs:[{text:"导航-1",url:"#"},{text:"导航-2",url:"#"},{text:"导航-3",url:"#"},{text:"导航-4",url:"#"},{text:"导航-5",url:"#"},{text:"导航-6",url:"#"},{text:"导航-7",url:"#"},{text:"导航-8",url:"#"},{text:"导航-9",url:"#"},{text:"导航-0",url:"#"}]}}}},data:function(){return{show:!1}}},l=(n(522),n(84)),o=n(524),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("b-navbar",{class:t.show?"white-background-8":"transparent",staticStyle:{transition:"background-color 1000ms"},attrs:{fixed:"top",toggleable:"md"},nativeOn:{mouseenter:function(e){t.show=!0},mouseleave:function(e){t.show=!1}}},[n("b-navbar-brand",{class:t.show?"transparent":"white-background-6",staticStyle:{"border-radius":"0.5em",padding:"0.2em",transition:"background-color 1000ms"},attrs:{href:t.config.brandUrl,tag:"h1"}},[n("b",{staticStyle:{color:"rgba(51, 51, 51, 0.7)"}},[t._v(t._s(t.config.brandText))])]),t._v(" "),n("b-navbar-toggle",{attrs:{target:"nav-collapse"}}),t._v(" "),t.show?n("b-collapse",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],attrs:{id:"nav-collapse","is-nav":""}},[n("b-navbar-nav",{attrs:{align:"right"}},t._l(t.config.navs?t.config.navs:[],(function(nav,i){return n("b-nav-item",{key:i,attrs:{href:nav.url}},[n("b",[t._v(t._s(nav.text))])])})),1),t._v(" "),n("b-navbar-nav",{attrs:{align:"right"}})],1):t._e()],1)}),[],!1,null,"54d21bf2",null);"function"==typeof o.default&&Object(o.default)(component);e.default=component.exports},520:function(t,e,n){"use strict";n.r(e);var r={name:"pageHead",props:{config:{default:function(){return{brands:[{imageUrl:"https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png",title:"这是大招牌-1",texts:["这是一段招牌的演示文字-1-1","这是一段招牌的演示文字-1-2"]},{imageUrl:"https://i.loli.net/2018/04/10/5accdcbcb1738.jpg",title:"这是大招牌-2",texts:["这是一段招牌的演示文字-2-1","这是一段招牌的演示文字-2-2"]},{imageUrl:"https://i.loli.net/2018/08/21/5b7bbc8ec3633.jpg",title:"这是大招牌-3",texts:["这是一段招牌的演示文字-3-1","这是一段招牌的演示文字-3-2"]}]}}},slide:{default:function(){return Math.floor(Math.random()*this.config.brands.length)}}},components:{fullImage:n(503).default}},l=n(84),o=n(521),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("b-carousel",{attrs:{interval:0,controls:"",fade:"",indicators:""},model:{value:t.slide,callback:function(e){t.slide=e},expression:"slide"}},t._l(t.config.brands,(function(e,i){return n("b-carousel-slide",{key:i,attrs:{background:"rgba(255, 255, 255, 0)"},scopedSlots:t._u([{key:"img",fn:function(){return[n("full-image",{staticStyle:{"max-height":"50vh"},attrs:{url:e.imageUrl}})]},proxy:!0}],null,!0)},[t._v(" "),e.title?n("b-card",{staticClass:"black-background-5",staticStyle:{border:"none"},attrs:{title:e.title,"title-tag":"h1"}},t._l(e.texts,(function(text,e){return n("b-card-text",{key:e,staticClass:"white"},[t._v(t._s(text))])})),1):t._e()],1)})),1)}),[],!1,null,"1a4d6c16",null);"function"==typeof o.default&&Object(o.default)(component);e.default=component.exports;installComponents(component,{FullImage:n(503).default})},521:function(t,e,n){"use strict";var r=n(499),l=n.n(r);e.default=l.a},522:function(t,e,n){"use strict";n(511)},523:function(t,e,n){var r=n(61)(!1);r.push([t.i,".navbar-nav[data-v-54d21bf2]{width:100%;text-align:center}.navbar-nav li[data-v-54d21bf2]{float:none;display:inline-block;text-align:center}",""]),t.exports=r},524:function(t,e,n){"use strict";var r=n(500),l=n.n(r);e.default=l.a},527:function(t,e,n){"use strict";n.r(e);var r=n(35),l={name:"pageFoot",props:{config:{default:function(){return{lines:[[{text:"Copyright © 2017-? ."},{text:"备案？不存在的"},{text:"Powered by Nuxt.js & Github"}],[{text:"友链："},{text:"Github",url:"https://github.com/"},{text:"Nuxt.js",url:"https://nuxtjs.org/"}]]}}},buildTime:{default:function(){return new Date}}},computed:{buildDate:function(){return r.default.formatDate(this.buildTime,"YYYY-MM-DD")}}},o=n(84),c=n(531),component=Object(o.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("b-card",{staticClass:"text-center blue-background-8",staticStyle:{border:"none"}},[t._l(t.config.lines,(function(line,i){return n("b-card-text",{key:i,staticClass:"white"},t._l(line,(function(content,e){return n("b-badge",{key:e,staticClass:"transparent",staticStyle:{"margin-left":"0.5em","margin-right":"0.5em"}},[n("a",{staticClass:"white",attrs:{href:content.url,target:"_blank"},domProps:{textContent:t._s(content.text)}})])})),1)})),t._v(" "),n("b-card-text",{staticClass:"white"},[n("b-badge",{staticClass:"transparent",staticStyle:{"margin-left":"0.5em","margin-right":"0.5em"}},[n("a",{staticClass:"white",domProps:{textContent:t._s("buildTime: "+t.buildDate)}})])],1)],2)}),[],!1,null,"561c0f9d",null);"function"==typeof c.default&&Object(c.default)(component);e.default=component.exports},528:function(t,e,n){"use strict";n.r(e);var r={name:"backtop"},l=n(84),o=n(532),component=Object(l.a)(r,(function(){var t=this.$createElement;return(this._self._c||t)("el-backtop",{staticClass:"white-background-6"})}),[],!1,null,"0f5cfe76",null);"function"==typeof o.default&&Object(o.default)(component);e.default=component.exports},531:function(t,e,n){"use strict";var r=n(507),l=n.n(r);e.default=l.a},532:function(t,e,n){"use strict";var r=n(508),l=n.n(r);e.default=l.a},575:function(t,e,n){"use strict";n.r(e);var r=n(24),l=(n(71),n(512)),o=n(520),c=n(527),f=n(528),d=n(560),v=n(131),h=n(166),m={name:"page",asyncData:function(t){return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,l,o,c,f,d,m,x,_,k,w;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.params,r=t.$content,l=v.default.getNavbarConfig(),o=v.default.getHomeConfig(),c=v.default.getPageFootConfig(),f=v.default.getSiteConfig(),d=v.default.parsePath(n.pathMatch),m=d.folderPath,x=d.currentPage,e.next=8,r(m,{deep:!0}).fetch();case 8:return _=e.sent,k=v.default.content2Files(_),(k=h.default.sortContentByLevel(k)).reverse(),w=v.default.page(k,x,f.pageSize),e.abrupt("return",{navbarConfig:l,homeConfig:o,pageFootConfig:c,buildTime:new Date,basePath:"/page",folderPath:m,pageSize:f.pageSize,total:k.length,currentPage:x,files:w});case 14:case"end":return e.stop()}}),e)})))()},components:{navbar:l.default,pageHead:o.default,fileListAndPage:d.default,pageFoot:c.default,backtop:f.default}},x=n(84),component=Object(x.a)(m,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("navbar",{attrs:{config:t.navbarConfig}}),t._v(" "),n("b-container",[n("br"),t._v(" "),n("page-head",{attrs:{config:t.homeConfig}}),t._v(" "),n("br"),t._v(" "),n("file-list-and-page",{attrs:{basePath:t.basePath,folderPath:t.folderPath,files:t.files,currentPage:t.currentPage,pageSize:t.pageSize,total:t.total}})],1),t._v(" "),n("page-foot",{attrs:{config:t.pageFootConfig,buildTime:t.buildTime}}),t._v(" "),n("backtop")],1)}),[],!1,null,"2d256b0a",null);e.default=component.exports;installComponents(component,{Navbar:n(512).default,PageHead:n(520).default,FileListAndPage:n(560).default,PageFoot:n(527).default,Backtop:n(528).default})}}]);