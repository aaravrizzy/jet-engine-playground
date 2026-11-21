import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/readme',timeout:90000,use:{baseURL:'http://127.0.0.1:5173',viewport:{width:1440,height:1100},deviceScaleFactor:1,launchOptions:{channel:'msedge'}},webServer:{command:'npm run dev -- --port 5173 --strictPort',url:'http://127.0.0.1:5173',reuseExistingServer:true}});
