(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{460:function(t,e){},473:function(t,e,n){"use strict";n.r(e);n(11),n(18);var o=n(161),r={name:"pagination",props:{total:{default:function(){return 1e3}},pageSize:{default:function(){return 10}},currentPage:{default:function(){return 15}}},methods:{change:function(t){var e=o.default.getBasePath(),path=window.location.pathname.replace(e,""),n=o.default.parsePath(path).folderPath;window.location.href=n+"/"+t+"/"}}},l=n(81),c=n(484),component=Object(l.a)(r,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("b-pagination",{staticClass:"white-background-8",attrs:{"hide-ellipsis":!0,limit:12,"per-page":t.pageSize,"total-rows":t.total,value:t.currentPage,align:"center",pills:""},on:{change:t.change}})}),[],!1,null,"cf8d758e",null);"function"==typeof c.default&&Object(c.default)(component);e.default=component.exports},484:function(t,e,n){"use strict";var o=n(460),r=n.n(o);e.default=r.a}}]);