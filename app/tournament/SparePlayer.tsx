import { AiOutlineFilePdf } from "react-icons/ai";
import type { Tournament } from "~/tournament/tournament-model.server";

export type SparePlayerProps = {
  tournament: Tournament;
};

export const SparePlayer = ({ tournament }: SparePlayerProps) => (
  <>
    {tournament.sparePlayer && (
      <>
        <p>
          The spare player for this tournament is {tournament.sparePlayer.name}.
        </p>
        {tournament.sparePlayer.listPdfUrl && (
          <p>
            <a
              href={`${tournament.sparePlayer.listPdfUrl.base}${tournament.sparePlayer.listPdfUrl.name}`}
              download={tournament.sparePlayer.listPdfUrl.name}
              className="button primary hollow expanded"
            >
              <AiOutlineFilePdf /> Download the spare player's list PDF.
            </a>
          </p>
        )}
      </>
    )}
  </>
);
