import { IPlayer } from 'src/types'

export const Player = ({ player }: { player: IPlayer }) => (
  <div>
    <div>{player.name}</div>
    <div className="flex gap-4">
      {player.cards.map((card) => (
        <div
          key={card.id}
          className="w-24 h-36 bg-white shadow-md p-3 rounded-lg"
        >
          {card.type}
        </div>
      ))}
    </div>
  </div>
)
