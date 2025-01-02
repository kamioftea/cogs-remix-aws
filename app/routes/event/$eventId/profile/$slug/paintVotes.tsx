import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VoteInput } from "~/tournament/vote-input";
import type {
  Attendee,
  AttendeeDisplayData,
} from "~/tournament/attendee-model.server";

interface PaintsVotesProps {
  attendee: Attendee;
  attendeesBySlug: Record<string, AttendeeDisplayData>;
}

export const PaintVotes = ({ attendee, attendeesBySlug }: PaintsVotesProps) => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const { paintBallot } = attendee;

  const handleVoteChange = useCallback(
    (votes: Attendee["paintBallot"]) => {
      const formData = new FormData();
      formData.set("type", "paint");
      Object.entries(votes ?? {}).forEach(([slug, voteCount]) =>
        formData.set(`vote[${slug}]`, voteCount.toString()),
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
    [attendee],
  );

  useEffect(() => {
    setVotes(paintBallot ?? {});
  }, [paintBallot]);

  const options = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(attendeesBySlug)
          .filter(([slug]) => slug !== attendee.slug)
          .map(([slug, { name }]) => [slug, name]),
      ),
    [attendee.slug, attendeesBySlug],
  );

  return (
    <VoteInput
      title={"Best Army"}
      options={options}
      votes={votes}
      setVotes={handleVoteChange}
    />
  );
};
