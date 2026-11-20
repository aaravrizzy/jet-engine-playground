import {useEffect,useRef,useState} from 'react';
import type {SimState} from './model';
import {soundTargets} from './sound';
type AudioRig={ctx:AudioContext;master:GainNode;tones:OscillatorNode[];levels:GainNode[];rumble:GainNode;hiss:GainNode;airFilter:BiquadFilterNode;noise:AudioBufferSourceNode};
function createRig():AudioRig{
 const ctx=new AudioContext();const master=ctx.createGain();master.gain.value=0;
 const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=12;limiter.ratio.value=8;master.connect(limiter);limiter.connect(ctx.destination);
 const levels:GainNode[]=[];
 const tones=[0,1,2,3].map(()=>{const tone=ctx.createOscillator();tone.type='sine';const gain=ctx.createGain();gain.gain.value=0;tone.connect(gain);gain.connect(master);levels.push(gain);tone.start();return tone;});
 // A long loop of generated noise provides airflow without downloaded recordings.
 const buffer=ctx.createBuffer(1,ctx.sampleRate*5,ctx.sampleRate);const channel=buffer.getChannelData(0);let seed=52173;
 for(let i=0;i<channel.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;channel[i]=(seed/4294967296)*2-1;}
 const noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;
 const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=180;low.Q.value=.5;
 const airFilter=ctx.createBiquadFilter();airFilter.type='bandpass';airFilter.frequency.value=300;airFilter.Q.value=.45;
 const rumble=ctx.createGain(),hiss=ctx.createGain();noise.connect(low);low.connect(rumble);rumble.connect(master);noise.connect(airFilter);airFilter.connect(hiss);hiss.connect(master);noise.start();
 return {ctx,master,tones,levels,rumble,hiss,airFilter,noise};
}
export function useEngineSound(state:SimState){
 const [enabled,setEnabled]=useState(false);const [error,setError]=useState('');
 const audio=useRef<AudioRig|null>(null);
 async function toggle(){try{if(!audio.current||audio.current.ctx.state==='closed')audio.current=createRig();await audio.current.ctx.resume();setEnabled(v=>!v);setError('');}catch{setEnabled(false);setError('Audio is unavailable in this browser. The simulator still works without sound.');}}
 useEffect(()=>{const a=audio.current;if(!a)return;const t=soundTargets(state,enabled);const now=a.ctx.currentTime;
 const smooth=(param:AudioParam,value:number)=>param.setTargetAtTime(value,now,.18);
 smooth(a.master.gain,t.master);a.tones.forEach((o,i)=>{smooth(o.frequency,Math.max(20,t.frequencies[i]));smooth(a.levels[i].gain,t.levels[i]);});smooth(a.rumble.gain,t.rumble);smooth(a.hiss.gain,t.hiss);smooth(a.airFilter.frequency,t.cutoff);
 },[state,enabled]);
 useEffect(()=>()=>{const a=audio.current;if(a){a.tones.forEach(o=>o.stop());a.noise.stop();void a.ctx.close();audio.current=null;}},[]);
 return {enabled,toggle,error};
}
