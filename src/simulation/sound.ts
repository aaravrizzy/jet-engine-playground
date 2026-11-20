import type {SimState} from './model';
// Original sound design, not measured acoustic signatures or real RPM mappings.
const profiles={
 trent:{fundamental:42,fanRange:96,harmonic:2.03,ipBase:180,ipRange:530,coreBase:290,coreRange:920,airBase:220,airRange:1600,rumble:.30,hiss:.14},
 genx:{fundamental:57,fanRange:135,harmonic:2.98,ipBase:0,ipRange:0,coreBase:370,coreRange:1150,airBase:350,airRange:2300,rumble:.21,hiss:.19},
};
export function soundTargets(state:SimState,enabled:boolean){
 const p=profiles[state.engineId as keyof typeof profiles]??profiles.genx;
 const lp=(state.speeds.lp??0)/100,ip=(state.speeds.ip??0)/100,hp=(state.speeds.hp??0)/100;
 const fan=p.fundamental+p.fanRange*lp;
 return {frequencies:[fan,fan*p.harmonic,p.ipBase+p.ipRange*ip,p.coreBase+p.coreRange*hp],
 levels:[.25,.075,state.speeds.ip===undefined?0:.045,.035],
 master:enabled&&!state.paused&&state.phase!=='off'?.20*Math.max(lp,hp*.35):0,
 rumble:p.rumble*(.5+.5*lp),hiss:p.hiss*(.2+.8*lp),cutoff:p.airBase+p.airRange*lp};
}
