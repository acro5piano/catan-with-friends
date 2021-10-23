import { IPlayer } from 'src/types'
import { useDebounceFn } from 'ahooks'
import { useState } from 'react'
import clsx from 'clsx'
import { useStore } from 'src/store'
import { defaultModalStyle } from 'src/utils/defaultModalStyle'
import Modal from 'react-modal'

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
    <div className={clsx('flex-1 relative p-6 ')}>
      <div className="flex p-2 items-center gap-3">
        <button
          className="hover:bg-gray-200 p-2 rounded"
          onClick={() => setIsMenuOpen(true)}
        >
          {player.nickname}
        </button>
        <div className="px-2 py-1 bg-gray-200 rounded-lg text-xs">
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
                'w-24 h-36 shadow-md rounded-lg relative',
                selectedCardIds.includes(card.id) && 'border-4 border-red-700',
                card.isUsed && 'bg-gray-200',
              )}
            >
              {isMe || card.isUsed ? (
                <img src={`/images/${card.type}.png`} className="rounded" />
              ) : (
                <img src={`/images/CARD_BACK.png`} className="rounded" />
              )}
              {!isMe && !card.isUsed && (
                <div className="absolute top-0 left-0 w-24 h-40 flex justify-center items-center bg-black opacity-50 rounded">
                  <div className="text-white">DevCard</div>
                </div>
              )}
              {card.isUsed && (
                <div className="absolute top-0 left-0 w-24 h-40 flex justify-center items-center bg-black opacity-50 rounded">
                  <div className="text-white">Used</div>
                </div>
              )}
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
                'w-24 h-36 shadow-md rounded-lg',
                selectedCardIds.includes(card.id) && 'border-4 border-red-700',
              )}
            >
              {isMe || player.selectedCardIds.includes(card.id) ? (
                <img src={`/images/${card.type}.png`} className="rounded" />
              ) : (
                <img src={`/images/CARD_BACK.png`} className="rounded" />
              )}
            </div>
          </button>
        ))}
      </div>
      <Modal
        ariaHideApp={false}
        isOpen={isMenuOpen}
        onRequestClose={() => setIsMenuOpen(false)}
        style={defaultModalStyle}
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
