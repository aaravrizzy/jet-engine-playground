import type { SimState } from './model';
/** Qualitative gas-path teaching profile, not a thermodynamic or metal-temperature model. */
export function thermalProfile(state:SimState){
 const heat=state.temperature/100;
 const compression=(state.speeds.hp??0)/100;
 return [
  {name:'Intake',index:0,note:'Example ambient air is fixed at 20 °C (68 °F), not live weather.'},
  {name:'Fan / bypass',index:compression*8,note:'The fan does work on the air, so bypass air warms slightly. It does not enter combustion.'},
  {name:'Compression',index:compression*35,note:'Compression raises the air temperature before fuel is added.'},
  {name:'Combustor exit',index:heat*100,note:'The hottest gas-path region in this teaching profile. This is gas temperature, not blade or casing temperature.'},
  {name:'Turbines',index:heat*73,note:'Gas cools as it expands and transfers energy to the turbines; the real temperature varies through the section.'},
  {name:'Core exhaust',index:heat*52,note:'Gas remains hot after giving up energy in the turbines.'},
 ].map(v=>({...v,label:v.index<1?'Ambient':v.index<12?'Warm':v.index<28?'Hot':v.index<55?'Very hot':'Hottest'}));
}
export type TemperatureUnit = 'C'|'F';
// Deliberately chosen example scale, NOT manufacturer data or a calibrated conversion from heat index.
export const exampleCelsius = (heatIndex:number) => 20 + Math.max(0,Math.min(100,heatIndex))*12;
export const convertTemperature = (celsius:number,unit:TemperatureUnit) => unit==='F'?celsius*9/5+32:celsius;
export const formatTemperature = (heatIndex:number,unit:TemperatureUnit) => `${Math.round(convertTemperature(exampleCelsius(heatIndex),unit))} °${unit}`;

