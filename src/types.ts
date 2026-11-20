export type SpoolId = 'lp' | 'ip' | 'hp';
export interface Spool { id: SpoolId; name: string; gauge: string; color: string; drives: string[]; turbine: string; start: number; end: number; radius: number }
export interface Component { id: string; label: string; stage: number; x: number; width: number; height: number; spool: SpoolId }
export interface Engine { id: string; name: string; variant: string; manufacturer: string; aircraft: string; applicationSource: string; architectureSource: string; summary: string; spools: Spool[]; components: Component[]; specs: {label: string; value: string; source: string}[] }
export interface Layers { airflow: boolean; shafts: boolean; labels: boolean; casing: boolean }
