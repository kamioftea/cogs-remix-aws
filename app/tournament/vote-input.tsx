import { Fragment, useCallback, useMemo } from "react";
import { FiTrash } from "react-icons/fi";
import { sortBy } from "~/utils";

export interface VoteInputProps {
  title: string;
  options: Record<string, string>;
  fixedOptions?: boolean;
  votes: Record<string, number>;
  setVotes: (votes: Record<string, number>) => void;
  name?: string;
}

export const VoteInput = ({
  title,
  options,
  votes,
  fixedOptions = false,
  setVotes,
  name,
}: VoteInputProps) => {
  const updateVote = useCallback(
    (slug: string, delta: number) => {
      setVotes({ ...votes, [slug]: (votes[slug] ?? 0) + delta });
    },
    [setVotes, votes]
  );

  const deleteVote = useCallback(
    (slug: string) => {
      setVotes(
        Object.fromEntries(Object.entries(votes).filter(([k]) => k !== slug))
      );
    },
    [ setVotes,votes]
  );

  const addVote = useCallback(
    (slug: string) => {
      setVotes({
        ...votes,
        [slug]: 0,
      });
    },
    [setVotes, votes]
  );

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((acc, num) => acc + num, 0),
    [votes]
  );

  return (
    <>
      <h4>{title}</h4>
      <div className={"vote-container"}>
        {Object.entries(votes).map(([slug, voteCount]) => (
          <Fragment key={slug}>
            <div className="votee">{options[slug]}</div>
            <div className="vote-input">
              <button
                type="button"
                className={`button small${
                  voteCount > 0 ? " primary" : " secondary disabled"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  return voteCount > 0 && updateVote(slug, -1);
                }}
              >
                -
              </button>
              {name && (
                <input
                  type="hidden"
                  name={`${name}[${slug}]`}
                  value={voteCount}
                />
              )}
              <span className="lead">{voteCount}</span>
              <button
                type="button"
                className={`button small${
                  totalVotes < 7 ? " primary" : " secondary disabled"
                }`}
                onClick={() => totalVotes < 7 && updateVote(slug, +1)}
              >
                +
              </button>
              {!fixedOptions && (
                <button
                  type="button"
                  className="button small alert"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteVote(slug);
                  }}
                >
                  <FiTrash />
                </button>
              )}
            </div>
          </Fragment>
        ))}
        {!fixedOptions && (
          <div className="add-attendee">
            <label>
              Add player
              <select
                value={""}
                onChange={(e) => {
                  e.preventDefault();
                  e.currentTarget.value && addVote(e.currentTarget.value);
                }}
              >
                <option value={""}>Select a player to add...</option>
                {Object.entries(options)
                  .sort(sortBy(([, v]) => v))
                  .map(([slug, label]) => (
                    <option key={slug} value={slug}>
                      {label}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </>
  );
};
