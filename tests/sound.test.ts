import {it,expect} from 'vitest';
import {initialState} from '../src/simulation/model';
import {engines} from '../src/data/engines';
import {soundTargets} from '../src/simulation/sound';
it('gives engines distinct voices and only Trent an IP tone',()=>{const voices=engines.map(e=>soundTargets({...initialState(e),phase:'running',speeds:{lp:60,hp:80,...(e.id==='trent'?{ip:70}:{})}},true));expect(voices[0].frequencies).not.toEqual(voices[1].frequencies);expect(voices[0].levels[2]).toBeGreaterThan(0);expect(voices[1].levels[2]).toBe(0);expect(voices[0].cutoff).not.toBe(voices[1].cutoff);});
it('mutes off, paused or disabled audio and increases pitch with spool speed',()=>{const s={...initialState(engines[0]),phase:'running' as const,speeds:{lp:30,ip:40,hp:50}};expect(soundTargets(s,false).master).toBe(0);expect(soundTargets({...s,paused:true},true).master).toBe(0);expect(soundTargets({...s,phase:'off'},true).master).toBe(0);const high=soundTargets({...s,speeds:{lp:90,ip:90,hp:95}},true);expect(high.frequencies[0]).toBeGreaterThan(soundTargets(s,true).frequencies[0]);expect(high.master).toBeGreaterThan(soundTargets(s,true).master);});
