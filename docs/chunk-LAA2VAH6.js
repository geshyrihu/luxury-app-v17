import{b as c}from"./chunk-AZO7VNC4.js";import{p as n}from"./chunk-FQKZZ3J4.js";import{Z as o,ca as a,ja as r}from"./chunk-3JZBD3P2.js";var d=(()=>{let t=class t{constructor(){this.authService=r(c),this.route=r(n)}canActivate(s,i){return this.authService.validationToken().pipe(o(f=>{f||this.route.navigateByUrl("/auth/login")}))}};t.\u0275fac=function(i){return new(i||t)},t.\u0275prov=a({token:t,factory:t.\u0275fac,providedIn:"root"});let e=t;return e})();export{d as a};