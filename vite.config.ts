import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'";
export default defineConfig({
 plugins:[react(),{name:'production-content-security-policy',apply:'build',transformIndexHtml(){return [{tag:'meta',attrs:{'http-equiv':'Content-Security-Policy',content:csp},injectTo:'head-prepend'}];}}],
 build:{sourcemap:false},server:{host:'127.0.0.1'},
 preview:{host:'127.0.0.1',headers:{'Content-Security-Policy':csp+"; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()'}}
});
