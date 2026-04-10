// Read-only turn order display used on both GM and Player screens
import InitiativeCard from './InitiativeCard'

export default function TurnTracker({ combatants, currentTurn, showNPCs = true, showControls = false, onActionToggle }) {
  const visible = combatants.filter(c => showNPCs || c.type === 'player' || c.visible)
  const sorted = [...visible].sort((a, b) => (a.card ?? 99) - (b.card ?? 99))

  if (sorted.length === 0) {
    return <p className="tracker-empty">No combatants yet. Waiting for Referee to deal initiative.</p>
  }

  return (
    <div className="turn-tracker">
      {sorted.map(c => (
        <InitiativeCard
          key={c.id}
          combatant={c}
          isCurrentTurn={c.card === currentTurn}
          showControls={showControls}
          onActionToggle={onActionToggle}
        />
      ))}
    </div>
  )
}
