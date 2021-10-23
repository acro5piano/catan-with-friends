import type { NextPage } from 'next'
import Head from 'next/head'
import { Player } from 'src/components/Player'
import { useStore } from 'src/store'
import { useMount } from 'ahooks'

const Home: NextPage = () => {
  const initGame = useStore((store) => store.initGame)
  const initSubscription = useStore((store) => store.initSubscription)
  const players = useStore((store) => store.players)
  const addCard = useStore((store) => store.addCard)
  const selectedCardIds = useStore((store) => store.selectedCardIds)
  const useSelectedCards = useStore((store) => store.useSelectedCards)

  useMount(initSubscription)

  return (
    <>
      <Head>
        <title>Catan with Friends</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={'h-screen bg-gray-100'}>
        <main className={'p-6 h-full flex flex-col gap-4'}>
          {players.map((player) => (
            <Player key={player.id} player={player} />
          ))}
          <div className="flex justify-between h-10">
            {selectedCardIds.length > 0 ? (
              <button
                className="p-2 bg-blue-500 text-white rounded-lg"
                onClick={useSelectedCards}
              >
                Use cards
              </button>
            ) : (
              <>
                <button onClick={() => addCard('BRICK')}>Add BRICK</button>
                <button onClick={() => addCard('GRAIN')}>Add GRAIN</button>
                <button onClick={() => addCard('LUMBER')}>Add LUMBER</button>
                <button onClick={() => addCard('ORE')}>Add ORE</button>
                <button onClick={() => addCard('WOOL')}>Add WOOL</button>
                <button onClick={() => initGame(3)}>Init game(3)</button>
                <button onClick={() => initGame(4)}>Init game(4)</button>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
