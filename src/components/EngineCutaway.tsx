import { thermalProfile, formatTemperature, type TemperatureUnit } from '../simulation/thermal';
import { useId } from 'react';
import type { Engine, Layers } from '../types';
import type { SimState } from '../simulation/model';
interface Props { temperatureUnit:TemperatureUnit; engine:Engine; state:SimState; layers:Layers; selected:number|null; onStage:(stage:number)=>void }
export default function EngineCutaway({engine,state,layers,selected,onStage,temperatureUnit}:Props) {
 const uid=useId().replace(/:/g,'');
 const dim=(stage:number)=>selected===null||selected===stage?1:.3;
 const core='M 5 150 C 65 148 108 170 190 170 Q 240 150 290 170 L 440 184 L 530 184 Q 574 172 615 183 L 670 178 L 825 159 Q 920 157 1060 178';
 const bypass='M 5 82 C 70 80 113 113 185 113 Q 245 87 320 98 L 810 101 Q 910 103 1060 119';
 const active=state.phase!=='off';
 const selectKey=(event:React.KeyboardEvent,stage:number)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onStage(stage);}};
 const hit=(stage:number,label:string)=>({role:'button',tabIndex:0,'aria-label':`Explore ${label}`,'aria-pressed':selected===stage,onClick:()=>onStage(stage),onKeyDown:(e:React.KeyboardEvent)=>selectKey(e,stage),className:'svg-hit'});
 return <svg viewBox="0 0 1100 440" className="engine-svg" aria-label={`${engine.variant} ${engine.spools.length}-spool educational cutaway`}>
  <defs><linearGradient id={`${uid}-blade`} x1="0" x2="1"><stop stopColor="#354c5b"/><stop offset=".38" stopColor="#a4b6c0"/><stop offset=".53" stopColor="#ecf0ed"/><stop offset=".66" stopColor="#879ba8"/><stop offset="1" stopColor="#2d4556"/></linearGradient>
   <linearGradient id={`${uid}-metal`} x2="0" y2="1"><stop stopColor="#dae3e7"/><stop offset=".18" stopColor="#718390"/><stop offset=".47" stopColor="#293c49"/><stop offset=".7" stopColor="#a2b0ba"/><stop offset="1" stopColor="#3a4b58"/></linearGradient>
   <linearGradient id={`${uid}-gas`}><stop stopColor="#75d7fa"/><stop offset=".48" stopColor="#75d7fa"/><stop offset=".57" stopColor="#ffb154"/><stop offset="1" stopColor="#ef7955"/></linearGradient>
   <linearGradient id={`${uid}-fire`}><stop stopColor="#ffbb67" stopOpacity=".05"/><stop offset=".45" stopColor="#ffb35b" stopOpacity=".7"/><stop offset="1" stopColor="#f16c45" stopOpacity=".12"/></linearGradient>
  </defs>
  {layers.labels&&<g className="heat-callouts">{thermalProfile(state).filter((_,i)=>i!==1).map((t,i)=><g key={t.name} transform={`translate(${[72,390,590,755,1005][i]} 24)`}><text textAnchor="middle" fill={t.index>28?'#ffc18a':'#94d3e4'}>{t.name.toUpperCase()}</text><text y="17" textAnchor="middle" fill="#b9c7cf">{formatTemperature(t.index,temperatureUnit)} · example</text></g>)}</g>}
  <line x1="24" y1="230" x2="1070" y2="230" stroke="#344254" strokeDasharray="5 7"/>
  {layers.casing&&<g data-testid="casing" fill={`url(#${uid}-metal)`} stroke="#576a7f" strokeWidth="1.5" opacity=".92">
   <path d="M130 78 Q133 56 175 55 L740 67 Q847 71 933 105 L905 113 Q830 93 740 92 L175 81 Q144 80 130 94Z"/>
   <path d="M130 382 Q133 404 175 405 L740 393 Q847 389 933 355 L905 347 Q830 367 740 368 L175 379 Q144 380 130 366Z"/>
  </g>}
  <g fill="#111d2a" stroke="#50657b" strokeWidth="1.4">
   <path d="M247 146 Q305 126 400 148 L542 164 Q589 144 637 154 L850 130 L950 170 L936 178 L846 147 L638 169 Q587 158 543 179 L398 162 Q310 140 247 159Z"/>
   <path d="M247 314 Q305 334 400 312 L542 296 Q589 316 637 306 L850 330 L950 290 L936 282 L846 313 L638 291 Q587 302 543 281 L398 298 Q310 320 247 301Z"/>
  </g>
  <g {...hit(2,'combustion')} opacity={dim(2)}>
   <rect x="548" y="164" width="85" height="132" rx="16" fill="#392c26" stroke="#f6a65e" strokeDasharray="4 5"/>
   {[0,1].map(i=><path key={i} transform={i?'translate(0 460) scale(1 -1)':undefined} d="M550 180 Q570 164 589 177 Q614 166 633 188 Q604 200 573 194Z" fill={`url(#${uid}-fire)`} opacity={active?Math.max(.2,state.fuel/100):.12}/>)}
  </g>
  <g fill={`url(#${uid}-metal)`} stroke="#718194" strokeWidth="1.3">
   <path d="M107 230 Q146 205 188 205 L240 211 L352 204 L529 208 L640 208 L850 200 L973 230 L850 260 L640 252 L529 252 L352 256 L240 249 L188 255 Q146 255 107 230Z"/>
  </g>
  {layers.shafts&&<g data-testid="shafts">{[...engine.spools].reverse().map(s=><g key={s.id} data-spool={s.id}>
   <rect x={s.start} y={230-s.radius} width={s.end-s.start} height={2*s.radius} rx={s.radius} fill="#101923" stroke={s.color} strokeWidth="2"/>
   <line x1={s.start} y1={230+Math.sin(state.angles[s.id]*Math.PI/180)*s.radius} x2={s.end} y2={230+Math.sin(state.angles[s.id]*Math.PI/180)*s.radius} stroke={s.color} opacity=".7"/>
  </g>)}</g>}
  {engine.components.map(c=>{const s=engine.spools.find(s=>s.id===c.spool)!;const rad=state.angles[s.id]*Math.PI/180;return <g key={c.id} {...hit(c.stage,c.label)} opacity={dim(c.stage)} data-component={c.id} data-shaft={s.id}>
   <rect x={c.x-c.width/2} y={230-c.height/2} width={c.width} height={c.height} rx={c.id==='fan'?20:5} fill={s.color} fillOpacity="0" stroke="none"/>
   <ellipse cx={c.x} cy="230" rx={c.width/2} ry={c.height/2} fill="none" stroke="#b6c4ce" opacity=".35"/>
   {Array.from({length:12},(_,i)=>{const angle=rad+i*Math.PI/6;const tip=Math.sin(angle)*c.height/2;const depth=Math.cos(angle);return <path key={i} d={`M ${c.x-5} ${230+tip*.12} Q ${c.x-c.width*.4} ${230+tip*.6} ${c.x+depth*c.width*.3-8} ${230+tip} L ${c.x+depth*c.width*.3+7} ${230+tip*.95} Q ${c.x+c.width*.35} ${230+tip*.5} ${c.x+5} ${230+tip*.12} Z`} fill={`url(#${uid}-blade)`} stroke="#c3d1d9" strokeWidth=".45" opacity={.5+.4*(depth+1)/2}/>;})}   <circle cx={c.x} cy="230" r="5" fill={s.color}/>
  </g>})}
  {layers.airflow&&<g data-testid="airflow" fill="none" strokeWidth="2" opacity={active?.88:.22}>{[0,1].map(i=><g key={i} transform={i?'translate(0 460) scale(1 -1)':undefined}>
   {[0,1,2].map(n=><g key={n} opacity={.35+n*.12}>
    <path d={`M 5 ${85+n*12} C 70 ${83+n*12} 120 ${112+n*9} 190 ${115+n*9}`} stroke="#97dff4" strokeWidth="1"/>
    {Array.from({length:6},(_,j)=>{const t=((state.time*(.12+n*.02)+j/6)%1);const x=5+185*t;const y=(85+n*12)+(30-n*3)*(t*t*(3-2*t));return <ellipse key={j} cx={x} cy={y} rx={2+3*t} ry=".9" fill="#c2efff" stroke="none" opacity={Math.sin(t*Math.PI)*.8}/>;})}
   </g>)}
   <path data-flow="bypass" d={bypass} stroke="#67ccff" opacity=".25"/>
   <path d={bypass} stroke="#67ccff" strokeDasharray="24 34" strokeDashoffset={-state.time*55}/>
   <path data-flow="core" d={core} stroke={`url(#${uid}-gas)`} opacity=".3"/>
   <path d={core} stroke={`url(#${uid}-gas)`} strokeDasharray="18 29" strokeDashoffset={-state.time*68}/>
   <path d="M1043 112 L1060 119 L1043 126 M1043 171 L1060 178 L1043 185" stroke="#a3c1d0" strokeWidth="1.5"/>
  </g>)}</g>}
  <g {...hit(0,'intake and fan')} opacity={dim(0)}><rect x="35" y="145" width="105" height="170" fill="transparent"/>{layers.labels&&<text x="70" y="219" textAnchor="middle">AIR IN</text>}</g>
  <g {...hit(4,'exhaust and thrust')} opacity={dim(4)}><rect x="970" y="95" width="100" height="270" fill="transparent"/>{layers.labels&&<><text x="995" y="87" textAnchor="middle" fill="#67ccff">BYPASS</text><text x="1015" y="211" textAnchor="middle" fill="#ffbf72">CORE</text></>}</g>
  {layers.labels&&<g className="diagram-labels" textAnchor="middle" aria-hidden="true">
   <text x="480" y="72" fill="#67ccff">BYPASS PASSAGE</text>
   {engine.components.map(c=><g key={c.id}><line x1={c.x} y1={230+c.height/2+6} x2={c.x} y2={c.id==='fan'?369:338} stroke="#65758a"/><text x={c.x} y={c.id==='fan'?391:360} fill={engine.spools.find(s=>s.id===c.spool)!.color}>{c.label}</text></g>)}
   <line x1="590" y1="296" x2="590" y2="338" stroke="#65758a"/><text x="590" y="360" fill="#ffc18b">Combustor</text>
   <text x="580" y="419" fill="#899aaf">Concentric shafts share one centreline · blade silhouettes are illustrative; counts and geometry are not reproduced</text>
  </g>}
 </svg>;
}




