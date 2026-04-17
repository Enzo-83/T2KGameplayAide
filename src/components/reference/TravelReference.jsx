import { useState, useRef } from 'react'
import {
  TERRAIN_TYPES, TERRAIN_FOOTNOTES,
  TASKS,
  FORAGING_SEASON_MODS,
  DRIVING_MISHAPS,
  WEATHER_LEVELS, NORDIC_LIGHT,
  SCRAP_TABLE,
} from '../../data/travel'
import { VEHICLES, VEHICLE_CATEGORIES } from '../../data/vehicles'

const CATS = [
  { id: 'terrain', label: 'Terrain'         },
  { id: 'tasks',   label: 'Tasks'           },
  { id: 'march',   label: 'Marching'        },
  { id: 'driving', label: 'Driving'         },
  { id: 'light',   label: 'Light & Weather' },
  { id: 'fuel',    label: 'Fuel Calc'       },
  { id: 'city',    label: 'City Travel'     },
  { id: 'scrap',   label: 'Scrap (D100)'   },
]

function fmtMod(val) {
  if (val === null)         return '—'
  if (val === 'as_terrain') return '—*'
  if (val === 0)            return '0'
  return val > 0 ? `+${val}` : `−${Math.abs(val)}`
}

function modCls(val) {
  if (typeof val !== 'number') return ''
  if (val > 0) return 'trav-mod--pos'
  if (val < 0) return 'trav-mod--neg'
  return ''
}

// ── Terrain ────────────────────────────────────────────────────────
function TerrainTable() {
  return (
    <div className="trav-section">
      <div className="trav-terrain-intro">
        <p><strong>Roads:</strong> Only main paved roads count for game purposes. Dirt tracks and side roads do not.</p>
        <p><strong>Rivers:</strong> Not a terrain type — cross via ford, bridge, raft, or boat. Can be used for travel.</p>
        <p className="hint">Terrain type is determined by the center dot of the hex.</p>
      </div>
      <div className="trav-table-wrap">
        <table className="trav-table">
          <thead>
            <tr>
              <th className="trav-th trav-th--first">Terrain</th>
              <th className="trav-th">Speed*</th>
              <th className="trav-th">Driving</th>
              <th className="trav-th">Foraging</th>
              <th className="trav-th">Hunting</th>
              <th className="trav-th">Scrounging</th>
              <th className="trav-th trav-th--enc">Enc. Dist.</th>
            </tr>
          </thead>
          <tbody>
            {TERRAIN_TYPES.map(t => (
              <tr key={t.id} className={`trav-row ${t.cityOnly ? 'trav-row--city' : ''}`}>
                <td className="trav-td trav-td--first">
                  {t.label}
                  {t.cityOnly && <span className="trav-city-badge">city</span>}
                </td>
                <td className="trav-td trav-td--center">{t.speed}{t.speedSup ?? ''}</td>
                <td className={`trav-td trav-td--center ${modCls(t.driving)}`}>{fmtMod(t.driving)}</td>
                <td className={`trav-td trav-td--center ${modCls(t.foraging)}`}>{fmtMod(t.foraging)}</td>
                <td className={`trav-td trav-td--center ${modCls(t.hunting)}`}>{fmtMod(t.hunting)}</td>
                <td className={`trav-td trav-td--center ${modCls(t.scrounging)}`}>{fmtMod(t.scrounging)}</td>
                <td className="trav-td trav-td--center trav-td--enc">{t.encounterDist}{t.encSup ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="trav-footnotes">
        {TERRAIN_FOOTNOTES.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  )
}

// ── Tasks ──────────────────────────────────────────────────────────
function TasksRef() {
  return (
    <div className="trav-section">
      <div className="trav-shifts-header">
        <div className="trav-shift-row">
          {['Morning', 'Day', 'Evening', 'Night'].map(s => (
            <span key={s} className="trav-shift-badge">{s}</span>
          ))}
        </div>
        <p className="hint">Each character performs <strong>one task per shift</strong>. Exception: one PC may keep watch while marching.</p>
      </div>
      <div className="trav-task-grid">
        {TASKS.map(t => (
          <div key={t.id} className="trav-task-card">
            <div className="trav-task-header">
              <span className="trav-task-name">{t.name}</span>
              <div className="trav-task-badges">
                {t.foot && <span className="trav-badge trav-badge--foot">on foot</span>}
                {t.solo && <span className="trav-badge trav-badge--solo">1 PC only</span>}
              </div>
            </div>
            <p className="trav-task-desc">{t.desc}</p>
            {t.note && <p className="trav-task-note">{t.note}</p>}
          </div>
        ))}
      </div>

      <h4 className="trav-sub-title" style={{ marginTop: '1.25rem' }}>Foraging — Rules</h4>
      <div className="trav-city-grid">

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">SURVIVAL Roll</h4>
          <ul className="trav-city-list">
            <li>Choose <strong>food</strong> or <strong>water</strong> before rolling.</li>
            <li>Roll <strong>SURVIVAL</strong>, modified by terrain type and season.</li>
            <li>Only one character rolls per hex per shift — others can help.</li>
            <li>Each repeat forage in the <strong>same hex</strong>: <strong>−1 cumulative</strong> modifier. Resets after a week (except in winter).</li>
          </ul>
          <div className="trav-table-wrap" style={{ marginTop: '0.5rem' }}>
            <table className="trav-table" style={{ minWidth: 'unset' }}>
              <thead>
                <tr>
                  <th className="trav-th trav-th--first">Season</th>
                  <th className="trav-th">Foraging</th>
                </tr>
              </thead>
              <tbody>
                {FORAGING_SEASON_MODS.map(r => (
                  <tr key={r.season} className="trav-row">
                    <td className="trav-td trav-td--first">{r.season}</td>
                    <td className={`trav-td trav-td--center ${modCls(r.mod)}`}>{fmtMod(r.mod)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Results</h4>
          <ul className="trav-city-list">
            <li><strong>Food:</strong> each success () = 1 ration of wild food.</li>
            <li><strong>Water:</strong> any success = enough drinkable water to fill water bottles.</li>
            <li>Wild food can be eaten as-is or cooked into domestic food.</li>
          </ul>
        </div>

      </div>

      <h4 className="trav-sub-title" style={{ marginTop: '1.25rem' }}>Scrounging — Rules</h4>
      <div className="trav-city-grid">

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">SURVIVAL Roll</h4>
          <ul className="trav-city-list">
            <li>Spend a shift scrounging your current hex.</li>
            <li>Roll <strong>SURVIVAL</strong>, modified by terrain type (see Terrain table).</li>
            <li>Each success () = roll <strong>D100</strong> on the scrap table.</li>
            <li>Only one character rolls per hex per shift — others can help the roll.</li>
            <li>Each repeat scrounge in the <strong>same hex</strong>: <strong>−1 cumulative</strong> modifier.</li>
            <li>Referee may choose the item found instead of rolling, or call for a re-roll.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Scrap &amp; Scavenging</h4>
          <ul className="trav-city-list">
            <li>Scrap table lists: item, effect, value (in bullets), and spare parts yield.</li>
            <li>Scavenging (physically retrieving) one or more items takes a <strong>full separate shift</strong>.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Quick Search</h4>
          <ul className="trav-city-list">
            <li>A fast scan of a small area — Referee allows only where scrap is likely (e.g. a settlement).</li>
            <li><strong>No roll required</strong> — gives one free D100 roll on the scrap table.</li>
            <li>Does <strong>not</strong> count as the shift's scrounging task — you can still scrounge the same hex this shift.</li>
          </ul>
        </div>

      </div>

      <h4 className="trav-sub-title" style={{ marginTop: '1.25rem' }}>Keeping Watch — Rules</h4>
      <div className="trav-city-grid">

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">RECON Roll</h4>
          <ul className="trav-city-list">
            <li>Passive roll — <strong>cannot be pushed</strong>.</li>
            <li>Made when the Referee indicates an encounter is approaching. Distance depends on terrain (see Terrain table).</li>
            <li>Straight RECON roll — only opposed if the enemy is actively ambushing.</li>
            <li><strong>Success:</strong> you spot them first. Choose to show yourselves, back off, or set up an ambush (opposed RECON roll).</li>
            <li><strong>Fail:</strong> the other group spots you first.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Backing Off</h4>
          <ul className="trav-city-list">
            <li>If you back off without being spotted, you can circle around the encounter off-road.</li>
            <li>Costs <strong>+1 hex of off-road movement</strong> (modified by terrain) before you can continue forward.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Vehicle Modifiers</h4>
          <ul className="trav-city-list">
            <li><strong>Your group motorized, theirs on foot:</strong> −2 to RECON roll.</li>
            <li><strong>All inside armored vehicle, hatches closed:</strong> automatically fail.</li>
            <li><strong>Your group on foot, theirs motorized:</strong> +2 to RECON roll.</li>
            <li><strong>Both groups in vehicles:</strong> roll normally.</li>
          </ul>
        </div>

      </div>
      <h4 className="trav-sub-title" style={{ marginTop: '1.25rem' }}>Making Camp — Rules</h4>
      <div className="trav-city-grid">

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">SURVIVAL Roll</h4>
          <ul className="trav-city-list">
            <li>One character rolls — others can help. Takes a full shift (usually evening).</li>
            <li><strong>Success:</strong> sheltered camp with cover from fire; everyone can rest safely.</li>
            <li><strong>Fail:</strong> camp is set up but Referee makes a hidden roll on the camp mishap table. Can be triggered anytime during the stay.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Fire</h4>
          <ul className="trav-city-list">
            <li>Campfire is included in making camp — required for cooking and protection from cold.</li>
            <li>You can choose <strong>not</strong> to light a fire; smoke is visible within visual range and will give away your position.</li>
            <li>Sleeping without fire (or other heat source): everyone rolls <strong>STAMINA</strong> to avoid hypothermia — except during warm summer nights.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Hidden Camp &amp; Standing Guard</h4>
          <ul className="trav-city-list">
            <li><strong>Hidden camp:</strong> after the SURVIVAL roll, make a <strong>RECON roll</strong>. Note the result — used as an opposed roll against enemies passing within visual range. Without it, enemies automatically spot the camp.</li>
            <li><strong>Standing guard:</strong> assign a sentry to stay awake and keep watch. Let them sleep during another shift (usually evening).</li>
          </ul>
        </div>

      </div>

      <h4 className="trav-sub-title" style={{ marginTop: '1.25rem' }}>Camp Activities</h4>
      <div className="trav-city-grid">

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Cooking</h4>
          <ul className="trav-city-list">
            <li>Requires a campfire or kitchen. Cook up to <strong>a dozen rations</strong> per shift.</li>
            <li>Roll <strong>SURVIVAL</strong>. Regardless of result, wild food becomes domestic rations.</li>
            <li><strong>Fail:</strong> anyone who eats must make a STAMINA roll to resist food poisoning (Referee can roll secretly).</li>
            <li>Can be done in the same shift another character makes camp.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Resting</h4>
          <ul className="trav-city-list">
            <li>Allows recovery from damage (see recovery rules).</li>
            <li>If the shift is interrupted by combat or other dramatic activity, it no longer counts as rest.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Sleeping</h4>
          <ul className="trav-city-list">
            <li>Must sleep at least <strong>one shift per day</strong> to avoid becoming sleep-deprived.</li>
            <li>If the shift is interrupted by combat or other dramatic activity, it no longer counts as sleep.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Exploring</h4>
          <ul className="trav-city-list">
            <li>Interrupts the journey. Can take one shift to several days or weeks.</li>
            <li>You may need rest or sleep breaks while exploring.</li>
            <li>Cannot rest or sleep if you explore for <strong>more than half the shift</strong>.</li>
          </ul>
        </div>

      </div>

    </div>
  )
}

// ── Marching ───────────────────────────────────────────────────────
function MarchingRef() {
  return (
    <div className="trav-section">
      <h4 className="trav-sub-title">Base Movement</h4>
      <div className="trav-table-wrap" style={{ maxWidth: '360px' }}>
        <table className="trav-table" style={{ minWidth: 'unset' }}>
          <thead>
            <tr>
              <th className="trav-th trav-th--first">Terrain</th>
              <th className="trav-th">Hexes / Shift</th>
            </tr>
          </thead>
          <tbody>
            <tr className="trav-row">
              <td className="trav-td trav-td--first">Road or open terrain</td>
              <td className="trav-td trav-td--center">2</td>
            </tr>
            <tr className="trav-row">
              <td className="trav-td trav-td--first">Off-road (all other terrain)</td>
              <td className="trav-td trav-td--center">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="trav-city-grid">
        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Heavy Rain</h4>
          <ul className="trav-city-list">
            <li>Each PC makes a <strong>STAMINA roll</strong>.</li>
            <li>Fail: base movement −1 hex (may mean no progress).</li>
            <li>If some succeed and others fail: decide to leave stragglers or wait for them.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Off-Road at Night</h4>
          <ul className="trav-city-list">
            <li>Requires a <strong>SURVIVAL roll</strong> — one PC rolls for the group.</li>
            <li>Fail: can't find the way; no progress this shift.</li>
            <li>On-road marching at night has no restriction.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Forced March</h4>
          <ul className="trav-city-list">
            <li><strong>Shifts 1–2:</strong> march freely, no roll needed.</li>
            <li><strong>Shift 3:</strong> each PC makes a <strong>STAMINA roll</strong>. Fail = must rest or sleep instead.</li>
            <li><strong>Shift 4:</strong> STAMINA roll at <strong>−2</strong>. Fail = must rest/sleep. Success = march, but automatically sleep-deprived.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Encounters</h4>
          <ul className="trav-city-list">
            <li>Short breaks are included in travel speeds.</li>
            <li>Stopping for more than a few minutes costs movement hexes.</li>
            <li>Referee decides exact hexes lost from an encounter stop.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ── Driving ────────────────────────────────────────────────────────
function DrivingRef() {
  const [rolled, setRolled] = useState(null)

  function rollMishap() {
    setRolled(Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6))
  }

  return (
    <div className="trav-section">
      <div className="trav-city-grid">
        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Speed</h4>
          <ul className="trav-city-list">
            <li>Use vehicle's <strong>travel speed</strong> (10 km hexes per shift).</li>
            <li>Two rates listed: on-road / off-road. A dash (—) = cannot go off-road.</li>
            <li>Normally choose on-road or off-road for a full shift. Referee may allow splitting a shift.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Terrain Speed Factors</h4>
          <ul className="trav-city-list">
            <li><strong>×½</strong> — costs 2 movement hexes per hex entered.</li>
            <li><strong>×⅓</strong> — costs 3 movement hexes per hex entered.</li>
            <li><strong>×¼</strong> — costs 4 movement hexes per hex entered.</li>
            <li>Accumulate movement across multiple shifts for slow terrain.</li>
            <li>Terrain has no effect when driving on-road.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Night Driving</h4>
          <ul className="trav-city-list">
            <li>Effective travel speed <strong>halved</strong>, fractions rounded up.</li>
            <li>Applies both on-road and off-road.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">DRIVING Roll</h4>
          <ul className="trav-city-list">
            <li>Roll at the <strong>start of each driving shift</strong>, modified by terrain.</li>
            <li>Additional roll when going off-road into a <strong>new terrain type</strong>.</li>
            <li><strong>Heavy rain:</strong> −2 modifier.</li>
            <li>Fail → Mishap (2D6 below). Mishap occurs roughly halfway through movement.</li>
            <li>Pushing the roll can reduce the vehicle's reliability rating.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Fuel Off-Road</h4>
          <ul className="trav-city-list">
            <li>Fuel consumption is <strong>doubled</strong> when driving off-road.</li>
            <li>Use the Fuel Calc tab — enter on-road and off-road hexes separately.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Encounters</h4>
          <ul className="trav-city-list">
            <li>Short breaks are included in travel speeds.</li>
            <li>Stopping for more than a few minutes costs movement hexes.</li>
            <li>Referee decides exact hexes lost.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Idling</h4>
          <ul className="trav-city-list">
            <li>Vehicle left running (e.g. to power electric devices): listed fuel consumption is <strong>per shift</strong> instead of per hex.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Alcohol Fuel</h4>
          <ul className="trav-city-list">
            <li>Gasoline and diesel are scarce. Engines can be modified to run on ethanol or methanol.</li>
            <li>Conversion: <strong>TECH roll</strong>, one shift of work.</li>
            <li>Fuel consumption <strong>doubled</strong> when running on alcohol.</li>
            <li>No game distinction between ethanol and methanol.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Stills</h4>
          <ul className="trav-city-list">
            <li>Produce alcohol fuel from wood, plants, grain, or paper.</li>
            <li><strong>1 enc</strong> of raw materials → <strong>1 liter</strong> of alcohol fuel.</li>
            <li>Still produces X liters per shift (stationary, monitored by at least one person — see gear chapter).</li>
            <li>Gathering: ~<strong>30 enc</strong> of raw materials per shift in the field. <strong>Halved in winter.</strong></li>
          </ul>
        </div>
      </div>

      <h4 className="trav-sub-title">Driving Mishaps (2D6)</h4>
      <div className="trav-mishap-controls">
        <div className="trav-mishap-roll-row">
          <button className="btn btn-secondary trav-roll-btn" onClick={rollMishap}>Roll 2D6</button>
          {rolled !== null && <span className="trav-roll-result">{rolled}</span>}
        </div>
      </div>
      <div className="trav-table-wrap">
        <table className="trav-table">
          <thead>
            <tr>
              <th className="trav-th trav-th--roll">2D6</th>
              <th className="trav-th trav-th--mishap-name">Mishap</th>
              <th className="trav-th">Effect</th>
            </tr>
          </thead>
          <tbody>
            {DRIVING_MISHAPS.map(m => (
              <tr key={m.roll} className={`trav-row ${rolled === m.roll ? 'trav-row--highlight' : ''}`}>
                <td className="trav-td trav-td--center trav-td--roll">{m.roll}</td>
                <td className="trav-td trav-td--bold trav-td--mishap-name">{m.name}</td>
                <td className="trav-td trav-td--effect">{m.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Light & Weather ────────────────────────────────────────────────
const LIGHT_CLS = { Light: 'trav-light--light', Dusk: 'trav-light--dusk', Dark: 'trav-light--dark' }

function LightWeatherRef() {
  const [weather,     setWeather]     = useState(0)
  const [rollResult,  setRollResult]  = useState(null)
  const [rollOutcome, setRollOutcome] = useState('')

  function rollWeather() {
    const d6 = Math.ceil(Math.random() * 6)
    setRollResult(d6)
    if (d6 === 6) {
      const next = Math.min(weather + 1, 2)
      setWeather(next)
      setRollOutcome(next > weather
        ? `Worsens → ${WEATHER_LEVELS[next].name}`
        : 'Already at worst — no change')
    } else if (d6 >= 4) {
      const next = Math.max(weather - 1, 0)
      setWeather(next)
      setRollOutcome(next < weather
        ? `Improves → ${WEATHER_LEVELS[next].name}`
        : 'Already fair — no change')
    } else {
      setRollOutcome('No change')
    }
  }

  const current = WEATHER_LEVELS[weather]

  return (
    <div className="trav-section">

      {/* Nordic Light table */}
      <h4 className="trav-sub-title">Nordic Light</h4>
      <p className="hint trav-section-hint">
        In most regions morning/day = light, evening/night = dark.
        In the Nordic region, seasons shift entire shifts.
      </p>
      <div className="trav-table-wrap">
        <table className="trav-table trav-table--light">
          <thead>
            <tr>
              <th className="trav-th trav-th--first">Shift</th>
              {NORDIC_LIGHT.seasons.map(s => <th key={s} className="trav-th trav-th--season">{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {NORDIC_LIGHT.shifts.map(shift => (
              <tr key={shift} className="trav-row">
                <td className="trav-td trav-td--first">{shift}</td>
                {NORDIC_LIGHT.seasons.map(season => {
                  const level = NORDIC_LIGHT.data[shift][season]
                  return (
                    <td key={season} className={`trav-td trav-td--center trav-td--light ${LIGHT_CLS[level]}`}>
                      {level}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="trav-footnotes">
        <li><strong>Light</strong> — full visibility, no modifier.</li>
        <li><strong>Dusk</strong> — visibility limited; −2 to ranged attacks beyond 10 m.</li>
        <li><strong>Dark</strong> — −2 to all ranged attacks; sight very limited.</li>
      </ul>

      {/* Weather */}
      <h4 className="trav-sub-title" style={{ marginTop: '1.25rem' }}>Weather</h4>
      <p className="hint trav-section-hint">
        Referee rolls D6 each shift (or less often).
        <strong> 6</strong> = worsens toward rain. &nbsp;
        <strong>4–5</strong> = improves toward fair. &nbsp;
        <strong>1–3</strong> = no change.
      </p>

      <div className="trav-weather-selector">
        {WEATHER_LEVELS.map((w, i) => (
          <button
            key={w.id}
            className={`trav-weather-btn ${weather === i ? 'trav-weather-btn--active' : ''}`}
            onClick={() => { setWeather(i); setRollResult(null); setRollOutcome('') }}
          >
            {w.name}
          </button>
        ))}
      </div>

      <div className="trav-weather-effects">
        <div className="trav-weather-stat">
          <span className="trav-calc-label">Day visibility</span>
          <span className="trav-weather-val">{current.visDay}</span>
        </div>
        <div className="trav-weather-stat">
          <span className="trav-calc-label">Night visibility</span>
          <span className="trav-weather-val">{current.visDark}</span>
        </div>
        {current.ranged !== 0 && (
          <div className="trav-weather-stat">
            <span className="trav-calc-label">Ranged attacks</span>
            <span className={`trav-weather-val ${modCls(current.ranged)}`}>{fmtMod(current.ranged)}</span>
          </div>
        )}
        {current.driving !== 0 && (
          <div className="trav-weather-stat">
            <span className="trav-calc-label">DRIVING roll</span>
            <span className={`trav-weather-val ${modCls(current.driving)}`}>{fmtMod(current.driving)}</span>
          </div>
        )}
        {current.march && (
          <div className="trav-weather-stat">
            <span className="trav-calc-label">Marching</span>
            <span className="trav-weather-val trav-mod--neg">STAMINA roll required</span>
          </div>
        )}
        {current.note && <p className="hint" style={{ marginTop: '0.3rem' }}>{current.note}</p>}
      </div>

      <div className="trav-mishap-roll-row" style={{ marginTop: '0.5rem' }}>
        <button className="btn btn-secondary trav-roll-btn" onClick={rollWeather}>Roll D6 for change</button>
        {rollResult !== null && <span className="trav-roll-result">{rollResult}</span>}
        {rollOutcome && <span className="trav-weather-outcome">{rollOutcome}</span>}
      </div>

    </div>
  )
}

// ── Fuel Calculator ────────────────────────────────────────────────
const ALL_MOTORIZED = VEHICLE_CATEGORIES.flatMap(cat =>
  (VEHICLES[cat.id] ?? [])
    .filter(v => v.fuelCons !== null)
    .map(v => ({ ...v, catId: cat.id, catLabel: cat.label }))
)

function FuelCalculator() {
  const [mode,          setMode]          = useState('long')
  const [vehicleKey,    setVehicleKey]    = useState('')
  const [manualCons,    setManualCons]    = useState('')
  const [onRoadHexes,   setOnRoadHexes]   = useState('')
  const [offRoadHexes,  setOffRoadHexes]  = useState('')
  const [cityHexes,     setCityHexes]     = useState('')
  const [alcohol,       setAlcohol]       = useState(false)

  const sel        = vehicleKey ? ALL_MOTORIZED.find(v => v.name === vehicleKey) : null
  const cons       = sel ? sel.fuelCons : (parseFloat(manualCons) || 0)
  const multiplier = alcohol ? 2 : 1
  const fuelCap    = sel?.fuelCap ?? null

  // Long-range: off-road fuel doubles per the rules
  const onR  = parseFloat(onRoadHexes)  || 0
  const offR = parseFloat(offRoadHexes) || 0
  const city = parseFloat(cityHexes)    || 0

  const longFuel = cons * (onR + offR * 2) * multiplier
  const cityFuel = cons * city * multiplier / 50

  const totalFuel  = mode === 'long' ? longFuel : cityFuel
  const hasInput   = mode === 'long' ? (onR > 0 || offR > 0) : city > 0

  const onRoadRange  = fuelCap && cons > 0 ? Math.floor(fuelCap / (cons * multiplier))     : null
  const offRoadRange = fuelCap && cons > 0 ? Math.floor(fuelCap / (cons * 2 * multiplier)) : null
  const cityRange    = fuelCap && cons > 0 ? Math.floor(fuelCap * 50 / (cons * multiplier)): null

  return (
    <div className="trav-section">
      <div className="trav-calc">

        <div className="trav-calc-modes">
          <button
            className={`trav-mode-btn ${mode === 'long' ? 'trav-mode-btn--active' : ''}`}
            onClick={() => setMode('long')}
          >
            Long-Range
          </button>
          <button
            className={`trav-mode-btn ${mode === 'city' ? 'trav-mode-btn--active' : ''}`}
            onClick={() => setMode('city')}
          >
            City (200 m hexes)
          </button>
        </div>

        <div className="trav-calc-body">

          <div className="trav-calc-field">
            <label className="trav-calc-label">Vehicle</label>
            <select value={vehicleKey} onChange={e => { setVehicleKey(e.target.value); setManualCons('') }}>
              <option value="">— Enter consumption manually —</option>
              {VEHICLE_CATEGORIES.map(cat => {
                const list = ALL_MOTORIZED.filter(v => v.catId === cat.id)
                if (!list.length) return null
                return (
                  <optgroup key={cat.id} label={cat.label}>
                    {list.map(v => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.fuelCons} L/hex · {v.fuelType})
                      </option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </div>

          {sel && (
            <div className="trav-calc-vehicle-stats">
              <span className="wref-stat"><span className="wref-stat-label">Fuel</span><span className="wref-stat-value">{sel.fuelType}</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Tank</span><span className="wref-stat-value">{sel.fuelCap} L</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Cons</span><span className="wref-stat-value">{sel.fuelCons} L/hex</span></span>
              <span className="wref-stat"><span className="wref-stat-label">Speed</span><span className="wref-stat-value">{sel.travelSpeed}</span></span>
            </div>
          )}

          {!vehicleKey && (
            <div className="trav-calc-field">
              <label className="trav-calc-label">Consumption (L / hex)</label>
              <input
                type="number" min="0" step="0.5"
                value={manualCons}
                onChange={e => setManualCons(e.target.value)}
                placeholder="e.g. 8"
                className="trav-calc-input"
              />
            </div>
          )}

          {mode === 'long' ? (
            <>
              <div className="trav-calc-field">
                <label className="trav-calc-label">On-road hexes (10 km each)</label>
                <input
                  type="number" min="0"
                  value={onRoadHexes}
                  onChange={e => setOnRoadHexes(e.target.value)}
                  placeholder="0"
                  className="trav-calc-input"
                />
              </div>
              <div className="trav-calc-field">
                <label className="trav-calc-label">Off-road hexes (fuel ×2)</label>
                <input
                  type="number" min="0"
                  value={offRoadHexes}
                  onChange={e => setOffRoadHexes(e.target.value)}
                  placeholder="0"
                  className="trav-calc-input"
                />
              </div>
            </>
          ) : (
            <div className="trav-calc-field">
              <label className="trav-calc-label">City hexes (200 m each)</label>
              <input
                type="number" min="0"
                value={cityHexes}
                onChange={e => setCityHexes(e.target.value)}
                placeholder="0"
                className="trav-calc-input"
              />
            </div>
          )}

          <label className="trav-calc-alcohol">
            <input type="checkbox" checked={alcohol} onChange={e => setAlcohol(e.target.checked)} />
            Alcohol fuel (×2 consumption)
          </label>

          {cons > 0 && hasInput && (
            <div className="trav-calc-result">
              <div className="trav-calc-result-row">
                <span className="trav-calc-result-label">Fuel needed</span>
                <span className="trav-calc-result-value">
                  {totalFuel < 0.05 ? '< 0.1' : totalFuel.toFixed(1)} L
                </span>
              </div>
              {mode === 'long' && onRoadRange !== null && (
                <p className="trav-calc-range">
                  Full tank: <strong>{onRoadRange} hexes on-road</strong> / <strong>{offRoadRange} hexes off-road</strong>
                </p>
              )}
              {mode === 'city' && cityRange !== null && (
                <p className="trav-calc-range">
                  Full tank: <strong>{cityRange} city hexes</strong>
                </p>
              )}
              {mode === 'city' && (
                <p className="hint trav-calc-formula">
                  City formula: cons × hexes × multiplier ÷ 50. Round to nearest liter.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ── City Travel ────────────────────────────────────────────────────
function CityTravelRef() {
  return (
    <div className="trav-section">
      <p className="hint trav-section-hint">
        City travel uses 200 m hexes tracked per stretch (5–10 min). Replaces Player's Manual p.149.
        Only use city maps when navigating to a specific destination within the city.
      </p>
      <div className="trav-city-grid">

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Marching (on foot)</h4>
          <ul className="trav-city-list">
            <li><strong>Road or open:</strong> 2 city hexes / stretch</li>
            <li><strong>Off-road:</strong> 1 city hex / stretch</li>
            <li>No weather or darkness roll — distances too short.</li>
            <li>No forced march limit.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Driving</h4>
          <ul className="trav-city-list">
            <li>Use vehicle's <strong>travel speed</strong> as city hexes per stretch.</li>
            <li>Terrain and night modifiers still apply (p.141).</li>
            <li><strong>No mishap roll</strong> during city travel.</li>
            <li><strong>Built-up off-road:</strong> use on-road speed, then halve it.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Fuel (city)</h4>
          <ul className="trav-city-list">
            <li>Fuel = (cons × hexes × multiplier) ÷ 50</li>
            <li>Off-road hexes cost <strong>double movement</strong>, not double fuel.</li>
            <li>Calculate at end of travel; round to nearest liter.</li>
            <li>Alcohol fuel: ×2 consumption.</li>
          </ul>
        </div>

        <div className="trav-city-card">
          <h4 className="trav-city-card-title">Tasks &amp; Encounters</h4>
          <ul className="trav-city-list">
            <li>Available tasks: <strong>March, Drive, Keep Watch</strong> only.</li>
            <li><strong>Checkpoints:</strong> set encounters at specific hexes. RECON to spot — success lets you back off.</li>
            <li><strong>Backing off:</strong> move 180° back or 120° (back-left / right). Immediate next move, or first move next stretch.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

// ── Scrap Table ────────────────────────────────────────────────────
function ScrapTable() {
  const [query,      setQuery]      = useState('')
  const [rolled,     setRolled]     = useState(null)
  const highlightRef = useRef(null)

  function rollD100() {
    const n = Math.floor(Math.random() * 100) + 1
    const roll = n === 100 ? '00' : String(n).padStart(2, '0')
    setQuery('')
    setRolled(roll)
    // scroll after render
    setTimeout(() => highlightRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50)
  }

  const lc = query.toLowerCase()
  const rows = query
    ? SCRAP_TABLE.filter(r =>
        r.name.toLowerCase().includes(lc) ||
        (r.effect && r.effect.toLowerCase().includes(lc))
      )
    : SCRAP_TABLE

  return (
    <div className="trav-section">
      <div className="trav-mishap-controls">
        <div className="trav-mishap-roll-row">
          <button className="btn btn-secondary trav-roll-btn" onClick={rollD100}>Roll D100</button>
          {rolled !== null && !query && <span className="trav-roll-result">{rolled}</span>}
          <input
            type="text"
            placeholder="Search item or effect…"
            value={query}
            onChange={e => { setQuery(e.target.value); setRolled(null) }}
            className="trav-scrap-search"
          />
        </div>
      </div>
      <div className="trav-table-wrap">
        <table className="trav-table trav-table--scrap">
          <thead>
            <tr>
              <th className="trav-th trav-th--roll">D100</th>
              <th className="trav-th trav-th--scrap-name">Item</th>
              <th className="trav-th trav-th--scrap-effect">Effect / Notes</th>
              <th className="trav-th">Parts</th>
              <th className="trav-th">Wt</th>
              <th className="trav-th">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isHit = rolled !== null && r.roll === rolled
              return (
                <tr
                  key={r.roll}
                  ref={isHit ? highlightRef : null}
                  className={`trav-row ${isHit ? 'trav-row--highlight' : ''}`}
                >
                  <td className="trav-td trav-td--center trav-td--roll">{r.roll}</td>
                  <td className="trav-td trav-td--bold trav-td--scrap-name">{r.name}</td>
                  <td className="trav-td trav-td--effect">{r.effect ?? '—'}</td>
                  <td className="trav-td trav-td--center">{r.spareParts ?? '—'}</td>
                  <td className="trav-td trav-td--center">{r.weight ?? '—'}</td>
                  <td className="trav-td trav-td--center">{r.value ?? '—'}</td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr className="trav-row">
                <td colSpan={6} className="trav-td" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No matches</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────
export default function TravelReference() {
  const [activeCat, setActiveCat] = useState('terrain')

  return (
    <div className="wref-root">
      <div className="wref-cats">
        {CATS.map(c => (
          <button
            key={c.id}
            className={`wref-cat-btn ${activeCat === c.id ? 'wref-cat-btn--active' : ''}`}
            onClick={() => setActiveCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="trav-content">
        {activeCat === 'terrain' && <TerrainTable />}
        {activeCat === 'tasks'   && <TasksRef />}
        {activeCat === 'march'   && <MarchingRef />}
        {activeCat === 'driving' && <DrivingRef />}
        {activeCat === 'light'   && <LightWeatherRef />}
        {activeCat === 'fuel'    && <FuelCalculator />}
        {activeCat === 'city'    && <CityTravelRef />}
        {activeCat === 'scrap'   && <ScrapTable />}
      </div>
    </div>
  )
}
