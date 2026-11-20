import type { Engine } from '../types';
export interface SimState {
 engineId: string; phase: 'off'|'starting'|'running'|'stopping'; paused: boolean; slow: boolean;
 throttle: number; response: number; age: number; time: number; speeds: Record<string, number>; angles: Record<string, number>;
 temperature: number; fuel: number; thrust: number;
}
export type Action = {type:'start'|'stop'|'pause'|'slow'|'reset'} | {type:'throttle'; value:number} | {type:'switch'; engine:Engine} | {type:'tick'; dt:number; reduced?:boolean};
export function initialState(engine: Engine): SimState {
 return {engineId:engine.id,phase:'off',paused:false,slow:false,throttle:0,response:0,age:0,time:0,speeds:Object.fromEntries(engine.spools.map(s=>[s.id,0])),angles:Object.fromEntries(engine.spools.map(s=>[s.id,0])),temperature:0,fuel:0,thrust:0};
}
const approach = (value:number,target:number,dt:number,tau:number) => value + (target-value)*(1-Math.exp(-dt/tau));
export function transition(s:SimState, a:Action):SimState {
 if(a.type==='switch') return initialState(a.engine);
 if(a.type==='reset') return {...s,phase:'off',paused:false,slow:false,throttle:0,response:0,age:0,time:0,temperature:0,fuel:0,thrust:0,speeds:Object.fromEntries(Object.keys(s.speeds).map(k=>[k,0])),angles:Object.fromEntries(Object.keys(s.angles).map(k=>[k,0]))};
 if(a.type==='start') return s.phase==='off'||s.phase==='stopping'? {...s,phase:'starting',age:0,paused:false,throttle:0,response:0}:s;
 if(a.type==='stop') return s.phase==='running'||s.phase==='starting'? {...s,phase:'stopping',age:0,paused:false}:s;
 if(a.type==='pause') return {...s,paused:!s.paused};
 if(a.type==='slow') return {...s,slow:!s.slow};
 if(a.type==='throttle') return s.phase==='starting'||s.phase==='running'? {...s,throttle:Number.isFinite(a.value)?Math.max(0,Math.min(100,a.value)):s.throttle}:s;
 if(a.type!=='tick') return s;
 if(s.paused || s.phase==='off' || !Number.isFinite(a.dt) || a.dt<=0) return s;
 const dt=Math.min(a.dt,.1)*(s.slow?.25:1), age=s.age+dt;
 const powered=s.phase==='starting'||s.phase==='running';
 const response=approach(s.response,powered?s.throttle/100:0,dt,1.1);
 const startRamp=s.phase==='starting'?Math.min(1,age/4):1;
 const speeds:Record<string,number>={}, angles={...s.angles};
 for(const id of Object.keys(s.speeds)) {
  const idle=id==='lp'?22:id==='ip'?36:48;
  const target=powered?(idle+(100-idle)*Math.pow(response,.65))*startRamp:0;
  speeds[id]=approach(s.speeds[id],target,dt,id==='lp'?2.4:id==='ip'?1.7:1.2);
  if(!a.reduced) angles[id]=(angles[id]+dt*speeds[id]*(id==='lp'?1.7:id==='ip'?2.3:-2.9))%360;
 }
 const lit=powered&&age>.8;
 const temperature=approach(s.temperature,lit?(28+62*Math.pow(response,.65))*startRamp:0,dt,2.6);
 const fuel=approach(s.fuel,lit?(12+88*Math.pow(response,1.25))*startRamp:0,dt,.8);
 const thrust=approach(s.thrust,powered?(5+95*Math.pow(response,1.65))*startRamp:0,dt,2.8);
 const phase=s.phase==='starting'&&age>7?'running':s.phase==='stopping'&&age>18?'off':s.phase;
 if(phase==='off') return {...s,phase,age,temperature:0,fuel:0,thrust:0,response:0,speeds:Object.fromEntries(Object.keys(speeds).map(k=>[k,0]))};
 return {...s,phase,age,response,speeds,angles,temperature,fuel,thrust,time:s.time+(a.reduced?0:dt*(.3+speeds.lp/100))};
}


