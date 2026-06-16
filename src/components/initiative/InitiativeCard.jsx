import { useEffect, useState } from 'react'

// Card face that flips from back ("?") to front (the dealt number). It mounts on
// the back face, then flips to the front on the next frame so the CSS transition
// runs. Remounting it (via a changing `key`) replays the flip from scratch —
// that's how a freshly dealt card animates, without an imperative state reset
// inside an effect.
function FlipCard({ card, rotationClass }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    let inner
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setFlipped(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      if (inner) cancelAnimationFrame(inner)
    }
  }, [])

  return (
    <div className={`card-flip-inner ${flipped ? 'card-flip-inner--flipped' : ''}`}>
      <div className="card-face card-face--back">
        <span className="card-face-symbol">?</span>
      </div>
      <div className={`card-face card-face--front ${rotationClass}`}>
        <span className="card-number">{card ?? '?'}</span>
      </div>
    </div>
  )
}

export default function InitiativeCard({ combatant, isCurrentTurn, showControls, onActionToggle }) {
  const { name, card, type, actions } = combatant

  function getRotationClass() {
    if (actions.fast && actions.slow) return 'rotate-done'
    if (actions.fast) return 'rotate-fast'
    if (actions.slow) return 'rotate-slow'
    return ''
  }

  return (
    <div className={[
      'initiative-card',
      type === 'npc' ? 'initiative-card--npc' : 'initiative-card--player',
      isCurrentTurn ? 'initiative-card--active' : '',
    ].join(' ')}>

      {/* Card number with flip animation. Keyed on whether a card is dealt, so a
          freshly dealt card replays the flip, while value changes (initiative
          exchange, hidden-initiative redeals) update in place without re-flipping. */}
      <div className="card-flip-wrapper">
        <FlipCard key={card != null ? 'dealt' : 'empty'} card={card} rotationClass={getRotationClass()} />
      </div>

      <div className="card-info">
        <span className="card-name">{name}</span>
        <div className="card-badges">
          {type === 'npc' && <span className="card-badge">NPC</span>}
          {isCurrentTurn && <span className="card-badge card-badge--turn">ACTING</span>}
        </div>
      </div>

      <div className="card-actions">
        <span className={`action-pip ${actions.fast ? 'action-pip--used' : ''}`} title="Fast action">F</span>
        <span className={`action-pip ${actions.slow ? 'action-pip--used' : ''}`} title="Slow action">S</span>
      </div>

      {showControls && (
        <div className="card-controls">
          <button
            className={`action-btn ${actions.fast ? 'action-btn--used' : ''}`}
            onClick={() => onActionToggle(combatant.id, 'fast')}
          >Fast</button>
          <button
            className={`action-btn ${actions.slow ? 'action-btn--used' : ''}`}
            onClick={() => onActionToggle(combatant.id, 'slow')}
          >Slow</button>
        </div>
      )}
    </div>
  )
}
