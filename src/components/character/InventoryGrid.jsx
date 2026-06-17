import { useState, useRef } from 'react'
import { RULESETS, CATS, LIBRARY, toQuarters, qLabel } from '../../data/inventory'

// ── InventoryGrid ────────────────────────────────────────────────────────────
// A vertical, "limited-Tetris" encumbrance grid. Items are blocks sized to their
// T2K weight (¼ / ½ / 1 / 2 / 3 / 4 units). They stack vertically only — never
// sideways. Capacity comes from the character's STRENGTH and the active ruleset.
//
// Controlled component:
//   <InventoryGrid
//      character={c}                       // read STR from c.attributes.str
//      value={c.inventory}                 // { ruleset, backpackWorn, items[] }
//      editable={true}
//      onChange={inv => set('inventory', inv)} />
//
// Persistence is automatic: onChange bubbles the new inventory object up to the
// CharacterSheet, which is saved to Firestore by CharacterPage's "Save Changes".

const DENSITY = { compact: 12, comfortable: 16, roomy: 20 }
const EMPTY = { ruleset: 't2k', backpackWorn: true, items: [] }

function newUid() {
  return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default function InventoryGrid({ character, value, onChange, editable = true, density = 'comfortable' }) {
  const inv = value && Array.isArray(value.items) ? value : EMPTY
  const ruleset = RULESETS[inv.ruleset] ? inv.ruleset : 't2k'
  const R = RULESETS[ruleset]
  const qpx = DENSITY[density] || 16

  const dragRef = useRef(null)
  const [libTab, setLibTab] = useState('gear')
  const [cat, setCat]       = useState('all')
  const [search, setSearch] = useState('')

  const str    = (character && character.attributes && character.attributes.str) || {}
  const baseCap = R.capacity(str)
  const bpCap   = inv.backpackWorn ? baseCap : 0
  const unitW   = R.unit

  // ── mutations (all bubble through onChange) ─────────────────────────────────
  const commit = (items, extra) => onChange && onChange({ ...inv, ruleset, items, ...extra })

  function addItem(libId, container = 'combat', col = null) {
    const l = LIBRARY.find(x => x.id === libId); if (!l) return
    const q = toQuarters(l.w)
    let cont = container, c = col
    if (q === 0) { cont = 'tiny'; c = null }
    else if (q > 16) { cont = 'cabin'; c = null }
    else if (c !== 0 && c !== 1) c = null
    commit([...inv.items, { uid: newUid(), libId, name: l.name, cat: l.cat, w: l.w, q, kind: l.kind, sub: l.sub, container: cont, col: c }])
  }
  function moveItem(uid, container, col) {
    commit(inv.items.map(it => it.uid === uid ? { ...it, container, col: (col === 0 || col === 1) ? col : null } : it))
  }
  function removeItem(uid) { commit(inv.items.filter(it => it.uid !== uid)) }
  function autoArrange()   { commit(inv.items.map(it => (it.container === 'combat' || it.container === 'backpack') ? { ...it, col: null } : it)) }
  const setRuleset    = r => onChange && onChange({ ...inv, ruleset: r })
  const toggleBackpack = () => onChange && onChange({ ...inv, backpackWorn: !inv.backpackWorn })

  function handleDrop(container, col) {
    const d = dragRef.current; if (!d) return
    if (d.type === 'add') addItem(d.libId, container, col)
    else if (d.type === 'move') {
      const it = inv.items.find(x => x.uid === d.uid)
      if (it && it.q > 16 && (container === 'combat' || container === 'backpack')) { dragRef.current = null; return }
      moveItem(d.uid, container, col)
    }
    dragRef.current = null
  }
  const allowDrop = e => { e.preventDefault(); if (editable) try { e.dataTransfer.dropEffect = 'move' } catch { /* ignore drag-data errors */ } }

  // ── packing (vertical gravity, first-fit, honours preferred column) ─────────
  const effQ = it => (it.q === 0 ? 0 : it.q > 16 ? it.q : R.effQ(it.q))
  function pack(list, capUnits) {
    const caps = [Math.ceil(capUnits / 2) * 4, Math.floor(capUnits / 2) * 4]
    const used = [0, 0]
    const cols = [{ capQ: caps[0], blocks: [] }, { capQ: caps[1], blocks: [] }]
    const overflow = []
    for (const it of list) {
      const size = effQ(it); let col = -1
      if ((it.col === 0 || it.col === 1) && used[it.col] + size <= caps[it.col]) col = it.col
      if (col < 0) for (let i = 0; i < 2; i++) if (used[i] + size <= caps[i]) { col = i; break }
      if (col < 0) { overflow.push(it); continue }
      cols[col].blocks.push({ ...it, _top: used[col], _size: size })
      used[col] += size
    }
    return { cols, used: (used[0] + used[1]) / 4, overflow }
  }

  // ── item grouping ───────────────────────────────────────────────────────────
  const combatList = inv.items.filter(i => i.container === 'combat')
  const bpRaw      = inv.items.filter(i => i.container === 'backpack')
  const tiny       = inv.items.filter(i => i.container === 'tiny')
  let cabin        = inv.items.filter(i => i.container === 'cabin')
  let bpList = bpRaw
  if (!inv.backpackWorn) { cabin = cabin.concat(bpRaw); bpList = [] }

  const combat = pack(combatList, baseCap)
  const bp     = inv.backpackWorn ? pack(bpList, bpCap) : { cols: [], used: 0, overflow: [] }

  const usedTotal = combat.used + bp.used
  const capTotal  = baseCap + bpCap
  const pct       = capTotal > 0 ? Math.min(100, (usedTotal / capTotal) * 100) : 0
  const over      = combat.overflow.length > 0 || bp.overflow.length > 0 || usedTotal > capTotal
  const sub       = R.subdivides ? qpx : qpx * 2

  // ── tiny style helpers ──────────────────────────────────────────────────────
  const T = {
    surface: '#252520', surface2: '#2e2e28', border: '#3a3a32',
    accent: '#c8a84b', accent2: '#7a9e6b', danger: '#b34040',
    text: '#e8e4d8', muted: '#9a9488', colBg: '#191e17',
  }
  const badge = (catKey) => {
    const c = CATS[catKey] || { color: '#888' }
    return { fontSize: '0.6rem', fontWeight: 700, color: '#13160f', background: c.color, borderRadius: 3, padding: '1px 5px', whiteSpace: 'nowrap', flexShrink: 0 }
  }
  const chip = (catKey, grab) => {
    const c = CATS[catKey] || { color: '#888' }
    return { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: T.text, background: `color-mix(in oklab, ${c.color} 22%, #1a1f19)`, border: `1px solid ${c.color}`, borderRadius: 4, padding: '2px 7px', cursor: editable && grab ? 'grab' : 'default' }
  }
  const colStyle = (capQ) => ({
    position: 'relative', flex: 1, minWidth: 0, boxSizing: 'border-box', height: capQ * qpx,
    border: `1px solid ${T.border}`, borderRadius: 5, background: T.colBg, overflow: 'hidden',
    backgroundImage:
      `repeating-linear-gradient(to bottom, transparent 0, transparent ${sub - 1}px, rgba(255,255,255,0.06) ${sub - 1}px, rgba(255,255,255,0.06) ${sub}px),` +
      `repeating-linear-gradient(to bottom, rgba(200,168,75,0.28) 0, rgba(200,168,75,0.28) 1px, transparent 1px, transparent ${qpx * 4}px)`,
  })
  const blockStyle = (b) => {
    const c = CATS[b.cat] || { color: '#888' }
    const tall = b._size >= 4
    return {
      position: 'absolute', left: 3, right: 3, top: b._top * qpx + 1.5, height: b._size * qpx - 3,
      background: `color-mix(in oklab, ${c.color} 28%, #1a1f19)`, borderLeft: `3px solid ${c.color}`,
      borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.4)', cursor: editable ? 'grab' : 'default',
      overflow: 'hidden', boxSizing: 'border-box', padding: tall ? '4px 6px' : '0 6px',
      display: 'flex', flexDirection: tall ? 'column' : 'row', justifyContent: 'space-between',
      alignItems: tall ? 'stretch' : 'center', gap: 2,
    }
  }

  // ── small presentational pieces ─────────────────────────────────────────────
  function Block({ b }) {
    const tall = b._size >= 4
    const title = `${b.name} · ${b._size / 4} unit${b._size === 4 ? '' : 's'}${b.sub ? ' · ' + b.sub : ''}`
    return (
      <div
        style={blockStyle(b)} title={title}
        draggable={editable}
        onDragStart={editable ? (e) => { dragRef.current = { type: 'move', uid: b.uid }; try { e.dataTransfer.setData('text/plain', b.uid); e.dataTransfer.effectAllowed = 'move' } catch { /* ignore drag-data errors */ } } : undefined}
        onDragEnd={() => { dragRef.current = null }}
      >
        {tall ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: '0.74rem', lineHeight: 1.15, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{b.name}</span>
              {editable && <button onClick={() => removeItem(b.uid)} style={rmBtn}>×</button>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 4 }}>
              <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: T.muted }}>{(CATS[b.cat] || {}).label}</span>
              <span style={badge(b.cat)}>{qLabel(b._size)}</span>
            </div>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 600, fontSize: '0.66rem', lineHeight: 1, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span style={badge(b.cat)}>{qLabel(b._size)}</span>
              {editable && <button onClick={() => removeItem(b.uid)} style={{ ...rmBtn, width: 15, height: 15 }}>×</button>}
            </span>
          </>
        )}
      </div>
    )
  }

  function Panel({ pkey, label, note, titleColor, packed, capUnits, enabled }) {
    const used = packed.used
    const cardOver = used > capUnits || packed.overflow.length > 0
    return (
      <div style={{ flex: 1, minWidth: 250, background: T.surface, border: `1px solid ${cardOver ? T.danger : T.border}`, borderRadius: 7, padding: '12px 13px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', color: titleColor }}>{label}</span>
            <span style={{ fontSize: '0.62rem', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{note}</span>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cardOver ? T.danger : T.accent, whiteSpace: 'nowrap' }}>{enabled ? `${used} / ${capUnits} ${unitW}` : '—'}</span>
        </div>

        {enabled ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            {packed.cols.map((col, idx) => (
              <div key={idx} style={colStyle(col.capQ)} onDragOver={allowDrop} onDrop={() => handleDrop(pkey, idx)}>
                {col.blocks.map(b => <Block key={b.uid} b={b} />)}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: `1px dashed ${T.border}`, borderRadius: 6, padding: '22px 10px', textAlign: 'center', color: T.muted, fontSize: '0.78rem' }}>Backpack not worn — items stowed in Cabin.</div>
        )}

        {packed.overflow.length > 0 && (
          <div style={{ marginTop: 9, border: `1px dashed ${T.danger}`, borderRadius: 6, padding: 8 }}>
            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: T.danger, marginBottom: 6, fontWeight: 700 }}>⚠ Over capacity — won't fit</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {packed.overflow.map(o => (
                <span key={o.uid} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: T.danger, background: 'rgba(179,64,64,0.12)', border: `1px solid ${T.danger}`, borderRadius: 4, padding: '2px 7px', cursor: editable ? 'grab' : 'default' }}
                  draggable={editable}
                  onDragStart={editable ? (e) => { dragRef.current = { type: 'move', uid: o.uid }; try { e.dataTransfer.setData('text/plain', o.uid) } catch { /* ignore drag-data errors */ } } : undefined}>
                  {o.name} <span style={{ opacity: 0.7 }}>{qLabel(effQ(o))}</span>
                  {editable && <button onClick={() => removeItem(o.uid)} style={chipX}>×</button>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── library list ────────────────────────────────────────────────────────────
  const tabKind = ({ weapons: 'weapon', gear: 'gear', armor: 'armor' })[libTab] || 'gear'
  const catsInTab = [...new Set(LIBRARY.filter(x => x.kind === tabKind).map(x => x.cat))]
  const term = search.trim().toLowerCase()
  const combatFree = baseCap - combat.used
  const bpFree = bpCap - bp.used
  const defCont = (bpCap > 0 && bpFree > combatFree) ? 'backpack' : 'combat'
  const library = LIBRARY.filter(x => x.kind === tabKind)
    .filter(x => cat === 'all' || x.cat === cat)
    .filter(x => !term || x.name.toLowerCase().includes(term) || (x.sub || '').toLowerCase().includes(term))

  const seg = (active, color = T.accent) => ({ background: active ? color : T.surface2, color: active ? '#111' : T.muted, border: `1px solid ${active ? color : T.border}`, borderRadius: 5, fontSize: '0.72rem', fontWeight: 700, padding: '5px 11px', cursor: 'pointer', whiteSpace: 'nowrap' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, color: T.text }}>

      {/* Control bar */}
      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: '12px 14px' }}>
        {editable && (
          <Field label="Ruleset">
            <div style={{ display: 'flex', gap: 3 }}>
              {Object.values(RULESETS).map(rs => (
                <button key={rs.key} onClick={() => setRuleset(rs.key)} style={seg(ruleset === rs.key)}>{rs.label}</button>
              ))}
            </div>
          </Field>
        )}
        <Field label="Strength — capacity">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: T.accent }}>{R.capSource(str)} · {baseCap} {unitW}</span>
        </Field>
        <Field label="Backpack">
          <button onClick={editable ? toggleBackpack : undefined} style={{ ...seg(inv.backpackWorn, T.accent2), cursor: editable ? 'pointer' : 'default' }}>{inv.backpackWorn ? 'Worn' : 'Off'}</button>
        </Field>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={lblStyle}>Total load</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: over ? T.danger : T.text }}>{usedTotal} / {capTotal} {unitW}</span>
          </div>
          <div style={{ height: 10, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: pct + '%', height: '100%', background: over ? T.danger : 'linear-gradient(90deg,#7a9e6b,#c8a84b)', transition: 'width 0.25s' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', alignSelf: 'flex-end' }}>
          {inv.backpackWorn && R.backpackBadge && <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em', color: T.accent2, border: `1px solid ${T.accent2}`, background: 'rgba(122,158,107,0.14)', borderRadius: 4, padding: '3px 8px' }}>{R.backpackBadge}</span>}
          {over
            ? <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em', color: '#fff', background: T.danger, borderRadius: 4, padding: '3px 8px' }}>{R.overLabel}</span>
            : <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em', color: T.muted, border: `1px solid ${T.border}`, borderRadius: 4, padding: '3px 8px' }}>LOAD OK</span>}
          {editable && <button onClick={autoArrange} style={ghostBtn}>Auto-arrange</button>}
        </div>
      </div>

      {/* Grids + library */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Panel pkey="combat"   label="Combat Gear" note="on-body" titleColor={T.accent}  packed={combat} capUnits={baseCap} enabled={true} />
            <Panel pkey="backpack" label="Backpack"    note={inv.backpackWorn ? R.backpackNote : 'stowed'} titleColor={T.accent2} packed={bp} capUnits={bpCap} enabled={inv.backpackWorn} />
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Bin title="Tiny Items" note="no encumbrance">
              {tiny.length === 0 && <span style={emptyHint}>Weightless gear lands here.</span>}
              {tiny.map(t => <span key={t.uid} style={chip(t.cat, false)}>{t.name}{editable && <button onClick={() => removeItem(t.uid)} style={chipX}>×</button>}</span>)}
            </Bin>
            <Bin title="Cabin / Stash" note="off-person & oversized" onDragOver={allowDrop} onDrop={() => handleDrop('cabin', null)}>
              {cabin.length === 0 && <span style={emptyHint}>Drop gear here to stash it off-person.</span>}
              {cabin.map(cb => (
                <span key={cb.uid} style={chip(cb.cat, true)}
                  draggable={editable}
                  onDragStart={editable ? (e) => { dragRef.current = { type: 'move', uid: cb.uid }; try { e.dataTransfer.setData('text/plain', cb.uid) } catch { /* ignore drag-data errors */ } } : undefined}>
                  {cb.name} <span style={{ opacity: 0.7 }}>{qLabel(cb.q)}</span>{editable && <button onClick={() => removeItem(cb.uid)} style={chipX}>×</button>}
                </span>
              ))}
            </Bin>
          </div>
        </div>

        {editable && (
          <div style={{ width: 300, flexShrink: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'stretch' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.accent }}>Add Gear</div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[['gear', 'Gear'], ['weapons', 'Weapons'], ['armor', 'Armor']].map(([k, l]) => (
                <button key={k} onClick={() => { setLibTab(k); setCat('all') }} style={{ flex: 1, background: libTab === k ? T.surface2 : 'transparent', color: libTab === k ? T.accent : T.muted, border: `1px solid ${libTab === k ? T.accent : T.border}`, borderRadius: 5, fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '6px 0', cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 5, color: T.text, padding: '6px 9px', fontSize: '0.82rem', width: '100%', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[['all', 'All'], ...catsInTab.map(c => [c, CATS[c].label])].map(([id, label]) => (
                <button key={id} onClick={() => setCat(id)} style={{ background: cat === id ? T.accent2 : T.surface2, color: cat === id ? '#111' : T.muted, border: `1px solid ${cat === id ? T.accent2 : T.border}`, borderRadius: 4, fontSize: '0.64rem', fontWeight: 600, padding: '3px 8px', cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', maxHeight: 560, paddingRight: 2 }}>
              {library.map(it => {
                const q = toQuarters(it.w)
                return (
                  <div key={it.id} draggable
                    onDragStart={(e) => { dragRef.current = { type: 'add', libId: it.id }; try { e.dataTransfer.setData('text/plain', it.id); e.dataTransfer.effectAllowed = 'copy' } catch { /* ignore drag-data errors */ } }}
                    onDragEnd={() => { dragRef.current = null }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.surface2, border: `1px solid ${T.border}`, borderLeft: `3px solid ${CATS[it.cat].color}`, borderRadius: 5, padding: '6px 8px', cursor: 'grab' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                      <div style={{ fontSize: '0.62rem', color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.sub || CATS[it.cat].label}</div>
                    </div>
                    <span style={badge(it.cat)}>{q === 0 ? 'tiny' : qLabel(effQ({ q }))}</span>
                    <button onClick={() => addItem(it.id, defCont, null)} style={{ background: T.accent, border: 'none', color: '#111', width: 22, height: 22, borderRadius: 4, fontSize: '1rem', lineHeight: 1, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>+</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.68rem', color: T.muted, lineHeight: 1.5 }}>{R.hint} Pieces stack vertically only.</div>
    </div>
  )
}

// ── tiny shared style atoms ────────────────────────────────────────────────────
const lblStyle = { fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.09em', color: '#9a9488' }
const rmBtn    = { background: 'rgba(0,0,0,0.25)', border: 'none', color: '#9a9488', width: 16, height: 16, borderRadius: 3, fontSize: '0.8rem', lineHeight: 1, cursor: 'pointer', flexShrink: 0 }
const chipX    = { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.78rem', padding: '0 0 0 2px' }
const ghostBtn = { background: '#2e2e28', border: '1px solid #3a3a32', color: '#9a9488', borderRadius: 5, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '5px 10px', cursor: 'pointer' }
const emptyHint = { color: '#9a9488', fontSize: '0.78rem', fontStyle: 'italic' }

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={lblStyle}>{label}</span>
      {children}
    </div>
  )
}
function Bin({ title, note, children, onDragOver, onDrop }) {
  return (
    <div style={{ flex: 1, minWidth: 240, background: '#252520', border: '1px solid #3a3a32', borderRadius: 7, padding: '11px 13px' }} onDragOver={onDragOver} onDrop={onDrop}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9a9488', marginBottom: 8 }}>{title} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>· {note}</span></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, minHeight: 24 }}>{children}</div>
    </div>
  )
}
