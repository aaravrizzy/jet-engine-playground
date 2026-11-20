import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/production',timeout:60000,use:{baseURL:'http://127.0.0.1:4173',launchOptions:{channel:'msedge'}},webServer:{command:'npm run preview -- --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:false}});
