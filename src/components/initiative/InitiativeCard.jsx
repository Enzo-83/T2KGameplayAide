import { useEffect, useRef, useState } from 'react'

export default function InitiativeCard({ combatant, isCurrentTurn, showControls, onActionToggle }) {
  const { name, card, type, actions, visible } = combatant
  const [flipped, setFlipped] = useState(false)
  const prevCard = useRef(null)

  // Trigger flip animation when card is first assigned
  useEffect(() => {
    if (card != null && prevCard.current == null) {
      setFlipped(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFlipped(true))
      })
    }
    prevCard.current = card
  }, [card])

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

      {/* Card number with flip animation */}
      <div className="card-flip-wrapper">
        <div className={`card-flip-inner ${flipped ? 'card-flip-inner--flipped' : ''}`}>
          <div className="card-face card-face--back">
            <span className="card-face-symbol">?</span>
          </div>
          <div className={`card-face card-face--front ${getRotationClass()}`}>
            <span className="card-number">{card ?? '?'}</span>
          </div>
        </div>
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
