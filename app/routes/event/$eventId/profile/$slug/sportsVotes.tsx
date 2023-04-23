import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VoteInput } from "~/tournament/vote-input";
import {
  Attendee,
  AttendeeDisplayData,
} from "~/tournament/attendee-model.server";
import { PlayerGame } from "~/tournament/player-game-model.server";

interface SportsVotesProps {
  attendee: Attendee;
  games: { player: PlayerGame; opponent: PlayerGame }[];
  attendeesBySlug: Record<string, AttendeeDisplayData>;
}

export const SportsVotes = ({
  attendee,
  games,
  attendeesBySlug,
}: SportsVotesProps) => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const { sportsBallot } = attendee;

  useEffect(() => {
    if (games.length < 3) return;
    setVotes(
      Object.fromEntries(
        games.map((game) => [
          game.opponent.attendeeSlug,
          sportsBallot?.[game.opponent.attendeeSlug] ?? 0,
        ])
      )
    );
  }, [sportsBallot, games]);

  const handleVoteChange = useCallback(
    (votes: Attendee["sportsBallot"]) => {
      const formData = new FormData();
      formData.set("type", "sports");
      Object.entries(votes ?? {}).forEach(([slug, voteCount]) =>
        formData.set(`vote[${slug}]`, voteCount.toString())
      );
      fetch(`/event/${attendee.eventSlug}/profile/${attendee.slug}`, {
        method: "post",
        body: formData,
      }).then((res) => {
        if (res.status === 200) {
          setVotes(votes ?? {});
        }
      });
    },
    [attendee]
  );

  const options = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(attendeesBySlug).map(([slug, { name }]) => [slug, name])
      ),
    [attendeesBySlug]
  );

  if (games.length < 3) {
    return null;
  }

  return (
    <VoteInput
      title={"Best Sports"}
      options={options}
      votes={votes}
      setVotes={handleVoteChange}
      fixedOptions
    />
  );
};
