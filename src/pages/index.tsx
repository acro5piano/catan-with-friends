import type { NextPage } from 'next'
import Head from 'next/head'
import { Player } from 'src/components/Player'
import { useStore } from 'src/store'
import { CardType } from 'src/types'
import { useMount, useKeyPress } from 'ahooks'

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
  const isPlaying = useStore((store) =>
    store.players.find((p) => p.id === store.playerId),
  )

  useMount(initSubscription)
  useKeyPress('esc', deselectCards)

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
          <div className="flex justify-between items-center border-t border-gray-300 p-6 gap-3">
            {selectedCardIds.length > 0 ? (
              <>
                <button
                  className="p-2 bg-blue-500 text-white rounded-lg"
                  onClick={useSelectedCards}
                >
                  Use cards
                </button>
                {selectedCardIds.length === 1 && (
                  <button
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={stealCard}
                  >
                    Steal card
                  </button>
                )}
              </>
            ) : (
              <>
                {isPlaying ? (
                  <>
                    {CardType.map((cardType) => (
                      <button key={cardType} onClick={() => addCard(cardType)}>
                        <img src={`/images/${cardType}.png`} className="h-16" />
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
                <button onClick={initGame}>New Game</button>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
