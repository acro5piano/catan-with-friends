export type ICardType = 'WOOL' | 'GRAIN' | 'LUMBER' | 'BRICK' | 'ORE'

export interface ICard {
  id: string
  type: ICardType
}

export interface IPlayer {
  id: string
  nickname: string
  cards: ICard[]
  developmentCards: IDevelopmentCard[]
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
