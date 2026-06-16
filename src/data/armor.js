// ⚠ GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: reference-csv/*.csv. Regenerate with `npm run gen:refs`
// (runs automatically before `npm run dev` and `npm run build`).

export const ARMOR_CATEGORIES = [
  { id: "body", label: "Body Armor" },
  { id: "helmets", label: "Helmets" },
  { id: "exos", label: "Exo Suits" },
  { id: "shields", label: "Shields" },
  { id: "mods", label: "Modifications" },
]

export const ARMOR = {
  body: [
    { name: "Light Primitive armor", rating: 1, slots: "", weight: "2", tech: "Primitive", cost: 300, features: "Bulky, protects torso, arms and legs" },
    { name: "Heavy Primitive armor", rating: 2, slots: "", weight: "4", tech: "Primitive", cost: 600, features: "Bulky, protects torso, arms and legs" },
    { name: "Flightsuit", rating: "–", slots: 1, weight: "½", tech: "Ordinary", cost: 500, features: "Vacuum suit. Light, unarmored suit worn by pilots and ship crew. Protects torso only if choosing armor as a feature." },
    { name: "Protective Clothing", rating: "–", slots: 1, weight: "½", tech: "Ordinary", cost: 1200, features: "Standard clothing that protects from the elements and can be modified. Armored feature is not detectable without close inspection (see ‘Built-in weapon’). Protects torso, arms and legs  if adding armor as a feature." },
    { name: "Armored Vest", rating: 1, slots: "", weight: "1", tech: "Ordinary", cost: 400, features: "Padded, flexible vest designed for additional protection. Commonly found throughout space as a cheap option for protection. Noticeable when worn. Protects torso only," },
    { name: "Light Armor", rating: 1, slots: 2, weight: "2", tech: "Ordinary", cost: 5000, features: "Protects torso and arms with ballistic armor, Includes standard helmet, built-in personal comms. Adding additional armor as feature can either add armor to legs and upgrades helmet to ballistic OR improve torso and arms armor by 1." },
    { name: "Heavy Armor", rating: 1, slots: 3, weight: "3", tech: "Ordinary", cost: 10000, features: "Full body ballistic armor, Includes ballistic helmet, built-in short range comms, vital readouts (+1 MEDICURGY to treat)." },
    { name: "Ablative Pads", rating: "–", slots: "", weight: "–", tech: "Advanced", cost: 2000, features: "Reduces damage of one hit by 1 to the location when taking damage. Can apply one to each hit location." },
  ],

  helmets: [
    { name: "Standard Helmet", rating: "–", slots: "", weight: "½", tech: "Ordinary", cost: 500, features: "If you suffer a head critical injury, roll 1d6. 1-2: suffer #1 instead, 3-4: suffer #2 instead, 5-6: original roll. Roll a d6 and subtract damage taken (after armor). If the roll is a 1 or less, helmet is now useless." },
    { name: "Ballistic Helmet", rating: 1, slots: "", weight: "1", tech: "Ordinary", cost: 1000, features: "If you suffer a head critical injury, roll 1d6. 1-2: suffer #1 instead, 3-6: suffer #2 instead. Roll a d6 and subtract damage taken (after armor). If the roll is a 1 or less, helmet is now useless." },
  ],

  exos: [
    { name: "Exo Shell", rating: 0, slots: 1, weight: "3", tech: "Ordinary", cost: 3000, features: "Bulky, Thermostatic suit, Vacuum suit, Oxygen supply" },
    { name: "Reinforced Exo Shell", rating: 0, slots: 1, weight: "3", tech: "Ordinary", cost: 8000, features: "Bulky, Thermostatic suit, Vacuum suit, Oxygen supply, Reinforced exo servos" },
    { name: "Armored Exo", rating: 1, slots: 2, weight: "4", tech: "Advanced", cost: 25000, features: "Bulky, Thermostatic suit, Vacuum suit, Oxygen supply," },
    { name: "Battle Exo", rating: 2, slots: 5, weight: "–", tech: "Advanced", cost: 60000, features: "Bulky, Thermostatic suit, Vacuum suit, Oxygen supply, Reinforced exo servos  Will now be a vehicle instead" },
  ],

  shields: [
    { name: "Shield", rating: 1, slots: "", weight: "1", tech: "Primitive", cost: 100, features: "Protects 2 hit locations from one direction when held. Fast action to change what locations are protected. Can use only a pistol or SMG one handed while held. If firing in that round, arms will always be exposed for attacks." },
    { name: "Riot Shield", rating: 1, slots: "", weight: "2", tech: "Ordinary", cost: 500, features: "Protects 3 hit locations from one directions when held. Fast action to change what locations are protected. Can use only a pistol or SMG one handed while held. If firing in that round, arms will always be exposed for attacks." },
    { name: "Combat Shield", rating: 1, slots: "", weight: "3", tech: "Ordinary", cost: 1000, features: "Provides full body armor from one direction when held. Fast action to change what locations are protected. Can use only a pistol or SMG one handed while held. If firing in that round, arms will always be exposed for attacks." },
  ],

  mods: [
    { name: "Built-in weapon", rating: "", slots: "", weight: "Weapon", tech: "", cost: "10%", features: "The armor has a built-in weapon – a pistol, dagger or short sword. The weapon must be purchased separately. Can be accessed via a Fast action. Gives a -1 to Observation to detect the weapon." },
    { name: "Bulky", rating: "", slots: "", weight: "", tech: "", cost: "", features: "This is a negative feature applied to extremely bulky armors. Gives the wearer a -1 to all MOBILITY rolls while using this armor." },
    { name: "Camouflage unit", rating: "", slots: "", weight: "½", tech: "", cost: "50%", features: "When activated, the unit creates a camouflage field around the suit that makes it almost invisible and very difficult to detect (-2 to OBSERVATION)." },
    { name: "High-density armalite", rating: "", slots: "", weight: "½", tech: "", cost: "50%", features: "Gives a +1 to Armor Rating. Can only be added once to an armor." },
    { name: "Hydrostatic gel", rating: "", slots: "", weight: "¼", tech: "", cost: "25%", features: "Gives a +1 to Armor Rating against explosions or falling." },
    { name: "Oxygen supply", rating: "", slots: "", weight: "½", tech: "", cost: "25%", features: "Eight hours’ worth of oxygen, in a closed helmet. Does not protect against vacuum by itself." },
    { name: "Magnetic boots", rating: "", slots: "", weight: "½", tech: "", cost: "10%", features: "The boots of the suit have electromagnets to make them work in zero-G and stick to ship hulls. Gives a +1 to Force rolls for resisting unexpected movement (shoving, explosions, etc)." },
    { name: "Micro servos", rating: "", slots: "", weight: "¼", tech: "", cost: "25%", features: "Gives a +1 to MOBILITY for jumping and running." },
    { name: "Reinforced exo servos", rating: "", slots: "", weight: "½", tech: "", cost: "25%", features: "Gives a +1 to Force rolls. Throwing weapons have their damage increased by 1. Can only be added to exo suits." },
    { name: "Streamlined", rating: "", slots: "", weight: "-½", tech: "", cost: "50%", features: "Using better quality and lighter materials, removes the “Bulky” feature from an armor if present or reduces weight one increment (1/2 to 1/4, 1 to 1/2, 2 to 1, etc). Two Features can be used to both remove Bulky and reduce the weight." },
    { name: "Thermostatic suit", rating: "", slots: "", weight: "½", tech: "", cost: "50%", features: "A suit that monitors and chemically corrects the wearer’s body temperature. No extra energy source is necessary. Works between +70 degrees Celsius and -80 degrees Celsius. Collects the wearer’s sweat and urine, purifies it, and fills up an internal compartment with clean water. Gives a +1 to Survival rolls related to surviving in extreme conditions and supplies one ration of water per day to the wearer." },
    { name: "Vacuum suit", rating: "", slots: "", weight: "½", tech: "", cost: "25%", features: "Protects against vacuum as well as both weak and strong radiation in proximity. Gives a +2 to Stamina for resisting extreme radiation." },
    { name: "Zero-G jet", rating: "", slots: "", weight: "¼", tech: "", cost: "10%", features: "Tiny thrusters give increased maneuverability in zero-G (+1 to MOBILITY)." },
  ],
}
