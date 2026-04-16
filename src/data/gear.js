// ── Gear reference data extracted from T2K 4th edition rulebook ──────────────
// Fields: name, sub (subcategory label), rel, range (km), weight, price, effect, notes

export const GEAR_CATEGORIES = [
  { id: 'weapons_gear', label: 'Weapons Gear'   },
  { id: 'comms',        label: 'Communications' },
  { id: 'observation',  label: 'Observation'    },
  { id: 'protective',   label: 'Protective'     },
  { id: 'medical',      label: 'Medical'        },
  { id: 'tools',        label: 'Tools & Parts'  },
  { id: 'fuel',         label: 'Fuel & Stills'  },
  { id: 'electricity',  label: 'Electricity'    },
  { id: 'explosives',   label: 'Explosives'     },
  { id: 'food',         label: 'Food & Drink'   },
  { id: 'field',        label: 'Field Gear'     },
]

export const GEAR = {

  // ── WEAPONS GEAR ──────────────────────────────────────────────────────────
  weapons_gear: [
    { name: 'Telescopic Sight',    weight: '0',  price: '100',   rel: null, range: null, effect: '+1 to aim (slow action); +2 from stable platform (rest/sandbag/bipod)' },
    { name: 'Night Vision Sight',  weight: '½',  price: '250',   rel: null, range: null, effect: 'No darkness penalty within MEDIUM range; SHORT range without IR light' },
    { name: 'Bayonet',             weight: '¼',  price: '5',     rel: null, range: null, effect: 'Allows military rifle to be used effectively in melee' },
    { name: 'Bipod',               weight: '¼',  price: '10',    rel: null, range: null, effect: 'Stable firing platform; mountable on rifles and LMGs/GPMGs' },
    { name: 'Tripod',              weight: '2',  price: '25',    rel: null, range: null, effect: 'Required for HMGs and some ATGMs (e.g. TOW) unless vehicle mounted' },
    { name: 'Suppressor',          weight: '½',  price: '150',   rel: null, range: null, effect: 'Reduces report sound; harder to pinpoint origin. Requires compatible barrel' },
  ],

  // ── COMMUNICATIONS ────────────────────────────────────────────────────────
  comms: [
    // US Military
    { name: 'AN/PRC-148 MBITR',    sub: 'US Military',    weight: '½',  price: '500',   rel: 1,    range: '10', effect: 'Multiband handheld; interoperable with US/NATO radios' },
    { name: 'AN/PRC-77',           sub: 'US Military',    weight: '2',  price: '350',   rel: 3,    range: '8',  effect: 'VHF FM backpack radio; accepts KY-57 encryption device' },
    { name: 'AN/PRC-119 SINCGARS', sub: 'US Military',    weight: '2',  price: '1,000', rel: 2,    range: '8',  effect: 'Frequency hopping across 2,320 channels; encrypted or clear transmission' },
    { name: 'KY-57 VINSON',        sub: 'US Military',    weight: '½',  price: '2,500', rel: null, range: null, effect: 'Voice encryption device; attaches to compatible radios via cable' },
    // Soviet
    { name: 'R-105M',              sub: 'Soviet',         weight: '3',  price: '150',   rel: 2,    range: '8',  effect: 'Older FM manpack; found in third-line and Warsaw Pact units' },
    { name: 'R-107',               sub: 'Soviet',         weight: '3',  price: '200',   rel: 3,    range: '6',  effect: 'Replaced R-105M; used in third-line and rear-echelon units' },
    { name: 'R-126',               sub: 'Soviet',         weight: '1',  price: '100',   rel: 1,    range: '2',  effect: 'Platoon/company FM radio; 31 fixed channels' },
    { name: 'R-311',               sub: 'Soviet',         weight: '5',  price: '250',   rel: 5,    range: null, effect: 'Shortwave AM; Morse code; EMP resistant. No transistors — widely available' },
    { name: 'R-392A',              sub: 'Soviet',         weight: '1',  price: '350',   rel: 1,    range: '5',  effect: 'Six preset FM channels; includes hand-crank power option' },
    { name: 'R-198',               sub: 'Soviet',         weight: '1',  price: '400',   rel: 1,    range: '4',  effect: 'Latest Soviet platoon-level radio; 30–80 MHz FM' },
    // Civilian
    { name: 'Walkie-Talkie',       sub: 'Civilian',       weight: '½',  price: '50',    rel: 1,    range: '1',  effect: 'Single FM channel; advanced models may have multiple channels or encryption' },
    { name: 'Ham Radio',           sub: 'Civilian',       weight: '3–5', price: '200–1,000', rel: null, range: 'varies', effect: 'HF AM; Morse/voice; global range possible with antenna. Rel 2–4 by model' },
    // Signaling
    { name: 'Signal Panels',       sub: 'Signaling',      weight: '½',  price: '10',    rel: null, range: null, effect: 'Reversible nylon; signals aircrews or visually IDs friendly units at distance' },
    { name: 'Strobe Light',        sub: 'Signaling',      weight: '¼',  price: '20',    rel: null, range: null, effect: 'Bright blinking light; IR cap option visible only through night vision devices' },
    { name: 'Signal Flare',        sub: 'Signaling',      weight: '¼',  price: '5',     rel: null, range: null, effect: 'Signaling only — no illumination. Single-use canister or reusable launcher' },
    // Notes
    { name: '— Range note —',      sub: 'Note',           weight: null, price: null,    rel: null, range: null, effect: 'Vehicle-mounted or long-wire antenna doubles range. TECH roll can double range for one shift.' },
  ],

  // ── OBSERVATION ───────────────────────────────────────────────────────────
  observation: [
    { name: 'Binoculars',          weight: '½',  price: '50',    rel: 1,    range: null, effect: '+2 to RECON when actively scouting or observing' },
    { name: 'Night Vision Goggles', weight: '½', price: '250',   rel: 1,    range: null, effect: 'Night vision to 3 hexes (30m); 5 hexes with IR light. Eliminates darkness penalties to RANGED COMBAT and RECON. Requires battery' },
    { name: 'Thermal Optics',      weight: '1',  price: '1,000', rel: 1,    range: null, effect: 'Sees heat through fog, rain, and smoke. Eliminates all darkness/weather/smoke penalties. Extremely rare' },
    { name: 'Flashlight',          weight: '¼',  price: '30',    rel: 1,    range: null, effect: 'Illuminates 3 hexes (30m); highly visible. IR cover variant exists. Requires small battery' },
    { name: 'Searchlight',         weight: '5',  price: '200',   rel: 3,    range: null, effect: 'Illuminates 10 hexes (100m); requires vehicle, large battery, or generator' },
    { name: 'Compass',             weight: '¼',  price: '10',    rel: 1,    range: null, effect: '+2 to SURVIVAL for navigating in roadless terrain' },
    { name: 'GPS',                 weight: '½',  price: '250',   rel: null, range: null, effect: 'Eliminates SURVIVAL navigation roll when functional. Rolls 4+ on D6 to work — many satellites destroyed. Very rare' },
  ],

  // ── PROTECTIVE ────────────────────────────────────────────────────────────
  protective: [
    { name: 'Radiacmeter',             weight: '¼', price: '200', rel: 1,    effect: 'Detects radiation level in area; slow action to use' },
    { name: 'Chemical Agent Detector', weight: '¼', price: '75',  rel: null, effect: 'Detects and identifies chemical agents in hex; one stretch to use' },
    { name: 'Protective Mask',         weight: '½', price: '150', rel: 1,    effect: 'Removes –3 STAMINA penalty vs chemical weapons; –2 to RECON and STAMINA (marching)' },
    { name: 'HAZMAT/MOPP Suit',        weight: '1', price: '500', rel: null, effect: 'Full chemical protection when worn with Protective Mask; some radiation protection' },
    { name: 'Raingear',                weight: '½', price: '25',  rel: null, effect: '+1 STAMINA vs chemical weapons' },
  ],

  // ── MEDICAL ───────────────────────────────────────────────────────────────
  medical: [
    { name: 'Personal Medkit',         weight: '¼', price: '25',      rel: null, effect: '+1 to MEDICAL AID; disposable, single use' },
    { name: "Doctor's Medical Kit",    weight: '2',  price: '250',     rel: null, effect: '+2 to MEDICAL AID; includes 10 doses of each drug type, bandages, minor surgery tools' },
    { name: 'Surgical Instruments',    weight: '1',  price: '50',      rel: null, effect: '+1 to MEDICAL AID for fatal critical injuries only; combinable with medkits' },
    { name: 'Antibiotics',             weight: '0',  price: '25/dose', rel: null, effect: '+3 MEDICAL AID vs infected wounds/bacterial infections; one dose lasts one day' },
    { name: 'Pain Reliever',           weight: '0',  price: '15/dose', rel: null, effect: 'Heals 1 damage per stretch; further doses same shift have no effect' },
    { name: 'Atropine Autoinjector',   weight: '0',  price: '100',     rel: null, effect: 'Treats nerve agent effects; single dose, disposable, no medical training required' },
  ],

  // ── TOOLS & SPARE PARTS ───────────────────────────────────────────────────
  tools: [
    { name: 'Basic Tools',         weight: '2',  price: '25',  rel: null, effect: 'General repair and vehicle servicing; wrenches, pliers, screwdrivers' },
    { name: 'Vehicle Tools',       weight: '3',  price: '50',  rel: null, effect: '+1 to repairing/servicing vehicles; specialized set' },
    { name: 'Weapon Tools',        weight: '2',  price: '50',  rel: null, effect: '+1 to repairing weapons; specialized set' },
    { name: 'Weapon Spare Part',   weight: '½',  price: '25',  rel: null, effect: 'Required to repair inoperable weapon; usable for jury rigging' },
    { name: 'Vehicle Spare Part',  weight: '1',  price: '50',  rel: null, effect: 'Required to repair inoperable vehicle' },
    { name: 'Electronic Spare Part', weight: '½', price: '25', rel: null, effect: 'Required to repair inoperable electronic item' },
    { name: 'General Spare Part',  weight: '1',  price: '10',  rel: null, effect: 'Required to repair inoperable mechanical item (non-weapon/vehicle); usable for jury rigging' },
  ],

  // ── FUEL & STILLS ─────────────────────────────────────────────────────────
  fuel: [
    { name: 'Gasoline/Diesel',   weight: '—',   price: '50/liter',    rel: null, effect: 'Traditional fossil fuel; very rare in Europe, 2000' },
    { name: 'Alcohol Fuel',      weight: '—',   price: '15/liter',    rel: null, effect: 'Produced from wood/grain/organics; most vehicles already converted' },
    { name: 'Small Still',       weight: '20',  price: '500',         rel: 1,    effect: 'Produces up to 5 liters/shift; 1 enc unit organic material per liter. Jury riggable (20 spare parts)' },
    { name: 'Large Still',       weight: '400', price: '2,500',       rel: 3,    effect: 'Produces up to 50 liters/shift; 1 enc unit organic material per liter. Jury riggable (400 spare parts)' },
    { name: 'Industrial Still',  weight: '—',   price: '10,000',      rel: 5,    effect: 'Produces up to 500 liters/shift; stationary, cannot be moved' },
  ],

  // ── ELECTRICITY ───────────────────────────────────────────────────────────
  electricity: [
    { name: 'Small Generator', weight: '5',  price: '200',   rel: 3,    effect: 'Powers one small device; 2 liters alcohol/shift or manual STAMINA roll. Jury riggable (3 spare parts + 4 electronic)' },
    { name: 'Large Generator', weight: '50', price: '1,000', rel: 5,    effect: 'Powers one large or up to 12 small devices; 20 liters alcohol/shift. Jury riggable (30 spare parts + 40 electronic)' },
    { name: 'Small Battery',   weight: '¼',  price: '100',   rel: null, effect: 'Powers one small device for one day; recharge via vehicle or generator in one shift' },
    { name: 'Car Battery',     weight: '5',  price: '1,000', rel: null, effect: 'Powers one large or up to 12 small devices for one day; recharge via vehicle or large generator in one shift' },
  ],

  // ── EXPLOSIVES ────────────────────────────────────────────────────────────
  explosives: [
    { name: 'Plastic Explosives',    weight: '¼/unit',  price: '25/¼ unit', rel: null, effect: 'Blast D at ¼ enc unit; quadrupling amount raises blast one step (max A)' },
    { name: 'Dynamite Sticks',       weight: '¼/stick', price: '25/stick',  rel: null, effect: 'Blast D per stick; quadrupling raises blast one step (max A)' },
    { name: 'Chemicals',             weight: '1/unit',  price: '10/unit',   rel: null, effect: 'Raw material; 1 unit converts to 1 unit improvised explosives via TECH roll' },
    { name: 'Improvised Explosives', weight: '1/unit',  price: '25/unit',   rel: null, effect: 'Blast D at 1 enc unit; quadrupling raises blast one step (max A). Failed TECH roll: roll again — second failure = immediate detonation' },
  ],

  // ── FOOD & DRINK ──────────────────────────────────────────────────────────
  food: [
    { name: 'Field Rations (MRE)', weight: '¼/ration',       price: '20/ration',       rel: null, effect: 'Self-contained; 3+ year shelf life; covers full daily food requirement' },
    { name: 'Domestic Food',       weight: '½/daily ration', price: '10/daily ration', rel: null, effect: 'Cooked meat or vegetables; spoils within one week' },
    { name: 'Wild Food',           weight: '1/daily ration', price: '5/daily ration',  rel: null, effect: 'Foraged plants and roots; spoils after one week; low energy content' },
  ],

  // ── FIELD GEAR ────────────────────────────────────────────────────────────
  field: [
    { name: 'Backpack',         weight: '0', price: '50',  rel: null, effect: 'Carry extra enc units = STR die size; –2 to all MOBILITY rolls while worn' },
    { name: 'Fatigues',         weight: '0', price: '20',  rel: null, effect: 'Camouflage; adequate cold protection (not severe winter); +1 RECON for ambushes and staying hidden' },
    { name: 'Thermal Fatigues', weight: '1', price: '50',  rel: null, effect: 'Protection against extreme cold' },
    { name: 'Sleeping Bag',     weight: '1', price: '25',  rel: null, effect: '+2 to SURVIVAL sleeping on bare ground and STAMINA vs cold' },
    { name: 'Blanket',          weight: '1', price: '10',  rel: null, effect: '+1 to STAMINA vs cold' },
    { name: 'Small Tent',       weight: '4', price: '50',  rel: null, effect: '+1 to SURVIVAL for making camp; fits 4 people' },
    { name: 'Large Tent',       weight: '8', price: '150', rel: null, effect: '+1 to SURVIVAL for making camp; fits 10 people' },
    { name: 'Fishing Gear',     weight: '1', price: '25',  rel: null, effect: 'Used for fishing; jury riggable with 1 general spare part' },
  ],
}
