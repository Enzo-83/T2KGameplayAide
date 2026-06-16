// ⚠ GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: reference-csv/*.csv. Regenerate with `npm run gen:refs`
// (runs automatically before `npm run dev` and `npm run build`).

export const WEAPON_CATEGORIES = [
  { id: "pistols", label: "Pistols" },
  { id: "smgs", label: "Submachine Guns" },
  { id: "carbines", label: "Carbines" },
  { id: "assault_rifles", label: "Assault Rifles" },
  { id: "grape", label: "Grape Weapons" },
  { id: "marksman", label: "Marksman Rifles" },
  { id: "heavy", label: "Heavy Weapons" },
  { id: "launchers", label: "Grenade Launchers" },
  { id: "systems", label: "Weapon Systems" },
  { id: "melee", label: "Melee" },
  { id: "grenades", label: "Grenades" },
  { id: "explosives", label: "Explosives" },
  { id: "other", label: "Other" },
]

export const WEAPONS = {
  pistols: [
    { name: "Vulcan Cricket", type: "Pistol", ammo: "VUL", rel: 5, rof: 2, damage: 1, crit: 3, blast: "–", range: "2/8", mag: "8", armor: "+2", weight: "½", price: "", slots: 1, notes: "Light, Reliable, Range modifiers doubled" },
    { name: "Vulcan Pistol", type: "Pistol", ammo: "VUL", rel: 5, rof: 2, damage: 1, crit: 2, blast: "–", range: "2/8", mag: "17", armor: "+1", weight: "½", price: "", slots: 2, notes: "Reliable, Range modifiers doubled" },
    { name: "Vulcan Pistol (Arax Omir)", type: "Pistol", ammo: "VUL", rel: 5, rof: 2, damage: 1, crit: 2, blast: "–", range: "2/8", mag: "15", armor: "+1", weight: "½", price: "", slots: 2, notes: "Reliable, Range modifiers doubled, +1 PERSUASION when threatening" },
    { name: "Accelerator Pistol", type: "Pistol", ammo: "ACC", rel: 5, rof: 1, damage: 2, crit: 3, blast: "–", range: "3/12", mag: "7", armor: "0", weight: "½", price: "", slots: 2, notes: "Armor-piercing, Silent" },
    { name: "Thermal Cricket", type: "Pistol", ammo: "CELL", rel: 5, rof: 2, damage: 1, crit: 2, blast: "–", range: "2/8", mag: "5", armor: "0", weight: "½", price: "", slots: 1, notes: "Cell-powered, Fire 4" },
    { name: "Thermal Pistol", type: "Pistol", ammo: "CELL", rel: 5, rof: 2, damage: 2, crit: 3, blast: "–", range: "3/12", mag: "7", armor: "–1", weight: "1", price: "", slots: 1, notes: "Cell-powered, Fire 4" },
  ],

  smgs: [
    { name: "Vulcan Wasp", type: "SMG", ammo: "VUL", rel: 5, rof: 4, damage: 1, crit: 2, blast: "–", range: "3/12", mag: "25", armor: "+1", weight: "1", price: "", slots: 1, notes: "Reliable, Range modifiers doubled" },
    { name: "Vulcan Scorpion", type: "SMG", ammo: "VUL", rel: 5, rof: 4, damage: 1, crit: 3, blast: "–", range: "3/12", mag: "34", armor: "+2", weight: "1", price: "", slots: 2, notes: "Reliable, Range modifiers doubled, -1 Ranged Combat using AMMO dice" },
    { name: "Vulcan PDW", type: "SMG", ammo: "VUL", rel: 5, rof: 5, damage: 1, crit: 3, blast: "–", range: "3/12", mag: "64", armor: "+1", weight: "1", price: "", slots: 2, notes: "Reliable, Range modifiers doubled" },
    { name: "Accelerator PDW", type: "SMG", ammo: "ACC", rel: 5, rof: 6, damage: 1, crit: 3, blast: "–", range: "2/8", mag: "20", armor: "0", weight: "½", price: "" },
    { name: "Accelerator SMG", type: "SMG", ammo: "ACC", rel: 5, rof: 4, damage: 1, crit: 2, blast: "–", range: "4/16", mag: "32", armor: "0", weight: "1", price: "" },
  ],

  carbines: [
    { name: "Vulcan Carbine", type: "Carbine", ammo: "VUL", rel: 5, rof: 4, damage: 2, crit: 3, blast: "–", range: "4/16", mag: "30", armor: "0", weight: "1", price: "", slots: 1, notes: "Reliable" },
    { name: "Vulcan Carbine v2", type: "Carbine", ammo: "VUL", rel: 5, rof: 6, damage: 2, crit: 3, blast: "–", range: "4/16", mag: "30", armor: "0", weight: "1", price: "", slots: 2, notes: "Reliable" },
    { name: "Legionnaire carbine Dayal-3", type: "Carbine", ammo: "VUL", rel: 5, rof: 6, damage: 2, crit: 3, blast: "–", range: "5/20", mag: "45", armor: "0", weight: "2", price: "", slots: 2, notes: "Reliable, Built-in grenade launcher" },
  ],

  assault_rifles: [
    { name: "Vulcan Assault Rifle", type: "Assault rifle", ammo: "VUL", rel: 5, rof: 6, damage: 2, crit: 3, blast: "–", range: "5/20", mag: "25", armor: "0", weight: "1", price: "", slots: 2, notes: "Reliable" },
    { name: "Accelerator Assault Rifle (Civilian)", type: "Assault rifle", ammo: "ACC", rel: 5, rof: 2, damage: 2, crit: 3, blast: "–", range: "6/24", mag: "20", armor: "–1", weight: "1", price: "", slots: 1, notes: "Armor-piercing, Silent" },
    { name: "Accelerator Assault Rifle (Military)", type: "Assault rifle", ammo: "ACC", rel: 5, rof: 3, damage: 2, crit: 3, blast: "–", range: "6/24", mag: "30", armor: "–1", weight: "1", price: "", slots: 2, notes: "Armor-piercing, Silent" },
    { name: "Twin Carbine Rifle", type: "Assault rifle", ammo: "ACC", rel: 5, rof: 3, damage: 3, crit: 4, blast: "–", range: "6/24", mag: "30", armor: "–1", weight: "1", price: "", slots: 2, notes: "Armor-piercing, Silent, Unreliable" },
    { name: "Thermal Carbine", type: "Assault rifle", ammo: "CEL", rel: 5, rof: 4, damage: 3, crit: 4, blast: "–", range: "8/32", mag: "20", armor: "–1", weight: "3", price: "", slots: 1, notes: "Requires a backpack to shoot (included in weight)" },
  ],

  grape: [
    { name: "Sawed-off Grape Rifle", type: "Shotgun", ammo: "VUL", rel: 5, rof: 2, damage: 3, crit: 4, blast: "–", range: "2/8", mag: "2", armor: "+1", weight: "1", price: "", slots: 2, notes: "Shotgun, Single-shot (Roll all ammo dice on the roll)" },
    { name: "Grape Rifle", type: "Shotgun", ammo: "VUL", rel: 5, rof: 1, damage: 3, crit: 4, blast: "–", range: "2/8", mag: "5", armor: "+1", weight: "1", price: "", slots: 2, notes: "Shotgun" },
    { name: "Grape Carbine", type: "Shotgun", ammo: "VUL", rel: 5, rof: 2, damage: 3, crit: 4, blast: "–", range: "2/8", mag: "5", armor: "+1", weight: "1", price: "", slots: 2, notes: "Shotgun" },
  ],

  marksman: [
    { name: "Long Rifle", type: "Marksman rifle", ammo: "PRIM", rel: 5, rof: 1, damage: 3, crit: 4, blast: "–", range: "10/40", mag: "5", armor: "0", weight: "1", price: "", slots: 2 },
    { name: "Lever-action Rifle", type: "Marksman rifle", ammo: "PRIM", rel: 5, rof: 1, damage: 3, crit: 4, blast: "–", range: "5/20", mag: "8", armor: "0", weight: "1", price: "", slots: 2 },
    { name: "Accelerator Rifle (civilian)", type: "Marksman rifle", ammo: "ACC", rel: 5, rof: 1, damage: 3, crit: 4, blast: "–", range: "12/48", mag: "20", armor: "0", weight: "2", price: "", slots: 2 },
    { name: "Accelerator Rifle (military)", type: "Marksman rifle", ammo: "ACC", rel: 5, rof: 2, damage: 3, crit: 3, blast: "–", range: "10/40", mag: "20", armor: "–1", weight: "1", price: "", slots: 2, notes: "Armor-Piercing, Silent" },
    { name: "Accelerator DMR", type: "Marksman rifle", ammo: "ACC", rel: 5, rof: 2, damage: 3, crit: 3, blast: "–", range: "12/48", mag: "10", armor: "–1", weight: "2", price: "", slots: 2, notes: "Silent, Optical Scope" },
    { name: "Accelerator Rifle Nestera Parox", type: "Marksman rifle", ammo: "ACC", rel: 5, rof: 1, damage: 4, crit: 3, blast: "–", range: "20/80", mag: "10", armor: "–1", weight: "5", price: "", slots: 2, notes: "Armor-piercing, Anti-Vehicle, Bulky, Slow, Silent" },
    { name: "Thermal Rifle", type: "Marksman rifle", ammo: "CELL", rel: 5, rof: 1, damage: 3, crit: 3, blast: "–", range: "10/40", mag: "5", armor: "–1", weight: "4", price: "", slots: 1, notes: "Fire 3, Fusion Battery" },
  ],

  heavy: [
    { name: "Vulcan Machine Gun", type: "Machine gun", ammo: "VUL", rel: 5, rof: 6, damage: 2, crit: 3, blast: "–", range: "5/20", mag: "200", armor: "0", weight: "2", price: "", slots: 2 },
    { name: "Accelerator Machine Gun", type: "Machine gun", ammo: "ACC", rel: 5, rof: 4, damage: 3, crit: 4, blast: "–", range: "8/32", mag: "100", armor: "0", weight: "3", price: "", slots: 2 },
    { name: "Thermal Machine Gun", type: "Machine gun", ammo: "CELL", rel: 5, rof: 5, damage: 3, crit: 3, blast: "–", range: "6/24", mag: "75", armor: "0", weight: "5", price: "", slots: 2, notes: "Fire 3, Fusion Battery" },
  ],

  launchers: [
    { name: "Undermount Launcher", type: "Grenade launcher", ammo: "40mm", rel: 5, rof: 1, damage: 3, crit: 3, blast: "D", range: "4/16", mag: "1", armor: "0", weight: "½", price: "", notes: "Weight added to rifle as one unit" },
  ],

  systems: [
    { name: "Missile System", type: "Weapon system", ammo: "", rel: 5, rof: 1, damage: "", crit: "", blast: "–", range: "20/80", mag: "1", armor: "0", weight: "2", price: "", notes: "Anti-vehicle" },
    { name: "Missile System Armor-Piercing", type: "Weapon system", ammo: "ACC", rel: "", rof: "", damage: 8, crit: 2, blast: "C", range: "", mag: "", armor: "–1", weight: "1", price: "", notes: "Armor-piercing" },
    { name: "Missile System Blast", type: "Weapon system", ammo: "Gren.", rel: "", rof: "", damage: "Gren.", crit: "Gren.", blast: "Gren.", range: "", mag: "", armor: "Gren.", weight: "Gren.", price: "" },
    { name: "Thermal Projector", type: "Weapon system", ammo: "CELL", rel: 5, rof: "", damage: 4, crit: 1, blast: "–", range: "2/8", mag: "", armor: "0", weight: "", price: "", notes: "Thermal sweep, Fire 5, Bulky" },
    { name: "Firestorm System", type: "Weapon system", ammo: "CELL", rel: 5, rof: "", damage: 5, crit: 1, blast: "–", range: "6/24", mag: "", armor: "0", weight: "", price: "", notes: "Anti-vehicle, Slow, Fire 6, Blast Power 5" },
  ],

  melee: [
    { name: "Knife", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "", mag: "", armor: "+1", weight: "¼", price: 50, notes: "Light · Tech P" },
    { name: "Sword", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "½", price: 200, notes: "Tech P" },
    { name: "Dura Knife", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "", mag: "", armor: "0", weight: "¼", price: 500, notes: "Light, Cell-powered · Tech O" },
    { name: "Dura Sword", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 4, blast: "–", range: "", mag: "", armor: "0", weight: "1", price: 1000, notes: "Heavy, Cell-powered · Tech O" },
    { name: "Mercurium Knife", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "", mag: "", armor: "–1", weight: "½", price: 1500, notes: "Light, Mercurium, Cell-powered · Tech A" },
    { name: "Mercurium Sword", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 4, blast: "–", range: "", mag: "", armor: "–1", weight: "1", price: 3000, notes: "Heavy, Mercurium, Cell-powered · Tech A" },
    { name: "Axe", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 3, blast: "–", range: "", mag: "", armor: "+1", weight: "1", price: 150, notes: "Heavy · Tech P" },
    { name: "Dura Axe", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 3, blast: "–", range: "", mag: "", armor: "–1", weight: "2", price: 2000, notes: "Heavy, Cell-powered · Tech O" },
    { name: "Halberd", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 3, blast: "–", range: "", mag: "", armor: "0", weight: "2", price: 300, notes: "Heavy, Long · Tech P" },
    { name: "Dura Halberd", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 3, blast: "–", range: "", mag: "", armor: "–1", weight: "2", price: 2500, notes: "Heavy, Long, Cell-powered · Tech O" },
    { name: "Rifle Butt", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+2", weight: "As rifle", price: "" },
    { name: "Baton", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+2", weight: "1", price: 100, notes: "Tech P" },
    { name: "Baton, Expandable", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+2", weight: "½", price: 200, notes: "Light · Tech P" },
    { name: "Staff", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+2", weight: "1", price: 50, notes: "Tech P" },
    { name: "Staff, Expandable", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+2", weight: "½", price: 250, notes: "Tech P" },
    { name: "Mace", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "1", price: 100, notes: "Heavy · Tech P" },
    { name: "Power Sledge", type: "Melee", ammo: "", rel: 5, rof: "", damage: 3, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "2", price: 1000, notes: "Heavy, Cell-powered · Tech O" },
    { name: "Power Glove", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "½", price: 1500, notes: "Light, Cell-powered · Tech O" },
    { name: "Shock Stick", type: "Melee", ammo: "", rel: 5, rof: "", damage: 1, crit: "Stun", blast: "–", range: "", mag: "", armor: "+1", weight: "1", price: 500, notes: "Stun, Cell-powered · Tech O" },
    { name: "Shock Whip", type: "Melee", ammo: "", rel: 5, rof: "", damage: 1, crit: "Stun", blast: "–", range: "", mag: "", armor: "+1", weight: "½", price: 800, notes: "Light, Flexible, Stun, Cell-powered · Tech O" },
    { name: "Energy Staff", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "2", price: 1000, notes: "Stun, Heavy, Cell-powered · Tech A" },
    { name: "Energy Stick", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "1", price: 1200, notes: "Stun, Cell-powered · Tech A" },
    { name: "Energy Whip", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 4, blast: "–", range: "", mag: "", armor: "+1", weight: "½", price: 1800, notes: "Light, Flexible, Stun, Cell-powered · Tech A" },
    { name: "Hand Fan", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "", mag: "", armor: "+1", weight: "½", price: 2500, notes: "Light, Cell-powered · Tech A" },
    { name: "Unarmed", type: "Melee", ammo: "", rel: "", rof: "", damage: 1, crit: 4, blast: "–", range: "", mag: "", armor: "+3", weight: "–", price: "", notes: "Tech P" },
    { name: "Brass Knuckles", type: "Melee", ammo: "", rel: 5, rof: "", damage: 1, crit: 3, blast: "–", range: "", mag: "", armor: "+3", weight: "¼", price: 50, notes: "Light · Tech P" },
    { name: "Claws", type: "Melee", ammo: "", rel: 5, rof: "", damage: 1, crit: 2, blast: "–", range: "", mag: "", armor: "+2", weight: "–", price: "", notes: "Tech P" },
    { name: "Dura Claws", type: "Melee", ammo: "", rel: 5, rof: "", damage: 1, crit: 2, blast: "–", range: "", mag: "", armor: "+1", weight: "–", price: 600, notes: "Light · Tech O" },
    { name: "Spear", type: "Melee", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "", mag: "", armor: "+1", weight: "1", price: 200, notes: "Long · Tech P" },
    { name: "Whip", type: "Melee", ammo: "", rel: 5, rof: "", damage: 1, crit: 3, blast: "–", range: "", mag: "", armor: "+1", weight: "½", price: 50, notes: "Flexible · Tech P" },
  ],

  grenades: [
    { name: "Concussion", type: "Grenade", ammo: "", rel: "", rof: "", damage: 1, crit: 2, blast: "C", range: "3/12", mag: "", armor: "0", weight: "¼", price: "", notes: "Light" },
    { name: "Frag", type: "Grenade", ammo: "", rel: "", rof: "", damage: 2, crit: 3, blast: "C", range: "3/12", mag: "", armor: "+1", weight: "¼", price: "", notes: "Light" },
    { name: "Inferno", type: "Grenade", ammo: "", rel: "", rof: "", damage: 2, crit: 2, blast: "B", range: "3/12", mag: "", armor: "0", weight: "¼", price: "", notes: "Light" },
    { name: "Sensor smoke", type: "Grenade", ammo: "", rel: "", rof: "", damage: "", crit: "", blast: "C", range: "3/12", mag: "", armor: "0", weight: "¼", price: "", notes: "Light, Blocks vision and sensors" },
    { name: "Smoke", type: "Grenade", ammo: "", rel: "", rof: "", damage: "", crit: "", blast: "C", range: "3/12", mag: "", armor: "0", weight: "¼", price: "", notes: "Light, Blocks vision" },
    { name: "Stun", type: "Grenade", ammo: "", rel: "", rof: "", damage: "Stun", crit: 3, blast: "C", range: "3/12", mag: "", armor: "0", weight: "¼", price: "", notes: "Light, Stun" },
    { name: "Thermal", type: "Grenade", ammo: "", rel: "", rof: "", damage: 1, crit: 2, blast: "C", range: "3/12", mag: "", armor: "Neg", weight: "¼", price: "", notes: "Light, Fire B" },
    { name: "Thermobaric", type: "Grenade", ammo: "", rel: "", rof: "", damage: 1, crit: 2, blast: "B", range: "3/12", mag: "", armor: "Neg", weight: "¼", price: "", notes: "Light, Fire C" },
    { name: "Electroshock", type: "Grenade", ammo: "", rel: "", rof: "", damage: "Stun", crit: "", blast: "D", range: "3/12", mag: "", armor: "0", weight: "¼", price: "", notes: "Stun (-2), affects electronics" },
  ],

  explosives: [
    { name: "Breach Charge Small", type: "Explosive", ammo: "", rel: "", rof: "", damage: 1, crit: 1, blast: "C", range: "", mag: "", armor: "0", weight: "1", price: "", notes: "Destroys thin walls or normal vehicles" },
    { name: "Breach Charge Medium", type: "Explosive", ammo: "", rel: "", rof: "", damage: 1, crit: 1, blast: "B", range: "", mag: "", armor: "0", weight: "2", price: "", notes: "Destroys thick walls or heavy vehicles" },
    { name: "Breach Charge Heavy", type: "Explosive", ammo: "", rel: "", rof: "", damage: 1, crit: 1, blast: "A", range: "", mag: "", armor: "0", weight: "10", price: "", notes: "Destroys entire house/small building or bridges" },
    { name: "Breach Charge Massive", type: "Explosive", ammo: "", rel: "", rof: "", damage: 1, crit: 1, blast: "AA", range: "", mag: "", armor: "0", weight: "50", price: "", notes: "Destroys roads or entire blocks" },
    { name: "M40 HEDP Grenade", type: "Explosive", ammo: "", rel: "", rof: "", damage: "Blast B", crit: 1, blast: "–", range: "Weapon", mag: "", armor: "0", weight: "", price: "", notes: "Med range when used as hand grenade" },
    { name: "Starshell Flares", type: "Explosive", ammo: "", rel: "", rof: "", damage: 2, crit: 2, blast: "–", range: "Weapon", mag: "", armor: "0", weight: "", price: "" },
    { name: "Baton Rounds", type: "Explosive", ammo: "", rel: "", rof: "", damage: 3, crit: 2, blast: "–", range: "Weapon", mag: "", armor: "0", weight: "", price: "" },
    { name: "M108 Buckshot Canisters", type: "Explosive", ammo: "", rel: "", rof: "", damage: 3, crit: 1, blast: "–", range: "Weapon", mag: "", armor: "0", weight: "", price: "" },
    { name: "U4 QTC Firebomb Ammunition", type: "Explosive", ammo: "", rel: "", rof: "", damage: "Fire A", crit: 2, blast: "–", range: "Weapon", mag: "", armor: "0", weight: "", price: "" },
    { name: "M20 Claymore Mine", type: "Explosive", ammo: "", rel: "", rof: "", damage: "Blast B", crit: 1, blast: "–", range: "Short", mag: "", armor: "0", weight: "", price: "", notes: "Triggered at SHORT range. OBSERVATION to spot." },
    { name: "M111 Anti-Vehicle Mine", type: "Explosive", ammo: "", rel: "", rof: "", damage: "Blast A", crit: 1, blast: "–", range: "Close", mag: "", armor: "0", weight: "", price: "", notes: "Triggered at CLOSE range. Initial target damage +2 and AP" },
  ],

  other: [
    { name: "Harpoon Grappling Gun", type: "Other", ammo: "SPEC.", rel: 5, rof: "", damage: 1, crit: 3, blast: "–", range: "2/8", mag: "1", armor: "+2", weight: "1", price: "", notes: "Armor doubles, Single Shot" },
    { name: "Starshell Flare Pistol", type: "Other", ammo: "SPEC.", rel: 5, rof: "", damage: 1, crit: 3, blast: "–", range: "3/12", mag: "1", armor: "N/A", weight: "½", price: "", notes: "Light, Illuminates one zone, Single Shot" },
    { name: "EVA Mining Laser", type: "Other", ammo: "CELL", rel: 5, rof: 1, damage: 3, crit: 1, blast: "–", range: "1/4", mag: "20", armor: "0", weight: "2", price: "", notes: "Armor piercing, Heavy, Cell-powered" },
    { name: "Heavy Incinerator", type: "Other", ammo: "SPEC.", rel: 5, rof: 2, damage: "Fire C", crit: 2, blast: "–", range: "1/4", mag: "50", armor: "0", weight: "2", price: "", notes: "Heavy, Uses 3 ammo per roll and per ammo die, requires a special reload (1 weight)" },
    { name: "Rock", type: "Other", ammo: "", rel: 5, rof: "", damage: 1, crit: 3, blast: "–", range: "1/4", mag: "", armor: "+2", weight: "½", price: "", notes: "Light" },
    { name: "Blowpipe", type: "Other", ammo: "", rel: 5, rof: "", damage: 1, crit: 4, blast: "–", range: "1/4", mag: "", armor: "+2", weight: "½", price: "", notes: "Light, Single-shot" },
    { name: "Throwing Knife", type: "Other", ammo: "", rel: 5, rof: "", damage: 1, crit: 2, blast: "–", range: "1/4", mag: "", armor: "+1", weight: "¼", price: "", notes: "Light" },
    { name: "Throwing Spear", type: "Other", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "2/8", mag: "", armor: "+1", weight: "1", price: "" },
    { name: "Throwing Axe", type: "Other", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "1/4", mag: "", armor: "+1", weight: "1", price: "" },
    { name: "Spear-thrower", type: "Other", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "2/8", mag: "", armor: "+1", weight: "1", price: "", notes: "Single-shot" },
    { name: "Harpoon", type: "Other", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "2/8", mag: "", armor: "+1", weight: "1", price: "", notes: "Heavy, Single-shot" },
    { name: "Improvised Bow", type: "Other", ammo: "", rel: 3, rof: "", damage: 1, crit: 3, blast: "–", range: "2/8", mag: "", armor: "+1", weight: "1", price: "", notes: "Single-shot" },
    { name: "Hunting bow", type: "Other", ammo: "", rel: 5, rof: "", damage: 1, crit: 2, blast: "–", range: "4/16", mag: "", armor: "+1", weight: "1", price: "", notes: "Single-shot" },
    { name: "Crossbow", type: "Other", ammo: "", rel: 5, rof: "", damage: 2, crit: 3, blast: "–", range: "4/16", mag: "", armor: "0", weight: "1", price: "", notes: "Single-shot" },
    { name: "Combat Bow", type: "Other", ammo: "", rel: 5, rof: "", damage: "2/Gren.", crit: "3/Gren.", blast: "–", range: "4/16", mag: "", armor: "0", weight: "1", price: "", notes: "Single-shot" },
  ],
}
