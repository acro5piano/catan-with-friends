import type { NextPage } from 'next'
import { useState } from 'react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import { Player } from 'src/components/Player'
import { useStore } from 'src/store'
import { CardType } from 'src/types'
import { useMount, useKeyPress } from 'ahooks'
import Modal from 'react-modal'
import { defaultModalStyle } from 'src/utils/defaultModalStyle'

const Home: NextPage = () => {
  const initGame = useStore((store) => store.initGame)
  const initSubscription = useStore((store) => store.initSubscription)
  const players = useStore((store) => store.players)
  const addCard = useStore((store) => store.addCard)
  const selectedCardIds = useStore((store) => store.selectedCardIds)
  const useSelectedCards = useStore((store) => store.useSelectedCards)
  const stealCard = useStore((store) => store.stealCard)
  const deselectCards = useStore((store) => store.deselectCards)
  const takeDevelopmentCard = useStore((store) => store.takeDevelopmentCard)
  const removeLastCard = useStore((store) => store.removeLastCard)
  const isPlaying = useStore((store) =>
    store.players.find((p) => p.id === store.playerId),
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useMount(initSubscription)
  useKeyPress('esc', deselectCards)
  useKeyPress('1', () => addCard('LUMBER'))
  useKeyPress('2', () => addCard('BRICK'))
  useKeyPress('3', () => addCard('WOOL'))
  useKeyPress('4', () => addCard('GRAIN'))
  useKeyPress('5', () => addCard('ORE'))
  useKeyPress('s', stealCard)
  useKeyPress(['x', 'e', 'enter', 'return'], useSelectedCards)
  useKeyPress(['backspace', 'delete'], removeLastCard)

  return (
    <>
      <Head>
        <title>Catan with Friends</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={'h-screen bg-gray-100'}>
        <main className={'h-full flex flex-col gap-4'}>
          {players.map((player) => (
            <Player key={player.id} player={player} />
          ))}
          <div className="flex justify-between items-center bg-white border-t border-gray-200 p-6 gap-3">
            {selectedCardIds.length > 0 ? (
              <>
                <button
                  className="p-2 bg-blue-500 text-white rounded-lg"
                  onClick={useSelectedCards}
                >
                  Use cards (e / enter)
                </button>
                {selectedCardIds.length === 1 && (
                  <button
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={stealCard}
                  >
                    Steal card (s)
                  </button>
                )}
              </>
            ) : (
              <>
                {isPlaying ? (
                  <>
                    {CardType.map((cardType, i) => (
                      <button key={cardType} onClick={() => addCard(cardType)}>
                        <img src={`/images/${cardType}.png`} className="h-16" />
                        <div className="hidden md:block">{i + 1}</div>
                      </button>
                    ))}
                    <button
                      className="border border-red-700 rounded-full px-4 h-12"
                      onClick={takeDevelopmentCard}
                    >
                      DevCard
                    </button>
                  </>
                ) : (
                  <div className="bg-yellow-400 text-yellow-800 p-2 flex-1 rounded">
                    Select Player name to get started.
                  </div>
                )}

                <Modal
                  isOpen={isMenuOpen}
                  onRequestClose={() => setIsMenuOpen(false)}
                  style={defaultModalStyle}
                >
                  <div>
                    <button
                      className="w-full my-4 bg-blue-500 text-white py-1 rounded shadow-lg"
                      onClick={initGame}
                    >
                      New Game
                    </button>
                    <button
                      className="w-full my-4 bg-blue-500 text-white py-1 rounded shadow-lg"
                      onClick={() => window.open(`/?g=${nanoid()}`)}
                    >
                      New Room
                    </button>
                  </div>
                </Modal>
              </>
            )}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-3 hover:bg-gray-200 rounded"
            >
              <span className="material-icons">menu</span>
            </button>
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
