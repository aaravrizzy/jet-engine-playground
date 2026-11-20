import {it,expect} from 'vitest';
import {thermalProfile} from '../src/simulation/thermal';
import {initialState,transition} from '../src/simulation/model';
import {engines} from '../src/data/engines';
it('thermal profile rests at ambient and shows a hotter core than bypass',()=>{let s=initialState(engines[0]);expect(thermalProfile(s).every(v=>v.index===0)).toBe(true);s=transition(s,{type:'start'});s=transition(s,{type:'throttle',value:100});for(let i=0;i<500;i++)s=transition(s,{type:'tick',dt:.1});const p=thermalProfile(s);expect(p[3].index).toBeGreaterThan(p[4].index);expect(p[4].index).toBeGreaterThan(p[5].index);expect(p[2].index).toBeGreaterThan(p[1].index);expect(p.every(v=>v.index>=0&&v.index<=100)).toBe(true);});
import {convertTemperature,exampleCelsius,formatTemperature} from '../src/simulation/thermal';
it('converts example temperatures consistently without changing their physical value',()=>{expect(convertTemperature(0,'F')).toBe(32);expect(convertTemperature(100,'F')).toBe(212);expect(exampleCelsius(0)).toBe(20);expect(formatTemperature(0,'F')).toBe('68 °F');expect(formatTemperature(0,'C')).toBe('20 °C');});
