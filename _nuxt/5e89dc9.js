(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{515:function(t,e){},541:function(t,e,r){"use strict";var n=r(515),c=r.n(n);e.default=c.a},547:function(t,e,r){"use strict";r.r(e);r(11),r(26),r(17);var n=r(59),c=r.n(n),o={name:"breadcrumbPath",props:{basePath:{default:function(){return"/"}},folderPath:{default:function(){return"a/b/c"}}},computed:{items:function(){for(var t=[],e=this.folderPath.split("/"),r=this.basePath,i=0;i<e.length;i++)r=c.a.join(r,e[i]),t.push({text:e[i],url:r+"/1/"});return t}}},f=r(84),l=r(541),component=Object(f.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("b-breadcrumb",{staticClass:"white-background-8"},[r("b-breadcrumb-item",{attrs:{href:this.basePath+"/1/"}},[r("b-icon",{attrs:{icon:"house-fill"}})],1),t._v(" "),t._l(t.items,(function(e,i){return r("b-breadcrumb-item",{key:i,attrs:{href:e.url}},[t._v(t._s(e.text))])}))],2)}),[],!1,null,"5eae1579",null);"function"==typeof l.default&&Object(l.default)(component);e.default=component.exports}}]);