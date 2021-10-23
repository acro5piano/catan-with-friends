export type ICardType = 'WOOL' | 'GRAIN' | 'LUMBER' | 'BRICK' | 'ORE'

export interface ICard {
  id: string
  type: ICardType
}

export interface IPlayer {
  id: string
  nickname: string
  cards: ICard[]
}
