export const CardType = ['WOOL', 'GRAIN', 'LUMBER', 'BRICK', 'ORE'] as const

export type ICardType = typeof CardType[number]

export interface ICard {
  id: string
  type: ICardType
}

export interface IPlayer {
  id: string
  nickname: string
  cards: ICard[]
  developmentCards: IDevelopmentCard[]
  selectedCardIds: string[]
}

export interface IDevelopmentCard {
  id: string
  type: IDevelopmentCardType
  isUsed: boolean
}

export type IDevelopmentCardType =
  | 'VICTORY'
  | 'KNIGHT'
  | 'YEAR_OF_PLENTY'
  | 'ROAD_BUILDING'
  | 'MONOPOLY'
