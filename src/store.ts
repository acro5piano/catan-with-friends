import create from 'zustand'
import produce from 'immer'
import { nanoid } from 'nanoid'
import { IPlayer, ICardType } from 'src/types'

interface AppState {
  playerId: string
  players: IPlayer[]
  init(): void
  addCard(type: ICardType): void
}

export const useStore = create<AppState>((set) => ({
  playerId: '',
  players: [],
  init() {
    set({ playerId: nanoid() })
    set({
      players: [
        {
          id: 'test',
          name: 'Daido',
          cards: [
            {
              id: '1',
              type: 'WOOL' as const,
            },
            {
              id: '2',
              type: 'ORE' as const,
            },
          ],
        },
      ],
    })
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
  },
}))
