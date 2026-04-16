// ── Weapons reference data extracted from T2K 4th edition rulebook ───────────
// Fields: name, type, ammo, rel, rof, damage, crit, blast, range, mag, armor, weight, price, notes
// blast: '–' = none, 'D'/'C'/'B'/'A' = blast radius class
// armor: '+1'/'+2'/etc = easier to hit due to armor, '0' = no mod, '-1' = harder
// mag: '*' suffix = ammo belt (one encumbrance unit)
// For melee/bows, rof/mag/blast omitted (left as '' for the sheet)

export const WEAPON_CATEGORIES = [
  { id: 'us_military', label: 'US Military' },
  { id: 'civilian',    label: 'Civilian'    },
  { id: 'polish',      label: 'Polish'      },
  { id: 'soviet',      label: 'Soviet'      },
  { id: 'swedish',     label: 'Swedish'     },
  { id: 'grenades',    label: 'Grenades'    },
  { id: 'other',       label: 'Other'       },
  { id: 'bows',        label: 'Bows/Thrown' },
  { id: 'melee',       label: 'Melee'       },
]

export const WEAPONS = {

  // ── US MILITARY ────────────────────────────────────────────────────────────
  us_military: [
    { name: 'M1911A1',    type: 'Pistol',        ammo: '.45',      rel: 5, rof: 2, damage: 2,  crit: 3, blast: '–', range: 2,  mag: '7',     armor: '+1', weight: '½',    price: 100   },
    { name: 'M9',         type: 'Pistol',        ammo: '9×19',     rel: 5, rof: 2, damage: 1,  crit: 2, blast: '–', range: 2,  mag: '15',    armor: '+1', weight: '½',    price: 100   },
    { name: 'M16A1',      type: 'Assault rifle', ammo: '5.56×45',  rel: 5, rof: 6, damage: 2,  crit: 3, blast: '–', range: 5,  mag: '30',    armor: '0',  weight: '1',    price: 400   },
    { name: 'M16A2',      type: 'Assault rifle', ammo: '5.56×45',  rel: 5, rof: 3, damage: 2,  crit: 3, blast: '–', range: 6,  mag: '30',    armor: '0',  weight: '1',    price: 400   },
    { name: 'M4',         type: 'Carbine',       ammo: '5.56×45',  rel: 5, rof: 3, damage: 2,  crit: 3, blast: '–', range: 4,  mag: '30',    armor: '0',  weight: '1',    price: 350   },
    { name: 'M4A1',       type: 'Carbine',       ammo: '5.56×45',  rel: 5, rof: 6, damage: 2,  crit: 3, blast: '–', range: 4,  mag: '30',    armor: '0',  weight: '1',    price: 375   },
    { name: 'M40A3',      type: 'Sniper rifle',  ammo: '7.62×51',  rel: 5, rof: 1, damage: 3,  crit: 3, blast: '–', range: 12, mag: '5',     armor: '0',  weight: '2',    price: 500   },
    { name: 'M21',        type: 'Sniper rifle',  ammo: '7.62×51',  rel: 5, rof: 2, damage: 3,  crit: 3, blast: '–', range: 10, mag: '20',    armor: '0',  weight: '2',    price: 450   },
    { name: 'M82A1',      type: 'Sniper rifle',  ammo: '.50 M2',   rel: 5, rof: 1, damage: 4,  crit: 3, blast: '–', range: 20, mag: '10',    armor: '0',  weight: '3',    price: 1000  },
    { name: 'M79',        type: 'GL',            ammo: '40×46',    rel: 5, rof: 1, damage: 3,  crit: 3, blast: 'D', range: 5,  mag: '1',     armor: '0',  weight: '1',    price: 250   },
    { name: 'M203',       type: 'GL',            ammo: '40×46',    rel: 5, rof: 1, damage: 3,  crit: 3, blast: 'D', range: 4,  mag: '1',     armor: '0',  weight: '½',    price: 300   },
    { name: 'Mk 19',      type: 'AGL',           ammo: '40×53',    rel: 5, rof: 4, damage: 3,  crit: 3, blast: 'D', range: 20, mag: '32',    armor: '0',  weight: '6',    price: 2500, notes: 'Needs tripod/vehicle mount. Uses ammo dice.' },
    { name: 'M249',       type: 'LMG',           ammo: '5.56×45',  rel: 5, rof: 6, damage: 2,  crit: 3, blast: '–', range: 6,  mag: '200',   armor: '0',  weight: '2',    price: 1000, notes: 'Ammo belt (1 enc unit).' },
    { name: 'M60',        type: 'GPMG',          ammo: '7.62×51',  rel: 4, rof: 4, damage: 3,  crit: 4, blast: '–', range: 8,  mag: '100',   armor: '0',  weight: '3',    price: 1250, notes: 'Ammo belt (1 enc unit).' },
    { name: 'M240B',      type: 'GPMG',          ammo: '7.62×51',  rel: 5, rof: 4, damage: 3,  crit: 4, blast: '–', range: 8,  mag: '100',   armor: '0',  weight: '3',    price: 1500, notes: 'Ammo belt (1 enc unit).' },
    { name: 'M2HB',       type: 'HMG',           ammo: '.50 M2',   rel: 5, rof: 4, damage: 4,  crit: 4, blast: '–', range: 15, mag: '100',   armor: '0',  weight: '7',    price: 2000, notes: 'Needs tripod/vehicle mount. Ammo belt (1 enc unit).' },
    { name: 'M72A3 LAW',  type: 'ATRL',          ammo: '66mm',     rel: 5, rof: 1, damage: 6,  crit: 3, blast: 'C', range: 3,  mag: '1',     armor: '–1', weight: '1',    price: 100,  notes: 'Disposable, single shot.' },
    { name: 'M136 AT4',   type: 'ATRL',          ammo: '84mm',     rel: 5, rof: 1, damage: 8,  crit: 2, blast: 'C', range: 5,  mag: '1',     armor: '–1', weight: '2',    price: 200,  notes: 'Disposable, single shot.' },
    { name: 'FGM-148',    type: 'ATGM',          ammo: '127mm',    rel: 5, rof: 1, damage: 10, crit: 1, blast: 'B', range: 40, mag: '1',     armor: '–1', weight: '3',    price: 7500  },
    { name: 'M47 Dragon', type: 'ATGM',          ammo: '140mm',    rel: 5, rof: 1, damage: 11, crit: 1, blast: 'B', range: 25, mag: '1',     armor: '–1', weight: '3',    price: 5000  },
    { name: 'BGM-71 TOW', type: 'ATGM',          ammo: '152mm',    rel: 5, rof: 1, damage: 11, crit: 1, blast: 'B', range: 50, mag: '1',     armor: '–2', weight: '15',   price: 10000, notes: 'Needs tripod/vehicle mount.' },
  ],

  // ── CIVILIAN FIREARMS ──────────────────────────────────────────────────────
  civilian: [
    { name: 'Service revolver',   type: 'Revolver',      ammo: '.38 SPL',    rel: 5, rof: 2, damage: 1, crit: 3, blast: '–', range: 2, mag: '6',  armor: '+2', weight: '½', price: 75  },
    { name: 'Police pistol',      type: 'Pistol',        ammo: '9×19',       rel: 5, rof: 2, damage: 1, crit: 2, blast: '–', range: 2, mag: '17', armor: '+1', weight: '½', price: 125 },
    { name: 'Combat pistol',      type: 'Pistol',        ammo: '9×19',       rel: 5, rof: 2, damage: 1, crit: 2, blast: '–', range: 2, mag: '15', armor: '+1', weight: '½', price: 100 },
    { name: 'Bolt-action rifle',  type: 'Hunting rifle', ammo: '.30-06',     rel: 5, rof: 1, damage: 3, crit: 4, blast: '–', range: 10, mag: '5', armor: '0',  weight: '1', price: 300 },
    { name: 'Lever-action rifle', type: 'Hunting rifle', ammo: '.30-30',     rel: 5, rof: 1, damage: 3, crit: 4, blast: '–', range: 5,  mag: '8', armor: '0',  weight: '1', price: 250 },
    { name: 'Pipe gun rifle',     type: 'Hunting rifle', ammo: 'Any rifle',  rel: 3, rof: 1, damage: 3, crit: 4, blast: '–', range: 3,  mag: '1', armor: '+1', weight: '1', price: 25,  notes: 'Can be jury rigged.' },
    { name: 'Semi-auto shotgun',  type: 'Shotgun',       ammo: '12 GA',      rel: 5, rof: 2, damage: 3, crit: 4, blast: '–', range: 2,  mag: '5', armor: '+1', weight: '1', price: 225 },
    { name: 'Pump-action',        type: 'Shotgun',       ammo: '12 GA',      rel: 5, rof: 1, damage: 3, crit: 4, blast: '–', range: 2,  mag: '5', armor: '+1', weight: '1', price: 200 },
    { name: 'Double-barrelled',   type: 'Shotgun',       ammo: '12 GA',      rel: 5, rof: 2, damage: 3, crit: 4, blast: '–', range: 2,  mag: '2', armor: '+1', weight: '1', price: 150 },
    { name: 'Pipe gun shotgun',   type: 'Shotgun',       ammo: '12 GA',      rel: 3, rof: 1, damage: 3, crit: 4, blast: '–', range: 1,  mag: '1', armor: '+1', weight: '1', price: 25,  notes: 'Can be jury rigged.' },
    { name: 'Zip gun',            type: 'Pistol',        ammo: 'Any pistol', rel: 3, rof: 1, damage: 1, crit: 3, blast: '–', range: 1,  mag: '1', armor: '+2', weight: '½', price: 25,  notes: 'Can be jury rigged.' },
  ],

  // ── POLISH MILITARY ───────────────────────────────────────────────────────
  polish: [
    { name: 'P-83',      type: 'Pistol',       ammo: '9×18',      rel: 5, rof: 2, damage: 1, crit: 3, blast: '–', range: 2,  mag: '8',    armor: '+2', weight: '½', price: 75   },
    { name: 'AKM',       type: 'Assault rifle', ammo: '7.62×39',  rel: 5, rof: 4, damage: 2, crit: 3, blast: '–', range: 5,  mag: '30',   armor: '0',  weight: '1', price: 300  },
    { name: 'PMK-60',    type: 'Assault rifle', ammo: '7.62×39',  rel: 5, rof: 4, damage: 2, crit: 3, blast: '–', range: 5,  mag: '30',   armor: '0',  weight: '1', price: 350  },
    { name: 'PM-84',     type: 'SMG',           ammo: '9×18',     rel: 5, rof: 4, damage: 1, crit: 3, blast: '–', range: 3,  mag: '25',   armor: '+2', weight: '1', price: 300  },
    { name: 'wz. 1974',  type: 'GL',            ammo: '40×47',    rel: 5, rof: 1, damage: 3, crit: 4, blast: 'D', range: 5,  mag: '1',    armor: '0',  weight: '½', price: 350  },
    { name: 'SWD',       type: 'Sniper rifle',  ammo: '7.62×54',  rel: 5, rof: 2, damage: 3, crit: 3, blast: '–', range: 10, mag: '10',   armor: '0',  weight: '2', price: 500  },
    { name: 'RPK',       type: 'LMG',           ammo: '7.62×39',  rel: 5, rof: 4, damage: 2, crit: 3, blast: '–', range: 6,  mag: '75',   armor: '0',  weight: '2', price: 600  },
    { name: 'PKM',       type: 'GPMG',          ammo: '7.62×54',  rel: 5, rof: 5, damage: 3, crit: 4, blast: '–', range: 8,  mag: '100',  armor: '0',  weight: '3', price: 1250, notes: 'Ammo belt (1 enc unit).' },
    { name: 'DsKM',      type: 'HMG',           ammo: '12.7×108', rel: 4, rof: 4, damage: 4, crit: 4, blast: '–', range: 15, mag: '50',   armor: '0',  weight: '7', price: 1750, notes: 'Ammo belt. Needs tripod/vehicle mount.' },
    { name: 'NSW',       type: 'HMG',           ammo: '12.7×108', rel: 5, rof: 6, damage: 4, crit: 4, blast: '–', range: 15, mag: '50',   armor: '0',  weight: '6', price: 2000, notes: 'Ammo belt. Needs tripod/vehicle mount.' },
    { name: 'RPG-7V',    type: 'ATRL',          ammo: '83mm',     rel: 5, rof: 1, damage: 7, crit: 2, blast: 'C', range: 6,  mag: '1',    armor: '–1', weight: '2', price: 750  },
  ],

  // ── SOVIET MILITARY ───────────────────────────────────────────────────────
  soviet: [
    { name: 'PM',      type: 'Pistol',        ammo: '9×18',     rel: 5, rof: 2, damage: 1, crit: 3, blast: '–', range: 2,  mag: '8',  armor: '+2', weight: '½', price: 75   },
    { name: 'PSM',     type: 'Pistol',        ammo: '5.45×18',  rel: 5, rof: 2, damage: 1, crit: 4, blast: '–', range: 2,  mag: '8',  armor: '+2', weight: '¼', price: 75   },
    { name: 'AKM',     type: 'Assault rifle', ammo: '7.62×39',  rel: 5, rof: 4, damage: 2, crit: 3, blast: '–', range: 5,  mag: '30', armor: '0',  weight: '1', price: 300  },
    { name: 'AK-74',   type: 'Assault rifle', ammo: '5.45×39',  rel: 5, rof: 5, damage: 2, crit: 3, blast: '–', range: 6,  mag: '30', armor: '0',  weight: '1', price: 400  },
    { name: 'PP-19',   type: 'SMG',           ammo: '9×18',     rel: 5, rof: 5, damage: 1, crit: 3, blast: '–', range: 3,  mag: '64', armor: '+2', weight: '1', price: 350  },
    { name: 'GP-25',   type: 'GL',            ammo: '40mm',     rel: 5, rof: 1, damage: 3, crit: 4, blast: 'D', range: 4,  mag: '1',  armor: '0',  weight: '1', price: 250  },
    { name: 'AGS-17',  type: 'AGL',           ammo: '30×29',    rel: 4, rof: 3, damage: 4, crit: 4, blast: 'D', range: 15, mag: '29', armor: '0',  weight: '5', price: 2000, notes: 'Auto grenade launcher. Uses ammo dice. Ammo belt. Needs tripod/vehicle mount.' },
  ],

  // ── SWEDISH MILITARY ──────────────────────────────────────────────────────
  swedish: [
    { name: 'Pist 88',    type: 'Pistol',       ammo: '9×19',      rel: 5, rof: 2, damage: 1, crit: 2, blast: '–', range: 2,  mag: '17', armor: '+1', weight: '½', price: 100  },
    { name: 'Ak 4',       type: 'Battle rifle',  ammo: '7.62×51',  rel: 5, rof: 4, damage: 3, crit: 4, blast: '–', range: 8,  mag: '20', armor: '0',  weight: '2', price: 500  },
    { name: 'Ak 5',       type: 'Assault rifle', ammo: '5.56×45',  rel: 5, rof: 5, damage: 2, crit: 3, blast: '–', range: 6,  mag: '30', armor: '0',  weight: '1', price: 400  },
    { name: 'Psg 90',     type: 'Sniper rifle',  ammo: '7.62×51',  rel: 5, rof: 1, damage: 3, crit: 3, blast: '–', range: 12, mag: '10', armor: '0',  weight: '2', price: 750  },
    { name: 'Ag 90',      type: 'Sniper rifle',  ammo: '.50 M2',   rel: 5, rof: 1, damage: 4, crit: 3, blast: '–', range: 20, mag: '10', armor: '0',  weight: '3', price: 1000 },
    { name: 'Grsp 40',    type: 'AGL',           ammo: '40×53',    rel: 5, rof: 4, damage: 3, crit: 3, blast: 'D', range: 20, mag: '32', armor: '0',  weight: '6', price: 2500, notes: 'Auto grenade launcher. Uses ammo dice. Needs tripod/vehicle mount.' },
    { name: 'Kpist m/45', type: 'SMG',           ammo: '9×19',     rel: 5, rof: 4, damage: 1, crit: 2, blast: '–', range: 3,  mag: '36', armor: '+1', weight: '1', price: 350  },
  ],

  // ── HAND GRENADES ─────────────────────────────────────────────────────────
  grenades: [
    { name: 'Fragmentation',    type: 'Grenade', ammo: '', rel: '', rof: '', damage: '–', crit: '–', blast: 'C',      range: 3, mag: '', armor: '+1', weight: '¼', price: 30  },
    { name: 'Anti Tank',        type: 'Grenade', ammo: '', rel: '', rof: '', damage: 6,   crit: 3,   blast: 'D',      range: 3, mag: '', armor: '–1', weight: '¼', price: 50  },
    { name: 'Smoke',            type: 'Grenade', ammo: '', rel: '', rof: '', damage: '–', crit: '–', blast: '–',      range: 3, mag: '', armor: '–',  weight: '¼', price: 25,  notes: 'Fills target hex with SMOKE.' },
    { name: 'White Phosphorous', type: 'Grenade', ammo: '', rel: '', rof: '', damage: '–', crit: '–', blast: 'Fire B', range: 3, mag: '', armor: '–',  weight: '¼', price: 50,  notes: 'Fire effect in target hex only.' },
    { name: 'Improvised',       type: 'Grenade', ammo: '', rel: '', rof: '', damage: '–', crit: '–', blast: 'C',      range: 2, mag: '', armor: '+1', weight: '1', price: 25,  notes: 'Jury rigged with improvised explosives + spare part for shrapnel.' },
    { name: 'Molotov Cocktail', type: 'Grenade', ammo: '', rel: '', rof: '', damage: '–', crit: '–', blast: 'Fire C', range: 2, mag: '', armor: '–',  weight: '1', price: 15,  notes: 'Jury rigged with one liter of fuel and a bottle.' },
  ],

  // ── OTHER MILITARY ────────────────────────────────────────────────────────
  other: [
    { name: 'FN FAL',    type: 'Battle rifle',  ammo: '7.62×51', rel: 5, rof: 4, damage: 3, crit: 4, blast: '–', range: 8,  mag: '20', armor: '0',  weight: '2', price: 500  },
    { name: 'FAMAS',     type: 'Assault rifle', ammo: '5.56×45', rel: 5, rof: 6, damage: 2, crit: 3, blast: '–', range: 5,  mag: '25', armor: '0',  weight: '1', price: 400  },
    { name: 'Vz 61',     type: 'SMG',           ammo: '7.65×17', rel: 5, rof: 6, damage: 1, crit: 3, blast: '–', range: 2,  mag: '20', armor: '+2', weight: '½', price: 200  },
    { name: 'Uzi',       type: 'SMG',           ammo: '9×19',    rel: 5, rof: 4, damage: 1, crit: 2, blast: '–', range: 3,  mag: '32', armor: '+1', weight: '1', price: 350  },
    { name: 'PSG-1',     type: 'Sniper rifle',  ammo: '7.62×51', rel: 5, rof: 1, damage: 3, crit: 3, blast: '–', range: 12, mag: '20', armor: '0',  weight: '2', price: 1000 },
    { name: 'Armbrust',  type: 'ATRL',          ammo: '67mm',    rel: 5, rof: 1, damage: 6, crit: 3, blast: 'C', range: 4,  mag: '1',  armor: '–1', weight: '1', price: 100,  notes: 'Disposable, single shot.' },
    { name: 'PzF 3',     type: 'ATRL',          ammo: '110mm',   rel: 5, rof: 1, damage: 8, crit: 1, blast: 'C', range: 7,  mag: '1',  armor: '–1', weight: '1', price: 250  },
  ],

  // ── BOWS & THROWN ─────────────────────────────────────────────────────────
  bows: [
    { name: 'Rock',           type: 'Thrown', ammo: '',  rel: 5, rof: '', damage: 1, crit: 3, blast: '–', range: 1, mag: '', armor: '+2', weight: '⅓', price: '–' },
    { name: 'Hunting bow',    type: 'Bow',    ammo: '',  rel: 5, rof: '', damage: 1, crit: 2, blast: '–', range: 4, mag: '', armor: '+1', weight: '1',  price: 150 },
    { name: 'Crossbow',       type: 'Bow',    ammo: '',  rel: 5, rof: '', damage: 2, crit: 3, blast: '–', range: 4, mag: '', armor: '0',  weight: '1',  price: 200 },
    { name: 'Improvised bow', type: 'Bow',    ammo: '',  rel: 3, rof: '', damage: 1, crit: 3, blast: '–', range: 2, mag: '', armor: '+1', weight: '1',  price: 10, notes: 'Can be jury rigged. 2D6 arrows from branches with TECH roll.' },
  ],

  // ── MELEE ──────────────────────────────────────────────────────────────────
  melee: [
    { name: 'Unarmed',     type: 'Melee', ammo: '', rel: 5, rof: '', damage: 1, crit: 4, blast: '–', range: '', mag: '', armor: '+3', weight: '–',       price: '–' },
    { name: 'Rifle butt',  type: 'Melee', ammo: '', rel: 5, rof: '', damage: 2, crit: 4, blast: '–', range: '', mag: '', armor: '+2', weight: 'As rifle', price: '–' },
    { name: 'Bottle',      type: 'Melee', ammo: '', rel: 1, rof: '', damage: 1, crit: 2, blast: '–', range: '', mag: '', armor: '+3', weight: '¼',        price: '–' },
    { name: 'Knife',       type: 'Melee', ammo: '', rel: 5, rof: '', damage: 2, crit: 3, blast: '–', range: '', mag: '', armor: '+1', weight: '¼',        price: 5   },
    { name: 'Club',        type: 'Melee', ammo: '', rel: 5, rof: '', damage: 2, crit: 4, blast: '–', range: '', mag: '', armor: '+2', weight: '1',        price: 1,  notes: 'Can be jury rigged.' },
    { name: 'Spiked bat',  type: 'Melee', ammo: '', rel: 5, rof: '', damage: 2, crit: 3, blast: '–', range: '', mag: '', armor: '+2', weight: '1',        price: 3,  notes: 'Can be jury rigged.' },
    { name: 'Bayonet',     type: 'Melee', ammo: '', rel: 5, rof: '', damage: 2, crit: 3, blast: '–', range: '', mag: '', armor: '+1', weight: '¼+rifle',  price: 5   },
    { name: 'Machete',     type: 'Melee', ammo: '', rel: 5, rof: '', damage: 3, crit: 4, blast: '–', range: '', mag: '', armor: '+1', weight: '½',        price: 20  },
    { name: 'Axe',         type: 'Melee', ammo: '', rel: 5, rof: '', damage: 3, crit: 3, blast: '–', range: '', mag: '', armor: '+1', weight: '1',        price: 30  },
  ],
}
