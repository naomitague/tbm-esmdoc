/** Full name for each Köppen–Geiger climate classification code, for hover tooltips on histogram bars. */
const KOPPEN_GEIGER_NAMES: Record<string, string> = {
  Af: 'Tropical rainforest',
  Am: 'Tropical monsoon',
  Aw: 'Tropical savanna, dry winter',
  As: 'Tropical savanna, dry summer',
  BWh: 'Hot desert',
  BWk: 'Cold desert',
  BSh: 'Hot semi-arid (steppe)',
  BSk: 'Cold semi-arid (steppe)',
  Csa: 'Hot-summer Mediterranean',
  Csb: 'Warm-summer Mediterranean',
  Csc: 'Cold-summer Mediterranean',
  Cwa: 'Monsoon-influenced humid subtropical',
  Cwb: 'Subtropical highland',
  Cwc: 'Cold subtropical highland',
  Cfa: 'Humid subtropical',
  Cfb: 'Temperate oceanic',
  Cfc: 'Subpolar oceanic',
  Dsa: 'Hot-summer Mediterranean-influenced continental',
  Dsb: 'Warm-summer Mediterranean-influenced continental',
  Dsc: 'Cold Mediterranean-influenced continental',
  Dsd: 'Very cold Mediterranean-influenced continental',
  Dwa: 'Monsoon-influenced hot-summer continental',
  Dwb: 'Monsoon-influenced warm-summer continental',
  Dwc: 'Monsoon-influenced subarctic',
  Dwd: 'Monsoon-influenced extremely cold subarctic',
  Dfa: 'Hot-summer humid continental',
  Dfb: 'Warm-summer humid continental',
  Dfc: 'Subarctic',
  Dfd: 'Extremely cold subarctic',
  ET: 'Tundra',
  EF: 'Ice cap',
};

/** e.g. "Cfb" -> "Temperate oceanic". Returns undefined for a code not in the standard scheme. */
export function describeKoppenCode(code: string): string | undefined {
  return KOPPEN_GEIGER_NAMES[code];
}
