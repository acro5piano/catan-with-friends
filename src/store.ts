import create from 'zustand'
import produce from 'immer'
import { nanoid } from 'nanoid'
import { IPlayer, ICardType } from 'src/types'
import { db } from 'src/infra/firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

interface AppState {
  // state
  playerId: string
  players: IPlayer[]

  // actions
  initSubscription(): void
  initGame(num: 3 | 4): void
  addCard(type: ICardType): void
  syncFireStore(): Promise<void>
}

const gameId = 'test'

export const useStore = create<AppState>((set, get) => ({
  playerId: '',
  players: [],
  initSubscription() {
    onSnapshot(doc(db, 'games', gameId), (doc) => {
      const remoteState = doc.data()
      if (remoteState) {
        set({ players: remoteState['players'] })
      }
    })
  },
  async syncFireStore() {
    const state = get()
    await setDoc(doc(db, 'games', gameId), {
      id: gameId,
      players: state.players,
    })
  },
  initGame(playerNum: 3 | 4) {
    const players = Array.from({ length: playerNum }, () => ({
      id: nanoid(),
      name: nanoid(),
      cards: [],
    }))
    set({ players })
    get().syncFireStore()
  },
  addCard(type) {
    set(
      produce((state: AppState) => {
        state.players[0]!.cards!.push({
          id: nanoid(),
          type,
        })
      }),
    )
    get().syncFireStore()
  },
}))
