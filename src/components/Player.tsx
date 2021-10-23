import { IPlayer } from 'src/types'
import clsx from 'clsx'
import { useStore } from 'src/store'

export const Player = ({ player }: { player: IPlayer }) => {
  const playerId = useStore((state) => state.playerId)
  const setPlayerId = useStore((state) => state.setPlayerId)
  const toggleSelectCard = useStore((state) => state.toggleSelectCard)
  const selectedCardIds = useStore((state) => state.selectedCardIds)

  const isMe = playerId === player.id

  return (
    <div className="flex-1">
      <div className="flex p-2 items-center gap-3">
        <div>{player.nickname}</div>
        <div className="px-2 py-1 bg-gray-200 rounded-lg">
          {player.cards.length}
        </div>
        {isMe && <div>(you)</div>}
        <button
          className="px-2 py-1 bg-blue-600 text-white rounded-lg shadow-lg"
          onClick={() => setPlayerId(player.id)}
        >
          This is me
        </button>
      </div>
      <div className="flex gap-4 py-2 overflow-x-scroll hide-scrollbar">
        {player.cards.map((card) => (
          <button onClick={() => toggleSelectCard(card.id)} disabled={!isMe}>
            <div
              key={card.id}
              className={clsx(
                'w-24 h-36 bg-white shadow-md p-3 rounded-lg',
                selectedCardIds.includes(card.id) && 'bg-red-500',
              )}
            >
              {isMe ? card.type : '*'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
