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
  selectedCardIds: string[]

  // actions
  initSubscription(): void
  initGame(num: 3 | 4): void
  addCard(type: ICardType): void
  setPlayerId(playerId: string): void
  toggleSelectCard(cardId: string): void
  syncFireStore(): Promise<void>
  useSelectedCards(): void
  updatePlayerNickname(playerId: string, nickname: string): void
  stealCard(): void
  deselectCards(): void
}

const gameId = 'test'

export const useStore = create<AppState>((set, get) => ({
  playerId: '',
  players: [],
  selectedCardIds: [],

  initSubscription() {
    onSnapshot(doc(db, 'games', gameId), (doc) => {
      const remoteState = doc.data()
      if (remoteState) {
        set({ players: remoteState['players'] })
      }
    })
    set({ playerId: localStorage.getItem('playerId') || '' })
  },
  async syncFireStore() {
    const state = get()
    await setDoc(doc(db, 'games', gameId), {
      id: gameId,
      players: state.players,
    })
  },
  initGame(playerNum: 3 | 4) {
    const players = Array.from({ length: playerNum }, (_, i) => ({
      id: nanoid(),
      nickname: `Player ${i + 1}`,
      cards: [],
    }))
    set({ players })
    get().syncFireStore()
  },
  addCard(type) {
    set(
      produce((state: AppState) => {
        const me = state.players.find((p) => p.id === get().playerId)
        if (me) {
          me.cards.push({
            id: nanoid(),
            type,
          })
        }
      }),
    )
    get().syncFireStore()
  },
  setPlayerId(playerId) {
    set({ playerId })
    localStorage.setItem('playerId', playerId)
  },
  toggleSelectCard(cardId) {
    set(
      produce((state: AppState) => {
        if (state.selectedCardIds.includes(cardId)) {
          state.selectedCardIds = state.selectedCardIds.filter(
            (id) => id !== cardId,
          )
        } else {
          state.selectedCardIds.push(cardId)
        }
      }),
    )
  },
  useSelectedCards() {
    set(
      produce((state: AppState) => {
        const me = state.players.find((p) => p.id === get().playerId)
        if (me) {
          me.cards = me.cards.filter(
            (card) => !state.selectedCardIds.includes(card.id),
          )
        }
        state.selectedCardIds = []
      }),
    )
    get().syncFireStore()
  },
  updatePlayerNickname(playerId, nickname) {
    set(
      produce((state: AppState) => {
        const target = state.players.find((p) => p.id === playerId)
        if (target) {
          target.nickname = nickname
        }
        state.selectedCardIds = []
      }),
    )
    get().syncFireStore()
  },
  stealCard() {
    set(
      produce((state: AppState) => {
        const selectedCardIds = state.selectedCardIds
        if (selectedCardIds.length !== 1) {
          return
        }
        const targetCardId = selectedCardIds[0]!
        const victim = state.players.find((p) => {
          return p.cards.find((card) => card.id === targetCardId)
        })
        const me = state.players.find((p) => p.id === state.playerId)
        if (victim && me) {
          const card = victim.cards.find((card) => card.id === targetCardId)
          if (card) {
            victim.cards = victim.cards.filter(
              (card) => card.id !== targetCardId,
            )
            me.cards.push(card)
            state.selectedCardIds = []
          }
        }
      }),
    )
    get().syncFireStore()
  },
  deselectCards() {
    set({ selectedCardIds: [] })
  },
}))
