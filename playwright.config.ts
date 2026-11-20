import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',timeout:60000,fullyParallel:false,workers:1,reporter:'list',use:{baseURL:'http://127.0.0.1:5173',headless:true,launchOptions:{channel:'msedge'},viewport:{width:1440,height:1100}},webServer:{command:'npm run dev -- --port 5173 --strictPort',url:'http://127.0.0.1:5173',reuseExistingServer:true}});

