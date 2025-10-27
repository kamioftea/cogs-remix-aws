import { AiOutlineFilePdf } from "react-icons/ai";
import type {
  OrganiserPlayer,
  Tournament,
} from "~/tournament/tournament-model.server";

export type SparePlayerProps = {
  tournament: Tournament;
};

type OrganiserPlayerListProps = {
  player: OrganiserPlayer;
  playerDescription: string;
};

export const SparePlayer = ({ tournament }: SparePlayerProps) => (
  <>
    {tournament.sparePlayer && (
      <>
        <p>
          The spare player for this tournament is {tournament.sparePlayer.name}.
        </p>
        <OrganiserListDownload
          player={tournament.sparePlayer}
          playerDescription={"spare player"}
        />
      </>
    )}
  </>
);

export const LowAttendeesPlayer = ({ tournament }: SparePlayerProps) => (
  <>
    {tournament.lowAttendeesPlayer && (
      <>
        <p>
          If needed to qualify the event for UK master's rankings, the
          tournament organiser will use this list.
        </p>
        <OrganiserListDownload
          player={tournament.lowAttendeesPlayer}
          playerDescription={"tournament organiser"}
        />
      </>
    )}
  </>
);

const OrganiserListDownload = ({
  player,
  playerDescription,
}: OrganiserPlayerListProps) => (
  <>
    {player.listPdfUrl && (
      <p>
        <a
          href={`${player.listPdfUrl.base}${player.listPdfUrl.name}`}
          download={player.listPdfUrl.name}
          className="button primary hollow expanded"
        >
          <AiOutlineFilePdf /> Download the {playerDescription}'s list PDF.
        </a>
      </p>
    )}
  </>
);
