import create from 'zustand'
import produce from 'immer'
import { nanoid } from 'nanoid'
import { IPlayer, ICardType, IDevelopmentCardType } from 'src/types'
import { db } from 'src/infra/firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

interface AppState {
  // state
  playerId: string
  players: IPlayer[]
  selectedCardIds: string[]
  developmentCardTypes: IDevelopmentCardType[]

  // actions
  initSubscription(): void
  initGame(): void
  addCard(type: ICardType): void
  setPlayerId(playerId: string): void
  toggleSelectCard(cardId: string): void
  syncFireStore(): Promise<void>
  useSelectedCards(): void
  updatePlayerNickname(playerId: string, nickname: string): void
  stealCard(): void
  deselectCards(): void
  takeDevelopmentCard(): void
  removeLastCard(): void
}

const getGameId = () => {
  if (typeof window === 'undefined') {
    return 'test'
  }

  const params = new URLSearchParams(location.search)
  const gameId = params.get('g') || 'test'
  return gameId
}

export const useStore = create<AppState>((set, get) => ({
  playerId: '',
  players: [],
  selectedCardIds: [],
  developmentCardTypes: [],
  gameId: '',

  initSubscription() {
    onSnapshot(doc(db, 'games', getGameId()), (doc) => {
      const remoteState = doc.data()
      if (remoteState) {
        set({
          players: remoteState['players'],
          developmentCardTypes: remoteState['developmentCardTypes'],
        })
      }
    })
    set({ playerId: localStorage.getItem('playerId') || '' })
  },
  async syncFireStore() {
    const state = get()
    await setDoc(doc(db, 'games', getGameId()), {
      id: getGameId(),
      players: state.players,
      developmentCardTypes: state.developmentCardTypes,
    })
  },
  initGame() {
    const _playerNum = prompt('Enter player number (3 or 4)')
    if (_playerNum !== '3' && _playerNum !== '4') {
      return
    }
    const playerNum = Number(_playerNum)
    const oldPlayers = get().players
    const players = Array.from({ length: playerNum }, (_, i) => ({
      id: nanoid(),
      nickname: oldPlayers[i]?.nickname || `Player ${i + 1}`, // `
      cards: [],
      selectedCardIds: [],
      developmentCards: [],
    }))
    const developmentCardTypes = shuffle([
      ...Array.from({ length: 5 }, () => 'VICTORY' as const),
      ...Array.from({ length: 14 }, () => 'KNIGHT' as const),
      ...Array.from({ length: 2 }, () => 'YEAR_OF_PLENTY' as const),
      ...Array.from({ length: 2 }, () => 'ROAD_BUILDING' as const),
      ...Array.from({ length: 2 }, () => 'MONOPOLY' as const),
    ])
    set({ players, developmentCardTypes })
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
    set(
      produce((state: AppState) => {
        const me = state.players.find((p) => p.id === get().playerId)
        if (me) {
          me.selectedCardIds = state.selectedCardIds
        }
      }),
    )
    get().syncFireStore()
  },
  useSelectedCards() {
    set(
      produce((state: AppState) => {
        const me = state.players.find((p) => p.id === get().playerId)
        if (me) {
          const targetDCard = me.developmentCards.find(
            (dCard) => dCard.id === state.selectedCardIds[0],
          )
          if (targetDCard) {
            targetDCard.isUsed = true
          } else {
            me.cards = me.cards.filter(
              (card) => !state.selectedCardIds.includes(card.id),
            )
          }
          state.selectedCardIds = []
        }
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
            me.selectedCardIds = []
          }
        }
      }),
    )
    get().syncFireStore()
  },
  deselectCards() {
    set({ selectedCardIds: [] })
  },
  takeDevelopmentCard() {
    set(
      produce((state: AppState) => {
        const me = state.players.find((p) => p.id === get().playerId)
        const nextDevelopmentCardType = state.developmentCardTypes[0]
        if (me && nextDevelopmentCardType) {
          me.developmentCards.push({
            id: nanoid(),
            type: nextDevelopmentCardType,
            isUsed: false,
          })
          state.developmentCardTypes.splice(0, 1)
        }
      }),
    )
    get().syncFireStore()
  },
  removeLastCard() {
    set(
      produce((state: AppState) => {
        const me = state.players.find((p) => p.id === get().playerId)
        if (me) {
          me.cards.splice(-1)
        }
      }),
    )
  },
}))

useStore.subscribe((state) => {
  console.log(state)
})

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    // @ts-ignore
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}
