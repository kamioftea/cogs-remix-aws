import type {AugmentedGame, AugmentedGameV2} from "~/campaign/moonstone";
import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

interface GameRowProps {
  label: ReactNode;
  row: (AugmentedGame | AugmentedGameV2)[];
}

interface PlayerCellProps {
  game: AugmentedGame | AugmentedGameV2;
}

function PlayerCell({ game }: PlayerCellProps) {
  return (
    <div className="player-cell">
      <div className="faction-img">
        {game.player.faction ? (
          <img
            className="faction-image-small"
            src={`/_static/images/${game.player.faction}.png`}
            alt={`${game.player.faction} logo`}
          />
        ) : null}
      </div>
      <Link className="name" to={`../../players/${game.playerSlug}`}>
        {game.player.name}
      </Link>
      <div className="moonstones">
        {game.moonstones + (game.extraVictoryPoints ?? 0)}
        {game.machinationPoints ? (
          <div className={"machination-points"}>
            MPs: {game.machinationPoints}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function GameRow({ label, row }: GameRowProps) {
  return (
    <div className="game-row">
      <div className="table-number">{label}</div>
      <PlayerCell game={row[0]} />
      <div className="vs">vs</div>
      <PlayerCell game={row[1]} />
    </div>
  );
}
