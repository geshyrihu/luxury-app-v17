import{a as z}from"./chunk-EQHJMZVQ.js";import{h as P}from"./chunk-SZPHH6CO.js";import"./chunk-33D5ATNK.js";import{a as T}from"./chunk-V3WBGSLQ.js";import"./chunk-MK3UTQGM.js";import"./chunk-LRAUUQVI.js";import"./chunk-7ANUR2EW.js";import"./chunk-AZO7VNC4.js";import{p as y}from"./chunk-MIEORJZ2.js";import"./chunk-FQKZZ3J4.js";import{B as E}from"./chunk-RBLK56XA.js";import{Db as b,Eb as S,Fb as H,Gb as g,Hb as _,Ib as t,Jb as e,Kb as d,Ya as f,Za as I,_b as h,ec as o,fc as p,ja as c,jb as a,la as x,oc as C,vb as l,yc as u,zc as v}from"./chunk-3JZBD3P2.js";import"./chunk-G2X5OL7Z.js";function w(i,n){if(i&1&&(t(0,"tr")(1,"td"),d(2,"img",7),e(),t(3,"td")(4,"p",8),o(5),e(),t(6,"p",8),o(7),e(),t(8,"p",8),o(9),e(),d(10,"p",9),u(11,"sanitizeHtml"),d(12,"p",9),u(13,"sanitizeHtml"),e()()),i&2){let r=n.$implicit,s=h(2);a(2),l("src",s.base_urlImg+r.photoPath,I),a(3),p(r.nameTool),a(2),p(r.brand),a(2),p(r.model),a(1),l("innerHTML",v(11,6,r.technicalSpecifications),f),a(2),l("innerHTML",v(13,8,r.observations),f)}}function D(i,n){if(i&1&&(t(0,"table",2)(1,"thead",3)(2,"tr")(3,"th",4)(4,"p",5),o(5,"Imagen"),e()(),t(6,"th",6),o(7,"Descripci\xF3n"),e(),t(8,"th",6),o(9,"Observaciones"),e()()(),t(10,"tbody"),g(11,w,14,10,"tr",null,H),e()()),i&2){let r=h();a(11),_(r.data)}}var U=(()=>{let n=class n{constructor(){this.reporteHerramientasPdfService=c(P),this.customerIdService=c(T),this.data=[],this.base_urlImg=""}ngOnInit(){this.urlImg(),this.data=this.reporteHerramientasPdfService.getData()}urlImg(){this.base_urlImg=`${y.base_urlImg}customers/${this.customerIdService.customerId}/tools/`}};n.\u0275fac=function(m){return new(m||n)},n.\u0275cmp=x({type:n,selectors:[["app-informe-herramienta-pdf"]],standalone:!0,features:[C],decls:3,vars:1,consts:[[1,"h3"],["class","table table-bordered"],[1,"table","table-bordered"],[1,"thead-dark"],[2,"width","30%"],[1,"font-normal"],[2,"width","35%"],["alt","","width","100px","height","80px",3,"src"],[1,"mb-0"],[1,"font-normal","mb-0",3,"innerHTML"]],template:function(m,M){m&1&&(t(0,"h3",0),o(1,"Inventario de Herramientas"),e(),b(2,D,13,0,"table",1)),m&2&&(a(2),S(2,M.data?2:-1))},dependencies:[E,z],encapsulation:2});let i=n;return i})();export{U as default};