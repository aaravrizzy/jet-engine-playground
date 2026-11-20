import type { Engine } from '../types';
export const sources: Record<string, {title: string; url: string; scope: string}> = {
 rr: {title: 'Rolls-Royce · Trent XWB', url: 'https://www.rolls-royce.com/products-and-services/civil-aerospace/widebody/trent-xwb.aspx', scope: 'Trent XWB-84 application: Airbus A350-900.'},
 caa: {title: 'UK CAA · Trent XWB type certificate, issue 03', url: 'https://www.caa.co.uk/Documents/Download/3939/984aa08e-5352-4da9-824b-309ec7cec37d/4022', scope: '30 October 2026, section III.2: three coaxial shafts, component connections, fan diameter and stage counts.'},
 ge: {title: 'GE Aerospace · GEnx model comparison', url: 'https://www.geaerospace.com/commercial/aircraft-engines/genx', scope: 'GEnx-1B70 / 787-8 column: aircraft application, fan diameter and stage counts.'},
 ntsb: {title: 'NTSB · ENG24LA014 powerplants report', url: 'https://data.ntsb.gov/Docket/Document/docBLOB?FileExtension=pdf&FileName=ENG24LA014+-+Powerplant+Factual+Report+FINAL+July2025-Rel.pdf&ID=19028934', scope: '25 July 2025, page 17 section 1.3: GEnx-1B dual-rotor architecture and connections. Incident-specific ratings are not used.'},
 nasa: {title: 'NASA Glenn · Turbofan engines', url: 'https://www.grc.nasa.gov/www/k-12/airplane/Animation/turbtyp/etft.html', scope: 'General airflow, bypass, turbine power and thrust principles. No artwork reused.'},
};
export const engines: Engine[] = [
 {id:'trent',name:'Trent XWB',variant:'Trent XWB-84',manufacturer:'Rolls-Royce',aircraft:'Airbus A350-900',applicationSource:'rr',architectureSource:'caa',summary:'Three shafts. Three independent rotating assemblies.',
 spools:[
 {id:'lp',name:'Low pressure',gauge:'N1',color:'#67ccff',drives:['fan'],turbine:'lpt',start:190,end:825,radius:5},
 {id:'ip',name:'Intermediate pressure',gauge:'N2',color:'#a9a0ff',drives:['ipc'],turbine:'ipt',start:330,end:745,radius:12},
 {id:'hp',name:'High pressure',gauge:'N3',color:'#ffbf72',drives:['hpc'],turbine:'hpt',start:460,end:663,radius:19}],
 components:[
 {id:'fan',label:'Fan',stage:0,x:190,width:44,height:236,spool:'lp'},
 {id:'ipc',label:'IP compressor',stage:1,x:330,width:104,height:115,spool:'ip'},
 {id:'hpc',label:'HP compressor',stage:1,x:460,width:80,height:110,spool:'hp'},
 {id:'hpt',label:'HP turbine',stage:3,x:663,width:40,height:112,spool:'hp'},
 {id:'ipt',label:'IP turbine',stage:3,x:745,width:46,height:140,spool:'ip'},
 {id:'lpt',label:'LP turbine',stage:3,x:825,width:65,height:151,spool:'lp'}],
 specs:[{label:'Fan diameter',value:'118 in (3.00 m)',source:'caa'},{label:'Compressor stages',value:'1 fan / 8 IP / 6 HP',source:'caa'},{label:'Turbine stages',value:'1 HP / 2 IP / 6 LP',source:'caa'}]},
 {id:'genx',name:'GEnx-1B',variant:'GEnx-1B70',manufacturer:'GE Aerospace',aircraft:'Boeing 787-8',applicationSource:'ge',architectureSource:'ntsb',summary:'Two shafts. The fan and booster share one assembly.',
 spools:[
 {id:'lp',name:'Low pressure',gauge:'N1',color:'#67ccff',drives:['fan','booster'],turbine:'lpt',start:190,end:800,radius:5},
 {id:'hp',name:'High pressure',gauge:'N2',color:'#ffbf72',drives:['hpc'],turbine:'hpt',start:450,end:670,radius:17}],
 components:[
 {id:'fan',label:'Fan',stage:0,x:190,width:44,height:236,spool:'lp'},
 {id:'booster',label:'LP booster',stage:1,x:315,width:82,height:121,spool:'lp'},
 {id:'hpc',label:'HP compressor',stage:1,x:450,width:106,height:110,spool:'hp'},
 {id:'hpt',label:'HP turbine',stage:3,x:670,width:54,height:112,spool:'hp'},
 {id:'lpt',label:'LP turbine',stage:3,x:800,width:106,height:150,spool:'lp'}],
 specs:[{label:'Fan diameter',value:'111.1 in',source:'ge'},{label:'Compressor stages',value:'1 fan / 4 booster / 10 HP',source:'ge'},{label:'Turbine stages',value:'2 HP / 7 LP',source:'ge'}]},
];
export const stages = [
 {title:'Intake & fan',short:'Intake',subtitle:'One entrance. Two paths.',air:'Incoming air enters the intake and meets the fan. After the fan, the flow splits: some enters the core; the rest travels around it through the bypass passage.',purpose:'The intake guides the air. The fan accelerates a large stream of air, including the bypass flow that contributes to thrust.',fact:'Bypass air never passes through the combustion chamber.'},
 {title:'Compression',short:'Compress',subtitle:'Prepare the air for combustion.',air:'The core compressors increase the pressure of the air. Its temperature also rises as work is done on it.',purpose:'Compressed air supports sustained combustion. The GEnx booster shares the fan shaft; the Trent IP compressor has its own shaft.',fact:'A spool is a connected rotating assembly, not one blade row.'},
 {title:'Combustion',short:'Burn',subtitle:'A continuous release of heat.',air:'Fuel mixes with compressed air and burns continuously. The gas becomes much hotter; it does not undergo piston-style explosions.',purpose:'The combustor adds energy to the flow. In a real engine, some air is also used for cooling and mixing; those paths are omitted here.',fact:'The orange region represents continuous combustion, not an afterburner.'},
 {title:'Turbine',short:'Extract',subtitle:'Hot gas does mechanical work.',air:'Hot gas expands through the turbines, giving up some energy as the turbine assemblies rotate.',purpose:'Concentric shafts carry that turbine power forward to the compressors and fan. Matching colours show components on the same shaft.',fact:'Each spool rotates independently. Components on one spool rotate together.'},
 {title:'Exhaust & thrust',short:'Exhaust',subtitle:'Accelerating air moves the aircraft.',air:'Core gas leaves after the turbines. The cooler bypass stream leaves around the core through its own exhaust path.',purpose:'Both streams contribute to thrust by changing the momentum of the air. Nozzle pressure forces can also contribute.',fact:'While running, all five sections work continuously together.'},
];


