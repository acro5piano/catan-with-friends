import { IPlayer } from 'src/types'
import { useDebounceFn } from 'ahooks'
import { useState } from 'react'
import clsx from 'clsx'
import { useStore } from 'src/store'
import Modal from 'react-modal'

const defaultModal = {
  content: {
    maxWidth: '20rem',
    maxHeight: '20rem',
    margin: 'auto',
  },
  overlay: {
    zIndex: 10000,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
}

export const Player = ({ player }: { player: IPlayer }) => {
  const playerId = useStore((state) => state.playerId)
  const setPlayerId = useStore((state) => state.setPlayerId)
  const toggleSelectCard = useStore((state) => state.toggleSelectCard)
  const selectedCardIds = useStore((state) => state.selectedCardIds)
  const updatePlayerNickname = useStore((state) => state.updatePlayerNickname)

  const isMe = playerId === player.id

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const updateName = useDebounceFn((e: any) => {
    updatePlayerNickname(player.id, e.target.value)
  })

  return (
    <div className={clsx('flex-1 relative')}>
      <div className="flex p-2 items-center gap-3">
        <button
          className="hover:bg-gray-200 p-2 rounded"
          onClick={() => setIsMenuOpen(true)}
        >
          {player.nickname}
        </button>
        <div className="px-2 py-1 bg-gray-200 rounded-lg">
          {player.cards.length}
        </div>
        {isMe && <div>(you)</div>}
      </div>
      <div className="flex gap-4 py-2 overflow-x-scroll hide-scrollbar">
        {player.developmentCards.map((card) => (
          <button
            onClick={() => toggleSelectCard(card.id)}
            className="focus:outline-none"
            key={card.id}
            disabled={card.isUsed}
          >
            <div
              key={card.id}
              className={clsx(
                'w-24 h-36 bg-white shadow-md p-3 rounded-lg',
                selectedCardIds.includes(card.id) && 'bg-red-500',
                card.isUsed && 'bg-gray-200',
              )}
            >
              {isMe || card.isUsed ? card.type : '*'}
              <div>{card.isUsed && '(used)'}</div>
            </div>
          </button>
        ))}
        {player.cards.map((card) => (
          <button
            onClick={() => toggleSelectCard(card.id)}
            className="focus:outline-none"
            key={card.id}
          >
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
      <Modal
        ariaHideApp={false}
        isOpen={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}
        style={defaultModal}
      >
        <div>
          <input
            defaultValue={player.nickname}
            onChange={updateName.run}
            name="nickname"
            className="my-4 w-full px-2 py-1 bg-gray-100 rounded-lg"
            autoFocus
          />
          <button
            className="my-4 w-full px-2 py-1 bg-blue-600 text-white rounded-lg shadow-lg"
            onClick={() => {
              setPlayerId(player.id)
              setIsMenuOpen(false)
            }}
          >
            This is me
          </button>
          <button
            className="my-4 w-full px-2 py-1 bg-gray-200 rounded-lg shadow-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
