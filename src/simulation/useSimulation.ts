import { useEffect, useReducer, useState } from 'react';
import type { Engine } from '../types';
import { initialState, transition } from './model';
export function useReducedMotion() {
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)'); const change=()=>setReduced(m.matches);m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[]);
 return reduced;
}
export function useSimulation(engine:Engine) {
 const [state,dispatch]=useReducer(transition,engine,initialState);
 const reduced=useReducedMotion();
 useEffect(()=>{let frame=0;let last=performance.now();const tick=(now:number)=>{dispatch({type:'tick',dt:(now-last)/1000,reduced});last=now;frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[reduced]);
 return {state,dispatch,reduced};
}
